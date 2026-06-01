# Stage 16 Review Action Queue Slice

## Boundary

This slice turns the local Stage 15 review briefing board into a deterministic
Stage 16 action queue and handoff readiness surface.

The queue is derived from the existing briefing board follow-up actions,
evidence drilldown rows, readiness status, and local-only scope notes. It stays
fixture-first and local-live compatible through the mission-console view model.
It does not add saved reviewer sessions, persistent notes, action ownership,
external ticketing, messaging, identity, report authoring, production
persistence, cloud services, telemetry upload, deploy, release, or package
publishing behavior.

## Source Files

- `frontend/src/lib/reviewActionQueue.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewActionQueue.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Action Queue Contract

- Schema: `telemforge.review_action_queue.v1`
- Version: `1`
- Contract label: `local deterministic review action queue`
- Readiness verdicts:
  - `blocked_by_local_follow_up`
  - `deferred_production_scope_only`
  - `ready_for_local_handoff`
- Action priorities:
  - `p0` first local follow-up blocker
  - `p1` remaining local follow-up or fallback evidence blockers
  - `p2` deferred production scope
- Blocker categories:
  - `local_follow_up`
  - `local_evidence_gap`
  - `deferred_production_scope`

## Human-Testable Flow

1. Open the local mission console once frontend dependencies are available.
2. Inspect the Stage 15 review briefing board.
3. Inspect the Stage 16 review action queue and handoff readiness panel.
4. Confirm local follow-up actions are shown as blocking handoff.
5. Follow each action to its evidence targets.
6. Resolve the local alert lifecycle in fixture mode and confirm the readiness
   verdict changes to deferred production scope only.
7. Confirm deferred production scope remains visible but non-blocking for local
   handoff.

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/reviewActionQueue.test.ts
node --experimental-strip-types --test tests/frontend/reviewBriefingBoard.test.ts
node --experimental-strip-types --test tests/frontend/reviewDecisionRegister.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
node --experimental-strip-types --test tests/frontend/incidentReviewPackets.test.ts
node --experimental-strip-types --test tests/frontend/scenarioRunbooks.test.ts
node --experimental-strip-types --test tests/frontend/stage09LiveConsoleAdapter.test.ts
npm --prefix frontend run test
python3 -m unittest discover -s tests/backend -p 'test_stage12_incident_review_packets.py'
python3 -m unittest discover -s tests/backend -p 'test_stage12_incident_review_exports.py'
python3 -m unittest discover -s tests/backend -p 'test_stage11_scenario_runbooks.py'
python3 -m unittest discover -s tests/backend -p 'test_stage10_alert_acknowledgement.py'
python3 -m unittest discover -s tests/backend -p 'test_stage10_alert_resolution.py'
python3 -m unittest discover -s tests/backend -p 'test_stage07_api.py'
git diff --cached --check
python3 scripts/public_repo_guard.py --scan-history
canonical state bridge sync on closeout
```

## Deferred

- production authentication and collaboration identity;
- editable saved reviewer sessions, persistent notes, and action ownership;
- external ticketing, messaging, or email handoff;
- production evidence archives or database migrations;
- report designer, styled report downloads, or free-form export builder;
- deploy, release, package publishing, or main-branch fast-forward.
