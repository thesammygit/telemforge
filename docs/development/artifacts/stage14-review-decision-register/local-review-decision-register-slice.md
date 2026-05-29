# Stage 14 Local Review Decision Register Slice

## Boundary

This slice adds a deterministic local review decision register for the existing
thermal-alert review flow. The register derives review decisions from Stage 13
replay playback frames, Stage 11 runbook state, Stage 12 incident packet
readiness, and the deterministic local evidence export payload.

The slice is fixture-first and local-live compatible through the existing
mission-console state. It does not add authentication, cloud services,
telemetry uploads, deployment behavior, saved reviewer sessions, persistent
notes, external ticketing, report design, production evidence archives, or
database migrations.

## Source Files

- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/lib/reviewDecisionRegister.ts`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewDecisionRegister.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Decision Register Contract

- Schema: `telemforge.review_decision_register.v1`
- Version: `1`
- Contract label: `local deterministic review decision register`
- Decision source: existing local replay playback, runbook, packet, and export
  views
- Decision fields:
  - decision id;
  - status: `ready`, `follow_up`, or `deferred`;
  - label and summary;
  - supporting evidence references;
  - related playback frame id;
  - follow-up reason;
  - local-only scope notes.
- Handoff checklist:
  - runbook playback;
  - incident packet;
  - evidence export;
  - deferred production integrations.

## Human-Testable Flow

1. Open the local mission console once frontend dependencies are installed.
2. Inspect the Stage 12 incident packet and Stage 13 replay playback strip.
3. Inspect the Stage 14 decision register near those review sections.
4. Confirm at least one decision is ready, local follow-up items show the
   unresolved evidence reason, and production handoff integrations remain
   deferred.
5. Acknowledge and resolve the local thermal alert, then confirm the lifecycle
   and export decisions become ready while production integrations stay
   deferred.

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/reviewDecisionRegister.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
node --experimental-strip-types --test tests/frontend/incidentReviewPackets.test.ts
node --experimental-strip-types --test tests/frontend/scenarioRunbooks.test.ts
node --experimental-strip-types --test tests/frontend/stage09LiveConsoleAdapter.test.ts
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
- editable saved reviewer sessions or persistent notes;
- external ticketing, messaging, or email handoff;
- cloud-backed evidence archives;
- report designer or downloadable styled report system;
- deployment, release, or main-branch fast-forward.
