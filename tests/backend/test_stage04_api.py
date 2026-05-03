import tempfile
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

from backend.app.main import create_app


class Stage04ApiTest(unittest.TestCase):
    def make_client(self) -> TestClient:
        self.tmpdir = tempfile.TemporaryDirectory()
        database_path = Path(self.tmpdir.name) / "stage04-api.sqlite"
        return TestClient(create_app(database_path=database_path))

    def tearDown(self) -> None:
        tmpdir = getattr(self, "tmpdir", None)
        if tmpdir is not None:
            tmpdir.cleanup()

    def test_health_route_reports_storage_ready(self) -> None:
        client = self.make_client()

        response = client.get("/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "service": "telemforge-api",
                "status": "ok",
                "storage": "sqlite",
                "stage": "08-hardening-docker-and-release",
            },
        )

    def test_session_simulation_and_telemetry_routes_return_stored_history(self) -> None:
        client = self.make_client()

        session_response = client.post(
            "/sessions",
            json={"spacecraft_id": "tf-sat-01", "name": "Nominal daylight smoke"},
        )
        self.assertEqual(session_response.status_code, 201)
        session = session_response.json()
        self.assertEqual(session["spacecraft_id"], "tf-sat-01")
        self.assertEqual(session["name"], "Nominal daylight smoke")
        self.assertEqual(session["status"], "created")

        run_response = client.post(
            f"/sessions/{session['session_id']}/simulations",
            json={
                "scenario": "nominal-orbit-daylight",
                "start_at": "2026-04-30T17:10:00Z",
                "samples": 3,
                "step_seconds": 10,
                "seed": 4404,
            },
        )
        self.assertEqual(run_response.status_code, 201)
        simulation = run_response.json()
        self.assertEqual(simulation["scenario"], "nominal-orbit-daylight")
        self.assertEqual(simulation["row_count"], 30)
        self.assertEqual(simulation["summary"]["samples"], 3)

        telemetry_response = client.get(
            f"/sessions/{session['session_id']}/telemetry",
            params={"channel_id": "eps.battery_voltage"},
        )
        self.assertEqual(telemetry_response.status_code, 200)
        telemetry = telemetry_response.json()["telemetry"]
        self.assertEqual(len(telemetry), 3)
        self.assertEqual(telemetry[0]["timestamp"], "2026-04-30T17:10:00Z")
        self.assertEqual(telemetry[-1]["timestamp"], "2026-04-30T17:10:20Z")
        self.assertEqual({row["channel_id"] for row in telemetry}, {"eps.battery_voltage"})

        sessions_response = client.get("/sessions")
        self.assertEqual(sessions_response.status_code, 200)
        self.assertEqual(
            [item["session_id"] for item in sessions_response.json()["sessions"]],
            [session["session_id"]],
        )


if __name__ == "__main__":
    unittest.main()
