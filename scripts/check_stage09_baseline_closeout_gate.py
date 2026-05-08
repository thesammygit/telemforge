"""Check the Stage 09 realtime baseline closeout gate.

This command reads committed Stage 09 review artifacts and emits a deterministic
JSON closeout summary. It does not rerun the benchmark, open a websocket, or
approve Rust as a whole-project rewrite.
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
DEFAULT_DIGEST_VALIDATION_PATH = ARTIFACT_ROOT / "stage09-baseline-digest-validation.json"
DEFAULT_EVIDENCE_INDEX_PATH = ARTIFACT_ROOT / "stage09-baseline-evidence-index.json"
DEFAULT_RUNTIME_VALIDATION_PATH = (
    ARTIFACT_ROOT / "stage09-runtime-stream-evidence-validation-summary.json"
)
DEFAULT_PROMOTION_READINESS_PATH = (
    ARTIFACT_ROOT / "stage09-candidate-promotion-readiness.json"
)


class BaselineCloseoutGateError(Exception):
    """Raised when Stage 09 closeout-gate inputs are inconsistent."""


def check_stage09_baseline_closeout_gate(
    digest_validation_path: Path | str = DEFAULT_DIGEST_VALIDATION_PATH,
    evidence_index_path: Path | str = DEFAULT_EVIDENCE_INDEX_PATH,
    runtime_validation_path: Path | str = DEFAULT_RUNTIME_VALIDATION_PATH,
    promotion_readiness_path: Path | str = DEFAULT_PROMOTION_READINESS_PATH,
) -> dict[str, Any]:
    """Build a deterministic closeout gate from public Stage 09 evidence."""

    digest_validation_path = Path(digest_validation_path)
    evidence_index_path = Path(evidence_index_path)
    runtime_validation_path = Path(runtime_validation_path)
    promotion_readiness_path = Path(promotion_readiness_path)

    digest_validation = _read_json(digest_validation_path)
    evidence_index = _read_json(evidence_index_path)
    runtime_validation = _read_json(runtime_validation_path)
    promotion_readiness = _read_json(promotion_readiness_path)

    errors: list[str] = []
    _expect_equal(
        digest_validation.get("schema"),
        "telemforge.stage09_baseline_digest_validation.v1",
        "digest_validation.schema",
        errors,
    )
    _expect_equal(
        evidence_index.get("schema"),
        "telemforge.stage09_baseline_evidence_index.v1",
        "evidence_index.schema",
        errors,
    )
    _expect_equal(
        runtime_validation.get("schema"),
        "telemforge.stage09_runtime_stream_evidence_validation.v1",
        "runtime_validation.schema",
        errors,
    )
    _expect_equal(
        promotion_readiness.get("schema"),
        "telemforge.stage09_candidate_promotion_readiness.v1",
        "promotion_readiness.schema",
        errors,
    )

    stage = digest_validation.get("stage")
    task_id = digest_validation.get("task_id")
    for label, artifact in [
        ("evidence_index", evidence_index),
        ("runtime_validation", runtime_validation),
        ("promotion_readiness", promotion_readiness),
    ]:
        _expect_equal(artifact.get("stage"), stage, f"{label}.stage", errors)
        _expect_equal(artifact.get("task_id"), task_id, f"{label}.task_id", errors)

    _expect_equal(digest_validation.get("status"), "passed", "digest status", errors)
    _expect_equal(
        evidence_index.get("status"),
        "baseline_evidence_index_ready",
        "evidence index status",
        errors,
    )
    _expect_equal(runtime_validation.get("status"), "passed", "runtime status", errors)
    _expect_equal(
        promotion_readiness.get("status"),
        "blocked_pending_runtime_evidence",
        "promotion readiness status",
        errors,
    )
    _expect_equal(
        promotion_readiness.get("candidate_can_be_promoted"),
        False,
        "promotion readiness candidate_can_be_promoted",
        errors,
    )

    runtime_claims = _require_mapping(
        digest_validation.get("runtime_claims"),
        "digest_validation.runtime_claims",
    )
    _expect_equal(
        runtime_claims.get("stream_runtime_claim_status"),
        "contract_only_blocked",
        "digest runtime stream claim",
        errors,
    )
    _expect_equal(
        runtime_validation.get("runtime_stream_claim_status"),
        "contract_only_blocked",
        "runtime validation stream claim",
        errors,
    )
    _expect_equal(
        evidence_index.get("runtime_claims", {}).get("candidate_can_be_promoted"),
        False,
        "evidence index candidate_can_be_promoted",
        errors,
    )

    missing_runtime_probe_evidence = _require_list(
        promotion_readiness.get("missing_runtime_probe_evidence"),
        "promotion_readiness.missing_runtime_probe_evidence",
    )
    required_evidence_count = runtime_validation.get("required_evidence_count")
    _expect_equal(
        len(missing_runtime_probe_evidence),
        required_evidence_count,
        "runtime evidence count",
        errors,
    )

    for label, artifact in [
        ("digest_validation", digest_validation),
        ("evidence_index", evidence_index),
        ("runtime_validation", runtime_validation),
        ("promotion_readiness", promotion_readiness),
    ]:
        _validate_public_safety(label, artifact, errors)
        if "not a whole-project rewrite" not in str(artifact.get("rust_scope", "")):
            errors.append(f"{label}.rust_scope must reject a whole-project rewrite")

    if errors:
        raise BaselineCloseoutGateError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_baseline_closeout_gate.v1",
        "status": "blocked_pending_runtime_evidence",
        "stage": stage,
        "task_id": task_id,
        "closeout_verdict": (
            "baseline_artifacts_verified_but_not_promotable_without_runtime_probe_evidence"
        ),
        "source_artifacts": {
            "digest_validation": _display_path(digest_validation_path),
            "baseline_evidence_index": _display_path(evidence_index_path),
            "runtime_stream_evidence_validation": _display_path(
                runtime_validation_path
            ),
            "candidate_promotion_readiness": _display_path(promotion_readiness_path),
        },
        "source_artifact_count": digest_validation.get("source_artifact_count"),
        "aggregate_digest": digest_validation.get("aggregate_digest"),
        "stable_fingerprint": digest_validation.get("stable_fingerprint"),
        "target_counts": evidence_index.get("target_counts"),
        "passed_metrics": evidence_index.get("passed_metrics"),
        "missed_metrics": evidence_index.get("missed_metrics"),
        "runtime_claims": {
            "stream_runtime_claim_status": runtime_validation.get(
                "runtime_stream_claim_status"
            ),
            "candidate_can_be_promoted": promotion_readiness.get(
                "candidate_can_be_promoted"
            ),
        },
        "blocking_reasons": promotion_readiness.get("blocking_reasons"),
        "missing_runtime_probe_evidence_count": len(missing_runtime_probe_evidence),
        "required_next_evidence": promotion_readiness.get("required_next_evidence"),
        "next_comparable_candidate": promotion_readiness.get(
            "next_comparable_candidate"
        ),
        "public_repo_safety": digest_validation.get("public_repo_safety"),
        "resource_envelope": digest_validation.get("resource_envelope"),
        "rust_scope": "Rust data-plane candidate only; not a whole-project rewrite",
        "verified_gates": [
            "digest_validation_passed",
            "baseline_evidence_index_ready",
            "runtime_stream_evidence_validation_passed",
            "candidate_promotion_blocked_until_runtime_evidence",
            "public_paths_are_repo_relative",
            "docs_automation_excluded",
            "rust_scope_data_plane_only",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Check the Stage 09 realtime baseline closeout gate."
    )
    parser.add_argument(
        "--digest-validation",
        default=str(DEFAULT_DIGEST_VALIDATION_PATH.relative_to(ROOT)),
        help="Stage 09 digest-validation JSON path.",
    )
    parser.add_argument(
        "--evidence-index",
        default=str(DEFAULT_EVIDENCE_INDEX_PATH.relative_to(ROOT)),
        help="Stage 09 baseline evidence-index JSON path.",
    )
    parser.add_argument(
        "--runtime-validation",
        default=str(DEFAULT_RUNTIME_VALIDATION_PATH.relative_to(ROOT)),
        help="Stage 09 runtime-stream evidence validation JSON path.",
    )
    parser.add_argument(
        "--promotion-readiness",
        default=str(DEFAULT_PROMOTION_READINESS_PATH.relative_to(ROOT)),
        help="Stage 09 candidate promotion-readiness JSON path.",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON closeout-gate path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = check_stage09_baseline_closeout_gate(
            digest_validation_path=args.digest_validation,
            evidence_index_path=args.evidence_index,
            runtime_validation_path=args.runtime_validation,
            promotion_readiness_path=args.promotion_readiness,
        )
    except (OSError, json.JSONDecodeError, BaselineCloseoutGateError) as error:
        print(f"Stage 09 baseline closeout gate failed:\n{error}", file=sys.stderr)
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _read_json(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise BaselineCloseoutGateError(f"{_display_path(path)} must be a JSON object")
    return data


def _write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _require_mapping(value: Any, label: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise BaselineCloseoutGateError(f"{label} must be a JSON object")
    return value


def _require_list(value: Any, label: str) -> list[Any]:
    if not isinstance(value, list):
        raise BaselineCloseoutGateError(f"{label} must be a JSON array")
    return value


def _validate_public_safety(
    label: str,
    artifact: dict[str, Any],
    errors: list[str],
) -> None:
    public_safety = artifact.get("public_repo_safety")
    if not isinstance(public_safety, dict):
        errors.append(f"{label}.public_repo_safety must be a JSON object")
        return
    for field_name, expected in [
        ("paths_are_repo_relative", True),
        ("includes_docs_automation", False),
        ("uses_absolute_local_paths", False),
        ("uses_credentials", False),
        ("uses_private_runtime_state", False),
    ]:
        _expect_equal(
            public_safety.get(field_name),
            expected,
            f"{label}.public_repo_safety.{field_name}",
            errors,
        )


def _expect_equal(
    actual: Any,
    expected: Any,
    label: str,
    errors: list[str],
) -> None:
    if actual != expected:
        errors.append(f"{label} expected {expected!r}, got {actual!r}")


def _display_path(path: Path) -> str:
    try:
        return path.resolve().relative_to(ROOT).as_posix()
    except ValueError:
        return path.as_posix()


if __name__ == "__main__":
    raise SystemExit(main())
