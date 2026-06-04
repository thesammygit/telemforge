# Stage 31: Review Walkthrough Path And Static Prompt Deck

## Goal

Turn the Stage 30 local review surface index into a deterministic reviewer
walkthrough path. A reviewer should be able to scan the suggested local review
order, see the static inspection prompt for each surface group, jump to the
existing in-page anchors, and understand what evidence to inspect without saved
progress, reviewer identity, command execution, report export, signoff,
ownership, scoring, certification, or production handoff semantics.

This stage remains deterministic, local, read-only, fixture-first, and
non-persistent. It is not a runnable checklist, task launcher, saved reviewer
workspace, report writer, proof scorer, certification workflow, owner
assignment system, routing shell, or deployment step.

## Decisions To Make

### Walkthrough Shape

Option A: deterministic local walkthrough path

- derives walkthrough steps from the Stage 30 `reviewSurfaceIndex` rows and
  workflow groups;
- preserves local anchor ids, source schemas, surface labels, stage numbers,
  status labels, and useful counts from the indexed review surfaces;
- adds static inspection prompts and expected observations for each workflow
  group without storing completion state;
- keeps every link local to the current mission console page;
- treats command references and human checks as static explanatory text only.

Option B: saved review session

- would add stored completion state, selected steps, reviewer identity,
  persistent notes, or session recovery before the local walkthrough is proven.

Option C: executable checklist or handoff package

- would cross into command execution, owner assignment, task launchers,
  signoff, report export, package writing, audit retention, or production
  handoff before the console has a clear read-only review route.

Recommended: start with Option A. Stage 31 should make the existing review
surface index easier to use during human review while preserving the
local-only, non-executable boundary.

### Placement

Option A: compact walkthrough panel adjacent to the surface index

- keeps the walkthrough near the Stage 30 navigation map it depends on;
- lets reviewers move from orientation to inspection without a new route;
- preserves existing review panel order and fixture/local-live behavior.

Option B: app-wide navigation redesign

- would change routing, layout, persistence, and visual hierarchy more than
  this stage needs.

Recommended: Option A. The first walkthrough should guide review, not redesign
the whole mission console.

## Work Items

- add a deterministic local walkthrough helper, preferably
  `frontend/src/lib/reviewWalkthroughPath.ts`, over
  `ReviewSurfaceIndexView`;
- define compact Stage 31 types in
  `frontend/src/features/mission-console/types.ts` for walkthrough steps,
  prompt groups, anchor references, expected observations, local counts, and
  deferred boundary notes;
- wire the walkthrough into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  30 surface index is built;
- surface a compact Stage 31 walkthrough path and static prompt deck in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 30
  review surface index;
- update `frontend/src/styles/global.css` only as needed for the compact
  walkthrough panel;
- add focused frontend tests in a new
  `tests/frontend/reviewWalkthroughPath.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 30 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 31 artifact under
  `docs/development/artifacts/stage31-review-walkthrough-path/` describing the
  walkthrough contract, source files, verification commands, human test gate,
  and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 31 walkthrough path near the Stage 30 surface index;
3. confirm the walkthrough is derived from the Stage 30 indexed surfaces and
   not from ad hoc UI strings;
4. confirm the walkthrough groups decision, action, readiness, evidence, proof,
   navigator, and reconciliation review phases in a stable order;
5. confirm each step preserves an existing local anchor id and links to an
   existing mission-console section;
6. confirm each step shows a static inspection prompt and expected observation
   without storing progress or completion state;
7. confirm source schema labels, contract labels, local status labels, and
   useful counts remain visible from the underlying surface index;
8. follow several in-page anchor links and verify the page stays on the same
   route;
9. confirm deferred production scope remains visible and non-actionable;
10. complete the review without saved step selections, saved walkthrough
    progress, reviewer identity, signoff, persistence, ticketing, report
    export, owner assignment, runnable checklists, task launchers, shell
    panels, proof scoring, certification, or command-runner controls.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved review-pass history, saved reviewer progress, saved walkthrough
  selections, saved surface selections, saved navigation filters, saved trace
  selections, saved coverage filters, saved priority filters, saved proof
  selections, saved proof packet selections, saved navigator selections, saved
  reconciliation selections, persistent notes, or saved action ownership;
- no reviewer signoff workflow, audit retention, approval identity, production
  readiness scoring, proof scoring, or certification;
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

- focused frontend model tests proving the walkthrough steps are derived from
  the Stage 30 `reviewSurfaceIndex` rows and workflow groups;
- assertions that workflow phases preserve the stable decision, action,
  readiness, evidence, proof, navigator, and reconciliation order;
- assertions that each walkthrough step preserves local anchor ids from the
  surface index and resolves to existing mission-console sections;
- assertions that static prompts and expected observations are informational
  only, with no persisted completion state or command execution affordances;
- view-model tests proving the walkthrough is connected to the existing
  fixture/local-live boundary and does not change stream behavior;
- mission-console coverage showing local anchor links render without route
  changes, saved state, command execution, exports, or runnable checklist
  semantics;
- existing Stage 30 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved step selections, saved walkthrough progress, saved surface selections,
  saved navigation filters, saved filters, local storage, or persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, cloud-backed handoff
  primitives, scoring, certification, or deploy work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, or app-wide routing.

## Exit Criteria

- one deterministic local review walkthrough path is source-backed and
  visible/testable;
- walkthrough steps are derived from the Stage 30 surface index, not ad hoc UI
  strings;
- decision, action, readiness, evidence, proof, navigator, and reconciliation
  phases remain visible in stable local review order;
- each walkthrough step has a local anchor id that resolves to an existing
  mission-console section;
- source schemas, contract labels, local statuses, counts, static prompts, and
  expected observations remain explicit;
- prompts are informational, local, non-persistent, non-executable, and
  non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved review sessions,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, ownership
  launchers, proof scoring, certification, executable command automation, or
  app-wide navigation.
