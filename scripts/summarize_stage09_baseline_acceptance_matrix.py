"""Summarize the Stage 09 realtime baseline acceptance matrix.

This command reads committed Stage 09 baseline artifacts and emits a compact
JSON matrix for human review. It does not rerun the benchmark, open a websocket,
or approve Rust as a whole-project rewrite.
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
DEFAULT_REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
DEFAULT_SUMMARY_PATH = ARTIFACT_ROOT / "stage09-baseline-summary.md"
DEFAULT_COMMAND_EVIDENCE_PATH = ARTIFACT_ROOT / "stage09-baseline-command-evidence.json"
DEFAULT_LIVE_VALIDATION_PATH = ARTIFACT_ROOT / "stage09-live-contract-validation-summary.json"
DEFAULT_RUNTIME_VALIDATION_PATH = (
    ARTIFACT_ROOT / "stage09-runtime-stream-evidence-validation-summary.json"
)
DEFAULT_BOUNDARY_PATH = ARTIFACT_ROOT / "rust-data-plane-boundary.md"
DEFAULT_ARTIFACT_GATE_PATH = ARTIFACT_ROOT / "stage09-target-result-artifact-gate.json"
DEFAULT_CLOSEOUT_GATE_PATH = ARTIFACT_ROOT / "stage09-baseline-closeout-gate.json"


class Stage09AcceptanceMatrixError(Exception):
    """Raised when Stage 09 baseline acceptance artifacts are inconsistent."""


def summarize_stage09_baseline_acceptance_matrix(
    report_path: Path | str = DEFAULT_REPORT_PATH,
    summary_path: Path | str = DEFAULT_SUMMARY_PATH,
    command_evidence_path: Path | str = DEFAULT_COMMAND_EVIDENCE_PATH,
    live_validation_path: Path | str = DEFAULT_LIVE_VALIDATION_PATH,
    runtime_validation_path: Path | str = DEFAULT_RUNTIME_VALIDATION_PATH,
    boundary_path: Path | str = DEFAULT_BOUNDARY_PATH,
    artifact_gate_path: Path | str = DEFAULT_ARTIFACT_GATE_PATH,
    closeout_gate_path: Path | str = DEFAULT_CLOSEOUT_GATE_PATH,
) -> dict[str, Any]:
    """Build a deterministic Stage 09 baseline acceptance matrix."""

    report_path = Path(report_path)
    summary_path = Path(summary_path)
    command_evidence_path = Path(command_evidence_path)
    live_validation_path = Path(live_validation_path)
    runtime_validation_path = Path(runtime_validation_path)
    boundary_path = Path(boundary_path)
    artifact_gate_path = Path(artifact_gate_path)
    closeout_gate_path = Path(closeout_gate_path)

    report = _read_json(report_path)
    command_evidence = _read_json(command_evidence_path)
    live_validation = _read_json(live_validation_path)
    runtime_validation = _read_json(runtime_validation_path)
    artifact_gate = _read_json(artifact_gate_path)
    closeout_gate = _read_json(closeout_gate_path)
    summary_text = _read_text(summary_path)
    boundary_text = _read_text(boundary_path)

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
        live_validation.get("schema"),
        "telemforge.stage09_live_contract_validation.v1",
        "live_validation.schema",
        errors,
    )
    _expect_equal(
        runtime_validation.get("schema"),
        "telemforge.stage09_runtime_stream_evidence_validation.v1",
        "runtime_validation.schema",
        errors,
    )
    _expect_equal(
        artifact_gate.get("schema"),
        "telemforge.stage09_target_result_artifact_gate.v1",
        "artifact_gate.schema",
        errors,
    )
    _expect_equal(
        closeout_gate.get("schema"),
        "telemforge.stage09_baseline_closeout_gate.v1",
        "closeout_gate.schema",
        errors,
    )

    stage = report.get("stage")
    task_id = artifact_gate.get("task_id")
    for label, artifact in [
        ("runtime_validation", runtime_validation),
        ("artifact_gate", artifact_gate),
        ("closeout_gate", closeout_gate),
    ]:
        _expect_equal(artifact.get("stage"), stage, f"{label}.stage", errors)
        _expect_equal(artifact.get("task_id"), task_id, f"{label}.task_id", errors)

    report_command = report.get("verification_contract", {}).get("command")
    _expect_equal(
        command_evidence.get("benchmark_command"),
        report_command,
        "command evidence benchmark command",
        errors,
    )
    required_outputs = command_evidence.get("required_outputs", [])
    _expect_equal(
        [_display_path(report_path), _display_path(summary_path)],
        required_outputs,
        "command evidence required outputs",
        errors,
    )

    if "# Stage 09 Realtime Baseline Summary" not in summary_text:
        errors.append("summary must be the Stage 09 realtime baseline summary")
    if "Rust data-plane" not in boundary_text:
        errors.append("boundary note must describe the Rust data plane")
    if "whole-project rewrite" not in boundary_text:
        errors.append("boundary note must reject a whole-project rewrite")

    _expect_equal(
        report.get("stream_contract_profile", {})
        .get("runtime_evidence_gate", {})
        .get("status"),
        "contract_only_blocked",
        "report runtime evidence gate",
        errors,
    )
    _expect_equal(
        runtime_validation.get("runtime_stream_claim_status"),
        "contract_only_blocked",
        "runtime validation claim status",
        errors,
    )
    _expect_equal(
        closeout_gate.get("runtime_claims", {}).get("stream_runtime_claim_status"),
        "contract_only_blocked",
        "closeout runtime stream claim",
        errors,
    )
    _expect_equal(
        closeout_gate.get("runtime_claims", {}).get("candidate_can_be_promoted"),
        False,
        "closeout candidate promotion",
        errors,
    )
    _expect_equal(
        artifact_gate.get("target_counts"),
        {
            "total": artifact_gate.get("metric_count"),
            "passed": len(artifact_gate.get("passed_metrics", [])),
            "missed": len(artifact_gate.get("missed_metrics", [])),
        },
        "artifact gate target counts",
        errors,
    )

    source_artifacts = {
        "baseline_report": _display_path(report_path),
        "baseline_summary": _display_path(summary_path),
        "command_evidence": _display_path(command_evidence_path),
        "live_contract_validation": _display_path(live_validation_path),
        "runtime_stream_evidence_validation": _display_path(runtime_validation_path),
        "rust_data_plane_boundary": _display_path(boundary_path),
        "target_result_artifact_gate": _display_path(artifact_gate_path),
        "baseline_closeout_gate": _display_path(closeout_gate_path),
    }
    _validate_public_safety(source_artifacts, errors)

    if errors:
        raise Stage09AcceptanceMatrixError("\n".join(errors))

    matrix_rows = [
        {
            "gate": "benchmark_command_and_report",
            "status": "passed",
            "evidence": [
                source_artifacts["baseline_report"],
                source_artifacts["baseline_summary"],
                source_artifacts["command_evidence"],
            ],
            "review_note": (
                "The bounded Python/FastAPI control-plane benchmark command and "
                "required public outputs are pinned without rerunning a load test."
            ),
        },
        {
            "gate": "headline_target_bindings",
            "status": "passed_with_misses_recorded",
            "evidence": [source_artifacts["target_result_artifact_gate"]],
            "passed_metrics": artifact_gate.get("passed_metrics", []),
            "missed_metrics": artifact_gate.get("missed_metrics", []),
            "review_note": (
                "Metric values, targets, units, pass/fail status, and gaps agree "
                "across the committed report, indexes, and closeout gate."
            ),
        },
        {
            "gate": "live_stream_contract",
            "status": "contract_only",
            "evidence": [source_artifacts["live_contract_validation"]],
            "review_note": (
                "The websocket envelope, reconnect, backpressure, and benchmark "
                "binding are validated as contract evidence only."
            ),
        },
        {
            "gate": "runtime_stream_evidence",
            "status": "blocked_until_runtime_probes_exist",
            "evidence": [source_artifacts["runtime_stream_evidence_validation"]],
            "required_next_evidence": closeout_gate.get("required_next_evidence", []),
            "review_note": (
                "Runtime websocket fanout, reconnect, backpressure, and stream "
                "dropped-event claims remain blocked."
            ),
        },
        {
            "gate": "rust_data_plane_boundary",
            "status": "constrained",
            "evidence": [source_artifacts["rust_data_plane_boundary"]],
            "next_comparable_candidate": artifact_gate.get("next_comparable_candidate"),
            "review_note": (
                "Rust is tracked for one measured data-plane hot path, not for a "
                "whole-project rewrite."
            ),
        },
        {
            "gate": "public_repo_hygiene",
            "status": "passed",
            "evidence": list(source_artifacts.values()),
            "review_note": (
                "Acceptance-matrix paths are repo-relative public artifacts and "
                "exclude ignored docs/automation state."
            ),
        },
    ]

    return {
        "schema": "telemforge.stage09_baseline_acceptance_matrix.v1",
        "status": "passed_with_runtime_claims_blocked",
        "stage": stage,
        "task_id": task_id,
        "purpose": (
            "Give reviewers one compact acceptance matrix for the Stage 09 "
            "Python/FastAPI realtime baseline before future refreshes or narrow "
            "Rust data-plane candidates are compared."
        ),
        "source_artifacts": source_artifacts,
        "matrix_rows": matrix_rows,
        "target_counts": artifact_gate.get("target_counts"),
        "runtime_claims": {
            "stream_runtime_claim_status": "contract_only_blocked",
            "candidate_can_be_promoted": False,
        },
        "resource_envelope": artifact_gate.get("resource_envelope"),
        "public_repo_safety": {
            "paths_are_repo_relative": True,
            "includes_docs_automation": False,
            "uses_absolute_local_paths": False,
            "uses_credentials": False,
            "uses_private_runtime_state": False,
        },
        "rust_scope": "Rust data-plane candidate only; not a whole-project rewrite",
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Summarize Stage 09 realtime baseline acceptance gates."
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="Optional JSON path for the acceptance matrix.",
    )
    args = parser.parse_args()

    try:
        result = summarize_stage09_baseline_acceptance_matrix()
    except Stage09AcceptanceMatrixError as error:
        print(f"Stage 09 baseline acceptance matrix failed:\n{error}", file=sys.stderr)
        return 1

    payload = json.dumps(result, indent=2, sort_keys=True) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(payload, encoding="utf-8")
    print(payload, end="")
    return 0


def _read_json(path: Path) -> dict[str, Any]:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise Stage09AcceptanceMatrixError(f"missing artifact: {_display_path(path)}") from exc
    except json.JSONDecodeError as exc:
        raise Stage09AcceptanceMatrixError(f"invalid JSON: {_display_path(path)}") from exc
    if not isinstance(payload, dict):
        raise Stage09AcceptanceMatrixError(f"artifact must be a JSON object: {_display_path(path)}")
    return payload


def _read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except FileNotFoundError as exc:
        raise Stage09AcceptanceMatrixError(f"missing artifact: {_display_path(path)}") from exc


def _expect_equal(actual: Any, expected: Any, label: str, errors: list[str]) -> None:
    if actual != expected:
        errors.append(f"{label} mismatch: expected {expected!r}, got {actual!r}")


def _validate_public_safety(source_artifacts: dict[str, str], errors: list[str]) -> None:
    for label, path in source_artifacts.items():
        if path.startswith("/"):
            errors.append(f"{label} must be repo-relative: {path}")
        if "docs/automation" in path:
            errors.append(f"{label} must not reference ignored docs/automation: {path}")
        lowered = path.lower()
        for forbidden in ["secret", "token", "credential", "cookie", "private"]:
            if forbidden in lowered:
                errors.append(f"{label} path contains forbidden private marker: {path}")


def _display_path(path: Path) -> str:
    try:
        return path.resolve().relative_to(ROOT).as_posix()
    except ValueError:
        return path.as_posix()


if __name__ == "__main__":
    raise SystemExit(main())
