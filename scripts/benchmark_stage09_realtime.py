"""Bounded Stage 09 realtime baseline benchmark.

This command measures the current Python/FastAPI control-plane path with a tiny
deterministic workload. It is a baseline scaffold for deciding when a narrow
Rust data-plane hot path is worth introducing.
"""

from __future__ import annotations

import argparse
import json
import sys
import tempfile
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend.app.main import create_app


BENCHMARK_START_AT = "2026-05-03T16:00:00Z"
BENCHMARK_SCENARIO = "nominal-orbit-daylight"
BENCHMARK_SAMPLES_PER_CHANNEL = 10
BENCHMARK_STEP_SECONDS = 1
BENCHMARK_SEED = 9090
BENCHMARK_TARGETS = {
    "channel_count": 100,
    "per_channel_sample_rate_hz": 10,
    "aggregate_sample_rate_hz": 1000,
    "p95_alert_latency_ms": 50,
    "replay_query_latency_ms": 500,
    "dropped_event_count": 0,
}


def run_stage09_realtime_baseline(
    database_path: Path | str,
    alert_iterations: int = 5,
    replay_iterations: int = 5,
) -> dict[str, Any]:
    """Run a small deterministic benchmark against the current local backend."""

    if alert_iterations <= 0:
        raise ValueError("alert_iterations must be positive")
    if replay_iterations <= 0:
        raise ValueError("replay_iterations must be positive")

    client = TestClient(create_app(database_path=Path(database_path)))
    health = _expect_json(client.get("/health"), 200, "health check")
    session = _expect_json(
        client.post(
            "/sessions",
            json={"spacecraft_id": "tf-sat-01", "name": "Stage 09 realtime baseline"},
        ),
        201,
        "session creation",
    )
    simulation = _expect_json(
        client.post(
            f"/sessions/{session['session_id']}/simulations",
            json={
                "scenario": BENCHMARK_SCENARIO,
                "start_at": BENCHMARK_START_AT,
                "samples": BENCHMARK_SAMPLES_PER_CHANNEL,
                "step_seconds": BENCHMARK_STEP_SECONDS,
                "seed": BENCHMARK_SEED,
            },
        ),
        201,
        "simulation run",
    )

    alert_latency_ms: list[float] = []
    for index in range(alert_iterations):
        fault_type = (
            "thermal_avionics_overheat" if index % 2 == 0 else "comms_downlink_fade"
        )
        requested_at = _offset_timestamp(BENCHMARK_START_AT, 10 + index)
        started = time.perf_counter_ns()
        _expect_json(
            client.post(
                f"/sessions/{session['session_id']}/faults",
                json={
                    "fault_type": fault_type,
                    "requested_at": requested_at,
                    "operator_note": "Stage 09 bounded realtime baseline",
                },
            ),
            201,
            "manual fault alert path",
        )
        alert_latency_ms.append(_elapsed_ms(started))

    telemetry = _expect_json(
        client.get(
            f"/sessions/{session['session_id']}/telemetry",
            params={"limit": 500},
        ),
        200,
        "telemetry count query",
    )
    expected_telemetry_rows = len(telemetry["telemetry"])
    replay_end_at = _offset_timestamp(BENCHMARK_START_AT, 10 + alert_iterations + 1)
    replay_latency_ms: list[float] = []
    replay: dict[str, Any] | None = None
    for _ in range(replay_iterations):
        started = time.perf_counter_ns()
        replay = _expect_json(
            client.get(
                f"/sessions/{session['session_id']}/replay",
                params={
                    "start_at": BENCHMARK_START_AT,
                    "end_at": replay_end_at,
                    "limit": 500,
                },
            ),
            200,
            "bounded replay query",
        )
        replay_latency_ms.append(_elapsed_ms(started))

    if replay is None:
        raise RuntimeError("replay benchmark did not run")

    channel_count = int(simulation["row_count"]) // BENCHMARK_SAMPLES_PER_CHANNEL
    replay_sample_count = int(replay["summary"]["sample_count"])
    per_channel_sample_rate_hz = round(1 / BENCHMARK_STEP_SECONDS, 2)
    aggregate_sample_rate_hz = round(channel_count * per_channel_sample_rate_hz, 2)
    sample_span_seconds = (
        BENCHMARK_SAMPLES_PER_CHANNEL - 1
    ) * BENCHMARK_STEP_SECONDS
    workload = {
        "scenario": BENCHMARK_SCENARIO,
        "channel_count": channel_count,
        "samples_per_channel": BENCHMARK_SAMPLES_PER_CHANNEL,
        "step_seconds": BENCHMARK_STEP_SECONDS,
        "sample_window": {
            "start_at": BENCHMARK_START_AT,
            "last_sample_at": _offset_timestamp(
                BENCHMARK_START_AT,
                sample_span_seconds,
            ),
            "sample_interval_seconds": BENCHMARK_STEP_SECONDS,
            "sample_span_seconds": sample_span_seconds,
        },
        "per_channel_sample_rate_hz": per_channel_sample_rate_hz,
        "aggregate_sample_rate_hz": aggregate_sample_rate_hz,
        "telemetry_rows_written": int(simulation["row_count"]),
        "alert_iterations": alert_iterations,
        "replay_iterations": replay_iterations,
    }
    metrics = {
        "telemetry_sample_rate_hz": aggregate_sample_rate_hz,
        "per_channel_sample_rate_hz": per_channel_sample_rate_hz,
        "p95_alert_latency_ms": _p95_ms(alert_latency_ms),
        "p95_replay_query_latency_ms": _p95_ms(replay_latency_ms),
        "dropped_event_count": max(expected_telemetry_rows - replay_sample_count, 0),
        "replay_sample_count": replay_sample_count,
    }

    return {
        "schema": "telemforge.stage09_realtime_baseline.v1",
        "generated_at": _utc_now(),
        "stage": "09-realtime-performance-and-rust-data-plane",
        "health_stage": health["stage"],
        "execution_profile": _execution_profile(
            channel_count=channel_count,
            per_channel_sample_rate_hz=per_channel_sample_rate_hz,
            aggregate_sample_rate_hz=aggregate_sample_rate_hz,
        ),
        "resource_guard": _resource_guard(),
        "benchmark_contract": _benchmark_contract(),
        "comparison_profile": _comparison_profile(),
        "workload": workload,
        "metrics": metrics,
        "targets": BENCHMARK_TARGETS,
        "target_results": _target_results(workload, metrics),
        "runtime_boundary": {
            "tracked_direction": "Rust data plane direction, not a whole-project rewrite.",
            "python_control_plane": [
                "API orchestration",
                "local review workflows",
                "configuration",
                "fixture generation",
                "product-shaping behavior",
            ],
            "rust_data_plane_candidates": [
                "telemetry ingest and validation",
                "stream fanout, reconnect, and backpressure",
                "replay indexing and bounded replay queries",
                "alert and anomaly hot-path evaluation",
            ],
        },
        "notes": [
            "This benchmark is intentionally small and local-resource safe.",
            "It measures the current Python/FastAPI path to make future Rust migration evidence-driven.",
            "Dropped events are measured as bounded replay rows missing from the local synthetic workload.",
        ],
    }


def write_stage09_report(summary: dict[str, Any], output_path: Path | str) -> Path:
    path = Path(output_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(summary, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return path


def write_stage09_markdown_summary(
    summary: dict[str, Any],
    output_path: Path | str,
) -> Path:
    path = Path(output_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(_stage09_markdown_summary(summary), encoding="utf-8")
    return path


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Run the bounded Stage 09 realtime baseline benchmark."
    )
    parser.add_argument(
        "--database",
        default=None,
        help="Optional SQLite database path for the benchmark. Omit for a fresh temp database.",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON report path to write after the benchmark run.",
    )
    parser.add_argument(
        "--summary-output",
        default=None,
        help="Optional Markdown summary path to write after the benchmark run.",
    )
    parser.add_argument("--alert-iterations", type=int, default=5)
    parser.add_argument("--replay-iterations", type=int, default=5)
    args = parser.parse_args()

    if args.database is None:
        with tempfile.TemporaryDirectory(prefix="telemforge-stage09-benchmark-") as tmpdir:
            summary = run_stage09_realtime_baseline(
                database_path=Path(tmpdir) / "stage09-baseline.sqlite",
                alert_iterations=args.alert_iterations,
                replay_iterations=args.replay_iterations,
            )
    else:
        summary = run_stage09_realtime_baseline(
            database_path=Path(args.database),
            alert_iterations=args.alert_iterations,
            replay_iterations=args.replay_iterations,
        )

    if args.output is not None:
        write_stage09_report(summary, args.output)

    if args.summary_output is not None:
        write_stage09_markdown_summary(summary, args.summary_output)

    print(json.dumps(summary, indent=2, sort_keys=True))


def _expect_json(response: Any, status_code: int, action: str) -> dict[str, Any]:
    if response.status_code != status_code:
        raise RuntimeError(
            f"Stage 09 realtime benchmark {action} failed: "
            f"expected HTTP {status_code}, got HTTP {response.status_code}: {response.text}"
        )
    body = response.json()
    if not isinstance(body, dict):
        raise RuntimeError(
            f"Stage 09 realtime benchmark {action} returned a non-object response"
        )
    return body


def _elapsed_ms(started_ns: int) -> float:
    return round((time.perf_counter_ns() - started_ns) / 1_000_000, 3)


def _p95_ms(values: list[float]) -> float:
    ordered = sorted(values)
    index = max(0, int(len(ordered) * 0.95 + 0.999999) - 1)
    return round(ordered[index], 3)


def _target_results(
    workload: dict[str, Any],
    metrics: dict[str, Any],
) -> dict[str, Any]:
    checks = {
        "channel_count": _target_check(
            observed=workload["channel_count"],
            target=BENCHMARK_TARGETS["channel_count"],
            comparison="at_least",
            unit="channels",
        ),
        "per_channel_sample_rate_hz": _target_check(
            observed=workload["per_channel_sample_rate_hz"],
            target=BENCHMARK_TARGETS["per_channel_sample_rate_hz"],
            comparison="at_least",
            unit="Hz",
        ),
        "aggregate_sample_rate_hz": _target_check(
            observed=workload["aggregate_sample_rate_hz"],
            target=BENCHMARK_TARGETS["aggregate_sample_rate_hz"],
            comparison="at_least",
            unit="Hz",
        ),
        "p95_alert_latency_ms": _target_check(
            observed=metrics["p95_alert_latency_ms"],
            target=BENCHMARK_TARGETS["p95_alert_latency_ms"],
            comparison="at_most",
            unit="ms",
        ),
        "p95_replay_query_latency_ms": _target_check(
            observed=metrics["p95_replay_query_latency_ms"],
            target=BENCHMARK_TARGETS["replay_query_latency_ms"],
            comparison="at_most",
            unit="ms",
        ),
        "dropped_event_count": _target_check(
            observed=metrics["dropped_event_count"],
            target=BENCHMARK_TARGETS["dropped_event_count"],
            comparison="at_most",
            unit="events",
        ),
    }
    missed_targets = [name for name, check in checks.items() if not check["meets_target"]]
    return {
        "meets_all_targets": not missed_targets,
        "missed_targets": missed_targets,
        "checks": checks,
    }


def _benchmark_contract() -> dict[str, Any]:
    return {
        "schema": "telemforge.stage09_realtime_benchmark_contract.v1",
        "purpose": (
            "Comparable baseline contract for the current Python/FastAPI "
            "control-plane path and future narrow Rust data-plane hot paths."
        ),
        "workload_generation": {
            "source": (
                "Stage 02 telemetry channel catalog via the FastAPI "
                "simulation endpoint"
            ),
            "scenario": BENCHMARK_SCENARIO,
            "seed": BENCHMARK_SEED,
            "start_at": BENCHMARK_START_AT,
            "samples_per_channel": BENCHMARK_SAMPLES_PER_CHANNEL,
            "step_seconds": BENCHMARK_STEP_SECONDS,
            "database": "fresh local SQLite database unless --database is provided",
        },
        "measurement_method": {
            "sample_rate": "catalog channel count multiplied by 1 / step_seconds",
            "alert_latency": (
                "elapsed wall-clock time around manual fault POST requests, "
                "summarized as nearest-rank p95"
            ),
            "replay_latency": (
                "elapsed wall-clock time around bounded replay GET requests, "
                "summarized as nearest-rank p95"
            ),
            "dropped_events": (
                "expected telemetry query rows minus bounded replay sample count, "
                "floored at zero"
            ),
        },
        "comparability_rules": [
            "Run single-process against the local in-process TestClient.",
            (
                "Use the same scenario, seed, sample count, and step interval "
                "before comparing runtime implementations."
            ),
            (
                "Treat generated_at and latency values as run-specific; "
                "workload, targets, and contract fields are stable."
            ),
            (
                "A Rust data-plane candidate should emit this report shape, "
                "including gap-to-target values, before replacing a Python hot path."
            ),
            (
                "Keep execution_profile fields explicit so future Rust results "
                "are not compared against a different client/process/load shape."
            ),
            (
                "Preserve resource_guard fields so future runs stay comparable "
                "and inside the local automation safety envelope."
            ),
        ],
    }


def _comparison_profile() -> dict[str, Any]:
    return {
        "schema": "telemforge.stage09_realtime_comparison_profile.v1",
        "purpose": (
            "Separate stable report fields from run-specific timing and "
            "provenance before comparing Python/FastAPI and future Rust "
            "data-plane candidates."
        ),
        "stable_fields": [
            "schema",
            "stage",
            "health_stage",
            "execution_profile.process_model",
            "execution_profile.client_count",
            "execution_profile.resource_scope",
            "execution_profile.load_shape",
            "resource_guard.worker_processes",
            "resource_guard.uses_network",
            "resource_guard.uses_paid_services",
            "benchmark_contract",
            "workload.scenario",
            "workload.sample_window",
            "workload.samples_per_channel",
            "workload.step_seconds",
            "targets",
            "runtime_boundary",
        ],
        "run_specific_fields": [
            "generated_at",
            "metrics.p95_alert_latency_ms",
            "metrics.p95_replay_query_latency_ms",
            "target_results.checks.p95_alert_latency_ms.observed",
            "target_results.checks.p95_replay_query_latency_ms.observed",
        ],
        "compatibility_requirements": [
            "Use the same workload scenario, seed, sample count, and step interval.",
            "Keep execution_profile and resource_guard visible in every report.",
            "Report dropped_event_count explicitly for stream/backpressure comparisons.",
            (
                "Preserve the benchmark metric names before replacing any Python "
                "control-plane hot path with a Rust data-plane candidate."
            ),
        ],
    }


def _execution_profile(
    channel_count: int,
    per_channel_sample_rate_hz: float,
    aggregate_sample_rate_hz: float,
) -> dict[str, Any]:
    return {
        "schema": "telemforge.stage09_execution_profile.v1",
        "purpose": "Declare the local benchmark shape before comparing runtimes.",
        "process_model": "single-process in-process FastAPI TestClient",
        "client_count": 1,
        "database": "fresh local SQLite database unless --database is provided",
        "resource_scope": "bounded local smoke, no worker fan-out",
        "load_shape": {
            "scenario": BENCHMARK_SCENARIO,
            "channel_count": channel_count,
            "samples_per_channel": BENCHMARK_SAMPLES_PER_CHANNEL,
            "step_seconds": BENCHMARK_STEP_SECONDS,
            "per_channel_sample_rate_hz": per_channel_sample_rate_hz,
            "aggregate_sample_rate_hz": aggregate_sample_rate_hz,
        },
        "measured_paths": [
            "simulation write through the FastAPI control plane",
            "manual fault alert evaluation",
            "bounded replay query",
        ],
        "deferred_paths": [
            "websocket stream fanout",
            "client reconnect behavior",
            "backpressure under multi-client load",
        ],
    }


def _resource_guard() -> dict[str, Any]:
    return {
        "schema": "telemforge.stage09_resource_guard.v1",
        "policy": "bounded local smoke under the TelemForge automation resource guard",
        "worker_processes": 1,
        "max_expected_runtime_seconds": 30,
        "max_expected_memory_mb": 512,
        "uses_network": False,
        "uses_paid_services": False,
        "writes": [
            "optional local SQLite benchmark database",
            "optional JSON report when --output is provided",
            "optional Markdown summary when --summary-output is provided",
        ],
    }


def _target_check(
    observed: int | float,
    target: int | float,
    comparison: str,
    unit: str,
) -> dict[str, Any]:
    if comparison == "at_least":
        meets_target = observed >= target
        gap_to_target = max(target - observed, 0)
    elif comparison == "at_most":
        meets_target = observed <= target
        gap_to_target = max(observed - target, 0)
    else:
        raise ValueError(f"Unsupported target comparison: {comparison}")
    return {
        "observed": observed,
        "target": target,
        "comparison": comparison,
        "unit": unit,
        "gap_to_target": _round_gap(gap_to_target),
        "meets_target": meets_target,
    }


def _round_gap(value: int | float) -> int | float:
    if isinstance(value, float):
        return round(value, 3)
    return value


def _stage09_markdown_summary(summary: dict[str, Any]) -> str:
    workload = summary["workload"]
    metrics = summary["metrics"]
    target_results = summary["target_results"]
    checks = target_results["checks"]
    missed_targets = target_results["missed_targets"]
    execution_profile = summary["execution_profile"]
    resource_guard = summary["resource_guard"]
    comparison_profile = summary["comparison_profile"]
    deferred_paths = ", ".join(execution_profile["deferred_paths"])
    stable_fields = ", ".join(comparison_profile["stable_fields"])
    run_specific_fields = ", ".join(comparison_profile["run_specific_fields"])
    compatibility_requirements = "; ".join(
        comparison_profile["compatibility_requirements"]
    )

    rows = [
        ("Channel count", checks["channel_count"]),
        ("Per-channel sample rate", checks["per_channel_sample_rate_hz"]),
        ("Aggregate sample rate", checks["aggregate_sample_rate_hz"]),
        ("P95 alert latency", checks["p95_alert_latency_ms"]),
        ("P95 replay query latency", checks["p95_replay_query_latency_ms"]),
        ("Dropped events", checks["dropped_event_count"]),
    ]
    target_table = "\n".join(
        "| "
        + " | ".join(
            [
                label,
                _format_observed(check),
                _format_target(check),
                _format_gap(check),
                "PASS" if check["meets_target"] else "MISS",
            ]
        )
        + " |"
        for label, check in rows
    )
    missed_line = ", ".join(missed_targets) if missed_targets else "none"

    return (
        "# Stage 09 Realtime Baseline Summary\n\n"
        f"Generated at: `{summary['generated_at']}`\n\n"
        "Runtime direction: Rust data plane direction, not a whole-project "
        "rewrite. Python/FastAPI remains the measured control-plane baseline "
        "for this report.\n\n"
        "## Workload\n\n"
        f"- Scenario: `{workload['scenario']}`\n"
        f"- Channels: `{workload['channel_count']}`\n"
        f"- Samples per channel: `{workload['samples_per_channel']}`\n"
        f"- Sample window: `{workload['sample_window']['start_at']}` to "
        f"`{workload['sample_window']['last_sample_at']}`\n"
        f"- Telemetry rows written: `{workload['telemetry_rows_written']}`\n\n"
        "## Execution Profile\n\n"
        f"- Process model: `{execution_profile['process_model']}`\n"
        f"- Client count: `{execution_profile['client_count']}`\n"
        f"- Resource scope: `{execution_profile['resource_scope']}`\n"
        f"- Deferred paths: `{deferred_paths}`\n\n"
        "## Resource Guard\n\n"
        f"- Worker processes: `{resource_guard['worker_processes']}`\n"
        f"- Max expected runtime: `{resource_guard['max_expected_runtime_seconds']} seconds`\n"
        f"- Max expected memory: `{resource_guard['max_expected_memory_mb']} MB`\n"
        f"- Uses network: `{resource_guard['uses_network']}`\n"
        f"- Uses paid services: `{resource_guard['uses_paid_services']}`\n\n"
        "## Comparison Profile\n\n"
        f"- Stable fields: `{stable_fields}`\n"
        f"- Run-specific fields: `{run_specific_fields}`\n"
        f"- Compatibility requirements: `{compatibility_requirements}`\n\n"
        "## Metrics\n\n"
        f"- Aggregate sample rate: `{metrics['telemetry_sample_rate_hz']} Hz`\n"
        f"- Per-channel sample rate: `{metrics['per_channel_sample_rate_hz']} Hz`\n"
        f"- P95 alert latency: `{metrics['p95_alert_latency_ms']} ms`\n"
        f"- P95 replay query latency: `{metrics['p95_replay_query_latency_ms']} ms`\n"
        f"- Dropped events: `{metrics['dropped_event_count']}`\n\n"
        "## Target Results\n\n"
        "| Metric | Observed | Target | Gap | Result |\n"
        "| --- | ---: | ---: | ---: | --- |\n"
        f"{target_table}\n\n"
        f"Missed targets: `{missed_line}`.\n\n"
        "A future Rust data-plane candidate should emit the same JSON report "
        "shape, including gap-to-target values, before replacing a Python hot path.\n"
    )


def _format_observed(check: dict[str, Any]) -> str:
    return f"{check['observed']} {check['unit']}"


def _format_target(check: dict[str, Any]) -> str:
    comparator = ">=" if check["comparison"] == "at_least" else "<="
    return f"{comparator} {check['target']} {check['unit']}"


def _format_gap(check: dict[str, Any]) -> str:
    return f"{check['gap_to_target']} {check['unit']}"


def _offset_timestamp(start_at: str, offset_seconds: int) -> str:
    start = datetime.fromisoformat(start_at.replace("Z", "+00:00"))
    return (
        start + timedelta(seconds=offset_seconds)
    ).astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def _utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


if __name__ == "__main__":
    main()
