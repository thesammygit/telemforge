import json
import subprocess
import sys
import tempfile
import unittest
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
            self.assertIn(
                "| Per-channel sample rate | 1.0 Hz | >= 10 Hz | 9.0 Hz | MISS |",
                summary_text,
            )
            self.assertIn(
                "| Dropped events | 0 events | <= 0 events | 0 events | PASS |",
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
