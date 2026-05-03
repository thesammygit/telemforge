"""Deterministic Stage 06 manual fault, alert, and event behavior."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any

from backend.app.schemas.telemetry import TelemetryChannel, ValueRange


@dataclass(frozen=True)
class FaultEffectSpec:
    channel_id: str
    value: float


@dataclass(frozen=True)
class FaultDefinition:
    fault_type: str
    label: str
    subsystem: str
    description: str
    target_channel_ids: tuple[str, ...]
    effects: tuple[FaultEffectSpec, ...]
    recommended_action: str


@dataclass(frozen=True)
class IncidentResult:
    fault: dict[str, Any]
    telemetry: list[dict[str, Any]]
    alerts: list[dict[str, Any]]
    events: list[dict[str, Any]]
    summary: dict[str, Any]


SUPPORTED_FAULTS: dict[str, FaultDefinition] = {
    "thermal_avionics_overheat": FaultDefinition(
        fault_type="thermal_avionics_overheat",
        label="manual avionics overheat fault",
        subsystem="thermal",
        description="Manual heater runaway drill that drives avionics bay temperature above the warning high limit.",
        target_channel_ids=("thermal.avionics_temp",),
        effects=(FaultEffectSpec(channel_id="thermal.avionics_temp", value=61.8),),
        recommended_action="Reduce payload duty cycle and watch thermal recovery before clearing the fault.",
    ),
    "comms_downlink_fade": FaultDefinition(
        fault_type="comms_downlink_fade",
        label="manual downlink fade fault",
        subsystem="comms",
        description="Manual ground-link obstruction drill that reduces downlink SNR and raises packet errors.",
        target_channel_ids=("comms.downlink_snr_db", "comms.packet_error_rate_pct"),
        effects=(
            FaultEffectSpec(channel_id="comms.downlink_snr_db", value=4.2),
            FaultEffectSpec(channel_id="comms.packet_error_rate_pct", value=2.8),
        ),
        recommended_action="Switch to lower-rate telemetry and verify ground-station pointing.",
    ),
}


def build_manual_fault_incident(
    channels: list[TelemetryChannel],
    spacecraft_id: str,
    fault_type: str,
    requested_at: str,
    operator_note: str | None = None,
) -> IncidentResult:
    """Build a deterministic, reviewable incident from a supported manual fault."""

    if fault_type not in SUPPORTED_FAULTS:
        raise ValueError(f"Unsupported Stage 06 fault type: {fault_type}")
    _validate_utc_timestamp(requested_at)

    definition = SUPPORTED_FAULTS[fault_type]
    channels_by_id = {channel.channel_id: channel for channel in channels}
    missing_channels = [
        channel_id
        for channel_id in definition.target_channel_ids
        if channel_id not in channels_by_id
    ]
    if missing_channels:
        raise ValueError(
            "Stage 06 fault references missing telemetry channels: "
            + ", ".join(missing_channels)
        )

    id_suffix = _id_suffix(definition.fault_type, requested_at)
    fault_id = f"fault-{id_suffix}"
    telemetry = [
        _build_telemetry_row(
            channel=channels_by_id[effect.channel_id],
            spacecraft_id=spacecraft_id,
            scenario=f"manual-fault:{definition.fault_type}",
            timestamp=requested_at,
            value=effect.value,
        )
        for effect in definition.effects
    ]
    alerts = [
        _build_alert(row, channels_by_id[row["channel_id"]], definition, fault_id, requested_at)
        for row in telemetry
        if row["status"] != "nominal"
    ]

    fault = {
        "fault_id": fault_id,
        "fault_type": definition.fault_type,
        "subsystem": definition.subsystem,
        "status": "active",
        "requested_at": requested_at,
        "target_channel_ids": list(definition.target_channel_ids),
        "description": definition.description,
        "operator_note": operator_note,
        "expected_effects": [
            f"{row['channel_id']} forced to {row['value']} {row['unit']} ({row['status']})"
            for row in telemetry
        ],
    }
    events = _build_events(
        definition=definition,
        fault=fault,
        telemetry=telemetry,
        alerts=alerts,
        requested_at=requested_at,
    )
    summary = {
        "schema": "telemforge.incident.manual_fault.v1",
        "fault_type": definition.fault_type,
        "spacecraft_id": spacecraft_id,
        "requested_at": requested_at,
        "affected_channels": [row["channel_id"] for row in telemetry],
        "alert_count": len(alerts),
        "event_count": len(events),
        "story": [
            f"Operator injected {definition.label}.",
            "Affected telemetry was written as a deterministic one-sample incident run.",
            "Threshold rules evaluated the affected channels and raised active alerts.",
        ],
    }
    return IncidentResult(
        fault=fault,
        telemetry=telemetry,
        alerts=alerts,
        events=events,
        summary=summary,
    )


def _build_telemetry_row(
    channel: TelemetryChannel,
    spacecraft_id: str,
    scenario: str,
    timestamp: str,
    value: float,
) -> dict[str, Any]:
    rounded_value = round(value, channel.precision)
    status = _status_for_value(rounded_value, channel)
    return {
        "scenario": scenario,
        "spacecraft_id": spacecraft_id,
        "timestamp": timestamp,
        "sample": 0,
        "elapsed_seconds": 0,
        "channel_id": channel.channel_id,
        "subsystem": channel.subsystem,
        "unit": channel.unit,
        "value": rounded_value,
        "status": status,
        "quality": "suspect" if status == "critical" else "valid",
        "seed": 6060,
    }


def _build_alert(
    row: dict[str, Any],
    channel: TelemetryChannel,
    definition: FaultDefinition,
    fault_id: str,
    timestamp: str,
) -> dict[str, Any]:
    threshold = _threshold_for_value(float(row["value"]), channel)
    severity = "critical" if row["status"] == "critical" else "warning"
    threshold_text = (
        f"{threshold['direction']} {threshold['range']} {threshold['side']} "
        f"{threshold['value']} {channel.unit}"
    )
    return {
        "alert_id": f"alert-{_id_suffix(definition.fault_type, timestamp)}-{_slug(channel.channel_id)}",
        "timestamp": timestamp,
        "channel_id": channel.channel_id,
        "subsystem": channel.subsystem,
        "severity": severity,
        "state": "active",
        "message": (
            f"{channel.name} is {row['value']} {channel.unit}, {threshold_text} "
            f"after {definition.label}."
        ),
        "observed_value": row["value"],
        "threshold": threshold,
        "recommended_action": definition.recommended_action,
        "related_fault_id": fault_id,
        "fault_type": definition.fault_type,
    }


def _build_events(
    definition: FaultDefinition,
    fault: dict[str, Any],
    telemetry: list[dict[str, Any]],
    alerts: list[dict[str, Any]],
    requested_at: str,
) -> list[dict[str, Any]]:
    id_suffix = _id_suffix(definition.fault_type, requested_at)
    events = [
        {
            "event_id": f"event-{id_suffix}-00-fault-injected",
            "event_type": "fault.injected",
            "timestamp": requested_at,
            "message": f"Fault injected: {definition.label}.",
            "related_fault_id": fault["fault_id"],
            "fault_type": definition.fault_type,
            "subsystem": definition.subsystem,
            "target_channel_ids": list(definition.target_channel_ids),
        },
        {
            "event_id": f"event-{id_suffix}-01-telemetry-affected",
            "event_type": "telemetry.affected",
            "timestamp": requested_at,
            "message": (
                "Telemetry affected: "
                + ", ".join(row["channel_id"] for row in telemetry)
                + "."
            ),
            "related_fault_id": fault["fault_id"],
            "fault_type": definition.fault_type,
            "target_channel_ids": [row["channel_id"] for row in telemetry],
            "channel_id": telemetry[0]["channel_id"] if len(telemetry) == 1 else None,
        },
    ]
    for index, alert in enumerate(alerts, start=2):
        events.append(
            {
                "event_id": f"event-{id_suffix}-{index:02d}-alert-raised-{_slug(alert['channel_id'])}",
                "event_type": "alert.raised",
                "timestamp": requested_at,
                "message": f"Alert raised for {alert['channel_id']}: {alert['severity']}.",
                "related_fault_id": fault["fault_id"],
                "alert_id": alert["alert_id"],
                "channel_id": alert["channel_id"],
                "severity": alert["severity"],
                "fault_type": definition.fault_type,
            }
        )
    return events


def _threshold_for_value(value: float, channel: TelemetryChannel) -> dict[str, Any]:
    if value < channel.warning_range.minimum:
        return {
            "operator": "<",
            "value": channel.warning_range.minimum,
            "unit": channel.unit,
            "range": "warning",
            "side": "low limit",
            "direction": "below",
        }
    if value > channel.warning_range.maximum:
        return {
            "operator": ">",
            "value": channel.warning_range.maximum,
            "unit": channel.unit,
            "range": "warning",
            "side": "high limit",
            "direction": "above",
        }
    if value < channel.nominal_range.minimum:
        return {
            "operator": "<",
            "value": channel.nominal_range.minimum,
            "unit": channel.unit,
            "range": "nominal",
            "side": "low limit",
            "direction": "below",
        }
    return {
        "operator": ">",
        "value": channel.nominal_range.maximum,
        "unit": channel.unit,
        "range": "nominal",
        "side": "high limit",
        "direction": "above",
    }


def _status_for_value(value: float, channel: TelemetryChannel) -> str:
    if _within(value, channel.nominal_range):
        return "nominal"
    if _within(value, channel.warning_range):
        return "warning"
    return "critical"


def _within(value: float, value_range: ValueRange) -> bool:
    return value_range.minimum <= value <= value_range.maximum


def _validate_utc_timestamp(value: str) -> None:
    if not value.endswith("Z"):
        raise ValueError("requested_at must be an ISO-8601 UTC timestamp ending in Z")
    try:
        datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as exc:
        raise ValueError("requested_at must be an ISO-8601 UTC timestamp") from exc


def _id_suffix(fault_type: str, timestamp: str) -> str:
    return f"{_slug(fault_type)}-{timestamp.replace('-', '').replace(':', '')}"


def _slug(value: str) -> str:
    return value.replace(".", "-").replace("_", "-").lower()
