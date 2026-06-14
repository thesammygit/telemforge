# Stage 115 Revision Coverage Review Path Slice

## Contract

Stage 115 adds a deterministic local revision coverage review path over the
completed Stage 114 revision coverage board. Each review-path step derives from
one Stage 114 revision coverage row, and each static revision follow-up prompt
card derives from one Stage 114 static revision-check card. Source order is
preserved by direct `map(...)` traversal of the Stage 114 rows and cards.

The surface is static, read-only, local, fixture-first, in-page only,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It does not save reviewer answers, drafts, notes, selections, review-path state,
coverage state, revision follow-up state, local storage, exports, signoff,
owners, scores, meetings, handoff packages, runnable checklists, task launchers,
or command execution.

## Source Files

- `frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.test.ts
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

## Human Test Gate

A reviewer should open the mission console in fixture mode, find the Stage 115
revision coverage review path immediately after the Stage 114 revision coverage
board, confirm review-path step order mirrors Stage 114 revision coverage row
order, confirm static revision follow-up prompt card order mirrors Stage 114
static revision-check card order, confirm the default review-path context
mirrors the Stage 114 default revision coverage context, and follow local
anchors in-page.

The panel should read as manual review context only, not saved answers, drafts,
notes, selections, revision follow-up state, review-path state, route changes,
exports, signoff, audit retention, scoring, certification, owner assignment,
meeting workflow, handoff package generation, runnable checklists, task
launchers, or command execution.

## Filename Constraint

Stage 115 keeps schema and builder code inside the adjacent long-chain Stage 107
through Stage 114 helper and test files because standalone filenames for the
full Stage 115 chain can exceed the local 255-byte filename component limit.

## Deferred Production Features

Production persistence, saved selections, saved revision drafts, reviewer notes,
exports, audit/signoff, owner assignment, scoring, certification, meeting
workflow, handoff packages, runnable checklists, task launchers, command
execution, route changes, auth, cloud, deploy, release, and main fast-forward
remain out of scope.
