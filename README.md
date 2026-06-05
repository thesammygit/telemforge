# TelemForge

TelemForge is an open-source synthetic telemetry and mission-operations sandbox. The current workspace includes a local FastAPI backend, SQLite persistence, deterministic telemetry simulation, bounded websocket telemetry streaming, manual alert acknowledgement and resolution workflows, replay/anomaly inspection, guided scenario playback, incident review packets and evidence export, deterministic replay playback timelines, and a fixture-backed React/Vite mission console with a local review decision register.

## Quick Verification

From the repository root:

```text
python3 scripts/smoke_stage08.py
python3 scripts/benchmark_stage09_realtime.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-report.json
python3 scripts/verify_stage09_baseline_bundle.py
python3 -m unittest discover -s tests/backend -p 'test_stage09_live_stream.py'
python3 -m unittest discover -s tests/backend -p 'test_stage10_alert_acknowledgement.py'
python3 -m unittest discover -s tests/backend -p 'test_stage10_alert_resolution.py'
python3 -m unittest discover -s tests/backend -p 'test_stage11_scenario_runbooks.py'
python3 -m unittest discover -s tests/backend -p 'test_stage12_incident_review_packets.py'
python3 -m unittest discover -s tests/backend -p 'test_stage12_incident_review_exports.py'
python3 -m unittest discover -s tests/backend
python3 -m unittest discover -s tests/contracts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
node --experimental-strip-types --test tests/frontend/liveTelemetryStream.test.ts
node --experimental-strip-types --test tests/frontend/stage09LiveConsoleAdapter.test.ts
node --experimental-strip-types --test tests/frontend/incidentReviewPackets.test.ts
node --experimental-strip-types --test tests/frontend/scenarioRunbooks.test.ts
node --experimental-strip-types --test tests/frontend/reviewDecisionRegister.test.ts
```

The smoke command runs the core backend workflow in process: health, session creation, tiny simulation, manual fault injection, telemetry, alerts, events, replay, and anomalies.
The Stage 09 benchmark command records the current Python/FastAPI realtime baseline and keeps Rust tracked as a future data-plane direction, not a whole-project rewrite.

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

Implemented through the current Stage 48 review-ready slices:

- telemetry contracts and fixture examples;
- deterministic simulation artifacts;
- FastAPI routes for sessions, simulation, telemetry, faults, alerts, events, replay, and anomalies;
- SQLite persistence for local/test workflows;
- fixture-backed mission console with incident and replay/anomaly views;
- local smoke verification and local-only Docker/Compose configuration.
- websocket telemetry streaming with bounded runtime evidence for snapshot, monotonic sequence, reconnect resume, backpressure reporting, two-client fanout, and sustained-load smoke;
- reviewable Stage 09 benchmark/baseline artifacts plus a target-scale Rust data-plane candidate kept behind explicit measurement boundaries;
- local live-console websocket binding behind explicit `VITE_TELEMFORGE_API_BASE_URL` and `VITE_TELEMFORGE_LIVE_SESSION_ID` configuration, with fixture fallback as the default mode.
- local alert acknowledgement and resolution flows for the thermal-alert review path;
- deterministic scenario runbook playback and compact guided mission-console review states;
- incident review packets plus deterministic local evidence export payloads;
- replay playback frames and a compact review timeline tied back to runbook and packet evidence;
- a deterministic local review decision register and handoff checklist for the existing thermal-alert review flow;
- deterministic local review briefing, action, proof, and handoff surfaces through Stage 27, including the briefing board, action queue, walkthrough path, readiness script, coverage matrix, gap triage/resolution, readiness summary, outcome board, proof packet, and human test gate;
- deterministic local review proof, observation, and handoff surfaces through Stage 48, including proof navigation/crosswalks, surface indexing, walkthroughs, observation lens/coverage/citations/boundaries/storyline, and the handoff deck, coverage, questions, agenda, path, dry run, debrief, continuity, drift, calibration, and synthesis views;
- local review and handoff surfaces remain deterministic, local-only, non-persistent, and non-certifying by design.

Deferred:

- manual fast-forward of `main` remains a separate human integration gate after automation-branch review;
- any production claim for broad load behavior, live operations, or Rust control-plane replacement;
- a fuller animated replay engine beyond the current compact local timeline;
- scheduled fault workflows;
- PostgreSQL runtime profile;
- authentication, saved reviewer sessions, saved review progress, saved synthesis/calibration/drift state, collaboration identity, or persistent reviewer notes;
- signoff/audit retention, owner assignment, report or handoff package export, external ticketing, messaging, or cloud-backed handoff workflows;
- publishing releases, packages, or container images.
