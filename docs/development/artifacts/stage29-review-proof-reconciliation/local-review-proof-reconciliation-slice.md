# Stage 29 Local Review Proof Reconciliation Slice

## Boundary

This slice turns the Stage 28 proof navigator and source crosswalk into a
deterministic local proof-chain reconciliation map.

It stays fixture-first and local-live compatible through the existing mission
console view model. It does not add saved reconciliation selections, saved
navigator selections, saved proof selections, saved reviewer progress, reviewer
identity, signoff, persistence, audit retention, ticketing, owner assignment,
task launchers, report authoring, handoff exports, command runners, shell
automation panels, runnable checklists, proof scoring, certification,
production services, deploy behavior, or cloud-backed state.

## Source Files

- `frontend/src/lib/reviewProofReconciliation.ts`
- `frontend/src/lib/reviewProofNavigator.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewProofReconciliation.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Reconciliation Contract

- Schema: `telemforge.review_proof_reconciliation.v1`
- Version: `1`
- Contract label: `local deterministic review proof-chain reconciliation map`
- Source: Stage 28 `telemforge.review_proof_navigator.v1` navigator rows,
  source crosswalk rows, static inspection prompts, static command references,
  and deferred boundary markers.
- Default reconciliation row:
  - follows the Stage 28 default navigator row;
  - preserves the Stage 28 default packet and source chain;
  - falls back through Stage 28 navigator order rather than choosing ad hoc UI
    text.
- Reconciliation rows preserve:
  - navigator row ids;
  - packet ids;
  - source priority row ids;
  - source coverage row ids;
  - source trace row ids;
  - source outcome row ids;
  - source readiness row ids;
  - source resolution ids;
  - source matrix row ids;
  - source action ids;
  - evidence target ids;
  - proof bucket labels;
  - proof command ids;
  - static human gate step ids;
  - source static review step ids;
  - static inspection prompt ids;
  - deferred boundary marker ids.
- Consistency buckets distinguish complete local chains, static local inspection
  gaps, and deferred production boundaries. The buckets are informational only
  and do not certify readiness.
- Source-chain segment summaries are local, source-backed, informational,
  non-executable, and non-certifying.
- Static review references are repo-relative, local, source-backed,
  informational, non-executable, and non-certifying.
- Deferred production notes remain visible, non-actionable, and non-certifying.

## Reconciliation Summary

- Default reconciliation row:
  `proof-reconciliation:proof-navigator:proof-packet:priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff`
- Static local inspection gap rows:
  - `proof-reconciliation:proof-navigator:proof-packet:priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff`
  - `proof-reconciliation:proof-navigator:proof-packet:priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-2:action:follow-up:decision:evidence-export-boundary`
- Deferred production boundary row:
  - `proof-reconciliation:proof-navigator:proof-packet:priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-3:action:deferred-production-handoff-scope`
- Static source references include:
  - `frontend/src/lib/reviewProofReconciliation.ts`
  - `frontend/src/lib/reviewProofNavigator.ts`
  - `frontend/src/lib/reviewProofPacket.ts`
  - `frontend/src/features/mission-console/MissionConsole.tsx`
  - `tests/frontend/reviewProofReconciliation.test.ts`

## Human-Testable Flow

1. Inspect the Stage 28 proof navigator and identify the default navigator row.
2. Read the Stage 29 proof-chain consistency map derived from the navigator.
3. Confirm reconciliation rows are derived from Stage 28 navigator rows, not ad
   hoc UI strings.
4. Confirm complete local chains, static local inspection gaps, and deferred
   production boundaries are visually distinct but informational only.
5. Confirm packet ids, priority row ids, coverage row ids, trace ids, outcome
   ids, readiness ids, resolution ids, matrix row ids, action ids, evidence
   target ids, proof command ids, static human gate step ids, static prompt ids,
   and deferred boundary marker ids remain visible.
6. Compare source-chain segment summaries across packets without executing
   commands.
7. Inspect repo-relative static review references without executable controls.
8. Confirm deferred production scope remains visible, non-actionable, and
   non-certifying.
9. Confirm there are no saved reconciliation selections, saved navigator
   selections, saved packet selections, saved proof selections, saved filters,
   progress recovery, reviewer identity, signoff, persistence, ticketing, report
   export, owner assignment, runnable checklists, task launchers, shell panels,
   proof scoring, certification, or command-runner controls.

## Verification Commands

```text
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
python3 scripts/public_repo_guard.py --scan-history
```

## Deferred

- production authentication, accounts, and collaboration identity;
- saved review-pass history, saved reviewer progress, persistent notes, saved
  trace selections, saved coverage filters, saved priority filters, saved proof
  selections, saved proof packet selections, saved navigator selections, saved
  reconciliation selections, saved consistency filters, and saved action
  ownership;
- reviewer signoff, audit retention, approval identity, production readiness
  scoring, proof scoring, or certification;
- external ticketing, messaging, email, workflow integrations, owner assignment,
  or task launchers;
- cloud services, telemetry upload, paid APIs, browser-cookie import, or
  external network calls;
- production evidence archive or database migration;
- report designer, styled report downloads, report package writers, handoff
  report exports, or production handoff packages;
- executable command runners, runnable checklists, shell automation panels,
  production handoff services, deploy, release, publish, or main-branch
  fast-forward.
