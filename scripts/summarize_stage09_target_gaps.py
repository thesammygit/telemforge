"""Summarize Stage 09 realtime target gaps from the public baseline report.

This command reads committed Stage 09 artifacts and emits a deterministic JSON
summary for reviewers. It does not rerun the benchmark or approve Rust as a
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
DEFAULT_REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
DEFAULT_MANIFEST_PATH = ARTIFACT_ROOT / "stage09-baseline-verification-manifest.json"


class TargetGapSummaryError(Exception):
    """Raised when Stage 09 target-gap inputs are inconsistent."""


def summarize_stage09_target_gaps(
    report_path: Path | str = DEFAULT_REPORT_PATH,
    manifest_path: Path | str = DEFAULT_MANIFEST_PATH,
) -> dict[str, Any]:
    """Build a deterministic target-gap summary from public Stage 09 artifacts."""

    report_path = Path(report_path)
    manifest_path = Path(manifest_path)
    report = _read_json(report_path)
    manifest = _read_json(manifest_path)

    errors: list[str] = []
    _expect_equal(
        report.get("schema"),
        "telemforge.stage09_realtime_baseline.v1",
        "report.schema",
        errors,
    )
    _expect_equal(
        manifest.get("schema"),
        "telemforge.stage09_baseline_verification_manifest.v1",
        "manifest.schema",
        errors,
    )
    _expect_equal(manifest.get("stage"), report.get("stage"), "manifest.stage", errors)
    _expect_equal(
        manifest.get("public_repo_safety", {}).get("includes_docs_automation"),
        False,
        "manifest public repo docs/automation safety",
        errors,
    )
    _expect_equal(
        report.get("stream_contract_profile", {})
        .get("runtime_evidence_gate", {})
        .get("status"),
        "runtime_verified_bounded_fanout",
        "runtime stream evidence gate",
        errors,
    )
    rust_scope = str(manifest.get("rust_scope", ""))
    if "not a whole-project rewrite" not in rust_scope:
        errors.append("manifest.rust_scope must reject a whole-project rewrite")

    target_checks = _require_mapping(
        report.get("target_results", {}).get("checks"),
        "target_results.checks",
    )
    if errors:
        raise TargetGapSummaryError("\n".join(errors))

    target_gaps = [
        _target_gap(metric_name, target_checks[metric_name])
        for metric_name in sorted(target_checks)
    ]
    passed_targets = [
        item["metric"] for item in target_gaps if item["meets_target"] is True
    ]
    missed_targets = [
        item["metric"] for item in target_gaps if item["meets_target"] is False
    ]

    return {
        "schema": "telemforge.stage09_target_gap_summary.v1",
        "status": "target_gap_summary_ready",
        "stage": report.get("stage"),
        "task_id": manifest.get("task_id"),
        "report_path": _display_path(report_path),
        "manifest_path": _display_path(manifest_path),
        "baseline_verdict_status": report.get("baseline_verdict", {}).get("status"),
        "target_counts": {
            "total": len(target_gaps),
            "passed": len(passed_targets),
            "missed": len(missed_targets),
        },
        "passed_targets": passed_targets,
        "missed_targets": missed_targets,
        "target_gaps": target_gaps,
        "next_comparable_candidate": report.get("next_hot_path_profile", {}).get(
            "selected_candidate"
        ),
        "required_next_evidence": manifest.get("candidate_gate", {}).get(
            "required_evidence",
            [],
        ),
        "runtime_stream_claim_status": "runtime_verified_bounded_fanout",
        "rust_scope": "Rust data-plane candidate only; not a whole-project rewrite",
        "public_repo_safety": manifest.get("public_repo_safety"),
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Summarize Stage 09 realtime baseline target gaps."
    )
    parser.add_argument("--report", default=str(DEFAULT_REPORT_PATH.relative_to(ROOT)))
    parser.add_argument(
        "--manifest",
        default=str(DEFAULT_MANIFEST_PATH.relative_to(ROOT)),
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON target-gap summary path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = summarize_stage09_target_gaps(
            report_path=args.report,
            manifest_path=args.manifest,
        )
    except (OSError, json.JSONDecodeError, TargetGapSummaryError, KeyError) as error:
        print(f"Stage 09 target gap summary failed:\n{error}", file=sys.stderr)
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _target_gap(metric_name: str, check: Any) -> dict[str, Any]:
    check = _require_mapping(check, f"target_results.checks.{metric_name}")
    return {
        "metric": metric_name,
        "observed": check.get("observed"),
        "target": check.get("target"),
        "comparison": check.get("comparison"),
        "unit": check.get("unit"),
        "meets_target": check.get("meets_target"),
        "gap_to_target": check.get("gap_to_target"),
    }


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
        raise TargetGapSummaryError(f"{label} must be a JSON object")
    return value


def _expect_equal(
    left: Any,
    right: Any,
    label: str,
    errors: list[str],
) -> None:
    if left != right:
        errors.append(f"{label} mismatch: expected {right!r}, got {left!r}")


def _display_path(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT))
    except ValueError:
        return str(path)


if __name__ == "__main__":
    raise SystemExit(main())
