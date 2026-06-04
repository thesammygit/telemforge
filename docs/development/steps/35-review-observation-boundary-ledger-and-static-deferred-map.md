# Stage 35: Review Observation Boundary Ledger And Static Deferred Map

## Goal

Turn the Stage 34 local observation citation trail into a deterministic
deferred-boundary ledger that helps a reviewer see which production-facing
concerns remain explicitly out of scope, which local observations mention them,
and which in-page anchors explain the current local-only review boundary.

This stage remains deterministic, local, read-only, fixture-first, and
non-persistent. It is not a saved review workspace, report export, reviewer
identity system, signoff flow, audit log, owner assignment system, task
launcher, runnable checklist, proof scorer, ranking model, certification gate,
command runner, routing shell, or deployment step.

## Decisions To Make

### Boundary Ledger Shape

Option A: deterministic local deferred-boundary ledger

- derives ledger rows from the Stage 34 `reviewObservationCitations` deferred
  boundary citations, blind-spot notes, citation rows, and source map rows;
- preserves the Stage 34 citation order and source-backed anchor references;
- shows boundary label, source summary, local anchor ids, related observation
  rows, related source stages, and static non-goal context;
- keeps rows informational, local-only, non-actionable, non-executable,
  non-persistent, non-ranking, and non-certifying.

Option B: actionable task or owner ledger

- would turn deferred boundaries into tasks, owners, checklists, launchers,
  ticketing semantics, saved progress, or accountability state before the local
  source-backed boundary model is proven.

Option C: scored production-readiness risk model

- would introduce ranking, proof scoring, quality scoring, certification, or
  production readiness semantics that TelemForge is intentionally deferring.

Recommended: start with Option A. Stage 35 should make the local-only deferred
boundary explicit without changing it into a task system or scoring system.

### Placement

Option A: compact boundary ledger near the Stage 34 citation trail

- keeps the deferred-boundary explanation adjacent to the citation rows it
  summarizes;
- lets reviewers inspect source-backed non-goals without opening a new route;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: app-wide deferred-scope browser

- would add routing and broader navigation semantics beyond this stage.

Recommended: Option A. The first boundary ledger should be a compact read-only
surface inside the mission console.

## Work Items

- add a deterministic local boundary helper, preferably
  `frontend/src/lib/reviewObservationBoundaryLedger.ts`, over
  `ReviewObservationCitationTrailView`;
- define compact Stage 35 types in
  `frontend/src/features/mission-console/types.ts` for boundary ledger rows,
  observation reference groups, anchor reference groups, source-stage boundary
  groups, static non-goal notes, and a deferred-boundary ledger summary;
- wire the boundary ledger into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  34 observation citations are built, without changing fixture/local-live
  boundaries;
- surface a compact Stage 35 deferred-boundary ledger in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 34
  citation trail;
- update `frontend/src/styles/global.css` only as needed for the compact
  boundary ledger panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationBoundaryLedger.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 34 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 35 artifact under
  `docs/development/artifacts/stage35-review-observation-boundary-ledger/`
  describing the boundary ledger contract, source files, verification commands,
  human test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 35 deferred-boundary ledger near the Stage 34 citation trail;
3. confirm ledger rows are derived from Stage 34 citation data, not ad hoc UI
   strings;
4. confirm boundary row order follows the Stage 34 deferred-boundary citation
   order;
5. confirm each row shows source summary, local anchor ids, related observation
   rows, and related source stages;
6. confirm source-stage and anchor groups remain local review context only;
7. confirm static non-goal notes remain explanatory, not tasks, tickets,
   checklists, owner assignments, scores, ranks, signoff states, or
   certification gates;
8. confirm there is no saved boundary selection, saved reviewer progress,
   saved observations, saved notes, saved filters, reviewer identity, signoff,
   persistence, ticketing, report export, owner assignment, runnable checklist,
   task launcher, shell panel, proof scoring, ranking, certification, or
   command-runner control.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved review-pass history, saved reviewer progress, saved observations,
  saved notes, saved filters, saved citation selections, saved source-map
  selections, saved boundary selections, persistent notes, local storage, or
  saved action ownership;
- no reviewer signoff workflow, audit retention, approval identity, production
  readiness scoring, proof scoring, quality scoring, ranking, or certification;
- no external ticketing, messaging, email, workflow integrations, owner
  assignment, task launcher, queue ownership, or runnable checklist behavior;
- no cloud services, telemetry upload, paid APIs, browser-cookie import, or
  external network calls;
- no deploy/release/publish work;
- no production evidence archive or database migration;
- no report designer, downloadable styled report system, free-form export
  builder, report package writer, handoff report exports, or production handoff
  package;
- no executable command runner, shell automation panel, proof scorer,
  production gate, or shell command UI;
- no broad frontend redesign, new routing shell, or app-wide navigation system;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused frontend model tests proving boundary ledger rows derive from the
  Stage 34 `reviewObservationCitations` deferred-boundary citations,
  blind-spot notes, source map rows, and citation rows;
- assertions that boundary row order, source-stage group order, and local
  anchor group order remain stable;
- assertions that each row carries source summary, source anchor ids, related
  observation row ids, related source stages, local-only flags, and non-goal
  context;
- assertions that rows are local, informational, non-actionable,
  non-persistent, non-executable, non-ranking, and non-certifying;
- view-model tests proving the boundary ledger connects to the existing
  fixture and local-live boundary and does not change stream behavior;
- mission-console coverage showing local anchor references render without route
  changes, saved state, command execution, exports, signoff, owner assignment,
  proof scoring, certification, or runnable checklist semantics;
- existing Stage 34 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved observations, notes, filters, citation selections, source-map
  selections, boundary selections, review progress, local storage, or
  persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, cloud-backed handoff primitives,
  ranking, scoring, certification, or deploy work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, or app-wide routing.

## Exit Criteria

- one deterministic local deferred-boundary ledger is source-backed and
  visible/testable;
- ledger rows are derived from Stage 34 citation data, not ad hoc UI strings;
- boundary citation order, local anchor order, and source-stage order remain
  stable;
- source summary, source anchor ids, related observations, related source
  stages, and non-goal context are explicit and source-backed;
- static non-goal rows are explanatory, non-actionable, non-persistent,
  non-executable, non-ranking, and non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved review sessions,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, ownership
  launchers, proof scoring, certification, executable command automation, or
  app-wide navigation.
