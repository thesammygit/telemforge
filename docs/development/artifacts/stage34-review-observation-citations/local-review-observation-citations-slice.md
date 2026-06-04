# Stage 34 Local Review Observation Citations Slice

## Boundary

This slice turns the Stage 33 local observation coverage matrix into a
deterministic observation citation trail and local source map inside the mission
console.

The slice stays deterministic, local, read-only, fixture-first, and
non-persistent. It does not add saved citation selections, saved source-map
selections, saved observations, saved notes, saved filters, saved progress,
reviewer identity, signoff, owner assignment, runnable checklists, command
execution, report exports, proof scoring, quality scoring, ranking,
certification, app-wide routing, or production handoff semantics.

## Source Files

- `frontend/src/lib/reviewObservationCitations.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewObservationCitations.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Citation Contract

- Schema: `telemforge.review_observation_citations.v1`
- Version: `1`
- Contract label: `local deterministic observation citation trail and source map`
- Source: the Stage 33 `reviewObservationCoverage` view and its source Stage 32
  `reviewObservationLens` observation rows, source references, anchors, count
  signals, deferred-boundary summaries, and static blind-spot rows.
- Observation citation rows preserve Stage 32 observation row order.
- Phase citation groups preserve the stable decision, action, readiness,
  evidence, proof, navigator, and reconciliation order from Stage 33 phase
  coverage.
- Source map rows preserve local review stage order and use source stage numbers
  from the observation rows.
- Local anchors remain in-page href references only; they do not introduce
  routes, storage, saved selection state, command execution, exports, signoff,
  owner assignment, proof scoring, certification, or runnable checklist
  behavior.
- Count-signal citations carry source paths from the Stage 32 lens and remain
  informational, source-backed, non-executable, non-ranking, and
  non-certifying.
- Deferred-boundary citations carry source summary and anchor references as
  visible, non-actionable local review context.
- Blind-spot citation notes are static explanatory notes for absent saved
  review state, absent reviewer identity/signoff, absent execution/scoring, and
  deferred production boundaries. They are not tasks, tickets, checklist items,
  owner assignments, scores, ranks, or certification gates.

## Reconciliation Summary

- The citation trail is built after `reviewObservationCoverage` in the
  mission-console view model and keeps the fixture/local-live boundary
  unchanged.
- The UI renders the Stage 34 citation trail directly after the Stage 33
  coverage matrix without introducing a route, storage, command execution,
  report export, signoff, owner assignment, proof scoring, certification, or
  runnable checklist.
- Citation rows are derived from typed Stage 33 and Stage 32 data, not ad hoc UI
  strings.

## Human-Testable Flow

1. Open the mission console in fixture mode.
2. Find the Stage 34 observation citation trail near the Stage 33 observation
   coverage matrix.
3. Confirm citation rows follow the Stage 32 observation row order.
4. Confirm phase groups remain ordered decision, action, readiness, evidence,
   proof, navigator, and reconciliation.
5. Confirm source map rows follow Stage 14 through Stage 29 local review order.
6. Confirm citation rows show source stage, source schema, source contract,
   local anchor, count-signal path references, and deferred-boundary references.
7. Follow several local anchor links and verify the page stays on the same
   route.
8. Confirm blind-spot citation notes remain static explanatory context, not
   tasks, tickets, checklists, owner assignments, scores, ranks, or
   certification gates.
9. Confirm there is no saved citation selection, saved source-map selection,
   saved observation, saved note, saved progress, reviewer identity, signoff,
   persistence, ticketing, report export, owner assignment, runnable checklist,
   task launcher, shell panel, proof scoring, ranking, certification, or command
   runner.

## Verification Commands

```text
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

- saved observations, saved notes, saved filters, saved citation selections,
  saved source-map selections, saved review progress, local storage, reviewer
  identity, signoff, audit retention, persistent notes, or collaboration state;
- report authoring, report exports, handoff packages, external ticketing, or
  messaging integrations;
- owner assignment, task launchers, runnable checklists, command runners, shell
  panels, proof scoring, quality scoring, ranking, certification, or production
  readiness scoring;
- app-wide routing, authentication, cloud services, deploy/release/publish, or
  database migration.
