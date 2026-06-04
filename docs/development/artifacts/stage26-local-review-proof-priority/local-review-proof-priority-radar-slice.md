# Stage 26 Local Review Proof Priority Radar Slice

## Boundary

This slice turns the Stage 25 local evidence coverage map into a deterministic,
read-only proof priority lens and static check radar.

It stays fixture-first and local-live compatible through the existing mission
console view model. It does not add saved priority filters, saved proof
selections, saved reviewer progress, reviewer identity, signoff, persistence,
audit retention, ticketing, report authoring, handoff exports, command runners,
shell automation panels, production services, deploy behavior, or cloud-backed
state.

## Source Files

- `frontend/src/lib/reviewProofPriority.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewProofPriority.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Priority Contract

- Schema: `telemforge.review_proof_priority.v1`
- Version: `1`
- Contract label: `local deterministic review proof priority radar`
- Source: Stage 25 `telemforge.review_evidence_coverage.v1` coverage rows.
- Default priority focus:
  - selects the highest-priority unresolved local proof gap when present;
  - falls back to the first available priority row when no unresolved local
    proof gap exists.
- Each priority row exposes:
  - source Stage 25 coverage row ids;
  - source Stage 24 trace row ids;
  - source Stage 23 outcome row ids;
  - source Stage 22 readiness row ids;
  - source Stage 21 resolution ids;
  - source Stage 19 matrix row ids;
  - source action ids;
  - evidence target ids;
  - source bucket labels;
  - proof bucket labels;
  - proof command ids;
  - static review step ids;
  - ranking reasons derived from Stage 25 row status;
  - deferred boundary notes where applicable.
- Static check radar groups are repo-relative, local, non-executable, and
  source-backed by coverage rows.
- Candidate priority rows are informational and non-certifying. The mission
  console does not store priority filters, reviewer progress, saved selections,
  proof selections, or execute proof commands.

## Priority Summary

- Default priority row:
  `priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff`
- Unresolved local proof gap rows:
  - `priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff`
  - `priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-2:action:follow-up:decision:evidence-export-boundary`
- Deferred production scope:
  - `priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-3:action:deferred-production-handoff-scope`
- Static proof references:
  - `node --experimental-strip-types --test tests/frontend/reviewProofPriority.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewEvidenceCoverage.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewEvidenceTrace.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewPassOutcome.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewPassReadiness.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewGapResolution.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewGapTriage.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewHandoffCoverageMatrix.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewHandoffRehearsal.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewActionWalkthrough.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewActionQueue.test.ts`
  - `node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts`
  - `python3 scripts/public_repo_guard.py --scan-history`

## Human-Testable Flow

1. Inspect the Stage 25 evidence coverage map and proof-gap board.
2. Read the Stage 26 proof priority lens.
3. Confirm priority rows are derived from Stage 25 coverage row ids.
4. Confirm unresolved local proof gaps rank before ready evidence and deferred
   production scope.
5. Confirm source coverage, trace, outcome, readiness, resolution, matrix,
   action, evidence target, proof bucket, proof command, and static review step
   ids remain visible.
6. Confirm the default focus identifies the first unresolved local proof gap and
   explains why it is first.
7. Inspect static check radar groups without executable command controls.
8. Confirm deferred production scope remains visible, non-actionable, and
   non-certifying.
9. Confirm there are no saved filters, selections, progress recovery, reviewer
   identity, signoff, persistence, ticketing, report export, or command-runner
   controls.

## Verification Commands

```text
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
python3 -m unittest discover -s tests/backend -p 'test_stage12_incident_review_packets.py'
python3 -m unittest discover -s tests/backend -p 'test_stage12_incident_review_exports.py'
python3 -m unittest discover -s tests/backend -p 'test_stage11_scenario_runbooks.py'
python3 -m unittest discover -s tests/backend -p 'test_stage10_alert_acknowledgement.py'
python3 -m unittest discover -s tests/backend -p 'test_stage10_alert_resolution.py'
python3 -m unittest discover -s tests/backend -p 'test_stage07_api.py'
python3 scripts/public_repo_guard.py --scan-history
```

## Deferred

- production authentication, accounts, and collaboration identity;
- saved review-pass history, saved reviewer progress, persistent notes, saved
  trace selections, saved coverage filters, saved priority filters, saved proof
  selections, and saved action ownership;
- reviewer signoff, audit retention, approval identity, or production readiness
  certification;
- external ticketing, messaging, email, workflow integrations, owner assignment,
  or task launchers;
- cloud services, telemetry upload, paid APIs, browser-cookie import, or
  external network calls;
- report designer, styled report downloads, report package writers, handoff
  report exports, or production handoff packages;
- executable command runners, runnable checklists, shell automation panels,
  production handoff services, deploy, release, publish, or main-branch
  fast-forward.
