# Backend Schemas

Stage 02 adds Python data contract models here to validate the JSON fixtures in `fixtures/telemetry/`.

Current schema module:

- `telemetry.py`: stdlib-only dataclass contracts for telemetry channels, telemetry points, alert records, fault injection requests, event-log entries, telemetry snapshots, and replay payloads.

These models intentionally do not define FastAPI routes, database persistence, websocket streaming, simulation behavior, or frontend behavior. They exist so Stage 02 fixtures can be parsed and tested before later stages build runtime features.
