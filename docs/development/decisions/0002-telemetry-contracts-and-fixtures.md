# ADR-002: Telemetry Contracts And Fixtures

## Status

Accepted

## Date

2026-04-30

## Context

Stage 02 needs stable telemetry data shapes before TelemForge adds simulation, API routes, persistence, websocket streaming, replay behavior, anomaly behavior, or frontend UI. The contracts must be easy for a human to inspect and useful for backend and frontend work in later stages.

## Options Considered

### Option A: Python Models Only

- Fast to validate backend assumptions.
- Harder for frontend and documentation review because examples are hidden in code.

### Option B: JSON Fixtures Plus Typed Models

- Keeps the examples visible in `fixtures/telemetry/`.
- Lets tests validate the examples with typed Python contracts.
- Supports later backend and frontend work from the same known-good payloads.

### Option C: OpenAPI-First Only

- Useful once FastAPI endpoints exist.
- Premature before Stage 04 because Stage 02 has no runtime API surface.

## Decision

Use JSON fixtures plus stdlib-only Python dataclass contracts.

Stage 02 defines:

- telemetry channel metadata with subsystem ownership, units, cadence, nominal ranges, warning ranges, and critical ranges;
- telemetry points used by static snapshot fixtures;
- alert records attached to degraded telemetry;
- fault injection request shape as data only;
- replay payload shape as data only.

The fixture set is intentionally small and human-readable:

- `fixtures/telemetry/channels.json`
- `fixtures/telemetry/nominal_snapshot.json`
- `fixtures/telemetry/degraded_snapshot.json`
- `fixtures/telemetry/fault_request.json`
- `fixtures/telemetry/replay_payload.json`

## Consequences

- Later stages can build simulation, API, storage, websocket, replay, and UI behavior against explicit example payloads.
- Contract validation can run without installing FastAPI, Pydantic, Node, or database dependencies.
- Stage 02 does not decide transport, persistence, alert-generation logic, replay execution, anomaly scoring, or UI presentation details.

## Validation

A reviewer should be able to inspect the fixture files and answer:

- Which subsystems have starter telemetry channels?
- What units, ranges, and cadence does each channel use?
- What makes the degraded snapshot operationally different from nominal?
- Which channels does the fault request target?
- What points and alerts would a replay payload expose to a later replay engine?
