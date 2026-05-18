"""Validate the Stage 09 live telemetry contract artifact.

This is a deterministic contract gate. It checks the websocket envelope,
reconnect, backpressure, benchmark binding, and runtime evidence gate against
the landed bounded runtime websocket probes.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
DEFAULT_CONTRACT_PATH = ARTIFACT_ROOT / "stage09-live-telemetry-contract.json"
DEFAULT_REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
UTC_TIMESTAMP_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$")


class ContractValidationError(Exception):
    """Raised when the Stage 09 live telemetry contract is inconsistent."""


def validate_stage09_live_telemetry_contract(
    contract_path: Path | str = DEFAULT_CONTRACT_PATH,
    report_path: Path | str = DEFAULT_REPORT_PATH,
) -> dict[str, Any]:
    """Validate the public live telemetry contract and baseline binding."""

    contract_path = Path(contract_path)
    report_path = Path(report_path)
    contract = _read_json(contract_path)
    report = _read_json(report_path)
    errors: list[str] = []

    _expect_equal(
        contract.get("schema"),
        "telemforge.stage09_live_telemetry_contract.v1",
        "contract.schema",
        errors,
    )
    _expect_equal(
        contract.get("implementation_status"),
        "runtime_stream_probes_verified_bounded_fanout",
        "contract.implementation_status",
        errors,
    )
    _expect_equal(
        contract.get("endpoint", {}).get("protocol"),
        "websocket",
        "endpoint.protocol",
        errors,
    )
    _expect_equal(
        contract.get("endpoint", {}).get("path"),
        "/sessions/{session_id}/telemetry/live",
        "endpoint.path",
        errors,
    )
    _expect_contains(
        contract.get("runtime_boundary", {}).get("tracked_direction", ""),
        "not a whole-project rewrite",
        "runtime_boundary.tracked_direction",
        errors,
    )

    _validate_message_contract(contract, errors)
    _validate_vectors(contract, errors)
    _validate_benchmark_binding(contract, report, errors)
    _validate_runtime_evidence_gate(contract, errors)
    _validate_public_artifact_paths(contract, errors)

    if errors:
        raise ContractValidationError("\n".join(errors))

    evidence_gate = contract["runtime_evidence_gate"]
    return {
        "schema": "telemforge.stage09_live_contract_validation.v1",
        "status": "passed",
        "contract_path": _display_path(contract_path),
        "baseline_report_path": _display_path(report_path),
        "implementation_status": contract["implementation_status"],
        "runtime_fanout_claim": evidence_gate["status"],
        "rust_scope": contract["runtime_boundary"]["tracked_direction"],
        "validated_gates": [
            "websocket_endpoint_contract",
            "message_envelope_and_types",
            "ordered_stream_vectors",
            "reconnect_resume_vector",
            "backpressure_report_vector",
            "baseline_report_metric_binding",
            "runtime_evidence_gate",
            "public_repo_relative_proof_artifacts",
        ],
        "required_runtime_evidence": evidence_gate["required_before_runtime_claim"],
        "proof_artifacts": evidence_gate["proof_artifacts"],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate the Stage 09 live telemetry contract artifact."
    )
    parser.add_argument(
        "--contract",
        default=str(DEFAULT_CONTRACT_PATH.relative_to(ROOT)),
        help="Stage 09 live telemetry contract JSON path.",
    )
    parser.add_argument(
        "--report",
        default=str(DEFAULT_REPORT_PATH.relative_to(ROOT)),
        help="Stage 09 baseline report JSON path.",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON validation summary path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = validate_stage09_live_telemetry_contract(args.contract, args.report)
    except (OSError, json.JSONDecodeError, ContractValidationError, KeyError) as error:
        print(f"Stage 09 live telemetry contract validation failed:\n{error}", file=sys.stderr)
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _validate_message_contract(contract: dict[str, Any], errors: list[str]) -> None:
    envelope = contract.get("message_envelope", {})
    message_types = {
        item.get("type"): item
        for item in contract.get("message_types", [])
        if isinstance(item, dict)
    }
    _expect_equal(
        envelope.get("required_fields"),
        ["type", "session_id", "sequence", "emitted_at", "payload"],
        "message_envelope.required_fields",
        errors,
    )
    _expect_equal(
        envelope.get("sequence", {}).get("starts_at"),
        1,
        "message_envelope.sequence.starts_at",
        errors,
    )
    _expect_equal(
        envelope.get("sequence", {}).get("monotonic"),
        True,
        "message_envelope.sequence.monotonic",
        errors,
    )
    _expect_equal(
        set(message_types),
        {
            "stream.snapshot",
            "telemetry.sample",
            "alert.raised",
            "stream.heartbeat",
            "stream.backpressure",
        },
        "message_types",
        errors,
    )

    for message_type, item in message_types.items():
        fields = item.get("payload_required_fields")
        if not isinstance(fields, list) or not fields:
            errors.append(f"message type {message_type} must declare payload fields")

    telemetry_sample = message_types.get("telemetry.sample", {})
    for value in ["nominal", "warning", "critical", "offline"]:
        if value not in telemetry_sample.get("status_values", []):
            errors.append(f"telemetry.sample missing status value: {value}")
    for value in ["valid", "suspect", "missing"]:
        if value not in telemetry_sample.get("quality_values", []):
            errors.append(f"telemetry.sample missing quality value: {value}")


def _validate_vectors(contract: dict[str, Any], errors: list[str]) -> None:
    vectors = contract.get("contract_validation_vectors", {})
    message_types = {
        item.get("type"): item
        for item in contract.get("message_types", [])
        if isinstance(item, dict)
    }
    envelope_fields = contract.get("message_envelope", {}).get("required_fields", [])
    ordered_stream = vectors.get("ordered_stream", [])
    if not isinstance(ordered_stream, list) or not ordered_stream:
        errors.append("contract_validation_vectors.ordered_stream must not be empty")
        return

    sequence_values = [message.get("sequence") for message in ordered_stream]
    _expect_equal(sequence_values, sorted(sequence_values), "ordered stream sequence", errors)
    _expect_equal(sequence_values[0], 1, "ordered stream first sequence", errors)
    _expect_equal(
        ordered_stream[0].get("type"),
        "stream.snapshot",
        "ordered stream first message type",
        errors,
    )

    messages = [*ordered_stream, vectors.get("backpressure_report", {})]
    for message in messages:
        if not isinstance(message, dict):
            errors.append("contract vector message must be an object")
            continue
        for field in envelope_fields:
            if field not in message:
                errors.append(f"contract vector missing envelope field: {field}")
        _expect_utc_timestamp(message.get("emitted_at"), "message.emitted_at", errors)

        declared_type = message_types.get(message.get("type"))
        if declared_type is None:
            errors.append(f"contract vector has undeclared message type: {message.get('type')}")
            continue
        payload = message.get("payload", {})
        for field in declared_type.get("payload_required_fields", []):
            if field not in payload:
                errors.append(f"{message.get('type')} vector missing payload field: {field}")
        if "timestamp" in payload:
            _expect_utc_timestamp(payload["timestamp"], "payload.timestamp", errors)
        if "stream_time" in payload:
            _expect_utc_timestamp(payload["stream_time"], "payload.stream_time", errors)

    reconnect = vectors.get("reconnect_resume", {})
    after_sequence = reconnect.get("client_query", {}).get("after_sequence")
    _expect_equal(
        reconnect.get("resume_token_field"),
        contract.get("reconnect", {}).get("resume_token_field"),
        "reconnect.resume_token_field",
        errors,
    )
    if not isinstance(after_sequence, int):
        errors.append("reconnect client after_sequence must be an integer")
    else:
        _expect_equal(
            reconnect.get("must_resume_with_sequence_greater_than"),
            after_sequence,
            "reconnect.must_resume_with_sequence_greater_than",
            errors,
        )
    _expect_equal(
        reconnect.get("out_of_window_fallback"),
        "stream.snapshot",
        "reconnect.out_of_window_fallback",
        errors,
    )

    backpressure = vectors.get("backpressure_report", {})
    _expect_equal(backpressure.get("type"), "stream.backpressure", "backpressure.type", errors)
    payload = backpressure.get("payload", {})
    _expect_equal(
        payload.get("policy"),
        contract.get("backpressure", {}).get("overflow_behavior"),
        "backpressure.payload.policy",
        errors,
    )
    _expect_equal(
        payload.get("client_queue_depth"),
        contract.get("backpressure", {}).get("max_client_queue_events"),
        "backpressure.payload.client_queue_depth",
        errors,
    )
    if payload.get("dropped_event_count", 0) <= 0:
        errors.append("backpressure dropped_event_count vector must be positive")
    _expect_equal(
        backpressure.get("comparison_metric"),
        "metrics.dropped_event_count",
        "backpressure.comparison_metric",
        errors,
    )


def _validate_benchmark_binding(
    contract: dict[str, Any],
    report: dict[str, Any],
    errors: list[str],
) -> None:
    binding = contract.get("benchmark_binding", {})
    _expect_equal(
        binding.get("baseline_report_schema"),
        report.get("schema"),
        "benchmark_binding.baseline_report_schema",
        errors,
    )
    for metric_name in binding.get("required_report_metrics", []):
        if metric_name not in report.get("metrics", {}):
            errors.append(f"baseline report missing required metric: {metric_name}")
    if "dropped_event_count" not in report.get("target_results", {}).get("checks", {}):
        errors.append("baseline report target_results missing dropped_event_count")


def _validate_runtime_evidence_gate(
    contract: dict[str, Any],
    errors: list[str],
) -> None:
    gate = contract.get("runtime_evidence_gate", {})
    _expect_equal(
        gate.get("schema"),
        "telemforge.stage09_runtime_stream_evidence_gate.v1",
        "runtime_evidence_gate.schema",
        errors,
    )
    _expect_equal(
        gate.get("status"),
        "runtime_verified_bounded_fanout",
        "runtime_evidence_gate.status",
        errors,
    )
    required = gate.get("required_before_runtime_claim", [])
    items = gate.get("evidence_items", {})
    if set(required) != set(items):
        errors.append("runtime evidence items must match required evidence names")
    for evidence_name, item in items.items():
        _expect_equal(
            item.get("claim_status"),
            "runtime_verified",
            f"runtime evidence {evidence_name} claim_status",
            errors,
        )
        _expect_contains(
            item.get("rust_scope", ""),
            "not a whole-project rewrite",
            f"runtime evidence {evidence_name} rust_scope",
            errors,
        )
        if item.get("proof_artifact") not in gate.get("proof_artifacts", []):
            errors.append(f"runtime evidence proof artifact is not listed: {evidence_name}")
    for forbidden in [
        "sustained multi-client websocket fanout",
        "candidate promotion readiness",
        "Rust has replaced a Python control-plane path",
    ]:
        if forbidden not in gate.get("forbidden_without_evidence", []):
            errors.append(f"runtime evidence gate missing forbidden claim: {forbidden}")


def _validate_public_artifact_paths(contract: dict[str, Any], errors: list[str]) -> None:
    for artifact in contract.get("runtime_evidence_gate", {}).get("proof_artifacts", []):
        path = Path(artifact)
        if path.is_absolute():
            errors.append(f"proof artifact must be repo-relative: {artifact}")
            continue
        if artifact.startswith("docs/automation") or "/docs/automation/" in artifact:
            errors.append(f"proof artifact must not reference docs/automation: {artifact}")
            continue
        if not (ROOT / artifact).exists():
            errors.append(f"proof artifact does not exist: {artifact}")


def _read_json(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as file:
        value = json.load(file)
    if not isinstance(value, dict):
        raise ContractValidationError(f"{path} must contain a JSON object")
    return value


def _write_json(path: Path, value: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _expect_equal(
    observed: Any,
    expected: Any,
    label: str,
    errors: list[str],
) -> None:
    if observed != expected:
        errors.append(f"{label} mismatch: expected {expected!r}, got {observed!r}")


def _expect_contains(
    value: str,
    expected: str,
    label: str,
    errors: list[str],
) -> None:
    if expected not in value:
        errors.append(f"{label} must contain {expected!r}")


def _expect_utc_timestamp(value: Any, label: str, errors: list[str]) -> None:
    if not isinstance(value, str) or UTC_TIMESTAMP_PATTERN.match(value) is None:
        errors.append(f"{label} must be UTC ISO-8601 with trailing Z")


def _display_path(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT))
    except ValueError:
        return str(path)


if __name__ == "__main__":
    raise SystemExit(main())
