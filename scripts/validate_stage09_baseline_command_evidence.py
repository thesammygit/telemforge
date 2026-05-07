"""Validate the Stage 09 baseline command-evidence artifact.

This command checks the committed benchmark command scaffold without rerunning
the benchmark, opening a websocket, or approving Rust as a whole-project
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
DEFAULT_REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
DEFAULT_MANIFEST_PATH = ARTIFACT_ROOT / "stage09-baseline-verification-manifest.json"
DEFAULT_COMMAND_EVIDENCE_PATH = ARTIFACT_ROOT / "stage09-baseline-command-evidence.json"


class CommandEvidenceValidationError(Exception):
    """Raised when Stage 09 command-evidence inputs are inconsistent."""


def validate_stage09_baseline_command_evidence(
    report_path: Path | str = DEFAULT_REPORT_PATH,
    manifest_path: Path | str = DEFAULT_MANIFEST_PATH,
    command_evidence_path: Path | str = DEFAULT_COMMAND_EVIDENCE_PATH,
) -> dict[str, Any]:
    """Validate the committed Stage 09 baseline command evidence."""

    report_path = Path(report_path)
    manifest_path = Path(manifest_path)
    command_evidence_path = Path(command_evidence_path)
    report = _read_json(report_path)
    manifest = _read_json(manifest_path)
    command_evidence = _read_json(command_evidence_path)

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
        command_evidence.get("schema"),
        "telemforge.stage09_baseline_command_evidence.v1",
        "command_evidence.schema",
        errors,
    )
    _expect_equal(command_evidence.get("stage"), report.get("stage"), "stage", errors)
    _expect_equal(
        command_evidence.get("task_id"),
        manifest.get("task_id"),
        "task_id",
        errors,
    )

    benchmark_command = command_evidence.get("benchmark_command")
    required_outputs = command_evidence.get("required_outputs")
    resource_envelope = command_evidence.get("resource_envelope")
    verification_contract = report.get("verification_contract", {})

    _expect_equal(
        benchmark_command,
        verification_contract.get("command"),
        "benchmark command vs report verification contract",
        errors,
    )
    _expect_equal(
        benchmark_command,
        manifest.get("benchmark", {}).get("command"),
        "benchmark command vs manifest",
        errors,
    )
    _expect_equal(
        required_outputs,
        verification_contract.get("required_outputs"),
        "required outputs vs report verification contract",
        errors,
    )
    _expect_equal(
        resource_envelope,
        manifest.get("resource_envelope"),
        "resource envelope vs manifest",
        errors,
    )
    _expect_equal(
        command_evidence.get("runtime_claim_status"),
        "not_claimed",
        "runtime claim status",
        errors,
    )

    _validate_required_outputs(required_outputs, errors)
    public_repo_safety = _require_mapping(
        command_evidence.get("public_repo_safety"),
        "command_evidence.public_repo_safety",
    )
    _expect_equal(
        public_repo_safety.get("paths_are_repo_relative"),
        True,
        "public_repo_safety.paths_are_repo_relative",
        errors,
    )
    _expect_equal(
        public_repo_safety.get("includes_docs_automation"),
        False,
        "public_repo_safety.includes_docs_automation",
        errors,
    )
    _expect_equal(
        public_repo_safety.get("uses_absolute_local_paths"),
        False,
        "public_repo_safety.uses_absolute_local_paths",
        errors,
    )
    _expect_equal(
        public_repo_safety.get("uses_credentials"),
        False,
        "public_repo_safety.uses_credentials",
        errors,
    )
    _expect_equal(
        public_repo_safety.get("uses_private_runtime_state"),
        False,
        "public_repo_safety.uses_private_runtime_state",
        errors,
    )

    rust_scope = str(command_evidence.get("rust_scope", ""))
    if "not a whole-project rewrite" not in rust_scope:
        errors.append("command_evidence.rust_scope must reject a whole-project rewrite")

    if errors:
        raise CommandEvidenceValidationError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_baseline_command_evidence_validation.v1",
        "status": "passed",
        "stage": report.get("stage"),
        "task_id": manifest.get("task_id"),
        "report_path": _display_path(report_path),
        "manifest_path": _display_path(manifest_path),
        "command_evidence_path": _display_path(command_evidence_path),
        "benchmark_command": benchmark_command,
        "required_outputs": required_outputs,
        "resource_envelope": resource_envelope,
        "runtime_claim_status": command_evidence.get("runtime_claim_status"),
        "public_repo_safety": public_repo_safety,
        "rust_scope": rust_scope,
        "verified_gates": [
            "command_matches_report_verification_contract",
            "command_matches_manifest",
            "required_outputs_match_report",
            "required_outputs_exist",
            "resource_envelope_matches_manifest",
            "runtime_claim_not_claimed",
            "public_paths_are_repo_relative",
            "docs_automation_excluded",
            "rust_scope_data_plane_only",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate the Stage 09 baseline command-evidence artifact."
    )
    parser.add_argument("--report", default=str(DEFAULT_REPORT_PATH.relative_to(ROOT)))
    parser.add_argument(
        "--manifest",
        default=str(DEFAULT_MANIFEST_PATH.relative_to(ROOT)),
    )
    parser.add_argument(
        "--command-evidence",
        default=str(DEFAULT_COMMAND_EVIDENCE_PATH.relative_to(ROOT)),
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON validation summary path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = validate_stage09_baseline_command_evidence(
            report_path=args.report,
            manifest_path=args.manifest,
            command_evidence_path=args.command_evidence,
        )
    except (
        OSError,
        json.JSONDecodeError,
        CommandEvidenceValidationError,
    ) as error:
        print(
            f"Stage 09 baseline command evidence validation failed:\n{error}",
            file=sys.stderr,
        )
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _validate_required_outputs(outputs: Any, errors: list[str]) -> None:
    if not isinstance(outputs, list) or not outputs:
        errors.append("command_evidence.required_outputs must be a non-empty list")
        return

    for output in outputs:
        if not isinstance(output, str) or not output:
            errors.append("command_evidence.required_outputs must contain path strings")
            continue
        if Path(output).is_absolute():
            errors.append(f"required output must be repo-relative: {output}")
        if output.startswith("docs/automation") or "/docs/automation/" in output:
            errors.append(
                f"required output must not reference docs/automation: {output}"
            )
        if not (ROOT / output).exists():
            errors.append(f"required output does not exist: {output}")


def _read_json(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return _require_mapping(data, str(path))


def _write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _require_mapping(value: Any, label: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise CommandEvidenceValidationError(f"{label} must be a JSON object")
    return value


def _expect_equal(
    actual: Any,
    expected: Any,
    label: str,
    errors: list[str],
) -> None:
    if actual != expected:
        errors.append(f"{label} mismatch: expected {expected!r}, got {actual!r}")


def _display_path(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT))
    except ValueError:
        return str(path)


if __name__ == "__main__":
    raise SystemExit(main())
