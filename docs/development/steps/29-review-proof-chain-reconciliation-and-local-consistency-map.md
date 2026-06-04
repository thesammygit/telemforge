# Stage 29: Review Proof Chain Reconciliation And Local Consistency Map

## Goal

Turn the Stage 28 proof navigator and source crosswalk into a deterministic
local proof-chain reconciliation map. A reviewer should be able to scan each
navigator row, see whether its packet, priority, coverage, trace, outcome,
readiness, resolution, action, command, and static gate references line up, and
understand which gaps are local inspection gaps versus deferred production
boundaries.

This stage remains read-only, local, deterministic, non-persistent, and
non-executing. It is not a saved reviewer workspace, proof selection store,
progress tracker, command runner, runnable checklist, report authoring system,
handoff export, certification workflow, signoff flow, audit trail, owner queue,
ticket launcher, or production handoff service.

## Decisions To Make

### Reconciliation Shape

Option A: deterministic local proof-chain reconciliation

- derives reconciliation rows only from the Stage 28 proof navigator and source
  crosswalk model;
- groups references by proof packet, source chain segment, and boundary type;
- highlights complete local chains, local inspection gaps, and deferred
  production boundaries without scoring or certifying readiness;
- preserves all Stage 28 navigator row ids, packet ids, source priority row ids,
  coverage row ids, trace row ids, outcome row ids, readiness row ids,
  resolution ids, action ids, evidence target ids, proof command ids, static
  human gate step ids, static prompt ids, and deferred boundary marker ids;
- keeps every command reference as repo-relative text and never executes it.

Option B: saved reconciliation workspace

- would add durable reviewer progress, selected rows, notes, identity, signoff,
  audit semantics, persistence, and ownership before the local proof chain is
  trustworthy.

Option C: generated report or handoff export

- would cross into report authoring, package writing, production handoff
  services, export retention, or certification before the local reconciliation
  map is useful.

Recommended: start with Option A. Stage 29 should make source-chain continuity
clear while keeping the interface static, local, non-certifying, and
non-executing.

### Consistency Map Boundary

Option A: compact local consistency map

- summarizes which navigator rows have a complete local chain, which rows need
  static local inspection, and which rows are deferred production boundaries;
- shows the source chain segment labels and repo-relative static references a
  reviewer should inspect;
- keeps local gap language informational and non-certifying.

Option B: automated checklist, command launcher, or proof scorer

- would introduce execution controls, checklist state, saved progress, scoring,
  and a broader safety surface.

Recommended: Option A. The first consistency map should improve manual review
clarity, not automate or certify the review.

## Work Items

- add a deterministic local proof-chain reconciliation helper, preferably
  `frontend/src/lib/reviewProofReconciliation.ts`, over the Stage 28 proof
  navigator model;
- define compact Stage 29 types in
  `frontend/src/features/mission-console/types.ts` for reconciliation rows,
  chain segment summaries, local consistency buckets, static review references,
  and deferred boundary notes;
- wire the reconciliation map into
  `frontend/src/features/mission-console/consoleViewModel.ts` without changing
  fixture/local-live boundaries;
- surface a compact Stage 29 proof-chain reconciliation and local consistency
  map in `frontend/src/features/mission-console/MissionConsole.tsx`, near the
  Stage 28 proof navigator panel;
- update `frontend/src/styles/global.css` only as needed for the compact panel;
- add focused frontend tests in a new
  `tests/frontend/reviewProofReconciliation.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` for the new view-model shape;
- keep Stage 28 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 29 artifact under
  `docs/development/artifacts/stage29-review-proof-reconciliation/` describing
  the reconciliation contract, source files, verification commands, human test
  gate, and deferred production features.

## Human Test Gate

A reviewer should be able to:

1. inspect the Stage 28 proof navigator and identify the default navigator row;
2. open the Stage 29 reconciliation map derived from the Stage 28 navigator;
3. confirm reconciliation rows are derived from Stage 28 navigator rows, not ad
   hoc UI strings;
4. confirm each row preserves packet ids, priority row ids, coverage row ids,
   trace row ids, outcome row ids, readiness row ids, resolution ids, action
   ids, evidence target ids, proof command ids, static human gate step ids,
   static prompt ids, and deferred boundary marker ids;
5. confirm complete local chains, local inspection gaps, and deferred production
   boundaries are visually distinct but informational only;
6. compare chain segment summaries across packets without executing commands;
7. inspect repo-relative static review references without executable controls;
8. confirm deferred production scope remains visible, non-actionable, and
   non-certifying;
9. complete the review without saved reconciliation selections, saved proof
   selections, saved navigator selections, saved filters, saved progress,
   reviewer identity, signoff, persistence, ticketing, report export, owner
   assignment, runnable checklists, task launchers, shell panels, proof scoring,
   or command-runner controls.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved review-pass history, saved reviewer progress, persistent notes,
  saved trace selections, saved coverage filters, saved priority filters, saved
  proof selections, saved proof packet selections, saved navigator selections,
  saved reconciliation selections, saved consistency filters, or saved action
  ownership;
- no reviewer signoff workflow, audit retention, approval identity, production
  readiness scoring, or certification;
- no external ticketing, messaging, email, workflow integrations, owner
  assignment, task launcher, or queue ownership;
- no cloud services, telemetry upload, paid APIs, browser-cookie import, or
  external network calls;
- no deploy/release/publish work;
- no production evidence archive or database migration;
- no report designer, downloadable styled report system, free-form export
  builder, report package writer, handoff report exports, or production handoff
  package;
- no executable command runner, shell automation panel, runnable checklist, proof
  scorer, or production gate;
- no broad frontend redesign or new routing shell;
- no main-branch fast-forward unless a maintainer separately approves
  integration.

## Test Preference

Favor:

- focused frontend model tests proving reconciliation rows are derived from
  Stage 28 navigator rows;
- assertions that the default reconciliation row follows the Stage 28 default
  navigator row;
- assertions that complete local chains, local inspection gaps, and deferred
  production boundaries are bucketed distinctly without certification language;
- assertions that source packet ids, priority row ids, coverage row ids, trace
  row ids, outcome row ids, readiness row ids, resolution ids, action ids,
  evidence target ids, proof command ids, static human gate step ids, static
  prompt ids, and deferred boundary marker ids remain visible;
- assertions that static review references are local, repo-relative,
  informational, non-executable, and non-certifying;
- view-model tests proving the reconciliation map is connected to the Stage 28
  navigator and does not change fixture/local-live boundaries;
- mission-console coverage showing the reconciliation map is visible without a
  broad redesign;
- existing Stage 28 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- editable state, saved reconciliation selections, saved navigator selections,
  saved packet selections, saved filters, saved proof selections, saved
  progress, local storage, or persistence tests before the local reconciliation
  contract exists;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, cloud-backed handoff primitives,
  scoring, certification, or deploy work;
- command execution UI, shell panels, task launchers, runnable checklists, proof
  scorers, or owner assignment.

## Exit Criteria

- one deterministic local proof-chain reconciliation model is source-backed and
  visible/testable;
- reconciliation rows are derived from Stage 28 proof navigator rows, not ad hoc
  UI strings;
- the default reconciliation row follows the Stage 28 default navigator row;
- complete local chains, local inspection gaps, deferred production scope,
  packet ids, priority row ids, coverage row ids, trace row ids, outcome row
  ids, readiness row ids, resolution ids, action ids, evidence target ids, proof
  commands, static gate steps, static prompts, and deferred boundary context are
  explicit;
- static review references remain local, source-backed, repo-relative,
  non-executable, informational, and non-certifying;
- mission-console UI exposes the reconciliation map without a broad redesign;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved review progress,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, ownership launchers,
  proof scoring, certification, or executable command automation.
