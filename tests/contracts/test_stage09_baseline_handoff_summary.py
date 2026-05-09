import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.summarize_stage09_baseline_handoff import (
    BaselineHandoffSummaryError,
    summarize_stage09_baseline_handoff,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
HANDOFF_GATE_PATH = ARTIFACT_ROOT / "stage09-baseline-handoff-gate.json"
HANDOFF_SUMMARY_PATH = ARTIFACT_ROOT / "stage09-baseline-handoff-summary.md"


class Stage09BaselineHandoffSummaryTest(unittest.TestCase):
    def test_summary_keeps_runtime_and_rust_claims_blocked(self) -> None:
        summary = summarize_stage09_baseline_handoff(HANDOFF_GATE_PATH)

        self.assertIn("Status: `baseline_handoff_ready_runtime_blocked`", summary)
        self.assertIn("Stream runtime claim: `contract_only_blocked`", summary)
        self.assertIn("Candidate can be promoted: `false`", summary)
        self.assertIn("Rust remains tracked for future data-plane candidates only", summary)
        self.assertNotIn("docs/automation", summary)

    def test_public_summary_artifact_matches_current_result(self) -> None:
        summary = summarize_stage09_baseline_handoff(HANDOFF_GATE_PATH)
        artifact = HANDOFF_SUMMARY_PATH.read_text(encoding="utf-8")

        self.assertEqual(artifact, summary)

    def test_cli_writes_handoff_summary(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "stage09-baseline-handoff-summary.md"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/summarize_stage09_baseline_handoff.py",
                    "--output",
                    str(output_path),
                ],
                cwd=ROOT,
                check=True,
                capture_output=True,
                text=True,
            )

            stdout_payload = completed.stdout
            output_payload = output_path.read_text(encoding="utf-8")

        self.assertEqual(output_payload, stdout_payload)
        self.assertIn("Status: `baseline_handoff_ready_runtime_blocked`", output_payload)

    def test_rejects_drifted_handoff_gate_artifact(self) -> None:
        drifted_gate = HANDOFF_GATE_PATH.read_text(encoding="utf-8").replace(
            '"status": "baseline_handoff_ready_runtime_blocked"',
            '"status": "promoted"',
            1,
        )

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_gate_path = Path(tmpdir) / "bad-handoff-gate.json"
            bad_gate_path.write_text(drifted_gate, encoding="utf-8")

            with self.assertRaises(BaselineHandoffSummaryError) as ctx:
                summarize_stage09_baseline_handoff(bad_gate_path)

        self.assertIn("handoff gate artifact drifted", str(ctx.exception))


if __name__ == "__main__":
    unittest.main()
