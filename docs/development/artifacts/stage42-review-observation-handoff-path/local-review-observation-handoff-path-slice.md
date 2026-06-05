# Stage 42 Local Review Observation Handoff Path Slice

## Boundary

This slice turns the Stage 41 observation handoff agenda into a deterministic
local observation handoff path and static anchor map inside the mission console.

The slice stays deterministic, local, read-only, fixture-first, route-free, and
non-persistent. It does not add saved path progress, saved agendas, saved
agenda progress, saved question answers, saved selections, saved observations,
saved notes, saved filters, reviewer identity, signoff, audit retention, owner
assignment, runnable checklists, task launching, command execution, report
exports, handoff package generation, proof scoring, quality scoring, ranking,
certification, app-wide routing, deploy/release behavior, or production
handoff semantics.

## Source Files

- `frontend/src/lib/reviewObservationHandoffPath.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewObservationHandoffPath.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Observation Handoff Path Contract

- Schema: `telemforge.review_observation_handoff_path.v1`
- Version: `1`
- Contract label: `local deterministic observation handoff path and static anchor map`
- Source: the Stage 41 `reviewObservationHandoffAgenda` view, especially
  agenda sections, facilitation prompts, evidence stops, gap discussion points,
  deferred-scope reminders, source prompt-group ids, source coverage row ids,
  source handoff card ids, source summary references, local anchor hrefs, and
  static non-goal contexts.
- Path step order preserves Stage 41 agenda section order.
- The default path step uses the Stage 41 default agenda section.
- Each path step carries source agenda section ids, source prompt-group ids,
  source coverage row id, source handoff card id, source references, local
  anchor hrefs, anchor target ids, related facilitation prompt ids, related
  evidence stop ids, related gap discussion point ids, related deferred-scope
  reminder ids, related source prompt ids, local-only flags, and static
  non-goal context.
- Anchor map entries are in-page only and preserve source anchor order from the
  Stage 41 agenda section that produced them.
- Path steps and anchor map entries are explanatory only and are not saved
  paths, route changes, runnable checklists, rankings, tasks, tickets, owner
  assignments, certifications, scorecards, exports, signoff, or command
  execution.

## Reconciliation Summary

- The handoff path is built after `reviewObservationHandoffAgenda` in the
  mission-console view model and keeps fixture/local-live boundaries unchanged.
- The UI renders the Stage 42 handoff path/static anchor map directly after the
  Stage 41 agenda without introducing routes, storage, command execution,
  report export, handoff package generation, signoff, owner assignment, proof
  scoring, certification, or runnable checklist semantics.
- Path steps and anchor entries are derived from typed Stage 41 agenda data,
  not ad hoc UI strings.

## Human-Testable Flow

1. Open the mission console in fixture mode.
2. Find the Stage 42 observation handoff path panel near the Stage 41 agenda.
3. Confirm path steps follow Stage 41 agenda section order.
4. Confirm the default path step uses the Stage 41 default agenda section.
5. Confirm each step shows source agenda section ids, source prompt-group ids,
   source coverage row ids, source handoff card ids, anchor hrefs, anchor
   targets, related facilitation prompts, evidence stops, gap discussion
   points, deferred-scope reminders, and compact source references.
6. Follow local anchor links and verify the page stays on the same route.
7. Confirm anchor map entries preserve per-section source anchor order.
8. Confirm there is no saved path state, saved agenda state, saved answer
   state, saved selection, saved reviewer progress, saved observation, saved
   note, saved filter, reviewer identity, signoff, persistence, ticketing,
   report export, handoff package generation, owner assignment, runnable
   checklist, task launcher, shell panel, proof scoring, ranking,
   certification, route change, or command runner.

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffPath.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffAgenda.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffQuestions.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffCoverage.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffDeck.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationStoryline.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationBoundaryWalkthrough.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationBoundaryLedger.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationCitations.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationCoverage.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationLens.test.ts
node --experimental-strip-types --test tests/frontend/reviewWalkthroughPath.test.ts
node --experimental-strip-types --test tests/frontend/reviewSurfaceIndex.test.ts
node --experimental-strip-types --test tests/frontend/reviewProofReconciliation.test.ts
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
node --experimental-strip-types --test tests/frontend/incidentReviewPackets.test.ts
node --experimental-strip-types --test tests/frontend/scenarioRunbooks.test.ts
node --experimental-strip-types --test tests/frontend/stage09LiveConsoleAdapter.test.ts
npm --prefix frontend run test
python3 -m unittest discover -s tests/backend -p test_stage12_incident_review_packets.py
python3 -m unittest discover -s tests/backend -p test_stage12_incident_review_exports.py
python3 -m unittest discover -s tests/backend -p test_stage11_scenario_runbooks.py
python3 -m unittest discover -s tests/backend -p test_stage10_alert_acknowledgement.py
python3 -m unittest discover -s tests/backend -p test_stage10_alert_resolution.py
python3 -m unittest discover -s tests/backend -p test_stage07_api.py
git diff --check
git diff --cached --check
python3 scripts/public_repo_guard.py --scan-history
```

## Visual Proof

Ignored local proof artifact:
`docs/automation/demos/telemforge-stage42-review-observation-handoff-path-20260605.svg`

## Deferred

- saved path progress, saved agenda progress, saved answers, saved selections,
  saved observations, saved notes, saved filters, saved review progress, local
  storage, reviewer identity, signoff, audit retention, persistent notes, or
  collaboration state;
- report authoring, report exports, handoff packages, external ticketing, or
  messaging integrations;
- owner assignment, task launchers, runnable checklists, command runners, shell
  panels, proof scoring, quality scoring, ranking, certification, or
  production readiness scoring;
- app-wide routing, route changes, authentication, cloud services,
  deploy/release/publish, or database migration.
