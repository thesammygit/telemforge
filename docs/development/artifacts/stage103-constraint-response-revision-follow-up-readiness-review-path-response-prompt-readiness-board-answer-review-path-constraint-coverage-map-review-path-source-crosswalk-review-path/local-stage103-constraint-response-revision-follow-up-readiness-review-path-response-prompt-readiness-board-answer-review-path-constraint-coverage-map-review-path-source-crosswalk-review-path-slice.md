# Stage 103 source-crosswalk review path and static source-review prompts

## Summary

Stage 103 adds a deterministic local source-review path over the Stage 102
source crosswalk and static review checks. The new surface is read-only,
fixture-first, local-only, in-page, non-persistent, non-executable,
non-routing, non-ranking, and non-certifying.

## Source-Review Path Contract

- Source-review path steps derive one-to-one from Stage 102 source-crosswalk
  rows.
- Static source-review prompt cards derive one-to-one from Stage 102 static
  review-check cards.
- Step order preserves Stage 102 source-crosswalk row order.
- Prompt-card order preserves Stage 102 static review-check card order.
- The default source-review context mirrors the Stage 102 default source-check
  context.
- Each row carries Stage 102 row ids, Stage 102 static review-check ids, Stage
  101 review-path and response-prompt ids, Stage 100 constraint and
  response-note ids, Stage 99 answer-review ids, Stage 98 readiness ids, Stage
  97/96 revision lineage ids, Stage 95 through Stage 85 source lineage ids,
  local anchors, callbacks, gap prompts, deferred reminders, labels, source
  crosswalk text, static review-check text, local-only flags, and non-goal
  context.

## Source Files

- `frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath.ts`
- `frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Verification

```text
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoard.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessBoard.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoard.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoard.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageBoard.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
npm --prefix frontend run test
python3 -m unittest discover -s tests/backend -p test_stage12_incident_review_packets.py
python3 -m unittest discover -s tests/backend -p test_stage12_incident_review_exports.py
python3 -m unittest discover -s tests/backend -p test_stage11_scenario_runbooks.py
python3 -m unittest discover -s tests/backend -p test_stage10_alert_acknowledgement.py
python3 -m unittest discover -s tests/backend -p test_stage10_alert_resolution.py
python3 -m unittest discover -s tests/backend -p test_stage07_api.py
git diff --check
git diff --cached --check
python3 scripts/public_repo_guard.py --scan-history
```

## Human Test Gate

A reviewer should be able to open the mission console in fixture mode, find the
Stage 103 source-review path panel near Stage 102, confirm source-review path
step order mirrors Stage 102 source-crosswalk row order, confirm static
source-review prompt card order mirrors Stage 102 static review-check card
order, confirm the default source-review context mirrors the Stage 102 default
source-check context, follow local anchors in-page, and verify the panel stays
static manual-review context rather than saved answers, drafts, source
selections, source-review state, source-crosswalk state, review-check state,
route changes, exports, signoff, audit retention, scoring, certification,
owner assignment, meeting workflow, handoff package generation, runnable
checklists, task launchers, or command execution.

## Deferred Features

- saved reviewer answers, answer drafts, revision drafts, response drafts, or
  reviewer notes;
- saved source selections, source-review state, source-crosswalk state, or
  review-check state;
- routing, owner assignment, ticketing, messaging, meeting workflow, signoff,
  or audit retention;
- scoring, ranking, certification, exports, handoff packages, runnable
  checklists, task launchers, or command execution;
- production auth, cloud, deploy, publish, release, merge, force-push, or
  main-branch fast-forward.

## Visual Proof

- `docs/automation/demos/telemforge-stage103-source-crosswalk-review-path-20260611.svg`
