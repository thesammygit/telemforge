# Stage 17 Action Evidence Walkthrough Slice

## Boundary

This slice turns the Stage 16 review action queue into a deterministic local
action-evidence walkthrough with a selectable action, concrete local evidence
path rows, missing-target reporting, and a next local handoff step.

It stays fixture-first and local-live compatible through the mission-console
view model. It does not add saved reviewer sessions, persistent notes, action
ownership, external ticketing, messaging, identity, report authoring, report
exports, production handoff services, deploy/release behavior, or cloud-backed
state.

## Source Files

- `frontend/src/lib/reviewActionWalkthrough.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/App.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewActionWalkthrough.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Walkthrough Contract

- Schema: `telemforge.review_action_walkthrough.v1`
- Version: `1`
- Contract label: `local deterministic action evidence walkthrough`
- Selection rule:
  - explicit selected action id when present;
  - otherwise the first blocking action;
  - otherwise the first available action.
- Evidence path rows:
  - briefing-board evidence rows;
  - replay frame ids;
  - runbook targets;
  - packet/export references;
  - repo-relative source paths where available.
- Missing evidence:
  - unresolved targets are reported explicitly as local follow-up gaps;
  - missing targets never collapse into a silent success state.

## Human-Testable Flow

1. Open the local mission console once frontend dependencies are available.
2. Inspect the Stage 16 review action queue.
3. Select each local review action.
4. Verify the selected action reveals the linked briefing-board evidence rows,
   replay frame ids, runbook targets, packet/export references, source paths,
   and any missing targets.
5. Confirm the next local step and deferred production boundary notes remain
   visible without saved sessions or production handoff primitives.

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/reviewActionWalkthrough.test.ts
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
python3 scripts/public_repo_guard.py --scan-history
canonical state bridge sync on closeout
```

## Deferred

- production authentication and collaboration identity;
- saved reviewer sessions, persistent notes, and action ownership;
- external ticketing, messaging, and email integrations;
- production evidence archives or database migrations;
- report designer, styled report downloads, or free-form report/package writers;
- deploy, release, publish, or main-branch fast-forward.
