import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewGapResolution } from "../../frontend/src/lib/reviewGapResolution.ts";
import { buildReviewGapTriage } from "../../frontend/src/lib/reviewGapTriage.ts";
import { buildReviewHandoffCoverageMatrix } from "../../frontend/src/lib/reviewHandoffCoverageMatrix.ts";
import { buildReviewHandoffRehearsal } from "../../frontend/src/lib/reviewHandoffRehearsal.ts";
import {
  acknowledgeAlertInFixture,
  resolveAlertInFixture,
} from "../../frontend/src/lib/operatorWorkflow.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("Stage 21 review gap resolution maps local blockers to static evidence targets", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const resolution = view.reviewGapResolution;

  assert.ok(resolution);
  assert.equal(resolution.schema, "telemforge.review_gap_resolution.v1");
  assert.equal(resolution.version, 1);
  assert.equal(
    resolution.contractLabel,
    "local deterministic review gap resolution",
  );
  assert.equal(resolution.localStatus, "fixture");
  assert.deepEqual(resolution.readiness, {
    verdict: "local_resolution_targets_ready",
    label: "Local resolution targets ready",
    summary:
      "2 local blocker rows have static proof targets before 1 deferred production rows.",
    counts: {
      totalResolutionRowCount: 3,
      localActionableRowCount: 2,
      deferredProductionRowCount: 1,
      evidenceTargetChecklistRowCount: 3,
      proofCommandReferenceCount: 8,
      sourceMatrixRowCount: 3,
    },
  });
  assert.deepEqual(
    resolution.resolutionRows.map((row) => [
      row.rank,
      row.category,
      row.actionability,
      row.label,
    ]),
    [
      [
        1,
        "local_blocker",
        "local_actionable",
        "Alert lifecycle needs local follow-up",
      ],
      [
        2,
        "local_blocker",
        "local_actionable",
        "Evidence export waits on packet gaps",
      ],
      [
        3,
        "deferred_production",
        "deferred_non_actionable",
        "Keep production handoff scope deferred",
      ],
    ],
  );

  const firstRow = resolution.resolutionRows[0];
  assert.equal(
    firstRow.resolutionId,
    "resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
  );
  assert.deepEqual(firstRow.sourceMatrixRowIds, [
    "coverage-row-1:action:follow-up:decision:alert-lifecycle-handoff",
  ]);
  assert.deepEqual(firstRow.sourceActionIds, [
    "action:follow-up:decision:alert-lifecycle-handoff",
  ]);
  assert.deepEqual(firstRow.sourceBuckets.map((bucket) => bucket.label), [
    "Briefing board rows",
    "Replay frames",
    "Runbook targets",
    "Incident packet refs",
    "Evidence export refs",
    "Source paths",
  ]);
  assert.deepEqual(
    firstRow.proofCommandReferences.map((command) => command.commandId),
    [
      "review-gap-resolution",
      "review-gap-triage",
      "review-coverage-matrix",
      "review-handoff-rehearsal",
      "review-action-walkthrough",
      "review-action-queue",
      "console-view-model",
      "public-repo-guard",
    ],
  );
  assert.equal(firstRow.evidenceTargetChecklistRows.length, 1);
  assert.deepEqual(firstRow.evidenceTargetChecklistRows[0], {
    targetRowId:
      "evidence-target:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
    triageItemId:
      "next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
    label: "Alert lifecycle needs local follow-up",
    status: "needs_static_local_proof",
    actionability: "local_actionable",
    sourceMatrixRowIds: [
      "coverage-row-1:action:follow-up:decision:alert-lifecycle-handoff",
    ],
    sourceActionIds: ["action:follow-up:decision:alert-lifecycle-handoff"],
    sourceBucketLabels: [
      "Briefing board rows",
      "Replay frames",
      "Runbook targets",
      "Incident packet refs",
      "Evidence export refs",
      "Source paths",
    ],
    proofCommandIds: [
      "review-gap-resolution",
      "review-gap-triage",
      "review-coverage-matrix",
      "review-handoff-rehearsal",
      "review-action-walkthrough",
      "review-action-queue",
      "console-view-model",
      "public-repo-guard",
    ],
    nextStaticLocalProofStep:
      "Inspect the Stage 20 row for Alert lifecycle needs local follow-up, confirm its Stage 19 source matrix row, then run the listed Stage 21 and upstream proof commands outside the console.",
  });
  assert.equal(
    firstRow.nextStaticLocalProofStep,
    firstRow.evidenceTargetChecklistRows[0].nextStaticLocalProofStep,
  );
  assert.deepEqual(resolution.localResolutionSummary, {
    summaryId: "local-resolution-summary",
    actionableRowCount: 2,
    topLocalBlockerLabel: "Alert lifecycle needs local follow-up",
    nextStaticLocalProofStep:
      "Inspect the Stage 20 row for Alert lifecycle needs local follow-up, confirm its Stage 19 source matrix row, then run the listed Stage 21 and upstream proof commands outside the console.",
  });
  assert.deepEqual(
    resolution.deferredBoundaryNotes.map((boundary) => [
      boundary.actionability,
      boundary.label,
      boundary.sourceActionIds[0],
    ]),
    [
      [
        "deferred_non_actionable",
        "Keep production handoff scope deferred",
        "action:deferred-production-handoff-scope",
      ],
    ],
  );
  assert.equal(
    resolution.staticProofChecklistSummary,
    "Stage 21 proof commands are static repo-relative references only; the mission console does not execute commands or store reviewer progress.",
  );
  assert.strictEqual(resolution.sourceTriageItems, view.reviewGapTriage?.nextPassItems);
});

test("Stage 21 resolution promotes missing targets before other local rows", () => {
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
  const matrix = buildReviewHandoffCoverageMatrix(rehearsal);
  const triage = buildReviewGapTriage(matrix);
  const resolution = buildReviewGapResolution(triage);

  assert.ok(resolution);
  assert.equal(resolution.readiness.verdict, "local_resolution_targets_ready");
  assert.deepEqual(
    resolution.resolutionRows.map((row) => [row.category, row.priority]),
    [
      ["missing_target", "p0"],
      ["local_blocker", "p1"],
      ["deferred_production", "p2"],
    ],
  );
  assert.equal(
    resolution.resolutionRows[0].evidenceTargetChecklistRows[0].status,
    "needs_static_local_proof",
  );
  assert.equal(
    resolution.resolutionRows[0].summary,
    "1 missing target checks keep this local row at the top of the next-pass plan.",
  );
  assert.equal(resolution.localResolutionSummary.actionableRowCount, 2);
});

test("Stage 21 proof commands stay static, repo-relative, and non-executable", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const resolution = view.reviewGapResolution;

  assert.ok(resolution);
  assert.equal(resolution.proofCommandReferences.length, 10);
  assert.equal(
    resolution.proofCommandReferences[0].command,
    "node --experimental-strip-types --test tests/frontend/reviewGapResolution.test.ts",
  );

  for (const command of resolution.proofCommandReferences) {
    assert.equal(command.command.startsWith("/"), false);
    assert.equal(command.command.includes("&&"), false);
    assert.equal(command.command.includes(";"), false);
    assert.equal(command.command.includes("$("), false);
    assert.equal(command.command.includes("`"), false);
    assert.match(command.command, /^(node|python3) /);
  }
});

test("Stage 21 keeps deferred production scope visible but non-actionable", () => {
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
  const resolution = view.reviewGapResolution;

  assert.ok(resolution);
  assert.equal(resolution.readiness.verdict, "deferred_production_only");
  assert.deepEqual(resolution.readiness.counts, {
    totalResolutionRowCount: 1,
    localActionableRowCount: 0,
    deferredProductionRowCount: 1,
    evidenceTargetChecklistRowCount: 1,
    proofCommandReferenceCount: 6,
    sourceMatrixRowCount: 1,
  });
  assert.equal(resolution.resolutionRows[0].actionability, "deferred_non_actionable");
  assert.equal(
    resolution.resolutionRows[0].evidenceTargetChecklistRows[0].status,
    "deferred_production_boundary",
  );
  assert.ok(
    resolution.resolutionRows[0].nextStaticLocalProofStep.includes(
      "Do not convert",
    ),
  );
  assert.equal(resolution.localResolutionSummary.actionableRowCount, 0);
  assert.equal(resolution.localResolutionSummary.topLocalBlockerLabel, null);
});
