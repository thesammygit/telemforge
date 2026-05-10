"""Summarize the Stage 09 baseline command/report matrix.

This command indexes the safe public commands that define the Stage 09 realtime
baseline review surface. It validates the benchmark command scaffold and
existing public output artifacts without rerunning the benchmark, opening a
websocket, or approving Rust as a whole-project rewrite.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
SUMMARY_PATH = ARTIFACT_ROOT / "stage09-baseline-summary.md"
COMMAND_EVIDENCE_PATH = ARTIFACT_ROOT / "stage09-baseline-command-evidence.json"
CANDIDATE_CONTRACT_PATH = ARTIFACT_ROOT / "stage09-candidate-report-contract.json"
REPORT_VALIDATION_PATH = ARTIFACT_ROOT / "stage09-report-validation-summary.json"
LIVE_CONTRACT_VALIDATION_PATH = (
    ARTIFACT_ROOT / "stage09-live-contract-validation-summary.json"
)
BUNDLE_VERIFICATION_PATH = ARTIFACT_ROOT / "stage09-baseline-bundle-verification.json"
RUNTIME_PROOF_GATE_PATH = (
    ARTIFACT_ROOT / "stage09-runtime-stream-proof-artifact-gate.json"
)
ARTIFACT_INDEX_PATH = ARTIFACT_ROOT / "stage09-baseline-artifact-index.json"
OUTPUT_ARTIFACT_NAME = "stage09-baseline-command-matrix.json"

HEADLINE_METRIC_BINDINGS = [
    ("telemetry_sample_rate_hz", "aggregate_sample_rate_hz"),
    ("p95_alert_latency_ms", "p95_alert_latency_ms"),
    ("p95_replay_query_latency_ms", "p95_replay_query_latency_ms"),
    ("dropped_event_count", "dropped_event_count"),
]


class Stage09BaselineCommandMatrixError(Exception):
    """Raised when the Stage 09 command matrix is stale or unsafe."""


def summarize_stage09_baseline_command_matrix() -> dict[str, Any]:
    """Build a deterministic matrix of safe Stage 09 baseline commands."""

    report = _read_json(REPORT_PATH)
    command_evidence = _read_json(COMMAND_EVIDENCE_PATH)
    live_contract_validation = _read_json(LIVE_CONTRACT_VALIDATION_PATH)
    runtime_proof_gate = _read_json(RUNTIME_PROOF_GATE_PATH)

    errors: list[str] = []
    _expect_equal(
        report.get("schema"),
        "telemforge.stage09_realtime_baseline.v1",
        "report.schema",
        errors,
    )
    _expect_equal(
        command_evidence.get("schema"),
        "telemforge.stage09_baseline_command_evidence.v1",
        "command_evidence.schema",
        errors,
    )
    _expect_equal(
        command_evidence.get("runtime_claim_status"),
        "not_claimed",
        "command_evidence.runtime_claim_status",
        errors,
    )
    _expect_equal(
        live_contract_validation.get("runtime_fanout_claim"),
        "not_claimed_until_runtime_test",
        "live_contract_validation.runtime_fanout_claim",
        errors,
    )
    _expect_equal(
        runtime_proof_gate.get("runtime_stream_claim_status"),
        "contract_only_blocked",
        "runtime_proof_gate.runtime_stream_claim_status",
        errors,
    )

    metrics = _require_mapping(report.get("metrics"), "report.metrics", errors)
    target_checks = _require_mapping(
        _require_mapping(report.get("target_results"), "report.target_results", errors).get(
            "checks"
        ),
        "report.target_results.checks",
        errors,
    )
    metric_bindings = []
    for metric, target_result_key in HEADLINE_METRIC_BINDINGS:
        if metric not in metrics:
            errors.append(f"report.metrics missing {metric}")
            continue
        if target_result_key not in target_checks:
            errors.append(f"report.target_results.checks missing {target_result_key}")
            continue
        check = _require_mapping(
            target_checks.get(target_result_key),
            f"report.target_results.checks.{target_result_key}",
            errors,
        )
        metric_bindings.append(
            {
                "metric": metric,
                "target_result_key": target_result_key,
                "observed": metrics.get(metric),
                "target": check.get("target"),
                "unit": check.get("unit"),
                "passed": check.get("passed", check.get("meets_target")),
            }
        )

    benchmark_command = [
        "python3",
        "scripts/benchmark_stage09_realtime.py",
        "--output",
        _display_path(REPORT_PATH),
        "--summary-output",
        _display_path(SUMMARY_PATH),
    ]
    _expect_equal(
        command_evidence.get("benchmark_command"),
        benchmark_command,
        "command_evidence.benchmark_command",
        errors,
    )
    _expect_equal(
        command_evidence.get("required_outputs"),
        [_display_path(REPORT_PATH), _display_path(SUMMARY_PATH)],
        "command_evidence.required_outputs",
        errors,
    )
    resource_envelope = _require_mapping(
        command_evidence.get("resource_envelope"),
        "command_evidence.resource_envelope",
        errors,
    )
    _expect_equal(
        resource_envelope.get("worker_processes"),
        1,
        "command_evidence.resource_envelope.worker_processes",
        errors,
    )
    _expect_equal(
        resource_envelope.get("uses_network"),
        False,
        "command_evidence.resource_envelope.uses_network",
        errors,
    )
    _expect_equal(
        resource_envelope.get("uses_paid_services"),
        False,
        "command_evidence.resource_envelope.uses_paid_services",
        errors,
    )

    command_matrix = _build_command_matrix()
    for item in command_matrix:
        _validate_command_item(item, errors)

    if errors:
        raise Stage09BaselineCommandMatrixError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_baseline_command_matrix.v1",
        "status": "passed",
        "stage": "09-realtime-performance-and-rust-data-plane",
        "task_id": "telemforge-stage09-realtime-baseline-2026-05-03",
        "purpose": (
            "Pin the safe benchmark and validation commands that define the "
            "public Stage 09 realtime baseline scaffold."
        ),
        "benchmark_scaffold": {
            "command": benchmark_command,
            "required_outputs": [_display_path(REPORT_PATH), _display_path(SUMMARY_PATH)],
            "command_evidence_path": _display_path(COMMAND_EVIDENCE_PATH),
            "resource_envelope": resource_envelope,
            "rerun_status": "not_run_by_command_matrix",
        },
        "headline_metric_bindings": metric_bindings,
        "command_count": len(command_matrix),
        "commands": command_matrix,
        "runtime_claims": {
            "benchmark_rerun": "not_run",
            "websocket_runtime_fanout": "not_claimed",
            "runtime_stream_claim_status": "contract_only_blocked",
            "candidate_can_be_promoted": False,
        },
        "public_repo_safety": {
            "paths_are_repo_relative": True,
            "includes_docs_automation": False,
            "uses_absolute_local_paths": False,
            "uses_credentials": False,
            "uses_private_runtime_state": False,
        },
        "rust_scope": "Rust data-plane candidate only; not a whole-project rewrite",
        "verified_gates": [
            "benchmark_command_bound_to_command_evidence",
            "benchmark_required_outputs_exist",
            "headline_metrics_bound_to_target_results",
            "validation_commands_have_public_outputs",
            "commands_are_repo_relative",
            "docs_automation_excluded",
            "resource_envelope_single_worker_no_network",
            "runtime_stream_claim_blocked",
            "candidate_promotion_blocked",
            "rust_scope_data_plane_only",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Summarize the Stage 09 baseline command/report matrix."
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON command-matrix path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = summarize_stage09_baseline_command_matrix()
    except (OSError, json.JSONDecodeError, Stage09BaselineCommandMatrixError) as error:
        print(f"Stage 09 baseline command matrix failed:\n{error}", file=sys.stderr)
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _build_command_matrix() -> list[dict[str, Any]]:
    return [
        {
            "id": "baseline_benchmark_report",
            "command": [
                "python3",
                "scripts/benchmark_stage09_realtime.py",
                "--output",
                _display_path(REPORT_PATH),
                "--summary-output",
                _display_path(SUMMARY_PATH),
            ],
            "output_paths": [_display_path(REPORT_PATH), _display_path(SUMMARY_PATH)],
            "execution_status": "not_run_by_command_matrix",
        },
        {
            "id": "candidate_report_validator",
            "command": [
                "python3",
                "scripts/validate_stage09_realtime_report.py",
                "--report",
                _display_path(REPORT_PATH),
                "--contract",
                _display_path(CANDIDATE_CONTRACT_PATH),
                "--output",
                _display_path(REPORT_VALIDATION_PATH),
            ],
            "output_paths": [_display_path(REPORT_VALIDATION_PATH)],
            "execution_status": "public_artifact_exists",
        },
        {
            "id": "live_contract_validator",
            "command": [
                "python3",
                "scripts/validate_stage09_live_telemetry_contract.py",
                "--output",
                _display_path(LIVE_CONTRACT_VALIDATION_PATH),
            ],
            "output_paths": [_display_path(LIVE_CONTRACT_VALIDATION_PATH)],
            "execution_status": "public_artifact_exists",
        },
        {
            "id": "baseline_bundle_verifier",
            "command": [
                "python3",
                "scripts/verify_stage09_baseline_bundle.py",
                "--output",
                _display_path(BUNDLE_VERIFICATION_PATH),
            ],
            "output_paths": [_display_path(BUNDLE_VERIFICATION_PATH)],
            "execution_status": "public_artifact_exists",
        },
        {
            "id": "runtime_stream_proof_artifact_gate",
            "command": [
                "python3",
                "scripts/check_stage09_runtime_stream_proof_artifacts.py",
                "--output",
                _display_path(RUNTIME_PROOF_GATE_PATH),
            ],
            "output_paths": [_display_path(RUNTIME_PROOF_GATE_PATH)],
            "execution_status": "public_artifact_exists",
        },
        {
            "id": "baseline_artifact_index",
            "command": [
                "python3",
                "scripts/summarize_stage09_baseline_artifact_index.py",
                "--output",
                _display_path(ARTIFACT_INDEX_PATH),
            ],
            "output_paths": [_display_path(ARTIFACT_INDEX_PATH)],
            "execution_status": "public_artifact_exists",
        },
    ]


def _read_json(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise Stage09BaselineCommandMatrixError(
            f"{_display_path(path)} must be a JSON object"
        )
    return data


def _write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _validate_command_item(item: dict[str, Any], errors: list[str]) -> None:
    command = item.get("command")
    if not isinstance(command, list) or not all(isinstance(part, str) for part in command):
        errors.append(f"{item.get('id', '<unknown>')}.command must be a string list")
        return
    if command[:1] != ["python3"]:
        errors.append(f"{item.get('id', '<unknown>')}.command must use python3")
    for part in command:
        if part.startswith("/"):
            errors.append(f"command part must be repo-relative, not absolute: {part}")
        _validate_public_path_text(part, errors)
    output_paths = item.get("output_paths")
    if not isinstance(output_paths, list) or not all(
        isinstance(path, str) for path in output_paths
    ):
        errors.append(f"{item.get('id', '<unknown>')}.output_paths must be a string list")
        return
    for output_path in output_paths:
        _validate_public_path_text(output_path, errors)
        if not (ROOT / output_path).is_file():
            errors.append(f"command output artifact must exist: {output_path}")


def _validate_public_path_text(path: str, errors: list[str]) -> None:
    if path.startswith("/"):
        errors.append(f"path must be repo-relative: {path}")
    if ".." in Path(path).parts:
        errors.append(f"path must not escape repo root: {path}")
    if path.startswith("docs/automation/") or "/docs/automation/" in path:
        errors.append(f"path must not reference docs/automation: {path}")


def _require_mapping(value: Any, label: str, errors: list[str]) -> dict[str, Any]:
    if not isinstance(value, dict):
        errors.append(f"{label} must be a JSON object")
        return {}
    return value


def _expect_equal(actual: Any, expected: Any, label: str, errors: list[str]) -> None:
    if actual != expected:
        errors.append(f"{label} expected {expected!r}, got {actual!r}")


def _display_path(path: Path) -> str:
    try:
        return path.resolve().relative_to(ROOT).as_posix()
    except ValueError:
        return path.as_posix()


if __name__ == "__main__":
    raise SystemExit(main())
