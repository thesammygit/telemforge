# Stage 15 Review Briefing Board Slice

## Boundary

This slice turns the local Stage 14 review decision register into a compact
Stage 15 review briefing board with grouped decision summaries, evidence
drilldown rows, follow-up actions, and local-only scope notes.

The implementation stays fixture-first and local-live compatible through the
existing mission-console state. It does not add authentication, cloud
services, telemetry uploads, deployment behavior, saved reviewer sessions,
persistent notes, external ticketing, report design, production evidence
archives, or database migrations.

## Source Files

- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/lib/reviewDecisionRegister.ts`
- `frontend/src/lib/reviewBriefingBoard.ts`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewBriefingBoard.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Briefing Board Contract

- Schema: `telemforge.review_briefing_board.v1`
- Version: `1`
- Contract label: `local deterministic review briefing board`
- Readiness status: `ready_for_handoff` or `needs_follow_up`
- Grouped decision summaries:
  - ready decisions;
  - follow-up decisions;
  - deferred decisions.
- Evidence drilldown rows:
  - decision id and label;
  - evidence source and target anchor;
  - related playback frame id;
  - optional source path;
  - short local review note.
- Follow-up actions:
  - derived from local follow-up decisions;
  - linked to the evidence targets already present in the register.
- Local-only scope notes:
  - derived from the Stage 14 register;
  - explicit about deferred production handoff scope;
  - no editable reviewer workspace or persistent note system.

## Human-Testable Flow

1. Open the local mission console once frontend dependencies are available.
2. Inspect the Stage 14 review decision register.
3. Inspect the Stage 15 review briefing board.
4. Scan which decisions are ready, need follow-up, or stay deferred.
5. Drill into evidence rows and confirm each row stays tied to local playback,
   packet, export, or scope-boundary references.
6. Confirm the board stays local-only and does not introduce saved reviewer
   sessions, external ticketing, or production handoff services.

## Verification Commands

```text
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
- editable saved reviewer sessions or persistent notes;
- external ticketing, messaging, or email handoff;
- cloud-backed evidence archives;
- report designer or downloadable styled report system;
- deployment, release, or main-branch fast-forward.
