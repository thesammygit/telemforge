# Stage 72: Review Observation Handoff Follow-Up Readiness Answer Follow-Up Review Lane Source Recap And Static Next-Pass Prompts

## Goal

Turn the completed Stage 71 answer follow-up review lane rows and static
decision-cue cards into a deterministic local source recap and static next-pass
prompt surface so a human reviewer can scan which source-backed cues are ready
to revisit, which gaps need discussion, and which deferred boundaries must stay
out of scope before the next review pass.

This stage remains deterministic, local, read-only, fixture-first,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It is not saved reviewer answers, saved answer drafts, saved follow-up lane
state, saved source recap state, saved next-pass prompts, owner assignment,
ticketing, runnable checklists, task launchers, meeting workflow, signoff,
audit retention, report export, handoff package generation, command execution,
scoring, certification, deployment, or main-branch integration.

## Decisions To Make

### Source Recap Shape

Option A: deterministic local source recap and static next-pass prompts

- derives ordered source-recap rows from Stage 71 answer follow-up review lane
  rows;
- derives static next-pass prompt cards from Stage 71 static decision-cue
  cards;
- preserves Stage 71 row order and static decision-cue order;
- carries the Stage 71 default review-lane context into the recap summary;
- exposes source Stage 71 row/card ids, Stage 70 crosswalk ids, Stage 70
  prompt ids, Stage 69 walkthrough/review-note ids, Stage 68 coverage/reviewer
  prompt ids, Stage 67 rehearsal/answer-prep ids, Stage 66 board/question ids,
  Stage 65 brief ids, Stage 64 triage ids, anchors, callbacks, gaps, deferred
  reminders, lane labels, static decision-cue text, source-recap text, and
  static next-pass prompt text as manual context only.

Option B: saved source recap, saved next-pass prompts, or editable answer notes

- would add saved reviewer answers, saved answer drafts, persisted recap state,
  saved prompts, local storage, reviewer identity, or editable notes before the
  static recap is proven.

Option C: workflow launch, ownership, signoff, scoring, or certification

- would turn the recap into owner assignment, task launching, ticketing,
  meeting workflow, signoff, audit state, ranking, scoring, certification,
  report export, handoff package generation, or command execution before a
  reviewer validates the static local surface.

Recommended: start with Option A. Stage 72 should make Stage 71 easier to
review by summarizing source-backed cues and next-pass prompts without adding
saved state, workflow, scoring, certification, exports, commands, routing,
ownership, or production handoff semantics.

### Placement

Option A: compact source recap panel near the Stage 71 answer follow-up review
lane panel

- keeps the recap adjacent to the review-lane rows and static decision-cue
  cards it derives from;
- lets reviewers compare source recap text, next-pass prompts, lane labels,
  anchors, callbacks, gaps, and deferred reminders without leaving the mission
  console route;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: separate next-pass workspace or route

- would introduce broader navigation, route changes, saved review state,
  signoff/audit semantics, meeting workflow, or app-wide review workflow
  outside the bounded stage.

Recommended: Option A. The first source recap should be a compact read-only
mission-console panel.

## Work Items

- add a deterministic local helper, preferably
  `frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap.ts`,
  over the Stage 71
  `ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneView`;
- define compact Stage 72 types in
  `frontend/src/features/mission-console/types.ts` for source-recap rows,
  static next-pass prompt cards, summary fields, default source-recap context,
  and static non-goal flags;
- wire the source recap into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  71 answer follow-up review lane view is built, without changing fixture or
  local-live boundaries;
- surface a compact Stage 72 source recap/static next-pass prompts panel in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 71
  answer follow-up review lane panel;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  72 panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap.test.ts`
  and update `tests/frontend/consoleViewModel.test.ts` where needed;
- add a public-safe Stage 72 artifact under
  `docs/development/artifacts/stage72-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-and-static-next-pass-prompts/`
  describing the source-recap contract, source files, verification commands,
  human test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 72 source recap panel near the Stage 71 answer follow-up
   review lane panel;
3. confirm source-recap row order preserves Stage 71 review-lane row order;
4. confirm static next-pass prompt order preserves Stage 71 static decision-cue
   card order;
5. confirm the default source-recap context mirrors the Stage 71 default review
   lane context;
6. confirm each recap row shows source Stage 71 row/card ids, Stage 70
   crosswalk/prompt ids, Stage 69 walkthrough/review-note ids, Stage 68
   coverage/reviewer prompt ids, Stage 67 rehearsal/answer-prep ids, Stage 66
   board/question ids, Stage 65 brief ids, Stage 64 triage ids, anchors,
   callbacks, gaps, deferred reminders, lane labels, static decision-cue text,
   source-recap text, and static next-pass prompt text;
7. follow local anchor links and verify the page stays on the same route;
8. confirm the panel is static manual-review context only and does not become
   saved reviewer answers, saved answer drafts, saved follow-up lane state,
   saved source recap state, saved next-pass prompts, route changes, exports,
   signoff, audit retention, scoring, certification, owner assignment, meeting
   workflow, handoff package generation, runnable checklist, task launcher, or
   command execution.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved reviewer answers, saved answer drafts, saved reviewer notes, saved
  follow-up lane state, saved source recap state, saved next-pass prompts,
  local storage, persistence, saved selections, saved review sessions, saved
  reviewer progress, or saved action ownership;
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

- focused frontend model tests proving source-recap rows derive from Stage 71
  review-lane rows and static next-pass prompts derive from Stage 71 static
  decision-cue cards;
- assertions that row order, prompt-card order, default context, lane-label
  order, and source/anchor reference order remain stable;
- assertions that each row carries Stage 71, Stage 70, Stage 69, Stage 68,
  Stage 67, Stage 66, Stage 65, and Stage 64 source ids, anchors, callbacks,
  gaps, deferred reminders, lane labels, static decision-cue text, source
  recap text, static next-pass prompt text, local-only flags, and static
  non-goal context;
- assertions that recap rows and static next-pass prompt cards are local,
  informational, static, non-actionable, non-persistent, non-executable,
  non-routing, non-ranking, and non-certifying;
- view-model tests proving the source-recap surface connects to the existing
  fixture and local-live boundary and does not change stream behavior;
- mission-console coverage showing source/anchor references render without
  route changes, saved state, command execution, exports, signoff, owner
  assignment, proof scoring, certification, meeting workflow, handoff package
  generation, or runnable checklist semantics;
- existing Stage 71 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved reviewer answers, saved answer drafts, saved follow-up lane state,
  saved source recap state, saved next-pass prompts, saved review progress,
  local storage, or persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, route changes, app-wide routing, or meeting
  workflow.

## Exit Criteria

- one deterministic local source recap and static next-pass prompt surface is
  source-backed and visible/testable;
- source-recap rows derive from Stage 71 answer follow-up review lane rows and
  static next-pass prompt cards derive from Stage 71 static decision-cue cards,
  not ad hoc UI strings;
- row order, prompt-card order, default context, lane labels, and source/anchor
  reference order remain stable;
- Stage 71 rows/cards, Stage 70 crosswalk rows/prompt cards, Stage 69
  walkthrough/review-note ids, Stage 68 answer coverage/reviewer-check ids,
  Stage 67 rehearsal/answer-prep ids, Stage 66 board/question ids, Stage 65
  brief ids, Stage 64 triage ids, local anchors, callbacks, gaps, deferred
  reminders, static decision-cue text, source-recap text, and static next-pass
  prompt text are explicit and source-backed;
- recap rows and static next-pass prompt cards are explanatory, static, in-page
  only, non-actionable, non-persistent, non-executable, non-routing,
  non-ranking, and non-certifying;
- the mission-console panel is compact and adjacent to Stage 71 without route
  changes, saved state, command execution, exports, signoff, owner assignment,
  scoring, certification, meeting workflow, handoff package generation, or
  runnable checklist behavior;
- focused tests and the public repo guard pass.
