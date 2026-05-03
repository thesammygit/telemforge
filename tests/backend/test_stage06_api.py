import tempfile
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

from backend.app.main import create_app


class Stage06ApiTest(unittest.TestCase):
    def make_client(self) -> TestClient:
        self.tmpdir = tempfile.TemporaryDirectory()
        database_path = Path(self.tmpdir.name) / "stage06-api.sqlite"
        return TestClient(create_app(database_path=database_path))

    def tearDown(self) -> None:
        tmpdir = getattr(self, "tmpdir", None)
        if tmpdir is not None:
            tmpdir.cleanup()

    def test_manual_fault_endpoint_records_incident_story(self) -> None:
        client = self.make_client()
        session = client.post(
            "/sessions",
            json={"spacecraft_id": "tf-sat-01", "name": "Stage 06 API smoke"},
        ).json()

        response = client.post(
            f"/sessions/{session['session_id']}/faults",
            json={
                "fault_type": "comms_downlink_fade",
                "requested_at": "2026-04-30T19:20:00Z",
                "operator_note": "Ground station obstruction drill",
            },
        )

        self.assertEqual(response.status_code, 201)
        incident = response.json()
        self.assertEqual(incident["fault"]["fault_type"], "comms_downlink_fade")
        self.assertEqual(incident["fault"]["status"], "active")
        self.assertEqual(len(incident["telemetry"]), 2)
        self.assertEqual(len(incident["alerts"]), 2)
        self.assertEqual(
            [event["event_type"] for event in incident["events"]],
            ["fault.injected", "telemetry.affected", "alert.raised", "alert.raised"],
        )

        alerts_response = client.get(f"/sessions/{session['session_id']}/alerts")
        self.assertEqual(alerts_response.status_code, 200)
        self.assertEqual(len(alerts_response.json()["alerts"]), 2)
        self.assertEqual(
            {alert["channel_id"] for alert in alerts_response.json()["alerts"]},
            {"comms.downlink_snr_db", "comms.packet_error_rate_pct"},
        )

        events_response = client.get(f"/sessions/{session['session_id']}/events")
        self.assertEqual(events_response.status_code, 200)
        self.assertEqual(events_response.json()["events"][0]["event_type"], "fault.injected")

        telemetry_response = client.get(
            f"/sessions/{session['session_id']}/telemetry",
            params={"channel_id": "comms.downlink_snr_db"},
        )
        self.assertEqual(telemetry_response.status_code, 200)
        self.assertEqual(telemetry_response.json()["telemetry"][0]["status"], "critical")

    def test_manual_fault_endpoint_rejects_unknown_session_and_fault_type(self) -> None:
        client = self.make_client()

        missing_session_response = client.post(
            "/sessions/tf-session-missing/faults",
            json={
                "fault_type": "thermal_avionics_overheat",
                "requested_at": "2026-04-30T19:20:00Z",
            },
        )
        self.assertEqual(missing_session_response.status_code, 404)

        session = client.post(
            "/sessions",
            json={"spacecraft_id": "tf-sat-01", "name": "Stage 06 API smoke"},
        ).json()
        unknown_fault_response = client.post(
            f"/sessions/{session['session_id']}/faults",
            json={
                "fault_type": "payload_glitch",
                "requested_at": "2026-04-30T19:20:00Z",
            },
        )
        self.assertEqual(unknown_fault_response.status_code, 400)
        self.assertIn("Unsupported Stage 06 fault type", unknown_fault_response.json()["detail"])


if __name__ == "__main__":
    unittest.main()
