import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewActionWalkthrough } from "../../frontend/src/lib/reviewActionWalkthrough.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("buildReviewActionWalkthrough defaults to the first blocking action and resolves its evidence path", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const walkthrough = buildReviewActionWalkthrough(
    view.reviewActionQueue,
    view.reviewBriefingBoard,
    view.replayPlayback,
    view.runbook,
    view.incidentReviewPacket,
    view.incidentReviewExport,
  );

  assert.ok(walkthrough);
  assert.equal(walkthrough.schema, "telemforge.review_action_walkthrough.v1");
  assert.equal(walkthrough.version, 1);
  assert.equal(
    walkthrough.contractLabel,
    "local deterministic action evidence walkthrough",
  );
  assert.equal(
    walkthrough.selectedActionId,
    "action:follow-up:decision:alert-lifecycle-handoff",
  );
  assert.equal(walkthrough.selectedAction.blocking, true);
  assert.deepEqual(walkthrough.coverage, {
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
  assert.deepEqual(
    walkthrough.evidencePathRows.map((row) => [row.target, row.status]),
    [
      ["replay-playback-timeline", "available"],
      ["alert-lifecycle", "available"],
      ["incident-review-packet", "available"],
    ],
  );

  const replayRow = walkthrough.evidencePathRows[0];
  assert.equal(replayRow.evidenceRows.length, 3);
  assert.ok(
    replayRow.replayFrameIds.includes(
      "playback-frame-1-marker-fault-fault-stage06-thermal-avionics",
    ),
  );
  assert.ok(
    replayRow.replayFrameIds.includes(
      "playback-frame-5-marker-alert-alert-stage06-thermal-avionics",
    ),
  );
  assert.ok(
    replayRow.runbookTargets.some((target) => target.stepId === "review-event-history"),
  );
  assert.ok(
    replayRow.packetReferences.some((reference) =>
      reference.packetId.includes("incident-review:tf-sat-01"),
    ),
  );
  assert.ok(
    walkthrough.deferredProductionBoundaryNotes.some((note) =>
      note.toLowerCase().includes("production"),
    ),
  );
  assert.ok(walkthrough.nextLocalStep.includes("local handoff"));
});

test("buildReviewActionWalkthrough honors an explicit selected action id", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const walkthrough = buildReviewActionWalkthrough(
    view.reviewActionQueue,
    view.reviewBriefingBoard,
    view.replayPlayback,
    view.runbook,
    view.incidentReviewPacket,
    view.incidentReviewExport,
    "action:deferred-production-handoff-scope",
  );

  assert.ok(walkthrough);
  assert.equal(
    walkthrough.selectedActionId,
    "action:deferred-production-handoff-scope",
  );
  assert.equal(walkthrough.selectedAction.blocking, false);
  assert.deepEqual(
    walkthrough.evidencePathRows.map((row) => row.target),
    ["review-decision-register"],
  );
  assert.equal(walkthrough.evidencePathRows[0].status, "available");
});

test("buildReviewActionWalkthrough reports missing targets explicitly", () => {
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
  const walkthrough = buildReviewActionWalkthrough(
    queue,
    view.reviewBriefingBoard,
    view.replayPlayback,
    view.runbook,
    view.incidentReviewPacket,
    view.incidentReviewExport,
  );

  assert.ok(walkthrough);
  assert.equal(walkthrough.coverage.missingTargetCount, 1);
  assert.equal(walkthrough.missingTargetRecords.length, 1);
  assert.equal(walkthrough.missingTargetRecords[0].target, "missing-target");
  assert.ok(
    walkthrough.missingTargetRecords[0].reason.includes(
      "No local briefing rows",
    ),
  );
  assert.ok(
    walkthrough.missingTargetRecords[0].expectedHints.includes(
      "packet/export references",
    ),
  );
});
