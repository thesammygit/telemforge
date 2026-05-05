import json
import unittest
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
CONTRACT_PATH = ARTIFACT_ROOT / "stage09-candidate-report-contract.json"
BASELINE_REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
README_PATH = ARTIFACT_ROOT / "README.md"


def read_json(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as file:
        return json.load(file)


def path_value(document: dict[str, Any], path: str) -> Any:
    value: Any = document
    for part in path.split("."):
        if not isinstance(value, dict) or part not in value:
            raise AssertionError(f"Missing report path: {path}")
        value = value[part]
    return value


class Stage09CandidateReportContractTest(unittest.TestCase):
    def test_contract_pins_public_baseline_report_shape(self) -> None:
        contract = read_json(CONTRACT_PATH)
        report = read_json(BASELINE_REPORT_PATH)

        self.assertEqual(
            contract["schema"],
            "telemforge.stage09_candidate_report_contract.v1",
        )
        self.assertEqual(contract["baseline_report_schema"], report["schema"])
        self.assertIn(
            "not a whole-project rewrite",
            contract["candidate_scope"]["rust_scope"],
        )

        for field_name in contract["required_top_level_fields"]:
            self.assertIn(field_name, report)
        self.assertIn("timing_source_profile", contract["required_top_level_fields"])
        self.assertEqual(
            report["timing_source_profile"]["schema"],
            "telemforge.stage09_timing_source_profile.v1",
        )

    def test_metric_bindings_exist_in_baseline_report(self) -> None:
        contract = read_json(CONTRACT_PATH)
        report = read_json(BASELINE_REPORT_PATH)

        for metric_name, binding in contract["required_metric_bindings"].items():
            value = path_value(report, binding)
            self.assertIsNotNone(value, metric_name)
            self.assertIn(metric_name, report["target_results"]["checks"])

        self.assertEqual(
            path_value(report, contract["stable_identity_gate"]["fingerprint_field"]),
            report["stable_report_fingerprint"]["digest_sha256"],
        )
        self.assertEqual(
            path_value(report, contract["stable_identity_gate"]["stable_fields_field"]),
            report["stable_report_fingerprint"]["stable_identity_fields"],
        )
        self.assertIn(
            "digest_sha256 matches",
            contract["stable_identity_gate"]["comparison_rule"],
        )

    def test_resource_and_stream_gates_match_baseline_profiles(self) -> None:
        contract = read_json(CONTRACT_PATH)
        report = read_json(BASELINE_REPORT_PATH)

        self.assertEqual(
            contract["resource_envelope"],
            {
                "worker_processes": report["resource_guard"]["worker_processes"],
                "max_expected_runtime_seconds": report["resource_guard"][
                    "max_expected_runtime_seconds"
                ],
                "max_expected_memory_mb": report["resource_guard"][
                    "max_expected_memory_mb"
                ],
                "uses_network": report["resource_guard"]["uses_network"],
                "uses_paid_services": report["resource_guard"]["uses_paid_services"],
            },
        )
        self.assertEqual(
            contract["stream_claim_gate"]["current_implementation_status"],
            report["stream_contract_profile"]["implementation_status"],
        )
        self.assertEqual(
            contract["stream_claim_gate"]["required_before_runtime_claim"],
            report["stream_contract_profile"][
                "required_live_evidence_before_runtime_claim"
            ],
        )
        self.assertIn(
            "websocket runtime fanout claim without live evidence",
            contract["candidate_scope"]["forbidden"],
        )

    def test_promotion_gate_targets_current_missed_throughput_targets(self) -> None:
        contract = read_json(CONTRACT_PATH)
        report = read_json(BASELINE_REPORT_PATH)

        self.assertEqual(
            contract["promotion_gate"]["missed_baseline_targets"],
            report["target_results"]["missed_targets"],
        )
        self.assertIn(
            "dropped_event_count does not regress",
            contract["promotion_gate"]["required_evidence"],
        )
        readme_text = README_PATH.read_text(encoding="utf-8")
        self.assertIn("stage09-candidate-report-contract.json", readme_text)
        self.assertIn("future Rust data-plane candidate", readme_text)


if __name__ == "__main__":
    unittest.main()
