import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.validate_stage09_baseline_command_matrix import (
    DEFAULT_MATRIX_PATH,
    validate_stage09_baseline_command_matrix,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
VALIDATION_ARTIFACT_PATH = (
    ARTIFACT_ROOT / "stage09-baseline-command-matrix-validation.json"
)


class Stage09BaselineCommandMatrixValidationTest(unittest.TestCase):
    def test_validation_accepts_current_public_command_matrix(self) -> None:
        result = validate_stage09_baseline_command_matrix()

        self.assertEqual(
            result["schema"],
            "telemforge.stage09_baseline_command_matrix_validation.v1",
        )
        self.assertEqual(result["status"], "passed")
        self.assertTrue(result["matrix_matches_regenerated_result"])
        self.assertEqual(result["command_count"], 6)
        self.assertEqual(
            result["validated_command_ids"],
            [
                "baseline_benchmark_report",
                "candidate_report_validator",
                "live_contract_validator",
                "baseline_bundle_verifier",
                "runtime_stream_proof_artifact_gate",
                "baseline_artifact_index",
            ],
        )
        self.assertEqual(
            result["runtime_claims"]["runtime_stream_claim_status"],
            "contract_only_blocked",
        )
        self.assertFalse(result["public_repo_safety"]["includes_docs_automation"])
        self.assertIn("not a whole-project rewrite", result["rust_scope"])

    def test_public_validation_artifact_matches_current_result(self) -> None:
        result = validate_stage09_baseline_command_matrix()
        artifact = json.loads(VALIDATION_ARTIFACT_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, result)
        self.assertEqual(
            artifact["matrix_path"],
            "docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-command-matrix.json",
        )
        self.assertFalse(artifact["public_repo_safety"]["includes_docs_automation"])

    def test_cli_emits_same_validation_payload(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "command-matrix-validation.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/validate_stage09_baseline_command_matrix.py",
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

    def test_rejects_stale_command_matrix_artifact(self) -> None:
        matrix = json.loads(DEFAULT_MATRIX_PATH.read_text(encoding="utf-8"))
        matrix["runtime_claims"]["runtime_stream_claim_status"] = "claimed"

        with tempfile.TemporaryDirectory() as tmpdir:
            stale_matrix_path = Path(tmpdir) / "stale-command-matrix.json"
            stale_matrix_path.write_text(
                json.dumps(matrix, indent=2, sort_keys=True) + "\n",
                encoding="utf-8",
            )

            with self.assertRaisesRegex(Exception, "does not match regenerated"):
                validate_stage09_baseline_command_matrix(
                    matrix_path=stale_matrix_path,
                )

    def test_rejects_docs_automation_output_path(self) -> None:
        matrix = json.loads(DEFAULT_MATRIX_PATH.read_text(encoding="utf-8"))
        matrix["commands"][0]["output_paths"] = [
            "docs/automation/runs/private-stage09-output.json"
        ]

        with tempfile.TemporaryDirectory() as tmpdir:
            unsafe_matrix_path = Path(tmpdir) / "unsafe-command-matrix.json"
            unsafe_matrix_path.write_text(
                json.dumps(matrix, indent=2, sort_keys=True) + "\n",
                encoding="utf-8",
            )

            with self.assertRaisesRegex(Exception, "docs/automation"):
                validate_stage09_baseline_command_matrix(
                    matrix_path=unsafe_matrix_path,
                )


if __name__ == "__main__":
    unittest.main()
