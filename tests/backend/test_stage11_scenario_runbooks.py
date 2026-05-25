import unittest

from fastapi.testclient import TestClient

from backend.app.main import create_app


class Stage11ScenarioRunbooksTest(unittest.TestCase):
    def test_local_runbook_catalog_exposes_thermal_alert_response(self) -> None:
        client = TestClient(create_app())

        response = client.get("/runbooks")

        self.assertEqual(response.status_code, 200)
        runbooks = response.json()["runbooks"]
        self.assertEqual(len(runbooks), 1)
        self.assertEqual(runbooks[0]["runbook_id"], "thermal-alert-response-local")
        self.assertEqual(runbooks[0]["mode"], "fixture-first")
        self.assertEqual(runbooks[0]["step_count"], 5)
        self.assertIn("local-live", runbooks[0]["supported_modes"])

    def test_local_runbook_detail_guides_full_operator_lifecycle(self) -> None:
        client = TestClient(create_app())

        response = client.get("/runbooks/thermal-alert-response-local")

        self.assertEqual(response.status_code, 200)
        runbook = response.json()["runbook"]
        self.assertEqual(runbook["scenario"], "thermal-alert-response")
        self.assertEqual(
            [step["step_id"] for step in runbook["steps"]],
            [
                "triage-alert",
                "acknowledge-alert",
                "resolve-alert",
                "review-event-history",
                "inspect-replay-evidence",
            ],
        )
        self.assertEqual(runbook["steps"][1]["action_kind"], "acknowledge_alert")
        self.assertEqual(runbook["steps"][2]["action_kind"], "resolve_alert")
        self.assertEqual(
            runbook["deferred_features"],
            [
                "production authentication and multi-operator identity",
                "cloud-backed runbook persistence",
                "free-form runbook authoring",
                "incident report export",
            ],
        )

    def test_unknown_runbook_returns_not_found(self) -> None:
        client = TestClient(create_app())

        response = client.get("/runbooks/missing-runbook")

        self.assertEqual(response.status_code, 404)


if __name__ == "__main__":
    unittest.main()
