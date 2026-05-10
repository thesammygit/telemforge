import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.check_stage09_runtime_stream_proof_artifacts import (
    check_stage09_runtime_stream_proof_artifacts,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
CHECKLIST_PATH = ARTIFACT_ROOT / "stage09-runtime-stream-evidence-checklist.json"
CONTRACT_PATH = ARTIFACT_ROOT / "stage09-live-telemetry-contract.json"
REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
ARTIFACT_PATH = ARTIFACT_ROOT / "stage09-runtime-stream-proof-artifact-gate.json"


class Stage09RuntimeStreamProofArtifactGateTest(unittest.TestCase):
    def test_gate_accepts_current_public_proof_artifacts(self) -> None:
        result = check_stage09_runtime_stream_proof_artifacts(
            checklist_path=CHECKLIST_PATH,
            contract_path=CONTRACT_PATH,
            report_path=REPORT_PATH,
        )

        self.assertEqual(
            result["schema"],
            "telemforge.stage09_runtime_stream_proof_artifact_gate.v1",
        )
        self.assertEqual(
            result["status"],
            "runtime_stream_proof_artifacts_ready_runtime_blocked",
        )
        self.assertEqual(result["required_evidence_count"], 6)
        self.assertEqual(result["required_artifact_count"], 6)
        self.assertEqual(result["unique_required_artifact_count"], 3)
        self.assertEqual(
            result["claim_status_counts"],
            {"not_claimed_until_runtime_test": 6},
        )
        self.assertEqual(
            result["runtime_stream_claim_status"],
            "contract_only_blocked",
        )
        self.assertIn(
            "tests/contracts/test_stage09_live_telemetry_contract.py",
            result["unique_required_artifacts"],
        )
        self.assertEqual(
            result["extra_contract_proof_artifacts"],
            ["scripts/validate_stage09_live_telemetry_contract.py"],
        )
        self.assertFalse(result["public_repo_safety"]["includes_docs_automation"])
        self.assertIn("not a whole-project rewrite", result["rust_scope"])

    def test_cli_emits_same_gate_payload(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "runtime-stream-proof-artifacts.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/check_stage09_runtime_stream_proof_artifacts.py",
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
        self.assertEqual(
            output_payload["status"],
            "runtime_stream_proof_artifacts_ready_runtime_blocked",
        )

    def test_public_gate_artifact_matches_current_result(self) -> None:
        result = check_stage09_runtime_stream_proof_artifacts(
            checklist_path=CHECKLIST_PATH,
            contract_path=CONTRACT_PATH,
            report_path=REPORT_PATH,
        )
        artifact = json.loads(ARTIFACT_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, result)
        self.assertFalse(artifact["public_repo_safety"]["includes_docs_automation"])
        self.assertEqual(
            artifact["runtime_stream_claim_status"],
            "contract_only_blocked",
        )

    def test_rejects_docs_automation_required_artifact(self) -> None:
        checklist = json.loads(CHECKLIST_PATH.read_text(encoding="utf-8"))
        unsafe_path = "docs/automation/demos/private-runtime-proof.svg"
        checklist["probe_checklist"][0]["required_artifact"] = unsafe_path

        with tempfile.TemporaryDirectory() as tmpdir:
            tmpdir_path = Path(tmpdir)
            bad_checklist = tmpdir_path / "bad-checklist.json"
            bad_checklist.write_text(json.dumps(checklist), encoding="utf-8")

            with self.assertRaisesRegex(Exception, "public and repo-relative"):
                check_stage09_runtime_stream_proof_artifacts(
                    checklist_path=bad_checklist,
                    contract_path=CONTRACT_PATH,
                    report_path=REPORT_PATH,
                )


if __name__ == "__main__":
    unittest.main()
