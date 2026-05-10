"""Summarize the Stage 09 realtime target-contract command binding.

This command verifies that the public realtime target contract is still bound
to the same safe benchmark command, required outputs, and resource envelope as
the baseline command-evidence artifact. It does not rerun the benchmark, open a
websocket, or approve Rust as a whole-project rewrite.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
BASELINE_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
TARGET_CONTRACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-target-contract"
)
TARGET_CONTRACT_PATH = TARGET_CONTRACT_ROOT / "stage09-realtime-target-contract.json"
COMMAND_EVIDENCE_PATH = BASELINE_ROOT / "stage09-baseline-command-evidence.json"
BASELINE_REPORT_PATH = BASELINE_ROOT / "stage09-baseline-report.json"
BASELINE_SUMMARY_PATH = BASELINE_ROOT / "stage09-baseline-summary.md"


class Stage09RealtimeTargetCommandBindingError(Exception):
    """Raised when the target contract and command evidence disagree."""


def summarize_stage09_realtime_target_command_binding(
    target_contract_path: Path | str = TARGET_CONTRACT_PATH,
    command_evidence_path: Path | str = COMMAND_EVIDENCE_PATH,
) -> dict[str, Any]:
    """Build a deterministic binding summary for target review artifacts."""

    target_contract_path = Path(target_contract_path)
    command_evidence_path = Path(command_evidence_path)
    target_contract = _read_json(target_contract_path)
    command_evidence = _read_json(command_evidence_path)

    errors: list[str] = []
    _expect_equal(
        target_contract.get("schema"),
        "telemforge.stage09_realtime_target_contract.v1",
        "target_contract.schema",
        errors,
    )
    _expect_equal(
        target_contract.get("status"),
        "passed",
        "target_contract.status",
        errors,
    )
    _expect_equal(
        command_evidence.get("schema"),
        "telemforge.stage09_baseline_command_evidence.v1",
        "command_evidence.schema",
        errors,
    )

    scaffold = _require_mapping(
        target_contract.get("benchmark_scaffold"),
        "target_contract.benchmark_scaffold",
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

    _expect_equal(
        scaffold.get("command"),
        expected_command,
        "target_contract.benchmark_scaffold.command",
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
        "target_contract.benchmark_scaffold.required_outputs",
        errors,
    )
    _expect_equal(
        command_evidence.get("required_outputs"),
        expected_required_outputs,
        "command_evidence.required_outputs",
        errors,
    )
    _expect_equal(
        scaffold.get("resource_envelope"),
        command_resource_envelope,
        "target_contract.benchmark_scaffold.resource_envelope",
        errors,
    )
    _expect_equal(
        command_evidence.get("runtime_claim_status"),
        "not_claimed",
        "command_evidence.runtime_claim_status",
        errors,
    )

    runtime_claims = _require_mapping(
        target_contract.get("runtime_claims"), "target_contract.runtime_claims", errors
    )
    _expect_equal(
        runtime_claims.get("runtime_stream_claim_status"),
        "contract_only_blocked",
        "target_contract.runtime_claims.runtime_stream_claim_status",
        errors,
    )
    _expect_equal(
        runtime_claims.get("candidate_can_be_promoted"),
        False,
        "target_contract.runtime_claims.candidate_can_be_promoted",
        errors,
    )

    headline_targets = _require_list(
        target_contract.get("headline_metric_targets"),
        "target_contract.headline_metric_targets",
        errors,
    )
    _expect_equal(
        target_contract.get("headline_metric_count"),
        4,
        "target_contract.headline_metric_count",
        errors,
    )
    _expect_equal(
        len(headline_targets),
        4,
        "target_contract.headline_metric_targets length",
        errors,
    )

    target_safety = _require_mapping(
        target_contract.get("public_repo_safety"),
        "target_contract.public_repo_safety",
        errors,
    )
    command_safety = _require_mapping(
        command_evidence.get("public_repo_safety"),
        "command_evidence.public_repo_safety",
        errors,
    )
    for label, safety in (
        ("target_contract.public_repo_safety", target_safety),
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
        _display_path(target_contract_path),
        _display_path(command_evidence_path),
        *expected_required_outputs,
    ]:
        _validate_public_path(path, errors)
        if not (ROOT / path).is_file():
            errors.append(f"required public artifact does not exist: {path}")

    if errors:
        raise Stage09RealtimeTargetCommandBindingError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_realtime_target_command_binding.v1",
        "status": "passed",
        "stage": "09-realtime-performance-and-rust-data-plane",
        "task_id": "telemforge-stage09-realtime-baseline-2026-05-03",
        "purpose": (
            "Bind the four headline realtime target metrics to the bounded "
            "baseline benchmark command evidence without rerunning the "
            "benchmark or claiming runtime stream fanout."
        ),
        "target_contract_path": _display_path(target_contract_path),
        "command_evidence_path": _display_path(command_evidence_path),
        "benchmark_scaffold": {
            "command": expected_command,
            "required_outputs": expected_required_outputs,
            "resource_envelope": command_resource_envelope,
            "target_contract_command_evidence_bound": True,
            "rerun_status": "not_run_by_target_command_binding",
        },
        "headline_metric_count": len(headline_targets),
        "headline_metric_bindings": [
            {
                "metric": target.get("metric"),
                "report_binding": target.get("report_binding"),
                "target_check": target.get("target_check"),
                "meets_target": target.get("meets_target"),
                "gap_to_target": target.get("gap_to_target"),
            }
            for target in headline_targets
            if isinstance(target, dict)
        ],
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
            "target_contract_schema_passed",
            "command_evidence_schema_passed",
            "headline_metric_count_pinned",
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
        description="Summarize the Stage 09 realtime target command binding."
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON binding-summary path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = summarize_stage09_realtime_target_command_binding()
    except (
        OSError,
        json.JSONDecodeError,
        Stage09RealtimeTargetCommandBindingError,
    ) as error:
        print(
            f"Stage 09 realtime target command binding failed:\n{error}",
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
        raise Stage09RealtimeTargetCommandBindingError(
            f"{_display_path(path)} must be a JSON object"
        )
    return data


def _write_json(path: Path, value: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(value, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def _require_mapping(
    value: Any,
    label: str,
    errors: list[str],
) -> dict[str, Any]:
    if isinstance(value, dict):
        return value
    errors.append(f"{label} must be a JSON object")
    return {}


def _require_list(value: Any, label: str, errors: list[str]) -> list[Any]:
    if isinstance(value, list):
        return value
    errors.append(f"{label} must be a JSON list")
    return []


def _expect_equal(
    actual: Any,
    expected: Any,
    label: str,
    errors: list[str],
) -> None:
    if actual != expected:
        errors.append(f"{label} expected {expected!r}, got {actual!r}")


def _validate_public_path(path: str, errors: list[str]) -> None:
    if path.startswith("/"):
        errors.append(f"{path} must be repo-relative")
    if "docs/automation" in path:
        errors.append(f"{path} must not reference docs/automation")


def _display_path(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT))
    except ValueError:
        return str(path)


if __name__ == "__main__":
    raise SystemExit(main())
