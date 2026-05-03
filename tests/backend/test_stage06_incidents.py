import tempfile
import unittest
from pathlib import Path

from backend.app.domain.incidents import build_manual_fault_incident
from backend.app.domain.telemetry_simulation import load_channel_catalog
from backend.app.storage.sqlite_store import TelemetryStore


ROOT = Path(__file__).resolve().parents[2]
CHANNELS_PATH = ROOT / "fixtures" / "telemetry" / "channels.json"


class Stage06IncidentDomainTest(unittest.TestCase):
    def setUp(self) -> None:
        self.channels = load_channel_catalog(CHANNELS_PATH)

    def test_thermal_fault_changes_telemetry_and_raises_threshold_alert(self) -> None:
        incident = build_manual_fault_incident(
            channels=self.channels,
            spacecraft_id="tf-sat-01",
            fault_type="thermal_avionics_overheat",
            requested_at="2026-04-30T19:10:00Z",
            operator_note="Thermal recovery drill",
        )

        self.assertEqual(incident.fault["fault_type"], "thermal_avionics_overheat")
        self.assertEqual(incident.fault["subsystem"], "thermal")
        self.assertEqual(incident.fault["status"], "active")
        self.assertEqual(incident.telemetry[0]["channel_id"], "thermal.avionics_temp")
        self.assertEqual(incident.telemetry[0]["value"], 61.8)
        self.assertEqual(incident.telemetry[0]["status"], "critical")
        self.assertEqual(incident.alerts[0]["severity"], "critical")
        self.assertEqual(incident.alerts[0]["state"], "active")
        self.assertIn("above warning high limit 55.0 degC", incident.alerts[0]["message"])
        self.assertEqual(
            [event["event_type"] for event in incident.events],
            ["fault.injected", "telemetry.affected", "alert.raised"],
        )

    def test_comms_fault_affects_snr_and_packet_error_channels(self) -> None:
        incident = build_manual_fault_incident(
            channels=self.channels,
            spacecraft_id="tf-sat-01",
            fault_type="comms_downlink_fade",
            requested_at="2026-04-30T19:12:00Z",
        )

        self.assertEqual(
            [row["channel_id"] for row in incident.telemetry],
            ["comms.downlink_snr_db", "comms.packet_error_rate_pct"],
        )
        self.assertEqual([row["status"] for row in incident.telemetry], ["critical", "critical"])
        self.assertEqual(len(incident.alerts), 2)
        self.assertTrue(
            any("below warning low limit 5.0 dB" in alert["message"] for alert in incident.alerts)
        )
        self.assertTrue(
            any("above warning high limit 2.0 pct" in alert["message"] for alert in incident.alerts)
        )

    def test_unknown_manual_fault_is_rejected(self) -> None:
        with self.assertRaisesRegex(ValueError, "Unsupported Stage 06 fault type"):
            build_manual_fault_incident(
                channels=self.channels,
                spacecraft_id="tf-sat-01",
                fault_type="payload_glitch",
                requested_at="2026-04-30T19:12:00Z",
            )


class Stage06IncidentStorageTest(unittest.TestCase):
    def setUp(self) -> None:
        self.channels = load_channel_catalog(CHANNELS_PATH)

    def test_fault_incident_round_trips_through_sqlite(self) -> None:
        incident = build_manual_fault_incident(
            channels=self.channels,
            spacecraft_id="tf-sat-01",
            fault_type="thermal_avionics_overheat",
            requested_at="2026-04-30T19:15:00Z",
            operator_note="Manual overheat training case",
        )

        with tempfile.TemporaryDirectory() as tmpdir:
            store = TelemetryStore(Path(tmpdir) / "stage06.sqlite")
            store.initialize()
            session = store.create_session(
                spacecraft_id="tf-sat-01",
                name="Stage 06 incident smoke",
            )

            stored = store.record_fault_incident(session["session_id"], incident)

            faults = store.list_faults(session["session_id"])
            alerts = store.list_alerts(session["session_id"])
            events = store.list_events(session["session_id"])
            telemetry = store.list_telemetry(
                session_id=session["session_id"],
                channel_id="thermal.avionics_temp",
            )

        self.assertEqual(stored["fault"]["fault_type"], "thermal_avionics_overheat")
        self.assertEqual(stored["run"]["scenario"], "manual-fault:thermal_avionics_overheat")
        self.assertEqual(faults[0]["fault_id"], stored["fault"]["fault_id"])
        self.assertEqual(faults[0]["operator_note"], "Manual overheat training case")
        self.assertEqual(alerts[0]["related_fault_id"], stored["fault"]["fault_id"])
        self.assertEqual(alerts[0]["observed_value"], 61.8)
        self.assertEqual(
            [event["event_type"] for event in events],
            ["fault.injected", "telemetry.affected", "alert.raised"],
        )
        self.assertEqual(telemetry[0]["scenario"], "manual-fault:thermal_avionics_overheat")
        self.assertEqual(telemetry[0]["status"], "critical")


if __name__ == "__main__":
    unittest.main()
