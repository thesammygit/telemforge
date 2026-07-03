# Stage 126 Source Citation-Review Lane Slice

## Contract

Stage 126 adds a deterministic local source citation-review lane and static
evidence-check prompt surface over the completed Stage 125 source follow-up map.
It is fixture-first, read-only, in-page, non-persistent, non-executable,
non-routing, non-ranking, and non-certifying.

Citation-review lane rows derive from Stage 125 static citation-check prompt
cards. Static evidence-check prompt cards derive from Stage 125 source follow-up
map entries. Row order preserves Stage 125 citation-check prompt order, prompt
card order preserves Stage 125 source follow-up map entry order, and the default
citation-review context mirrors the Stage 125 default follow-up context.

## Source Files

- `frontend/src/lib/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane.ts`
- `frontend/src/lib/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane.test.ts`

## Human Test Gate

A reviewer should open the mission console in fixture mode, find the Stage 126
source citation-review lane near the Stage 125 source follow-up map, confirm
citation-review row order mirrors Stage 125 citation-check prompt card order,
confirm static evidence-check prompt card order mirrors Stage 125 follow-up map
entry order, follow local anchors in-page, and verify the panel is static manual
review context only.

The panel must not provide saved reviewer answers, saved drafts, saved reviewer
notes, source selections, citation selections, saved source-follow-up state,
saved citation-review state, saved evidence-check state, command execution,
routes, exports, signoff, owner assignment, scoring, ranking, certification,
meeting workflow, handoff packages, task launchers, or runnable checklists.

## Filename Constraint

The shorter public Stage 126 planning artifact directory is used because the
full task title exceeds a portable filename-component limit. The Stage 126
schema and builder are exported from a dedicated helper module, separate from
Stage 125, to keep the source citation-review lane contract reviewable in
isolation.

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane.test.ts
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
saved source-follow-up state, saved citation-review state, saved evidence-check
state, source selections, citation selections, local storage, persistence, route
changes, command execution, exports, signoff, audit retention, owner assignment,
scoring, ranking, certification, meeting workflow, handoff packages, or
production handoff semantics.
