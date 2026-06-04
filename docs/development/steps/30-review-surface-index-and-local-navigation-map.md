# Stage 30: Review Surface Index And Local Navigation Map

## Goal

Turn the completed local review/proof chain into a compact mission-console
surface index. A reviewer should be able to scan the review sections that now
span Stages 14 through 29, see which local surface each section represents, and
navigate to the relevant in-page anchor without stored navigation state,
progress tracking, command execution, report export, signoff, ownership, or
production handoff semantics.

This stage remains deterministic, local, read-only, fixture-first, and
non-persistent. It is not a new routing shell, saved reviewer workspace,
handoff report, command launcher, runnable checklist, proof scorer,
certification workflow, signoff flow, ticket queue, owner assignment system, or
deployment step.

## Decisions To Make

### Index Shape

Option A: deterministic local review surface index

- derives index rows from the existing mission-console review view-model
  surfaces;
- preserves the Stage 14 through Stage 29 surface ids, labels, local status,
  anchor ids, source schema labels, and counts;
- groups surfaces by local review workflow phase without scoring or certifying
  readiness;
- keeps anchor links local to the current mission console page;
- treats command references as static text only and never executes them.

Option B: saved navigation workspace

- would add persisted selected sections, reviewer progress, saved filters,
  identity, ownership, notes, and session recovery before the static surface
  map is useful.

Option C: external report or handoff export

- would cross into report authoring, package writing, export retention,
  signoff, or production handoff before the in-console review surface is easy
  to inspect.

Recommended: start with Option A. Stage 30 should make the accumulated review
surfaces easier to inspect while preserving the existing local-only boundary.

### Placement

Option A: compact index near the top of the review surface

- gives reviewers an immediate map of the later-stage review panels;
- links to existing in-page anchors without replacing the mission-console
  layout;
- keeps the existing panel order and fixture/local-live behavior unchanged.

Option B: broad mission-console redesign

- would change the main layout, routing, navigation model, and visual hierarchy
  more than this stage needs.

Recommended: Option A. The first index should improve orientation, not redesign
the whole console.

## Work Items

- add a deterministic local review surface index helper, preferably
  `frontend/src/lib/reviewSurfaceIndex.ts`, over the existing review view-model
  surfaces;
- define compact Stage 30 types in
  `frontend/src/features/mission-console/types.ts` for surface rows, workflow
  groups, anchor references, local surface counts, and deferred boundary notes;
- wire the surface index into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  14 through Stage 29 review surfaces are built;
- surface a compact Stage 30 review surface index and local navigation map in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the first
  review-oriented section, without changing fixture/local-live boundaries;
- update `frontend/src/styles/global.css` only as needed for the compact index;
- add focused frontend tests in a new
  `tests/frontend/reviewSurfaceIndex.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 29 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 30 artifact under
  `docs/development/artifacts/stage30-review-surface-index/` describing the
  index contract, source files, verification commands, human test gate, and
  deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 30 review surface index near the review panels;
3. confirm the index lists the completed local review surfaces from Stage 14
   through Stage 29 in a stable order;
4. confirm each row has a local anchor id that resolves to an existing
   mission-console section;
5. confirm rows preserve source schema/contract labels and useful counts from
   their underlying view-model surfaces;
6. confirm workflow groups distinguish decision, action, readiness, evidence,
   proof, navigator, and reconciliation surfaces without scoring or certifying
   production readiness;
7. follow an in-page anchor link to a review section without changing routes,
   saving state, or executing commands;
8. confirm deferred production scope remains visible and non-actionable;
9. complete the review without saved surface selections, saved navigation
   filters, saved progress, reviewer identity, signoff, persistence, ticketing,
   report export, owner assignment, runnable checklists, task launchers, shell
   panels, proof scoring, certification, or command-runner controls.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved review-pass history, saved reviewer progress, persistent notes,
  saved trace selections, saved coverage filters, saved priority filters, saved
  proof selections, saved proof packet selections, saved navigator selections,
  saved reconciliation selections, saved surface selections, saved navigation
  filters, saved consistency filters, or saved action ownership;
- no reviewer signoff workflow, audit retention, approval identity, production
  readiness scoring, proof scoring, or certification;
- no external ticketing, messaging, email, workflow integrations, owner
  assignment, task launcher, or queue ownership;
- no cloud services, telemetry upload, paid APIs, browser-cookie import, or
  external network calls;
- no deploy/release/publish work;
- no production evidence archive or database migration;
- no report designer, downloadable styled report system, free-form export
  builder, report package writer, handoff report exports, or production handoff
  package;
- no executable command runner, shell automation panel, runnable checklist,
  proof scorer, production gate, or shell command UI;
- no broad frontend redesign, new routing shell, or app-wide navigation system;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused frontend model tests proving index rows are derived from existing
  review view-model surfaces, not ad hoc UI strings;
- assertions that the Stage 14 through Stage 29 review surfaces appear in a
  stable local review order;
- assertions that anchor ids match existing mission-console section anchors;
- assertions that source schemas, contract labels, local status labels, and
  counts are preserved from the underlying surfaces;
- assertions that workflow groups distinguish decision, action, readiness,
  evidence, proof, navigator, and reconciliation surfaces without certification
  language;
- view-model tests proving the surface index is connected to the existing
  fixture/local-live boundary and does not change stream behavior;
- mission-console coverage showing the index renders local anchor links without
  route changes, saved state, command execution, or exports;
- existing Stage 29 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved surface selections, saved navigation filters, saved reconciliation
  selections, saved navigator selections, saved packet selections, saved proof
  selections, saved filters, saved progress, local storage, or persistence
  tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, cloud-backed handoff primitives,
  scoring, certification, or deploy work;
- command execution UI, shell panels, task launchers, runnable checklists, proof
  scorers, owner assignment, or app-wide routing.

## Exit Criteria

- one deterministic local review surface index is source-backed and
  visible/testable;
- index rows are derived from existing mission-console review view-model
  surfaces, not ad hoc UI strings;
- Stage 14 through Stage 29 review surfaces remain visible in stable local
  review order;
- each index row has a local anchor id that resolves to an existing section;
- source schemas, contract labels, local statuses, and useful counts remain
  explicit;
- decision, action, readiness, evidence, proof, navigator, and reconciliation
  workflow groups are visible, informational, and non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved review progress,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, ownership launchers,
  proof scoring, certification, executable command automation, or app-wide
  navigation.
