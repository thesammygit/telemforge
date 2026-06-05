# Stage 46 Local Review Observation Handoff Drift Guard Slice

## Contract

Stage 46 adds `telemforge.review_observation_handoff_drift_guard.v1`, a
deterministic local drift guard and static regression map over the Stage 45
`reviewObservationHandoffContinuity` continuity card set and next-pass map.

The slice is fixture-first, local-live safe, read-only, source-backed, in-page
only, explanatory, static, non-actionable, non-persistent, non-executable,
non-routing, non-ranking, and non-certifying.

## Source Files

- `frontend/src/lib/reviewObservationHandoffDriftGuard.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewObservationHandoffDriftGuard.test.ts`
- `tests/frontend/reviewObservationHandoffContinuity.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Proven Behavior

- Drift guard rows derive from Stage 45 continuity cards and preserve
  continuity card order.
- The default continuity context is carried into the Stage 46 summary from the
  Stage 45 default continuity card, debrief prompt, cue, anchor target, and
  source continuity summary.
- Each drift guard row carries source cue ids, source debrief prompt ids,
  source follow-up map entry ids, source path step ids, agenda section ids,
  prompt group ids, coverage row ids, handoff card ids, source references,
  local anchor hrefs, anchor target ids, evidence callback ids, gap discussion
  point ids, deferred-scope reminder ids, static contexts, and static non-goal
  flags.
- Static regression map entries derive from Stage 45 next-pass map entries and
  preserve source next-pass order.
- The mission console renders a compact Stage 46 panel near Stage 45 without
  routes, saved state, command execution, exports, signoff, audit retention,
  owner assignment, scoring, certification, meeting workflow, handoff package
  generation, task launchers, or runnable checklist semantics.

## Human Test Gate

A reviewer should open the mission console in fixture mode, find the Stage 46
handoff drift guard near the Stage 45 continuity panel, confirm drift guard row
order and default continuity context match Stage 45, confirm regression map rows
mirror next-pass map order, follow local anchor links in-page, and confirm the
panel is static manual-review context rather than saved drift state, saved
review sessions, saved debrief notes, saved continuity progress, saved
follow-up ownership, route changes, exports, signoff, audit retention, scoring,
certification, owner assignment, meeting workflow, handoff package generation,
runnable checklist, task launcher, or command execution.

## Verification Commands

```text
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

Stage 46 intentionally does not add saved drift state, saved review sessions,
saved reviewer progress, saved debrief notes, saved continuity progress, saved
follow-up progress, saved follow-up ownership, saved dry-run progress, saved
rehearsal sessions, saved path or agenda progress, saved answers, saved
selections, persistence, local storage, reviewer identity, signoff, audit
retention, external ticketing, messaging, report authoring, report exports,
handoff package generation, command runners, shell panels, runnable checklists,
task launchers, owner assignment, meeting workflow, ranking, proof scoring,
quality scoring, certification, route changes, app-wide routing, auth, cloud
services, deploy, release, publish, or main-branch integration.
