# Stage 35 Local Review Observation Boundary Ledger Slice

## Boundary

This slice turns the Stage 34 local observation citation trail into a
deterministic deferred-boundary ledger and static non-goal map inside the
mission console.

The slice stays deterministic, local, read-only, fixture-first, and
non-persistent. It does not add saved boundary selections, saved citation
selections, saved observations, saved notes, saved filters, saved progress,
reviewer identity, signoff, owner assignment, runnable checklists, command
execution, report exports, proof scoring, quality scoring, ranking,
certification, app-wide routing, or production handoff semantics.

## Source Files

- `frontend/src/lib/reviewObservationBoundaryLedger.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewObservationBoundaryLedger.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Boundary Ledger Contract

- Schema: `telemforge.review_observation_boundary_ledger.v1`
- Version: `1`
- Contract label: `local deterministic deferred-boundary ledger and static non-goal map`
- Source: the Stage 34 `reviewObservationCitations` view, especially deferred
  boundary citations, citation rows, anchor citation groups, source map rows,
  and blind-spot citation notes.
- Boundary row order preserves Stage 34 deferred-boundary citation order.
- Observation reference groups preserve Stage 34 citation row order.
- Anchor reference groups preserve Stage 34 local anchor order for anchors that
  cite deferred boundaries.
- Source-stage groups preserve Stage 34 source map row order.
- Boundary rows carry source summary, source anchor ids/hrefs, related
  observation row ids, related citation row ids, related source stages, and
  static non-goal note ids.
- Static non-goal notes are explanatory local review context only. They are not
  tasks, tickets, checklist items, owner assignments, scores, ranks, or
  certification gates.
- Local anchors remain in-page href references only; they do not introduce
  routes, storage, saved selection state, command execution, exports, signoff,
  owner assignment, proof scoring, certification, or runnable checklist
  behavior.

## Reconciliation Summary

- The boundary ledger is built after `reviewObservationCitations` in the
  mission-console view model and keeps the fixture/local-live boundary
  unchanged.
- The UI renders the Stage 35 boundary ledger directly after the Stage 34
  citation trail without introducing a route, storage, command execution,
  report export, signoff, owner assignment, proof scoring, certification, or
  runnable checklist.
- Boundary rows and groups are derived from typed Stage 34 data, not ad hoc UI
  strings.

## Human-Testable Flow

1. Open the mission console in fixture mode.
2. Find the Stage 35 deferred-boundary ledger near the Stage 34 observation
   citation trail.
3. Confirm boundary rows follow Stage 34 deferred-boundary citation order.
4. Confirm each boundary row shows source summary, local anchor references,
   related observation count, related source stages, and static non-goal notes.
5. Confirm observation, anchor, and source-stage groups remain local review
   context only.
6. Follow local anchor links and verify the page stays on the same route.
7. Confirm static non-goal notes remain explanatory, not tasks, tickets,
   checklists, owner assignments, scores, ranks, or certification gates.
8. Confirm there is no saved boundary selection, saved citation selection,
   saved observation, saved note, saved progress, reviewer identity, signoff,
   persistence, ticketing, report export, owner assignment, runnable checklist,
   task launcher, shell panel, proof scoring, ranking, certification, or command
   runner.

## Verification Commands

```text
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

- saved observations, saved notes, saved filters, saved citation selections,
  saved source-map selections, saved boundary selections, saved review progress,
  local storage, reviewer identity, signoff, audit retention, persistent notes,
  or collaboration state;
- report authoring, report exports, handoff packages, external ticketing, or
  messaging integrations;
- owner assignment, task launchers, runnable checklists, command runners, shell
  panels, proof scoring, quality scoring, ranking, certification, or production
  readiness scoring;
- app-wide routing, authentication, cloud services, deploy/release/publish, or
  database migration.
