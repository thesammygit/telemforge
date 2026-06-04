# Stage 25 Local Review Evidence Coverage Map Slice

## Boundary

This slice turns the Stage 24 local review evidence trace navigator into a
deterministic, read-only evidence coverage map and proof-gap board.

It stays fixture-first and local-live compatible through the existing mission
console view model. It does not add saved coverage filters, saved selections,
reviewer progress, reviewer identity, signoff, persistence, audit retention,
ticketing, report authoring, handoff exports, command runners, shell automation
panels, production services, deploy behavior, or cloud-backed state.

## Source Files

- `frontend/src/lib/reviewEvidenceCoverage.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewEvidenceCoverage.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Coverage Contract

- Schema: `telemforge.review_evidence_coverage.v1`
- Version: `1`
- Contract label: `local deterministic review evidence coverage map`
- Source: Stage 24 `telemforge.review_evidence_trace.v1` trace rows.
- Default coverage focus:
  - selects the highest-priority unresolved local proof gap when present;
  - falls back to the first available coverage row when no unresolved local
    proof gap exists.
- Each coverage row exposes:
  - source Stage 24 trace row ids;
  - source Stage 23 outcome row ids;
  - source Stage 22 readiness row ids;
  - source Stage 21 resolution ids;
  - source Stage 19 matrix row ids;
  - source action ids;
  - evidence target ids;
  - source bucket labels;
  - proof bucket labels;
  - static proof command ids;
  - static local review steps;
  - deferred boundary notes where applicable.
- Candidate coverage rows are informational and non-certifying. The mission
  console does not store coverage filters, reviewer progress, saved selections,
  or execute proof commands.

## Coverage Summary

- Default coverage row:
  `coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff`
- Unresolved local proof gap rows:
  - `coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff`
  - `coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-2:action:follow-up:decision:evidence-export-boundary`
- Deferred production scope:
  - `coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-3:action:deferred-production-handoff-scope`
- Static proof references:
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

1. Inspect the Stage 24 evidence trace navigator.
2. Read the Stage 25 evidence coverage map.
3. Confirm coverage rows are derived from Stage 24 trace rows.
4. Confirm unresolved local proof gaps rank before ready local evidence and
   deferred production scope.
5. Confirm source trace, outcome, readiness, resolution, matrix, action,
   evidence target, source bucket, proof bucket, and proof command ids remain
   visible.
6. Confirm the default focus identifies the first unresolved local proof bucket.
7. Confirm deferred production scope remains visible, non-actionable, and
   non-certifying.
8. Confirm there are no saved filters, selections, progress recovery, reviewer
   identity, signoff, persistence, ticketing, report export, or command-runner
   controls.

## Verification Commands

```text
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
  trace selections, saved coverage filters, and saved action ownership;
- reviewer signoff, audit retention, approval identity, or production readiness
  certification;
- external ticketing, messaging, email, workflow integrations, owner assignment,
  or task launchers;
- cloud services, telemetry upload, paid APIs, browser-cookie import, or
  external network calls;
- report designer, styled report downloads, report package writers, handoff
  report exports, or production handoff packages;
- executable command runners, shell automation panels, production handoff
  services, deploy, release, publish, or main-branch fast-forward.
