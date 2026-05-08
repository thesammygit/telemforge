import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.validate_stage09_baseline_review_packet import (
    validate_stage09_baseline_review_packet,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
REVIEW_PACKET_PATH = ARTIFACT_ROOT / "stage09-baseline-review-packet.json"
REVIEW_PACKET_VALIDATION_PATH = (
    ARTIFACT_ROOT / "stage09-baseline-review-packet-validation.json"
)


class Stage09BaselineReviewPacketValidationTest(unittest.TestCase):
    def test_review_packet_validation_accepts_current_public_packet(self) -> None:
        summary = validate_stage09_baseline_review_packet()

        self.assertEqual(
            summary["schema"],
            "telemforge.stage09_baseline_review_packet_validation.v1",
        )
        self.assertEqual(summary["status"], "passed")
        self.assertEqual(
            summary["runtime_claims"]["stream_runtime_claim_status"],
            "contract_only_blocked",
        )
        self.assertFalse(summary["runtime_claims"]["candidate_can_be_promoted"])
        self.assertFalse(summary["public_repo_safety"]["includes_docs_automation"])
        self.assertIn("not a whole-project rewrite", summary["rust_scope"])
        self.assertIn(
            "review_packet_matches_current_source_artifacts",
            summary["verified_gates"],
        )

    def test_public_validation_artifact_matches_current_result(self) -> None:
        summary = validate_stage09_baseline_review_packet()
        artifact = json.loads(REVIEW_PACKET_VALIDATION_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, summary)
        self.assertFalse(artifact["public_repo_safety"]["uses_private_runtime_state"])

    def test_cli_writes_review_packet_validation_summary(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "review-packet-validation.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/validate_stage09_baseline_review_packet.py",
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
        self.assertEqual(output_payload["status"], "passed")

    def test_rejects_stale_review_packet(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            stale_path = Path(tmpdir) / "stale-review-packet.json"
            payload = json.loads(REVIEW_PACKET_PATH.read_text(encoding="utf-8"))
            payload["target_counts"]["missed"] = 0
            stale_path.write_text(json.dumps(payload), encoding="utf-8")

            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/validate_stage09_baseline_review_packet.py",
                    "--review-packet",
                    str(stale_path),
                ],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(completed.returncode, 0)
        self.assertIn("review_packet.target_counts", completed.stderr)

    def test_rejects_docs_automation_source_path(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            unsafe_path = Path(tmpdir) / "unsafe-review-packet.json"
            payload = json.loads(REVIEW_PACKET_PATH.read_text(encoding="utf-8"))
            payload["source_artifacts"]["baseline_report"] = (
                "docs/automation/control.md"
            )
            unsafe_path.write_text(json.dumps(payload), encoding="utf-8")

            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/validate_stage09_baseline_review_packet.py",
                    "--review-packet",
                    str(unsafe_path),
                ],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(completed.returncode, 0)
        self.assertIn("docs/automation", completed.stderr)


if __name__ == "__main__":
    unittest.main()
