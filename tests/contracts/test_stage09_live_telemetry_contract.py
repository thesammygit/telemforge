import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
CONTRACT_PATH = (
    ROOT
    / "docs"
    / "development"
    / "artifacts"
    / "stage09-realtime-baseline"
    / "stage09-live-telemetry-contract.json"
)
BASELINE_REPORT_PATH = (
    ROOT
    / "docs"
    / "development"
    / "artifacts"
    / "stage09-realtime-baseline"
    / "stage09-baseline-report.json"
)
RUST_BOUNDARY_NOTE_PATH = (
    ROOT
    / "docs"
    / "development"
    / "artifacts"
    / "stage09-realtime-baseline"
    / "rust-data-plane-boundary.md"
)
CHANNEL_CATALOG_PATH = ROOT / "fixtures" / "telemetry" / "channels.json"
UTC_TIMESTAMP_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$")


def read_json(path: Path) -> dict:
    with path.open(encoding="utf-8") as file:
        return json.load(file)


class Stage09LiveTelemetryContractTest(unittest.TestCase):
    def test_contract_declares_websocket_endpoint_without_runtime_fanout(self) -> None:
        contract = read_json(CONTRACT_PATH)

        self.assertEqual(
            contract["schema"],
            "telemforge.stage09_live_telemetry_contract.v1",
        )
        self.assertEqual(
            contract["implementation_status"],
            "contract_only_no_runtime_fanout",
        )
        self.assertEqual(contract["endpoint"]["protocol"], "websocket")
        self.assertEqual(
            contract["endpoint"]["path"],
            "/sessions/{session_id}/telemetry/live",
        )
        self.assertTrue(contract["endpoint"]["startup_snapshot"])
        self.assertEqual(
            contract["control_plane_inputs"]["channel_catalog"],
            "fixtures/telemetry/channels.json",
        )
        self.assertIn(
            "not a whole-project rewrite",
            contract["runtime_boundary"]["tracked_direction"],
        )

    def test_message_envelope_and_live_message_types_are_explicit(self) -> None:
        contract = read_json(CONTRACT_PATH)
        envelope = contract["message_envelope"]
        message_types = {item["type"]: item for item in contract["message_types"]}

        self.assertEqual(
            envelope["required_fields"],
            ["type", "session_id", "sequence", "emitted_at", "payload"],
        )
        self.assertEqual(envelope["sequence"]["scope"], "per session stream")
        self.assertTrue(envelope["sequence"]["monotonic"])
        self.assertEqual(
            set(message_types),
            {
                "stream.snapshot",
                "telemetry.sample",
                "alert.raised",
                "stream.heartbeat",
                "stream.backpressure",
            },
        )

        telemetry_sample = message_types["telemetry.sample"]
        self.assertEqual(
            telemetry_sample["payload_required_fields"],
            [
                "channel_id",
                "timestamp",
                "value",
                "unit",
                "status",
                "quality",
                "sequence",
            ],
        )
        self.assertEqual(
            set(telemetry_sample["status_values"]),
            {"nominal", "warning", "critical", "offline"},
        )
        self.assertEqual(
            set(telemetry_sample["quality_values"]),
            {"valid", "suspect", "missing"},
        )
        self.assertIn(
            "dropped_event_count",
            message_types["stream.backpressure"]["payload_required_fields"],
        )

    def test_backpressure_and_benchmark_binding_match_baseline_report(self) -> None:
        contract = read_json(CONTRACT_PATH)
        report = read_json(BASELINE_REPORT_PATH)

        self.assertEqual(
            contract["benchmark_binding"]["baseline_report_schema"],
            report["schema"],
        )
        self.assertEqual(
            contract["backpressure"]["overflow_behavior"],
            "drop_oldest_and_report",
        )
        self.assertEqual(contract["backpressure"]["max_client_queue_events"], 250)
        for metric_name in contract["benchmark_binding"]["required_report_metrics"]:
            self.assertIn(metric_name, report["metrics"])
        self.assertIn("dropped_event_count", report["target_results"]["checks"])

    def test_contract_validation_vectors_pin_reconnect_and_backpressure(self) -> None:
        contract = read_json(CONTRACT_PATH)
        vectors = contract["contract_validation_vectors"]
        envelope_fields = contract["message_envelope"]["required_fields"]
        ordered_stream = vectors["ordered_stream"]
        sequence_values = [message["sequence"] for message in ordered_stream]

        self.assertEqual(
            vectors["purpose"],
            (
                "Pin deterministic websocket envelope examples for contract "
                "tests before runtime fanout exists."
            ),
        )
        self.assertEqual(sequence_values, sorted(sequence_values))
        self.assertEqual(sequence_values[0], 1)
        self.assertEqual(ordered_stream[0]["type"], "stream.snapshot")
        for message in ordered_stream:
            for field in envelope_fields:
                self.assertIn(field, message)

        reconnect = vectors["reconnect_resume"]
        self.assertEqual(
            reconnect["client_query"]["after_sequence"],
            ordered_stream[1]["sequence"],
        )
        self.assertEqual(reconnect["resume_token_field"], "last_sequence")
        self.assertEqual(
            reconnect["must_resume_with_sequence_greater_than"],
            ordered_stream[1]["sequence"],
        )
        self.assertEqual(reconnect["out_of_window_fallback"], "stream.snapshot")
        self.assertEqual(
            contract["reconnect"]["client_query_parameter"],
            "after_sequence",
        )

        backpressure = vectors["backpressure_report"]
        self.assertEqual(backpressure["type"], "stream.backpressure")
        self.assertEqual(
            backpressure["payload"]["policy"],
            contract["backpressure"]["overflow_behavior"],
        )
        self.assertEqual(
            backpressure["payload"]["client_queue_depth"],
            contract["backpressure"]["max_client_queue_events"],
        )
        self.assertGreater(backpressure["payload"]["dropped_event_count"], 0)
        self.assertEqual(
            backpressure["comparison_metric"],
            "metrics.dropped_event_count",
        )

    def test_contract_vectors_match_declared_message_shapes(self) -> None:
        contract = read_json(CONTRACT_PATH)
        vectors = contract["contract_validation_vectors"]
        message_types = {item["type"]: item for item in contract["message_types"]}
        envelope_fields = contract["message_envelope"]["required_fields"]
        messages = [
            *vectors["ordered_stream"],
            vectors["backpressure_report"],
        ]

        for message in messages:
            for field in envelope_fields:
                self.assertIn(field, message)
            self.assertRegex(message["emitted_at"], UTC_TIMESTAMP_PATTERN)

            declared_type = message_types[message["type"]]
            payload = message["payload"]
            for field in declared_type["payload_required_fields"]:
                self.assertIn(field, payload)

            if "timestamp" in payload:
                self.assertRegex(payload["timestamp"], UTC_TIMESTAMP_PATTERN)
            if "stream_time" in payload:
                self.assertRegex(payload["stream_time"], UTC_TIMESTAMP_PATTERN)

            if message["type"] == "telemetry.sample":
                self.assertIn(payload["status"], declared_type["status_values"])
                self.assertIn(payload["quality"], declared_type["quality_values"])
            if message["type"] == "stream.backpressure":
                self.assertEqual(payload["policy"], declared_type["policy"])
                self.assertEqual(
                    contract["backpressure"]["dropped_event_count_source"],
                    "stream.backpressure.payload.dropped_event_count",
                )
                self.assertGreater(payload["dropped_event_count"], 0)

    def test_runtime_evidence_gate_keeps_stream_claims_contract_only(self) -> None:
        contract = read_json(CONTRACT_PATH)
        evidence_gate = contract["runtime_evidence_gate"]
        required_evidence = evidence_gate["required_before_runtime_claim"]

        self.assertEqual(
            evidence_gate["schema"],
            "telemforge.stage09_runtime_stream_evidence_gate.v1",
        )
        self.assertEqual(evidence_gate["status"], "contract_only_blocked")
        self.assertEqual(
            required_evidence,
            [
                "websocket connection acceptance for an existing session",
                "startup snapshot emitted before incremental telemetry samples",
                "monotonic per-session stream sequence values",
                "after_sequence reconnect resume behavior",
                "drop_oldest_and_report backpressure behavior",
                "dropped_event_count reported from stream.backpressure payloads",
            ],
        )
        self.assertEqual(
            sorted(evidence_gate["evidence_items"]),
            sorted(required_evidence),
        )

        for evidence_name, item in evidence_gate["evidence_items"].items():
            self.assertEqual(item["claim_status"], "not_claimed_until_runtime_test")
            self.assertEqual(item["source"], "stage09-live-telemetry-contract.json")
            self.assertIn(item["proof_artifact"], evidence_gate["proof_artifacts"])
            self.assertIn("not a whole-project rewrite", item["rust_scope"])
            self.assertIn(evidence_name, required_evidence)

        self.assertIn(
            "runtime websocket fanout",
            evidence_gate["forbidden_without_evidence"],
        )

    def test_example_payload_references_known_channel_catalog(self) -> None:
        contract = read_json(CONTRACT_PATH)
        catalog = read_json(CHANNEL_CATALOG_PATH)
        channel_ids = {channel["channel_id"] for channel in catalog["channels"]}
        sample = contract["examples"]["nominal_sample"]

        self.assertEqual(sample["type"], "telemetry.sample")
        self.assertIn(sample["payload"]["channel_id"], channel_ids)
        self.assertGreater(sample["sequence"], 0)
        self.assertGreaterEqual(sample["payload"]["sequence"], 0)

    def test_rust_boundary_note_keeps_data_plane_spike_narrow(self) -> None:
        note = RUST_BOUNDARY_NOTE_PATH.read_text(encoding="utf-8")

        self.assertIn("not approval for a whole-project rewrite", note)
        self.assertIn("Python/FastAPI path remains the measured control plane", note)
        self.assertIn("stream fanout with reconnect/backpressure reporting", note)
        self.assertIn("stage09-live-telemetry-contract.json", note)
        self.assertIn("stage09-baseline-report.json", note)
        self.assertIn("Promotion Gates", note)


if __name__ == "__main__":
    unittest.main()
