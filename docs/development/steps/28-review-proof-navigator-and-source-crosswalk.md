# Stage 28: Review Proof Navigator And Source Crosswalk

## Goal

Turn the Stage 27 local proof packets into a deterministic review proof
navigator and source crosswalk. A reviewer should be able to scan all proof
packets, see the recommended local inspection order, compare packet source
chains, and understand which static references explain each packet without
saving selections or executing commands.

This stage remains read-only, local, deterministic, non-persistent, and
non-executing. It is not a saved reviewer workspace, proof packet selection
store, progress tracker, report authoring system, handoff export, signoff
workflow, audit trail, owner queue, ticket launcher, shell panel, command
runner, runnable checklist, or production handoff service.

## Decisions To Make

### Navigator Shape

Option A: deterministic local proof navigator

- derives navigator rows only from the Stage 27 proof packet model;
- orders unresolved local proof gap packets before ready local evidence and
  deferred production scope;
- shows the default packet, packet rank, packet status, source coverage row ids,
  trace ids, evidence target ids, proof bucket labels, proof command ids, and
  static human gate step ids;
- groups packets into static review lanes so a reviewer knows what to inspect
  first without storing a selected packet;
- keeps every command reference as repo-relative text and never executes it.

Option B: saved packet selection workspace

- would add durable packet selection, reviewer progress, identity, notes,
  signoff, audit semantics, and persistence before the navigation contract is
  proven.

Option C: report or handoff package

- would cross into report authoring, package writing, production handoff
  services, export retention, or certification before the local navigator is
  useful.

Recommended: start with Option A. Stage 28 should make local proof packet
inspection order clear without adding state, exports, or execution controls.

### Source Crosswalk Boundary

Option A: static source crosswalk

- links proof packets back to Stage 27 packet ids, Stage 26 priority rows, Stage
  25 coverage rows, Stage 24 trace rows, evidence target ids, proof commands,
  and static human gate steps;
- highlights gaps that are local proof gaps versus deferred production
  boundaries;
- summarizes the source chain in non-certifying local text.

Option B: interactive command runner or checklist

- would introduce command execution, checklist state, shell automation, progress
  semantics, and a broader safety surface.

Recommended: Option A. The first crosswalk should improve manual inspection
clarity, not automate or certify the inspection.

## Work Items

- add a deterministic local proof navigator helper, preferably
  `frontend/src/lib/reviewProofNavigator.ts`, over the Stage 27 proof packet
  model;
- define compact Stage 28 types in
  `frontend/src/features/mission-console/types.ts` for navigator rows, review
  lanes, source crosswalk rows, static inspection prompts, command references,
  and deferred boundary markers;
- wire the proof navigator into
  `frontend/src/features/mission-console/consoleViewModel.ts` without changing
  fixture/local-live boundaries;
- surface a compact Stage 28 proof navigator and source crosswalk in
  `frontend/src/features/mission-console/MissionConsole.tsx`, near the Stage 27
  proof packet panel;
- update `frontend/src/styles/global.css` only as needed for the compact panel;
- add focused frontend tests in a new
  `tests/frontend/reviewProofNavigator.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` for the new view-model shape;
- keep Stage 27 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 28 artifact under
  `docs/development/artifacts/stage28-review-proof-navigator/` describing the
  navigator contract, source files, verification commands, human test gate, and
  deferred production features.

## Human Test Gate

A reviewer should be able to:

1. inspect the Stage 27 proof packet panel and identify the default packet;
2. open the Stage 28 proof navigator derived from the Stage 27 packet set;
3. confirm navigator rows are derived from Stage 27 proof packets, not ad hoc UI
   strings;
4. confirm unresolved local proof gap packets are ordered before ready local
   evidence and deferred production scope;
5. see packet ids, priority row ids, coverage row ids, trace ids, evidence
   target ids, proof bucket labels, proof command ids, static human gate step
   ids, and deferred boundary notes;
6. use the source crosswalk to compare which packet owns each source chain
   segment;
7. inspect static local prompts without executable command controls;
8. confirm deferred production scope remains visible, non-actionable, and
   non-certifying;
9. complete the review without saved packet selections, saved proof selections,
   saved filters, saved progress, reviewer identity, signoff, persistence,
   ticketing, report export, owner assignment, runnable checklists, task
   launchers, shell panels, or command-runner controls.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved review-pass history, saved reviewer progress, persistent notes,
  local note storage, saved trace selections, saved coverage filters, saved
  priority filters, saved proof selections, saved proof packet selections,
  saved navigator selections, or saved action ownership;
- no reviewer signoff workflow, audit retention, approval identity, or
  production readiness certification;
- no external ticketing, messaging, email, workflow integrations, owner
  assignment, or task launcher;
- no cloud services, telemetry upload, paid APIs, browser-cookie import, or
  external network calls;
- no deploy/release/publish work;
- no production evidence archive or database migration;
- no report designer, downloadable styled report system, free-form export
  builder, report package writer, handoff report exports, or production handoff
  package;
- no executable command runner, shell automation panel, runnable checklist, or
  production gate;
- no broad frontend redesign or new routing shell;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused frontend model tests proving navigator rows are derived from Stage 27
  proof packets;
- assertions that the default navigator row follows the Stage 27 default proof
  packet;
- assertions that unresolved local proof gap packets rank before ready local
  evidence and deferred production scope;
- assertions that packet ids, priority row ids, coverage row ids, trace ids,
  evidence target ids, proof bucket labels, proof command ids, static human gate
  step ids, and deferred boundary notes remain visible;
- assertions that source crosswalk rows are local, source-backed,
  informational, non-certifying, and non-executable;
- view-model tests proving the navigator is connected to the Stage 27 proof
  packet model and does not change fixture/local-live boundaries;
- mission-console coverage showing the navigator and source crosswalk are
  visible without a broad redesign;
- existing Stage 27 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- editable state, saved navigator selections, saved packet selections, saved
  filters, saved proof selections, saved progress, local storage, or persistence
  tests before the local navigator contract exists;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, cloud-backed handoff primitives,
  or deploy work;
- command execution UI, shell panels, task launchers, runnable checklists, or
  owner assignment.

## Exit Criteria

- one deterministic local proof navigator model is source-backed and
  visible/testable;
- navigator rows are derived from Stage 27 proof packets, not ad hoc UI strings;
- the default navigator row follows the Stage 27 default proof packet;
- unresolved local proof gaps, ready local evidence, deferred production scope,
  packet ids, priority row ids, coverage row ids, trace ids, evidence target
  ids, proof buckets, proof commands, static human gate steps, and deferred
  boundary context are explicit;
- source crosswalk references remain local, source-backed, repo-relative,
  non-executable, informational, and non-certifying;
- mission-console UI exposes the navigator without a broad redesign;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved review progress,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, ownership launchers,
  or executable command automation.
