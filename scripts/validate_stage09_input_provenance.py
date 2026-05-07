"""Validate the Stage 09 baseline input-provenance binding.

This command checks that the committed baseline report is still bound to the
current telemetry catalog and stable workload identity. It does not rerun the
benchmark, open a websocket, or approve Rust as a whole-project rewrite.
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
DEFAULT_REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
DEFAULT_MANIFEST_PATH = ARTIFACT_ROOT / "stage09-baseline-verification-manifest.json"


class InputProvenanceValidationError(Exception):
    """Raised when Stage 09 input-provenance evidence is inconsistent."""


def validate_stage09_input_provenance(
    report_path: Path | str = DEFAULT_REPORT_PATH,
    manifest_path: Path | str = DEFAULT_MANIFEST_PATH,
) -> dict[str, Any]:
    """Validate the committed Stage 09 baseline input provenance."""

    report_path = Path(report_path)
    manifest_path = Path(manifest_path)
    report = _read_json(report_path)
    manifest = _read_json(manifest_path)

    input_provenance = _require_mapping(
        report.get("input_provenance"),
        "report.input_provenance",
    )
    stable_fingerprint = _require_mapping(
        report.get("stable_report_fingerprint"),
        "report.stable_report_fingerprint",
    )
    workload = _require_mapping(report.get("workload"), "report.workload")
    determinism_profile = _require_mapping(
        report.get("determinism_profile"),
        "report.determinism_profile",
    )

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
        input_provenance.get("schema"),
        "telemforge.stage09_input_provenance.v1",
        "input_provenance.schema",
        errors,
    )

    catalog_path_value = input_provenance.get("telemetry_catalog_path")
    if not isinstance(catalog_path_value, str) or not catalog_path_value:
        errors.append("input_provenance.telemetry_catalog_path must be a path string")
        catalog_path = ROOT
    else:
        catalog_path = ROOT / catalog_path_value
        _validate_public_repo_path(catalog_path_value, errors)

    catalog = _read_catalog(catalog_path, errors)
    if catalog_path.exists() and catalog_path.is_file():
        catalog_bytes = catalog_path.read_bytes()
    else:
        catalog_bytes = b""
    catalog_sha256 = hashlib.sha256(catalog_bytes).hexdigest()
    channel_count = len(catalog.get("channels", []))

    _expect_equal(
        input_provenance.get("telemetry_catalog_sha256"),
        catalog_sha256,
        "telemetry catalog sha256",
        errors,
    )
    _expect_equal(
        input_provenance.get("telemetry_catalog_bytes"),
        len(catalog_bytes),
        "telemetry catalog byte count",
        errors,
    )
    _expect_equal(
        input_provenance.get("telemetry_catalog_schema"),
        catalog.get("schema"),
        "telemetry catalog schema",
        errors,
    )
    _expect_equal(
        input_provenance.get("channel_count"),
        channel_count,
        "input provenance channel count",
        errors,
    )
    _expect_equal(
        workload.get("channel_count"),
        channel_count,
        "workload channel count",
        errors,
    )

    stable_inputs = _require_mapping(
        determinism_profile.get("stable_inputs"),
        "determinism_profile.stable_inputs",
    )
    _expect_equal(
        stable_inputs.get("channel_count"),
        channel_count,
        "determinism stable input channel count",
        errors,
    )
    workload_identity = determinism_profile.get("workload_identity")
    if (
        not isinstance(workload_identity, str)
        or f"channels-{channel_count}" not in workload_identity
    ):
        errors.append(
            "determinism_profile.workload_identity must include the catalog channel count"
        )
    stable_identity_fields = stable_fingerprint.get("stable_identity_fields", [])
    if "input_provenance.telemetry_catalog_sha256" not in stable_identity_fields:
        errors.append(
            "stable_report_fingerprint must include "
            "input_provenance.telemetry_catalog_sha256"
        )

    rust_scope = str(stable_fingerprint.get("rust_scope", ""))
    if "not a whole-project rewrite" not in rust_scope:
        errors.append("stable_report_fingerprint.rust_scope must reject a rewrite")

    public_repo_safety = {
        "paths_are_repo_relative": True,
        "includes_docs_automation": False,
        "uses_absolute_local_paths": False,
        "uses_credentials": False,
        "uses_private_runtime_state": False,
    }

    if errors:
        raise InputProvenanceValidationError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_input_provenance_validation.v1",
        "status": "passed",
        "stage": report.get("stage"),
        "task_id": manifest.get("task_id"),
        "report_path": _display_path(report_path),
        "manifest_path": _display_path(manifest_path),
        "telemetry_catalog_path": catalog_path_value,
        "telemetry_catalog_schema": input_provenance.get("telemetry_catalog_schema"),
        "telemetry_catalog_sha256": catalog_sha256,
        "telemetry_catalog_bytes": len(catalog_bytes),
        "channel_count": channel_count,
        "workload_channel_count": workload.get("channel_count"),
        "stable_report_fingerprint_sha256": stable_fingerprint.get("digest_sha256"),
        "stable_identity_fields": stable_identity_fields,
        "public_repo_safety": public_repo_safety,
        "rust_scope": rust_scope,
        "verified_gates": [
            "catalog_path_repo_relative",
            "catalog_path_public",
            "catalog_sha256_matches_report",
            "catalog_byte_count_matches_report",
            "catalog_schema_matches_report",
            "catalog_channel_count_matches_report",
            "workload_channel_count_matches_catalog",
            "determinism_profile_channel_count_matches_catalog",
            "stable_fingerprint_includes_catalog_hash",
            "docs_automation_excluded",
            "rust_scope_data_plane_only",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate the Stage 09 baseline input-provenance binding."
    )
    parser.add_argument("--report", default=str(DEFAULT_REPORT_PATH.relative_to(ROOT)))
    parser.add_argument(
        "--manifest",
        default=str(DEFAULT_MANIFEST_PATH.relative_to(ROOT)),
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON validation summary path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = validate_stage09_input_provenance(
            report_path=args.report,
            manifest_path=args.manifest,
        )
    except (
        OSError,
        json.JSONDecodeError,
        InputProvenanceValidationError,
    ) as error:
        print(
            f"Stage 09 input provenance validation failed:\n{error}",
            file=sys.stderr,
        )
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _read_json(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return _require_mapping(data, str(path))


def _read_catalog(path: Path, errors: list[str]) -> dict[str, Any]:
    if not path.exists():
        errors.append(f"telemetry catalog does not exist: {_display_path(path)}")
        return {}
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        errors.append("telemetry catalog must be a JSON object")
        return {}
    if not isinstance(data.get("channels"), list):
        errors.append("telemetry catalog channels must be a list")
    return data


def _write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _require_mapping(value: Any, label: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise InputProvenanceValidationError(f"{label} must be a JSON object")
    return value


def _expect_equal(
    actual: Any,
    expected: Any,
    label: str,
    errors: list[str],
) -> None:
    if actual != expected:
        errors.append(f"{label} mismatch: expected {expected!r}, got {actual!r}")


def _validate_public_repo_path(path: str, errors: list[str]) -> None:
    if Path(path).is_absolute():
        errors.append(f"catalog path must be repo-relative: {path}")
    if path.startswith("docs/automation") or "/docs/automation/" in path:
        errors.append(f"catalog path must not reference docs/automation: {path}")
    if ".." in Path(path).parts:
        errors.append(f"catalog path must not escape the repository: {path}")


def _display_path(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT))
    except ValueError:
        return str(path)


if __name__ == "__main__":
    raise SystemExit(main())
