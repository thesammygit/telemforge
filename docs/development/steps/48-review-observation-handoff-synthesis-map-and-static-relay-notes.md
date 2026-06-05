# Stage 48: Review Observation Handoff Synthesis Map And Static Relay Notes

## Goal

Turn the Stage 47 observation handoff calibration board and static alignment
notes into a deterministic local synthesis map so a reviewer can see which
calibration cards, alignment notes, source references, local anchors, evidence
callbacks, gap prompts, and deferred-scope reminders form each handoff relay
thread before review.

This stage remains deterministic, local, read-only, fixture-first,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It is not saved reviewer notes, saved calibration state, saved synthesis state,
saved drift progress, handoff ownership, ticketing, runnable checklists, task
launchers, meeting workflow, signoff, audit retention, report export, handoff
package generation, command execution, scoring, certification, deployment, or
main-branch integration.

## Decisions To Make

### Synthesis Shape

Option A: deterministic local handoff synthesis map and static relay notes

- derives synthesis rows from Stage 47 calibration cards and static alignment
  notes;
- preserves calibration-card order and alignment-note order;
- groups source cue ids, debrief prompt ids, follow-up map ids, path step ids,
  agenda section ids, prompt group ids, coverage row ids, handoff card ids,
  source references, local anchor hrefs, evidence callback ids, gap discussion
  point ids, and deferred-scope reminder ids into static relay threads;
- reports review relay context, source coverage, and deferred production
  boundaries without scores, pass/fail certification, saved state, signoff,
  audit retention, ownership, tickets, routes, exports, commands, or runnable
  checklists.

Option B: saved synthesis notes or reviewer state

- would add persistence, editable notes, reviewer identity, local storage,
  saved progress, or saved synthesis decisions before the static relay contract
  is proven.

Option C: scoring, certification, or handoff package generation

- would turn the synthesis surface into readiness scoring, signoff, audit
  state, command execution, task launch, meeting workflow, owner assignment,
  report export, or package generation before a reviewer validates the static
  local synthesis map.

Recommended: start with Option A. Stage 48 should make handoff relay context
clear locally without introducing saved reviewer state, ownership, workflow,
scoring, certification, exports, commands, routing, or production handoff
semantics.

### Placement

Option A: compact synthesis map near the Stage 47 calibration board

- keeps the synthesis next to the calibration cards and alignment notes it
  summarizes;
- lets reviewers inspect handoff relay threads without a route, saved state,
  export, command, checklist, signoff, score, or certification;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: separate review workspace or global handoff route

- would introduce broader navigation, routes, saved progress, signoff/audit
  semantics, or app-wide review workflow outside the bounded stage.

Recommended: Option A. The first synthesis surface should be a compact
read-only mission-console panel.

## Work Items

- add a deterministic local helper, preferably
  `frontend/src/lib/reviewObservationHandoffSynthesis.ts`, over the Stage 47
  `ReviewObservationHandoffCalibrationView`;
- define compact Stage 48 types in
  `frontend/src/features/mission-console/types.ts` for synthesis rows, static
  relay note entries, source crosswalk references, summary fields, and static
  non-goal flags;
- wire the synthesis map into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  47 observation handoff calibration board is built, without changing
  fixture/local-live boundaries;
- surface a compact Stage 48 synthesis map and static relay notes panel in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 47
  calibration board;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  48 panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationHandoffSynthesis.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 47 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 48 artifact under
  `docs/development/artifacts/stage48-review-observation-handoff-synthesis/`
  describing the synthesis contract, source files, verification commands,
  human test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 48 synthesis map near the Stage 47 calibration board;
3. confirm synthesis row order preserves Stage 47 calibration card order;
4. confirm static relay note order preserves Stage 47 alignment note order;
5. confirm each synthesis row shows source cue ids, debrief prompt ids,
   follow-up map entry ids, path step ids, agenda section ids, prompt group ids,
   coverage row ids, handoff card ids, source references, local anchor hrefs,
   anchor target ids, evidence callback counts, gap discussion point counts,
   deferred-scope reminder counts, and compact non-goal context;
6. follow local anchor links and verify the page stays on the same route;
7. confirm the panel is static manual-review context only and does not become
   saved reviewer notes, saved synthesis state, saved calibration state, saved
   drift state, saved reviewer progress, tasks, tickets, checklists, owner
   assignments, scores, ranks, certifications, exports, command runners, route
   changes, signoff, audit retention, report authoring, handoff package
   generation, meeting workflow, or persistence.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved reviewer notes, saved synthesis state, saved calibration state,
  saved drift state, saved review sessions, saved reviewer progress, saved
  debrief notes, saved continuity progress, saved follow-up progress, saved
  follow-up ownership, saved rehearsal sessions, saved dry-run progress, saved
  handoff path progress, saved agenda progress, saved observations, saved
  filters, saved answers, saved selections, persistent notes, local storage, or
  saved action ownership;
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

- focused frontend model tests proving synthesis rows derive from Stage 47
  `reviewObservationHandoffCalibration` calibration cards and static alignment
  notes;
- assertions that synthesis row order preserves calibration card order, static
  relay note order preserves alignment note order, and source crosswalk order
  remains stable;
- assertions that each synthesis row carries source cue ids, source debrief
  prompt ids, source follow-up map entry ids, source path step ids, source
  agenda section ids, source prompt group ids, source coverage row ids, source
  handoff card ids, source references, local anchor hrefs, anchor target ids,
  evidence callback ids, gap discussion point ids, deferred-scope reminder ids,
  local-only flags, and static non-goal context;
- assertions that synthesis rows and relay notes are local, informational,
  static, non-actionable, non-persistent, non-executable, non-routing,
  non-ranking, and non-certifying;
- view-model tests proving the synthesis map connects to the existing fixture
  and local-live boundary and does not change stream behavior;
- mission-console coverage showing synthesis references render without route
  changes, saved state, command execution, exports, signoff, owner assignment,
  proof scoring, certification, meeting workflow, handoff package generation,
  or runnable checklist semantics;
- existing Stage 47 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved synthesis state, saved calibration notes, saved drift state, saved
  continuity state, saved debrief notes, saved follow-up ownership, saved
  rehearsal state, saved observations, notes, filters, agenda answers, question
  answers, path progress, citation selections, source-map selections, boundary
  selections, walkthrough selections, storyline selections, deck selections,
  coverage selections, dry-run selections, debrief selections, review progress,
  local storage, or persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, route changes, or app-wide routing.

## Exit Criteria

- one deterministic local synthesis map and static relay note surface is
  source-backed and visible/testable;
- synthesis rows derive from Stage 47 calibration cards, not ad hoc UI strings;
- static relay note entries derive from Stage 47 static alignment notes and
  preserve source alignment order;
- default synthesis context, synthesis row order, relay note order, and source
  crosswalk order remain stable;
- source cues, debrief prompts, follow-up map entries, path steps, agenda
  sections, prompt groups, coverage rows, handoff cards, source references,
  local anchor hrefs, anchor target ids, evidence callbacks, gap discussion
  points, and deferred scope reminders are explicit and source-backed;
- synthesis rows and relay notes are explanatory, static, in-page only,
  non-actionable, non-persistent, non-executable, non-routing, non-ranking, and
  non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved notes, saved progress,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, handoff package
  generation, ownership launchers, proof scoring, certification, executable
  command automation, route changes, or app-wide navigation.
