import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewHandoffRehearsal } from "../../frontend/src/lib/reviewHandoffRehearsal.ts";
import {
  acknowledgeAlertInFixture,
  resolveAlertInFixture,
} from "../../frontend/src/lib/operatorWorkflow.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("Stage 18 review handoff rehearsal orders all Stage 16 actions through Stage 17 evidence paths", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const rehearsal = buildReviewHandoffRehearsal(
    view.reviewActionQueue,
    view.reviewBriefingBoard,
    view.replayPlayback,
    view.runbook,
    view.incidentReviewPacket,
    view.incidentReviewExport,
  );

  assert.ok(rehearsal);
  assert.equal(rehearsal.schema, "telemforge.review_handoff_rehearsal.v1");
  assert.equal(rehearsal.version, 1);
  assert.equal(
    rehearsal.contractLabel,
    "local deterministic review handoff rehearsal",
  );
  assert.equal(rehearsal.localStatus, "fixture");
  assert.equal(rehearsal.readiness.verdict, "blocked_by_local_follow_up");
  assert.deepEqual(rehearsal.readiness.counts, {
    totalStepCount: 3,
    blockingStepCount: 2,
    missingTargetStepCount: 0,
    deferredProductionStepCount: 1,
    resolvedCheckpointCount: 6,
    missingCheckpointCount: 0,
  });
  assert.deepEqual(
    rehearsal.steps.map((step) => step.actionId),
    [
      "action:follow-up:decision:alert-lifecycle-handoff",
      "action:follow-up:decision:evidence-export-boundary",
      "action:deferred-production-handoff-scope",
    ],
  );

  const firstStep = rehearsal.steps[0];
  assert.equal(firstStep.stepNumber, 1);
  assert.equal(firstStep.missingTargetStatus, "all_targets_resolved");
  assert.deepEqual(firstStep.checkpointCounts, {
    totalTargetCount: 3,
    resolvedTargetCount: 3,
    missingTargetCount: 0,
    evidenceRowCount: 6,
    replayFrameCount: 5,
    runbookTargetCount: 3,
    packetReferenceCount: 1,
    exportReferenceCount: 1,
    sourcePathCount: 5,
  });
  assert.equal(firstStep.missingTargets.length, 0);
  assert.ok(firstStep.reviewerPrompt.includes(firstStep.actionId));
  assert.ok(firstStep.expectedLocalOutcome.includes("local follow-up"));
  assert.ok(firstStep.nextLocalStep.includes("local handoff"));
  assert.ok(
    firstStep.sourceEvidenceReferences.includes(
      "frontend/src/lib/reviewActionQueue.ts",
    ),
  );
  assert.equal(rehearsal.unresolvedLocalBlockers.length, 2);
  assert.ok(
    rehearsal.nextLocalPrompt.includes("Stage 18 local review rehearsal"),
  );
  assert.ok(
    rehearsal.deferredProductionNotes.some((note) =>
      note.toLowerCase().includes("production"),
    ),
  );
});

test("Stage 18 review handoff rehearsal reports missing action targets as local blockers", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const queue = {
    ...view.reviewActionQueue!,
    actions: view.reviewActionQueue!.actions.map((action, index) =>
      index === 0
        ? {
            ...action,
            evidenceTargets: [...action.evidenceTargets, "missing-target"],
          }
        : action,
    ),
  };
  const rehearsal = buildReviewHandoffRehearsal(
    queue,
    view.reviewBriefingBoard,
    view.replayPlayback,
    view.runbook,
    view.incidentReviewPacket,
    view.incidentReviewExport,
  );

  assert.ok(rehearsal);
  assert.equal(rehearsal.readiness.counts.missingTargetStepCount, 1);
  assert.equal(rehearsal.readiness.counts.missingCheckpointCount, 1);
  assert.equal(rehearsal.steps[0].missingTargetStatus, "missing_targets");
  assert.equal(rehearsal.steps[0].missingTargets[0].target, "missing-target");
  assert.ok(
    rehearsal.steps[0].expectedLocalOutcome.includes(
      "identifies unresolved local evidence targets",
    ),
  );
  assert.ok(
    rehearsal.unresolvedLocalBlockers.some((blocker) =>
      blocker.reason.includes("missing evidence target"),
    ),
  );
});

test("Stage 18 review handoff rehearsal keeps deferred production scope non-blocking after local evidence is ready", () => {
  const acknowledgedFixture = acknowledgeAlertInFixture(
    stage07ConsoleFixture,
    "alert-stage06-thermal-avionics",
    "2026-06-04T04:30:00Z",
  );
  const resolvedFixture = resolveAlertInFixture(
    acknowledgedFixture,
    "alert-stage06-thermal-avionics",
    "2026-06-04T04:32:00Z",
  );
  const view = buildMissionConsoleView(resolvedFixture, "thermal");
  const rehearsal = buildReviewHandoffRehearsal(
    view.reviewActionQueue,
    view.reviewBriefingBoard,
    view.replayPlayback,
    view.runbook,
    view.incidentReviewPacket,
    view.incidentReviewExport,
  );

  assert.ok(rehearsal);
  assert.equal(rehearsal.readiness.verdict, "deferred_production_scope_only");
  assert.deepEqual(rehearsal.readiness.counts, {
    totalStepCount: 1,
    blockingStepCount: 0,
    missingTargetStepCount: 0,
    deferredProductionStepCount: 1,
    resolvedCheckpointCount: 1,
    missingCheckpointCount: 0,
  });
  assert.equal(rehearsal.steps[0].blocking, false);
  assert.equal(rehearsal.unresolvedLocalBlockers.length, 0);
  assert.ok(rehearsal.steps[0].expectedLocalOutcome.includes("non-blocking"));
});
