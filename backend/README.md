# Backend Workspace

This directory contains the Python/FastAPI backend.

Stages introduce backend files in this order:

1. Stage 02: typed telemetry contracts if they help validate JSON fixtures.
2. Stage 03: isolated domain simulation behavior and script-generated inspection artifacts.
3. Stage 04: FastAPI skeleton, health/session/simulation routes, and SQLite storage boundaries.
4. Stage 06: bounded manual faults, threshold alerts, event logs, and incident query routes.
5. Stage 07: bounded replay windows, timeline markers, and explainable anomaly scoring.
6. Stage 08: local smoke verification, Docker config, and release-readiness documentation.
7. Later stages: websocket streaming, background processing, and production release hardening.

Current application layout:

```text
backend/app/main.py      FastAPI app factory and synchronous Stage 08 routes.
backend/app/api/         Future FastAPI route modules as the API grows.
backend/app/core/        Settings and shared app dependencies.
backend/app/domain/      Telemetry, simulation, alerts, replay, and anomaly logic.
backend/app/schemas/     Typed data contracts.
backend/app/storage/     Persistence boundaries.
```

## Stage 08 Local Checks

```text
python3 scripts/smoke_stage08.py
python3 -m unittest tests/backend/test_stage08_smoke.py
python3 -m unittest tests/backend/test_stage07_replay.py
python3 -m unittest tests/backend/test_stage07_api.py
python3 -m unittest tests/backend/test_stage06_incidents.py
python3 -m unittest tests/backend/test_stage06_api.py
python3 -m unittest tests/backend/test_stage04_storage.py
python3 -m unittest tests/backend/test_stage04_api.py
python3 -m unittest discover -s tests/backend
```

To run the API locally:

```text
python3 -m pip install -r backend/requirements.txt
python3 -m uvicorn backend.app.main:app --reload
```

Then inspect the local SQLite file created on first request:

```text
curl -s http://127.0.0.1:8000/health
sqlite3 backend/data/telemforge-stage04.sqlite '.schema sessions'
```

Stage 07 incident/replay routes are synchronous and session-scoped:

```text
POST /sessions/{session_id}/faults
GET /sessions/{session_id}/faults
GET /sessions/{session_id}/alerts
GET /sessions/{session_id}/events
GET /sessions/{session_id}/replay?start_at=...&end_at=...
GET /sessions/{session_id}/anomalies?start_at=...&end_at=...
```

The Stage 08 smoke helper runs that workflow without starting a server:

```text
python3 scripts/smoke_stage08.py
```

## Docker

The backend Dockerfile is for local review through `compose.yaml`.

```text
docker compose config
docker compose up --build backend
```

Do not push images or use this as a deployment workflow.
