import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.summarize_stage09_baseline_digest_index import (
    summarize_stage09_baseline_digest_index,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
DIGEST_INDEX_PATH = ARTIFACT_ROOT / "stage09-baseline-digest-index.json"
REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"


class Stage09BaselineDigestIndexTest(unittest.TestCase):
    def test_digest_index_accepts_current_public_artifacts(self) -> None:
        index = summarize_stage09_baseline_digest_index()

        self.assertEqual(
            index["schema"],
            "telemforge.stage09_baseline_digest_index.v1",
        )
        self.assertEqual(index["status"], "baseline_digest_index_ready")
        self.assertGreaterEqual(index["source_artifact_count"], 20)
        self.assertEqual(
            index["runtime_claims"]["stream_runtime_claim_status"],
            "contract_only_blocked",
        )
        self.assertFalse(index["runtime_claims"]["candidate_can_be_promoted"])
        self.assertEqual(
            index["next_comparable_candidate"],
            "rust_stream_fanout_sample_rate_spike",
        )
        self.assertIn("not a whole-project rewrite", index["rust_scope"])
        self.assertFalse(index["public_repo_safety"]["includes_docs_automation"])
        self.assertIn("aggregate_digest_computed", index["verified_gates"])

    def test_public_digest_index_artifact_matches_current_result(self) -> None:
        index = summarize_stage09_baseline_digest_index()
        artifact = json.loads(DIGEST_INDEX_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, index)
        self.assertFalse(
            any(
                "docs/automation" in source["path"]
                for source in artifact["source_artifacts"]
            )
        )

    def test_cli_writes_digest_index(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "digest-index.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/summarize_stage09_baseline_digest_index.py",
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
        self.assertEqual(output_payload["status"], "baseline_digest_index_ready")

    def test_rejects_docs_automation_source_path(self) -> None:
        completed = subprocess.run(
            [
                sys.executable,
                "-c",
                (
                    "from pathlib import Path; "
                    "from scripts.summarize_stage09_baseline_digest_index "
                    "import summarize_stage09_baseline_digest_index; "
                    "summarize_stage09_baseline_digest_index("
                    "source_paths=[Path('docs/automation/state/executor.json')])"
                ),
            ],
            cwd=ROOT,
            capture_output=True,
            text=True,
        )

        self.assertNotEqual(completed.returncode, 0)
        self.assertIn("docs/automation", completed.stderr)

    def test_report_digest_matches_committed_report_bytes(self) -> None:
        index = summarize_stage09_baseline_digest_index()
        report_entry = next(
            source
            for source in index["source_artifacts"]
            if source["path"].endswith("stage09-baseline-report.json")
        )

        self.assertEqual(report_entry["size_bytes"], REPORT_PATH.stat().st_size)
        self.assertRegex(report_entry["sha256"], r"^[0-9a-f]{64}$")


if __name__ == "__main__":
    unittest.main()
