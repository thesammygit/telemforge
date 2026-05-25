"""Local scenario runbook catalog for guided mission-console playback."""

from __future__ import annotations

from copy import deepcopy
from typing import Any


_THERMAL_ALERT_RESPONSE_RUNBOOK: dict[str, Any] = {
    "runbook_id": "thermal-alert-response-local",
    "title": "Thermal Alert Response",
    "scenario": "thermal-alert-response",
    "mode": "fixture-first",
    "supported_modes": ["fixture", "local-live"],
    "target_alert_id": "alert-stage06-thermal-avionics",
    "target_channel_id": "thermal.avionics_temp",
    "target_fault_id": "fault-stage06-thermal-avionics",
    "summary": (
        "Guides a reviewer through the local avionics overheat alert lifecycle "
        "from triage to replay evidence."
    ),
    "steps": [
        {
            "step_id": "triage-alert",
            "title": "Triage thermal alert",
            "action_kind": "inspect_alert",
            "evidence_target": "alert-lifecycle",
            "summary": "Confirm the active thermal alert and recommended action.",
        },
        {
            "step_id": "acknowledge-alert",
            "title": "Acknowledge alert",
            "action_kind": "acknowledge_alert",
            "evidence_target": "alert-lifecycle",
            "summary": "Move the local alert from active to acknowledged.",
        },
        {
            "step_id": "resolve-alert",
            "title": "Resolve alert",
            "action_kind": "resolve_alert",
            "evidence_target": "alert-lifecycle",
            "summary": "Complete the local alert resolution lifecycle.",
        },
        {
            "step_id": "review-event-history",
            "title": "Review event history",
            "action_kind": "inspect_timeline",
            "evidence_target": "fault-incident-timeline",
            "summary": "Confirm raised, acknowledged, and resolved events.",
        },
        {
            "step_id": "inspect-replay-evidence",
            "title": "Inspect replay evidence",
            "action_kind": "inspect_replay",
            "evidence_target": "replay-anomaly-inspection",
            "summary": "Confirm replay markers capture the completed lifecycle.",
        },
    ],
    "deferred_features": [
        "production authentication and multi-operator identity",
        "cloud-backed runbook persistence",
        "free-form runbook authoring",
        "incident report export",
    ],
}


def list_scenario_runbooks() -> list[dict[str, Any]]:
    """Return public-safe summaries for local scenario runbooks."""

    runbook = _THERMAL_ALERT_RESPONSE_RUNBOOK
    return [
        {
            "runbook_id": runbook["runbook_id"],
            "title": runbook["title"],
            "scenario": runbook["scenario"],
            "mode": runbook["mode"],
            "supported_modes": list(runbook["supported_modes"]),
            "target_alert_id": runbook["target_alert_id"],
            "target_channel_id": runbook["target_channel_id"],
            "step_count": len(runbook["steps"]),
            "summary": runbook["summary"],
        }
    ]


def get_scenario_runbook(runbook_id: str) -> dict[str, Any] | None:
    """Return a deterministic local runbook definition by id."""

    if runbook_id != _THERMAL_ALERT_RESPONSE_RUNBOOK["runbook_id"]:
        return None
    return deepcopy(_THERMAL_ALERT_RESPONSE_RUNBOOK)
