# Stage 04: API Skeleton And Storage

## Goal

Wrap the validated data model and simulation outputs in a thin API and storage layer.

## Decisions To Make

### Persistence Timing

Option A: in-memory only first

- simpler
- weaker replay foundation

Option B: add persistence now once contracts are stable

- better for history and replay
- more setup

Recommended: `Option B`, but keep the schema minimal.

### Database Choice

Option A: SQLite for earliest local iteration

- simplest setup
- good for local dev and tests

Option B: PostgreSQL from the start

- closer to intended runtime
- more overhead

Recommended: support `SQLite` locally and tests, `PostgreSQL` for compose/runtime.

## Work Items

- add mission/session storage
- add telemetry, alert, fault, and event tables or equivalents
- expose small query endpoints
- keep the runtime synchronous enough to debug easily

## Human Test Gate

A reviewer should be able to:

- call a route and inspect sensible JSON
- see stored history after a simulated run
- understand the schema without reverse engineering

## Test Preference

Favor:

- API contract tests
- database round-trip tests
- minimal startup/health tests

## AI Teaching Agenda

- explain why storage is being introduced now
- explain table choices and what is intentionally deferred

## Exit Criteria

- small API routes work
- persisted history can be queried
- the storage model has been reviewed
