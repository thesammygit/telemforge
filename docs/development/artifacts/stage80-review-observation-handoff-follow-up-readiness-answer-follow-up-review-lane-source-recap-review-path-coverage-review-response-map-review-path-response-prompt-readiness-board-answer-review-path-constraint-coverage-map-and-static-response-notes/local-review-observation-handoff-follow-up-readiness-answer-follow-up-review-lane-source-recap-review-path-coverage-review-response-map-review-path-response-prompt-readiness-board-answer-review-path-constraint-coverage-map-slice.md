# Stage 80 Constraint-Coverage Map Slice

## Scope

Stage 80 adds a deterministic local constraint-coverage map and static
response-note prompt surface over the completed Stage 79 answer-review path.

The slice is intentionally static and in-page only. It does not persist
reviewer answers, answer drafts, reviewer notes, response notes,
constraint-coverage state, response-note state, answer-review state,
constraint-note state, owners, signoff, audit records, scores, rankings,
certifications, routes, exports, meetings, handoff packages, task launchers,
runnable checklists, or command execution.

## Source Chain

- Stage 80 constraint-coverage rows derive from Stage 79 answer-review path
  steps.
- Stage 80 static response-note prompt cards derive from Stage 79 static
  constraint-note cards.
- Constraint-coverage row order preserves Stage 79 answer-review path order.
- Static response-note prompt order preserves Stage 79 static constraint-note
  order.
- Default response-note context carries the Stage 79 default answer-review
  context.

## Implemented Surface

- `frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Verification

Focused verification:

```text
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
```

Expected human review:

- Open the mission console in fixture mode.
- Find the Stage 80 panel near the Stage 79 answer-review path panel.
- Confirm constraint-coverage row order mirrors Stage 79 answer-review path
  order.
- Confirm static response-note prompt order mirrors Stage 79 static
  constraint-note order.
- Follow local anchors in-page.
- Confirm labels and text are static manual-review context, not saved
  decisions, priorities, rankings, scores, certifications, owners, signoff, or
  workflow actions.
