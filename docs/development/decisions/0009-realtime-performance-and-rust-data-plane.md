# ADR-009: Realtime Performance And Rust Data Plane Direction

## Status

Accepted

## Date

2026-05-03

## Context

Stages 01 through 08 made TelemForge reviewable as a local mission-ops sandbox:
contracts, deterministic simulation, FastAPI routes, SQLite persistence,
faults, alerts, replay/anomaly inspection, a fixture-backed console, Docker
configuration, and smoke tests.

That is enough for product discovery and local review, but it is not enough to
claim credible realtime behavior. A time-sensitive telemetry system needs
explicit latency, throughput, backpressure, replay, and alert-evaluation
targets. It also needs a runtime model that can make strong safety and
concurrency guarantees for hot paths.

## Options Considered

### Option A: Keep The Whole Runtime In Python

- Keeps iteration fast while the domain model and UI are still changing.
- Works for synchronous API control-plane behavior and local demos.
- Does not provide Rust's compile-time ownership, memory-safety, and
  concurrency guarantees for sustained realtime data-plane work.

### Option B: Rewrite The Project In Rust Immediately

- Aligns early with the likely serious-runtime language.
- Risks freezing product behavior before telemetry, replay, UI, and operator
  workflows are proven.
- Slows down staged review and broad feature discovery.

### Option C: Keep Python As Control Plane, Move Toward A Rust Data Plane

- Preserves fast product iteration in Python/FastAPI and TypeScript/React.
- Makes Rust the tracked target for telemetry hot paths where safety,
  predictable resource ownership, and concurrency correctness matter.
- Lets benchmarks decide when a narrow Rust slice is worth introducing.

## Decision

Use Option C.

TelemForge's credible realtime architecture should converge toward a Rust data
plane for:

- telemetry ingest and validation;
- stream fanout, reconnect, and backpressure;
- replay indexing and bounded replay queries;
- alert and anomaly hot-path evaluation;
- binary/protocol/runtime boundaries.

Python/FastAPI remains acceptable for API orchestration, local review workflows,
configuration, fixture generation, and product-shaping work. Rust should not be
introduced as a broad rewrite. It should enter through a narrow, benchmarked
hot path once the streaming and performance envelope is explicit.

## Consequences

- The automation loop should not treat the current Python backend as the final
  realtime runtime.
- The next stages should add websocket streaming and benchmark targets before a
  Rust integration.
- Architecture discussions should separate data plane from control plane.
- Rust work should be small, measurable, and reversible until it proves value.

## Validation

Before any Rust implementation is considered successful, TelemForge should have
at least one lightweight benchmark or smoke command that measures:

- telemetry channel count and sample rate;
- stream fanout behavior for at least one local client;
- p95 alert-evaluation latency;
- bounded replay query latency;
- dropped-event count under the defined local load.

Initial benchmark hypotheses:

- at least 100 telemetry channels at 10 Hz in a local synthetic stream;
- p95 alert evaluation under 50 ms for bounded local test windows;
- replay query under 500 ms for a 10-minute local synthetic window;
- zero dropped events in the defined single-client local streaming smoke.
