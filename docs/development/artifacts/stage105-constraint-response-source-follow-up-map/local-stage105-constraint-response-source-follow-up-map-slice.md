# Stage 105 Source Follow-Up Map Slice

## Contract

Stage 105 adds a deterministic local source follow-up map and static
citation-check prompt surface over the completed Stage 104 source-review
readiness lane.

The map is local, fixture-first, read-only, static, in-page, non-persistent,
non-executable, non-routing, non-ranking, and non-certifying. It does not save
reviewer answers, drafts, notes, source selections, citation selections,
source-review readiness state, source-follow-up state, citation-check state,
signoff, audit state, owners, reports, exports, handoff packages, task
launchers, runnable checklists, commands, or production handoff state.

## Source Files

- `frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap.ts`
- `frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLane.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Derivation

- Source follow-up map entries are derived from Stage 104 source-review
  readiness lane rows.
- Static citation-check prompt cards are derived from Stage 104 static
  source-follow-up cue cards.
- Entry order preserves Stage 104 `sourceReviewReadinessLaneRowOrder`.
- Citation-card order preserves Stage 104 `staticSourceFollowUpCueOrder`.
- The default source-follow-up context mirrors the Stage 104 default
  source-review readiness context and adds the selected Stage 105 entry and
  citation-check prompt card.

## Human Test Gate

A reviewer should open the mission console in fixture mode and find the Stage
105 source follow-up map after the Stage 104 source-review readiness lane.
Confirm the follow-up entry order mirrors Stage 104 row order, citation-check
prompt card order mirrors Stage 104 cue-card order, local anchors remain
in-page links, and the panel is explanatory manual review context rather than
saved answers, saved drafts, source selections, citation selections,
source-follow-up state, citation-check state, route changes, exports, signoff,
audit retention, scoring, certification, owner assignment, meeting workflow,
handoff package generation, runnable checklists, task launchers, or command
execution.

## Verification

Run from the repository root:

```text
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLane.test.ts
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

## Deferred Production Features

- Saved reviewer answers, drafts, notes, source selections, citation selections,
  source-follow-up state, and citation-check state.
- Persistence, local storage, database migrations, audit retention, signoff, and
  reviewer identity.
- Routes, app-wide navigation changes, report exports, handoff packages,
  ticketing, messaging, owner assignment, meeting workflow, runnable checklists,
  task launchers, shell panels, and command execution.
- Ranking, scoring, certification, cloud services, deployment, release,
  publishing, protected-branch integration, and main fast-forward.
