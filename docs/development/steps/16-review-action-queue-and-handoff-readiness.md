# Stage 16: Review Action Queue And Handoff Readiness

## Goal

Turn the Stage 15 review briefing board into a compact local action queue and
handoff readiness surface so a reviewer can see which local review actions are
blocking handoff, which evidence supports each action, and what remains
intentionally deferred before any production workflow is considered.

Stage 15 made the decision register consumable as a briefing board. Stage 16
should make that briefing actionable without adding saved reviewer sessions,
persistent notes, ticketing, messaging, identity, report authoring, or production
handoff services.

## Decisions To Make

### Action Queue Shape

Option A: deterministic local action queue

- derives action items from the Stage 15 briefing board follow-up actions,
  evidence drilldown rows, readiness status, and local-only scope notes;
- assigns local priority, blocking reason, evidence targets, and completion
  guidance without editable state or persistence;
- adds a source-backed view model and compact mission-console surface;
- remains deterministic in fixture mode and local-live compatible through the
  existing mission-console state.

Option B: editable reviewer task list

- is useful later, but introduces saved action ownership, note persistence,
  validation, and conflict semantics before the derived action model is proven.

Option C: external handoff workflow

- requires identity, retention, ticketing or messaging integration, and deploy
  decisions that need a separately approved risk profile.

Recommended: start with Option A. Keep editable task lists and external handoff
integrations for later stages.

### Handoff Readiness Boundary

Option A: derived readiness gate

- summarizes whether the local briefing board is ready, blocked by follow-up
  evidence, or blocked only by deferred production scope;
- lists blocking actions and their local evidence targets;
- keeps production handoff scope explicit as a non-blocking deferred category
  unless local evidence is missing.

Option B: full signoff workflow

- risks implying reviewer identity, audit retention, and saved state before the
  local readiness contract exists.

Recommended: Option A. Stage 16 should prove local actionability and readiness,
not production signoff.

## Work Items

- add a deterministic local review action queue helper over
  `ReviewBriefingBoardView`;
- define compact Stage 16 types that include schema/version, local contract
  label, readiness verdict, action priority, blocker category, evidence targets,
  next local step, deferred scope notes, and human test gate summary;
- wire the action queue into the mission-console view model;
- surface a compact action queue and handoff readiness panel in the mission
  console near the Stage 15 briefing board;
- keep fixture mode deterministic and explicit local-live behavior opt-in;
- preserve Stage 15 briefing board behavior, Stage 14 decision register
  behavior, Stage 13 playback behavior, Stage 12 packet/export behavior, Stage
  11 runbook behavior, Stage 10 alert lifecycle behavior, and Stage 09
  live-console stream binding behavior;
- write focused frontend tests for action-queue construction and mission-console
  view state;
- add a public-safe Stage 16 artifact under
  `docs/development/artifacts/stage16-review-action-queue/` that records the
  action-queue boundary, source files, verification commands, and deferred
  production features.

## Human Test Gate

A reviewer should be able to:

1. start the local mission console or run focused local tests;
2. inspect the Stage 15 briefing board;
3. inspect the Stage 16 review action queue;
4. see whether local handoff readiness is ready, blocked by local follow-up, or
   only constrained by deferred production scope;
5. follow each action to its evidence targets and next local step;
6. confirm no saved reviewer sessions, persistent notes, external ticketing, or
   production handoff services were introduced.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no editable saved reviewer sessions, persistent notes, local note storage, or
  saved action ownership;
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

- focused frontend model tests for deterministic action-queue output;
- mission-console view tests proving the action queue is connected to briefing,
  decision, playback, runbook, packet, and export evidence;
- existing Stage 15, Stage 14, Stage 13, Stage 12, Stage 11, Stage 10, and Stage
  09 checks as regression coverage for touched surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- editable state or persistence tests before the local action contract exists;
- external workflow integrations, ticketing, auth, or cloud-backed handoff
  primitives.

## Exit Criteria

- one deterministic local review action queue is source-backed and
  visible/testable;
- the action queue derives blocking and non-blocking actions from the Stage 15
  briefing board;
- each action includes priority, blocker category, evidence targets, and next
  local step;
- the handoff readiness panel distinguishes local follow-up blockers from
  deferred production scope;
- the mission console exposes the queue without a broad redesign;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into editable reviewer workspaces,
  saved sessions, identity, collaboration, external ticketing, deploy/release,
  production persistence, or report authoring.
