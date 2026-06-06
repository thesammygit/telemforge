# Stage 75 Local Coverage-Review Path Slice

## Scope

Stage 75 adds a deterministic local coverage-review path over the completed
Stage 74 review-path coverage matrix. The slice is static, in-page,
source-backed, and manual-review oriented.

## Source Contract

- Source helper:
  `frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrix.ts`
- Stage 75 helper:
  `frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPath.ts`
- Console wiring:
  `frontend/src/features/mission-console/consoleViewModel.ts`
- Console panel:
  `frontend/src/features/mission-console/MissionConsole.tsx`

The Stage 75 builder consumes Stage 74 coverage rows and static readiness-cue
cards. Coverage-review step order preserves Stage 74 coverage-row order. Static
coverage-prompt order preserves Stage 74 readiness-cue order.

## Derived Outputs

- Coverage-review steps expose Stage 74 coverage row ids, Stage 74 readiness-cue
  card ids, Stage 73 review-path step and reviewer-check ids, Stage 72
  source-recap rows and next-pass prompts, Stage 71 review-lane rows and cards,
  Stage 70 crosswalk and prompt ids, Stage 69 walkthrough and review-note ids,
  Stage 68 answer coverage and reviewer-check prompts, Stage 67 rehearsal path
  and answer-prep prompts, Stage 66 board and question prompts, Stage 65 brief
  rows, Stage 64 triage rows, anchors, callbacks, gaps, deferred reminders, lane
  labels, review-path labels, coverage labels, readiness-cue labels, source
  recap text, review-path text, reviewer-check text, coverage text,
  readiness-cue text, coverage-review text, static prompt text, local-only
  flags, and static non-goal context.
- Static coverage-prompt cards derive from Stage 74 readiness-cue cards and
  preserve matched coverage row, review-path, source-recap, review-lane,
  crosswalk, anchor, callback, gap, deferred-reminder, readiness-cue, and static
  text context.
- The default coverage-review context carries the Stage 74 default coverage
  context.

## Human Test Gate

Open the mission console in fixture mode. Find the Stage 75 panel near Stage
74. Confirm coverage-review step order mirrors Stage 74 coverage-row order.
Confirm static coverage-prompt order mirrors Stage 74 readiness-cue order.
Follow the in-page anchors and verify labels are static manual-review context,
not saved decisions, priorities, rankings, scores, or certifications.

## Non-Goals

This slice does not add saved reviewer answers, saved answer drafts, saved
reviewer notes, saved source recap state, saved review-path state, saved
coverage state, saved readiness cues, saved coverage-review state, saved
coverage prompts, local storage, persistence, routing, exports, signoff, audit
retention, owner assignment, scoring, ranking, certification, meeting workflow,
handoff packages, runnable checklists, task launchers, command execution, auth,
cloud, deploy, release, or main-branch integration.

## Verification

Focused verification:

```text
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
```

Stage closeout also reruns the Stage 74 through Stage 64 frontend backchain,
console regressions, backend unit targets, repo diff checks, and the public repo
guard before commit and push.
