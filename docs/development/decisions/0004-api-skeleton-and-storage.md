# ADR-004: API Skeleton And Storage

## Status

Accepted

## Date

2026-04-30

## Context

Stage 04 needs the first runnable backend surface around the Stage 02 telemetry contracts and Stage 03 deterministic simulation. The goal is not to build the live console or production runtime; it is to let a reviewer create a local mission session, run a tiny deterministic simulation, persist the samples, and query them back through a straightforward API/storage boundary.

The implementation must stay small, synchronous, and locally inspectable. It should not introduce websocket streaming, frontend UI, replay execution, anomaly scoring, Docker, deployment, release, or publish behavior.

## Options Considered

### Option A: In-Memory API Only

- Fastest first API response.
- Does not prove persisted telemetry history.
- Leaves replay and review workflows without a durable foundation.

### Option B: FastAPI Plus SQLite Storage

- Matches the accepted backend stack and local/test persistence decision.
- Gives reviewers a real database file they can inspect.
- Keeps infrastructure overhead low by using Python stdlib `sqlite3`.

### Option C: PostgreSQL From Stage 04

- Closer to a later compose/runtime target.
- Adds setup cost before the local API shape is stable.
- Is unnecessary for bounded tests and human review.

## Decision

Use a thin FastAPI app factory in `backend/app/main.py` and a synchronous SQLite store in `backend/app/storage/sqlite_store.py`.

Stage 04 exposes:

- `GET /health`
- `POST /sessions`
- `GET /sessions`
- `POST /sessions/{session_id}/simulations`
- `GET /sessions/{session_id}/telemetry`

The storage schema includes:

- `sessions` for local mission/session metadata;
- `simulation_runs` for generated run metadata and summary JSON;
- `telemetry_samples` for persisted per-channel history;
- `events`, `faults`, and `alerts` as table foundations for later stages.

Simulation runs are bounded by request validation: `samples` must be between 1 and 24, execution is synchronous, and no background worker or streaming loop is introduced.

## Consequences

- A reviewer can use FastAPI's test client or a local Uvicorn process to create a session, run a small simulation, and query stored telemetry.
- SQLite keeps Stage 04 inspectable without requiring PostgreSQL, Docker, or cloud services.
- The event/fault/alert tables reserve the shape of future persistence without implementing those workflows prematurely.
- The app depends on FastAPI; backend dependencies are recorded in `backend/requirements.txt`.

## Deferred

- Websocket streaming.
- Frontend mission console UI.
- Fault injection workflows.
- Alert generation behavior beyond table foundations.
- Replay execution.
- Anomaly scoring.
- PostgreSQL runtime wiring.
- Docker, deploy, release, or publish behavior.

## Validation

A reviewer should be able to run:

```text
python3 -m unittest tests/backend/test_stage04_storage.py
python3 -m unittest tests/backend/test_stage04_api.py
python3 -m unittest discover -s tests/backend
```

To inspect a local SQLite database manually:

```text
python3 -m uvicorn backend.app.main:app --reload
curl -s -X POST http://127.0.0.1:8000/sessions \
  -H 'content-type: application/json' \
  -d '{"spacecraft_id":"tf-sat-01","name":"Stage 04 smoke"}'
sqlite3 backend/data/telemforge-stage04.sqlite '.tables'
```
