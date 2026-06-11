# Stage 106: Constraint Response Revision Follow-Up Readiness Review Path Response Prompt Readiness Board Answer Review Path Constraint Coverage Map Review Path Source Crosswalk Review Path Source Review Readiness Lane Source Follow-Up Map Source Citation Review Lane And Static Evidence Check Prompts

## Goal

Turn the completed Stage 105 source follow-up map and static citation-check
prompt cards into a deterministic local source citation-review lane and static
evidence-check prompt surface. A reviewer should be able to inspect citation
prompts, follow-up map entries, source lineage, local anchors, and evidence
callbacks before drafting outside the app.

This stage remains deterministic, local, read-only, fixture-first,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It is not saved reviewer answers, saved answer drafts, saved revision drafts,
saved response drafts, saved reviewer notes, saved response notes, saved
source selections, saved citation selections, saved source-follow-up state,
saved citation-review state, saved evidence-check state, owner assignment,
ticketing, runnable checklists, task launchers, meeting workflow, signoff,
audit retention, report export, handoff package generation, command
execution, scoring, certification, deployment, or main-branch integration.

## Decisions To Make

### Citation-Review Lane Shape

Option A: deterministic local citation-review lane and static evidence checks

- derives ordered citation-review lane rows from Stage 105 static
  citation-check prompt cards;
- derives static evidence-check prompt cards from Stage 105 source follow-up map
  entries;
- preserves Stage 105 citation prompt order and source follow-up map entry
  order;
- carries the Stage 105 default follow-up context into the Stage 106 summary;
- exposes Stage 105 citation prompt card ids, Stage 105 follow-up map entry
  ids, Stage 104 readiness row ids, Stage 104 cue card ids, Stage 103 through
  Stage 64 source lineage ids, local anchors, callbacks, gap prompts, deferred
  reminders, labels, citation-review text, evidence-check prompt text,
  local-only flags, and static non-goal context as manual review context only.

Option B: saved citation worksheet

- would add saved citation selections, editable reviewer notes, reviewer
  answers, local storage, persisted progress, or reviewer identity before the
  static citation-review lane is validated.

Option C: evidence scoring, signoff, export, or workflow package

- would turn the review lane into owner assignment, tickets, meeting workflow,
  signoff, audit state, ranking, scoring, certification, report export,
  handoff package generation, or command execution before a reviewer validates
  the static local surface.

Recommended: start with Option A. Stage 106 should make Stage 105
citation-check cards and follow-up map entries easier to inspect as a
citation-review lane without adding saved state, workflow, scoring,
certification, exports, commands, routing, ownership, or production handoff
semantics.

### Placement

Option A: compact citation-review lane panel near the Stage 105 panel

- keeps citation-review context adjacent to the Stage 105 source follow-up map
  and citation-check cards it derives from;
- lets reviewers compare citation prompts, follow-up entries, source lineage,
  anchors, callbacks, gap prompts, deferred reminders, and static
  evidence-check prompts without leaving the mission console route;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: separate evidence-check route

- would introduce broader navigation, route changes, saved evidence-check
  state, signoff/audit semantics, meeting workflow, or app-wide review
  workflow outside the bounded stage.

Recommended: Option A. The Stage 106 source citation-review lane should be a
compact read-only mission-console panel.

## Work Items

- add a deterministic local helper,
  `frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane.ts`,
  over the Stage 105 source follow-up map view;
- define compact Stage 106 types in
  `frontend/src/features/mission-console/types.ts` for citation-review lane
  rows, static evidence-check prompt cards, summary fields, default context,
  citation labels, source chains, and static non-goal flags;
- wire the citation-review lane into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  105 source follow-up map is built, without changing fixture or local-live
  boundaries;
- surface a compact Stage 106 citation-review lane/static evidence-check panel
  in `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage
  105 panel;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  106 panel;
- add focused frontend tests in
  `tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane.test.ts`
  and update `tests/frontend/consoleViewModel.test.ts` where needed;
- add a public-safe Stage 106 artifact under
  `docs/development/artifacts/stage106-constraint-response-source-citation-review-lane/`
  describing the citation-review lane contract, source files, verification
  commands, human test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 106 source citation-review lane near the Stage 105 source
   follow-up map;
3. confirm citation-review lane row order preserves Stage 105 static
   citation-check prompt card order;
4. confirm static evidence-check prompt card order preserves Stage 105 source
   follow-up map entry order;
5. confirm the default citation-review context mirrors the Stage 105 default
   follow-up context;
6. confirm each citation-review lane row shows Stage 105 citation prompt ids,
   Stage 105 source follow-up map entry ids, Stage 104 readiness row ids,
   Stage 104 cue card ids, Stage 103 through Stage 64 source ids, local
   anchors, callbacks, gap prompts, deferred reminders, labels,
   citation-review text, evidence-check prompt text, and static non-goal
   context;
7. follow local anchor links and verify the page stays on the same route;
8. confirm the panel is static manual-review context only and does not become
   saved reviewer answers, saved answer drafts, saved reviewer notes, saved
   source selections, saved citation selections, saved citation-review state,
   saved evidence-check state, route changes, exports, signoff, audit
   retention, scoring, certification, owner assignment, meeting workflow,
   handoff package generation, runnable checklist, task launcher, or command
   execution.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved reviewer answers, saved answer drafts, saved revision drafts, saved
  response drafts, saved reviewer notes, saved response notes, saved source
  selections, saved citation selections, saved source-follow-up state, saved
  citation-review state, saved evidence-check state, local storage,
  persistence, saved review sessions, saved reviewer progress, or saved action
  ownership;
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

- focused frontend model tests proving citation-review lane rows derive from
  Stage 105 static citation-check prompt cards and static evidence-check prompt
  cards derive from Stage 105 source follow-up map entries;
- assertions that citation-review lane row order, static evidence-check prompt
  card order, default context, label order, and source/anchor reference order
  remain stable;
- assertions that each citation-review row carries Stage 105 through Stage 64
  source ids, anchors, callbacks, gaps, deferred reminders, labels,
  citation-review text, evidence-check prompt text, local-only flags, and
  static non-goal context;
- assertions that citation-review rows and static evidence-check prompt cards
  are local, informational, static, non-actionable, non-persistent,
  non-executable, non-routing, non-ranking, and non-certifying;
- view-model tests proving the citation-review lane connects to the existing
  fixture and local-live boundary and does not change stream behavior;
- mission-console coverage showing source/anchor references render without
  route changes, saved state, command execution, exports, signoff, owner
  assignment, proof scoring, certification, meeting workflow, handoff package
  generation, or runnable checklist semantics;
- existing Stage 105 through Stage 09 checks as regression coverage for
  touched surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved reviewer answers, saved answer drafts, saved reviewer notes, saved
  response notes, saved source selections, saved citation selections, saved
  citation-review state, saved evidence-check state, saved review progress,
  local storage, or persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, route changes, app-wide routing, or meeting
  workflow.

## Exit Criteria

- one deterministic local constraint-response source citation-review lane and
  static evidence-check prompt surface is source-backed and visible/testable;
- citation-review lane rows derive from Stage 105 static citation-check prompt
  cards and static evidence-check prompt cards derive from Stage 105 source
  follow-up map entries, not ad hoc UI strings;
- citation-review row order, static evidence-check prompt card order, default
  context, labels, and source/anchor reference order remain stable;
- Stage 105 citation prompt cards and follow-up map entries, Stage 104
  readiness row ids and cue card ids, Stage 103 source-review path steps and
  static source-review prompt cards, Stage 102 source-crosswalk rows and static
  review-check cards, Stage 101 review-path steps and static response-prompt
  cards, Stage 100 constraint-coverage rows and static response-note prompt
  cards, Stage 99 answer-review path steps and static constraint-note cards,
  Stage 98 static answer-check cards and readiness rows, Stage 97
  response-prompt cards and review-path steps, Stage 96 readiness rows and
  response-check cards, Stage 95 through Stage 64 source lineage ids, local
  anchors, callbacks, gaps, deferred reminders, labels, citation-review text,
  and static evidence-check prompt text are explicit and source-backed;
- citation-review rows and static evidence-check prompt cards are explanatory,
  static, in-page only, non-actionable, non-persistent, non-executable,
  non-routing, non-ranking, and non-certifying;
- the mission-console panel is compact and adjacent to Stage 105 without route
  changes, saved state, command execution, exports, signoff, owner assignment,
  scoring, certification, meeting workflow, handoff package generation, or
  runnable checklist behavior;
- focused tests and the public repo guard pass.
