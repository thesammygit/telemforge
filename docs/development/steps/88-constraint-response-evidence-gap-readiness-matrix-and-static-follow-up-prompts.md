# Stage 88: Constraint Response Evidence Gap Readiness Matrix And Static Follow-Up Prompts

## Goal

Turn the completed Stage 87 evidence-check review path and static
citation-gap cue cards into a deterministic local evidence-gap readiness matrix
and static follow-up prompt surface so reviewers can compare evidence prompts,
citation-gap cues, source lineage, anchors, callbacks, gaps, and deferred
reminders before drafting outside the app.

This stage remains deterministic, local, read-only, fixture-first,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It is not saved reviewer answers, saved answer drafts, saved reviewer notes,
saved response notes, saved source selections, saved citation selections,
saved evidence-check selections, saved evidence-gap readiness state, owner
assignment, ticketing, runnable checklists, task launchers, meeting workflow,
signoff, audit retention, report export, handoff package generation, command
execution, scoring, certification, deployment, or main-branch integration.

## Decisions To Make

### Matrix Shape

Option A: deterministic local evidence-gap readiness matrix and static
follow-up prompts

- derives ordered matrix rows from Stage 87 evidence-check review path steps;
- derives static follow-up prompt cards from Stage 87 static citation-gap cue
  cards;
- preserves Stage 87 evidence-check review path step order and citation-gap
  cue card order;
- carries the Stage 87 default evidence-check review context into the Stage 88
  summary;
- exposes Stage 87 review path step ids, Stage 87 citation-gap cue card ids,
  Stage 86 evidence-check prompt ids, Stage 86 citation-review row ids, Stage
  85 source follow-up map entry ids, Stage 85 citation prompt ids, Stage 84
  through Stage 64 source ids, local anchors, callbacks, gap prompts,
  deferred reminders, labels, readiness text, follow-up prompt text, local-only
  flags, and static non-goal context as manual review context only.

Option B: saved evidence-gap worksheet

- would add saved evidence-gap selections, editable reviewer notes, reviewer
  answers, local storage, persisted progress, or reviewer identity before the
  static evidence-gap readiness matrix is validated.

Option C: evidence-gap scoring, signoff, export, or workflow package

- would turn the matrix into owner assignment, tickets, meeting workflow,
  signoff, audit state, ranking, scoring, certification, report export,
  handoff package generation, or command execution before a reviewer validates
  the static local surface.

Recommended: start with Option A. Stage 88 should make Stage 87 review-path
steps and citation-gap cue cards easier to compare as a readiness matrix
without adding saved state, workflow, scoring, certification, exports,
commands, routing, ownership, or production handoff semantics.

### Placement

Option A: compact evidence-gap readiness matrix panel near the Stage 87 panel

- keeps evidence-gap readiness context adjacent to the Stage 87 review path it
  derives from;
- lets reviewers compare review path steps, citation-gap cue cards, source
  lineage, anchors, callbacks, gap prompts, deferred reminders, and static
  follow-up prompts without leaving the mission console route;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: separate evidence-gap route

- would introduce broader navigation, route changes, saved evidence-gap state,
  signoff/audit semantics, meeting workflow, or app-wide review workflow
  outside the bounded stage.

Recommended: Option A. The first evidence-gap readiness matrix should be a
compact read-only mission-console panel.

## Work Items

- add a deterministic local helper,
  `frontend/src/lib/constraintResponseEvidenceGapReadinessMatrix.ts`, over the
  Stage 87 evidence-check review path view;
- define compact Stage 88 types in
  `frontend/src/features/mission-console/types.ts` for evidence-gap readiness
  rows, static follow-up prompt cards, summary fields, default context, labels,
  source chains, and static non-goal flags;
- wire the evidence-gap readiness matrix into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  87 evidence-check review path is built, without changing fixture or
  local-live boundaries;
- surface a compact Stage 88 evidence-gap readiness matrix/static follow-up
  prompt panel in `frontend/src/features/mission-console/MissionConsole.tsx`
  near the Stage 87 panel;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  88 panel;
- add focused frontend tests in
  `tests/frontend/constraintResponseEvidenceGapReadinessMatrix.test.ts` and
  update `tests/frontend/consoleViewModel.test.ts` where needed;
- add a public-safe Stage 88 artifact under
  `docs/development/artifacts/stage88-constraint-response-evidence-gap-readiness-matrix/`
  describing the readiness matrix contract, source files, verification
  commands, human test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 88 evidence-gap readiness matrix near the Stage 87
   evidence-check review path;
3. confirm evidence-gap readiness row order preserves Stage 87 evidence-check
   review path step order;
4. confirm static follow-up prompt card order preserves Stage 87 static
   citation-gap cue card order;
5. confirm the default Stage 88 readiness context mirrors the Stage 87 default
   evidence-check review context;
6. confirm each readiness row shows Stage 87 review path step ids, Stage 87
   citation-gap cue card ids, Stage 86 evidence prompt ids, Stage 86
   citation-review row ids, Stage 85 source follow-up map entry ids, Stage 85
   citation prompt ids, Stage 84 through Stage 64 source ids, local anchors,
   callbacks, gap prompts, deferred reminders, labels, readiness text,
   follow-up prompt text, and static non-goal context;
7. follow local anchor links and verify the page stays on the same route;
8. confirm the panel is static manual-review context only and does not become
   saved answers, drafts, notes, source selections, citation selections,
   evidence-check selections, evidence-gap readiness state, route changes,
   exports, signoff, audit retention, scoring, certification, owner
   assignment, meeting workflow, handoff package generation, runnable
   checklist, task launcher, or command execution.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved reviewer answers, saved answer drafts, saved reviewer notes, saved
  response notes, saved source selections, saved citation selections, saved
  evidence-check selections, saved evidence-gap readiness state, local storage,
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

- focused frontend model tests proving evidence-gap readiness rows derive from
  Stage 87 evidence-check review path steps and static follow-up prompt cards
  derive from Stage 87 static citation-gap cue cards;
- assertions that readiness row order, follow-up prompt card order, default
  context, label order, and source/anchor reference order remain stable;
- assertions that each readiness row carries Stage 87 through Stage 64 source
  ids, anchors, callbacks, gaps, deferred reminders, labels, readiness text,
  follow-up prompt text, local-only flags, and static non-goal context;
- assertions that readiness rows and static follow-up prompt cards are local,
  informational, static, non-actionable, non-persistent, non-executable,
  non-routing, non-ranking, and non-certifying;
- view-model tests proving the evidence-gap readiness matrix connects to the
  existing fixture and local-live boundary and does not change stream behavior;
- mission-console coverage showing source/anchor references render without
  route changes, saved state, command execution, exports, signoff, owner
  assignment, proof scoring, certification, meeting workflow, handoff package
  generation, or runnable checklist semantics;
- existing Stage 87 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved reviewer answers, saved answer drafts, saved reviewer notes, saved
  response notes, saved source selections, saved citation selections, saved
  evidence-check selections, saved evidence-gap readiness state, saved review
  progress, local storage, or persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, route changes, app-wide routing, or meeting
  workflow.

## Exit Criteria

- one deterministic local constraint-response evidence-gap readiness matrix
  and static follow-up prompt surface is source-backed and visible/testable;
- evidence-gap readiness rows derive from Stage 87 evidence-check review path
  steps and static follow-up prompt cards derive from Stage 87 static
  citation-gap cue cards, not ad hoc UI strings;
- readiness row order, follow-up prompt card order, default context, labels,
  and source/anchor reference order remain stable;
- Stage 87 evidence-check review path steps and static citation-gap cue cards,
  Stage 86 evidence-check prompt cards and citation-review lane rows, Stage 85
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
  Stage 70 crosswalk rows, Stage 69 walkthrough steps, Stage 68 answer
  coverage rows, Stage 67 rehearsal path steps, Stage 66 board rows, Stage 65
  brief rows, Stage 64 triage rows, local anchors, callbacks, gaps, deferred
  reminders, labels, readiness text, and static follow-up prompt text are
  explicit and source-backed;
- readiness rows and static follow-up prompt cards are explanatory, static,
  in-page only, non-actionable, non-persistent, non-executable, non-routing,
  non-ranking, and non-certifying;
- the mission-console panel is compact and adjacent to Stage 87 without route
  changes, saved state, command execution, exports, signoff, owner assignment,
  scoring, certification, meeting workflow, handoff package generation, or
  runnable checklist behavior;
- focused tests and the public repo guard pass.
