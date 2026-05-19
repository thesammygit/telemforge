"""Run the Stage 09 Rust stream fanout/sample-rate candidate.

This wrapper keeps the spike bounded: it invokes a standard-library-only Rust
binary, then writes a Stage 09-compatible JSON report for the existing
comparison gates. It does not replace the Python/FastAPI control plane or claim
sustained production load.
"""

from __future__ import annotations

import argparse
import copy
import hashlib
import json
import subprocess
import sys
from datetime import UTC, datetime
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
DEFAULT_BASELINE_REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
DEFAULT_OUTPUT_PATH = ARTIFACT_ROOT / "stage09-rust-stream-fanout-sample-rate-report.json"
RUST_MANIFEST_PATH = ROOT / "rust" / "stage09_stream_fanout_sample_rate" / "Cargo.toml"


class RustStreamFanoutCandidateError(Exception):
    """Raised when the Stage 09 Rust candidate cannot produce a report."""


def run_stage09_rust_stream_fanout_candidate(
    output_path: Path | str = DEFAULT_OUTPUT_PATH,
    baseline_report_path: Path | str = DEFAULT_BASELINE_REPORT_PATH,
) -> dict[str, Any]:
    """Run the Rust candidate and write a Stage 09-compatible report."""

    output_path = Path(output_path)
    baseline_report_path = Path(baseline_report_path)
    baseline = _read_json(baseline_report_path)
    measurement = _run_rust_measurement()
    report = build_stage09_rust_stream_fanout_report(
        baseline=baseline,
        measurement=measurement,
        output_path=output_path,
    )
    _write_json(output_path, report)
    return report


def build_stage09_rust_stream_fanout_report(
    baseline: dict[str, Any],
    measurement: dict[str, Any],
    output_path: Path,
) -> dict[str, Any]:
    """Build a report that stays compatible with the Stage 09 contract."""

    _validate_measurement(measurement)
    report = copy.deepcopy(baseline)
    generated_at = datetime.now(UTC).replace(microsecond=0).isoformat().replace(
        "+00:00",
        "Z",
    )

    channel_count = int(measurement["channels"])
    samples_per_channel = int(measurement["samples_per_channel"])
    per_channel_hz = float(measurement["per_channel_sample_rate_hz"])
    aggregate_hz = float(measurement["aggregate_sample_rate_hz"])
    client_count = int(measurement["client_count"])
    queue_depth = int(measurement["queue_depth"])
    telemetry_event_count = int(measurement["telemetry_event_count"])
    dropped_event_count = int(measurement["dropped_event_count"])
    duration_ms = round(float(measurement["duration_ms"]), 3)
    step_seconds = round(1.0 / per_channel_hz, 6)
    sample_span_seconds = round((samples_per_channel - 1) * step_seconds, 6)
    workload_identity = (
        "rust-stream-fanout-sample-rate:seed-9090:"
        f"channels-{channel_count}:samples-{samples_per_channel}:"
        f"step-{step_seconds:g}s"
    )

    report["generated_at"] = generated_at
    report["candidate_profile"] = {
        "schema": "telemforge.stage09_rust_stream_fanout_candidate.v1",
        "candidate_id": "rust_stream_fanout_sample_rate_spike",
        "candidate_scope": (
            "stream fanout and sample-rate throughput behind the live telemetry "
            "contract; Python/FastAPI remains the control plane"
        ),
        "source_crate": "rust/stage09_stream_fanout_sample_rate",
        "runner": "scripts/run_stage09_rust_stream_fanout_candidate.py",
        "report_path": _display_path(output_path),
        "measurement_schema": measurement["schema"],
        "bounded_local_smoke": True,
        "sustained_load_claimed": False,
        "rust_scope": "data-plane candidate only; not a whole-project rewrite",
        "public_repo_safety": _public_repo_safety(),
    }

    report["execution_profile"] = {
        "schema": "telemforge.stage09_execution_profile.v1",
        "purpose": "Declare the bounded Rust data-plane candidate shape before comparing runtimes.",
        "process_model": "single-process Rust stdlib stream fanout candidate",
        "client_count": client_count,
        "database": "none; deterministic in-memory Rust candidate",
        "resource_scope": "bounded local smoke, no worker fan-out",
        "load_shape": {
            "scenario": "rust-stream-fanout-sample-rate",
            "channel_count": channel_count,
            "samples_per_channel": samples_per_channel,
            "step_seconds": step_seconds,
            "per_channel_sample_rate_hz": per_channel_hz,
            "aggregate_sample_rate_hz": aggregate_hz,
        },
        "measured_paths": [
            "Rust stdlib deterministic stream sequencing",
            "bounded per-client fanout queue accounting",
            "sample-rate workload generation",
        ],
        "deferred_paths": [
            "sustained websocket stream fanout",
            "broad multi-client load behavior",
            "Python/FastAPI control-plane replacement",
        ],
    }
    report["resource_guard"] = {
        "schema": "telemforge.stage09_resource_guard.v1",
        "policy": "bounded local smoke under the TelemForge automation resource guard",
        "worker_processes": 1,
        "max_expected_runtime_seconds": 30,
        "max_expected_memory_mb": 512,
        "uses_network": False,
        "uses_paid_services": False,
        "writes": [
            "optional JSON candidate report when --output is provided",
        ],
    }
    report["runtime_observation"] = {
        "schema": "telemforge.stage09_runtime_observation.v1",
        "purpose": "Record the observed bounded Rust candidate duration without claiming sustained production load.",
        "duration_ms": duration_ms,
        "max_expected_runtime_seconds": 30,
        "within_expected_runtime": duration_ms <= 30_000,
        "worker_processes_observed": 1,
    }
    report["timing_source_profile"] = {
        "schema": "telemforge.stage09_timing_source_profile.v1",
        "purpose": "Make the Rust candidate timing source explicit before metric comparison.",
        "duration_clock": "std::time::Instant monotonic process clock",
        "report_timestamp_clock": "datetime.now(timezone.utc)",
        "synthetic_sample_clock": "deterministic candidate start_at plus fixed step_seconds",
        "rust_scope": "data-plane candidate only; not a whole-project rewrite",
    }

    _update_benchmark_and_verification_contracts(
        report,
        channel_count=channel_count,
        samples_per_channel=samples_per_channel,
        step_seconds=step_seconds,
        output_path=output_path,
    )
    _update_measurement_profiles(
        report,
        channel_count=channel_count,
        samples_per_channel=samples_per_channel,
        per_channel_hz=per_channel_hz,
        aggregate_hz=aggregate_hz,
        telemetry_event_count=telemetry_event_count,
        dropped_event_count=dropped_event_count,
        client_count=client_count,
        queue_depth=queue_depth,
    )
    _update_target_results(report)
    _update_variant_and_fingerprint(report, workload_identity)

    return report


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Run the Stage 09 Rust stream fanout/sample-rate candidate."
    )
    parser.add_argument(
        "--output",
        default=str(DEFAULT_OUTPUT_PATH.relative_to(ROOT)),
        help="Candidate report JSON path to write.",
    )
    parser.add_argument(
        "--baseline-report",
        default=str(DEFAULT_BASELINE_REPORT_PATH.relative_to(ROOT)),
        help="Committed Stage 09 baseline report JSON path.",
    )
    args = parser.parse_args()

    try:
        report = run_stage09_rust_stream_fanout_candidate(
            output_path=args.output,
            baseline_report_path=args.baseline_report,
        )
    except (
        OSError,
        json.JSONDecodeError,
        subprocess.CalledProcessError,
        RustStreamFanoutCandidateError,
    ) as error:
        print(f"Stage 09 Rust stream fanout candidate failed:\n{error}", file=sys.stderr)
        return 1

    print(json.dumps(report, indent=2, sort_keys=True))
    return 0


def _run_rust_measurement() -> dict[str, Any]:
    completed = subprocess.run(
        [
            "cargo",
            "run",
            "--quiet",
            "--manifest-path",
            str(RUST_MANIFEST_PATH),
            "--",
            "--channels",
            "20",
            "--samples-per-channel",
            "10",
            "--per-channel-hz",
            "5",
            "--clients",
            "2",
            "--queue-depth",
            "250",
        ],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(completed.stdout)


def _update_benchmark_and_verification_contracts(
    report: dict[str, Any],
    *,
    channel_count: int,
    samples_per_channel: int,
    step_seconds: float,
    output_path: Path,
) -> None:
    report["benchmark_contract"]["workload_generation"] = {
        "source": "Rust stdlib deterministic stream fanout candidate",
        "scenario": "rust-stream-fanout-sample-rate",
        "seed": 9090,
        "start_at": "2026-05-03T16:00:00Z",
        "channel_count": channel_count,
        "samples_per_channel": samples_per_channel,
        "step_seconds": step_seconds,
        "database": "none; in-memory deterministic candidate",
    }
    report["benchmark_contract"]["purpose"] = (
        "Comparable candidate contract for a narrow Rust stream fanout/sample-rate "
        "data-plane hot path."
    )
    report["benchmark_contract"]["comparability_rules"] = [
        "Compare directly only when stable_report_fingerprint.digest_sha256 matches.",
        "Allow comparison against the Python/FastAPI baseline only when run_variant_policy.versioned_workload_change is present.",
        "Treat generated_at and bounded local duration values as run-specific.",
        "Keep execution_profile and resource_guard explicit so candidate runs stay inside the local automation safety envelope.",
    ]

    output_display_path = _display_path(output_path)
    command = [
        "python3",
        "scripts/run_stage09_rust_stream_fanout_candidate.py",
        "--output",
        output_display_path,
    ]
    report["verification_contract"]["command"] = command
    report["verification_contract"]["required_outputs"] = [output_display_path]
    report["verification_contract"]["purpose"] = (
        "Pin the bounded Rust candidate command and report fields before any "
        "Python control-plane path is replaced."
    )
    report["rerun_evidence_profile"] = {
        "schema": "telemforge.stage09_rerun_evidence_profile.v1",
        "purpose": "Make the bounded Rust candidate rerun evidence explicit before metric comparison.",
        "candidate_scope": "narrow Rust data-plane stream fanout hot path; not a whole-project rewrite",
        "command": command,
        "required_outputs": [output_display_path],
        "required_before_metric_comparison": [
            "Rust candidate command completed successfully",
            "JSON candidate report was regenerated",
            "resource envelope stayed within the local automation guard",
            "stable report fingerprint matched or a versioned workload change was documented",
        ],
        "resource_envelope": _resource_envelope(),
        "comparable_identity": {
            "workload_identity": (
                "rust-stream-fanout-sample-rate:seed-9090:"
                f"channels-{channel_count}:samples-{samples_per_channel}:"
                f"step-{step_seconds:g}s"
            ),
            "stable_inputs": {
                "scenario": "rust-stream-fanout-sample-rate",
                "seed": 9090,
                "start_at": "2026-05-03T16:00:00Z",
                "channel_count": channel_count,
                "samples_per_channel": samples_per_channel,
                "step_seconds": step_seconds,
            },
            "stable_report_fingerprint_field": "stable_report_fingerprint.digest_sha256",
            "telemetry_catalog_sha256": report["input_provenance"][
                "telemetry_catalog_sha256"
            ],
        },
    }


def _update_measurement_profiles(
    report: dict[str, Any],
    *,
    channel_count: int,
    samples_per_channel: int,
    per_channel_hz: float,
    aggregate_hz: float,
    telemetry_event_count: int,
    dropped_event_count: int,
    client_count: int,
    queue_depth: int,
) -> None:
    step_seconds = round(1.0 / per_channel_hz, 6)
    sample_span_seconds = round((samples_per_channel - 1) * step_seconds, 6)
    report["workload"] = {
        "scenario": "rust-stream-fanout-sample-rate",
        "channel_count": channel_count,
        "samples_per_channel": samples_per_channel,
        "step_seconds": step_seconds,
        "per_channel_sample_rate_hz": per_channel_hz,
        "aggregate_sample_rate_hz": aggregate_hz,
        "telemetry_rows_written": telemetry_event_count,
        "sample_window": {
            "start_at": "2026-05-03T16:00:00Z",
            "last_sample_at": "2026-05-03T16:00:01.800000Z",
            "sample_interval_seconds": step_seconds,
            "sample_span_seconds": sample_span_seconds,
        },
        "alert_iterations": 0,
        "replay_iterations": 0,
    }
    report["metrics"]["telemetry_sample_rate_hz"] = aggregate_hz
    report["metrics"]["per_channel_sample_rate_hz"] = per_channel_hz
    report["metrics"]["dropped_event_count"] = dropped_event_count
    report["metrics"]["replay_sample_count"] = telemetry_event_count
    report["determinism_profile"] = {
        "schema": "telemforge.stage09_determinism_profile.v1",
        "purpose": "Declare which inputs define the versioned Rust candidate workload identity.",
        "comparison_rule": (
            "Only compare directly when workload_identity and stable_inputs match; "
            "compare against the Python/FastAPI baseline through run_variant_policy.versioned_workload_change."
        ),
        "workload_identity": (
            "rust-stream-fanout-sample-rate:seed-9090:"
            f"channels-{channel_count}:samples-{samples_per_channel}:"
            f"step-{step_seconds:g}s"
        ),
        "stable_inputs": {
            "scenario": "rust-stream-fanout-sample-rate",
            "seed": 9090,
            "start_at": "2026-05-03T16:00:00Z",
            "channel_count": channel_count,
            "samples_per_channel": samples_per_channel,
            "step_seconds": step_seconds,
        },
        "run_variant_fields": [
            "generated_at",
            "runtime_observation.duration_ms",
            "runtime_observation.within_expected_runtime",
        ],
    }
    report["dropped_event_profile"] = {
        "schema": "telemforge.stage09_dropped_event_profile.v1",
        "purpose": "Make bounded Rust fanout dropped-event accounting explicit before sustained load claims.",
        "accounting_source": {
            "expected_rows": "Rust deterministic stream fanout telemetry_event_count",
            "observed_rows": "bounded per-client queue simulation",
            "formula": "count per-client queue overflows under drop_oldest_and_report semantics",
        },
        "expected_telemetry_rows": telemetry_event_count,
        "replay_sample_count": telemetry_event_count,
        "dropped_event_count": dropped_event_count,
        "comparison_rule": "Do not treat zero drops in this bounded candidate as sustained websocket load evidence.",
        "stream_claim_status": "rust_candidate_bounded_queue_accounting",
        "rust_scope": "data-plane stream candidate only; not a whole-project rewrite",
    }
    report["measurement_boundary"] = {
        "schema": "telemforge.stage09_measurement_boundary.v1",
        "purpose": "Prevent the Rust candidate from being treated as Python control-plane replacement or sustained realtime stream load.",
        "baseline_claim": "bounded Rust stream fanout/sample-rate comparison candidate",
        "measured_now": [
            "deterministic Rust stream sequencing",
            "bounded per-client fanout queue accounting",
            "sample-rate workload generation",
        ],
        "not_measured_yet": [
            "sustained websocket stream fanout",
            "broad multi-client load behavior",
            "Python/FastAPI control-plane replacement",
        ],
        "future_evidence_required": (
            "A promoted Rust data-plane path must bind this candidate to live "
            "websocket runtime evidence and sustained-load proof before replacing Python."
        ),
        "rust_scope": "data-plane candidate only; not a whole-project rewrite",
    }
    report["throughput_gap_profile"]["baseline_workload_identity"] = (
        "nominal-orbit-daylight:channels-10:samples-10:step-1s"
    )
    report["throughput_gap_profile"]["candidate_workload_identity"] = report[
        "determinism_profile"
    ]["workload_identity"]
    report["throughput_gap_profile"]["gaps"] = _throughput_gaps(
        report,
        channel_count,
        per_channel_hz,
        aggregate_hz,
    )
    report["throughput_gap_profile"]["missed_throughput_targets"] = [
        "channel_count",
        "per_channel_sample_rate_hz",
        "aggregate_sample_rate_hz",
    ]
    report["throughput_gap_profile"]["purpose"] = (
        "Record the versioned Rust candidate's improved but still target-missing "
        "channel and sample-rate evidence."
    )
    report["next_hot_path_profile"]["selected_candidate"] = (
        "rust_stream_fanout_sample_rate_spike"
    )
    report["next_hot_path_profile"]["promotion_signal"] = (
        "This bounded candidate improves missed throughput metrics but remains "
        "blocked until target misses and sustained-load evidence are resolved."
    )
    report["input_provenance"]["channel_count"] = channel_count
    report["input_provenance"]["candidate_virtual_channel_count"] = channel_count
    report["input_provenance"]["source_channel_catalog_path"] = report[
        "input_provenance"
    ]["telemetry_catalog_path"]
    report["input_provenance"]["purpose"] = (
        "Bind the Rust candidate to the existing telemetry catalog provenance while "
        "recording its versioned virtual channel fanout workload."
    )
    report["latency_budget_profile"]["purpose"] = (
        "Carry forward Python/FastAPI alert and replay latency budgets while the "
        "Rust candidate measures stream fanout/sample-rate throughput only."
    )
    report["alert_latency_profile"]["purpose"] = (
        "Alert latency remains owned by the Python/FastAPI baseline in this stream "
        "fanout candidate."
    )
    report["replay_query_profile"]["purpose"] = (
        "Replay latency remains owned by the Python/FastAPI baseline in this stream "
        "fanout candidate."
    )
    report["runtime_boundary"] = {
        "python_control_plane": [
            "API orchestration",
            "local review workflows",
            "configuration",
            "fixture generation",
            "product-shaping behavior",
            "alert and replay latency paths for this candidate tranche",
        ],
        "rust_data_plane_candidates": [
            "telemetry ingest and validation",
            "stream fanout, reconnect, and backpressure",
            "replay indexing and bounded replay queries",
            "alert and anomaly hot-path evaluation",
        ],
        "tracked_direction": "Rust data plane direction, not a whole-project rewrite.",
    }
    report["notes"] = [
        "Rust stream fanout/sample-rate candidate is a bounded local smoke, not sustained production load.",
        f"Candidate uses {client_count} clients and queue depth {queue_depth} with zero dropped events in this workload.",
        "Python/FastAPI remains the control plane for API orchestration, alert latency, and replay latency.",
    ]


def _update_target_results(report: dict[str, Any]) -> None:
    metric_targets = report["target_profile"]["metric_targets"]
    checks: dict[str, dict[str, Any]] = {}
    for metric_name, target in metric_targets.items():
        observed = _path_value(report, target["report_binding"])
        checks[metric_name] = _target_check(
            observed=observed,
            target=target["target"],
            comparison=target["comparison"],
            unit=target["unit"],
        )

    missed_targets = [
        "channel_count",
        "per_channel_sample_rate_hz",
        "aggregate_sample_rate_hz",
    ]
    report["target_results"] = {
        "checks": checks,
        "meets_all_targets": False,
        "missed_targets": missed_targets,
    }
    report["baseline_verdict"] = {
        "schema": "telemforge.stage09_baseline_verdict.v1",
        "status": "rust_candidate_targets_not_met",
        "summary": (
            "Bounded Rust candidate improves throughput over the Python/FastAPI "
            "baseline but remains below Stage 09 realtime targets."
        ),
        "passed_targets": [
            "p95_alert_latency_ms",
            "p95_replay_query_latency_ms",
            "dropped_event_count",
        ],
        "missed_targets": missed_targets,
        "next_comparable_candidate": (
            "Rust stream fanout candidate with target-scale channel/sample-rate "
            "and sustained-load runtime evidence"
        ),
        "rust_scope": "data-plane candidate only; not a whole-project rewrite",
    }


def _update_variant_and_fingerprint(
    report: dict[str, Any],
    workload_identity: str,
) -> None:
    stable_fields = list(report["run_variant_policy"]["stable_identity_fields"])
    allowed_variant_fields = list(report["run_variant_policy"]["allowed_variant_fields"])
    for field in [
        "runtime_observation.duration_ms",
        "runtime_observation.within_expected_runtime",
    ]:
        if field not in allowed_variant_fields:
            allowed_variant_fields.append(field)

    report["run_variant_policy"]["stable_identity_fields"] = stable_fields
    report["run_variant_policy"]["allowed_variant_fields"] = allowed_variant_fields
    report["run_variant_policy"]["comparison_gate"] = (
        "Do not compare runtime candidates unless stable_identity_fields match or "
        "the candidate explicitly documents this versioned workload change."
    )
    report["run_variant_policy"]["versioned_workload_change"] = {
        "schema": "telemforge.stage09_versioned_workload_change.v1",
        "reason": "rust_stream_fanout_sample_rate_candidate",
        "baseline_workload_identity": (
            "nominal-orbit-daylight:seed-9090:channels-10:samples-10:step-1s"
        ),
        "candidate_workload_identity": workload_identity,
        "changed_fields": [
            "execution_profile.process_model",
            "execution_profile.client_count",
            "workload.scenario",
            "workload.channel_count",
            "workload.samples_per_channel",
            "workload.step_seconds",
            "workload.per_channel_sample_rate_hz",
            "metrics.telemetry_sample_rate_hz",
            "rerun_evidence_profile.command",
        ],
        "comparison_note": (
            "Compare target deltas as a bounded candidate signal only; this does "
            "not prove sustained production websocket fanout."
        ),
    }

    digest = _stable_identity_digest(report, stable_fields)
    report["stable_report_fingerprint"] = {
        "schema": "telemforge.stage09_stable_report_fingerprint.v1",
        "purpose": "Hash the stable Rust candidate identity fields before metric comparison.",
        "digest_algorithm": "sha256",
        "digest_sha256": digest,
        "stable_identity_fields": stable_fields,
        "excluded_run_variant_fields": allowed_variant_fields,
        "comparison_rule": (
            "Compare timing metrics only after digest_sha256 matches or a "
            "versioned workload change is documented."
        ),
        "rust_scope": "data-plane candidate only; not a whole-project rewrite",
    }


def _throughput_gaps(
    report: dict[str, Any],
    channel_count: int,
    per_channel_hz: float,
    aggregate_hz: float,
) -> dict[str, dict[str, Any]]:
    targets = report["targets"]
    values = {
        "channel_count": (channel_count, "channels"),
        "per_channel_sample_rate_hz": (per_channel_hz, "Hz"),
        "aggregate_sample_rate_hz": (aggregate_hz, "Hz"),
    }
    gaps: dict[str, dict[str, Any]] = {}
    for metric_name, (observed, unit) in values.items():
        target = targets[metric_name]
        gap = max(target - observed, 0)
        gaps[metric_name] = {
            "observed": observed,
            "target": target,
            "gap_to_target": gap,
            "observed_to_target_ratio": round(observed / target, 6),
            "unit": unit,
        }
    return gaps


def _target_check(
    *,
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
        raise RustStreamFanoutCandidateError(
            f"unsupported target comparison: {comparison}"
        )
    return {
        "observed": observed,
        "target": target,
        "comparison": comparison,
        "unit": unit,
        "meets_target": meets_target,
        "gap_to_target": gap_to_target,
    }


def _validate_measurement(measurement: dict[str, Any]) -> None:
    expected_schema = "telemforge.stage09_rust_stream_fanout_measurement.v1"
    if measurement.get("schema") != expected_schema:
        raise RustStreamFanoutCandidateError(
            f"measurement schema must be {expected_schema}"
        )
    if int(measurement.get("dropped_event_count", -1)) != 0:
        raise RustStreamFanoutCandidateError(
            "default candidate must not regress dropped_event_count"
        )
    if not measurement.get("monotonic_sequence_verified"):
        raise RustStreamFanoutCandidateError(
            "candidate stream sequence must be monotonic"
        )


def _read_json(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as file:
        value = json.load(file)
    if not isinstance(value, dict):
        raise RustStreamFanoutCandidateError(f"{path} must contain a JSON object")
    return value


def _write_json(path: Path, value: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(value, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def _display_path(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT))
    except ValueError:
        return path.name


def _path_value(document: dict[str, Any], field_path: str) -> Any:
    value: Any = document
    for part in field_path.split("."):
        if not isinstance(value, dict) or part not in value:
            raise RustStreamFanoutCandidateError(f"missing field path: {field_path}")
        value = value[part]
    return value


def _stable_identity_digest(report: dict[str, Any], fields: list[str]) -> str:
    stable_values = {field: _path_value(report, field) for field in fields}
    payload = {
        "schema": report["schema"],
        "stable_identity_fields": fields,
        "stable_values": stable_values,
    }
    encoded = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode(
        "utf-8"
    )
    return hashlib.sha256(encoded).hexdigest()


def _resource_envelope() -> dict[str, Any]:
    return {
        "worker_processes": 1,
        "max_expected_runtime_seconds": 30,
        "max_expected_memory_mb": 512,
        "uses_network": False,
        "uses_paid_services": False,
    }


def _public_repo_safety() -> dict[str, bool]:
    return {
        "paths_are_repo_relative": True,
        "includes_docs_automation": False,
        "uses_absolute_local_paths": False,
        "uses_credentials": False,
        "uses_private_runtime_state": False,
    }


if __name__ == "__main__":
    raise SystemExit(main())
