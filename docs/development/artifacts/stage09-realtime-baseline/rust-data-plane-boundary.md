# Stage 09 Rust Data-Plane Boundary

This note defines the narrow implementation boundary for a future Rust
data-plane spike. It is not approval for a whole-project rewrite. The current
Python/FastAPI path remains the measured control plane until a Rust candidate
can emit the same benchmark report shape and beat a specific hot-path target.

## Current Control Plane

Python/FastAPI keeps ownership of:

- session lifecycle and operator-facing API orchestration;
- local review workflows, fixture generation, and deterministic simulation
  setup;
- SQLite-backed persistence used by the current replay and smoke-test path;
- product-shaping behavior while the live console and stream contract are still
  changing.

These paths are allowed to stay Python even after a Rust data-plane service
exists. They optimize for reviewability and iteration speed, not hard realtime
ownership.

## Rust Candidate Boundary

Rust should enter only behind stable contracts for latency-sensitive data-plane
work:

- telemetry ingest validation and sequencing;
- stream fanout, reconnect resume, and bounded client queues;
- replay indexing for bounded time-window queries;
- alert and anomaly hot-path evaluation;
- dropped-event accounting and backpressure reporting.

The first Rust spike should own one of these paths, not the whole API. A good
first candidate is stream fanout with reconnect/backpressure reporting because
the live telemetry contract already defines the websocket envelope and dropped
event shape.

## Contract Inputs And Outputs

A Rust candidate must preserve these public review contracts:

- input workload: the Stage 09 benchmark scenario, seed, sample count, step
  interval, and channel catalog;
- live stream envelope:
  `docs/development/artifacts/stage09-realtime-baseline/stage09-live-telemetry-contract.json`;
- baseline report shape:
  `docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-report.json`;
- summary fields for telemetry sample rate, p95 alert latency, p95 replay query
  latency, dropped-event count, and target gaps.

Any Rust output that cannot be compared through the existing report shape is not
ready to replace a Python hot path.

## Promotion Gates

A Rust candidate may replace a Python data-plane path only after it proves all
of the following in a bounded local smoke:

- it runs without worker fanout beyond the local resource guard;
- it preserves the websocket/live telemetry contract;
- it emits the Stage 09 baseline JSON schema or a versioned compatible schema;
- it reports dropped events explicitly rather than hiding queue overflow;
- it improves at least one missed target or reduces p95 latency without
  regressing dropped-event count.

The current Python baseline intentionally misses the later 100-channel, 10 Hz
per-channel hypothesis. That gap is evidence for a narrow data-plane candidate,
not evidence for a broad rewrite.
