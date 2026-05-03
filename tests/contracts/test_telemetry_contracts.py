import json
import unittest
from pathlib import Path

from backend.app.schemas.telemetry import (
    AlertRecord,
    EventLogEntry,
    FaultInjectionRequest,
    ReplayPayload,
    TelemetryChannel,
    TelemetrySnapshot,
)


ROOT = Path(__file__).resolve().parents[2]
TELEMETRY_FIXTURES = ROOT / "fixtures" / "telemetry"


def read_json(name: str) -> dict:
    with (TELEMETRY_FIXTURES / name).open(encoding="utf-8") as fixture_file:
        return json.load(fixture_file)


class TelemetryContractFixturesTest(unittest.TestCase):
    def test_channels_define_operational_metadata_and_thresholds(self) -> None:
        document = read_json("channels.json")
        channels = [TelemetryChannel.from_dict(item) for item in document["channels"]]

        self.assertGreaterEqual(len(channels), 8)
        self.assertEqual(len({channel.channel_id for channel in channels}), len(channels))
        self.assertTrue(
            {"eps", "thermal", "adcs", "comms"}.issubset(
                {channel.subsystem for channel in channels}
            )
        )

        for channel in channels:
            self.assertTrue(channel.name)
            self.assertTrue(channel.unit)
            self.assertGreater(channel.cadence_ms, 0)
            self.assertLess(channel.nominal_range.minimum, channel.nominal_range.maximum)
            self.assertLess(
                channel.critical_range.minimum,
                channel.critical_range.maximum,
            )

    def test_nominal_and_degraded_snapshots_parse_and_differ(self) -> None:
        channels = [
            TelemetryChannel.from_dict(item) for item in read_json("channels.json")["channels"]
        ]
        channel_ids = {channel.channel_id for channel in channels}

        nominal = TelemetrySnapshot.from_dict(read_json("nominal_snapshot.json"))
        degraded = TelemetrySnapshot.from_dict(read_json("degraded_snapshot.json"))

        self.assertEqual({point.channel_id for point in nominal.points}, channel_ids)
        self.assertEqual({point.channel_id for point in degraded.points}, channel_ids)
        self.assertTrue(all(point.status == "nominal" for point in nominal.points))
        self.assertTrue(any(point.status in {"warning", "critical"} for point in degraded.points))
        self.assertLess(
            degraded.point_by_channel("eps.battery_voltage").value,
            nominal.point_by_channel("eps.battery_voltage").value,
        )
        self.assertGreater(
            degraded.point_by_channel("thermal.avionics_temp").value,
            nominal.point_by_channel("thermal.avionics_temp").value,
        )

        self.assertEqual(nominal.alerts, [])
        self.assertGreaterEqual(len(degraded.alerts), 2)
        for alert in degraded.alerts:
            self.assertIsInstance(alert, AlertRecord)
            self.assertIn(alert.channel_id, channel_ids)
            self.assertIn(alert.severity, {"warning", "critical"})

    def test_fault_request_and_replay_payload_parse_against_same_channels(self) -> None:
        channel_ids = {
            channel.channel_id
            for channel in (
                TelemetryChannel.from_dict(item) for item in read_json("channels.json")["channels"]
            )
        }

        fault_request = FaultInjectionRequest.from_dict(read_json("fault_request.json"))
        replay_payload = ReplayPayload.from_dict(read_json("replay_payload.json"))

        self.assertTrue(set(fault_request.target_channel_ids).issubset(channel_ids))
        self.assertGreater(fault_request.duration_seconds, 0)
        self.assertGreater(replay_payload.playback_rate, 0)
        self.assertGreater(replay_payload.window["end"], replay_payload.window["start"])

        replay_channel_ids = {point.channel_id for point in replay_payload.points}
        self.assertTrue(replay_channel_ids.issubset(channel_ids))
        self.assertGreaterEqual(len(replay_payload.points), 4)
        self.assertGreaterEqual(len(replay_payload.alerts), 1)

    def test_event_log_entry_contract_accepts_stage06_incident_events(self) -> None:
        event = EventLogEntry.from_dict(
            {
                "event_id": "event-stage06-02-alert-raised",
                "timestamp": "2026-04-30T19:15:02Z",
                "event_type": "alert.raised",
                "message": "Alert raised for thermal.avionics_temp: critical.",
                "related_fault_id": "fault-stage06-thermal-avionics",
                "channel_id": "thermal.avionics_temp",
                "severity": "critical",
                "metadata": {"fault_type": "thermal_avionics_overheat"},
            }
        )

        self.assertEqual(event.event_type, "alert.raised")
        self.assertEqual(event.channel_id, "thermal.avionics_temp")
        self.assertEqual(event.metadata["fault_type"], "thermal_avionics_overheat")


if __name__ == "__main__":
    unittest.main()
