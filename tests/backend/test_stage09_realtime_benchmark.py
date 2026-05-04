import json
import subprocess
import sys
import tempfile
import unittest
from hashlib import sha256
from pathlib import Path

from scripts.benchmark_stage09_realtime import (
    run_stage09_realtime_baseline,
    write_stage09_markdown_summary,
)


class Stage09RealtimeBenchmarkTest(unittest.TestCase):
    def test_baseline_reports_realtime_metrics_and_runtime_boundary(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            database_path = Path(tmpdir) / "stage09-baseline.sqlite"

            summary = run_stage09_realtime_baseline(
                database_path=database_path,
                alert_iterations=3,
                replay_iterations=3,
            )

            self.assertTrue(database_path.exists())
            self.assertEqual(summary["schema"], "telemforge.stage09_realtime_baseline.v1")
            self.assertEqual(summary["stage"], "09-realtime-performance-and-rust-data-plane")
            execution_profile = summary["execution_profile"]
            self.assertEqual(
                execution_profile["schema"],
                "telemforge.stage09_execution_profile.v1",
            )
            self.assertEqual(
                execution_profile["process_model"],
                "single-process in-process FastAPI TestClient",
            )
            self.assertEqual(execution_profile["client_count"], 1)
            self.assertEqual(
                execution_profile["resource_scope"],
                "bounded local smoke, no worker fan-out",
            )
            resource_guard = summary["resource_guard"]
            self.assertEqual(
                resource_guard["schema"],
                "telemforge.stage09_resource_guard.v1",
            )
            self.assertEqual(resource_guard["worker_processes"], 1)
            self.assertEqual(resource_guard["max_expected_runtime_seconds"], 30)
            self.assertEqual(resource_guard["max_expected_memory_mb"], 512)
            self.assertFalse(resource_guard["uses_network"])
            self.assertFalse(resource_guard["uses_paid_services"])
            self.assertEqual(
                execution_profile["load_shape"]["aggregate_sample_rate_hz"],
                10.0,
            )
            self.assertIn(
                "websocket stream fanout",
                execution_profile["deferred_paths"],
            )
            contract = summary["benchmark_contract"]
            self.assertEqual(
                contract["schema"],
                "telemforge.stage09_realtime_benchmark_contract.v1",
            )
            comparison_profile = summary["comparison_profile"]
            self.assertEqual(
                comparison_profile["schema"],
                "telemforge.stage09_realtime_comparison_profile.v1",
            )
            self.assertIn(
                "execution_profile.load_shape",
                comparison_profile["stable_fields"],
            )
            self.assertIn(
                "metrics.p95_alert_latency_ms",
                comparison_profile["run_specific_fields"],
            )
            self.assertIn(
                "Report dropped_event_count explicitly",
                comparison_profile["compatibility_requirements"][2],
            )
            self.assertIn(
                "determinism_profile.workload_identity",
                comparison_profile["stable_fields"],
            )
            self.assertIn(
                "determinism_profile.stable_inputs",
                comparison_profile["stable_fields"],
            )
            self.assertIn(
                "latency_budget_profile.budgets",
                comparison_profile["stable_fields"],
            )
            self.assertIn(
                "input_provenance.telemetry_catalog_sha256",
                comparison_profile["stable_fields"],
            )
            self.assertIn(
                "Keep determinism_profile.workload_identity unchanged",
                comparison_profile["compatibility_requirements"][3],
            )
            self.assertIn(
                "latency_budget_profile fields",
                comparison_profile["compatibility_requirements"][5],
            )
            determinism_profile = summary["determinism_profile"]
            self.assertEqual(
                determinism_profile["schema"],
                "telemforge.stage09_determinism_profile.v1",
            )
            self.assertEqual(
                determinism_profile["workload_identity"],
                "nominal-orbit-daylight:seed-9090:channels-10:samples-10:step-1s",
            )
            self.assertEqual(
                determinism_profile["stable_inputs"],
                {
                    "scenario": "nominal-orbit-daylight",
                    "seed": 9090,
                    "start_at": "2026-05-03T16:00:00Z",
                    "channel_count": 10,
                    "samples_per_channel": 10,
                    "step_seconds": 1,
                },
            )
            input_provenance = summary["input_provenance"]
            catalog_path = Path("fixtures/telemetry/channels.json")
            catalog_bytes = catalog_path.read_bytes()
            self.assertEqual(
                input_provenance,
                {
                    "schema": "telemforge.stage09_input_provenance.v1",
                    "purpose": (
                        "Bind comparable benchmark runs to the exact telemetry "
                        "catalog used for workload generation."
                    ),
                    "telemetry_catalog_path": "fixtures/telemetry/channels.json",
                    "telemetry_catalog_schema": "telemforge.telemetry.channels.v1",
                    "telemetry_catalog_sha256": sha256(catalog_bytes).hexdigest(),
                    "telemetry_catalog_bytes": len(catalog_bytes),
                    "channel_count": 10,
                },
            )
            self.assertIn(
                "metrics.p95_alert_latency_ms",
                determinism_profile["run_variant_fields"],
            )
            latency_budget_profile = summary["latency_budget_profile"]
            self.assertEqual(
                latency_budget_profile["schema"],
                "telemforge.stage09_latency_budget_profile.v1",
            )
            self.assertEqual(
                latency_budget_profile["budgets"],
                {
                    "alert_evaluation_p95_ms": 50,
                    "bounded_replay_query_p95_ms": 500,
                },
            )
            self.assertEqual(
                latency_budget_profile["observed_p95_ms"]["alert_evaluation"],
                summary["metrics"]["p95_alert_latency_ms"],
            )
            self.assertEqual(
                latency_budget_profile["observed_p95_ms"]["bounded_replay_query"],
                summary["metrics"]["p95_replay_query_latency_ms"],
            )
            self.assertGreaterEqual(
                latency_budget_profile["remaining_budget_ms"]["alert_evaluation"],
                0,
            )
            self.assertIn(
                "workload_identity",
                latency_budget_profile["comparison_rule"],
            )
            self.assertEqual(
                contract["workload_generation"]["source"],
                "Stage 02 telemetry channel catalog via the FastAPI "
                "simulation endpoint",
            )
            self.assertEqual(contract["workload_generation"]["seed"], 9090)
            self.assertEqual(
                contract["measurement_method"]["sample_rate"],
                "catalog channel count multiplied by 1 / step_seconds",
            )
            self.assertIn(
                "nearest-rank p95",
                contract["measurement_method"]["alert_latency"],
            )
            self.assertIn(
                "Rust data-plane candidate",
                contract["comparability_rules"][3],
            )
            self.assertIn("resource_guard", contract["comparability_rules"][5])
            self.assertEqual(summary["workload"]["channel_count"], 10)
            self.assertEqual(summary["workload"]["samples_per_channel"], 10)
            self.assertEqual(summary["workload"]["per_channel_sample_rate_hz"], 1.0)
            self.assertEqual(summary["workload"]["aggregate_sample_rate_hz"], 10.0)
            self.assertEqual(
                summary["workload"]["sample_window"],
                {
                    "start_at": "2026-05-03T16:00:00Z",
                    "last_sample_at": "2026-05-03T16:00:09Z",
                    "sample_interval_seconds": 1,
                    "sample_span_seconds": 9,
                },
            )
            self.assertEqual(summary["metrics"]["per_channel_sample_rate_hz"], 1.0)
            self.assertEqual(summary["metrics"]["dropped_event_count"], 0)
            self.assertGreaterEqual(summary["metrics"]["p95_alert_latency_ms"], 0.0)
            self.assertGreaterEqual(summary["metrics"]["p95_replay_query_latency_ms"], 0.0)
            self.assertFalse(summary["target_results"]["meets_all_targets"])
            self.assertIn(
                "per_channel_sample_rate_hz",
                summary["target_results"]["missed_targets"],
            )
            self.assertEqual(
                summary["baseline_verdict"],
                {
                    "schema": "telemforge.stage09_baseline_verdict.v1",
                    "status": "baseline_only_targets_not_met",
                    "summary": (
                        "Current Python/FastAPI baseline is suitable for "
                        "comparison, not production realtime claims."
                    ),
                    "passed_targets": [
                        "p95_alert_latency_ms",
                        "p95_replay_query_latency_ms",
                        "dropped_event_count",
                    ],
                    "missed_targets": [
                        "channel_count",
                        "per_channel_sample_rate_hz",
                        "aggregate_sample_rate_hz",
                    ],
                    "next_comparable_candidate": (
                        "narrow Rust data-plane hot path using the same "
                        "benchmark_contract, execution_profile, and "
                        "resource_guard fields"
                    ),
                    "rust_scope": (
                        "data-plane candidate only; not a whole-project rewrite"
                    ),
                },
            )
            self.assertEqual(
                summary["target_results"]["checks"]["per_channel_sample_rate_hz"],
                {
                    "observed": 1.0,
                    "target": 10,
                    "comparison": "at_least",
                    "unit": "Hz",
                    "gap_to_target": 9.0,
                    "meets_target": False,
                },
            )
            self.assertEqual(
                summary["target_results"]["checks"]["dropped_event_count"],
                {
                    "observed": 0,
                    "target": 0,
                    "comparison": "at_most",
                    "unit": "events",
                    "gap_to_target": 0,
                    "meets_target": True,
                },
            )
            self.assertIn(
                "Rust data plane direction, not a whole-project rewrite",
                summary["runtime_boundary"]["tracked_direction"],
            )
            self.assertEqual(
                summary["runtime_boundary"]["python_control_plane"],
                [
                    "API orchestration",
                    "local review workflows",
                    "configuration",
                    "fixture generation",
                    "product-shaping behavior",
                ],
            )

    def test_markdown_summary_reports_target_results(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            database_path = Path(tmpdir) / "stage09-baseline.sqlite"
            summary_path = Path(tmpdir) / "stage09-baseline-summary.md"

            summary = run_stage09_realtime_baseline(
                database_path=database_path,
                alert_iterations=2,
                replay_iterations=2,
            )
            write_stage09_markdown_summary(summary, summary_path)

            summary_text = summary_path.read_text(encoding="utf-8")
            self.assertIn("# Stage 09 Realtime Baseline Summary", summary_text)
            self.assertIn(
                "Rust data plane direction, not a whole-project rewrite",
                summary_text,
            )
            self.assertIn("## Execution Profile", summary_text)
            self.assertIn(
                "- Process model: `single-process in-process FastAPI TestClient`",
                summary_text,
            )
            self.assertIn("- Client count: `1`", summary_text)
            self.assertIn("websocket stream fanout", summary_text)
            self.assertIn("## Resource Guard", summary_text)
            self.assertIn("- Worker processes: `1`", summary_text)
            self.assertIn("- Uses paid services: `False`", summary_text)
            self.assertIn("## Determinism Profile", summary_text)
            self.assertIn(
                "nominal-orbit-daylight:seed-9090:channels-10:samples-10:step-1s",
                summary_text,
            )
            self.assertIn(
                "Only compare runtime implementations when workload_identity",
                summary_text,
            )
            self.assertIn("## Latency Budget Profile", summary_text)
            self.assertIn("- Alert p95 budget: `50 ms`", summary_text)
            self.assertIn("- Replay p95 budget: `500 ms`", summary_text)
            self.assertIn("latency headroom", summary_text)
            self.assertIn("## Input Provenance", summary_text)
            self.assertIn(
                "- Telemetry catalog: `fixtures/telemetry/channels.json`",
                summary_text,
            )
            self.assertIn("- Catalog channels: `10`", summary_text)
            self.assertIn("- Catalog SHA-256: `", summary_text)
            self.assertIn("## Comparison Profile", summary_text)
            self.assertIn("execution_profile.load_shape", summary_text)
            self.assertIn("determinism_profile.workload_identity", summary_text)
            self.assertIn(
                "input_provenance.telemetry_catalog_sha256",
                summary_text,
            )
            self.assertIn("latency_budget_profile.budgets", summary_text)
            self.assertIn("metrics.p95_alert_latency_ms", summary_text)
            self.assertIn("Report dropped_event_count explicitly", summary_text)
            self.assertIn(
                "| Per-channel sample rate | 1.0 Hz | >= 10 Hz | 9.0 Hz | MISS |",
                summary_text,
            )
            self.assertIn(
                "| Dropped events | 0 events | <= 0 events | 0 events | PASS |",
                summary_text,
            )
            self.assertIn("## Baseline Verdict", summary_text)
            self.assertIn(
                "Status: `baseline_only_targets_not_met`",
                summary_text,
            )
            self.assertIn(
                "Next comparable candidate: `narrow Rust data-plane hot path",
                summary_text,
            )
            self.assertIn("Missed targets: `", summary_text)

    def test_benchmark_script_writes_report_from_repo_root(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            database_path = Path(tmpdir) / "stage09-baseline-cli.sqlite"
            report_path = Path(tmpdir) / "stage09-baseline-report.json"
            summary_path = Path(tmpdir) / "stage09-baseline-summary.md"

            result = subprocess.run(
                [
                    sys.executable,
                    "scripts/benchmark_stage09_realtime.py",
                    "--database",
                    str(database_path),
                    "--output",
                    str(report_path),
                    "--summary-output",
                    str(summary_path),
                    "--alert-iterations",
                    "2",
                    "--replay-iterations",
                    "2",
                ],
                check=False,
                capture_output=True,
                text=True,
            )

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertTrue(report_path.exists())
            self.assertTrue(summary_path.exists())
            report = json.loads(report_path.read_text(encoding="utf-8"))
            summary_text = summary_path.read_text(encoding="utf-8")
            stdout_report = json.loads(result.stdout)
            self.assertEqual(report["schema"], "telemforge.stage09_realtime_baseline.v1")
            self.assertEqual(stdout_report["schema"], report["schema"])
            self.assertEqual(report["execution_profile"]["client_count"], 1)
            self.assertEqual(report["resource_guard"]["worker_processes"], 1)
            self.assertEqual(
                report["comparison_profile"]["schema"],
                "telemforge.stage09_realtime_comparison_profile.v1",
            )
            self.assertEqual(
                report["determinism_profile"]["workload_identity"],
                "nominal-orbit-daylight:seed-9090:channels-10:samples-10:step-1s",
            )
            self.assertEqual(
                report["input_provenance"]["telemetry_catalog_path"],
                "fixtures/telemetry/channels.json",
            )
            self.assertEqual(
                report["baseline_verdict"]["status"],
                "baseline_only_targets_not_met",
            )
            self.assertFalse(report["resource_guard"]["uses_network"])
            self.assertEqual(report["metrics"]["dropped_event_count"], 0)
            self.assertEqual(
                report["target_results"]["checks"]["aggregate_sample_rate_hz"][
                    "gap_to_target"
                ],
                990.0,
            )
            self.assertIn("Python/FastAPI remains the measured control-plane", summary_text)


if __name__ == "__main__":
    unittest.main()
