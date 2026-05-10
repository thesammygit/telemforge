import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.validate_stage09_realtime_target_contract import (
    DEFAULT_CONTRACT_PATH,
    validate_stage09_realtime_target_contract,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-target-contract"
)
VALIDATION_ARTIFACT_PATH = (
    ARTIFACT_ROOT / "stage09-realtime-target-contract-validation.json"
)


class Stage09RealtimeTargetContractValidationTest(unittest.TestCase):
    def test_validation_accepts_current_public_target_contract(self) -> None:
        result = validate_stage09_realtime_target_contract()

        self.assertEqual(
            result["schema"],
            "telemforge.stage09_realtime_target_contract_validation.v1",
        )
        self.assertEqual(result["status"], "passed")
        self.assertTrue(result["contract_matches_regenerated_result"])
        self.assertEqual(result["headline_metric_count"], 4)
        self.assertEqual(
            result["validated_metrics"],
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

    def test_public_validation_artifact_matches_current_result(self) -> None:
        result = validate_stage09_realtime_target_contract()
        artifact = json.loads(VALIDATION_ARTIFACT_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, result)
        self.assertEqual(
            artifact["contract_path"],
            "docs/development/artifacts/stage09-realtime-target-contract/stage09-realtime-target-contract.json",
        )

    def test_cli_emits_same_validation_payload(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "target-contract-validation.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/validate_stage09_realtime_target_contract.py",
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

    def test_rejects_stale_target_contract_artifact(self) -> None:
        contract = json.loads(DEFAULT_CONTRACT_PATH.read_text(encoding="utf-8"))
        contract["runtime_claims"]["runtime_stream_claim_status"] = "claimed"

        with tempfile.TemporaryDirectory() as tmpdir:
            stale_contract_path = Path(tmpdir) / "stale-target-contract.json"
            stale_contract_path.write_text(
                json.dumps(contract, indent=2, sort_keys=True) + "\n",
                encoding="utf-8",
            )

            with self.assertRaisesRegex(Exception, "does not match regenerated"):
                validate_stage09_realtime_target_contract(
                    contract_path=stale_contract_path,
                )

    def test_rejects_docs_automation_required_output_path(self) -> None:
        contract = json.loads(DEFAULT_CONTRACT_PATH.read_text(encoding="utf-8"))
        contract["benchmark_scaffold"]["required_outputs"] = [
            "docs/automation/runs/private-target-contract.json"
        ]

        with tempfile.TemporaryDirectory() as tmpdir:
            unsafe_contract_path = Path(tmpdir) / "unsafe-target-contract.json"
            unsafe_contract_path.write_text(
                json.dumps(contract, indent=2, sort_keys=True) + "\n",
                encoding="utf-8",
            )

            with self.assertRaisesRegex(Exception, "docs/automation"):
                validate_stage09_realtime_target_contract(
                    contract_path=unsafe_contract_path,
                )


if __name__ == "__main__":
    unittest.main()
