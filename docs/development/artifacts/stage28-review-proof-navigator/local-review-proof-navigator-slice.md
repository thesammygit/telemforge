# Stage 28 Local Review Proof Navigator Slice

## Boundary

This slice turns the Stage 27 local proof packet model into a deterministic
local proof navigator and source crosswalk.

It stays fixture-first and local-live compatible through the existing mission
console view model. It does not add saved navigator selections, saved proof
packet selections, saved proof selections, saved reviewer progress, reviewer
identity, signoff, persistence, audit retention, ticketing, owner assignment,
task launchers, report authoring, handoff exports, command runners, shell
automation panels, runnable checklists, production services, deploy behavior, or
cloud-backed state.

## Source Files

- `frontend/src/lib/reviewProofNavigator.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewProofNavigator.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Proof Navigator Contract

- Schema: `telemforge.review_proof_navigator.v1`
- Version: `1`
- Contract label: `local deterministic review proof navigator and source crosswalk`
- Source: Stage 27 `telemforge.review_proof_packet.v1` proof packet rows.
- Default navigator row:
  - follows the Stage 27 default proof packet;
  - therefore keeps the highest-priority unresolved local proof packet first
    when one exists;
  - falls back through the Stage 27 packet model rather than choosing ad hoc UI
    text.
- Navigator rows preserve:
  - packet ids;
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
  - static human gate step ids;
  - source static review step ids;
  - deferred boundary marker ids.
- Review lanes order unresolved local proof gap packets before ready local
  evidence and deferred production scope.
- Source crosswalk rows are repo-relative, local, source-backed,
  informational, non-executable, and non-certifying.
- Static inspection prompts are local, source-backed, non-executable, and
  non-certifying.
- Deferred production markers remain visible, non-actionable, and
  non-certifying.

## Navigator Summary

- Default navigator row:
  `proof-navigator:proof-packet:priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff`
- Local proof gap lane rows:
  - `proof-navigator:proof-packet:priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff`
  - `proof-navigator:proof-packet:priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-2:action:follow-up:decision:evidence-export-boundary`
- Deferred production lane row:
  - `proof-navigator:proof-packet:priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-3:action:deferred-production-handoff-scope`
- Static source references:
  - `frontend/src/lib/reviewProofNavigator.ts`
  - `frontend/src/lib/reviewProofPacket.ts`
  - `frontend/src/features/mission-console/MissionConsole.tsx`
  - `tests/frontend/reviewProofNavigator.test.ts`

## Human-Testable Flow

1. Inspect the Stage 27 proof packet panel and identify the default packet.
2. Read the Stage 28 proof navigator derived from that packet set.
3. Confirm navigator rows are derived from Stage 27 proof packets, not ad hoc UI
   strings.
4. Confirm unresolved local proof gap packets are ordered before ready local
   evidence and deferred production scope.
5. Confirm packet ids, priority row ids, coverage row ids, trace ids, evidence
   target ids, proof bucket labels, proof command ids, static human gate step
   ids, and deferred boundary notes remain visible.
6. Use the source crosswalk to compare which packet owns each source-chain
   segment.
7. Inspect static local prompts without executable command controls.
8. Confirm deferred production scope remains visible, non-actionable, and
   non-certifying.
9. Confirm there are no saved navigator selections, saved packet selections,
   saved proof selections, saved filters, progress recovery, reviewer identity,
   signoff, persistence, ticketing, report export, owner assignment, runnable
   checklists, task launchers, shell panels, or command-runner controls.

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/reviewProofNavigator.test.ts
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
  selections, saved proof packet selections, saved navigator selections, and
  saved action ownership;
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
