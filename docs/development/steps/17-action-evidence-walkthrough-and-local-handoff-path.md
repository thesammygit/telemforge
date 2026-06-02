# Stage 17: Action Evidence Walkthrough And Local Handoff Path

## Goal

Turn the Stage 16 review action queue into a deterministic local walkthrough
that binds each action to concrete evidence rows, replay frames, runbook steps,
incident packet/export references, and the next local handoff step.

Stage 16 made local handoff blockers visible. Stage 17 should make those
blockers inspectable from one read-only walkthrough without adding saved
reviewer sessions, persistent notes, action ownership, ticketing, messaging,
identity, report authoring, downloads, or production handoff services.

## Decisions To Make

### Walkthrough Shape

Option A: deterministic action-evidence walkthrough

- derives a selected action and ordered evidence path from the Stage 16 action
  queue, Stage 15 briefing-board evidence rows, Stage 14 decision register,
  Stage 13 replay frames, Stage 12 packet/export data, and Stage 11 runbook
  steps;
- exposes coverage counts, selected-action context, linked evidence rows,
  replay frame references, source paths, and a next local interaction;
- keeps selection local to UI state and does not persist reviewer notes,
  ownership, signoff, or session state.

Option B: editable reviewer workspace

- is useful later, but introduces saved state, reviewer identity, conflict
  semantics, ownership, and audit retention before the local walkthrough
  contract is proven.

Option C: report or export package builder

- risks becoming a downloadable report system, free-form export builder, or
  production handoff mechanism before the evidence path has been tested.

Recommended: start with Option A. Keep editable workspaces and report/export
systems for later stages with explicit risk boundaries.

### Evidence Binding Boundary

Option A: source-backed evidence resolver

- resolves action `evidenceTargets` to briefing-board rows, replay frames,
  runbook links, packet/export references, decision ids, and repo-relative
  source paths;
- marks missing targets as local follow-up evidence gaps instead of silently
  treating them as ready;
- stays deterministic in fixture mode and local-live compatible through the
  existing mission-console state.

Option B: DOM anchor-only navigation

- is simple, but it does not prove the action actually maps to a concrete
  evidence row or replay/packet/export reference.

Recommended: Option A. Stage 17 should prove the data contract first; anchors
can remain a presentation detail.

## Work Items

- add a deterministic local action walkthrough helper, preferably
  `frontend/src/lib/reviewActionWalkthrough.ts`, over the Stage 16 action queue
  and local review evidence surfaces;
- define compact Stage 17 types in
  `frontend/src/features/mission-console/types.ts` for walkthrough schema,
  selected action, evidence links, coverage counts, missing target records, and
  local handoff path summary;
- wire the walkthrough into
  `frontend/src/features/mission-console/consoleViewModel.ts`, with optional
  selected action id support that defaults to the first blocking action, then
  the first available action;
- add local UI state in `frontend/src/App.tsx` for selected review action id;
- surface a compact Stage 17 walkthrough panel in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 16
  action queue, including action selection, evidence path, missing target
  status, next local step, and deferred production boundary notes;
- add focused frontend tests in a new
  `tests/frontend/reviewActionWalkthrough.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` for the new view-model shape;
- keep existing Stage 16, Stage 15, Stage 14, Stage 13, Stage 12, Stage 11,
  Stage 10, and Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 17 artifact under
  `docs/development/artifacts/stage17-action-evidence-walkthrough/` describing
  the walkthrough boundary, source files, verification commands, and deferred
  production features.

## Human Test Gate

A reviewer should be able to:

1. start the local mission console or run focused local tests;
2. inspect the Stage 16 review action queue;
3. select each local review action;
4. see the concrete evidence path for that action, including briefing-board
   rows, replay frames, runbook/packet/export references, source paths, and
   missing target records;
5. follow the next local step without saved reviewer sessions, persistent notes,
   external ticketing, or production handoff services;
6. confirm deferred production scope remains visible but outside the local
   walkthrough contract.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no editable saved reviewer sessions, persistent notes, local note storage, or
  saved action ownership;
- no reviewer signoff workflow, audit retention, or approval identity;
- no external ticketing, messaging, email, or workflow integrations;
- no cloud services, telemetry upload, paid APIs, or browser-cookie import;
- no deploy/release/publish work;
- no production evidence archive or database migration;
- no report designer, downloadable styled report system, free-form export
  builder, or report package writer;
- no broad frontend redesign or new routing shell;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused frontend model tests for deterministic walkthrough construction;
- view-model tests proving selected action id defaults and explicit selection;
- mission-console coverage showing the walkthrough is connected to the Stage 16
  action queue and earlier local evidence surfaces;
- existing Stage 16, Stage 15, Stage 14, Stage 13, Stage 12, Stage 11, Stage
  10, and Stage 09 checks as regression coverage for touched surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- editable state or persistence tests before the local walkthrough contract
  exists;
- external workflow integrations, ticketing, auth, production signoff, report
  authoring, or cloud-backed handoff primitives.

## Exit Criteria

- one deterministic local action-evidence walkthrough is source-backed and
  visible/testable;
- every Stage 16 queue action can be selected or defaulted deterministically;
- the selected action exposes linked evidence rows, replay frame ids, runbook
  targets, packet/export references, source paths where available, and a next
  local step;
- missing evidence targets are explicit local follow-up gaps, not hidden
  failures;
- deferred production scope remains visible and non-blocking for local
  walkthroughs;
- mission-console UI exposes the walkthrough without a broad redesign;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into editable reviewer workspaces,
  saved sessions, identity, collaboration, external ticketing, production
  signoff, deploy/release, persistence, or report authoring.
