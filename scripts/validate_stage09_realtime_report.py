"""Validate Stage 09 realtime report compatibility.

This is a bounded compatibility gate for the current Python/FastAPI baseline
and future narrow Rust data-plane candidates. It validates report shape and
comparison gates only; it does not run load tests or claim runtime fanout.
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
DEFAULT_CONTRACT_PATH = ARTIFACT_ROOT / "stage09-candidate-report-contract.json"
DEFAULT_REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"


class ValidationError(Exception):
    """Raised when a Stage 09 report does not satisfy the compatibility gate."""


def validate_stage09_report(
    report_path: Path | str = DEFAULT_REPORT_PATH,
    contract_path: Path | str = DEFAULT_CONTRACT_PATH,
) -> dict[str, Any]:
    """Validate a Stage 09 report against the public candidate contract."""

    report = _read_json(Path(report_path))
    contract = _read_json(Path(contract_path))
    errors: list[str] = []

    _expect_equal(
        contract.get("schema"),
        "telemforge.stage09_candidate_report_contract.v1",
        "contract.schema",
        errors,
    )
    _expect_equal(
        report.get("schema"),
        contract.get("baseline_report_schema"),
        "report.schema",
        errors,
    )
    _expect_contains(
        contract.get("candidate_scope", {}).get("rust_scope", ""),
        "not a whole-project rewrite",
        "contract.candidate_scope.rust_scope",
        errors,
    )

    for field_name in contract.get("required_top_level_fields", []):
        if field_name not in report:
            errors.append(f"missing top-level report field: {field_name}")

    metric_bindings = contract.get("required_metric_bindings", {})
    for metric_name, binding in metric_bindings.items():
        try:
            _path_value(report, binding)
        except KeyError:
            errors.append(f"missing metric binding {metric_name}: {binding}")
        if metric_name not in report.get("target_results", {}).get("checks", {}):
            errors.append(f"missing target_results.checks entry: {metric_name}")

    _validate_stable_identity_gate(report, contract, errors)
    _validate_resource_envelope(report, contract, errors)
    _validate_stream_claim_gate(report, contract, errors)
    _validate_promotion_gate(report, contract, errors)

    if errors:
        raise ValidationError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_report_compatibility_validation.v1",
        "status": "passed",
        "report_path": str(Path(report_path)),
        "contract_path": str(Path(contract_path)),
        "baseline_report_schema": report["schema"],
        "rust_scope": contract["candidate_scope"]["rust_scope"],
        "validated_gates": [
            "required_top_level_fields",
            "required_metric_bindings",
            "stable_identity_gate",
            "resource_envelope",
            "stream_claim_gate",
            "promotion_gate",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate a Stage 09 realtime report against its contract."
    )
    parser.add_argument(
        "--report",
        default=str(DEFAULT_REPORT_PATH.relative_to(ROOT)),
        help="Stage 09 report JSON path.",
    )
    parser.add_argument(
        "--contract",
        default=str(DEFAULT_CONTRACT_PATH.relative_to(ROOT)),
        help="Stage 09 candidate report contract JSON path.",
    )
    args = parser.parse_args()

    try:
        result = validate_stage09_report(args.report, args.contract)
    except (OSError, json.JSONDecodeError, ValidationError, KeyError) as error:
        print(
            f"Stage 09 report compatibility validation failed:\n{error}",
            file=sys.stderr,
        )
        return 1

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _validate_stable_identity_gate(
    report: dict[str, Any],
    contract: dict[str, Any],
    errors: list[str],
) -> None:
    gate = contract.get("stable_identity_gate", {})
    fingerprint = _optional_path_value(report, gate.get("fingerprint_field", ""))
    stable_fields = _optional_path_value(report, gate.get("stable_fields_field", ""))
    allowed_variant_fields = _optional_path_value(
        report,
        gate.get("allowed_variant_fields_field", ""),
    )
    report_fingerprint = report.get("stable_report_fingerprint", {})

    if not isinstance(fingerprint, str) or len(fingerprint) != 64:
        errors.append("stable identity fingerprint must be a 64-character digest")
    _expect_equal(
        stable_fields,
        report_fingerprint.get("stable_identity_fields"),
        "stable identity fields",
        errors,
    )
    _expect_equal(
        allowed_variant_fields,
        report_fingerprint.get("excluded_run_variant_fields"),
        "allowed variant fields",
        errors,
    )
    _expect_contains(
        gate.get("comparison_rule", ""),
        "digest_sha256 matches",
        "stable_identity_gate.comparison_rule",
        errors,
    )


def _validate_resource_envelope(
    report: dict[str, Any],
    contract: dict[str, Any],
    errors: list[str],
) -> None:
    resource_guard = report.get("resource_guard", {})
    observed = {
        "worker_processes": resource_guard.get("worker_processes"),
        "max_expected_runtime_seconds": resource_guard.get(
            "max_expected_runtime_seconds"
        ),
        "max_expected_memory_mb": resource_guard.get("max_expected_memory_mb"),
        "uses_network": resource_guard.get("uses_network"),
        "uses_paid_services": resource_guard.get("uses_paid_services"),
    }
    _expect_equal(
        observed,
        contract.get("resource_envelope"),
        "resource envelope",
        errors,
    )


def _validate_stream_claim_gate(
    report: dict[str, Any],
    contract: dict[str, Any],
    errors: list[str],
) -> None:
    gate = contract.get("stream_claim_gate", {})
    stream_profile = report.get("stream_contract_profile", {})
    _expect_equal(
        stream_profile.get("implementation_status"),
        gate.get("current_implementation_status"),
        "stream implementation status",
        errors,
    )
    _expect_equal(
        stream_profile.get("required_live_evidence_before_runtime_claim"),
        gate.get("required_before_runtime_claim"),
        "stream live evidence gate",
        errors,
    )


def _validate_promotion_gate(
    report: dict[str, Any],
    contract: dict[str, Any],
    errors: list[str],
) -> None:
    promotion_gate = contract.get("promotion_gate", {})
    _expect_equal(
        report.get("target_results", {}).get("missed_targets"),
        promotion_gate.get("missed_baseline_targets"),
        "promotion missed baseline targets",
        errors,
    )
    evidence = promotion_gate.get("required_evidence", [])
    if "dropped_event_count does not regress" not in evidence:
        errors.append("promotion gate must protect dropped_event_count")


def _read_json(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as file:
        value = json.load(file)
    if not isinstance(value, dict):
        raise ValidationError(f"{path} must contain a JSON object")
    return value


def _path_value(document: dict[str, Any], field_path: str) -> Any:
    value: Any = document
    for part in field_path.split("."):
        if not isinstance(value, dict) or part not in value:
            raise KeyError(field_path)
        value = value[part]
    return value


def _optional_path_value(document: dict[str, Any], field_path: str) -> Any:
    if not field_path:
        return None
    try:
        return _path_value(document, field_path)
    except KeyError:
        return None


def _expect_equal(
    observed: Any,
    expected: Any,
    label: str,
    errors: list[str],
) -> None:
    if observed != expected:
        errors.append(f"{label} mismatch: expected {expected!r}, got {observed!r}")


def _expect_contains(
    value: str,
    needle: str,
    label: str,
    errors: list[str],
) -> None:
    if needle not in value:
        errors.append(f"{label} must contain {needle!r}")


if __name__ == "__main__":
    raise SystemExit(main())
