# Stage 40 Local Review Observation Handoff Questions Slice

## Boundary

This slice turns the Stage 39 observation handoff coverage map into a
deterministic local question rail inside the mission console.

The slice stays deterministic, local, read-only, fixture-first, and
non-persistent. It does not add saved answers, saved question groups, saved
coverage selections, saved deck selections, saved storyline selections, saved
reviewer progress, saved observations, saved notes, saved filters, reviewer
identity, signoff, audit retention, owner assignment, runnable checklists,
command execution, report exports, handoff package generation, proof scoring,
quality scoring, ranking, certification, app-wide routing, deploy/release
behavior, or production handoff semantics.

## Source Files

- `frontend/src/lib/reviewObservationHandoffQuestions.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewObservationHandoffQuestions.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Observation Handoff Questions Contract

- Schema: `telemforge.review_observation_handoff_questions.v1`
- Version: `1`
- Contract label: `local deterministic observation handoff questions and static prompt rail`
- Source: the Stage 39 `reviewObservationHandoffCoverage` view, especially
  coverage rows, source-summary references, local anchors, related observation
  rows, static gap notes, and deferred-scope reminders.
- Prompt group order preserves Stage 39 coverage row order.
- The default prompt group uses the Stage 39 default coverage row.
- Each prompt group carries source summary references, local anchor hrefs,
  related coverage row ids, related gap note ids, related deferred-scope ids,
  review question ids, evidence prompt ids, gap prompt ids, deferred-scope
  prompt ids, local-only flags, and static non-goal context.
- Review questions, evidence prompts, gap prompts, and deferred-scope prompts
  are explanatory only and are not executable work, rankings, tasks, owner
  assignments, certifications, or scorecards.

## Reconciliation Summary

- The prompt rail is built after `reviewObservationHandoffCoverage` in the
  mission-console view model and keeps fixture/local-live boundaries unchanged.
- The UI renders the Stage 40 prompt rail directly after the Stage 39
  coverage map without introducing routes, storage, command execution, report
  export, handoff package generation, signoff, owner assignment, proof
  scoring, certification, or runnable checklist semantics.
- Prompt groups, review questions, evidence prompts, gap prompts, and
  deferred-scope prompts are derived from typed Stage 39 coverage data, not
  ad hoc UI strings.

## Human-Testable Flow

1. Open the mission console in fixture mode.
2. Find the Stage 40 observation handoff questions panel near the Stage 39
   coverage map.
3. Confirm prompt groups follow Stage 39 coverage row order.
4. Confirm the default prompt group uses the Stage 39 default coverage row.
5. Confirm each prompt group shows source summary references, local anchors,
   coverage row ids, gap note ids, deferred-scope ids, and the compact prompt
   counts.
6. Follow local anchor links and verify the page stays on the same route.
7. Confirm review questions and prompts remain explanatory static review
   context, not saved answers, tasks, tickets, checklists, owner assignments,
   scores, ranks, certifications, exports, or command runners.
8. Confirm there is no saved answer state, saved prompt state, saved progress,
   reviewer identity, signoff, persistence, ticketing, report export, handoff
   package generation, owner assignment, runnable checklist, task launcher,
   shell panel, proof scoring, ranking, certification, or command runner.

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffQuestions.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffCoverage.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
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

## Deferred

- saved answers, saved prompt groups, saved coverage selections, saved deck
  selections, saved storyline selections, saved walkthrough selections, saved
  boundary selections, saved citation selections, saved source-map
  selections, saved observations, saved notes, saved filters, saved review
  progress, local storage, reviewer identity, signoff, audit retention,
  persistent notes, or collaboration state;
- report authoring, report exports, handoff packages, external ticketing, or
  messaging integrations;
- owner assignment, task launchers, runnable checklists, command runners,
  shell panels, proof scoring, quality scoring, ranking, certification, or
  production readiness scoring;
- app-wide routing, authentication, cloud services, deploy/release/publish,
  or database migration.
