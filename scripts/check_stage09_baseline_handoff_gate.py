"""Check the Stage 09 realtime baseline handoff gate.

This command ties the public benchmark command evidence, review packet,
review-packet validation, and refresh check into one deterministic handoff
gate. It does not rerun the benchmark, open a websocket, or approve Rust as a
whole-project rewrite.
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
DEFAULT_REVIEW_PACKET_PATH = ARTIFACT_ROOT / "stage09-baseline-review-packet.json"
DEFAULT_REVIEW_PACKET_VALIDATION_PATH = (
    ARTIFACT_ROOT / "stage09-baseline-review-packet-validation.json"
)
DEFAULT_REFRESH_CHECK_PATH = ARTIFACT_ROOT / "stage09-baseline-refresh-check.json"
DEFAULT_COMMAND_EVIDENCE_PATH = ARTIFACT_ROOT / "stage09-baseline-command-evidence.json"


class Stage09BaselineHandoffGateError(Exception):
    """Raised when Stage 09 baseline handoff-gate inputs are inconsistent."""


def check_stage09_baseline_handoff_gate(
    review_packet_path: Path | str = DEFAULT_REVIEW_PACKET_PATH,
    review_packet_validation_path: Path | str = DEFAULT_REVIEW_PACKET_VALIDATION_PATH,
    refresh_check_path: Path | str = DEFAULT_REFRESH_CHECK_PATH,
    command_evidence_path: Path | str = DEFAULT_COMMAND_EVIDENCE_PATH,
) -> dict[str, Any]:
    """Build a deterministic handoff gate from public Stage 09 evidence."""

    review_packet_path = Path(review_packet_path)
    review_packet_validation_path = Path(review_packet_validation_path)
    refresh_check_path = Path(refresh_check_path)
    command_evidence_path = Path(command_evidence_path)

    review_packet = _read_json(review_packet_path)
    review_packet_validation = _read_json(review_packet_validation_path)
    refresh_check = _read_json(refresh_check_path)
    command_evidence = _read_json(command_evidence_path)

    errors: list[str] = []
    _expect_equal(
        review_packet.get("schema"),
        "telemforge.stage09_baseline_review_packet.v1",
        "review_packet.schema",
        errors,
    )
    _expect_equal(
        review_packet_validation.get("schema"),
        "telemforge.stage09_baseline_review_packet_validation.v1",
        "review_packet_validation.schema",
        errors,
    )
    _expect_equal(
        refresh_check.get("schema"),
        "telemforge.stage09_baseline_refresh_check.v1",
        "refresh_check.schema",
        errors,
    )
    _expect_equal(
        command_evidence.get("schema"),
        "telemforge.stage09_baseline_command_evidence.v1",
        "command_evidence.schema",
        errors,
    )

    stage = review_packet.get("stage")
    task_id = review_packet.get("task_id")
    for label, artifact in [
        ("review_packet_validation", review_packet_validation),
        ("command_evidence", command_evidence),
    ]:
        _expect_equal(artifact.get("stage"), stage, f"{label}.stage", errors)
        _expect_equal(artifact.get("task_id"), task_id, f"{label}.task_id", errors)

    _expect_equal(
        review_packet.get("status"),
        "baseline_verified_runtime_blocked",
        "review_packet.status",
        errors,
    )
    _expect_equal(
        review_packet_validation.get("status"),
        "passed",
        "review_packet_validation.status",
        errors,
    )
    _expect_equal(refresh_check.get("status"), "passed", "refresh_check.status", errors)
    _expect_equal(
        command_evidence.get("runtime_claim_status"),
        "not_claimed",
        "command_evidence.runtime_claim_status",
        errors,
    )

    _expect_equal(
        review_packet.get("benchmark_command"),
        command_evidence.get("benchmark_command"),
        "benchmark_command",
        errors,
    )
    _expect_equal(
        review_packet.get("required_outputs"),
        command_evidence.get("required_outputs"),
        "required_outputs",
        errors,
    )
    _expect_equal(
        review_packet.get("resource_envelope"),
        command_evidence.get("resource_envelope"),
        "command resource_envelope",
        errors,
    )
    _expect_equal(
        review_packet.get("resource_envelope"),
        refresh_check.get("resource_envelope"),
        "refresh resource_envelope",
        errors,
    )
    _expect_equal(
        review_packet.get("target_counts"),
        review_packet_validation.get("target_counts"),
        "target_counts",
        errors,
    )
    _expect_equal(
        review_packet.get("runtime_claims"),
        review_packet_validation.get("runtime_claims"),
        "runtime_claims",
        errors,
    )
    _expect_equal(
        review_packet.get("stable_fingerprint", {}).get("digest_sha256"),
        refresh_check.get("stable_digest_sha256"),
        "stable fingerprint digest",
        errors,
    )

    runtime_claims = _require_mapping(
        review_packet.get("runtime_claims"),
        "review_packet.runtime_claims",
        errors,
    )
    _expect_equal(
        runtime_claims.get("stream_runtime_claim_status"),
        "contract_only_blocked",
        "runtime stream claim",
        errors,
    )
    _expect_equal(
        runtime_claims.get("candidate_can_be_promoted"),
        False,
        "candidate_can_be_promoted",
        errors,
    )
    _expect_equal(
        refresh_check.get("runtime_evidence_gate_status"),
        "contract_only_blocked",
        "refresh_check.runtime_evidence_gate_status",
        errors,
    )

    source_artifacts = {
        "baseline_review_packet": _display_path(review_packet_path),
        "baseline_review_packet_validation": _display_path(
            review_packet_validation_path
        ),
        "baseline_refresh_check": _display_path(refresh_check_path),
        "baseline_command_evidence": _display_path(command_evidence_path),
        "baseline_report": review_packet.get("source_artifacts", {}).get(
            "baseline_report"
        ),
        "baseline_summary": review_packet.get("source_artifacts", {}).get(
            "baseline_summary"
        ),
        "rust_data_plane_boundary": review_packet.get("source_artifacts", {}).get(
            "rust_data_plane_boundary"
        ),
    }
    for label, path in source_artifacts.items():
        if not isinstance(path, str):
            errors.append(f"source_artifacts.{label} must be a string path")
            continue
        _validate_public_path(path, errors)

    for label, artifact in [
        ("review_packet", review_packet),
        ("review_packet_validation", review_packet_validation),
        ("command_evidence", command_evidence),
    ]:
        _validate_public_safety(label, artifact, errors)
        if "not a whole-project rewrite" not in str(artifact.get("rust_scope", "")):
            errors.append(f"{label}.rust_scope must reject a whole-project rewrite")
    _validate_public_path(str(refresh_check.get("report_path", "")), errors)
    if "not a whole-project rewrite" not in str(refresh_check.get("rust_scope", "")):
        errors.append("refresh_check.rust_scope must reject a whole-project rewrite")

    if errors:
        raise Stage09BaselineHandoffGateError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_baseline_handoff_gate.v1",
        "status": "baseline_handoff_ready_runtime_blocked",
        "stage": stage,
        "task_id": task_id,
        "handoff_verdict": (
            "public_baseline_is_ready_for_review_but_not_runtime_promotion"
        ),
        "source_artifacts": source_artifacts,
        "benchmark_command": review_packet.get("benchmark_command"),
        "required_outputs": review_packet.get("required_outputs"),
        "target_counts": review_packet.get("target_counts"),
        "passed_metrics": review_packet.get("passed_metrics"),
        "missed_metrics": review_packet.get("missed_metrics"),
        "runtime_claims": runtime_claims,
        "blocking_reasons": review_packet.get("blocking_reasons"),
        "required_next_evidence": review_packet.get("required_next_evidence"),
        "next_comparable_candidate": review_packet.get("next_comparable_candidate"),
        "stable_fingerprint": review_packet.get("stable_fingerprint"),
        "resource_envelope": review_packet.get("resource_envelope"),
        "public_repo_safety": {
            "paths_are_repo_relative": True,
            "includes_docs_automation": False,
            "uses_absolute_local_paths": False,
            "uses_credentials": False,
            "uses_private_runtime_state": False,
        },
        "rust_scope": "Rust data-plane candidate only; not a whole-project rewrite",
        "verified_gates": [
            "review_packet_validation_passed",
            "baseline_refresh_check_passed",
            "benchmark_command_matches_command_evidence",
            "required_outputs_match_command_evidence",
            "resource_envelope_preserved",
            "runtime_stream_claim_blocked",
            "candidate_promotion_blocked",
            "public_paths_are_repo_relative",
            "docs_automation_excluded",
            "rust_scope_data_plane_only",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Check the Stage 09 realtime baseline handoff gate."
    )
    parser.add_argument(
        "--review-packet",
        default=str(DEFAULT_REVIEW_PACKET_PATH.relative_to(ROOT)),
        help="Stage 09 baseline review-packet JSON path.",
    )
    parser.add_argument(
        "--review-packet-validation",
        default=str(DEFAULT_REVIEW_PACKET_VALIDATION_PATH.relative_to(ROOT)),
        help="Stage 09 baseline review-packet validation JSON path.",
    )
    parser.add_argument(
        "--refresh-check",
        default=str(DEFAULT_REFRESH_CHECK_PATH.relative_to(ROOT)),
        help="Stage 09 baseline refresh-check JSON path.",
    )
    parser.add_argument(
        "--command-evidence",
        default=str(DEFAULT_COMMAND_EVIDENCE_PATH.relative_to(ROOT)),
        help="Stage 09 baseline command-evidence JSON path.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="Optional JSON handoff-gate path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = check_stage09_baseline_handoff_gate(
            review_packet_path=args.review_packet,
            review_packet_validation_path=args.review_packet_validation,
            refresh_check_path=args.refresh_check,
            command_evidence_path=args.command_evidence,
        )
    except (OSError, json.JSONDecodeError, Stage09BaselineHandoffGateError) as error:
        print(f"Stage 09 baseline handoff gate failed:\n{error}", file=sys.stderr)
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
        raise Stage09BaselineHandoffGateError(
            f"missing artifact: {_display_path(path)}"
        ) from exc
    except json.JSONDecodeError as exc:
        raise Stage09BaselineHandoffGateError(
            f"invalid JSON: {_display_path(path)}"
        ) from exc
    if not isinstance(payload, dict):
        raise Stage09BaselineHandoffGateError(
            f"artifact must be a JSON object: {_display_path(path)}"
        )
    return payload


def _expect_equal(actual: Any, expected: Any, label: str, errors: list[str]) -> None:
    if actual != expected:
        errors.append(f"{label} mismatch: expected {expected!r}, got {actual!r}")


def _require_mapping(value: Any, label: str, errors: list[str]) -> dict[str, Any]:
    if isinstance(value, dict):
        return value
    errors.append(f"{label} must be a JSON object")
    return {}


def _validate_public_safety(
    label: str,
    artifact: dict[str, Any],
    errors: list[str],
) -> None:
    public_safety = artifact.get("public_repo_safety")
    if not isinstance(public_safety, dict):
        errors.append(f"{label}.public_repo_safety must be a JSON object")
        return
    _expect_equal(
        public_safety.get("paths_are_repo_relative"),
        True,
        f"{label}.public_repo_safety.paths_are_repo_relative",
        errors,
    )
    _expect_equal(
        public_safety.get("includes_docs_automation"),
        False,
        f"{label}.public_repo_safety.includes_docs_automation",
        errors,
    )
    _expect_equal(
        public_safety.get("uses_absolute_local_paths"),
        False,
        f"{label}.public_repo_safety.uses_absolute_local_paths",
        errors,
    )
    _expect_equal(
        public_safety.get("uses_credentials"),
        False,
        f"{label}.public_repo_safety.uses_credentials",
        errors,
    )
    _expect_equal(
        public_safety.get("uses_private_runtime_state"),
        False,
        f"{label}.public_repo_safety.uses_private_runtime_state",
        errors,
    )


def _validate_public_path(path: str, errors: list[str]) -> None:
    if path.startswith("/"):
        errors.append(f"artifact path must be repo-relative: {path}")
    if ".." in Path(path).parts:
        errors.append(f"artifact path must not escape repo root: {path}")
    if path.startswith("docs/automation/") or "/docs/automation/" in path:
        errors.append(f"artifact path must not reference docs/automation: {path}")


def _display_path(path: Path) -> str:
    try:
        return path.resolve().relative_to(ROOT).as_posix()
    except ValueError:
        return path.as_posix()


if __name__ == "__main__":
    raise SystemExit(main())
