import re
import tempfile
import threading
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

    def receive_json_with_timeout(self, websocket, timeout_seconds: float = 0.5):
        result: dict[str, object] = {}
        error: list[BaseException] = []

        def receive() -> None:
            try:
                result["message"] = websocket.receive_json()
            except BaseException as exc:  # pragma: no cover - exercised in failure cases
                error.append(exc)

        thread = threading.Thread(target=receive, daemon=True)
        thread.start()
        thread.join(timeout_seconds)
        if thread.is_alive():
            self.fail(f"expected websocket JSON message within {timeout_seconds} seconds")
        if error:
            raise error[0]
        return result["message"]

    def create_seeded_session(self, client: TestClient) -> dict[str, str]:
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
        return session

    def create_backpressure_session(self, client: TestClient) -> dict[str, str]:
        session = client.post(
            "/sessions",
            json={
                "spacecraft_id": "tf-sat-01",
                "name": "Stage 09 live stream backpressure probe",
            },
        ).json()

        for start_at in [
            "2026-05-17T00:00:00Z",
            "2026-05-17T00:10:00Z",
        ]:
            simulation_response = client.post(
                f"/sessions/{session['session_id']}/simulations",
                json={
                    "scenario": "nominal-orbit-daylight",
                    "start_at": start_at,
                    "samples": 24,
                    "step_seconds": 1,
                    "seed": 4404,
                },
            )
            self.assertEqual(simulation_response.status_code, 201)

        return session

    def test_live_stream_emits_first_snapshot_for_existing_session(self) -> None:
        client = self.make_client()
        session = self.create_seeded_session(client)

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

    def test_live_stream_emits_monotonic_follow_on_message_for_existing_session(self) -> None:
        client = self.make_client()
        session = self.create_seeded_session(client)

        with client.websocket_connect(
            f"/sessions/{session['session_id']}/telemetry/live"
        ) as websocket:
            first_message = websocket.receive_json()
            second_message = self.receive_json_with_timeout(websocket)

        self.assertEqual(first_message["type"], "stream.snapshot")
        self.assertEqual(first_message["sequence"], 1)
        self.assertEqual(second_message["type"], "telemetry.sample")
        self.assertEqual(second_message["session_id"], session["session_id"])
        self.assertGreater(second_message["sequence"], first_message["sequence"])
        self.assertRegex(second_message["emitted_at"], UTC_TIMESTAMP_PATTERN)

        payload = second_message["payload"]
        self.assertEqual(payload["channel_id"], "comms.downlink_snr_db")
        self.assertEqual(payload["timestamp"], "2026-05-15T00:10:00Z")
        self.assertEqual(payload["status"], "critical")
        self.assertEqual(payload["quality"], "suspect")
        self.assertEqual(payload["unit"], "dB")
        self.assertEqual(payload["sequence"], 0)

    def test_live_stream_reconnect_after_sequence_replays_follow_on_message(self) -> None:
        client = self.make_client()
        session = self.create_seeded_session(client)

        with client.websocket_connect(
            f"/sessions/{session['session_id']}/telemetry/live?after_sequence=1"
        ) as websocket:
            message = websocket.receive_json()

        self.assertEqual(message["type"], "telemetry.sample")
        self.assertEqual(message["session_id"], session["session_id"])
        self.assertGreater(message["sequence"], 1)
        self.assertRegex(message["emitted_at"], UTC_TIMESTAMP_PATTERN)

        payload = message["payload"]
        self.assertEqual(payload["channel_id"], "comms.downlink_snr_db")
        self.assertEqual(payload["timestamp"], "2026-05-15T00:10:00Z")
        self.assertEqual(payload["status"], "critical")
        self.assertEqual(payload["quality"], "suspect")
        self.assertEqual(payload["unit"], "dB")
        self.assertEqual(payload["sequence"], 0)

    def test_live_stream_reconnect_outside_retained_window_falls_back_to_snapshot(self) -> None:
        client = self.make_client()
        session = self.create_seeded_session(client)

        with client.websocket_connect(
            f"/sessions/{session['session_id']}/telemetry/live?after_sequence=99"
        ) as websocket:
            first_message = websocket.receive_json()
            second_message = self.receive_json_with_timeout(websocket)

        self.assertEqual(first_message["type"], "stream.snapshot")
        self.assertEqual(first_message["session_id"], session["session_id"])
        self.assertEqual(first_message["sequence"], 1)
        self.assertEqual(second_message["type"], "telemetry.sample")
        self.assertEqual(second_message["session_id"], session["session_id"])
        self.assertGreater(second_message["sequence"], first_message["sequence"])

    def test_live_stream_slow_client_emits_backpressure_with_dropped_event_count(self) -> None:
        client = self.make_client()
        session = self.create_backpressure_session(client)

        with client.websocket_connect(
            f"/sessions/{session['session_id']}/telemetry/live"
        ) as websocket:
            first_message = websocket.receive_json()
            backpressure_message = self.receive_json_with_timeout(websocket)

        self.assertEqual(first_message["type"], "stream.snapshot")
        self.assertEqual(first_message["sequence"], 1)

        self.assertEqual(backpressure_message["type"], "stream.backpressure")
        self.assertEqual(backpressure_message["session_id"], session["session_id"])
        self.assertGreater(backpressure_message["sequence"], first_message["sequence"])
        self.assertRegex(backpressure_message["emitted_at"], UTC_TIMESTAMP_PATTERN)

        payload = backpressure_message["payload"]
        self.assertEqual(payload["policy"], "drop_oldest_and_report")
        self.assertEqual(payload["client_queue_depth"], 250)
        self.assertGreater(payload["dropped_event_count"], 0)

        with client.websocket_connect(
            f"/sessions/{session['session_id']}/telemetry/live"
        ) as websocket:
            websocket.receive_json()
            websocket.receive_json()
            retained_sample = self.receive_json_with_timeout(websocket)

        self.assertEqual(retained_sample["type"], "telemetry.sample")
        self.assertEqual(retained_sample["session_id"], session["session_id"])
        self.assertGreater(retained_sample["sequence"], backpressure_message["sequence"])


if __name__ == "__main__":
    unittest.main()
