import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.summarize_stage09_target_gaps import summarize_stage09_target_gaps


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
MANIFEST_PATH = ARTIFACT_ROOT / "stage09-baseline-verification-manifest.json"
TARGET_GAP_SUMMARY_PATH = ARTIFACT_ROOT / "stage09-target-gap-summary.json"


class Stage09TargetGapSummaryTest(unittest.TestCase):
    def test_target_gap_summary_accepts_current_public_artifacts(self) -> None:
        summary = summarize_stage09_target_gaps(
            report_path=REPORT_PATH,
            manifest_path=MANIFEST_PATH,
        )

        self.assertEqual(
            summary["schema"],
            "telemforge.stage09_target_gap_summary.v1",
        )
        self.assertEqual(summary["status"], "target_gap_summary_ready")
        self.assertEqual(summary["target_counts"]["total"], 6)
        self.assertEqual(summary["target_counts"]["passed"], 3)
        self.assertEqual(summary["target_counts"]["missed"], 3)
        self.assertEqual(
            summary["missed_targets"],
            [
                "aggregate_sample_rate_hz",
                "channel_count",
                "per_channel_sample_rate_hz",
            ],
        )
        self.assertEqual(
            summary["runtime_stream_claim_status"],
            "contract_only_blocked",
        )
        self.assertEqual(
            summary["next_comparable_candidate"],
            "rust_stream_fanout_sample_rate_spike",
        )
        self.assertIn("not a whole-project rewrite", summary["rust_scope"])
        self.assertFalse(summary["public_repo_safety"]["includes_docs_automation"])

    def test_public_target_gap_summary_artifact_matches_current_result(self) -> None:
        summary = summarize_stage09_target_gaps(
            report_path=REPORT_PATH,
            manifest_path=MANIFEST_PATH,
        )
        artifact = json.loads(TARGET_GAP_SUMMARY_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, summary)
        self.assertFalse(
            any(
                "docs/automation" in value
                for value in artifact.values()
                if isinstance(value, str)
            )
        )

    def test_cli_writes_target_gap_summary(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "target-gap-summary.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/summarize_stage09_target_gaps.py",
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
        self.assertEqual(output_payload["status"], "target_gap_summary_ready")

    def test_rejects_runtime_stream_claims(self) -> None:
        report = json.loads(REPORT_PATH.read_text(encoding="utf-8"))
        report["stream_contract_profile"]["runtime_evidence_gate"][
            "status"
        ] = "runtime_claimed"

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_report = Path(tmpdir) / "bad-report.json"
            bad_report.write_text(json.dumps(report), encoding="utf-8")

            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/summarize_stage09_target_gaps.py",
                    "--report",
                    str(bad_report),
                ],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(completed.returncode, 0)
        self.assertIn("runtime stream evidence gate mismatch", completed.stderr)


if __name__ == "__main__":
    unittest.main()
