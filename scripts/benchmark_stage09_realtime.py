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
    aggregate_sample_rate_hz = round(channel_count / BENCHMARK_STEP_SECONDS, 2)
    replay_sample_count = int(replay["summary"]["sample_count"])

    return {
        "schema": "telemforge.stage09_realtime_baseline.v1",
        "generated_at": _utc_now(),
        "stage": "09-realtime-performance-and-rust-data-plane",
        "health_stage": health["stage"],
        "workload": {
            "scenario": BENCHMARK_SCENARIO,
            "channel_count": channel_count,
            "samples_per_channel": BENCHMARK_SAMPLES_PER_CHANNEL,
            "step_seconds": BENCHMARK_STEP_SECONDS,
            "aggregate_sample_rate_hz": aggregate_sample_rate_hz,
            "telemetry_rows_written": int(simulation["row_count"]),
            "alert_iterations": alert_iterations,
            "replay_iterations": replay_iterations,
        },
        "metrics": {
            "telemetry_sample_rate_hz": aggregate_sample_rate_hz,
            "p95_alert_latency_ms": _p95_ms(alert_latency_ms),
            "p95_replay_query_latency_ms": _p95_ms(replay_latency_ms),
            "dropped_event_count": max(expected_telemetry_rows - replay_sample_count, 0),
            "replay_sample_count": replay_sample_count,
        },
        "targets": BENCHMARK_TARGETS,
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


def _offset_timestamp(start_at: str, offset_seconds: int) -> str:
    start = datetime.fromisoformat(start_at.replace("Z", "+00:00"))
    return (
        start + timedelta(seconds=offset_seconds)
    ).astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def _utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


if __name__ == "__main__":
    main()
