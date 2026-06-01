import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import {
  acknowledgeAlertInFixture,
  resolveAlertInFixture,
} from "../../frontend/src/lib/operatorWorkflow.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("Stage 16 review action queue derives local blockers from the briefing board", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const queue = view.reviewActionQueue;

  assert.ok(queue);
  assert.equal(queue.schema, "telemforge.review_action_queue.v1");
  assert.equal(queue.version, 1);
  assert.equal(queue.contractLabel, "local deterministic review action queue");
  assert.equal(queue.localStatus, "fixture");
  assert.equal(queue.readiness.verdict, "blocked_by_local_follow_up");
  assert.deepEqual(queue.readiness.counts, {
    totalActionCount: 3,
    blockingActionCount: 2,
    deferredProductionActionCount: 1,
  });
  assert.deepEqual(
    queue.actions.map((action) => [
      action.priority,
      action.blockerCategory,
      action.blocking,
    ]),
    [
      ["p0", "local_follow_up", true],
      ["p1", "local_follow_up", true],
      ["p2", "deferred_production_scope", false],
    ],
  );

  const lifecycleAction = queue.actions.find((action) =>
    action.actionId.includes("decision:alert-lifecycle-handoff"),
  );

  assert.ok(lifecycleAction);
  assert.deepEqual(lifecycleAction?.decisionIds, [
    "decision:alert-lifecycle-handoff",
  ]);
  assert.deepEqual(lifecycleAction?.evidenceTargets, [
    "replay-playback-timeline",
    "alert-lifecycle",
    "incident-review-packet",
  ]);
  assert.ok(lifecycleAction?.nextLocalStep.includes("local handoff"));
  assert.ok(
    queue.humanTestGateSummary.includes("Stage 15 briefing board"),
  );
});

test("Stage 16 review action queue separates deferred production scope after local evidence is ready", () => {
  const acknowledgedFixture = acknowledgeAlertInFixture(
    stage07ConsoleFixture,
    "alert-stage06-thermal-avionics",
    "2026-06-01T04:30:00Z",
  );
  const resolvedFixture = resolveAlertInFixture(
    acknowledgedFixture,
    "alert-stage06-thermal-avionics",
    "2026-06-01T04:32:00Z",
  );
  const queue = buildMissionConsoleView(resolvedFixture, "thermal")
    .reviewActionQueue;

  assert.ok(queue);
  assert.equal(queue.readiness.verdict, "deferred_production_scope_only");
  assert.deepEqual(queue.readiness.counts, {
    totalActionCount: 1,
    blockingActionCount: 0,
    deferredProductionActionCount: 1,
  });
  assert.equal(queue.actions[0].blockerCategory, "deferred_production_scope");
  assert.equal(queue.actions[0].blocking, false);
  assert.deepEqual(queue.actions[0].evidenceTargets, [
    "review-decision-register",
  ]);
  assert.ok(
    queue.deferredScopeNotes.some((note) =>
      note.toLowerCase().includes("production"),
    ),
  );
});
