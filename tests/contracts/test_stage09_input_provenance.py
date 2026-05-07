import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.validate_stage09_input_provenance import (
    InputProvenanceValidationError,
    validate_stage09_input_provenance,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
MANIFEST_PATH = ARTIFACT_ROOT / "stage09-baseline-verification-manifest.json"
VALIDATION_SUMMARY_PATH = ARTIFACT_ROOT / "stage09-input-provenance-validation.json"


class Stage09InputProvenanceValidationTest(unittest.TestCase):
    def test_validation_accepts_current_public_artifacts(self) -> None:
        result = validate_stage09_input_provenance(
            report_path=REPORT_PATH,
            manifest_path=MANIFEST_PATH,
        )

        self.assertEqual(
            result["schema"],
            "telemforge.stage09_input_provenance_validation.v1",
        )
        self.assertEqual(result["status"], "passed")
        self.assertEqual(
            result["telemetry_catalog_path"],
            "fixtures/telemetry/channels.json",
        )
        self.assertEqual(result["channel_count"], result["workload_channel_count"])
        self.assertIn(
            "input_provenance.telemetry_catalog_sha256",
            result["stable_identity_fields"],
        )
        self.assertFalse(result["public_repo_safety"]["includes_docs_automation"])
        self.assertIn("not a whole-project rewrite", result["rust_scope"])

    def test_public_validation_summary_artifact_matches_current_result(self) -> None:
        result = validate_stage09_input_provenance(
            report_path=REPORT_PATH,
            manifest_path=MANIFEST_PATH,
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
            output_path = Path(tmpdir) / "input-provenance-validation.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/validate_stage09_input_provenance.py",
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

    def test_rejects_docs_automation_catalog_path(self) -> None:
        report = json.loads(REPORT_PATH.read_text(encoding="utf-8"))
        report["input_provenance"]["telemetry_catalog_path"] = (
            "docs/automation/private-catalog.json"
        )

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_report = Path(tmpdir) / "bad-report.json"
            bad_report.write_text(
                json.dumps(report, indent=2, sort_keys=True),
                encoding="utf-8",
            )

            with self.assertRaises(InputProvenanceValidationError) as ctx:
                validate_stage09_input_provenance(
                    report_path=bad_report,
                    manifest_path=MANIFEST_PATH,
                )

        self.assertIn("must not reference docs/automation", str(ctx.exception))


if __name__ == "__main__":
    unittest.main()
