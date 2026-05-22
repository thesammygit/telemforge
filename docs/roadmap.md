# TelemForge Roadmap

This file now acts as the short-form roadmap. The detailed, human-reviewable build path lives in [docs/development/README.md](development/README.md).

## Build Order

1. keep the repo implementation-free until the working agreement and stack choices are reviewed
2. choose the working stack and repo conventions
3. define telemetry contracts and static fixture data
4. build the deterministic simulation in isolation with visible outputs
5. add API boundaries and persistence around validated data flows
6. ship a live mission console against known-good sample data, then live data
7. add faults, alerts, and event logging with human-observable behavior
8. add replay and anomaly scoring only after history is trustworthy
9. harden, dockerize, and document the operating workflow
10. add live websocket telemetry with reconnect and backpressure behavior
11. define and benchmark the realtime performance envelope
12. move telemetry ingest, replay indexing, stream fanout, and alert/anomaly hot paths toward a Rust data plane when measured needs justify it
13. continue with new numbered stages for each distinct operator workflow, runtime integration, persistence/collaboration, scenario-authoring, deployment, or demo-readiness milestone

## Guiding Principle

Every stage should be:

- human testable
- reviewable for logic before the next stage begins
- teachable by the AI agent with options and tradeoffs, not just implementation

## Realtime Direction

TelemForge should not settle as a Python-only demo. The current FastAPI and
SQLite stack is acceptable while product behavior is still being shaped, but
the credible realtime architecture should converge toward a Rust data plane for
bounded-latency telemetry work.

Rust is tracked as the serious-runtime direction for:

- telemetry ingest and validation;
- stream fanout, reconnect, and backpressure boundaries;
- replay indexing and bounded replay query paths;
- alert and anomaly hot-path evaluation;
- binary/protocol/runtime boundaries where memory safety and concurrency
  correctness matter.

Python can remain useful for orchestration, API control-plane behavior,
reviewer workflows, fixtures, and early product iteration. The migration should
be benchmark driven: add explicit latency and throughput targets first, then
move narrow hot paths to Rust rather than rewriting the whole system at once.


## Continuous Stage Policy

TelemForge development should continue indefinitely on the automation branch, but
not inside one overloaded stage. When a stage satisfies its exit criteria, the
next safe work should move to a new numbered stage with its own goal, non-goals,
human test gate, and exit criteria.

Stage 09 is review-ready for automation-branch development. The next active
product lane is Stage 10: operator workflow and incident lifecycle.
