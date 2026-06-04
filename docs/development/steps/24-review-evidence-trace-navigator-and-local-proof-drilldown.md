# Stage 24: Review Evidence Trace Navigator And Local Proof Drilldown

## Goal

Turn the Stage 23 local review-pass outcome board into a deterministic evidence
trace navigator. A reviewer should be able to select or inspect the highest
priority outcome rows and follow the local proof chain back through readiness
rows, resolution rows, coverage matrix rows, source action ids, evidence
targets, static proof command references, and deferred production boundaries.

This stage remains read-only, local, deterministic, and non-persistent. It is
not a saved review workspace, signoff flow, report export, command runner,
ticketing system, audit trail, or production handoff service.

## Decisions To Make

### Trace Surface Shape

Option A: deterministic local trace navigator

- derives trace rows only from the Stage 23 review-pass outcome board;
- defaults to the highest-priority unresolved local proof gap when no row is
  selected;
- groups trace segments into outcome, readiness, resolution, coverage, proof,
  and deferred-scope sections;
- exposes source row ids, source buckets, evidence target ids, proof command
  ids, and one static next local review step for each trace row;
- keeps proof commands as repo-relative text references and never executes
  them.

Option B: saved reviewer workspace

- would add progress recovery, local storage, identity, notes, ownership, and
  audit semantics before the trace contract is proven.

Option C: handoff/export package

- would cross into report authoring, retention, approval identity, external
  handoff, and production certification.

Recommended: start with Option A. Stage 24 should make the local proof chain
auditable by inspection without introducing persistence or execution behavior.

### Drilldown Boundary

Option A: static local proof drilldown

- lists linked source ids and proof references as deterministic rows;
- highlights unresolved local proof gaps before ready local evidence and
  deferred production rows;
- explains why deferred rows remain non-actionable.

Option B: checklist runner, ticket launcher, or owner assignment panel

- would cross into workflow execution, collaboration identity, and production
  process ownership.

Recommended: Option A. The first trace drilldown should clarify the local
review path, not execute or assign follow-up work.

## Work Items

- add a deterministic local review evidence trace helper, preferably
  `frontend/src/lib/reviewEvidenceTrace.ts`, over the Stage 23 outcome view;
- define compact Stage 24 types in
  `frontend/src/features/mission-console/types.ts` for trace summaries, trace
  rows, trace segments, source reference groups, proof command references, and
  deferred boundary notes;
- wire the trace navigator into
  `frontend/src/features/mission-console/consoleViewModel.ts` without changing
  fixture/local-live boundaries;
- surface a compact Stage 24 trace navigator and local proof drilldown in
  `frontend/src/features/mission-console/MissionConsole.tsx`, near the Stage 23
  outcome board;
- update `frontend/src/styles/global.css` only as needed for the compact panel;
- add focused frontend tests in a new
  `tests/frontend/reviewEvidenceTrace.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` for the new view-model shape;
- keep Stage 23 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 24 artifact under
  `docs/development/artifacts/stage24-review-evidence-trace-navigator/`
  describing the trace contract, source files, verification commands, and
  deferred production features.

## Human Test Gate

A reviewer should be able to:

1. inspect the Stage 23 candidate outcome board;
2. read the Stage 24 evidence trace navigator;
3. confirm the selected/default trace is derived from Stage 23 outcome rows,
   not ad hoc UI strings;
4. confirm unresolved local proof gaps rank before ready evidence and deferred
   production scope;
5. see source outcome row ids, readiness row ids, Stage 21 resolution ids,
   Stage 19 matrix rows, source action ids, evidence target ids, source bucket
   labels, and static proof command references for the selected trace;
6. identify one static next local review step without any executable command
   controls;
7. confirm deferred production scope remains visible, non-actionable, and
   non-certifying;
8. complete the review without saved progress, reviewer identity, signoff,
   persistence, ticketing, report export, command runners, shell panels, or a
   production handoff service.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved review-pass history, saved reviewer progress, persistent notes, local
  note storage, saved selections, or saved action ownership;
- no reviewer signoff workflow, audit retention, approval identity, or
  production readiness certification;
- no external ticketing, messaging, email, workflow integrations, owner
  assignment, or task launcher;
- no cloud services, telemetry upload, paid APIs, browser-cookie import, or
  external network calls;
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

- focused frontend model tests proving trace rows are derived from Stage 23
  outcome rows;
- assertions that the default trace selects the highest-priority unresolved
  local proof gap;
- assertions that trace segments preserve source outcome, readiness,
  resolution, coverage matrix, action, evidence target, source bucket, and proof
  command references;
- view-model tests proving the trace navigator is connected to Stage 23
  outcome, Stage 22 readiness, Stage 21 resolution, and Stage 19 matrix data;
- mission-console coverage showing the trace drilldown is visible without
  changing local-live behavior;
- assertions that proof commands remain static, repo-relative, and
  non-executable;
- existing Stage 23 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- editable state, saved selections, saved progress, local storage, or
  persistence tests before the local trace contract exists;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, cloud-backed handoff primitives,
  or deploy work;
- command execution UI or a task runner.

## Exit Criteria

- one deterministic local evidence trace model is source-backed and
  visible/testable;
- trace rows are derived from Stage 23 outcome rows, not ad hoc UI strings;
- unresolved local proof gaps, ready local evidence, deferred production scope,
  source row ids, evidence target ids, proof commands, source buckets, and next
  local review steps are explicit;
- the default trace focuses the highest-priority unresolved local proof gap when
  available;
- the proof drilldown is visible, static, repo-relative, and non-executable;
- mission-console UI exposes the trace navigator without a broad redesign;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved review progress,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, or executable
  command automation.
