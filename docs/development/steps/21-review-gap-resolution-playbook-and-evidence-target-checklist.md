# Stage 21: Review Gap Resolution Playbook And Evidence Target Checklist

## Goal

Turn the Stage 20 local review gap triage into a deterministic resolution
playbook and evidence target checklist for the next local review pass.

Stage 20 ranks local blockers and separates deferred production boundaries.
Stage 21 should help a reviewer inspect the top local blockers, understand
which evidence targets or source buckets need another pass, and follow a static
repo-relative proof checklist. It must stay local, deterministic, and
read-only: no saved reviewer progress, persistence, ownership, signoff,
ticketing, report exports, executable command runners, shell automation panels,
or production handoff services.

## Decisions To Make

### Resolution Surface Shape

Option A: deterministic local gap resolution playbook

- derives resolution rows from Stage 20 next-pass items;
- selects actionable local blockers before ready rows and deferred production
  boundaries;
- exposes source matrix row ids, action ids, source buckets, proof command
  references, evidence target checklist rows, and a next local proof step;
- keeps reviewer progress unsaved and non-persistent.

Option B: saved reviewer resolution tracker

- would introduce local storage, identity, ownership, audit semantics, and
  progress recovery before the resolution contract is proven.

Option C: ticket or report export handoff

- would cross into external workflow and handoff package semantics before the
  local blocker resolution loop is stable.

Recommended: start with Option A. Keep the first pass source-backed and
fixture-first so the behavior can be tested without production services.

### Evidence Target Boundary

Option A: static evidence target checklist

- lists target evidence rows and proof commands as static text references;
- maps each target to Stage 20 triage items and Stage 19 matrix rows;
- marks production-only boundaries as deferred and non-actionable.

Option B: command runner or shell action panel

- would cross into process control, command execution UX, and production gate
  expectations.

Recommended: Option A. Stage 21 should tell the reviewer what to inspect and
which local commands prove the path, not execute commands for them.

## Work Items

- add a deterministic local gap resolution helper, preferably
  `frontend/src/lib/reviewGapResolution.ts`, over the Stage 20 review gap
  triage view;
- define compact Stage 21 types in
  `frontend/src/features/mission-console/types.ts` for resolution playbook
  rows, evidence target checklist rows, proof command references, local
  resolution summaries, and deferred boundary notes;
- wire the resolution playbook into
  `frontend/src/features/mission-console/consoleViewModel.ts` without changing
  fixture/local-live boundaries;
- surface a compact Stage 21 resolution checklist panel in
  `frontend/src/features/mission-console/MissionConsole.tsx`, near the Stage 20
  next-pass panel;
- update `frontend/src/styles/global.css` only as needed for the compact panel;
- add focused frontend tests in a new
  `tests/frontend/reviewGapResolution.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` for the new view-model shape;
- keep existing Stage 20 through Stage 09 behavior covered by focused
  regression tests;
- add a public-safe Stage 21 artifact under
  `docs/development/artifacts/stage21-review-gap-resolution/` describing the
  resolution boundary, source files, verification commands, and deferred
  production features.

## Human Test Gate

A reviewer should be able to:

1. inspect the Stage 20 next local review pass panel;
2. read the Stage 21 resolution playbook rows;
3. confirm actionable local blockers appear before deferred production-only
   scope;
4. see which evidence targets, source matrix rows, source buckets, and proof
   commands support each local resolution row;
5. identify the next static local proof step for the top blocker;
6. confirm deferred production scope remains visible but non-actionable;
7. complete the local resolution review without saved reviewer sessions,
   persistent notes, ownership, external ticketing, report exports, signoff, or
   executable command panels.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no editable saved reviewer sessions, persistent notes, local note storage, or
  saved action ownership;
- no reviewer signoff workflow, audit retention, approval identity, or
  production readiness certification;
- no external ticketing, messaging, email, or workflow integrations;
- no cloud services, telemetry upload, paid APIs, or browser-cookie import;
- no deploy/release/publish work;
- no production evidence archive or database migration;
- no report designer, downloadable styled report system, free-form export
  builder, report package writer, handoff report exports, or production
  handoff package;
- no executable command runner, shell automation panel, or production gate;
- no broad frontend redesign or new routing shell;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused frontend model tests for deterministic resolution row construction;
- view-model tests proving the resolution playbook is connected to Stage 20
  triage and Stage 19 matrix rows;
- mission-console coverage showing the resolution checklist panel is visible
  without changing local-live behavior;
- assertions that proof commands remain static, repo-relative, and
  non-executable;
- existing Stage 20 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- editable state, saved progress, local storage, or persistence tests before
  the local resolution contract exists;
- external workflow integrations, ticketing, auth, production signoff, report
  authoring, report exports, cloud-backed handoff primitives, or deploy work;
- command execution UI or a task runner.

## Exit Criteria

- one deterministic local review gap resolution model is source-backed and
  visible/testable;
- resolution rows are derived from Stage 20 triage items, not ad hoc UI
  strings;
- local blockers, evidence targets, proof commands, source buckets, and next
  local proof steps are explicit;
- deferred production scope remains visible, non-actionable, and outside the
  local resolution checklist;
- mission-console UI exposes the resolution checklist without a broad redesign;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved reviewer progress,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, or executable
  command automation.
