# Stage 82: Constraint Response Source Crosswalk And Static Review Checks

## Goal

Turn the completed Stage 81 constraint-response review path and static response
prompts into a deterministic local source crosswalk and static review-check
surface so a reviewer can compare each response-prep prompt with its source
chain before drafting outside the app.

This stage remains deterministic, local, read-only, fixture-first,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It is not saved reviewer answers, saved answer drafts, saved reviewer notes,
saved response notes, saved response-review state, saved source-crosswalk
state, owner assignment, ticketing, runnable checklists, task launchers,
meeting workflow, signoff, audit retention, report export, handoff package
generation, command execution, scoring, certification, deployment, or
main-branch integration.

## Decisions To Make

### Crosswalk Shape

Option A: deterministic local source crosswalk and static review checks

- derives ordered source-crosswalk rows from Stage 81 constraint-response
  review-path steps;
- derives static review-check cards from Stage 81 static response-review prompt
  cards;
- preserves Stage 81 step order and Stage 81 prompt order;
- carries the Stage 81 default constraint-response context into the Stage 82
  summary;
- exposes Stage 81 step ids, Stage 81 response-review prompt ids, Stage 80
  constraint-coverage row ids, Stage 80 response-note prompt ids, Stage 79
  answer-review and constraint-note ids, Stage 78 answer-check/readiness ids,
  Stage 77 response-prompt/review-path ids, Stage 76 response-map ids, Stage 75
  coverage-review ids, Stage 74 coverage/readiness ids, Stage 73 review-path
  ids, Stage 72 source-recap ids, Stage 71 review-lane ids, Stage 70 crosswalk
  ids, Stage 69 walkthrough ids, Stage 68 answer coverage ids, Stage 67
  rehearsal ids, Stage 66 board ids, Stage 65 brief ids, Stage 64 triage ids,
  anchors, callbacks, gap prompts, deferred reminders, labels, static
  response-review prompt text, static review-check text, local-only flags, and
  non-goal context as manual review context only.

Option B: saved response-source worksheet

- would add saved source selections, editable response drafts, reviewer notes,
  local storage, persisted source-check progress, or reviewer identity before a
  static crosswalk is validated.

Option C: workflow, signoff, scoring, or export package

- would turn the crosswalk into owner assignment, tasks, tickets, meeting
  workflow, signoff, audit state, ranking, scoring, certification, report
  export, handoff package generation, or command execution before a reviewer
  validates the static local surface.

Recommended: start with Option A. Stage 82 should make Stage 81 response-prep
prompts easier to inspect against their source chains without adding saved
state, workflow, scoring, certification, exports, commands, routing, ownership,
or production handoff semantics.

### Placement

Option A: compact source-crosswalk panel near the Stage 81 panel

- keeps the source crosswalk adjacent to the constraint-response review path and
  static response-review prompts it derives from;
- lets reviewers compare step order, prompt order, source chains, anchors,
  callbacks, gap prompts, deferred reminders, and static review checks without
  leaving the mission console route;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: separate source review route

- would introduce broader navigation, route changes, saved source-check state,
  signoff/audit semantics, meeting workflow, or app-wide review workflow
  outside the bounded stage.

Recommended: Option A. The first constraint-response source crosswalk should be
a compact read-only mission-console panel.

## Work Items

- add a deterministic local helper, preferably
  `frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk.ts`,
  over the Stage 81
  `ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathView`;
- define compact Stage 82 types in
  `frontend/src/features/mission-console/types.ts` for source-crosswalk rows,
  static review-check cards, summary fields, default source-check context,
  crosswalk labels, review-check labels, source chains, and static non-goal
  flags;
- wire the source crosswalk into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  81 constraint-response review path is built, without changing fixture or
  local-live boundaries;
- surface a compact Stage 82 source-crosswalk/static review-check panel in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 81
  panel;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  82 panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk.test.ts`
  and update `tests/frontend/consoleViewModel.test.ts` where needed;
- add a public-safe Stage 82 artifact under
  `docs/development/artifacts/stage82-constraint-response-source-crosswalk/`
  describing the source-crosswalk contract, source files, verification
  commands, human test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 82 source-crosswalk panel near the Stage 81
   constraint-response review path;
3. confirm source-crosswalk row order preserves Stage 81 review-path step order;
4. confirm static review-check card order preserves Stage 81 response-review
   prompt order;
5. confirm the default source-check context mirrors the Stage 81 default
   constraint-response context;
6. confirm each source-crosswalk row shows Stage 81 review-path step ids, Stage
   81 response-review prompt ids, Stage 80 row and response-note prompt ids,
   Stage 79 answer-review and constraint-note ids, Stage 78 answer-check and
   readiness ids, Stage 77 through Stage 64 source ids, local anchors,
   callbacks, gap prompts, deferred reminders, labels, static response-review
   prompt text, and static review-check text;
7. follow local anchor links and verify the page stays on the same route;
8. confirm the panel is static manual-review context only and does not become
   saved reviewer answers, saved answer drafts, saved source selections, saved
   response notes, saved source-crosswalk state, route changes, exports,
   signoff, audit retention, scoring, certification, owner assignment, meeting
   workflow, handoff package generation, runnable checklist, task launcher, or
   command execution.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved reviewer answers, saved answer drafts, saved reviewer notes, saved
  response notes, saved source selections, saved response review state, saved
  source-crosswalk state, local storage, persistence, saved review sessions,
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

- focused frontend model tests proving source-crosswalk rows derive from Stage
  81 review-path steps and static review-check cards derive from Stage 81
  static response-review prompt cards;
- assertions that source-crosswalk row order, static review-check card order,
  default context, label order, and source/anchor reference order remain stable;
- assertions that each source-crosswalk row carries Stage 81 through Stage 64
  source ids, anchors, callbacks, gaps, deferred reminders, labels, static
  response-review prompt text, static review-check text, local-only flags, and
  static non-goal context;
- assertions that source-crosswalk rows and static review checks are local,
  informational, static, non-actionable, non-persistent, non-executable,
  non-routing, non-ranking, and non-certifying;
- view-model tests proving the source-crosswalk surface connects to the
  existing fixture and local-live boundary and does not change stream behavior;
- mission-console coverage showing source/anchor references render without
  route changes, saved state, command execution, exports, signoff, owner
  assignment, proof scoring, certification, meeting workflow, handoff package
  generation, or runnable checklist semantics;
- existing Stage 81 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved reviewer answers, saved answer drafts, saved reviewer notes, saved
  response notes, saved source selections, saved response review state, saved
  source-crosswalk state, saved review progress, local storage, or persistence
  tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, route changes, app-wide routing, or meeting
  workflow.

## Exit Criteria

- one deterministic local constraint-response source crosswalk and static
  review-check surface is source-backed and visible/testable;
- source-crosswalk rows derive from Stage 81 constraint-response review-path
  steps and static review-check cards derive from Stage 81 response-review
  prompt cards, not ad hoc UI strings;
- source-crosswalk row order, static review-check card order, default context,
  labels, and source/anchor reference order remain stable;
- Stage 81 review-path steps and static response-review prompt cards, Stage 80
  constraint-coverage rows and static response-note prompt cards, Stage 79
  answer-review path steps and static constraint-note cards, Stage 78 static
  answer-check cards and readiness rows, Stage 77 response-prompt cards and
  review-path steps, Stage 76 response-map rows and static follow-up prompt
  cards, Stage 75 coverage-review steps, Stage 74 coverage rows, Stage 73
  review-path steps, Stage 72 source-recap rows, Stage 71 review-lane rows,
  Stage 70 crosswalk rows, Stage 69 walkthrough steps, Stage 68 answer coverage
  rows, Stage 67 rehearsal path steps, Stage 66 board rows, Stage 65 brief rows,
  Stage 64 triage rows, local anchors, callbacks, gaps, deferred reminders,
  labels, static response-review prompt text, and static review-check text are
  explicit and source-backed;
- source-crosswalk rows and static review-check cards are explanatory, static,
  in-page only, non-actionable, non-persistent, non-executable, non-routing,
  non-ranking, and non-certifying;
- the mission-console panel is compact and adjacent to Stage 81 without route
  changes, saved state, command execution, exports, signoff, owner assignment,
  scoring, certification, meeting workflow, handoff package generation, or
  runnable checklist behavior;
- focused tests and the public repo guard pass.
