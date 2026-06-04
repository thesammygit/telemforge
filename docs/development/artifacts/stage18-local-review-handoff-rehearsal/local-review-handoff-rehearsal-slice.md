# Stage 18 Local Review Handoff Rehearsal Slice

## Boundary

This slice turns the Stage 16 review action queue and Stage 17 action-evidence
walkthrough into one deterministic local review handoff rehearsal. It orders
each action, exposes checkpoint counts, makes missing targets and local blockers
explicit, gives the reviewer a local prompt and expected outcome, and keeps
deferred production scope visible but non-blocking.

It remains fixture-first and local-live compatible through the mission-console
view model. It does not add saved reviewer sessions, persistent notes, action
ownership, reviewer signoff, audit retention, external ticketing, report
authoring, handoff report exports, production handoff services, deploy/release
behavior, cloud services, or identity.

## Source Files

- `frontend/src/lib/reviewHandoffRehearsal.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewHandoffRehearsal.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Rehearsal Contract

- Schema: `telemforge.review_handoff_rehearsal.v1`
- Version: `1`
- Contract label: `local deterministic review handoff rehearsal`
- Sequence rule:
  - use the ordered Stage 16 action queue;
  - select each action through the Stage 17 walkthrough builder;
  - build one rehearsal step per action without saving reviewer progress.
- Step fields:
  - action id, label, summary, priority, blocker category, and blocking state;
  - checkpoint counts for targets, evidence rows, replay frames, runbook targets,
    packet/export references, and source paths;
  - missing target status and missing target records;
  - reviewer prompt, expected local outcome, next local step, and source
    evidence references.
- Readiness:
  - local follow-up and missing-target steps remain blockers;
  - deferred production scope remains visible and non-blocking;
  - no production readiness verdict, signoff, ownership, or audit semantics are
    introduced.

## Human-Testable Flow

1. Inspect the Stage 16 review action queue.
2. Inspect the Stage 17 action-evidence walkthrough for each action.
3. Read the Stage 18 local handoff rehearsal steps in order.
4. Confirm each step shows checkpoint counts, missing target status, reviewer
   prompt, expected local outcome, next local step, and source references.
5. Confirm unresolved local blockers remain explicit.
6. Confirm deferred production scope is visible but does not block local
   rehearsal.

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/reviewHandoffRehearsal.test.ts
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

- production authentication, accounts, and collaboration identity;
- saved reviewer sessions, persistent notes, local note storage, or action
  ownership;
- reviewer signoff workflow, audit retention, approval identity, or production
  readiness certification;
- external ticketing, messaging, email, or workflow integrations;
- cloud services, telemetry upload, paid APIs, or browser-cookie import;
- report designer, downloadable styled reports, free-form export builders,
  report package writers, handoff report exports, or production handoff
  packages;
- deploy, release, publish, or main-branch fast-forward.
