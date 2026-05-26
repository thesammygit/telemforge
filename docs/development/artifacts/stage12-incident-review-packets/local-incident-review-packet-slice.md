# Stage 12 Local Incident Review Packet Slice

## Boundary

This slice adds the first deterministic local incident review packet for the
thermal alert response runbook. The packet derives from existing local sources:
runbook definition, alert lifecycle state, operator action events, replay
markers, and anomaly summary data.

The slice is fixture-first and local-live compatible through explicit existing
API boundaries. It does not add authentication, user identity, cloud services,
telemetry uploads, browser cookies, paid APIs, deployment behavior, persistent
packet storage, database migrations, or a report designer.

## Source Files

- `backend/app/domain/incident_review_packets.py`
- `backend/app/domain/replay.py`
- `backend/app/main.py`
- `frontend/src/lib/incidentReviewPackets.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/styles/global.css`

## Human-Testable Flow

1. Open the local mission console once frontend dependencies are installed.
2. Use the thermal alert response runbook to acknowledge and resolve the active
   thermal alert.
3. Inspect the Stage 12 incident packet section.
4. Confirm it shows packet readiness, alert state, completed runbook steps,
   operator actions, related event count, replay marker count, and unresolved
   evidence gaps.
5. Use the existing event timeline and replay sections to inspect the source
   evidence behind the packet summary.

## API Contract

- `GET /sessions/{session_id}/incident-review-packets/thermal-alert-response-local`
  returns `telemforge.incident_review_packet.v1`.
- The route derives the replay window from runbook-related local event history
  unless `start_at` and `end_at` are supplied explicitly.
- The packet accepts generated local-live alert and fault IDs by relating
  evidence through the runbook target channel when fixture IDs do not match a
  persisted test session.

## Verification Commands

```text
python3 -m unittest discover -s tests/backend -p 'test_stage12_incident_review_packets.py'
python3 -m unittest discover -s tests/backend -p 'test_stage11_scenario_runbooks.py'
python3 -m unittest discover -s tests/backend -p 'test_stage10_alert_acknowledgement.py'
python3 -m unittest discover -s tests/backend -p 'test_stage10_alert_resolution.py'
node --experimental-strip-types --test tests/frontend/incidentReviewPackets.test.ts
node --experimental-strip-types --test tests/frontend/scenarioRunbooks.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
node --experimental-strip-types --test tests/frontend/stage09LiveConsoleAdapter.test.ts
python3 scripts/public_repo_guard.py --scan-history
```

## Deferred

- production authentication and collaboration identity;
- cloud-backed incident packet persistence;
- downloadable report export and full report authoring;
- production evidence archive and retention policy;
- deployment, release, or main-branch fast-forward.
