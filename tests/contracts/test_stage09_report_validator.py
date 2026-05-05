import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.validate_stage09_realtime_report import validate_stage09_report


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
CONTRACT_PATH = ARTIFACT_ROOT / "stage09-candidate-report-contract.json"
VALIDATION_SUMMARY_PATH = ARTIFACT_ROOT / "stage09-report-validation-summary.json"


class Stage09ReportValidatorTest(unittest.TestCase):
    def test_validator_accepts_current_public_baseline_report(self) -> None:
        result = validate_stage09_report(REPORT_PATH, CONTRACT_PATH)

        self.assertEqual(
            result["schema"],
            "telemforge.stage09_report_compatibility_validation.v1",
        )
        self.assertEqual(result["status"], "passed")
        self.assertIn("resource_envelope", result["validated_gates"])
        self.assertIn("stream_claim_gate", result["validated_gates"])
        self.assertIn("not a whole-project rewrite", result["rust_scope"])

    def test_public_validation_summary_matches_current_contract_result(self) -> None:
        result = validate_stage09_report(REPORT_PATH, CONTRACT_PATH)
        artifact = json.loads(VALIDATION_SUMMARY_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, result)
        self.assertIn("promotion_gate", artifact["validated_gates"])

    def test_cli_prints_passed_validation_summary(self) -> None:
        completed = subprocess.run(
            [
                sys.executable,
                "scripts/validate_stage09_realtime_report.py",
                "--report",
                str(REPORT_PATH),
                "--contract",
                str(CONTRACT_PATH),
            ],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
        )

        payload = json.loads(completed.stdout)
        self.assertEqual(payload["status"], "passed")
        self.assertEqual(
            payload["baseline_report_schema"],
            "telemforge.stage09_realtime_baseline.v1",
        )

    def test_cli_writes_passed_validation_summary_artifact(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "validation-summary.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/validate_stage09_realtime_report.py",
                    "--report",
                    str(REPORT_PATH),
                    "--contract",
                    str(CONTRACT_PATH),
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
        self.assertIn("promotion_gate", output_payload["validated_gates"])

    def test_validator_rejects_report_missing_metric_binding(self) -> None:
        report = json.loads(REPORT_PATH.read_text(encoding="utf-8"))
        del report["metrics"]["dropped_event_count"]

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_report = Path(tmpdir) / "bad-report.json"
            bad_report.write_text(json.dumps(report), encoding="utf-8")

            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/validate_stage09_realtime_report.py",
                    "--report",
                    str(bad_report),
                    "--contract",
                    str(CONTRACT_PATH),
                ],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(completed.returncode, 0)
        self.assertIn("missing metric binding dropped_event_count", completed.stderr)

    def test_validator_rejects_report_missing_benchmark_verification_contracts(self) -> None:
        report = json.loads(REPORT_PATH.read_text(encoding="utf-8"))
        del report["benchmark_contract"]
        del report["verification_contract"]

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_report = Path(tmpdir) / "bad-report.json"
            bad_report.write_text(json.dumps(report), encoding="utf-8")

            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/validate_stage09_realtime_report.py",
                    "--report",
                    str(bad_report),
                    "--contract",
                    str(CONTRACT_PATH),
                ],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(completed.returncode, 0)
        self.assertIn(
            "missing top-level report field: benchmark_contract",
            completed.stderr,
        )
        self.assertIn(
            "missing top-level report field: verification_contract",
            completed.stderr,
        )


if __name__ == "__main__":
    unittest.main()
