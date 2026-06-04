# Stage 20: Review Gap Triage And Next-Pass Plan

## Goal

Turn the Stage 19 local review coverage matrix into a deterministic gap triage
summary and next-pass plan that helps a reviewer decide which local follow-up
to run first.

Stage 19 made coverage visible row by row. Stage 20 should group the remaining
local blockers, deferred production boundaries, and supporting source buckets
into a compact local next-pass plan. It must stay deterministic and read-only:
no saved reviewer progress, persistence, ownership, signoff, ticketing, report
exports, executable command runners, or production handoff services.

## Decisions To Make

### Gap Triage Shape

Option A: deterministic local gap triage

- derives gap groups from the Stage 19 coverage matrix rows;
- separates local blockers from deferred production scope;
- ranks local follow-up items using explicit, stable rules;
- exposes source rows, suggested next local action, proof commands, and why the
  item is blocked or ready.

Option B: editable reviewer task board

- would be useful later, but it introduces saved state, ownership, persistence,
  review identity, and audit expectations before the local triage contract is
  proven.

Option C: external ticket export

- risks pulling the project into ticketing, messaging, report export, and
  production handoff semantics before local review gaps are modeled.

Recommended: start with Option A. Keep the first pass deterministic and
source-backed so it can be verified with focused tests.

### Next-Pass Boundary

Option A: static local next-pass plan

- lists recommended local follow-up items in priority order;
- maps each item to matrix rows, source evidence, and proof commands;
- marks production-only work as deferred rather than actionable.

Option B: executable command runner

- would cross into shell automation, local process control, and production gate
  expectations.

Recommended: Option A. Stage 20 should tell a reviewer what to run or inspect
next, not run commands for them.

## Work Items

- add a deterministic local gap triage helper, preferably
  `frontend/src/lib/reviewGapTriage.ts`, over the Stage 19 coverage matrix;
- define compact Stage 20 types in
  `frontend/src/features/mission-console/types.ts` for triage groups,
  next-pass items, proof command references, local blocker summaries, and
  deferred production boundaries;
- wire the triage model into
  `frontend/src/features/mission-console/consoleViewModel.ts` without changing
  fixture/local-live boundaries;
- surface a compact Stage 20 next-pass panel in
  `frontend/src/features/mission-console/MissionConsole.tsx`, near the Stage 19
  coverage matrix panel;
- update `frontend/src/styles/global.css` only as needed for the compact panel;
- add focused frontend tests in a new
  `tests/frontend/reviewGapTriage.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` for the new view-model shape;
- keep existing Stage 19 through Stage 09 behavior covered by focused
  regression tests;
- add a public-safe Stage 20 artifact under
  `docs/development/artifacts/stage20-review-gap-triage/` describing the
  triage boundary, source files, verification commands, and deferred production
  features.

## Human Test Gate

A reviewer should be able to:

1. inspect the Stage 19 coverage matrix;
2. read the Stage 20 gap triage groups;
3. confirm local blockers are ranked before deferred production-only scope;
4. see which matrix rows and source buckets support each next-pass item;
5. identify the static proof commands for the next local review pass;
6. confirm production-only work remains visible but non-actionable;
7. complete the local triage pass without saved reviewer sessions, persistent
   notes, ownership, external ticketing, report exports, signoff, or executable
   command panels.

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
  builder, report package writer, handoff report exports, or production handoff
  package;
- no executable command runner, shell automation panel, or production gate;
- no broad frontend redesign or new routing shell;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused frontend model tests for deterministic gap triage construction;
- view-model tests proving the triage is connected to the Stage 19 coverage
  matrix;
- mission-console coverage showing the next-pass panel is visible without
  changing local-live behavior;
- assertions that proof commands remain static, repo-relative, and
  non-executable;
- existing Stage 19 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- editable state or persistence tests before the local triage contract exists;
- external workflow integrations, ticketing, auth, production signoff, report
  authoring, report exports, cloud-backed handoff primitives, or deploy work;
- command execution UI or a task runner.

## Exit Criteria

- one deterministic local review gap triage model is source-backed and
  visible/testable;
- triage groups are derived from Stage 19 coverage matrix rows, not ad hoc UI
  strings;
- local blockers, deferred production scope, proof commands, source buckets,
  and next local steps are explicit;
- the next-pass plan is visible, static, repo-relative, and non-executable;
- mission-console UI exposes the triage without a broad redesign;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved reviewer progress,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, or executable
  command automation.
