# Workspace Conventions

Stage 01 established where future TelemForge work belongs. These conventions are intentionally small: the repository should stay easy to inspect as later stages add bounded behavior.

## Current Top-Level Layout

```text
backend/                 Future Python/FastAPI backend home.
frontend/                Future React/TypeScript/Vite frontend home.
fixtures/                Human-readable fixture data, starting with telemetry contracts.
tests/                   Test suite roots for contracts, backend, frontend, and e2e checks.
docs/                    Architecture, development path, ADRs, and automation records.
```

## Backend

Backend implementation uses Python and FastAPI for the API skeleton introduced in Stage 04.

Structure:

```text
backend/app/main.py      Current FastAPI app factory and Stage 04 routes.
backend/app/api/         Future route modules as endpoint groups grow.
backend/app/core/        Settings, dependency wiring, and shared app concerns.
backend/app/domain/      Telemetry, simulation, alerts, replay, and anomaly logic.
backend/app/schemas/     Typed contracts introduced with Stage 02.
backend/app/storage/     SQLite persistence boundaries, PostgreSQL later.
```

Stage 01 did not add runnable backend code. Stage 02 added typed contract models only where they help validate fixtures. Stage 03 added isolated domain simulation behavior without service runtime integration. Stage 04 adds a thin FastAPI/SQLite layer for sessions, bounded simulation runs, and telemetry history.

## Frontend

Frontend implementation uses React, TypeScript, and Vite for the Stage 05 live-console foundation.

Current structure:

```text
frontend/index.html      Vite HTML entrypoint.
frontend/src/App.tsx     App composition for the Stage 05 console.
frontend/src/components/ Shared UI components.
frontend/src/features/   Mission console, telemetry, faults, replay, and anomaly areas.
frontend/src/lib/        Frontend adapters and pure helpers.
frontend/src/styles/     Global styling and design tokens when needed.
```

Stage 05 begins with stable fixtures and known UI states rather than websocket/live simulation. The first data boundary lives in `frontend/src/lib/stage05ConsoleFixture.ts`; later stages may replace it with a bounded API adapter once the UI state model is stable.

## Fixtures

Stage 02 should put human-readable contract examples under `fixtures/telemetry/`.

Expected fixture traits:

- JSON first, so backend, frontend, docs, and tests can inspect the same data.
- Small enough to review manually.
- Named by scenario, such as nominal, degraded, alerting, and replay examples.
- No generated bulk telemetry dumps in git unless a later stage explicitly approves them.

## Tests

Future structure:

```text
tests/contracts/         Schema and fixture validation.
tests/fixtures/          Fixture helpers and snapshot-like expected data.
tests/backend/           FastAPI, domain, and storage tests.
tests/frontend/          React component and UI-state tests.
tests/e2e/               Browser or full-stack checks once a runnable app exists.
```

Stage 02 started with lightweight contract and fixture validation. Stage 03 added backend domain tests. Stage 04 adds backend API and storage tests. Stage 05 adds frontend view-model tests under `tests/frontend/`. Later stages can add browser/e2e checks when websocket or full-stack behavior exists.

## Docs

Documentation conventions:

- ADRs live in `docs/development/decisions/`.
- Stage plans live in `docs/development/steps/`.
- Public docs should say whether a directory is runnable code, fixture data, or a placeholder.
- Local automation state, run logs, prompts, and handoffs are private machine artifacts and must stay outside git.

## Deferred Until Later Stages

- Websocket streaming and live API polling.
- Fault injection workflows.
- Replay and anomaly scoring.
- PostgreSQL runtime wiring.
- Docker or release packaging.
