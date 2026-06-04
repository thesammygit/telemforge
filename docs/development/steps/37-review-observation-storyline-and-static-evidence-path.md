# Stage 37: Review Observation Storyline And Static Evidence Path

## Goal

Turn the Stage 36 boundary walkthrough into a deterministic local observation
storyline that helps a reviewer read the source-backed evidence path from
observation summary to local anchors, source-stage context, guardrail notes,
and prior review surfaces.

This stage remains deterministic, local, read-only, fixture-first, and
non-persistent. It is not saved reviewer progress, review-session history,
storyline authoring, report export, reviewer identity, signoff, audit log,
owner assignment, task launcher, runnable checklist, proof scorer, ranking
model, certification gate, command runner, routing shell, or deployment step.

## Decisions To Make

### Storyline Shape

Option A: deterministic local observation storyline

- derives storyline segments from the Stage 36
  `reviewObservationBoundaryWalkthrough` steps, source path groups, static
  guardrail groups, default focus, and source Stage 35 boundary ledger;
- preserves Stage 36 step order and uses the first walkthrough step as the
  deterministic opening segment;
- shows how a reviewer should read each observation path through source
  summary, local anchors, related observations, source stages, and static
  non-goal context without saving reviewer state;
- keeps every segment local-only, informational, non-actionable,
  non-persistent, non-executable, non-ranking, and non-certifying.

Option B: editable reviewer narrative

- would introduce saved reviewer progress, persistent notes, report authoring,
  free-form storyline text, or local storage before the static storyline
  contract is proven.

Option C: evidence quality score or certification

- would turn the observation path into quality scores, ranks, approvals, or
  production-readiness gates that TelemForge is intentionally deferring.

Recommended: start with Option A. Stage 37 should make the completed
walkthrough easier to read as a local evidence storyline without converting it
into workflow state, authoring state, scoring, approval, or certification.

### Placement

Option A: compact storyline panel near the Stage 36 boundary walkthrough

- keeps the evidence path adjacent to the walkthrough rows it explains;
- lets reviewers inspect the opening segment, segment order, related anchors,
  source-stage context, and guardrail notes without opening a route or saving
  state;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: app-wide evidence reader

- would add routing, saved filters, or broader navigation semantics beyond this
  stage.

Recommended: Option A. The first observation storyline should be a compact
read-only surface inside the mission console.

## Work Items

- add a deterministic local helper, preferably
  `frontend/src/lib/reviewObservationStoryline.ts`, over
  `ReviewObservationBoundaryWalkthroughView`;
- define compact Stage 37 types in
  `frontend/src/features/mission-console/types.ts` for storyline segments,
  default opening context, source-stage evidence groups, static guardrail
  references, prior-surface references, and a storyline summary;
- wire the storyline into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  36 boundary walkthrough is built, without changing fixture/local-live
  boundaries;
- surface a compact Stage 37 observation storyline/static evidence path panel
  in `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage
  36 boundary walkthrough;
- update `frontend/src/styles/global.css` only as needed for the compact
  storyline panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationStoryline.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 36 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 37 artifact under
  `docs/development/artifacts/stage37-review-observation-storyline/`
  describing the storyline contract, source files, verification commands,
  human test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 37 observation storyline near the Stage 36 boundary
   walkthrough;
3. confirm storyline segments are derived from Stage 36 walkthrough data, not
   ad hoc UI strings;
4. confirm the default opening segment uses the first Stage 36 walkthrough
   step and all storyline segments preserve Stage 36 step order;
5. confirm each segment shows source summary, local anchor references, related
   observation rows, related source stages, static guardrail context, and prior
   review-surface references;
6. confirm source-stage evidence groups and guardrail references remain local
   review context only;
7. confirm local anchors remain in-page references and do not create routes or
   saved navigation state;
8. confirm there is no saved storyline selection, saved reviewer progress,
   saved observation, saved note, saved filter, reviewer identity, signoff,
   persistence, ticketing, report export, owner assignment, runnable checklist,
   task launcher, shell panel, proof scoring, ranking, certification, or
   command runner.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved review-pass history, saved reviewer progress, saved observations,
  saved notes, saved filters, saved citation selections, saved source-map
  selections, saved boundary selections, saved walkthrough selections, saved
  storyline selections, persistent notes, local storage, or saved action
  ownership;
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

- focused frontend model tests proving storyline segments derive from the Stage
  36 `reviewObservationBoundaryWalkthrough` steps, source path groups, static
  guardrail groups, default focus, and source Stage 35 boundary ledger;
- assertions that default opening segment, segment order, source-stage evidence
  group order, and guardrail reference order remain stable;
- assertions that each segment carries source summary, source anchor hrefs,
  related observation row ids, related source stages, static guardrail ids,
  prior surface references, local-only flags, and non-goal context;
- assertions that segments are local, informational, non-actionable,
  non-persistent, non-executable, non-ranking, and non-certifying;
- view-model tests proving the storyline connects to the existing fixture and
  local-live boundary and does not change stream behavior;
- mission-console coverage showing local anchor references render without
  route changes, saved state, command execution, exports, signoff, owner
  assignment, proof scoring, certification, or runnable checklist semantics;
- existing Stage 36 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved observations, notes, filters, citation selections, source-map
  selections, boundary selections, walkthrough selections, storyline
  selections, review progress, local storage, or persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, cloud-backed handoff primitives,
  ranking, scoring, certification, or deploy work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, or app-wide routing.

## Exit Criteria

- one deterministic local observation storyline is source-backed and
  visible/testable;
- storyline segments are derived from Stage 36 walkthrough data, not ad hoc UI
  strings;
- default opening segment, segment order, source-stage evidence group order,
  and guardrail reference order remain stable;
- source summary, source anchor hrefs, related observations, related source
  stages, static guardrail context, and prior review-surface references are
  explicit and source-backed;
- source-stage evidence groups and guardrail references are explanatory,
  non-actionable, non-persistent, non-executable, non-ranking, and
  non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved review sessions,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, ownership
  launchers, proof scoring, certification, executable command automation, or
  app-wide navigation.
