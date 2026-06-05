# Stage 44 Local Review Observation Handoff Debrief Slice

## Contract

Stage 44 adds `telemforge.review_observation_handoff_debrief.v1`, a
deterministic local debrief and static follow-up map over the Stage 43
`reviewObservationHandoffDryRun` cue sheet.

The slice is fixture-first, local-live safe, read-only, source-backed, in-page
only, explanatory, static, non-actionable, non-persistent, non-executable,
non-routing, non-ranking, and non-certifying.

## Source Files

- `frontend/src/lib/reviewObservationHandoffDebrief.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewObservationHandoffDebrief.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Proven Behavior

- Debrief prompts derive from Stage 43 dry-run cues and preserve cue order.
- The default debrief prompt uses the Stage 43 default cue.
- Each prompt carries source cue ids, path step ids, agenda section ids, prompt
  group ids, coverage row ids, handoff card ids, source references, local
  anchor hrefs, anchor target ids, evidence callback ids, gap discussion point
  ids, deferred-scope reminder ids, static context, and static non-goal flags.
- Follow-up map entries derive from Stage 43 cue-to-anchor coverage entries and
  preserve source coverage order.
- The mission console renders a compact Stage 44 panel beside the Stage 43 cue
  sheet without routes, saved state, command execution, exports, signoff,
  owner assignment, scoring, certification, meeting workflow, handoff package
  generation, or runnable checklist semantics.

## Human Test Gate

A reviewer should open the mission console in fixture mode, find the Stage 44
handoff debrief panel near the Stage 43 dry-run cue sheet, confirm prompt order
and default prompt match Stage 43, confirm follow-up rows mirror cue-to-anchor
coverage order, follow local anchor links in-page, and confirm the panel is
static manual-review context rather than saved debrief notes, saved rehearsal
progress, saved follow-up ownership, route changes, exports, signoff, audit
retention, scoring, certification, owner assignment, meeting workflow, handoff
package generation, runnable checklist, or command execution.

## Verification Commands

```text
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

Stage 44 intentionally does not add saved debrief notes, saved follow-up
progress, saved follow-up ownership, saved rehearsal sessions, saved dry-run
progress, saved path or agenda progress, saved answers, saved selections,
persistence, local storage, reviewer identity, signoff, audit retention,
external ticketing, messaging, report authoring, report exports, handoff
package generation, command runners, shell panels, runnable checklists, task
launchers, owner assignment, meeting workflow, ranking, proof scoring, quality
scoring, certification, route changes, app-wide routing, auth, cloud services,
deploy, release, publish, or main-branch integration.
