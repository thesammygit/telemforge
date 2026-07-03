# Stage 125 Source Follow-Up Map Slice

## Contract

Stage 125 adds a deterministic local source follow-up map and static
citation-check prompt surface over the completed Stage 124 source-review
readiness lane. It is fixture-first, read-only, in-page, non-persistent,
non-executable, non-routing, non-ranking, and non-certifying.

Follow-up map entries derive from Stage 124 source-readiness lane rows. Static
citation-check prompt cards derive from Stage 124 static source-follow-up cue
cards. Entry order preserves Stage 124 source-readiness lane row order, prompt
order preserves Stage 124 static cue-card order, and the default follow-up
context mirrors the Stage 124 default source-readiness context.

## Source Files

- `frontend/src/lib/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap.ts`
- `frontend/src/lib/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLane.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Human Test Gate

A reviewer should open the mission console in fixture mode, find the Stage 125
source follow-up map panel near the Stage 124 source-review readiness lane,
confirm entry order mirrors Stage 124 readiness row order, confirm static
citation-check prompt order mirrors Stage 124 cue-card order, follow local
anchors in-page, and verify the panel is static manual review context only.

The panel must not provide saved reviewer answers, saved drafts, saved reviewer
notes, source selections, citation selections, persisted source-review
readiness state, source-follow-up state, citation-check state, command
execution, routes, exports, signoff, owner assignment, scoring, ranking,
certification, meeting workflow, handoff packages, task launchers, or runnable
checklists.

## Filename Constraint

The shorter public Stage 125 planning artifact directory is used because the
full task title exceeds a portable filename-component limit. The Stage 125
schema and builder are exported from a dedicated helper module, separate from
Stage 124, to keep the source follow-up map contract reviewable in isolation.

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLane.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath.test.ts
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

Actual browser screenshot remains blocked until frontend dependencies are
installed locally; the historical dev-server command exited with
`sh: vite: command not found` in this workspace. The ignored SVG proof is the
sanitized project-capability visual for this slice.

## Deferred Production Features

This slice intentionally does not add saved reviewer answers, saved drafts,
saved source-review readiness state, saved source-follow-up state, saved
source selections, saved citation selections, saved citation-check state, local
storage, persistence, route changes, command execution, exports, signoff, audit
retention, owner assignment, scoring, ranking, certification, meeting workflow,
handoff packages, or production handoff semantics.
