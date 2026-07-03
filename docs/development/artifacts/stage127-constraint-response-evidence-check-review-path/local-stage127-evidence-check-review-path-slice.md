# Stage 127 Evidence-Check Review Path Slice

## Contract

Stage 127 adds a deterministic local evidence-check review path and static
citation-gap cue surface over the completed Stage 126 source citation-review
lane. It is fixture-first, read-only, in-page, non-persistent, non-executable,
non-routing, non-ranking, and non-certifying.

Evidence-check review path steps derive from Stage 126 static evidence-check
prompt cards. Static citation-gap cue cards derive from Stage 126
citation-review lane rows. Step order preserves Stage 126 static evidence-check
prompt card order, cue card order preserves Stage 126 citation-review lane row
order, and the default evidence-check review context mirrors the Stage 126
default citation-review context.

## Source Files

- `frontend/src/lib/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane.test.ts`

## Human Test Gate

A reviewer should open the mission console in fixture mode, find the Stage 127
evidence-check review path panel near the Stage 126 source citation-review lane,
confirm evidence-check review path step order mirrors Stage 126 static
evidence-check prompt card order, confirm static citation-gap cue order mirrors
Stage 126 citation-review lane row order, follow local anchors in-page, and
verify the panel is static manual review context only.

The panel must not provide saved reviewer answers, saved drafts, saved reviewer
notes, source selections, citation selections, evidence-check selections, saved
evidence-check review state, command execution, routes, exports, signoff, owner
assignment, scoring, ranking, certification, meeting workflow, handoff packages,
task launchers, or runnable checklists.

## Filename Constraint

The Stage 127 builder is exported from the adjacent Stage 126 helper module
because the literal Stage 127 helper and test filenames from the automation
queue exceed the filesystem filename-component limit in this workspace. The
Stage 127 schema, builder export, view-model property, UI section, and focused
test coverage remain distinct so the evidence-check review path contract is
reviewable independently from Stage 126.

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
saved reviewer notes, saved response notes, saved source selections, saved
citation selections, saved evidence-check selections, local storage,
persistence, route changes, command execution, exports, signoff, audit
retention, owner assignment, scoring, ranking, certification, meeting workflow,
handoff packages, or production handoff semantics.
