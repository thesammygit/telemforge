# Stage 34: Review Observation Citation Trail And Local Source Map

## Goal

Turn the Stage 33 local observation coverage matrix into a deterministic
citation trail that lets a reviewer trace each observation through source
stage, workflow phase, local anchor, count signal, and deferred-boundary context
inside the mission console.

This stage remains deterministic, local, read-only, fixture-first, and
non-persistent. It is not a saved review workspace, report export, reviewer
identity system, signoff flow, proof scorer, certification gate, owner
assignment system, task launcher, command runner, routing shell, or deployment
step.

## Decisions To Make

### Citation Shape

Option A: deterministic local observation citation trail

- derives citation rows from the Stage 33 `reviewObservationCoverage` and its
  source Stage 32 `reviewObservationLens`;
- preserves observation row order, workflow phase order, and source-stage
  order;
- shows source stage, source schema, source contract label, local anchor href,
  count-signal source paths, and deferred-boundary summary references for each
  observation;
- keeps citation rows informational, local-only, non-executable,
  non-persistent, non-ranking, and non-certifying.

Option B: exportable review citation package

- would introduce report packaging, downloadable handoff artifacts, identity,
  audit semantics, and production handoff behavior before the local citation
  model is proven.

Option C: scored source-quality or proof-certification model

- would turn source references into ranking, proof scoring, certification, or
  production readiness semantics that TelemForge is intentionally deferring.

Recommended: start with Option A. Stage 34 should make existing local review
evidence easier to trace without changing the local-only product boundary.

### Placement

Option A: compact citation map near the observation coverage matrix

- keeps citations adjacent to the Stage 33 coverage matrix they explain;
- lets reviewers inspect source and anchor provenance without opening a new
  route;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: app-wide citation browser

- would add routing and broader navigation semantics beyond this stage.

Recommended: Option A. The first citation trail should be a compact read-only
surface inside the mission console.

## Work Items

- add a deterministic local citation helper, preferably
  `frontend/src/lib/reviewObservationCitations.ts`, over
  `ReviewObservationCoverageView`;
- define compact Stage 34 types in
  `frontend/src/features/mission-console/types.ts` for citation rows, source
  map rows, phase citation groups, anchor citation groups, count-signal
  citations, and deferred-boundary citations;
- wire the citation trail into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  33 observation coverage matrix is built;
- surface a compact Stage 34 citation trail and local source map in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 33
  observation coverage matrix;
- update `frontend/src/styles/global.css` only as needed for the compact
  citation panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationCitations.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 33 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 34 artifact under
  `docs/development/artifacts/stage34-review-observation-citations/`
  describing the citation contract, source files, verification commands, human
  test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 34 citation trail near the Stage 33 observation coverage
   matrix;
3. confirm citation rows are derived from Stage 33 coverage and the source
   Stage 32 observation lens, not ad hoc UI strings;
4. confirm observation, phase, and source-stage order remain stable;
5. confirm every citation row shows local source-stage and source-contract
   context;
6. confirm local anchors stay in-page and do not introduce routes;
7. confirm count-signal and deferred-boundary references remain visible as
   local review context only;
8. confirm blind-spot citation notes remain static explanatory context, not
   tasks, tickets, checklists, owner assignments, scores, ranks, or
   certification gates;
9. complete the review without saved filters, saved observations, saved notes,
   saved progress, reviewer identity, signoff, persistence, ticketing, report
   export, owner assignment, runnable checklists, task launchers, shell panels,
   proof scoring, ranking, certification, or command-runner controls.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved review-pass history, saved reviewer progress, saved observations,
  saved notes, saved filters, saved citation selections, saved source-map
  selections, persistent notes, local storage, or saved action ownership;
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

- focused frontend model tests proving citation rows are derived from the Stage
  33 `reviewObservationCoverage` and source Stage 32 `reviewObservationLens`;
- assertions that observation row order, workflow phase order, and source-stage
  order remain stable;
- assertions that source stage, schema, contract label, local anchor href,
  count-signal source path, and deferred-boundary summary references are carried
  into citation rows;
- assertions that citations are local, informational, non-persistent,
  non-executable, non-ranking, and non-certifying;
- view-model tests proving the citation trail connects to the existing fixture
  and local-live boundary and does not change stream behavior;
- mission-console coverage showing local anchor links render without route
  changes, saved state, command execution, exports, or runnable checklist
  semantics;
- existing Stage 33 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved observations, notes, filters, citation selections, review progress,
  local storage, or persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, cloud-backed handoff primitives,
  ranking, scoring, certification, or deploy work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, or app-wide routing.

## Exit Criteria

- one deterministic local observation citation trail is source-backed and
  visible/testable;
- citation rows are derived from Stage 33 coverage and the source Stage 32
  observation lens, not ad hoc UI strings;
- observation row, workflow phase, and source-stage order remain stable;
- source-stage, source-schema, source-contract, local-anchor, count-signal, and
  deferred-boundary references are explicit and source-backed;
- blind-spot citation rows are static, explanatory, non-persistent,
  non-executable, non-ranking, and non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved review sessions,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, ownership
  launchers, proof scoring, certification, executable command automation, or
  app-wide navigation.
