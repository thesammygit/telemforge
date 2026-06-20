# Stage 122 Source-Crosswalk Slice

## Contract

Stage 122 adds a deterministic local source-crosswalk and static review-check
surface over the completed Stage 121 constraint-coverage review path. It is
fixture-first, read-only, in-page, non-persistent, non-executable,
non-routing, non-ranking, and non-certifying.

Source-crosswalk rows derive from Stage 121 constraint-coverage review-path
steps. Static review-check cards derive from Stage 121 static response-prompt
cards. Row order and card order preserve the Stage 121 source order, and the
default source-check context mirrors the Stage 121 default response-prompt
context.

## Source Files

- `frontend/src/lib/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Human Test Gate

A reviewer should open the mission console in fixture mode, find the Stage 122
source crosswalk near the Stage 121 constraint-coverage review path, confirm
source-crosswalk order mirrors Stage 121 review-path order, confirm static
review-check order mirrors Stage 121 response-prompt order, follow local
anchors in-page, and verify the panel is static manual review context only.

The panel must not provide saved reviewer answers, saved drafts, source
selections, persisted source-crosswalk state, review-check state, command
execution, routes, exports, signoff, owner assignment, scoring, ranking,
certification, meeting workflow, handoff packages, task launchers, or runnable
checklists.

## Filename Constraint

The shorter Stage 122 helper filename was accepted by the local filesystem, so
the Stage 122 schema and builder are exported from the dedicated helper module
rather than being embedded in an adjacent Stage 121 helper.

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoard.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoard.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPath.test.ts
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

## Deferred Production Features

This slice intentionally does not add saved reviewer answers, saved drafts,
saved response prompts, saved source selections, saved source-crosswalk state,
saved review-check state, local storage, persistence, route changes, command
execution, exports, signoff, audit retention, owner assignment, scoring,
ranking, certification, meeting workflow, handoff packages, or production
handoff semantics.
