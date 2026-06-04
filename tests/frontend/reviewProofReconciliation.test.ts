import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewProofReconciliation } from "../../frontend/src/lib/reviewProofReconciliation.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("Stage 29 proof reconciliation derives rows from Stage 28 navigator rows and buckets consistency states", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const reconciliation = buildReviewProofReconciliation(view.reviewProofNavigator);

  assert.ok(reconciliation);
  assert.ok(view.reviewProofNavigator);
  assert.equal(reconciliation.schema, "telemforge.review_proof_reconciliation.v1");
  assert.equal(reconciliation.version, 1);
  assert.equal(
    reconciliation.contractLabel,
    "local deterministic review proof-chain reconciliation map",
  );
  assert.equal(reconciliation.localStatus, "fixture");
  assert.equal(
    reconciliation.summary.defaultNavigatorRowId,
    view.reviewProofNavigator.summary.defaultNavigatorRowId,
  );
  assert.equal(
    reconciliation.summary.defaultReconciliationRowId,
    `proof-reconciliation:${view.reviewProofNavigator.summary.defaultNavigatorRowId}`,
  );
  assert.equal(reconciliation.summary.counts.totalReconciliationRowCount, 3);
  assert.equal(reconciliation.summary.counts.completeLocalChainRowCount, 0);
  assert.equal(reconciliation.summary.counts.localInspectionGapRowCount, 2);
  assert.equal(reconciliation.summary.counts.deferredProductionBoundaryRowCount, 1);
  assert.equal(reconciliation.summary.counts.consistencyBucketCount, 3);
  assert.equal(reconciliation.summary.counts.deferredBoundaryNoteCount, 1);
  assert.equal(
    reconciliation.summary.counts.staticInspectionPromptCount,
    view.reviewProofNavigator.staticInspectionPrompts.length,
  );
  assert.equal(
    reconciliation.summary.counts.proofCommandReferenceCount,
    view.reviewProofNavigator.staticCommandReferences.length,
  );
  assert.ok(reconciliation.summary.counts.sourceChainSegmentCount > 0);
  assert.ok(reconciliation.summary.counts.staticReviewReferenceCount > 0);
  assert.deepEqual(
    reconciliation.reconciliationRows.map((row) => [
      row.rank,
      row.bucketKind,
      row.navigatorRowId,
      row.packetId,
      row.defaultRow,
    ]),
    view.reviewProofNavigator.navigatorRows.map((row, index) => [
      index + 1,
      row.packetStatus === "deferred_production_scope"
        ? "deferred_production_boundary"
        : row.packetStatus === "ready_local_evidence"
          ? "complete_local_chain"
          : "local_inspection_gap",
      row.navigatorRowId,
      row.packetId,
      row.defaultRow,
    ]),
  );
  assert.deepEqual(
    reconciliation.consistencyBuckets.map((bucket) => [
      bucket.bucketKind,
      bucket.rowCount,
      bucket.reconciliationRowIds,
      bucket.localOnly,
      bucket.nonCertifying,
    ]),
    [
      [
        "complete_local_chain",
        0,
        [],
        true,
        true,
      ],
      [
        "local_inspection_gap",
        2,
        reconciliation.reconciliationRows.slice(0, 2).map((row) => row.reconciliationRowId),
        true,
        true,
      ],
      [
        "deferred_production_boundary",
        1,
        [reconciliation.reconciliationRows[2].reconciliationRowId],
        true,
        true,
      ],
    ],
  );
  assert.strictEqual(reconciliation.sourceNavigator, view.reviewProofNavigator);
});

test("Stage 29 default reconciliation row follows the Stage 28 default navigator row and preserves source-chain ids", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const reconciliation = view.reviewProofReconciliation;

  assert.ok(reconciliation);
  assert.ok(view.reviewProofNavigator);

  const defaultNavigatorRow = view.reviewProofNavigator.defaultNavigatorRow;
  const defaultReconciliationRow = reconciliation.defaultReconciliationRow;
  const promptIds = view.reviewProofNavigator.staticInspectionPrompts
    .filter((prompt) =>
      prompt.navigatorRowIds.includes(defaultNavigatorRow.navigatorRowId),
    )
    .map((prompt) => prompt.promptId);

  assert.equal(defaultReconciliationRow.navigatorRowId, defaultNavigatorRow.navigatorRowId);
  assert.equal(defaultReconciliationRow.packetId, defaultNavigatorRow.packetId);
  assert.equal(defaultReconciliationRow.sourcePriorityRowId, defaultNavigatorRow.sourcePriorityRowId);
  assert.deepEqual(defaultReconciliationRow.sourceCoverageRowIds, defaultNavigatorRow.sourceCoverageRowIds);
  assert.deepEqual(defaultReconciliationRow.sourceTraceRowIds, defaultNavigatorRow.sourceTraceRowIds);
  assert.deepEqual(defaultReconciliationRow.sourceOutcomeRowIds, defaultNavigatorRow.sourceOutcomeRowIds);
  assert.deepEqual(defaultReconciliationRow.sourceReadinessRowIds, defaultNavigatorRow.sourceReadinessRowIds);
  assert.deepEqual(defaultReconciliationRow.sourceResolutionIds, defaultNavigatorRow.sourceResolutionIds);
  assert.deepEqual(defaultReconciliationRow.sourceMatrixRowIds, defaultNavigatorRow.sourceMatrixRowIds);
  assert.deepEqual(defaultReconciliationRow.sourceActionIds, defaultNavigatorRow.sourceActionIds);
  assert.deepEqual(defaultReconciliationRow.evidenceTargetIds, defaultNavigatorRow.evidenceTargetIds);
  assert.deepEqual(defaultReconciliationRow.proofCommandIds, defaultNavigatorRow.proofCommandIds);
  assert.deepEqual(defaultReconciliationRow.staticHumanGateStepIds, defaultNavigatorRow.staticHumanGateStepIds);
  assert.deepEqual(defaultReconciliationRow.sourceStaticReviewStepIds, defaultNavigatorRow.sourceStaticReviewStepIds);
  assert.deepEqual(defaultReconciliationRow.deferredBoundaryMarkerIds, defaultNavigatorRow.deferredBoundaryMarkerIds);
  assert.deepEqual(defaultReconciliationRow.staticInspectionPromptIds, promptIds);
  assert.equal(defaultReconciliationRow.localInspectionRequired, true);
  assert.equal(defaultReconciliationRow.deferredProductionBoundary, false);
  assert.equal(defaultReconciliationRow.informationalOnly, true);
  assert.equal(defaultReconciliationRow.nonExecutable, true);
  assert.equal(defaultReconciliationRow.nonCertifying, true);
  assert.deepEqual(
    defaultReconciliationRow.sourceChainSegments.map((segment) => [
      segment.kind,
      segment.sourceIds,
      segment.complete,
      segment.nonExecutable,
    ]),
    [
      ["proof_packet", [defaultNavigatorRow.packetId], true, true],
      ["priority", [defaultNavigatorRow.sourcePriorityRowId], true, true],
      ["coverage", defaultNavigatorRow.sourceCoverageRowIds, true, true],
      ["trace", defaultNavigatorRow.sourceTraceRowIds, true, true],
      ["outcome", defaultNavigatorRow.sourceOutcomeRowIds, true, true],
      ["readiness", defaultNavigatorRow.sourceReadinessRowIds, true, true],
      ["resolution", defaultNavigatorRow.sourceResolutionIds, true, true],
      ["matrix", defaultNavigatorRow.sourceMatrixRowIds, true, true],
      ["action", defaultNavigatorRow.sourceActionIds, true, true],
      ["evidence_target", defaultNavigatorRow.evidenceTargetIds, true, true],
      ["proof_command", defaultNavigatorRow.proofCommandIds, true, true],
      ["static_human_gate", defaultNavigatorRow.staticHumanGateStepIds, true, true],
      ["static_inspection_prompt", promptIds, true, true],
      ["deferred_boundary", [], false, true],
    ],
  );
});

test("Stage 29 static references and deferred notes stay local, non-executing, and non-certifying", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const reconciliation = view.reviewProofReconciliation;

  assert.ok(reconciliation);
  assert.ok(view.reviewProofNavigator);

  assert.ok(
    reconciliation.staticReviewReferences.every(
      (reference) =>
        reference.localOnly &&
        reference.sourceBacked &&
        reference.staticOnly &&
        reference.nonExecutable &&
        reference.nonCertifying &&
        !reference.repoRelativeReference.startsWith("/") &&
        reference.reconciliationRowIds.length > 0,
    ),
  );
  assert.ok(
    reconciliation.staticReviewReferences.some(
      (reference) =>
        reference.repoRelativeReference ===
        "frontend/src/lib/reviewProofReconciliation.ts",
    ),
  );
  assert.equal(
    reconciliation.staticReconciliationSummary,
    "Stage 29 proof-chain reconciliation rows, consistency buckets, static references, and deferred notes are local, source-backed, non-executable, informational, and non-certifying; the mission console does not save reconciliation selections, store reviewer progress, run commands, score proof readiness, or export handoff reports.",
  );

  const deferredMarker = view.reviewProofNavigator.deferredBoundaryMarkers[0];

  assert.ok(deferredMarker);
  assert.deepEqual(reconciliation.deferredBoundaryNotes, [
    {
      noteId: `proof-reconciliation-note:${deferredMarker.markerId}`,
      markerId: deferredMarker.markerId,
      reconciliationRowId: `proof-reconciliation:${deferredMarker.navigatorRowId}`,
      navigatorRowId: deferredMarker.navigatorRowId,
      packetId: deferredMarker.packetId,
      label: deferredMarker.label,
      summary: deferredMarker.summary,
      sourcePriorityRowIds: deferredMarker.sourcePriorityRowIds,
      sourceCoverageRowIds: deferredMarker.sourceCoverageRowIds,
      sourceTraceRowIds: deferredMarker.sourceTraceRowIds,
      sourceOutcomeRowIds: deferredMarker.sourceOutcomeRowIds,
      evidenceTargetIds: deferredMarker.evidenceTargetIds,
      actionability: "deferred_non_actionable",
      nonActionable: true,
      informationalOnly: true,
      nonCertifying: true,
    },
  ]);
});
