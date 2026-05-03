# ADR-005: Live Console Foundation

## Status

Accepted

## Date

2026-04-30

## Context

Stage 05 needs the first usable TelemForge console surface without jumping into websocket streaming, replay execution, anomaly scoring, or fault workflow automation. Stages 02 through 04 already provide known-good telemetry fixtures, deterministic simulation artifacts, and a bounded FastAPI/SQLite API. The UI should make those artifacts reviewable by a human before the project adds real-time behavior.

## Options Considered

### Option A: Live API First

- Proves the Stage 04 API can feed the UI.
- Requires service runtime setup before the UI state model is easy to inspect.
- Makes simple layout and data-shaping mistakes harder to isolate.

### Option B: Fixture-Backed Console First

- Lets the UI render from stable Stage 02 snapshot data and Stage 03 deterministic trend samples.
- Keeps tests small and serial.
- Makes the first console screen reviewable without starting backend services.

### Option C: Full Dashboard And Charting Library

- Could look broader immediately.
- Adds dependency and design complexity before the console's core inspection model is proven.
- Risks hiding the telemetry contract under charting abstractions.

## Decision

Use a minimal React + TypeScript + Vite frontend foundation with fixture-backed data first.

Stage 05 adds:

- `frontend/package.json`, `frontend/index.html`, `frontend/vite.config.ts`, and `frontend/tsconfig.json` for the Vite app boundary.
- `frontend/src/features/mission-console/` for the first console feature, including a pure view-model helper and small React components.
- `frontend/src/lib/stage05ConsoleFixture.ts` as a compact frontend fixture derived from `fixtures/telemetry/degraded_snapshot.json`, `fixtures/telemetry/channels.json`, and `docs/development/artifacts/stage03-simulation/degraded-eclipse-thermal-comms.csv`.
- `tests/frontend/consoleViewModel.test.ts` for deterministic selector, formatting, subsystem, and trend-shaping checks.

The first console view displays:

- mission overview and active alert count;
- status counts by telemetry point state;
- selectable subsystem summary and channel details;
- four deterministic trend panels for battery voltage, avionics temperature, downlink SNR, and packet error rate;
- static alert records from the degraded snapshot.

## Consequences

- A reviewer can inspect the console logic without websocket or background service complexity.
- The frontend has a clear data boundary that can later be replaced by a Stage 04 API adapter.
- Trends use lightweight SVG sparklines rather than a charting dependency.
- The fixture intentionally duplicates a small subset of Stage 02/03 artifacts for frontend runtime simplicity; tests and docs name the source artifacts so drift is visible during review.

## Deferred

- Websocket streaming.
- API-backed live polling or background workers.
- Replay execution.
- Anomaly scoring.
- Fault workflow automation.
- Docker, deploy, release, or publish behavior.
- A charting dependency.

## Validation

Small automated check:

```text
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
```

Human frontend check after installing frontend dependencies:

```text
cd frontend
npm install
npm run dev
```

Then open the printed Vite localhost URL and confirm:

- the mission state shows `tf-sat-01` and `degraded-eclipse-thermal-comms`;
- the overview shows 1 nominal, 7 warning, 2 critical, and 0 offline points;
- the Thermal subsystem is selectable and shows avionics temperature as `62.8 degC`;
- the trend panels show the selected deterministic channels from the Stage 03 degraded CSV;
- no websocket, replay, anomaly, or fault automation controls are present.
