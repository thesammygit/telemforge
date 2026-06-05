# Stage 38: Review Observation Handoff Deck And Static Review Path

## Goal

Turn the Stage 37 observation storyline into a deterministic local handoff deck
and static review path that helps a human reviewer walk the source-backed
observation evidence in a clear order before any saved review session, report
export, signoff, scoring, or production handoff exists.

This stage remains deterministic, local, read-only, fixture-first, and
non-persistent. It is not saved reviewer progress, review-session history,
handoff package export, report authoring, reviewer identity, signoff, audit log,
owner assignment, task launcher, runnable checklist, proof scorer, ranking
model, certification gate, command runner, routing shell, or deployment step.

## Decisions To Make

### Handoff Shape

Option A: deterministic local observation handoff deck

- derives static deck cards and review-path checkpoints from the Stage 37
  `reviewObservationStoryline` segments, default opening, source-stage evidence
  groups, static guardrail references, and prior surface references;
- preserves Stage 37 segment order and uses the Stage 37 default opening as the
  deterministic first deck card;
- shows what a human should inspect first, which in-page anchors prove the
  observation path, which source stages support it, and which guardrails keep
  the review local-only;
- keeps every card and checkpoint local-only, informational, non-actionable,
  non-persistent, non-executable, non-ranking, and non-certifying.

Option B: saved review session or handoff report

- would introduce saved progress, reviewer identity, persistent notes, report
  authoring, export packages, or handoff files before the static review path is
  proven.

Option C: readiness score, rank, or certification

- would convert observation evidence into quality scores, ranks, approvals, or
  production-readiness gates that TelemForge is intentionally deferring.

Recommended: start with Option A. Stage 38 should make the completed storyline
easier for a human to rehearse and review without creating workflow state,
export state, approval state, ownership state, scoring, or certification.

### Placement

Option A: compact handoff deck panel near the Stage 37 observation storyline

- keeps the review path adjacent to the storyline segments it summarizes;
- lets reviewers inspect the default deck card, ordered checkpoints, supporting
  source stages, guardrail reminders, and prior surfaces without opening a new
  route or saving state;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: app-wide review handoff route

- would add routing, saved filters, or broader navigation semantics beyond this
  stage.

Recommended: Option A. The first observation handoff deck should be a compact
read-only surface inside the mission console.

## Work Items

- add a deterministic local helper, preferably
  `frontend/src/lib/reviewObservationHandoffDeck.ts`, over
  `ReviewObservationStorylineView`;
- define compact Stage 38 types in
  `frontend/src/features/mission-console/types.ts` for handoff deck cards,
  review-path checkpoints, source-stage prompts, guardrail reminders, prior
  surface prompts, default review context, and a deck summary;
- wire the handoff deck into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  37 observation storyline is built, without changing fixture/local-live
  boundaries;
- surface a compact Stage 38 observation handoff deck/static review path panel
  in `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage
  37 observation storyline;
- update `frontend/src/styles/global.css` only as needed for the compact
  handoff deck panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationHandoffDeck.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 37 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 38 artifact under
  `docs/development/artifacts/stage38-review-observation-handoff-deck/`
  describing the deck contract, source files, verification commands, human test
  gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 38 observation handoff deck near the Stage 37 observation
   storyline;
3. confirm handoff deck cards are derived from Stage 37 storyline data, not ad
   hoc UI strings;
4. confirm the default handoff card uses the Stage 37 default opening and all
   deck cards preserve Stage 37 storyline segment order;
5. confirm each card shows source summary, local anchor references, related
   observation rows, source-stage prompts, guardrail reminders, and prior
   review-surface prompts;
6. confirm review-path checkpoints remain local manual-review context only;
7. confirm local anchors remain in-page references and do not create routes or
   saved navigation state;
8. confirm there is no saved deck selection, saved storyline selection, saved
   reviewer progress, saved observation, saved note, saved filter, reviewer
   identity, signoff, persistence, ticketing, report export, handoff package,
   owner assignment, runnable checklist, task launcher, shell panel, proof
   scoring, ranking, certification, or command runner.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved review-pass history, saved reviewer progress, saved observations,
  saved notes, saved filters, saved citation selections, saved source-map
  selections, saved boundary selections, saved walkthrough selections, saved
  storyline selections, saved deck selections, persistent notes, local storage,
  or saved action ownership;
- no reviewer signoff workflow, audit retention, approval identity, production
  readiness scoring, proof scoring, quality scoring, ranking, or certification;
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

- focused frontend model tests proving handoff deck cards derive from the Stage
  37 `reviewObservationStoryline` segments, default opening,
  source-stage evidence groups, static guardrail references, and prior surface
  references;
- assertions that default card, deck card order, checkpoint order,
  source-stage prompt order, guardrail reminder order, and prior-surface prompt
  order remain stable;
- assertions that each card carries source summary, source anchor hrefs,
  related observation row ids, related source stages, static guardrail
  reference ids, prior surface prompt ids, local-only flags, and non-goal
  context;
- assertions that cards and checkpoints are local, informational,
  non-actionable, non-persistent, non-executable, non-ranking, and
  non-certifying;
- view-model tests proving the handoff deck connects to the existing fixture
  and local-live boundary and does not change stream behavior;
- mission-console coverage showing local anchor references render without
  route changes, saved state, command execution, exports, signoff, owner
  assignment, proof scoring, certification, or runnable checklist semantics;
- existing Stage 37 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved observations, notes, filters, citation selections, source-map
  selections, boundary selections, walkthrough selections, storyline
  selections, deck selections, review progress, local storage, or persistence
  tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, or app-wide routing.

## Exit Criteria

- one deterministic local observation handoff deck is source-backed and
  visible/testable;
- deck cards and review-path checkpoints are derived from Stage 37 storyline
  data, not ad hoc UI strings;
- default handoff card, deck card order, checkpoint order, source-stage prompt
  order, guardrail reminder order, and prior-surface prompt order remain
  stable;
- source summary, source anchor hrefs, related observations, related source
  stages, static guardrail reminders, and prior review-surface prompts are
  explicit and source-backed;
- review-path checkpoints, source-stage prompts, guardrail reminders, and
  prior-surface prompts are explanatory, non-actionable, non-persistent,
  non-executable, non-ranking, and non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved review sessions,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, handoff package
  generation, ownership launchers, proof scoring, certification, executable
  command automation, or app-wide navigation.
