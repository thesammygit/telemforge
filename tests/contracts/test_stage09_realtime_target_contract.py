import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.summarize_stage09_realtime_target_contract import (
    summarize_stage09_realtime_target_contract,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-target-contract"
)
BASELINE_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
REPORT_PATH = BASELINE_ROOT / "stage09-baseline-report.json"
ARTIFACT_PATH = ARTIFACT_ROOT / "stage09-realtime-target-contract.json"


class Stage09RealtimeTargetContractTest(unittest.TestCase):
    def test_target_contract_accepts_current_public_baseline(self) -> None:
        result = summarize_stage09_realtime_target_contract(report_path=REPORT_PATH)

        self.assertEqual(
            result["schema"],
            "telemforge.stage09_realtime_target_contract.v1",
        )
        self.assertEqual(result["status"], "passed")
        self.assertEqual(result["headline_metric_count"], 4)
        self.assertEqual(
            [item["metric"] for item in result["headline_metric_targets"]],
            [
                "telemetry_sample_rate_hz",
                "p95_alert_latency_ms",
                "p95_replay_query_latency_ms",
                "dropped_event_count",
            ],
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
        self.assertFalse(
            result["benchmark_scaffold"]["resource_envelope"]["uses_network"]
        )
        self.assertEqual(
            result["runtime_claims"]["runtime_stream_claim_status"],
            "contract_only_blocked",
        )
        self.assertFalse(result["public_repo_safety"]["includes_docs_automation"])
        self.assertIn("not a whole-project rewrite", result["rust_scope"])

    def test_public_target_contract_artifact_matches_current_result(self) -> None:
        result = summarize_stage09_realtime_target_contract(report_path=REPORT_PATH)
        artifact = json.loads(ARTIFACT_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, result)
        self.assertEqual(artifact["headline_metric_count"], 4)
        self.assertFalse(artifact["public_repo_safety"]["includes_docs_automation"])

    def test_cli_writes_target_contract(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "target-contract.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/summarize_stage09_realtime_target_contract.py",
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
                    "scripts/summarize_stage09_realtime_target_contract.py",
                    "--report",
                    str(bad_report),
                ],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(completed.returncode, 0)
        self.assertIn("runtime stream evidence gate", completed.stderr)


if __name__ == "__main__":
    unittest.main()
