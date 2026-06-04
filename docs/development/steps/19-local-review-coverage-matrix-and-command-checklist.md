# Stage 19: Local Review Coverage Matrix And Command Checklist

## Goal

Turn the Stage 18 local review handoff rehearsal into a deterministic coverage
matrix and local verification command checklist that a reviewer can scan before
running the next local review pass.

Stage 18 ordered the action-evidence walkthrough into a read-only rehearsal.
Stage 19 should summarize that rehearsal across action, evidence, blocker, and
verification dimensions so a reviewer can see which local surfaces are covered,
which gaps remain explicit, and which local commands prove the review path. It
must stay local-only and deterministic, without saved sessions, persistence,
reviewer identity, signoff, ticketing, report exports, or production handoff
services.

## Decisions To Make

### Coverage Shape

Option A: deterministic local coverage matrix

- derives one row per Stage 18 rehearsal step;
- exposes action id, rehearsal step, readiness verdict, resolved/missing target
  counts, source coverage buckets, local blocker status, and source evidence
  references;
- keeps matrix rows computed from existing review models instead of free-form UI
  strings.

Option B: editable reviewer worksheet

- would be useful later, but introduces saved reviewer state, persistence,
  identity, conflict handling, ownership, and audit expectations before the
  local coverage contract is proven.

Option C: downloadable handoff report

- risks becoming report authoring or a handoff export package before the local
  coverage matrix is validated.

Recommended: start with Option A. Keep editable worksheets, saved review state,
and report/export systems for later stages with explicit risk boundaries.

### Command Checklist Boundary

Option A: local verification command checklist

- lists deterministic local commands that prove the Stage 19 matrix and touched
  review surfaces;
- marks commands as local, public-safe, and dependency-neutral;
- keeps commands as review prompts, not executable automation, production
  certification, or a deploy gate.

Option B: production readiness gate

- would imply signoff, audit retention, operational ownership, and production
  approval semantics that TelemForge has not implemented yet.

Recommended: Option A. Stage 19 should make local verification easier to run
and explain, not certify production readiness.

## Work Items

- add a deterministic local coverage helper, preferably
  `frontend/src/lib/reviewHandoffCoverageMatrix.ts`, over the Stage 18 handoff
  rehearsal;
- define compact Stage 19 types in
  `frontend/src/features/mission-console/types.ts` for coverage matrix schema,
  coverage rows, local verification commands, blocker summaries, source
  coverage buckets, and deferred production notes;
- wire the coverage matrix into
  `frontend/src/features/mission-console/consoleViewModel.ts` without changing
  fixture/local-live boundaries;
- surface a compact Stage 19 matrix panel in
  `frontend/src/features/mission-console/MissionConsole.tsx`, near the Stage 18
  rehearsal panel, with coverage rows, blocker state, source buckets, and local
  command checklist;
- update `frontend/src/styles/global.css` only as needed for the compact panel;
- add focused frontend tests in a new
  `tests/frontend/reviewHandoffCoverageMatrix.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` for the new view-model shape;
- keep existing Stage 18, Stage 17, Stage 16, Stage 15, Stage 14, Stage 13,
  Stage 12, Stage 11, Stage 10, and Stage 09 behavior covered by focused
  regression tests;
- add a public-safe Stage 19 artifact under
  `docs/development/artifacts/stage19-local-review-coverage-matrix/`
  describing the coverage boundary, source files, verification commands, and
  deferred production features.

## Human Test Gate

A reviewer should be able to:

1. inspect the Stage 18 local review handoff rehearsal;
2. read the Stage 19 coverage matrix row by row;
3. confirm each row maps to a rehearsal action, shows target coverage counts,
   source coverage buckets, blocker state, and source references;
4. inspect the local command checklist and identify which focused tests prove
   the matrix and prior review surfaces;
5. confirm unresolved local blockers remain explicit;
6. confirm deferred production scope remains visible but non-blocking;
7. complete the local review pass without saved reviewer sessions, persistent
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
  builder, report package writer, handoff report exports, or production handoff
  package;
- no executable command runner, shell automation panel, or production gate;
- no broad frontend redesign or new routing shell;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused frontend model tests for deterministic coverage matrix construction;
- view-model tests proving the matrix is connected to the Stage 18 rehearsal;
- mission-console coverage showing the matrix is visible without changing
  local-live behavior;
- local command checklist assertions that remain static, public-safe, and
  repo-relative;
- existing Stage 18 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- editable state or persistence tests before the local coverage contract exists;
- external workflow integrations, ticketing, auth, production signoff, report
  authoring, report exports, cloud-backed handoff primitives, or deploy work;
- command execution UI or a task runner.

## Exit Criteria

- one deterministic local review coverage matrix is source-backed and
  visible/testable;
- matrix rows are derived from Stage 18 rehearsal steps, not ad hoc UI strings;
- each row exposes action id, rehearsal step, target coverage counts, source
  coverage buckets, blocker status, next local step, and source evidence
  references where available;
- the local verification command checklist is visible, static, repo-relative,
  and non-executable;
- local blockers remain explicit and deferred production scope remains visible
  but non-blocking;
- mission-console UI exposes the matrix without a broad redesign;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved reviewer progress,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, or executable
  command automation.
