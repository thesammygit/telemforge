# Stage 46: Review Observation Handoff Drift Guard And Static Regression Map

## Goal

Turn the Stage 45 observation handoff continuity snapshot and static next-pass
map into a deterministic local drift guard so a reviewer can verify that
continuity cards, next-pass rows, source references, local anchors, and
deferred-scope reminders still line up before another manual review pass.

This stage remains deterministic, local, read-only, fixture-first,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It is not saved review progress, a handoff owner plan, a ticket queue, runnable
checklist, task launcher, meeting workflow, signoff record, audit trail,
report export, handoff package generator, command surface, scoring model,
certification gate, deployment, or main-branch integration.

## Decisions To Make

### Drift Guard Shape

Option A: deterministic local drift guard and static regression map

- derives drift guard rows from Stage 45 continuity cards and static next-pass
  map entries;
- preserves continuity card order and next-pass map order;
- compares source cue ids, debrief prompt ids, follow-up map entry ids,
  path step ids, agenda section ids, prompt group ids, coverage row ids,
  handoff card ids, local anchors, evidence callbacks, gap discussion points,
  and deferred-scope reminders;
- reports static alignment and deferred-scope guardrail context without
  scores, pass/fail certification, saved state, signoff, audit retention,
  ownership, tickets, routes, exports, commands, or runnable checklists.

Option B: saved reviewer readiness state

- would add saved progress, acknowledgements, ownership, or local storage
  before the static drift contract is proven.

Option C: certification, scoring, or workflow launch

- would turn the review surface into production-readiness scoring, a signoff
  gate, a command runner, a task launcher, meeting workflow, or handoff package
  generation before a reviewer has validated the static regression map.

Recommended: start with Option A. Stage 46 should make continuity regressions
visible locally without introducing saved reviewer state, ownership, workflow,
scoring, certification, exports, commands, routing, or production handoff
semantics.

### Placement

Option A: compact drift guard panel near the Stage 45 continuity panel

- keeps regression checks next to the continuity snapshot they validate;
- lets reviewers inspect continuity-to-next-pass alignment without a route,
  saved state, export, command, checklist, signoff, score, or certification;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: global readiness or audit workspace

- would introduce broader navigation, saved state, signoff/audit semantics,
  or app-wide review workflow outside the bounded stage.

Recommended: Option A. The first drift guard should be a compact read-only
mission-console panel.

## Work Items

- add a deterministic local helper, preferably
  `frontend/src/lib/reviewObservationHandoffDriftGuard.ts`, over the Stage 45
  `ReviewObservationHandoffContinuityView`;
- define compact Stage 46 types in
  `frontend/src/features/mission-console/types.ts` for drift guard rows,
  static regression map entries, source references, summary fields, and static
  non-goal flags;
- wire the drift guard into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  45 observation handoff continuity snapshot is built, without changing
  fixture/local-live boundaries;
- surface a compact Stage 46 drift guard and static regression map panel in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 45
  continuity panel;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  46 panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationHandoffDriftGuard.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 45 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 46 artifact under
  `docs/development/artifacts/stage46-review-observation-handoff-drift-guard/`
  describing the drift contract, source files, verification commands, human
  test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 46 drift guard near the Stage 45 continuity panel;
3. confirm drift guard rows preserve Stage 45 continuity card order;
4. confirm static regression map rows preserve Stage 45 next-pass map order;
5. confirm each row shows source cue ids, debrief prompt ids, follow-up map
   entry ids, path step ids, agenda section ids, prompt group ids, coverage
   row ids, handoff card ids, local anchors, evidence callback counts, gap
   discussion point counts, deferred-scope reminder counts, source references,
   and compact non-goal context;
6. follow local anchor links and verify the page stays on the same route;
7. confirm the panel is static manual-review context only and does not become
   saved review progress, saved debrief notes, saved continuity progress,
   saved follow-up ownership, tasks, tickets, checklists, owner assignments,
   scores, ranks, certifications, exports, command runners, route changes,
   signoff, audit retention, report authoring, handoff package generation,
   meeting workflow, or persistence.

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

- focused frontend model tests proving drift guard rows derive from Stage 45
  `reviewObservationHandoffContinuity` continuity cards and next-pass map
  entries;
- assertions that drift guard row order preserves continuity card order, static
  regression map order preserves next-pass map order, and source reference
  order remains stable;
- assertions that each row carries source cue ids, debrief prompt ids,
  follow-up map entry ids, path step ids, agenda section ids, prompt group ids,
  coverage row ids, handoff card ids, local anchor hrefs, anchor target ids,
  evidence callback ids, gap discussion point ids, deferred-scope reminder ids,
  local-only flags, and static non-goal context;
- assertions that guard rows and regression map rows are local, informational,
  static, non-actionable, non-persistent, non-executable, non-routing,
  non-ranking, and non-certifying;
- view-model tests proving the drift guard connects to the existing fixture
  and local-live boundary and does not change stream behavior;
- mission-console coverage showing drift guard references render without route
  changes, saved state, command execution, exports, signoff, owner assignment,
  proof scoring, certification, meeting workflow, or runnable checklist
  semantics;
- existing Stage 45 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved drift state, saved continuity state, saved debrief notes, saved
  follow-up ownership, saved rehearsal state, saved observations, notes,
  filters, agenda answers, question answers, path progress, citation
  selections, source-map selections, boundary selections, walkthrough
  selections, storyline selections, deck selections, coverage selections,
  dry-run selections, debrief selections, review progress, local storage, or
  persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, route changes, or app-wide routing.

## Exit Criteria

- one deterministic local drift guard and static regression map is
  source-backed and visible/testable;
- drift guard rows derive from Stage 45 continuity cards, not ad hoc UI
  strings;
- static regression map rows derive from Stage 45 next-pass map entries and
  preserve source next-pass order;
- default continuity context, guard row order, regression map order, and source
  reference order remain stable;
- source cues, debrief prompts, follow-up map entries, path steps, agenda
  sections, prompt groups, coverage rows, handoff cards, local anchor hrefs,
  anchor target ids, evidence callbacks, gap discussion points, and deferred
  scope reminders are explicit and source-backed;
- guard rows and regression map rows are explanatory, static, in-page only,
  non-actionable, non-persistent, non-executable, non-routing, non-ranking, and
  non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains
  safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved notes, saved progress,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, handoff package
  generation, ownership launchers, proof scoring, certification, executable
  command automation, route changes, or app-wide navigation.
