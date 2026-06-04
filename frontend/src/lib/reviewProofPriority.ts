import type {
  ReviewEvidenceCoverageDeferredBoundaryRollupView,
  ReviewEvidenceCoverageProofCommandReferenceView,
  ReviewEvidenceCoverageRowStatus,
  ReviewEvidenceCoverageRowView,
  ReviewEvidenceCoverageView,
  ReviewProofPriorityActionability,
  ReviewProofPriorityDeferredBoundaryContextView,
  ReviewProofPriorityPriority,
  ReviewProofPriorityProofCommandReferenceView,
  ReviewProofPriorityReasonView,
  ReviewProofPriorityRowView,
  ReviewProofPriorityStaticCheckReferenceView,
  ReviewProofPriorityStaticRadarGroupView,
  ReviewProofPriorityView,
} from "../features/mission-console/types.ts";

type PriorityCounts = ReviewProofPriorityView["summary"]["counts"];

const stage26ProofCommand: ReviewProofPriorityProofCommandReferenceView = {
  commandId: "review-proof-priority",
  command:
    "node --experimental-strip-types --test tests/frontend/reviewProofPriority.test.ts",
  label: "Stage 26 proof priority test",
  purpose:
    "Proves the local proof priority lens is derived from Stage 25 coverage rows.",
  source: "stage26_priority",
};

const statusDefinitions: Record<
  ReviewEvidenceCoverageRowStatus,
  {
    priority: ReviewProofPriorityPriority;
    actionability: ReviewProofPriorityActionability;
    label: string;
    rankingSummary: string;
    sortRank: number;
  }
> = {
  unresolved_local_proof_gap: {
    priority: "p0",
    actionability: "local_review_required",
    label: "Unresolved local proof gap",
    rankingSummary:
      "Ranked first because Stage 25 marks this coverage row as an unresolved local proof gap with local static proof still required.",
    sortRank: 0,
  },
  ready_local_evidence: {
    priority: "p1",
    actionability: "local_evidence_ready",
    label: "Ready local evidence",
    rankingSummary:
      "Ranked after unresolved gaps because Stage 25 marks this coverage row as ready local evidence.",
    sortRank: 1,
  },
  deferred_production_scope: {
    priority: "p2",
    actionability: "deferred_non_actionable",
    label: "Deferred production scope",
    rankingSummary:
      "Ranked after local review rows because Stage 25 marks this coverage row as deferred production scope.",
    sortRank: 2,
  },
};

export function buildReviewProofPriority(
  reviewEvidenceCoverage: ReviewEvidenceCoverageView | undefined,
): ReviewProofPriorityView | undefined {
  if (!reviewEvidenceCoverage?.coverageRows.length) {
    return undefined;
  }

  const proofCommandReferences = uniqueCommandReferences([
    stage26ProofCommand,
    ...reviewEvidenceCoverage.proofCommandReferences.map(toPriorityProofCommand),
  ]);
  const priorityRows = reviewEvidenceCoverage.coverageRows
    .map(buildPriorityRow)
    .sort(comparePriorityRows)
    .map((row, index) => ({ ...row, rank: index + 1 }));
  const defaultPriorityRow =
    priorityRows.find((row) => row.status === "unresolved_local_proof_gap") ??
    priorityRows[0];
  const staticCheckRadarGroups = priorityRows.map((row) =>
    buildStaticRadarGroup(row, proofCommandReferences),
  );
  const deferredBoundaryContexts = buildDeferredBoundaryContexts(
    reviewEvidenceCoverage.deferredBoundaryRollups,
    priorityRows,
  );
  const counts = buildCounts(
    priorityRows,
    proofCommandReferences,
    staticCheckRadarGroups,
    deferredBoundaryContexts,
  );
  const defaultStaticRadarGroup = staticCheckRadarGroups.find(
    (group) => group.priorityRowId === defaultPriorityRow.priorityRowId,
  );

  return {
    schema: "telemforge.review_proof_priority.v1",
    version: 1,
    contractLabel: "local deterministic review proof priority radar",
    localStatus: reviewEvidenceCoverage.localStatus,
    summary: {
      priorityId: "candidate-local-review-proof-priority",
      label: "Local proof priority lens",
      summary: summaryText(defaultPriorityRow, counts),
      defaultPriorityRowId: defaultPriorityRow.priorityRowId,
      defaultStaticRadarGroupId:
        defaultStaticRadarGroup?.radarGroupId ?? "static-radar:none",
      defaultProofBucketLabel: defaultPriorityRow.proofBucketLabels[0],
      informationalOnly: true,
      nonCertifying: true,
      counts,
    },
    priorityRows,
    defaultPriorityRow,
    staticCheckRadarGroups,
    deferredBoundaryContexts,
    proofCommandReferences,
    staticCheckRadarSummary:
      "Stage 26 static check radar references are repo-relative, local, and non-executable; the mission console does not run commands, save priority filters, store progress, or certify production readiness.",
    sourceCoverage: reviewEvidenceCoverage,
  };
}

function buildPriorityRow(
  row: ReviewEvidenceCoverageRowView,
): ReviewProofPriorityRowView {
  const definition = statusDefinitions[row.status];
  const priorityRowId = `priority-row:${row.coverageRowId}`;
  const sourceCoverageRowIds = [row.coverageRowId];
  const staticReviewStepIds = row.nextStaticReviewSteps.map((step) => step.stepId);

  return {
    priorityRowId,
    rank: row.rank,
    priority: definition.priority,
    status: row.status,
    actionability: definition.actionability,
    label: row.label,
    summary: row.summary,
    rankingSummary: definition.rankingSummary,
    sourceCoverageRowIds,
    sourceTraceRowIds: row.sourceTraceRowIds,
    sourceOutcomeRowIds: row.sourceOutcomeRowIds,
    sourceReadinessRowIds: row.sourceReadinessRowIds,
    sourceResolutionIds: row.sourceResolutionIds,
    sourceMatrixRowIds: row.sourceMatrixRowIds,
    sourceActionIds: row.sourceActionIds,
    evidenceTargetIds: row.evidenceTargetIds,
    sourceBucketLabels: row.sourceBucketLabels,
    proofBucketLabels: row.proofBucketLabels,
    proofCommandIds: row.proofCommandIds,
    staticReviewStepIds,
    staticReviewSteps: row.nextStaticReviewSteps,
    rankingReasons: [
      buildRankingReason(
        row,
        definition.label,
        definition.rankingSummary,
        sourceCoverageRowIds,
        staticReviewStepIds,
      ),
    ],
    sourceCoverageReferences: [
      {
        coverageRowId: row.coverageRowId,
        sourceTraceRowIds: row.sourceTraceRowIds,
        sourceOutcomeRowIds: row.sourceOutcomeRowIds,
        sourceReadinessRowIds: row.sourceReadinessRowIds,
        sourceResolutionIds: row.sourceResolutionIds,
        sourceMatrixRowIds: row.sourceMatrixRowIds,
        sourceActionIds: row.sourceActionIds,
        evidenceTargetIds: row.evidenceTargetIds,
        sourceBucketLabels: row.sourceBucketLabels,
      },
    ],
    deferredBoundaryNotes: row.deferredBoundaryNotes,
    informationalOnly: true,
    nonCertifying: true,
  };
}

function buildRankingReason(
  row: ReviewEvidenceCoverageRowView,
  label: string,
  summary: string,
  sourceCoverageRowIds: string[],
  staticReviewStepIds: string[],
): ReviewProofPriorityReasonView {
  return {
    reasonId: `priority-reason:${row.coverageRowId}:status`,
    label,
    summary,
    sourceCoverageRowIds,
    sourceTraceRowIds: row.sourceTraceRowIds,
    evidenceTargetIds: row.evidenceTargetIds,
    proofBucketLabels: row.proofBucketLabels,
    staticReviewStepIds,
  };
}

function buildStaticRadarGroup(
  row: ReviewProofPriorityRowView,
  proofCommandReferences: ReviewProofPriorityProofCommandReferenceView[],
): ReviewProofPriorityStaticRadarGroupView {
  const proofBucketLabel = row.proofBucketLabels[0];
  const checks = row.proofCommandIds.map((proofCommandId) =>
    buildStaticCheckReference(row, proofCommandId, proofCommandReferences),
  );

  return {
    radarGroupId: `static-radar:${row.priorityRowId}:${slug(proofBucketLabel)}`,
    priorityRowId: row.priorityRowId,
    proofBucketLabel,
    label: row.label,
    summary: row.rankingSummary,
    priority: row.priority,
    status: row.status,
    sourceCoverageRowIds: row.sourceCoverageRowIds,
    sourceTraceRowIds: row.sourceTraceRowIds,
    sourceOutcomeRowIds: row.sourceOutcomeRowIds,
    evidenceTargetIds: row.evidenceTargetIds,
    proofCommandIds: row.proofCommandIds,
    staticReviewStepIds: row.staticReviewStepIds,
    checks,
    localOnly: true,
    staticOnly: true,
    nonExecutable: true,
  };
}

function buildStaticCheckReference(
  row: ReviewProofPriorityRowView,
  proofCommandId: string,
  proofCommandReferences: ReviewProofPriorityProofCommandReferenceView[],
): ReviewProofPriorityStaticCheckReferenceView {
  const proofCommand = proofCommandReferences.find(
    (command) => command.commandId === proofCommandId,
  );

  return {
    checkId: `static-check:${row.priorityRowId}:${proofCommandId}`,
    proofCommandId,
    label: proofCommand?.label ?? proofCommandId,
    command: proofCommand?.command ?? proofCommandId,
    purpose:
      proofCommand?.purpose ??
      "Static proof reference carried forward from the source coverage row.",
    repoRelativeReference: repoRelativeReference(
      proofCommand?.command ?? proofCommandId,
    ),
    source: proofCommand?.source ?? "unknown_static_reference",
    sourceCoverageRowIds: row.sourceCoverageRowIds,
    sourceTraceRowIds: row.sourceTraceRowIds,
    sourceOutcomeRowIds: row.sourceOutcomeRowIds,
    evidenceTargetIds: row.evidenceTargetIds,
    proofBucketLabels: row.proofBucketLabels,
    staticReviewStepIds: row.staticReviewStepIds,
    localOnly: true,
    staticOnly: true,
    nonExecutable: true,
  };
}

function buildDeferredBoundaryContexts(
  rollups: ReviewEvidenceCoverageDeferredBoundaryRollupView[],
  rows: ReviewProofPriorityRowView[],
): ReviewProofPriorityDeferredBoundaryContextView[] {
  return rollups.map((rollup) => {
    const sourceRows = rows.filter((row) => boundaryMatchesRow(rollup, row));

    return {
      boundaryId: `priority-boundary:${rollup.boundaryId}`,
      label: rollup.label,
      summary: rollup.summary,
      sourceCoverageRowIds: unique(
        sourceRows.flatMap((row) => row.sourceCoverageRowIds),
      ),
      sourceTraceRowIds: rollup.sourceTraceRowIds,
      sourceOutcomeRowIds: rollup.sourceOutcomeRowIds,
      evidenceTargetIds: rollup.evidenceTargetIds,
      actionability: "deferred_non_actionable",
      nonActionable: true,
      nonCertifying: true,
    };
  });
}

function buildCounts(
  rows: ReviewProofPriorityRowView[],
  proofCommandReferences: ReviewProofPriorityProofCommandReferenceView[],
  staticCheckRadarGroups: ReviewProofPriorityStaticRadarGroupView[],
  deferredBoundaryContexts: ReviewProofPriorityDeferredBoundaryContextView[],
): PriorityCounts {
  return {
    totalPriorityRowCount: rows.length,
    unresolvedLocalProofGapCount: rows.filter(
      (row) => row.status === "unresolved_local_proof_gap",
    ).length,
    readyLocalEvidenceRowCount: rows.filter(
      (row) => row.status === "ready_local_evidence",
    ).length,
    deferredProductionScopeRowCount: rows.filter(
      (row) => row.status === "deferred_production_scope",
    ).length,
    sourceCoverageRowCount: unique(
      rows.flatMap((row) => row.sourceCoverageRowIds),
    ).length,
    sourceTraceRowCount: unique(rows.flatMap((row) => row.sourceTraceRowIds))
      .length,
    sourceOutcomeRowCount: unique(rows.flatMap((row) => row.sourceOutcomeRowIds))
      .length,
    sourceReadinessRowCount: unique(
      rows.flatMap((row) => row.sourceReadinessRowIds),
    ).length,
    sourceResolutionRowCount: unique(
      rows.flatMap((row) => row.sourceResolutionIds),
    ).length,
    sourceMatrixRowCount: unique(rows.flatMap((row) => row.sourceMatrixRowIds))
      .length,
    sourceActionCount: unique(rows.flatMap((row) => row.sourceActionIds)).length,
    evidenceTargetCount: unique(rows.flatMap((row) => row.evidenceTargetIds))
      .length,
    proofBucketCount: unique(rows.flatMap((row) => row.proofBucketLabels))
      .length,
    proofCommandReferenceCount: proofCommandReferences.length,
    staticRadarGroupCount: staticCheckRadarGroups.length,
    staticCheckReferenceCount: staticCheckRadarGroups.flatMap(
      (group) => group.checks,
    ).length,
    deferredBoundaryContextCount: deferredBoundaryContexts.length,
  };
}

function summaryText(
  defaultPriorityRow: ReviewProofPriorityRowView,
  counts: PriorityCounts,
): string {
  if (counts.unresolvedLocalProofGapCount > 0) {
    return `${counts.unresolvedLocalProofGapCount} unresolved local proof gap rows are ranked before ready evidence and deferred scope; inspect ${defaultPriorityRow.label} first.`;
  }

  if (counts.readyLocalEvidenceRowCount > 0) {
    return `${counts.readyLocalEvidenceRowCount} ready local evidence rows remain ahead of deferred production scope.`;
  }

  return "Only deferred production scope remains visible and non-actionable.";
}

function comparePriorityRows(
  left: ReviewProofPriorityRowView,
  right: ReviewProofPriorityRowView,
): number {
  return (
    statusDefinitions[left.status].sortRank -
      statusDefinitions[right.status].sortRank ||
    left.rank - right.rank ||
    left.priorityRowId.localeCompare(right.priorityRowId)
  );
}

function boundaryMatchesRow(
  rollup: ReviewEvidenceCoverageDeferredBoundaryRollupView,
  row: ReviewProofPriorityRowView,
): boolean {
  return (
    intersects(rollup.sourceTraceRowIds, row.sourceTraceRowIds) ||
    intersects(rollup.sourceOutcomeRowIds, row.sourceOutcomeRowIds) ||
    intersects(rollup.sourceReadinessRowIds, row.sourceReadinessRowIds) ||
    intersects(rollup.sourceResolutionIds, row.sourceResolutionIds) ||
    intersects(rollup.sourceMatrixRowIds, row.sourceMatrixRowIds) ||
    intersects(rollup.sourceActionIds, row.sourceActionIds) ||
    intersects(rollup.evidenceTargetIds, row.evidenceTargetIds)
  );
}

function toPriorityProofCommand(
  command: ReviewEvidenceCoverageProofCommandReferenceView,
): ReviewProofPriorityProofCommandReferenceView {
  return { ...command };
}

function uniqueCommandReferences(
  commands: ReviewProofPriorityProofCommandReferenceView[],
): ReviewProofPriorityProofCommandReferenceView[] {
  const seen = new Set<string>();
  const uniqueCommands: ReviewProofPriorityProofCommandReferenceView[] = [];

  for (const command of commands) {
    if (!seen.has(command.commandId)) {
      uniqueCommands.push(command);
      seen.add(command.commandId);
    }
  }

  return uniqueCommands;
}

function repoRelativeReference(command: string): string {
  const match = command.match(/\b((?:docs|frontend|scripts|tests)\/[^\s'"]+)/);

  return match?.[1] ?? command;
}

function intersects(left: string[], right: string[]): boolean {
  const rightValues = new Set(right);
  return left.some((value) => rightValues.has(value));
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
