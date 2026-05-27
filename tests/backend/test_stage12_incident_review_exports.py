import tempfile
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

from backend.app.main import create_app


class Stage12IncidentReviewExportsTest(unittest.TestCase):
    def make_client(self) -> TestClient:
        self.tmpdir = tempfile.TemporaryDirectory()
        database_path = Path(self.tmpdir.name) / "stage12-incident-export.sqlite"
        return TestClient(create_app(database_path=database_path))

    def tearDown(self) -> None:
        tmpdir = getattr(self, "tmpdir", None)
        if tmpdir is not None:
            tmpdir.cleanup()

    def create_completed_thermal_alert(self, client: TestClient) -> tuple[str, str]:
        session = client.post(
            "/sessions",
            json={"spacecraft_id": "tf-sat-01", "name": "Stage 12 export"},
        ).json()
        client.post(
            f"/sessions/{session['session_id']}/simulations",
            json={
                "scenario": "nominal-orbit-daylight",
                "start_at": "2026-04-30T19:14:40Z",
                "samples": 4,
                "step_seconds": 10,
                "seed": 1212,
            },
        )
        incident = client.post(
            f"/sessions/{session['session_id']}/faults",
            json={
                "fault_type": "thermal_avionics_overheat",
                "requested_at": "2026-04-30T19:15:00Z",
                "operator_note": "Stage 12 export drill",
            },
        ).json()
        alert_id = incident["alerts"][0]["alert_id"]
        client.post(
            f"/sessions/{session['session_id']}/alerts/{alert_id}/acknowledge",
            json={
                "acknowledged_at": "2026-04-30T19:16:00Z",
                "acknowledged_by": "local operator",
                "operator_note": "Acknowledged from Stage 12 export test",
            },
        )
        client.post(
            f"/sessions/{session['session_id']}/alerts/{alert_id}/resolve",
            json={
                "resolved_at": "2026-04-30T19:18:00Z",
                "resolved_by": "local operator",
                "resolution_note": "Resolved from Stage 12 export test",
            },
        )
        return session["session_id"], alert_id

    def test_completed_packet_export_returns_public_safe_review_payload(self) -> None:
        client = self.make_client()
        session_id, _alert_id = self.create_completed_thermal_alert(client)

        response = client.get(
            f"/sessions/{session_id}/incident-review-packets/thermal-alert-response-local/export",
        )

        self.assertEqual(response.status_code, 200)
        export = response.json()["export"]
        self.assertEqual(export["schema"], "telemforge.incident_review_export.v1")
        self.assertEqual(export["version"], 1)
        self.assertEqual(
            export["export_id"],
            f"incident-review-export:incident-review:{session_id}:thermal-alert-response-local",
        )
        self.assertEqual(
            export["packet_identity"]["packet_id"],
            f"incident-review:{session_id}:thermal-alert-response-local",
        )
        self.assertEqual(
            export["packet_identity"]["runbook_id"],
            "thermal-alert-response-local",
        )
        self.assertEqual(export["readiness"]["status"], "ready")
        self.assertEqual(export["operator_actions"]["complete_count"], 2)
        self.assertEqual(export["operator_actions"]["pending_count"], 0)
        self.assertEqual(export["event_history"]["related_event_count"], 5)
        self.assertIn("alert.resolved", export["event_history"]["event_types"])
        self.assertEqual(export["replay_evidence"]["related_marker_count"], 7)
        self.assertEqual(export["unresolved_gaps"], [])
        self.assertIn(
            "Local deterministic export payload; no files are written by the API.",
            export["scope_notes"],
        )
        self.assertTrue(
            all(
                ref["path"].startswith(("backend/", "frontend/", "docs/"))
                for ref in export["source_refs"]
            )
        )

    def test_in_progress_packet_export_preserves_unresolved_gaps(self) -> None:
        client = self.make_client()
        session = client.post(
            "/sessions",
            json={"spacecraft_id": "tf-sat-01", "name": "Stage 12 export gaps"},
        ).json()
        client.post(
            f"/sessions/{session['session_id']}/faults",
            json={
                "fault_type": "thermal_avionics_overheat",
                "requested_at": "2026-04-30T19:15:00Z",
            },
        )

        response = client.get(
            f"/sessions/{session['session_id']}/incident-review-packets/thermal-alert-response-local/export",
        )

        self.assertEqual(response.status_code, 200)
        export = response.json()["export"]
        self.assertEqual(export["readiness"]["status"], "in_progress")
        self.assertEqual(export["operator_actions"]["complete_count"], 0)
        self.assertEqual(
            [gap["gap_id"] for gap in export["unresolved_gaps"]],
            [
                "alert-not-acknowledged",
                "alert-not-resolved",
                "event-history-incomplete",
                "replay-evidence-incomplete",
            ],
        )


if __name__ == "__main__":
    unittest.main()
