# Stage 22: Review Pass Readiness Summary And Local Evidence Map

## Goal

Turn the Stage 21 local review gap resolution playbook into a deterministic
review-pass readiness summary and local evidence map that a reviewer can use to
decide whether the next local review pass is ready to run.

Stage 21 maps local blockers to static evidence targets and proof commands.
Stage 22 should summarize those targets into one compact read-only pass view:
what is ready, what still needs local proof, which source rows support it, and
which production-only boundaries remain deferred. It must stay local,
deterministic, and non-executable: no saved reviewer progress, persistence,
ownership, signoff, ticketing, report exports, command runners, shell panels, or
production handoff services.

## Decisions To Make

### Readiness Surface Shape

Option A: deterministic local review-pass readiness summary

- derives readiness rows from Stage 21 resolution rows and evidence targets;
- groups local proof targets, ready rows, and deferred production boundaries;
- exposes source matrix rows, source action ids, evidence target ids, proof
  command references, and a next static review-pass step;
- keeps reviewer progress unsaved and non-persistent.

Option B: saved review-pass tracker

- would introduce local storage, identity, ownership, audit semantics, and
  progress recovery before the readiness contract is proven.

Option C: report export or signoff package

- would cross into report authoring, approval identity, retention, and external
  handoff semantics before the local readiness summary is stable.

Recommended: start with Option A. Keep the first pass source-backed and
fixture-first so it can be tested without production services.

### Evidence Map Boundary

Option A: static local evidence map

- lists the source rows, source buckets, evidence targets, and proof commands as
  static text references;
- maps each readiness row back to Stage 21 resolution rows and Stage 19 matrix
  rows;
- marks production-only boundaries as deferred and non-actionable.

Option B: executable checklist or shell action panel

- would cross into process control, command execution UX, and production gate
  expectations.

Recommended: Option A. Stage 22 should make the local review pass easier to
inspect, not execute commands or store pass state.

## Work Items

- add a deterministic local review-pass readiness helper, preferably
  `frontend/src/lib/reviewPassReadiness.ts`, over the Stage 21 review gap
  resolution view;
- define compact Stage 22 types in
  `frontend/src/features/mission-console/types.ts` for readiness rows, evidence
  map rows, static review-pass checklist items, proof command references, and
  deferred boundary notes;
- wire the readiness summary into
  `frontend/src/features/mission-console/consoleViewModel.ts` without changing
  fixture/local-live boundaries;
- surface a compact Stage 22 review-pass readiness and evidence-map panel in
  `frontend/src/features/mission-console/MissionConsole.tsx`, near the Stage 21
  resolution checklist panel;
- update `frontend/src/styles/global.css` only as needed for the compact panel;
- add focused frontend tests in a new
  `tests/frontend/reviewPassReadiness.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` for the new view-model shape;
- keep existing Stage 21 through Stage 09 behavior covered by focused
  regression tests;
- add a public-safe Stage 22 artifact under
  `docs/development/artifacts/stage22-review-pass-readiness/` describing the
  readiness boundary, source files, verification commands, and deferred
  production features.

## Human Test Gate

A reviewer should be able to:

1. inspect the Stage 21 resolution proof checklist;
2. read the Stage 22 local review-pass readiness summary;
3. confirm local proof targets appear before deferred production-only scope;
4. see which Stage 21 resolution rows, Stage 19 source matrix rows, source
   buckets, evidence target ids, and proof commands support each readiness row;
5. identify the next static local review-pass step;
6. confirm deferred production scope remains visible but non-actionable;
7. complete the readiness review without saved reviewer sessions, persistent
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
  builder, report package writer, handoff report exports, or production
  handoff package;
- no executable command runner, shell automation panel, or production gate;
- no broad frontend redesign or new routing shell;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused frontend model tests for deterministic readiness row construction;
- view-model tests proving the readiness summary is connected to Stage 21
  resolution rows and Stage 19 matrix rows;
- mission-console coverage showing the readiness/evidence-map panel is visible
  without changing local-live behavior;
- assertions that proof commands remain static, repo-relative, and
  non-executable;
- existing Stage 21 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- editable state, saved progress, local storage, or persistence tests before
  the local readiness contract exists;
- external workflow integrations, ticketing, auth, production signoff, report
  authoring, report exports, cloud-backed handoff primitives, or deploy work;
- command execution UI or a task runner.

## Exit Criteria

- one deterministic local review-pass readiness model is source-backed and
  visible/testable;
- readiness rows are derived from Stage 21 resolution rows, not ad hoc UI
  strings;
- local proof targets, deferred production scope, evidence target ids, proof
  commands, source rows, source buckets, and next local review-pass steps are
  explicit;
- the evidence map is visible, static, repo-relative, and non-executable;
- mission-console UI exposes the readiness summary without a broad redesign;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved reviewer progress,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, or executable
  command automation.
