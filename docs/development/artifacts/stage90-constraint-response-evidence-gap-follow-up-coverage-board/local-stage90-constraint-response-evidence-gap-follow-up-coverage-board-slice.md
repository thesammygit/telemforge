# Stage 90 Local Evidence-Gap Follow-Up Coverage Board Slice

## Scope

This slice adds the first deterministic local Stage 90 surface over the
completed Stage 89 evidence-gap follow-up review path.

Source-backed runtime files:

- `frontend/src/lib/constraintResponseEvidenceGapFollowUpCoverageBoard.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`

Focused tests:

- `tests/frontend/constraintResponseEvidenceGapFollowUpCoverageBoard.test.ts`
- `tests/frontend/constraintResponseEvidenceGapFollowUpReviewPath.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Contract

The Stage 90 helper builds:

- coverage rows from Stage 89 follow-up review path steps;
- static review prompt cards from Stage 89 static readiness cue cards;
- default coverage context from the Stage 89 default follow-up review context;
- explicit Stage 89 through Stage 64 lineage, local anchors, callbacks, gap
  prompts, deferred reminders, coverage labels, static review prompt labels,
  and static non-goal flags.

The mission-console panel is a compact, in-page, read-only review surface near
the Stage 89 panel. It does not add saved reviewer answers, answer drafts,
reviewer notes, response notes, source selections, citation selections,
evidence-check selections, evidence-gap readiness selections, evidence-gap
follow-up selections, coverage-board selections, coverage state, local storage,
persistence, route changes, exports, signoff, audit retention, owner
assignment, scoring, ranking, certification, meeting workflow, handoff
packages, runnable checklists, task launchers, command runners, auth, cloud,
deploy, release, or main-branch integration.

## Human Test Gate

A reviewer should open the mission console in fixture mode, find the Stage 90
evidence-gap follow-up coverage board near Stage 89, and confirm:

1. coverage row order mirrors Stage 89 follow-up review path step order;
2. static review prompt order mirrors Stage 89 static readiness cue card order;
3. the default coverage context mirrors the Stage 89 default follow-up review
   context;
4. each row and prompt exposes source ids, anchors, callbacks, gap prompts,
   deferred reminders, labels, and static non-goal context;
5. anchor links stay in page and no saved state, routes, exports, signoff,
   owner assignment, scoring, certification, meeting workflow, packages,
   runnable checklist behavior, or command execution appears.

## Verification

```text
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageBoard.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapReadinessMatrix.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceCheckReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseSourceCitationReviewLane.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseSourceFollowUpMap.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath.test.ts
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
