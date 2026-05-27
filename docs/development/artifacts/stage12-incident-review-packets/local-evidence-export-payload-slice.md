# Stage 12 Local Evidence Export Payload Slice

## Boundary

This slice adds a deterministic local evidence export payload for the existing
thermal alert incident review packet. The export derives from packet state that
already exists in local fixture and local-live flows: packet readiness, alert
lifecycle, operator actions, event history, replay evidence, source references,
deferred features, and unresolved gaps.

The export is a review boundary, not a report designer. The backend API returns
the payload directly and does not write files. The frontend builds the matching
fixture payload and surfaces a compact mission-console summary so a reviewer can
inspect the export identity, schema, action count, source count, and deferred
feature count.

## Source Files

- `backend/app/domain/incident_review_packets.py`
- `backend/app/main.py`
- `frontend/src/lib/incidentReviewPackets.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/styles/global.css`
- `tests/backend/test_stage12_incident_review_exports.py`
- `tests/backend/test_stage12_incident_review_packets.py`
- `tests/frontend/incidentReviewPackets.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## API Contract

- `GET /sessions/{session_id}/incident-review-packets/{runbook_id}/export`
  returns `telemforge.incident_review_export.v1`.
- The route reuses the existing packet replay-window derivation unless
  `start_at` and `end_at` are supplied explicitly.
- The export payload includes:
  - schema and version;
  - packet identity;
  - packet readiness;
  - alert lifecycle;
  - operator action summary and action rows;
  - event history summary and source events;
  - replay evidence summary;
  - source references;
  - deferred features;
  - unresolved evidence gaps;
  - local-only scope notes.

## Human-Testable Flow

1. Start or inspect the local mission console once frontend dependencies are
   available.
2. Complete the thermal alert response runbook by acknowledging and resolving
   the active local alert.
3. Inspect the Stage 12 incident packet section.
4. Confirm the local evidence export summary shows a stable export id, schema,
   completed action count, source count, and deferred feature count.
5. Call the backend export route in local-live mode to inspect the full JSON
   payload.

## Verification Commands

```text
python3 -m unittest discover -s tests/backend -p 'test_stage12_incident_review_packets.py'
python3 -m unittest discover -s tests/backend -p 'test_stage12_incident_review_exports.py'
python3 -m unittest discover -s tests/backend -p 'test_stage11_scenario_runbooks.py'
python3 -m unittest discover -s tests/backend -p 'test_stage10_alert_acknowledgement.py'
python3 -m unittest discover -s tests/backend -p 'test_stage10_alert_resolution.py'
python3 -m unittest discover -s tests/backend -p 'test_stage07_api.py'
node --experimental-strip-types --test tests/frontend/incidentReviewPackets.test.ts
node --experimental-strip-types --test tests/frontend/scenarioRunbooks.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
node --experimental-strip-types --test tests/frontend/stage09LiveConsoleAdapter.test.ts
python3 scripts/public_repo_guard.py --scan-history
```

## Deferred

- production authentication and collaboration identity;
- cloud-backed incident packet persistence;
- downloadable styled reports and full report authoring;
- production evidence archive and retention policy;
- deployment, release, or main-branch fast-forward.
