"""Verify the public Stage 09 realtime baseline artifact bundle.

This command ties the existing benchmark report, validation summary, and
verification manifest together without running a load test or claiming
websocket runtime fanout. It is a deterministic review gate for the current
Python/FastAPI control-plane baseline and future narrow Rust data-plane
candidates.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from scripts.validate_stage09_realtime_report import (
    DEFAULT_CONTRACT_PATH,
    DEFAULT_REPORT_PATH,
    ValidationError,
    validate_stage09_report,
)
from scripts.validate_stage09_live_telemetry_contract import (
    DEFAULT_CONTRACT_PATH as DEFAULT_LIVE_CONTRACT_PATH,
    validate_stage09_live_telemetry_contract,
)


ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
DEFAULT_MANIFEST_PATH = ARTIFACT_ROOT / "stage09-baseline-verification-manifest.json"
DEFAULT_VALIDATION_SUMMARY_PATH = ARTIFACT_ROOT / "stage09-report-validation-summary.json"
DEFAULT_SUMMARY_PATH = ARTIFACT_ROOT / "stage09-baseline-summary.md"
FIRST_RUST_HOT_PATH_SLICE_PATH = ARTIFACT_ROOT / "first-rust-hot-path-slice.md"
REFRESH_CHECK_PATH = ARTIFACT_ROOT / "stage09-baseline-refresh-check.json"
COMMAND_EVIDENCE_PATH = ARTIFACT_ROOT / "stage09-baseline-command-evidence.json"
RUNTIME_STREAM_EVIDENCE_CHECKLIST_PATH = (
    ARTIFACT_ROOT / "stage09-runtime-stream-evidence-checklist.json"
)
TARGET_RESULT_BINDING_GATE_PATH = (
    ARTIFACT_ROOT / "stage09-target-result-binding-gate.json"
)
LIVE_CONTRACT_VALIDATION_SUMMARY_PATH = (
    ARTIFACT_ROOT / "stage09-live-contract-validation-summary.json"
)


def verify_stage09_baseline_bundle(
    report_path: Path | str = DEFAULT_REPORT_PATH,
    contract_path: Path | str = DEFAULT_CONTRACT_PATH,
    manifest_path: Path | str = DEFAULT_MANIFEST_PATH,
    validation_summary_path: Path | str = DEFAULT_VALIDATION_SUMMARY_PATH,
    summary_path: Path | str = DEFAULT_SUMMARY_PATH,
) -> dict[str, Any]:
    """Verify the Stage 09 baseline bundle is internally consistent."""

    report_path = Path(report_path)
    contract_path = Path(contract_path)
    manifest_path = Path(manifest_path)
    validation_summary_path = Path(validation_summary_path)
    summary_path = Path(summary_path)

    report_validation = validate_stage09_report(report_path, contract_path)
    report = _read_json(report_path)
    contract = _read_json(contract_path)
    manifest = _read_json(manifest_path)
    validation_summary = _read_json(validation_summary_path)
    live_contract_validation_summary = _read_json(
        LIVE_CONTRACT_VALIDATION_SUMMARY_PATH
    )
    refresh_check = _read_json(REFRESH_CHECK_PATH)
    command_evidence = _read_json(COMMAND_EVIDENCE_PATH)
    runtime_stream_evidence_checklist = _read_json(
        RUNTIME_STREAM_EVIDENCE_CHECKLIST_PATH
    )
    target_result_binding_gate = _read_json(TARGET_RESULT_BINDING_GATE_PATH)
    live_contract = _read_json(DEFAULT_LIVE_CONTRACT_PATH)
    summary_text = summary_path.read_text(encoding="utf-8")
    live_contract_validation = validate_stage09_live_telemetry_contract(
        DEFAULT_LIVE_CONTRACT_PATH,
        report_path,
    )

    errors: list[str] = []
    _expect_equal(validation_summary, report_validation, "validation summary", errors)
    _expect_equal(
        live_contract_validation_summary,
        live_contract_validation,
        "live contract validation summary",
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
        manifest.get("benchmark", {}).get("report_path"),
        _display_path(report_path),
        "manifest benchmark report path",
        errors,
    )
    _expect_equal(
        manifest.get("benchmark", {}).get("summary_path"),
        _display_path(summary_path),
        "manifest benchmark summary path",
        errors,
    )
    _expect_equal(
        manifest.get("resource_envelope"),
        contract.get("resource_envelope"),
        "manifest resource envelope",
        errors,
    )

    _validate_public_paths(manifest, errors)
    _validate_manifest_artifacts(manifest, errors)
    _validate_hot_path_slice_note(manifest, errors)
    _validate_refresh_check(report, manifest, refresh_check, errors)
    _validate_command_evidence(report, manifest, command_evidence, errors)
    _validate_runtime_stream_evidence_checklist(
        report,
        manifest,
        live_contract,
        runtime_stream_evidence_checklist,
        errors,
    )
    _validate_target_result_binding_gate(
        report,
        contract,
        manifest,
        target_result_binding_gate,
        errors,
    )
    _validate_summary(summary_text, report, errors)

    rust_scope = manifest.get("rust_scope", "")
    if "not a whole-project rewrite" not in rust_scope:
        errors.append(
            "manifest.rust_scope must keep Rust scoped away from a whole-project rewrite"
        )

    if errors:
        raise ValidationError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_baseline_bundle_verification.v1",
        "status": "passed",
        "task_id": manifest["task_id"],
        "stage": manifest["stage"],
        "report_path": _display_path(report_path),
        "manifest_path": _display_path(manifest_path),
        "validation_summary_path": _display_path(validation_summary_path),
        "summary_path": _display_path(summary_path),
        "resource_envelope": manifest["resource_envelope"],
        "rust_scope": rust_scope,
        "verified_gates": [
            "report_contract_validation",
            "report_target_result_bindings",
            "validation_summary_matches",
            "manifest_artifacts_exist",
            "manifest_paths_are_public_relative",
            "live_contract_validation_summary_matches",
            "first_rust_hot_path_slice_pinned",
            "refresh_check_stable_fingerprint_matches",
            "baseline_command_evidence_pinned",
            "runtime_stream_evidence_checklist_pinned",
            "target_result_binding_gate_pinned",
            "summary_records_baseline_verdict",
            "rust_scope_data_plane_only",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Verify the Stage 09 realtime baseline artifact bundle."
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
    parser.add_argument(
        "--manifest",
        default=str(DEFAULT_MANIFEST_PATH.relative_to(ROOT)),
        help="Stage 09 baseline verification manifest JSON path.",
    )
    parser.add_argument(
        "--validation-summary",
        default=str(DEFAULT_VALIDATION_SUMMARY_PATH.relative_to(ROOT)),
        help="Stage 09 report validation summary JSON path.",
    )
    parser.add_argument(
        "--summary",
        default=str(DEFAULT_SUMMARY_PATH.relative_to(ROOT)),
        help="Stage 09 baseline Markdown summary path.",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON bundle verification summary path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = verify_stage09_baseline_bundle(
            report_path=args.report,
            contract_path=args.contract,
            manifest_path=args.manifest,
            validation_summary_path=args.validation_summary,
            summary_path=args.summary,
        )
    except (OSError, json.JSONDecodeError, ValidationError, KeyError) as error:
        print(f"Stage 09 baseline bundle verification failed:\n{error}", file=sys.stderr)
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _validate_public_paths(manifest: dict[str, Any], errors: list[str]) -> None:
    public_safety = manifest.get("public_repo_safety", {})
    _expect_equal(
        public_safety.get("paths_are_repo_relative"),
        True,
        "public_repo_safety.paths_are_repo_relative",
        errors,
    )
    _expect_equal(
        public_safety.get("includes_docs_automation"),
        False,
        "public_repo_safety.includes_docs_automation",
        errors,
    )
    _expect_equal(
        public_safety.get("uses_absolute_local_paths"),
        False,
        "public_repo_safety.uses_absolute_local_paths",
        errors,
    )
    _expect_equal(
        public_safety.get("uses_credentials"),
        False,
        "public_repo_safety.uses_credentials",
        errors,
    )

    paths = [manifest.get("benchmark", {}).get("report_path", "")]
    paths.append(manifest.get("benchmark", {}).get("summary_path", ""))
    paths.extend(
        artifact.get("path", "")
        for artifact in manifest.get("contract_artifacts", [])
    )
    for path in paths:
        if not path:
            errors.append("manifest contains an empty artifact path")
            continue
        if Path(path).is_absolute():
            errors.append(f"manifest path must be repo-relative: {path}")
        if path.startswith("docs/automation") or "/docs/automation/" in path:
            errors.append(f"manifest path must not reference docs/automation: {path}")


def _validate_manifest_artifacts(manifest: dict[str, Any], errors: list[str]) -> None:
    paths = [manifest.get("benchmark", {}).get("report_path", "")]
    paths.append(manifest.get("benchmark", {}).get("summary_path", ""))
    for artifact in manifest.get("contract_artifacts", []):
        paths.append(artifact.get("path", ""))

    for path in paths:
        if path and not (ROOT / path).exists():
            errors.append(f"manifest artifact does not exist: {path}")


def _validate_hot_path_slice_note(
    manifest: dict[str, Any],
    errors: list[str],
) -> None:
    note_path = _display_path(FIRST_RUST_HOT_PATH_SLICE_PATH)
    artifacts = {
        artifact.get("path", ""): artifact
        for artifact in manifest.get("contract_artifacts", [])
    }
    artifact = artifacts.get(note_path)
    if artifact is None:
        errors.append(f"manifest must pin first Rust hot-path note: {note_path}")
        return
    _expect_equal(
        artifact.get("schema"),
        "telemforge.stage09_first_rust_hot_path_slice_note.v1",
        "first Rust hot-path slice schema",
        errors,
    )
    role = artifact.get("role", "")
    if "first Rust data-plane experiment" not in role:
        errors.append(
            "first Rust hot-path slice role must describe the data-plane experiment"
        )

    note = FIRST_RUST_HOT_PATH_SLICE_PATH.read_text(encoding="utf-8")
    for snippet in [
        "stream fanout",
        "not as a whole-project rewrite",
        "Python/FastAPI control plane",
        "dropped_event_count",
    ]:
        if snippet not in note:
            errors.append(f"first Rust hot-path slice note missing snippet: {snippet}")


def _validate_refresh_check(
    report: dict[str, Any],
    manifest: dict[str, Any],
    refresh_check: dict[str, Any],
    errors: list[str],
) -> None:
    artifact_path = _display_path(REFRESH_CHECK_PATH)
    artifacts = {
        artifact.get("path", ""): artifact
        for artifact in manifest.get("contract_artifacts", [])
    }
    artifact = artifacts.get(artifact_path)
    if artifact is None:
        errors.append(f"manifest must pin baseline refresh check: {artifact_path}")
        return
    _expect_equal(
        artifact.get("schema"),
        "telemforge.stage09_baseline_refresh_check.v1",
        "baseline refresh check schema",
        errors,
    )
    _expect_equal(
        refresh_check.get("schema"),
        "telemforge.stage09_baseline_refresh_check.v1",
        "refresh_check.schema",
        errors,
    )
    _expect_equal(refresh_check.get("status"), "passed", "refresh_check.status", errors)
    _expect_equal(
        refresh_check.get("report_path"),
        _display_path(DEFAULT_REPORT_PATH),
        "refresh_check.report_path",
        errors,
    )
    _expect_equal(
        refresh_check.get("stable_digest_sha256"),
        report.get("stable_report_fingerprint", {}).get("digest_sha256"),
        "refresh_check stable digest",
        errors,
    )
    _expect_equal(
        refresh_check.get("runtime_evidence_gate_status"),
        "contract_only_blocked",
        "refresh_check.runtime_evidence_gate_status",
        errors,
    )
    if "not a whole-project rewrite" not in refresh_check.get("rust_scope", ""):
        errors.append("refresh_check.rust_scope must keep Rust data-plane scoped")
    if "fresh_run_stable_fingerprint_matches" not in refresh_check.get(
        "verified_gates",
        [],
    ):
        errors.append("refresh_check must verify fresh stable fingerprint matching")


def _validate_command_evidence(
    report: dict[str, Any],
    manifest: dict[str, Any],
    command_evidence: dict[str, Any],
    errors: list[str],
) -> None:
    artifact_path = _display_path(COMMAND_EVIDENCE_PATH)
    artifacts = {
        artifact.get("path", ""): artifact
        for artifact in manifest.get("contract_artifacts", [])
    }
    artifact = artifacts.get(artifact_path)
    if artifact is None:
        errors.append(f"manifest must pin baseline command evidence: {artifact_path}")
        return
    _expect_equal(
        artifact.get("schema"),
        "telemforge.stage09_baseline_command_evidence.v1",
        "baseline command evidence schema",
        errors,
    )
    _expect_equal(
        command_evidence.get("schema"),
        "telemforge.stage09_baseline_command_evidence.v1",
        "command_evidence.schema",
        errors,
    )
    _expect_equal(
        command_evidence.get("benchmark_command"),
        report.get("verification_contract", {}).get("command"),
        "command_evidence benchmark command",
        errors,
    )
    _expect_equal(
        command_evidence.get("benchmark_command"),
        manifest.get("benchmark", {}).get("command"),
        "manifest benchmark command evidence",
        errors,
    )
    _expect_equal(
        command_evidence.get("required_outputs"),
        report.get("verification_contract", {}).get("required_outputs"),
        "command_evidence required outputs",
        errors,
    )
    _expect_equal(
        command_evidence.get("resource_envelope"),
        manifest.get("resource_envelope"),
        "command_evidence resource envelope",
        errors,
    )
    _expect_equal(
        command_evidence.get("runtime_claim_status"),
        "not_claimed",
        "command_evidence runtime claim status",
        errors,
    )
    public_safety = command_evidence.get("public_repo_safety", {})
    _expect_equal(
        public_safety.get("paths_are_repo_relative"),
        True,
        "command_evidence paths_are_repo_relative",
        errors,
    )
    _expect_equal(
        public_safety.get("includes_docs_automation"),
        False,
        "command_evidence includes_docs_automation",
        errors,
    )
    _expect_equal(
        public_safety.get("uses_absolute_local_paths"),
        False,
        "command_evidence uses_absolute_local_paths",
        errors,
    )
    if "not a whole-project rewrite" not in command_evidence.get("rust_scope", ""):
        errors.append("command_evidence.rust_scope must keep Rust data-plane scoped")


def _validate_runtime_stream_evidence_checklist(
    report: dict[str, Any],
    manifest: dict[str, Any],
    live_contract: dict[str, Any],
    checklist: dict[str, Any],
    errors: list[str],
) -> None:
    artifact_path = _display_path(RUNTIME_STREAM_EVIDENCE_CHECKLIST_PATH)
    artifacts = {
        artifact.get("path", ""): artifact
        for artifact in manifest.get("contract_artifacts", [])
    }
    artifact = artifacts.get(artifact_path)
    if artifact is None:
        errors.append(
            f"manifest must pin runtime stream evidence checklist: {artifact_path}"
        )
        return
    _expect_equal(
        artifact.get("schema"),
        "telemforge.stage09_runtime_stream_evidence_checklist.v1",
        "runtime stream evidence checklist schema",
        errors,
    )
    _expect_equal(
        checklist.get("schema"),
        "telemforge.stage09_runtime_stream_evidence_checklist.v1",
        "runtime_stream_evidence_checklist.schema",
        errors,
    )
    _expect_equal(
        checklist.get("implementation_status"),
        live_contract.get("implementation_status"),
        "runtime_stream_evidence_checklist implementation status",
        errors,
    )
    _expect_equal(
        checklist.get("source_contract"),
        _display_path(DEFAULT_LIVE_CONTRACT_PATH),
        "runtime_stream_evidence_checklist source contract",
        errors,
    )
    _expect_equal(
        checklist.get("baseline_report"),
        _display_path(DEFAULT_REPORT_PATH),
        "runtime_stream_evidence_checklist baseline report",
        errors,
    )
    _expect_equal(
        checklist.get("resource_envelope"),
        manifest.get("resource_envelope"),
        "runtime_stream_evidence_checklist resource envelope",
        errors,
    )

    evidence_gate = live_contract.get("runtime_evidence_gate", {})
    required_evidence = evidence_gate.get("required_before_runtime_claim", [])
    _expect_equal(
        checklist.get("required_evidence"),
        required_evidence,
        "runtime_stream_evidence_checklist required evidence",
        errors,
    )

    report_binding = checklist.get("report_binding", {})
    for binding_path in [
        report_binding.get("dropped_event_metric", ""),
        report_binding.get("dropped_event_target_result", ""),
        report_binding.get("runtime_evidence_gate", ""),
    ]:
        if not _path_exists(report, binding_path):
            errors.append(
                f"runtime stream evidence report binding missing: {binding_path}"
            )

    proof_artifacts = set(evidence_gate.get("proof_artifacts", []))
    checklist_items = checklist.get("probe_checklist", [])
    _expect_equal(
        [item.get("evidence") for item in checklist_items],
        required_evidence,
        "runtime stream evidence checklist order",
        errors,
    )
    for item in checklist_items:
        evidence_name = item.get("evidence", "")
        contract_item = evidence_gate.get("evidence_items", {}).get(evidence_name, {})
        _expect_equal(
            item.get("source_contract_gate"),
            "runtime_evidence_gate",
            f"runtime evidence {evidence_name} source gate",
            errors,
        )
        _expect_equal(
            item.get("minimum_probe"),
            contract_item.get("required_runtime_probe"),
            f"runtime evidence {evidence_name} minimum probe",
            errors,
        )
        _expect_equal(
            item.get("claim_status"),
            contract_item.get("claim_status"),
            f"runtime evidence {evidence_name} claim status",
            errors,
        )
        if item.get("required_artifact") not in proof_artifacts:
            errors.append(
                f"runtime evidence {evidence_name} artifact is not in the live "
                "contract proof artifacts"
            )
        required_artifact = item.get("required_artifact", "")
        if required_artifact.startswith("docs/automation") or Path(
            required_artifact
        ).is_absolute():
            errors.append(
                f"runtime evidence {evidence_name} artifact must be public relative"
            )

    _expect_equal(
        checklist.get("forbidden_without_evidence"),
        evidence_gate.get("forbidden_without_evidence"),
        "runtime stream evidence forbidden claims",
        errors,
    )
    public_safety = checklist.get("public_repo_safety", {})
    _expect_equal(
        public_safety.get("includes_docs_automation"),
        False,
        "runtime stream evidence checklist docs/automation safety",
        errors,
    )
    _expect_equal(
        public_safety.get("uses_absolute_local_paths"),
        False,
        "runtime stream evidence checklist absolute path safety",
        errors,
    )
    if "not a whole-project rewrite" not in checklist.get("rust_scope", ""):
        errors.append(
            "runtime_stream_evidence_checklist.rust_scope must keep Rust data-plane scoped"
        )


def _validate_target_result_binding_gate(
    report: dict[str, Any],
    contract: dict[str, Any],
    manifest: dict[str, Any],
    gate: dict[str, Any],
    errors: list[str],
) -> None:
    artifact_path = _display_path(TARGET_RESULT_BINDING_GATE_PATH)
    artifacts = {
        artifact.get("path", ""): artifact
        for artifact in manifest.get("contract_artifacts", [])
    }
    artifact = artifacts.get(artifact_path)
    if artifact is None:
        errors.append(f"manifest must pin target-result binding gate: {artifact_path}")
        return
    _expect_equal(
        artifact.get("schema"),
        "telemforge.stage09_target_result_binding_gate.v1",
        "target result binding gate artifact schema",
        errors,
    )
    _expect_equal(
        gate.get("schema"),
        "telemforge.stage09_target_result_binding_gate.v1",
        "target_result_binding_gate.schema",
        errors,
    )
    _expect_equal(
        gate.get("status"),
        "passed",
        "target_result_binding_gate.status",
        errors,
    )
    _expect_equal(
        gate.get("report_path"),
        _display_path(DEFAULT_REPORT_PATH),
        "target_result_binding_gate.report_path",
        errors,
    )
    _expect_equal(
        gate.get("contract_path"),
        _display_path(DEFAULT_CONTRACT_PATH),
        "target_result_binding_gate.contract_path",
        errors,
    )
    _expect_equal(
        gate.get("baseline_verdict_status"),
        report.get("baseline_verdict", {}).get("status"),
        "target_result_binding_gate baseline verdict",
        errors,
    )
    _expect_equal(
        gate.get("resource_envelope"),
        manifest.get("resource_envelope"),
        "target_result_binding_gate resource envelope",
        errors,
    )

    metric_bindings = contract.get("required_metric_bindings", {})
    gate_bindings = gate.get("metric_bindings", {})
    _expect_equal(
        sorted(gate_bindings),
        sorted(metric_bindings),
        "target_result_binding_gate metric names",
        errors,
    )

    checks = report.get("target_results", {}).get("checks", {})
    for metric_name, binding_path in metric_bindings.items():
        gate_binding = gate_bindings.get(metric_name, {})
        report_check = checks.get(metric_name, {})
        _expect_equal(
            gate_binding.get("report_binding"),
            binding_path,
            f"target_result_binding_gate {metric_name} report binding",
            errors,
        )
        try:
            observed_value = _path_value(report, binding_path)
        except KeyError:
            errors.append(
                f"target_result_binding_gate {metric_name} report binding missing: "
                f"{binding_path}"
            )
            continue
        _expect_equal(
            gate_binding.get("observed"),
            observed_value,
            f"target_result_binding_gate {metric_name} observed",
            errors,
        )
        for field in ["target", "comparison", "unit", "meets_target", "gap_to_target"]:
            _expect_equal(
                gate_binding.get(field),
                report_check.get(field),
                f"target_result_binding_gate {metric_name} {field}",
                errors,
            )

    public_safety = gate.get("public_repo_safety", {})
    _expect_equal(
        public_safety.get("includes_docs_automation"),
        False,
        "target_result_binding_gate docs/automation safety",
        errors,
    )
    _expect_equal(
        public_safety.get("uses_absolute_local_paths"),
        False,
        "target_result_binding_gate absolute path safety",
        errors,
    )
    if "not a whole-project rewrite" not in gate.get("rust_scope", ""):
        errors.append(
            "target_result_binding_gate.rust_scope must keep Rust data-plane scoped"
        )


def _validate_summary(
    summary_text: str,
    report: dict[str, Any],
    errors: list[str],
) -> None:
    verdict = report.get("baseline_verdict", {}).get("status", "")
    required_snippets = [
        f"Status: `{verdict}`",
        "Python/FastAPI",
        "Rust data-plane",
        "P95 alert latency",
        "P95 replay query latency",
        "Dropped events",
    ]
    for snippet in required_snippets:
        if snippet not in summary_text:
            errors.append(f"summary missing snippet: {snippet}")


def _read_json(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as file:
        value = json.load(file)
    if not isinstance(value, dict):
        raise ValidationError(f"{path} must contain a JSON object")
    return value


def _write_json(path: Path, value: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(value, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def _display_path(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT))
    except ValueError:
        return str(path)


def _path_exists(value: dict[str, Any], dotted_path: str) -> bool:
    if not dotted_path:
        return False
    current: Any = value
    for part in dotted_path.split("."):
        if not isinstance(current, dict) or part not in current:
            return False
        current = current[part]
    return True


def _path_value(value: dict[str, Any], dotted_path: str) -> Any:
    current: Any = value
    for part in dotted_path.split("."):
        if not isinstance(current, dict) or part not in current:
            raise KeyError(dotted_path)
        current = current[part]
    return current


def _expect_equal(
    observed: Any,
    expected: Any,
    label: str,
    errors: list[str],
) -> None:
    if observed != expected:
        errors.append(f"{label} mismatch: expected {expected!r}, got {observed!r}")


if __name__ == "__main__":
    raise SystemExit(main())
