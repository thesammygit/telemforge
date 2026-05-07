import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.validate_stage09_baseline_command_evidence import (
    CommandEvidenceValidationError,
    validate_stage09_baseline_command_evidence,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
MANIFEST_PATH = ARTIFACT_ROOT / "stage09-baseline-verification-manifest.json"
COMMAND_EVIDENCE_PATH = ARTIFACT_ROOT / "stage09-baseline-command-evidence.json"
VALIDATION_SUMMARY_PATH = (
    ARTIFACT_ROOT / "stage09-baseline-command-evidence-validation.json"
)


class Stage09BaselineCommandEvidenceValidationTest(unittest.TestCase):
    def test_validation_accepts_current_public_artifacts(self) -> None:
        result = validate_stage09_baseline_command_evidence(
            report_path=REPORT_PATH,
            manifest_path=MANIFEST_PATH,
            command_evidence_path=COMMAND_EVIDENCE_PATH,
        )

        self.assertEqual(
            result["schema"],
            "telemforge.stage09_baseline_command_evidence_validation.v1",
        )
        self.assertEqual(result["status"], "passed")
        self.assertEqual(result["runtime_claim_status"], "not_claimed")
        self.assertIn(
            "command_matches_report_verification_contract",
            result["verified_gates"],
        )
        self.assertIn("required_outputs_exist", result["verified_gates"])
        self.assertFalse(result["public_repo_safety"]["includes_docs_automation"])
        self.assertIn("not a whole-project rewrite", result["rust_scope"])

    def test_public_validation_summary_artifact_matches_current_result(self) -> None:
        result = validate_stage09_baseline_command_evidence(
            report_path=REPORT_PATH,
            manifest_path=MANIFEST_PATH,
            command_evidence_path=COMMAND_EVIDENCE_PATH,
        )
        artifact = json.loads(VALIDATION_SUMMARY_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, result)
        self.assertFalse(
            any(
                "docs/automation" in value
                for value in artifact.values()
                if isinstance(value, str)
            )
        )

    def test_cli_writes_validation_summary(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "command-evidence-validation.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/validate_stage09_baseline_command_evidence.py",
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

    def test_rejects_docs_automation_output_paths(self) -> None:
        command_evidence = json.loads(COMMAND_EVIDENCE_PATH.read_text(encoding="utf-8"))
        command_evidence["required_outputs"] = ["docs/automation/private-report.json"]

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_command_evidence = Path(tmpdir) / "bad-command-evidence.json"
            bad_command_evidence.write_text(
                json.dumps(command_evidence, indent=2, sort_keys=True),
                encoding="utf-8",
            )

            with self.assertRaises(CommandEvidenceValidationError) as ctx:
                validate_stage09_baseline_command_evidence(
                    report_path=REPORT_PATH,
                    manifest_path=MANIFEST_PATH,
                    command_evidence_path=bad_command_evidence,
                )

        self.assertIn(
            "required outputs vs report verification contract",
            str(ctx.exception),
        )


if __name__ == "__main__":
    unittest.main()
