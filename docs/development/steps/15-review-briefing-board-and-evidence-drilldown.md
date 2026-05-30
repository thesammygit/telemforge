# Stage 15: Review Briefing Board And Evidence Drilldown

## Goal

Turn the Stage 14 review decision register into a compact local review briefing
board that helps a reviewer scan ready, follow-up, and deferred decisions,
drill into the evidence behind each one, and understand whether the current
thermal-alert review flow is ready for a human handoff.

Stage 14 made individual review decisions explicit. Stage 15 should make those
decisions easier to consume as a briefing surface without adding saved reviewer
sessions, persistent notes, report design, external ticketing, identity, or
production handoff services.

## Decisions To Make

### Briefing Shape

Option A: deterministic local briefing board

- derives grouped briefing sections from the existing review decision register;
- keeps evidence drilldown rows tied to playback frames, runbook targets,
  incident packets, evidence export refs, and scope boundaries;
- adds a source-backed view model and compact mission-console surface;
- remains deterministic in fixture mode and local-live compatible through the
  existing mission-console state.

Option B: editable reviewer workspace

- is useful later, but introduces local note ownership, saved session semantics,
  validation, and expectations for persistence before a derived briefing model
  exists.

Option C: production handoff service

- requires auth, retention, ownership, external ticketing or messaging, and
  deployment decisions that belong in a separately approved risk profile.

Recommended: start with Option A. Keep editable reviewer workspaces, saved
sessions, and production handoff integrations for later stages.

### Evidence Drilldown Boundary

Option A: derived evidence drilldown rows

- lists each decision's supporting evidence with source type, target anchor,
  related playback frame id, optional source path, and a short review note;
- groups rows by decision status so follow-up evidence is visible without
  opening a report builder.

Option B: free-form evidence annotations

- risks becoming saved notes and persistence work before the deterministic
  briefing board is proven.

Recommended: Option A. Stage 15 should prove review briefing consumption, not a
note-taking system.

## Work Items

- add a deterministic local review briefing board helper over
  `ReviewDecisionRegisterView`;
- define compact Stage 15 types that include schema/version, local contract
  label, readiness status, grouped decision summaries, evidence drilldown rows,
  follow-up actions, and local-only scope notes;
- surface a compact briefing board in the mission console near the Stage 14
  decision register;
- keep fixture mode deterministic and explicit local-live behavior opt-in;
- preserve Stage 14 decision register behavior, Stage 13 playback behavior,
  Stage 12 packet/export behavior, Stage 11 runbook behavior, Stage 10 alert
  lifecycle behavior, and Stage 09 live-console stream binding behavior;
- write focused frontend tests for briefing-board construction and mission
  console view state;
- add a public-safe Stage 15 artifact under
  `docs/development/artifacts/stage15-review-briefing-board/` that records the
  briefing-board boundary, source files, verification commands, and deferred
  features.

## Human Test Gate

A reviewer should be able to:

1. start the local mission console or run focused local tests;
2. inspect the Stage 14 decision register;
3. inspect the Stage 15 review briefing board;
4. scan which decision groups are ready, need follow-up, or are deferred;
5. drill into evidence rows and see the local source for each decision;
6. identify what remains local-only and which production handoff features are
   intentionally deferred.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no editable saved reviewer sessions, persistent notes, or local note storage;
- no external ticketing, messaging, email, or workflow integrations;
- no cloud services, telemetry upload, paid APIs, or browser-cookie import;
- no deploy/release/publish work;
- no production evidence archive or database migration;
- no report designer, downloadable styled report system, or free-form export
  builder;
- no broad frontend redesign or new routing shell;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused frontend model tests for deterministic briefing-board output;
- mission-console view tests proving the board is connected to decision,
  playback, runbook, packet, and export evidence;
- existing Stage 14, Stage 13, Stage 12, Stage 11, Stage 10, and Stage 09
  checks as regression coverage for touched surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- editable state or persistence tests before the local briefing contract exists;
- production integrations, ticketing, auth, or cloud-backed handoff primitives.

## Exit Criteria

- one deterministic local review briefing board is source-backed and
  visible/testable;
- grouped briefing sections summarize ready, follow-up, and deferred review
  decisions from the Stage 14 register;
- evidence drilldown rows connect decisions to playback frames, runbook
  targets, incident packet readiness, evidence exports, or explicit scope
  boundaries;
- the mission console exposes a compact briefing board without a broad redesign;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into editable reviewer workspaces,
  saved sessions, identity, collaboration, external ticketing, deploy/release,
  production persistence, or report authoring.
