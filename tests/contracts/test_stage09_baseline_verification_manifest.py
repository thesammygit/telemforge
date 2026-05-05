import json
import unittest
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
MANIFEST_PATH = ARTIFACT_ROOT / "stage09-baseline-verification-manifest.json"
REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
LIVE_CONTRACT_PATH = ARTIFACT_ROOT / "stage09-live-telemetry-contract.json"
CANDIDATE_CONTRACT_PATH = ARTIFACT_ROOT / "stage09-candidate-report-contract.json"
VALIDATION_SUMMARY_PATH = ARTIFACT_ROOT / "stage09-report-validation-summary.json"
FIRST_RUST_HOT_PATH_PATH = ARTIFACT_ROOT / "first-rust-hot-path-slice.md"


def read_json(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as file:
        value = json.load(file)
    if not isinstance(value, dict):
        raise AssertionError(f"{path} must contain a JSON object")
    return value


def repo_path(path: Path) -> str:
    return str(path.relative_to(ROOT))


class Stage09BaselineVerificationManifestTest(unittest.TestCase):
    def test_manifest_pins_public_artifacts_and_safe_commands(self) -> None:
        manifest = read_json(MANIFEST_PATH)
        report = read_json(REPORT_PATH)
        live_contract = read_json(LIVE_CONTRACT_PATH)
        candidate_contract = read_json(CANDIDATE_CONTRACT_PATH)
        validation_summary = read_json(VALIDATION_SUMMARY_PATH)

        self.assertEqual(
            manifest["schema"],
            "telemforge.stage09_baseline_verification_manifest.v1",
        )
        self.assertEqual(manifest["stage"], report["stage"])
        self.assertIn("not a whole-project rewrite", manifest["rust_scope"])
        self.assertEqual(
            manifest["benchmark"]["command"],
            report["verification_contract"]["command"],
        )
        self.assertEqual(
            manifest["benchmark"]["report_schema"],
            report["schema"],
        )
        self.assertEqual(
            manifest["benchmark"]["report_path"],
            repo_path(REPORT_PATH),
        )

        contract_paths = {
            artifact["path"]: artifact for artifact in manifest["contract_artifacts"]
        }
        self.assertEqual(
            contract_paths[repo_path(LIVE_CONTRACT_PATH)]["schema"],
            live_contract["schema"],
        )
        self.assertEqual(
            contract_paths[repo_path(CANDIDATE_CONTRACT_PATH)]["schema"],
            candidate_contract["schema"],
        )
        self.assertEqual(
            contract_paths[repo_path(VALIDATION_SUMMARY_PATH)]["schema"],
            validation_summary["schema"],
        )
        self.assertEqual(
            contract_paths[repo_path(FIRST_RUST_HOT_PATH_PATH)]["schema"],
            "telemforge.stage09_first_rust_hot_path_slice_note.v1",
        )
        self.assertIn(
            "first Rust data-plane experiment",
            contract_paths[repo_path(FIRST_RUST_HOT_PATH_PATH)]["role"],
        )
        self.assertEqual(validation_summary["status"], "passed")

        self.assertEqual(
            manifest["resource_envelope"],
            candidate_contract["resource_envelope"],
        )
        self.assertFalse(manifest["public_repo_safety"]["includes_docs_automation"])
        self.assertFalse(manifest["public_repo_safety"]["uses_absolute_local_paths"])
        self.assertFalse(manifest["public_repo_safety"]["uses_credentials"])
        self.assertEqual(
            manifest["candidate_gate"]["validated_gates"],
            validation_summary["validated_gates"],
        )
        self.assertIn(
            "dropped_event_count does not regress",
            manifest["candidate_gate"]["required_evidence"],
        )

    def test_manifest_contains_only_public_relative_paths(self) -> None:
        manifest_text = MANIFEST_PATH.read_text(encoding="utf-8")

        self.assertNotIn("/Users/", manifest_text)
        self.assertNotIn("docs/automation", manifest_text)
        manifest = read_json(MANIFEST_PATH)
        public_paths = [manifest["benchmark"]["report_path"]]
        public_paths.extend(
            artifact["path"] for artifact in manifest["contract_artifacts"]
        )

        for path in public_paths:
            self.assertFalse(path.startswith("/"), path)
            self.assertTrue((ROOT / path).exists(), path)


if __name__ == "__main__":
    unittest.main()
