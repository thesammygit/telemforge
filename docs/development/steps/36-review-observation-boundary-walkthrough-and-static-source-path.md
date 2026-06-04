# Stage 36: Review Observation Boundary Walkthrough And Static Source Path

## Goal

Turn the Stage 35 deferred-boundary ledger into a deterministic local
walkthrough that helps a reviewer trace each deferred boundary from source
summary to observation references, local anchors, source-stage groups, and
static non-goal notes.

This stage remains deterministic, local, read-only, fixture-first, and
non-persistent. It is not a saved boundary selection workflow, review-session
history, report export, reviewer identity system, signoff flow, audit log,
owner assignment system, task launcher, runnable checklist, proof scorer,
ranking model, certification gate, command runner, routing shell, or deployment
step.

## Decisions To Make

### Walkthrough Shape

Option A: deterministic local boundary walkthrough

- derives walkthrough steps from the Stage 35
  `reviewObservationBoundaryLedger` rows, observation reference groups, anchor
  reference groups, source-stage boundary groups, and static non-goal notes;
- preserves Stage 35 boundary row order and uses the first boundary as the
  deterministic default focus;
- shows how a reviewer should read source summary, related observations, local
  anchors, source stages, and static non-goal notes without saving selections;
- keeps every step local-only, informational, non-actionable, non-persistent,
  non-executable, non-ranking, and non-certifying.

Option B: saved boundary review workspace

- would introduce saved focus state, reviewer progress, persistent notes,
  saved filters, or saved boundary selections before the static walkthrough
  contract is proven.

Option C: readiness or risk scoring flow

- would turn deferred boundaries into scores, ranks, certifications, or
  production-readiness gates that TelemForge is intentionally deferring.

Recommended: start with Option A. Stage 36 should make the existing deferred
boundary ledger easier to inspect without changing it into workflow state,
owner state, scoring, or certification.

### Placement

Option A: compact walkthrough panel near the Stage 35 boundary ledger

- keeps the source path adjacent to the boundary rows it explains;
- lets reviewers inspect the default boundary path and all source-backed steps
  without opening a route or saving state;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: app-wide boundary browser

- would add routing, saved filters, or broader navigation semantics beyond this
  stage.

Recommended: Option A. The first boundary walkthrough should be a compact
  read-only surface inside the mission console.

## Work Items

- add a deterministic local helper, preferably
  `frontend/src/lib/reviewObservationBoundaryWalkthrough.ts`, over
  `ReviewObservationBoundaryLedgerView`;
- define compact Stage 36 types in
  `frontend/src/features/mission-console/types.ts` for boundary walkthrough
  steps, default focus context, source path groups, static guardrail groups,
  and a walkthrough summary;
- wire the walkthrough into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  35 boundary ledger is built, without changing fixture/local-live boundaries;
- surface a compact Stage 36 boundary walkthrough/source-path panel in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 35
  deferred-boundary ledger;
- update `frontend/src/styles/global.css` only as needed for the compact
  walkthrough panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationBoundaryWalkthrough.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 35 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 36 artifact under
  `docs/development/artifacts/stage36-review-observation-boundary-walkthrough/`
  describing the walkthrough contract, source files, verification commands,
  human test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 36 boundary walkthrough near the Stage 35 deferred-boundary
   ledger;
3. confirm walkthrough steps are derived from Stage 35 boundary ledger data,
   not ad hoc UI strings;
4. confirm the default focus uses the first Stage 35 boundary row and all
   boundary walkthrough steps preserve Stage 35 boundary order;
5. confirm each walkthrough step shows the source summary, related observation
   rows, in-page anchor references, related source stages, and static non-goal
   notes;
6. confirm source path and guardrail groups remain local review context only;
7. confirm local anchors remain in-page references and do not create routes or
   saved navigation state;
8. confirm there is no saved boundary selection, saved reviewer progress,
   saved observation, saved note, saved filter, reviewer identity, signoff,
   persistence, ticketing, report export, owner assignment, runnable checklist,
   task launcher, shell panel, proof scoring, ranking, certification, or
   command runner.

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
  builder, report package writer, handoff report exports, or production
  handoff package;
- no executable command runner, shell automation panel, proof scorer,
  production gate, or shell command UI;
- no broad frontend redesign, new routing shell, or app-wide navigation system;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused frontend model tests proving walkthrough steps derive from the Stage
  35 `reviewObservationBoundaryLedger` rows, observation reference groups,
  anchor reference groups, source-stage boundary groups, and static non-goal
  notes;
- assertions that default focus, boundary row order, source path order, and
  guardrail order remain stable;
- assertions that each walkthrough step carries source summary, source anchor
  hrefs, related observation row ids, related source stages, static non-goal
  note ids, local-only flags, and non-goal context;
- assertions that steps are local, informational, non-actionable,
  non-persistent, non-executable, non-ranking, and non-certifying;
- view-model tests proving the walkthrough connects to the existing fixture and
  local-live boundary and does not change stream behavior;
- mission-console coverage showing local anchor references render without
  route changes, saved state, command execution, exports, signoff, owner
  assignment, proof scoring, certification, or runnable checklist semantics;
- existing Stage 35 through Stage 09 checks as regression coverage for touched
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

- one deterministic local boundary walkthrough is source-backed and
  visible/testable;
- walkthrough steps are derived from Stage 35 boundary ledger data, not ad hoc
  UI strings;
- default focus, boundary row order, source path order, and guardrail order
  remain stable;
- source summary, source anchor hrefs, related observations, related source
  stages, and static non-goal notes are explicit and source-backed;
- source path and guardrail groups are explanatory, non-actionable,
  non-persistent, non-executable, non-ranking, and non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved review sessions,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, ownership
  launchers, proof scoring, certification, executable command automation, or
  app-wide navigation.
