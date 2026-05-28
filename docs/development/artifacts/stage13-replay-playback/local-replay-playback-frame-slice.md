# Stage 13 Local Replay Playback Frame Slice

## Boundary

This slice adds a deterministic local playback frame model for the existing
thermal-alert replay window. The model derives frames from the local replay
markers and ties the selected frame back to anomaly context, the guided runbook
step/evidence target, the incident review packet, and the deterministic evidence
export payload.

The slice is fixture-first and local-live compatible through the existing
mission-console state. It does not add authentication, cloud services,
telemetry uploads, deployment behavior, persistent playback storage, saved
reviewer sessions, database migrations, background workers, or an animation
engine.

## Source Files

- `frontend/src/App.tsx`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/styles/global.css`
- `tests/frontend/consoleViewModel.test.ts`

## Local Playback Contract

- Schema: `telemforge.replay_playback.v1`
- Version: `1`
- Contract label: `local deterministic replay playback`
- Frame source: sorted `telemforge.replay_window.v1` markers
- Selected frame state: in-memory mission-console frame id
- Current frame context:
  - selected timestamp;
  - one-based frame index and total frame count;
  - active marker id/type/message/severity;
  - related anomaly channel, score, observed value, and reason;
  - runbook step and evidence target;
  - incident packet readiness and marker reference count;
  - deterministic evidence export id/schema when available.

## Human-Testable Flow

1. Open the local mission console once frontend dependencies are installed.
2. Inspect the Stage 11 guided runbook and Stage 12 packet/export sections.
3. Use the Stage 13 local replay timeline strip to select replay frames.
4. Confirm the selected frame updates marker, anomaly, runbook target, packet,
   and export context without leaving fixture/local-live mode.

## Verification Commands

```text
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
- saved reviewer sessions or persistent playback state;
- production replay services and background playback workers;
- animated timeline authoring or full playback controls;
- cloud-backed evidence archives;
- deployment, release, or main-branch fast-forward.
