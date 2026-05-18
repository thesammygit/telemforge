"""Build a deterministic Stage 09 baseline evidence index.

This command reads committed Stage 09 benchmark, command-evidence, metric, and
promotion gate artifacts. It does not rerun the benchmark, open a websocket, or
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
DEFAULT_METRIC_INDEX_PATH = ARTIFACT_ROOT / "stage09-baseline-metric-index.json"
DEFAULT_COMMAND_VALIDATION_PATH = (
    ARTIFACT_ROOT / "stage09-baseline-command-evidence-validation.json"
)
DEFAULT_PROMOTION_READINESS_PATH = (
    ARTIFACT_ROOT / "stage09-candidate-promotion-readiness.json"
)
DEFAULT_READINESS_PATH = ARTIFACT_ROOT / "stage09-baseline-readiness-summary.json"


class BaselineEvidenceIndexError(Exception):
    """Raised when Stage 09 evidence-index inputs are inconsistent."""


def summarize_stage09_baseline_evidence_index(
    metric_index_path: Path | str = DEFAULT_METRIC_INDEX_PATH,
    command_validation_path: Path | str = DEFAULT_COMMAND_VALIDATION_PATH,
    promotion_readiness_path: Path | str = DEFAULT_PROMOTION_READINESS_PATH,
    readiness_path: Path | str = DEFAULT_READINESS_PATH,
) -> dict[str, Any]:
    """Build a compact evidence index from public Stage 09 gate artifacts."""

    metric_index_path = Path(metric_index_path)
    command_validation_path = Path(command_validation_path)
    promotion_readiness_path = Path(promotion_readiness_path)
    readiness_path = Path(readiness_path)

    metric_index = _read_json(metric_index_path)
    command_validation = _read_json(command_validation_path)
    promotion_readiness = _read_json(promotion_readiness_path)
    readiness = _read_json(readiness_path)

    errors: list[str] = []
    _expect_equal(
        metric_index.get("schema"),
        "telemforge.stage09_baseline_metric_index.v1",
        "metric_index.schema",
        errors,
    )
    _expect_equal(
        command_validation.get("schema"),
        "telemforge.stage09_baseline_command_evidence_validation.v1",
        "command_validation.schema",
        errors,
    )
    _expect_equal(
        promotion_readiness.get("schema"),
        "telemforge.stage09_candidate_promotion_readiness.v1",
        "promotion_readiness.schema",
        errors,
    )
    _expect_equal(
        readiness.get("schema"),
        "telemforge.stage09_baseline_readiness_summary.v1",
        "readiness.schema",
        errors,
    )

    stage = metric_index.get("stage")
    task_id = metric_index.get("task_id")
    for label, artifact in [
        ("command_validation", command_validation),
        ("promotion_readiness", promotion_readiness),
        ("readiness", readiness),
    ]:
        _expect_equal(artifact.get("stage"), stage, f"{label}.stage", errors)
        _expect_equal(artifact.get("task_id"), task_id, f"{label}.task_id", errors)

    _expect_equal(
        command_validation.get("status"),
        "passed",
        "command_validation.status",
        errors,
    )
    _expect_equal(
        command_validation.get("runtime_claim_status"),
        "not_claimed",
        "command_validation.runtime_claim_status",
        errors,
    )
    _expect_equal(
        metric_index.get("runtime_stream_claim_status"),
        "runtime_verified_bounded_fanout",
        "metric_index.runtime_stream_claim_status",
        errors,
    )
    _expect_equal(
        promotion_readiness.get("runtime_stream_claim_status"),
        "runtime_verified_bounded_fanout",
        "promotion_readiness.runtime_stream_claim_status",
        errors,
    )
    _expect_equal(
        readiness.get("runtime_stream_claim_status"),
        "runtime_verified_bounded_fanout",
        "readiness.runtime_stream_claim_status",
        errors,
    )
    _expect_equal(
        promotion_readiness.get("candidate_can_be_promoted"),
        False,
        "promotion_readiness.candidate_can_be_promoted",
        errors,
    )
    _expect_equal(
        readiness.get("baseline_verdict_status"),
        "baseline_only_targets_not_met",
        "readiness.baseline_verdict_status",
        errors,
    )

    target_counts = _require_mapping(metric_index.get("target_counts"), "target_counts")
    passed_metrics = _require_list(metric_index.get("passed_metrics"), "passed_metrics")
    missed_metrics = _require_list(metric_index.get("missed_metrics"), "missed_metrics")
    _expect_equal(
        target_counts.get("passed"),
        len(passed_metrics),
        "target_counts.passed",
        errors,
    )
    _expect_equal(
        target_counts.get("missed"),
        len(missed_metrics),
        "target_counts.missed",
        errors,
    )
    promotion_missed_targets = _require_list(
        promotion_readiness.get("missed_targets"),
        "promotion_readiness.missed_targets",
    )
    promotion_passed_targets = _require_list(
        promotion_readiness.get("passed_targets"),
        "promotion_readiness.passed_targets",
    )
    _expect_equal(
        sorted(promotion_missed_targets),
        sorted(missed_metrics),
        "promotion_readiness.missed_targets",
        errors,
    )
    _expect_equal(
        sorted(promotion_passed_targets),
        sorted(passed_metrics),
        "promotion_readiness.passed_targets",
        errors,
    )

    resource_envelope = command_validation.get("resource_envelope")
    _expect_equal(
        promotion_readiness.get("resource_envelope"),
        resource_envelope,
        "promotion_readiness.resource_envelope",
        errors,
    )
    _expect_equal(
        readiness.get("resource_envelope"),
        resource_envelope,
        "readiness.resource_envelope",
        errors,
    )

    for label, artifact in [
        ("metric_index", metric_index),
        ("command_validation", command_validation),
        ("promotion_readiness", promotion_readiness),
        ("readiness", readiness),
    ]:
        _validate_public_safety(label, artifact, errors)
        if "not a whole-project rewrite" not in str(artifact.get("rust_scope", "")):
            errors.append(f"{label}.rust_scope must reject a whole-project rewrite")

    blocking_reasons = _require_list(
        promotion_readiness.get("blocking_reasons"),
        "promotion_readiness.blocking_reasons",
    )
    missing_runtime_probe_evidence = _require_list(
        promotion_readiness.get("missing_runtime_probe_evidence"),
        "promotion_readiness.missing_runtime_probe_evidence",
    )
    if "missed_realtime_targets_remain" not in blocking_reasons:
        errors.append("promotion_readiness must block on missed realtime targets")
    if missing_runtime_probe_evidence:
        errors.append("promotion_readiness must not report missing runtime probe evidence")

    if errors:
        raise BaselineEvidenceIndexError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_baseline_evidence_index.v1",
        "status": "baseline_evidence_index_ready",
        "stage": stage,
        "task_id": task_id,
        "source_artifacts": {
            "metric_index": _display_path(metric_index_path),
            "command_evidence_validation": _display_path(command_validation_path),
            "candidate_promotion_readiness": _display_path(promotion_readiness_path),
            "baseline_readiness_summary": _display_path(readiness_path),
        },
        "benchmark_command": command_validation.get("benchmark_command"),
        "required_outputs": command_validation.get("required_outputs"),
        "headline_metric_order": metric_index.get("headline_metric_order"),
        "target_counts": target_counts,
        "passed_metrics": passed_metrics,
        "missed_metrics": missed_metrics,
        "stable_fingerprint": metric_index.get("stable_fingerprint"),
        "baseline_verdict_status": readiness.get("baseline_verdict_status"),
        "runtime_claims": {
            "benchmark_runtime_claim_status": command_validation.get(
                "runtime_claim_status"
            ),
            "stream_runtime_claim_status": metric_index.get(
                "runtime_stream_claim_status"
            ),
            "candidate_can_be_promoted": promotion_readiness.get(
                "candidate_can_be_promoted"
            ),
        },
        "blocking_reasons": blocking_reasons,
        "missing_runtime_probe_evidence_count": len(missing_runtime_probe_evidence),
        "required_next_evidence": promotion_readiness.get("required_next_evidence"),
        "next_comparable_candidate": promotion_readiness.get(
            "next_comparable_candidate"
        ),
        "resource_envelope": resource_envelope,
        "public_repo_safety": command_validation.get("public_repo_safety"),
        "rust_scope": "Rust data-plane candidate only; not a whole-project rewrite",
        "verified_gates": [
            "metric_index_loaded",
            "baseline_command_evidence_validation_passed",
            "promotion_readiness_blocks_target_misses",
            "baseline_readiness_keeps_comparison_scope",
            "target_counts_match_passed_and_missed_metrics",
            "resource_envelope_matches_across_artifacts",
            "public_paths_are_repo_relative",
            "docs_automation_excluded",
            "rust_scope_data_plane_only",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Summarize Stage 09 baseline evidence into one public index."
    )
    parser.add_argument(
        "--metric-index",
        default=str(DEFAULT_METRIC_INDEX_PATH.relative_to(ROOT)),
        help="Stage 09 baseline metric-index JSON path.",
    )
    parser.add_argument(
        "--command-validation",
        default=str(DEFAULT_COMMAND_VALIDATION_PATH.relative_to(ROOT)),
        help="Stage 09 command-evidence validation JSON path.",
    )
    parser.add_argument(
        "--promotion-readiness",
        default=str(DEFAULT_PROMOTION_READINESS_PATH.relative_to(ROOT)),
        help="Stage 09 candidate promotion-readiness JSON path.",
    )
    parser.add_argument(
        "--readiness",
        default=str(DEFAULT_READINESS_PATH.relative_to(ROOT)),
        help="Stage 09 baseline readiness summary JSON path.",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON evidence-index path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = summarize_stage09_baseline_evidence_index(
            metric_index_path=args.metric_index,
            command_validation_path=args.command_validation,
            promotion_readiness_path=args.promotion_readiness,
            readiness_path=args.readiness,
        )
    except (
        OSError,
        json.JSONDecodeError,
        BaselineEvidenceIndexError,
    ) as error:
        print(f"Stage 09 baseline evidence index failed:\n{error}", file=sys.stderr)
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _read_json(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return _require_mapping(data, str(path))


def _write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _validate_public_safety(
    label: str,
    artifact: dict[str, Any],
    errors: list[str],
) -> None:
    public_safety = _require_mapping(
        artifact.get("public_repo_safety"),
        f"{label}.public_repo_safety",
    )
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


def _require_mapping(value: Any, label: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise BaselineEvidenceIndexError(f"{label} must be a JSON object")
    return value


def _require_list(value: Any, label: str) -> list[Any]:
    if not isinstance(value, list):
        raise BaselineEvidenceIndexError(f"{label} must be a JSON array")
    return value


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
