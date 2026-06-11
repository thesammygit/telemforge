# Stage 106 Source Citation Review Lane Slice

## Contract

Stage 106 adds a deterministic local source citation-review lane over the Stage
105 source follow-up map. Citation-review lane rows derive from Stage 105 static
citation-check prompt cards, and static evidence-check prompt cards derive from
Stage 105 source follow-up map entries. The surface is static, fixture-first,
read-only, in-page, local-only, non-persistent, non-executable, non-routing,
non-ranking, and non-certifying.

The slice is manual review context only. It does not save reviewer answers,
answer drafts, reviewer notes, response notes, source selections, citation
selections, citation-review state, evidence-check state, local storage, audit or
signoff records, owner assignments, meeting workflow, exports, handoff packages,
task launchers, runnable checklists, scores, certifications, command execution,
credentials, or production handoff state.

## Source Files

- `frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
npm --prefix frontend run test
python3 scripts/public_repo_guard.py --scan-history
```

## Human Test Gate

Open the mission console in fixture mode, find the Stage 106 source citation
review lane immediately after Stage 105, and confirm citation-review row order
matches Stage 105 static citation-check prompt card order. Confirm static
evidence-check prompt order matches Stage 105 source follow-up map entry order.
Follow local anchors in-page and verify the panel remains static manual review
context with no saved answers, drafts, selections, state, routes, exports,
signoff, scoring, owner assignment, meeting workflow, runnable checklist, task
launcher, or command execution behavior.

## Deferred Production Features

Persisted reviewer answers, reviewer notes, source or citation selections,
evidence-check state, exports, handoff packages, audit retention, owner
assignment, meeting workflows, scoring, certification, route changes, command
execution, auth, cloud integration, deploy, release, and production handoff
state remain explicitly out of scope.
