# Stage 52: Review Observation Handoff Source Readout And Static Review Cues

## Goal

Turn the Stage 51 observation handoff source walkthrough and static review
prompts into a deterministic local source readout so a reviewer can scan the
source-backed walkthrough sections, review cues, evidence callbacks, gap
discussion points, and deferred-scope reminders as one compact in-page
handoff-readiness view before human review.

This stage remains deterministic, local, read-only, fixture-first,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It is not saved reviewer notes, saved source readout progress, saved source
walkthrough progress, saved source inspection state, saved anchor state, saved
relay progress, handoff ownership, ticketing, runnable checklists, task
launchers, meeting workflow, signoff, audit retention, report export, handoff
package generation, command execution, scoring, certification, deployment, or
main-branch integration.

## Decisions To Make

### Source Readout Shape

Option A: deterministic local source readout and static review cues

- derives ordered source readout rows from Stage 51 source walkthrough sections;
- derives static review cue rows from Stage 51 static review prompts;
- preserves Stage 51 walkthrough section order and static review prompt order;
- carries source walkthrough section ids, source crosswalk row ids, relay step
  ids, source inspection reference ids, source kinds, source ids, source
  labels, local anchor hrefs, anchor target ids, source synthesis row ids,
  calibration card ids, alignment note ids, cue ids, debrief prompt ids,
  follow-up map entry ids, path step ids, agenda section ids, prompt group ids,
  coverage row ids, handoff card ids, evidence callback ids, gap discussion
  point ids, deferred-scope reminder ids, and static non-goal flags into a
  compact reviewer readout;
- reports local-only source readout context without scores, pass/fail
  certification, saved state, signoff, audit retention, ownership, tickets,
  routes, exports, commands, or runnable checklists.

Option B: saved source readout progress or editable reviewer notes

- would add persistence, editable notes, reviewer identity, local storage,
  saved readout state, saved walkthrough state, saved source inspection state,
  saved anchor state, or saved relay progress before the static readout
  contract is proven.

Option C: handoff workflow, task launch, or review scoring

- would turn the readout into production workflow, owner assignment, signoff,
  audit state, command execution, task launch, meeting workflow, ranking,
  scoring, certification, report export, or package generation before a
  reviewer validates the local source readout.

Recommended: start with Option A. Stage 52 should make the completed source
walkthrough easier to scan as a readout without introducing saved reviewer
state, ownership, workflow, scoring, certification, exports, commands, routing,
or production handoff semantics.

### Placement

Option A: compact source readout near the Stage 51 source walkthrough

- keeps review cues next to the source walkthrough sections and static prompts
  they summarize;
- lets reviewers follow source-backed anchors without a route, saved state,
  export, command, checklist, signoff, score, or certification;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: separate source review route or handoff workspace

- would introduce broader navigation, routes, saved progress, signoff/audit
  semantics, or app-wide source review workflow outside the bounded stage.

Recommended: Option A. The first source readout should be a compact read-only
mission-console panel.

## Work Items

- add a deterministic local helper, preferably
  `frontend/src/lib/reviewObservationHandoffSourceReadout.ts`, over the Stage
  51 `ReviewObservationHandoffSourceWalkthroughView`;
- define compact Stage 52 types in
  `frontend/src/features/mission-console/types.ts` for source readout rows,
  static review cue rows, readout summary fields, and static non-goal flags;
- wire the source readout into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  51 source walkthrough is built, without changing fixture/local-live
  boundaries;
- surface a compact Stage 52 source readout and static review cues panel in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 51
  source walkthrough;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  52 panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationHandoffSourceReadout.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 51 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 52 artifact under
  `docs/development/artifacts/stage52-review-observation-handoff-source-readout/`
  describing the source readout contract, source files, verification commands,
  human test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 52 source readout near the Stage 51 source walkthrough;
3. confirm source readout row order preserves Stage 51 walkthrough section
   order;
4. confirm static review cue order preserves Stage 51 static review prompt
   order;
5. confirm each source readout row shows source walkthrough section id, source
   crosswalk row id, relay step id, source inspection references, source
   kinds, source ids, labels, local anchor hrefs, anchor target ids, source
   synthesis row ids, calibration card ids, alignment note ids, cue ids,
   debrief prompt ids, follow-up map entry ids, path step ids, agenda section
   ids, prompt group ids, coverage row ids, handoff card ids, evidence
   callback counts, gap discussion point counts, deferred-scope reminder
   counts, and compact non-goal context;
6. follow local anchor links and verify the page stays on the same route;
7. confirm the panel is static manual-review context only and does not become
   saved reviewer notes, saved source readout progress, saved source
   walkthrough progress, saved source inspection state, saved anchor state,
   saved relay progress, route changes, exports, signoff, audit retention,
   scoring, certification, owner assignment, meeting workflow, handoff package
   generation, runnable checklist, task launcher, or command execution.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved reviewer notes, saved source readout progress, saved source
  walkthrough progress, saved source inspection state, saved anchor state,
  saved relay progress, saved inspection state, saved synthesis state, saved
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

- focused frontend model tests proving source readout rows derive from Stage 51
  source walkthrough sections and static review prompts;
- assertions that source readout row order preserves walkthrough section order,
  static review cue order preserves static review prompt order, and
  source/anchor reference order remains stable;
- assertions that each readout row carries source walkthrough section ids,
  source crosswalk row ids, relay step ids, source inspection reference ids,
  source kinds, source ids, source labels, local anchor hrefs, anchor target
  ids, source synthesis row ids, source calibration card ids, source alignment
  note ids, source cue ids, source debrief prompt ids, source follow-up map
  entry ids, source path step ids, source agenda section ids, source prompt
  group ids, source coverage row ids, source handoff card ids, evidence
  callback ids, gap discussion point ids, deferred-scope reminder ids,
  local-only flags, and static non-goal context;
- assertions that source readout rows and static review cues are local,
  informational, static, non-actionable, non-persistent, non-executable,
  non-routing, non-ranking, and non-certifying;
- view-model tests proving the source readout connects to the existing fixture
  and local-live boundary and does not change stream behavior;
- mission-console coverage showing source/anchor references render without
  route changes, saved state, command execution, exports, signoff, owner
  assignment, proof scoring, certification, meeting workflow, handoff package
  generation, or runnable checklist semantics;
- existing Stage 51 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved source readout progress, saved source walkthrough progress, saved
  source inspection state, saved anchor state, saved relay progress, saved
  inspection state, saved synthesis state, saved calibration notes, saved drift
  state, saved continuity state, saved debrief notes, saved follow-up
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

- one deterministic local source readout and static review cue surface is
  source-backed and visible/testable;
- source readout rows derive from Stage 51 source walkthrough sections and
  static review prompts, not ad hoc UI strings;
- static review cue rows derive from Stage 51 static review prompts and
  preserve prompt order;
- default source walkthrough context, source readout row order, static review
  cue order, and source/anchor reference order remain stable;
- source walkthrough sections, source crosswalk rows, relay steps, source
  inspection references, source kinds, source ids, source labels, local anchor
  hrefs, anchor target ids, synthesis rows, calibration cards, alignment notes,
  cues, debrief prompts, follow-up map entries, path steps, agenda sections,
  prompt groups, coverage rows, handoff cards, evidence callbacks, gap
  discussion points, and deferred scope reminders are explicit and
  source-backed;
- source readout rows and static review cues are explanatory, static, in-page
  only, non-actionable, non-persistent, non-executable, non-routing,
  non-ranking, and non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved notes, saved readout
  progress, saved walkthrough progress, persistence, identity, collaboration,
  external ticketing, production signoff, deploy/release, audit retention,
  report/export authoring, handoff package generation, ownership launchers,
  proof scoring, certification, executable command automation, route changes,
  or app-wide navigation.
