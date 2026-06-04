import type {
  ReviewEvidenceCoverageActionability,
  ReviewEvidenceCoverageBucketRowView,
  ReviewEvidenceCoverageDeferredBoundaryRollupView,
  ReviewEvidenceCoverageGroupView,
  ReviewEvidenceCoveragePriority,
  ReviewEvidenceCoverageProofCommandReferenceView,
  ReviewEvidenceCoverageRowStatus,
  ReviewEvidenceCoverageRowView,
  ReviewEvidenceCoverageStaticReviewStepView,
  ReviewEvidenceCoverageView,
  ReviewEvidenceTraceDeferredBoundaryNoteView,
  ReviewEvidenceTraceProofCommandReferenceView,
  ReviewEvidenceTraceRowView,
  ReviewEvidenceTraceView,
} from "../features/mission-console/types.ts";

type CoverageCounts = ReviewEvidenceCoverageView["summary"]["counts"];

const stage25ProofCommand: ReviewEvidenceCoverageProofCommandReferenceView = {
  commandId: "review-evidence-coverage",
  command:
    "node --experimental-strip-types --test tests/frontend/reviewEvidenceCoverage.test.ts",
  label: "Stage 25 evidence coverage test",
  purpose:
    "Proves the local evidence coverage map is derived from Stage 24 trace rows.",
  source: "stage25_coverage",
};

const statusDefinitions: Record<
  ReviewEvidenceCoverageRowStatus,
  {
    proofBucketLabel: string;
    summary: string;
    priority: ReviewEvidenceCoveragePriority;
    actionability: ReviewEvidenceCoverageActionability;
    sortRank: number;
  }
> = {
  unresolved_local_proof_gap: {
    proofBucketLabel: "Unresolved local proof gaps",
    summary:
      "Trace rows with local proof still needing static review stay ahead of ready evidence and deferred scope.",
    priority: "p0",
    actionability: "local_review_required",
    sortRank: 0,
  },
  ready_local_evidence: {
    proofBucketLabel: "Ready local evidence",
    summary:
      "Trace rows with static local proof ready remain visible after unresolved local gaps.",
    priority: "p1",
    actionability: "local_evidence_ready",
    sortRank: 1,
  },
  deferred_production_scope: {
    proofBucketLabel: "Deferred production boundaries",
    summary:
      "Production-only scope remains visible, non-actionable, and non-certifying.",
    priority: "p2",
    actionability: "deferred_non_actionable",
    sortRank: 2,
  },
};

export function buildReviewEvidenceCoverage(
  reviewEvidenceTrace: ReviewEvidenceTraceView | undefined,
): ReviewEvidenceCoverageView | undefined {
  if (!reviewEvidenceTrace?.traceRows.length) {
    return undefined;
  }

  const proofCommandReferences = uniqueCommandReferences([
    stage25ProofCommand,
    ...reviewEvidenceTrace.proofCommandReferences.map(toCoverageProofCommand),
  ]);
  const coverageRows = reviewEvidenceTrace.traceRows
    .map((row) =>
      buildCoverageRow(row, proofCommandReferences, reviewEvidenceTrace),
    )
    .sort(compareCoverageRows)
    .map((row, index) => ({ ...row, rank: index + 1 }));
  const defaultCoverageRow =
    coverageRows.find((row) => row.status === "unresolved_local_proof_gap") ??
    coverageRows[0];
  const coverageGroups = buildGroups(coverageRows);
  const bucketRows = buildBucketRows(coverageRows);
  const deferredBoundaryRollups = buildDeferredBoundaryRollups(
    reviewEvidenceTrace.deferredBoundaryNotes,
    coverageRows,
  );
  const staticReviewSteps = coverageRows.flatMap(
    (row) => row.nextStaticReviewSteps,
  );
  const counts = buildCounts(
    coverageRows,
    bucketRows,
    staticReviewSteps,
    deferredBoundaryRollups,
  );

  return {
    schema: "telemforge.review_evidence_coverage.v1",
    version: 1,
    contractLabel: "local deterministic review evidence coverage map",
    localStatus: reviewEvidenceTrace.localStatus,
    summary: {
      coverageId: "candidate-local-review-evidence-coverage",
      label: "Local proof coverage map",
      summary: summaryText(defaultCoverageRow, counts),
      defaultCoverageRowId: defaultCoverageRow.coverageRowId,
      defaultCoverageGroupId: `coverage-group:${defaultCoverageRow.status}`,
      defaultProofBucketLabel: defaultCoverageRow.proofBucketLabels[0],
      informationalOnly: true,
      nonCertifying: true,
      counts,
    },
    coverageRows,
    coverageGroups,
    bucketRows,
    staticReviewSteps,
    deferredBoundaryRollups,
    proofCommandReferences,
    staticProofChecklistSummary:
      "Stage 25 coverage checks are static repo-relative references only; the mission console does not execute commands, save coverage filters, store progress, or certify production readiness.",
    sourceTrace: reviewEvidenceTrace,
  };
}

function buildCoverageRow(
  row: ReviewEvidenceTraceRowView,
  proofCommandReferences: ReviewEvidenceCoverageProofCommandReferenceView[],
  reviewEvidenceTrace: ReviewEvidenceTraceView,
): ReviewEvidenceCoverageRowView {
  const definition = statusDefinitions[row.status];
  const proofCommandIds = unique([
    "review-evidence-coverage",
    ...row.proofCommandReferences.map((command) => command.commandId),
  ]);
  const nextStaticReviewStep = buildStaticReviewStep(row, proofCommandIds);
  const deferredBoundaryNotes = matchingDeferredBoundaryNotes(
    row,
    reviewEvidenceTrace.deferredBoundaryNotes,
  );

  return {
    coverageRowId: `coverage-row:${row.traceRowId}`,
    sourceTraceRowIds: [row.traceRowId],
    sourceOutcomeRowIds: row.sourceOutcomeRowIds,
    sourceReadinessRowIds: row.sourceReadinessRowIds,
    sourceResolutionIds: row.sourceResolutionIds,
    sourceMatrixRowIds: row.sourceMatrixRowIds,
    sourceActionIds: row.sourceActionIds,
    evidenceTargetIds: row.evidenceTargetIds,
    rank: row.rank,
    status: row.status,
    actionability: definition.actionability,
    label: row.label,
    summary: row.summary,
    sourceBucketLabels: row.sourceBucketLabels,
    proofBucketLabels: [definition.proofBucketLabel, row.outcomeBucket],
    proofCommandIds: proofCommandIds.filter((commandId) =>
      proofCommandReferences.some((command) => command.commandId === commandId),
    ),
    nextStaticReviewSteps: [nextStaticReviewStep],
    deferredBoundaryNotes: deferredBoundaryNotes.map((note) => note.summary),
    informationalOnly: true,
    nonCertifying: true,
  };
}

function buildStaticReviewStep(
  row: ReviewEvidenceTraceRowView,
  proofCommandIds: string[],
): ReviewEvidenceCoverageStaticReviewStepView {
  return {
    stepId: `coverage-static-step:${row.traceRowId}`,
    label: row.label,
    summary: row.nextStaticLocalReviewStep,
    sourceTraceRowIds: [row.traceRowId],
    sourceOutcomeRowIds: row.sourceOutcomeRowIds,
    evidenceTargetIds: row.evidenceTargetIds,
    proofCommandIds,
    repoRelativeReference:
      "tests/frontend/reviewEvidenceCoverage.test.ts",
    nonExecutable: true,
  };
}

function buildGroups(
  rows: ReviewEvidenceCoverageRowView[],
): ReviewEvidenceCoverageGroupView[] {
  return Object.entries(statusDefinitions)
    .map(([status, definition]) => {
      const groupedRows = rows.filter((row) => row.status === status);

      return {
        groupId: `coverage-group:${status}`,
        status: status as ReviewEvidenceCoverageRowStatus,
        proofBucketLabel: definition.proofBucketLabel,
        summary: definition.summary,
        priority: definition.priority,
        rowCount: groupedRows.length,
        sourceTraceRowIds: unique(
          groupedRows.flatMap((row) => row.sourceTraceRowIds),
        ),
        sourceOutcomeRowIds: unique(
          groupedRows.flatMap((row) => row.sourceOutcomeRowIds),
        ),
        evidenceTargetIds: unique(
          groupedRows.flatMap((row) => row.evidenceTargetIds),
        ),
        proofCommandIds: unique(
          groupedRows.flatMap((row) => row.proofCommandIds),
        ),
        nextStaticReviewStepIds: groupedRows.flatMap((row) =>
          row.nextStaticReviewSteps.map((step) => step.stepId),
        ),
        rows: groupedRows,
      };
    })
    .filter((group) => group.rowCount > 0)
    .sort(
      (left, right) =>
        statusDefinitions[left.status].sortRank -
        statusDefinitions[right.status].sortRank,
    );
}

function buildBucketRows(
  rows: ReviewEvidenceCoverageRowView[],
): ReviewEvidenceCoverageBucketRowView[] {
  const buckets = new Map<string, ReviewEvidenceCoverageBucketRowView>();

  for (const row of rows) {
    const proofBucketLabel = row.proofBucketLabels[0];

    for (const sourceBucketLabel of row.sourceBucketLabels) {
      const key = `${row.status}:${sourceBucketLabel}`;
      const existing = buckets.get(key);

      if (existing) {
        existing.rowCount += 1;
        mergeUnique(existing.sourceTraceRowIds, row.sourceTraceRowIds);
        mergeUnique(existing.sourceOutcomeRowIds, row.sourceOutcomeRowIds);
        mergeUnique(existing.evidenceTargetIds, row.evidenceTargetIds);
        mergeUnique(existing.proofCommandIds, row.proofCommandIds);
        mergeUnique(
          existing.nextStaticReviewStepIds,
          row.nextStaticReviewSteps.map((step) => step.stepId),
        );
        continue;
      }

      buckets.set(key, {
        bucketRowId: `coverage-bucket:${row.status}:${slug(sourceBucketLabel)}`,
        status: row.status,
        sourceBucketLabel,
        proofBucketLabel,
        rowCount: 1,
        sourceTraceRowIds: [...row.sourceTraceRowIds],
        sourceOutcomeRowIds: [...row.sourceOutcomeRowIds],
        evidenceTargetIds: [...row.evidenceTargetIds],
        proofCommandIds: [...row.proofCommandIds],
        nextStaticReviewStepIds: row.nextStaticReviewSteps.map(
          (step) => step.stepId,
        ),
      });
    }
  }

  return Array.from(buckets.values()).sort(
    (left, right) =>
      statusDefinitions[left.status].sortRank -
        statusDefinitions[right.status].sortRank ||
      left.sourceBucketLabel.localeCompare(right.sourceBucketLabel),
  );
}

function buildDeferredBoundaryRollups(
  deferredBoundaryNotes: ReviewEvidenceTraceDeferredBoundaryNoteView[],
  rows: ReviewEvidenceCoverageRowView[],
): ReviewEvidenceCoverageDeferredBoundaryRollupView[] {
  return deferredBoundaryNotes.map((note) => {
    const sourceRows = rows.filter((row) => noteMatchesRow(note, row));

    return {
      boundaryId: `coverage:${note.noteId}`,
      label: note.label,
      summary: note.summary,
      sourceTraceRowIds: unique(
        sourceRows.flatMap((row) => row.sourceTraceRowIds),
      ),
      sourceOutcomeRowIds: unique(
        sourceRows.flatMap((row) => row.sourceOutcomeRowIds),
      ),
      sourceReadinessRowIds: note.sourceReadinessRowIds,
      sourceResolutionIds: note.sourceResolutionIds,
      sourceMatrixRowIds: note.sourceMatrixRowIds,
      sourceActionIds: note.sourceActionIds,
      evidenceTargetIds: note.evidenceTargetIds,
      actionability: note.actionability,
      nextStaticLocalReviewStep: note.nextStaticLocalReviewStep,
      nonActionable: true,
    };
  });
}

function buildCounts(
  rows: ReviewEvidenceCoverageRowView[],
  bucketRows: ReviewEvidenceCoverageBucketRowView[],
  staticReviewSteps: ReviewEvidenceCoverageStaticReviewStepView[],
  deferredBoundaryRollups: ReviewEvidenceCoverageDeferredBoundaryRollupView[],
): CoverageCounts {
  return {
    totalCoverageRowCount: rows.length,
    unresolvedLocalProofGapCount: rows.filter(
      (row) => row.status === "unresolved_local_proof_gap",
    ).length,
    readyLocalEvidenceRowCount: rows.filter(
      (row) => row.status === "ready_local_evidence",
    ).length,
    deferredProductionScopeRowCount: rows.filter(
      (row) => row.status === "deferred_production_scope",
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
    evidenceTargetCount: unique(rows.flatMap((row) => row.evidenceTargetIds))
      .length,
    sourceBucketLabelCount: unique(rows.flatMap((row) => row.sourceBucketLabels))
      .length,
    proofBucketCount: unique(rows.flatMap((row) => row.proofBucketLabels))
      .length,
    proofCommandReferenceCount: unique(
      rows.flatMap((row) => row.proofCommandIds),
    ).length,
    staticReviewStepCount: staticReviewSteps.length,
    bucketRowCount: bucketRows.length,
    deferredBoundaryNoteCount: deferredBoundaryRollups.length,
  };
}

function summaryText(
  defaultCoverageRow: ReviewEvidenceCoverageRowView,
  counts: CoverageCounts,
): string {
  if (counts.unresolvedLocalProofGapCount > 0) {
    return `${counts.unresolvedLocalProofGapCount} unresolved local proof gap rows are ranked first; inspect ${defaultCoverageRow.label}.`;
  }

  if (counts.readyLocalEvidenceRowCount > 0) {
    return `${counts.readyLocalEvidenceRowCount} ready local evidence rows remain traceable through static proof references.`;
  }

  return "Only deferred production scope remains visible and non-actionable.";
}

function compareCoverageRows(
  left: ReviewEvidenceCoverageRowView,
  right: ReviewEvidenceCoverageRowView,
): number {
  return (
    statusDefinitions[left.status].sortRank -
      statusDefinitions[right.status].sortRank ||
    left.rank - right.rank ||
    left.coverageRowId.localeCompare(right.coverageRowId)
  );
}

function matchingDeferredBoundaryNotes(
  row: ReviewEvidenceTraceRowView,
  notes: ReviewEvidenceTraceDeferredBoundaryNoteView[],
): ReviewEvidenceTraceDeferredBoundaryNoteView[] {
  return notes.filter((note) =>
    intersects(note.sourceReadinessRowIds, row.sourceReadinessRowIds) ||
    intersects(note.sourceResolutionIds, row.sourceResolutionIds) ||
    intersects(note.sourceMatrixRowIds, row.sourceMatrixRowIds) ||
    intersects(note.sourceActionIds, row.sourceActionIds) ||
    intersects(note.evidenceTargetIds, row.evidenceTargetIds),
  );
}

function noteMatchesRow(
  note: ReviewEvidenceTraceDeferredBoundaryNoteView,
  row: ReviewEvidenceCoverageRowView,
): boolean {
  return (
    intersects(note.sourceReadinessRowIds, row.sourceReadinessRowIds) ||
    intersects(note.sourceResolutionIds, row.sourceResolutionIds) ||
    intersects(note.sourceMatrixRowIds, row.sourceMatrixRowIds) ||
    intersects(note.sourceActionIds, row.sourceActionIds) ||
    intersects(note.evidenceTargetIds, row.evidenceTargetIds)
  );
}

function toCoverageProofCommand(
  command: ReviewEvidenceTraceProofCommandReferenceView,
): ReviewEvidenceCoverageProofCommandReferenceView {
  return { ...command };
}

function uniqueCommandReferences(
  commands: ReviewEvidenceCoverageProofCommandReferenceView[],
): ReviewEvidenceCoverageProofCommandReferenceView[] {
  const seen = new Set<string>();
  const uniqueCommands: ReviewEvidenceCoverageProofCommandReferenceView[] = [];

  for (const command of commands) {
    if (!seen.has(command.commandId)) {
      uniqueCommands.push(command);
      seen.add(command.commandId);
    }
  }

  return uniqueCommands;
}

function mergeUnique(target: string[], source: string[]): void {
  for (const value of source) {
    if (value && !target.includes(value)) {
      target.push(value);
    }
  }
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
