import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.check_stage09_candidate_promotion_readiness import (
    check_stage09_candidate_promotion_readiness,
)
from scripts.run_stage09_rust_stream_fanout_candidate import (
    run_stage09_rust_stream_fanout_candidate,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
READINESS_PATH = ARTIFACT_ROOT / "stage09-baseline-readiness-summary.json"
TARGET_GAP_PATH = ARTIFACT_ROOT / "stage09-target-gap-summary.json"
RUNTIME_CHECKLIST_PATH = ARTIFACT_ROOT / "stage09-runtime-stream-evidence-checklist.json"
PROMOTION_READINESS_PATH = ARTIFACT_ROOT / "stage09-candidate-promotion-readiness.json"
RUST_CANDIDATE_REPORT_PATH = (
    ARTIFACT_ROOT / "stage09-rust-stream-fanout-sample-rate-report.json"
)
SUSTAINED_LOAD_PATH = ARTIFACT_ROOT / "stage09-live-stream-sustained-load.json"


class Stage09CandidatePromotionReadinessTest(unittest.TestCase):
    def test_current_baseline_is_blocked_until_target_misses_clear(self) -> None:
        result = check_stage09_candidate_promotion_readiness(
            readiness_path=READINESS_PATH,
            target_gap_path=TARGET_GAP_PATH,
            runtime_checklist_path=RUNTIME_CHECKLIST_PATH,
            candidate_report_path=None,
        )

        self.assertEqual(
            result["schema"],
            "telemforge.stage09_candidate_promotion_readiness.v1",
        )
        self.assertEqual(result["status"], "blocked_pending_target_misses")
        self.assertFalse(result["candidate_can_be_promoted"])
        self.assertEqual(
            result["next_comparable_candidate"],
            "rust_stream_fanout_sample_rate_spike",
        )
        self.assertEqual(
            result["runtime_stream_claim_status"],
            "runtime_verified_bounded_fanout",
        )
        self.assertEqual(
            result["blocking_reasons"],
            [
                "missed_realtime_targets_remain",
            ],
        )
        self.assertEqual(
            result["missed_targets"],
            [
                "aggregate_sample_rate_hz",
                "channel_count",
                "per_channel_sample_rate_hz",
            ],
        )
        self.assertIn("stream fanout", result["promotion_rule"])
        self.assertIn("not a whole-project rewrite", result["rust_scope"])
        self.assertFalse(result["public_repo_safety"]["includes_docs_automation"])

    def test_target_scale_candidate_is_blocked_only_by_sustained_load(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            candidate_path = Path(tmpdir) / "target-scale-candidate.json"
            run_stage09_rust_stream_fanout_candidate(output_path=candidate_path)

            result = check_stage09_candidate_promotion_readiness(
                readiness_path=READINESS_PATH,
                target_gap_path=TARGET_GAP_PATH,
                runtime_checklist_path=RUNTIME_CHECKLIST_PATH,
                candidate_report_path=candidate_path,
                sustained_load_evidence_path=None,
            )

        self.assertFalse(result["candidate_can_be_promoted"])
        self.assertEqual(result["missed_targets"], [])
        self.assertEqual(
            result["passed_targets"],
            [
                "aggregate_sample_rate_hz",
                "channel_count",
                "dropped_event_count",
                "p95_alert_latency_ms",
                "p95_replay_query_latency_ms",
                "per_channel_sample_rate_hz",
            ],
        )
        self.assertEqual(result["blocking_reasons"], ["sustained_load_evidence_missing"])
        self.assertEqual(
            result["candidate_status_detail"],
            "target_scale_metrics_passed_blocked_pending_sustained_load_evidence",
        )
        self.assertEqual(
            result["runtime_stream_claim_status"],
            "runtime_verified_bounded_fanout",
        )
        self.assertEqual(
            result["candidate_report"],
            "target-scale-candidate.json",
        )

    def test_target_scale_candidate_is_promotable_with_sustained_load_evidence(self) -> None:
        result = check_stage09_candidate_promotion_readiness(
            readiness_path=READINESS_PATH,
            target_gap_path=TARGET_GAP_PATH,
            runtime_checklist_path=RUNTIME_CHECKLIST_PATH,
            candidate_report_path=RUST_CANDIDATE_REPORT_PATH,
            sustained_load_evidence_path=SUSTAINED_LOAD_PATH,
        )

        self.assertTrue(result["candidate_can_be_promoted"])
        self.assertEqual(result["status"], "ready_for_candidate_comparison")
        self.assertEqual(result["candidate_status_detail"], "candidate_ready_for_promotion")
        self.assertEqual(result["blocking_reasons"], [])
        self.assertEqual(result["missed_targets"], [])
        self.assertEqual(result["missing_runtime_probe_evidence"], [])
        self.assertEqual(
            result["sustained_load_evidence"],
            "docs/development/artifacts/stage09-realtime-baseline/stage09-live-stream-sustained-load.json",
        )
        self.assertIn("sustained_load_evidence_valid", result["verified_gates"])

    def test_public_promotion_readiness_artifact_matches_current_result(self) -> None:
        result = check_stage09_candidate_promotion_readiness(
            readiness_path=READINESS_PATH,
            target_gap_path=TARGET_GAP_PATH,
            runtime_checklist_path=RUNTIME_CHECKLIST_PATH,
        )
        artifact = json.loads(PROMOTION_READINESS_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, result)
        self.assertTrue(artifact["candidate_can_be_promoted"])
        self.assertEqual(artifact["blocking_reasons"], [])
        self.assertFalse(
            any(
                "docs/automation" in value
                for value in artifact.values()
                if isinstance(value, str)
            )
        )

    def test_cli_writes_promotion_readiness_artifact(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "promotion-readiness.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/check_stage09_candidate_promotion_readiness.py",
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
            "ready_for_candidate_comparison",
        )

    def test_rejects_runtime_claim_without_probe_checklist(self) -> None:
        readiness = json.loads(READINESS_PATH.read_text(encoding="utf-8"))
        readiness["runtime_stream_claim_status"] = "runtime_claimed"

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_readiness = Path(tmpdir) / "bad-readiness.json"
            bad_readiness.write_text(json.dumps(readiness), encoding="utf-8")
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/check_stage09_candidate_promotion_readiness.py",
                    "--readiness",
                    str(bad_readiness),
                ],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(completed.returncode, 0)
        self.assertIn("runtime stream claim status mismatch", completed.stderr)


if __name__ == "__main__":
    unittest.main()
