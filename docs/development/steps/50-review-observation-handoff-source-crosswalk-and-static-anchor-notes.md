# Stage 50: Review Observation Handoff Source Crosswalk And Static Anchor Notes

## Goal

Turn the Stage 49 observation handoff relay trail and static inspection notes
into a deterministic local source crosswalk so a reviewer can inspect which
relay steps, source inspection references, local anchors, evidence callbacks,
gap discussion points, and deferred-scope reminders connect each handoff source
before a human review handoff.

This stage remains deterministic, local, read-only, fixture-first,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It is not saved reviewer notes, saved relay progress, saved source inspection
state, saved anchor state, saved synthesis state, saved calibration state,
saved drift state, handoff ownership, ticketing, runnable checklists, task
launchers, meeting workflow, signoff, audit retention, report export, handoff
package generation, command execution, scoring, certification, deployment, or
main-branch integration.

## Decisions To Make

### Source Crosswalk Shape

Option A: deterministic local source crosswalk and static anchor notes

- derives ordered source crosswalk rows from Stage 49 relay steps and source
  inspection references;
- derives static anchor note rows from Stage 49 static inspection notes and
  their local anchors;
- preserves Stage 49 relay step order and static inspection note order;
- carries source synthesis row ids, relay step ids, source inspection reference
  ids, source kinds, source ids, source labels, local anchor hrefs, anchor
  target ids, source calibration card ids, alignment note ids, cue ids, debrief
  prompt ids, follow-up map ids, path step ids, agenda section ids, prompt
  group ids, coverage row ids, handoff card ids, evidence callback ids, gap
  discussion point ids, deferred-scope reminder ids, and static non-goal flags
  into a compact reviewer source crosswalk;
- reports local-only source/anchor context without scores, pass/fail
  certification, saved state, signoff, audit retention, ownership, tickets,
  routes, exports, commands, or runnable checklists.

Option B: saved source inspection state or editable anchor notes

- would add persistence, editable notes, reviewer identity, local storage,
  saved source inspection state, saved anchor state, or saved relay progress
  before the static crosswalk contract is proven.

Option C: source quality scoring, owner assignment, or handoff workflow

- would turn the crosswalk into production-readiness scoring, source quality
  ranking, signoff, audit state, command execution, task launch, meeting
  workflow, owner assignment, report export, or package generation before a
  reviewer validates the local crosswalk.

Recommended: start with Option A. Stage 50 should make the relay trail's source
and anchor relationships inspectable in-page without introducing saved reviewer
state, ownership, workflow, scoring, certification, exports, commands, routing,
or production handoff semantics.

### Placement

Option A: compact source crosswalk near the Stage 49 relay trail

- keeps source and anchor inspection context next to the relay steps and static
  inspection notes it summarizes;
- lets reviewers follow source-backed anchors without a route, saved state,
  export, command, checklist, signoff, score, or certification;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: separate source review workspace or global source route

- would introduce broader navigation, routes, saved progress, signoff/audit
  semantics, or app-wide source review workflow outside the bounded stage.

Recommended: Option A. The first source crosswalk should be a compact read-only
mission-console panel.

## Work Items

- add a deterministic local helper, preferably
  `frontend/src/lib/reviewObservationHandoffSourceCrosswalk.ts`, over the Stage
  49 `ReviewObservationHandoffRelayTrailView`;
- define compact Stage 50 types in
  `frontend/src/features/mission-console/types.ts` for source crosswalk rows,
  static anchor note rows, source/anchor summary fields, and static non-goal
  flags;
- wire the source crosswalk into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  49 relay trail is built, without changing fixture/local-live boundaries;
- surface a compact Stage 50 source crosswalk and static anchor notes panel in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 49
  relay trail;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  50 panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationHandoffSourceCrosswalk.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 49 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 50 artifact under
  `docs/development/artifacts/stage50-review-observation-handoff-source-crosswalk/`
  describing the source crosswalk contract, source files, verification
  commands, human test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 50 source crosswalk near the Stage 49 relay trail;
3. confirm source crosswalk row order preserves Stage 49 relay step order;
4. confirm static anchor note order preserves Stage 49 static inspection note
   order;
5. confirm each source crosswalk row shows the source synthesis row id, relay
   step id, source inspection references, source kinds, source ids, labels,
   local anchor hrefs, anchor target ids, source calibration card ids,
   alignment note ids, cue ids, debrief prompt ids, follow-up map entry ids,
   path step ids, agenda section ids, prompt group ids, coverage row ids,
   handoff card ids, evidence callback counts, gap discussion point counts,
   deferred-scope reminder counts, and compact non-goal context;
6. follow local anchor links and verify the page stays on the same route;
7. confirm the panel is static manual-review context only and does not become
   saved reviewer notes, saved relay progress, saved source inspection state,
   saved anchor state, saved synthesis state, saved calibration state, saved
   drift state, route changes, exports, signoff, audit retention, scoring,
   certification, owner assignment, meeting workflow, handoff package
   generation, runnable checklist, task launcher, or command execution.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved reviewer notes, saved relay progress, saved source inspection state,
  saved anchor state, saved inspection state, saved synthesis state, saved
  calibration state, saved drift state, saved review sessions, saved reviewer
  progress, saved debrief notes, saved continuity progress, saved follow-up
  progress, saved follow-up ownership, saved rehearsal sessions, saved dry-run
  progress, saved handoff path progress, saved agenda progress, saved
  observations, saved filters, saved answers, saved selections, persistent
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

- focused frontend model tests proving source crosswalk rows derive from Stage
  49 relay steps and source inspection references;
- assertions that source crosswalk row order preserves relay step order, static
  anchor note order preserves static inspection note order, and source/anchor
  reference order remains stable;
- assertions that each crosswalk row carries source synthesis row ids, relay
  step ids, source inspection reference ids, source kinds, source ids, source
  labels, local anchor hrefs, anchor target ids, source calibration card ids,
  source alignment note ids, source cue ids, source debrief prompt ids, source
  follow-up map entry ids, source path step ids, source agenda section ids,
  source prompt group ids, source coverage row ids, source handoff card ids,
  evidence callback ids, gap discussion point ids, deferred-scope reminder ids,
  local-only flags, and static non-goal context;
- assertions that source crosswalk rows and static anchor notes are local,
  informational, static, non-actionable, non-persistent, non-executable,
  non-routing, non-ranking, and non-certifying;
- view-model tests proving the source crosswalk connects to the existing
  fixture and local-live boundary and does not change stream behavior;
- mission-console coverage showing source/anchor references render without
  route changes, saved state, command execution, exports, signoff, owner
  assignment, proof scoring, certification, meeting workflow, handoff package
  generation, or runnable checklist semantics;
- existing Stage 49 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved source inspection state, saved anchor state, saved relay progress,
  saved inspection state, saved synthesis state, saved calibration notes, saved
  drift state, saved continuity state, saved debrief notes, saved follow-up
  ownership, saved rehearsal state, saved observations, notes, filters, agenda
  answers, question answers, path progress, citation selections, source-map
  selections, boundary selections, walkthrough selections, storyline
  selections, deck selections, coverage selections, dry-run selections, debrief
  selections, review progress, local storage, or persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, route changes, or app-wide routing.

## Exit Criteria

- one deterministic local source crosswalk and static anchor note surface is
  source-backed and visible/testable;
- source crosswalk rows derive from Stage 49 relay steps and source inspection
  references, not ad hoc UI strings;
- static anchor note rows derive from Stage 49 static inspection notes and
  preserve source inspection note order;
- default relay trail context, crosswalk row order, static anchor note order,
  and source/anchor reference order remain stable;
- source synthesis rows, relay steps, source inspection references, source
  kinds, source ids, source labels, local anchor hrefs, anchor target ids,
  calibration cards, alignment notes, cues, debrief prompts, follow-up map
  entries, path steps, agenda sections, prompt groups, coverage rows, handoff
  cards, evidence callbacks, gap discussion points, and deferred scope
  reminders are explicit and source-backed;
- source crosswalk rows and static anchor notes are explanatory, static,
  in-page only, non-actionable, non-persistent, non-executable, non-routing,
  non-ranking, and non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved notes, saved source
  inspection progress, saved anchor progress, persistence, identity,
  collaboration, external ticketing, production signoff, deploy/release, audit
  retention, report/export authoring, handoff package generation, ownership
  launchers, proof scoring, certification, executable command automation, route
  changes, or app-wide navigation.
