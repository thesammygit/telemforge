"""Bounded Stage 07 replay windows and explainable anomaly scoring."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from backend.app.schemas.telemetry import TelemetryChannel, ValueRange


SEVERITY_RANK = {"info": 0, "warning": 1, "critical": 2}


def build_replay_window(
    session: dict[str, Any],
    channels: list[TelemetryChannel],
    start_at: str,
    end_at: str,
    source: dict[str, Any],
) -> dict[str, Any]:
    """Assemble a single-session replay payload from stored incident history."""

    _validate_window(start_at, end_at)
    telemetry = sorted(
        source.get("telemetry", []),
        key=lambda row: (
            str(row["timestamp"]),
            int(row.get("sample", 0)),
            str(row["channel_id"]),
            str(row.get("run_id", "")),
        ),
    )
    markers = build_timeline_markers(
        faults=source.get("faults", []),
        alerts=source.get("alerts", []),
        events=source.get("events", []),
    )
    anomalies = score_replay_anomalies(telemetry=telemetry, channels=channels)
    affected_channel_ids = sorted(
        {
            *[
                channel_id
                for fault in source.get("faults", [])
                for channel_id in fault.get("target_channel_ids", [])
            ],
            *[
                alert["channel_id"]
                for alert in source.get("alerts", [])
                if alert.get("channel_id")
            ],
            *[anomaly["channel_id"] for anomaly in anomalies],
        }
    )

    return {
        "schema": "telemforge.replay_window.v1",
        "session_id": session["session_id"],
        "spacecraft_id": session["spacecraft_id"],
        "window": {
            "start_at": start_at,
            "end_at": end_at,
            "sample_limit": int(source.get("sample_limit", len(telemetry))),
        },
        "telemetry": telemetry,
        "markers": markers,
        "anomalies": anomalies,
        "summary": {
            "sample_count": len(telemetry),
            "marker_count": len(markers),
            "anomaly_count": len(anomalies),
            "fault_count": len(source.get("faults", [])),
            "alert_count": len(source.get("alerts", [])),
            "event_count": len(source.get("events", [])),
            "affected_channel_ids": affected_channel_ids,
        },
    }


def build_anomaly_window(replay: dict[str, Any]) -> dict[str, Any]:
    """Project a replay payload to the smaller anomaly-only API response."""

    return {
        "schema": "telemforge.anomaly_window.v1",
        "session_id": replay["session_id"],
        "spacecraft_id": replay["spacecraft_id"],
        "window": replay["window"],
        "anomalies": replay["anomalies"],
        "summary": {
            "anomaly_count": replay["summary"]["anomaly_count"],
            "affected_channel_ids": replay["summary"]["affected_channel_ids"],
        },
    }


def build_timeline_markers(
    faults: list[dict[str, Any]],
    alerts: list[dict[str, Any]],
    events: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    markers: list[dict[str, Any]] = []

    for fault in faults:
        markers.append(
            {
                "marker_id": f"marker-fault-{fault['fault_id']}",
                "kind": "fault",
                "marker_type": f"fault.{fault['status']}",
                "timestamp": fault["requested_at"],
                "label": fault["fault_type"],
                "message": fault.get("description") or fault["fault_type"],
                "severity": "critical" if fault["status"] == "active" else "info",
                "related_fault_id": fault["fault_id"],
                "channel_ids": fault.get("target_channel_ids", []),
            }
        )

    for event in events:
        markers.append(
            {
                "marker_id": f"marker-event-{event['event_id']}",
                "kind": "event",
                "marker_type": event["event_type"],
                "timestamp": event["timestamp"],
                "label": event["event_type"],
                "message": event["message"],
                "severity": event.get("severity") or "info",
                "related_fault_id": event.get("related_fault_id"),
                "channel_id": event.get("channel_id"),
                "alert_id": event.get("alert_id"),
            }
        )

    for alert in alerts:
        markers.append(
            {
                "marker_id": f"marker-alert-{alert['alert_id']}",
                "kind": "alert",
                "marker_type": f"alert.{alert['state']}",
                "timestamp": alert["timestamp"],
                "label": f"{alert['severity']} alert",
                "message": alert["message"],
                "severity": alert["severity"],
                "related_fault_id": alert.get("related_fault_id"),
                "channel_id": alert["channel_id"],
                "alert_id": alert["alert_id"],
            }
        )

    return sorted(
        markers,
        key=lambda marker: (
            marker["timestamp"],
            {"fault": 0, "event": 1, "alert": 2}.get(marker["kind"], 9),
            marker["marker_id"],
        ),
    )


def score_replay_anomalies(
    telemetry: list[dict[str, Any]],
    channels: list[TelemetryChannel],
) -> list[dict[str, Any]]:
    """Score telemetry rows against nominal/warning envelopes with readable reasons."""

    channels_by_id = {channel.channel_id: channel for channel in channels}
    anomalies = []
    for row in telemetry:
        channel = channels_by_id.get(str(row["channel_id"]))
        if channel is None:
            continue

        value = float(row["value"])
        breach = _classify_breach(value, channel)
        if breach is None:
            continue

        anomalies.append(
            {
                "anomaly_id": f"anomaly-{_slug(row['timestamp'])}-{_slug(channel.channel_id)}",
                "timestamp": row["timestamp"],
                "channel_id": channel.channel_id,
                "subsystem": channel.subsystem,
                "severity": breach["severity"],
                "score": breach["score"],
                "observed_value": value,
                "unit": channel.unit,
                "baseline": {
                    "type": "nominal-envelope",
                    "nominal_range": _range_dict(channel.nominal_range),
                    "warning_range": _range_dict(channel.warning_range),
                    "trigger": breach["trigger"],
                },
                "channel": _channel_context(channel),
                "reason": _reason(channel=channel, value=value, breach=breach),
            }
        )

    return sorted(
        anomalies,
        key=lambda anomaly: (
            str(anomaly["timestamp"]),
            -SEVERITY_RANK[anomaly["severity"]],
            str(anomaly["channel_id"]),
        ),
    )


def _classify_breach(
    value: float,
    channel: TelemetryChannel,
) -> dict[str, Any] | None:
    if _within(value, channel.nominal_range):
        return None

    if value < channel.nominal_range.minimum:
        nominal_side = "low"
        nominal_limit = channel.nominal_range.minimum
        warning_limit = channel.warning_range.minimum
        outside_warning = value < warning_limit
        direction = "below"
    else:
        nominal_side = "high"
        nominal_limit = channel.nominal_range.maximum
        warning_limit = channel.warning_range.maximum
        outside_warning = value > warning_limit
        direction = "above"

    if outside_warning:
        return {
            "severity": "critical",
            "score": 1.0,
            "direction": direction,
            "nominal_side": nominal_side,
            "nominal_limit": nominal_limit,
            "warning_limit": warning_limit,
            "trigger": f"warning_{nominal_side}_limit",
        }

    warning_margin = abs(warning_limit - nominal_limit) or 1.0
    deviation = abs(value - nominal_limit)
    score = round(max(0.1, min(0.99, deviation / warning_margin)), 2)
    return {
        "severity": "warning",
        "score": score,
        "direction": direction,
        "nominal_side": nominal_side,
        "nominal_limit": nominal_limit,
        "warning_limit": warning_limit,
        "trigger": f"nominal_{nominal_side}_limit",
    }


def _reason(
    channel: TelemetryChannel,
    value: float,
    breach: dict[str, Any],
) -> str:
    nominal_range = (
        f"{channel.nominal_range.minimum} to {channel.nominal_range.maximum} {channel.unit}"
    )
    if breach["severity"] == "critical":
        threshold = (
            f"warning {breach['nominal_side']} limit "
            f"{breach['warning_limit']} {channel.unit}"
        )
    else:
        threshold = (
            f"nominal {breach['nominal_side']} limit "
            f"{breach['nominal_limit']} {channel.unit}"
        )
    return (
        f"{channel.name} observed {value:g} {channel.unit}, outside nominal range "
        f"{nominal_range} and {breach['direction']} {threshold}."
    )


def _validate_window(start_at: str, end_at: str) -> None:
    if _parse_utc(start_at) >= _parse_utc(end_at):
        raise ValueError("start_at must be before end_at")


def _parse_utc(value: str) -> datetime:
    if not value.endswith("Z"):
        raise ValueError("replay timestamps must be ISO-8601 UTC values ending in Z")
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as exc:
        raise ValueError("replay timestamps must be ISO-8601 UTC values") from exc


def _within(value: float, value_range: ValueRange) -> bool:
    return value_range.minimum <= value <= value_range.maximum


def _range_dict(value_range: ValueRange) -> dict[str, float]:
    return {"min": value_range.minimum, "max": value_range.maximum}


def _channel_context(channel: TelemetryChannel) -> dict[str, Any]:
    return {
        "channel_id": channel.channel_id,
        "name": channel.name,
        "subsystem": channel.subsystem,
        "unit": channel.unit,
        "description": channel.description,
        "nominal_range": _range_dict(channel.nominal_range),
        "warning_range": _range_dict(channel.warning_range),
    }


def _slug(value: object) -> str:
    return str(value).replace(":", "").replace("-", "").replace(".", "-").lower()
