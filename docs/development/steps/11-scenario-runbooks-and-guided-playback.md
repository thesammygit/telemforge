# Stage 11: Scenario Runbooks And Guided Playback

## Goal

Turn the local mission console and completed operator lifecycle into repeatable
review scenarios that a human can start, step through, and explain without
reverse-engineering fixture files or API calls.

Stage 10 proved a local alert can move from active to acknowledged to resolved.
Stage 11 should package that capability into guided mission playback so the
product demonstrates an operator workflow, not only isolated controls.

## Decisions To Make

### First Runbook Shape

Option A: guided local scenario catalog

- keeps the first runbook deterministic and easy to test;
- can reuse the Stage 05/06/07 fixtures plus Stage 10 lifecycle helpers;
- gives reviewers a visible path through alert triage, acknowledgement,
  resolution, timeline, and replay markers.

Option B: free-form runbook authoring

- is more powerful, but introduces schema editing, validation UI, and persistence
  questions too early.

Option C: exported incident report only

- is useful after playback works, but does not help the reviewer perform the
  workflow in the product.

Recommended: start with Option A. Keep authoring, sharing, and report export as
later stages unless a bounded slice naturally falls out of the local catalog.

### Data Boundary

Option A: local fixture/API-backed runbook definitions

- safe for the public repo and local automation;
- avoids credentials, cloud storage, user identity, and external services;
- supports focused tests in backend and frontend code.

Option B: account-backed collaborative scenarios

- belongs after auth and collaboration have their own stage.

Recommended: Option A. Stage 11 should prove the runbook interaction and
reviewer flow, not production collaboration.

## Work Items

- add a local scenario/runbook catalog with one thermal-alert response scenario;
- expose a guided playback surface in the mission console without a broad
  redesign;
- bind the first runbook to fixture mode and, where already supported, explicit
  local-live mode;
- show step state for alert raised, acknowledged, resolved, event history, and
  replay inspection;
- keep Stage 09 live stream refresh behavior and Stage 10 operator lifecycle
  behavior intact;
- write focused backend/frontend tests for the runbook catalog and playback
  view model;
- add a public-safe Stage 11 artifact under
  `docs/development/artifacts/stage11-scenario-runbooks/` that records the
  boundary, source files, verification commands, and deferred production
  features.

## Human Test Gate

A reviewer should be able to:

1. start the local mission console or run the focused local tests;
2. select the thermal-alert response runbook;
3. step through alert triage, acknowledgement, resolution, event history, and
   replay inspection;
4. see which steps are complete and which action is next;
5. read a short artifact explaining what is local-only and what remains
   deferred.

## Non-Goals

- no production authentication, accounts, or multi-operator collaboration;
- no cloud services, telemetry upload, paid APIs, or browser-cookie import;
- no deploy/release/publish work;
- no full runbook authoring system;
- no incident report export unless it is only a small artifact from the first
  local runbook;
- no broad frontend redesign;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused backend tests for a local runbook catalog route or domain helper;
- focused frontend model tests for runbook steps, current step, and completion
  state;
- existing Stage 10 acknowledgement/resolution tests as regression checks;
- existing Stage 09 live-console adapter tests when playback touches stream
  merge behavior;
- public-repo guard before any push.

Avoid:

- dependency installation solely for UI polish;
- broad snapshot tests that do not explain operator behavior;
- new storage/auth/collaboration primitives before the guided local workflow
  exists.

## Exit Criteria

- one local scenario runbook is source-backed and visible/testable;
- the runbook guides a reviewer through alert triage, acknowledgement,
  resolution, event history, and replay inspection;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into authoring, collaboration, auth,
  report export, or production persistence.
