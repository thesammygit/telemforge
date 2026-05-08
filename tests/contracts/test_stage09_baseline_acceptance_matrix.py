import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.summarize_stage09_baseline_acceptance_matrix import (
    Stage09AcceptanceMatrixError,
    summarize_stage09_baseline_acceptance_matrix,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
SUMMARY_PATH = ARTIFACT_ROOT / "stage09-baseline-summary.md"
COMMAND_EVIDENCE_PATH = ARTIFACT_ROOT / "stage09-baseline-command-evidence.json"
LIVE_VALIDATION_PATH = ARTIFACT_ROOT / "stage09-live-contract-validation-summary.json"
RUNTIME_VALIDATION_PATH = (
    ARTIFACT_ROOT / "stage09-runtime-stream-evidence-validation-summary.json"
)
BOUNDARY_PATH = ARTIFACT_ROOT / "rust-data-plane-boundary.md"
ARTIFACT_GATE_PATH = ARTIFACT_ROOT / "stage09-target-result-artifact-gate.json"
CLOSEOUT_GATE_PATH = ARTIFACT_ROOT / "stage09-baseline-closeout-gate.json"
ACCEPTANCE_MATRIX_PATH = ARTIFACT_ROOT / "stage09-baseline-acceptance-matrix.json"


class Stage09BaselineAcceptanceMatrixTest(unittest.TestCase):
    def test_acceptance_matrix_summarizes_current_baseline(self) -> None:
        result = summarize_stage09_baseline_acceptance_matrix(
            report_path=REPORT_PATH,
            summary_path=SUMMARY_PATH,
            command_evidence_path=COMMAND_EVIDENCE_PATH,
            live_validation_path=LIVE_VALIDATION_PATH,
            runtime_validation_path=RUNTIME_VALIDATION_PATH,
            boundary_path=BOUNDARY_PATH,
            artifact_gate_path=ARTIFACT_GATE_PATH,
            closeout_gate_path=CLOSEOUT_GATE_PATH,
        )

        self.assertEqual(
            result["schema"],
            "telemforge.stage09_baseline_acceptance_matrix.v1",
        )
        self.assertEqual(result["status"], "passed_with_runtime_claims_blocked")
        self.assertEqual(result["target_counts"]["passed"], 3)
        self.assertEqual(result["target_counts"]["missed"], 3)
        self.assertEqual(len(result["matrix_rows"]), 6)
        self.assertEqual(
            result["runtime_claims"]["stream_runtime_claim_status"],
            "contract_only_blocked",
        )
        self.assertFalse(result["runtime_claims"]["candidate_can_be_promoted"])
        self.assertFalse(result["public_repo_safety"]["includes_docs_automation"])
        self.assertIn("not a whole-project rewrite", result["rust_scope"])

    def test_public_acceptance_matrix_matches_current_result(self) -> None:
        result = summarize_stage09_baseline_acceptance_matrix(
            report_path=REPORT_PATH,
            summary_path=SUMMARY_PATH,
            command_evidence_path=COMMAND_EVIDENCE_PATH,
            live_validation_path=LIVE_VALIDATION_PATH,
            runtime_validation_path=RUNTIME_VALIDATION_PATH,
            boundary_path=BOUNDARY_PATH,
            artifact_gate_path=ARTIFACT_GATE_PATH,
            closeout_gate_path=CLOSEOUT_GATE_PATH,
        )
        artifact = json.loads(ACCEPTANCE_MATRIX_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, result)
        self.assertFalse(
            any("docs/automation" in path for path in artifact["source_artifacts"].values())
        )

    def test_cli_writes_acceptance_matrix(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "stage09-baseline-acceptance-matrix.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/summarize_stage09_baseline_acceptance_matrix.py",
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
        self.assertEqual(output_payload["status"], "passed_with_runtime_claims_blocked")

    def test_rejects_runtime_stream_claim_drift(self) -> None:
        closeout_gate = json.loads(CLOSEOUT_GATE_PATH.read_text(encoding="utf-8"))
        closeout_gate["runtime_claims"]["stream_runtime_claim_status"] = "claimed"

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_closeout_gate = Path(tmpdir) / "bad-closeout-gate.json"
            bad_closeout_gate.write_text(json.dumps(closeout_gate), encoding="utf-8")

            with self.assertRaises(Stage09AcceptanceMatrixError) as ctx:
                summarize_stage09_baseline_acceptance_matrix(
                    report_path=REPORT_PATH,
                    summary_path=SUMMARY_PATH,
                    command_evidence_path=COMMAND_EVIDENCE_PATH,
                    live_validation_path=LIVE_VALIDATION_PATH,
                    runtime_validation_path=RUNTIME_VALIDATION_PATH,
                    boundary_path=BOUNDARY_PATH,
                    artifact_gate_path=ARTIFACT_GATE_PATH,
                    closeout_gate_path=bad_closeout_gate,
                )

        self.assertIn("closeout runtime stream claim", str(ctx.exception))


if __name__ == "__main__":
    unittest.main()
