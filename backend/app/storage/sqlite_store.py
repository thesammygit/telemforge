"""SQLite persistence for the Stage 04 API skeleton."""

from __future__ import annotations

import json
import sqlite3
import uuid
from dataclasses import asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from backend.app.domain.incidents import IncidentResult
from backend.app.domain.telemetry_simulation import SimulationRun


class TelemetryStore:
    """Small synchronous SQLite boundary for sessions and telemetry history."""

    def __init__(self, database_path: Path | str) -> None:
        self.database_path = Path(database_path)
        self._initialized = False

    def initialize(self) -> None:
        if self._initialized:
            return
        self.database_path.parent.mkdir(parents=True, exist_ok=True)
        with self._connect() as connection:
            connection.executescript(_SCHEMA)
        self._initialized = True

    def table_names(self) -> set[str]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT name
                FROM sqlite_master
                WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
                ORDER BY name
                """
            ).fetchall()
        return {str(row["name"]) for row in rows}

    def create_session(self, spacecraft_id: str, name: str | None = None) -> dict[str, Any]:
        session = {
            "session_id": f"tf-session-{uuid.uuid4().hex[:12]}",
            "spacecraft_id": spacecraft_id,
            "name": name or spacecraft_id,
            "status": "created",
            "created_at": _utc_now(),
        }
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO sessions (
                    session_id, spacecraft_id, name, status, created_at
                ) VALUES (
                    :session_id, :spacecraft_id, :name, :status, :created_at
                )
                """,
                session,
            )
        return session

    def get_session(self, session_id: str) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT session_id, spacecraft_id, name, status, created_at
                FROM sessions
                WHERE session_id = ?
                """,
                (session_id,),
            ).fetchone()
        return _row_to_dict(row) if row is not None else None

    def list_sessions(self) -> list[dict[str, Any]]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT session_id, spacecraft_id, name, status, created_at
                FROM sessions
                ORDER BY created_at, session_id
                """
            ).fetchall()
        return [_row_to_dict(row) for row in rows]

    def record_simulation(self, session_id: str, run: SimulationRun) -> dict[str, Any]:
        if self.get_session(session_id) is None:
            raise KeyError(f"Unknown session_id: {session_id}")

        run_record = {
            "run_id": f"tf-run-{uuid.uuid4().hex[:12]}",
            "session_id": session_id,
            "scenario": run.scenario,
            "spacecraft_id": run.spacecraft_id,
            "start_at": run.config.start_at,
            "samples": run.config.samples,
            "step_seconds": run.config.step_seconds,
            "seed": run.config.seed,
            "row_count": len(run.rows),
            "summary": run.summary,
            "created_at": _utc_now(),
        }
        summary_json = json.dumps(run.summary, sort_keys=True)

        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO simulation_runs (
                    run_id, session_id, scenario, spacecraft_id, start_at,
                    samples, step_seconds, seed, row_count, summary_json, created_at
                ) VALUES (
                    :run_id, :session_id, :scenario, :spacecraft_id, :start_at,
                    :samples, :step_seconds, :seed, :row_count, :summary_json, :created_at
                )
                """,
                {**run_record, "summary_json": summary_json},
            )
            connection.executemany(
                """
                INSERT INTO telemetry_samples (
                    run_id, session_id, scenario, spacecraft_id, timestamp, sample,
                    elapsed_seconds, channel_id, subsystem, unit, value, status,
                    quality, seed
                ) VALUES (
                    :run_id, :session_id, :scenario, :spacecraft_id, :timestamp, :sample,
                    :elapsed_seconds, :channel_id, :subsystem, :unit, :value, :status,
                    :quality, :seed
                )
                """,
                [
                    {
                        **asdict(row),
                        "run_id": run_record["run_id"],
                        "session_id": session_id,
                    }
                    for row in run.rows
                ],
            )

        return run_record

    def record_fault_incident(
        self,
        session_id: str,
        incident: IncidentResult,
    ) -> dict[str, Any]:
        session = self.get_session(session_id)
        if session is None:
            raise KeyError(f"Unknown session_id: {session_id}")

        run_record = {
            "run_id": f"tf-run-{uuid.uuid4().hex[:12]}",
            "session_id": session_id,
            "scenario": f"manual-fault:{incident.fault['fault_type']}",
            "spacecraft_id": session["spacecraft_id"],
            "start_at": incident.fault["requested_at"],
            "samples": 1,
            "step_seconds": 1,
            "seed": 6060,
            "row_count": len(incident.telemetry),
            "summary": incident.summary,
            "created_at": _utc_now(),
        }

        fault_metadata = {
            key: value
            for key, value in incident.fault.items()
            if key not in {"fault_id", "fault_type", "status", "requested_at"}
        }
        fault_metadata["fault_type"] = incident.fault["fault_type"]

        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO simulation_runs (
                    run_id, session_id, scenario, spacecraft_id, start_at,
                    samples, step_seconds, seed, row_count, summary_json, created_at
                ) VALUES (
                    :run_id, :session_id, :scenario, :spacecraft_id, :start_at,
                    :samples, :step_seconds, :seed, :row_count, :summary_json, :created_at
                )
                """,
                {
                    **run_record,
                    "summary_json": json.dumps(incident.summary, sort_keys=True),
                },
            )
            connection.executemany(
                """
                INSERT INTO telemetry_samples (
                    run_id, session_id, scenario, spacecraft_id, timestamp, sample,
                    elapsed_seconds, channel_id, subsystem, unit, value, status,
                    quality, seed
                ) VALUES (
                    :run_id, :session_id, :scenario, :spacecraft_id, :timestamp, :sample,
                    :elapsed_seconds, :channel_id, :subsystem, :unit, :value, :status,
                    :quality, :seed
                )
                """,
                [
                    {
                        **row,
                        "run_id": run_record["run_id"],
                        "session_id": session_id,
                    }
                    for row in incident.telemetry
                ],
            )
            connection.execute(
                """
                INSERT INTO faults (
                    fault_id, session_id, name, status, requested_at, metadata_json
                ) VALUES (
                    :fault_id, :session_id, :name, :status, :requested_at, :metadata_json
                )
                """,
                {
                    "fault_id": incident.fault["fault_id"],
                    "session_id": session_id,
                    "name": incident.fault["fault_type"],
                    "status": incident.fault["status"],
                    "requested_at": incident.fault["requested_at"],
                    "metadata_json": json.dumps(fault_metadata, sort_keys=True),
                },
            )
            connection.executemany(
                """
                INSERT INTO alerts (
                    alert_id, session_id, channel_id, severity, state, timestamp,
                    message, metadata_json
                ) VALUES (
                    :alert_id, :session_id, :channel_id, :severity, :state, :timestamp,
                    :message, :metadata_json
                )
                """,
                [
                    {
                        "alert_id": alert["alert_id"],
                        "session_id": session_id,
                        "channel_id": alert["channel_id"],
                        "severity": alert["severity"],
                        "state": alert["state"],
                        "timestamp": alert["timestamp"],
                        "message": alert["message"],
                        "metadata_json": json.dumps(
                            {
                                key: value
                                for key, value in alert.items()
                                if key
                                not in {
                                    "alert_id",
                                    "channel_id",
                                    "severity",
                                    "state",
                                    "timestamp",
                                    "message",
                                }
                            },
                            sort_keys=True,
                        ),
                    }
                    for alert in incident.alerts
                ],
            )
            connection.executemany(
                """
                INSERT INTO events (
                    event_id, session_id, event_type, timestamp, message, metadata_json
                ) VALUES (
                    :event_id, :session_id, :event_type, :timestamp, :message, :metadata_json
                )
                """,
                [
                    {
                        "event_id": event["event_id"],
                        "session_id": session_id,
                        "event_type": event["event_type"],
                        "timestamp": event["timestamp"],
                        "message": event["message"],
                        "metadata_json": json.dumps(
                            {
                                key: value
                                for key, value in event.items()
                                if key
                                not in {
                                    "event_id",
                                    "event_type",
                                    "timestamp",
                                    "message",
                                }
                            },
                            sort_keys=True,
                        ),
                    }
                    for event in incident.events
                ],
            )

        return {
            "fault": incident.fault,
            "run": run_record,
            "telemetry": incident.telemetry,
            "alerts": incident.alerts,
            "events": incident.events,
        }

    def list_telemetry(
        self,
        session_id: str,
        channel_id: str | None = None,
        limit: int = 250,
    ) -> list[dict[str, Any]]:
        parameters: list[Any] = [session_id]
        where = "WHERE session_id = ?"
        if channel_id is not None:
            where += " AND channel_id = ?"
            parameters.append(channel_id)
        parameters.append(limit)

        with self._connect() as connection:
            rows = connection.execute(
                f"""
                SELECT run_id, session_id, scenario, spacecraft_id, timestamp, sample,
                       elapsed_seconds, channel_id, subsystem, unit, value, status,
                       quality, seed
                FROM telemetry_samples
                {where}
                ORDER BY timestamp, sample, channel_id
                LIMIT ?
                """,
                parameters,
            ).fetchall()
        return [_row_to_dict(row) for row in rows]

    def load_replay_source(
        self,
        session_id: str,
        start_at: str,
        end_at: str,
        limit: int = 250,
    ) -> dict[str, Any]:
        return {
            "sample_limit": limit,
            "telemetry": self._list_telemetry_window(
                session_id=session_id,
                start_at=start_at,
                end_at=end_at,
                limit=limit,
            ),
            "faults": self._list_faults_window(
                session_id=session_id,
                start_at=start_at,
                end_at=end_at,
            ),
            "alerts": self._list_alerts_window(
                session_id=session_id,
                start_at=start_at,
                end_at=end_at,
            ),
            "events": self._list_events_window(
                session_id=session_id,
                start_at=start_at,
                end_at=end_at,
            ),
        }

    def list_faults(self, session_id: str) -> list[dict[str, Any]]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT fault_id, session_id, name, status, requested_at, metadata_json
                FROM faults
                WHERE session_id = ?
                ORDER BY requested_at, fault_id
                """,
                (session_id,),
            ).fetchall()
        return [_fault_from_row(row) for row in rows]

    def list_alerts(
        self,
        session_id: str,
        state: str | None = None,
    ) -> list[dict[str, Any]]:
        parameters: list[Any] = [session_id]
        where = "WHERE session_id = ?"
        if state is not None:
            where += " AND state = ?"
            parameters.append(state)

        with self._connect() as connection:
            rows = connection.execute(
                f"""
                SELECT alert_id, session_id, channel_id, severity, state, timestamp,
                       message, metadata_json
                FROM alerts
                {where}
                ORDER BY timestamp, alert_id
                """,
                parameters,
            ).fetchall()
        return [_alert_from_row(row) for row in rows]

    def list_events(self, session_id: str, limit: int = 100) -> list[dict[str, Any]]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT event_id, session_id, event_type, timestamp, message, metadata_json
                FROM events
                WHERE session_id = ?
                ORDER BY timestamp, event_id
                LIMIT ?
                """,
                (session_id, limit),
            ).fetchall()
        return [_event_from_row(row) for row in rows]

    def _list_telemetry_window(
        self,
        session_id: str,
        start_at: str,
        end_at: str,
        limit: int,
    ) -> list[dict[str, Any]]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT run_id, session_id, scenario, spacecraft_id, timestamp, sample,
                       elapsed_seconds, channel_id, subsystem, unit, value, status,
                       quality, seed
                FROM telemetry_samples
                WHERE session_id = ?
                  AND timestamp >= ?
                  AND timestamp <= ?
                ORDER BY timestamp, sample, channel_id, run_id
                LIMIT ?
                """,
                (session_id, start_at, end_at, limit),
            ).fetchall()
        return [_row_to_dict(row) for row in rows]

    def _list_faults_window(
        self,
        session_id: str,
        start_at: str,
        end_at: str,
    ) -> list[dict[str, Any]]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT fault_id, session_id, name, status, requested_at, metadata_json
                FROM faults
                WHERE session_id = ?
                  AND requested_at >= ?
                  AND requested_at <= ?
                ORDER BY requested_at, fault_id
                """,
                (session_id, start_at, end_at),
            ).fetchall()
        return [_fault_from_row(row) for row in rows]

    def _list_alerts_window(
        self,
        session_id: str,
        start_at: str,
        end_at: str,
    ) -> list[dict[str, Any]]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT alert_id, session_id, channel_id, severity, state, timestamp,
                       message, metadata_json
                FROM alerts
                WHERE session_id = ?
                  AND timestamp >= ?
                  AND timestamp <= ?
                ORDER BY timestamp, alert_id
                """,
                (session_id, start_at, end_at),
            ).fetchall()
        return [_alert_from_row(row) for row in rows]

    def _list_events_window(
        self,
        session_id: str,
        start_at: str,
        end_at: str,
    ) -> list[dict[str, Any]]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT event_id, session_id, event_type, timestamp, message, metadata_json
                FROM events
                WHERE session_id = ?
                  AND timestamp >= ?
                  AND timestamp <= ?
                ORDER BY timestamp, event_id
                """,
                (session_id, start_at, end_at),
            ).fetchall()
        return [_event_from_row(row) for row in rows]

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.database_path)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        return connection


def _row_to_dict(row: sqlite3.Row) -> dict[str, Any]:
    return {key: row[key] for key in row.keys()}


def _fault_from_row(row: sqlite3.Row) -> dict[str, Any]:
    metadata = _decode_metadata(row["metadata_json"])
    return {
        "fault_id": row["fault_id"],
        "session_id": row["session_id"],
        "fault_type": metadata.get("fault_type", row["name"]),
        "subsystem": metadata.get("subsystem"),
        "status": row["status"],
        "requested_at": row["requested_at"],
        "target_channel_ids": metadata.get("target_channel_ids", []),
        "description": metadata.get("description"),
        "operator_note": metadata.get("operator_note"),
        "expected_effects": metadata.get("expected_effects", []),
    }


def _alert_from_row(row: sqlite3.Row) -> dict[str, Any]:
    metadata = _decode_metadata(row["metadata_json"])
    return {
        "alert_id": row["alert_id"],
        "session_id": row["session_id"],
        "channel_id": row["channel_id"],
        "subsystem": metadata.get("subsystem"),
        "severity": row["severity"],
        "state": row["state"],
        "timestamp": row["timestamp"],
        "message": row["message"],
        "observed_value": metadata.get("observed_value"),
        "threshold": metadata.get("threshold"),
        "recommended_action": metadata.get("recommended_action"),
        "related_fault_id": metadata.get("related_fault_id"),
        "fault_type": metadata.get("fault_type"),
    }


def _event_from_row(row: sqlite3.Row) -> dict[str, Any]:
    metadata = _decode_metadata(row["metadata_json"])
    return {
        "event_id": row["event_id"],
        "session_id": row["session_id"],
        "event_type": row["event_type"],
        "timestamp": row["timestamp"],
        "message": row["message"],
        "related_fault_id": metadata.get("related_fault_id"),
        "fault_type": metadata.get("fault_type"),
        "channel_id": metadata.get("channel_id"),
        "alert_id": metadata.get("alert_id"),
        "severity": metadata.get("severity"),
        "metadata": metadata,
    }


def _decode_metadata(value: str) -> dict[str, Any]:
    if not value:
        return {}
    decoded = json.loads(value)
    return decoded if isinstance(decoded, dict) else {}


def _utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


_SCHEMA = """
CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    spacecraft_id TEXT NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS simulation_runs (
    run_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    scenario TEXT NOT NULL,
    spacecraft_id TEXT NOT NULL,
    start_at TEXT NOT NULL,
    samples INTEGER NOT NULL,
    step_seconds INTEGER NOT NULL,
    seed INTEGER NOT NULL,
    row_count INTEGER NOT NULL,
    summary_json TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS telemetry_samples (
    id INTEGER PRIMARY KEY,
    run_id TEXT NOT NULL REFERENCES simulation_runs(run_id) ON DELETE CASCADE,
    session_id TEXT NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    scenario TEXT NOT NULL,
    spacecraft_id TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    sample INTEGER NOT NULL,
    elapsed_seconds INTEGER NOT NULL,
    channel_id TEXT NOT NULL,
    subsystem TEXT NOT NULL,
    unit TEXT NOT NULL,
    value REAL NOT NULL,
    status TEXT NOT NULL,
    quality TEXT NOT NULL,
    seed INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_telemetry_samples_session_timestamp
ON telemetry_samples(session_id, timestamp, channel_id);

CREATE TABLE IF NOT EXISTS events (
    event_id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES sessions(session_id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS faults (
    fault_id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES sessions(session_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    requested_at TEXT NOT NULL,
    metadata_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS alerts (
    alert_id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES sessions(session_id) ON DELETE CASCADE,
    channel_id TEXT NOT NULL,
    severity TEXT NOT NULL,
    state TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata_json TEXT NOT NULL DEFAULT '{}'
);
"""
