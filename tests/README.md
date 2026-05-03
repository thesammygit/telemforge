# Tests

This directory is reserved for TelemForge tests.

Stage 01 did not introduce a runnable test suite. Stage 02 started with contract and fixture validation. Stage 03 added backend domain tests for deterministic simulation behavior. Stage 04 adds FastAPI and SQLite storage tests around bounded simulation persistence.
Stage 05 adds small frontend view-model tests that run directly on Node's TypeScript stripping support without installing the Vite dependency set. Stage 06 adds focused backend/API tests for manual faults, threshold alerts, event logging, and incident persistence, plus frontend view-model coverage for the incident timeline. Stage 07 adds focused replay-window, anomaly-scoring, replay API, anomaly API, and frontend replay overlay tests. Stage 08 adds a bounded smoke workflow that exercises the backend health, session, simulation, fault, telemetry, alert, event, replay, and anomaly routes.

Planned layout:

```text
tests/contracts/         Schema and fixture validation.
tests/fixtures/          Fixture helpers and snapshot-like expected data.
tests/backend/           FastAPI, domain, and storage tests.
tests/frontend/          Frontend view-model, selector, and later React UI tests.
tests/e2e/               Browser or full-stack checks once a runnable app exists.
```

## Current Lightweight Commands

```text
python3 scripts/smoke_stage08.py
python3 -m unittest tests/backend/test_stage08_smoke.py
python3 -m unittest tests/contracts/test_telemetry_contracts.py
python3 -m unittest tests/backend/test_telemetry_simulation.py
python3 -m unittest tests/backend/test_stage04_storage.py
python3 -m unittest tests/backend/test_stage04_api.py
python3 -m unittest tests/backend/test_stage06_incidents.py
python3 -m unittest tests/backend/test_stage06_api.py
python3 -m unittest tests/backend/test_stage07_replay.py
python3 -m unittest tests/backend/test_stage07_api.py
python3 -m unittest discover -s tests/backend
python3 -m unittest discover -s tests/contracts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
```
