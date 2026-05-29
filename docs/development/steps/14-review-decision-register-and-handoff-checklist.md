# Stage 14: Review Decision Register And Handoff Checklist

## Goal

Turn the completed local incident packet, deterministic evidence export, and
Stage 13 replay playback timeline into a compact review decision register that
shows what a reviewer can approve, what still needs follow-up, and which local
evidence supports each decision.

Stage 13 proved that a reviewer can step through deterministic replay frames
and tie markers back to anomalies, runbook targets, packet readiness, and export
references. Stage 14 should make the review outcome explicit without adding
accounts, saved sessions, external ticketing, or production persistence.

## Decisions To Make

### Decision Shape

Option A: deterministic local decision register

- derives review decisions from existing replay playback frames, runbook state,
  incident packet readiness, and evidence export gaps;
- keeps every decision tied to local evidence references;
- is source-bearing, testable, and visible in the mission console without
  adding persistence or identity.

Option B: editable reviewer notes

- is useful later, but introduces state ownership, saved session behavior,
  validation rules, and user expectations before the derived decision contract
  exists.

Option C: production handoff or ticketing workflow

- belongs after identity, retention, deployment, integration, and operational
  ownership are approved as a separate risk profile.

Recommended: start with Option A. Keep editable notes, saved review sessions,
and external ticketing for later stages.

### Handoff Boundary

Option A: local handoff checklist

- summarizes whether the incident packet is review-ready;
- maps each decision to playback frame, anomaly, runbook, packet, or export
  evidence;
- records explicit local-only and deferred-production notes.

Option B: downloadable review report

- overlaps with Stage 12 export and would risk becoming a report-builder stage
  unless a narrower decision register exists first.

Recommended: Option A. Stage 14 should prove the review decision boundary, not a
report authoring system.

## Work Items

- add a deterministic local review decision register helper over the existing
  mission-console view state;
- include decision id, status, label, supporting evidence references, related
  playback frame id, follow-up reason, and handoff scope notes;
- surface a compact review decision panel in the mission console near the Stage
  13 playback and Stage 12 incident packet sections;
- keep fixture mode deterministic and explicit local-live behavior opt-in;
- preserve Stage 13 playback, Stage 12 packet/export, Stage 11 runbook, Stage 10
  alert lifecycle, and Stage 09 live-console stream binding behavior;
- write focused frontend tests for decision-register construction and mission
  console view state;
- add a public-safe Stage 14 artifact under
  `docs/development/artifacts/stage14-review-decision-register/` that records
  the decision-register boundary, source files, verification commands, and
  deferred features.

## Human Test Gate

A reviewer should be able to:

1. start the local mission console or run focused local tests;
2. inspect the Stage 13 playback timeline for the thermal-alert review flow;
3. inspect the Stage 14 review decision register;
4. confirm every decision links back to local evidence from playback, runbook,
   packet, or export state;
5. identify which items are ready for handoff and which remain local follow-up
   items;
6. read a short artifact explaining what is local-only and what remains
   deferred.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no editable saved reviewer sessions or persistent note storage;
- no external ticketing, messaging, email, or workflow integrations;
- no cloud services, telemetry upload, paid APIs, or browser-cookie import;
- no deploy/release/publish work;
- no production evidence archive or database migration;
- no broad frontend redesign, report designer, or free-form export builder;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused frontend model tests for deterministic decision-register output;
- mission-console view tests that prove playback, packet/export, runbook, and
  decision evidence remain connected;
- existing Stage 13 playback tests and Stage 12 packet/export tests as
  regression checks;
- existing Stage 11, Stage 10, and Stage 09 checks when touched surfaces depend
  on them;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- editable state or persistence tests before the local decision contract exists;
- production integrations, ticketing, auth, or cloud-backed handoff primitives.

## Exit Criteria

- one deterministic local review decision register is source-backed and
  visible/testable;
- each decision ties to local evidence from playback frames, runbook state,
  packet readiness, export gaps, or incident history;
- the mission console exposes a compact handoff checklist for the existing
  thermal-alert review flow;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into editable saved notes, identity,
  collaboration, external ticketing, deploy/release, or production handoff
  integrations.
