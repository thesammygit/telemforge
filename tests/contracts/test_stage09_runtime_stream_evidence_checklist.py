import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.validate_stage09_runtime_stream_evidence_checklist import (
    RuntimeStreamEvidenceChecklistValidationError,
    validate_stage09_runtime_stream_evidence_checklist,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
CHECKLIST_PATH = ARTIFACT_ROOT / "stage09-runtime-stream-evidence-checklist.json"
CONTRACT_PATH = ARTIFACT_ROOT / "stage09-live-telemetry-contract.json"
REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
VALIDATION_SUMMARY_PATH = (
    ARTIFACT_ROOT / "stage09-runtime-stream-evidence-validation-summary.json"
)


class Stage09RuntimeStreamEvidenceChecklistValidationTest(unittest.TestCase):
    def test_validation_accepts_current_public_artifacts(self) -> None:
        result = validate_stage09_runtime_stream_evidence_checklist(
            checklist_path=CHECKLIST_PATH,
            contract_path=CONTRACT_PATH,
            report_path=REPORT_PATH,
        )

        self.assertEqual(
            result["schema"],
            "telemforge.stage09_runtime_stream_evidence_validation.v1",
        )
        self.assertEqual(result["status"], "passed")
        self.assertEqual(
            result["runtime_stream_claim_status"],
            "runtime_verified_bounded_fanout",
        )
        self.assertEqual(result["required_evidence_count"], 7)
        self.assertEqual(
            result["claim_status_counts"],
            {"runtime_verified": 7},
        )
        self.assertEqual(
            result["validated_evidence"][0]["evidence"],
            "websocket connection acceptance for an existing session",
        )
        self.assertEqual(result["validated_evidence"][-1]["claim_status"], "runtime_verified")
        self.assertFalse(result["public_repo_safety"]["includes_docs_automation"])
        self.assertIn("not a whole-project rewrite", result["rust_scope"])

    def test_public_validation_summary_artifact_matches_current_result(self) -> None:
        result = validate_stage09_runtime_stream_evidence_checklist(
            checklist_path=CHECKLIST_PATH,
            contract_path=CONTRACT_PATH,
            report_path=REPORT_PATH,
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
            output_path = Path(tmpdir) / "runtime-stream-evidence-validation.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/validate_stage09_runtime_stream_evidence_checklist.py",
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

    def test_rejects_non_public_required_artifact_paths(self) -> None:
        checklist = json.loads(CHECKLIST_PATH.read_text(encoding="utf-8"))
        checklist["probe_checklist"][0]["required_artifact"] = (
            "docs/automation/private-proof.txt"
        )

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_checklist = Path(tmpdir) / "bad-checklist.json"
            bad_checklist.write_text(
                json.dumps(checklist, indent=2, sort_keys=True),
                encoding="utf-8",
            )

            with self.assertRaises(RuntimeStreamEvidenceChecklistValidationError) as ctx:
                validate_stage09_runtime_stream_evidence_checklist(
                    checklist_path=bad_checklist,
                    contract_path=CONTRACT_PATH,
                    report_path=REPORT_PATH,
                )

        self.assertIn("must be public and repo-relative", str(ctx.exception))

    def test_rejects_missing_required_artifact_paths(self) -> None:
        checklist = json.loads(CHECKLIST_PATH.read_text(encoding="utf-8"))
        contract = json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
        missing_artifact = (
            "docs/development/artifacts/stage09-realtime-baseline/"
            "missing-runtime-proof.json"
        )
        checklist["probe_checklist"][0]["required_artifact"] = missing_artifact
        contract["runtime_evidence_gate"]["proof_artifacts"].append(missing_artifact)

        with tempfile.TemporaryDirectory() as tmpdir:
            tmpdir_path = Path(tmpdir)
            bad_checklist = tmpdir_path / "bad-checklist.json"
            bad_contract = tmpdir_path / "bad-contract.json"
            bad_checklist.write_text(
                json.dumps(checklist, indent=2, sort_keys=True),
                encoding="utf-8",
            )
            bad_contract.write_text(
                json.dumps(contract, indent=2, sort_keys=True),
                encoding="utf-8",
            )

            with self.assertRaises(RuntimeStreamEvidenceChecklistValidationError) as ctx:
                validate_stage09_runtime_stream_evidence_checklist(
                    checklist_path=bad_checklist,
                    contract_path=bad_contract,
                    report_path=REPORT_PATH,
                )

        self.assertIn("required artifact must exist", str(ctx.exception))

    def test_rejects_required_artifact_that_does_not_match_contract_item(self) -> None:
        checklist = json.loads(CHECKLIST_PATH.read_text(encoding="utf-8"))
        checklist["probe_checklist"][0]["required_artifact"] = (
            "docs/development/artifacts/stage09-realtime-baseline/"
            "stage09-live-telemetry-contract.json"
        )

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_checklist = Path(tmpdir) / "bad-checklist.json"
            bad_checklist.write_text(
                json.dumps(checklist, indent=2, sort_keys=True),
                encoding="utf-8",
            )

            with self.assertRaises(RuntimeStreamEvidenceChecklistValidationError) as ctx:
                validate_stage09_runtime_stream_evidence_checklist(
                    checklist_path=bad_checklist,
                    contract_path=CONTRACT_PATH,
                    report_path=REPORT_PATH,
                )

        self.assertIn("must match contract proof artifact", str(ctx.exception))


if __name__ == "__main__":
    unittest.main()
