# TelemForge API Outline

This file tracks the current API surface and later target routes.

## Current Stage 08 Routes

- `GET /health`
- `POST /sessions`
- `GET /sessions`
- `POST /sessions/{session_id}/simulations`
- `GET /sessions/{session_id}/telemetry`
- `POST /sessions/{session_id}/faults`
- `GET /sessions/{session_id}/faults`
- `GET /sessions/{session_id}/alerts`
- `GET /sessions/{session_id}/events`
- `GET /sessions/{session_id}/replay`
- `GET /sessions/{session_id}/anomalies`

Stage 08 routes are synchronous and backed by local SQLite. They create a mission session, run a bounded deterministic simulation from the Stage 03 domain module, persist telemetry samples, inject immediate manual faults, persist fault-caused telemetry, raise threshold-first alerts, query stored fault/alert/event history, assemble bounded replay windows, and derive explainable anomaly scores from replayed telemetry.

Stage 08 adds a smoke helper that exercises this route set without starting a long-lived server:

```text
python3 scripts/smoke_stage08.py
```

## Planned Later Routes

- `GET /missions`
- `GET /missions/{mission_id}`
- websocket replay playback
- alert acknowledgement and clearing endpoints

## Data Contracts To Flesh Out

- mission session summary
- telemetry channel definition
- alert acknowledgement and clearing
- scheduled fault request
- replay playback session lifecycle
- persisted anomaly review records
