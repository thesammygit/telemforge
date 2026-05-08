"""Summarize the Stage 09 realtime baseline review packet.

This command reads committed Stage 09 baseline artifacts and emits one compact
JSON handoff packet for reviewers. It does not rerun the benchmark, open a
websocket, or approve Rust as a whole-project rewrite.
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
DEFAULT_ACCEPTANCE_MATRIX_PATH = ARTIFACT_ROOT / "stage09-baseline-acceptance-matrix.json"
DEFAULT_CLOSEOUT_GATE_PATH = ARTIFACT_ROOT / "stage09-baseline-closeout-gate.json"
DEFAULT_COMMAND_EVIDENCE_PATH = ARTIFACT_ROOT / "stage09-baseline-command-evidence.json"


class Stage09BaselineReviewPacketError(Exception):
    """Raised when Stage 09 baseline review-packet inputs are inconsistent."""


def summarize_stage09_baseline_review_packet(
    acceptance_matrix_path: Path | str = DEFAULT_ACCEPTANCE_MATRIX_PATH,
    closeout_gate_path: Path | str = DEFAULT_CLOSEOUT_GATE_PATH,
    command_evidence_path: Path | str = DEFAULT_COMMAND_EVIDENCE_PATH,
) -> dict[str, Any]:
    """Build a deterministic Stage 09 baseline review packet."""

    acceptance_matrix_path = Path(acceptance_matrix_path)
    closeout_gate_path = Path(closeout_gate_path)
    command_evidence_path = Path(command_evidence_path)

    acceptance_matrix = _read_json(acceptance_matrix_path)
    closeout_gate = _read_json(closeout_gate_path)
    command_evidence = _read_json(command_evidence_path)

    errors: list[str] = []
    _expect_equal(
        acceptance_matrix.get("schema"),
        "telemforge.stage09_baseline_acceptance_matrix.v1",
        "acceptance_matrix.schema",
        errors,
    )
    _expect_equal(
        closeout_gate.get("schema"),
        "telemforge.stage09_baseline_closeout_gate.v1",
        "closeout_gate.schema",
        errors,
    )
    _expect_equal(
        command_evidence.get("schema"),
        "telemforge.stage09_baseline_command_evidence.v1",
        "command_evidence.schema",
        errors,
    )

    stage = acceptance_matrix.get("stage")
    task_id = acceptance_matrix.get("task_id")
    for label, artifact in [
        ("closeout_gate", closeout_gate),
        ("command_evidence", command_evidence),
    ]:
        _expect_equal(artifact.get("stage"), stage, f"{label}.stage", errors)
        _expect_equal(artifact.get("task_id"), task_id, f"{label}.task_id", errors)

    _expect_equal(
        acceptance_matrix.get("status"),
        "passed_with_runtime_claims_blocked",
        "acceptance_matrix.status",
        errors,
    )
    _expect_equal(
        closeout_gate.get("status"),
        "blocked_pending_runtime_evidence",
        "closeout_gate.status",
        errors,
    )
    _expect_equal(
        command_evidence.get("runtime_claim_status"),
        "not_claimed",
        "command_evidence.runtime_claim_status",
        errors,
    )
    _expect_equal(
        acceptance_matrix.get("target_counts"),
        closeout_gate.get("target_counts"),
        "target_counts",
        errors,
    )
    _expect_equal(
        acceptance_matrix.get("runtime_claims"),
        closeout_gate.get("runtime_claims"),
        "runtime_claims",
        errors,
    )
    _expect_equal(
        acceptance_matrix.get("resource_envelope"),
        command_evidence.get("resource_envelope"),
        "resource envelope",
        errors,
    )
    _expect_equal(
        command_evidence.get("required_outputs"),
        [
            acceptance_matrix.get("source_artifacts", {}).get("baseline_report"),
            acceptance_matrix.get("source_artifacts", {}).get("baseline_summary"),
        ],
        "benchmark required outputs",
        errors,
    )

    source_artifacts = {
        "acceptance_matrix": _display_path(acceptance_matrix_path),
        "baseline_closeout_gate": _display_path(closeout_gate_path),
        "baseline_command_evidence": _display_path(command_evidence_path),
        "baseline_report": acceptance_matrix.get("source_artifacts", {}).get(
            "baseline_report"
        ),
        "baseline_summary": acceptance_matrix.get("source_artifacts", {}).get(
            "baseline_summary"
        ),
        "runtime_stream_evidence_validation": acceptance_matrix.get(
            "source_artifacts", {}
        ).get("runtime_stream_evidence_validation"),
        "rust_data_plane_boundary": acceptance_matrix.get("source_artifacts", {}).get(
            "rust_data_plane_boundary"
        ),
    }
    _validate_public_safety(source_artifacts, errors)

    if "not a whole-project rewrite" not in str(acceptance_matrix.get("rust_scope", "")):
        errors.append("acceptance_matrix.rust_scope must reject a whole-project rewrite")
    if "not a whole-project rewrite" not in str(closeout_gate.get("rust_scope", "")):
        errors.append("closeout_gate.rust_scope must reject a whole-project rewrite")
    if "not a whole-project rewrite" not in str(command_evidence.get("rust_scope", "")):
        errors.append("command_evidence.rust_scope must reject a whole-project rewrite")

    if errors:
        raise Stage09BaselineReviewPacketError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_baseline_review_packet.v1",
        "status": "baseline_verified_runtime_blocked",
        "stage": stage,
        "task_id": task_id,
        "purpose": (
            "Give reviewers a single public-safe handoff packet for the Stage 09 "
            "Python/FastAPI realtime baseline before a future narrow Rust "
            "data-plane candidate is compared."
        ),
        "source_artifacts": source_artifacts,
        "benchmark_command": command_evidence.get("benchmark_command"),
        "required_outputs": command_evidence.get("required_outputs"),
        "target_counts": acceptance_matrix.get("target_counts"),
        "passed_metrics": closeout_gate.get("passed_metrics"),
        "missed_metrics": closeout_gate.get("missed_metrics"),
        "runtime_claims": closeout_gate.get("runtime_claims"),
        "blocking_reasons": closeout_gate.get("blocking_reasons"),
        "required_next_evidence": closeout_gate.get("required_next_evidence"),
        "next_comparable_candidate": closeout_gate.get("next_comparable_candidate"),
        "aggregate_digest": closeout_gate.get("aggregate_digest"),
        "stable_fingerprint": closeout_gate.get("stable_fingerprint"),
        "resource_envelope": command_evidence.get("resource_envelope"),
        "public_repo_safety": {
            "paths_are_repo_relative": True,
            "includes_docs_automation": False,
            "uses_absolute_local_paths": False,
            "uses_credentials": False,
            "uses_private_runtime_state": False,
        },
        "rust_scope": "Rust data-plane candidate only; not a whole-project rewrite",
        "reviewer_checks": [
            "baseline benchmark command and required outputs are pinned",
            "acceptance matrix passed with runtime claims blocked",
            "closeout gate is blocked pending runtime probe evidence",
            "runtime websocket fanout is not claimed",
            "Rust remains scoped to one future data-plane candidate",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Summarize the Stage 09 realtime baseline review packet."
    )
    parser.add_argument(
        "--acceptance-matrix",
        default=str(DEFAULT_ACCEPTANCE_MATRIX_PATH.relative_to(ROOT)),
        help="Stage 09 baseline acceptance-matrix JSON path.",
    )
    parser.add_argument(
        "--closeout-gate",
        default=str(DEFAULT_CLOSEOUT_GATE_PATH.relative_to(ROOT)),
        help="Stage 09 baseline closeout-gate JSON path.",
    )
    parser.add_argument(
        "--command-evidence",
        default=str(DEFAULT_COMMAND_EVIDENCE_PATH.relative_to(ROOT)),
        help="Stage 09 baseline command-evidence JSON path.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="Optional JSON path for the review packet.",
    )
    args = parser.parse_args()

    try:
        result = summarize_stage09_baseline_review_packet(
            acceptance_matrix_path=args.acceptance_matrix,
            closeout_gate_path=args.closeout_gate,
            command_evidence_path=args.command_evidence,
        )
    except (OSError, json.JSONDecodeError, Stage09BaselineReviewPacketError) as error:
        print(f"Stage 09 baseline review packet failed:\n{error}", file=sys.stderr)
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
        raise Stage09BaselineReviewPacketError(
            f"missing artifact: {_display_path(path)}"
        ) from exc
    except json.JSONDecodeError as exc:
        raise Stage09BaselineReviewPacketError(
            f"invalid JSON: {_display_path(path)}"
        ) from exc
    if not isinstance(payload, dict):
        raise Stage09BaselineReviewPacketError(
            f"artifact must be a JSON object: {_display_path(path)}"
        )
    return payload


def _expect_equal(actual: Any, expected: Any, label: str, errors: list[str]) -> None:
    if actual != expected:
        errors.append(f"{label} mismatch: expected {expected!r}, got {actual!r}")


def _validate_public_safety(
    source_artifacts: dict[str, Any],
    errors: list[str],
) -> None:
    for label, raw_path in source_artifacts.items():
        if not isinstance(raw_path, str):
            errors.append(f"{label} must be a path string")
            continue
        if raw_path.startswith("/"):
            errors.append(f"{label} must be repo-relative: {raw_path}")
        if "docs/automation" in raw_path:
            errors.append(f"{label} must not reference ignored docs/automation: {raw_path}")
        lowered = raw_path.lower()
        for forbidden in ["secret", "token", "credential", "cookie", "private"]:
            if forbidden in lowered:
                errors.append(f"{label} path contains forbidden private marker: {raw_path}")


def _display_path(path: Path) -> str:
    try:
        return path.resolve().relative_to(ROOT).as_posix()
    except ValueError:
        return path.as_posix()


if __name__ == "__main__":
    raise SystemExit(main())
