"""Run the bounded Stage 09 live-stream sustained-load smoke.

The smoke uses FastAPI TestClient only: no network sockets, paid services, or
worker fanout. It records a public-safe JSON artifact that binds the target-scale
Rust stream candidate report to live Python/FastAPI websocket behavior without
claiming production fanout or a Rust control-plane replacement.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
import tempfile
import time
from contextlib import ExitStack
from pathlib import Path
from typing import Any

from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend.app.main import create_app  # noqa: E402


ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
DEFAULT_CANDIDATE_REPORT_PATH = (
    ARTIFACT_ROOT / "stage09-rust-stream-fanout-sample-rate-report.json"
)
DEFAULT_OUTPUT_PATH = ARTIFACT_ROOT / "stage09-live-stream-sustained-load.json"
TASK_ID = "telemforge-stage09-sustained-load-runtime-evidence-closeout-2026-05-21"
STAGE = "09-realtime-performance-and-rust-data-plane"
CLIENT_COUNT = 4
MESSAGES_PER_CLIENT = 12


class Stage09SustainedLoadSmokeError(Exception):
    """Raised when the bounded sustained-load smoke cannot build evidence."""


def run_stage09_live_stream_sustained_load_smoke(
    candidate_report_path: Path | str = DEFAULT_CANDIDATE_REPORT_PATH,
    output_path: Path | str | None = DEFAULT_OUTPUT_PATH,
) -> dict[str, Any]:
    """Run a four-client bounded websocket smoke and optionally write JSON."""

    candidate_report_path = Path(candidate_report_path)
    candidate_report = _read_json(candidate_report_path)
    candidate_binding = _candidate_report_binding(
        candidate_report_path,
        candidate_report,
    )
    if not candidate_binding["target_scale_metrics_pass"]:
        raise Stage09SustainedLoadSmokeError(
            "candidate report must pass target-scale metrics before sustained-load binding"
        )

    started = time.perf_counter()
    with tempfile.TemporaryDirectory() as tmpdir:
        database_path = Path(tmpdir) / "stage09-live-stream-sustained-load.sqlite"
        client = TestClient(create_app(database_path=database_path))
        session = _create_sustained_load_session(client)
        stream_path = f"/sessions/{session['session_id']}/telemetry/live"

        with ExitStack() as stack:
            websockets = [
                stack.enter_context(client.websocket_connect(stream_path))
                for _ in range(CLIENT_COUNT)
            ]
            per_client_results = [
                _summarize_client_messages(
                    client_index=index,
                    messages=[
                        websocket.receive_json()
                        for _ in range(MESSAGES_PER_CLIENT)
                    ],
                )
                for index, websocket in enumerate(websockets, start=1)
            ]

    observed_runtime_seconds = round(time.perf_counter() - started, 6)
    result = _build_result(
        candidate_binding=candidate_binding,
        per_client_results=per_client_results,
        observed_runtime_seconds=observed_runtime_seconds,
    )

    if output_path is not None:
        _write_json(Path(output_path), result)
    return result


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Run the Stage 09 bounded live-stream sustained-load smoke."
    )
    parser.add_argument(
        "--candidate-report",
        default=str(DEFAULT_CANDIDATE_REPORT_PATH.relative_to(ROOT)),
        help="Target-scale Rust stream fanout candidate report path.",
    )
    parser.add_argument(
        "--output",
        default=str(DEFAULT_OUTPUT_PATH.relative_to(ROOT)),
        help="Public JSON sustained-load evidence path.",
    )
    args = parser.parse_args()

    try:
        result = run_stage09_live_stream_sustained_load_smoke(
            candidate_report_path=args.candidate_report,
            output_path=args.output,
        )
    except (
        OSError,
        json.JSONDecodeError,
        Stage09SustainedLoadSmokeError,
        KeyError,
    ) as error:
        print(f"Stage 09 sustained-load smoke failed:\n{error}", file=sys.stderr)
        return 1

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _create_sustained_load_session(client: TestClient) -> dict[str, Any]:
    session_response = client.post(
        "/sessions",
        json={
            "spacecraft_id": "tf-sat-01",
            "name": "Stage 09 sustained-load websocket smoke",
        },
    )
    if session_response.status_code != 201:
        raise Stage09SustainedLoadSmokeError(
            f"session creation failed with HTTP {session_response.status_code}"
        )
    session = session_response.json()

    for start_at in [
        "2026-05-21T00:00:00Z",
        "2026-05-21T00:10:00Z",
    ]:
        simulation_response = client.post(
            f"/sessions/{session['session_id']}/simulations",
            json={
                "scenario": "nominal-orbit-daylight",
                "start_at": start_at,
                "samples": 24,
                "step_seconds": 1,
                "seed": 9090,
            },
        )
        if simulation_response.status_code != 201:
            raise Stage09SustainedLoadSmokeError(
                "simulation seed failed with HTTP "
                f"{simulation_response.status_code}"
            )

    return session


def _summarize_client_messages(
    *,
    client_index: int,
    messages: list[dict[str, Any]],
) -> dict[str, Any]:
    message_types = [str(message.get("type")) for message in messages]
    observed_sequences = [int(message.get("sequence", -1)) for message in messages]
    backpressure_messages = [
        message for message in messages if message.get("type") == "stream.backpressure"
    ]
    sample_messages = [
        message for message in messages if message.get("type") == "telemetry.sample"
    ]
    dropped_event_count = (
        int(backpressure_messages[0]["payload"]["dropped_event_count"])
        if backpressure_messages
        else 0
    )

    return {
        "client_index": client_index,
        "message_count": len(messages),
        "message_types": message_types,
        "observed_sequences": observed_sequences,
        "ordered_sequences": observed_sequences == sorted(observed_sequences),
        "first_message_type": message_types[0] if message_types else None,
        "backpressure_message_count": len(backpressure_messages),
        "telemetry_sample_message_count": len(sample_messages),
        "stream_scope": messages[0].get("payload", {}).get("stream_scope"),
        "queue_scope": (
            backpressure_messages[0].get("payload", {}).get("queue_scope")
            if backpressure_messages
            else None
        ),
        "backpressure_policy": (
            backpressure_messages[0].get("payload", {}).get("policy")
            if backpressure_messages
            else None
        ),
        "dropped_event_count": dropped_event_count,
    }


def _build_result(
    *,
    candidate_binding: dict[str, Any],
    per_client_results: list[dict[str, Any]],
    observed_runtime_seconds: float,
) -> dict[str, Any]:
    message_count_total = sum(
        int(client_result["message_count"])
        for client_result in per_client_results
    )
    ordered_sequences = all(
        client_result["ordered_sequences"]
        and client_result["observed_sequences"]
        == list(range(1, MESSAGES_PER_CLIENT + 1))
        for client_result in per_client_results
    )
    queue_isolation = all(
        client_result["stream_scope"] == "per_connection"
        and client_result["queue_scope"] == "per_connection"
        and client_result["first_message_type"] == "stream.snapshot"
        for client_result in per_client_results
    )
    dropped_event_counts = [
        int(client_result["dropped_event_count"])
        for client_result in per_client_results
    ]
    dropped_event_reporting = all(count > 0 for count in dropped_event_counts)
    message_type_shape = [
        "stream.snapshot",
        "stream.backpressure",
        *["telemetry.sample" for _ in range(MESSAGES_PER_CLIENT - 2)],
    ]
    expected_shape_seen = all(
        client_result["message_types"] == message_type_shape
        for client_result in per_client_results
    )

    return {
        "schema": "telemforge.stage09_live_stream_sustained_load.v1",
        "status": "passed"
        if ordered_sequences
        and queue_isolation
        and dropped_event_reporting
        and expected_shape_seen
        and observed_runtime_seconds <= 30
        else "failed",
        "stage": STAGE,
        "task_id": TASK_ID,
        "purpose": (
            "Bind the target-scale Rust stream candidate report to bounded live "
            "FastAPI websocket fanout behavior under the local resource guard."
        ),
        "client_count": CLIENT_COUNT,
        "message_count_per_client": MESSAGES_PER_CLIENT,
        "message_count_total": message_count_total,
        "observed_runtime_seconds": observed_runtime_seconds,
        "ordered_sequence_status": "passed" if ordered_sequences else "failed",
        "queue_isolation_status": "passed" if queue_isolation else "failed",
        "dropped_event_reporting_status": (
            "passed" if dropped_event_reporting else "failed"
        ),
        "drop_accounting": {
            "source": "stream.backpressure.payload.dropped_event_count",
            "per_client_dropped_event_counts": dropped_event_counts,
            "consistent_across_clients": len(set(dropped_event_counts)) == 1,
            "candidate_report_dropped_event_count": candidate_binding[
                "dropped_event_count"
            ],
            "boundary": (
                "Live smoke verifies bounded drop reporting; target-scale Rust "
                "candidate metrics remain sourced from the candidate report."
            ),
        },
        "candidate_report_binding": candidate_binding,
        "per_client_results": per_client_results,
        "resource_guard": {
            "worker_processes": 1,
            "websocket_client_count": CLIENT_COUNT,
            "max_expected_runtime_seconds": 30,
            "max_expected_memory_mb": 512,
            "uses_network": False,
            "uses_paid_services": False,
            "database": "temporary SQLite database; path intentionally omitted",
        },
        "public_repo_safety": {
            "paths_are_repo_relative": True,
            "includes_docs_automation": False,
            "uses_absolute_local_paths": False,
            "uses_credentials": False,
            "uses_private_runtime_state": False,
        },
        "rust_scope": "Rust data-plane candidate only; not a whole-project rewrite",
        "proof_boundary": (
            "Bounded four-client TestClient smoke; not a broad load test, "
            "production fanout claim, or Python control-plane replacement."
        ),
        "verified_gates": [
            "four_websocket_clients_opened_in_one_process",
            "per_connection_snapshot_backpressure_and_sample_messages_observed",
            "ordered_sequences_preserved_per_client",
            "dropped_event_count_reported_from_backpressure_payloads",
            "target_scale_candidate_report_digest_bound",
            "public_paths_are_repo_relative",
            "docs_automation_excluded",
            "rust_scope_data_plane_only",
        ],
    }


def _candidate_report_binding(
    candidate_report_path: Path,
    candidate_report: dict[str, Any],
) -> dict[str, Any]:
    target_results = _require_mapping(
        candidate_report.get("target_results"),
        "candidate_report.target_results",
    )
    checks = _require_mapping(
        target_results.get("checks"),
        "candidate_report.target_results.checks",
    )
    required_targets = [
        "aggregate_sample_rate_hz",
        "channel_count",
        "dropped_event_count",
        "p95_alert_latency_ms",
        "p95_replay_query_latency_ms",
        "per_channel_sample_rate_hz",
    ]
    target_scale_metrics_pass = all(
        _require_mapping(checks.get(metric), f"target check {metric}").get(
            "meets_target"
        )
        is True
        for metric in required_targets
    )
    candidate_profile = _require_mapping(
        candidate_report.get("candidate_profile"),
        "candidate_report.candidate_profile",
    )

    return {
        "path": _display_path(candidate_report_path),
        "sha256": hashlib.sha256(candidate_report_path.read_bytes()).hexdigest(),
        "schema": candidate_report.get("schema"),
        "candidate_id": candidate_profile.get("candidate_id"),
        "candidate_scope": candidate_profile.get("candidate_scope"),
        "target_scale_metrics_pass": target_scale_metrics_pass,
        "passed_targets": sorted(
            metric
            for metric in required_targets
            if checks.get(metric, {}).get("meets_target") is True
        ),
        "missed_targets": sorted(
            metric
            for metric in required_targets
            if checks.get(metric, {}).get("meets_target") is not True
        ),
        "dropped_event_count": candidate_report.get("metrics", {}).get(
            "dropped_event_count"
        ),
        "aggregate_sample_rate_hz": candidate_report.get("metrics", {}).get(
            "telemetry_sample_rate_hz"
        ),
        "per_channel_sample_rate_hz": candidate_report.get("metrics", {}).get(
            "per_channel_sample_rate_hz"
        ),
        "channel_count": candidate_report.get("workload", {}).get("channel_count"),
        "candidate_sustained_load_claimed": candidate_profile.get(
            "sustained_load_claimed"
        ),
        "rust_scope": candidate_profile.get("rust_scope"),
    }


def _read_json(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return _require_mapping(data, _display_path(path))


def _write_json(path: Path, value: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(value, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def _require_mapping(value: Any, label: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise Stage09SustainedLoadSmokeError(f"{label} must be a JSON object")
    return value


def _display_path(path: Path) -> str:
    try:
        return path.resolve().relative_to(ROOT).as_posix()
    except ValueError:
        return path.name


if __name__ == "__main__":
    raise SystemExit(main())
