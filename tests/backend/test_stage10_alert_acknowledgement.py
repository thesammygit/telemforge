import tempfile
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

from backend.app.main import create_app


class Stage10AlertAcknowledgementTest(unittest.TestCase):
    def make_client(self) -> TestClient:
        self.tmpdir = tempfile.TemporaryDirectory()
        database_path = Path(self.tmpdir.name) / "stage10-alert-ack.sqlite"
        return TestClient(create_app(database_path=database_path))

    def tearDown(self) -> None:
        tmpdir = getattr(self, "tmpdir", None)
        if tmpdir is not None:
            tmpdir.cleanup()

    def test_acknowledge_alert_updates_state_history_and_replay(self) -> None:
        client = self.make_client()
        session = client.post(
            "/sessions",
            json={"spacecraft_id": "tf-sat-01", "name": "Stage 10 API smoke"},
        ).json()

        incident = client.post(
            f"/sessions/{session['session_id']}/faults",
            json={
                "fault_type": "thermal_avionics_overheat",
                "requested_at": "2026-04-30T19:15:00Z",
                "operator_note": "Thermal drill for Stage 10",
            },
        ).json()

        alert_id = incident["alerts"][0]["alert_id"]
        response = client.post(
            f"/sessions/{session['session_id']}/alerts/{alert_id}/acknowledge",
            json={
                "acknowledged_at": "2026-04-30T19:16:00Z",
                "acknowledged_by": "local operator",
                "operator_note": "Acknowledged from the mission console",
            },
        )

        self.assertEqual(response.status_code, 200)
        acknowledged = response.json()
        self.assertEqual(acknowledged["alert"]["state"], "acknowledged")
        self.assertEqual(acknowledged["alert"]["acknowledged_by"], "local operator")
        self.assertEqual(
            acknowledged["event"]["event_type"],
            "alert.acknowledged",
        )

        active_alerts = client.get(f"/sessions/{session['session_id']}/alerts")
        self.assertEqual(active_alerts.status_code, 200)
        self.assertEqual(len(active_alerts.json()["alerts"]), 1)
        self.assertEqual(active_alerts.json()["alerts"][0]["state"], "acknowledged")

        acknowledged_alerts = client.get(
            f"/sessions/{session['session_id']}/alerts",
            params={"state": "acknowledged"},
        )
        self.assertEqual(acknowledged_alerts.status_code, 200)
        self.assertEqual(len(acknowledged_alerts.json()["alerts"]), 1)
        self.assertEqual(
            acknowledged_alerts.json()["alerts"][0]["acknowledged_at"],
            "2026-04-30T19:16:00Z",
        )

        events = client.get(f"/sessions/{session['session_id']}/events")
        self.assertEqual(events.status_code, 200)
        self.assertIn(
            "alert.acknowledged",
            [event["event_type"] for event in events.json()["events"]],
        )

        replay = client.get(
            f"/sessions/{session['session_id']}/replay",
            params={
                "start_at": "2026-04-30T19:14:50Z",
                "end_at": "2026-04-30T19:17:00Z",
            },
        )
        self.assertEqual(replay.status_code, 200)
        marker_types = [marker["marker_type"] for marker in replay.json()["markers"]]
        self.assertIn("alert.acknowledged", marker_types)


if __name__ == "__main__":
    unittest.main()
