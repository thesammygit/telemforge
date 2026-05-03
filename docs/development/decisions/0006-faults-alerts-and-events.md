# ADR-006: Faults, Alerts, And Events

## Status

Accepted

## Date

2026-04-30

## Context

Stage 06 needs TelemForge to become operationally interactive without jumping into replay, anomaly scoring, websocket streaming, Docker, deploy, release, or publish work. Stages 04 and 05 already provide a synchronous FastAPI/SQLite boundary and a fixture-backed mission console. The next useful slice is a causal incident flow that a human can inspect end to end.

## Options Considered

### Option A: Manual Faults With Threshold Alerts

- Keeps the incident behavior deterministic and easy to test.
- Lets operators see why an alert fired from known telemetry thresholds.
- Fits the existing SQLite and fixture-backed console boundaries.

### Option B: Scheduled Fault Campaigns

- Creates richer scenarios for replay later.
- Adds scheduling and lifecycle complexity before the first incident path is proven.

### Option C: Anomaly-Driven Alerts

- More flexible long term.
- Harder to explain and validate before threshold-first behavior exists.

## Decision

Use immediate manual faults with threshold-first alerting and an explicit event log.

Stage 06 adds two bounded fault types:

- `thermal_avionics_overheat`, which forces `thermal.avionics_temp` to a critical value.
- `comms_downlink_fade`, which forces `comms.downlink_snr_db` low and `comms.packet_error_rate_pct` high.

The backend builds a deterministic incident result for each injection:

- a persisted active fault record;
- one incident simulation run containing the affected telemetry samples;
- active alerts with observed value, threshold metadata, recommended action, and related fault ID;
- event-log entries for `fault.injected`, `telemetry.affected`, and `alert.raised`.

The frontend remains fixture-backed for this stage, but now includes a Stage 06 incident overlay that exposes the active fault and causal timeline.

## Consequences

- A reviewer can inject a fault through the API and query the resulting fault, telemetry, alert, and event records from SQLite-backed endpoints.
- Alert messages stay operator-facing and explain the breached threshold directly.
- The console data boundary now models incident timelines without adding live polling or websocket behavior.
- The design keeps lifecycle management small; alerts are raised but not acknowledged or cleared yet.

## Deferred

- Scheduled faults.
- Alert acknowledgement and clear workflows.
- Websocket streaming or background workers.
- Replay execution.
- Anomaly scoring.
- Charting dependencies.
- Docker, deploy, release, or publish behavior.

## Validation

Small automated checks:

```text
python3 -m unittest tests/backend/test_stage06_incidents.py
python3 -m unittest tests/backend/test_stage06_api.py
python3 -m unittest discover -s tests/backend
python3 -m unittest discover -s tests/contracts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
```

Manual API smoke after installing backend dependencies:

```text
python3 -m uvicorn backend.app.main:app --reload
curl -s -X POST http://127.0.0.1:8000/sessions \
  -H 'content-type: application/json' \
  -d '{"spacecraft_id":"tf-sat-01","name":"Stage 06 smoke"}'
curl -s -X POST http://127.0.0.1:8000/sessions/{session_id}/faults \
  -H 'content-type: application/json' \
  -d '{"fault_type":"thermal_avionics_overheat","requested_at":"2026-04-30T19:15:00Z"}'
curl -s http://127.0.0.1:8000/sessions/{session_id}/alerts
curl -s http://127.0.0.1:8000/sessions/{session_id}/events
```
