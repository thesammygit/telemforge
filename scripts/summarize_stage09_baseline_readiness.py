"""Summarize the public Stage 09 realtime baseline readiness gates.

This command reads the committed Stage 09 baseline artifacts and emits a small
deterministic JSON summary for reviewers. It does not run the benchmark or
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
DEFAULT_REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
DEFAULT_MANIFEST_PATH = ARTIFACT_ROOT / "stage09-baseline-verification-manifest.json"
DEFAULT_REPORT_VALIDATION_PATH = ARTIFACT_ROOT / "stage09-report-validation-summary.json"
DEFAULT_LIVE_VALIDATION_PATH = ARTIFACT_ROOT / "stage09-live-contract-validation-summary.json"
DEFAULT_REFRESH_CHECK_PATH = ARTIFACT_ROOT / "stage09-baseline-refresh-check.json"
DEFAULT_COMMAND_EVIDENCE_PATH = ARTIFACT_ROOT / "stage09-baseline-command-evidence.json"
DEFAULT_TARGET_BINDING_PATH = ARTIFACT_ROOT / "stage09-target-result-binding-gate.json"


class ReadinessSummaryError(Exception):
    """Raised when the baseline readiness inputs do not support a summary."""


def summarize_stage09_baseline_readiness(
    report_path: Path | str = DEFAULT_REPORT_PATH,
    manifest_path: Path | str = DEFAULT_MANIFEST_PATH,
    report_validation_path: Path | str = DEFAULT_REPORT_VALIDATION_PATH,
    live_validation_path: Path | str = DEFAULT_LIVE_VALIDATION_PATH,
    refresh_check_path: Path | str = DEFAULT_REFRESH_CHECK_PATH,
    command_evidence_path: Path | str = DEFAULT_COMMAND_EVIDENCE_PATH,
    target_binding_path: Path | str = DEFAULT_TARGET_BINDING_PATH,
) -> dict[str, Any]:
    """Build a deterministic readiness summary from public Stage 09 artifacts."""

    report_path = Path(report_path)
    manifest_path = Path(manifest_path)
    report = _read_json(report_path)
    manifest = _read_json(manifest_path)
    report_validation = _read_json(Path(report_validation_path))
    live_validation = _read_json(Path(live_validation_path))
    refresh_check = _read_json(Path(refresh_check_path))
    command_evidence = _read_json(Path(command_evidence_path))
    target_binding = _read_json(Path(target_binding_path))

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
    _expect_equal(
        manifest.get("stage"),
        report.get("stage"),
        "manifest.stage",
        errors,
    )
    _expect_equal(report_validation.get("status"), "passed", "report validation", errors)
    _expect_equal(live_validation.get("status"), "passed", "live validation", errors)
    _expect_equal(refresh_check.get("status"), "passed", "refresh check", errors)
    _expect_equal(target_binding.get("status"), "passed", "target binding", errors)
    _expect_equal(
        command_evidence.get("runtime_claim_status"),
        "not_claimed",
        "command evidence runtime claim",
        errors,
    )
    _expect_equal(
        command_evidence.get("benchmark_command"),
        manifest.get("benchmark", {}).get("command"),
        "command evidence benchmark command",
        errors,
    )
    _expect_equal(
        manifest.get("public_repo_safety", {}).get("includes_docs_automation"),
        False,
        "manifest docs/automation safety",
        errors,
    )

    runtime_gate_status = (
        report.get("stream_contract_profile", {})
        .get("runtime_evidence_gate", {})
        .get("status")
    )
    _expect_equal(
        runtime_gate_status,
        "runtime_verified_bounded_fanout",
        "runtime stream evidence gate",
        errors,
    )
    rust_scope = str(manifest.get("rust_scope", ""))
    if "not a whole-project rewrite" not in rust_scope:
        errors.append("manifest.rust_scope must reject a whole-project rewrite")

    if errors:
        raise ReadinessSummaryError("\n".join(errors))

    target_checks = _require_mapping(
        report.get("target_results", {}).get("checks"),
        "target_results.checks",
    )
    passed_targets = [
        name for name, check in target_checks.items() if check.get("meets_target") is True
    ]
    missed_targets = [
        name for name, check in target_checks.items() if check.get("meets_target") is False
    ]
    fingerprint = _require_mapping(
        report.get("stable_report_fingerprint"),
        "stable_report_fingerprint",
    )

    return {
        "schema": "telemforge.stage09_baseline_readiness_summary.v1",
        "status": "baseline_ready_for_comparison",
        "stage": report.get("stage"),
        "task_id": manifest.get("task_id"),
        "report_path": _display_path(report_path),
        "manifest_path": _display_path(manifest_path),
        "baseline_verdict_status": report.get("baseline_verdict", {}).get("status"),
        "target_summary": {
            "passed_targets": passed_targets,
            "missed_targets": missed_targets,
            "baseline_is_production_realtime_claim": False,
        },
        "stable_fingerprint": {
            "digest_sha256": fingerprint.get("digest_sha256"),
            "stable_identity_field_count": len(
                fingerprint.get("stable_identity_fields", [])
            ),
        },
        "resource_envelope": manifest.get("resource_envelope"),
        "runtime_stream_claim_status": runtime_gate_status,
        "rust_scope": "Rust data-plane candidate only; not a whole-project rewrite",
        "next_comparable_candidate": report.get("next_hot_path_profile", {}).get(
            "selected_candidate"
        ),
        "required_next_evidence": manifest.get("candidate_gate", {}).get(
            "required_evidence",
            [],
        ),
        "public_repo_safety": manifest.get("public_repo_safety"),
        "verified_inputs": {
            "report_schema": report.get("schema"),
            "manifest_schema": manifest.get("schema"),
            "report_validation_status": report_validation.get("status"),
            "live_contract_validation_status": live_validation.get("status"),
            "refresh_check_status": refresh_check.get("status"),
            "target_result_binding_status": target_binding.get("status"),
            "command_evidence_runtime_claim_status": command_evidence.get(
                "runtime_claim_status"
            ),
        },
        "verified_gates": [
            "public_baseline_report_present",
            "candidate_report_contract_passed",
            "live_contract_validation_passed",
            "refresh_check_passed",
            "target_result_binding_passed",
            "runtime_stream_claim_verified",
            "baseline_is_comparison_evidence_only",
            "rust_scope_data_plane_only",
            "docs_automation_excluded",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Summarize public Stage 09 baseline readiness gates."
    )
    parser.add_argument("--report", default=str(DEFAULT_REPORT_PATH.relative_to(ROOT)))
    parser.add_argument(
        "--manifest",
        default=str(DEFAULT_MANIFEST_PATH.relative_to(ROOT)),
    )
    parser.add_argument(
        "--report-validation",
        default=str(DEFAULT_REPORT_VALIDATION_PATH.relative_to(ROOT)),
    )
    parser.add_argument(
        "--live-validation",
        default=str(DEFAULT_LIVE_VALIDATION_PATH.relative_to(ROOT)),
    )
    parser.add_argument(
        "--refresh-check",
        default=str(DEFAULT_REFRESH_CHECK_PATH.relative_to(ROOT)),
    )
    parser.add_argument(
        "--command-evidence",
        default=str(DEFAULT_COMMAND_EVIDENCE_PATH.relative_to(ROOT)),
    )
    parser.add_argument(
        "--target-binding",
        default=str(DEFAULT_TARGET_BINDING_PATH.relative_to(ROOT)),
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON readiness summary path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = summarize_stage09_baseline_readiness(
            report_path=args.report,
            manifest_path=args.manifest,
            report_validation_path=args.report_validation,
            live_validation_path=args.live_validation,
            refresh_check_path=args.refresh_check,
            command_evidence_path=args.command_evidence,
            target_binding_path=args.target_binding,
        )
    except (OSError, json.JSONDecodeError, ReadinessSummaryError, KeyError) as error:
        print(f"Stage 09 baseline readiness summary failed:\n{error}", file=sys.stderr)
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _read_json(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as file:
        value = json.load(file)
    if not isinstance(value, dict):
        raise ReadinessSummaryError(f"{path} must contain a JSON object")
    return value


def _write_json(path: Path, value: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(value, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def _require_mapping(value: Any, label: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise ReadinessSummaryError(f"{label} must be a JSON object")
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
