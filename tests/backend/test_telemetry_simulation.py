import csv
import json
import tempfile
import unittest
from pathlib import Path

from backend.app.domain.telemetry_simulation import (
    SimulationConfig,
    generate_simulation,
    load_channel_catalog,
    write_simulation_artifacts,
)


ROOT = Path(__file__).resolve().parents[2]
CHANNELS_PATH = ROOT / "fixtures" / "telemetry" / "channels.json"


class TelemetrySimulationTest(unittest.TestCase):
    def setUp(self) -> None:
        self.channels = load_channel_catalog(CHANNELS_PATH)
        self.config = SimulationConfig(
            spacecraft_id="tf-sat-01",
            start_at="2026-04-30T16:00:00Z",
            samples=12,
            step_seconds=10,
            seed=4242,
        )

    def test_nominal_simulation_is_deterministic_for_seed_and_timestep(self) -> None:
        first = generate_simulation(self.channels, self.config, "nominal-orbit-daylight")
        second = generate_simulation(self.channels, self.config, "nominal-orbit-daylight")

        self.assertEqual(first.rows, second.rows)
        self.assertEqual(first.summary, second.summary)
        self.assertEqual(
            [row.timestamp for row in first.rows[: len(self.channels)]],
            ["2026-04-30T16:00:00Z"] * len(self.channels),
        )
        self.assertEqual(
            [row.timestamp for row in first.rows[-len(self.channels) :]],
            ["2026-04-30T16:01:50Z"] * len(self.channels),
        )

    def test_nominal_values_stay_inside_nominal_channel_ranges(self) -> None:
        run = generate_simulation(self.channels, self.config, "nominal-orbit-daylight")
        channels = {channel.channel_id: channel for channel in self.channels}

        self.assertEqual(len(run.rows), len(self.channels) * self.config.samples)
        self.assertTrue(all(row.status == "nominal" for row in run.rows))
        for row in run.rows:
            channel = channels[row.channel_id]
            self.assertGreaterEqual(row.value, channel.nominal_range.minimum)
            self.assertLessEqual(row.value, channel.nominal_range.maximum)

    def test_degraded_eclipse_scenario_diverges_from_nominal_story(self) -> None:
        nominal = generate_simulation(self.channels, self.config, "nominal-orbit-daylight")
        degraded = generate_simulation(
            self.channels,
            self.config,
            "degraded-eclipse-thermal-comms",
        )

        self.assertLess(
            degraded.summary["channels"]["eps.battery_voltage"]["minimum"],
            nominal.summary["channels"]["eps.battery_voltage"]["minimum"],
        )
        self.assertLess(
            degraded.summary["channels"]["eps.solar_array_current"]["average"],
            nominal.summary["channels"]["eps.solar_array_current"]["average"],
        )
        self.assertGreater(
            degraded.summary["channels"]["thermal.avionics_temp"]["maximum"],
            nominal.summary["channels"]["thermal.avionics_temp"]["maximum"],
        )
        self.assertLess(
            degraded.summary["channels"]["comms.downlink_snr_db"]["minimum"],
            nominal.summary["channels"]["comms.downlink_snr_db"]["minimum"],
        )
        self.assertGreaterEqual(degraded.summary["status_counts"]["warning"], 1)
        self.assertGreaterEqual(degraded.summary["status_counts"]["critical"], 1)

    def test_artifact_writer_emits_csv_summary_and_svg_plot(self) -> None:
        nominal = generate_simulation(self.channels, self.config, "nominal-orbit-daylight")
        degraded = generate_simulation(
            self.channels,
            self.config,
            "degraded-eclipse-thermal-comms",
        )

        with tempfile.TemporaryDirectory() as tmpdir:
            paths = write_simulation_artifacts(
                [nominal, degraded],
                Path(tmpdir),
                plot_channels=[
                    "eps.battery_voltage",
                    "thermal.avionics_temp",
                    "comms.downlink_snr_db",
                ],
            )

            self.assertEqual(
                set(paths),
                {
                    "nominal_csv",
                    "nominal_summary",
                    "degraded_csv",
                    "degraded_summary",
                    "comparison_svg",
                    "readme",
                },
            )
            for artifact_path in paths.values():
                self.assertTrue(artifact_path.exists(), artifact_path)

            with paths["degraded_summary"].open(encoding="utf-8") as summary_file:
                summary = json.load(summary_file)
            self.assertEqual(summary["scenario"], "degraded-eclipse-thermal-comms")
            self.assertGreaterEqual(summary["status_counts"]["critical"], 1)

            with paths["nominal_csv"].open(newline="", encoding="utf-8") as csv_file:
                rows = list(csv.DictReader(csv_file))
            self.assertEqual(len(rows), len(self.channels) * self.config.samples)
            self.assertIn("eps.battery_voltage", {row["channel_id"] for row in rows})

            svg = paths["comparison_svg"].read_text(encoding="utf-8")
            self.assertIn("<svg", svg)
            self.assertIn("Stage 03 Telemetry Simulation Comparison", svg)


if __name__ == "__main__":
    unittest.main()
