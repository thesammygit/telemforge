# Stage 91: Constraint Response Evidence Gap Follow-Up Coverage Review Path And Static Response Cues

## Goal

Turn the completed Stage 90 evidence-gap follow-up coverage board and static
review prompts into a deterministic local coverage-review path and static
response cue surface so reviewers can walk coverage rows, prompt lineage,
anchors, callbacks, gap prompts, deferred reminders, and static response cues
before drafting outside the app.

This stage remains deterministic, local, read-only, fixture-first,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It is not saved reviewer answers, saved answer drafts, saved reviewer notes,
saved response notes, saved coverage-review selections, saved response cues,
saved coverage state, owner assignment, ticketing, runnable checklists, task
launchers, meeting workflow, signoff, audit retention, report export, handoff
package generation, command execution, scoring, certification, deployment, or
main-branch integration.

## Decisions To Make

### Review Path Shape

Option A: deterministic local coverage-review path and static response cues

- derives ordered coverage-review path steps from Stage 90 coverage rows;
- derives static response cue cards from Stage 90 static review prompt cards;
- preserves Stage 90 coverage row order and static review prompt card order;
- carries the Stage 90 default coverage context into the Stage 91 summary;
- exposes Stage 90 coverage row ids, Stage 90 static review prompt card ids,
  Stage 89 follow-up review path step ids, Stage 89 static readiness cue card
  ids, Stage 88 through Stage 64 source ids, local anchors, callbacks, gap
  prompts, deferred reminders, deterministic labels, response cue text,
  local-only flags, and static non-goal context as manual review context only.

Option B: saved response worksheet

- would add saved response drafts, editable reviewer notes, saved cue
  selections, local storage, persisted progress, or reviewer identity before
  the static review path is validated.

Option C: response scoring, signoff, export, or workflow package

- would turn the coverage-review path into owner assignment, tickets, meeting
  workflow, signoff, audit state, ranking, scoring, certification, report
  export, handoff package generation, or command execution before a reviewer
  validates the static local surface.

Recommended: start with Option A. Stage 91 should make Stage 90 coverage rows
and static review prompts easier to walk as response context without adding
saved state, workflow, scoring, certification, exports, commands, routing,
ownership, or production handoff semantics.

### Placement

Option A: compact coverage-review path near the Stage 90 panel

- keeps response cue context adjacent to the Stage 90 coverage board it derives
  from;
- lets reviewers compare coverage rows, static review prompts, source lineage,
  anchors, callbacks, gap prompts, deferred reminders, and response cues without
  leaving the mission console route;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: separate response route

- would introduce broader navigation, route changes, saved response state,
  signoff/audit semantics, meeting workflow, or app-wide review workflow
  outside the bounded stage.

Recommended: Option A. The first evidence-gap follow-up coverage-review path
should be a compact read-only mission-console panel.

## Work Items

- add a deterministic local helper,
  `frontend/src/lib/constraintResponseEvidenceGapFollowUpCoverageReviewPath.ts`,
  over the Stage 90 evidence-gap follow-up coverage board view;
- define compact Stage 91 types in
  `frontend/src/features/mission-console/types.ts` for coverage-review path
  steps, static response cue cards, summary fields, default context, labels,
  source chains, and static non-goal flags;
- wire the coverage-review path into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  90 evidence-gap follow-up coverage board is built, without changing fixture
  or local-live boundaries;
- surface a compact Stage 91 evidence-gap follow-up coverage-review path/static
  response cue panel in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 90
  panel;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  91 panel;
- add focused frontend tests in
  `tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewPath.test.ts`
  and update `tests/frontend/consoleViewModel.test.ts` where needed;
- add a public-safe Stage 91 artifact under
  `docs/development/artifacts/stage91-constraint-response-evidence-gap-follow-up-coverage-review-path/`
  describing the coverage-review path contract, source files, verification
  commands, human test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 91 evidence-gap follow-up coverage-review path near the Stage
   90 coverage board;
3. confirm coverage-review path step order preserves Stage 90 coverage row
   order;
4. confirm static response cue card order preserves Stage 90 static review
   prompt card order;
5. confirm the default Stage 91 coverage-review context mirrors the Stage 90
   default coverage context;
6. confirm each path step shows Stage 90 coverage row ids, Stage 90 static
   review prompt card ids, Stage 89 follow-up review path step ids, Stage 89
   static readiness cue card ids, Stage 88 through Stage 64 source ids, local
   anchors, callbacks, gap prompts, deferred reminders, response cue labels,
   response cue text, and static non-goal context;
7. follow local anchor links and verify the page stays on the same route;
8. confirm the panel is static manual-review context only and does not become
   saved answers, drafts, notes, coverage-review selections, response cue
   selections, saved coverage state, route changes, exports, signoff, audit
   retention, scoring, certification, owner assignment, meeting workflow,
   handoff package generation, runnable checklist, task launcher, or command
   execution.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved reviewer answers, saved answer drafts, saved reviewer notes, saved
  response notes, saved coverage-review selections, saved response cue
  selections, saved coverage state, local storage, persistence, saved review
  sessions, saved reviewer progress, or saved action ownership;
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

- focused frontend model tests proving coverage-review path steps derive from
  Stage 90 coverage rows and static response cue cards derive from Stage 90
  static review prompt cards;
- assertions that path step order, static response cue card order, default
  context, label order, and source/anchor reference order remain stable;
- assertions that each path step carries Stage 90 through Stage 64 source ids,
  anchors, callbacks, gaps, deferred reminders, labels, response cue text,
  local-only flags, and static non-goal context;
- assertions that coverage-review path steps and static response cue cards are
  local, informational, static, non-actionable, non-persistent,
  non-executable, non-routing, non-ranking, and non-certifying;
- view-model tests proving the coverage-review path connects to the existing
  fixture and local-live boundary and does not change stream behavior;
- mission-console coverage showing source/anchor references render without
  route changes, saved state, command execution, exports, signoff, owner
  assignment, proof scoring, certification, meeting workflow, handoff package
  generation, or runnable checklist semantics;
- existing Stage 90 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved reviewer answers, saved answer drafts, saved reviewer notes, saved
  response notes, saved coverage-review selections, saved response cue
  selections, saved coverage state, saved review progress, local storage, or
  persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, route changes, app-wide routing, or meeting
  workflow.

## Exit Criteria

- one deterministic local constraint-response evidence-gap follow-up
  coverage-review path and static response cue surface is source-backed and
  visible/testable;
- coverage-review path steps derive from Stage 90 coverage rows and static
  response cue cards derive from Stage 90 static review prompt cards, not ad
  hoc UI strings;
- path step order, static response cue card order, default context, labels, and
  source/anchor reference order remain stable;
- Stage 90 coverage rows and static review prompt cards, Stage 89 follow-up
  review path steps and static readiness cue cards, Stage 88 evidence-gap
  readiness rows and static follow-up prompt cards, Stage 87 through Stage 64
  source ids, local anchors, callbacks, gaps, deferred reminders, labels, and
  response cue text are explicit and source-backed;
- coverage-review path steps and static response cue cards are explanatory,
  static, in-page only, non-actionable, non-persistent, non-executable,
  non-routing, non-ranking, and non-certifying;
- the mission-console panel is compact and adjacent to Stage 90 without route
  changes, saved state, command execution, exports, signoff, owner assignment,
  scoring, certification, meeting workflow, handoff package generation, or
  runnable checklist behavior;
- focused tests and the public repo guard pass.
