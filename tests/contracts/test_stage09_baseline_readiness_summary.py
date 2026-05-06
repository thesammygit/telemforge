import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.summarize_stage09_baseline_readiness import (
    summarize_stage09_baseline_readiness,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
READINESS_SUMMARY_PATH = ARTIFACT_ROOT / "stage09-baseline-readiness-summary.json"


class Stage09BaselineReadinessSummaryTest(unittest.TestCase):
    def test_summary_matches_current_public_artifact(self) -> None:
        result = summarize_stage09_baseline_readiness()
        artifact = json.loads(READINESS_SUMMARY_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, result)
        self.assertEqual(
            result["schema"],
            "telemforge.stage09_baseline_readiness_summary.v1",
        )
        self.assertEqual(result["status"], "baseline_ready_for_comparison")
        self.assertEqual(
            result["runtime_stream_claim_status"],
            "contract_only_blocked",
        )
        self.assertFalse(
            result["target_summary"]["baseline_is_production_realtime_claim"]
        )
        self.assertIn("rust_stream_fanout_sample_rate_spike", result.values())
        self.assertIn("not a whole-project rewrite", result["rust_scope"])
        self.assertFalse(result["public_repo_safety"]["includes_docs_automation"])

    def test_cli_writes_readiness_summary(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "stage09-readiness-summary.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/summarize_stage09_baseline_readiness.py",
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
        self.assertEqual(output_payload["status"], "baseline_ready_for_comparison")
        self.assertIn(
            "runtime_stream_claim_blocked",
            output_payload["verified_gates"],
        )


if __name__ == "__main__":
    unittest.main()
