# Stage 27 Local Review Proof Packet Gate Slice

## Boundary

This slice turns the Stage 26 proof priority radar into a deterministic local
proof packet and static human test gate.

It stays fixture-first and local-live compatible through the existing mission
console view model. It does not add saved proof packet selections, saved proof
selections, saved reviewer progress, reviewer identity, signoff, persistence,
audit retention, ticketing, owner assignment, task launchers, report authoring,
handoff exports, command runners, shell automation panels, runnable checklists,
production services, deploy behavior, or cloud-backed state.

## Source Files

- `frontend/src/lib/reviewProofPacket.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewProofPacket.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Proof Packet Contract

- Schema: `telemforge.review_proof_packet.v1`
- Version: `1`
- Contract label: `local deterministic review proof packet and static human test gate`
- Source: Stage 26 `telemforge.review_proof_priority.v1` priority rows and
  their Stage 25 `telemforge.review_evidence_coverage.v1` source coverage rows.
- Default proof packet:
  - follows the Stage 26 default priority row;
  - therefore selects the highest-priority unresolved local proof gap when one
    exists;
  - falls back through the Stage 26 priority model rather than choosing ad hoc UI
    text.
- Each proof packet preserves:
  - source priority row ids;
  - source coverage row ids;
  - source trace row ids;
  - source outcome row ids;
  - source readiness row ids;
  - source resolution ids;
  - source matrix row ids;
  - source action ids;
  - evidence target ids;
  - proof bucket labels;
  - proof command ids;
  - static review step ids;
  - deferred boundary context where applicable.
- Expected observations are local, source-backed, informational, and
  non-certifying.
- Static human gate steps are repo-relative, non-executable, and source-backed
  by the selected proof packet.
- Candidate proof packets are informational and non-certifying. The mission
  console does not store packet selections, proof selections, reviewer progress,
  signoff, audit state, or execute proof commands.

## Packet Summary

- Default proof packet:
  `proof-packet:priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff`
- Unresolved local proof packet rows:
  - `proof-packet:priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff`
  - `proof-packet:priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-2:action:follow-up:decision:evidence-export-boundary`
- Deferred production packet row:
  - `proof-packet:priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-3:action:deferred-production-handoff-scope`
- Default static human gate steps:
  - inspect the source evidence chain in `frontend/src/lib/reviewProofPacket.ts`;
  - compare expected observations in `tests/frontend/reviewProofPacket.test.ts`;
  - confirm the mission console surface remains non-executing in
    `frontend/src/features/mission-console/MissionConsole.tsx`.

## Human-Testable Flow

1. Inspect the Stage 26 proof priority lens and identify the default priority
   row.
2. Read the Stage 27 default proof packet derived from that priority row.
3. Confirm packet rows are derived from Stage 26 priority rows and Stage 25
   coverage rows.
4. Confirm source coverage, trace, outcome, readiness, resolution, matrix,
   action, evidence target, proof bucket, proof command, and static review step
   ids remain visible.
5. Inspect the expected local proof observations and their source-backed
   summaries.
6. Inspect the static human gate steps without command controls.
7. Confirm deferred production scope remains visible, non-actionable, and
   non-certifying.
8. Confirm there are no saved packet selections, proof selections, saved
   filters, progress recovery, reviewer identity, signoff, persistence,
   ticketing, report export, owner assignment, runnable checklists, task
   launchers, shell panels, or command-runner controls.

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/reviewProofPacket.test.ts
node --experimental-strip-types --test tests/frontend/reviewProofPriority.test.ts
node --experimental-strip-types --test tests/frontend/reviewEvidenceCoverage.test.ts
node --experimental-strip-types --test tests/frontend/reviewEvidenceTrace.test.ts
node --experimental-strip-types --test tests/frontend/reviewPassOutcome.test.ts
node --experimental-strip-types --test tests/frontend/reviewPassReadiness.test.ts
node --experimental-strip-types --test tests/frontend/reviewGapResolution.test.ts
node --experimental-strip-types --test tests/frontend/reviewGapTriage.test.ts
node --experimental-strip-types --test tests/frontend/reviewHandoffCoverageMatrix.test.ts
node --experimental-strip-types --test tests/frontend/reviewHandoffRehearsal.test.ts
node --experimental-strip-types --test tests/frontend/reviewActionWalkthrough.test.ts
node --experimental-strip-types --test tests/frontend/reviewActionQueue.test.ts
node --experimental-strip-types --test tests/frontend/reviewBriefingBoard.test.ts
node --experimental-strip-types --test tests/frontend/reviewDecisionRegister.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
npm --prefix frontend run test
python3 -m unittest discover -s tests/backend -p 'test_stage12_incident_review_packets.py'
python3 -m unittest discover -s tests/backend -p 'test_stage12_incident_review_exports.py'
python3 -m unittest discover -s tests/backend -p 'test_stage11_scenario_runbooks.py'
python3 -m unittest discover -s tests/backend -p 'test_stage10_alert_acknowledgement.py'
python3 -m unittest discover -s tests/backend -p 'test_stage10_alert_resolution.py'
python3 -m unittest discover -s tests/backend -p 'test_stage07_api.py'
python3 scripts/public_repo_guard.py --scan-history
```

## Deferred

- production authentication, accounts, and collaboration identity;
- saved review-pass history, saved reviewer progress, persistent notes, saved
  trace selections, saved coverage filters, saved priority filters, saved proof
  selections, saved proof packet selections, and saved action ownership;
- reviewer signoff, audit retention, approval identity, or production readiness
  certification;
- external ticketing, messaging, email, workflow integrations, owner assignment,
  or task launchers;
- cloud services, telemetry upload, paid APIs, browser-cookie import, or
  external network calls;
- production evidence archive or database migration;
- report designer, styled report downloads, report package writers, handoff
  report exports, or production handoff packages;
- executable command runners, runnable checklists, shell automation panels,
  production handoff services, deploy, release, publish, or main-branch
  fast-forward.
