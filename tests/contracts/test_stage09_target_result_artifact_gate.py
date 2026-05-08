import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.check_stage09_target_result_artifact_gate import (
    TargetResultArtifactGateError,
    check_stage09_target_result_artifact_gate,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
METRIC_INDEX_PATH = ARTIFACT_ROOT / "stage09-baseline-metric-index.json"
TARGET_GAP_PATH = ARTIFACT_ROOT / "stage09-target-gap-summary.json"
BINDING_GATE_PATH = ARTIFACT_ROOT / "stage09-target-result-binding-gate.json"
CLOSEOUT_GATE_PATH = ARTIFACT_ROOT / "stage09-baseline-closeout-gate.json"
ARTIFACT_GATE_PATH = ARTIFACT_ROOT / "stage09-target-result-artifact-gate.json"


class Stage09TargetResultArtifactGateTest(unittest.TestCase):
    def test_target_result_artifact_gate_accepts_current_artifacts(self) -> None:
        result = check_stage09_target_result_artifact_gate(
            report_path=REPORT_PATH,
            metric_index_path=METRIC_INDEX_PATH,
            target_gap_path=TARGET_GAP_PATH,
            binding_gate_path=BINDING_GATE_PATH,
            closeout_gate_path=CLOSEOUT_GATE_PATH,
        )

        self.assertEqual(
            result["schema"],
            "telemforge.stage09_target_result_artifact_gate.v1",
        )
        self.assertEqual(result["status"], "passed")
        self.assertEqual(result["metric_count"], 6)
        self.assertEqual(result["target_counts"]["passed"], 3)
        self.assertEqual(result["target_counts"]["missed"], 3)
        self.assertEqual(
            result["runtime_claims"]["stream_runtime_claim_status"],
            "contract_only_blocked",
        )
        self.assertFalse(result["runtime_claims"]["candidate_can_be_promoted"])
        self.assertEqual(
            result["next_comparable_candidate"],
            "rust_stream_fanout_sample_rate_spike",
        )
        self.assertFalse(result["public_repo_safety"]["includes_docs_automation"])
        self.assertIn("not a whole-project rewrite", result["rust_scope"])

    def test_public_artifact_gate_matches_current_result(self) -> None:
        result = check_stage09_target_result_artifact_gate(
            report_path=REPORT_PATH,
            metric_index_path=METRIC_INDEX_PATH,
            target_gap_path=TARGET_GAP_PATH,
            binding_gate_path=BINDING_GATE_PATH,
            closeout_gate_path=CLOSEOUT_GATE_PATH,
        )
        artifact = json.loads(ARTIFACT_GATE_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, result)
        self.assertFalse(
            any(
                "docs/automation" in value
                for value in artifact.values()
                if isinstance(value, str)
            )
        )

    def test_cli_writes_target_result_artifact_gate(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "stage09-target-result-artifact-gate.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/check_stage09_target_result_artifact_gate.py",
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

    def test_rejects_metric_target_drift(self) -> None:
        metric_index = json.loads(METRIC_INDEX_PATH.read_text(encoding="utf-8"))
        metric_index["metric_index"][0]["target"] = 101

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_metric_index = Path(tmpdir) / "bad-metric-index.json"
            bad_metric_index.write_text(json.dumps(metric_index), encoding="utf-8")

            with self.assertRaises(TargetResultArtifactGateError) as ctx:
                check_stage09_target_result_artifact_gate(
                    report_path=REPORT_PATH,
                    metric_index_path=bad_metric_index,
                    target_gap_path=TARGET_GAP_PATH,
                    binding_gate_path=BINDING_GATE_PATH,
                    closeout_gate_path=CLOSEOUT_GATE_PATH,
                )

        self.assertIn("channel_count index target", str(ctx.exception))


if __name__ == "__main__":
    unittest.main()
