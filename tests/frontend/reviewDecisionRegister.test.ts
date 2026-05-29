import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import {
  acknowledgeAlertInFixture,
  resolveAlertInFixture,
} from "../../frontend/src/lib/operatorWorkflow.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("Stage 14 review decision register reports ready and follow-up local decisions", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const register = view.reviewDecisionRegister;

  assert.ok(register);
  assert.equal(register.schema, "telemforge.review_decision_register.v1");
  assert.equal(register.version, 1);
  assert.equal(
    register.contractLabel,
    "local deterministic review decision register",
  );
  assert.equal(register.localStatus, "fixture");
  assert.deepEqual(register.summary, {
    totalDecisionCount: 4,
    readyCount: 1,
    followUpCount: 2,
    deferredCount: 1,
  });
  assert.deepEqual(
    register.decisions.map((decision) => decision.decisionId),
    [
      "decision:thermal-anomaly-triage",
      "decision:alert-lifecycle-handoff",
      "decision:evidence-export-boundary",
      "decision:production-handoff-scope",
    ],
  );

  const anomalyDecision = register.decisions.find(
    (decision) => decision.decisionId === "decision:thermal-anomaly-triage",
  );
  const lifecycleDecision = register.decisions.find(
    (decision) => decision.decisionId === "decision:alert-lifecycle-handoff",
  );
  const deferredDecision = register.decisions.find(
    (decision) => decision.decisionId === "decision:production-handoff-scope",
  );

  assert.equal(anomalyDecision?.status, "ready");
  assert.ok(
    anomalyDecision?.relatedPlaybackFrameId.startsWith("playback-frame-"),
  );
  assert.equal(lifecycleDecision?.status, "follow_up");
  assert.ok(
    lifecycleDecision?.followUpReason?.includes("has not been acknowledged"),
  );
  assert.equal(deferredDecision?.status, "deferred");
  assert.ok(
    deferredDecision?.localOnlyScopeNotes.some((note) =>
      note.toLowerCase().includes("production"),
    ),
  );
  assert.ok(
    register.decisions.every(
      (decision) =>
        decision.relatedPlaybackFrameId &&
        decision.supportingEvidence.some((evidence) => evidence.label),
    ),
  );
});

test("Stage 14 review decision register marks completed local handoff evidence ready", () => {
  const acknowledgedFixture = acknowledgeAlertInFixture(
    stage07ConsoleFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-29T04:30:00Z",
  );
  const resolvedFixture = resolveAlertInFixture(
    acknowledgedFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-29T04:32:00Z",
  );
  const view = buildMissionConsoleView(resolvedFixture, "thermal");
  const register = view.reviewDecisionRegister;

  assert.ok(register);
  assert.deepEqual(register.summary, {
    totalDecisionCount: 4,
    readyCount: 3,
    followUpCount: 0,
    deferredCount: 1,
  });

  const lifecycleDecision = register.decisions.find(
    (decision) => decision.decisionId === "decision:alert-lifecycle-handoff",
  );
  const exportDecision = register.decisions.find(
    (decision) => decision.decisionId === "decision:evidence-export-boundary",
  );

  assert.equal(lifecycleDecision?.status, "ready");
  assert.equal(lifecycleDecision?.followUpReason, null);
  assert.equal(exportDecision?.status, "ready");
  assert.equal(exportDecision?.followUpReason, null);
  assert.deepEqual(
    register.handoffChecklist.map((item) => [item.itemId, item.status]),
    [
      ["handoff:runbook-playback", "ready"],
      ["handoff:incident-packet", "ready"],
      ["handoff:evidence-export", "ready"],
      ["handoff:production-integrations", "deferred"],
    ],
  );
});
