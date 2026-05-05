import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.validate_stage09_live_telemetry_contract import (
    validate_stage09_live_telemetry_contract,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
CONTRACT_PATH = ARTIFACT_ROOT / "stage09-live-telemetry-contract.json"
REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
VALIDATION_SUMMARY_PATH = ARTIFACT_ROOT / "stage09-live-contract-validation-summary.json"


class Stage09LiveContractValidatorTest(unittest.TestCase):
    def test_validator_accepts_current_live_contract(self) -> None:
        result = validate_stage09_live_telemetry_contract(CONTRACT_PATH, REPORT_PATH)

        self.assertEqual(
            result["schema"],
            "telemforge.stage09_live_contract_validation.v1",
        )
        self.assertEqual(result["status"], "passed")
        self.assertEqual(
            result["implementation_status"],
            "contract_only_no_runtime_fanout",
        )
        self.assertEqual(
            result["runtime_fanout_claim"],
            "not_claimed_until_runtime_test",
        )
        self.assertIn("not a whole-project rewrite", result["rust_scope"])
        self.assertIn("backpressure_report_vector", result["validated_gates"])
        self.assertIn("runtime_evidence_gate", result["validated_gates"])

    def test_public_validation_summary_matches_current_contract_result(self) -> None:
        result = validate_stage09_live_telemetry_contract(CONTRACT_PATH, REPORT_PATH)
        artifact = json.loads(VALIDATION_SUMMARY_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, result)
        self.assertIn(
            "public_repo_relative_proof_artifacts",
            artifact["validated_gates"],
        )
        self.assertIn(
            "dropped_event_count reported from stream.backpressure payloads",
            artifact["required_runtime_evidence"],
        )

    def test_cli_writes_validation_summary_artifact(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "live-contract-validation-summary.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/validate_stage09_live_telemetry_contract.py",
                    "--contract",
                    str(CONTRACT_PATH),
                    "--report",
                    str(REPORT_PATH),
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
        self.assertIn("ordered_stream_vectors", output_payload["validated_gates"])

    def test_validator_rejects_runtime_fanout_claim(self) -> None:
        contract = json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
        contract["implementation_status"] = "runtime_fanout_implemented"

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_contract = Path(tmpdir) / "bad-live-contract.json"
            bad_contract.write_text(json.dumps(contract), encoding="utf-8")
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/validate_stage09_live_telemetry_contract.py",
                    "--contract",
                    str(bad_contract),
                    "--report",
                    str(REPORT_PATH),
                ],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(completed.returncode, 0)
        self.assertIn("contract.implementation_status mismatch", completed.stderr)

    def test_validator_rejects_missing_backpressure_vector_binding(self) -> None:
        contract = json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
        del contract["contract_validation_vectors"]["backpressure_report"][
            "comparison_metric"
        ]

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_contract = Path(tmpdir) / "bad-live-contract.json"
            bad_contract.write_text(json.dumps(contract), encoding="utf-8")
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/validate_stage09_live_telemetry_contract.py",
                    "--contract",
                    str(bad_contract),
                    "--report",
                    str(REPORT_PATH),
                ],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(completed.returncode, 0)
        self.assertIn("backpressure.comparison_metric mismatch", completed.stderr)


if __name__ == "__main__":
    unittest.main()
