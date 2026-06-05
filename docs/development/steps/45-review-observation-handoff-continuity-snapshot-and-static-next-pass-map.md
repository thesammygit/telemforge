# Stage 45: Review Observation Handoff Continuity Snapshot And Static Next-Pass Map

## Goal

Turn the Stage 44 observation handoff debrief and follow-up map into a
deterministic local continuity snapshot so a reviewer can see how the debrief
context carries into the next manual review pass, which source prompts and
follow-up anchors support that continuity, and which production handoff
semantics remain intentionally out of scope.

This stage remains deterministic, local, read-only, fixture-first,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It is not saved debrief notes, saved reviewer progress, saved follow-up
ownership, a ticket queue, runnable checklist, task launcher, meeting workflow,
owner-assigned plan, signoff record, audit trail, report export, handoff
package generator, command surface, scoring model, certification gate,
deployment, or main-branch integration.

## Decisions To Make

### Continuity Shape

Option A: deterministic local continuity snapshot and static next-pass map

- derives continuity cards from Stage 44 debrief prompts and cue-backed
  follow-up map entries;
- preserves Stage 44 debrief prompt order, default debrief prompt context, and
  follow-up map ordering;
- groups each continuity card around source cue ids, source debrief prompt ids,
  source follow-up map entry ids, local anchors, evidence callbacks, gap
  discussion points, deferred-scope reminders, and static non-goal context;
- keeps every card informational, local-only, static, non-actionable,
  non-persistent, non-executable, non-routing, non-ranking, and
  non-certifying.

Option B: saved handoff progress or follow-up ownership

- would add saved reviewer progress, owners, action state, local storage, or
  persistence before the static continuity contract is proven.

Option C: workflow launch, report package, or signoff gate

- would add workflow semantics, runnable checklists, exports, handoff package
  generation, signoff, audit retention, scoring, or certification before a
  reviewer has validated the static continuity map.

Recommended: start with Option A. Stage 45 should make the Stage 44 debrief
easier to carry into a next manual pass without turning it into saved progress,
owner-assigned work, meeting management, report packaging, scoring,
certification, or workflow state.

### Placement

Option A: compact continuity panel near the Stage 44 debrief panel

- keeps the continuity snapshot next to the debrief and follow-up map it
  summarizes;
- lets reviewers inspect debrief-to-next-pass continuity without opening a
  route or saving state;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: global handoff continuity workspace

- would introduce app-wide navigation, routes, saved progress, and broader
  handoff workflow semantics outside the bounded stage.

Recommended: Option A. The first continuity surface should be a compact
read-only mission-console panel.

## Work Items

- add a deterministic local helper, preferably
  `frontend/src/lib/reviewObservationHandoffContinuity.ts`, over the Stage 44
  `ReviewObservationHandoffDebriefView`;
- define compact Stage 45 types in
  `frontend/src/features/mission-console/types.ts` for continuity cards,
  static next-pass map entries, source references, summary fields, and static
  non-goal flags;
- wire the continuity snapshot into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  44 observation handoff debrief is built, without changing fixture/local-live
  boundaries;
- surface a compact Stage 45 continuity snapshot and static next-pass map
  panel in `frontend/src/features/mission-console/MissionConsole.tsx` near the
  Stage 44 debrief panel;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  45 panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationHandoffContinuity.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 44 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 45 artifact under
  `docs/development/artifacts/stage45-review-observation-handoff-continuity/`
  describing the continuity contract, source files, verification commands,
  human test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 45 continuity snapshot near the Stage 44 debrief panel;
3. confirm continuity card order preserves Stage 44 debrief prompt order;
4. confirm the default continuity card uses the Stage 44 default debrief
   prompt;
5. confirm each continuity card shows source cue ids, source debrief prompt
   ids, source follow-up map entry ids, source path step ids, source agenda
   section ids, local anchor targets, evidence callback counts, gap discussion
   point counts, deferred-scope reminder counts, and compact non-goal context;
6. confirm static next-pass map rows derive from Stage 44 follow-up map entries
   and preserve source follow-up order;
7. follow local anchor links and verify the page stays on the same route;
8. confirm the panel is static manual-review context only and does not become
   saved debrief notes, saved reviewer progress, saved follow-up ownership,
   saved answers, saved selections, tasks, tickets, checklists, owner
   assignments, scores, ranks, certifications, exports, command runners,
   route changes, signoff, audit retention, report authoring, handoff package
   generation, meeting workflow, or persistence.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved debrief notes, saved review sessions, saved reviewer progress,
  saved continuity progress, saved follow-up progress, saved follow-up
  ownership, saved rehearsal sessions, saved dry-run progress, saved handoff
  path progress, saved agenda progress, saved observations, saved filters,
  saved answers, saved selections, persistent notes, local storage, or saved
  action ownership;
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

- focused frontend model tests proving continuity cards derive from the Stage
  44 `reviewObservationHandoffDebrief` prompts and follow-up map entries;
- assertions that default continuity card, card order, static next-pass map
  order, and source reference order remain stable;
- assertions that each continuity card carries source cue ids, source debrief
  prompt ids, source follow-up map entry ids, source path step ids, source
  agenda section ids, source prompt group ids, source coverage row ids, source
  handoff card ids, local anchor hrefs, anchor target ids, evidence callback
  ids, gap and deferred-scope reminder ids, local-only flags, and static
  non-goal context;
- assertions that continuity cards and next-pass map rows are local,
  informational, static, non-actionable, non-persistent, non-executable,
  non-routing, non-ranking, and non-certifying;
- view-model tests proving the continuity snapshot connects to the existing
  fixture and local-live boundary and does not change stream behavior;
- mission-console coverage showing continuity references render without route
  changes, saved state, command execution, exports, signoff, owner assignment,
  proof scoring, certification, meeting workflow, or runnable checklist
  semantics;
- existing Stage 44 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved continuity state, saved debrief notes, saved follow-up ownership,
  saved rehearsal state, saved observations, notes, filters, agenda answers,
  question answers, path progress, citation selections, source-map selections,
  boundary selections, walkthrough selections, storyline selections, deck
  selections, coverage selections, dry-run selections, debrief selections,
  review progress, local storage, or persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, route changes, or app-wide routing.

## Exit Criteria

- one deterministic local continuity snapshot and static next-pass map is
  source-backed and visible/testable;
- continuity cards derive from Stage 44 debrief prompts, not ad hoc UI strings;
- static next-pass map rows derive from Stage 44 follow-up map entries and
  preserve source follow-up order;
- default continuity card, card order, next-pass map order, and source
  reference order remain stable;
- source cues, debrief prompts, follow-up map entries, path steps, agenda
  sections, prompt groups, coverage rows, handoff cards, local anchor hrefs,
  anchor target ids, evidence callbacks, gap discussion points, and deferred
  scope reminders are explicit and source-backed;
- continuity cards and next-pass map rows are explanatory, static, in-page
  only, non-actionable, non-persistent, non-executable, non-routing,
  non-ranking, and non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains
  safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved notes, saved progress,
  persistence, identity, collaboration, external ticketing, production
  signoff, deploy/release, audit retention, report/export authoring, handoff
  package generation, ownership launchers, proof scoring, certification,
  executable command automation, route changes, or app-wide navigation.
