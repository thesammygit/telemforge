# Stage 42: Review Observation Handoff Path And Static Anchor Map

## Goal

Turn the Stage 41 observation handoff agenda into a deterministic local handoff
path and static anchor map so a reviewer can follow the manual conversation
order, see which in-page evidence anchors belong to each section, and keep the
handoff surface navigable without adding saved progress, route changes, task
launching, ownership, signoff, scoring, exports, command execution, or
production handoff semantics.

This stage remains deterministic, local, read-only, fixture-first, and
non-persistent. It is not saved path progress, a runnable checklist, a meeting
workflow system, a task launcher, owner assignment, report export, handoff
package generation, signoff, audit retention, ranking, quality scoring,
certification, app-wide routing, or deployment work.

## Decisions To Make

### Path Shape

Option A: deterministic local handoff path and static anchor map

- derives ordered path steps from Stage 41 agenda sections, facilitation
  prompts, evidence stops, gap discussion points, and deferred-scope reminders;
- preserves Stage 41 agenda section order and keeps the default agenda section
  as the first path step;
- maps local anchor hrefs to compact in-page anchor targets and source context;
- keeps each path step informational, local-only, non-actionable,
  non-persistent, non-executable, non-routing, non-ranking, and
  non-certifying.

Option B: routed handoff workspace

- would create new app-wide navigation, route state, or saved handoff session
  semantics before the static local review path has been proven.

Option C: runnable checklist or meeting workflow

- would add completion state, owners, task launchers, or executable next steps
  before manual review has happened.

Recommended: start with Option A. Stage 42 should make the completed Stage 41
agenda easier to follow inside the existing mission console without creating
workflow ownership, saved progress, scoring, exports, commands, or routes.

### Placement

Option A: compact path panel near the Stage 41 agenda

- keeps the path next to the agenda it summarizes;
- lets reviewers jump to in-page anchors without opening a new route or saving
  state;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: global navigation shell

- would introduce app-wide routing and broader navigation semantics outside the
  bounded stage.

Recommended: Option A. The first handoff path should be a compact read-only
mission-console surface.

## Work Items

- add a deterministic local helper, preferably
  `frontend/src/lib/reviewObservationHandoffPath.ts`, over
  `ReviewObservationHandoffAgendaView`;
- define compact Stage 42 types in
  `frontend/src/features/mission-console/types.ts` for path steps, anchor map
  entries, source references, summary fields, and static non-goal flags;
- wire the path into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  41 observation handoff agenda is built, without changing fixture/local-live
  boundaries;
- surface a compact Stage 42 handoff path/static anchor map panel in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 41
  agenda;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  42 panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationHandoffPath.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 41 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 42 artifact under
  `docs/development/artifacts/stage42-review-observation-handoff-path/`
  describing the path contract, source files, verification commands, human test
  gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 42 handoff path/static anchor map near the Stage 41 agenda;
3. confirm path steps preserve Stage 41 agenda section order;
4. confirm the first path step uses the Stage 41 default agenda section;
5. confirm each path step shows source agenda section references, local anchor
   targets, facilitation prompt counts, evidence stop counts, gap discussion
   counts, deferred-scope reminder counts, and compact non-goal context;
6. follow local anchor links and verify the page stays on the same route;
7. confirm the panel is static manual-review context only and does not become
   saved path progress, saved agenda progress, saved answers, tasks, tickets,
   checklists, owner assignments, scores, ranks, certifications, exports,
   command runners, route changes, or signoff;
8. confirm there is no saved agenda state, saved path state, saved question
   state, saved coverage/deck/storyline/walkthrough/boundary/source-map/
   citation selection, saved reviewer progress, saved observation, saved note,
   saved filter, reviewer identity, persistence, ticketing, report export,
   handoff package generation, owner assignment, runnable checklist, task
   launcher, shell panel, proof scoring, ranking, certification, or command
   runner.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved review-pass history, saved handoff path progress, saved agenda
  progress, saved reviewer progress, saved observations, saved notes, saved
  filters, saved question answers, saved agenda answers, saved citation
  selections, saved source-map selections, saved boundary selections, saved
  walkthrough selections, saved storyline selections, saved deck selections,
  saved coverage selections, persistent notes, local storage, or saved action
  ownership;
- no reviewer signoff workflow, audit retention, approval identity,
  production-readiness scoring, proof scoring, quality scoring, ranking, or
  certification;
- no external ticketing, messaging, email, workflow integrations, owner
  assignment, task launcher, queue ownership, or runnable checklist behavior;
- no cloud services, telemetry upload, paid APIs, browser-cookie import, or
  external network calls;
- no deploy/release/publish work;
- no production evidence archive or database migration;
- no report designer, downloadable styled report system, free-form export
  builder, report package writer, handoff report exports, handoff package
  writer, or production handoff package;
- no executable command runner, shell automation panel, proof scorer,
  production gate, or shell command UI;
- no broad frontend redesign, new routing shell, or app-wide navigation system;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused frontend model tests proving path steps derive from the Stage 41
  `reviewObservationHandoffAgenda` sections, facilitation prompts, evidence
  stops, gap discussion points, and deferred-scope reminders;
- assertions that default path step, path step order, anchor map order, and
  source reference order remain stable;
- assertions that each path step carries source agenda section ids, source
  prompt group ids, source coverage row ids, source handoff card ids, local
  anchor hrefs, anchor target ids, related facilitation prompt ids, related
  evidence stop ids, related gap discussion point ids, related deferred-scope
  reminder ids, local-only flags, and non-goal context;
- assertions that path steps and anchor map entries are local, informational,
  in-page only, non-actionable, non-persistent, non-executable, non-routing,
  non-ranking, and non-certifying;
- view-model tests proving the path connects to the existing fixture and
  local-live boundary and does not change stream behavior;
- mission-console coverage showing local anchor references render without
  route changes, saved state, command execution, exports, signoff, owner
  assignment, proof scoring, certification, or runnable checklist semantics;
- existing Stage 41 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved observations, notes, filters, agenda answers, question answers, path
  progress, citation selections, source-map selections, boundary selections,
  walkthrough selections, storyline selections, deck selections, coverage
  selections, review progress, local storage, or persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, or app-wide routing.

## Exit Criteria

- one deterministic local handoff path/static anchor map is source-backed and
  visible/testable;
- path steps are derived from Stage 41 agenda sections, not ad hoc UI strings;
- default path step, path step order, anchor map order, and source reference
  order remain stable;
- source agenda sections, source prompt groups, source coverage rows, source
  handoff cards, local anchor hrefs, anchor target ids, related facilitation
  prompts, related evidence stops, related gap discussion points, and related
  deferred-scope reminders are explicit and source-backed;
- path steps and anchor map entries are explanatory, in-page only,
  non-actionable, non-persistent, non-executable, non-routing, non-ranking, and
  non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved review sessions,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, handoff package
  generation, ownership launchers, proof scoring, certification, executable
  command automation, or app-wide navigation.
