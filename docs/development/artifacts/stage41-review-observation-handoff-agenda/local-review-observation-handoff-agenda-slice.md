# Stage 41 Local Review Observation Handoff Agenda Slice

## Boundary

This slice turns the Stage 40 observation handoff question rail into a
deterministic local observation handoff agenda and static facilitation guide
inside the mission console.

The slice stays deterministic, local, read-only, fixture-first, and
non-persistent. It does not add saved agendas, saved agenda progress, saved
question answers, saved coverage selections, saved deck selections, saved
storyline selections, saved walkthrough selections, saved boundary selections,
saved source-map selections, saved citation selections, saved reviewer
progress, saved observations, saved notes, saved filters, reviewer identity,
signoff, audit retention, owner assignment, runnable checklists, task
launching, command execution, report exports, handoff package generation,
proof scoring, quality scoring, ranking, certification, app-wide routing,
deploy/release behavior, or production handoff semantics.

## Source Files

- `frontend/src/lib/reviewObservationHandoffAgenda.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewObservationHandoffAgenda.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Observation Handoff Agenda Contract

- Schema: `telemforge.review_observation_handoff_agenda.v1`
- Version: `1`
- Contract label: `local deterministic observation handoff agenda and static facilitation guide`
- Source: the Stage 40 `reviewObservationHandoffQuestions` view, especially
  prompt groups, review questions, evidence prompts, gap prompts,
  deferred-scope prompts, source coverage row ids, source handoff card ids,
  source summary references, local anchors, and static non-goal contexts.
- Agenda section order preserves Stage 40 prompt-group order.
- The default agenda section uses the Stage 40 default prompt group.
- Each agenda section carries source prompt-group ids, source coverage row id,
  source handoff card id, local anchor hrefs, related review question ids,
  related evidence prompt ids, related gap prompt ids, related deferred-scope
  prompt ids, facilitation prompt ids, evidence-stop ids, gap discussion point
  ids, deferred-scope reminder ids, local-only flags, and static non-goal
  context.
- Facilitation prompts, evidence stops, gap discussion points, and
  deferred-scope reminders are explanatory only and are not executable work,
  runnable checklists, rankings, tasks, tickets, owner assignments,
  certifications, scorecards, exports, signoff, or saved reviewer progress.

## Reconciliation Summary

- The agenda is built after `reviewObservationHandoffQuestions` in the
  mission-console view model and keeps fixture/local-live boundaries unchanged.
- The UI renders the Stage 41 agenda/static facilitation guide directly after
  the Stage 40 prompt rail without introducing routes, storage, command
  execution, report export, handoff package generation, signoff, owner
  assignment, proof scoring, certification, or runnable checklist semantics.
- Agenda sections and guide items are derived from typed Stage 40 question
  data, not ad hoc UI strings.

## Human-Testable Flow

1. Open the mission console in fixture mode.
2. Find the Stage 41 observation handoff agenda panel near the Stage 40 prompt
   rail.
3. Confirm agenda sections follow Stage 40 prompt-group order.
4. Confirm the default agenda section uses the Stage 40 default prompt group.
5. Confirm each section shows source summary references, local anchors,
   source coverage row ids, source handoff card ids, review question ids,
   evidence prompt ids, gap prompt ids, deferred-scope prompt ids, and compact
   counts.
6. Follow local anchor links and verify the page stays on the same route.
7. Confirm facilitation prompts, evidence stops, gap discussion points, and
   deferred-scope reminders remain explanatory static review context, not
   saved answers, saved agendas, tasks, tickets, checklists, owner
   assignments, scores, ranks, certifications, exports, signoff, or command
   runners.
8. Confirm there is no saved agenda state, saved question state, saved
   coverage/deck/storyline/walkthrough/boundary/source-map/citation selection,
   saved reviewer progress, saved observation, saved note, saved filter,
   reviewer identity, signoff, persistence, ticketing, report export, handoff
   package generation, owner assignment, runnable checklist, task launcher,
   shell panel, proof scoring, ranking, certification, or command runner.

## Verification Commands

```text
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
`docs/automation/demos/telemforge-stage41-review-observation-handoff-agenda-20260605.svg`

## Deferred

- saved agenda progress, saved answers, saved prompt groups, saved coverage
  selections, saved deck selections, saved storyline selections, saved
  walkthrough selections, saved boundary selections, saved citation
  selections, saved source-map selections, saved observations, saved notes,
  saved filters, saved review progress, local storage, reviewer identity,
  signoff, audit retention, persistent notes, or collaboration state;
- report authoring, report exports, handoff packages, external ticketing, or
  messaging integrations;
- owner assignment, task launchers, runnable checklists, command runners, shell
  panels, proof scoring, quality scoring, ranking, certification, or
  production readiness scoring;
- app-wide routing, authentication, cloud services, deploy/release/publish, or
  database migration.
