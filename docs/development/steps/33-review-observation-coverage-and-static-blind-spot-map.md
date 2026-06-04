# Stage 33: Review Observation Coverage And Static Blind-Spot Map

## Goal

Turn the Stage 32 local review observation lens into a deterministic coverage
matrix that helps a reviewer compare workflow phase coverage, source stage
coverage, attention categories, anchor coverage, count-signal coverage, and
deferred-boundary coverage before a manual review pass.

This stage remains deterministic, local, read-only, fixture-first, and
non-persistent. It is not a saved review session, reviewer notes system,
scorecard, ranking tool, certification workflow, runnable checklist, owner
assignment system, task launcher, report writer, routing shell, or deployment
step.

## Decisions To Make

### Coverage Shape

Option A: deterministic local observation coverage matrix

- derives coverage rows from the Stage 32 `reviewObservationLens` observation
  rows, attention groups, source references, anchor references, count signals,
  and deferred-boundary summaries;
- preserves workflow phase order and source stage order;
- shows source-backed coverage counts, local anchor coverage, attention-kind
  coverage, and deferred-boundary coverage as informational review context;
- highlights static blind-spot notes only when a local source-backed signal is
  absent or intentionally deferred.

Option B: reviewer scorecard or proof-quality grading

- would turn coverage into ranking, scoring, certification, reviewer
  assignment, or production readiness semantics before TelemForge has a
  non-scoring local coverage contract.

Option C: saved review workspace

- would add persistence, saved filters, saved observations, reviewer identity,
  notes, progress, or signoff before the static coverage model is proven.

Recommended: start with Option A. Stage 33 should make the Stage 32 observation
lens easier to inspect while preserving the local-only, non-scoring boundary.

### Placement

Option A: compact coverage matrix near the observation lens

- keeps the coverage summary near the Stage 32 observations it depends on;
- lets reviewers compare phase/source/attention coverage without a new route;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: app-wide review analytics route

- would introduce routing, navigation shell semantics, and broader UX churn
  beyond this stage.

Recommended: Option A. The first coverage matrix should be a compact read-only
surface inside the mission console.

## Work Items

- add a deterministic local coverage helper, preferably
  `frontend/src/lib/reviewObservationCoverage.ts`, over
  `ReviewObservationLensView`;
- define compact Stage 33 types in
  `frontend/src/features/mission-console/types.ts` for phase coverage rows,
  source-stage coverage rows, attention coverage rows, blind-spot rows, anchor
  coverage, count-signal coverage, and deferred-boundary coverage;
- wire the coverage matrix into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  32 observation lens is built;
- surface a compact Stage 33 observation coverage matrix and static blind-spot
  map in `frontend/src/features/mission-console/MissionConsole.tsx` near the
  Stage 32 observation lens;
- update `frontend/src/styles/global.css` only as needed for the compact
  coverage panel;
- add focused frontend tests in a new
  `tests/frontend/reviewObservationCoverage.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 32 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 33 artifact under
  `docs/development/artifacts/stage33-review-observation-coverage/`
  describing the coverage contract, source files, verification commands, human
  test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 33 observation coverage matrix near the Stage 32 observation
   lens;
3. confirm coverage rows are derived from the Stage 32 observation lens and not
   from ad hoc UI strings;
4. confirm decision, action, readiness, evidence, proof, navigator, and
   reconciliation phases remain in stable order;
5. confirm source-stage coverage follows the existing local review stage order;
6. confirm attention-kind coverage is informational only and does not rank,
   score, certify, assign, or mark completion;
7. confirm anchor, count-signal, and deferred-boundary coverage are visible as
   local review context;
8. confirm blind-spot rows are static explanatory notes for absent or deferred
   local signals, not tasks, tickets, checklists, or owner assignments;
9. confirm all links remain local in-page anchors and do not introduce routes;
10. complete the review without saved filters, saved observations, saved notes,
    saved progress, reviewer identity, signoff, persistence, ticketing, report
    export, owner assignment, runnable checklists, task launchers, shell panels,
    proof scoring, ranking, certification, or command-runner controls.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved review-pass history, saved reviewer progress, saved observations,
  saved notes, saved filters, saved coverage selections, saved walkthrough
  selections, saved surface selections, saved navigation filters, saved trace
  selections, saved priority filters, saved proof selections, saved proof
  packet selections, saved navigator selections, saved reconciliation
  selections, persistent notes, or saved action ownership;
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

- focused frontend model tests proving the coverage matrix is derived from the
  Stage 32 `reviewObservationLens` rows, attention groups, source references,
  anchor references, count signals, and deferred-boundary summaries;
- assertions that workflow phase coverage preserves the stable decision,
  action, readiness, evidence, proof, navigator, and reconciliation order;
- assertions that source-stage coverage preserves existing local review stage
  order and uses source stage numbers from observation rows;
- assertions that attention-kind coverage is informational only, with no saved
  filters, scoring, ranking, command execution, owner assignment, signoff, or
  certification affordances;
- assertions that blind-spot rows are static explanatory local context and not
  tasks, tickets, checklists, or persisted reviewer state;
- view-model tests proving the matrix is connected to the existing fixture and
  local-live boundary and does not change stream behavior;
- mission-console coverage showing local anchor links render without route
  changes, saved state, command execution, exports, or runnable checklist
  semantics;
- existing Stage 32 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved observations, notes, filters, coverage selections, review progress,
  local storage, or persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, cloud-backed handoff primitives,
  ranking, scoring, certification, or deploy work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, or app-wide routing.

## Exit Criteria

- one deterministic local observation coverage matrix is source-backed and
  visible/testable;
- coverage rows are derived from the Stage 32 observation lens, not ad hoc UI
  strings;
- decision, action, readiness, evidence, proof, navigator, and reconciliation
  phase coverage remains visible in stable local review order;
- source-stage, attention-kind, anchor, count-signal, and deferred-boundary
  coverage are explicit and source-backed;
- blind-spot rows are static, explanatory, non-persistent, non-executable,
  non-ranking, and non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved review sessions,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, ownership
  launchers, proof scoring, certification, executable command automation, or
  app-wide navigation.
