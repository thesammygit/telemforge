"""Validate the Stage 09 runtime-stream evidence checklist artifact.

This command reads committed Stage 09 artifacts and emits a deterministic JSON
validation summary for the landed bounded runtime websocket probes. It does not
rerun the benchmark or approve Rust as a whole-project rewrite.
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
DEFAULT_CHECKLIST_PATH = ARTIFACT_ROOT / "stage09-runtime-stream-evidence-checklist.json"
DEFAULT_CONTRACT_PATH = ARTIFACT_ROOT / "stage09-live-telemetry-contract.json"
DEFAULT_REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"


class RuntimeStreamEvidenceChecklistValidationError(Exception):
    """Raised when Stage 09 runtime-stream checklist inputs are inconsistent."""


def validate_stage09_runtime_stream_evidence_checklist(
    checklist_path: Path | str = DEFAULT_CHECKLIST_PATH,
    contract_path: Path | str = DEFAULT_CONTRACT_PATH,
    report_path: Path | str = DEFAULT_REPORT_PATH,
) -> dict[str, Any]:
    """Validate the committed runtime-stream evidence checklist."""

    checklist_path = Path(checklist_path)
    contract_path = Path(contract_path)
    report_path = Path(report_path)
    checklist = _read_json(checklist_path)
    contract = _read_json(contract_path)
    report = _read_json(report_path)

    errors: list[str] = []
    _expect_equal(
        checklist.get("schema"),
        "telemforge.stage09_runtime_stream_evidence_checklist.v1",
        "checklist.schema",
        errors,
    )
    _expect_equal(
        contract.get("schema"),
        "telemforge.stage09_live_telemetry_contract.v1",
        "contract.schema",
        errors,
    )
    _expect_equal(
        report.get("schema"),
        "telemforge.stage09_realtime_baseline.v1",
        "report.schema",
        errors,
    )
    _expect_equal(checklist.get("stage"), report.get("stage"), "checklist.stage", errors)
    _expect_equal(
        checklist.get("implementation_status"),
        contract.get("implementation_status"),
        "checklist implementation status",
        errors,
    )
    _expect_equal(
        checklist.get("source_contract"),
        _display_path(contract_path),
        "checklist source contract path",
        errors,
    )
    _expect_equal(
        checklist.get("baseline_report"),
        _display_path(report_path),
        "checklist baseline report path",
        errors,
    )

    evidence_gate = _require_mapping(
        contract.get("runtime_evidence_gate"),
        "contract.runtime_evidence_gate",
    )
    _expect_equal(
        evidence_gate.get("status"),
        "runtime_verified_bounded_fanout",
        "contract runtime evidence gate status",
        errors,
    )
    required_evidence = evidence_gate.get("required_before_runtime_claim", [])
    _expect_equal(
        checklist.get("required_evidence"),
        required_evidence,
        "checklist required evidence",
        errors,
    )
    _expect_equal(
        checklist.get("forbidden_without_evidence"),
        evidence_gate.get("forbidden_without_evidence"),
        "checklist forbidden claims",
        errors,
    )

    report_binding = _require_mapping(
        checklist.get("report_binding"),
        "checklist.report_binding",
    )
    for binding_name in [
        "dropped_event_metric",
        "dropped_event_target_result",
        "runtime_evidence_gate",
    ]:
        binding_path = str(report_binding.get(binding_name, ""))
        if not binding_path:
            errors.append(f"checklist.report_binding.{binding_name} must be set")
            continue
        if not _path_exists(report, binding_path):
            errors.append(
                f"checklist.report_binding.{binding_name} missing from report: {binding_path}"
            )

    runtime_gate = _path_value(report, str(report_binding.get("runtime_evidence_gate", "")))
    if not isinstance(runtime_gate, dict):
        errors.append(
            "report runtime evidence gate binding must resolve to a JSON object"
        )
    else:
        _expect_equal(
            runtime_gate.get("status"),
            evidence_gate.get("status"),
            "report runtime evidence gate status",
            errors,
        )

    proof_artifacts = set(evidence_gate.get("proof_artifacts", []))
    evidence_items = _require_mapping(
        evidence_gate.get("evidence_items"),
        "contract.runtime_evidence_gate.evidence_items",
    )
    probe_checklist = checklist.get("probe_checklist", [])
    _expect_equal(
        [item.get("evidence") for item in probe_checklist],
        required_evidence,
        "checklist probe order",
        errors,
    )

    claim_status_counts: dict[str, int] = {}
    validated_evidence: list[dict[str, Any]] = []
    for item in probe_checklist:
        evidence_name = str(item.get("evidence", ""))
        contract_item = _require_mapping(
            evidence_items.get(evidence_name),
            f"contract.runtime_evidence_gate.evidence_items.{evidence_name}",
        )
        _expect_equal(
            item.get("source_contract_gate"),
            "runtime_evidence_gate",
            f"{evidence_name} source gate",
            errors,
        )
        _expect_equal(
            item.get("minimum_probe"),
            contract_item.get("required_runtime_probe"),
            f"{evidence_name} minimum probe",
            errors,
        )
        _expect_equal(
            item.get("claim_status"),
            contract_item.get("claim_status"),
            f"{evidence_name} claim status",
            errors,
        )
        required_artifact = str(item.get("required_artifact", ""))
        _expect_equal(
            required_artifact,
            contract_item.get("proof_artifact"),
            f"{evidence_name} required artifact must match contract proof artifact",
            errors,
        )
        if required_artifact not in proof_artifacts:
            errors.append(
                f"{evidence_name} required artifact is not pinned by the live contract"
            )
        if required_artifact.startswith("docs/automation") or Path(required_artifact).is_absolute():
            errors.append(
                f"{evidence_name} required artifact must be public and repo-relative"
            )
        elif not (ROOT / required_artifact).is_file():
            errors.append(
                f"{evidence_name} required artifact must exist: {required_artifact}"
            )

        claim_status = str(item.get("claim_status", ""))
        claim_status_counts[claim_status] = claim_status_counts.get(claim_status, 0) + 1
        validated_evidence.append(
            {
                "evidence": evidence_name,
                "minimum_probe": item.get("minimum_probe"),
                "required_artifact": required_artifact,
                "claim_status": claim_status,
            }
        )

    public_repo_safety = _require_mapping(
        checklist.get("public_repo_safety"),
        "checklist.public_repo_safety",
    )
    _expect_equal(
        public_repo_safety.get("paths_are_repo_relative"),
        True,
        "checklist public repo paths_are_repo_relative",
        errors,
    )
    for field_name in [
        "includes_docs_automation",
        "uses_absolute_local_paths",
        "uses_credentials",
        "uses_private_runtime_state",
    ]:
        _expect_equal(
            public_repo_safety.get(field_name),
            False,
            f"checklist public repo safety {field_name}",
            errors,
        )

    rust_scope = str(checklist.get("rust_scope", ""))
    if "not a whole-project rewrite" not in rust_scope:
        errors.append("checklist.rust_scope must reject a whole-project rewrite")

    if errors:
        raise RuntimeStreamEvidenceChecklistValidationError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_runtime_stream_evidence_validation.v1",
        "status": "passed",
        "stage": checklist.get("stage"),
        "task_id": checklist.get("task_id"),
        "checklist_path": _display_path(checklist_path),
        "contract_path": _display_path(contract_path),
        "report_path": _display_path(report_path),
        "implementation_status": checklist.get("implementation_status"),
        "runtime_stream_claim_status": evidence_gate.get("status"),
        "required_evidence_count": len(required_evidence),
        "claim_status_counts": claim_status_counts,
        "validated_evidence": validated_evidence,
        "forbidden_without_evidence": checklist.get("forbidden_without_evidence"),
        "report_binding": report_binding,
        "public_repo_safety": public_repo_safety,
        "rust_scope": checklist.get("rust_scope"),
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate the Stage 09 runtime-stream evidence checklist."
    )
    parser.add_argument(
        "--checklist",
        default=str(DEFAULT_CHECKLIST_PATH.relative_to(ROOT)),
    )
    parser.add_argument(
        "--contract",
        default=str(DEFAULT_CONTRACT_PATH.relative_to(ROOT)),
    )
    parser.add_argument(
        "--report",
        default=str(DEFAULT_REPORT_PATH.relative_to(ROOT)),
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON validation summary path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = validate_stage09_runtime_stream_evidence_checklist(
            checklist_path=args.checklist,
            contract_path=args.contract,
            report_path=args.report,
        )
    except (
        OSError,
        json.JSONDecodeError,
        RuntimeStreamEvidenceChecklistValidationError,
        KeyError,
    ) as error:
        print(
            f"Stage 09 runtime-stream evidence checklist validation failed:\n{error}",
            file=sys.stderr,
        )
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
        raise RuntimeStreamEvidenceChecklistValidationError(
            f"{label} must be a JSON object"
        )
    return value


def _expect_equal(left: Any, right: Any, label: str, errors: list[str]) -> None:
    if left != right:
        errors.append(f"{label} mismatch: expected {right!r}, got {left!r}")


def _path_exists(value: Any, dotted_path: str) -> bool:
    try:
        _path_value(value, dotted_path)
    except KeyError:
        return False
    return True


def _path_value(value: Any, dotted_path: str) -> Any:
    current = value
    for segment in dotted_path.split("."):
        if not segment:
            raise KeyError(dotted_path)
        if not isinstance(current, dict) or segment not in current:
            raise KeyError(dotted_path)
        current = current[segment]
    return current


def _display_path(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT))
    except ValueError:
        return str(path)


if __name__ == "__main__":
    raise SystemExit(main())
