# Stage 23: Review Pass Outcome Board And Deferred Scope Ledger

## Goal

Turn the Stage 22 local review-pass readiness summary into a deterministic,
read-only review-pass outcome board. A reviewer should be able to see the
candidate local pass outcome, which readiness rows produced it, which evidence
rows support it, which local proof gaps remain inspectable, and which
production-only scope stays deferred.

This stage is not a signoff workflow. It must stay local, deterministic, and
non-persistent: no saved pass history, reviewer identity, approval state,
audit retention, report exports, ticketing, command execution, shell panels, or
production handoff service.

## Decisions To Make

### Outcome Surface Shape

Option A: deterministic local outcome board

- derives candidate pass outcomes from Stage 22 readiness rows;
- separates ready local evidence, unresolved local proof gaps, and deferred
  production boundaries;
- exposes source readiness row ids, source resolution ids, source matrix rows,
  evidence target ids, static proof command references, and a next local review
  step;
- presents outcomes as informational and non-certifying.

Option B: saved review-pass history

- would add storage, identity, progress recovery, ownership, and audit semantics
  before the local outcome contract is proven.

Option C: signoff or handoff export package

- would cross into approval identity, retention, report authoring, external
  handoff, and production certification.

Recommended: start with Option A. Keep the first outcome board source-backed,
fixture-first, and explicit about what it does not certify.

### Deferred Scope Ledger Boundary

Option A: static local deferred-scope ledger

- keeps deferred production-only rows visible and non-actionable;
- maps each deferred row back to readiness rows and source evidence;
- explains why the row is outside the local review pass.

Option B: external ticket, command runner, or owner assignment panel

- would cross into workflow execution, collaboration identity, and production
  process ownership.

Recommended: Option A. Stage 23 should help a reviewer understand the local
outcome boundary, not execute or assign follow-up work.

## Work Items

- add a deterministic local review-pass outcome helper, preferably
  `frontend/src/lib/reviewPassOutcome.ts`, over the Stage 22 readiness view;
- define compact Stage 23 types in
  `frontend/src/features/mission-console/types.ts` for candidate outcome
  summaries, outcome rows, local proof gap rows, static verdict notes, and
  deferred scope ledger rows;
- wire the outcome board into
  `frontend/src/features/mission-console/consoleViewModel.ts` without changing
  fixture/local-live boundaries;
- surface a compact Stage 23 outcome board and deferred-scope ledger in
  `frontend/src/features/mission-console/MissionConsole.tsx`, near the Stage 22
  readiness panel;
- update `frontend/src/styles/global.css` only as needed for the compact panel;
- add focused frontend tests in a new
  `tests/frontend/reviewPassOutcome.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` for the new view-model shape;
- keep Stage 22 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 23 artifact under
  `docs/development/artifacts/stage23-review-pass-outcome-board/` describing
  the outcome boundary, source files, verification commands, and deferred
  production features.

## Human Test Gate

A reviewer should be able to:

1. inspect the Stage 22 readiness and evidence-map panel;
2. read the Stage 23 candidate local outcome board;
3. confirm candidate outcomes are derived from readiness rows, not ad hoc UI
   strings;
4. confirm ready local evidence, unresolved local proof gaps, and deferred
   production boundaries are separated;
5. see source readiness row ids, Stage 21 resolution ids, Stage 19 matrix rows,
   evidence target ids, and static proof command references for each outcome
   row;
6. identify the next static local review step for unresolved local gaps;
7. confirm deferred production scope remains visible, non-actionable, and
   non-certifying;
8. complete the review without saved pass history, reviewer identity, signoff,
   audit retention, ticketing, report exports, command runners, or shell panels.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved review-pass history, saved reviewer progress, persistent notes, local
  note storage, or saved action ownership;
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

- focused frontend model tests proving candidate outcomes are derived from Stage
  22 readiness rows;
- assertions that unresolved local proof gaps rank before deferred
  production-only rows;
- view-model tests proving the outcome board is connected to Stage 22 readiness,
  Stage 21 resolution, and Stage 19 matrix evidence;
- mission-console coverage showing the outcome board is visible without changing
  local-live behavior;
- assertions that proof commands remain static, repo-relative, and
  non-executable;
- existing Stage 22 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- editable state, saved progress, local storage, or persistence tests before
  the local outcome contract exists;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, cloud-backed handoff primitives,
  or deploy work;
- command execution UI or a task runner.

## Exit Criteria

- one deterministic local review-pass outcome model is source-backed and
  visible/testable;
- candidate outcomes are derived from Stage 22 readiness rows, not ad hoc UI
  strings;
- ready local evidence, unresolved local proof gaps, deferred production scope,
  evidence target ids, proof commands, source rows, source buckets, and next
  local review steps are explicit;
- the deferred-scope ledger is visible, static, repo-relative, and
  non-actionable;
- mission-console UI exposes the outcome board without a broad redesign;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved pass history, persistence,
  identity, collaboration, external ticketing, production signoff, deploy,
  audit retention, report/export authoring, or executable command automation.
