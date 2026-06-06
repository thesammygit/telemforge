# Stage 74 Local Review-Path Coverage Matrix Slice

## Scope

Stage 74 adds a deterministic local coverage matrix over the completed Stage 73
source recap review path. The slice is static, in-page, source-backed, and
manual-review oriented.

## Source Contract

- Source helper:
  `frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPath.ts`
- Stage 74 helper:
  `frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrix.ts`
- Console wiring:
  `frontend/src/features/mission-console/consoleViewModel.ts`
- Console panel:
  `frontend/src/features/mission-console/MissionConsole.tsx`

The Stage 74 builder consumes Stage 73 review-path steps and static
reviewer-check cards. Coverage-row order preserves Stage 73 review-path step
order. Static readiness-cue order preserves Stage 73 reviewer-check card order.

## Derived Outputs

- Coverage rows expose Stage 73 review-path step ids, Stage 73 reviewer-check
  card ids, Stage 72 source-recap rows and next-pass prompts, Stage 71 review
  lane rows and cards, Stage 70 crosswalk and prompt ids, Stage 69 walkthrough
  and review-note ids, Stage 68 answer coverage and reviewer-check prompts,
  Stage 67 rehearsal path and answer-prep prompts, Stage 66 board and question
  prompts, Stage 65 brief rows, Stage 64 triage rows, anchors, callbacks, gaps,
  deferred reminders, lane labels, review-path labels, source recap text,
  review-path text, reviewer-check text, coverage text, readiness-cue text,
  local-only flags, and static non-goal context.
- Static readiness-cue cards derive from Stage 73 reviewer-check cards and
  preserve matched review-path, source-recap, review-lane, crosswalk, anchor,
  callback, gap, deferred-reminder, review-label, and static text context.
- The default coverage context carries the Stage 73 default review-path context.

## Human Test Gate

Open the mission console in fixture mode. Find the Stage 74 panel near Stage 73.
Confirm coverage-row order mirrors Stage 73 review-path step order. Confirm
readiness-cue card order mirrors Stage 73 static reviewer-check order. Follow
the in-page anchors and verify labels are static manual-review context, not
saved decisions, priorities, rankings, scores, or certifications.

## Non-Goals

This slice does not add saved reviewer answers, saved answer drafts, saved
reviewer notes, saved source recap state, saved review-path state, saved
coverage state, saved readiness cues, local storage, persistence, routing,
exports, signoff, audit retention, owner assignment, scoring, ranking,
certification, meeting workflow, handoff packages, runnable checklists, task
launchers, command execution, auth, cloud, deploy, release, or main-branch
integration.

## Verification

Focused verification:

```text
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrix.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
```

Stage closeout also reruns the Stage 73 through Stage 64 frontend backchain,
console regressions, backend unit targets, repo diff checks, and the public repo
guard before commit and push.
