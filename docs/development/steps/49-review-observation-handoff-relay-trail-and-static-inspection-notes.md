# Stage 49: Review Observation Handoff Relay Trail And Static Inspection Notes

## Goal

Turn the Stage 48 observation handoff synthesis map and static relay notes into
a deterministic local relay trail so a reviewer can walk each handoff thread in
order, inspect the source-backed anchors, and understand which evidence
callbacks, gap discussion points, and deferred-scope reminders should be
checked before a human review handoff.

This stage remains deterministic, local, read-only, fixture-first,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It is not saved reviewer notes, saved synthesis state, saved relay progress,
saved inspection state, handoff ownership, ticketing, runnable checklists, task
launchers, meeting workflow, signoff, audit retention, report export, handoff
package generation, command execution, scoring, certification, deployment, or
main-branch integration.

## Decisions To Make

### Relay Trail Shape

Option A: deterministic local relay trail and static inspection notes

- derives ordered relay steps from Stage 48 synthesis rows;
- derives static inspection notes from Stage 48 static relay note entries;
- preserves Stage 48 synthesis row order and static relay note order;
- carries source calibration card ids, alignment note ids, cue ids, debrief
  prompt ids, follow-up map ids, path step ids, agenda section ids, prompt
  group ids, coverage row ids, handoff card ids, source references, local
  anchors, evidence callback ids, gap discussion point ids, and deferred-scope
  reminder ids into a compact reviewer inspection trail;
- reports local-only inspection context without scores, pass/fail
  certification, saved state, signoff, audit retention, ownership, tickets,
  routes, exports, commands, or runnable checklists.

Option B: saved relay progress or editable reviewer notes

- would add persistence, editable notes, reviewer identity, local storage,
  saved inspection state, or saved relay progress before the static relay
  trail contract is proven.

Option C: readiness scoring, owner assignment, or handoff workflow

- would turn the relay trail into production-readiness scoring, signoff,
  audit state, command execution, task launch, meeting workflow, owner
  assignment, report export, or package generation before a reviewer validates
  the local trail.

Recommended: start with Option A. Stage 49 should make the handoff relay
walkable in-page without introducing saved reviewer state, ownership,
workflow, scoring, certification, exports, commands, routing, or production
handoff semantics.

### Placement

Option A: compact relay trail near the Stage 48 synthesis map

- keeps the inspection trail next to the synthesis rows and relay notes it
  summarizes;
- lets reviewers walk source-backed anchors without a route, saved state,
  export, command, checklist, signoff, score, or certification;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: separate review workspace or global handoff route

- would introduce broader navigation, routes, saved progress, signoff/audit
  semantics, or app-wide review workflow outside the bounded stage.

Recommended: Option A. The first relay trail should be a compact read-only
mission-console panel.

## Work Items

- add a deterministic local helper, preferably
  `frontend/src/lib/reviewObservationHandoffRelayTrail.ts`, over the Stage 48
  `ReviewObservationHandoffSynthesisView`;
- define compact Stage 49 types in
  `frontend/src/features/mission-console/types.ts` for relay trail steps,
  static inspection note entries, source inspection references, summary fields,
  and static non-goal flags;
- wire the relay trail into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  48 observation handoff synthesis map is built, without changing
  fixture/local-live boundaries;
- surface a compact Stage 49 relay trail and static inspection notes panel in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 48
  synthesis map;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  49 panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationHandoffRelayTrail.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 48 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 49 artifact under
  `docs/development/artifacts/stage49-review-observation-handoff-relay-trail/`
  describing the relay trail contract, source files, verification commands,
  human test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 49 relay trail near the Stage 48 synthesis map;
3. confirm relay step order preserves Stage 48 synthesis row order;
4. confirm static inspection note order preserves Stage 48 relay note order;
5. confirm each relay step shows source calibration card ids, alignment note
   ids, cue ids, debrief prompt ids, follow-up map entry ids, path step ids,
   agenda section ids, prompt group ids, coverage row ids, handoff card ids,
   source references, local anchor hrefs, anchor target ids, evidence callback
   counts, gap discussion point counts, deferred-scope reminder counts, and
   compact non-goal context;
6. follow local anchor links and verify the page stays on the same route;
7. confirm the panel is static manual-review context only and does not become
   saved reviewer notes, saved relay progress, saved inspection state, saved
   synthesis state, saved calibration state, saved drift state, route changes,
   exports, signoff, audit retention, scoring, certification, owner
   assignment, meeting workflow, handoff package generation, runnable
   checklist, task launcher, or command execution.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved reviewer notes, saved relay progress, saved inspection state, saved
  synthesis state, saved calibration state, saved drift state, saved review
  sessions, saved reviewer progress, saved debrief notes, saved continuity
  progress, saved follow-up progress, saved follow-up ownership, saved
  rehearsal sessions, saved dry-run progress, saved handoff path progress,
  saved agenda progress, saved observations, saved filters, saved answers,
  saved selections, persistent notes, local storage, or saved action ownership;
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

- focused frontend model tests proving relay trail steps derive from Stage 48
  `reviewObservationHandoffSynthesis` rows and static relay notes;
- assertions that relay step order preserves synthesis row order, static
  inspection note order preserves relay note order, and source inspection
  reference order remains stable;
- assertions that each relay step carries source calibration card ids, source
  alignment note ids, source cue ids, source debrief prompt ids, source
  follow-up map entry ids, source path step ids, source agenda section ids,
  source prompt group ids, source coverage row ids, source handoff card ids,
  source references, local anchor hrefs, anchor target ids, evidence callback
  ids, gap discussion point ids, deferred-scope reminder ids, local-only flags,
  and static non-goal context;
- assertions that relay steps and static inspection notes are local,
  informational, static, non-actionable, non-persistent, non-executable,
  non-routing, non-ranking, and non-certifying;
- view-model tests proving the relay trail connects to the existing fixture and
  local-live boundary and does not change stream behavior;
- mission-console coverage showing relay trail references render without route
  changes, saved state, command execution, exports, signoff, owner assignment,
  proof scoring, certification, meeting workflow, handoff package generation,
  or runnable checklist semantics;
- existing Stage 48 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved relay progress, saved inspection state, saved synthesis state, saved
  calibration notes, saved drift state, saved continuity state, saved debrief
  notes, saved follow-up ownership, saved rehearsal state, saved observations,
  notes, filters, agenda answers, question answers, path progress, citation
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

- one deterministic local relay trail and static inspection note surface is
  source-backed and visible/testable;
- relay steps derive from Stage 48 synthesis rows, not ad hoc UI strings;
- static inspection note entries derive from Stage 48 static relay notes and
  preserve source relay order;
- default relay trail context, relay step order, inspection note order, and
  source inspection reference order remain stable;
- source calibration cards, alignment notes, cues, debrief prompts, follow-up
  map entries, path steps, agenda sections, prompt groups, coverage rows,
  handoff cards, source references, local anchor hrefs, anchor target ids,
  evidence callbacks, gap discussion points, and deferred scope reminders are
  explicit and source-backed;
- relay steps and static inspection notes are explanatory, static, in-page
  only, non-actionable, non-persistent, non-executable, non-routing,
  non-ranking, and non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved notes, saved progress,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, handoff package
  generation, ownership launchers, proof scoring, certification, executable
  command automation, route changes, or app-wide navigation.
