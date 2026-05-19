import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.compare_stage09_candidate_metrics import (
    CandidateMetricComparisonError,
    compare_stage09_candidate_metrics,
)
from scripts.run_stage09_rust_stream_fanout_candidate import (
    run_stage09_rust_stream_fanout_candidate,
)
from scripts.validate_stage09_realtime_report import validate_stage09_report


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
BASELINE_REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
PROMOTION_READINESS_PATH = ARTIFACT_ROOT / "stage09-candidate-promotion-readiness.json"
RUST_CANDIDATE_REPORT_PATH = (
    ARTIFACT_ROOT / "stage09-rust-stream-fanout-sample-rate-report.json"
)


class Stage09RustStreamFanoutCandidateTest(unittest.TestCase):
    def test_runner_writes_compatible_versioned_candidate_report(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "stage09-rust-candidate.json"

            report = run_stage09_rust_stream_fanout_candidate(output_path=output_path)
            artifact = json.loads(output_path.read_text(encoding="utf-8"))
            validation = validate_stage09_report(output_path)

        self.assertEqual(artifact, report)
        self.assertEqual(report["schema"], "telemforge.stage09_realtime_baseline.v1")
        self.assertEqual(
            report["candidate_profile"]["schema"],
            "telemforge.stage09_rust_stream_fanout_candidate.v1",
        )
        self.assertEqual(
            report["candidate_profile"]["candidate_id"],
            "rust_stream_fanout_sample_rate_spike",
        )
        self.assertEqual(
            report["run_variant_policy"]["versioned_workload_change"]["reason"],
            "rust_stream_fanout_sample_rate_candidate",
        )
        self.assertEqual(report["resource_guard"]["worker_processes"], 1)
        self.assertFalse(report["resource_guard"]["uses_network"])
        self.assertFalse(report["resource_guard"]["uses_paid_services"])
        self.assertGreater(report["workload"]["channel_count"], 10)
        self.assertGreater(report["workload"]["per_channel_sample_rate_hz"], 1.0)
        self.assertGreater(report["metrics"]["telemetry_sample_rate_hz"], 10.0)
        self.assertEqual(report["metrics"]["dropped_event_count"], 0)
        self.assertEqual(
            report["target_results"]["missed_targets"],
            [
                "channel_count",
                "per_channel_sample_rate_hz",
                "aggregate_sample_rate_hz",
            ],
        )
        self.assertFalse(report["candidate_profile"]["report_path"].startswith("/"))
        self.assertIn("stage09-rust", report["candidate_profile"]["report_path"])
        self.assertFalse(_contains_private_path(report))

        self.assertEqual(validation["status"], "passed")

    def test_cli_writes_candidate_report_artifact(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "candidate-report.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/run_stage09_rust_stream_fanout_candidate.py",
                    "--output",
                    str(output_path),
                ],
                cwd=ROOT,
                check=True,
                capture_output=True,
                text=True,
            )

            stdout_payload = json.loads(completed.stdout)
            output_payload = json.loads(output_path.read_text(encoding="utf-8"))

        self.assertEqual(output_payload, stdout_payload)
        self.assertEqual(
            output_payload["candidate_profile"]["source_crate"],
            "rust/stage09_stream_fanout_sample_rate",
        )

    def test_candidate_comparison_reports_improved_throughput_metrics(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            candidate_path = Path(tmpdir) / "candidate-report.json"
            run_stage09_rust_stream_fanout_candidate(output_path=candidate_path)

            result = compare_stage09_candidate_metrics(
                baseline_report_path=BASELINE_REPORT_PATH,
                candidate_report_path=candidate_path,
                promotion_readiness_path=PROMOTION_READINESS_PATH,
            )

        self.assertEqual(result["stable_identity_status"], "versioned_workload_change")
        self.assertFalse(result["same_report_reference"])
        self.assertIn("channel_count", result["improved_metrics"])
        self.assertIn("per_channel_sample_rate_hz", result["improved_metrics"])
        self.assertIn("aggregate_sample_rate_hz", result["improved_metrics"])
        self.assertEqual(result["regressed_metrics"], [])
        self.assertEqual(result["newly_passing_metrics"], [])
        self.assertFalse(result["candidate_can_be_promoted"])

    def test_candidate_comparison_rejects_unversioned_stable_identity_change(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            candidate_path = Path(tmpdir) / "candidate-report.json"
            candidate = run_stage09_rust_stream_fanout_candidate(
                output_path=candidate_path
            )
            candidate["run_variant_policy"].pop("versioned_workload_change")
            candidate_path.write_text(json.dumps(candidate), encoding="utf-8")

            with self.assertRaises(CandidateMetricComparisonError):
                compare_stage09_candidate_metrics(
                    baseline_report_path=BASELINE_REPORT_PATH,
                    candidate_report_path=candidate_path,
                    promotion_readiness_path=PROMOTION_READINESS_PATH,
                )


def _contains_private_path(value: object) -> bool:
    if isinstance(value, dict):
        return any(_contains_private_path(item) for item in value.values())
    if isinstance(value, list):
        return any(_contains_private_path(item) for item in value)
    if isinstance(value, str):
        return "/Users/" in value or "docs/automation" in value
    return False


if __name__ == "__main__":
    unittest.main()
