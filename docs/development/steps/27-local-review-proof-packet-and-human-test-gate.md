# Stage 27: Local Review Proof Packet And Human Test Gate

## Goal

Turn the Stage 26 proof priority radar into a deterministic local proof packet
and human test gate. A reviewer should be able to open the default priority row,
inspect the source evidence chain, see the expected local proof observations,
and follow a static human inspection gate without saving progress or executing
commands.

This stage remains read-only, local, deterministic, non-persistent, and
non-executing. It is not a saved reviewer workspace, report authoring system,
handoff export, signoff workflow, audit trail, owner queue, ticket launcher,
shell panel, command runner, runnable checklist, or production handoff service.

## Decisions To Make

### Proof Packet Shape

Option A: deterministic local proof packet

- derives proof packets only from the Stage 26 priority rows and static radar;
- builds one default packet from the highest-priority unresolved local proof row;
- preserves source coverage row ids, trace ids, outcome ids, readiness ids,
  resolution ids, matrix row ids, action ids, evidence target ids, proof bucket
  labels, proof command ids, static review step ids, and deferred boundary
  notes;
- labels each expected observation as local, source-backed, and non-certifying;
- keeps command references as static repo-relative text and never executes them.

Option B: saved proof-review workspace

- would add durable progress, saved packet selections, reviewer identity, notes,
  signoff, audit semantics, and persistence before the local packet contract is
  proven.

Option C: generated handoff/report package

- would cross into report authoring, export packaging, production handoff
  services, or downloadable artifacts before the local human test gate is clear.

Recommended: start with Option A. Stage 27 should make the first local proof
inspection understandable without storing state, exporting reports, or launching
work.

### Human Test Gate Boundary

Option A: static human inspection gate

- shows the reviewer what to inspect, which source ids support it, what a local
  proof observation should contain, and which production boundaries remain
  deferred;
- is represented as non-executable view-model data and UI text;
- keeps the gate informational and non-certifying.

Option B: runnable checklist or shell console

- would introduce command execution, task launching, progress state, operational
  control semantics, and a broader safety surface.

Recommended: Option A. The first proof packet should make manual review clear,
not automate review execution.

## Work Items

- add a deterministic local proof packet helper, preferably
  `frontend/src/lib/reviewProofPacket.ts`, over the Stage 26 proof priority
  model;
- define compact Stage 27 types in
  `frontend/src/features/mission-console/types.ts` for proof packets, packet
  sections, source evidence chains, expected proof observations, human gate
  steps, static command references, and deferred boundary context;
- wire the proof packet into
  `frontend/src/features/mission-console/consoleViewModel.ts` without changing
  fixture/local-live boundaries;
- surface a compact Stage 27 proof packet and human test gate in
  `frontend/src/features/mission-console/MissionConsole.tsx`, near the Stage 26
  priority/radar panel;
- update `frontend/src/styles/global.css` only as needed for the compact panel;
- add focused frontend tests in a new
  `tests/frontend/reviewProofPacket.test.ts` and update
  `tests/frontend/consoleViewModel.test.ts` for the new view-model shape;
- keep Stage 26 through Stage 09 behavior covered by focused regression tests;
- add a public-safe Stage 27 artifact under
  `docs/development/artifacts/stage27-local-review-proof-packet/` describing the
  packet contract, source files, verification commands, human test gate, and
  deferred production features.

## Human Test Gate

A reviewer should be able to:

1. inspect the Stage 26 proof priority lens and identify the default priority
   row;
2. open the Stage 27 proof packet derived from that priority row;
3. confirm the packet is derived from Stage 26 priority rows and Stage 25
   coverage rows, not ad hoc UI strings;
4. see source coverage, trace, outcome, readiness, resolution, matrix, action,
   evidence target, proof bucket, proof command, and static review step ids;
5. inspect expected local proof observations and their source-backed reasons;
6. follow the static human inspection gate without executable command controls;
7. confirm deferred production scope remains visible, non-actionable, and
   non-certifying;
8. complete the review without saved progress, saved packet selection, reviewer
   identity, signoff, persistence, ticketing, report export, owner assignment,
   task launchers, command runners, shell panels, or a production handoff
   service.

## Non-Goals

- no production authentication, accounts, or collaboration identity;
- no saved review-pass history, saved reviewer progress, persistent notes,
  local note storage, saved trace selections, saved coverage filters, saved
  priority filters, saved proof selections, saved proof packet selections, or
  saved action ownership;
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

- focused frontend model tests proving proof packets are derived from Stage 26
  priority rows and Stage 25 coverage rows;
- assertions that the default packet follows the Stage 26 default priority row;
- assertions that source coverage row ids, trace ids, outcome ids, readiness
  ids, resolution ids, matrix row ids, action ids, evidence target ids, proof
  bucket labels, proof command ids, and static review step ids remain visible;
- assertions that expected proof observations are local, source-backed,
  informational, and non-certifying;
- assertions that human gate steps are static and non-executable;
- view-model tests proving the proof packet is connected to the Stage 26
  priority model and does not change fixture/local-live boundaries;
- mission-console coverage showing the proof packet and human test gate are
  visible without a broad redesign;
- existing Stage 26 through Stage 09 checks as regression coverage for touched
  surfaces;
- public-repo guard before any push.

Avoid:

- browser automation that depends on installing missing frontend dependencies;
- editable state, saved packet selections, saved filters, saved proof
  selections, saved progress, local storage, or persistence tests before the
  local packet contract exists;
- external workflow integrations, ticketing, auth, production signoff, audit
  retention, report authoring, report exports, cloud-backed handoff primitives,
  or deploy work;
- command execution UI, shell panels, task launchers, runnable checklists, or
  owner assignment.

## Exit Criteria

- one deterministic local proof packet model is source-backed and
  visible/testable;
- proof packets are derived from Stage 26 priority rows and Stage 25 coverage
  rows, not ad hoc UI strings;
- the default proof packet follows the Stage 26 default priority row;
- source coverage, trace, outcome, readiness, resolution, matrix, action,
  evidence target, proof bucket, proof command, static review step, expected
  observation, and deferred boundary context are explicit;
- static human gate steps remain non-executable and non-certifying;
- mission-console UI exposes the proof packet without a broad redesign;
- fixture mode remains deterministic and explicit local-live mode remains safe;
- focused tests and public-repo guard pass;
- the next stage is split if work moves into saved review progress,
  persistence, identity, collaboration, external ticketing, production signoff,
  deploy/release, audit retention, report/export authoring, ownership launchers,
  or executable command automation.
