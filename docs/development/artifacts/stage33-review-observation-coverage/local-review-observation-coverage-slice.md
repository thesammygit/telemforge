# Stage 33 Local Review Observation Coverage Slice

## Boundary

This slice turns the Stage 32 local review observation lens into a deterministic
observation coverage matrix and static blind-spot map inside the mission
console.

The slice stays deterministic, local, read-only, fixture-first, and
non-persistent. It does not add saved observations, saved notes, saved filters,
saved coverage selections, saved progress, reviewer identity, signoff, owner
assignment, runnable checklists, command execution, report exports, proof
scoring, quality scoring, ranking, certification, app-wide routing, or
production handoff semantics.

## Source Files

- `frontend/src/lib/reviewObservationCoverage.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewObservationCoverage.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Coverage Contract

- Schema: `telemforge.review_observation_coverage.v1`
- Version: `1`
- Contract label: `local deterministic observation coverage matrix and static blind-spot map`
- Source: the Stage 32 `reviewObservationLens` observation rows, attention
  groups, source references, anchor references, count signals, and deferred
  boundary summaries.
- Stable workflow phase order:
  1. decision
  2. action
  3. readiness
  4. evidence
  5. proof
  6. navigator
  7. reconciliation
- Source-stage coverage preserves the Stage 32 observation row order and uses
  source stage numbers from the observation rows.
- Attention coverage is derived from Stage 32 attention groups:
  `source_alignment`, `anchor_resolution`, `count_signal`, and
  `deferred_boundary`.
- Anchor coverage remains local in-page navigation only.
- Count signals remain source-backed local review context only; they do not
  rank, score, certify, assign, or launch work.
- Deferred production boundaries remain visible, non-actionable, and
  non-certifying.
- Blind-spot rows are static explanatory notes for absent saved review state,
  absent reviewer identity/signoff, absent execution/scoring, and deferred
  production boundaries. They are not tasks, tickets, checklists, owner
  assignments, scores, ranks, or certification gates.

## Reconciliation Summary

- The coverage matrix is built after `reviewObservationLens` in the
  mission-console view model and keeps the fixture/local-live boundary
  unchanged.
- The UI renders the Stage 33 matrix near the Stage 32 observation lens without
  introducing a route, storage, command execution, report export, signoff,
  owner assignment, proof scoring, certification, or runnable checklist.
- Coverage rows are derived from typed Stage 32 data, not ad hoc UI strings.

## Human-Testable Flow

1. Open the mission console in fixture mode.
2. Find the Stage 33 observation coverage matrix near the Stage 32 observation
   lens.
3. Confirm phase coverage is ordered decision, action, readiness, evidence,
   proof, navigator, and reconciliation.
4. Confirm source-stage coverage follows Stage 14 through Stage 29 local review
   order.
5. Confirm attention-kind, anchor, count-signal, and deferred-boundary coverage
   are visible as local review context.
6. Confirm blind-spot rows are static explanatory notes, not tasks, tickets,
   checklists, owner assignments, scores, ranks, or certification gates.
7. Follow several anchor links and verify the page stays on the same route.
8. Confirm there is no saved observation, saved note, saved progress, reviewer
   identity, signoff, persistence, ticketing, report export, owner assignment,
   runnable checklist, task launcher, shell panel, proof scoring, ranking,
   certification, or command runner.

## Verification Commands

```text
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

- saved observations, saved notes, saved filters, saved coverage selections,
  saved review progress, local storage, reviewer identity, signoff, audit
  retention, persistent notes, or collaboration state;
- report authoring, report exports, handoff packages, external ticketing, or
  messaging integrations;
- owner assignment, task launchers, runnable checklists, command runners, shell
  panels, proof scoring, quality scoring, ranking, certification, or production
  readiness scoring;
- app-wide routing, authentication, cloud services, deploy/release/publish, or
  database migration.
