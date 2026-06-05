# Stage 40: Review Observation Handoff Questions And Static Prompt Rail

## Goal

Turn the Stage 39 observation handoff coverage map into a deterministic local
question prompt rail so a reviewer can walk each coverage row through the
specific questions, evidence anchors, gap context, and deferred-scope reminders
needed for a manual review conversation.

This stage remains deterministic, local, read-only, fixture-first, and
non-persistent. It is not saved reviewer progress, a runnable checklist, a task
launcher, an owner assignment surface, a signoff workflow, an audit log, a
ranking model, a quality score, a certification gate, a report export, a
handoff package, command execution, app-wide routing, or deployment work.

## Decisions To Make

### Prompt Shape

Option A: deterministic local handoff question prompt rail

- derives prompt groups from Stage 39 `reviewObservationHandoffCoverage` rows,
  static gap notes, source coverage groups, and deferred-scope reminders;
- preserves Stage 39 coverage row order and uses the Stage 39 default coverage
  row as the first prompt group;
- shows source-backed review questions, local anchor references, evidence
  prompts, gap prompts, and deferred-scope reminders;
- keeps every prompt informational, local-only, non-actionable,
  non-persistent, non-executable, non-ranking, and non-certifying.

Option B: checklist, task queue, or action launcher

- would turn reviewer questions into workflow ownership, runnable tasks,
  command execution, or assignment semantics before local review has happened.

Option C: saved reviewer question state

- would add persistence, reviewer identity, saved answers, notes, or progress
  history before TelemForge has a local-only question surface.

Recommended: start with Option A. Stage 40 should help a reviewer ask better
manual questions over the completed handoff coverage map without creating task,
answer, signoff, export, score, owner, or certification semantics.

### Placement

Option A: compact prompt rail near the Stage 39 coverage map

- keeps reviewer questions next to the coverage rows and gap notes they explain;
- lets reviewers follow source anchors and deferred-scope reminders without
  opening a route or saving state;
- preserves fixture/local-live behavior and the existing mission-console flow.

Option B: app-wide question workspace

- would introduce routing, saved workspaces, and broader navigation semantics
  beyond this bounded stage.

Recommended: Option A. The first question prompt rail should be a compact
read-only mission-console surface.

## Work Items

- add a deterministic local helper, preferably
  `frontend/src/lib/reviewObservationHandoffQuestions.ts`, over
  `ReviewObservationHandoffCoverageView`;
- define compact Stage 40 types in
  `frontend/src/features/mission-console/types.ts` for prompt groups, review
  questions, evidence prompts, gap prompts, deferred-scope prompts, and a prompt
  summary;
- wire the prompt rail into
  `frontend/src/features/mission-console/consoleViewModel.ts` after the Stage
  39 observation handoff coverage map is built, without changing
  fixture/local-live boundaries;
- surface a compact Stage 40 handoff questions/static prompt rail panel in
  `frontend/src/features/mission-console/MissionConsole.tsx` near the Stage 39
  handoff coverage map;
- update `frontend/src/styles/global.css` only as needed for the compact
  Stage 40 panel;
- add focused frontend tests in
  `tests/frontend/reviewObservationHandoffQuestions.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` where needed;
- keep Stage 39 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 40 artifact under
  `docs/development/artifacts/stage40-review-observation-handoff-questions/`
  describing the prompt contract, source files, verification commands, human
  test gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 40 handoff questions/static prompt rail near the Stage 39
   coverage map;
3. confirm prompt groups preserve Stage 39 coverage row order;
4. confirm the first prompt group uses the Stage 39 default coverage row;
5. confirm each group shows source-backed review questions, local anchor
   references, evidence prompts, static gap prompts, and deferred-scope prompts;
6. confirm prompts are static manual-review context only and do not become
   saved answers, tasks, tickets, checklists, owner assignments, scores, ranks,
   certifications, exports, command runners, or saved progress;
7. follow local anchor links and verify the page stays on the same route;
8. confirm there is no saved question state, saved coverage/deck/storyline/
   walkthrough/boundary/source-map/citation selection, saved reviewer progress,
   saved observation, saved note, saved filter, reviewer identity, signoff,
   persistence, ticketing, report export, handoff package, owner assignment,
   runnable checklist, task launcher, shell panel, proof scoring, ranking,
   certification, or command runner.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved review-pass history, saved reviewer progress, saved observations,
  saved notes, saved filters, saved question answers, saved citation
  selections, saved source-map selections, saved boundary selections, saved
  walkthrough selections, saved storyline selections, saved deck selections,
  saved coverage selections, persistent notes, local storage, or saved action
  ownership;
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

- focused frontend model tests proving prompt groups derive from the Stage 39
  `reviewObservationHandoffCoverage` rows, static gap notes, source coverage
  groups, and deferred-scope reminders;
- assertions that default prompt group, prompt group order, review question
  order, evidence prompt order, gap prompt order, and deferred-scope prompt
  order remain stable;
- assertions that each group carries source summary references, source anchor
  hrefs, related coverage row ids, related gap note ids, deferred-scope ids,
  local-only flags, and non-goal context;
- assertions that prompt groups and questions are local, informational,
  non-actionable, non-persistent, non-executable, non-ranking, and
  non-certifying;
- view-model tests proving the prompt rail connects to the existing fixture and
  local-live boundary and does not change stream behavior;
- mission-console coverage showing local anchor references render without
  route changes, saved state, command execution, exports, signoff, owner
  assignment, proof scoring, certification, or runnable checklist semantics;
- existing Stage 39 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- saved observations, notes, filters, question answers, citation selections,
  source-map selections, boundary selections, walkthrough selections,
  storyline selections, deck selections, coverage selections, review progress,
  local storage, or persistence tests;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, handoff package generation,
  cloud-backed handoff primitives, ranking, scoring, certification, or deploy
  work;
- command execution UI, shell panels, task launchers, runnable checklists,
  proof scorers, owner assignment, or app-wide routing.

## Exit Criteria

- one deterministic local handoff question prompt rail is source-backed and
  visible/testable;
- prompt groups and static questions are derived from Stage 39 handoff coverage
  data, not ad hoc UI strings;
- default prompt group, prompt group order, review question order, evidence
  prompt order, gap prompt order, and deferred-scope prompt order remain stable;
- source summary references, local anchor hrefs, related coverage rows, related
  gap notes, and deferred production scope are explicit and source-backed;
- prompt groups, review questions, evidence prompts, gap prompts, and
  deferred-scope prompts are explanatory, non-actionable, non-persistent,
  non-executable, non-ranking, and non-certifying;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved review sessions,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, handoff package
  generation, ownership launchers, proof scoring, certification, executable
  command automation, or app-wide navigation.
