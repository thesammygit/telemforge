# Stage 39: Review Observation Handoff Coverage And Static Gap Map

## Goal

Turn the Stage 38 observation handoff deck into a deterministic local handoff
coverage map and static gap ledger so a reviewer can see whether each handoff
card has source summaries, local anchors, source-stage prompts, guardrail
reminders, prior-surface prompts, related observations, and explicit deferred
scope before any saved review session, signoff, scoring, export, or production
handoff exists.

This stage remains deterministic, local, read-only, fixture-first, and
non-persistent. It is not saved reviewer progress, a report export, a handoff
package, a signoff workflow, an audit log, an owner assignment surface, a
runnable checklist, a quality score, a ranking model, a certification gate, a
command runner, app-wide routing, or deployment work.

## Decisions To Make

### Coverage Shape

Option A: deterministic local handoff coverage map

- derives coverage rows from Stage 38 `reviewObservationHandoffDeck` cards,
  review-path checkpoints, source-stage prompts, guardrail reminders, and prior
  surface prompts;
- preserves Stage 38 deck card order and uses the Stage 38 default handoff card
  as the first coverage row;
- shows explicit coverage flags, source-backed local anchor references,
  prompt/reminder counts, related observation row ids, and static gap notes;
- keeps every gap note informational, local-only, non-actionable,
  non-persistent, non-executable, non-ranking, and non-certifying.

Option B: readiness score, quality grade, or certification gate

- would turn coverage into scoring, approval, certification, or production
  readiness semantics before a human has reviewed the static handoff path.

Option C: saved review-progress tracker

- would add persistence, reviewer identity, saved card state, saved notes, or
  progress history before TelemForge has a local-only coverage surface.

Recommended: start with Option A. Stage 39 should help a reviewer inspect
coverage and deferred scope without turning the handoff deck into workflow
state, scorekeeping, certification, report export, or production handoff.

### Placement

Option A: compact coverage/gap panel near the Stage 38 handoff deck

- keeps coverage next to the deck cards it audits;
- lets reviewers inspect coverage flags, gap notes, source anchors, and
  deferred-scope reminders without opening a route or saving state;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: app-wide coverage dashboard

- would introduce routing and broader navigation semantics beyond this bounded
  stage.

Recommended: Option A. The first handoff coverage map should be a compact
read-only mission-console surface.

## Work Items

- add a deterministic local helper, preferably
  `frontend/src/lib/reviewObservationHandoffCoverage.ts`, over
  `ReviewObservationHandoffDeckView`;
- define compact Stage 39 types in
  `frontend/src/features/mission-console/types.ts` for coverage rows, gap
  notes, source coverage groups, deferred-scope reminders, and a coverage
  summary;
- wire the coverage map into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  38 observation handoff deck is built, without changing fixture/local-live
  boundaries;
- surface a compact Stage 39 handoff coverage/static gap map panel in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 38
  handoff deck;
- update `frontend/src/styles/global.css` only as needed for the compact
  Stage 39 panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationHandoffCoverage.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 38 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 39 artifact under
  `docs/development/artifacts/stage39-review-observation-handoff-coverage/`
  describing the coverage contract, source files, verification commands, human
  test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 39 handoff coverage/static gap map near the Stage 38 handoff
   deck;
3. confirm coverage rows preserve Stage 38 handoff card order;
4. confirm the first coverage row uses the Stage 38 default handoff card;
5. confirm each row shows source-summary, local-anchor, source-stage prompt,
   guardrail reminder, prior-surface prompt, related observation, and deferred
   scope coverage;
6. confirm gap notes are static manual-review context only and do not become
   tasks, tickets, checklists, owner assignments, scores, ranks,
   certifications, exports, command runners, or saved progress;
7. follow local anchor links and verify the page stays on the same route;
8. confirm there is no saved coverage state, saved deck selection, saved
   reviewer progress, saved observation, saved note, saved filter, reviewer
   identity, signoff, persistence, ticketing, report export, handoff package,
   owner assignment, runnable checklist, task launcher, shell panel, proof
   scoring, ranking, certification, or command runner.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved review-pass history, saved reviewer progress, saved observations,
  saved notes, saved filters, saved citation selections, saved source-map
  selections, saved boundary selections, saved walkthrough selections, saved
  storyline selections, saved deck selections, saved coverage selections,
  persistent notes, local storage, or saved action ownership;
- no reviewer signoff workflow, audit retention, approval identity,
  production-readiness scoring, proof scoring, quality scoring, ranking, or
  certification;
- no external ticketing, messaging, email, workflow integrations, owner
  assignment, task launcher, queue ownership, or runnable checklist behavior;
- no cloud services, telemetry upload, paid APIs, browser-cookie import, or
  external network calls;
- no deploy/release/publish work;
- no production evidence archive or database migration;
- no report designer, downloadable styled report system, free-form export
  builder, report package writer, handoff report exports, handoff package
  writer, or production handoff package;
- no executable command runner, shell automation panel, proof scorer,
  production gate, or shell command UI;
- no broad frontend redesign, new routing shell, or app-wide navigation system;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused frontend model tests proving coverage rows derive from the Stage 38
  `reviewObservationHandoffDeck` cards, default review context, checkpoints,
  source-stage prompts, guardrail reminders, prior-surface prompts, and static
  non-goal contexts;
- assertions that default coverage row, coverage row order, source coverage
  group order, gap note order, and deferred-scope reminder order remain stable;
- assertions that each row carries source summary coverage, source anchor hrefs,
  related observation row ids, prompt/reminder ids, static gap notes,
  local-only flags, and non-goal context;
- assertions that coverage rows and gap notes are local, informational,
  non-actionable, non-persistent, non-executable, non-ranking, and
  non-certifying;
- view-model tests proving the coverage map connects to the existing fixture
  and local-live boundary and does not change stream behavior;
- mission-console coverage showing local anchor references render without
  route changes, saved state, command execution, exports, signoff, owner
  assignment, proof scoring, certification, or runnable checklist semantics;
- existing Stage 38 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved observations, notes, filters, citation selections, source-map
  selections, boundary selections, walkthrough selections, storyline
  selections, deck selections, coverage selections, review progress, local
  storage, or persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, or app-wide routing.

## Exit Criteria

- one deterministic local handoff coverage map is source-backed and
  visible/testable;
- coverage rows and static gap notes are derived from Stage 38 handoff deck
  data, not ad hoc UI strings;
- default coverage row, coverage row order, source coverage group order, gap
  note order, and deferred-scope reminder order remain stable;
- source-summary coverage, local anchor hrefs, related observations,
  source-stage prompts, guardrail reminders, prior-surface prompts, and
  deferred production scope are explicit and source-backed;
- coverage rows, gap notes, source coverage groups, and deferred-scope
  reminders are explanatory, non-actionable, non-persistent, non-executable,
  non-ranking, and non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved review sessions,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, handoff package
  generation, ownership launchers, proof scoring, certification, executable
  command automation, or app-wide navigation.
