# Stage 18: Local Review Handoff Rehearsal And Readiness Script

## Goal

Turn the Stage 17 action-evidence walkthrough into a deterministic local review
handoff rehearsal that a reviewer can run through before any production
handoff, saved session, signoff workflow, ticketing integration, report
authoring, or deployment work exists.

Stage 17 made each action inspectable. Stage 18 should order those actions into
one read-only local rehearsal script with readiness checkpoints, unresolved
local blockers, reviewer prompts, and deferred production boundaries. It should
make the next human review pass easier without creating persistence, reviewer
identity, ownership, audit retention, or external workflow semantics.

## Decisions To Make

### Rehearsal Shape

Option A: deterministic local handoff rehearsal

- derives a read-only rehearsal sequence from the Stage 16 action queue and
  Stage 17 action-evidence walkthrough rows;
- gives each step an action id, evidence checkpoint summary, local reviewer
  prompt, expected outcome, unresolved blocker status, and next local step;
- keeps the rehearsal fully deterministic in fixture mode and does not persist
  reviewer progress, notes, approvals, or ownership.

Option B: saved reviewer checklist

- is useful later, but introduces saved state, reviewer identity, completion
  semantics, conflict handling, ownership, and audit retention before the local
  rehearsal contract is proven.

Option C: handoff report/export authoring

- risks becoming a downloadable report system or production handoff package
  before reviewers have validated the ordered local rehearsal.

Recommended: start with Option A. Keep saved progress, signoff, exports, and
production handoff packages for later stages with explicit risk boundaries.

### Readiness Boundary

Option A: local-only readiness script

- marks local follow-up blockers as rehearsal blockers;
- marks deferred production scope as visible but non-blocking;
- makes missing evidence targets explicit as local gaps;
- shows which source-backed local surfaces a reviewer should inspect next.

Option B: production readiness verdict

- would imply operational approval and audit semantics that TelemForge has not
  implemented yet.

Recommended: Option A. Stage 18 should prove the local rehearsal surface, not a
production handoff approval model.

## Work Items

- add a deterministic local handoff rehearsal helper, preferably
  `frontend/src/lib/reviewHandoffRehearsal.ts`, over the Stage 16 action queue
  and Stage 17 action-evidence walkthrough;
- define compact Stage 18 types in
  `frontend/src/features/mission-console/types.ts` for rehearsal schema,
  ordered rehearsal steps, readiness summary, reviewer prompts, unresolved local
  blockers, and deferred production notes;
- wire the rehearsal into
  `frontend/src/features/mission-console/consoleViewModel.ts` without changing
  fixture/local-live boundaries;
- surface a compact Stage 18 rehearsal panel in
  `frontend/src/features/mission-console/MissionConsole.tsx`, near the Stage 17
  walkthrough, with ordered steps, checkpoint counts, local prompts, blocker
  status, and deferred production boundary notes;
- update `frontend/src/styles/global.css` only as needed for the compact panel;
- add focused frontend tests in a new
  `tests/frontend/reviewHandoffRehearsal.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` for the new view-model shape;
- keep existing Stage 17, Stage 16, Stage 15, Stage 14, Stage 13, Stage 12,
  Stage 11, Stage 10, and Stage 09 behavior covered by focused regression
  tests;
- add a public-safe Stage 18 artifact under
  `docs/development/artifacts/stage18-local-review-handoff-rehearsal/`
  describing the rehearsal boundary, source files, verification commands, and
  deferred production features.

## Human Test Gate

A reviewer should be able to:

1. start the local mission console or run focused local tests;
2. inspect the Stage 16 review action queue and Stage 17 action-evidence
   walkthrough;
3. read the Stage 18 local handoff rehearsal sequence in order;
4. confirm each rehearsal step shows the action id, evidence checkpoints,
   missing target status, local reviewer prompt, expected local outcome, and
   next local step;
5. verify local blockers remain explicit and deferred production scope remains
   visible but non-blocking;
6. complete the rehearsal mentally without saved reviewer sessions, persistent
   notes, action ownership, external ticketing, report exports, signoff, or
   production handoff services.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no editable saved reviewer sessions, persistent notes, local note storage, or
  saved action ownership;
- no reviewer signoff workflow, audit retention, approval identity, or
  production readiness certification;
- no external ticketing, messaging, email, or workflow integrations;
- no cloud services, telemetry upload, paid APIs, or browser-cookie import;
- no deploy/release/publish work;
- no production evidence archive or database migration;
- no report designer, downloadable styled report system, free-form export
  builder, report package writer, or production handoff package;
- no broad frontend redesign or new routing shell;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused frontend model tests for deterministic rehearsal construction;
- view-model tests proving the rehearsal is connected to the action queue and
  action-evidence walkthrough;
- mission-console coverage showing the rehearsal is visible without changing
  local-live behavior;
- existing Stage 17, Stage 16, Stage 15, Stage 14, Stage 13, Stage 12, Stage
  11, Stage 10, and Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- editable state or persistence tests before the local rehearsal contract
  exists;
- external workflow integrations, ticketing, auth, production signoff, report
  authoring, report exports, cloud-backed handoff primitives, or deploy work.

## Exit Criteria

- one deterministic local review handoff rehearsal is source-backed and
  visible/testable;
- the rehearsal sequence is derived from Stage 16 actions and Stage 17 evidence
  paths, not from ad hoc UI strings;
- each rehearsal step exposes action id, checkpoint counts, missing target
  status, reviewer prompt, expected local outcome, next local step, and source
  evidence references where available;
- local blockers remain explicit and deferred production scope remains visible
  but non-blocking;
- mission-console UI exposes the rehearsal without a broad redesign;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved reviewer progress,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, or report/export authoring.
