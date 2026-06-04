import type {
  ReviewGapResolutionDeferredBoundaryNoteView,
  ReviewGapResolutionEvidenceTargetChecklistRowView,
  ReviewGapResolutionEvidenceTargetStatus,
  ReviewGapResolutionPlaybookRowView,
  ReviewGapResolutionProofCommandReferenceView,
  ReviewGapResolutionReadinessVerdict,
  ReviewGapResolutionView,
  ReviewGapTriageNextPassItemView,
  ReviewGapTriageProofCommandReferenceView,
  ReviewGapTriageView,
} from "../features/mission-console/types.ts";

type ResolutionCounts = ReviewGapResolutionView["readiness"]["counts"];

const stage21ProofCommand: ReviewGapResolutionProofCommandReferenceView = {
  commandId: "review-gap-resolution",
  command:
    "node --experimental-strip-types --test tests/frontend/reviewGapResolution.test.ts",
  label: "Stage 21 resolution test",
  purpose:
    "Proves the review gap resolution playbook is derived from Stage 20 triage rows.",
  source: "stage21_resolution",
};

export function buildReviewGapResolution(
  reviewGapTriage: ReviewGapTriageView | undefined,
): ReviewGapResolutionView | undefined {
  if (!reviewGapTriage?.nextPassItems.length) {
    return undefined;
  }

  const resolutionRows = reviewGapTriage.nextPassItems.map(buildResolutionRow);
  const evidenceTargetChecklistRows = resolutionRows.flatMap(
    (row) => row.evidenceTargetChecklistRows,
  );
  const counts = buildCounts(
    resolutionRows,
    evidenceTargetChecklistRows,
    reviewGapTriage.sourceMatrixRows.length,
  );
  const verdict = readinessVerdict(counts);

  return {
    schema: "telemforge.review_gap_resolution.v1",
    version: 1,
    contractLabel: "local deterministic review gap resolution",
    localStatus: reviewGapTriage.localStatus,
    readiness: {
      verdict,
      label: readinessLabel(verdict),
      summary: readinessSummary(verdict, counts),
      counts,
    },
    resolutionRows,
    evidenceTargetChecklistRows,
    proofCommandReferences: [
      stage21ProofCommand,
      ...reviewGapTriage.proofCommandReferences.map(toResolutionProofCommand),
    ],
    localResolutionSummary: buildLocalResolutionSummary(resolutionRows),
    deferredBoundaryNotes: buildDeferredBoundaryNotes(reviewGapTriage),
    staticProofChecklistSummary:
      "Stage 21 proof commands are static repo-relative references only; the mission console does not execute commands or store reviewer progress.",
    sourceTriageItems: reviewGapTriage.nextPassItems,
    sourceEvidenceReferences: reviewGapTriage.sourceEvidenceReferences,
  };
}

function buildResolutionRow(
  item: ReviewGapTriageNextPassItemView,
): ReviewGapResolutionPlaybookRowView {
  const proofCommandReferences = [
    stage21ProofCommand,
    ...item.proofCommandReferences.map(toResolutionProofCommand),
  ];
  const evidenceTargetChecklistRows = [
    buildEvidenceTargetChecklistRow(item, proofCommandReferences),
  ];

  return {
    resolutionId: `resolution:${item.itemId}`,
    rank: item.rank,
    priority: item.priority,
    category: item.category,
    actionability: item.actionability,
    label: item.label,
    summary: item.summary,
    blockerSummary: item.blockerSummary,
    sourceMatrixRowIds: item.sourceMatrixRowIds,
    sourceActionIds: item.sourceActionIds,
    sourceBuckets: item.sourceBuckets,
    proofCommandReferences,
    evidenceTargetChecklistRows,
    nextStaticLocalProofStep:
      evidenceTargetChecklistRows[0].nextStaticLocalProofStep,
  };
}

function buildEvidenceTargetChecklistRow(
  item: ReviewGapTriageNextPassItemView,
  proofCommandReferences: ReviewGapResolutionProofCommandReferenceView[],
): ReviewGapResolutionEvidenceTargetChecklistRowView {
  return {
    targetRowId: `evidence-target:${item.itemId}`,
    triageItemId: item.itemId,
    label: item.label,
    status: evidenceTargetStatus(item),
    actionability: item.actionability,
    sourceMatrixRowIds: item.sourceMatrixRowIds,
    sourceActionIds: item.sourceActionIds,
    sourceBucketLabels: item.sourceBuckets.map((bucket) => bucket.label),
    proofCommandIds: proofCommandReferences.map((command) => command.commandId),
    nextStaticLocalProofStep: nextStaticLocalProofStep(item),
  };
}

function evidenceTargetStatus(
  item: ReviewGapTriageNextPassItemView,
): ReviewGapResolutionEvidenceTargetStatus {
  if (item.actionability === "deferred_non_actionable") {
    return "deferred_production_boundary";
  }
  if (item.category === "ready_local_review") {
    return "static_proof_ready";
  }
  return "needs_static_local_proof";
}

function nextStaticLocalProofStep(
  item: ReviewGapTriageNextPassItemView,
): string {
  if (item.actionability === "deferred_non_actionable") {
    return `Do not convert ${item.label} into a local task; keep it visible as a deferred production boundary until a later stage explicitly changes the scope.`;
  }

  return `Inspect the Stage 20 row for ${item.label}, confirm its Stage 19 source matrix row, then run the listed Stage 21 and upstream proof commands outside the console.`;
}

function buildCounts(
  rows: ReviewGapResolutionPlaybookRowView[],
  evidenceTargetChecklistRows: ReviewGapResolutionEvidenceTargetChecklistRowView[],
  sourceMatrixRowCount: number,
): ResolutionCounts {
  return {
    totalResolutionRowCount: rows.length,
    localActionableRowCount: rows.filter(
      (row) => row.actionability === "local_actionable",
    ).length,
    deferredProductionRowCount: rows.filter(
      (row) => row.actionability === "deferred_non_actionable",
    ).length,
    evidenceTargetChecklistRowCount: evidenceTargetChecklistRows.length,
    proofCommandReferenceCount: unique(
      rows.flatMap((row) =>
        row.proofCommandReferences.map((command) => command.commandId),
      ),
    ).length,
    sourceMatrixRowCount,
  };
}

function readinessVerdict(
  counts: ResolutionCounts,
): ReviewGapResolutionReadinessVerdict {
  if (counts.localActionableRowCount > 0) {
    return "local_resolution_targets_ready";
  }
  if (counts.deferredProductionRowCount > 0) {
    return "deferred_production_only";
  }
  return "ready_for_next_local_review";
}

function readinessLabel(
  verdict: ReviewGapResolutionReadinessVerdict,
): string {
  switch (verdict) {
    case "local_resolution_targets_ready":
      return "Local resolution targets ready";
    case "deferred_production_only":
      return "Only deferred production scope remains";
    case "ready_for_next_local_review":
      return "Ready for next local review";
  }
}

function readinessSummary(
  verdict: ReviewGapResolutionReadinessVerdict,
  counts: ResolutionCounts,
): string {
  switch (verdict) {
    case "local_resolution_targets_ready":
      return `${counts.localActionableRowCount} local blocker rows have static proof targets before ${counts.deferredProductionRowCount} deferred production rows.`;
    case "deferred_production_only":
      return "Local resolution blockers are clear; production-only boundaries remain visible and non-actionable.";
    case "ready_for_next_local_review":
      return "No local resolution blockers or deferred production boundaries remain.";
  }
}

function buildLocalResolutionSummary(
  rows: ReviewGapResolutionPlaybookRowView[],
) {
  const localRows = rows.filter((row) => row.actionability === "local_actionable");
  const topLocalRow = localRows[0];

  return {
    summaryId: "local-resolution-summary",
    actionableRowCount: localRows.length,
    topLocalBlockerLabel: topLocalRow?.label ?? null,
    nextStaticLocalProofStep:
      topLocalRow?.nextStaticLocalProofStep ??
      "No local blockers remain; keep deferred production scope visible but non-actionable.",
  };
}

function buildDeferredBoundaryNotes(
  reviewGapTriage: ReviewGapTriageView,
): ReviewGapResolutionDeferredBoundaryNoteView[] {
  return reviewGapTriage.deferredProductionBoundaries.map((boundary) => ({
    boundaryId: `resolution:${boundary.boundaryId}`,
    label: boundary.label,
    summary: boundary.summary,
    sourceMatrixRowIds: boundary.sourceMatrixRowIds,
    sourceActionIds: boundary.sourceActionIds,
    deferredNotes: boundary.deferredNotes,
    actionability: boundary.actionability,
  }));
}

function toResolutionProofCommand(
  command: ReviewGapTriageProofCommandReferenceView,
): ReviewGapResolutionProofCommandReferenceView {
  return { ...command };
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}
