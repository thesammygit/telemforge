# Stage 36 Local Review Observation Boundary Walkthrough Slice

## Boundary

This slice turns the Stage 35 deferred-boundary ledger into a deterministic
local walkthrough and static source path inside the mission console.

The slice stays deterministic, local, read-only, fixture-first, and
non-persistent. It does not add saved walkthrough selections, saved boundary
selections, saved observations, saved notes, saved filters, saved progress,
reviewer identity, signoff, owner assignment, runnable checklists, command
execution, report exports, proof scoring, quality scoring, ranking,
certification, app-wide routing, or production handoff semantics.

## Source Files

- `frontend/src/lib/reviewObservationBoundaryWalkthrough.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewObservationBoundaryWalkthrough.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Boundary Walkthrough Contract

- Schema: `telemforge.review_observation_boundary_walkthrough.v1`
- Version: `1`
- Contract label: `local deterministic boundary walkthrough and static source path`
- Source: the Stage 35 `reviewObservationBoundaryLedger` view, especially
  boundary rows, source-stage boundary groups, anchor hrefs, related
  observations, and static non-goal notes.
- Walkthrough step order preserves Stage 35 boundary row order.
- Default focus uses the first Stage 35 boundary row.
- Each walkthrough step carries source summary, source anchor ids and hrefs,
  related observation row ids, related citation row ids, related source stages,
  static non-goal note ids, source path group ids, guardrail group ids, and
  static non-goal context.
- Source path groups preserve Stage 35 source-stage boundary group order and
  remain local in-page source context only.
- Static guardrail groups preserve Stage 35 static non-goal note order and
  remain explanatory local review context only.
- Local anchors remain in-page href references only; they do not introduce
  routes, storage, saved selection state, command execution, exports, signoff,
  owner assignment, proof scoring, certification, or runnable checklist
  behavior.

## Reconciliation Summary

- The boundary walkthrough is built after `reviewObservationBoundaryLedger` in
  the mission-console view model and keeps the fixture/local-live boundary
  unchanged.
- The UI renders the Stage 36 walkthrough directly after the Stage 35 boundary
  ledger without introducing a route, storage, command execution, report export,
  signoff, owner assignment, proof scoring, certification, or runnable
  checklist.
- Walkthrough rows and groups are derived from typed Stage 35 data, not ad hoc
  UI strings.

## Human-Testable Flow

1. Open the mission console in fixture mode.
2. Find the Stage 36 boundary walkthrough near the Stage 35 deferred-boundary
   ledger.
3. Confirm walkthrough steps follow Stage 35 boundary row order.
4. Confirm the default focus uses the first Stage 35 boundary row.
5. Confirm each step shows source summary, local anchors, related observation
   count, source-stage context, source path count, and static guardrail count.
6. Follow local anchor links and verify the page stays on the same route.
7. Confirm source path and guardrail panels remain explanatory static review
   context, not tasks, tickets, checklists, owner assignments, scores, ranks,
   or certification gates.
8. Confirm there is no saved walkthrough selection, saved boundary selection,
   saved observation, saved note, saved progress, reviewer identity, signoff,
   persistence, ticketing, report export, owner assignment, runnable checklist,
   task launcher, shell panel, proof scoring, ranking, certification, or command
   runner.

## Verification Commands

```text
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

- saved walkthrough selections, saved boundary selections, saved citation
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
