import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.summarize_stage09_baseline_command_matrix import (
    summarize_stage09_baseline_command_matrix,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
ARTIFACT_PATH = ARTIFACT_ROOT / "stage09-baseline-command-matrix.json"


class Stage09BaselineCommandMatrixTest(unittest.TestCase):
    def test_command_matrix_accepts_current_public_baseline(self) -> None:
        result = summarize_stage09_baseline_command_matrix()

        self.assertEqual(
            result["schema"], "telemforge.stage09_baseline_command_matrix.v1"
        )
        self.assertEqual(result["status"], "passed")
        self.assertEqual(result["command_count"], 6)
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
        self.assertEqual(
            result["benchmark_scaffold"]["resource_envelope"]["worker_processes"],
            1,
        )
        self.assertFalse(
            result["benchmark_scaffold"]["resource_envelope"]["uses_network"]
        )
        self.assertEqual(
            [item["metric"] for item in result["headline_metric_bindings"]],
            [
                "telemetry_sample_rate_hz",
                "p95_alert_latency_ms",
                "p95_replay_query_latency_ms",
                "dropped_event_count",
            ],
        )
        self.assertEqual(
            result["runtime_claims"]["runtime_stream_claim_status"],
            "contract_only_blocked",
        )
        self.assertFalse(result["public_repo_safety"]["includes_docs_automation"])
        self.assertIn("not a whole-project rewrite", result["rust_scope"])

    def test_cli_writes_command_matrix(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "command-matrix.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/summarize_stage09_baseline_command_matrix.py",
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

    def test_public_command_matrix_matches_current_result(self) -> None:
        result = summarize_stage09_baseline_command_matrix()
        artifact = json.loads(ARTIFACT_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, result)
        self.assertEqual(artifact["command_count"], 6)
        self.assertFalse(artifact["public_repo_safety"]["includes_docs_automation"])


if __name__ == "__main__":
    unittest.main()
