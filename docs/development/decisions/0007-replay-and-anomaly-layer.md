# ADR-007: Replay And Anomaly Layer

## Status

Accepted

## Date

2026-04-30

## Context

Stage 07 needs incident history to become reviewable after the fact. Stage 04 already persists sessions and telemetry samples. Stage 06 persists fault records, threshold alerts, and event-log entries. The next useful slice is a bounded replay window that combines those records and adds explainable anomaly signals without websocket streaming, background workers, heavy ML, Docker, deploy, release, or publish work.

## Options Considered

### Option A: Replay Raw Telemetry Only

- Keeps payload assembly very small.
- Leaves operators without fault, alert, and event context.

### Option B: Replay Telemetry With Incident Timeline Markers

- Makes a fault window inspectable by showing telemetry alongside fault, alert, and event records.
- Fits the existing synchronous FastAPI and SQLite boundaries.

### Option C: Add Heavy ML Anomaly Detection

- Could eventually discover subtler behavior.
- Is too opaque and resource-heavy for the first replay/anomaly layer.

## Decision

Use a bounded, synchronous replay assembly path and a nominal-envelope anomaly scorer.

Stage 07 adds `backend/app/domain/replay.py` to assemble one session-scoped replay payload from:

- telemetry samples in a requested time window;
- active or historical fault records in the same window;
- alert records in the same window;
- event-log entries in the same window.

Replay payloads include ordered timeline markers for faults, event-log entries, and alert transitions. The anomaly layer compares each replayed telemetry value with the channel's nominal and warning ranges. It emits anomaly records only when the value leaves the nominal envelope, and the record includes the affected channel, observed value, severity, score, baseline context, and plain-language reason.

The API adds two synchronous inspection routes:

- `GET /sessions/{session_id}/replay`
- `GET /sessions/{session_id}/anomalies`

The frontend remains fixture-backed for this stage, but `stage07ConsoleFixture` and the mission-console view model now expose replay markers and a top-anomaly overlay that mirrors the backend payload shape.

## Consequences

- A reviewer can request a small incident window and inspect telemetry, fault markers, alert markers, event markers, and anomaly reasons from one payload.
- Anomaly output is explainable and deterministic. It is not a hidden model and does not require background processing.
- The SQLite boundary stays small: Stage 07 derives replay/anomaly output from existing tables and adds no new persistence schema.
- The frontend has a human-inspectable replay/anomaly state without adding live polling or charting dependencies.

## Deferred

- Websocket replay playback.
- Background anomaly daemons.
- Heavy ML anomaly detection.
- Persisted anomaly tables.
- Alert acknowledgement and clear workflows.
- Scheduled faults.
- Docker, deploy, release, or publish behavior.

## Validation

Small automated checks:

```text
python3 -m unittest tests/backend/test_stage07_replay.py
python3 -m unittest tests/backend/test_stage07_api.py
python3 -m unittest discover -s tests/backend
python3 -m unittest discover -s tests/contracts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
```

Manual API smoke after installing backend dependencies:

```text
python3 -m uvicorn backend.app.main:app --reload
curl -s -X POST http://127.0.0.1:8000/sessions \
  -H 'content-type: application/json' \
  -d '{"spacecraft_id":"tf-sat-01","name":"Stage 07 smoke"}'
curl -s -X POST http://127.0.0.1:8000/sessions/{session_id}/faults \
  -H 'content-type: application/json' \
  -d '{"fault_type":"thermal_avionics_overheat","requested_at":"2026-04-30T19:15:00Z"}'
curl -s 'http://127.0.0.1:8000/sessions/{session_id}/replay?start_at=2026-04-30T19:14:50Z&end_at=2026-04-30T19:15:10Z'
curl -s 'http://127.0.0.1:8000/sessions/{session_id}/anomalies?start_at=2026-04-30T19:14:50Z&end_at=2026-04-30T19:15:10Z'
```
