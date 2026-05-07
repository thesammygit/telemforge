"""Build a deterministic Stage 09 realtime baseline metric index.

This command reads committed Stage 09 baseline artifacts and emits a compact
JSON index over the headline benchmark metrics. It does not rerun the
benchmark, open a websocket, or approve Rust as a whole-project rewrite.
"""

from __future__ import annotations

import argparse
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

HEADLINE_METRICS = [
    "channel_count",
    "per_channel_sample_rate_hz",
    "aggregate_sample_rate_hz",
    "p95_alert_latency_ms",
    "p95_replay_query_latency_ms",
    "dropped_event_count",
]


class BaselineMetricIndexError(Exception):
    """Raised when Stage 09 metric-index inputs are inconsistent."""


def summarize_stage09_baseline_metric_index(
    report_path: Path | str = DEFAULT_REPORT_PATH,
    manifest_path: Path | str = DEFAULT_MANIFEST_PATH,
) -> dict[str, Any]:
    """Build a compact metric index from public Stage 09 baseline artifacts."""

    report_path = Path(report_path)
    manifest_path = Path(manifest_path)
    report = _read_json(report_path)
    manifest = _read_json(manifest_path)

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
    _expect_equal(manifest.get("stage"), report.get("stage"), "manifest.stage", errors)
    _expect_equal(
        manifest.get("public_repo_safety", {}).get("includes_docs_automation"),
        False,
        "manifest public repo docs/automation safety",
        errors,
    )
    runtime_gate_status = (
        report.get("stream_contract_profile", {})
        .get("runtime_evidence_gate", {})
        .get("status")
    )
    _expect_equal(
        runtime_gate_status,
        "contract_only_blocked",
        "runtime stream evidence gate",
        errors,
    )
    rust_scope = str(manifest.get("rust_scope", ""))
    if "not a whole-project rewrite" not in rust_scope:
        errors.append("manifest.rust_scope must reject a whole-project rewrite")

    target_checks = _require_mapping(
        report.get("target_results", {}).get("checks"),
        "target_results.checks",
    )
    metrics = _require_mapping(report.get("metrics"), "metrics")
    workload = _require_mapping(report.get("workload"), "workload")
    stable_fingerprint = _require_mapping(
        report.get("stable_report_fingerprint"),
        "stable_report_fingerprint",
    )
    determinism_profile = _require_mapping(
        report.get("determinism_profile"),
        "determinism_profile",
    )
    measurement_boundary = _require_mapping(
        report.get("measurement_boundary"),
        "measurement_boundary",
    )

    metric_index = [
        _metric_entry(metric_name, target_checks, metrics, workload)
        for metric_name in HEADLINE_METRICS
    ]
    if errors:
        raise BaselineMetricIndexError("\n".join(errors))

    passed_metrics = [
        item["metric"] for item in metric_index if item["meets_target"] is True
    ]
    missed_metrics = [
        item["metric"] for item in metric_index if item["meets_target"] is False
    ]

    return {
        "schema": "telemforge.stage09_baseline_metric_index.v1",
        "status": "baseline_metric_index_ready",
        "stage": report.get("stage"),
        "task_id": manifest.get("task_id"),
        "report_path": _display_path(report_path),
        "manifest_path": _display_path(manifest_path),
        "headline_metric_order": HEADLINE_METRICS,
        "metric_index": metric_index,
        "metric_groups": {
            "throughput": [
                "channel_count",
                "per_channel_sample_rate_hz",
                "aggregate_sample_rate_hz",
            ],
            "latency": [
                "p95_alert_latency_ms",
                "p95_replay_query_latency_ms",
            ],
            "reliability": ["dropped_event_count"],
        },
        "target_counts": {
            "total": len(metric_index),
            "passed": len(passed_metrics),
            "missed": len(missed_metrics),
        },
        "passed_metrics": passed_metrics,
        "missed_metrics": missed_metrics,
        "stable_fingerprint": {
            "digest_sha256": stable_fingerprint.get("digest_sha256"),
            "stable_identity_field_count": len(
                stable_fingerprint.get("stable_identity_fields", [])
            ),
        },
        "workload_identity": determinism_profile.get("workload_identity"),
        "measurement_scope": {
            "baseline_claim": measurement_boundary.get("baseline_claim"),
            "measured_now": measurement_boundary.get("measured_now"),
            "not_measured_yet": measurement_boundary.get("not_measured_yet"),
        },
        "runtime_stream_claim_status": runtime_gate_status,
        "rust_scope": "Rust data-plane candidate only; not a whole-project rewrite",
        "next_comparable_candidate": report.get("next_hot_path_profile", {}).get(
            "selected_candidate"
        ),
        "public_repo_safety": manifest.get("public_repo_safety"),
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Summarize Stage 09 realtime baseline headline metrics."
    )
    parser.add_argument("--report", default=str(DEFAULT_REPORT_PATH.relative_to(ROOT)))
    parser.add_argument(
        "--manifest",
        default=str(DEFAULT_MANIFEST_PATH.relative_to(ROOT)),
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional JSON metric-index path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        result = summarize_stage09_baseline_metric_index(
            report_path=args.report,
            manifest_path=args.manifest,
        )
    except (OSError, json.JSONDecodeError, BaselineMetricIndexError, KeyError) as error:
        print(f"Stage 09 baseline metric index failed:\n{error}", file=sys.stderr)
        return 1

    if args.output is not None:
        _write_json(Path(args.output), result)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def _metric_entry(
    metric_name: str,
    target_checks: dict[str, Any],
    metrics: dict[str, Any],
    workload: dict[str, Any],
) -> dict[str, Any]:
    check = _require_mapping(
        target_checks.get(metric_name),
        f"target_results.checks.{metric_name}",
    )
    observed_source = {
        "channel_count": "workload.channel_count",
        "per_channel_sample_rate_hz": "workload.per_channel_sample_rate_hz",
        "aggregate_sample_rate_hz": "metrics.telemetry_sample_rate_hz",
        "p95_alert_latency_ms": "metrics.p95_alert_latency_ms",
        "p95_replay_query_latency_ms": "metrics.p95_replay_query_latency_ms",
        "dropped_event_count": "metrics.dropped_event_count",
    }[metric_name]
    observed = _path_value(
        {"metrics": metrics, "workload": workload},
        observed_source,
    )
    if observed != check.get("observed"):
        raise BaselineMetricIndexError(
            f"{metric_name} observed value does not match target_results.checks"
        )
    return {
        "metric": metric_name,
        "observed": observed,
        "target": check.get("target"),
        "comparison": check.get("comparison"),
        "unit": check.get("unit"),
        "meets_target": check.get("meets_target"),
        "gap_to_target": check.get("gap_to_target"),
        "observed_source": observed_source,
    }


def _path_value(document: dict[str, Any], path: str) -> Any:
    value: Any = document
    for part in path.split("."):
        if not isinstance(value, dict) or part not in value:
            raise BaselineMetricIndexError(f"missing JSON path: {path}")
        value = value[part]
    return value


def _read_json(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as file:
        value = json.load(file)
    return _require_mapping(value, str(path))


def _write_json(path: Path, value: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(value, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def _require_mapping(value: Any, label: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise BaselineMetricIndexError(f"{label} must be a JSON object")
    return value


def _expect_equal(
    left: Any,
    right: Any,
    label: str,
    errors: list[str],
) -> None:
    if left != right:
        errors.append(f"{label} mismatch: expected {right!r}, got {left!r}")


def _display_path(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT))
    except ValueError:
        return str(path)


if __name__ == "__main__":
    raise SystemExit(main())
