# Stage 02: Telemetry Contracts And Fixtures

## Goal

Define the data model before live generation.

## Why This Stage Exists

Telemetry systems fail when structure is implicit. Before simulation logic, decide what a point, event, alert, fault, and replay slice look like.

## Decisions To Make

### Contract Format

Option A: Python models only

- quick for backend work
- less visible to frontend-first review

Option B: JSON fixtures plus typed models

- easy for humans to inspect
- supports backend and frontend in parallel

Option C: OpenAPI-first only

- strong API discipline
- less useful for early data review without example payloads

Recommended: `Option B`.

### Channel Granularity

Option A: many channels early

- rich realism
- harder to review

Option B: small starter set per subsystem

- easier to reason about
- enough to validate the model

Recommended: `Option B`.

## Work Items

- define telemetry channel shape
- define alert record shape
- define fault injection request shape
- define replay payload shape
- add realistic sample fixtures for nominal and degraded cases

## Human Test Gate

A reviewer should inspect the fixtures and answer:

- do the names make operational sense
- are units and ranges sensible
- can I understand the system without reading the code
- do nominal and degraded states look meaningfully different

## Test Preference

Favor:

- fixture validation
- schema tests
- snapshot-like comparisons for example payloads

## AI Teaching Agenda

- explain why stable contracts make later UI/backend work easier
- explain how to pick the first channel set without overcommitting

## Exit Criteria

- contracts exist
- sample fixtures exist
- a human has reviewed the fixtures for plausibility
