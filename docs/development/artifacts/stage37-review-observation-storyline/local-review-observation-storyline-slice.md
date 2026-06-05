# Stage 37 Local Review Observation Storyline Slice

## Boundary

This slice turns the Stage 36 boundary walkthrough into a deterministic local
observation storyline and static evidence path inside the mission console.

The slice stays deterministic, local, read-only, fixture-first, and
non-persistent. It does not add saved storyline selections, saved reviewer
progress, saved observations, saved notes, saved filters, reviewer identity,
signoff, audit retention, owner assignment, runnable checklists, command
execution, report exports, proof scoring, quality scoring, ranking,
certification, app-wide routing, deploy/release behavior, or production
handoff semantics.

## Source Files

- `frontend/src/lib/reviewObservationStoryline.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewObservationStoryline.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Observation Storyline Contract

- Schema: `telemforge.review_observation_storyline.v1`
- Version: `1`
- Contract label: `local deterministic observation storyline and static evidence path`
- Source: the Stage 36 `reviewObservationBoundaryWalkthrough` view, especially
  walkthrough steps, source path groups, static guardrail groups, default
  focus, and the source Stage 35 boundary ledger.
- Segment order preserves Stage 36 walkthrough step order.
- Default opening uses the first Stage 36 walkthrough step.
- Each storyline segment carries source summary, source anchor ids and hrefs,
  related observation row ids, related citation row ids, related source stages,
  source-stage evidence group ids, static guardrail reference ids, static
  non-goal contexts, and prior review-surface references.
- Source-stage evidence groups preserve Stage 36 source path group order and
  remain local in-page source context only.
- Static guardrail references preserve Stage 36 guardrail order and remain
  explanatory local review context only.
- Prior surface references are in-page links to Stage 34 citations, Stage 35
  boundary ledger rows, and Stage 36 boundary walkthrough steps. They do not
  introduce routes, storage, saved selection state, command execution, exports,
  signoff, owner assignment, scoring, ranking, certification, or runnable
  checklist behavior.

## Reconciliation Summary

- The observation storyline is built after
  `reviewObservationBoundaryWalkthrough` in the mission-console view model and
  keeps the fixture/local-live boundary unchanged.
- The UI renders the Stage 37 storyline directly after the Stage 36 boundary
  walkthrough without introducing a route, storage, command execution, report
  export, signoff, owner assignment, proof scoring, certification, or runnable
  checklist.
- Storyline segments and supporting groups are derived from typed Stage 36
  data, not ad hoc UI strings.

## Human-Testable Flow

1. Open the mission console in fixture mode.
2. Find the Stage 37 observation storyline near the Stage 36 boundary
   walkthrough.
3. Confirm storyline segments follow Stage 36 walkthrough step order.
4. Confirm the default opening uses the first Stage 36 walkthrough step.
5. Confirm each segment shows source summary, local anchors, related
   observation count, source-stage context, prior surface references, and
   static guardrail count.
6. Follow local anchor links and verify the page stays on the same route.
7. Confirm source-stage evidence and guardrail panels remain explanatory static
   review context, not tasks, tickets, checklists, owner assignments, scores,
   ranks, or certification gates.
8. Confirm there is no saved storyline selection, saved walkthrough selection,
   saved boundary selection, saved observation, saved note, saved progress,
   reviewer identity, signoff, persistence, ticketing, report export, owner
   assignment, runnable checklist, task launcher, shell panel, proof scoring,
   ranking, certification, or command runner.

## Verification Commands

```text
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

- saved storyline selections, saved walkthrough selections, saved boundary
  selections, saved citation selections, saved source-map selections, saved
  observations, saved notes, saved filters, saved review progress, local
  storage, reviewer identity, signoff, audit retention, persistent notes, or
  collaboration state;
- report authoring, report exports, handoff packages, external ticketing, or
  messaging integrations;
- owner assignment, task launchers, runnable checklists, command runners,
  shell panels, proof scoring, quality scoring, ranking, certification, or
  production readiness scoring;
- app-wide routing, authentication, cloud services, deploy/release/publish, or
  database migration.
