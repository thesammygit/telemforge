import hashlib
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.run_stage09_live_stream_sustained_load_smoke import (
    run_stage09_live_stream_sustained_load_smoke,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
RUST_CANDIDATE_REPORT_PATH = (
    ARTIFACT_ROOT / "stage09-rust-stream-fanout-sample-rate-report.json"
)
SUSTAINED_LOAD_PATH = ARTIFACT_ROOT / "stage09-live-stream-sustained-load.json"


class Stage09LiveStreamSustainedLoadTest(unittest.TestCase):
    def test_smoke_writes_bounded_sustained_load_artifact(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "stage09-live-stream-sustained-load.json"
            result = run_stage09_live_stream_sustained_load_smoke(
                candidate_report_path=RUST_CANDIDATE_REPORT_PATH,
                output_path=output_path,
            )
            artifact = json.loads(output_path.read_text(encoding="utf-8"))

        self.assertEqual(artifact, result)
        self.assertEqual(
            result["schema"],
            "telemforge.stage09_live_stream_sustained_load.v1",
        )
        self.assertEqual(result["status"], "passed")
        self.assertEqual(result["client_count"], 4)
        self.assertEqual(result["message_count_total"], 48)
        self.assertEqual(result["message_count_per_client"], 12)
        self.assertEqual(result["ordered_sequence_status"], "passed")
        self.assertEqual(result["queue_isolation_status"], "passed")
        self.assertEqual(result["dropped_event_reporting_status"], "passed")
        self.assertEqual(
            result["candidate_report_binding"]["path"],
            "docs/development/artifacts/stage09-realtime-baseline/stage09-rust-stream-fanout-sample-rate-report.json",
        )
        self.assertEqual(
            result["candidate_report_binding"]["sha256"],
            hashlib.sha256(RUST_CANDIDATE_REPORT_PATH.read_bytes()).hexdigest(),
        )
        self.assertTrue(result["candidate_report_binding"]["target_scale_metrics_pass"])
        self.assertFalse(result["public_repo_safety"]["includes_docs_automation"])
        self.assertFalse(result["public_repo_safety"]["uses_absolute_local_paths"])
        self.assertFalse(result["resource_guard"]["uses_network"])
        self.assertLessEqual(result["observed_runtime_seconds"], 30)
        self.assertEqual(
            {client["message_count"] for client in result["per_client_results"]},
            {12},
        )
        self.assertEqual(
            {
                tuple(client["observed_sequences"])
                for client in result["per_client_results"]
            },
            {tuple(range(1, 13))},
        )

    def test_cli_writes_sustained_load_artifact(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "stage09-live-stream-sustained-load.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/run_stage09_live_stream_sustained_load_smoke.py",
                    "--candidate-report",
                    str(RUST_CANDIDATE_REPORT_PATH),
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
        self.assertEqual(output_payload["client_count"], 4)

    def test_public_sustained_load_artifact_matches_current_result(self) -> None:
        artifact = json.loads(SUSTAINED_LOAD_PATH.read_text(encoding="utf-8"))

        self.assertEqual(
            artifact["schema"],
            "telemforge.stage09_live_stream_sustained_load.v1",
        )
        self.assertEqual(artifact["status"], "passed")
        self.assertEqual(artifact["client_count"], 4)
        self.assertEqual(artifact["message_count_total"], 48)
        self.assertEqual(
            artifact["candidate_report_binding"]["sha256"],
            hashlib.sha256(RUST_CANDIDATE_REPORT_PATH.read_bytes()).hexdigest(),
        )
        self.assertFalse(
            any(
                "docs/automation" in value
                for value in artifact.values()
                if isinstance(value, str)
            )
        )


if __name__ == "__main__":
    unittest.main()
