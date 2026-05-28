# Stage 13: Replay Playback And Review Timeline

## Goal

Turn the static replay, runbook, and incident-review evidence into a local
timeline playback experience that a reviewer can step through without manually
matching timestamps across separate panels.

Stage 12 proved that a completed thermal-alert response can be packaged as a
local incident review packet and deterministic evidence export. Stage 13 should
make that evidence easier to inspect by adding a bounded playback model over the
existing replay window, event markers, anomalies, operator actions, and packet
references.

## Decisions To Make

### Playback Shape

Option A: deterministic playback frame model

- derives frames from the existing local replay payload;
- supports step-through review, selected timestamp, current marker, and related
  evidence summaries;
- keeps the first slice source-bearing and testable without timers, workers, or
  a new storage model.

Option B: animated replay player

- is visually useful later, but introduces timer behavior, state ownership,
  accessibility controls, and richer UI review before the deterministic frame
  contract exists.

Option C: production session playback service

- belongs after identity, retention, deployment, and runtime ownership are
  approved as a separate risk profile.

Recommended: start with Option A. Keep animation polish and production playback
services as later stages.

### Review Boundary

Option A: local fixture/local-live timeline

- uses existing replay markers, event history, anomaly rows, runbook steps, and
  incident packet/export source references;
- remains deterministic in fixture tests;
- can be shown compactly in the mission console without a broad redesign.

Option B: saved reviewer sessions

- requires persistence and possibly identity decisions, so it should not be the
  first Stage 13 slice.

Recommended: Option A. Stage 13 should prove a replay review timeline, not
saved collaborative review state.

## Work Items

- add a deterministic replay playback frame helper for the existing replay
  payload;
- include selected timestamp, frame index, marker context, anomaly context,
  related runbook/evidence targets, and review status in the frame model;
- surface a compact playback strip in the mission console near the existing
  replay and incident packet sections;
- keep fixture mode deterministic and explicit local-live behavior opt-in;
- preserve Stage 12 incident packet/export behavior, Stage 11 runbook playback,
  Stage 10 alert lifecycle, and Stage 09 live-console stream binding;
- write focused frontend tests for frame construction and mission-console view
  state, plus backend regression tests only if the replay API boundary changes;
- add a public-safe Stage 13 artifact under
  `docs/development/artifacts/stage13-replay-playback/` that records the
  playback boundary, source files, verification commands, and deferred features.

## Human Test Gate

A reviewer should be able to:

1. start the local mission console or run focused local tests;
2. inspect the thermal-alert response incident packet;
3. use the replay playback strip to step through deterministic timeline frames;
4. confirm the active frame ties together event marker, anomaly, runbook step,
   and packet/export evidence;
5. read a short artifact explaining what is local-only and what remains
   deferred.

## Non-Goals

- no production authentication, accounts, or multi-operator collaboration;
- no cloud services, telemetry upload, paid APIs, or browser-cookie import;
- no deploy/release/publish work;
- no production replay service, saved playback sessions, or database migration;
- no broad frontend redesign or full animation engine in the first slice;
- no full report builder or free-form export designer;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused frontend model tests for deterministic playback frames and selected
  timeline state;
- mission-console view tests that prove packet/export/runbook evidence is still
  available while playback state is added;
- existing Stage 12 packet/export tests as regression checks;
- existing Stage 11, Stage 10, and Stage 09 checks when touched surfaces depend
  on them;
- public-repo guard before any push.

Avoid:

- broad browser animation tests before the frame model exists;
- dependency installation solely for playback controls or timeline styling;
- production persistence, identity, or cloud-backed playback primitives.

## Exit Criteria

- one deterministic replay playback frame model is source-backed and
  visible/testable;
- the mission console exposes a compact local playback state for the existing
  thermal-alert replay window;
- playback frames tie current markers/anomalies to runbook and incident-packet
  evidence without duplicating packet/export logic;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved reviewer sessions,
  collaboration, auth, production replay services, deploy/release, or full
  animation authoring.
