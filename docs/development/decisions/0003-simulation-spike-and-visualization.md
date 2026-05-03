# ADR-003: Simulation Spike And Visualization

## Status

Accepted

## Date

2026-04-30

## Context

Stage 03 needs proof that TelemForge can generate believable telemetry behavior before the project adds FastAPI routes, persistence, websocket streaming, replay execution, anomaly scoring, or frontend UI. The work should remain deterministic, small, and human-inspectable so a reviewer can compare nominal and degraded behavior directly.

Stage 02 already defined the telemetry channel catalog and typed fixture contracts. Stage 03 should consume those channel definitions rather than inventing another telemetry shape.

## Options Considered

### Option A: Embed Simulation In The Future API

- Minimizes the first file count.
- Makes the behavior harder to inspect without service runtime code.
- Blurs Stage 03 with Stage 04 API work.

### Option B: Standalone Python Domain Module Plus Script Runner

- Keeps simulation deterministic and testable without a server.
- Lets generated CSV, summary JSON, and SVG artifacts be inspected directly.
- Fits the accepted Python/FastAPI stack while deferring FastAPI itself.

### Option C: Add A Plotting Dependency Immediately

- Could produce richer visual output faster.
- Adds dependency management before the project has a runnable app or package file.
- Is unnecessary for the first bounded proof.

## Decision

Use a stdlib-only standalone simulation module in `backend/app/domain/telemetry_simulation.py` and a small runner in `scripts/generate_stage03_simulation.py`.

The simulation accepts:

- the Stage 02 channel catalog from `fixtures/telemetry/channels.json`;
- an explicit seed;
- a fixed timestep;
- a small sample count;
- a scenario name.

Stage 03 generates:

- `nominal-orbit-daylight.csv`
- `nominal-orbit-daylight-summary.json`
- `degraded-eclipse-thermal-comms.csv`
- `degraded-eclipse-thermal-comms-summary.json`
- `stage03-comparison.svg`
- `README.md`

The committed default output lives in `docs/development/artifacts/stage03-simulation/`.

## Consequences

- Human review can focus on data signatures before service and UI code exist.
- Tests can assert determinism, value envelopes, and scenario divergence with only Python stdlib.
- The degraded scenario tells one operational story: eclipse reduces solar current, battery voltage trends downward, avionics temperature rises, downlink SNR drops, and packet error rate rises.
- The SVG plot is intentionally simple. A charting library can be reconsidered later if hand-built plots become the bottleneck.

## Deferred

- FastAPI endpoints.
- SQLite/PostgreSQL persistence.
- Websocket streaming.
- Frontend mission console UI.
- Replay execution.
- Anomaly scoring.
- Docker, deploy, release, or publish behavior.

## Validation

A reviewer should be able to run:

```text
python3 scripts/generate_stage03_simulation.py --samples 12 --step-seconds 10 --seed 4242
python3 -m unittest tests/backend/test_telemetry_simulation.py
```

Then inspect:

```text
docs/development/artifacts/stage03-simulation/stage03-comparison.svg
docs/development/artifacts/stage03-simulation/degraded-eclipse-thermal-comms-summary.json
```
