"""Check Stage 09 runtime-stream proof-artifact bindings.

This command reads the committed live telemetry contract and runtime-stream
evidence checklist, then emits a deterministic summary of the proof artifacts
that must exist before runtime websocket fanout can be claimed. It does not
open a websocket, rerun the benchmark, or approve Rust as a whole-project
rewrite.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.validate_stage09_runtime_stream_evidence_checklist import (  # noqa: E402
    DEFAULT_CHECKLIST_PATH,
    DEFAULT_CONTRACT_PATH,
    DEFAULT_REPORT_PATH,
    RuntimeStreamEvidenceChecklistValidationError,
    validate_stage09_runtime_stream_evidence_checklist,
)


class RuntimeStreamProofArtifactGateError(Exception):
    """Raised when proof-artifact bindings drift from public-safe paths."""


def check_stage09_runtime_stream_proof_artifacts(
    checklist_path: Path | str = DEFAULT_CHECKLIST_PATH,
    contract_path: Path | str = DEFAULT_CONTRACT_PATH,
    report_path: Path | str = DEFAULT_REPORT_PATH,
) -> dict[str, Any]:
    """Build a deterministic proof-artifact gate from public Stage 09 evidence."""

    validation = validate_stage09_runtime_stream_evidence_checklist(
        checklist_path=checklist_path,
        contract_path=contract_path,
        report_path=report_path,
    )
    contract = _read_json(Path(contract_path))
    evidence_gate = _require_mapping(
        contract.get("runtime_evidence_gate"),
        "contract.runtime_evidence_gate",
    )
    contract_proof_artifacts = evidence_gate.get("proof_artifacts")
    if not isinstance(contract_proof_artifacts, list) or not all(
        isinstance(path, str) for path in contract_proof_artifacts
    ):
        raise RuntimeStreamProofArtifactGateError(
            "contract.runtime_evidence_gate.proof_artifacts must be a string list"
        )

    errors: list[str] = []
    required_artifacts = []
    for item in validation.get("validated_evidence", []):
        if not isinstance(item, dict):
            errors.append("validated_evidence entries must be objects")
            continue
        required_artifact = str(item.get("required_artifact", ""))
        _validate_public_path(required_artifact, errors)
        if required_artifact not in contract_proof_artifacts:
            errors.append(
                f"required artifact is not pinned by contract: {required_artifact}"
            )
        required_artifacts.append(required_artifact)

    unique_required_artifacts = sorted(set(required_artifacts))
    extra_contract_proof_artifacts = sorted(
        set(contract_proof_artifacts) - set(required_artifacts)
    )
    for proof_artifact in extra_contract_proof_artifacts:
        _validate_public_path(proof_artifact, errors)

    if validation.get("runtime_stream_claim_status") != "contract_only_blocked":
        errors.append("runtime stream claim must remain contract_only_blocked")
    if validation.get("claim_status_counts") != {"not_claimed_until_runtime_test": 6}:
        errors.append("runtime proof artifacts must remain unclaimed until runtime tests")

    public_repo_safety = _require_mapping(
        validation.get("public_repo_safety"),
        "validation.public_repo_safety",
    )
    if public_repo_safety.get("includes_docs_automation") is not False:
        errors.append("proof artifact gate must exclude docs/automation")
    if public_repo_safety.get("paths_are_repo_relative") is not True:
        errors.append("proof artifact gate paths must be repo-relative")

    if "not a whole-project rewrite" not in str(validation.get("rust_scope", "")):
        errors.append("rust scope must reject a whole-project rewrite")

    if errors:
        raise RuntimeStreamProofArtifactGateError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_runtime_stream_proof_artifact_gate.v1",
        "status": "runtime_stream_proof_artifacts_ready_runtime_blocked",
        "stage": validation.get("stage"),
        "task_id": validation.get("task_id"),
        "checklist_path": validation.get("checklist_path"),
        "contract_path": validation.get("contract_path"),
        "report_path": validation.get("report_path"),
        "runtime_stream_claim_status": validation.get("runtime_stream_claim_status"),
        "required_evidence_count": validation.get("required_evidence_count"),
        "required_artifact_count": len(required_artifacts),
        "unique_required_artifact_count": len(unique_required_artifacts),
        "unique_required_artifacts": unique_required_artifacts,
        "extra_contract_proof_artifacts": extra_contract_proof_artifacts,
        "claim_status_counts": validation.get("claim_status_counts"),
        "public_repo_safety": public_repo_safety,
        "rust_scope": validation.get("rust_scope"),
        "verified_gates": [
            "runtime_stream_evidence_validation_passed",
            "required_artifacts_are_pinned_by_contract",
            "required_artifacts_exist",
            "required_artifacts_are_repo_relative",
            "docs_automation_excluded",
            "runtime_stream_claim_blocked",
            "rust_scope_data_plane_only",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Check Stage 09 runtime-stream proof-artifact bindings."
    )
    parser.add_argument(
        "--checklist",
        default=DEFAULT_CHECKLIST_PATH,
        help="Runtime-stream evidence checklist JSON path.",
    )
    parser.add_argument(
        "--contract",
        default=DEFAULT_CONTRACT_PATH,
        help="Live telemetry contract JSON path.",
    )
    parser.add_argument(
        "--report",
        default=DEFAULT_REPORT_PATH,
        help="Stage 09 baseline report JSON path.",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON output path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = check_stage09_runtime_stream_proof_artifacts(
            checklist_path=args.checklist,
            contract_path=args.contract,
            report_path=args.report,
        )
    except (
        OSError,
        json.JSONDecodeError,
        RuntimeStreamEvidenceChecklistValidationError,
        RuntimeStreamProofArtifactGateError,
    ) as error:
        print(
            f"Stage 09 runtime-stream proof-artifact gate failed:\n{error}",
            file=sys.stderr,
        )
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _read_json(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise RuntimeStreamProofArtifactGateError(
            f"{_display_path(path)} must be an object"
        )
    return data


def _write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _require_mapping(value: Any, label: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise RuntimeStreamProofArtifactGateError(f"{label} must be a JSON object")
    return value


def _validate_public_path(path: str, errors: list[str]) -> None:
    if not path:
        errors.append("required artifact path must be set")
    if path.startswith("/"):
        errors.append(f"required artifact must be repo-relative: {path}")
    if ".." in Path(path).parts:
        errors.append(f"required artifact must not escape repo root: {path}")
    if path.startswith("docs/automation/") or "/docs/automation/" in path:
        errors.append(f"required artifact must not reference docs/automation: {path}")
    if path and not (ROOT / path).is_file():
        errors.append(f"required artifact must exist: {path}")


def _display_path(path: Path) -> str:
    try:
        return path.resolve().relative_to(ROOT).as_posix()
    except ValueError:
        return path.as_posix()


if __name__ == "__main__":
    raise SystemExit(main())
