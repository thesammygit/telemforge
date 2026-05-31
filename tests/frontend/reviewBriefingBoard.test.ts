import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import {
  acknowledgeAlertInFixture,
  resolveAlertInFixture,
} from "../../frontend/src/lib/operatorWorkflow.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("Stage 15 review briefing board groups decisions and drilldown rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const board = view.reviewBriefingBoard;

  assert.ok(board);
  assert.equal(board.schema, "telemforge.review_briefing_board.v1");
  assert.equal(board.version, 1);
  assert.equal(
    board.contractLabel,
    "local deterministic review briefing board",
  );
  assert.equal(board.localStatus, "fixture");
  assert.equal(board.readinessStatus, "needs_follow_up");
  assert.deepEqual(board.summary, {
    totalDecisionCount: 4,
    readyCount: 1,
    followUpCount: 2,
    deferredCount: 1,
    groupCount: 3,
    evidenceRowCount: 8,
    followUpActionCount: 2,
  });
  assert.deepEqual(
    board.groupedDecisionSummaries.map((group) => [group.status, group.decisionCount]),
    [
      ["ready", 1],
      ["follow_up", 2],
      ["deferred", 1],
    ],
  );
  assert.equal(
    board.groupedDecisionSummaries[0].decisions[0].decisionId,
    "decision:thermal-anomaly-triage",
  );
  assert.equal(
    board.groupedDecisionSummaries[1].decisions[0].followUpReason?.includes(
      "acknowledged",
    ),
    true,
  );
  assert.equal(
    board.followUpActions[0].actionId,
    "follow-up:decision:alert-lifecycle-handoff",
  );

  const scopeBoundaryRow = board.evidenceDrilldownRows.find(
    (row) => row.source === "scope_boundary",
  );
  assert.ok(scopeBoundaryRow);
  assert.equal(
    scopeBoundaryRow?.path,
    "docs/development/steps/14-review-decision-register-and-handoff-checklist.md",
  );
  assert.ok(
    scopeBoundaryRow?.reviewNote.includes("scope boundary"),
  );
  assert.ok(
    board.evidenceDrilldownRows.every((row) => row.decisionId.startsWith("decision:")),
  );
});

test("Stage 15 review briefing board becomes ready when local follow-up work is complete", () => {
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
  const board = buildMissionConsoleView(resolvedFixture, "thermal")
    .reviewBriefingBoard;

  assert.ok(board);
  assert.equal(board.readinessStatus, "ready_for_handoff");
  assert.deepEqual(board.summary, {
    totalDecisionCount: 4,
    readyCount: 3,
    followUpCount: 0,
    deferredCount: 1,
    groupCount: 3,
    evidenceRowCount: 8,
    followUpActionCount: 0,
  });
  assert.equal(board.groupedDecisionSummaries[1].decisionCount, 0);
  assert.equal(board.followUpActions.length, 0);
  assert.ok(
    board.localOnlyScopeNotes.some((note) =>
      note.includes("Stage 14 decision register"),
    ),
  );
});
