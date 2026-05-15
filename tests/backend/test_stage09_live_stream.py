import re
import tempfile
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

from backend.app.main import create_app


UTC_TIMESTAMP_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$")


class Stage09LiveStreamTest(unittest.TestCase):
    def make_client(self) -> TestClient:
        self.tmpdir = tempfile.TemporaryDirectory()
        database_path = Path(self.tmpdir.name) / "stage09-live-stream.sqlite"
        return TestClient(create_app(database_path=database_path))

    def tearDown(self) -> None:
        tmpdir = getattr(self, "tmpdir", None)
        if tmpdir is not None:
            tmpdir.cleanup()

    def test_live_stream_emits_first_snapshot_for_existing_session(self) -> None:
        client = self.make_client()
        session = client.post(
            "/sessions",
            json={
                "spacecraft_id": "tf-sat-01",
                "name": "Stage 09 live stream snapshot probe",
            },
        ).json()

        simulation_response = client.post(
            f"/sessions/{session['session_id']}/simulations",
            json={
                "scenario": "nominal-orbit-daylight",
                "start_at": "2026-05-15T00:00:00Z",
                "samples": 2,
                "step_seconds": 10,
                "seed": 4404,
            },
        )
        self.assertEqual(simulation_response.status_code, 201)

        fault_response = client.post(
            f"/sessions/{session['session_id']}/faults",
            json={
                "fault_type": "comms_downlink_fade",
                "requested_at": "2026-05-15T00:10:00Z",
                "operator_note": "Stage 09 live snapshot alert probe",
            },
        )
        self.assertEqual(fault_response.status_code, 201)

        with client.websocket_connect(
            f"/sessions/{session['session_id']}/telemetry/live"
        ) as websocket:
            message = websocket.receive_json()

        self.assertEqual(message["type"], "stream.snapshot")
        self.assertEqual(message["session_id"], session["session_id"])
        self.assertEqual(message["sequence"], 1)
        self.assertRegex(message["emitted_at"], UTC_TIMESTAMP_PATTERN)

        payload = message["payload"]
        expected_channels = [
            channel.channel_id for channel in client.app.state.channels
        ]
        self.assertEqual(payload["channels"], expected_channels)

        latest_points = {
            point["channel_id"]: point for point in payload["latest_points"]
        }
        self.assertEqual(set(latest_points), set(expected_channels))
        self.assertEqual(
            latest_points["comms.downlink_snr_db"]["timestamp"],
            "2026-05-15T00:10:00Z",
        )
        self.assertEqual(
            latest_points["comms.downlink_snr_db"]["status"],
            "critical",
        )
        self.assertEqual(
            latest_points["comms.packet_error_rate_pct"]["status"],
            "critical",
        )

        active_alerts = payload["active_alerts"]
        self.assertEqual(len(active_alerts), 2)
        self.assertEqual(
            {alert["channel_id"] for alert in active_alerts},
            {"comms.downlink_snr_db", "comms.packet_error_rate_pct"},
        )
        self.assertEqual({alert["state"] for alert in active_alerts}, {"active"})
        for alert in active_alerts:
            self.assertRegex(alert["timestamp"], UTC_TIMESTAMP_PATTERN)


if __name__ == "__main__":
    unittest.main()
