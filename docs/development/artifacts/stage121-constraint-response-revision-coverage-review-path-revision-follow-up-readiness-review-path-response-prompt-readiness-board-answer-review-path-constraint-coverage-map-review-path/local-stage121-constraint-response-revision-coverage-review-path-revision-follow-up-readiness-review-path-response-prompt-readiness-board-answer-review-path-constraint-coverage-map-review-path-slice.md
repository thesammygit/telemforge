# Stage 121 Constraint-Coverage Review Path Slice

## Contract

Stage 121 adds a deterministic local constraint-coverage review path and static
response-prompt surface over the completed Stage 120 constraint-coverage map.
It is fixture-first, read-only, in-page, non-persistent, non-executable,
non-routing, non-ranking, and non-certifying.

Review-path steps derive from Stage 120 constraint-coverage rows. Static
response prompts derive from Stage 120 static response-note prompt cards. Row
order and prompt order preserve the Stage 120 source order, and the default
response-prompt context mirrors Stage 120 default response-note context.

## Source Files

- `frontend/src/lib/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Human Test Gate

A reviewer should open the mission console in fixture mode, find the Stage 121
constraint-coverage review path near the Stage 120 constraint-coverage map,
confirm review-path order mirrors Stage 120 coverage order, confirm static
response-prompt order mirrors Stage 120 response-note order, follow local
anchors in-page, and verify the panel is static manual review context only.

## Verification Commands

```text
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

## Filename Constraint

The shorter Stage 121 helper filename from the task was accepted by the local
filesystem, so the schema and builder live in their own adjacent helper file.

## Deferred Production Features

This slice intentionally does not add saved reviewer answers, saved drafts,
saved response prompts, saved coverage-review state, local storage,
persistence, route changes, command execution, exports, signoff, audit
retention, owner assignment, scoring, ranking, certification, meeting workflow,
handoff packages, or production handoff semantics.
