import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.verify_stage09_baseline_bundle import verify_stage09_baseline_bundle


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
CONTRACT_PATH = ARTIFACT_ROOT / "stage09-candidate-report-contract.json"
MANIFEST_PATH = ARTIFACT_ROOT / "stage09-baseline-verification-manifest.json"
VALIDATION_SUMMARY_PATH = ARTIFACT_ROOT / "stage09-report-validation-summary.json"
SUMMARY_PATH = ARTIFACT_ROOT / "stage09-baseline-summary.md"
BUNDLE_VERIFICATION_PATH = ARTIFACT_ROOT / "stage09-baseline-bundle-verification.json"
TARGET_RESULT_BINDING_GATE_PATH = (
    ARTIFACT_ROOT / "stage09-target-result-binding-gate.json"
)
BASELINE_READINESS_SUMMARY_PATH = (
    ARTIFACT_ROOT / "stage09-baseline-readiness-summary.json"
)


class Stage09BaselineBundleVerifierTest(unittest.TestCase):
    def test_bundle_verifier_accepts_current_public_artifacts(self) -> None:
        result = verify_stage09_baseline_bundle(
            report_path=REPORT_PATH,
            contract_path=CONTRACT_PATH,
            manifest_path=MANIFEST_PATH,
            validation_summary_path=VALIDATION_SUMMARY_PATH,
            summary_path=SUMMARY_PATH,
        )

        self.assertEqual(
            result["schema"],
            "telemforge.stage09_baseline_bundle_verification.v1",
        )
        self.assertEqual(result["status"], "passed")
        self.assertIn("report_contract_validation", result["verified_gates"])
        self.assertIn("report_target_result_bindings", result["verified_gates"])
        self.assertIn("first_rust_hot_path_slice_pinned", result["verified_gates"])
        self.assertIn(
            "refresh_check_stable_fingerprint_matches",
            result["verified_gates"],
        )
        self.assertIn(
            "baseline_command_evidence_pinned",
            result["verified_gates"],
        )
        self.assertIn(
            "baseline_command_evidence_validation_matches",
            result["verified_gates"],
        )
        self.assertIn(
            "input_provenance_validation_matches",
            result["verified_gates"],
        )
        self.assertIn(
            "baseline_metric_index_pinned",
            result["verified_gates"],
        )
        self.assertIn(
            "runtime_stream_evidence_checklist_pinned",
            result["verified_gates"],
        )
        self.assertIn(
            "target_result_binding_gate_pinned",
            result["verified_gates"],
        )
        self.assertIn(
            "baseline_readiness_summary_pinned",
            result["verified_gates"],
        )
        self.assertIn(
            "candidate_promotion_readiness_pinned",
            result["verified_gates"],
        )
        self.assertIn(
            "candidate_metric_delta_pinned",
            result["verified_gates"],
        )
        self.assertIn(
            "live_contract_validation_summary_matches",
            result["verified_gates"],
        )
        self.assertIn("rust_scope_data_plane_only", result["verified_gates"])
        self.assertIn("not a whole-project rewrite", result["rust_scope"])

    def test_public_bundle_verification_artifact_matches_current_result(self) -> None:
        result = verify_stage09_baseline_bundle(
            report_path=REPORT_PATH,
            contract_path=CONTRACT_PATH,
            manifest_path=MANIFEST_PATH,
            validation_summary_path=VALIDATION_SUMMARY_PATH,
            summary_path=SUMMARY_PATH,
        )
        artifact = json.loads(BUNDLE_VERIFICATION_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, result)
        self.assertFalse(
            any(
                "docs/automation" in value
                for value in artifact.values()
                if isinstance(value, str)
            )
        )

    def test_cli_writes_bundle_verification_summary(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "bundle-verification.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/verify_stage09_baseline_bundle.py",
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
        self.assertIn(
            "manifest_paths_are_public_relative",
            output_payload["verified_gates"],
        )

    def test_target_result_binding_gate_matches_current_report(self) -> None:
        report = json.loads(REPORT_PATH.read_text(encoding="utf-8"))
        gate = json.loads(TARGET_RESULT_BINDING_GATE_PATH.read_text(encoding="utf-8"))

        self.assertEqual(
            gate["schema"],
            "telemforge.stage09_target_result_binding_gate.v1",
        )
        self.assertEqual(gate["status"], "passed")
        self.assertEqual(
            gate["baseline_verdict_status"],
            report["baseline_verdict"]["status"],
        )
        for metric_name, binding in gate["metric_bindings"].items():
            report_check = report["target_results"]["checks"][metric_name]
            self.assertEqual(binding["observed"], report_check["observed"])
            self.assertEqual(binding["target"], report_check["target"])
            self.assertEqual(binding["comparison"], report_check["comparison"])
            self.assertEqual(binding["unit"], report_check["unit"])
            self.assertEqual(binding["meets_target"], report_check["meets_target"])
            self.assertEqual(binding["gap_to_target"], report_check["gap_to_target"])

    def test_readiness_summary_keeps_baseline_comparison_scoped(self) -> None:
        summary = json.loads(BASELINE_READINESS_SUMMARY_PATH.read_text(encoding="utf-8"))

        self.assertEqual(
            summary["schema"],
            "telemforge.stage09_baseline_readiness_summary.v1",
        )
        self.assertEqual(summary["status"], "baseline_ready_for_comparison")
        self.assertEqual(
            summary["baseline_verdict_status"],
            "baseline_only_targets_not_met",
        )
        self.assertEqual(
            summary["runtime_stream_claim_status"],
            "contract_only_blocked",
        )
        self.assertEqual(
            summary["next_comparable_candidate"],
            "rust_stream_fanout_sample_rate_spike",
        )
        self.assertFalse(
            summary["target_summary"]["baseline_is_production_realtime_claim"]
        )
        self.assertIn("not a whole-project rewrite", summary["rust_scope"])
        self.assertFalse(summary["public_repo_safety"]["includes_docs_automation"])

    def test_bundle_verifier_rejects_docs_automation_manifest_path(self) -> None:
        manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
        manifest["contract_artifacts"].append(
            {
                "path": "docs/automation/state/executor.json",
                "schema": "private.runtime.state",
                "role": "must not be public evidence",
            }
        )

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_manifest = Path(tmpdir) / "bad-manifest.json"
            bad_manifest.write_text(json.dumps(manifest), encoding="utf-8")

            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/verify_stage09_baseline_bundle.py",
                    "--manifest",
                    str(bad_manifest),
                ],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(completed.returncode, 0)
        self.assertIn(
            "manifest path must not reference docs/automation",
            completed.stderr,
        )


if __name__ == "__main__":
    unittest.main()
