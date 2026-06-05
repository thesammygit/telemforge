# Stage 43: Review Observation Handoff Dry Run And Static Cue Sheet

## Goal

Turn the Stage 42 observation handoff path into a deterministic local dry-run
cue sheet so a reviewer can rehearse the manual handoff conversation, see the
evidence anchors and deferred-scope reminders that support each cue, and verify
the handoff remains static review context before any saved sessions,
persistence, routing, exports, command execution, ownership, scoring, signoff,
or production handoff semantics are introduced.

This stage remains deterministic, local, read-only, fixture-first,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It is not a saved rehearsal, runnable checklist, task launcher, owner-assigned
workflow, report export, handoff package generator, meeting system, signoff
record, audit trail, command surface, scoring model, certification gate,
deployment, or main-branch integration.

## Decisions To Make

### Dry-Run Shape

Option A: deterministic local dry-run cue sheet

- derives cue sections from the Stage 42 handoff path steps and anchor map;
- preserves the Stage 42 path order and default path step;
- groups each cue around a manual reviewer prompt, source anchors, evidence
  callbacks, gap/deferred-scope reminders, and non-goal context;
- keeps every cue informational, local-only, static, non-actionable,
  non-persistent, non-executable, non-routing, non-ranking, and
  non-certifying.

Option B: saved rehearsal session

- would introduce saved progress, reviewer identity, persistence, or local
  storage before the static handoff dry run is proven.

Option C: runnable checklist or owner handoff workflow

- would add completion state, owners, task launchers, or executable next steps
  before manual review has validated the handoff cues.

Recommended: start with Option A. Stage 43 should make the Stage 42 path easier
to rehearse inside the existing mission console without creating workflow
ownership, saved progress, scoring, exports, commands, or routes.

### Placement

Option A: compact dry-run panel near the Stage 42 handoff path

- keeps the dry-run cue sheet next to the path and anchors it summarizes;
- lets reviewers inspect cue-to-anchor coverage without opening a new route or
  saving state;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: global handoff workspace

- would introduce app-wide navigation and broader workflow semantics outside
  the bounded stage.

Recommended: Option A. The first dry-run surface should be a compact read-only
mission-console panel.

## Work Items

- add a deterministic local helper, preferably
  `frontend/src/lib/reviewObservationHandoffDryRun.ts`, over the Stage 42
  `ReviewObservationHandoffPathView`;
- define compact Stage 43 types in
  `frontend/src/features/mission-console/types.ts` for dry-run cues,
  cue-to-anchor coverage, source references, summary fields, and static
  non-goal flags;
- wire the dry run into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  42 observation handoff path is built, without changing fixture/local-live
  boundaries;
- surface a compact Stage 43 dry-run cue sheet panel in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 42
  handoff path;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  43 panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationHandoffDryRun.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 42 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 43 artifact under
  `docs/development/artifacts/stage43-review-observation-handoff-dry-run/`
  describing the dry-run cue contract, source files, verification commands,
  human test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 43 handoff dry-run cue sheet near the Stage 42 handoff path;
3. confirm cue order preserves Stage 42 path step order;
4. confirm the first cue uses the Stage 42 default path step;
5. confirm each cue shows source path step ids, source agenda section ids,
   local anchor targets, evidence callback counts, gap/deferred-scope reminder
   counts, and compact non-goal context;
6. follow local anchor links and verify the page stays on the same route;
7. confirm cue-to-anchor coverage is derived from Stage 42 anchor map entries;
8. confirm the panel is static manual-review context only and does not become
   saved rehearsal progress, saved path progress, saved agenda progress,
   saved answers, saved selections, tasks, tickets, checklists, owner
   assignments, scores, ranks, certifications, exports, command runners,
   route changes, signoff, audit retention, or persistence.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved rehearsal sessions, saved dry-run progress, saved handoff path
  progress, saved agenda progress, saved reviewer progress, saved observations,
  saved notes, saved filters, saved answers, saved selections, persistent
  notes, local storage, or saved action ownership;
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

- focused frontend model tests proving dry-run cues derive from the Stage 42
  `reviewObservationHandoffPath` path steps and anchor map entries;
- assertions that default cue, cue order, cue-to-anchor coverage order, and
  source reference order remain stable;
- assertions that each cue carries source path step ids, source agenda section
  ids, source prompt group ids, source coverage row ids, source handoff card
  ids, local anchor hrefs, anchor target ids, evidence callback ids, gap and
  deferred-scope reminder ids, local-only flags, and static non-goal context;
- assertions that dry-run cues are local, informational, static,
  non-actionable, non-persistent, non-executable, non-routing, non-ranking, and
  non-certifying;
- view-model tests proving the dry run connects to the existing fixture and
  local-live boundary and does not change stream behavior;
- mission-console coverage showing cue and anchor references render without
  route changes, saved state, command execution, exports, signoff, owner
  assignment, proof scoring, certification, or runnable checklist semantics;
- existing Stage 42 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved rehearsal state, saved observations, notes, filters, agenda answers,
  question answers, path progress, citation selections, source-map selections,
  boundary selections, walkthrough selections, storyline selections, deck
  selections, coverage selections, review progress, local storage, or
  persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, route changes, or app-wide routing.

## Exit Criteria

- one deterministic local dry-run cue sheet is source-backed and
  visible/testable;
- cue sections are derived from Stage 42 handoff path steps and anchor map
  entries, not ad hoc UI strings;
- default cue, cue order, cue-to-anchor coverage order, and source reference
  order remain stable;
- source path steps, source agenda sections, source prompt groups, source
  coverage rows, source handoff cards, local anchor hrefs, anchor target ids,
  evidence callbacks, gap discussion points, and deferred-scope reminders are
  explicit and source-backed;
- dry-run cues are explanatory, static, in-page only, non-actionable,
  non-persistent, non-executable, non-routing, non-ranking, and
  non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved review sessions,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, handoff package
  generation, ownership launchers, proof scoring, certification, executable
  command automation, route changes, or app-wide navigation.
