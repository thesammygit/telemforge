"""Check Stage 09 target-result artifact consistency.

This command reads committed Stage 09 baseline artifacts and emits a
deterministic JSON gate for reviewers. It does not rerun the benchmark, open a
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
DEFAULT_REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
DEFAULT_METRIC_INDEX_PATH = ARTIFACT_ROOT / "stage09-baseline-metric-index.json"
DEFAULT_TARGET_GAP_PATH = ARTIFACT_ROOT / "stage09-target-gap-summary.json"
DEFAULT_BINDING_GATE_PATH = ARTIFACT_ROOT / "stage09-target-result-binding-gate.json"
DEFAULT_CLOSEOUT_GATE_PATH = ARTIFACT_ROOT / "stage09-baseline-closeout-gate.json"


class TargetResultArtifactGateError(Exception):
    """Raised when Stage 09 target-result artifacts are inconsistent."""


def check_stage09_target_result_artifact_gate(
    report_path: Path | str = DEFAULT_REPORT_PATH,
    metric_index_path: Path | str = DEFAULT_METRIC_INDEX_PATH,
    target_gap_path: Path | str = DEFAULT_TARGET_GAP_PATH,
    binding_gate_path: Path | str = DEFAULT_BINDING_GATE_PATH,
    closeout_gate_path: Path | str = DEFAULT_CLOSEOUT_GATE_PATH,
) -> dict[str, Any]:
    """Build a deterministic target-result artifact gate."""

    report_path = Path(report_path)
    metric_index_path = Path(metric_index_path)
    target_gap_path = Path(target_gap_path)
    binding_gate_path = Path(binding_gate_path)
    closeout_gate_path = Path(closeout_gate_path)

    report = _read_json(report_path)
    metric_index = _read_json(metric_index_path)
    target_gap = _read_json(target_gap_path)
    binding_gate = _read_json(binding_gate_path)
    closeout_gate = _read_json(closeout_gate_path)

    errors: list[str] = []
    _expect_equal(
        report.get("schema"),
        "telemforge.stage09_realtime_baseline.v1",
        "report.schema",
        errors,
    )
    _expect_equal(
        metric_index.get("schema"),
        "telemforge.stage09_baseline_metric_index.v1",
        "metric_index.schema",
        errors,
    )
    _expect_equal(
        target_gap.get("schema"),
        "telemforge.stage09_target_gap_summary.v1",
        "target_gap.schema",
        errors,
    )
    _expect_equal(
        binding_gate.get("schema"),
        "telemforge.stage09_target_result_binding_gate.v1",
        "binding_gate.schema",
        errors,
    )
    _expect_equal(
        closeout_gate.get("schema"),
        "telemforge.stage09_baseline_closeout_gate.v1",
        "closeout_gate.schema",
        errors,
    )

    stage = report.get("stage")
    task_id = closeout_gate.get("task_id")
    for label, artifact in [
        ("metric_index", metric_index),
        ("target_gap", target_gap),
        ("binding_gate", binding_gate),
        ("closeout_gate", closeout_gate),
    ]:
        _expect_equal(artifact.get("stage"), stage, f"{label}.stage", errors)
        _expect_equal(artifact.get("task_id"), task_id, f"{label}.task_id", errors)

    _expect_equal(
        report.get("stream_contract_profile", {})
        .get("runtime_evidence_gate", {})
        .get("status"),
        "contract_only_blocked",
        "report runtime evidence gate",
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

    target_checks = _require_mapping(
        report.get("target_results", {}).get("checks"),
        "report.target_results.checks",
    )
    headline_order = _require_list(
        metric_index.get("headline_metric_order"),
        "metric_index.headline_metric_order",
    )
    metric_rows = _index_by_metric(
        _require_list(metric_index.get("metric_index"), "metric_index.metric_index"),
        "metric_index.metric_index",
    )
    gap_rows = _index_by_metric(
        _require_list(target_gap.get("target_gaps"), "target_gap.target_gaps"),
        "target_gap.target_gaps",
    )
    binding_rows = _require_mapping(
        binding_gate.get("metric_bindings"),
        "binding_gate.metric_bindings",
    )

    expected_metrics = list(headline_order)
    for label, mapping in [
        ("report.target_results.checks", target_checks),
        ("metric_index.metric_index", metric_rows),
        ("target_gap.target_gaps", gap_rows),
        ("binding_gate.metric_bindings", binding_rows),
    ]:
        _expect_equal(
            sorted(mapping),
            sorted(expected_metrics),
            f"{label} metric set",
            errors,
        )

    metric_artifacts: list[dict[str, Any]] = []
    passed_metrics: list[str] = []
    missed_metrics: list[str] = []
    for metric in expected_metrics:
        check = _require_mapping(target_checks.get(metric), f"target check {metric}")
        index_row = _require_mapping(metric_rows.get(metric), f"metric index {metric}")
        gap_row = _require_mapping(gap_rows.get(metric), f"target gap {metric}")
        binding_row = _require_mapping(binding_rows.get(metric), f"binding {metric}")

        for field in [
            "observed",
            "target",
            "comparison",
            "unit",
            "meets_target",
            "gap_to_target",
        ]:
            expected = check.get(field)
            _expect_equal(index_row.get(field), expected, f"{metric} index {field}", errors)
            _expect_equal(gap_row.get(field), expected, f"{metric} gap {field}", errors)
            _expect_equal(
                binding_row.get(field),
                expected,
                f"{metric} binding {field}",
                errors,
            )

        if check.get("meets_target") is True:
            passed_metrics.append(metric)
        elif check.get("meets_target") is False:
            missed_metrics.append(metric)
        else:
            errors.append(f"{metric} meets_target must be true or false")

        metric_artifacts.append(
            {
                "metric": metric,
                "observed": check.get("observed"),
                "target": check.get("target"),
                "comparison": check.get("comparison"),
                "unit": check.get("unit"),
                "meets_target": check.get("meets_target"),
                "gap_to_target": check.get("gap_to_target"),
                "observed_source": index_row.get("observed_source"),
                "report_binding": binding_row.get("report_binding"),
                "artifact_presence": [
                    "stage09-baseline-report.json",
                    "stage09-baseline-metric-index.json",
                    "stage09-target-gap-summary.json",
                    "stage09-target-result-binding-gate.json",
                ],
            }
        )

    _expect_equal(
        sorted(target_gap.get("passed_targets", [])),
        sorted(passed_metrics),
        "target_gap passed targets",
        errors,
    )
    _expect_equal(
        sorted(target_gap.get("missed_targets", [])),
        sorted(missed_metrics),
        "target_gap missed targets",
        errors,
    )
    _expect_equal(
        closeout_gate.get("passed_metrics"),
        passed_metrics,
        "closeout passed metrics",
        errors,
    )
    _expect_equal(
        closeout_gate.get("missed_metrics"),
        missed_metrics,
        "closeout missed metrics",
        errors,
    )

    for label, artifact in [
        ("metric_index", metric_index),
        ("target_gap", target_gap),
        ("binding_gate", binding_gate),
        ("closeout_gate", closeout_gate),
    ]:
        _validate_public_safety(label, artifact, errors)
        if "not a whole-project rewrite" not in str(artifact.get("rust_scope", "")):
            errors.append(f"{label}.rust_scope must reject a whole-project rewrite")

    if errors:
        raise TargetResultArtifactGateError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_target_result_artifact_gate.v1",
        "status": "passed",
        "stage": stage,
        "task_id": task_id,
        "purpose": (
            "Pin every Stage 09 headline metric across the report, metric index, "
            "target-gap summary, binding gate, and closeout gate before comparing "
            "future Python/FastAPI refreshes or narrow Rust data-plane candidates."
        ),
        "source_artifacts": {
            "baseline_report": _display_path(report_path),
            "baseline_metric_index": _display_path(metric_index_path),
            "target_gap_summary": _display_path(target_gap_path),
            "target_result_binding_gate": _display_path(binding_gate_path),
            "baseline_closeout_gate": _display_path(closeout_gate_path),
        },
        "metric_count": len(metric_artifacts),
        "target_counts": {
            "total": len(metric_artifacts),
            "passed": len(passed_metrics),
            "missed": len(missed_metrics),
        },
        "passed_metrics": passed_metrics,
        "missed_metrics": missed_metrics,
        "metric_artifacts": metric_artifacts,
        "runtime_claims": {
            "stream_runtime_claim_status": "contract_only_blocked",
            "candidate_can_be_promoted": False,
        },
        "next_comparable_candidate": closeout_gate.get("next_comparable_candidate"),
        "required_next_evidence": closeout_gate.get("required_next_evidence"),
        "public_repo_safety": closeout_gate.get("public_repo_safety"),
        "resource_envelope": closeout_gate.get("resource_envelope"),
        "rust_scope": "Rust data-plane candidate only; not a whole-project rewrite",
        "verified_gates": [
            "target_result_metric_sets_match",
            "observed_values_match_across_artifacts",
            "target_values_match_across_artifacts",
            "pass_fail_status_matches_closeout_gate",
            "runtime_stream_claim_blocked",
            "candidate_promotion_blocked",
            "public_paths_are_repo_relative",
            "docs_automation_excluded",
            "rust_scope_data_plane_only",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Check Stage 09 target-result artifact consistency."
    )
    parser.add_argument("--report", default=str(DEFAULT_REPORT_PATH.relative_to(ROOT)))
    parser.add_argument(
        "--metric-index",
        default=str(DEFAULT_METRIC_INDEX_PATH.relative_to(ROOT)),
    )
    parser.add_argument(
        "--target-gap",
        default=str(DEFAULT_TARGET_GAP_PATH.relative_to(ROOT)),
    )
    parser.add_argument(
        "--binding-gate",
        default=str(DEFAULT_BINDING_GATE_PATH.relative_to(ROOT)),
    )
    parser.add_argument(
        "--closeout-gate",
        default=str(DEFAULT_CLOSEOUT_GATE_PATH.relative_to(ROOT)),
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON artifact-gate path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = check_stage09_target_result_artifact_gate(
            report_path=args.report,
            metric_index_path=args.metric_index,
            target_gap_path=args.target_gap,
            binding_gate_path=args.binding_gate,
            closeout_gate_path=args.closeout_gate,
        )
    except (OSError, json.JSONDecodeError, TargetResultArtifactGateError) as error:
        print(f"Stage 09 target-result artifact gate failed:\n{error}", file=sys.stderr)
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _read_json(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as file:
        value = json.load(file)
    return _require_mapping(value, str(path))


def _write_json(path: Path, value: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(value, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def _require_mapping(value: Any, label: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise TargetResultArtifactGateError(f"{label} must be a JSON object")
    return value


def _require_list(value: Any, label: str) -> list[Any]:
    if not isinstance(value, list):
        raise TargetResultArtifactGateError(f"{label} must be a JSON array")
    return value


def _index_by_metric(rows: list[Any], label: str) -> dict[str, dict[str, Any]]:
    indexed: dict[str, dict[str, Any]] = {}
    for row in rows:
        row = _require_mapping(row, label)
        metric = row.get("metric")
        if not isinstance(metric, str) or not metric:
            raise TargetResultArtifactGateError(f"{label} row missing metric")
        if metric in indexed:
            raise TargetResultArtifactGateError(f"{label} duplicate metric: {metric}")
        indexed[metric] = row
    return indexed


def _expect_equal(left: Any, right: Any, label: str, errors: list[str]) -> None:
    if left != right:
        errors.append(f"{label} mismatch: expected {right!r}, got {left!r}")


def _validate_public_safety(
    label: str,
    artifact: dict[str, Any],
    errors: list[str],
) -> None:
    safety = _require_mapping(artifact.get("public_repo_safety"), f"{label}.safety")
    expected = {
        "paths_are_repo_relative": True,
        "includes_docs_automation": False,
        "uses_absolute_local_paths": False,
        "uses_credentials": False,
        "uses_private_runtime_state": False,
    }
    for key, value in expected.items():
        _expect_equal(safety.get(key), value, f"{label}.public_repo_safety.{key}", errors)


def _display_path(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT))
    except ValueError:
        return str(path)


if __name__ == "__main__":
    raise SystemExit(main())
