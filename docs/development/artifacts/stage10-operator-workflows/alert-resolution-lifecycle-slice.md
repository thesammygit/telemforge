# Stage 10 Alert Resolution Lifecycle Slice

## What Changed

- Added a local alert resolution route in [`backend/app/main.py`](../../../../backend/app/main.py) and [`backend/app/storage/sqlite_store.py`](../../../../backend/app/storage/sqlite_store.py).
- Kept the first resolution boundary local and explicit: alerts transition from `acknowledged` to `resolved`; active alerts must be acknowledged first.
- Exposed `Resolve` in the mission console through [`frontend/src/features/mission-console/MissionConsole.tsx`](../../../../frontend/src/features/mission-console/MissionConsole.tsx) and [`frontend/src/App.tsx`](../../../../frontend/src/App.tsx).
- Added fixture and local-live helpers in [`frontend/src/lib/operatorWorkflow.ts`](../../../../frontend/src/lib/operatorWorkflow.ts), [`frontend/src/lib/missionConsoleApi.ts`](../../../../frontend/src/lib/missionConsoleApi.ts), and [`frontend/src/lib/stage09LiveConsoleAdapter.ts`](../../../../frontend/src/lib/stage09LiveConsoleAdapter.ts).
- Preserved resolved alerts through Stage 09 live stream refreshes by retaining non-active local alert states when snapshots only report active alerts.

## Human-Testable Flow

1. Open the mission console with fixture mode or an explicit local live session.
2. Click `Acknowledge` on an active alert.
3. Confirm the alert moves into the acknowledged section.
4. Click `Resolve` on that acknowledged alert.
5. Confirm the alert moves into the resolved section.
6. Confirm the event timeline gains an `alert.resolved` entry.
7. Confirm replay markers include an `alert.resolved` marker when replay data is present.

## Local Boundary

- The route is `POST /sessions/{session_id}/alerts/{alert_id}/resolve`.
- Request fields are `resolved_at`, `resolved_by`, and `resolution_note`.
- Resolution is stored in the existing SQLite alert metadata and event log.
- Active alerts return `409` from the resolution route until they are acknowledged.
- No production auth, cloud persistence, collaboration identity, or external services were added.

## Focused Verification

```text
python3 -m unittest discover -s tests/backend -p 'test_stage10_alert_acknowledgement.py'
python3 -m unittest discover -s tests/backend -p 'test_stage10_alert_resolution.py'
python3 -m unittest discover -s tests/backend -p 'test_stage06_api.py'
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
node --experimental-strip-types --test tests/frontend/stage09LiveConsoleAdapter.test.ts
python3 scripts/public_repo_guard.py --scan-history
```

## Deferred

- production authentication and multi-operator identity;
- cloud-backed incident persistence;
- incident assignment, escalation, and collaboration history;
- broad mission-console redesign;
- deployment, release, or production runtime behavior.
