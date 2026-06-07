# Stage 87: Constraint Response Evidence Check Review Path And Static Citation Gap Cues

## Goal

Turn the completed Stage 86 source citation-review lane and static
evidence-check prompt cards into a deterministic local evidence-check review
path and static citation-gap cue surface so reviewers can walk evidence prompts,
citation rows, source lineage, anchors, callbacks, gaps, and deferred reminders
before drafting outside the app.

This stage remains deterministic, local, read-only, fixture-first,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It is not saved reviewer answers, saved answer drafts, saved reviewer notes,
saved response notes, saved source selections, saved citation selections, saved
evidence-check selections, saved evidence-check review state, owner assignment,
ticketing, runnable checklists, task launchers, meeting workflow, signoff,
audit retention, report export, handoff package generation, command execution,
scoring, certification, deployment, or main-branch integration.

## Decisions To Make

### Review Path Shape

Option A: deterministic local evidence-check review path and static citation
gap cues

- derives ordered evidence-check review path steps from Stage 86 static
  evidence-check prompt cards;
- derives static citation-gap cue cards from Stage 86 citation-review lane rows;
- preserves Stage 86 evidence prompt order and citation-review row order;
- carries the Stage 86 default citation-review context into the Stage 87
  summary;
- exposes Stage 86 evidence-check prompt ids, Stage 86 citation-review row ids,
  Stage 85 source follow-up map entry ids, Stage 85 citation prompt ids, Stage
  84 through Stage 64 source ids, local anchors, callbacks, gap prompts,
  deferred reminders, labels, review text, cue text, local-only flags, and
  static non-goal context as manual review context only.

Option B: saved evidence-check worksheet

- would add saved evidence selections, editable reviewer notes, reviewer
  answers, local storage, persisted progress, or reviewer identity before the
  static evidence-check review path is validated.

Option C: evidence scoring, signoff, export, or workflow package

- would turn the review path into owner assignment, tickets, meeting workflow,
  signoff, audit state, ranking, scoring, certification, report export,
  handoff package generation, or command execution before a reviewer validates
  the static local surface.

Recommended: start with Option A. Stage 87 should make Stage 86 static
evidence-check prompts and citation-review lane rows easier to inspect as a
review path without adding saved state, workflow, scoring, certification,
exports, commands, routing, ownership, or production handoff semantics.

### Placement

Option A: compact evidence-check review path panel near the Stage 86 panel

- keeps evidence-check context adjacent to the Stage 86 citation-review lane it
  derives from;
- lets reviewers compare evidence prompts, citation rows, source lineage,
  anchors, callbacks, gap prompts, deferred reminders, and static citation-gap
  cues without leaving the mission console route;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: separate citation-gap route

- would introduce broader navigation, route changes, saved evidence-check
  state, signoff/audit semantics, meeting workflow, or app-wide review
  workflow outside the bounded stage.

Recommended: Option A. The first evidence-check review path should be a compact
read-only mission-console panel.

## Work Items

- add a deterministic local helper,
  `frontend/src/lib/constraintResponseEvidenceCheckReviewPath.ts`, over the
  Stage 86 source citation-review lane view;
- define compact Stage 87 types in
  `frontend/src/features/mission-console/types.ts` for evidence-check review
  path steps, static citation-gap cue cards, summary fields, default context,
  labels, source chains, and static non-goal flags;
- wire the evidence-check review path into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  86 source citation-review lane is built, without changing fixture or
  local-live boundaries;
- surface a compact Stage 87 evidence-check review path/static citation-gap cue
  panel in `frontend/src/features/mission-console/MissionConsole.tsx` near the
  Stage 86 panel;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  87 panel;
- add focused frontend tests in
  `tests/frontend/constraintResponseEvidenceCheckReviewPath.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- add a public-safe Stage 87 artifact under
  `docs/development/artifacts/stage87-constraint-response-evidence-check-review-path/`
  describing the review path contract, source files, verification commands,
  human test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 87 evidence-check review path near the Stage 86 source
   citation-review lane;
3. confirm evidence-check review path step order preserves Stage 86 static
   evidence-check prompt card order;
4. confirm static citation-gap cue card order preserves Stage 86 citation-review
   lane row order;
5. confirm the default Stage 87 review context mirrors the Stage 86 default
   citation-review context;
6. confirm each review path step shows Stage 86 evidence prompt ids, Stage 86
   citation-review row ids, Stage 85 source follow-up map entry ids, Stage 85
   citation prompt ids, Stage 84 through Stage 64 source ids, local anchors,
   callbacks, gap prompts, deferred reminders, labels, evidence-check review
   text, citation-gap cue text, and static non-goal context;
7. follow local anchor links and verify the page stays on the same route;
8. confirm the panel is static manual-review context only and does not become
   saved reviewer answers, saved answer drafts, saved reviewer notes, saved
   source selections, saved citation selections, saved evidence-check
   selections, saved evidence-check review state, route changes, exports,
   signoff, audit retention, scoring, certification, owner assignment, meeting
   workflow, handoff package generation, runnable checklist, task launcher, or
   command execution.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved reviewer answers, saved answer drafts, saved reviewer notes, saved
  response notes, saved source selections, saved citation selections, saved
  evidence-check selections, saved evidence-check review state, local storage,
  persistence, saved review sessions, saved reviewer progress, or saved action
  ownership;
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

- focused frontend model tests proving evidence-check review path steps derive
  from Stage 86 static evidence-check prompt cards and static citation-gap cue
  cards derive from Stage 86 citation-review lane rows;
- assertions that review path step order, static citation-gap cue card order,
  default context, label order, and source/anchor reference order remain stable;
- assertions that each review step carries Stage 86 through Stage 64 source ids,
  anchors, callbacks, gaps, deferred reminders, labels, evidence-check review
  text, citation-gap cue text, local-only flags, and static non-goal context;
- assertions that review steps and static citation-gap cue cards are local,
  informational, static, non-actionable, non-persistent, non-executable,
  non-routing, non-ranking, and non-certifying;
- view-model tests proving the evidence-check review path connects to the
  existing fixture and local-live boundary and does not change stream behavior;
- mission-console coverage showing source/anchor references render without
  route changes, saved state, command execution, exports, signoff, owner
  assignment, proof scoring, certification, meeting workflow, handoff package
  generation, or runnable checklist semantics;
- existing Stage 86 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved reviewer answers, saved answer drafts, saved reviewer notes, saved
  response notes, saved source selections, saved citation selections, saved
  evidence-check selections, saved evidence-check review state, saved review
  progress, local storage, or persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists, proof
  scorers, owner assignment, route changes, app-wide routing, or meeting
  workflow.

## Exit Criteria

- one deterministic local constraint-response evidence-check review path and
  static citation-gap cue surface is source-backed and visible/testable;
- evidence-check review path steps derive from Stage 86 static evidence-check
  prompt cards and static citation-gap cue cards derive from Stage 86
  citation-review lane rows, not ad hoc UI strings;
- review path step order, static citation-gap cue card order, default context,
  labels, and source/anchor reference order remain stable;
- Stage 86 evidence-check prompt cards and citation-review lane rows, Stage 85
  citation prompt cards and follow-up map entries, Stage 84 readiness row ids
  and cue card ids, Stage 83 source-review path steps and static source-review
  prompt cards, Stage 82 source-crosswalk rows and static review-check cards,
  Stage 81 review-path steps and static response-review prompt cards, Stage 80
  constraint-coverage rows and static response-note prompt cards, Stage 79
  answer-review path steps and static constraint-note cards, Stage 78 static
  answer-check cards and readiness rows, Stage 77 response-prompt cards and
  review-path steps, Stage 76 response-map rows and static follow-up prompt
  cards, Stage 75 coverage-review steps, Stage 74 coverage rows, Stage 73
  review-path steps, Stage 72 source-recap rows, Stage 71 review-lane rows,
  Stage 70 crosswalk rows, Stage 69 walkthrough steps, Stage 68 answer coverage
  rows, Stage 67 rehearsal path steps, Stage 66 board rows, Stage 65 brief
  rows, Stage 64 triage rows, local anchors, callbacks, gaps, deferred
  reminders, labels, evidence-check review text, and static citation-gap cue
  text are explicit and source-backed;
- review steps and static citation-gap cue cards are explanatory, static,
  in-page only, non-actionable, non-persistent, non-executable, non-routing,
  non-ranking, and non-certifying;
- the mission-console panel is compact and adjacent to Stage 86 without route
  changes, saved state, command execution, exports, signoff, owner assignment,
  scoring, certification, meeting workflow, handoff package generation, or
  runnable checklist behavior;
- focused tests and the public repo guard pass.
