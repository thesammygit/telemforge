"""Validate the committed Stage 09 baseline command matrix.

This command recomputes the deterministic command matrix, compares it with the
checked-in public artifact, and verifies that every command/output remains
repo-relative and public-safe. It does not rerun the benchmark, open a
websocket, or approve Rust as a whole-project rewrite.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.summarize_stage09_baseline_command_matrix import (  # noqa: E402
    ARTIFACT_ROOT,
    OUTPUT_ARTIFACT_NAME,
    Stage09BaselineCommandMatrixError,
    summarize_stage09_baseline_command_matrix,
)


DEFAULT_MATRIX_PATH = ARTIFACT_ROOT / OUTPUT_ARTIFACT_NAME
EXPECTED_COMMAND_IDS = [
    "baseline_benchmark_report",
    "candidate_report_validator",
    "live_contract_validator",
    "baseline_bundle_verifier",
    "runtime_stream_proof_artifact_gate",
    "baseline_artifact_index",
]


class Stage09BaselineCommandMatrixValidationError(Exception):
    """Raised when the committed command matrix is stale or unsafe."""


def validate_stage09_baseline_command_matrix(
    matrix_path: Path | str = DEFAULT_MATRIX_PATH,
) -> dict[str, Any]:
    """Validate the public Stage 09 command matrix against current sources."""

    matrix_path = Path(matrix_path)
    current_matrix = summarize_stage09_baseline_command_matrix()
    committed_matrix = _read_json(matrix_path)
    expected_bytes = _json_bytes(current_matrix)
    committed_bytes = matrix_path.read_bytes()

    errors: list[str] = []
    if committed_matrix != current_matrix:
        errors.append("committed command matrix does not match regenerated result")
        errors.extend(_top_level_diff(committed_matrix, current_matrix))
    if committed_bytes != expected_bytes:
        errors.append("committed command matrix bytes are not deterministic output")

    _expect_equal(
        committed_matrix.get("schema"),
        "telemforge.stage09_baseline_command_matrix.v1",
        "matrix.schema",
        errors,
    )
    _expect_equal(committed_matrix.get("status"), "passed", "matrix.status", errors)
    _expect_equal(
        committed_matrix.get("task_id"),
        "telemforge-stage09-realtime-baseline-2026-05-03",
        "matrix.task_id",
        errors,
    )

    command_ids = _validate_commands(committed_matrix.get("commands"), errors)
    _expect_equal(command_ids, EXPECTED_COMMAND_IDS, "matrix.command ids", errors)
    _expect_equal(
        committed_matrix.get("command_count"),
        len(EXPECTED_COMMAND_IDS),
        "matrix.command_count",
        errors,
    )

    runtime_claims = _require_mapping(
        committed_matrix.get("runtime_claims"), "matrix.runtime_claims", errors
    )
    _expect_equal(
        runtime_claims.get("benchmark_rerun"),
        "not_run",
        "matrix.runtime_claims.benchmark_rerun",
        errors,
    )
    _expect_equal(
        runtime_claims.get("runtime_stream_claim_status"),
        "contract_only_blocked",
        "matrix.runtime_claims.runtime_stream_claim_status",
        errors,
    )
    _expect_equal(
        runtime_claims.get("candidate_can_be_promoted"),
        False,
        "matrix.runtime_claims.candidate_can_be_promoted",
        errors,
    )

    public_repo_safety = _require_mapping(
        committed_matrix.get("public_repo_safety"),
        "matrix.public_repo_safety",
        errors,
    )
    _expect_equal(
        public_repo_safety.get("paths_are_repo_relative"),
        True,
        "matrix.public_repo_safety.paths_are_repo_relative",
        errors,
    )
    _expect_equal(
        public_repo_safety.get("includes_docs_automation"),
        False,
        "matrix.public_repo_safety.includes_docs_automation",
        errors,
    )
    _expect_equal(
        public_repo_safety.get("uses_credentials"),
        False,
        "matrix.public_repo_safety.uses_credentials",
        errors,
    )

    if "not a whole-project rewrite" not in str(committed_matrix.get("rust_scope", "")):
        errors.append("matrix.rust_scope must reject a whole-project rewrite")

    if errors:
        raise Stage09BaselineCommandMatrixValidationError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_baseline_command_matrix_validation.v1",
        "status": "passed",
        "stage": committed_matrix.get("stage"),
        "task_id": committed_matrix.get("task_id"),
        "matrix_path": _display_path(matrix_path),
        "matrix_sha256": hashlib.sha256(committed_bytes).hexdigest(),
        "regenerated_matrix_sha256": hashlib.sha256(expected_bytes).hexdigest(),
        "matrix_matches_regenerated_result": True,
        "command_count": committed_matrix.get("command_count"),
        "validated_command_ids": command_ids,
        "runtime_claims": runtime_claims,
        "public_repo_safety": public_repo_safety,
        "rust_scope": committed_matrix.get("rust_scope"),
        "verified_gates": [
            "committed_matrix_matches_regenerated_result",
            "committed_matrix_bytes_are_deterministic",
            "command_ids_are_expected",
            "command_outputs_exist",
            "commands_are_repo_relative",
            "docs_automation_excluded",
            "runtime_stream_claim_blocked",
            "candidate_promotion_blocked",
            "rust_scope_data_plane_only",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate the Stage 09 baseline command matrix."
    )
    parser.add_argument(
        "--matrix",
        default=DEFAULT_MATRIX_PATH,
        help="Command matrix JSON path.",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON validation summary path.",
    )
    args = parser.parse_args()

    try:
        result = validate_stage09_baseline_command_matrix(matrix_path=args.matrix)
    except (
        OSError,
        json.JSONDecodeError,
        Stage09BaselineCommandMatrixError,
        Stage09BaselineCommandMatrixValidationError,
    ) as error:
        print(f"Stage 09 command matrix validation failed:\n{error}", file=sys.stderr)
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _validate_commands(value: Any, errors: list[str]) -> list[str]:
    if not isinstance(value, list):
        errors.append("matrix.commands must be a list")
        return []

    command_ids: list[str] = []
    seen_ids: set[str] = set()
    for item in value:
        if not isinstance(item, dict):
            errors.append("matrix.commands entries must be objects")
            continue
        command_id = str(item.get("id", ""))
        if not command_id:
            errors.append("matrix.commands entry missing id")
        if command_id in seen_ids:
            errors.append(f"duplicate command id: {command_id}")
        seen_ids.add(command_id)
        command_ids.append(command_id)

        command = item.get("command")
        if not isinstance(command, list) or not all(
            isinstance(part, str) for part in command
        ):
            errors.append(f"{command_id}.command must be a string list")
        else:
            if command[:1] != ["python3"]:
                errors.append(f"{command_id}.command must use python3")
            if len(command) < 2 or not command[1].startswith("scripts/"):
                errors.append(f"{command_id}.command must call a repo script")
            for part in command:
                _validate_public_text(part, f"{command_id}.command", errors)

        output_paths = item.get("output_paths")
        if not isinstance(output_paths, list) or not all(
            isinstance(path, str) for path in output_paths
        ):
            errors.append(f"{command_id}.output_paths must be a string list")
            continue
        for output_path in output_paths:
            _validate_public_text(output_path, f"{command_id}.output_paths", errors)
            if not output_path.startswith(
                "docs/development/artifacts/stage09-realtime-baseline/"
            ):
                errors.append(f"{command_id}.output_paths not in baseline artifact dir")
            if not (ROOT / output_path).is_file():
                errors.append(f"{command_id}.output_paths missing {output_path}")

    return command_ids


def _read_json(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise Stage09BaselineCommandMatrixValidationError(
            f"{_display_path(path)} must be a JSON object"
        )
    return data


def _write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _json_bytes(data: dict[str, Any]) -> bytes:
    return (json.dumps(data, indent=2, sort_keys=True) + "\n").encode("utf-8")


def _top_level_diff(actual: dict[str, Any], expected: dict[str, Any]) -> list[str]:
    diffs = []
    for key in sorted(set(actual) | set(expected)):
        if actual.get(key) != expected.get(key):
            diffs.append(f"matrix.{key} differs from regenerated result")
    return diffs[:8]


def _validate_public_text(value: str, label: str, errors: list[str]) -> None:
    if value.startswith("/"):
        errors.append(f"{label} must be repo-relative: {value}")
    if ".." in Path(value).parts:
        errors.append(f"{label} must not escape repo root: {value}")
    if value.startswith("docs/automation/") or "/docs/automation/" in value:
        errors.append(f"{label} must not reference docs/automation: {value}")


def _require_mapping(value: Any, label: str, errors: list[str]) -> dict[str, Any]:
    if not isinstance(value, dict):
        errors.append(f"{label} must be a JSON object")
        return {}
    return value


def _expect_equal(actual: Any, expected: Any, label: str, errors: list[str]) -> None:
    if actual != expected:
        errors.append(f"{label} expected {expected!r}, got {actual!r}")


def _display_path(path: Path) -> str:
    try:
        return path.resolve().relative_to(ROOT).as_posix()
    except ValueError:
        return path.as_posix()


if __name__ == "__main__":
    raise SystemExit(main())
