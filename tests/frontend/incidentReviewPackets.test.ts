import assert from "node:assert/strict";
import test from "node:test";

import { buildIncidentReviewPacket } from "../../frontend/src/lib/incidentReviewPackets.ts";
import {
  acknowledgeAlertInFixture,
  resolveAlertInFixture,
} from "../../frontend/src/lib/operatorWorkflow.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("buildIncidentReviewPacket reports initial thermal runbook gaps", () => {
  const packet = buildIncidentReviewPacket(stage07ConsoleFixture);

  assert.equal(packet.schema, "telemforge.incident_review_packet.v1");
  assert.equal(packet.runbook.runbookId, "thermal-alert-response-local");
  assert.equal(packet.readiness.status, "in_progress");
  assert.equal(packet.readiness.completedStepCount, 1);
  assert.equal(packet.alertLifecycle.state, "active");
  assert.deepEqual(
    packet.evidenceGaps.map((gap) => gap.gapId),
    [
      "alert-not-acknowledged",
      "alert-not-resolved",
      "event-history-incomplete",
      "replay-evidence-incomplete",
    ],
  );
});

test("buildIncidentReviewPacket summarizes completed local playback evidence", () => {
  const acknowledgedFixture = acknowledgeAlertInFixture(
    stage07ConsoleFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-26T04:30:00Z",
  );
  const resolvedFixture = resolveAlertInFixture(
    acknowledgedFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-26T04:32:00Z",
  );

  const packet = buildIncidentReviewPacket(resolvedFixture);

  assert.equal(packet.readiness.status, "ready");
  assert.equal(packet.readiness.completedStepCount, 5);
  assert.equal(packet.alertLifecycle.state, "resolved");
  assert.deepEqual(
    packet.operatorActions.map((action) => action.actionKind),
    ["acknowledge_alert", "resolve_alert"],
  );
  assert.deepEqual(
    packet.operatorActions.map((action) => action.status),
    ["complete", "complete"],
  );
  assert.equal(packet.eventHistory.relatedEventCount, 5);
  assert.equal(packet.replayEvidence.relatedMarkerCount, 7);
  assert.ok(packet.replayEvidence.markerTypes.includes("alert.resolved"));
  assert.deepEqual(packet.evidenceGaps, []);
});
