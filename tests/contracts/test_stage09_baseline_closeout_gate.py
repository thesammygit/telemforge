import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.check_stage09_baseline_closeout_gate import (
    BaselineCloseoutGateError,
    check_stage09_baseline_closeout_gate,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
DIGEST_VALIDATION_PATH = ARTIFACT_ROOT / "stage09-baseline-digest-validation.json"
EVIDENCE_INDEX_PATH = ARTIFACT_ROOT / "stage09-baseline-evidence-index.json"
RUNTIME_VALIDATION_PATH = (
    ARTIFACT_ROOT / "stage09-runtime-stream-evidence-validation-summary.json"
)
PROMOTION_READINESS_PATH = ARTIFACT_ROOT / "stage09-candidate-promotion-readiness.json"
CLOSEOUT_GATE_PATH = ARTIFACT_ROOT / "stage09-baseline-closeout-gate.json"


class Stage09BaselineCloseoutGateTest(unittest.TestCase):
    def test_closeout_gate_marks_target_scale_candidate_ready_for_stage09_review(self) -> None:
        result = check_stage09_baseline_closeout_gate(
            digest_validation_path=DIGEST_VALIDATION_PATH,
            evidence_index_path=EVIDENCE_INDEX_PATH,
            runtime_validation_path=RUNTIME_VALIDATION_PATH,
            promotion_readiness_path=PROMOTION_READINESS_PATH,
        )

        self.assertEqual(
            result["schema"],
            "telemforge.stage09_baseline_closeout_gate.v1",
        )
        self.assertEqual(result["status"], "ready_for_stage09_review")
        self.assertTrue(result["runtime_claims"]["candidate_can_be_promoted"])
        self.assertEqual(
            result["runtime_claims"]["stream_runtime_claim_status"],
            "runtime_verified_bounded_fanout",
        )
        self.assertEqual(result["missing_runtime_probe_evidence_count"], 0)
        self.assertEqual(
            result["next_comparable_candidate"],
            "rust_stream_fanout_sample_rate_spike",
        )
        self.assertEqual(result["blocking_reasons"], [])
        self.assertEqual(result["missed_metrics"], [])
        self.assertFalse(result["public_repo_safety"]["includes_docs_automation"])
        self.assertIn("not a whole-project rewrite", result["rust_scope"])

    def test_public_closeout_gate_artifact_matches_current_result(self) -> None:
        result = check_stage09_baseline_closeout_gate(
            digest_validation_path=DIGEST_VALIDATION_PATH,
            evidence_index_path=EVIDENCE_INDEX_PATH,
            runtime_validation_path=RUNTIME_VALIDATION_PATH,
            promotion_readiness_path=PROMOTION_READINESS_PATH,
        )
        artifact = json.loads(CLOSEOUT_GATE_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, result)
        self.assertFalse(
            any(
                "docs/automation" in value
                for value in artifact.values()
                if isinstance(value, str)
            )
        )

    def test_cli_writes_closeout_gate_artifact(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "stage09-baseline-closeout-gate.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/check_stage09_baseline_closeout_gate.py",
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
            "ready_for_stage09_review",
        )

    def test_rejects_promotable_candidate_with_blocking_reasons(self) -> None:
        promotion_readiness = json.loads(
            PROMOTION_READINESS_PATH.read_text(encoding="utf-8")
        )
        promotion_readiness["candidate_can_be_promoted"] = True
        promotion_readiness["blocking_reasons"] = ["sustained_load_evidence_missing"]

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_promotion_readiness = Path(tmpdir) / "bad-promotion-readiness.json"
            bad_promotion_readiness.write_text(
                json.dumps(promotion_readiness),
                encoding="utf-8",
            )

            with self.assertRaises(BaselineCloseoutGateError) as ctx:
                check_stage09_baseline_closeout_gate(
                    digest_validation_path=DIGEST_VALIDATION_PATH,
                    evidence_index_path=EVIDENCE_INDEX_PATH,
                    runtime_validation_path=RUNTIME_VALIDATION_PATH,
                    promotion_readiness_path=bad_promotion_readiness,
                )

        self.assertIn("blocking reasons", str(ctx.exception))


if __name__ == "__main__":
    unittest.main()
