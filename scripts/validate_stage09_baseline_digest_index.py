"""Validate the deterministic Stage 09 baseline digest index.

This command recomputes the committed public Stage 09 digest index and checks
that the checked-in artifact still matches current file bytes. It does not
rerun the benchmark, open a websocket, or approve Rust as a whole-project
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

from scripts.summarize_stage09_baseline_digest_index import (  # noqa: E402
    summarize_stage09_baseline_digest_index,
)

ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
DEFAULT_DIGEST_INDEX_PATH = ARTIFACT_ROOT / "stage09-baseline-digest-index.json"


class BaselineDigestValidationError(Exception):
    """Raised when the Stage 09 baseline digest index is stale or unsafe."""


def validate_stage09_baseline_digest_index(
    digest_index_path: Path | str = DEFAULT_DIGEST_INDEX_PATH,
) -> dict[str, Any]:
    """Validate that the public digest index matches current Stage 09 files."""

    digest_index_path = Path(digest_index_path)
    checked = _read_json(digest_index_path)
    expected = summarize_stage09_baseline_digest_index()

    errors: list[str] = []
    _expect_equal(
        checked.get("schema"),
        "telemforge.stage09_baseline_digest_index.v1",
        "digest_index.schema",
        errors,
    )
    _expect_equal(
        checked.get("status"),
        "baseline_digest_index_ready",
        "digest_index.status",
        errors,
    )

    comparable_fields = [
        "stage",
        "task_id",
        "source_artifact_count",
        "source_artifacts",
        "aggregate_digest",
        "stable_fingerprint",
        "runtime_claims",
        "next_comparable_candidate",
        "public_repo_safety",
        "resource_envelope",
        "rust_scope",
        "verified_gates",
    ]
    for field in comparable_fields:
        _expect_equal(
            checked.get(field),
            expected.get(field),
            f"digest_index.{field}",
            errors,
        )

    for source in _require_list(
        checked.get("source_artifacts"),
        "digest_index.source_artifacts",
        errors,
    ):
        if not isinstance(source, dict):
            errors.append("digest_index.source_artifacts entries must be objects")
            continue
        _validate_public_path(str(source.get("path", "")), errors)
        _expect_sha256(str(source.get("sha256", "")), source.get("path"), errors)

    public_safety = checked.get("public_repo_safety")
    if not isinstance(public_safety, dict):
        errors.append("digest_index.public_repo_safety must be a JSON object")
    else:
        _expect_equal(
            public_safety.get("paths_are_repo_relative"),
            True,
            "digest_index.public_repo_safety.paths_are_repo_relative",
            errors,
        )
        _expect_equal(
            public_safety.get("includes_docs_automation"),
            False,
            "digest_index.public_repo_safety.includes_docs_automation",
            errors,
        )
        _expect_equal(
            public_safety.get("uses_absolute_local_paths"),
            False,
            "digest_index.public_repo_safety.uses_absolute_local_paths",
            errors,
        )
        _expect_equal(
            public_safety.get("uses_credentials"),
            False,
            "digest_index.public_repo_safety.uses_credentials",
            errors,
        )
        _expect_equal(
            public_safety.get("uses_private_runtime_state"),
            False,
            "digest_index.public_repo_safety.uses_private_runtime_state",
            errors,
        )

    runtime_claims = checked.get("runtime_claims")
    if not isinstance(runtime_claims, dict):
        errors.append("digest_index.runtime_claims must be a JSON object")
    else:
        _expect_equal(
            runtime_claims.get("stream_runtime_claim_status"),
            "contract_only_blocked",
            "digest_index.runtime_claims.stream_runtime_claim_status",
            errors,
        )
        _expect_equal(
            runtime_claims.get("candidate_can_be_promoted"),
            False,
            "digest_index.runtime_claims.candidate_can_be_promoted",
            errors,
        )

    if "not a whole-project rewrite" not in str(checked.get("rust_scope", "")):
        errors.append("digest_index.rust_scope must reject a whole-project rewrite")

    if errors:
        raise BaselineDigestValidationError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_baseline_digest_validation.v1",
        "status": "passed",
        "stage": checked.get("stage"),
        "task_id": checked.get("task_id"),
        "digest_index_path": _display_path(digest_index_path),
        "source_artifact_count": checked.get("source_artifact_count"),
        "aggregate_digest": checked.get("aggregate_digest"),
        "stable_fingerprint": checked.get("stable_fingerprint"),
        "runtime_claims": checked.get("runtime_claims"),
        "next_comparable_candidate": checked.get("next_comparable_candidate"),
        "public_repo_safety": checked.get("public_repo_safety"),
        "resource_envelope": checked.get("resource_envelope"),
        "rust_scope": "Rust data-plane candidate only; not a whole-project rewrite",
        "verified_gates": [
            "digest_index_matches_current_public_artifacts",
            "source_artifacts_have_sha256",
            "aggregate_digest_matches_current_file_bytes",
            "public_paths_are_repo_relative",
            "docs_automation_excluded",
            "runtime_stream_claim_blocked",
            "candidate_promotion_blocked",
            "rust_scope_data_plane_only",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate the Stage 09 baseline digest index."
    )
    parser.add_argument(
        "--digest-index",
        default=DEFAULT_DIGEST_INDEX_PATH,
        help="Digest-index JSON path to validate.",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON validation-summary path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = validate_stage09_baseline_digest_index(args.digest_index)
    except (
        OSError,
        json.JSONDecodeError,
        BaselineDigestValidationError,
    ) as error:
        print(f"Stage 09 baseline digest validation failed:\n{error}", file=sys.stderr)
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _read_json(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise BaselineDigestValidationError(f"{_display_path(path)} must be an object")
    return data


def _write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _require_list(value: Any, label: str, errors: list[str]) -> list[Any]:
    if not isinstance(value, list):
        errors.append(f"{label} must be a list")
        return []
    return value


def _validate_public_path(path: str, errors: list[str]) -> None:
    if path.startswith("/"):
        errors.append(f"source path must be repo-relative: {path}")
    if ".." in Path(path).parts:
        errors.append(f"source path must not escape repo root: {path}")
    if path.startswith("docs/automation/"):
        errors.append(f"source path must not reference docs/automation: {path}")


def _expect_sha256(value: str, path: Any, errors: list[str]) -> None:
    if len(value) != 64 or any(
        character not in "0123456789abcdef" for character in value
    ):
        errors.append(f"source artifact {path!r} must have a lowercase sha256 digest")


def _expect_equal(
    actual: Any,
    expected: Any,
    label: str,
    errors: list[str],
) -> None:
    if actual != expected:
        errors.append(f"{label} expected {expected!r}, got {actual!r}")


def _display_path(path: Path) -> str:
    try:
        return path.resolve().relative_to(ROOT).as_posix()
    except ValueError:
        return path.as_posix()


if __name__ == "__main__":
    raise SystemExit(main())
