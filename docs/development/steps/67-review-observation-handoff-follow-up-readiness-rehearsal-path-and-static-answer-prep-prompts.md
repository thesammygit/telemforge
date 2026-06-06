# Stage 67: Review Observation Handoff Follow-Up Readiness Rehearsal Path And Static Answer Prep Prompts

## Goal

Turn the completed Stage 66 readiness review board rows and static question
prompt cards into a deterministic local reviewer rehearsal path so a human
reviewer can step through the review board in stable order and prepare manual
answer context before the next review pass.

This stage remains deterministic, local, read-only, fixture-first,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It is not saved reviewer answers, saved answer drafts, saved rehearsal state,
saved review board state, saved question prompt state, saved readiness brief
state, saved notes, owner assignment, ticketing, runnable checklists, task
launchers, meeting workflow, signoff, audit retention, report export, handoff
package generation, command execution, scoring, certification, deployment, or
main-branch integration.

## Decisions To Make

### Rehearsal Path Shape

Option A: deterministic local rehearsal path and static answer-prep prompts

- derives ordered rehearsal path steps from Stage 66 review board rows;
- derives static answer-prep prompt cards from Stage 66 static question prompt
  cards;
- preserves Stage 66 board row order and static question prompt order;
- carries Stage 66 default review board context into the rehearsal summary;
- exposes Stage 66 review board row ids, Stage 65 brief row ids, Stage 64
  triage row ids, synthesis row ids, review-lane row ids, readiness brief row
  ids, review path step ids, coverage row ids, response trace row ids,
  walkthrough step ids, response row ids, question row ids, static reviewer
  prompt ids, static question prompt card ids, static check prompt ids, local
  anchors, evidence callbacks, gap discussion prompts, deferred-scope
  reminders, coverage notes, gap notes, handoff prompts, readiness brief text,
  review-lane text, human-check prompt text, follow-up note text, static check
  prompt text, static reviewer prompt text, static question prompt text, and
  static answer-prep prompt text as manual review context only.

Option B: editable answer drafts or saved rehearsal state

- would add persistence, reviewer identity, local storage, saved answers, saved
  answer drafts, saved rehearsal state, saved board state, saved question state,
  saved notes, saved gap notes, saved prompt edits, or saved source readiness
  state before the static rehearsal contract is proven.

Option C: workflow launch, ownership, signoff, scoring, or certification

- would turn the rehearsal path into production workflow, owner assignment,
  signoff, audit state, command execution, task launch, meeting workflow,
  ranking, scoring, certification, report export, or handoff package generation
  before a reviewer validates the local static rehearsal surface.

Recommended: start with Option A. Stage 67 should make the Stage 66 board
reviewable as a compact manual rehearsal path without introducing saved state,
workflow, scoring, certification, exports, commands, routing, ownership, or
production handoff semantics.

### Placement

Option A: compact rehearsal path near the Stage 66 readiness review board

- keeps the rehearsal path beside the board rows and static question prompt
  cards it derives from;
- lets reviewers compare questions, anchors, callbacks, gaps, deferred
  reminders, and static answer-prep prompts without leaving the mission console
  route;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: separate review rehearsal route or workspace

- would introduce broader navigation, route changes, saved review state,
  signoff/audit semantics, meeting workflow, or app-wide review workflow outside
  the bounded stage.

Recommended: Option A. The first readiness rehearsal path should be a compact
read-only mission-console panel.

## Work Items

- add a deterministic local helper, preferably
  `frontend/src/lib/reviewObservationHandoffFollowUpReadinessRehearsalPath.ts`,
  over the Stage 66
  `ReviewObservationHandoffFollowUpReadinessReviewBoardView`;
- define compact Stage 67 types in
  `frontend/src/features/mission-console/types.ts` for rehearsal path steps,
  static answer-prep prompt cards, summary fields, default rehearsal context,
  and static non-goal flags;
- wire the rehearsal path into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  66 readiness review board is built, without changing fixture/local-live
  boundaries;
- surface a compact Stage 67 rehearsal path/static answer-prep prompts panel in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 66
  readiness review board panel;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  67 panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationHandoffFollowUpReadinessRehearsalPath.test.ts`
  and update `tests/frontend/consoleViewModel.test.ts` where needed;
- add a public-safe Stage 67 artifact under
  `docs/development/artifacts/stage67-review-observation-handoff-follow-up-readiness-rehearsal-path/`
  describing the rehearsal contract, source files, verification commands, human
  test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 67 readiness rehearsal path near the Stage 66 readiness
   review board panel;
3. confirm rehearsal path step order preserves Stage 66 board row order;
4. confirm static answer-prep prompt order preserves Stage 66 static question
   prompt card order;
5. confirm the default rehearsal context mirrors the Stage 66 default review
   board context;
6. confirm each rehearsal path step shows Stage 66 board row id, Stage 65 brief
   row id, Stage 64 triage row id, synthesis row id, review-lane row id,
   readiness brief row id, review path step id, coverage row id, response trace
   row id, walkthrough step id, response row id, question row id, static
   reviewer prompt ids, static question prompt card ids, static check prompt
   ids, local anchor hrefs, anchor target ids, evidence callbacks, gap
   discussion prompts, deferred-scope reminders, coverage note text, gap note
   text, handoff prompt text, readiness brief text, review-lane text,
   human-check prompt text, follow-up note text, static check prompt text,
   static reviewer prompt text, static question prompt text, static
   answer-prep prompt text, and compact non-goal context;
7. follow local anchor links and verify the page stays on the same route;
8. confirm the panel is static manual-review context only and does not become
   saved reviewer answers, saved answer drafts, saved rehearsal state, saved
   review board state, saved question prompt state, saved readiness brief state,
   saved prompt state, saved notes, saved gap notes, saved handoff edits, saved
   source readiness progress, route changes, exports, signoff, audit retention,
   scoring, certification, owner assignment, meeting workflow, handoff package
   generation, runnable checklist, task launcher, or command execution.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved reviewer answers, saved answer drafts, saved reviewer notes, saved
  rehearsal state, saved rehearsal steps, saved static answer-prep prompts,
  saved review board state, saved board rows, saved static question prompts,
  saved readiness brief state, saved brief rows, saved static reviewer prompts,
  saved triage state, saved check prompts, saved human-check prompts, saved
  follow-up notes, saved gap notes, saved handoff prompt edits, saved source
  readiness response progress, saved response walkthrough progress, saved
  response trace progress, saved response trace coverage progress, saved
  coverage review progress, saved review-lane state, saved synthesis state,
  saved source readiness question progress, saved source readiness rehearsal
  progress, saved source readiness progress, saved source readout progress,
  saved source walkthrough progress, saved source inspection state, saved
  anchor state, saved relay progress, saved inspection state, saved review
  sessions, saved reviewer progress, saved debrief notes, saved continuity
  progress, saved follow-up progress, saved follow-up ownership, saved dry-run
  progress, saved handoff path progress, saved agenda progress, saved
  observations, saved filters, saved answers, saved selections, persistent
  notes, local storage, or saved action ownership;
- no reviewer signoff workflow, audit retention, approval identity,
  production-readiness scoring, proof scoring, quality scoring, ranking, or
  certification;
- no external ticketing, messaging, email, workflow integrations, owner
  assignment, task launcher, queue ownership, runnable checklist behavior, or
  meeting management;
- no cloud services, telemetry upload, paid APIs, browser-cookie import, or
  external network calls;
- no deploy/release/publish work;
- no production evidence archive or database migration;
- no report designer, downloadable styled report system, free-form export
  builder, report package writer, handoff report exports, handoff package
  writer, or production handoff package;
- no executable command runner, shell automation panel, proof scorer,
  production gate, or shell command UI;
- no broad frontend redesign, new routing shell, route changes, or app-wide
  navigation system;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused frontend model tests proving rehearsal path steps derive from Stage
  66 review board rows and static answer-prep prompt cards derive from Stage
  66 static question prompt cards;
- assertions that rehearsal path step order preserves Stage 66 board row order,
  static answer-prep prompt order preserves Stage 66 static question prompt
  order, and source/anchor reference order remains stable;
- assertions that each rehearsal path step carries Stage 66 board row ids,
  Stage 65 brief row ids, Stage 64 triage row ids, synthesis row ids,
  review-lane row ids, readiness brief row ids, review path step ids, coverage
  row ids, response trace row ids, walkthrough step ids, response row ids,
  question row ids, static reviewer prompt ids, static question prompt card
  ids, static check prompt ids, local anchor hrefs, anchor target ids, evidence
  callback ids, gap discussion point ids, deferred-scope reminder ids, coverage
  note text, gap note text, handoff prompt text, readiness brief text,
  review-lane text, human-check prompt text, follow-up note text, static check
  prompt text, static reviewer prompt text, static question prompt text,
  local-only flags, and static non-goal context;
- assertions that rehearsal path steps and static answer-prep prompt cards are
  local, informational, static, non-actionable, non-persistent,
  non-executable, non-routing, non-ranking, and non-certifying;
- view-model tests proving the rehearsal path connects to the existing fixture
  and local-live boundary and does not change stream behavior;
- mission-console coverage showing source/anchor references render without
  route changes, saved state, command execution, exports, signoff, owner
  assignment, proof scoring, certification, meeting workflow, handoff package
  generation, or runnable checklist semantics;
- existing Stage 66 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved reviewer answers, saved answer drafts, saved rehearsal state, saved
  board state, saved question state, saved brief state, saved prompt state,
  saved response progress, saved trace coverage progress, saved readiness
  state, saved review-lane state, saved synthesis state, saved follow-up notes,
  saved triage state, saved check prompts, saved human-check prompts, saved
  reviewer cues, saved gap notes, saved handoff prompt edits, saved source
  readiness progress, saved source inspection state, saved anchor state, saved
  relay progress, saved observations, notes, filters, answers, selections,
  review progress, local storage, or persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, route changes, app-wide routing, or meeting
  workflow.

## Exit Criteria

- one deterministic local readiness rehearsal path and static answer-prep
  prompts surface is source-backed and visible/testable;
- rehearsal path steps derive from Stage 66 review board rows and static
  answer-prep prompt cards derive from Stage 66 static question prompt cards,
  not ad hoc UI strings;
- rehearsal path step order, static answer-prep prompt order, default rehearsal
  context, and source/anchor reference order remain stable;
- Stage 66 board rows, Stage 65 brief rows, Stage 64 triage rows, synthesis
  rows, static question prompt cards, static reviewer prompt cards, static
  check prompt cards, review-lane rows, readiness brief rows, review path
  steps, coverage rows, response trace rows, walkthrough steps, response rows,
  question rows, local anchor hrefs, anchor target ids, evidence callbacks, gap
  discussion points, deferred-scope reminders, coverage notes, gap notes,
  handoff prompts, readiness brief text, review-lane text, human-check prompt
  text, follow-up note text, static check prompt text, static reviewer prompt
  text, static question prompt text, and static answer-prep prompt text are
  explicit and source-backed;
- rehearsal path steps and static answer-prep prompt cards are explanatory,
  static, in-page only, non-actionable, non-persistent, non-executable,
  non-routing, non-ranking, and non-certifying;
- the mission-console panel is compact and adjacent to Stage 66 without route
  changes, saved state, command execution, exports, signoff, owner assignment,
  scoring, certification, meeting workflow, handoff package generation, or
  runnable checklist behavior;
- focused tests and the public repo guard pass;
- the closeout artifact documents verified behavior, verification commands, the
  human test gate, and deferred production features.
