"""FastAPI entrypoint for the TelemForge backend."""

from __future__ import annotations

from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field

from backend.app.domain.incidents import build_manual_fault_incident
from backend.app.domain.replay import build_anomaly_window, build_replay_window
from backend.app.domain.telemetry_simulation import (
    SimulationConfig,
    generate_simulation,
    load_channel_catalog,
)
from backend.app.storage.sqlite_store import TelemetryStore


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DATABASE_PATH = ROOT / "backend" / "data" / "telemforge-stage04.sqlite"
DEFAULT_CHANNEL_CATALOG_PATH = ROOT / "fixtures" / "telemetry" / "channels.json"


class CreateSessionRequest(BaseModel):
    spacecraft_id: str = Field(min_length=1)
    name: str | None = None


class RunSimulationRequest(BaseModel):
    scenario: str
    start_at: str
    samples: int = Field(default=3, ge=1, le=24)
    step_seconds: int = Field(default=10, ge=1, le=3600)
    seed: int = 4404


class InjectFaultRequest(BaseModel):
    fault_type: str = Field(min_length=1)
    requested_at: str = Field(min_length=1)
    operator_note: str | None = Field(default=None, max_length=500)


def create_app(
    database_path: Path | str | None = None,
    channel_catalog_path: Path | str | None = None,
) -> FastAPI:
    store = TelemetryStore(Path(database_path or DEFAULT_DATABASE_PATH))
    channels = load_channel_catalog(Path(channel_catalog_path or DEFAULT_CHANNEL_CATALOG_PATH))

    app = FastAPI(
        title="TelemForge API",
        version="0.8.0",
        description="Stage 08 local API with SQLite telemetry history, incidents, replay, anomaly inspection, and smoke readiness.",
    )
    app.state.store = store
    app.state.channels = channels

    @app.get("/health")
    def health() -> dict[str, str]:
        store.initialize()
        return {
            "service": "telemforge-api",
            "status": "ok",
            "storage": "sqlite",
            "stage": "08-hardening-docker-and-release",
        }

    @app.post("/sessions", status_code=201)
    def create_session(request: CreateSessionRequest) -> dict[str, Any]:
        store.initialize()
        return store.create_session(
            spacecraft_id=request.spacecraft_id,
            name=request.name,
        )

    @app.get("/sessions")
    def list_sessions() -> dict[str, list[dict[str, Any]]]:
        store.initialize()
        return {"sessions": store.list_sessions()}

    @app.post("/sessions/{session_id}/simulations", status_code=201)
    def run_simulation(
        session_id: str,
        request: RunSimulationRequest,
    ) -> dict[str, Any]:
        store.initialize()
        session = store.get_session(session_id)
        if session is None:
            raise HTTPException(status_code=404, detail="session not found")

        try:
            config = SimulationConfig(
                spacecraft_id=session["spacecraft_id"],
                start_at=request.start_at,
                samples=request.samples,
                step_seconds=request.step_seconds,
                seed=request.seed,
            )
            run = generate_simulation(app.state.channels, config, request.scenario)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

        return store.record_simulation(session_id, run)

    @app.get("/sessions/{session_id}/telemetry")
    def list_telemetry(
        session_id: str,
        channel_id: str | None = None,
        limit: int = Query(default=250, ge=1, le=1000),
    ) -> dict[str, Any]:
        store.initialize()
        if store.get_session(session_id) is None:
            raise HTTPException(status_code=404, detail="session not found")

        return {
            "session_id": session_id,
            "telemetry": store.list_telemetry(
                session_id=session_id,
                channel_id=channel_id,
                limit=limit,
            ),
        }

    @app.post("/sessions/{session_id}/faults", status_code=201)
    def inject_fault(
        session_id: str,
        request: InjectFaultRequest,
    ) -> dict[str, Any]:
        store.initialize()
        session = store.get_session(session_id)
        if session is None:
            raise HTTPException(status_code=404, detail="session not found")

        try:
            incident = build_manual_fault_incident(
                channels=app.state.channels,
                spacecraft_id=session["spacecraft_id"],
                fault_type=request.fault_type,
                requested_at=request.requested_at,
                operator_note=request.operator_note,
            )
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

        return store.record_fault_incident(session_id, incident)

    @app.get("/sessions/{session_id}/faults")
    def list_faults(session_id: str) -> dict[str, Any]:
        store.initialize()
        if store.get_session(session_id) is None:
            raise HTTPException(status_code=404, detail="session not found")

        return {"session_id": session_id, "faults": store.list_faults(session_id)}

    @app.get("/sessions/{session_id}/alerts")
    def list_alerts(
        session_id: str,
        state: str | None = None,
    ) -> dict[str, Any]:
        store.initialize()
        if store.get_session(session_id) is None:
            raise HTTPException(status_code=404, detail="session not found")

        return {
            "session_id": session_id,
            "alerts": store.list_alerts(session_id=session_id, state=state),
        }

    @app.get("/sessions/{session_id}/events")
    def list_events(
        session_id: str,
        limit: int = Query(default=100, ge=1, le=250),
    ) -> dict[str, Any]:
        store.initialize()
        if store.get_session(session_id) is None:
            raise HTTPException(status_code=404, detail="session not found")

        return {
            "session_id": session_id,
            "events": store.list_events(session_id=session_id, limit=limit),
        }

    @app.get("/sessions/{session_id}/replay")
    def get_replay_window(
        session_id: str,
        start_at: str = Query(min_length=1),
        end_at: str = Query(min_length=1),
        limit: int = Query(default=250, ge=1, le=500),
    ) -> dict[str, Any]:
        return _load_replay_window(
            session_id=session_id,
            start_at=start_at,
            end_at=end_at,
            limit=limit,
        )

    @app.get("/sessions/{session_id}/anomalies")
    def get_anomaly_window(
        session_id: str,
        start_at: str = Query(min_length=1),
        end_at: str = Query(min_length=1),
        limit: int = Query(default=250, ge=1, le=500),
    ) -> dict[str, Any]:
        replay = _load_replay_window(
            session_id=session_id,
            start_at=start_at,
            end_at=end_at,
            limit=limit,
        )
        return build_anomaly_window(replay)

    def _load_replay_window(
        session_id: str,
        start_at: str,
        end_at: str,
        limit: int,
    ) -> dict[str, Any]:
        store.initialize()
        session = store.get_session(session_id)
        if session is None:
            raise HTTPException(status_code=404, detail="session not found")

        try:
            source = store.load_replay_source(
                session_id=session_id,
                start_at=start_at,
                end_at=end_at,
                limit=limit,
            )
            return build_replay_window(
                session=session,
                channels=app.state.channels,
                start_at=start_at,
                end_at=end_at,
                source=source,
            )
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

    return app


app = create_app()
