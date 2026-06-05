# Stage 50 Local Review Observation Handoff Source Crosswalk Slice

## Contract

Stage 50 adds a deterministic local
`telemforge.review_observation_handoff_source_crosswalk.v1` surface over the
Stage 49 `reviewObservationHandoffRelayTrail` output. Source crosswalk rows
preserve Stage 49 relay step order, and static anchor notes preserve Stage 49
static inspection note order.

The surface is static manual-review context only. It is not saved reviewer
notes, saved relay progress, saved source inspection state, saved anchor state,
saved synthesis state, saved calibration state, saved drift state, reviewer
progress, persistence, local storage, routes, exports, signoff, audit
retention, ownership, scoring, certification, meeting workflow, handoff package
generation, runnable checklist behavior, task launchers, or command execution.

## Source Files

- `frontend/src/lib/reviewObservationHandoffSourceCrosswalk.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewObservationHandoffSourceCrosswalk.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Human Test Gate

Open the mission console in fixture mode, find the Stage 50 source crosswalk
near the Stage 49 relay trail, confirm source crosswalk row order mirrors Stage
49 relay step order, confirm static anchor notes mirror Stage 49 inspection
note order, follow the in-page anchor links, and confirm the panel is static
explanatory review context only.

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffSourceCrosswalk.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffRelayTrail.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffSynthesis.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffCalibration.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffDriftGuard.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffContinuity.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffDebrief.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffDryRun.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffPath.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffAgenda.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffQuestions.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffCoverage.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffDeck.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationStoryline.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationBoundaryWalkthrough.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationBoundaryLedger.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationCitations.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationCoverage.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationLens.test.ts
node --experimental-strip-types --test tests/frontend/reviewWalkthroughPath.test.ts
node --experimental-strip-types --test tests/frontend/reviewSurfaceIndex.test.ts
node --experimental-strip-types --test tests/frontend/reviewProofReconciliation.test.ts
node --experimental-strip-types --test tests/frontend/reviewProofNavigator.test.ts
node --experimental-strip-types --test tests/frontend/reviewProofPacket.test.ts
node --experimental-strip-types --test tests/frontend/reviewProofPriority.test.ts
node --experimental-strip-types --test tests/frontend/reviewEvidenceCoverage.test.ts
node --experimental-strip-types --test tests/frontend/reviewEvidenceTrace.test.ts
node --experimental-strip-types --test tests/frontend/reviewPassOutcome.test.ts
node --experimental-strip-types --test tests/frontend/reviewPassReadiness.test.ts
node --experimental-strip-types --test tests/frontend/reviewGapResolution.test.ts
node --experimental-strip-types --test tests/frontend/reviewGapTriage.test.ts
node --experimental-strip-types --test tests/frontend/reviewHandoffCoverageMatrix.test.ts
node --experimental-strip-types --test tests/frontend/reviewHandoffRehearsal.test.ts
node --experimental-strip-types --test tests/frontend/reviewActionWalkthrough.test.ts
node --experimental-strip-types --test tests/frontend/reviewActionQueue.test.ts
node --experimental-strip-types --test tests/frontend/reviewBriefingBoard.test.ts
node --experimental-strip-types --test tests/frontend/reviewDecisionRegister.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
node --experimental-strip-types --test tests/frontend/incidentReviewPackets.test.ts
node --experimental-strip-types --test tests/frontend/scenarioRunbooks.test.ts
node --experimental-strip-types --test tests/frontend/stage09LiveConsoleAdapter.test.ts
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

Saved reviewer notes, saved relay progress, saved source inspection state,
saved anchor state, saved synthesis state, saved calibration state, saved drift
state, reviewer identity, signoff, audit retention, external ticketing,
handoff package generation, report exports, command execution, route changes,
owner assignment, scoring, ranking, certification, deploy/release, and
main-branch integration remain out of scope.
