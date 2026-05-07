"""Build a deterministic digest index for Stage 09 baseline artifacts.

This command pins the committed public evidence files that define the current
Python/FastAPI baseline. It does not rerun the benchmark, open a websocket, or
approve Rust as a whole-project rewrite.
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

DEFAULT_SOURCE_PATHS = [
    ARTIFACT_ROOT / "stage09-baseline-report.json",
    ARTIFACT_ROOT / "stage09-baseline-summary.md",
    ARTIFACT_ROOT / "stage09-live-telemetry-contract.json",
    ARTIFACT_ROOT / "stage09-live-contract-validation-summary.json",
    ARTIFACT_ROOT / "rust-data-plane-boundary.md",
    ARTIFACT_ROOT / "first-rust-hot-path-slice.md",
    ARTIFACT_ROOT / "stage09-candidate-report-contract.json",
    ARTIFACT_ROOT / "stage09-report-validation-summary.json",
    ARTIFACT_ROOT / "stage09-baseline-verification-manifest.json",
    ARTIFACT_ROOT / "stage09-baseline-bundle-verification.json",
    ARTIFACT_ROOT / "stage09-baseline-refresh-check.json",
    ARTIFACT_ROOT / "stage09-baseline-command-evidence.json",
    ARTIFACT_ROOT / "stage09-baseline-command-evidence-validation.json",
    ARTIFACT_ROOT / "stage09-input-provenance-validation.json",
    ARTIFACT_ROOT / "stage09-baseline-metric-index.json",
    ARTIFACT_ROOT / "stage09-runtime-stream-evidence-checklist.json",
    ARTIFACT_ROOT / "stage09-runtime-stream-evidence-validation-summary.json",
    ARTIFACT_ROOT / "stage09-target-result-binding-gate.json",
    ARTIFACT_ROOT / "stage09-baseline-readiness-summary.json",
    ARTIFACT_ROOT / "stage09-target-gap-summary.json",
    ARTIFACT_ROOT / "stage09-candidate-promotion-readiness.json",
    ARTIFACT_ROOT / "stage09-candidate-metric-delta.json",
    ARTIFACT_ROOT / "stage09-baseline-evidence-index.json",
]
DEFAULT_METRIC_INDEX_PATH = ARTIFACT_ROOT / "stage09-baseline-metric-index.json"
DEFAULT_EVIDENCE_INDEX_PATH = ARTIFACT_ROOT / "stage09-baseline-evidence-index.json"
DEFAULT_VERIFICATION_MANIFEST_PATH = (
    ARTIFACT_ROOT / "stage09-baseline-verification-manifest.json"
)


class BaselineDigestIndexError(Exception):
    """Raised when Stage 09 digest-index inputs are inconsistent."""


def summarize_stage09_baseline_digest_index(
    source_paths: list[Path | str] | None = None,
    metric_index_path: Path | str = DEFAULT_METRIC_INDEX_PATH,
    evidence_index_path: Path | str = DEFAULT_EVIDENCE_INDEX_PATH,
    verification_manifest_path: Path | str = DEFAULT_VERIFICATION_MANIFEST_PATH,
) -> dict[str, Any]:
    """Build a deterministic digest index for public Stage 09 evidence files."""

    metric_index_path = Path(metric_index_path)
    evidence_index_path = Path(evidence_index_path)
    verification_manifest_path = Path(verification_manifest_path)
    source_paths = [Path(path) for path in (source_paths or DEFAULT_SOURCE_PATHS)]

    metric_index = _read_json(metric_index_path)
    evidence_index = _read_json(evidence_index_path)
    verification_manifest = _read_json(verification_manifest_path)

    errors: list[str] = []
    _expect_equal(
        metric_index.get("schema"),
        "telemforge.stage09_baseline_metric_index.v1",
        "metric_index.schema",
        errors,
    )
    _expect_equal(
        evidence_index.get("schema"),
        "telemforge.stage09_baseline_evidence_index.v1",
        "evidence_index.schema",
        errors,
    )
    _expect_equal(
        verification_manifest.get("schema"),
        "telemforge.stage09_baseline_verification_manifest.v1",
        "verification_manifest.schema",
        errors,
    )

    stage = metric_index.get("stage")
    task_id = metric_index.get("task_id")
    _expect_equal(evidence_index.get("stage"), stage, "evidence_index.stage", errors)
    _expect_equal(
        evidence_index.get("task_id"),
        task_id,
        "evidence_index.task_id",
        errors,
    )
    _expect_equal(
        verification_manifest.get("stage"),
        stage,
        "verification_manifest.stage",
        errors,
    )
    _expect_equal(
        evidence_index.get("runtime_claims", {}).get("stream_runtime_claim_status"),
        "contract_only_blocked",
        "evidence_index.stream_runtime_claim_status",
        errors,
    )
    _expect_equal(
        evidence_index.get("runtime_claims", {}).get("candidate_can_be_promoted"),
        False,
        "evidence_index.candidate_can_be_promoted",
        errors,
    )

    artifacts = []
    aggregate = hashlib.sha256()
    seen_paths: set[str] = set()
    for path in source_paths:
        display_path = _display_path(path)
        if display_path in seen_paths:
            errors.append(f"duplicate source path: {display_path}")
            continue
        seen_paths.add(display_path)
        _validate_public_path(display_path, errors)
        if not path.exists():
            errors.append(f"source artifact missing: {display_path}")
            continue
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        size_bytes = path.stat().st_size
        aggregate.update(display_path.encode("utf-8"))
        aggregate.update(b"\0")
        aggregate.update(str(size_bytes).encode("ascii"))
        aggregate.update(b"\0")
        aggregate.update(digest.encode("ascii"))
        aggregate.update(b"\0")
        artifacts.append(
            {
                "path": display_path,
                "size_bytes": size_bytes,
                "sha256": digest,
            }
        )

    if len(artifacts) < 20:
        errors.append("digest index must pin the full Stage 09 baseline bundle")

    _validate_public_safety(metric_index, "metric_index", errors)
    _validate_public_safety(evidence_index, "evidence_index", errors)
    if "not a whole-project rewrite" not in str(metric_index.get("rust_scope", "")):
        errors.append("metric_index.rust_scope must reject a whole-project rewrite")
    if "not a whole-project rewrite" not in str(evidence_index.get("rust_scope", "")):
        errors.append("evidence_index.rust_scope must reject a whole-project rewrite")

    if errors:
        raise BaselineDigestIndexError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_baseline_digest_index.v1",
        "status": "baseline_digest_index_ready",
        "stage": stage,
        "task_id": task_id,
        "source_artifact_count": len(artifacts),
        "source_artifacts": artifacts,
        "aggregate_digest": {
            "algorithm": "sha256",
            "digest_sha256": aggregate.hexdigest(),
        },
        "stable_fingerprint": metric_index.get("stable_fingerprint"),
        "runtime_claims": evidence_index.get("runtime_claims"),
        "next_comparable_candidate": evidence_index.get("next_comparable_candidate"),
        "public_repo_safety": {
            "paths_are_repo_relative": True,
            "includes_docs_automation": False,
            "uses_absolute_local_paths": False,
            "uses_credentials": False,
            "uses_private_runtime_state": False,
        },
        "resource_envelope": evidence_index.get("resource_envelope"),
        "rust_scope": "Rust data-plane candidate only; not a whole-project rewrite",
        "verified_gates": [
            "source_artifacts_exist",
            "source_artifacts_have_sha256",
            "aggregate_digest_computed",
            "public_paths_are_repo_relative",
            "docs_automation_excluded",
            "runtime_stream_claim_blocked",
            "candidate_promotion_blocked",
            "rust_scope_data_plane_only",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Summarize Stage 09 baseline artifact digests."
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON digest-index path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = summarize_stage09_baseline_digest_index()
    except (
        OSError,
        json.JSONDecodeError,
        BaselineDigestIndexError,
    ) as error:
        print(f"Stage 09 baseline digest index failed:\n{error}", file=sys.stderr)
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _read_json(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise BaselineDigestIndexError(f"{_display_path(path)} must be a JSON object")
    return data


def _write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _validate_public_safety(
    artifact: dict[str, Any],
    label: str,
    errors: list[str],
) -> None:
    public_safety = artifact.get("public_repo_safety")
    if not isinstance(public_safety, dict):
        errors.append(f"{label}.public_repo_safety must be a JSON object")
        return
    _expect_equal(
        public_safety.get("paths_are_repo_relative"),
        True,
        f"{label}.public_repo_safety.paths_are_repo_relative",
        errors,
    )
    _expect_equal(
        public_safety.get("includes_docs_automation"),
        False,
        f"{label}.public_repo_safety.includes_docs_automation",
        errors,
    )
    _expect_equal(
        public_safety.get("uses_absolute_local_paths"),
        False,
        f"{label}.public_repo_safety.uses_absolute_local_paths",
        errors,
    )
    _expect_equal(
        public_safety.get("uses_credentials"),
        False,
        f"{label}.public_repo_safety.uses_credentials",
        errors,
    )


def _validate_public_path(path: str, errors: list[str]) -> None:
    if path.startswith("/"):
        errors.append(f"source path must be repo-relative: {path}")
    if ".." in Path(path).parts:
        errors.append(f"source path must not escape repo root: {path}")
    if path.startswith("docs/automation/"):
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
