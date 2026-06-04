# Stage 32: Review Observation Lens And Static Attention Map

## Goal

Turn the Stage 31 local review walkthrough path into a deterministic observation
lens that helps a reviewer compare expected observations, local anchors, source
labels, count signals, and deferred boundary notes before running a manual
review pass.

This stage remains deterministic, local, read-only, fixture-first, and
non-persistent. It is not a saved review session, reviewer notes system,
runnable checklist, task launcher, signoff workflow, report writer, proof
scorer, certification workflow, owner assignment system, routing shell, or
deployment step.

## Decisions To Make

### Observation Shape

Option A: deterministic local observation lens

- derives observation rows from the Stage 31 `reviewWalkthroughPath` steps,
  prompt groups, anchor references, useful counts, and deferred boundary notes;
- preserves phase order, stage numbers, source schemas, contract labels, local
  statuses, anchor ids, and static expected observations;
- groups rows into a small static attention map so reviewers can see which
  local observations deserve source, anchor, count, or deferred-boundary review;
- keeps all attention labels informational rather than scoring, certifying, or
  assigning work.

Option B: saved reviewer notes or review-pass workspace

- would add persistent notes, stored observations, completion state, reviewer
  identity, session recovery, signoff, or audit retention before the static
  local observation model is proven.

Option C: executable review runbook or handoff package

- would cross into command execution, owner assignment, task launchers, report
  export, package writing, audit retention, proof scoring, certification, or
  production handoff before the console has a clear read-only observation lens.

Recommended: start with Option A. Stage 32 should make the existing walkthrough
more reviewable while preserving TelemForge's local-only, non-executable
boundary.

### Placement

Option A: compact observation lens near the walkthrough path

- keeps observations near the Stage 31 walkthrough steps they depend on;
- lets reviewers move from orientation to expected observations without a new
  route;
- preserves existing review panel order and fixture/local-live behavior.

Option B: app-wide review workspace

- would introduce routing, saved state, visual hierarchy churn, and workflow
  semantics beyond this stage.

Recommended: Option A. The first observation lens should be a compact read-only
surface inside the mission console.

## Work Items

- add a deterministic local observation helper, preferably
  `frontend/src/lib/reviewObservationLens.ts`, over
  `ReviewWalkthroughPathView`;
- define compact Stage 32 types in
  `frontend/src/features/mission-console/types.ts` for observation rows,
  attention groups, source references, anchor references, count signals, and
  deferred boundary summaries;
- wire the observation lens into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  31 walkthrough path is built;
- surface a compact Stage 32 observation lens and static attention map in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 31
  walkthrough path;
- update `frontend/src/styles/global.css` only as needed for the compact
  observation panel;
- add focused frontend tests in a new
  `tests/frontend/reviewObservationLens.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 31 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 32 artifact under
  `docs/development/artifacts/stage32-review-observation-lens/` describing the
  observation contract, source files, verification commands, human test gate,
  and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 32 observation lens near the Stage 31 walkthrough path;
3. confirm the observation rows are derived from the Stage 31 walkthrough steps
   and prompt groups, not from ad hoc UI strings;
4. confirm decision, action, readiness, evidence, proof, navigator, and
   reconciliation phases remain in stable order;
5. confirm each observation preserves a local anchor id that resolves to an
   existing mission-console section;
6. confirm source schema labels, contract labels, local status labels, useful
   count signals, expected observations, and deferred boundary summaries remain
   visible;
7. confirm the static attention map uses informational categories only and does
   not rank people, assign work, score proof quality, certify readiness, or mark
   completion;
8. follow several in-page anchor links and verify the page stays on the same
   route;
9. confirm deferred production scope remains visible and non-actionable;
10. complete the review without saved observations, saved notes, saved progress,
    reviewer identity, signoff, persistence, ticketing, report export, owner
    assignment, runnable checklists, task launchers, shell panels, proof
    scoring, certification, or command-runner controls.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved review-pass history, saved reviewer progress, saved observations,
  saved notes, saved walkthrough selections, saved surface selections, saved
  navigation filters, saved trace selections, saved coverage filters, saved
  priority filters, saved proof selections, saved proof packet selections, saved
  navigator selections, saved reconciliation selections, persistent notes, or
  saved action ownership;
- no reviewer signoff workflow, audit retention, approval identity, production
  readiness scoring, proof scoring, ranking, or certification;
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

- focused frontend model tests proving the observation lens is derived from the
  Stage 31 `reviewWalkthroughPath` rows, prompt groups, anchors, useful counts,
  and deferred boundary notes;
- assertions that workflow phases preserve the stable decision, action,
  readiness, evidence, proof, navigator, and reconciliation order;
- assertions that each observation row preserves local anchor ids from the
  walkthrough path and resolves to existing mission-console sections;
- assertions that attention groups are informational only, with no persisted
  observations, saved progress, command execution, owner assignment, scoring,
  signoff, or certification affordances;
- view-model tests proving the lens is connected to the existing fixture and
  local-live boundary and does not change stream behavior;
- mission-console coverage showing local anchor links render without route
  changes, saved state, command execution, exports, or runnable checklist
  semantics;
- existing Stage 31 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved observations, notes, step selections, walkthrough progress, surface
  selections, navigation filters, local storage, or persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, cloud-backed handoff
  primitives, ranking, scoring, certification, or deploy work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, or app-wide routing.

## Exit Criteria

- one deterministic local review observation lens is source-backed and
  visible/testable;
- observation rows are derived from the Stage 31 walkthrough path, not ad hoc UI
  strings;
- decision, action, readiness, evidence, proof, navigator, and reconciliation
  phases remain visible in stable local review order;
- each observation has a local anchor id that resolves to an existing
  mission-console section;
- source schemas, contract labels, local statuses, useful counts, expected
  observations, attention categories, and deferred boundary notes remain
  explicit;
- attention categories are informational, local, non-persistent,
  non-executable, and non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved review sessions,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, ownership
  launchers, proof scoring, certification, executable command automation, or
  app-wide navigation.
