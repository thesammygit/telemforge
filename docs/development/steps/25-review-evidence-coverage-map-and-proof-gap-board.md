# Stage 25: Review Evidence Coverage Map And Proof Gap Board

## Goal

Turn the Stage 24 local evidence trace navigator into a deterministic evidence
coverage map and proof-gap board. A reviewer should be able to scan all local
trace rows, see which proof buckets are ready, which local proof gaps still
need review, which production boundaries remain deferred, and which static
local check should be inspected next.

This stage remains read-only, local, deterministic, and non-persistent. It is
not a saved review workspace, signoff flow, report export, command runner,
ticketing system, audit trail, ownership queue, or production handoff service.

## Decisions To Make

### Coverage Surface Shape

Option A: deterministic local evidence coverage map

- derives coverage rows only from the Stage 24 evidence trace navigator;
- groups rows by proof bucket, source bucket, local proof status, and deferred
  production boundary;
- highlights unresolved local proof gaps before ready evidence and deferred
  production scope;
- exposes source trace ids, outcome row ids, evidence target ids, proof command
  ids, and static next local review steps;
- keeps proof command references as repo-relative text and never executes them.

Option B: saved review progress tracker

- would add selected rows, durable reviewer progress, reviewer notes, identity,
  ownership, and audit semantics before the local coverage contract is proven.

Option C: report/export package

- would cross into report authoring, retention, approval identity, external
  handoff, and production certification.

Recommended: start with Option A. Stage 25 should make local proof coverage
easy to inspect across the whole Stage 24 trace set without introducing saved
state or execution controls.

### Proof-Gap Boundary

Option A: static proof-gap board

- lists local gaps, ready evidence, and deferred production rows as
  deterministic read-only groups;
- shows source ids and one static local review step for each gap;
- keeps deferred production scope visible but non-actionable.

Option B: ticket launcher, owner assignment, or checklist runner

- would cross into workflow execution, collaboration identity, command running,
  and production process ownership.

Recommended: Option A. The first coverage board should clarify local review
coverage, not assign, persist, export, or execute follow-up work.

## Work Items

- add a deterministic local review evidence coverage helper, preferably
  `frontend/src/lib/reviewEvidenceCoverage.ts`, over the Stage 24 trace model;
- define compact Stage 25 types in
  `frontend/src/features/mission-console/types.ts` for coverage summaries,
  proof-gap groups, bucket rows, static review steps, and deferred boundary
  rollups;
- wire the coverage map into
  `frontend/src/features/mission-console/consoleViewModel.ts` without changing
  fixture/local-live boundaries;
- surface a compact Stage 25 evidence coverage map and proof-gap board in
  `frontend/src/features/mission-console/MissionConsole.tsx`, near the Stage 24
  trace navigator;
- update `frontend/src/styles/global.css` only as needed for the compact panel;
- add focused frontend tests in a new
  `tests/frontend/reviewEvidenceCoverage.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` for the new view-model shape;
- keep Stage 24 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 25 artifact under
  `docs/development/artifacts/stage25-review-evidence-coverage-map/`
  describing the coverage contract, source files, verification commands, and
  deferred production features.

## Human Test Gate

A reviewer should be able to:

1. inspect the Stage 24 evidence trace navigator;
2. read the Stage 25 evidence coverage map;
3. confirm coverage rows are derived from Stage 24 trace rows, not ad hoc UI
   strings;
4. confirm unresolved local proof gaps rank before ready local evidence and
   deferred production scope;
5. see source trace ids, outcome row ids, evidence target ids, proof command
   ids, source buckets, proof buckets, and static next local review steps;
6. identify which local proof bucket should be inspected next without any
   executable command controls;
7. confirm deferred production scope remains visible, non-actionable, and
   non-certifying;
8. complete the review without saved progress, reviewer identity, signoff,
   persistence, ticketing, report export, task ownership, command runners, shell
   panels, or a production handoff service.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved review-pass history, saved reviewer progress, persistent notes, local
  note storage, saved selections, saved coverage filters, or saved action
  ownership;
- no reviewer signoff workflow, audit retention, approval identity, or
  production readiness certification;
- no external ticketing, messaging, email, workflow integrations, owner
  assignment, or task launcher;
- no cloud services, telemetry upload, paid APIs, browser-cookie import, or
  external network calls;
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

- focused frontend model tests proving coverage rows are derived from Stage 24
  trace rows;
- assertions that unresolved local proof gaps rank before ready evidence and
  deferred production scope;
- assertions that source trace ids, outcome ids, evidence target ids, proof
  command ids, source buckets, proof buckets, and static next review steps are
  preserved;
- view-model tests proving the coverage map is connected to the Stage 24 trace
  model and does not change fixture/local-live boundaries;
- mission-console coverage showing the coverage map and proof-gap board are
  visible without a broad redesign;
- assertions that proof command references remain static, repo-relative, and
  non-executable;
- existing Stage 24 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- editable state, saved filters, saved selections, saved progress, local
  storage, or persistence tests before the local coverage contract exists;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, cloud-backed handoff primitives,
  or deploy work;
- command execution UI, shell panels, or a task runner.

## Exit Criteria

- one deterministic local evidence coverage model is source-backed and
  visible/testable;
- coverage rows are derived from Stage 24 evidence trace rows, not ad hoc UI
  strings;
- unresolved local proof gaps, ready local evidence, deferred production scope,
  source trace ids, outcome ids, evidence target ids, proof commands, proof
  buckets, source buckets, and next local review steps are explicit;
- the proof-gap board prioritizes the highest-priority unresolved local proof
  bucket when available;
- proof references remain static, repo-relative, and non-executable;
- mission-console UI exposes the coverage map without a broad redesign;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved review progress,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, ownership launchers,
  or executable command automation.
