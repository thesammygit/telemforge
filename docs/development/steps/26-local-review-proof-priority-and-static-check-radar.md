# Stage 26: Local Review Proof Priority And Static Check Radar

## Goal

Turn the Stage 25 evidence coverage map into a deterministic local proof
priority lens and static check radar. A reviewer should be able to see which
local proof gap should be inspected first, why it outranks the other local
coverage rows, which source evidence chain supports it, and which static
repo-relative checks remain relevant.

This stage remains read-only, local, deterministic, non-persistent, and
non-executing. It is not a saved reviewer workspace, progress tracker, owner
queue, signoff flow, audit trail, report/export system, ticket launcher, shell
panel, command runner, or production handoff service.

## Decisions To Make

### Priority Surface Shape

Option A: deterministic local proof priority lens

- derives priority rows only from the Stage 25 evidence coverage map;
- ranks unresolved local proof gaps before ready local evidence and deferred
  production scope;
- explains why the default priority row is first using source coverage row ids,
  trace row ids, outcome ids, evidence target ids, proof buckets, and static
  review steps;
- keeps proof command references as static repo-relative text and never
  executes them;
- surfaces deferred production scope as context only.

Option B: saved reviewer progress tracker

- would add durable progress, selected rows, local storage, identity, notes,
  ownership, and audit semantics before the local priority contract is proven.

Option C: executable follow-up queue

- would cross into command running, task launching, owner assignment, external
  workflow controls, and production process ownership.

Recommended: start with Option A. Stage 26 should help a reviewer decide the
next local proof inspection target without storing state or launching work.

### Static Check Boundary

Option A: static check radar

- groups repo-relative proof references by priority row and proof bucket;
- labels each reference as static, local, and non-executable;
- shows the source coverage rows and evidence target ids that justify each
  check;
- makes deferred production scope visible but non-actionable.

Option B: runnable checklist or shell console

- would introduce command execution, shell automation, progress state, and
  operational control semantics.

Recommended: Option A. The first priority radar should improve reviewer
inspection order, not execute or persist follow-up work.

## Work Items

- add a deterministic local proof priority helper, preferably
  `frontend/src/lib/reviewProofPriority.ts`, over the Stage 25 coverage model;
- define compact Stage 26 types in
  `frontend/src/features/mission-console/types.ts` for priority rows, priority
  reasons, static check radar groups, source coverage references, deferred
  boundary context, and non-executing proof references;
- wire the priority lens into
  `frontend/src/features/mission-console/consoleViewModel.ts` without changing
  fixture/local-live boundaries;
- surface a compact Stage 26 proof priority lens and static check radar in
  `frontend/src/features/mission-console/MissionConsole.tsx`, near the Stage 25
  coverage map;
- update `frontend/src/styles/global.css` only as needed for the compact panel;
- add focused frontend tests in a new
  `tests/frontend/reviewProofPriority.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` for the new view-model shape;
- keep Stage 25 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 26 artifact under
  `docs/development/artifacts/stage26-local-review-proof-priority/` describing
  the priority contract, source files, verification commands, human test gate,
  and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. inspect the Stage 25 coverage map and proof-gap board;
2. read the Stage 26 proof priority lens;
3. confirm priority rows are derived from Stage 25 coverage rows, not ad hoc UI
   strings;
4. confirm unresolved local proof gaps rank before ready evidence and deferred
   production scope;
5. see source coverage row ids, trace ids, outcome ids, evidence target ids,
   proof bucket labels, proof command ids, and static review step ids;
6. understand why the default priority row is first;
7. inspect static check radar groups without any executable command controls;
8. confirm deferred production scope remains visible, non-actionable, and
   non-certifying;
9. complete the review without saved progress, reviewer identity, signoff,
   persistence, ticketing, report export, owner assignment, task launchers,
   command runners, shell panels, or a production handoff service.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved review-pass history, saved reviewer progress, persistent notes, local
  note storage, saved trace selections, saved coverage filters, saved priority
  filters, saved proof selections, or saved action ownership;
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
- no executable command runner, shell automation panel, runnable checklist, or
  production gate;
- no broad frontend redesign or new routing shell;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused frontend model tests proving priority rows are derived from Stage 25
  coverage rows;
- assertions that unresolved local proof gaps rank before ready evidence and
  deferred production scope;
- assertions that the default priority row carries source coverage row ids,
  trace ids, outcome ids, evidence target ids, proof bucket labels, proof
  command ids, and static review step ids;
- assertions that static check radar groups are repo-relative, local,
  non-executable, and source-backed;
- view-model tests proving the priority lens is connected to the Stage 25
  coverage model and does not change fixture/local-live boundaries;
- mission-console coverage showing the priority lens and static check radar are
  visible without a broad redesign;
- existing Stage 25 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- editable state, saved filters, saved selections, saved priority choices,
  saved proof selections, saved progress, local storage, or persistence tests
  before the local priority contract exists;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, cloud-backed handoff primitives,
  or deploy work;
- command execution UI, shell panels, task launchers, or owner assignment.

## Exit Criteria

- one deterministic local proof priority model is source-backed and
  visible/testable;
- priority rows are derived from Stage 25 coverage rows, not ad hoc UI strings;
- unresolved local proof gaps, ready local evidence, deferred production scope,
  source coverage row ids, trace ids, outcome ids, evidence target ids, proof
  buckets, proof commands, and static review steps are explicit;
- the default priority row explains why it is first;
- static check radar references remain repo-relative and non-executable;
- mission-console UI exposes the priority lens without a broad redesign;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved review progress,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, ownership launchers,
  or executable command automation.
