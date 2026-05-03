# ADR-008: Hardening, Docker, And Release Readiness

## Status

Accepted

## Date

2026-04-30

## Context

Stages 01 through 07 produced a local FastAPI backend, SQLite persistence, telemetry fixtures, deterministic simulation behavior, manual fault and alert records, replay/anomaly inspection, and a fixture-backed React/Vite console. Stage 08 needs the project to be easier for another reviewer to run and hand off without deploying, publishing, pushing images, creating cloud resources, or broad rewrites.

## Options Considered

### Option A: Unit Tests Only

- Keeps verification fast.
- Does not prove the API workflow can be exercised end to end.

### Option B: Add A Tiny In-Process Smoke Workflow

- Exercises the current FastAPI routes through the same request/response boundary as the API tests.
- Uses a temporary or local SQLite database and no external services.
- Avoids running a long-lived server during ordinary verification.

### Option C: Full Container Build And Runtime Gate

- Would provide stronger container confidence.
- Can be heavier and depends on local Docker availability, dependency download access, and current memory pressure.

## Decision

Use Option B as the mandatory Stage 08 smoke gate and add Option C as optional local review tooling.

Stage 08 adds `scripts/smoke_stage08.py`, which uses FastAPI `TestClient` and SQLite to run a bounded workflow:

- health check;
- session creation;
- two-sample nominal simulation;
- manual thermal fault injection;
- telemetry, alert, and event queries;
- replay-window query;
- anomaly-window query.

Stage 08 also adds local-only Docker files and `compose.yaml` for reviewer use. Compose keeps backend data in a local named volume and exposes only localhost development ports. The Compose path is not a deployment, release, package publication, or image publication path.

## Consequences

- A reviewer has one mandatory smoke command that confirms the backend workflow without starting a server.
- Docker/Compose configuration can be validated with `docker compose config` before any build or run.
- Container build/run remains optional and should be skipped when Docker is unavailable or local resource guard conditions are unsafe.
- Root, backend, frontend, test, and release-readiness docs now describe the actual Stage 08 run path.

## Deferred

- Publishing release artifacts or container images.
- Deploying any hosted environment.
- PostgreSQL runtime wiring.
- Websocket streaming.
- Alert acknowledgement and clearing.
- Scheduled fault workflows.
- Lockfile generation for frontend dependencies.

## Validation

Mandatory lightweight checks:

```text
python3 scripts/smoke_stage08.py
python3 -m unittest tests/backend/test_stage08_smoke.py
python3 -m unittest discover -s tests/backend
python3 -m unittest discover -s tests/contracts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
```

Optional Docker configuration check when Docker Compose is available and safe:

```text
docker compose config
```
