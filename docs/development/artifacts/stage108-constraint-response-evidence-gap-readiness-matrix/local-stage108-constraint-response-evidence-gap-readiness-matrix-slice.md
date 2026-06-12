# Stage 108 Evidence Gap Readiness Matrix Slice

## Contract

Stage 108 adds a deterministic local evidence-gap readiness matrix over the
Stage 107 evidence-check review path. Evidence-gap readiness rows derive from
Stage 107 evidence-check review path steps, and static follow-up prompt cards
derive from Stage 107 static citation-gap cue cards. Row and prompt order
preserve the Stage 107 source order.

The surface is static, fixture-first, read-only, in-page, local-only,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It exists only to help a human compare review steps, citation-gap cues, source
lineage, local anchors, callbacks, gap prompts, and deferred reminders before
drafting outside the app.

The slice does not save reviewer answers, answer drafts, revision drafts,
response drafts, reviewer notes, response notes, source selections, citation
selections, evidence-check selections, evidence-gap readiness state, local
storage, audit or signoff records, owner assignments, meeting workflow, exports,
handoff packages, task launchers, runnable checklists, scores, certifications,
command execution, credentials, or production handoff state.

## Source Files

- `frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Filename Constraint

The planner-specified standalone Stage 108 helper and test filenames exceed
the local filesystem component limit of 255 bytes. The Stage 108 builder is
therefore exported from the adjacent Stage 107 helper module, and focused Stage
108 coverage lives in the adjacent Stage 107 test file listed above. The
runtime contract, schema, source derivation, and mission-console panel remain
separate Stage 108 surfaces.

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane.test.ts
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

Open the mission console in fixture mode, find the Stage 108 evidence-gap
readiness matrix immediately after Stage 107, and confirm readiness row order
matches Stage 107 evidence-check review path step order. Confirm static
follow-up prompt card order matches Stage 107 citation-gap cue card order.
Confirm the default readiness context mirrors the Stage 107 default
evidence-check review context. Follow local anchors in-page and verify the
panel remains static manual review context with no saved answers, drafts,
selections, state, routes, exports, signoff, scoring, owner assignment, meeting
workflow, handoff package generation, runnable checklist, task launcher, or
command execution behavior.

## Deferred Production Features

Persisted reviewer answers, reviewer notes, source, citation, evidence-check,
or evidence-gap readiness selections, evidence-gap readiness state, exports,
handoff packages, audit retention, owner assignment, meeting workflows, scoring,
certification, route changes, command execution, auth, cloud integration,
deploy, release, and production handoff state remain explicitly out of scope.
