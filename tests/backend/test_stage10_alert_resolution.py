import tempfile
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

from backend.app.main import create_app


class Stage10AlertResolutionTest(unittest.TestCase):
    def make_client(self) -> TestClient:
        self.tmpdir = tempfile.TemporaryDirectory()
        database_path = Path(self.tmpdir.name) / "stage10-alert-resolution.sqlite"
        return TestClient(create_app(database_path=database_path))

    def tearDown(self) -> None:
        tmpdir = getattr(self, "tmpdir", None)
        if tmpdir is not None:
            tmpdir.cleanup()

    def create_acknowledged_alert(self, client: TestClient) -> tuple[str, str]:
        session = client.post(
            "/sessions",
            json={"spacecraft_id": "tf-sat-01", "name": "Stage 10 resolution"},
        ).json()
        incident = client.post(
            f"/sessions/{session['session_id']}/faults",
            json={
                "fault_type": "thermal_avionics_overheat",
                "requested_at": "2026-04-30T19:15:00Z",
                "operator_note": "Thermal drill for Stage 10 resolution",
            },
        ).json()
        alert_id = incident["alerts"][0]["alert_id"]
        client.post(
            f"/sessions/{session['session_id']}/alerts/{alert_id}/acknowledge",
            json={
                "acknowledged_at": "2026-04-30T19:16:00Z",
                "acknowledged_by": "local operator",
                "operator_note": "Acknowledged from the mission console",
            },
        )
        return session["session_id"], alert_id

    def test_resolve_acknowledged_alert_updates_state_history_and_replay(self) -> None:
        client = self.make_client()
        session_id, alert_id = self.create_acknowledged_alert(client)

        response = client.post(
            f"/sessions/{session_id}/alerts/{alert_id}/resolve",
            json={
                "resolved_at": "2026-04-30T19:18:00Z",
                "resolved_by": "local operator",
                "resolution_note": "Thermal channel returned to local review state",
            },
        )

        self.assertEqual(response.status_code, 200)
        resolved = response.json()
        self.assertEqual(resolved["alert"]["state"], "resolved")
        self.assertEqual(resolved["alert"]["resolved_by"], "local operator")
        self.assertEqual(
            resolved["alert"]["resolution_note"],
            "Thermal channel returned to local review state",
        )
        self.assertEqual(resolved["event"]["event_type"], "alert.resolved")

        resolved_alerts = client.get(
            f"/sessions/{session_id}/alerts",
            params={"state": "resolved"},
        )
        self.assertEqual(resolved_alerts.status_code, 200)
        self.assertEqual(len(resolved_alerts.json()["alerts"]), 1)
        self.assertEqual(
            resolved_alerts.json()["alerts"][0]["resolved_at"],
            "2026-04-30T19:18:00Z",
        )

        events = client.get(f"/sessions/{session_id}/events")
        self.assertEqual(events.status_code, 200)
        self.assertIn(
            "alert.resolved",
            [event["event_type"] for event in events.json()["events"]],
        )

        replay = client.get(
            f"/sessions/{session_id}/replay",
            params={
                "start_at": "2026-04-30T19:14:50Z",
                "end_at": "2026-04-30T19:19:00Z",
            },
        )
        self.assertEqual(replay.status_code, 200)
        marker_types = [marker["marker_type"] for marker in replay.json()["markers"]]
        self.assertIn("alert.resolved", marker_types)

    def test_active_alert_must_be_acknowledged_before_resolution(self) -> None:
        client = self.make_client()
        session = client.post(
            "/sessions",
            json={"spacecraft_id": "tf-sat-01", "name": "Stage 10 transition guard"},
        ).json()
        incident = client.post(
            f"/sessions/{session['session_id']}/faults",
            json={
                "fault_type": "thermal_avionics_overheat",
                "requested_at": "2026-04-30T19:15:00Z",
            },
        ).json()
        alert_id = incident["alerts"][0]["alert_id"]

        response = client.post(
            f"/sessions/{session['session_id']}/alerts/{alert_id}/resolve",
            json={
                "resolved_at": "2026-04-30T19:18:00Z",
                "resolved_by": "local operator",
                "resolution_note": "Attempted premature resolution",
            },
        )

        self.assertEqual(response.status_code, 409)


if __name__ == "__main__":
    unittest.main()
