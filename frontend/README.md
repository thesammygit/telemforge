# Frontend Workspace

This directory contains the React + TypeScript + Vite mission-console foundation through Stage 08.

The console is fixture-backed. It renders mission overview, subsystem details, selected telemetry trends, threshold alert records, a manual-fault incident timeline, and replay/anomaly overlay data from compact frontend fixtures derived from:

- `fixtures/telemetry/channels.json`
- `fixtures/telemetry/degraded_snapshot.json`
- `docs/development/artifacts/stage03-simulation/degraded-eclipse-thermal-comms.csv`
- the Stage 06 manual fault decision in `docs/development/decisions/0006-faults-alerts-and-events.md`
- the Stage 07 replay/anomaly decision in `docs/development/decisions/0007-replay-and-anomaly-layer.md`

Current application layout:

```text
frontend/src/components/ Shared UI components.
frontend/src/features/   Mission console feature areas.
frontend/src/lib/        Frontend adapters and pure helpers.
frontend/src/styles/     Shared styling when needed.
```

## Local Commands

After installing frontend dependencies:

```text
cd frontend
npm install
npm run dev
```

Open the Vite localhost URL and inspect the Stage 07 console state carried into Stage 08.

Lightweight frontend logic verification does not require the Vite dependency install:

```text
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
```

From inside `frontend/`, the same check is available as:

```text
npm run test
```

## Deferred

- Websocket streaming.
- Live API polling.
- Animated replay playback.
- Heavy ML anomaly scoring.
- API-backed fault workflow controls.
- Charting dependencies.

## Docker

The frontend Dockerfile is for local review through `compose.yaml`.

```text
docker compose config
docker compose up --build frontend
```

Do not push images or use this as a deployment workflow.
