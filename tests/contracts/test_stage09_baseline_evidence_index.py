import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.summarize_stage09_baseline_evidence_index import (
    summarize_stage09_baseline_evidence_index,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
METRIC_INDEX_PATH = ARTIFACT_ROOT / "stage09-baseline-metric-index.json"
COMMAND_VALIDATION_PATH = (
    ARTIFACT_ROOT / "stage09-baseline-command-evidence-validation.json"
)
PROMOTION_READINESS_PATH = ARTIFACT_ROOT / "stage09-candidate-promotion-readiness.json"
READINESS_PATH = ARTIFACT_ROOT / "stage09-baseline-readiness-summary.json"
EVIDENCE_INDEX_PATH = ARTIFACT_ROOT / "stage09-baseline-evidence-index.json"


class Stage09BaselineEvidenceIndexTest(unittest.TestCase):
    def test_evidence_index_accepts_current_public_artifacts(self) -> None:
        index = summarize_stage09_baseline_evidence_index(
            metric_index_path=METRIC_INDEX_PATH,
            command_validation_path=COMMAND_VALIDATION_PATH,
            promotion_readiness_path=PROMOTION_READINESS_PATH,
            readiness_path=READINESS_PATH,
        )

        self.assertEqual(
            index["schema"],
            "telemforge.stage09_baseline_evidence_index.v1",
        )
        self.assertEqual(index["status"], "baseline_evidence_index_ready")
        self.assertEqual(index["target_counts"]["total"], 6)
        self.assertEqual(index["target_counts"]["passed"], 3)
        self.assertEqual(index["target_counts"]["missed"], 3)
        self.assertEqual(
            index["runtime_claims"]["benchmark_runtime_claim_status"],
            "not_claimed",
        )
        self.assertEqual(
            index["runtime_claims"]["stream_runtime_claim_status"],
            "contract_only_blocked",
        )
        self.assertFalse(index["runtime_claims"]["candidate_can_be_promoted"])
        self.assertIn("runtime_stream_claim_blocked", index["blocking_reasons"])
        self.assertGreater(index["missing_runtime_probe_evidence_count"], 0)
        self.assertEqual(
            index["next_comparable_candidate"],
            "rust_stream_fanout_sample_rate_spike",
        )
        self.assertIn("not a whole-project rewrite", index["rust_scope"])
        self.assertFalse(index["public_repo_safety"]["includes_docs_automation"])

    def test_public_evidence_index_artifact_matches_current_result(self) -> None:
        index = summarize_stage09_baseline_evidence_index(
            metric_index_path=METRIC_INDEX_PATH,
            command_validation_path=COMMAND_VALIDATION_PATH,
            promotion_readiness_path=PROMOTION_READINESS_PATH,
            readiness_path=READINESS_PATH,
        )
        artifact = json.loads(EVIDENCE_INDEX_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, index)
        self.assertFalse(
            any(
                "docs/automation" in value
                for value in artifact.values()
                if isinstance(value, str)
            )
        )

    def test_cli_writes_evidence_index(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "evidence-index.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/summarize_stage09_baseline_evidence_index.py",
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
        self.assertEqual(output_payload["status"], "baseline_evidence_index_ready")

    def test_rejects_accidental_runtime_promotion(self) -> None:
        promotion = json.loads(PROMOTION_READINESS_PATH.read_text(encoding="utf-8"))
        promotion["candidate_can_be_promoted"] = True

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_promotion = Path(tmpdir) / "bad-promotion.json"
            bad_promotion.write_text(json.dumps(promotion), encoding="utf-8")

            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/summarize_stage09_baseline_evidence_index.py",
                    "--promotion-readiness",
                    str(bad_promotion),
                ],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(completed.returncode, 0)
        self.assertIn(
            "promotion_readiness.candidate_can_be_promoted",
            completed.stderr,
        )


if __name__ == "__main__":
    unittest.main()
