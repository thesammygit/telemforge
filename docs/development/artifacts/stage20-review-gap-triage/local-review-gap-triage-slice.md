# Stage 20 Local Review Gap Triage Slice

## Boundary

This slice turns the Stage 19 local review coverage matrix into a deterministic
local review gap triage model and compact next-pass mission-console panel.

It stays fixture-first and local-live compatible through the existing mission
console view model. It does not add saved reviewer sessions, persistence,
ownership, signoff, ticketing, report authoring, handoff exports, command
runners, shell automation panels, production services, deploy behavior, or
cloud-backed state.

## Source Files

- `frontend/src/lib/reviewGapTriage.ts`
- `frontend/src/lib/reviewHandoffCoverageMatrix.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewGapTriage.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Triage Contract

- Schema: `telemforge.review_gap_triage.v1`
- Version: `1`
- Contract label: `local deterministic review gap triage`
- Source: Stage 19 `telemforge.review_handoff_coverage_matrix.v1` rows.
- Ranking:
  - missing local evidence targets first;
  - other local blockers second;
  - ready local rows after active blockers;
  - deferred production boundaries last and non-actionable.
- Each next-pass item exposes:
  - source matrix row ids;
  - source action ids;
  - blocker category and actionability;
  - source coverage buckets;
  - static proof command references;
  - next local step.
- Proof commands are repo-relative text references only. The UI does not execute
  commands.

## Triage Summary

- Local blocker group:
  - `action:follow-up:decision:alert-lifecycle-handoff`
  - `action:follow-up:decision:evidence-export-boundary`
- Deferred production boundary group:
  - `action:deferred-production-handoff-scope`
- Static proof references:
  - `node --experimental-strip-types --test tests/frontend/reviewGapTriage.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewHandoffCoverageMatrix.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewHandoffRehearsal.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewActionWalkthrough.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewActionQueue.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewBriefingBoard.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewDecisionRegister.test.ts`
  - `node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts`
  - `python3 scripts/public_repo_guard.py --scan-history`

## Human-Testable Flow

1. Inspect the Stage 19 local review coverage matrix.
2. Read the Stage 20 next local review pass panel.
3. Confirm local blockers rank before deferred production-only scope.
4. Confirm each item shows source matrix rows, source buckets, proof command
   references, and a next local step.
5. Confirm deferred production scope remains visible but non-actionable.
6. Confirm proof commands remain static, repo-relative text and are not command
   runner controls.

## Verification Commands

```text
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

- production authentication and collaboration identity;
- saved reviewer sessions, persistent notes, and action ownership;
- reviewer signoff, audit retention, and production readiness certification;
- external ticketing, messaging, or email integrations;
- cloud services, telemetry upload, paid APIs, or browser-cookie import;
- report designer, downloadable styled reports, report package writers, or
  handoff report exports;
- executable command runners, shell automation panels, production handoff
  services, deploy, release, publish, or main-branch fast-forward.
