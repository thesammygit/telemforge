"""Check Stage 09 candidate promotion readiness.

This command reads committed Stage 09 review artifacts and emits a deterministic
JSON gate for future Python/FastAPI refreshes or narrow Rust data-plane
candidates. It does not rerun the benchmark or approve a Rust whole-project
rewrite.
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
DEFAULT_READINESS_PATH = ARTIFACT_ROOT / "stage09-baseline-readiness-summary.json"
DEFAULT_TARGET_GAP_PATH = ARTIFACT_ROOT / "stage09-target-gap-summary.json"
DEFAULT_RUNTIME_CHECKLIST_PATH = (
    ARTIFACT_ROOT / "stage09-runtime-stream-evidence-checklist.json"
)
DEFAULT_CANDIDATE_REPORT_PATH = (
    ARTIFACT_ROOT / "stage09-rust-stream-fanout-sample-rate-report.json"
)


class PromotionReadinessError(Exception):
    """Raised when Stage 09 promotion-readiness inputs are inconsistent."""


def check_stage09_candidate_promotion_readiness(
    readiness_path: Path | str = DEFAULT_READINESS_PATH,
    target_gap_path: Path | str = DEFAULT_TARGET_GAP_PATH,
    runtime_checklist_path: Path | str = DEFAULT_RUNTIME_CHECKLIST_PATH,
    candidate_report_path: Path | str | None = DEFAULT_CANDIDATE_REPORT_PATH,
) -> dict[str, Any]:
    """Build a deterministic promotion-readiness gate from public artifacts."""

    readiness_path = Path(readiness_path)
    target_gap_path = Path(target_gap_path)
    runtime_checklist_path = Path(runtime_checklist_path)
    readiness = _read_json(readiness_path)
    target_gap = _read_json(target_gap_path)
    runtime_checklist = _read_json(runtime_checklist_path)
    candidate_report = (
        None if candidate_report_path is None else _read_json(Path(candidate_report_path))
    )

    errors: list[str] = []
    _expect_equal(
        readiness.get("schema"),
        "telemforge.stage09_baseline_readiness_summary.v1",
        "readiness.schema",
        errors,
    )
    _expect_equal(
        target_gap.get("schema"),
        "telemforge.stage09_target_gap_summary.v1",
        "target_gap.schema",
        errors,
    )
    _expect_equal(
        runtime_checklist.get("schema"),
        "telemforge.stage09_runtime_stream_evidence_checklist.v1",
        "runtime_checklist.schema",
        errors,
    )
    _expect_equal(
        readiness.get("runtime_stream_claim_status"),
        "runtime_verified_bounded_fanout",
        "runtime stream claim status",
        errors,
    )
    _expect_equal(
        target_gap.get("runtime_stream_claim_status"),
        "runtime_verified_bounded_fanout",
        "target gap runtime stream claim status",
        errors,
    )
    _expect_equal(
        runtime_checklist.get("implementation_status"),
        "runtime_stream_probes_verified_bounded_fanout",
        "runtime checklist implementation status",
        errors,
    )
    _expect_equal(
        readiness.get("next_comparable_candidate"),
        target_gap.get("next_comparable_candidate"),
        "next comparable candidate",
        errors,
    )
    _expect_equal(
        readiness.get("required_next_evidence"),
        target_gap.get("required_next_evidence"),
        "required next evidence",
        errors,
    )

    for label, artifact in [
        ("readiness", readiness),
        ("target_gap", target_gap),
        ("runtime_checklist", runtime_checklist),
    ]:
        public_safety = artifact.get("public_repo_safety", {})
        _expect_equal(
            public_safety.get("includes_docs_automation"),
            False,
            f"{label} public repo docs/automation safety",
            errors,
        )
        _expect_equal(
            public_safety.get("uses_absolute_local_paths"),
            False,
            f"{label} public repo absolute path safety",
            errors,
        )
        _expect_equal(
            public_safety.get("uses_credentials"),
            False,
            f"{label} public repo credential safety",
            errors,
        )

    if "not a whole-project rewrite" not in str(readiness.get("rust_scope", "")):
        errors.append("readiness.rust_scope must reject a whole-project rewrite")
    if "not a whole-project rewrite" not in str(target_gap.get("rust_scope", "")):
        errors.append("target_gap.rust_scope must reject a whole-project rewrite")
    if "not a whole-project rewrite" not in str(runtime_checklist.get("rust_scope", "")):
        errors.append("runtime_checklist.rust_scope must reject a whole-project rewrite")

    if errors:
        raise PromotionReadinessError("\n".join(errors))

    if candidate_report is not None:
        _validate_candidate_report(candidate_report)
        missed_targets = list(
            candidate_report.get("target_results", {}).get("missed_targets", [])
        )
        passed_targets = _candidate_passed_targets(candidate_report)
    else:
        missed_targets = list(target_gap.get("missed_targets", []))
        passed_targets = list(target_gap.get("passed_targets", []))

    probe_checklist = _require_list(
        runtime_checklist.get("probe_checklist"),
        "runtime_checklist.probe_checklist",
    )
    missing_runtime_probe_evidence = [
        item.get("evidence")
        for item in probe_checklist
        if item.get("claim_status") == "not_claimed_until_runtime_test"
    ]

    blocking_reasons: list[str] = []
    if missed_targets:
        blocking_reasons.append("missed_realtime_targets_remain")
    if missing_runtime_probe_evidence:
        blocking_reasons.append("runtime_probe_evidence_missing")
    if candidate_report is not None and not candidate_report.get(
        "candidate_profile", {}
    ).get("sustained_load_claimed"):
        blocking_reasons.append("sustained_load_evidence_missing")

    if missing_runtime_probe_evidence:
        status = "blocked_pending_runtime_evidence"
    elif missed_targets:
        status = "blocked_pending_target_misses"
    elif "sustained_load_evidence_missing" in blocking_reasons:
        # Keep the legacy status stable for existing Stage 09 bundle gates while
        # candidate_status_detail records the precise sustained-load blocker.
        status = "blocked_pending_target_misses"
    else:
        status = "ready_for_candidate_comparison"

    candidate_status_detail = _candidate_status_detail(
        candidate_report=candidate_report,
        missed_targets=missed_targets,
        blocking_reasons=blocking_reasons,
    )

    result = {
        "schema": "telemforge.stage09_candidate_promotion_readiness.v1",
        "status": status,
        "stage": readiness.get("stage"),
        "task_id": readiness.get("task_id"),
        "candidate_can_be_promoted": not blocking_reasons,
        "candidate_status_detail": candidate_status_detail,
        "next_comparable_candidate": readiness.get("next_comparable_candidate"),
        "baseline_verdict_status": readiness.get("baseline_verdict_status"),
        "runtime_stream_claim_status": readiness.get("runtime_stream_claim_status"),
        "missed_targets": missed_targets,
        "passed_targets": passed_targets,
        "blocking_reasons": blocking_reasons,
        "missing_runtime_probe_evidence": missing_runtime_probe_evidence,
        "required_next_evidence": _required_next_evidence(
            readiness.get("required_next_evidence", []),
            blocking_reasons,
        ),
        "promotion_rule": (
            "Do not promote a Python/FastAPI refresh or narrow Rust stream fanout "
            "candidate until missed realtime targets are improved or explicitly "
            "versioned, sustained-load evidence is present, and the compatible "
            "report contract remains intact."
        ),
        "rust_scope": "Rust data-plane candidate only; not a whole-project rewrite",
        "resource_envelope": readiness.get("resource_envelope"),
        "public_repo_safety": readiness.get("public_repo_safety"),
        "source_artifacts": {
            "readiness_summary": _display_path(readiness_path),
            "target_gap_summary": _display_path(target_gap_path),
            "runtime_stream_evidence_checklist": _display_path(runtime_checklist_path),
        },
        "verified_gates": [
            "baseline_readiness_summary_loaded",
            "target_gap_summary_loaded",
            "runtime_stream_evidence_checklist_loaded",
            "runtime_stream_claim_verified_by_probe_evidence",
            "missed_targets_must_improve_or_be_versioned",
            "rust_scope_data_plane_only",
            "docs_automation_excluded",
        ],
    }
    if candidate_report_path is not None:
        result["candidate_report"] = _display_path(Path(candidate_report_path))
        result["source_artifacts"]["candidate_report"] = result["candidate_report"]
        result["verified_gates"].append("candidate_report_loaded")
    return result


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Check Stage 09 candidate promotion readiness."
    )
    parser.add_argument(
        "--readiness",
        default=str(DEFAULT_READINESS_PATH.relative_to(ROOT)),
        help="Stage 09 baseline readiness summary JSON path.",
    )
    parser.add_argument(
        "--target-gap",
        default=str(DEFAULT_TARGET_GAP_PATH.relative_to(ROOT)),
        help="Stage 09 target-gap summary JSON path.",
    )
    parser.add_argument(
        "--runtime-checklist",
        default=str(DEFAULT_RUNTIME_CHECKLIST_PATH.relative_to(ROOT)),
        help="Stage 09 runtime stream evidence checklist JSON path.",
    )
    parser.add_argument(
        "--candidate-report",
        default=str(DEFAULT_CANDIDATE_REPORT_PATH.relative_to(ROOT)),
        help=(
            "Optional Stage 09 candidate report JSON path. Use 'none' to check "
            "baseline target gaps only."
        ),
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON promotion-readiness path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = check_stage09_candidate_promotion_readiness(
            readiness_path=args.readiness,
            target_gap_path=args.target_gap,
            runtime_checklist_path=args.runtime_checklist,
            candidate_report_path=(
                None
                if str(args.candidate_report).lower() == "none"
                else args.candidate_report
            ),
        )
    except (OSError, json.JSONDecodeError, PromotionReadinessError, KeyError) as error:
        print(f"Stage 09 candidate promotion readiness failed:\n{error}", file=sys.stderr)
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _read_json(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as file:
        value = json.load(file)
    if not isinstance(value, dict):
        raise PromotionReadinessError(f"{path} must contain a JSON object")
    return value


def _write_json(path: Path, value: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(value, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def _require_list(value: Any, label: str) -> list[Any]:
    if not isinstance(value, list):
        raise PromotionReadinessError(f"{label} must be a JSON array")
    return value


def _expect_equal(
    left: Any,
    right: Any,
    label: str,
    errors: list[str],
) -> None:
    if left != right:
        errors.append(f"{label} mismatch: expected {right!r}, got {left!r}")


def _validate_candidate_report(candidate_report: dict[str, Any]) -> None:
    errors: list[str] = []
    _expect_equal(
        candidate_report.get("schema"),
        "telemforge.stage09_realtime_baseline.v1",
        "candidate_report.schema",
        errors,
    )
    candidate_profile = candidate_report.get("candidate_profile", {})
    if not isinstance(candidate_profile, dict):
        errors.append("candidate_report.candidate_profile must be a JSON object")
    elif "not a whole-project rewrite" not in str(candidate_profile.get("rust_scope", "")):
        errors.append("candidate_report.candidate_profile.rust_scope must reject a rewrite")
    target_results = candidate_report.get("target_results", {})
    if not isinstance(target_results, dict):
        errors.append("candidate_report.target_results must be a JSON object")
    else:
        _require_mapping(
            target_results.get("checks"),
            "candidate_report.target_results.checks",
        )
    public_safety = candidate_profile.get("public_repo_safety", {})
    if not isinstance(public_safety, dict):
        errors.append("candidate_report public repo safety must be a JSON object")
    else:
        for field_name, expected in [
            ("includes_docs_automation", False),
            ("uses_absolute_local_paths", False),
            ("uses_credentials", False),
            ("uses_private_runtime_state", False),
        ]:
            _expect_equal(
                public_safety.get(field_name),
                expected,
                f"candidate_report public repo safety {field_name}",
                errors,
            )
    if errors:
        raise PromotionReadinessError("\n".join(errors))


def _candidate_passed_targets(candidate_report: dict[str, Any]) -> list[str]:
    checks = _require_mapping(
        candidate_report.get("target_results", {}).get("checks"),
        "candidate_report.target_results.checks",
    )
    return sorted(
        metric_name
        for metric_name, check in checks.items()
        if isinstance(check, dict) and check.get("meets_target") is True
    )


def _candidate_status_detail(
    *,
    candidate_report: dict[str, Any] | None,
    missed_targets: list[Any],
    blocking_reasons: list[str],
) -> str:
    if candidate_report is None:
        return "baseline_target_misses_blocking_candidate_promotion"
    if missed_targets:
        return "candidate_metrics_blocked_pending_target_misses"
    if "sustained_load_evidence_missing" in blocking_reasons:
        return "target_scale_metrics_passed_blocked_pending_sustained_load_evidence"
    if not blocking_reasons:
        return "candidate_ready_for_promotion"
    return "candidate_blocked_pending_runtime_evidence"


def _required_next_evidence(
    base_items: Any,
    blocking_reasons: list[str],
) -> list[Any]:
    items = list(base_items) if isinstance(base_items, list) else []
    sustained_item = (
        "sustained-load runtime evidence binds the target-scale Rust candidate "
        "to live websocket fanout before promotion"
    )
    if "sustained_load_evidence_missing" in blocking_reasons and sustained_item not in items:
        items.append(sustained_item)
    return items


def _require_mapping(value: Any, label: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise PromotionReadinessError(f"{label} must be a JSON object")
    return value


def _display_path(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT))
    except ValueError:
        return path.name


if __name__ == "__main__":
    raise SystemExit(main())
