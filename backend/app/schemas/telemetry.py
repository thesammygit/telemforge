"""Typed Stage 02 telemetry contracts for fixture validation.

These models intentionally avoid FastAPI, persistence, and simulation behavior.
They only describe the fixture shapes that later stages will consume.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


class ContractError(ValueError):
    """Raised when fixture data does not match the Stage 02 contract."""


def _require(data: dict[str, Any], key: str) -> Any:
    if key not in data:
        raise ContractError(f"Missing required field: {key}")
    return data[key]


def _require_text(data: dict[str, Any], key: str) -> str:
    value = _require(data, key)
    if not isinstance(value, str) or not value:
        raise ContractError(f"{key} must be a non-empty string")
    return value


def _require_number(data: dict[str, Any], key: str) -> float:
    value = _require(data, key)
    if not isinstance(value, (int, float)):
        raise ContractError(f"{key} must be numeric")
    return float(value)


def _optional_list(data: dict[str, Any], key: str) -> list[Any]:
    value = data.get(key, [])
    if not isinstance(value, list):
        raise ContractError(f"{key} must be a list")
    return value


@dataclass(frozen=True)
class ValueRange:
    minimum: float
    maximum: float

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "ValueRange":
        minimum = _require_number(data, "min")
        maximum = _require_number(data, "max")
        if minimum >= maximum:
            raise ContractError("range min must be less than max")
        return cls(minimum=minimum, maximum=maximum)


@dataclass(frozen=True)
class TelemetryChannel:
    channel_id: str
    name: str
    subsystem: str
    unit: str
    cadence_ms: int
    nominal_range: ValueRange
    warning_range: ValueRange
    critical_range: ValueRange
    description: str
    value_type: str = "float"
    precision: int = 2

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "TelemetryChannel":
        cadence_ms = _require(data, "cadence_ms")
        if not isinstance(cadence_ms, int) or cadence_ms <= 0:
            raise ContractError("cadence_ms must be a positive integer")

        precision = data.get("precision", 2)
        if not isinstance(precision, int) or precision < 0:
            raise ContractError("precision must be a non-negative integer")

        return cls(
            channel_id=_require_text(data, "channel_id"),
            name=_require_text(data, "name"),
            subsystem=_require_text(data, "subsystem"),
            unit=_require_text(data, "unit"),
            cadence_ms=cadence_ms,
            nominal_range=ValueRange.from_dict(_require(data, "nominal_range")),
            warning_range=ValueRange.from_dict(_require(data, "warning_range")),
            critical_range=ValueRange.from_dict(_require(data, "critical_range")),
            description=_require_text(data, "description"),
            value_type=data.get("value_type", "float"),
            precision=precision,
        )


@dataclass(frozen=True)
class TelemetryPoint:
    channel_id: str
    timestamp: str
    value: float
    unit: str
    status: str
    quality: str
    sequence: int | None = None

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "TelemetryPoint":
        status = _require_text(data, "status")
        if status not in {"nominal", "warning", "critical", "offline"}:
            raise ContractError(f"Unsupported telemetry point status: {status}")

        quality = data.get("quality", "valid")
        if quality not in {"valid", "suspect", "missing"}:
            raise ContractError(f"Unsupported telemetry point quality: {quality}")

        sequence = data.get("sequence")
        if sequence is not None and (not isinstance(sequence, int) or sequence < 0):
            raise ContractError("sequence must be a non-negative integer when provided")

        return cls(
            channel_id=_require_text(data, "channel_id"),
            timestamp=_require_text(data, "timestamp"),
            value=_require_number(data, "value"),
            unit=_require_text(data, "unit"),
            status=status,
            quality=quality,
            sequence=sequence,
        )


@dataclass(frozen=True)
class AlertRecord:
    alert_id: str
    timestamp: str
    channel_id: str
    severity: str
    state: str
    message: str
    observed_value: float
    threshold: dict[str, Any]
    recommended_action: str
    related_fault_id: str | None = None

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "AlertRecord":
        severity = _require_text(data, "severity")
        if severity not in {"info", "warning", "critical"}:
            raise ContractError(f"Unsupported alert severity: {severity}")

        state = _require_text(data, "state")
        if state not in {"active", "acknowledged", "resolved"}:
            raise ContractError(f"Unsupported alert state: {state}")

        threshold = _require(data, "threshold")
        if not isinstance(threshold, dict) or "operator" not in threshold or "value" not in threshold:
            raise ContractError("threshold must include operator and value")

        return cls(
            alert_id=_require_text(data, "alert_id"),
            timestamp=_require_text(data, "timestamp"),
            channel_id=_require_text(data, "channel_id"),
            severity=severity,
            state=state,
            message=_require_text(data, "message"),
            observed_value=_require_number(data, "observed_value"),
            threshold=threshold,
            recommended_action=_require_text(data, "recommended_action"),
            related_fault_id=data.get("related_fault_id"),
        )


@dataclass(frozen=True)
class FaultInjectionRequest:
    request_id: str
    name: str
    subsystem: str
    mode: str
    target_channel_ids: list[str]
    start_at: str
    duration_seconds: int
    parameters: dict[str, Any]
    expected_effects: list[str] = field(default_factory=list)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "FaultInjectionRequest":
        target_channel_ids = _require(data, "target_channel_ids")
        if not isinstance(target_channel_ids, list) or not target_channel_ids:
            raise ContractError("target_channel_ids must be a non-empty list")
        if any(not isinstance(channel_id, str) or not channel_id for channel_id in target_channel_ids):
            raise ContractError("target_channel_ids must contain non-empty strings")

        duration_seconds = _require(data, "duration_seconds")
        if not isinstance(duration_seconds, int) or duration_seconds <= 0:
            raise ContractError("duration_seconds must be a positive integer")

        parameters = data.get("parameters", {})
        if not isinstance(parameters, dict):
            raise ContractError("parameters must be an object")

        return cls(
            request_id=_require_text(data, "request_id"),
            name=_require_text(data, "name"),
            subsystem=_require_text(data, "subsystem"),
            mode=_require_text(data, "mode"),
            target_channel_ids=target_channel_ids,
            start_at=_require_text(data, "start_at"),
            duration_seconds=duration_seconds,
            parameters=parameters,
            expected_effects=[str(effect) for effect in _optional_list(data, "expected_effects")],
        )


@dataclass(frozen=True)
class EventLogEntry:
    event_id: str
    timestamp: str
    event_type: str
    message: str
    related_fault_id: str | None = None
    channel_id: str | None = None
    severity: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "EventLogEntry":
        event_type = _require_text(data, "event_type")
        if event_type not in {"fault.injected", "telemetry.affected", "alert.raised", "alert.cleared"}:
            raise ContractError(f"Unsupported event type: {event_type}")

        severity = data.get("severity")
        if severity is not None and severity not in {"info", "warning", "critical"}:
            raise ContractError(f"Unsupported event severity: {severity}")

        metadata = data.get("metadata", {})
        if not isinstance(metadata, dict):
            raise ContractError("metadata must be an object")

        return cls(
            event_id=_require_text(data, "event_id"),
            timestamp=_require_text(data, "timestamp"),
            event_type=event_type,
            message=_require_text(data, "message"),
            related_fault_id=data.get("related_fault_id"),
            channel_id=data.get("channel_id"),
            severity=severity,
            metadata=metadata,
        )


@dataclass(frozen=True)
class TelemetrySnapshot:
    snapshot_id: str
    scenario: str
    spacecraft_id: str
    captured_at: str
    points: list[TelemetryPoint]
    alerts: list[AlertRecord]
    notes: list[str] = field(default_factory=list)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "TelemetrySnapshot":
        points = [TelemetryPoint.from_dict(item) for item in _require(data, "points")]
        alerts = [AlertRecord.from_dict(item) for item in _optional_list(data, "alerts")]
        if not points:
            raise ContractError("snapshot points must not be empty")

        return cls(
            snapshot_id=_require_text(data, "snapshot_id"),
            scenario=_require_text(data, "scenario"),
            spacecraft_id=_require_text(data, "spacecraft_id"),
            captured_at=_require_text(data, "captured_at"),
            points=points,
            alerts=alerts,
            notes=[str(note) for note in _optional_list(data, "notes")],
        )

    def point_by_channel(self, channel_id: str) -> TelemetryPoint:
        for point in self.points:
            if point.channel_id == channel_id:
                return point
        raise ContractError(f"Snapshot missing channel: {channel_id}")


@dataclass(frozen=True)
class ReplayPayload:
    replay_id: str
    scenario: str
    spacecraft_id: str
    window: dict[str, str]
    playback_rate: float
    points: list[TelemetryPoint]
    alerts: list[AlertRecord]
    source_fixture: str

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "ReplayPayload":
        window = _require(data, "window")
        if not isinstance(window, dict) or "start" not in window or "end" not in window:
            raise ContractError("window must include start and end")

        playback_rate = _require_number(data, "playback_rate")
        if playback_rate <= 0:
            raise ContractError("playback_rate must be positive")

        points = [TelemetryPoint.from_dict(item) for item in _require(data, "points")]
        if not points:
            raise ContractError("replay points must not be empty")

        return cls(
            replay_id=_require_text(data, "replay_id"),
            scenario=_require_text(data, "scenario"),
            spacecraft_id=_require_text(data, "spacecraft_id"),
            window={"start": str(window["start"]), "end": str(window["end"])},
            playback_rate=playback_rate,
            points=points,
            alerts=[AlertRecord.from_dict(item) for item in _optional_list(data, "alerts")],
            source_fixture=_require_text(data, "source_fixture"),
        )
