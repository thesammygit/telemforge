"""Validate the deterministic Stage 09 baseline review packet.

This command checks that the checked-in public review packet still matches the
current acceptance matrix, closeout gate, and command evidence. It does not
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

from scripts.summarize_stage09_baseline_review_packet import (  # noqa: E402
    Stage09BaselineReviewPacketError,
    summarize_stage09_baseline_review_packet,
)

ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
DEFAULT_REVIEW_PACKET_PATH = ARTIFACT_ROOT / "stage09-baseline-review-packet.json"


class Stage09BaselineReviewPacketValidationError(Exception):
    """Raised when the Stage 09 baseline review packet is stale or unsafe."""


def validate_stage09_baseline_review_packet(
    review_packet_path: Path | str = DEFAULT_REVIEW_PACKET_PATH,
) -> dict[str, Any]:
    """Validate that the public review packet matches current source artifacts."""

    review_packet_path = Path(review_packet_path)
    checked = _read_json(review_packet_path)
    expected = summarize_stage09_baseline_review_packet()

    errors: list[str] = []
    comparable_fields = [
        "schema",
        "status",
        "stage",
        "task_id",
        "source_artifacts",
        "benchmark_command",
        "required_outputs",
        "target_counts",
        "passed_metrics",
        "missed_metrics",
        "runtime_claims",
        "blocking_reasons",
        "required_next_evidence",
        "next_comparable_candidate",
        "aggregate_digest",
        "stable_fingerprint",
        "resource_envelope",
        "public_repo_safety",
        "rust_scope",
        "reviewer_checks",
    ]
    for field in comparable_fields:
        _expect_equal(
            checked.get(field),
            expected.get(field),
            f"review_packet.{field}",
            errors,
        )

    _expect_equal(
        checked.get("status"),
        "baseline_verified_runtime_blocked",
        "review_packet.status",
        errors,
    )
    runtime_claims = checked.get("runtime_claims")
    if not isinstance(runtime_claims, dict):
        errors.append("review_packet.runtime_claims must be a JSON object")
    else:
        _expect_equal(
            runtime_claims.get("stream_runtime_claim_status"),
            "contract_only_blocked",
            "review_packet.runtime_claims.stream_runtime_claim_status",
            errors,
        )
        _expect_equal(
            runtime_claims.get("candidate_can_be_promoted"),
            False,
            "review_packet.runtime_claims.candidate_can_be_promoted",
            errors,
        )

    _validate_public_safety(checked.get("public_repo_safety"), errors)
    for source_path in _require_path_values(
        checked.get("source_artifacts"),
        "review_packet.source_artifacts",
        errors,
    ):
        _validate_public_path(source_path, errors)

    if "not a whole-project rewrite" not in str(checked.get("rust_scope", "")):
        errors.append("review_packet.rust_scope must reject a whole-project rewrite")

    if errors:
        raise Stage09BaselineReviewPacketValidationError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_baseline_review_packet_validation.v1",
        "status": "passed",
        "stage": checked.get("stage"),
        "task_id": checked.get("task_id"),
        "review_packet_path": _display_path(review_packet_path),
        "target_counts": checked.get("target_counts"),
        "runtime_claims": checked.get("runtime_claims"),
        "blocking_reasons": checked.get("blocking_reasons"),
        "required_next_evidence": checked.get("required_next_evidence"),
        "next_comparable_candidate": checked.get("next_comparable_candidate"),
        "aggregate_digest": checked.get("aggregate_digest"),
        "stable_fingerprint": checked.get("stable_fingerprint"),
        "resource_envelope": checked.get("resource_envelope"),
        "public_repo_safety": checked.get("public_repo_safety"),
        "rust_scope": "Rust data-plane candidate only; not a whole-project rewrite",
        "verified_gates": [
            "review_packet_matches_current_source_artifacts",
            "public_paths_are_repo_relative",
            "docs_automation_excluded",
            "runtime_stream_claim_blocked",
            "candidate_promotion_blocked",
            "rust_scope_data_plane_only",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate the Stage 09 baseline review packet."
    )
    parser.add_argument(
        "--review-packet",
        default=DEFAULT_REVIEW_PACKET_PATH,
        help="Review-packet JSON path to validate.",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON validation-summary path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = validate_stage09_baseline_review_packet(args.review_packet)
    except (
        OSError,
        json.JSONDecodeError,
        Stage09BaselineReviewPacketError,
        Stage09BaselineReviewPacketValidationError,
    ) as error:
        print(
            f"Stage 09 baseline review-packet validation failed:\n{error}",
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
        raise Stage09BaselineReviewPacketValidationError(
            f"{_display_path(path)} must be a JSON object"
        )
    return data


def _write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _require_path_values(
    value: Any,
    label: str,
    errors: list[str],
) -> list[str]:
    if not isinstance(value, dict):
        errors.append(f"{label} must be a JSON object")
        return []
    paths: list[str] = []
    for key, raw_path in value.items():
        if not isinstance(raw_path, str):
            errors.append(f"{label}.{key} must be a path string")
            continue
        paths.append(raw_path)
    return paths


def _validate_public_safety(value: Any, errors: list[str]) -> None:
    if not isinstance(value, dict):
        errors.append("review_packet.public_repo_safety must be a JSON object")
        return
    expected = {
        "paths_are_repo_relative": True,
        "includes_docs_automation": False,
        "uses_absolute_local_paths": False,
        "uses_credentials": False,
        "uses_private_runtime_state": False,
    }
    for key, expected_value in expected.items():
        _expect_equal(
            value.get(key),
            expected_value,
            f"review_packet.public_repo_safety.{key}",
            errors,
        )


def _validate_public_path(path: str, errors: list[str]) -> None:
    if path.startswith("/"):
        errors.append(f"source path must be repo-relative: {path}")
    if ".." in Path(path).parts:
        errors.append(f"source path must not escape repo root: {path}")
    if path.startswith("docs/automation/") or "docs/automation" in path:
        errors.append(f"source path must not reference docs/automation: {path}")


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
