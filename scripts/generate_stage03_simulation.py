#!/usr/bin/env python3
"""Generate small Stage 03 telemetry simulation artifacts."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend.app.domain.telemetry_simulation import (
    SimulationConfig,
    generate_simulation,
    load_channel_catalog,
    write_simulation_artifacts,
)


DEFAULT_CHANNELS = ROOT / "fixtures" / "telemetry" / "channels.json"
DEFAULT_OUTPUT = ROOT / "docs" / "development" / "artifacts" / "stage03-simulation"
PLOT_CHANNELS = [
    "eps.battery_voltage",
    "thermal.avionics_temp",
    "comms.downlink_snr_db",
]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--channels", type=Path, default=DEFAULT_CHANNELS)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--samples", type=int, default=12)
    parser.add_argument("--step-seconds", type=int, default=10)
    parser.add_argument("--seed", type=int, default=4242)
    parser.add_argument("--start-at", default="2026-04-30T16:00:00Z")
    parser.add_argument("--spacecraft-id", default="tf-sat-01")
    args = parser.parse_args()

    channels = load_channel_catalog(args.channels)
    config = SimulationConfig(
        spacecraft_id=args.spacecraft_id,
        start_at=args.start_at,
        samples=args.samples,
        step_seconds=args.step_seconds,
        seed=args.seed,
    )
    runs = [
        generate_simulation(channels, config, "nominal-orbit-daylight"),
        generate_simulation(channels, config, "degraded-eclipse-thermal-comms"),
    ]
    artifacts = write_simulation_artifacts(runs, args.output, PLOT_CHANNELS)

    print(f"Generated {len(artifacts)} Stage 03 artifacts in {args.output}")
    for name, path in sorted(artifacts.items()):
        print(f"{name}: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
