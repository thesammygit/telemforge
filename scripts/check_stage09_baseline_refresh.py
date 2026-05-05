"""Check that a fresh Stage 09 baseline run preserves stable report identity.

This command reruns the bounded Python/FastAPI benchmark in a temporary SQLite
database and compares the stable report fingerprint with the committed public
baseline report. It is a lightweight refresh gate, not a load test and not a
runtime websocket fanout claim.
"""

from __future__ import annotations

import argparse
import json
import sys
import tempfile
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.benchmark_stage09_realtime import run_stage09_realtime_baseline


ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
DEFAULT_REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"


class RefreshCheckError(Exception):
    """Raised when a fresh benchmark run no longer matches the public baseline."""


def check_stage09_baseline_refresh(
    report_path: Path | str = DEFAULT_REPORT_PATH,
    alert_iterations: int = 5,
    replay_iterations: int = 5,
) -> dict[str, Any]:
    """Run a bounded refresh probe and compare stable identity with the report."""

    report_path = Path(report_path)
    committed_report = _read_json(report_path)
    committed_fingerprint = _require_mapping(
        committed_report.get("stable_report_fingerprint"),
        "stable_report_fingerprint",
    )

    with tempfile.TemporaryDirectory(prefix="telemforge-stage09-refresh-") as tmpdir:
        fresh_report = run_stage09_realtime_baseline(
            database_path=Path(tmpdir) / "stage09-refresh.sqlite",
            alert_iterations=alert_iterations,
            replay_iterations=replay_iterations,
        )

    fresh_fingerprint = _require_mapping(
        fresh_report.get("stable_report_fingerprint"),
        "fresh stable_report_fingerprint",
    )

    errors: list[str] = []
    _expect_equal(
        committed_fingerprint.get("digest_sha256"),
        fresh_fingerprint.get("digest_sha256"),
        "stable_report_fingerprint.digest_sha256",
        errors,
    )
    _expect_equal(
        committed_fingerprint.get("stable_identity_fields"),
        fresh_fingerprint.get("stable_identity_fields"),
        "stable_report_fingerprint.stable_identity_fields",
        errors,
    )
    _expect_equal(
        committed_report.get("resource_guard"),
        fresh_report.get("resource_guard"),
        "resource_guard",
        errors,
    )

    runtime_gate = (
        fresh_report.get("stream_contract_profile", {})
        .get("runtime_evidence_gate", {})
        .get("status")
    )
    _expect_equal(
        runtime_gate,
        "contract_only_blocked",
        "stream_contract_profile.runtime_evidence_gate.status",
        errors,
    )

    runtime_boundary = _require_mapping(
        fresh_report.get("runtime_boundary"),
        "runtime_boundary",
    )
    tracked_direction = str(runtime_boundary.get("tracked_direction", ""))
    if "not a whole-project rewrite" not in tracked_direction:
        errors.append(
            "runtime_boundary.tracked_direction must keep Rust scoped away from a whole-project rewrite"
        )

    if errors:
        raise RefreshCheckError("\n".join(errors))

    resource_guard = _require_mapping(
        committed_report.get("resource_guard"),
        "resource_guard",
    )
    return {
        "schema": "telemforge.stage09_baseline_refresh_check.v1",
        "status": "passed",
        "report_path": _display_path(report_path),
        "benchmark_schema": committed_report.get("schema"),
        "stable_digest_sha256": committed_fingerprint.get("digest_sha256"),
        "stable_identity_field_count": len(
            committed_fingerprint.get("stable_identity_fields", [])
        ),
        "resource_envelope": {
            "worker_processes": resource_guard.get("worker_processes"),
            "max_expected_runtime_seconds": resource_guard.get(
                "max_expected_runtime_seconds"
            ),
            "max_expected_memory_mb": resource_guard.get("max_expected_memory_mb"),
            "uses_network": resource_guard.get("uses_network"),
            "uses_paid_services": resource_guard.get("uses_paid_services"),
        },
        "runtime_evidence_gate_status": runtime_gate,
        "rust_scope": "Rust data-plane candidate only; not a whole-project rewrite",
        "verified_gates": [
            "fresh_run_stable_fingerprint_matches",
            "resource_envelope_preserved",
            "runtime_stream_claim_remains_blocked",
            "rust_scope_data_plane_only",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Check a fresh Stage 09 baseline run against the public stable fingerprint."
    )
    parser.add_argument(
        "--report",
        default=str(DEFAULT_REPORT_PATH.relative_to(ROOT)),
        help="Committed Stage 09 baseline report JSON path.",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON refresh-check output path to write after validation passes.",
    )
    parser.add_argument("--alert-iterations", type=int, default=5)
    parser.add_argument("--replay-iterations", type=int, default=5)
    args = parser.parse_args()

    try:
        result = check_stage09_baseline_refresh(
            report_path=args.report,
            alert_iterations=args.alert_iterations,
            replay_iterations=args.replay_iterations,
        )
    except (OSError, json.JSONDecodeError, RefreshCheckError, KeyError) as error:
        print(f"Stage 09 baseline refresh check failed:\n{error}", file=sys.stderr)
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _read_json(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as file:
        value = json.load(file)
    if not isinstance(value, dict):
        raise RefreshCheckError(f"{path} must contain a JSON object")
    return value


def _write_json(path: Path, value: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(value, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def _require_mapping(value: Any, label: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise RefreshCheckError(f"{label} must be a JSON object")
    return value


def _expect_equal(
    left: Any,
    right: Any,
    label: str,
    errors: list[str],
) -> None:
    if left != right:
        errors.append(f"{label} mismatch: committed={left!r} fresh={right!r}")


def _display_path(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT))
    except ValueError:
        return str(path)


if __name__ == "__main__":
    raise SystemExit(main())
