import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewHandoffCoverageMatrix } from "../../frontend/src/lib/reviewHandoffCoverageMatrix.ts";
import { buildReviewHandoffRehearsal } from "../../frontend/src/lib/reviewHandoffRehearsal.ts";
import {
  acknowledgeAlertInFixture,
  resolveAlertInFixture,
} from "../../frontend/src/lib/operatorWorkflow.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("Stage 19 review coverage matrix mirrors the Stage 18 rehearsal and exposes the command checklist", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const matrix = buildReviewHandoffCoverageMatrix(view.reviewHandoffRehearsal);

  assert.ok(matrix);
  assert.equal(matrix.schema, "telemforge.review_handoff_coverage_matrix.v1");
  assert.equal(matrix.version, 1);
  assert.equal(matrix.contractLabel, "local deterministic review coverage matrix");
  assert.equal(matrix.localStatus, "fixture");
  assert.equal(matrix.readiness.verdict, "blocked_by_local_follow_up");
  assert.deepEqual(matrix.readiness.counts, {
    totalRowCount: 3,
    blockingRowCount: 2,
    missingTargetRowCount: 0,
    deferredProductionRowCount: 1,
    resolvedTargetCount: 6,
    missingTargetCount: 0,
    sourceEvidenceReferenceCount: 6,
  });
  assert.deepEqual(
    matrix.rows.map((row) => [row.rowNumber, row.actionId, row.readinessVerdict]),
    [
      [1, "action:follow-up:decision:alert-lifecycle-handoff", "blocked_by_local_follow_up"],
      [2, "action:follow-up:decision:evidence-export-boundary", "blocked_by_local_follow_up"],
      [3, "action:deferred-production-handoff-scope", "deferred_production_scope_only"],
    ],
  );

  const firstRow = matrix.rows[0];
  assert.equal(
    firstRow.rehearsalStepId,
    "handoff-step-1:action:follow-up:decision:alert-lifecycle-handoff",
  );
  assert.equal(firstRow.blockerStatus, "blocked");
  assert.equal(firstRow.targetCoverageCounts.totalTargetCount, 3);
  assert.equal(firstRow.sourceCoverageBuckets.length, 6);
  assert.equal(firstRow.sourceCoverageBuckets[0].label, "Briefing board rows");
  assert.equal(firstRow.sourceCoverageBuckets[0].count, 6);
  assert.ok(
    firstRow.sourceEvidenceReferences.includes(
      "frontend/src/lib/reviewActionQueue.ts",
    ),
  );
  assert.equal(matrix.localVerificationCommands.length, 8);
  assert.equal(
    matrix.localVerificationCommands[0].command,
    "node --experimental-strip-types --test tests/frontend/reviewHandoffCoverageMatrix.test.ts",
  );
  assert.equal(
    matrix.localVerificationCommands.at(-1)?.command,
    "python3 scripts/public_repo_guard.py --scan-history",
  );
  assert.ok(
    matrix.nextLocalPrompt.includes("Stage 19 local review coverage matrix"),
  );
  assert.ok(
    matrix.deferredProductionNotes.some((note) =>
      note.toLowerCase().includes("production"),
    ),
  );
  assert.ok(
    matrix.sourceEvidenceReferences.includes(
      "frontend/src/lib/reviewBriefingBoard.ts",
    ),
  );
});

test("Stage 19 review coverage matrix reports missing evidence targets as blocking rows", () => {
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

  assert.ok(matrix);
  assert.equal(matrix.readiness.verdict, "blocked_by_local_follow_up");
  assert.equal(matrix.readiness.counts.blockingRowCount, 2);
  assert.equal(matrix.rows[0].blockerStatus, "blocked");
  assert.equal(matrix.rows[0].readinessVerdict, "blocked_by_local_follow_up");
  assert.ok(matrix.rows[0].blockerSummary.includes("missing evidence target"));
  assert.equal(matrix.rows[0].targetCoverageCounts.missingTargetCount, 1);
  assert.equal(matrix.unresolvedLocalBlockers.length, 2);
});

test("Stage 19 review coverage matrix keeps deferred production scope visible but non-blocking after local evidence is ready", () => {
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
  const matrix = buildReviewHandoffCoverageMatrix(view.reviewHandoffRehearsal);

  assert.ok(matrix);
  assert.equal(matrix.readiness.verdict, "deferred_production_scope_only");
  assert.deepEqual(matrix.readiness.counts, {
    totalRowCount: 1,
    blockingRowCount: 0,
    missingTargetRowCount: 0,
    deferredProductionRowCount: 1,
    resolvedTargetCount: 1,
    missingTargetCount: 0,
    sourceEvidenceReferenceCount: 6,
  });
  assert.equal(matrix.rows[0].blockerStatus, "deferred");
  assert.equal(matrix.rows[0].readinessVerdict, "deferred_production_scope_only");
  assert.ok(matrix.rows[0].blockerSummary.includes("non-blocking"));
  assert.equal(matrix.unresolvedLocalBlockers.length, 0);
  assert.equal(matrix.localVerificationCommands[0].label, "Matrix helper test");
});
