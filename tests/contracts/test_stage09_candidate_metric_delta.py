import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.compare_stage09_candidate_metrics import (
    compare_stage09_candidate_metrics,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
BASELINE_REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
PROMOTION_READINESS_PATH = ARTIFACT_ROOT / "stage09-candidate-promotion-readiness.json"
CANDIDATE_METRIC_DELTA_PATH = ARTIFACT_ROOT / "stage09-candidate-metric-delta.json"
RUST_CANDIDATE_REPORT_PATH = (
    ARTIFACT_ROOT / "stage09-rust-stream-fanout-sample-rate-report.json"
)


class Stage09CandidateMetricDeltaTest(unittest.TestCase):
    def test_current_baseline_reference_has_no_candidate_delta(self) -> None:
        result = compare_stage09_candidate_metrics(
            baseline_report_path=BASELINE_REPORT_PATH,
            candidate_report_path=BASELINE_REPORT_PATH,
            promotion_readiness_path=PROMOTION_READINESS_PATH,
        )

        self.assertEqual(
            result["schema"],
            "telemforge.stage09_candidate_metric_delta.v1",
        )
        self.assertEqual(result["status"], "baseline_reference_no_candidate")
        self.assertTrue(result["same_report_reference"])
        self.assertEqual(result["stable_identity_status"], "matches")
        self.assertEqual(
            result["runtime_stream_claim_status"],
            "runtime_verified_bounded_fanout",
        )
        self.assertFalse(result["candidate_can_be_promoted"])
        self.assertEqual(result["improved_metrics"], [])
        self.assertEqual(result["regressed_metrics"], [])
        self.assertEqual(result["newly_passing_metrics"], [])
        self.assertIn("not a whole-project rewrite", result["rust_scope"])
        self.assertFalse(result["public_repo_safety"]["includes_docs_automation"])
        for metric_delta in result["metric_deltas"].values():
            self.assertEqual(metric_delta["change_status"], "unchanged")

    def test_public_candidate_metric_delta_artifact_matches_current_result(self) -> None:
        result = compare_stage09_candidate_metrics(
            baseline_report_path=BASELINE_REPORT_PATH,
            candidate_report_path=RUST_CANDIDATE_REPORT_PATH,
            promotion_readiness_path=PROMOTION_READINESS_PATH,
        )
        artifact = json.loads(CANDIDATE_METRIC_DELTA_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, result)
        self.assertFalse(
            any(
                "docs/automation" in value
                for value in artifact.values()
                if isinstance(value, str)
            )
        )

    def test_cli_writes_candidate_metric_delta_artifact(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "candidate-metric-delta.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/compare_stage09_candidate_metrics.py",
                    "--candidate-report",
                    str(RUST_CANDIDATE_REPORT_PATH),
                    "--promotion-readiness",
                    str(PROMOTION_READINESS_PATH),
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
            output_payload["status"],
            "candidate_blocked_pending_promotion_gates",
        )

    def test_rejects_candidate_metric_target_mismatch(self) -> None:
        candidate = json.loads(BASELINE_REPORT_PATH.read_text(encoding="utf-8"))
        candidate["target_results"]["checks"]["channel_count"]["target"] = 999

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_candidate_path = Path(tmpdir) / "bad-candidate.json"
            bad_candidate_path.write_text(json.dumps(candidate), encoding="utf-8")
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/compare_stage09_candidate_metrics.py",
                    "--candidate-report",
                    str(bad_candidate_path),
                ],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(completed.returncode, 0)
        self.assertIn("channel_count.target mismatch", completed.stderr)


if __name__ == "__main__":
    unittest.main()
