# Stage 125: Constraint Response Revision Coverage Review Path Revision Follow-Up Readiness Review Path Response Prompt Readiness Board Answer Review Path Constraint Coverage Map Review Path Source Crosswalk Review Path Source Review Readiness Lane Source Follow-Up Map And Static Citation Checks

## Goal

Turn the completed Stage 124 source-review readiness lane and static
source-follow-up cue cards into a deterministic local source follow-up map and
static citation-check prompt surface. A reviewer should be able to see which
readiness rows, follow-up cue cards, source-review steps, and local anchors
should be checked before drafting outside the app.

This stage remains deterministic, local, read-only, fixture-first,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It is not saved reviewer answers, saved answer drafts, saved revision drafts,
saved response drafts, saved reviewer notes, saved response notes, saved
response prompts, saved source selections, saved citation selections, saved
source-review readiness state, saved source-follow-up state, saved
citation-check state, owner assignment, ticketing, runnable checklists, task
launchers, meeting workflow, signoff, audit retention, report export, handoff
package generation, command execution, scoring, certification, deployment, or
main-branch integration.

## Decisions To Make

### Follow-Up Map Shape

Option A: deterministic local source follow-up map and static citation checks

- derives ordered follow-up map entries from Stage 124 source-readiness lane
  rows;
- derives static citation-check prompt cards from Stage 124 static
  source-follow-up cue cards;
- preserves Stage 124 readiness row order and Stage 124 cue-card order;
- carries the Stage 124 default source-readiness context into the Stage 125
  summary;
- exposes Stage 124 source-readiness lane row ids, Stage 124 static
  source-follow-up cue card ids, Stage 123 source-review path step ids, Stage
  123 static source-review prompt ids, Stage 122 source-crosswalk row ids,
  Stage 122 static review-check card ids, Stage 121 review-path and
  response-prompt ids, Stage 120 row and response-note prompt ids, Stage 119
  answer-review and constraint-note ids, Stage 118 answer-check/readiness ids,
  Stage 117 response-prompt/review-path ids, Stage 116 readiness/response-check
  ids, Stage 115 through Stage 64 source lineage ids, local anchors, callbacks,
  gap prompts, deferred reminders, labels, follow-up text, citation-check text,
  local-only flags, and static non-goal context as manual review context only.

Option B: saved source follow-up worksheet

- would add saved follow-up state, saved citation selections, editable notes,
  reviewer answers, local storage, persisted progress, or reviewer identity
  before the static follow-up map is validated.

Option C: signoff, citation scoring, export, or workflow package

- would turn the follow-up map into owner assignment, tickets, meeting
  workflow, signoff, audit state, ranking, scoring, certification, report
  export, handoff package generation, or command execution before a reviewer
  validates the static local surface.

Recommended: start with Option A. Stage 125 should make Stage 124 readiness
rows and follow-up cue cards easier to inspect as a source follow-up map
without adding saved state, workflow, scoring, certification, exports,
commands, routing, ownership, or production handoff semantics.

### Placement

Option A: compact source follow-up map panel near the Stage 124 panel

- keeps the follow-up map adjacent to the readiness lane and cue cards it
  derives from;
- lets reviewers compare readiness rows, cue cards, source lineage, anchors,
  callbacks, gap prompts, deferred reminders, and static citation checks
  without leaving the mission console route;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: separate citation-check route

- would introduce broader navigation, route changes, saved citation-check
  state, signoff/audit semantics, meeting workflow, or app-wide review workflow
  outside the bounded stage.

Recommended: Option A. The Stage 125 source follow-up map should be a compact
read-only mission-console panel.

## Work Items

- add a deterministic local helper,
  `frontend/src/lib/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap.ts`,
  over the Stage 124
  `ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneView`;
- define compact Stage 125 types in
  `frontend/src/features/mission-console/types.ts` for follow-up map entries,
  static citation-check prompt cards, summary fields, default follow-up
  context, citation labels, source chains, and static non-goal flags;
- wire the source follow-up map into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  124 source-readiness lane is built, without changing fixture or local-live
  boundaries;
- surface a compact Stage 125 source follow-up map/static citation-check panel
  in `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage
  124 panel;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  125 panel;
- add focused frontend tests in
  `tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap.test.ts`
  and update `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 124 through Stage 116 helper/test coverage in the verification set
  as regression coverage for touched surfaces;
- add a public-safe Stage 125 artifact under
  `docs/development/artifacts/stage125-constraint-response-source-follow-up-map/`
  describing the source follow-up map contract, source files, verification
  commands, human test gate, filename constraint, and deferred production
  features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 125 source follow-up map panel near the Stage 124
   source-readiness lane;
3. confirm follow-up map entry order preserves Stage 124 source-readiness lane
   row order;
4. confirm static citation-check prompt card order preserves Stage 124 static
   source-follow-up cue card order;
5. confirm the default follow-up context mirrors the Stage 124 default
   source-readiness context;
6. confirm each follow-up map entry shows Stage 124 readiness row ids, Stage
   124 cue card ids, Stage 123 source-review step ids, Stage 123 static
   source-review prompt ids, Stage 122 source-crosswalk row ids, Stage 122
   static review-check ids, Stage 121 review-path and response-prompt ids,
   Stage 120 row and response-note prompt ids, Stage 119 answer-review and
   constraint-note ids, Stage 118 answer-check and readiness ids, Stage 117
   through Stage 64 source ids, local anchors, callbacks, gap prompts,
   deferred reminders, labels, follow-up text, citation-check prompt text, and
   static non-goal context;
7. follow local anchor links and verify the page stays on the same route;
8. confirm the panel is static manual-review context only and does not become
   saved reviewer answers, saved answer drafts, saved source selections, saved
   citation selections, saved source-follow-up state, saved citation-check
   state, route changes, exports, signoff, audit retention, scoring,
   certification, owner assignment, meeting workflow, handoff package
   generation, runnable checklist, task launcher, or command execution.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved reviewer answers, saved answer drafts, saved revision drafts, saved
  response drafts, saved reviewer notes, saved response notes, saved response
  prompts, saved source selections, saved citation selections, saved
  source-review readiness state, saved source-follow-up state, saved
  citation-check state, local storage, persistence, saved review sessions,
  saved reviewer progress, or saved action ownership;
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

- focused frontend model tests proving follow-up map entries derive from Stage
  124 source-readiness lane rows and static citation-check prompt cards derive
  from Stage 124 static source-follow-up cue cards;
- assertions that follow-up map entry order, static citation-check prompt card
  order, default context, label order, and source/anchor reference order remain
  stable;
- assertions that each follow-up map entry carries Stage 124 through Stage 64
  source ids, anchors, callbacks, gaps, deferred reminders, labels,
  source-follow-up text, citation-check prompt text, local-only flags, and
  static non-goal context;
- assertions that follow-up map entries and static citation-check prompt cards
  are local, informational, static, non-actionable, non-persistent,
  non-executable, non-routing, non-ranking, and non-certifying;
- view-model tests proving the source follow-up map connects to the existing
  fixture and local-live boundary and does not change stream behavior;
- mission-console coverage showing source/anchor references render without
  route changes, saved state, command execution, exports, signoff, owner
  assignment, proof scoring, certification, meeting workflow, handoff package
  generation, or runnable checklist semantics;
- existing Stage 124 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved reviewer answers, saved answer drafts, saved reviewer notes, saved
  response notes, saved source selections, saved citation selections, saved
  source-follow-up state, saved citation-check state, saved review progress,
  local storage, or persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, route changes, app-wide routing, or meeting
  workflow.

## Exit Criteria

- one deterministic local constraint-response source follow-up map and static
  citation-check prompt surface is source-backed and visible/testable;
- follow-up map entries derive from Stage 124 source-readiness lane rows and
  static citation-check prompt cards derive from Stage 124 static
  source-follow-up cue cards, not ad hoc UI strings;
- follow-up map entry order, static citation-check prompt card order, default
  context, labels, and source/anchor reference order remain stable;
- Stage 124 readiness row ids and cue card ids, Stage 123 source-review path
  steps and static source-review prompt cards, Stage 122 source-crosswalk rows
  and static review-check cards, Stage 121 review-path steps and static
  response-prompt cards, Stage 120 constraint-coverage rows and static
  response-note prompt cards, Stage 119 answer-review path steps and static
  constraint-note cards, Stage 118 static answer-check cards and readiness
  rows, Stage 117 response-prompt cards and review-path steps, Stage 116
  readiness rows and response-check cards, Stage 115 through Stage 64 source
  ids, local anchors, callbacks, gaps, deferred reminders, labels, source
  follow-up text, and static citation-check prompt text are explicit and
  source-backed;
- follow-up map entries and static citation-check prompt cards are
  explanatory, static, in-page only, non-actionable, non-persistent,
  non-executable, non-routing, non-ranking, and non-certifying;
- the mission-console panel is compact and adjacent to Stage 124 without route
  changes, saved state, command execution, exports, signoff, owner assignment,
  scoring, certification, meeting workflow, handoff package generation, or
  runnable checklist behavior;
- focused tests and the public repo guard pass.
