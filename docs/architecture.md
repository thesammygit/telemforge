# TelemForge Architecture

This document describes the target architecture. It does not imply that the modules below already exist in the repository.

## Product Direction

TelemForge is structured as an operator-facing mission-operations sandbox. The core workflow is:

1. simulate subsystem state
2. stream telemetry and events
3. monitor alerts and anomaly indicators
4. inject faults
5. replay notable mission periods

## Planned Backend Modules

- `backend/app/api/`
  Future split route modules as the API grows
- `backend/app/main.py`
  Current FastAPI app factory and synchronous Stage 08 route definitions
- `backend/app/core/`
  configuration, settings, shared dependencies
- `backend/app/domain/`
  simulation, telemetry, alerting, replay, and anomaly logic
- `backend/app/schemas/`
  typed contracts introduced after the fixture format is accepted
- `backend/app/storage/`
  SQLite persistence boundary introduced in Stage 04, PostgreSQL later

## Planned Frontend Areas

- mission overview
- telemetry explorer
- subsystem detail
- fault injection controls
- replay and anomaly views

Frontend implementation will live under `frontend/src/` after the relevant stage begins.

## Planned Fixture Areas

- `fixtures/telemetry/`
  human-readable Stage 02 contract examples for nominal, degraded, alerting, and replay scenarios

## Persistence Targets

- sessions
- simulation runs
- telemetry samples
- alerts
- events
- injected faults
- anomaly outputs derived at request time in Stage 07, persisted later if needed

## Realtime Runtime Direction

The current Python/FastAPI backend is a control-plane and product-shaping layer,
not the final realtime execution core. TelemForge should evolve toward a split
runtime:

- Python/FastAPI for API orchestration, local review workflows, configuration,
  fixtures, and product iteration.
- TypeScript/React for the operator-facing mission console.
- Rust for the data plane once realtime requirements are measured: telemetry
  ingest and validation, stream fanout and backpressure, replay indexing,
  alert/anomaly hot-path evaluation, and protocol/runtime boundaries.

Do not rewrite the whole system just to change language. First add websocket
streaming and a benchmark envelope with explicit latency/throughput targets.
Then introduce Rust in one narrow hot path when the Python implementation or
its concurrency/resource model becomes the limiting factor.

Initial targets should be treated as benchmark hypotheses, not release
guarantees:

- local synthetic stream of at least 100 telemetry channels at 10 Hz;
- p95 alert evaluation under 50 ms for bounded local test windows;
- bounded replay query under 500 ms for a 10-minute local synthetic window;
- no dropped events in the defined single-client local streaming smoke.

## Current State

- Stage 04 has a checked-in FastAPI skeleton with SQLite-backed session and telemetry history.
- Stage 05 has a fixture-backed React/Vite mission console for mission overview, subsystem detail, trend summaries, and alert display.
- Stage 06 has immediate manual thermal/comms faults, threshold-first alerts, event-log persistence, incident query routes, and a fixture-backed console incident timeline.
- Stage 07 has bounded replay-window assembly from existing SQLite telemetry/fault/alert/event records, explainable nominal-envelope anomaly scoring, replay/anomaly API routes, and a fixture-backed console replay overlay.
- Stage 08 has a bounded in-process smoke workflow, local-only Docker/Compose configuration, and reviewer-facing run/readiness docs.
- Stage 02 telemetry contracts and Stage 03 simulation remain the source of the API's baseline telemetry data behavior.
- Websocket streaming, realtime benchmarks, Rust data-plane migration, animated replay playback, background anomaly daemons, alert acknowledgement, scheduled faults, PostgreSQL runtime wiring, deploy, release, and publish behavior remain deferred.
