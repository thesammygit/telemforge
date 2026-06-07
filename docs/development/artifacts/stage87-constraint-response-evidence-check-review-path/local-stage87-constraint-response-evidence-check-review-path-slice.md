# Stage 87 Constraint Response Evidence Check Review Path Slice

## Contract

Stage 87 adds a deterministic local evidence-check review path over the
completed Stage 86 source citation-review lane. Evidence-check review path
steps derive from Stage 86 static evidence-check prompt cards. Static
citation-gap cue cards derive from Stage 86 citation-review lane rows.

The surface is fixture-first, local-live safe, static, in-page,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It is manual review context only.

## Source Files

- `frontend/src/lib/constraintResponseEvidenceCheckReviewPath.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/constraintResponseEvidenceCheckReviewPath.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Source Binding

- `evidenceCheckReviewPathSteps` preserves
  `constraintResponseSourceCitationReviewLane.staticEvidenceCheckPromptCards`
  order.
- `staticCitationGapCueCards` preserves
  `constraintResponseSourceCitationReviewLane.citationReviewLaneRows` order.
- `summary.defaultEvidenceCheckReviewContext` carries
  `constraintResponseSourceCitationReviewLane.summary.defaultCitationReviewContext`.
- Each review path step carries Stage 86 evidence prompt ids, Stage 86
  citation-review row ids, Stage 85 source follow-up map entry ids, Stage 85
  static citation prompt ids, Stage 84 through Stage 64 lineage ids, local
  anchors, callbacks, gap prompts, deferred reminders, labels, static text, and
  non-goal flags.

## Human Test Gate

A reviewer should open the mission console in fixture mode, find the Stage 87
panel after the Stage 86 panel, confirm review step order mirrors Stage 86
static evidence-check prompt order, confirm citation-gap cue order mirrors
Stage 86 citation-review row order, follow local anchor links in-page, and
confirm the panel does not expose saved answers, drafts, notes, source or
citation selections, evidence-check selections, review state, commands, exports,
signoff, audit state, owner assignment, scoring, ranking, certification,
meeting workflow, handoff packages, task launchers, runnable checklists, routes,
or persistence.

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceCheckReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
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

## Deferred Non-Goals

Saved reviewer answers, saved drafts, saved reviewer notes, saved response
notes, saved source selections, saved citation selections, saved evidence-check
selections, evidence-check review state, local storage, persistence, reviewer
identity, signoff, audit retention, owner assignment, task launchers, ticketing,
messaging, report exports, handoff packages, command runners, shell panels,
scoring, ranking, certification, meeting workflow, app-wide routing, auth,
cloud, deploy, release, publish, and main-branch integration remain out of
scope.
