# Stage 89 Local Evidence-Gap Follow-Up Review Path Slice

## Scope

This slice adds the first deterministic local Stage 89 surface over the
completed Stage 88 evidence-gap readiness matrix.

Source-backed runtime files:

- `frontend/src/lib/constraintResponseEvidenceGapFollowUpReviewPath.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`

Focused tests:

- `tests/frontend/constraintResponseEvidenceGapFollowUpReviewPath.test.ts`
- `tests/frontend/constraintResponseEvidenceGapReadinessMatrix.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Contract

The Stage 89 helper builds:

- follow-up review path steps from Stage 88 evidence-gap readiness rows;
- static readiness cue cards from Stage 88 static follow-up prompt cards;
- default follow-up review context from the Stage 88 default evidence-gap
  readiness context;
- explicit Stage 88 through Stage 64 lineage, local anchors, callbacks, gap
  prompts, deferred reminders, review labels, readiness cue labels, and static
  non-goal flags.

The mission-console panel is a compact, in-page, read-only review surface near
the Stage 88 panel. It does not add saved reviewer answers, answer drafts,
reviewer notes, response notes, source selections, citation selections,
evidence-check selections, evidence-gap readiness selections, follow-up review
path state, local storage, persistence, route changes, exports, signoff, audit
retention, owner assignment, scoring, ranking, certification, meeting workflow,
handoff packages, runnable checklists, task launchers, command runners, auth,
cloud, deploy, release, or main-branch integration.

## Human Test Gate

A reviewer should open the mission console in fixture mode, find the Stage 89
evidence-gap follow-up review path near Stage 88, and confirm:

1. follow-up review path step order mirrors Stage 88 readiness row order;
2. static readiness cue order mirrors Stage 88 static follow-up prompt card
   order;
3. the default follow-up review context mirrors the Stage 88 default
   evidence-gap readiness context;
4. each step and cue exposes source ids, anchors, callbacks, gap prompts,
   deferred reminders, labels, and static non-goal context;
5. anchor links stay in page and no saved state, routes, exports, signoff,
   owner assignment, scoring, certification, meeting workflow, packages,
   runnable checklist behavior, or command execution appears.

## Verification

```text
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapReadinessMatrix.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
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
