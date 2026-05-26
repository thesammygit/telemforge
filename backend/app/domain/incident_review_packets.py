"""Local incident review packets for completed guided runbook playback."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any


PACKET_SCHEMA = "telemforge.incident_review_packet.v1"
REQUIRED_EVENT_TYPES = [
    "alert.raised",
    "alert.acknowledged",
    "alert.resolved",
]
REQUIRED_REPLAY_MARKER_TYPES = [
    "alert.raised",
    "alert.acknowledged",
    "alert.resolved",
]


def build_incident_review_packet(
    session: dict[str, Any],
    runbook: dict[str, Any],
    alerts: list[dict[str, Any]],
    events: list[dict[str, Any]],
    replay: dict[str, Any],
) -> dict[str, Any]:
    """Build a deterministic local packet from existing runbook evidence."""

    target_alert = _find_target_alert(alerts, runbook)
    related_events = _related_events(events, runbook, target_alert)
    related_markers = _related_markers(replay.get("markers", []), runbook, target_alert)
    completed_step_ids = _completed_step_ids(
        runbook=runbook,
        target_alert=target_alert,
        related_events=related_events,
        related_markers=related_markers,
    )
    evidence_gaps = _evidence_gaps(
        target_alert=target_alert,
        related_events=related_events,
        related_markers=related_markers,
    )

    return {
        "schema": PACKET_SCHEMA,
        "packet_id": f"incident-review:{session['session_id']}:{runbook['runbook_id']}",
        "session": {
            "session_id": session["session_id"],
            "spacecraft_id": session["spacecraft_id"],
            "name": session["name"],
        },
        "runbook": {
            "runbook_id": runbook["runbook_id"],
            "title": runbook["title"],
            "scenario": runbook["scenario"],
            "mode": runbook["mode"],
            "target_alert_id": runbook["target_alert_id"],
            "target_channel_id": runbook["target_channel_id"],
            "target_fault_id": runbook["target_fault_id"],
            "step_count": len(runbook["steps"]),
        },
        "readiness": {
            "status": _readiness_status(target_alert, evidence_gaps),
            "completed_step_count": len(completed_step_ids),
            "total_step_count": len(runbook["steps"]),
            "unresolved_gap_count": len(evidence_gaps),
        },
        "alert_lifecycle": _alert_lifecycle(target_alert, runbook),
        "operator_actions": _operator_actions(related_events),
        "event_history": {
            "related_event_count": len(related_events),
            "event_types": _unique_sorted(
                [str(event["event_type"]) for event in related_events]
            ),
            "latest_event_at": related_events[-1]["timestamp"] if related_events else None,
            "events": [
                {
                    "event_id": event["event_id"],
                    "event_type": event["event_type"],
                    "timestamp": event["timestamp"],
                    "message": event["message"],
                }
                for event in related_events
            ],
        },
        "replay_evidence": {
            "window": replay.get("window"),
            "sample_count": replay.get("summary", {}).get("sample_count", 0),
            "anomaly_count": replay.get("summary", {}).get("anomaly_count", 0),
            "related_marker_count": len(related_markers),
            "marker_types": _unique_sorted(
                [str(marker["marker_type"]) for marker in related_markers]
            ),
            "affected_channel_ids": replay.get("summary", {}).get(
                "affected_channel_ids", []
            ),
        },
        "evidence_gaps": evidence_gaps,
        "source_refs": [
            {
                "label": "Runbook definition",
                "path": "backend/app/domain/scenario_runbooks.py",
            },
            {
                "label": "Alert lifecycle API",
                "path": "backend/app/main.py",
            },
            {
                "label": "Replay window builder",
                "path": "backend/app/domain/replay.py",
            },
        ],
        "deferred_features": list(runbook.get("deferred_features", [])),
    }


def incident_review_window(
    runbook: dict[str, Any],
    alerts: list[dict[str, Any]],
    events: list[dict[str, Any]],
    start_at: str | None = None,
    end_at: str | None = None,
) -> dict[str, str]:
    """Return a replay window that covers the runbook-related local evidence."""

    if start_at and end_at:
        return {"start_at": start_at, "end_at": end_at}

    target_alert = _find_target_alert(alerts, runbook)
    related_timestamps = [
        str(event["timestamp"])
        for event in _related_events(events, runbook, target_alert)
        if event.get("timestamp")
    ]
    if target_alert and target_alert.get("timestamp"):
        related_timestamps.append(str(target_alert["timestamp"]))

    if not related_timestamps:
        fallback = "1970-01-01T00:00:00Z"
        return {"start_at": fallback, "end_at": _plus_one_second(fallback)}

    window_start = start_at or min(related_timestamps)
    window_end = end_at or max(related_timestamps)
    if window_start >= window_end:
        window_end = _plus_one_second(window_start)
    return {"start_at": window_start, "end_at": window_end}


def _find_target_alert(
    alerts: list[dict[str, Any]],
    runbook: dict[str, Any],
) -> dict[str, Any] | None:
    return next(
        (
            alert
            for alert in alerts
            if alert.get("alert_id") == runbook["target_alert_id"]
        ),
        None,
    ) or next(
        (
            alert
            for alert in alerts
            if alert.get("channel_id") == runbook["target_channel_id"]
        ),
        None,
    )


def _related_events(
    events: list[dict[str, Any]],
    runbook: dict[str, Any],
    target_alert: dict[str, Any] | None,
) -> list[dict[str, Any]]:
    target_alert_id = target_alert.get("alert_id") if target_alert else None
    related = [
        event
        for event in events
        if event.get("alert_id") == target_alert_id
        or event.get("channel_id") == runbook["target_channel_id"]
        or event.get("related_fault_id") == runbook["target_fault_id"]
        or runbook["target_channel_id"]
        in event.get("metadata", {}).get("target_channel_ids", [])
    ]
    return sorted(related, key=lambda event: (event["timestamp"], event["event_id"]))


def _related_markers(
    markers: list[dict[str, Any]],
    runbook: dict[str, Any],
    target_alert: dict[str, Any] | None,
) -> list[dict[str, Any]]:
    target_alert_id = target_alert.get("alert_id") if target_alert else None
    related = [
        marker
        for marker in markers
        if marker.get("alert_id") == target_alert_id
        or marker.get("channel_id") == runbook["target_channel_id"]
        or marker.get("related_fault_id") == runbook["target_fault_id"]
        or runbook["target_channel_id"] in marker.get("channel_ids", [])
    ]
    return sorted(
        related,
        key=lambda marker: (marker["timestamp"], marker["kind"], marker["marker_id"]),
    )


def _completed_step_ids(
    runbook: dict[str, Any],
    target_alert: dict[str, Any] | None,
    related_events: list[dict[str, Any]],
    related_markers: list[dict[str, Any]],
) -> list[str]:
    completed: set[str] = set()
    event_types = {event["event_type"] for event in related_events}
    marker_types = {marker["marker_type"] for marker in related_markers}

    if target_alert is not None:
        completed.add("triage-alert")
    if (
        target_alert
        and target_alert["state"] != "active"
        and "alert.acknowledged" in event_types
    ):
        completed.add("acknowledge-alert")
    if (
        target_alert
        and target_alert["state"] == "resolved"
        and "alert.resolved" in event_types
    ):
        completed.add("resolve-alert")
    if all(event_type in event_types for event_type in REQUIRED_EVENT_TYPES):
        completed.add("review-event-history")
    if all(marker_type in marker_types for marker_type in REQUIRED_REPLAY_MARKER_TYPES):
        completed.add("inspect-replay-evidence")

    return [
        step["step_id"]
        for step in runbook["steps"]
        if step["step_id"] in completed
    ]


def _evidence_gaps(
    target_alert: dict[str, Any] | None,
    related_events: list[dict[str, Any]],
    related_markers: list[dict[str, Any]],
) -> list[dict[str, str]]:
    if target_alert is None:
        return [
            {
                "gap_id": "target-alert-missing",
                "summary": "The runbook target alert is not present in the local evidence.",
            }
        ]

    event_types = {event["event_type"] for event in related_events}
    marker_types = {marker["marker_type"] for marker in related_markers}
    gaps: list[dict[str, str]] = []

    if target_alert["state"] == "active":
        gaps.append(
            {
                "gap_id": "alert-not-acknowledged",
                "summary": "The target alert has not been acknowledged.",
            }
        )
    if target_alert["state"] != "resolved":
        gaps.append(
            {
                "gap_id": "alert-not-resolved",
                "summary": "The target alert has not been resolved.",
            }
        )
    if any(event_type not in event_types for event_type in REQUIRED_EVENT_TYPES):
        gaps.append(
            {
                "gap_id": "event-history-incomplete",
                "summary": "Raised, acknowledged, and resolved events are not all present.",
            }
        )
    if any(
        marker_type not in marker_types
        for marker_type in REQUIRED_REPLAY_MARKER_TYPES
    ):
        gaps.append(
            {
                "gap_id": "replay-evidence-incomplete",
                "summary": "Replay markers do not yet cover the full alert lifecycle.",
            }
        )
    return gaps


def _readiness_status(
    target_alert: dict[str, Any] | None,
    evidence_gaps: list[dict[str, str]],
) -> str:
    if target_alert is None:
        return "blocked"
    return "ready" if not evidence_gaps else "in_progress"


def _alert_lifecycle(
    target_alert: dict[str, Any] | None,
    runbook: dict[str, Any],
) -> dict[str, Any]:
    if target_alert is None:
        return {
            "target_alert_id": runbook["target_alert_id"],
            "channel_id": runbook["target_channel_id"],
            "state": "missing",
            "severity": None,
            "acknowledged_at": None,
            "acknowledged_by": None,
            "resolved_at": None,
            "resolved_by": None,
        }
    return {
        "target_alert_id": target_alert["alert_id"],
        "channel_id": target_alert["channel_id"],
        "state": target_alert["state"],
        "severity": target_alert["severity"],
        "acknowledged_at": target_alert.get("acknowledged_at"),
        "acknowledged_by": target_alert.get("acknowledged_by"),
        "resolved_at": target_alert.get("resolved_at"),
        "resolved_by": target_alert.get("resolved_by"),
    }


def _operator_actions(related_events: list[dict[str, Any]]) -> list[dict[str, Any]]:
    events_by_type = {event["event_type"]: event for event in related_events}
    return [
        _operator_action(
            action_kind="acknowledge_alert",
            event=events_by_type.get("alert.acknowledged"),
        ),
        _operator_action(
            action_kind="resolve_alert",
            event=events_by_type.get("alert.resolved"),
        ),
    ]


def _operator_action(
    action_kind: str,
    event: dict[str, Any] | None,
) -> dict[str, Any]:
    if event is None:
        return {
            "action_kind": action_kind,
            "status": "pending",
            "timestamp": None,
            "actor": None,
            "source_event_id": None,
        }
    actor_key = (
        "acknowledged_by" if action_kind == "acknowledge_alert" else "resolved_by"
    )
    return {
        "action_kind": action_kind,
        "status": "complete",
        "timestamp": event["timestamp"],
        "actor": event.get(actor_key),
        "source_event_id": event["event_id"],
    }


def _unique_sorted(values: list[str]) -> list[str]:
    return sorted(set(values))


def _plus_one_second(value: str) -> str:
    parsed = datetime.strptime(value, "%Y-%m-%dT%H:%M:%SZ").replace(
        tzinfo=timezone.utc
    )
    return (parsed + timedelta(seconds=1)).strftime("%Y-%m-%dT%H:%M:%SZ")
