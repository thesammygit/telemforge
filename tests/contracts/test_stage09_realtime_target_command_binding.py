import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.summarize_stage09_realtime_target_command_binding import (
    COMMAND_EVIDENCE_PATH,
    summarize_stage09_realtime_target_command_binding,
)


ROOT = Path(__file__).resolve().parents[2]
TARGET_BINDING_ARTIFACT_PATH = (
    ROOT
    / "docs"
    / "development"
    / "artifacts"
    / "stage09-realtime-target-contract"
    / "stage09-realtime-target-command-binding.json"
)


class Stage09RealtimeTargetCommandBindingTest(unittest.TestCase):
    def test_binding_accepts_current_public_artifacts(self) -> None:
        result = summarize_stage09_realtime_target_command_binding()

        self.assertEqual(
            result["schema"],
            "telemforge.stage09_realtime_target_command_binding.v1",
        )
        self.assertEqual(result["status"], "passed")
        self.assertEqual(result["headline_metric_count"], 4)
        self.assertEqual(
            result["target_contract_path"],
            "docs/development/artifacts/stage09-realtime-target-contract/stage09-realtime-target-contract.json",
        )
        self.assertEqual(
            result["command_evidence_path"],
            "docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-command-evidence.json",
        )
        self.assertEqual(
            result["benchmark_scaffold"]["command"],
            [
                "python3",
                "scripts/benchmark_stage09_realtime.py",
                "--output",
                "docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-report.json",
                "--summary-output",
                "docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-summary.md",
            ],
        )
        self.assertTrue(
            result["benchmark_scaffold"]["target_contract_command_evidence_bound"]
        )
        self.assertEqual(
            result["runtime_claims"]["runtime_stream_claim_status"],
            "contract_only_blocked",
        )
        self.assertFalse(result["public_repo_safety"]["includes_docs_automation"])
        self.assertIn("not a whole-project rewrite", result["rust_scope"])

    def test_public_binding_artifact_matches_current_result(self) -> None:
        result = summarize_stage09_realtime_target_command_binding()
        artifact = json.loads(TARGET_BINDING_ARTIFACT_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, result)

    def test_cli_writes_same_binding_payload(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "target-command-binding.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/summarize_stage09_realtime_target_command_binding.py",
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

    def test_rejects_command_evidence_with_changed_resource_envelope(self) -> None:
        command_evidence = json.loads(COMMAND_EVIDENCE_PATH.read_text(encoding="utf-8"))
        command_evidence["resource_envelope"]["uses_network"] = True

        with tempfile.TemporaryDirectory() as tmpdir:
            stale_command_evidence_path = Path(tmpdir) / "command-evidence.json"
            stale_command_evidence_path.write_text(
                json.dumps(command_evidence, indent=2, sort_keys=True) + "\n",
                encoding="utf-8",
            )

            with self.assertRaisesRegex(Exception, "resource_envelope"):
                summarize_stage09_realtime_target_command_binding(
                    command_evidence_path=stale_command_evidence_path,
                )


if __name__ == "__main__":
    unittest.main()
