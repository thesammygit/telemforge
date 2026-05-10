"""Validate the committed Stage 09 realtime target contract.

This command recomputes the deterministic target contract, compares it with the
checked-in public artifact, and verifies that the headline metric bindings stay
public-safe. It does not rerun the benchmark, open a websocket, or approve Rust
as a whole-project rewrite.
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

from scripts.summarize_stage09_realtime_target_contract import (  # noqa: E402
    RealtimeTargetContractError,
    summarize_stage09_realtime_target_contract,
)


ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-target-contract"
)
DEFAULT_CONTRACT_PATH = ARTIFACT_ROOT / "stage09-realtime-target-contract.json"
EXPECTED_METRICS = [
    "telemetry_sample_rate_hz",
    "p95_alert_latency_ms",
    "p95_replay_query_latency_ms",
    "dropped_event_count",
]


class RealtimeTargetContractValidationError(Exception):
    """Raised when the committed target contract is stale or unsafe."""


def validate_stage09_realtime_target_contract(
    contract_path: Path | str = DEFAULT_CONTRACT_PATH,
) -> dict[str, Any]:
    """Validate the public Stage 09 target contract against current sources."""

    contract_path = Path(contract_path)
    current_contract = summarize_stage09_realtime_target_contract()
    committed_contract = _read_json(contract_path)
    expected_bytes = _json_bytes(current_contract)
    committed_bytes = contract_path.read_bytes()

    errors: list[str] = []
    if committed_contract != current_contract:
        errors.append("committed target contract does not match regenerated result")
        errors.extend(_top_level_diff(committed_contract, current_contract))
    if committed_bytes != expected_bytes:
        errors.append("committed target contract bytes are not deterministic output")

    _expect_equal(
        committed_contract.get("schema"),
        "telemforge.stage09_realtime_target_contract.v1",
        "contract.schema",
        errors,
    )
    _expect_equal(
        committed_contract.get("status"), "passed", "contract.status", errors
    )
    _expect_equal(
        committed_contract.get("task_id"),
        "telemforge-stage09-realtime-baseline-2026-05-03",
        "contract.task_id",
        errors,
    )

    benchmark_scaffold = _require_mapping(
        committed_contract.get("benchmark_scaffold"),
        "contract.benchmark_scaffold",
        errors,
    )
    command = _validate_string_list(
        benchmark_scaffold.get("command"),
        "contract.benchmark_scaffold.command",
        errors,
    )
    if command[:2] != ["python3", "scripts/benchmark_stage09_realtime.py"]:
        errors.append("contract.benchmark_scaffold.command must run the benchmark")
    for part in command:
        _validate_public_text(part, "contract.benchmark_scaffold.command", errors)

    required_outputs = _validate_string_list(
        benchmark_scaffold.get("required_outputs"),
        "contract.benchmark_scaffold.required_outputs",
        errors,
    )
    for output_path in required_outputs:
        _validate_public_text(
            output_path, "contract.benchmark_scaffold.required_outputs", errors
        )
        if not (ROOT / output_path).is_file():
            errors.append(f"required output is missing: {output_path}")

    resource_envelope = _require_mapping(
        benchmark_scaffold.get("resource_envelope"),
        "contract.benchmark_scaffold.resource_envelope",
        errors,
    )
    _expect_equal(
        resource_envelope.get("worker_processes"),
        1,
        "contract.resource_envelope.worker_processes",
        errors,
    )
    _expect_equal(
        resource_envelope.get("uses_network"),
        False,
        "contract.resource_envelope.uses_network",
        errors,
    )
    _expect_equal(
        resource_envelope.get("uses_paid_services"),
        False,
        "contract.resource_envelope.uses_paid_services",
        errors,
    )

    metrics = _validate_headline_metrics(
        committed_contract.get("headline_metric_targets"), errors
    )
    _expect_equal(
        committed_contract.get("headline_metric_count"),
        len(EXPECTED_METRICS),
        "contract.headline_metric_count",
        errors,
    )

    runtime_claims = _require_mapping(
        committed_contract.get("runtime_claims"), "contract.runtime_claims", errors
    )
    _expect_equal(
        runtime_claims.get("benchmark_rerun"),
        "not_run",
        "contract.runtime_claims.benchmark_rerun",
        errors,
    )
    _expect_equal(
        runtime_claims.get("runtime_stream_claim_status"),
        "contract_only_blocked",
        "contract.runtime_claims.runtime_stream_claim_status",
        errors,
    )
    _expect_equal(
        runtime_claims.get("candidate_can_be_promoted"),
        False,
        "contract.runtime_claims.candidate_can_be_promoted",
        errors,
    )

    public_repo_safety = _require_mapping(
        committed_contract.get("public_repo_safety"),
        "contract.public_repo_safety",
        errors,
    )
    _expect_equal(
        public_repo_safety.get("paths_are_repo_relative"),
        True,
        "contract.public_repo_safety.paths_are_repo_relative",
        errors,
    )
    _expect_equal(
        public_repo_safety.get("includes_docs_automation"),
        False,
        "contract.public_repo_safety.includes_docs_automation",
        errors,
    )
    _expect_equal(
        public_repo_safety.get("uses_credentials"),
        False,
        "contract.public_repo_safety.uses_credentials",
        errors,
    )

    if "not a whole-project rewrite" not in str(
        committed_contract.get("rust_scope", "")
    ):
        errors.append("contract.rust_scope must reject a whole-project rewrite")

    if errors:
        raise RealtimeTargetContractValidationError("\n".join(errors))

    return {
        "schema": "telemforge.stage09_realtime_target_contract_validation.v1",
        "status": "passed",
        "stage": committed_contract.get("stage"),
        "task_id": committed_contract.get("task_id"),
        "contract_path": _display_path(contract_path),
        "contract_sha256": hashlib.sha256(committed_bytes).hexdigest(),
        "regenerated_contract_sha256": hashlib.sha256(expected_bytes).hexdigest(),
        "contract_matches_regenerated_result": True,
        "headline_metric_count": committed_contract.get("headline_metric_count"),
        "validated_metrics": metrics,
        "benchmark_command": command,
        "runtime_claims": runtime_claims,
        "public_repo_safety": public_repo_safety,
        "rust_scope": committed_contract.get("rust_scope"),
        "verified_gates": [
            "committed_contract_matches_regenerated_result",
            "committed_contract_bytes_are_deterministic",
            "headline_metrics_are_expected",
            "headline_metrics_bind_report_fields",
            "benchmark_command_pinned",
            "benchmark_required_outputs_exist",
            "single_worker_no_network_resource_envelope",
            "runtime_stream_claim_blocked",
            "candidate_promotion_blocked",
            "docs_automation_excluded",
            "rust_scope_data_plane_only",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate the Stage 09 realtime target contract."
    )
    parser.add_argument(
        "--contract",
        default=DEFAULT_CONTRACT_PATH,
        help="Realtime target contract JSON path.",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON validation summary path.",
    )
    args = parser.parse_args()

    try:
        result = validate_stage09_realtime_target_contract(
            contract_path=args.contract,
        )
    except (
        OSError,
        json.JSONDecodeError,
        RealtimeTargetContractError,
        RealtimeTargetContractValidationError,
    ) as error:
        print(f"Stage 09 realtime target contract validation failed:\n{error}", file=sys.stderr)
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _validate_headline_metrics(value: Any, errors: list[str]) -> list[str]:
    if not isinstance(value, list):
        errors.append("contract.headline_metric_targets must be a list")
        return []

    metrics: list[str] = []
    seen_metrics: set[str] = set()
    for item in value:
        if not isinstance(item, dict):
            errors.append("contract.headline_metric_targets entries must be objects")
            continue

        metric = str(item.get("metric", ""))
        metrics.append(metric)
        if not metric:
            errors.append("contract.headline_metric_targets entry missing metric")
        if metric in seen_metrics:
            errors.append(f"duplicate headline metric: {metric}")
        seen_metrics.add(metric)

        report_binding = item.get("report_binding")
        if not isinstance(report_binding, str) or not report_binding.startswith(
            "metrics."
        ):
            errors.append(f"{metric}.report_binding must point at metrics.*")
        _expect_equal(
            item.get("meets_target"),
            item.get("gap_to_target") == 0,
            f"{metric}.meets_target",
            errors,
        )

    _expect_equal(metrics, EXPECTED_METRICS, "contract.headline metrics", errors)
    return metrics


def _read_json(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise RealtimeTargetContractValidationError(
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
            diffs.append(f"contract.{key} differs from regenerated result")
    return diffs[:8]


def _validate_string_list(value: Any, label: str, errors: list[str]) -> list[str]:
    if not isinstance(value, list) or not all(isinstance(part, str) for part in value):
        errors.append(f"{label} must be a string list")
        return []
    return value


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
