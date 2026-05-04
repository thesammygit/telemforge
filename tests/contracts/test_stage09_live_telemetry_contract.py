import json
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
