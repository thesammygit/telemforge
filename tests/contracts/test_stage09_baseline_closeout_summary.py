import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.summarize_stage09_baseline_closeout import (
    BaselineCloseoutSummaryError,
    summarize_stage09_baseline_closeout,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
CLOSEOUT_GATE_PATH = ARTIFACT_ROOT / "stage09-baseline-closeout-gate.json"
CLOSEOUT_SUMMARY_PATH = ARTIFACT_ROOT / "stage09-baseline-closeout-summary.md"


class Stage09BaselineCloseoutSummaryTest(unittest.TestCase):
    def test_summary_records_sustained_load_review_readiness(self) -> None:
        summary = summarize_stage09_baseline_closeout(CLOSEOUT_GATE_PATH)

        self.assertIn("Status: `ready_for_stage09_review`", summary)
        self.assertIn("Stream runtime claim: `runtime_verified_bounded_fanout`", summary)
        self.assertIn("Candidate can be promoted: `true`", summary)
        self.assertIn("Rust remains scoped to a data-plane candidate", summary)
        self.assertNotIn("docs/automation", summary)

    def test_public_summary_artifact_matches_current_result(self) -> None:
        summary = summarize_stage09_baseline_closeout(CLOSEOUT_GATE_PATH)
        artifact = CLOSEOUT_SUMMARY_PATH.read_text(encoding="utf-8")

        self.assertEqual(artifact, summary)

    def test_cli_writes_closeout_summary(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "stage09-baseline-closeout-summary.md"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/summarize_stage09_baseline_closeout.py",
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
        self.assertIn("Status: `ready_for_stage09_review`", output_payload)

    def test_rejects_drifted_closeout_gate_artifact(self) -> None:
        drifted_gate = CLOSEOUT_GATE_PATH.read_text(encoding="utf-8").replace(
            '"status": "ready_for_stage09_review"',
            '"status": "promoted"',
            1,
        )

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_gate_path = Path(tmpdir) / "bad-closeout-gate.json"
            bad_gate_path.write_text(drifted_gate, encoding="utf-8")

            with self.assertRaises(BaselineCloseoutSummaryError) as ctx:
                summarize_stage09_baseline_closeout(bad_gate_path)

        self.assertIn("closeout gate artifact drifted", str(ctx.exception))


if __name__ == "__main__":
    unittest.main()
