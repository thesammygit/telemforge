# Stage 47: Review Observation Handoff Calibration Board And Static Alignment Notes

## Goal

Turn the Stage 46 observation handoff drift guard and static regression map
into a deterministic local calibration board so a reviewer can compare the
handoff sources, local anchors, evidence callbacks, gap discussion points, and
deferred-scope boundaries as a single pre-review alignment surface.

This stage remains deterministic, local, read-only, fixture-first,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.
It is not saved reviewer notes, saved drift progress, saved calibration state,
a handoff owner plan, ticket queue, runnable checklist, task launcher, meeting
workflow, signoff record, audit trail, report export, handoff package
generator, command surface, scoring model, certification gate, deployment, or
main-branch integration.

## Decisions To Make

### Calibration Shape

Option A: deterministic local calibration board and static alignment notes

- derives calibration cards from Stage 46 drift guard rows and static
  regression map entries;
- preserves drift guard row order and regression map order;
- groups source cue ids, debrief prompt ids, follow-up map ids, path step ids,
  agenda section ids, prompt group ids, coverage row ids, handoff card ids,
  source references, local anchor hrefs, evidence callback ids, gap discussion
  point ids, and deferred-scope reminder ids into static review alignment
  notes;
- reports static source alignment, missing-context reminders, and deferred
  production boundaries without scores, pass/fail certification, saved state,
  signoff, audit retention, ownership, tickets, routes, exports, commands, or
  runnable checklists.

Option B: saved calibration notes or reviewer state

- would add persistence, editable notes, reviewer identity, local storage,
  saved progress, or saved calibration decisions before the static alignment
  contract is proven.

Option C: certification, scoring, or handoff workflow launch

- would turn the calibration surface into readiness scoring, signoff, command
  execution, task launch, meeting workflow, owner assignment, report export, or
  package generation before a reviewer validates the static alignment board.

Recommended: start with Option A. Stage 47 should make pre-review alignment
clear locally without introducing saved reviewer state, ownership, workflow,
scoring, certification, exports, commands, routing, or production handoff
semantics.

### Placement

Option A: compact calibration board near the Stage 46 drift guard panel

- keeps calibration next to the drift guard and regression map it summarizes;
- lets reviewers inspect handoff alignment without a route, saved state,
  export, command, checklist, signoff, score, or certification;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: global calibration or readiness workspace

- would introduce broader navigation, routes, saved progress, signoff/audit
  semantics, or app-wide review workflow outside the bounded stage.

Recommended: Option A. The first calibration surface should be a compact
read-only mission-console panel.

## Work Items

- add a deterministic local helper, preferably
  `frontend/src/lib/reviewObservationHandoffCalibration.ts`, over the Stage 46
  `ReviewObservationHandoffDriftGuardView`;
- define compact Stage 47 types in
  `frontend/src/features/mission-console/types.ts` for calibration cards,
  static alignment note entries, source references, summary fields, and static
  non-goal flags;
- wire the calibration board into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  46 observation handoff drift guard is built, without changing
  fixture/local-live boundaries;
- surface a compact Stage 47 calibration board and static alignment notes panel
  in `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage
  46 drift guard panel;
- update `frontend/src/styles/global.css` only as needed for the compact Stage
  47 panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationHandoffCalibration.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 46 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 47 artifact under
  `docs/development/artifacts/stage47-review-observation-handoff-calibration/`
  describing the calibration contract, source files, verification commands,
  human test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 47 calibration board near the Stage 46 drift guard panel;
3. confirm calibration card order preserves Stage 46 drift guard row order;
4. confirm static alignment note order preserves Stage 46 static regression
   map order;
5. confirm each calibration card shows source cue ids, debrief prompt ids,
   follow-up map entry ids, path step ids, agenda section ids, prompt group
   ids, coverage row ids, handoff card ids, source references, local anchor
   hrefs, anchor target ids, evidence callback counts, gap discussion point
   counts, deferred-scope reminder counts, and compact non-goal context;
6. follow local anchor links and verify the page stays on the same route;
7. confirm the panel is static manual-review context only and does not become
   saved reviewer notes, saved calibration state, saved drift state, saved
   reviewer progress, saved debrief notes, saved continuity progress, saved
   follow-up ownership, tasks, tickets, checklists, owner assignments, scores,
   ranks, certifications, exports, command runners, route changes, signoff,
   audit retention, report authoring, handoff package generation, meeting
   workflow, or persistence.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved reviewer notes, saved calibration state, saved drift state, saved
  review sessions, saved reviewer progress, saved debrief notes, saved
  continuity progress, saved follow-up progress, saved follow-up ownership,
  saved rehearsal sessions, saved dry-run progress, saved handoff path
  progress, saved agenda progress, saved observations, saved filters, saved
  answers, saved selections, persistent notes, local storage, or saved action
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

- focused frontend model tests proving calibration cards derive from Stage 46
  `reviewObservationHandoffDriftGuard` rows and static regression map entries;
- assertions that calibration card order preserves drift guard row order,
  static alignment note order preserves regression map order, and source
  reference order remains stable;
- assertions that each calibration card carries source cue ids, source debrief
  prompt ids, source follow-up map entry ids, source path step ids, source
  agenda section ids, source prompt group ids, source coverage row ids, source
  handoff card ids, source references, local anchor hrefs, anchor target ids,
  evidence callback ids, gap discussion point ids, deferred-scope reminder ids,
  local-only flags, and static non-goal context;
- assertions that calibration cards and alignment notes are local,
  informational, static, non-actionable, non-persistent, non-executable,
  non-routing, non-ranking, and non-certifying;
- view-model tests proving the calibration board connects to the existing
  fixture and local-live boundary and does not change stream behavior;
- mission-console coverage showing calibration references render without route
  changes, saved state, command execution, exports, signoff, owner assignment,
  proof scoring, certification, meeting workflow, or runnable checklist
  semantics;
- existing Stage 46 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved calibration notes, saved drift state, saved continuity state, saved
  debrief notes, saved follow-up ownership, saved rehearsal state, saved
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
  proof scorers, owner assignment, route changes, or app-wide routing.

## Exit Criteria

- one deterministic local calibration board and static alignment note surface
  is source-backed and visible/testable;
- calibration cards derive from Stage 46 drift guard rows, not ad hoc UI
  strings;
- static alignment note entries derive from Stage 46 static regression map
  entries and preserve source regression order;
- default calibration context, calibration card order, alignment note order,
  and source reference order remain stable;
- source cues, debrief prompts, follow-up map entries, path steps, agenda
  sections, prompt groups, coverage rows, handoff cards, source references,
  local anchor hrefs, anchor target ids, evidence callbacks, gap discussion
  points, and deferred scope reminders are explicit and source-backed;
- calibration cards and alignment notes are explanatory, static, in-page only,
  non-actionable, non-persistent, non-executable, non-routing, non-ranking,
  and non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains
  safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved notes, saved progress,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, handoff package
  generation, ownership launchers, proof scoring, certification, executable
  command automation, route changes, or app-wide navigation.
