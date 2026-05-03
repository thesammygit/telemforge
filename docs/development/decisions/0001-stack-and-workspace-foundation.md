# ADR-001: Stack And Workspace Foundation

## Status

Accepted

## Date

2026-04-30

## Context

TelemForge is moving from a docs-first planning repository into staged implementation. Before Stage 02 defines telemetry contracts and fixtures, the repository needs a stable stack decision and a shared workspace layout so future backend, frontend, test, fixture, and documentation work lands in predictable places.

The initial stack direction is accepted:

- Python + FastAPI for the backend.
- React + TypeScript + Vite for the frontend.
- SQLite for local and test storage where useful.
- PostgreSQL later for compose/runtime storage.
- Websocket-first streaming.
- Explainable anomaly methods first.

Stage 01 should not add telemetry simulation, API behavior, or frontend behavior. It should make the next stage easier to execute and review.

## Options Considered

### Option A: Python/FastAPI Backend, React/Vite Frontend, JSON Fixtures First

- Fits simulation, data inspection, and anomaly prototyping.
- Keeps backend contracts readable for frontend and docs review.
- Supports a local-first workflow without committing to production infrastructure early.
- Requires the team to maintain a Python and TypeScript toolchain.

### Option B: TypeScript/Node Full Stack

- Uses one primary language for backend and frontend.
- Reduces language switching for web-only work.
- Is a weaker default fit for early simulation and data-analysis spikes.

### Option C: Heavier Frameworks And Runtime Infrastructure Now

- Django, Next.js, broker-backed streaming, and PostgreSQL-first storage could be useful later.
- These choices add complexity before the contract, fixture, and demo workflows are stable.
- Early weight would make human review harder during the staged build.

## Decision

Use the accepted Stage 01 stack and workspace conventions:

- Backend code will live under `backend/`, with future FastAPI application code under `backend/app/`.
- Frontend code will live under `frontend/`, with future Vite application code under `frontend/src/`.
- Human-readable telemetry contracts and fixture data will begin under `fixtures/telemetry/`.
- Tests will live under `tests/`, grouped by contract, backend, frontend, and end-to-end concerns as those stages arrive.
- ADRs and decision records will live under `docs/development/decisions/`.
- Stage-specific development guidance remains under `docs/development/steps/`.

Do not add telemetry simulation, API routes, persistence logic, websocket logic, or frontend console code in Stage 01.

## Workspace Conventions

Backend conventions:

- `backend/app/api/` will hold FastAPI route modules after the API skeleton stage.
- `backend/app/core/` will hold settings, dependency wiring, and shared application concerns.
- `backend/app/domain/` will hold telemetry, simulation, alerting, replay, and anomaly domain logic.
- `backend/app/schemas/` will hold typed data contracts once Stage 02 introduces models.
- `backend/app/storage/` will hold SQLite/PostgreSQL persistence boundaries after storage is approved.

Frontend conventions:

- `frontend/src/` will hold the Vite application once frontend work starts.
- `frontend/src/features/` will group mission console, telemetry, faults, replay, and anomaly UI areas.
- `frontend/src/components/` will hold shared UI components.
- `frontend/src/lib/` will hold frontend adapters and pure helpers.
- Initial charting should stay simple until a charting library is justified by repeated needs.

Test conventions:

- `tests/contracts/` will validate Stage 02 schemas and fixtures.
- `tests/fixtures/` will hold fixture validation helpers and snapshot-like examples if needed.
- `tests/backend/` will cover FastAPI/domain/storage behavior after those stages exist.
- `tests/frontend/` will cover React behavior after frontend work starts.
- `tests/e2e/` will be reserved for browser or full-stack checks once there is a runnable app.

Documentation conventions:

- `docs/development/decisions/` stores accepted ADRs.
- `docs/development/steps/` stores stage plans.
- `docs/automation/runs/` stores dated automation run notes.
- `docs/automation/state/` stores machine-readable automation state.
- Public-facing docs should point to human-testable artifacts and explain what is deferred.

## Why

This layout gives Stage 02 a visible place for contract and fixture artifacts without pretending the backend or frontend already exists. It also keeps TelemForge aligned with the staged development rule: stable data shape first, then simulation, then API/storage, then live UI.

## Consequences

- Stage 02 can add JSON fixtures and typed schemas without choosing API or UI details prematurely.
- Future backend and frontend work has clear ownership boundaries.
- The repo now has placeholder directories that are intentionally non-functional until their stages arrive.
- Running app commands is deferred until there is executable app code to run.
- PostgreSQL, websocket transport, charting libraries, anomaly engines, and Docker remain deferred.

## Validation

A reviewer should be able to inspect this ADR and the workspace README files and answer:

- Which stack is accepted for the initial build?
- Where will Stage 02 contracts and fixtures go?
- Which directories are placeholders rather than runnable application code?
- Which behavior is intentionally deferred until later stages?
