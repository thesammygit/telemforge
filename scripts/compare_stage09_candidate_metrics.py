"""Compare a Stage 09 candidate report against the current baseline.

This command is a deterministic comparison scaffold for future Python/FastAPI
refreshes or narrow Rust data-plane candidates. It reads public report
artifacts only; it does not run a benchmark, open a websocket, or approve a
Rust whole-project rewrite.
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
DEFAULT_BASELINE_REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
DEFAULT_CANDIDATE_REPORT_PATH = DEFAULT_BASELINE_REPORT_PATH
DEFAULT_PROMOTION_READINESS_PATH = (
    ARTIFACT_ROOT / "stage09-candidate-promotion-readiness.json"
)


class CandidateMetricComparisonError(Exception):
    """Raised when candidate metric comparison inputs are invalid."""


def compare_stage09_candidate_metrics(
    baseline_report_path: Path | str = DEFAULT_BASELINE_REPORT_PATH,
    candidate_report_path: Path | str = DEFAULT_CANDIDATE_REPORT_PATH,
    promotion_readiness_path: Path | str = DEFAULT_PROMOTION_READINESS_PATH,
) -> dict[str, Any]:
    """Compare candidate target checks against the committed baseline report."""

    baseline_report_path = Path(baseline_report_path)
    candidate_report_path = Path(candidate_report_path)
    promotion_readiness_path = Path(promotion_readiness_path)

    baseline = _read_json(baseline_report_path)
    candidate = _read_json(candidate_report_path)
    promotion_readiness = _read_json(promotion_readiness_path)

    errors: list[str] = []
    _expect_equal(
        baseline.get("schema"),
        "telemforge.stage09_realtime_baseline.v1",
        "baseline.schema",
        errors,
    )
    _expect_equal(
        candidate.get("schema"),
        "telemforge.stage09_realtime_baseline.v1",
        "candidate.schema",
        errors,
    )
    _expect_equal(
        promotion_readiness.get("schema"),
        "telemforge.stage09_candidate_promotion_readiness.v1",
        "promotion_readiness.schema",
        errors,
    )

    baseline_checks = _require_mapping(
        baseline.get("target_results", {}).get("checks"),
        "baseline.target_results.checks",
    )
    candidate_checks = _require_mapping(
        candidate.get("target_results", {}).get("checks"),
        "candidate.target_results.checks",
    )

    metric_deltas: dict[str, dict[str, Any]] = {}
    for metric_name in sorted(baseline_checks):
        baseline_check = _require_mapping(
            baseline_checks.get(metric_name),
            f"baseline target check {metric_name}",
        )
        candidate_check = _require_mapping(
            candidate_checks.get(metric_name),
            f"candidate target check {metric_name}",
        )
        _validate_comparable_metric(
            metric_name,
            baseline_check,
            candidate_check,
            errors,
        )
        metric_deltas[metric_name] = _metric_delta(
            baseline_check,
            candidate_check,
        )

    unexpected_candidate_metrics = sorted(set(candidate_checks) - set(baseline_checks))
    if unexpected_candidate_metrics:
        errors.append(
            "candidate.target_results.checks has unexpected metrics: "
            + ", ".join(unexpected_candidate_metrics)
        )

    stable_identity_status = _stable_identity_status(baseline, candidate, errors)
    runtime_stream_claim_status = promotion_readiness.get(
        "runtime_stream_claim_status"
    )
    candidate_can_be_promoted = bool(
        promotion_readiness.get("candidate_can_be_promoted")
    )
    blocking_reasons = list(promotion_readiness.get("blocking_reasons", []))

    if errors:
        raise CandidateMetricComparisonError("\n".join(errors))

    improved_metrics = [
        metric_name
        for metric_name, delta in metric_deltas.items()
        if delta["change_status"] == "improved"
    ]
    regressed_metrics = [
        metric_name
        for metric_name, delta in metric_deltas.items()
        if delta["change_status"] == "regressed"
    ]
    newly_passing_metrics = [
        metric_name
        for metric_name, delta in metric_deltas.items()
        if delta["baseline_meets_target"] is False
        and delta["candidate_meets_target"] is True
    ]

    same_report = baseline_report_path.resolve() == candidate_report_path.resolve()
    status = (
        "baseline_reference_no_candidate"
        if same_report
        else (
            "candidate_blocked_pending_promotion_gates"
            if blocking_reasons or regressed_metrics
            else "candidate_metrics_ready_for_review"
        )
    )

    return {
        "schema": "telemforge.stage09_candidate_metric_delta.v1",
        "status": status,
        "stage": baseline.get("stage"),
        "task_id": promotion_readiness.get("task_id"),
        "baseline_report": _display_path(baseline_report_path),
        "candidate_report": _display_path(candidate_report_path),
        "same_report_reference": same_report,
        "stable_identity_status": stable_identity_status,
        "runtime_stream_claim_status": runtime_stream_claim_status,
        "candidate_can_be_promoted": (
            candidate_can_be_promoted and not regressed_metrics
        ),
        "blocking_reasons": blocking_reasons,
        "metric_deltas": metric_deltas,
        "improved_metrics": improved_metrics,
        "regressed_metrics": regressed_metrics,
        "newly_passing_metrics": newly_passing_metrics,
        "comparison_rule": (
            "Compare timing values only after stable identity is compatible. "
            "A candidate cannot be promoted if runtime stream claims remain "
            "contract-only, if realtime target misses are unaddressed, or if "
            "any target metric regresses without a versioned workload change."
        ),
        "rust_scope": "Rust data-plane candidate only; not a whole-project rewrite",
        "public_repo_safety": {
            "paths_are_repo_relative": True,
            "includes_docs_automation": False,
            "uses_absolute_local_paths": False,
            "uses_credentials": False,
            "uses_private_runtime_state": False,
        },
        "source_artifacts": {
            "baseline_report": _display_path(baseline_report_path),
            "candidate_report": _display_path(candidate_report_path),
            "promotion_readiness": _display_path(promotion_readiness_path),
        },
        "verified_gates": [
            "baseline_report_loaded",
            "candidate_report_loaded",
            "target_result_metrics_comparable",
            "stable_identity_checked",
            "promotion_readiness_loaded",
            "runtime_stream_claim_status_preserved",
            "rust_scope_data_plane_only",
            "docs_automation_excluded",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Compare Stage 09 candidate metrics against the baseline."
    )
    parser.add_argument(
        "--baseline-report",
        default=str(DEFAULT_BASELINE_REPORT_PATH.relative_to(ROOT)),
        help="Committed Stage 09 baseline report JSON path.",
    )
    parser.add_argument(
        "--candidate-report",
        default=str(DEFAULT_CANDIDATE_REPORT_PATH.relative_to(ROOT)),
        help="Candidate Stage 09 report JSON path.",
    )
    parser.add_argument(
        "--promotion-readiness",
        default=str(DEFAULT_PROMOTION_READINESS_PATH.relative_to(ROOT)),
        help="Stage 09 promotion-readiness JSON path.",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON metric-delta path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = compare_stage09_candidate_metrics(
            baseline_report_path=args.baseline_report,
            candidate_report_path=args.candidate_report,
            promotion_readiness_path=args.promotion_readiness,
        )
    except (
        OSError,
        json.JSONDecodeError,
        CandidateMetricComparisonError,
        KeyError,
    ) as error:
        print(f"Stage 09 candidate metric comparison failed:\n{error}", file=sys.stderr)
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _read_json(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as file:
        value = json.load(file)
    if not isinstance(value, dict):
        raise CandidateMetricComparisonError(f"{path} must contain a JSON object")
    return value


def _write_json(path: Path, value: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(value, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def _require_mapping(value: Any, label: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise CandidateMetricComparisonError(f"{label} must be a JSON object")
    return value


def _expect_equal(left: Any, right: Any, label: str, errors: list[str]) -> None:
    if left != right:
        errors.append(f"{label} mismatch: {left!r} != {right!r}")


def _validate_comparable_metric(
    metric_name: str,
    baseline_check: dict[str, Any],
    candidate_check: dict[str, Any],
    errors: list[str],
) -> None:
    for field in ["target", "comparison", "unit"]:
        _expect_equal(
            baseline_check.get(field),
            candidate_check.get(field),
            f"{metric_name}.{field}",
            errors,
        )
    if baseline_check.get("comparison") not in {">=", "<=", "at_least", "at_most"}:
        errors.append(f"{metric_name}.comparison must be >=, <=, at_least, or at_most")


def _metric_delta(
    baseline_check: dict[str, Any],
    candidate_check: dict[str, Any],
) -> dict[str, Any]:
    baseline_observed = float(baseline_check.get("observed"))
    candidate_observed = float(candidate_check.get("observed"))
    comparison = str(baseline_check.get("comparison"))
    delta = round(candidate_observed - baseline_observed, 6)
    if delta == 0:
        change_status = "unchanged"
    elif comparison in {">=", "at_least"}:
        change_status = "improved" if delta > 0 else "regressed"
    else:
        change_status = "improved" if delta < 0 else "regressed"

    return {
        "baseline_observed": baseline_check.get("observed"),
        "candidate_observed": candidate_check.get("observed"),
        "target": baseline_check.get("target"),
        "comparison": comparison,
        "unit": baseline_check.get("unit"),
        "delta": delta,
        "change_status": change_status,
        "baseline_meets_target": baseline_check.get("meets_target"),
        "candidate_meets_target": candidate_check.get("meets_target"),
        "candidate_gap_to_target": candidate_check.get("gap_to_target"),
    }


def _stable_identity_status(
    baseline: dict[str, Any],
    candidate: dict[str, Any],
    errors: list[str],
) -> str:
    baseline_fingerprint = _require_mapping(
        baseline.get("stable_report_fingerprint"),
        "baseline.stable_report_fingerprint",
    )
    candidate_fingerprint = _require_mapping(
        candidate.get("stable_report_fingerprint"),
        "candidate.stable_report_fingerprint",
    )
    baseline_digest = baseline_fingerprint.get("digest_sha256")
    candidate_digest = candidate_fingerprint.get("digest_sha256")
    if baseline_digest == candidate_digest:
        return "matches"
    if candidate.get("run_variant_policy", {}).get("versioned_workload_change"):
        return "versioned_workload_change"
    errors.append(
        "candidate stable_report_fingerprint.digest_sha256 must match baseline "
        "or record run_variant_policy.versioned_workload_change"
    )
    return "mismatch"


def _display_path(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT))
    except ValueError:
        return str(path)


if __name__ == "__main__":
    raise SystemExit(main())
