# Stage 11 Local Thermal Alert Runbook Slice

## Boundary

This slice adds the first deterministic local scenario runbook for the existing
thermal alert operator lifecycle. It is fixture-first and local-live compatible
through the API boundaries that already existed before Stage 11.

No authentication, cloud persistence, collaboration identity, external network
calls, deploy behavior, report export, or dependency installation was added.

## Source Files

- `backend/app/domain/scenario_runbooks.py`
- `backend/app/main.py`
- `frontend/src/lib/scenarioRunbooks.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/App.tsx`
- `frontend/src/styles/global.css`

## Human-Testable Flow

1. Open the local mission console once frontend dependencies are installed.
2. Select `Thermal Alert Response` in the Stage 11 guided playback section.
3. Confirm the runbook starts on `Acknowledge alert` for the active thermal
   alert.
4. Acknowledge the alert and confirm the current step advances to
   `Resolve alert`.
5. Resolve the alert and confirm event-history and replay-evidence steps are
   complete.
6. Use the evidence links to inspect alert lifecycle, event history, and replay
   markers.

## API Contract

- `GET /runbooks` returns the public-safe local runbook catalog.
- `GET /runbooks/thermal-alert-response-local` returns the full deterministic
  guided playback definition.
- The runbook targets `alert-stage06-thermal-avionics`,
  `thermal.avionics_temp`, and `fault-stage06-thermal-avionics`.

## Verification Commands

```text
python3 -m unittest discover -s tests/backend -p 'test_stage11_scenario_runbooks.py'
python3 -m unittest discover -s tests/backend -p 'test_stage10_alert_acknowledgement.py'
python3 -m unittest discover -s tests/backend -p 'test_stage10_alert_resolution.py'
python3 -m unittest discover -s tests/backend -p 'test_stage06_api.py'
node --experimental-strip-types --test tests/frontend/scenarioRunbooks.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
node --experimental-strip-types --test tests/frontend/stage09LiveConsoleAdapter.test.ts
python3 scripts/public_repo_guard.py --scan-history
```

## Deferred

- production authentication and multi-operator identity;
- cloud-backed runbook persistence;
- free-form runbook authoring;
- incident report export;
- broad mission-console redesign;
- deploy, release, or production runtime behavior.
