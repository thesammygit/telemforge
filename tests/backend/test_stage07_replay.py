import tempfile
import unittest
from pathlib import Path

from backend.app.domain.incidents import build_manual_fault_incident
from backend.app.domain.replay import build_replay_window, score_replay_anomalies
from backend.app.domain.telemetry_simulation import (
    SimulationConfig,
    generate_simulation,
    load_channel_catalog,
)
from backend.app.storage.sqlite_store import TelemetryStore


ROOT = Path(__file__).resolve().parents[2]
CHANNELS_PATH = ROOT / "fixtures" / "telemetry" / "channels.json"


class Stage07ReplayDomainTest(unittest.TestCase):
    def setUp(self) -> None:
        self.channels = load_channel_catalog(CHANNELS_PATH)

    def test_replay_window_combines_telemetry_fault_alert_and_event_history(self) -> None:
        with self.store_with_thermal_incident() as context:
            source = context.store.load_replay_source(
                session_id=context.session["session_id"],
                start_at="2026-04-30T19:14:50Z",
                end_at="2026-04-30T19:15:10Z",
                limit=100,
            )

            replay = build_replay_window(
                session=context.session,
                channels=self.channels,
                start_at="2026-04-30T19:14:50Z",
                end_at="2026-04-30T19:15:10Z",
                source=source,
            )

        self.assertEqual(replay["schema"], "telemforge.replay_window.v1")
        self.assertEqual(replay["session_id"], context.session["session_id"])
        self.assertEqual(
            replay["window"],
            {
                "start_at": "2026-04-30T19:14:50Z",
                "end_at": "2026-04-30T19:15:10Z",
                "sample_limit": 100,
            },
        )
        self.assertTrue(replay["telemetry"])
        self.assertTrue(
            all(
                "2026-04-30T19:14:50Z" <= row["timestamp"] <= "2026-04-30T19:15:10Z"
                for row in replay["telemetry"]
            )
        )
        self.assertEqual(
            [marker["timestamp"] for marker in replay["markers"]],
            sorted(marker["timestamp"] for marker in replay["markers"]),
        )
        self.assertIn("fault", {marker["kind"] for marker in replay["markers"]})
        self.assertIn("alert", {marker["kind"] for marker in replay["markers"]})
        self.assertIn("event", {marker["kind"] for marker in replay["markers"]})
        self.assertEqual(replay["summary"]["fault_count"], 1)
        self.assertEqual(replay["summary"]["alert_count"], 1)
        self.assertEqual(replay["summary"]["event_count"], 3)

    def test_anomaly_scores_include_operator_facing_reason_and_channel_context(self) -> None:
        with self.store_with_thermal_incident() as context:
            source = context.store.load_replay_source(
                session_id=context.session["session_id"],
                start_at="2026-04-30T19:14:50Z",
                end_at="2026-04-30T19:15:10Z",
                limit=100,
            )

            replay = build_replay_window(
                session=context.session,
                channels=self.channels,
                start_at="2026-04-30T19:14:50Z",
                end_at="2026-04-30T19:15:10Z",
                source=source,
            )

        anomaly = next(
            item
            for item in replay["anomalies"]
            if item["channel_id"] == "thermal.avionics_temp"
        )
        self.assertEqual(anomaly["severity"], "critical")
        self.assertEqual(anomaly["score"], 1.0)
        self.assertEqual(anomaly["channel"]["name"], "Avionics Bay Temperature")
        self.assertIn("61.8 degC", anomaly["reason"])
        self.assertIn("nominal range 18.0 to 42.0 degC", anomaly["reason"])
        self.assertIn("warning high limit 55.0 degC", anomaly["reason"])

    def test_nominal_rows_do_not_emit_anomaly_records(self) -> None:
        run = generate_simulation(
            self.channels,
            SimulationConfig(
                spacecraft_id="tf-sat-01",
                start_at="2026-04-30T19:14:40Z",
                samples=2,
                step_seconds=10,
                seed=7070,
            ),
            "nominal-orbit-daylight",
        )

        anomalies = score_replay_anomalies(
            telemetry=[row.__dict__ for row in run.rows],
            channels=self.channels,
        )

        self.assertEqual(anomalies, [])

    def store_with_thermal_incident(self) -> "_StoreContext":
        tmpdir = tempfile.TemporaryDirectory()
        store = TelemetryStore(Path(tmpdir.name) / "stage07.sqlite")
        store.initialize()
        session = store.create_session(
            spacecraft_id="tf-sat-01",
            name="Stage 07 replay smoke",
        )
        run = generate_simulation(
            self.channels,
            SimulationConfig(
                spacecraft_id="tf-sat-01",
                start_at="2026-04-30T19:14:40Z",
                samples=4,
                step_seconds=10,
                seed=7070,
            ),
            "nominal-orbit-daylight",
        )
        store.record_simulation(session["session_id"], run)
        incident = build_manual_fault_incident(
            channels=self.channels,
            spacecraft_id="tf-sat-01",
            fault_type="thermal_avionics_overheat",
            requested_at="2026-04-30T19:15:00Z",
            operator_note="Replay review case",
        )
        store.record_fault_incident(session["session_id"], incident)
        return _StoreContext(tmpdir=tmpdir, store=store, session=session)


class _StoreContext:
    def __init__(
        self,
        tmpdir: tempfile.TemporaryDirectory[str],
        store: TelemetryStore,
        session: dict[str, str],
    ) -> None:
        self.tmpdir = tmpdir
        self.store = store
        self.session = session

    def __enter__(self) -> "_StoreContext":
        return self

    def __exit__(self, *args: object) -> None:
        self.tmpdir.cleanup()


if __name__ == "__main__":
    unittest.main()
