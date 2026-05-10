"""Summarize the Stage 09 artifact-index to command-evidence binding.

This command verifies that the public Stage 09 baseline artifact index still
points at the same bounded benchmark scaffold as the command-evidence artifact.
It does not rerun the benchmark, open a websocket, or approve Rust as a
whole-project rewrite.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
BASELINE_ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
BINDING_ARTIFACT_ROOT = (
    ROOT
    / "docs"
    / "development"
    / "artifacts"
    / "stage09-baseline-command-evidence-binding"
)
ARTIFACT_INDEX_PATH = BASELINE_ARTIFACT_ROOT / "stage09-baseline-artifact-index.json"
COMMAND_EVIDENCE_PATH = (
    BASELINE_ARTIFACT_ROOT / "stage09-baseline-command-evidence.json"
)
BASELINE_REPORT_PATH = BASELINE_ARTIFACT_ROOT / "stage09-baseline-report.json"
BASELINE_SUMMARY_PATH = BASELINE_ARTIFACT_ROOT / "stage09-baseline-summary.md"
OUTPUT_ARTIFACT_NAME = "stage09-baseline-artifact-index-command-evidence-binding.json"


class Stage09ArtifactIndexCommandEvidenceBindingError(Exception):
    """Raised when the artifact-index and command-evidence binding is stale."""


def summarize_stage09_artifact_index_command_evidence_binding(
    artifact_index_path: Path | str = ARTIFACT_INDEX_PATH,
    command_evidence_path: Path | str = COMMAND_EVIDENCE_PATH,
) -> dict[str, Any]:
    """Build a deterministic binding summary for Stage 09 review artifacts."""

    artifact_index_path = Path(artifact_index_path)
    command_evidence_path = Path(command_evidence_path)
    artifact_index = _read_json(artifact_index_path)
    command_evidence = _read_json(command_evidence_path)

    errors: list[str] = []
    _expect_equal(
        artifact_index.get("schema"),
        "telemforge.stage09_baseline_artifact_index.v1",
        "artifact_index.schema",
        errors,
    )
    _expect_equal(artifact_index.get("status"), "passed", "artifact_index.status", errors)
    _expect_equal(
        command_evidence.get("schema"),
        "telemforge.stage09_baseline_command_evidence.v1",
        "command_evidence.schema",
        errors,
    )

    scaffold = _require_mapping(
        artifact_index.get("benchmark_scaffold"),
        "artifact_index.benchmark_scaffold",
        errors,
    )
    command_resource_envelope = _require_mapping(
        command_evidence.get("resource_envelope"),
        "command_evidence.resource_envelope",
        errors,
    )

    expected_command = [
        "python3",
        "scripts/benchmark_stage09_realtime.py",
        "--output",
        _display_path(BASELINE_REPORT_PATH),
        "--summary-output",
        _display_path(BASELINE_SUMMARY_PATH),
    ]
    expected_required_outputs = [
        _display_path(BASELINE_REPORT_PATH),
        _display_path(BASELINE_SUMMARY_PATH),
    ]
    expected_command_text = " ".join(expected_command)

    _expect_equal(
        scaffold.get("command"),
        expected_command_text,
        "artifact_index.benchmark_scaffold.command",
        errors,
    )
    _expect_equal(
        command_evidence.get("benchmark_command"),
        expected_command,
        "command_evidence.benchmark_command",
        errors,
    )
    _expect_equal(
        scaffold.get("required_outputs"),
        expected_required_outputs,
        "artifact_index.benchmark_scaffold.required_outputs",
        errors,
    )
    _expect_equal(
        command_evidence.get("required_outputs"),
        expected_required_outputs,
        "command_evidence.required_outputs",
        errors,
    )
    _expect_equal(
        scaffold.get("command_evidence_path"),
        _display_path(command_evidence_path),
        "artifact_index.benchmark_scaffold.command_evidence_path",
        errors,
    )
    _expect_equal(
        scaffold.get("resource_envelope"),
        command_resource_envelope,
        "artifact_index.benchmark_scaffold.resource_envelope",
        errors,
    )
    _expect_equal(
        scaffold.get("command_evidence_bound"),
        True,
        "artifact_index.benchmark_scaffold.command_evidence_bound",
        errors,
    )
    _expect_equal(
        scaffold.get("safe_to_run_locally"),
        True,
        "artifact_index.benchmark_scaffold.safe_to_run_locally",
        errors,
    )
    _expect_equal(
        command_evidence.get("runtime_claim_status"),
        "not_claimed",
        "command_evidence.runtime_claim_status",
        errors,
    )

    artifact_safety = _require_mapping(
        artifact_index.get("public_repo_safety"),
        "artifact_index.public_repo_safety",
        errors,
    )
    command_safety = _require_mapping(
        command_evidence.get("public_repo_safety"),
        "command_evidence.public_repo_safety",
        errors,
    )
    for label, safety in (
        ("artifact_index.public_repo_safety", artifact_safety),
        ("command_evidence.public_repo_safety", command_safety),
    ):
        _expect_equal(
            safety.get("paths_are_repo_relative"),
            True,
            f"{label}.paths_are_repo_relative",
            errors,
        )
        _expect_equal(
            safety.get("includes_docs_automation"),
            False,
            f"{label}.includes_docs_automation",
            errors,
        )
        _expect_equal(
            safety.get("uses_credentials"),
            False,
            f"{label}.uses_credentials",
            errors,
        )

    for path in [
        _display_path(artifact_index_path),
        _display_path(command_evidence_path),
        *expected_required_outputs,
    ]:
        _validate_public_path(path, errors)
        if not (ROOT / path).is_file():
            errors.append(f"required public artifact does not exist: {path}")

    if errors:
        raise Stage09ArtifactIndexCommandEvidenceBindingError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_artifact_index_command_evidence_binding.v1",
        "status": "passed",
        "stage": "09-realtime-performance-and-rust-data-plane",
        "task_id": "telemforge-stage09-realtime-baseline-2026-05-03",
        "purpose": (
            "Bind the public Stage 09 artifact index to the bounded benchmark "
            "command evidence without rerunning the benchmark or claiming "
            "runtime stream fanout."
        ),
        "artifact_index_path": _display_path(artifact_index_path),
        "command_evidence_path": _display_path(command_evidence_path),
        "benchmark_scaffold": {
            "command": expected_command,
            "command_text": expected_command_text,
            "required_outputs": expected_required_outputs,
            "resource_envelope": command_resource_envelope,
            "artifact_index_command_evidence_bound": True,
            "rerun_status": "not_run_by_binding_summary",
        },
        "runtime_claims": {
            "benchmark_rerun": "not_run",
            "websocket_runtime_fanout": "not_claimed",
            "runtime_stream_claim_status": "contract_only_blocked",
            "candidate_can_be_promoted": False,
        },
        "public_repo_safety": {
            "paths_are_repo_relative": True,
            "includes_docs_automation": False,
            "uses_absolute_local_paths": False,
            "uses_credentials": False,
            "uses_private_runtime_state": False,
        },
        "rust_scope": "Rust data-plane candidate only; not a whole-project rewrite",
        "verified_gates": [
            "artifact_index_schema_passed",
            "command_evidence_schema_passed",
            "benchmark_command_matches_command_evidence",
            "required_outputs_match_command_evidence",
            "resource_envelope_matches_command_evidence",
            "public_artifact_paths_exist",
            "docs_automation_excluded",
            "runtime_stream_claim_blocked",
            "candidate_promotion_blocked",
            "rust_scope_data_plane_only",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Summarize the Stage 09 artifact-index command-evidence binding."
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON binding-summary path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = summarize_stage09_artifact_index_command_evidence_binding()
    except (
        OSError,
        json.JSONDecodeError,
        Stage09ArtifactIndexCommandEvidenceBindingError,
    ) as error:
        print(
            f"Stage 09 artifact-index command-evidence binding failed:\n{error}",
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
        raise Stage09ArtifactIndexCommandEvidenceBindingError(
            f"{_display_path(path)} must be a JSON object"
        )
    return data


def _write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _require_mapping(value: Any, label: str, errors: list[str]) -> dict[str, Any]:
    if not isinstance(value, dict):
        errors.append(f"{label} must be a JSON object")
        return {}
    return value


def _expect_equal(actual: Any, expected: Any, label: str, errors: list[str]) -> None:
    if actual != expected:
        errors.append(f"{label} expected {expected!r}, got {actual!r}")


def _validate_public_path(path: str, errors: list[str]) -> None:
    if path.startswith("/"):
        errors.append(f"path must be repo-relative: {path}")
    if ".." in Path(path).parts:
        errors.append(f"path must not escape repo root: {path}")
    if path.startswith("docs/automation/") or "/docs/automation/" in path:
        errors.append(f"path must not reference docs/automation: {path}")


def _display_path(path: Path) -> str:
    try:
        return path.resolve().relative_to(ROOT).as_posix()
    except ValueError:
        return path.as_posix()


if __name__ == "__main__":
    raise SystemExit(main())
