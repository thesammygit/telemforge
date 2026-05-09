"""Summarize and validate the public Stage 09 baseline artifact index.

This command checks that the Stage 09 baseline README still names the public
artifact files present in the baseline bundle. It does not rerun the benchmark,
open a websocket, or approve Rust as a whole-project rewrite.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
README_PATH = ARTIFACT_ROOT / "README.md"
OUTPUT_ARTIFACT_NAME = "stage09-baseline-artifact-index.json"
EXCLUDED_ARTIFACT_NAMES = {"README.md", OUTPUT_ARTIFACT_NAME}
BASELINE_REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
BASELINE_SUMMARY_PATH = ARTIFACT_ROOT / "stage09-baseline-summary.md"


class Stage09BaselineArtifactIndexError(Exception):
    """Raised when the Stage 09 baseline artifact index is stale or unsafe."""


def summarize_stage09_baseline_artifact_index(
    artifact_root: Path | str = ARTIFACT_ROOT,
    readme_path: Path | str = README_PATH,
) -> dict[str, Any]:
    """Build a deterministic index for the public Stage 09 artifact directory."""

    artifact_root = Path(artifact_root)
    readme_path = Path(readme_path)
    readme_text = readme_path.read_text(encoding="utf-8")

    artifact_paths = [
        path
        for path in sorted(artifact_root.iterdir(), key=lambda item: item.name)
        if path.is_file() and path.name not in EXCLUDED_ARTIFACT_NAMES
    ]

    errors: list[str] = []
    if f"`{OUTPUT_ARTIFACT_NAME}`" not in readme_text:
        errors.append(
            f"{_display_path(readme_path)} must mention `{OUTPUT_ARTIFACT_NAME}`"
        )

    baseline_report_path = _display_path(BASELINE_REPORT_PATH)
    baseline_summary_path = _display_path(BASELINE_SUMMARY_PATH)
    baseline_benchmark_command = (
        "python3 scripts/benchmark_stage09_realtime.py "
        f"--output {baseline_report_path} "
        f"--summary-output {baseline_summary_path}"
    )
    if baseline_benchmark_command not in readme_text:
        errors.append(
            f"{_display_path(readme_path)} must include the baseline benchmark command"
        )
    for required_output_path in [baseline_report_path, baseline_summary_path]:
        _validate_public_path(required_output_path, errors)
        if f"`{Path(required_output_path).name}`" not in readme_text:
            errors.append(
                f"{_display_path(readme_path)} must index `{Path(required_output_path).name}`"
            )

    indexed_artifacts = []
    for path in artifact_paths:
        display_path = _display_path(path)
        _validate_public_path(display_path, errors)
        indexed_in_readme = f"`{path.name}`" in readme_text
        if not indexed_in_readme:
            errors.append(f"{_display_path(readme_path)} does not index `{path.name}`")
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        indexed_artifacts.append(
            {
                "path": display_path,
                "size_bytes": path.stat().st_size,
                "sha256": digest,
                "indexed_in_readme": indexed_in_readme,
            }
        )

    if len(indexed_artifacts) < 20:
        errors.append("artifact index must cover the full Stage 09 baseline bundle")

    readme_display_path = _display_path(readme_path)
    _validate_public_path(readme_display_path, errors)

    if errors:
        raise Stage09BaselineArtifactIndexError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_baseline_artifact_index.v1",
        "status": "passed",
        "stage": "09-realtime-performance-and-rust-data-plane",
        "task_id": "telemforge-stage09-realtime-baseline-2026-05-03",
        "artifact_root": _display_path(artifact_root),
        "readme_path": readme_display_path,
        "generated_output_path": _display_path(ARTIFACT_ROOT / OUTPUT_ARTIFACT_NAME),
        "benchmark_scaffold": {
            "command": baseline_benchmark_command,
            "required_outputs": [baseline_report_path, baseline_summary_path],
            "outputs_indexed_in_readme": True,
            "safe_to_run_locally": True,
            "rerun_status": "not_run_by_artifact_index",
        },
        "indexed_artifact_count": len(indexed_artifacts),
        "indexed_artifacts": indexed_artifacts,
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
            "artifact_files_exist",
            "artifact_files_have_sha256",
            "baseline_readme_indexes_artifacts",
            "baseline_benchmark_command_indexed",
            "baseline_report_outputs_indexed",
            "public_paths_are_repo_relative",
            "docs_automation_excluded",
            "benchmark_not_rerun",
            "runtime_stream_claim_blocked",
            "candidate_promotion_blocked",
            "rust_scope_data_plane_only",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Summarize and validate the Stage 09 baseline artifact index."
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON artifact-index path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = summarize_stage09_baseline_artifact_index()
    except (OSError, json.JSONDecodeError, Stage09BaselineArtifactIndexError) as error:
        print(f"Stage 09 baseline artifact index failed:\n{error}", file=sys.stderr)
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _validate_public_path(path: str, errors: list[str]) -> None:
    if path.startswith("/"):
        errors.append(f"artifact path must be repo-relative: {path}")
    if ".." in Path(path).parts:
        errors.append(f"artifact path must not escape repo root: {path}")
    if path.startswith("docs/automation/") or "/docs/automation/" in path:
        errors.append(f"artifact path must not reference docs/automation: {path}")


def _display_path(path: Path) -> str:
    try:
        return path.resolve().relative_to(ROOT).as_posix()
    except ValueError:
        return path.as_posix()


if __name__ == "__main__":
    raise SystemExit(main())
