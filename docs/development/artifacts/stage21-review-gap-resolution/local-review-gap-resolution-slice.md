# Stage 21 Local Review Gap Resolution Slice

## Boundary

This slice turns the Stage 20 local review gap triage into a deterministic
local review gap resolution playbook and static evidence target checklist.

It stays fixture-first and local-live compatible through the existing mission
console view model. It does not add saved reviewer sessions, persistence,
ownership, signoff, ticketing, report authoring, handoff exports, command
runners, shell automation panels, production services, deploy behavior, or
cloud-backed state.

## Source Files

- `frontend/src/lib/reviewGapResolution.ts`
- `frontend/src/lib/reviewGapTriage.ts`
- `frontend/src/lib/reviewHandoffCoverageMatrix.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewGapResolution.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Resolution Contract

- Schema: `telemforge.review_gap_resolution.v1`
- Version: `1`
- Contract label: `local deterministic review gap resolution`
- Source: Stage 20 `telemforge.review_gap_triage.v1` next-pass items.
- Ranking:
  - missing local evidence targets first;
  - other local blockers second;
  - ready local rows after active blockers;
  - deferred production boundaries last and non-actionable.
- Each resolution row exposes:
  - source Stage 19 matrix row ids;
  - source action ids;
  - evidence target checklist rows;
  - source coverage buckets;
  - static proof command references;
  - a next static local proof step.
- Proof commands are repo-relative text references only. The UI does not execute
  commands or store reviewer progress.

## Resolution Summary

- Local actionable rows:
  - `action:follow-up:decision:alert-lifecycle-handoff`
  - `action:follow-up:decision:evidence-export-boundary`
- Deferred production boundary:
  - `action:deferred-production-handoff-scope`
- Static proof references:
  - `node --experimental-strip-types --test tests/frontend/reviewGapResolution.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewGapTriage.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewHandoffCoverageMatrix.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewHandoffRehearsal.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewActionWalkthrough.test.ts`
  - `node --experimental-strip-types --test tests/frontend/reviewActionQueue.test.ts`
  - `node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts`
  - `python3 scripts/public_repo_guard.py --scan-history`

## Human-Testable Flow

1. Inspect the Stage 20 next local review pass panel.
2. Read the Stage 21 resolution proof checklist panel.
3. Confirm local blockers rank before deferred production-only scope.
4. Confirm each resolution row shows source matrix rows, source actions, source
   buckets, evidence target checklist rows, and static proof references.
5. Confirm the top local blocker has a next static local proof step.
6. Confirm deferred production scope remains visible and non-actionable.
7. Confirm the panel has no saved reviewer sessions, persistent notes,
   ownership, ticketing, signoff, report exports, or command runners.

## Verification Commands

```text
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

- production authentication and collaboration identity;
- saved reviewer sessions, persistent notes, action ownership, and signoff;
- audit retention or production readiness certification;
- external ticketing, messaging, or email integrations;
- cloud services, telemetry upload, paid APIs, or browser-cookie import;
- report designer, styled report downloads, report package writers, or handoff
  report exports;
- executable command runners, shell automation panels, production handoff
  services, deploy, release, publish, or main-branch fast-forward.
