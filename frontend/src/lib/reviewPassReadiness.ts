import type {
  ReviewGapResolutionEvidenceTargetChecklistRowView,
  ReviewGapResolutionPlaybookRowView,
  ReviewGapResolutionProofCommandReferenceView,
  ReviewGapResolutionView,
  ReviewPassChecklistItemStatus,
  ReviewPassChecklistItemView,
  ReviewPassDeferredBoundaryNoteView,
  ReviewPassEvidenceMapRowView,
  ReviewPassProofCommandReferenceView,
  ReviewPassReadinessRowStatus,
  ReviewPassReadinessRowView,
  ReviewPassReadinessVerdict,
  ReviewPassReadinessView,
} from "../features/mission-console/types.ts";

type ReadinessCounts = ReviewPassReadinessView["readiness"]["counts"];

const stage22ProofCommand: ReviewPassProofCommandReferenceView = {
  commandId: "review-pass-readiness",
  command:
    "node --experimental-strip-types --test tests/frontend/reviewPassReadiness.test.ts",
  label: "Stage 22 review-pass readiness test",
  purpose:
    "Proves the local review-pass readiness summary is derived from Stage 21 resolution rows.",
  source: "stage22_readiness",
};

export function buildReviewPassReadiness(
  reviewGapResolution: ReviewGapResolutionView | undefined,
): ReviewPassReadinessView | undefined {
  if (!reviewGapResolution?.resolutionRows.length) {
    return undefined;
  }

  const readinessRows = reviewGapResolution.resolutionRows
    .map(buildReadinessRow)
    .sort(compareReadinessRows)
    .map((row, index) => ({ ...row, rank: index + 1 }));
  const evidenceMapRows = readinessRows.flatMap((row) =>
    row.evidenceTargetIds.map((targetId) =>
      buildEvidenceMapRow(row, targetId, reviewGapResolution),
    ),
  );
  const staticReviewPassChecklist = readinessRows.map(buildChecklistItem);
  const counts = buildCounts(
    readinessRows,
    evidenceMapRows,
    reviewGapResolution.resolutionRows.length,
  );
  const verdict = readinessVerdict(counts);

  return {
    schema: "telemforge.review_pass_readiness.v1",
    version: 1,
    contractLabel: "local deterministic review-pass readiness",
    localStatus: reviewGapResolution.localStatus,
    readiness: {
      verdict,
      label: readinessLabel(verdict),
      summary: readinessSummary(verdict, counts),
      counts,
    },
    readinessRows,
    evidenceMapRows,
    staticReviewPassChecklist,
    proofCommandReferences: uniqueCommandReferences([
      stage22ProofCommand,
      ...reviewGapResolution.proofCommandReferences.map(toPassProofCommand),
    ]),
    deferredBoundaryNotes: buildDeferredBoundaryNotes(reviewGapResolution),
    staticEvidenceMapSummary:
      "Stage 22 evidence map rows are static repo-relative references only; the mission console does not execute proof commands or store reviewer progress.",
    sourceResolutionRows: reviewGapResolution.resolutionRows,
    sourceEvidenceTargetChecklistRows:
      reviewGapResolution.evidenceTargetChecklistRows,
    sourceEvidenceReferences: reviewGapResolution.sourceEvidenceReferences,
  };
}

function buildReadinessRow(
  row: ReviewGapResolutionPlaybookRowView,
): ReviewPassReadinessRowView {
  const status = readinessStatus(row);
  const proofCommandReferences = uniqueCommandReferences([
    stage22ProofCommand,
    ...row.proofCommandReferences.map(toPassProofCommand),
  ]);
  const evidenceTargetIds = row.evidenceTargetChecklistRows.map(
    (target) => target.targetRowId,
  );

  return {
    readinessRowId: `review-pass:${row.resolutionId}`,
    sourceResolutionId: row.resolutionId,
    rank: row.rank,
    priority: row.priority,
    status,
    actionability: row.actionability,
    label: row.label,
    summary: readinessRowSummary(row, status),
    sourceMatrixRowIds: row.sourceMatrixRowIds,
    sourceActionIds: row.sourceActionIds,
    evidenceTargetIds,
    sourceBuckets: row.sourceBuckets,
    proofCommandReferences,
    nextStaticReviewPassStep: nextStaticReviewPassStep(row, status),
  };
}

function readinessStatus(
  row: ReviewGapResolutionPlaybookRowView,
): ReviewPassReadinessRowStatus {
  if (row.actionability === "deferred_non_actionable") {
    return "deferred_production_boundary";
  }
  if (
    row.evidenceTargetChecklistRows.some(
      (target) => target.status === "needs_static_local_proof",
    )
  ) {
    return "needs_local_proof";
  }
  return "static_proof_ready";
}

function readinessRowSummary(
  row: ReviewGapResolutionPlaybookRowView,
  status: ReviewPassReadinessRowStatus,
): string {
  switch (status) {
    case "needs_local_proof":
      return `${row.evidenceTargetChecklistRows.length} static evidence target must be checked before the next local review pass.`;
    case "static_proof_ready":
      return "Static local proof references are ready for this review-pass row.";
    case "deferred_production_boundary":
      return "Production-only scope remains visible for boundary awareness and is not actionable in this local pass.";
  }
}

function nextStaticReviewPassStep(
  row: ReviewGapResolutionPlaybookRowView,
  status: ReviewPassReadinessRowStatus,
): string {
  switch (status) {
    case "needs_local_proof":
      return `Review ${row.label} in the Stage 21 resolution checklist, confirm the mapped Stage 19 source rows, then run the listed static proof references before the next local review pass.`;
    case "static_proof_ready":
      return `Keep ${row.label} in the local review-pass packet as static proof-ready evidence.`;
    case "deferred_production_boundary":
      return `Keep ${row.label} deferred and non-actionable; do not add reviewer ownership, signoff, persistence, or production handoff work in Stage 22.`;
  }
}

function buildEvidenceMapRow(
  row: ReviewPassReadinessRowView,
  targetId: string,
  reviewGapResolution: ReviewGapResolutionView,
): ReviewPassEvidenceMapRowView {
  const target = findEvidenceTarget(reviewGapResolution, targetId);

  return {
    mapRowId: `evidence-map:${row.sourceResolutionId}:${targetId}`,
    readinessRowId: row.readinessRowId,
    sourceResolutionId: row.sourceResolutionId,
    evidenceTargetId: target.targetRowId,
    label: target.label,
    status: row.status,
    actionability: row.actionability,
    sourceMatrixRowIds: target.sourceMatrixRowIds,
    sourceActionIds: target.sourceActionIds,
    sourceBucketLabels: target.sourceBucketLabels,
    proofCommandIds: unique(["review-pass-readiness", ...target.proofCommandIds]),
    nextStaticReviewPassStep: row.nextStaticReviewPassStep,
  };
}

function findEvidenceTarget(
  reviewGapResolution: ReviewGapResolutionView,
  targetId: string,
): ReviewGapResolutionEvidenceTargetChecklistRowView {
  const target = reviewGapResolution.evidenceTargetChecklistRows.find(
    (candidate) => candidate.targetRowId === targetId,
  );

  if (!target) {
    throw new Error(`Missing Stage 21 evidence target ${targetId}`);
  }

  return target;
}

function buildChecklistItem(
  row: ReviewPassReadinessRowView,
): ReviewPassChecklistItemView {
  return {
    itemId: `review-pass-check:${row.sourceResolutionId}`,
    label: row.label,
    status: checklistStatus(row.status),
    sourceReadinessRowIds: [row.readinessRowId],
    evidenceTargetIds: row.evidenceTargetIds,
    proofCommandIds: row.proofCommandReferences.map(
      (command) => command.commandId,
    ),
    nextStaticReviewPassStep: row.nextStaticReviewPassStep,
  };
}

function checklistStatus(
  status: ReviewPassReadinessRowStatus,
): ReviewPassChecklistItemStatus {
  switch (status) {
    case "needs_local_proof":
      return "local_proof_required";
    case "static_proof_ready":
      return "static_reference_ready";
    case "deferred_production_boundary":
      return "deferred_non_actionable";
  }
}

function buildCounts(
  rows: ReviewPassReadinessRowView[],
  evidenceMapRows: ReviewPassEvidenceMapRowView[],
  sourceResolutionRowCount: number,
): ReadinessCounts {
  return {
    totalReadinessRowCount: rows.length,
    localActionableRowCount: rows.filter(
      (row) => row.actionability === "local_actionable",
    ).length,
    localProofTargetCount: rows.filter(
      (row) => row.status === "needs_local_proof",
    ).length,
    staticProofReadyRowCount: rows.filter(
      (row) => row.status === "static_proof_ready",
    ).length,
    deferredProductionRowCount: rows.filter(
      (row) => row.status === "deferred_production_boundary",
    ).length,
    evidenceMapRowCount: evidenceMapRows.length,
    proofCommandReferenceCount: unique(
      rows.flatMap((row) =>
        row.proofCommandReferences.map((command) => command.commandId),
      ),
    ).length,
    sourceResolutionRowCount,
    sourceMatrixRowCount: unique(
      rows.flatMap((row) => row.sourceMatrixRowIds),
    ).length,
  };
}

function readinessVerdict(
  counts: ReadinessCounts,
): ReviewPassReadinessVerdict {
  if (counts.localProofTargetCount > 0) {
    return "local_proof_targets_pending";
  }
  if (counts.deferredProductionRowCount > 0) {
    return "deferred_production_only";
  }
  return "ready_for_local_review_pass";
}

function readinessLabel(verdict: ReviewPassReadinessVerdict): string {
  switch (verdict) {
    case "local_proof_targets_pending":
      return "Local proof targets pending";
    case "deferred_production_only":
      return "Only deferred production scope remains";
    case "ready_for_local_review_pass":
      return "Ready for local review pass";
  }
}

function readinessSummary(
  verdict: ReviewPassReadinessVerdict,
  counts: ReadinessCounts,
): string {
  switch (verdict) {
    case "local_proof_targets_pending":
      return `${counts.localProofTargetCount} local proof target rows are listed before ${counts.deferredProductionRowCount} deferred production rows.`;
    case "deferred_production_only":
      return "Local proof targets are clear; deferred production boundaries remain visible and non-actionable.";
    case "ready_for_local_review_pass":
      return "All local review-pass rows are static-proof ready with no deferred production rows.";
  }
}

function buildDeferredBoundaryNotes(
  reviewGapResolution: ReviewGapResolutionView,
): ReviewPassDeferredBoundaryNoteView[] {
  return reviewGapResolution.deferredBoundaryNotes.map((boundary) => ({
    boundaryId: `review-pass:${boundary.boundaryId}`,
    label: boundary.label,
    summary: boundary.summary,
    sourceMatrixRowIds: boundary.sourceMatrixRowIds,
    sourceActionIds: boundary.sourceActionIds,
    deferredNotes: boundary.deferredNotes,
    actionability: boundary.actionability,
  }));
}

function compareReadinessRows(
  left: ReviewPassReadinessRowView,
  right: ReviewPassReadinessRowView,
): number {
  return (
    readinessStatusRank(left.status) - readinessStatusRank(right.status) ||
    left.sourceResolutionId.localeCompare(right.sourceResolutionId)
  );
}

function readinessStatusRank(status: ReviewPassReadinessRowStatus): number {
  switch (status) {
    case "needs_local_proof":
      return 0;
    case "static_proof_ready":
      return 1;
    case "deferred_production_boundary":
      return 2;
  }
}

function toPassProofCommand(
  command: ReviewGapResolutionProofCommandReferenceView,
): ReviewPassProofCommandReferenceView {
  return { ...command };
}

function uniqueCommandReferences(
  commands: ReviewPassProofCommandReferenceView[],
): ReviewPassProofCommandReferenceView[] {
  const seen = new Set<string>();
  const uniqueCommands: ReviewPassProofCommandReferenceView[] = [];

  for (const command of commands) {
    if (!seen.has(command.commandId)) {
      uniqueCommands.push(command);
      seen.add(command.commandId);
    }
  }

  return uniqueCommands;
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}
