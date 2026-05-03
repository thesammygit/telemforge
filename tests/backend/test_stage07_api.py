import tempfile
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

from backend.app.main import create_app


class Stage07ApiTest(unittest.TestCase):
    def make_client(self) -> TestClient:
        self.tmpdir = tempfile.TemporaryDirectory()
        database_path = Path(self.tmpdir.name) / "stage07-api.sqlite"
        return TestClient(create_app(database_path=database_path))

    def tearDown(self) -> None:
        tmpdir = getattr(self, "tmpdir", None)
        if tmpdir is not None:
            tmpdir.cleanup()

    def test_replay_endpoint_returns_timeline_markers_and_anomaly_explanations(self) -> None:
        client = self.make_client()
        session = client.post(
            "/sessions",
            json={"spacecraft_id": "tf-sat-01", "name": "Stage 07 API smoke"},
        ).json()
        client.post(
            f"/sessions/{session['session_id']}/simulations",
            json={
                "scenario": "nominal-orbit-daylight",
                "start_at": "2026-04-30T19:14:40Z",
                "samples": 4,
                "step_seconds": 10,
                "seed": 7070,
            },
        )
        client.post(
            f"/sessions/{session['session_id']}/faults",
            json={
                "fault_type": "thermal_avionics_overheat",
                "requested_at": "2026-04-30T19:15:00Z",
                "operator_note": "Replay review case",
            },
        )

        response = client.get(
            f"/sessions/{session['session_id']}/replay",
            params={
                "start_at": "2026-04-30T19:14:50Z",
                "end_at": "2026-04-30T19:15:10Z",
                "limit": 100,
            },
        )

        self.assertEqual(response.status_code, 200)
        replay = response.json()
        self.assertEqual(replay["schema"], "telemforge.replay_window.v1")
        self.assertEqual(replay["summary"]["fault_count"], 1)
        self.assertEqual(replay["summary"]["alert_count"], 1)
        self.assertEqual(replay["summary"]["event_count"], 3)
        self.assertIn("fault", {marker["kind"] for marker in replay["markers"]})
        self.assertIn("alert", {marker["kind"] for marker in replay["markers"]})
        self.assertIn("event", {marker["kind"] for marker in replay["markers"]})
        self.assertEqual(replay["anomalies"][0]["channel_id"], "thermal.avionics_temp")
        self.assertIn("warning high limit 55.0 degC", replay["anomalies"][0]["reason"])

    def test_anomalies_endpoint_returns_replay_derived_scores_only(self) -> None:
        client = self.make_client()
        session = client.post(
            "/sessions",
            json={"spacecraft_id": "tf-sat-01", "name": "Stage 07 anomalies smoke"},
        ).json()
        client.post(
            f"/sessions/{session['session_id']}/faults",
            json={
                "fault_type": "comms_downlink_fade",
                "requested_at": "2026-04-30T19:16:00Z",
            },
        )

        response = client.get(
            f"/sessions/{session['session_id']}/anomalies",
            params={
                "start_at": "2026-04-30T19:15:50Z",
                "end_at": "2026-04-30T19:16:10Z",
            },
        )

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["schema"], "telemforge.anomaly_window.v1")
        self.assertEqual(body["session_id"], session["session_id"])
        self.assertEqual(body["summary"]["anomaly_count"], 2)
        self.assertEqual(
            {anomaly["channel_id"] for anomaly in body["anomalies"]},
            {"comms.downlink_snr_db", "comms.packet_error_rate_pct"},
        )

    def test_replay_endpoint_rejects_unknown_session_and_invalid_window(self) -> None:
        client = self.make_client()
        missing_response = client.get(
            "/sessions/tf-session-missing/replay",
            params={
                "start_at": "2026-04-30T19:14:50Z",
                "end_at": "2026-04-30T19:15:10Z",
            },
        )
        self.assertEqual(missing_response.status_code, 404)

        session = client.post(
            "/sessions",
            json={"spacecraft_id": "tf-sat-01", "name": "Stage 07 invalid window"},
        ).json()
        invalid_window_response = client.get(
            f"/sessions/{session['session_id']}/replay",
            params={
                "start_at": "2026-04-30T19:16:00Z",
                "end_at": "2026-04-30T19:15:00Z",
            },
        )
        self.assertEqual(invalid_window_response.status_code, 400)
        self.assertIn("start_at must be before end_at", invalid_window_response.json()["detail"])


if __name__ == "__main__":
    unittest.main()
