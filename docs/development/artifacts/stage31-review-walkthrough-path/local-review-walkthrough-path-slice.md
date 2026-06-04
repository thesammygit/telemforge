# Stage 31 Local Review Walkthrough Path Slice

## Boundary

This slice turns the Stage 30 local review surface index into a deterministic
review walkthrough path and static prompt deck inside the mission console.

The slice stays deterministic, local, read-only, fixture-first, and
non-persistent. It does not add saved walkthrough progress, saved selections,
reviewer identity, signoff, owner assignment, runnable checklists, command
execution, exports, proof scoring, certification, app-wide routing, or
production handoff semantics.

## Source Files

- `frontend/src/lib/reviewWalkthroughPath.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewWalkthroughPath.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Walkthrough Contract

- Schema: `telemforge.review_walkthrough_path.v1`
- Version: `1`
- Contract label: `local deterministic review walkthrough path and static prompt deck`
- Source: the Stage 30 `reviewSurfaceIndex` rows, workflow groups, local
  anchors, source schemas, contract labels, local statuses, source count
  metrics, and deferred boundary notes.
- Stable phase order:
  1. decision
  2. action
  3. readiness
  4. evidence
  5. proof
  6. navigator
  7. reconciliation
- Each walkthrough step preserves the Stage 30 source surface id, stage number,
  workflow group, local anchor id, source schema, contract label, status label,
  source labels, useful count metrics, static prompt, and expected observation.
- Anchor links remain local in-page links.
- Prompts are static, informational, non-persistent, non-executable, and
  non-certifying.
- Deferred production scope remains visible, non-actionable, and non-certifying.

## Reconciliation Summary

- The walkthrough is built after `reviewSurfaceIndex` in the mission-console
  view model and keeps the fixture/local-live boundary unchanged.
- Step order is derived from Stage 30 `localOrder`, not from ad hoc UI strings.
- Prompt groups are derived from Stage 30 workflow groups and preserve the
  decision, action, readiness, evidence, proof, navigator, and reconciliation
  phase order.
- Each step anchor is checked against existing mission-console section ids in
  focused frontend tests.

## Human-Testable Flow

1. Open the mission console in fixture mode.
2. Find the Stage 31 walkthrough path near the Stage 30 surface index.
3. Confirm the path lists Stage 14 through Stage 29 in stable review order.
4. Confirm the prompt deck groups decision, action, readiness, evidence, proof,
   navigator, and reconciliation phases.
5. Confirm each step exposes a local anchor link to an existing section.
6. Confirm source schema labels, contract labels, local status labels, status
   labels, and useful counts are visible.
7. Confirm static prompts and expected observations are informational only.
8. Follow several anchor links and verify the page stays on the same route.
9. Confirm deferred production boundaries remain visible and non-actionable.
10. Confirm there is no saved progress, reviewer identity, signoff, persistence,
    ticketing, report export, owner assignment, runnable checklist, task
    launcher, shell panel, proof scoring, certification, or command runner.

## Verification Commands

```text
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
python3 scripts/public_repo_guard.py --scan-history
```

## Deferred

- saved walkthrough progress, saved step selections, saved surface selections,
  saved navigation filters, local storage, reviewer identity, signoff, audit
  retention, persistent notes, or collaboration state;
- report authoring, report exports, handoff packages, external ticketing, or
  messaging integrations;
- owner assignment, task launchers, runnable checklists, command runners, shell
  panels, proof scoring, certification, or production readiness scoring;
- app-wide routing, authentication, cloud services, deploy/release/publish, or
  database migration.
