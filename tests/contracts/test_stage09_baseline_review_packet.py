import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.summarize_stage09_baseline_review_packet import (
    Stage09BaselineReviewPacketError,
    summarize_stage09_baseline_review_packet,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
ACCEPTANCE_MATRIX_PATH = ARTIFACT_ROOT / "stage09-baseline-acceptance-matrix.json"
CLOSEOUT_GATE_PATH = ARTIFACT_ROOT / "stage09-baseline-closeout-gate.json"
COMMAND_EVIDENCE_PATH = ARTIFACT_ROOT / "stage09-baseline-command-evidence.json"
REVIEW_PACKET_PATH = ARTIFACT_ROOT / "stage09-baseline-review-packet.json"


class Stage09BaselineReviewPacketTest(unittest.TestCase):
    def test_review_packet_summarizes_benchmark_baseline_for_handoff(self) -> None:
        result = summarize_stage09_baseline_review_packet(
            acceptance_matrix_path=ACCEPTANCE_MATRIX_PATH,
            closeout_gate_path=CLOSEOUT_GATE_PATH,
            command_evidence_path=COMMAND_EVIDENCE_PATH,
        )

        self.assertEqual(
            result["schema"],
            "telemforge.stage09_baseline_review_packet.v1",
        )
        self.assertEqual(result["status"], "baseline_verified_runtime_blocked")
        self.assertEqual(result["target_counts"], {"total": 6, "passed": 3, "missed": 3})
        self.assertEqual(
            result["benchmark_command"],
            [
                "python3",
                "scripts/benchmark_stage09_realtime.py",
                "--output",
                "docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-report.json",
                "--summary-output",
                "docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-summary.md",
            ],
        )
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

    def test_public_review_packet_matches_current_result(self) -> None:
        result = summarize_stage09_baseline_review_packet(
            acceptance_matrix_path=ACCEPTANCE_MATRIX_PATH,
            closeout_gate_path=CLOSEOUT_GATE_PATH,
            command_evidence_path=COMMAND_EVIDENCE_PATH,
        )
        artifact = json.loads(REVIEW_PACKET_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, result)
        self.assertFalse(
            any("docs/automation" in path for path in artifact["source_artifacts"].values())
        )

    def test_cli_writes_review_packet(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "stage09-baseline-review-packet.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/summarize_stage09_baseline_review_packet.py",
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
        self.assertEqual(output_payload["status"], "baseline_verified_runtime_blocked")

    def test_rejects_docs_automation_source_artifact(self) -> None:
        acceptance_matrix = json.loads(ACCEPTANCE_MATRIX_PATH.read_text(encoding="utf-8"))
        acceptance_matrix["source_artifacts"]["baseline_report"] = (
            "docs/automation/private-baseline-report.json"
        )

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_acceptance_matrix = Path(tmpdir) / "bad-acceptance-matrix.json"
            bad_acceptance_matrix.write_text(
                json.dumps(acceptance_matrix),
                encoding="utf-8",
            )

            with self.assertRaises(Stage09BaselineReviewPacketError) as ctx:
                summarize_stage09_baseline_review_packet(
                    acceptance_matrix_path=bad_acceptance_matrix,
                    closeout_gate_path=CLOSEOUT_GATE_PATH,
                    command_evidence_path=COMMAND_EVIDENCE_PATH,
                )

        self.assertIn("docs/automation", str(ctx.exception))


if __name__ == "__main__":
    unittest.main()
