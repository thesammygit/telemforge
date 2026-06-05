# Stage 41: Review Observation Handoff Agenda And Static Facilitation Guide

## Goal

Turn the Stage 40 observation handoff question prompt rail into a deterministic
local handoff agenda and static facilitation guide so a reviewer can run a
manual review conversation in a clear order, see which evidence anchors belong
to each agenda section, and keep deferred production scope visible without
creating workflow ownership or saved review state.

This stage remains deterministic, local, read-only, fixture-first, and
non-persistent. It is not saved agenda progress, saved answers, a task launcher,
a runnable checklist, owner assignment, signoff, audit retention, ranking,
quality scoring, certification, report export, handoff package generation,
command execution, app-wide routing, or deployment work.

## Decisions To Make

### Agenda Shape

Option A: deterministic local handoff agenda and facilitation guide

- derives agenda sections from Stage 40 prompt groups, review questions,
  evidence prompts, gap prompts, and deferred-scope prompts;
- preserves Stage 40 prompt-group order and uses the Stage 40 default prompt
  group as the first agenda section;
- shows section goals, source anchors, facilitator prompts, gap discussion
  points, and deferred-scope reminders;
- keeps every agenda item informational, local-only, non-actionable,
  non-persistent, non-executable, non-ranking, and non-certifying.

Option B: runnable review checklist or meeting workflow

- would turn the static agenda into ownership, progress tracking, task
  launching, command execution, or workflow status before manual review has
  happened.

Option C: saved reviewer agenda state

- would add persistence, reviewer identity, saved answers, notes, section
  progress, or review history before TelemForge has a local-only facilitation
  surface.

Recommended: start with Option A. Stage 41 should help a human run a better
manual handoff conversation over the completed Stage 40 prompt rail without
creating answer, ownership, signoff, export, score, route, command, or
certification semantics.

### Placement

Option A: compact agenda panel near the Stage 40 prompt rail

- keeps the facilitator order next to the questions and anchors it summarizes;
- lets reviewers move from prompt groups to agenda sections without opening a
  route or saving state;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: app-wide facilitation workspace

- would introduce routing, saved workspaces, and broader navigation semantics
  beyond this bounded stage.

Recommended: Option A. The first handoff agenda should be a compact read-only
mission-console surface.

## Work Items

- add a deterministic local helper, preferably
  `frontend/src/lib/reviewObservationHandoffAgenda.ts`, over
  `ReviewObservationHandoffQuestionsView`;
- define compact Stage 41 types in
  `frontend/src/features/mission-console/types.ts` for agenda sections,
  facilitation prompts, evidence stops, gap discussion points,
  deferred-scope reminders, and agenda summary fields;
- wire the agenda into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  40 observation handoff questions rail is built, without changing
  fixture/local-live boundaries;
- surface a compact Stage 41 handoff agenda/static facilitation guide panel in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 40
  prompt rail;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  41 panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationHandoffAgenda.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 40 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 41 artifact under
  `docs/development/artifacts/stage41-review-observation-handoff-agenda/`
  describing the agenda contract, source files, verification commands, human
  test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 41 handoff agenda/static facilitation guide near the Stage 40
   prompt rail;
3. confirm agenda sections preserve Stage 40 prompt-group order;
4. confirm the first agenda section uses the Stage 40 default prompt group;
5. confirm each section shows section goals, source anchor references,
   facilitator prompts, gap discussion points, deferred-scope reminders, and
   compact counts;
6. confirm agenda items are static manual-review context only and do not become
   saved answers, saved progress, tasks, tickets, checklists, owner
   assignments, scores, ranks, certifications, exports, command runners, or
   signoff;
7. follow local anchor links and verify the page stays on the same route;
8. confirm there is no saved agenda state, saved question state, saved
   coverage/deck/storyline/walkthrough/boundary/source-map/citation selection,
   saved reviewer progress, saved observation, saved note, saved filter,
   reviewer identity, signoff, persistence, ticketing, report export, handoff
   package generation, owner assignment, runnable checklist, task launcher,
   shell panel, proof scoring, ranking, certification, or command runner.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved review-pass history, saved agenda progress, saved reviewer progress,
  saved observations, saved notes, saved filters, saved question answers, saved
  agenda answers, saved citation selections, saved source-map selections, saved
  boundary selections, saved walkthrough selections, saved storyline
  selections, saved deck selections, saved coverage selections, persistent
  notes, local storage, or saved action ownership;
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

- focused frontend model tests proving agenda sections derive from the Stage 40
  `reviewObservationHandoffQuestions` prompt groups, review questions, evidence
  prompts, gap prompts, and deferred-scope prompts;
- assertions that default agenda section, agenda section order, facilitator
  prompt order, evidence-stop order, gap discussion point order, and
  deferred-scope reminder order remain stable;
- assertions that each section carries source prompt-group ids, source coverage
  row ids, source handoff card ids, local anchor hrefs, related review question
  ids, related evidence prompt ids, related gap prompt ids, related
  deferred-scope prompt ids, local-only flags, and non-goal context;
- assertions that agenda sections and prompts are local, informational,
  non-actionable, non-persistent, non-executable, non-ranking, and
  non-certifying;
- view-model tests proving the agenda connects to the existing fixture and
  local-live boundary and does not change stream behavior;
- mission-console coverage showing local anchor references render without
  route changes, saved state, command execution, exports, signoff, owner
  assignment, proof scoring, certification, or runnable checklist semantics;
- existing Stage 40 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved observations, notes, filters, agenda answers, question answers,
  citation selections, source-map selections, boundary selections, walkthrough
  selections, storyline selections, deck selections, coverage selections,
  review progress, local storage, or persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, or app-wide routing.

## Exit Criteria

- one deterministic local handoff agenda/static facilitation guide is
  source-backed and visible/testable;
- agenda sections are derived from Stage 40 handoff question prompt groups, not
  ad hoc UI strings;
- default agenda section, agenda section order, facilitator prompt order,
  evidence-stop order, gap discussion point order, and deferred-scope reminder
  order remain stable;
- source prompt groups, source coverage rows, source handoff cards, local
  anchor hrefs, related review questions, related evidence prompts, related gap
  prompts, and related deferred-scope prompts are explicit and source-backed;
- agenda sections, facilitator prompts, evidence stops, gap discussion points,
  and deferred-scope reminders are explanatory, non-actionable,
  non-persistent, non-executable, non-ranking, and non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved review sessions,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, handoff package
  generation, ownership launchers, proof scoring, certification, executable
  command automation, or app-wide navigation.
