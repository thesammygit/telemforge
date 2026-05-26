# Stage 12: Incident Review Packets And Evidence Export

## Goal

Turn completed guided scenario playback into a local, reviewable incident packet
that explains what happened, which operator actions were taken, and which
timeline/replay evidence proves the incident lifecycle.

Stage 11 proved a reviewer can step through the thermal-alert response runbook
inside the mission console. Stage 12 should package the completed runbook state
into a public-safe local evidence packet so the workflow can be reviewed without
manually stitching together API responses, event logs, replay markers, and
verification notes.

## Decisions To Make

### Packet Shape

Option A: local incident review packet

- derives a deterministic packet from existing fixture/API-backed runbook state;
- can be shown in the mission console and returned by a local API boundary;
- keeps the first slice source-bearing without introducing storage, auth, or
  external services.

Option B: downloadable report export

- is useful later, but introduces format, lifecycle, storage, and provenance
  decisions before the local packet contract exists.

Option C: collaborative incident review

- belongs after identity, permissions, and multi-operator state have their own
  stage.

Recommended: start with Option A. Keep downloadable reports, collaboration, and
production persistence as separate future stages.

### Evidence Boundary

Option A: fixture/local-live evidence summary

- summarizes alert lifecycle, runbook step status, event history, replay
  markers, and source artifact links already available in the local app;
- is safe for a public repo and deterministic tests;
- avoids credentials, uploaded telemetry, cookies, cloud storage, and external
  network calls.

Option B: production evidence archive

- requires deployment, retention, identity, and data-governance decisions that
  are out of scope for the current local product lane.

Recommended: Option A. Stage 12 should prove the review packet interaction, not
production incident management.

## Work Items

- add a local incident review packet domain helper or API route for the thermal
  alert response runbook;
- derive packet readiness, lifecycle status, event counts, replay marker counts,
  and unresolved evidence gaps from the existing Stage 11 runbook playback;
- show the packet in the mission console without a broad redesign;
- keep fixture mode deterministic and explicit local-live behavior opt-in;
- preserve Stage 10 acknowledgement/resolution behavior and Stage 09 live
  stream behavior;
- write focused backend/frontend tests for packet construction and view-model
  state;
- add a public-safe Stage 12 artifact under
  `docs/development/artifacts/stage12-incident-review-packets/` that records the
  packet boundary, source files, verification commands, and deferred production
  features.

## Human Test Gate

A reviewer should be able to:

1. start the local mission console or run focused local tests;
2. complete the thermal-alert response runbook;
3. inspect a local incident review packet for the completed scenario;
4. confirm the packet summarizes alert state, operator actions, event history,
   replay evidence, and any remaining gaps;
5. read a short artifact explaining what is local-only and what remains
   deferred.

## Non-Goals

- no production authentication, accounts, or multi-operator collaboration;
- no cloud services, telemetry upload, paid APIs, or browser-cookie import;
- no deploy/release/publish work;
- no production evidence retention or database migration;
- no full report builder or free-form export designer;
- no broad frontend redesign;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused backend tests for packet domain/API behavior if a backend boundary is
  added;
- focused frontend model tests for packet readiness and evidence summaries;
- existing Stage 11 runbook tests as regression checks;
- existing Stage 10 acknowledgement/resolution tests as regression checks;
- existing Stage 09 live-console adapter tests when packet state touches stream
  merge behavior;
- public-repo guard before any push.

Avoid:

- dependency installation solely for export styling;
- broad snapshot tests that do not explain packet semantics;
- production persistence, identity, or cloud-backed archive primitives before
  the local packet contract exists.

## Exit Criteria

- one local incident review packet is source-backed and visible/testable;
- the packet summarizes a completed guided thermal-alert runbook with lifecycle,
  event-history, and replay evidence status;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into collaboration, auth, production
  retention, deploy/release, or full report authoring.
