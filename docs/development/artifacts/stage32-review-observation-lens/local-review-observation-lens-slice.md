# Stage 32 Local Review Observation Lens Slice

## Boundary

This slice turns the Stage 31 local review walkthrough path into a deterministic
review observation lens and static attention map inside the mission console.

The slice stays deterministic, local, read-only, fixture-first, and
non-persistent. It does not add saved observations, saved notes, saved progress,
reviewer identity, signoff, owner assignment, runnable checklists, command
execution, report exports, proof scoring, ranking, certification, app-wide
routing, or production handoff semantics.

## Source Files

- `frontend/src/lib/reviewObservationLens.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewObservationLens.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Observation Contract

- Schema: `telemforge.review_observation_lens.v1`
- Version: `1`
- Contract label: `local deterministic review observation lens and static attention map`
- Source: the Stage 31 `reviewWalkthroughPath` steps, prompt groups, anchor
  references, source schemas, contract labels, local statuses, useful count
  signals, expected observations, and deferred boundary notes.
- Stable phase order:
  1. decision
  2. action
  3. readiness
  4. evidence
  5. proof
  6. navigator
  7. reconciliation
- Each observation row preserves the Stage 31 source step id, source surface id,
  stage number, workflow group, local anchor id, source schema, contract label,
  local status label, status label, source labels, count signal ids, expected
  observation, and deferred boundary summary ids.
- Attention groups are static informational categories only:
  `source_alignment`, `anchor_resolution`, `count_signal`, and
  `deferred_boundary`.
- Anchor links remain local in-page links.
- Count signals are source-backed local review context only; they do not rank,
  score, certify, or assign work.
- Deferred production scope remains visible, non-actionable, and non-certifying.

## Reconciliation Summary

- The observation lens is built after `reviewWalkthroughPath` in the
  mission-console view model and keeps the fixture/local-live boundary
  unchanged.
- Observation row order is derived from Stage 31 `stepNumber`, not from ad hoc
  UI strings.
- Source references, anchor references, count signals, and deferred boundary
  summaries are explicit typed records.
- Each row anchor is checked against existing mission-console section ids in
  focused frontend tests.

## Human-Testable Flow

1. Open the mission console in fixture mode.
2. Find the Stage 32 observation lens near the Stage 31 walkthrough path.
3. Confirm the observation rows list Stage 14 through Stage 29 in stable review
   order.
4. Confirm source schema labels, contract labels, local status labels, useful
   counts, expected observations, and deferred boundary labels are visible.
5. Confirm the static attention map includes source alignment, anchor
   resolution, count signal, and deferred boundary groups.
6. Follow several anchor links and verify the page stays on the same route.
7. Confirm deferred production boundaries remain visible and non-actionable.
8. Confirm there is no saved observation, saved note, saved progress, reviewer
   identity, signoff, persistence, ticketing, report export, owner assignment,
   runnable checklist, task launcher, shell panel, proof scoring, ranking,
   certification, or command runner.

## Verification Commands

```text
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

- saved observations, saved notes, saved review progress, saved selections,
  local storage, reviewer identity, signoff, audit retention, persistent notes,
  or collaboration state;
- report authoring, report exports, handoff packages, external ticketing, or
  messaging integrations;
- owner assignment, task launchers, runnable checklists, command runners, shell
  panels, proof scoring, ranking, certification, or production readiness
  scoring;
- app-wide routing, authentication, cloud services, deploy/release/publish, or
  database migration.
