# Stage 95: Constraint Response Evidence Gap Follow-Up Coverage Review Response Readiness Review Path Revision Coverage Review Path And Static Revision Follow-Up Prompts

## Goal

Turn the completed Stage 94 revision coverage board and static revision-check
surface into a deterministic local revision coverage review path and static
revision follow-up prompt surface so reviewers can walk from each coverage row
to the next manual follow-up prompt before editing outside the app.

This stage remains deterministic, local, read-only, fixture-first,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It is not saved reviewer answers, saved answer drafts, saved revision drafts,
saved reviewer notes, saved response notes, saved response-readiness
selections, saved draft-check selections, saved revision-prompt selections,
saved revision coverage selections, saved revision-check selections, saved
revision follow-up selections, saved review path state, owner assignment,
ticketing, runnable checklists, task launchers, meeting workflow, signoff,
audit retention, report export, handoff package generation, command execution,
scoring, certification, deployment, or main-branch integration.

## Decisions To Make

### Revision Follow-Up Shape

Option A: deterministic local revision coverage review path and static
revision follow-up prompts

- derives review-path steps from Stage 94 revision coverage rows;
- derives static revision follow-up prompt cards from Stage 94 static
  revision-check cards;
- preserves Stage 94 revision coverage row order and static revision-check card
  order;
- carries the Stage 94 default revision coverage context into the Stage 95
  summary;
- exposes Stage 94 revision coverage row ids, Stage 94 static revision-check
  card ids, Stage 93 review-path step ids and static revision-prompt card ids,
  Stage 92 through Stage 64 source ids, local anchors, callbacks, gap prompts,
  deferred reminders, deterministic review-path labels, static follow-up
  prompt text, local-only flags, and non-goal context as manual review context
  only.

Option B: saved revision follow-up worksheet

- would add saved follow-up selections, editable reviewer notes, local storage,
  persisted progress, reviewer identity, or saved review-path state before the
  static review path is validated.

Option C: revision workflow, scoring, signoff, export, or handoff package

- would turn revision follow-up prompts into owner assignment, tickets, meeting
  workflow, signoff, audit state, ranking, scoring, certification, report
  export, handoff package generation, or command execution before a reviewer
  validates the static local surface.

Recommended: start with Option A. Stage 95 should make Stage 94 revision
coverage follow-up inspectable without adding saved state, workflow, scoring,
certification, exports, commands, routing, ownership, or production handoff
semantics.

### Placement

Option A: compact revision coverage review path near the Stage 94 panel

- keeps follow-up prompts adjacent to the revision coverage board they derive
  from;
- lets reviewers compare coverage rows, static revision checks, source
  lineage, anchors, callbacks, gap prompts, deferred reminders, and next manual
  follow-up prompts without leaving the mission console route;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: separate revision follow-up route

- would introduce broader navigation, route changes, saved revision follow-up
  state, signoff/audit semantics, meeting workflow, or app-wide review workflow
  outside the bounded stage.

Recommended: Option A. The first revision coverage review path should be a
compact read-only mission-console panel.

## Work Items

- add a deterministic local helper,
  `frontend/src/lib/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPath.ts`,
  over the Stage 94 revision coverage board view;
- define compact Stage 95 types in
  `frontend/src/features/mission-console/types.ts` for revision coverage
  review-path steps, static revision follow-up prompt cards, summary fields,
  default context, labels, source chains, and static non-goal flags;
- wire the revision coverage review path into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  94 revision coverage board is built, without changing fixture or local-live
  boundaries;
- surface a compact Stage 95 revision coverage review path/static follow-up
  prompt panel in `frontend/src/features/mission-console/MissionConsole.tsx`
  near the Stage 94 panel;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  95 panel;
- add focused frontend tests in
  `tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPath.test.ts`
  and update `tests/frontend/consoleViewModel.test.ts` where needed;
- add a public-safe Stage 95 artifact under
  `docs/development/artifacts/stage95-constraint-response-evidence-gap-follow-up-coverage-review-response-readiness-review-path-revision-coverage-review-path/`
  describing the revision coverage review-path contract, source files,
  verification commands, human test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 95 revision coverage review path near the Stage 94 revision
   coverage board;
3. confirm review-path step order preserves Stage 94 revision coverage row
   order;
4. confirm static revision follow-up prompt card order preserves Stage 94 static
   revision-check card order;
5. confirm the default Stage 95 review-path context mirrors the Stage 94
   default revision coverage context;
6. confirm each review-path step shows Stage 94 revision coverage row ids,
   Stage 94 static revision-check card ids, Stage 93 review-path step ids,
   Stage 93 static revision-prompt card ids, Stage 92 through Stage 64 source
   ids, local anchors, callbacks, gap prompts, deferred reminders, review-path
   labels, follow-up prompt text, and static non-goal context;
7. follow local anchor links and verify the page stays on the same route;
8. confirm the panel is static manual-review context only and does not become
   saved answers, drafts, revision notes, revision coverage selections,
   revision-check selections, revision follow-up selections, response-readiness
   selections, draft-check selections, revision-prompt selections, review path
   state, route changes, exports, signoff, audit retention, scoring,
   certification, owner assignment, meeting workflow, handoff package
   generation, runnable checklist, task launcher, or command execution.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved reviewer answers, saved answer drafts, saved revision drafts, saved
  reviewer notes, saved response notes, saved response-readiness selections,
  saved draft-check selections, saved revision-prompt selections, saved
  revision coverage selections, saved revision-check selections, saved revision
  follow-up selections, saved review path state, local storage, persistence,
  saved review sessions, saved reviewer progress, or saved action ownership;
- no reviewer signoff workflow, audit retention, approval identity,
  production-readiness scoring, proof scoring, quality scoring, ranking, or
  certification;
- no external ticketing, messaging, email, workflow integrations, owner
  assignment, task launcher, queue ownership, runnable checklist behavior, or
  meeting management;
- no cloud services, telemetry upload, paid APIs, browser-cookie import, or
  external network calls;
- no deploy/release/publish work;
- no production evidence archive or database migration;
- no report designer, downloadable styled report system, free-form export
  builder, report package writer, handoff report exports, handoff package
  writer, or production handoff package;
- no executable command runner, shell automation panel, proof scorer,
  production gate, or shell command UI;
- no broad frontend redesign, new routing shell, route changes, or app-wide
  navigation system;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused frontend model tests proving revision coverage review-path steps
  derive from Stage 94 revision coverage rows and static revision follow-up
  prompt cards derive from Stage 94 static revision-check cards;
- assertions that review-path step order, static follow-up prompt card order,
  default context, label order, and source/anchor reference order remain
  stable;
- assertions that each review-path step carries Stage 94 through Stage 64
  source ids, anchors, callbacks, gaps, deferred reminders, labels,
  follow-up prompt text, local-only flags, and static non-goal context;
- assertions that review-path steps and static follow-up prompt cards are
  local, informational, static, non-actionable, non-persistent,
  non-executable, non-routing, non-ranking, and non-certifying;
- view-model tests proving the revision coverage review path connects to the
  existing fixture and local-live boundary and does not change stream behavior;
- mission-console coverage showing source/anchor references render without
  route changes, saved state, command execution, exports, signoff, owner
  assignment, proof scoring, certification, meeting workflow, handoff package
  generation, or runnable checklist semantics;
- existing Stage 94 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved reviewer answers, saved answer drafts, saved revision drafts, saved
  reviewer notes, saved response notes, saved response-readiness selections,
  saved draft-check selections, saved revision-prompt selections, saved
  revision coverage selections, saved revision-check selections, saved revision
  follow-up selections, saved review path state, saved review progress, local
  storage, or persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, route changes, app-wide routing, or meeting
  workflow.

## Exit Criteria

- one deterministic local constraint-response evidence-gap follow-up coverage
  review response-readiness review-path revision coverage review path and
  static revision follow-up prompt surface is source-backed and visible/testable;
- review-path steps derive from Stage 94 revision coverage rows and static
  revision follow-up prompt cards derive from Stage 94 static revision-check
  cards, not ad hoc UI strings;
- review-path step order, static follow-up prompt card order, default context,
  labels, and source/anchor reference order remain stable;
- Stage 94 revision coverage rows and static revision-check cards, Stage 93
  review-path steps and static revision-prompt cards, Stage 92 through Stage
  64 source ids, local anchors, callbacks, gaps, deferred reminders, labels,
  and follow-up prompt text are explicit and source-backed;
- review-path steps and static follow-up prompt cards are explanatory, static,
  in-page only, non-actionable, non-persistent, non-executable, non-routing,
  non-ranking, and non-certifying;
- the mission-console panel is compact and adjacent to Stage 94 without route
  changes, saved state, command execution, exports, signoff, owner assignment,
  scoring, certification, meeting workflow, handoff package generation, or
  runnable checklist behavior;
- focused tests and the public repo guard pass.
