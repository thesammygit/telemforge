import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.check_stage09_candidate_promotion_readiness import (
    check_stage09_candidate_promotion_readiness,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
READINESS_PATH = ARTIFACT_ROOT / "stage09-baseline-readiness-summary.json"
TARGET_GAP_PATH = ARTIFACT_ROOT / "stage09-target-gap-summary.json"
RUNTIME_CHECKLIST_PATH = ARTIFACT_ROOT / "stage09-runtime-stream-evidence-checklist.json"
PROMOTION_READINESS_PATH = ARTIFACT_ROOT / "stage09-candidate-promotion-readiness.json"


class Stage09CandidatePromotionReadinessTest(unittest.TestCase):
    def test_current_baseline_is_blocked_until_runtime_evidence_exists(self) -> None:
        result = check_stage09_candidate_promotion_readiness(
            readiness_path=READINESS_PATH,
            target_gap_path=TARGET_GAP_PATH,
            runtime_checklist_path=RUNTIME_CHECKLIST_PATH,
        )

        self.assertEqual(
            result["schema"],
            "telemforge.stage09_candidate_promotion_readiness.v1",
        )
        self.assertEqual(result["status"], "blocked_pending_runtime_evidence")
        self.assertFalse(result["candidate_can_be_promoted"])
        self.assertEqual(
            result["next_comparable_candidate"],
            "rust_stream_fanout_sample_rate_spike",
        )
        self.assertEqual(
            result["runtime_stream_claim_status"],
            "contract_only_blocked",
        )
        self.assertEqual(
            result["blocking_reasons"],
            [
                "runtime_stream_claim_blocked",
                "missed_realtime_targets_remain",
                "runtime_probe_evidence_missing",
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

    def test_public_promotion_readiness_artifact_matches_current_result(self) -> None:
        result = check_stage09_candidate_promotion_readiness(
            readiness_path=READINESS_PATH,
            target_gap_path=TARGET_GAP_PATH,
            runtime_checklist_path=RUNTIME_CHECKLIST_PATH,
        )
        artifact = json.loads(PROMOTION_READINESS_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, result)
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
            "blocked_pending_runtime_evidence",
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
