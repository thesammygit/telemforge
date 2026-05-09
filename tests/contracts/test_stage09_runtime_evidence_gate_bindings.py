import json
import unittest
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
LIVE_CONTRACT_PATH = ARTIFACT_ROOT / "stage09-live-telemetry-contract.json"
BASELINE_REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
CHECKLIST_PATH = ARTIFACT_ROOT / "stage09-runtime-stream-evidence-checklist.json"
VALIDATION_PATH = (
    ARTIFACT_ROOT / "stage09-runtime-stream-evidence-validation-summary.json"
)
LIVE_VALIDATION_PATH = ARTIFACT_ROOT / "stage09-live-contract-validation-summary.json"
CANDIDATE_CONTRACT_PATH = ARTIFACT_ROOT / "stage09-candidate-report-contract.json"
CLOSEOUT_GATE_PATH = ARTIFACT_ROOT / "stage09-baseline-closeout-gate.json"
HANDOFF_GATE_PATH = ARTIFACT_ROOT / "stage09-baseline-handoff-gate.json"


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


class Stage09RuntimeEvidenceGateBindingsTest(unittest.TestCase):
    def test_runtime_evidence_requirements_match_across_public_artifacts(self) -> None:
        contract = read_json(LIVE_CONTRACT_PATH)
        checklist = read_json(CHECKLIST_PATH)
        validation = read_json(VALIDATION_PATH)
        closeout_gate = read_json(CLOSEOUT_GATE_PATH)
        handoff_gate = read_json(HANDOFF_GATE_PATH)

        required_evidence = contract["runtime_evidence_gate"][
            "required_before_runtime_claim"
        ]

        self.assertEqual(checklist["required_evidence"], required_evidence)
        self.assertEqual(validation["required_evidence_count"], len(required_evidence))
        self.assertEqual(
            [item["evidence"] for item in validation["validated_evidence"]],
            required_evidence,
        )
        self.assertEqual(
            closeout_gate["missing_runtime_probe_evidence_count"],
            len(required_evidence),
        )
        self.assertIn(
            "runtime_probe_evidence_missing",
            closeout_gate["blocking_reasons"],
        )
        self.assertIn(
            "runtime_probe_evidence_missing",
            handoff_gate["blocking_reasons"],
        )

    def test_runtime_claim_status_stays_blocked_across_review_gates(self) -> None:
        contract = read_json(LIVE_CONTRACT_PATH)
        report = read_json(BASELINE_REPORT_PATH)
        validation = read_json(VALIDATION_PATH)
        candidate_contract = read_json(CANDIDATE_CONTRACT_PATH)
        closeout_gate = read_json(CLOSEOUT_GATE_PATH)
        handoff_gate = read_json(HANDOFF_GATE_PATH)

        self.assertEqual(contract["runtime_evidence_gate"]["status"], "contract_only_blocked")
        self.assertEqual(
            report["stream_contract_profile"]["runtime_evidence_gate"]["status"],
            "contract_only_blocked",
        )
        self.assertEqual(
            candidate_contract["stream_claim_gate"]["runtime_evidence_gate_status"],
            "contract_only_blocked",
        )
        self.assertEqual(validation["runtime_stream_claim_status"], "contract_only_blocked")
        self.assertEqual(
            closeout_gate["runtime_claims"]["stream_runtime_claim_status"],
            "contract_only_blocked",
        )
        self.assertEqual(
            handoff_gate["runtime_claims"]["stream_runtime_claim_status"],
            "contract_only_blocked",
        )
        self.assertFalse(closeout_gate["runtime_claims"]["candidate_can_be_promoted"])
        self.assertFalse(handoff_gate["runtime_claims"]["candidate_can_be_promoted"])

    def test_stream_proof_artifact_paths_are_public_repo_relative_and_existing(self) -> None:
        contract = read_json(LIVE_CONTRACT_PATH)
        report = read_json(BASELINE_REPORT_PATH)
        candidate_contract = read_json(CANDIDATE_CONTRACT_PATH)
        live_validation = read_json(LIVE_VALIDATION_PATH)

        contract_artifacts = contract["runtime_evidence_gate"]["proof_artifacts"]
        report_artifacts = report["stream_contract_profile"]["runtime_evidence_gate"][
            "proof_artifacts"
        ]
        candidate_artifacts = candidate_contract["stream_claim_gate"][
            "runtime_evidence_proof_artifacts"
        ]

        for artifact in report_artifacts:
            self.assertIn(artifact, contract_artifacts)
        self.assertEqual(live_validation["proof_artifacts"], contract_artifacts)
        for artifact in candidate_artifacts:
            self.assertIn(artifact, contract_artifacts)
        for artifact in contract_artifacts:
            artifact_path = Path(artifact)
            self.assertFalse(artifact_path.is_absolute(), artifact)
            self.assertNotIn("docs/automation", artifact)
            self.assertTrue((ROOT / artifact).is_file(), artifact)

    def test_dropped_event_runtime_binding_points_to_stream_gate_and_metric(self) -> None:
        contract = read_json(LIVE_CONTRACT_PATH)
        report = read_json(BASELINE_REPORT_PATH)
        checklist = read_json(CHECKLIST_PATH)

        self.assertEqual(
            contract["backpressure"]["dropped_event_count_source"],
            "stream.backpressure.payload.dropped_event_count",
        )
        self.assertEqual(
            checklist["report_binding"]["runtime_evidence_gate"],
            "stream_contract_profile.runtime_evidence_gate",
        )
        self.assertEqual(
            path_value(report, checklist["report_binding"]["runtime_evidence_gate"])[
                "claim_status"
            ],
            "not_claimed_until_runtime_test",
        )
        self.assertEqual(
            checklist["report_binding"]["dropped_event_metric"],
            "metrics.dropped_event_count",
        )
        self.assertEqual(
            path_value(report, checklist["report_binding"]["dropped_event_metric"]),
            report["target_results"]["checks"]["dropped_event_count"]["observed"],
        )


if __name__ == "__main__":
    unittest.main()
