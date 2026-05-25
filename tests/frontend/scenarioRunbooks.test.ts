import assert from "node:assert/strict";
import test from "node:test";

import {
  buildScenarioRunbookPlayback,
  localScenarioRunbooks,
} from "../../frontend/src/lib/scenarioRunbooks.ts";
import {
  acknowledgeAlertInFixture,
  resolveAlertInFixture,
} from "../../frontend/src/lib/operatorWorkflow.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("localScenarioRunbooks exposes one fixture-first thermal response runbook", () => {
  assert.equal(localScenarioRunbooks.length, 1);
  assert.equal(localScenarioRunbooks[0].runbookId, "thermal-alert-response-local");
  assert.equal(localScenarioRunbooks[0].scenario, "thermal-alert-response");
  assert.deepEqual(
    localScenarioRunbooks[0].steps.map((step) => step.stepId),
    [
      "triage-alert",
      "acknowledge-alert",
      "resolve-alert",
      "review-event-history",
      "inspect-replay-evidence",
    ],
  );
});

test("buildScenarioRunbookPlayback points the initial active alert at acknowledgement", () => {
  const playback = buildScenarioRunbookPlayback(stage07ConsoleFixture);

  assert.equal(playback.selectedRunbookId, "thermal-alert-response-local");
  assert.equal(playback.targetAlertId, "alert-stage06-thermal-avionics");
  assert.deepEqual(playback.completedStepIds, ["triage-alert"]);
  assert.equal(playback.currentStepId, "acknowledge-alert");
  assert.equal(playback.nextAction?.kind, "acknowledge_alert");
  assert.equal(playback.nextAction?.alertId, "alert-stage06-thermal-avionics");
  assert.equal(playback.steps[0].status, "complete");
  assert.equal(playback.steps[1].status, "current");
});

test("buildScenarioRunbookPlayback advances to resolution after acknowledgement", () => {
  const acknowledgedFixture = acknowledgeAlertInFixture(
    stage07ConsoleFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-25T04:30:00Z",
  );
  const playback = buildScenarioRunbookPlayback(acknowledgedFixture);

  assert.deepEqual(playback.completedStepIds, [
    "triage-alert",
    "acknowledge-alert",
  ]);
  assert.equal(playback.currentStepId, "resolve-alert");
  assert.equal(playback.nextAction?.kind, "resolve_alert");
});

test("buildScenarioRunbookPlayback completes history and replay evidence after resolution", () => {
  const acknowledgedFixture = acknowledgeAlertInFixture(
    stage07ConsoleFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-25T04:30:00Z",
  );
  const resolvedFixture = resolveAlertInFixture(
    acknowledgedFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-25T04:32:00Z",
  );
  const playback = buildScenarioRunbookPlayback(resolvedFixture);

  assert.deepEqual(playback.completedStepIds, [
    "triage-alert",
    "acknowledge-alert",
    "resolve-alert",
    "review-event-history",
    "inspect-replay-evidence",
  ]);
  assert.equal(playback.currentStepId, "inspect-replay-evidence");
  assert.equal(playback.nextAction?.kind, "playback_complete");
  assert.deepEqual(
    playback.evidenceLinks.map((link) => link.target),
    ["alert-lifecycle", "fault-incident-timeline", "replay-anomaly-inspection"],
  );
});
