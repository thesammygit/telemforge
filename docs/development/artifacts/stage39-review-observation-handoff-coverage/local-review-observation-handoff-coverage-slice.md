# Stage 39 Local Review Observation Handoff Coverage Slice

## Boundary

This slice turns the Stage 38 observation handoff deck into a deterministic
local observation handoff coverage map and static gap ledger inside the mission
console.

The slice stays deterministic, local, read-only, fixture-first, and
non-persistent. It does not add saved coverage selections, saved deck
selections, saved storyline selections, saved reviewer progress, saved
observations, saved notes, saved filters, reviewer identity, signoff, audit
retention, owner assignment, runnable checklists, command execution, report
exports, handoff package generation, proof scoring, quality scoring, ranking,
certification, app-wide routing, deploy/release behavior, or production
handoff semantics.

## Source Files

- `frontend/src/lib/reviewObservationHandoffCoverage.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewObservationHandoffCoverage.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Observation Handoff Coverage Contract

- Schema: `telemforge.review_observation_handoff_coverage.v1`
- Version: `1`
- Contract label: `local deterministic observation handoff coverage and static gap map`
- Source: the Stage 38 `reviewObservationHandoffDeck` view, especially handoff
  cards, source summaries, local anchors, related observations, source-stage
  prompts, guardrail reminders, prior-surface prompts, and static non-goal
  contexts.
- Coverage row order preserves Stage 38 deck card order.
- The default coverage row uses the Stage 38 default handoff card.
- Each coverage row carries source-summary coverage, local anchor hrefs,
  related observation row ids, source-stage prompt ids, guardrail reminder ids,
  prior-surface prompt ids, static gap note ids, deferred-scope reminder ids,
  local-only flags, and static non-goal context.
- Static gap notes are explanatory only and are not readiness scores,
  certification, ranking, command execution, owner assignment, or tasks.
- Source coverage groups preserve Stage 38 source-stage prompt order and keep
  anchors in-page.
- Deferred-scope reminders are derived from Stage 38 card non-goal contexts and
  remain static review context.

## Reconciliation Summary

- The coverage map is built after `reviewObservationHandoffDeck` in the
  mission-console view model and keeps fixture/local-live boundaries unchanged.
- The UI renders the Stage 39 coverage/static gap map directly after the Stage
  38 handoff deck without introducing a route, storage, command execution,
  report export, handoff package generation, signoff, owner assignment, proof
  scoring, certification, or runnable checklist.
- Coverage rows, gap notes, source groups, and deferred reminders are derived
  from typed Stage 38 data, not ad hoc UI strings.

## Human-Testable Flow

1. Open the mission console in fixture mode.
2. Find the Stage 39 observation handoff coverage panel near the Stage 38
   handoff deck.
3. Confirm coverage rows follow Stage 38 deck card order.
4. Confirm the default coverage row uses the Stage 38 default handoff card.
5. Confirm each row shows source summary coverage, local anchors, related
   observations, source-stage prompts, guardrail reminders, prior-surface
   prompts, static gap notes, and deferred-scope reminders.
6. Follow local anchor links and verify the page stays on the same route.
7. Confirm source groups, gap notes, and deferred reminders remain explanatory
   static review context, not tasks, tickets, checklists, owner assignments,
   scores, ranks, certifications, exports, or command runners.
8. Confirm there is no saved coverage selection, saved deck selection, saved
   storyline selection, saved walkthrough selection, saved boundary selection,
   saved observation, saved note, saved progress, reviewer identity, signoff,
   persistence, ticketing, report export, handoff package generation, owner
   assignment, runnable checklist, task launcher, shell panel, proof scoring,
   ranking, certification, or command runner.

## Verification Commands

```text
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

## Deferred

- saved coverage selections, saved deck selections, saved storyline selections,
  saved walkthrough selections, saved boundary selections, saved citation
  selections, saved source-map selections, saved observations, saved notes,
  saved filters, saved review progress, local storage, reviewer identity,
  signoff, audit retention, persistent notes, or collaboration state;
- report authoring, report exports, handoff packages, external ticketing, or
  messaging integrations;
- owner assignment, task launchers, runnable checklists, command runners, shell
  panels, proof scoring, quality scoring, ranking, certification, or production
  readiness scoring;
- app-wide routing, authentication, cloud services, deploy/release/publish, or
  database migration.
