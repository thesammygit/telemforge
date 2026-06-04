# Stage 24 Local Review Evidence Trace Navigator Slice

## Boundary

This slice turns the Stage 23 local review-pass outcome board into a
deterministic, read-only evidence trace navigator and static proof drilldown.

It stays fixture-first and local-live compatible through the existing mission
console view model. It does not add saved trace selections, reviewer progress,
reviewer identity, signoff, persistence, audit retention, ticketing, report
authoring, handoff exports, command runners, shell automation panels,
production services, deploy behavior, or cloud-backed state.

## Source Files

- `frontend/src/lib/reviewEvidenceTrace.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewEvidenceTrace.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Trace Contract

- Schema: `telemforge.review_evidence_trace.v1`
- Version: `1`
- Contract label: `local deterministic review evidence trace navigator`
- Source: Stage 23 `telemforge.review_pass_outcome.v1` outcome rows.
- Default trace:
  - selects the highest-priority unresolved local proof gap when present;
  - falls back to the first available outcome row when no unresolved local proof
    gap exists.
- Each trace row exposes:
  - source Stage 23 outcome row ids;
  - source Stage 22 readiness row ids;
  - source Stage 21 resolution ids;
  - source Stage 19 matrix row ids;
  - source action ids;
  - evidence target ids;
  - source bucket labels;
  - static proof command references;
  - outcome, readiness, resolution, coverage, proof, and deferred-scope trace
    segments where applicable;
  - a next static local review step.
- Candidate traces are informational and non-certifying. The mission console
  does not store reviewer selections or execute proof commands.

## Trace Summary

- Default trace row:
  `evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff`
- Unresolved local proof gap rows:
  - `evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff`
  - `evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-2:action:follow-up:decision:evidence-export-boundary`
- Deferred production scope:
  - `evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-3:action:deferred-production-handoff-scope`
- Static proof references:
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

1. Inspect the Stage 23 candidate outcome board.
2. Read the Stage 24 evidence trace navigator.
3. Confirm the default trace is the first unresolved local proof gap row.
4. Confirm source outcome, readiness, resolution, matrix, action, evidence
   target, bucket, and proof ids are visible for trace rows.
5. Confirm the selected trace separates outcome, readiness, resolution,
   coverage, and proof segments.
6. Confirm deferred production scope remains visible, non-actionable, and
   non-certifying.
7. Confirm there are no saved selections, progress recovery, reviewer identity,
   signoff, persistence, ticketing, report export, or command-runner controls.

## Verification Commands

```text
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
- saved trace selections, saved review-pass history, saved reviewer progress,
  persistent notes, and saved action ownership;
- reviewer signoff, audit retention, approval identity, or production readiness
  certification;
- external ticketing, messaging, email, workflow integrations, owner assignment,
  or task launchers;
- cloud services, telemetry upload, paid APIs, or browser-cookie import;
- report designer, styled report downloads, report package writers, handoff
  report exports, or production handoff packages;
- executable command runners, shell automation panels, production handoff
  services, deploy, release, publish, or main-branch fast-forward.
