import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewGapResolution } from "../../frontend/src/lib/reviewGapResolution.ts";
import { buildReviewGapTriage } from "../../frontend/src/lib/reviewGapTriage.ts";
import { buildReviewHandoffCoverageMatrix } from "../../frontend/src/lib/reviewHandoffCoverageMatrix.ts";
import { buildReviewHandoffRehearsal } from "../../frontend/src/lib/reviewHandoffRehearsal.ts";
import { buildReviewPassReadiness } from "../../frontend/src/lib/reviewPassReadiness.ts";
import {
  acknowledgeAlertInFixture,
  resolveAlertInFixture,
} from "../../frontend/src/lib/operatorWorkflow.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("Stage 22 review-pass readiness maps Stage 21 rows into local proof targets first", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const readiness = view.reviewPassReadiness;

  assert.ok(readiness);
  assert.equal(readiness.schema, "telemforge.review_pass_readiness.v1");
  assert.equal(readiness.version, 1);
  assert.equal(
    readiness.contractLabel,
    "local deterministic review-pass readiness",
  );
  assert.equal(readiness.localStatus, "fixture");
  assert.deepEqual(readiness.readiness, {
    verdict: "local_proof_targets_pending",
    label: "Local proof targets pending",
    summary:
      "2 local proof target rows are listed before 1 deferred production rows.",
    counts: {
      totalReadinessRowCount: 3,
      localActionableRowCount: 2,
      localProofTargetCount: 2,
      staticProofReadyRowCount: 0,
      deferredProductionRowCount: 1,
      evidenceMapRowCount: 3,
      proofCommandReferenceCount: 9,
      sourceResolutionRowCount: 3,
      sourceMatrixRowCount: 3,
    },
  });
  assert.deepEqual(
    readiness.readinessRows.map((row) => [
      row.rank,
      row.status,
      row.actionability,
      row.label,
    ]),
    [
      [
        1,
        "needs_local_proof",
        "local_actionable",
        "Alert lifecycle needs local follow-up",
      ],
      [
        2,
        "needs_local_proof",
        "local_actionable",
        "Evidence export waits on packet gaps",
      ],
      [
        3,
        "deferred_production_boundary",
        "deferred_non_actionable",
        "Keep production handoff scope deferred",
      ],
    ],
  );

  const firstRow = readiness.readinessRows[0];
  assert.equal(
    firstRow.sourceResolutionId,
    "resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
  );
  assert.deepEqual(firstRow.sourceMatrixRowIds, [
    "coverage-row-1:action:follow-up:decision:alert-lifecycle-handoff",
  ]);
  assert.deepEqual(firstRow.sourceActionIds, [
    "action:follow-up:decision:alert-lifecycle-handoff",
  ]);
  assert.deepEqual(firstRow.evidenceTargetIds, [
    "evidence-target:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
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
      "review-pass-readiness",
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
  assert.equal(
    firstRow.nextStaticReviewPassStep,
    "Review Alert lifecycle needs local follow-up in the Stage 21 resolution checklist, confirm the mapped Stage 19 source rows, then run the listed static proof references before the next local review pass.",
  );
  assert.strictEqual(
    readiness.sourceResolutionRows,
    view.reviewGapResolution?.resolutionRows,
  );
  assert.strictEqual(
    readiness.sourceEvidenceTargetChecklistRows,
    view.reviewGapResolution?.evidenceTargetChecklistRows,
  );
});

test("Stage 22 evidence map binds each row to source ids and proof references", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const readiness = view.reviewPassReadiness;

  assert.ok(readiness);
  assert.equal(readiness.evidenceMapRows.length, 3);

  const firstMapRow = readiness.evidenceMapRows[0];
  assert.deepEqual(firstMapRow, {
    mapRowId:
      "evidence-map:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff:evidence-target:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
    readinessRowId:
      "review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
    sourceResolutionId:
      "resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
    evidenceTargetId:
      "evidence-target:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
    label: "Alert lifecycle needs local follow-up",
    status: "needs_local_proof",
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
      "review-pass-readiness",
      "review-gap-resolution",
      "review-gap-triage",
      "review-coverage-matrix",
      "review-handoff-rehearsal",
      "review-action-walkthrough",
      "review-action-queue",
      "console-view-model",
      "public-repo-guard",
    ],
    nextStaticReviewPassStep:
      "Review Alert lifecycle needs local follow-up in the Stage 21 resolution checklist, confirm the mapped Stage 19 source rows, then run the listed static proof references before the next local review pass.",
  });
  assert.deepEqual(
    readiness.staticReviewPassChecklist.map((item) => [
      item.status,
      item.evidenceTargetIds[0],
      item.proofCommandIds[0],
    ]),
    [
      [
        "local_proof_required",
        "evidence-target:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
        "review-pass-readiness",
      ],
      [
        "local_proof_required",
        "evidence-target:next-pass-2:action:follow-up:decision:evidence-export-boundary",
        "review-pass-readiness",
      ],
      [
        "deferred_non_actionable",
        "evidence-target:next-pass-3:action:deferred-production-handoff-scope",
        "review-pass-readiness",
      ],
    ],
  );
  assert.equal(
    readiness.staticEvidenceMapSummary,
    "Stage 22 evidence map rows are static repo-relative references only; the mission console does not execute proof commands or store reviewer progress.",
  );
});

test("Stage 22 proof commands stay static, repo-relative, and non-executable", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const readiness = view.reviewPassReadiness;

  assert.ok(readiness);
  assert.equal(readiness.proofCommandReferences.length, 11);
  assert.equal(
    readiness.proofCommandReferences[0].command,
    "node --experimental-strip-types --test tests/frontend/reviewPassReadiness.test.ts",
  );

  for (const command of readiness.proofCommandReferences) {
    assert.equal(command.command.startsWith("/"), false);
    assert.equal(command.command.includes("&&"), false);
    assert.equal(command.command.includes(";"), false);
    assert.equal(command.command.includes("$("), false);
    assert.equal(command.command.includes("`"), false);
    assert.match(command.command, /^(node|python3) /);
  }
});

test("Stage 22 keeps deferred production scope visible but non-actionable", () => {
  const acknowledgedFixture = acknowledgeAlertInFixture(
    stage07ConsoleFixture,
    "alert-stage06-thermal-avionics",
    "2026-06-04T05:30:00Z",
  );
  const resolvedFixture = resolveAlertInFixture(
    acknowledgedFixture,
    "alert-stage06-thermal-avionics",
    "2026-06-04T05:32:00Z",
  );
  const view = buildMissionConsoleView(resolvedFixture, "thermal");
  const readiness = view.reviewPassReadiness;

  assert.ok(readiness);
  assert.equal(readiness.readiness.verdict, "deferred_production_only");
  assert.deepEqual(readiness.readiness.counts, {
    totalReadinessRowCount: 1,
    localActionableRowCount: 0,
    localProofTargetCount: 0,
    staticProofReadyRowCount: 0,
    deferredProductionRowCount: 1,
    evidenceMapRowCount: 1,
    proofCommandReferenceCount: 7,
    sourceResolutionRowCount: 1,
    sourceMatrixRowCount: 1,
  });
  assert.equal(
    readiness.readinessRows[0].status,
    "deferred_production_boundary",
  );
  assert.equal(
    readiness.readinessRows[0].actionability,
    "deferred_non_actionable",
  );
  assert.ok(
    readiness.readinessRows[0].nextStaticReviewPassStep.includes(
      "deferred and non-actionable",
    ),
  );
  assert.equal(readiness.deferredBoundaryNotes.length, 1);
});

test("Stage 22 derives ready rows from Stage 21 static-proof-ready targets", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const queue = {
    ...view.reviewActionQueue!,
    actions: view.reviewActionQueue!.actions.filter(
      (action) =>
        action.actionId !==
        "action:follow-up:decision:evidence-export-boundary",
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

  const resolutionWithReadyRow = {
    ...resolution,
    resolutionRows: resolution.resolutionRows.map((row) =>
      row.actionability === "local_actionable"
        ? {
            ...row,
            evidenceTargetChecklistRows: row.evidenceTargetChecklistRows.map(
              (target) => ({
                ...target,
                status: "static_proof_ready" as const,
              }),
            ),
          }
        : row,
    ),
    evidenceTargetChecklistRows: resolution.evidenceTargetChecklistRows.map(
      (target) =>
        target.actionability === "local_actionable"
          ? { ...target, status: "static_proof_ready" as const }
          : target,
    ),
  };

  const readiness = buildReviewPassReadiness(resolutionWithReadyRow);

  assert.ok(readiness);
  assert.equal(
    readiness.readinessRows.find(
      (row) => row.actionability === "local_actionable",
    )?.status,
    "static_proof_ready",
  );
  assert.equal(readiness.readiness.counts.staticProofReadyRowCount, 1);
  assert.equal(readiness.readiness.counts.localProofTargetCount, 0);
  assert.equal(readiness.readiness.verdict, "deferred_production_only");
});
