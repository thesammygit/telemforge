"""Summarize the Stage 09 realtime headline target contract.

This command reads the committed Python/FastAPI baseline report and emits a
small JSON contract for the four headline metrics required by the Stage 09
benchmark scaffold. It does not rerun the benchmark, open a websocket, or
approve Rust as a whole-project rewrite.
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
DEFAULT_REPORT_PATH = BASELINE_ROOT / "stage09-baseline-report.json"

HEADLINE_TARGETS = [
    {
        "metric": "telemetry_sample_rate_hz",
        "report_binding": "metrics.telemetry_sample_rate_hz",
        "target_check": "aggregate_sample_rate_hz",
    },
    {
        "metric": "p95_alert_latency_ms",
        "report_binding": "metrics.p95_alert_latency_ms",
        "target_check": "p95_alert_latency_ms",
    },
    {
        "metric": "p95_replay_query_latency_ms",
        "report_binding": "metrics.p95_replay_query_latency_ms",
        "target_check": "p95_replay_query_latency_ms",
    },
    {
        "metric": "dropped_event_count",
        "report_binding": "metrics.dropped_event_count",
        "target_check": "dropped_event_count",
    },
]


class RealtimeTargetContractError(Exception):
    """Raised when the Stage 09 realtime target contract is inconsistent."""


def summarize_stage09_realtime_target_contract(
    report_path: Path | str = DEFAULT_REPORT_PATH,
) -> dict[str, Any]:
    """Build the deterministic headline target contract from the baseline."""

    report_path = Path(report_path)
    report = _read_json(report_path)

    errors: list[str] = []
    _expect_equal(
        report.get("schema"),
        "telemforge.stage09_realtime_baseline.v1",
        "report.schema",
        errors,
    )
    _expect_equal(
        report.get("stream_contract_profile", {})
        .get("runtime_evidence_gate", {})
        .get("status"),
        "contract_only_blocked",
        "runtime stream evidence gate",
        errors,
    )

    verification_contract = _require_mapping(
        report.get("verification_contract"), "verification_contract"
    )
    resource_guard = _require_mapping(report.get("resource_guard"), "resource_guard")
    runtime_boundary = _require_mapping(
        report.get("runtime_boundary"), "runtime_boundary"
    )
    target_profile = _require_mapping(report.get("target_profile"), "target_profile")
    target_checks = _require_mapping(
        report.get("target_results", {}).get("checks"), "target_results.checks"
    )

    command = verification_contract.get("command")
    if not isinstance(command, list) or not all(
        isinstance(part, str) for part in command
    ):
        errors.append("verification_contract.command must be a string list")
        command = []
    elif command[:2] != ["python3", "scripts/benchmark_stage09_realtime.py"]:
        errors.append("verification_contract.command must run the Stage 09 benchmark")

    required_outputs = verification_contract.get("required_outputs")
    if not isinstance(required_outputs, list) or not all(
        isinstance(path, str) for path in required_outputs
    ):
        errors.append("verification_contract.required_outputs must be a string list")
        required_outputs = []

    _expect_equal(resource_guard.get("worker_processes"), 1, "worker_processes", errors)
    _expect_equal(resource_guard.get("uses_network"), False, "uses_network", errors)
    _expect_equal(
        resource_guard.get("uses_paid_services"), False, "uses_paid_services", errors
    )

    metric_targets = _require_mapping(
        target_profile.get("metric_targets"), "target_profile.metric_targets"
    )
    headline_metric_targets = [
        _headline_target(report, metric_targets, target_checks, target, errors)
        for target in HEADLINE_TARGETS
    ]

    if "not a whole-project rewrite" not in str(
        report.get("baseline_verdict", {}).get("rust_scope", "")
    ):
        errors.append("baseline verdict must keep Rust scoped away from a rewrite")
    if "Rust data plane direction" not in str(
        runtime_boundary.get("tracked_direction", "")
    ):
        errors.append("runtime boundary must track Rust as the data-plane direction")

    for path in [_display_path(report_path), *required_outputs]:
        _validate_public_path(path, errors)

    if errors:
        raise RealtimeTargetContractError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_realtime_target_contract.v1",
        "status": "passed",
        "stage": report.get("stage"),
        "task_id": "telemforge-stage09-realtime-baseline-2026-05-03",
        "report_path": _display_path(report_path),
        "benchmark_scaffold": {
            "command": command,
            "required_outputs": required_outputs,
            "resource_envelope": {
                "worker_processes": resource_guard.get("worker_processes"),
                "uses_network": resource_guard.get("uses_network"),
                "uses_paid_services": resource_guard.get("uses_paid_services"),
                "max_expected_runtime_seconds": resource_guard.get(
                    "max_expected_runtime_seconds"
                ),
                "max_expected_memory_mb": resource_guard.get("max_expected_memory_mb"),
            },
            "rerun_status": "not_run_by_target_contract",
        },
        "headline_metric_count": len(headline_metric_targets),
        "headline_metric_targets": headline_metric_targets,
        "runtime_claims": {
            "benchmark_rerun": "not_run",
            "runtime_stream_claim_status": "contract_only_blocked",
            "websocket_runtime_fanout": "not_claimed",
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
            "headline_metrics_bound_to_report_fields",
            "headline_metrics_bound_to_target_results",
            "benchmark_command_pinned",
            "benchmark_required_outputs_pinned",
            "single_worker_no_network_resource_envelope",
            "runtime_stream_claim_blocked",
            "candidate_promotion_blocked",
            "public_paths_are_repo_relative",
            "docs_automation_excluded",
            "rust_scope_data_plane_only",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Summarize the Stage 09 realtime headline target contract."
    )
    parser.add_argument(
        "--report",
        default=str(DEFAULT_REPORT_PATH.relative_to(ROOT)),
        help="Stage 09 baseline report JSON path.",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON target-contract path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = summarize_stage09_realtime_target_contract(report_path=args.report)
    except (OSError, json.JSONDecodeError, RealtimeTargetContractError) as error:
        print(f"Stage 09 realtime target contract failed:\n{error}", file=sys.stderr)
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _headline_target(
    report: dict[str, Any],
    metric_targets: dict[str, Any],
    target_checks: dict[str, Any],
    target: dict[str, str],
    errors: list[str],
) -> dict[str, Any]:
    metric = target["metric"]
    report_binding = target["report_binding"]
    target_check_name = target["target_check"]
    target_definition = _require_mapping(
        metric_targets.get(target_check_name),
        f"target_profile.metric_targets.{target_check_name}",
    )
    target_check = _require_mapping(
        target_checks.get(target_check_name),
        f"target_results.checks.{target_check_name}",
    )
    observed = _get_path(report, report_binding)

    _expect_equal(
        target_definition.get("report_binding"),
        report_binding,
        f"{metric}.report_binding",
        errors,
    )
    _expect_equal(
        observed,
        target_check.get("observed"),
        f"{metric}.observed",
        errors,
    )
    _expect_equal(
        target_definition.get("target"),
        target_check.get("target"),
        f"{metric}.target",
        errors,
    )
    _expect_equal(
        target_definition.get("comparison"),
        target_check.get("comparison"),
        f"{metric}.comparison",
        errors,
    )

    return {
        "metric": metric,
        "report_binding": report_binding,
        "target_check": target_check_name,
        "observed": observed,
        "target": target_check.get("target"),
        "comparison": target_check.get("comparison"),
        "unit": target_check.get("unit"),
        "meets_target": target_check.get("meets_target"),
        "gap_to_target": target_check.get("gap_to_target"),
    }


def _read_json(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as file:
        return _require_mapping(json.load(file), str(path))


def _write_json(path: Path, value: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _get_path(value: dict[str, Any], dotted_path: str) -> Any:
    cursor: Any = value
    for part in dotted_path.split("."):
        cursor = _require_mapping(cursor, dotted_path).get(part)
    return cursor


def _require_mapping(value: Any, label: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise RealtimeTargetContractError(f"{label} must be a JSON object")
    return value


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
