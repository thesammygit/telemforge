# Stage 10: Operator Workflow And Incident Lifecycle

## Goal

Turn the verified realtime/replay/alert primitives into a coherent local
operator workflow that a reviewer can run and understand end-to-end.

Stage 09 proved that live telemetry can stream and be measured. Stage 10 should
make the product feel like a mission-operations tool instead of a collection of
technical proofs.

## Decisions To Make

### First Operator Workflow

Option A: alert acknowledgement and incident lifecycle

- gives the console a practical operator action loop
- builds directly on Stage 06 alerts/events and Stage 09 live status
- keeps scope local and testable

Option B: scenario runbooks and guided mission playback

- improves demo clarity
- may be mostly documentation/UI before it changes system behavior

Option C: replay bookmark / investigation workflow

- builds on Stage 07 replay/anomaly work
- useful, but less immediate than making live alerts actionable

Recommended: start with Option A, then add scenario/runbook packaging when the
acknowledgement loop has a human-testable path.

### Persistence Boundary

Option A: keep acknowledgement state local to SQLite and API routes for now

- fits current local sandbox
- easy to test without credentials or services

Option B: introduce accounts, auth, or multi-operator state

- closer to production, but too broad for this stage

Recommended: Option A. Auth, identity, and collaboration belong in a later
stage.

## Work Items

- inspect existing alert, event, fault, replay, and mission-console behavior;
- add a local operator acknowledgement/incident lifecycle slice if the current
  code supports it cleanly;
- surface the workflow in the mission console without redesigning the whole UI;
- keep fixture fallback and local live-stream behavior intact;
- write focused backend/frontend tests for the new workflow;
- add a public-safe Stage 10 artifact under
  `docs/development/artifacts/stage10-operator-workflows/` that records the
  boundary, source files, test commands, and deferred production features;
- update reviewer docs with one human-testable flow.

## Human Test Gate

A reviewer should be able to:

1. start the local backend/frontend or run the focused local tests;
2. see an alert or incident state in the console;
3. acknowledge or otherwise advance that state through the local operator
   workflow;
4. verify that event/history behavior remains inspectable;
5. read a short artifact explaining what is local-only and what remains deferred.

## Non-Goals

- no production authentication or user accounts;
- no cloud services, telemetry upload, paid APIs, or browser-cookie import;
- no deploy/release/publish work;
- no Rust control-plane replacement;
- no broad frontend redesign;
- no broad load testing beyond focused local checks;
- no main-branch fast-forward unless a maintainer separately approves integration.

## Test Preference

Favor:

- focused backend route/domain tests for acknowledgement/incident state;
- focused frontend model/adapter tests for visible operator status;
- existing Stage 09 stream binding tests as regression checks when relevant;
- public-repo guard before any push.

Avoid:

- whole-suite or dependency-install work when focused tests explain the behavior;
- adding new dependencies solely to implement UI polish;
- reopening Stage 09 proof gates unless a real regression is found.

## Exit Criteria

- one local operator workflow is source-backed and visible/testable;
- fixture and explicit-local-live modes still have a safe fallback;
- a reviewer-facing runbook or artifact explains the workflow;
- focused tests and public-repo guard pass;
- the next stage is clearly separated if the next work is collaboration, auth,
  deploy, production data-plane integration, or scenario-authoring breadth.
