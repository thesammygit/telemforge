# Stage 10 Alert Acknowledgement Slice

## What Changed

- Added a local alert acknowledgement route in [`backend/app/main.py`](../../../../backend/app/main.py) and [`backend/app/storage/sqlite_store.py`](../../../../backend/app/storage/sqlite_store.py).
- Exposed the operator action in [`frontend/src/features/mission-console/MissionConsole.tsx`](../../../../frontend/src/features/mission-console/MissionConsole.tsx) and [`frontend/src/App.tsx`](../../../../frontend/src/App.tsx).
- Preserved acknowledged alerts through live websocket refreshes in [`frontend/src/lib/stage09LiveConsoleAdapter.ts`](../../../../frontend/src/lib/stage09LiveConsoleAdapter.ts).
- Added a pure fixture mutation helper in [`frontend/src/lib/operatorWorkflow.ts`](../../../../frontend/src/lib/operatorWorkflow.ts).

## Human-Testable Flow

1. Open the mission console with the local backend running.
2. Trigger or load a Stage 06/07 alert.
3. Click `Acknowledge` on the active alert row.
4. Confirm the alert moves into the acknowledged section.
5. Confirm the event timeline gains an `alert.acknowledged` entry.
6. Confirm the replay overlay gains an `alert.acknowledged` marker when replay is present.

## Focused Verification

```text
python3 -m unittest tests/backend/test_stage10_alert_acknowledgement.py
python3 -m unittest tests/backend/test_stage06_api.py
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
node --experimental-strip-types --test tests/frontend/stage09LiveConsoleAdapter.test.ts
```

## Deferred

- production auth and multi-operator collaboration;
- cloud-backed incident persistence;
- alert resolution workflow beyond local acknowledgement;
- broad UI redesign.
