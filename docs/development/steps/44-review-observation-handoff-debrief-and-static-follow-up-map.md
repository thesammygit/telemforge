# Stage 44: Review Observation Handoff Debrief And Static Follow-Up Map

## Goal

Turn the Stage 43 observation handoff dry-run cue sheet into a deterministic
local debrief and follow-up map so a reviewer can inspect what the rehearsal
would leave behind, which source cues and anchors support each debrief prompt,
and which deferred production semantics remain intentionally out of scope.

This stage remains deterministic, local, read-only, fixture-first,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It is not saved debrief notes, saved rehearsal progress, saved follow-up
ownership, a ticket queue, meeting workflow, owner-assigned action plan,
signoff record, audit trail, report export, handoff package generator, command
surface, scoring model, certification gate, deployment, or main-branch
integration.

## Decisions To Make

### Debrief Shape

Option A: deterministic local debrief and follow-up map

- derives debrief prompts and follow-up map rows from Stage 43 dry-run cues and
  cue-to-anchor coverage entries;
- preserves Stage 43 cue order and default cue context;
- groups each prompt around source cue ids, source path step ids, local
  anchors, evidence callbacks, gap discussion points, deferred-scope reminders,
  and static non-goal context;
- keeps every prompt informational, local-only, static, non-actionable,
  non-persistent, non-executable, non-routing, non-ranking, and
  non-certifying.

Option B: saved debrief notes or follow-up assignments

- would add saved notes, owners, action state, local storage, or persistence
  before the static debrief contract is proven.

Option C: meeting workflow or report package

- would add workflow semantics, exports, handoff package generation, signoff,
  or audit retention before a reviewer has validated the static debrief map.

Recommended: start with Option A. Stage 44 should make the Stage 43 dry run
easier to inspect after rehearsal without turning it into saved notes,
owner-assigned tasks, meeting management, exports, scoring, certification, or
workflow state.

### Placement

Option A: compact debrief panel near the Stage 43 dry-run cue sheet

- keeps the debrief map next to the cue sheet and anchors it summarizes;
- lets reviewers inspect cue-to-follow-up coverage without opening a route or
  saving state;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: global handoff debrief workspace

- would introduce app-wide navigation, routes, saved progress, and broader
  handoff workflow semantics outside the bounded stage.

Recommended: Option A. The first debrief surface should be a compact read-only
mission-console panel.

## Work Items

- add a deterministic local helper, preferably
  `frontend/src/lib/reviewObservationHandoffDebrief.ts`, over the Stage 43
  `ReviewObservationHandoffDryRunView`;
- define compact Stage 44 types in
  `frontend/src/features/mission-console/types.ts` for debrief prompts,
  cue-backed follow-up map entries, source references, summary fields, and
  static non-goal flags;
- wire the debrief into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  43 observation handoff dry run is built, without changing fixture/local-live
  boundaries;
- surface a compact Stage 44 debrief and follow-up map panel in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 43
  dry-run cue sheet;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  44 panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationHandoffDebrief.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 43 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 44 artifact under
  `docs/development/artifacts/stage44-review-observation-handoff-debrief/`
  describing the debrief contract, source files, verification commands, human
  test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 44 handoff debrief and follow-up map near the Stage 43
   dry-run cue sheet;
3. confirm debrief prompt order preserves Stage 43 dry-run cue order;
4. confirm the default debrief prompt uses the Stage 43 default cue;
5. confirm each prompt shows source cue ids, source path step ids, source
   agenda section ids, local anchor targets, evidence callback counts, gap
   discussion point counts, deferred-scope reminder counts, and compact
   non-goal context;
6. confirm follow-up map rows derive from Stage 43 cue-to-anchor coverage
   entries and preserve source coverage order;
7. follow local anchor links and verify the page stays on the same route;
8. confirm the panel is static manual-review context only and does not become
   saved debrief notes, saved rehearsal progress, saved follow-up ownership,
   saved answers, saved selections, tasks, tickets, checklists, owner
   assignments, scores, ranks, certifications, exports, command runners,
   route changes, signoff, audit retention, report authoring, handoff package
   generation, meeting workflow, or persistence.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved debrief notes, saved rehearsal sessions, saved dry-run progress,
  saved follow-up progress, saved handoff path progress, saved agenda progress,
  saved reviewer progress, saved observations, saved filters, saved answers,
  saved selections, persistent notes, local storage, or saved action
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

- focused frontend model tests proving debrief prompts derive from the Stage 43
  `reviewObservationHandoffDryRun` cues and cue-to-anchor coverage entries;
- assertions that default debrief prompt, prompt order, follow-up map order,
  and source reference order remain stable;
- assertions that each prompt carries source cue ids, source path step ids,
  source agenda section ids, source prompt group ids, source coverage row ids,
  source handoff card ids, local anchor hrefs, anchor target ids, evidence
  callback ids, gap and deferred-scope reminder ids, local-only flags, and
  static non-goal context;
- assertions that debrief prompts and follow-up map rows are local,
  informational, static, non-actionable, non-persistent, non-executable,
  non-routing, non-ranking, and non-certifying;
- view-model tests proving the debrief connects to the existing fixture and
  local-live boundary and does not change stream behavior;
- mission-console coverage showing debrief and follow-up references render
  without route changes, saved state, command execution, exports, signoff,
  owner assignment, proof scoring, certification, meeting workflow, or
  runnable checklist semantics;
- existing Stage 43 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved debrief notes, saved follow-up ownership, saved rehearsal state, saved
  observations, notes, filters, agenda answers, question answers, path
  progress, citation selections, source-map selections, boundary selections,
  walkthrough selections, storyline selections, deck selections, coverage
  selections, dry-run selections, review progress, local storage, or
  persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, route changes, or app-wide routing.

## Exit Criteria

- one deterministic local debrief and follow-up map is source-backed and
  visible/testable;
- debrief prompts derive from Stage 43 dry-run cues, not ad hoc UI strings;
- follow-up map rows derive from Stage 43 cue-to-anchor coverage entries and
  preserve source coverage order;
- default debrief prompt, prompt order, follow-up map order, and source
  reference order remain stable;
- source cues, path steps, agenda sections, prompt groups, coverage rows,
  handoff cards, local anchor hrefs, anchor target ids, evidence callbacks,
  gap discussion points, and deferred-scope reminders are explicit and
  source-backed;
- debrief prompts and follow-up map rows are explanatory, static, in-page only,
  non-actionable, non-persistent, non-executable, non-routing, non-ranking, and
  non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved notes, saved progress,
  persistence, identity, collaboration, external ticketing, production
  signoff, deploy/release, audit retention, report/export authoring, handoff
  package generation, ownership launchers, proof scoring, certification,
  executable command automation, route changes, or app-wide navigation.
