import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.summarize_stage09_baseline_artifact_index import (
    summarize_stage09_baseline_artifact_index,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
ARTIFACT_INDEX_PATH = ARTIFACT_ROOT / "stage09-baseline-artifact-index.json"


class Stage09BaselineArtifactIndexTest(unittest.TestCase):
    def test_artifact_index_accepts_current_public_bundle(self) -> None:
        summary = summarize_stage09_baseline_artifact_index()

        self.assertEqual(
            summary["schema"], "telemforge.stage09_baseline_artifact_index.v1"
        )
        self.assertEqual(summary["status"], "passed")
        self.assertGreaterEqual(summary["indexed_artifact_count"], 20)
        self.assertFalse(summary["public_repo_safety"]["includes_docs_automation"])
        self.assertEqual(
            summary["benchmark_scaffold"]["command"],
            "python3 scripts/benchmark_stage09_realtime.py "
            "--output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-report.json "
            "--summary-output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-summary.md",
        )
        self.assertEqual(
            summary["benchmark_scaffold"]["required_outputs"],
            [
                "docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-report.json",
                "docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-summary.md",
            ],
        )
        self.assertEqual(
            summary["benchmark_scaffold"]["command_evidence_path"],
            "docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-command-evidence.json",
        )
        self.assertEqual(
            summary["benchmark_scaffold"]["resource_envelope"],
            {
                "max_expected_memory_mb": 512,
                "max_expected_runtime_seconds": 30,
                "uses_network": False,
                "uses_paid_services": False,
                "worker_processes": 1,
            },
        )
        self.assertTrue(summary["benchmark_scaffold"]["outputs_indexed_in_readme"])
        self.assertTrue(summary["benchmark_scaffold"]["command_evidence_bound"])
        self.assertEqual(
            summary["benchmark_scaffold"]["rerun_status"],
            "not_run_by_artifact_index",
        )
        self.assertEqual(summary["runtime_claims"]["benchmark_rerun"], "not_run")
        self.assertEqual(
            summary["runtime_claims"]["runtime_stream_claim_status"],
            "contract_only_blocked",
        )
        self.assertIn("not a whole-project rewrite", summary["rust_scope"])

    def test_public_artifact_index_matches_current_result(self) -> None:
        summary = summarize_stage09_baseline_artifact_index()
        artifact = json.loads(ARTIFACT_INDEX_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, summary)
        self.assertTrue(
            all(item["indexed_in_readme"] for item in artifact["indexed_artifacts"])
        )

    def test_cli_writes_artifact_index(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "artifact-index.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/summarize_stage09_baseline_artifact_index.py",
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

    def test_rejects_unindexed_artifact(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            artifact_root = Path(tmpdir) / "artifacts"
            artifact_root.mkdir()
            for source in ARTIFACT_ROOT.iterdir():
                if (
                    source.is_file()
                    and source.name != "stage09-baseline-artifact-index.json"
                ):
                    (artifact_root / source.name).write_bytes(source.read_bytes())
            (artifact_root / "unindexed-public-proof.json").write_text(
                "{}", encoding="utf-8"
            )

            with self.assertRaisesRegex(Exception, "unindexed-public-proof.json"):
                summarize_stage09_baseline_artifact_index(
                    artifact_root=artifact_root,
                    readme_path=artifact_root / "README.md",
                )


if __name__ == "__main__":
    unittest.main()
