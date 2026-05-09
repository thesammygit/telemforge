import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.check_stage09_baseline_handoff_gate import (
    Stage09BaselineHandoffGateError,
    check_stage09_baseline_handoff_gate,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
REVIEW_PACKET_PATH = ARTIFACT_ROOT / "stage09-baseline-review-packet.json"
REVIEW_PACKET_VALIDATION_PATH = (
    ARTIFACT_ROOT / "stage09-baseline-review-packet-validation.json"
)
REFRESH_CHECK_PATH = ARTIFACT_ROOT / "stage09-baseline-refresh-check.json"
COMMAND_EVIDENCE_PATH = ARTIFACT_ROOT / "stage09-baseline-command-evidence.json"
HANDOFF_GATE_PATH = ARTIFACT_ROOT / "stage09-baseline-handoff-gate.json"


class Stage09BaselineHandoffGateTest(unittest.TestCase):
    def test_handoff_gate_accepts_current_public_baseline(self) -> None:
        result = check_stage09_baseline_handoff_gate(
            review_packet_path=REVIEW_PACKET_PATH,
            review_packet_validation_path=REVIEW_PACKET_VALIDATION_PATH,
            refresh_check_path=REFRESH_CHECK_PATH,
            command_evidence_path=COMMAND_EVIDENCE_PATH,
        )

        self.assertEqual(
            result["schema"],
            "telemforge.stage09_baseline_handoff_gate.v1",
        )
        self.assertEqual(result["status"], "baseline_handoff_ready_runtime_blocked")
        self.assertEqual(result["target_counts"], {"total": 6, "passed": 3, "missed": 3})
        self.assertEqual(
            result["runtime_claims"]["stream_runtime_claim_status"],
            "contract_only_blocked",
        )
        self.assertFalse(result["runtime_claims"]["candidate_can_be_promoted"])
        self.assertEqual(
            result["next_comparable_candidate"],
            "rust_stream_fanout_sample_rate_spike",
        )
        self.assertFalse(result["public_repo_safety"]["includes_docs_automation"])
        self.assertIn("not a whole-project rewrite", result["rust_scope"])

    def test_public_handoff_gate_matches_current_result(self) -> None:
        result = check_stage09_baseline_handoff_gate(
            review_packet_path=REVIEW_PACKET_PATH,
            review_packet_validation_path=REVIEW_PACKET_VALIDATION_PATH,
            refresh_check_path=REFRESH_CHECK_PATH,
            command_evidence_path=COMMAND_EVIDENCE_PATH,
        )
        artifact = json.loads(HANDOFF_GATE_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, result)
        self.assertFalse(
            any("docs/automation" in path for path in artifact["source_artifacts"].values())
        )

    def test_cli_writes_handoff_gate(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "stage09-baseline-handoff-gate.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/check_stage09_baseline_handoff_gate.py",
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
        self.assertEqual(output_payload["status"], "baseline_handoff_ready_runtime_blocked")

    def test_rejects_runtime_claim_drift(self) -> None:
        review_packet = json.loads(REVIEW_PACKET_PATH.read_text(encoding="utf-8"))
        review_packet["runtime_claims"]["stream_runtime_claim_status"] = "claimed"

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_review_packet = Path(tmpdir) / "bad-review-packet.json"
            bad_review_packet.write_text(json.dumps(review_packet), encoding="utf-8")

            with self.assertRaises(Stage09BaselineHandoffGateError) as ctx:
                check_stage09_baseline_handoff_gate(
                    review_packet_path=bad_review_packet,
                    review_packet_validation_path=REVIEW_PACKET_VALIDATION_PATH,
                    refresh_check_path=REFRESH_CHECK_PATH,
                    command_evidence_path=COMMAND_EVIDENCE_PATH,
                )

        self.assertIn("runtime_claims", str(ctx.exception))


if __name__ == "__main__":
    unittest.main()
