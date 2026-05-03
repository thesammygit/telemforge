import tempfile
import unittest
from pathlib import Path

from backend.app.domain.telemetry_simulation import (
    SimulationConfig,
    generate_simulation,
    load_channel_catalog,
)
from backend.app.storage.sqlite_store import TelemetryStore


ROOT = Path(__file__).resolve().parents[2]
CHANNELS_PATH = ROOT / "fixtures" / "telemetry" / "channels.json"


class Stage04StorageTest(unittest.TestCase):
    def setUp(self) -> None:
        self.channels = load_channel_catalog(CHANNELS_PATH)
        self.config = SimulationConfig(
            spacecraft_id="tf-sat-01",
            start_at="2026-04-30T17:00:00Z",
            samples=4,
            step_seconds=10,
            seed=4404,
        )

    def test_schema_contains_session_history_and_foundation_tables(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = TelemetryStore(Path(tmpdir) / "stage04.sqlite")
            store.initialize()

            self.assertEqual(
                store.table_names(),
                {
                    "alerts",
                    "events",
                    "faults",
                    "sessions",
                    "simulation_runs",
                    "telemetry_samples",
                },
            )

    def test_simulation_rows_round_trip_through_sqlite(self) -> None:
        run = generate_simulation(
            self.channels,
            self.config,
            "nominal-orbit-daylight",
        )

        with tempfile.TemporaryDirectory() as tmpdir:
            store = TelemetryStore(Path(tmpdir) / "stage04.sqlite")
            store.initialize()
            session = store.create_session(
                spacecraft_id="tf-sat-01",
                name="Nominal daylight smoke",
            )
            stored_run = store.record_simulation(session["session_id"], run)

            rows = store.list_telemetry(
                session_id=session["session_id"],
                channel_id="eps.battery_voltage",
            )

            self.assertEqual(stored_run["row_count"], len(self.channels) * self.config.samples)
            self.assertEqual(stored_run["summary"]["row_count"], len(run.rows))
            self.assertEqual(len(rows), self.config.samples)
            self.assertEqual(rows[0]["timestamp"], "2026-04-30T17:00:00Z")
            self.assertEqual(rows[-1]["timestamp"], "2026-04-30T17:00:30Z")
            self.assertEqual([row["sample"] for row in rows], [0, 1, 2, 3])
            self.assertTrue(all(row["status"] == "nominal" for row in rows))

    def test_stored_degraded_simulation_is_deterministic(self) -> None:
        first = generate_simulation(
            self.channels,
            self.config,
            "degraded-eclipse-thermal-comms",
        )
        second = generate_simulation(
            self.channels,
            self.config,
            "degraded-eclipse-thermal-comms",
        )

        with tempfile.TemporaryDirectory() as tmpdir:
            store = TelemetryStore(Path(tmpdir) / "stage04.sqlite")
            store.initialize()
            session = store.create_session(
                spacecraft_id="tf-sat-01",
                name="Degraded eclipse smoke",
            )

            store.record_simulation(session["session_id"], first)
            first_rows = store.list_telemetry(session["session_id"], limit=500)

        with tempfile.TemporaryDirectory() as tmpdir:
            store = TelemetryStore(Path(tmpdir) / "stage04.sqlite")
            store.initialize()
            session = store.create_session(
                spacecraft_id="tf-sat-01",
                name="Degraded eclipse smoke",
            )

            store.record_simulation(session["session_id"], second)
            second_rows = store.list_telemetry(session["session_id"], limit=500)

        comparable_first = [
            (row["timestamp"], row["sample"], row["channel_id"], row["value"], row["status"])
            for row in first_rows
        ]
        comparable_second = [
            (row["timestamp"], row["sample"], row["channel_id"], row["value"], row["status"])
            for row in second_rows
        ]
        self.assertEqual(comparable_first, comparable_second)
        self.assertTrue(any(row["status"] == "critical" for row in first_rows))


if __name__ == "__main__":
    unittest.main()
