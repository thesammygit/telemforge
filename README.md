# TelemForge

TelemForge is an open-source synthetic telemetry and mission-operations sandbox. The current Stage 08 workspace includes a local FastAPI backend, SQLite persistence, deterministic telemetry simulation, manual fault and alert workflows, replay/anomaly inspection, and a fixture-backed React/Vite mission console.

## Quick Verification

From the repository root:

```text
python3 scripts/smoke_stage08.py
python3 -m unittest discover -s tests/backend
python3 -m unittest discover -s tests/contracts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
```

The smoke command runs the core backend workflow in process: health, session creation, tiny simulation, manual fault injection, telemetry, alerts, events, replay, and anomalies.

## Local Run Paths

Backend:

```text
python3 -m pip install -r backend/requirements.txt
python3 -m uvicorn backend.app.main:app --reload
curl -s http://127.0.0.1:8000/health
```

Frontend:

```text
cd frontend
npm install
npm run dev
```

Optional Docker Compose local review:

```text
docker compose config
docker compose up --build
```

Compose is local-only review tooling. Do not publish images, deploy, or create cloud resources from this workflow.

## Repository Layout

```text
backend/    Python/FastAPI backend, domain logic, SQLite storage, Dockerfile.
frontend/   React/TypeScript/Vite mission console and Dockerfile.
fixtures/   Human-readable telemetry contracts and examples.
scripts/    Small local generators and smoke verification helpers.
tests/      Backend, contract, and frontend logic tests.
docs/       Architecture, local runbook, readiness docs, staged development path, ADRs, and automation records.
```

## Reviewer Docs

- [Local Runbook](docs/local-runbook.md)
- [Release Readiness](docs/release-readiness.md)
- [API Outline](docs/api-outline.md)
- [Architecture](docs/architecture.md)
- [Development Path](docs/development/README.md)
- [Decision Records](docs/development/decisions/README.md)

## Current Scope

Implemented through Stage 08:

- telemetry contracts and fixture examples;
- deterministic simulation artifacts;
- FastAPI routes for sessions, simulation, telemetry, faults, alerts, events, replay, and anomalies;
- SQLite persistence for local/test workflows;
- fixture-backed mission console with incident and replay/anomaly views;
- local smoke verification and local-only Docker/Compose configuration.

Deferred:

- websocket streaming;
- realtime latency and throughput benchmarks;
- Rust data-plane spike for telemetry ingest, replay indexing, stream fanout, and alert/anomaly hot paths;
- animated replay playback;
- alert acknowledgement and clearing;
- scheduled fault workflows;
- PostgreSQL runtime profile;
- publishing releases, packages, or container images.
