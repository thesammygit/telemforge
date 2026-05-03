"""Deterministic Stage 03 telemetry simulation.

This module is intentionally isolated from FastAPI, storage, websocket
streaming, replay execution, and anomaly scoring.
"""

from __future__ import annotations

import csv
import json
import math
import random
from dataclasses import asdict, dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from statistics import fmean
from xml.sax.saxutils import escape

from backend.app.schemas.telemetry import TelemetryChannel, ValueRange


@dataclass(frozen=True)
class SimulationConfig:
    spacecraft_id: str
    start_at: str
    samples: int
    step_seconds: int
    seed: int

    def __post_init__(self) -> None:
        if self.samples <= 0:
            raise ValueError("samples must be positive")
        if self.step_seconds <= 0:
            raise ValueError("step_seconds must be positive")
        _parse_utc_timestamp(self.start_at)


@dataclass(frozen=True)
class SimulationRow:
    scenario: str
    spacecraft_id: str
    timestamp: str
    sample: int
    elapsed_seconds: int
    channel_id: str
    subsystem: str
    unit: str
    value: float
    status: str
    quality: str
    seed: int


@dataclass(frozen=True)
class SimulationRun:
    scenario: str
    spacecraft_id: str
    config: SimulationConfig
    rows: list[SimulationRow]
    summary: dict[str, object]


def load_channel_catalog(path: Path) -> list[TelemetryChannel]:
    with path.open(encoding="utf-8") as catalog_file:
        document = json.load(catalog_file)
    return [TelemetryChannel.from_dict(item) for item in document["channels"]]


def generate_simulation(
    channels: list[TelemetryChannel],
    config: SimulationConfig,
    scenario: str,
) -> SimulationRun:
    if scenario not in {"nominal-orbit-daylight", "degraded-eclipse-thermal-comms"}:
        raise ValueError(f"Unsupported Stage 03 simulation scenario: {scenario}")

    start_at = _parse_utc_timestamp(config.start_at)
    rows: list[SimulationRow] = []

    for sample in range(config.samples):
        timestamp = _format_utc_timestamp(
            start_at + timedelta(seconds=sample * config.step_seconds)
        )
        for channel in channels:
            value = _simulate_channel_value(channel, sample, config, scenario)
            rows.append(
                SimulationRow(
                    scenario=scenario,
                    spacecraft_id=config.spacecraft_id,
                    timestamp=timestamp,
                    sample=sample,
                    elapsed_seconds=sample * config.step_seconds,
                    channel_id=channel.channel_id,
                    subsystem=channel.subsystem,
                    unit=channel.unit,
                    value=round(value, channel.precision),
                    status=_status_for_value(value, channel),
                    quality=_quality_for_value(value, channel),
                    seed=config.seed,
                )
            )

    summary = _build_summary(scenario, config, rows)
    return SimulationRun(
        scenario=scenario,
        spacecraft_id=config.spacecraft_id,
        config=config,
        rows=rows,
        summary=summary,
    )


def write_simulation_artifacts(
    runs: list[SimulationRun],
    output_dir: Path,
    plot_channels: list[str],
) -> dict[str, Path]:
    output_dir.mkdir(parents=True, exist_ok=True)
    artifacts: dict[str, Path] = {}

    for run in runs:
        prefix = "nominal" if run.scenario.startswith("nominal") else "degraded"
        csv_path = output_dir / f"{run.scenario}.csv"
        summary_path = output_dir / f"{run.scenario}-summary.json"

        _write_csv(run, csv_path)
        _write_json(run.summary, summary_path)
        artifacts[f"{prefix}_csv"] = csv_path
        artifacts[f"{prefix}_summary"] = summary_path

    comparison_path = output_dir / "stage03-comparison.svg"
    comparison_path.write_text(_render_comparison_svg(runs, plot_channels), encoding="utf-8")
    artifacts["comparison_svg"] = comparison_path

    readme_path = output_dir / "README.md"
    readme_path.write_text(_render_artifact_readme(runs, plot_channels), encoding="utf-8")
    artifacts["readme"] = readme_path

    return artifacts


def _simulate_channel_value(
    channel: TelemetryChannel,
    sample: int,
    config: SimulationConfig,
    scenario: str,
) -> float:
    nominal = _wave_value(channel.nominal_range, channel.channel_id, sample, config.seed)
    if scenario == "nominal-orbit-daylight":
        return nominal

    progress = sample / max(config.samples - 1, 1)
    if channel.channel_id == "eps.battery_voltage":
        return _linear(nominal, 25.35, progress)
    if channel.channel_id == "eps.solar_array_current":
        return _linear(nominal, 2.75, progress)
    if channel.channel_id == "thermal.avionics_temp":
        return _linear(nominal, 62.8, progress)
    if channel.channel_id == "thermal.radiator_temp":
        return _linear(nominal, 32.5, progress)
    if channel.channel_id == "adcs.reaction_wheel_x_rpm":
        return _linear(nominal, 3460.0, progress)
    if channel.channel_id == "adcs.bus_quaternion_error_deg":
        return _linear(nominal, 0.33, progress)
    if channel.channel_id == "comms.downlink_snr_db":
        return _linear(nominal, 4.1, progress)
    if channel.channel_id == "comms.packet_error_rate_pct":
        return _linear(nominal, 2.8, progress)
    if channel.channel_id == "payload.imager_temp":
        return _linear(nominal, 29.4, progress)
    return nominal


def _wave_value(
    value_range: ValueRange,
    channel_id: str,
    sample: int,
    seed: int,
) -> float:
    low = value_range.minimum
    high = value_range.maximum
    center = (low + high) / 2
    amplitude = (high - low) * 0.28
    stable_channel_seed = seed + sum(ord(char) for char in channel_id)
    rng = random.Random(stable_channel_seed + sample)
    phase = (stable_channel_seed % 360) * math.pi / 180
    drift = math.sin(sample * 0.45 + phase) * amplitude
    jitter = rng.uniform(-amplitude * 0.08, amplitude * 0.08)
    return min(max(center + drift + jitter, low), high)


def _linear(start: float, end: float, progress: float) -> float:
    eased = progress * progress * (3 - 2 * progress)
    return start + ((end - start) * eased)


def _status_for_value(value: float, channel: TelemetryChannel) -> str:
    if _within(value, channel.nominal_range):
        return "nominal"
    if _within(value, channel.warning_range):
        return "warning"
    if _within(value, channel.critical_range):
        return "critical"
    return "critical"


def _quality_for_value(value: float, channel: TelemetryChannel) -> str:
    if _status_for_value(value, channel) == "critical":
        return "suspect"
    return "valid"


def _within(value: float, value_range: ValueRange) -> bool:
    return value_range.minimum <= value <= value_range.maximum


def _build_summary(
    scenario: str,
    config: SimulationConfig,
    rows: list[SimulationRow],
) -> dict[str, object]:
    by_channel: dict[str, list[SimulationRow]] = {}
    status_counts = {"nominal": 0, "warning": 0, "critical": 0, "offline": 0}
    for row in rows:
        by_channel.setdefault(row.channel_id, []).append(row)
        status_counts[row.status] += 1

    channel_summary = {}
    for channel_id, channel_rows in sorted(by_channel.items()):
        values = [row.value for row in channel_rows]
        channel_summary[channel_id] = {
            "minimum": min(values),
            "maximum": max(values),
            "average": round(fmean(values), 4),
            "first": values[0],
            "last": values[-1],
            "unit": channel_rows[0].unit,
            "status_counts": _status_counts(channel_rows),
        }

    return {
        "schema": "telemforge.telemetry.simulation_summary.v1",
        "scenario": scenario,
        "spacecraft_id": config.spacecraft_id,
        "start_at": config.start_at,
        "samples": config.samples,
        "step_seconds": config.step_seconds,
        "seed": config.seed,
        "row_count": len(rows),
        "status_counts": status_counts,
        "channels": channel_summary,
        "story": _scenario_story(scenario),
    }


def _status_counts(rows: list[SimulationRow]) -> dict[str, int]:
    counts = {"nominal": 0, "warning": 0, "critical": 0, "offline": 0}
    for row in rows:
        counts[row.status] += 1
    return counts


def _scenario_story(scenario: str) -> list[str]:
    if scenario == "degraded-eclipse-thermal-comms":
        return [
            "Spacecraft enters eclipse with reduced solar-array current.",
            "Battery bus voltage trends downward as loads stay active.",
            "Thermal rejection margin worsens and avionics temperature climbs.",
            "Downlink margin falls and packet errors rise during the same window.",
        ]
    return [
        "Daylight pass keeps power generation healthy.",
        "Thermal, attitude, comms, propulsion, and payload channels remain inside nominal ranges.",
    ]


def _write_csv(run: SimulationRun, path: Path) -> None:
    with path.open("w", newline="", encoding="utf-8") as csv_file:
        writer = csv.DictWriter(
            csv_file,
            fieldnames=list(asdict(run.rows[0]).keys()),
            lineterminator="\n",
        )
        writer.writeheader()
        for row in run.rows:
            writer.writerow(asdict(row))


def _write_json(document: dict[str, object], path: Path) -> None:
    path.write_text(json.dumps(document, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _render_comparison_svg(runs: list[SimulationRun], plot_channels: list[str]) -> str:
    width = 960
    panel_height = 190
    height = 85 + (panel_height * len(plot_channels))
    colors = {
        "nominal-orbit-daylight": "#2477b3",
        "degraded-eclipse-thermal-comms": "#c2410c",
    }
    labels = {
        "nominal-orbit-daylight": "Nominal daylight",
        "degraded-eclipse-thermal-comms": "Degraded eclipse",
    }
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
        '<rect width="100%" height="100%" fill="#fbfaf7"/>',
        '<text x="32" y="35" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#1f2933">Stage 03 Telemetry Simulation Comparison</text>',
        '<text x="32" y="58" font-family="Arial, sans-serif" font-size="13" fill="#52616b">Deterministic 12-sample runs generated from Stage 02 channel contracts.</text>',
    ]

    for index, channel_id in enumerate(plot_channels):
        top = 95 + (index * panel_height)
        chart = _chart_bounds(width, top, panel_height)
        series = [_series_for_channel(run, channel_id) for run in runs]
        values = [point[1] for run_series in series for point in run_series]
        minimum = min(values)
        maximum = max(values)
        if minimum == maximum:
            minimum -= 1
            maximum += 1

        parts.extend(
            [
                f'<text x="32" y="{top - 12}" font-family="Arial, sans-serif" font-size="17" font-weight="700" fill="#1f2933">{escape(channel_id)}</text>',
                f'<rect x="{chart["x"]}" y="{chart["y"]}" width="{chart["width"]}" height="{chart["height"]}" fill="#ffffff" stroke="#d8dee4"/>',
                f'<text x="{chart["x"] + chart["width"] + 6}" y="{chart["y"] + 4}" font-family="Arial, sans-serif" font-size="11" fill="#697986">{maximum:.2f}</text>',
                f'<text x="{chart["x"] + chart["width"] + 6}" y="{chart["y"] + chart["height"]}" font-family="Arial, sans-serif" font-size="11" fill="#697986">{minimum:.2f}</text>',
            ]
        )
        for run in runs:
            polyline = _polyline(
                _series_for_channel(run, channel_id),
                chart,
                minimum,
                maximum,
            )
            parts.append(
                f'<polyline points="{polyline}" fill="none" stroke="{colors[run.scenario]}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>'
            )

    legend_y = height - 18
    legend_x = 560
    for run in runs:
        color = colors[run.scenario]
        label = labels[run.scenario]
        parts.extend(
            [
                f'<line x1="{legend_x}" y1="{legend_y}" x2="{legend_x + 28}" y2="{legend_y}" stroke="{color}" stroke-width="4"/>',
                f'<text x="{legend_x + 36}" y="{legend_y + 4}" font-family="Arial, sans-serif" font-size="13" fill="#1f2933">{escape(label)}</text>',
            ]
        )
        legend_x += 185

    parts.append("</svg>")
    return "\n".join(parts) + "\n"


def _chart_bounds(width: int, top: int, panel_height: int) -> dict[str, int]:
    return {"x": 120, "y": top, "width": width - 160, "height": panel_height - 60}


def _series_for_channel(run: SimulationRun, channel_id: str) -> list[tuple[int, float]]:
    return [
        (row.elapsed_seconds, row.value)
        for row in run.rows
        if row.channel_id == channel_id
    ]


def _polyline(
    series: list[tuple[int, float]],
    chart: dict[str, int],
    minimum: float,
    maximum: float,
) -> str:
    max_elapsed = max(point[0] for point in series) or 1
    value_span = maximum - minimum
    points = []
    for elapsed, value in series:
        x = chart["x"] + ((elapsed / max_elapsed) * chart["width"])
        y = chart["y"] + chart["height"] - (((value - minimum) / value_span) * chart["height"])
        points.append(f"{x:.1f},{y:.1f}")
    return " ".join(points)


def _render_artifact_readme(runs: list[SimulationRun], plot_channels: list[str]) -> str:
    lines = [
        "# Stage 03 Simulation Artifacts",
        "",
        "These files are generated by `scripts/generate_stage03_simulation.py` from the Stage 02 telemetry channel catalog.",
        "",
        "## Files",
        "",
    ]
    for run in runs:
        lines.append(f"- `{run.scenario}.csv`: {run.scenario} time-series samples.")
        lines.append(f"- `{run.scenario}-summary.json`: summary statistics and scenario story.")
    lines.extend(
        [
            "- `stage03-comparison.svg`: side-by-side trend plot for key channels.",
            "",
            "## Inspect",
            "",
            "```text",
            "python3 scripts/generate_stage03_simulation.py --samples 12 --step-seconds 10 --seed 4242",
            "python3 -m json.tool docs/development/artifacts/stage03-simulation/degraded-eclipse-thermal-comms-summary.json",
            "open docs/development/artifacts/stage03-simulation/stage03-comparison.svg",
            "```",
            "",
            "## Plotted Channels",
            "",
        ]
    )
    lines.extend(f"- `{channel_id}`" for channel_id in plot_channels)
    lines.append("")
    return "\n".join(lines)


def _parse_utc_timestamp(value: str) -> datetime:
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as exc:
        raise ValueError(f"timestamp must be ISO-8601 UTC text: {value}") from exc
    return parsed.astimezone(timezone.utc)


def _format_utc_timestamp(value: datetime) -> str:
    return value.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
