# Stage 38 Local Review Observation Handoff Deck Slice

## Boundary

This slice turns the Stage 37 observation storyline into a deterministic local
observation handoff deck and static review path inside the mission console.

The slice stays deterministic, local, read-only, fixture-first, and
non-persistent. It does not add saved deck selections, saved storyline
selections, saved reviewer progress, saved observations, saved notes, saved
filters, reviewer identity, signoff, audit retention, owner assignment,
runnable checklists, command execution, report exports, handoff package
generation, proof scoring, quality scoring, ranking, certification, app-wide
routing, deploy/release behavior, or production handoff semantics.

## Source Files

- `frontend/src/lib/reviewObservationHandoffDeck.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewObservationHandoffDeck.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Observation Handoff Deck Contract

- Schema: `telemforge.review_observation_handoff_deck.v1`
- Version: `1`
- Contract label: `local deterministic observation handoff deck and static review path`
- Source: the Stage 37 `reviewObservationStoryline` view, especially storyline
  segments, the default opening, source-stage evidence groups, static guardrail
  references, prior review-surface references, and static non-goal contexts.
- Deck card order preserves Stage 37 storyline segment order.
- The default review context uses the Stage 37 default opening and first
  storyline segment.
- Each handoff card carries source summary, local anchor ids and hrefs, related
  observation row ids, related citation row ids, related source stages,
  source-stage prompt ids, guardrail reminder ids, prior surface prompt ids,
  and static non-goal contexts.
- Review-path checkpoints remain static manual review context and do not save
  progress or launch tasks.
- Source-stage prompts preserve Stage 37 source-stage evidence group order.
- Guardrail reminders preserve Stage 37 static guardrail reference order.
- Prior surface prompts preserve Stage 37 segment order and remain local
  in-page references to prior review surfaces.

## Reconciliation Summary

- The handoff deck is built after `reviewObservationStoryline` in the
  mission-console view model and keeps fixture/local-live boundaries unchanged.
- The UI renders the Stage 38 deck directly after the Stage 37 storyline without
  introducing a route, storage, command execution, report export, handoff
  package generation, signoff, owner assignment, proof scoring, certification,
  or runnable checklist.
- Deck cards, checkpoints, source-stage prompts, guardrail reminders, and prior
  surface prompts are derived from typed Stage 37 data, not ad hoc UI strings.

## Human-Testable Flow

1. Open the mission console in fixture mode.
2. Find the Stage 38 observation handoff deck near the Stage 37 storyline.
3. Confirm deck cards follow Stage 37 storyline segment order.
4. Confirm the default review context uses the Stage 37 default opening.
5. Confirm each card shows source summary, local anchors, related observations,
   source-stage prompt counts, guardrail reminders, prior surface references,
   and static non-goal contexts.
6. Follow local anchor links and verify the page stays on the same route.
7. Confirm source-stage prompts, guardrail reminders, and prior surface prompts
   remain explanatory static review context, not tasks, tickets, checklists,
   owner assignments, scores, ranks, certifications, exports, or command
   runners.
8. Confirm there is no saved deck selection, saved storyline selection, saved
   walkthrough selection, saved boundary selection, saved observation, saved
   note, saved progress, reviewer identity, signoff, persistence, ticketing,
   report export, handoff package generation, owner assignment, runnable
   checklist, task launcher, shell panel, proof scoring, ranking, certification,
   or command runner.

## Verification Commands

```text
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

## Deferred

- saved deck selections, saved storyline selections, saved walkthrough
  selections, saved boundary selections, saved citation selections, saved
  source-map selections, saved observations, saved notes, saved filters, saved
  review progress, local storage, reviewer identity, signoff, audit retention,
  persistent notes, or collaboration state;
- report authoring, report exports, handoff packages, external ticketing, or
  messaging integrations;
- owner assignment, task launchers, runnable checklists, command runners,
  shell panels, proof scoring, quality scoring, ranking, certification, or
  production readiness scoring;
- app-wide routing, authentication, cloud services, deploy/release/publish, or
  database migration.
