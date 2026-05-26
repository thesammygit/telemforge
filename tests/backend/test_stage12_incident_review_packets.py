import tempfile
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

from backend.app.main import create_app


class Stage12IncidentReviewPacketsTest(unittest.TestCase):
    def make_client(self) -> TestClient:
        self.tmpdir = tempfile.TemporaryDirectory()
        database_path = Path(self.tmpdir.name) / "stage12-incident-review.sqlite"
        return TestClient(create_app(database_path=database_path))

    def tearDown(self) -> None:
        tmpdir = getattr(self, "tmpdir", None)
        if tmpdir is not None:
            tmpdir.cleanup()

    def create_thermal_alert(self, client: TestClient) -> tuple[str, str]:
        session = client.post(
            "/sessions",
            json={"spacecraft_id": "tf-sat-01", "name": "Stage 12 packet"},
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
                "operator_note": "Stage 12 packet drill",
            },
        ).json()
        return session["session_id"], incident["alerts"][0]["alert_id"]

    def test_completed_thermal_runbook_packet_summarizes_lifecycle_and_evidence(self) -> None:
        client = self.make_client()
        session_id, alert_id = self.create_thermal_alert(client)
        client.post(
            f"/sessions/{session_id}/alerts/{alert_id}/acknowledge",
            json={
                "acknowledged_at": "2026-04-30T19:16:00Z",
                "acknowledged_by": "local operator",
                "operator_note": "Acknowledged from Stage 12 test",
            },
        )
        client.post(
            f"/sessions/{session_id}/alerts/{alert_id}/resolve",
            json={
                "resolved_at": "2026-04-30T19:18:00Z",
                "resolved_by": "local operator",
                "resolution_note": "Resolved from Stage 12 test",
            },
        )

        response = client.get(
            f"/sessions/{session_id}/incident-review-packets/thermal-alert-response-local",
        )

        self.assertEqual(response.status_code, 200)
        packet = response.json()["packet"]
        self.assertEqual(packet["schema"], "telemforge.incident_review_packet.v1")
        self.assertEqual(packet["runbook"]["runbook_id"], "thermal-alert-response-local")
        self.assertEqual(packet["readiness"]["status"], "ready")
        self.assertEqual(packet["readiness"]["completed_step_count"], 5)
        self.assertEqual(packet["alert_lifecycle"]["state"], "resolved")
        self.assertEqual(packet["event_history"]["related_event_count"], 5)
        self.assertEqual(
            packet["operator_actions"][0]["action_kind"], "acknowledge_alert"
        )
        self.assertEqual(packet["operator_actions"][0]["status"], "complete")
        self.assertEqual(
            packet["operator_actions"][0]["timestamp"], "2026-04-30T19:16:00Z"
        )
        self.assertEqual(packet["operator_actions"][0]["actor"], "local operator")
        self.assertTrue(
            packet["operator_actions"][0]["source_event_id"].startswith(
                "event-alert-ack-"
            )
        )
        self.assertEqual(
            packet["operator_actions"][1]["action_kind"], "resolve_alert"
        )
        self.assertEqual(packet["operator_actions"][1]["status"], "complete")
        self.assertEqual(
            packet["operator_actions"][1]["timestamp"], "2026-04-30T19:18:00Z"
        )
        self.assertEqual(packet["operator_actions"][1]["actor"], "local operator")
        self.assertTrue(
            packet["operator_actions"][1]["source_event_id"].startswith(
                "event-alert-resolved-"
            )
        )
        self.assertEqual(packet["replay_evidence"]["related_marker_count"], 7)
        self.assertIn("alert.resolved", packet["replay_evidence"]["marker_types"])
        self.assertEqual(packet["evidence_gaps"], [])

    def test_in_progress_packet_reports_remaining_gaps(self) -> None:
        client = self.make_client()
        session_id, _alert_id = self.create_thermal_alert(client)

        response = client.get(
            f"/sessions/{session_id}/incident-review-packets/thermal-alert-response-local",
        )

        self.assertEqual(response.status_code, 200)
        packet = response.json()["packet"]
        self.assertEqual(packet["readiness"]["status"], "in_progress")
        self.assertEqual(packet["readiness"]["completed_step_count"], 1)
        self.assertEqual(packet["alert_lifecycle"]["state"], "active")
        self.assertEqual(
            [gap["gap_id"] for gap in packet["evidence_gaps"]],
            [
                "alert-not-acknowledged",
                "alert-not-resolved",
                "event-history-incomplete",
                "replay-evidence-incomplete",
            ],
        )

    def test_unknown_session_or_runbook_returns_not_found(self) -> None:
        client = self.make_client()
        session_id, _alert_id = self.create_thermal_alert(client)

        self.assertEqual(
            client.get(
                f"/sessions/{session_id}/incident-review-packets/missing-runbook",
            ).status_code,
            404,
        )
        self.assertEqual(
            client.get(
                "/sessions/tf-session-missing/incident-review-packets/thermal-alert-response-local",
            ).status_code,
            404,
        )


if __name__ == "__main__":
    unittest.main()
