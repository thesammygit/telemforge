# Stage 54: Review Observation Handoff Source Readiness Rehearsal And Static Reviewer Prompts

## Goal

Turn the Stage 53 observation handoff source readiness board and static review
checks into a deterministic local reviewer prompt rehearsal surface so a
reviewer can walk the ordered source readiness rows, matched static checks,
anchors, evidence callbacks, gap discussion prompts, and deferred-scope
reminders as static review context before human handoff.

This stage remains deterministic, local, read-only, fixture-first,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It is not saved reviewer notes, saved source readiness rehearsal progress,
saved source readiness progress, saved source readout progress, saved source
walkthrough progress, saved source inspection state, saved anchor state, saved
relay progress, handoff ownership, ticketing, runnable checklists, task
launchers, meeting workflow, signoff, audit retention, report export, handoff
package generation, command execution, scoring, certification, deployment, or
main-branch integration.

## Decisions To Make

### Rehearsal Shape

Option A: deterministic local source readiness rehearsal prompts

- derives rehearsal prompt rows from Stage 53 source readiness rows;
- derives static reviewer prompt checks from Stage 53 static review checks;
- preserves Stage 53 source readiness row order and static review check order;
- carries source readiness row ids, source readout row ids, source walkthrough
  section ids, source crosswalk row ids, relay step ids, source inspection
  reference ids, local anchor hrefs, anchor target ids, evidence callback ids,
  gap discussion point ids, deferred-scope reminder ids, matched static review
  check ids, static review cue ids, and compact non-goal reminders into a
  prompt rehearsal board;
- reports local-only rehearsal context without pass/fail certification, scores,
  saved state, signoff, audit retention, ownership, tickets, routes, exports,
  commands, meeting workflow, or runnable checklist behavior.

Option B: saved rehearsal progress or editable reviewer notes

- would add persistence, reviewer identity, local storage, saved rehearsal
  state, saved readiness state, saved readout state, saved walkthrough state,
  saved source inspection state, saved anchor state, or saved relay progress
  before the static rehearsal contract is proven.

Option C: workflow launch, task ownership, or scoring

- would turn the rehearsal prompts into production workflow, owner assignment,
  signoff, audit state, command execution, task launch, meeting workflow,
  ranking, scoring, certification, report export, or package generation before
  a reviewer validates the local prompt surface.

Recommended: start with Option A. Stage 54 should make the completed source
readiness board easier to rehearse in a human review without introducing saved
reviewer state, ownership, workflow, scoring, certification, exports, commands,
routing, or production handoff semantics.

### Placement

Option A: compact rehearsal prompt panel near the Stage 53 source readiness
board

- keeps static reviewer prompts next to the source readiness rows and checks
  they derive from;
- lets reviewers walk source anchors, callbacks, gaps, and deferred-scope
  reminders without a route, saved state, export, command, checklist, signoff,
  score, meeting workflow, or certification;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: separate rehearsal route or review workspace

- would introduce broader navigation, routes, saved progress, signoff/audit
  semantics, meeting workflow, or app-wide source review workflow outside the
  bounded stage.

Recommended: Option A. The first source readiness rehearsal should be a compact
read-only mission-console panel.

## Work Items

- add a deterministic local helper, preferably
  `frontend/src/lib/reviewObservationHandoffSourceReadinessRehearsal.ts`, over
  the Stage 53 `ReviewObservationHandoffSourceReadinessView`;
- define compact Stage 54 types in
  `frontend/src/features/mission-console/types.ts` for readiness rehearsal
  prompt rows, static reviewer prompt check rows, summary fields, and static
  non-goal flags;
- wire the rehearsal prompt board into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  53 source readiness board is built, without changing fixture/local-live
  boundaries;
- surface a compact Stage 54 readiness rehearsal/static reviewer prompts panel
  in `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage
  53 source readiness board;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  54 panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationHandoffSourceReadinessRehearsal.test.ts`
  and update `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 53 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 54 artifact under
  `docs/development/artifacts/stage54-review-observation-handoff-source-readiness-rehearsal/`
  describing the rehearsal contract, source files, verification commands,
  human test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 54 source readiness rehearsal panel near the Stage 53 source
   readiness board;
3. confirm rehearsal prompt row order preserves Stage 53 source readiness row
   order;
4. confirm static reviewer prompt check order preserves Stage 53 static review
   check order;
5. confirm each rehearsal prompt row shows source readiness row id, source
   readout row id, source walkthrough section id, source crosswalk row id,
   relay step id, source inspection references, local anchor hrefs, anchor
   target ids, evidence callback counts, gap discussion point counts,
   deferred-scope reminder counts, matched static review checks, and compact
   non-goal context;
6. follow local anchor links and verify the page stays on the same route;
7. confirm the panel is static manual-review rehearsal context only and does
   not become saved reviewer notes, saved rehearsal progress, saved source
   readiness progress, saved source readout progress, saved source walkthrough
   progress, saved source inspection state, saved anchor state, saved relay
   progress, route changes, exports, signoff, audit retention, scoring,
   certification, owner assignment, meeting workflow, handoff package
   generation, runnable checklist, task launcher, or command execution.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved reviewer notes, saved source readiness rehearsal progress, saved
  source readiness progress, saved source readout progress, saved source
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

- focused frontend model tests proving rehearsal prompts derive from Stage 53
  source readiness rows and static review checks;
- assertions that rehearsal prompt row order preserves source readiness row
  order, static reviewer prompt check order preserves static review check
  order, and source/anchor reference order remains stable;
- assertions that each prompt carries source readiness row ids, source readout
  row ids, source walkthrough section ids, source crosswalk row ids, relay step
  ids, source inspection reference ids, local anchor hrefs, anchor target ids,
  evidence callback ids, gap discussion point ids, deferred-scope reminder ids,
  matched static review check ids, static review cue ids, local-only flags, and
  static non-goal context;
- assertions that rehearsal prompts and static reviewer prompt checks are
  local, informational, static, non-actionable, non-persistent, non-executable,
  non-routing, non-ranking, and non-certifying;
- view-model tests proving the rehearsal surface connects to the existing
  fixture and local-live boundary and does not change stream behavior;
- mission-console coverage showing source/anchor references render without
  route changes, saved state, command execution, exports, signoff, owner
  assignment, proof scoring, certification, meeting workflow, handoff package
  generation, or runnable checklist semantics;
- existing Stage 53 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved rehearsal progress, saved source readiness progress, saved source
  readout progress, saved source walkthrough progress, saved source inspection
  state, saved anchor state, saved relay progress, saved inspection state,
  saved synthesis state, saved calibration notes, saved drift state, saved
  continuity state, saved debrief notes, saved follow-up ownership, saved
  observations, notes, filters, agenda answers, question answers, path
  progress, citation selections, source-map selections, boundary selections,
  walkthrough selections, storyline selections, deck selections, coverage
  selections, dry-run selections, debrief selections, review progress, local
  storage, or persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, route changes, app-wide routing, or meeting
  workflow.

## Exit Criteria

- one deterministic local source readiness rehearsal and static reviewer prompt
  surface is source-backed and visible/testable;
- rehearsal prompts derive from Stage 53 source readiness rows and static
  review checks, not ad hoc UI strings;
- static reviewer prompt checks derive from Stage 53 static review checks and
  preserve check order;
- default source readiness context, prompt row order, static check order, and
  source/anchor reference order remain stable;
- source readiness rows, source readout rows, source walkthrough sections,
  source crosswalk rows, relay steps, source inspection references, local
  anchor hrefs, anchor target ids, evidence callbacks, gap discussion points,
  deferred-scope reminders, matched static review checks, and static review
  cues are explicit and source-backed;
- rehearsal prompts and static reviewer prompt checks are explanatory, static,
  in-page only, non-actionable, non-persistent, non-executable, non-routing,
  non-ranking, and non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved notes, saved rehearsal
  progress, saved readiness progress, saved readout progress, saved walkthrough
  progress, persistence, identity, collaboration, external ticketing,
  production signoff, deploy/release, audit retention, report/export authoring,
  handoff package generation, ownership launchers, proof scoring,
  certification, executable command automation, route changes, app-wide
  navigation, or meeting workflow.
