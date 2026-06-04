# Stage 30 Local Review Surface Index Slice

## Boundary

This slice turns the completed Stage 14 through Stage 29 review surfaces into a
compact local review surface index and in-page navigation map inside the mission
console.

The slice stays deterministic, local, read-only, fixture-first, and
non-persistent. It does not add saved navigation state, progress tracking,
exports, report authoring, signoff, owner assignment, runnable checklists,
proof scoring, certification, app-wide routing, or production handoff
semantics.

## Source Files

- `frontend/src/lib/reviewSurfaceIndex.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewSurfaceIndex.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Index Contract

- Schema: `telemforge.review_surface_index.v1`
- Version: `1`
- Contract label: `local deterministic review surface index and navigation map`
- Source: the existing Stage 14 through Stage 29 mission-console review
  surfaces, their local status, source schema labels, contract labels, summary
  counts, local in-page anchors, and deferred boundary notes.
- Stable order:
  1. Stage 14 decision register
  2. Stage 15 briefing board
  3. Stage 16 action queue
  4. Stage 17 action walkthrough
  5. Stage 18 handoff rehearsal
  6. Stage 19 coverage matrix
  7. Stage 20 gap triage
  8. Stage 21 gap resolution
  9. Stage 22 pass readiness
  10. Stage 23 pass outcome
  11. Stage 24 evidence trace
  12. Stage 25 evidence coverage
  13. Stage 26 proof priority
  14. Stage 27 proof packet
  15. Stage 28 proof navigator
  16. Stage 29 proof reconciliation
- Workflow groups:
  - decision
  - action
  - readiness
  - evidence
  - proof
  - navigator
  - reconciliation
- Anchor links remain local and route-free.
- Deferred production scope remains visible, informational, and
  non-actionable.

## Reconciliation Summary

- Each row preserves a local anchor id that resolves to an existing
  mission-console section.
- Source labels and count chips come from the underlying view-model surfaces,
  not ad hoc UI strings.
- The surface index keeps the review chain readable without introducing saved
  selections, stored navigation state, exports, command execution, ownership,
  or production handoff behavior.

## Human-Testable Flow

1. Open the mission console in fixture mode.
2. Find the Stage 30 surface index near the top of the review surfaces.
3. Confirm the index lists Stage 14 through Stage 29 in a stable order.
4. Confirm each row exposes a local in-page anchor link to an existing section.
5. Confirm source schema labels, contract labels, local status labels, and
   count chips are visible.
6. Confirm decision, action, readiness, evidence, proof, navigator, and
   reconciliation groups are distinct but informational only.
7. Follow a few anchor links and verify the page stays on the same route.
8. Confirm deferred production boundaries remain visible and non-actionable.

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/reviewSurfaceIndex.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
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
python3 scripts/public_repo_guard.py --scan-history
```

## Deferred

- saved navigation state, progress recovery, reviewer identity, signoff, or
  persistent notes;
- exports, report writing, handoff packages, or external ticketing;
- owner assignment, task launchers, runnable checklists, or command runners;
- proof scoring, certification, production readiness scoring, or audit
  retention;
- app-wide routing, authentication, cloud services, deploy/release/publish,
  or database migration.
