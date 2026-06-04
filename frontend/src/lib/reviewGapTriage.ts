import type {
  ReviewGapTriageCategory,
  ReviewGapTriageGroupView,
  ReviewGapTriageNextPassItemView,
  ReviewGapTriagePriority,
  ReviewGapTriageProofCommandReferenceView,
  ReviewGapTriageReadinessVerdict,
  ReviewGapTriageView,
  ReviewHandoffCoverageMatrixRowView,
  ReviewHandoffCoverageMatrixView,
} from "../features/mission-console/types.ts";

const stage20ProofCommand: ReviewGapTriageProofCommandReferenceView = {
  commandId: "review-gap-triage",
  command:
    "node --experimental-strip-types --test tests/frontend/reviewGapTriage.test.ts",
  label: "Stage 20 triage test",
  purpose: "Proves the review gap triage is derived from Stage 19 matrix rows.",
  source: "stage20_triage",
};

const groupDefinitions: Record<
  ReviewGapTriageCategory,
  {
    label: string;
    summary: string;
    priority: ReviewGapTriagePriority;
    sortRank: number;
  }
> = {
  missing_target: {
    label: "Missing local evidence targets",
    summary:
      "Rows with missing local evidence targets must be resolved before the next local review pass.",
    priority: "p0",
    sortRank: 0,
  },
  local_blocker: {
    label: "Local review blockers",
    summary:
      "Rows with complete evidence coverage but blocking local follow-up stay ahead of production-only work.",
    priority: "p1",
    sortRank: 1,
  },
  ready_local_review: {
    label: "Ready local review rows",
    summary:
      "Rows with no remaining local blockers can be checked after active blockers are handled.",
    priority: "p1",
    sortRank: 2,
  },
  deferred_production: {
    label: "Deferred production boundaries",
    summary:
      "Production-only scope remains visible but is non-actionable in this local triage pass.",
    priority: "p2",
    sortRank: 3,
  },
};

export function buildReviewGapTriage(
  coverageMatrix: ReviewHandoffCoverageMatrixView | undefined,
): ReviewGapTriageView | undefined {
  if (!coverageMatrix?.rows.length) {
    return undefined;
  }

  const proofCommandReferences = buildProofCommandReferences(coverageMatrix);
  const nextPassItems = coverageMatrix.rows
    .map((row) => buildNextPassItem(row, proofCommandReferences))
    .sort(compareNextPassItems)
    .map((item, index) => ({ ...item, rank: index + 1 }));
  const groups = buildGroups(nextPassItems);
  const counts = buildCounts(nextPassItems, coverageMatrix.rows.length);
  const verdict = readinessVerdict(counts);

  return {
    schema: "telemforge.review_gap_triage.v1",
    version: 1,
    contractLabel: "local deterministic review gap triage",
    localStatus: coverageMatrix.localStatus,
    readiness: {
      verdict,
      label: readinessLabel(verdict),
      summary: readinessSummary(verdict, counts),
      counts,
    },
    groups,
    nextPassItems,
    localBlockerSummaries: nextPassItems
      .filter(
        (item) =>
          item.category === "missing_target" || item.category === "local_blocker",
      )
      .map((item) => ({
        blockerId: `blocker:${item.itemId}`,
        category: item.category,
        label: item.label,
        reason: item.blockerSummary,
        sourceMatrixRowIds: item.sourceMatrixRowIds,
        sourceActionIds: item.sourceActionIds,
        nextLocalStep: item.nextLocalStep,
      })),
    deferredProductionBoundaries: nextPassItems
      .filter((item) => item.category === "deferred_production")
      .map((item) => ({
        boundaryId: `deferred:${item.itemId}`,
        label: item.label,
        summary: item.summary,
        sourceMatrixRowIds: item.sourceMatrixRowIds,
        sourceActionIds: item.sourceActionIds,
        deferredNotes: coverageMatrix.deferredProductionNotes,
        actionability: "deferred_non_actionable",
      })),
    proofCommandReferences,
    staticProofChecklistSummary:
      "Proof commands are static repo-relative references for the reviewer; the mission console does not execute shell commands.",
    sourceMatrixRows: coverageMatrix.rows,
    sourceEvidenceReferences: unique(coverageMatrix.sourceEvidenceReferences),
  };
}

function buildProofCommandReferences(
  coverageMatrix: ReviewHandoffCoverageMatrixView,
): ReviewGapTriageProofCommandReferenceView[] {
  return [
    stage20ProofCommand,
    ...coverageMatrix.localVerificationCommands.map((command) => ({
      ...command,
      source: "stage19_matrix" as const,
    })),
  ];
}

function buildNextPassItem(
  row: ReviewHandoffCoverageMatrixRowView,
  proofCommands: ReviewGapTriageProofCommandReferenceView[],
): ReviewGapTriageNextPassItemView {
  const category = categoryForRow(row);
  const definition = groupDefinitions[category];

  return {
    itemId: `next-pass-${row.rowNumber}:${row.actionId}`,
    rank: row.rowNumber,
    priority: definition.priority,
    category,
    actionability:
      category === "deferred_production"
        ? "deferred_non_actionable"
        : "local_actionable",
    label: row.rehearsalStepLabel,
    summary: summaryForRow(row, category),
    sourceMatrixRowIds: [row.rowId],
    sourceActionIds: [row.actionId],
    blockerStatus: row.blockerStatus,
    blockerSummary: row.blockerSummary,
    sourceBuckets: row.sourceCoverageBuckets.filter((bucket) => bucket.count > 0),
    proofCommandReferences: proofCommandsForRow(row, proofCommands),
    nextLocalStep:
      category === "deferred_production"
        ? "Keep this production-only scope visible for later stages; do not turn it into an actionable local task."
        : row.nextLocalStep,
  };
}

function categoryForRow(
  row: ReviewHandoffCoverageMatrixRowView,
): ReviewGapTriageCategory {
  if (row.blockerStatus === "deferred") {
    return "deferred_production";
  }
  if (row.targetCoverageCounts.missingTargetCount > 0) {
    return "missing_target";
  }
  if (row.blockerStatus === "blocked") {
    return "local_blocker";
  }
  return "ready_local_review";
}

function summaryForRow(
  row: ReviewHandoffCoverageMatrixRowView,
  category: ReviewGapTriageCategory,
): string {
  switch (category) {
    case "missing_target":
      return `${row.targetCoverageCounts.missingTargetCount} missing target checks keep this local row at the top of the next-pass plan.`;
    case "local_blocker":
      return "Local evidence is visible, but the blocker remains actionable before production scope is considered.";
    case "ready_local_review":
      return "Local coverage is ready and can be verified after blocking rows are handled.";
    case "deferred_production":
      return "Production-only scope is documented for boundary awareness and is not actionable in Stage 20.";
  }
}

function proofCommandsForRow(
  row: ReviewHandoffCoverageMatrixRowView,
  proofCommands: ReviewGapTriageProofCommandReferenceView[],
): ReviewGapTriageProofCommandReferenceView[] {
  const commandIds = new Set([
    "review-gap-triage",
    "review-coverage-matrix",
    "console-view-model",
    "public-repo-guard",
  ]);

  if (row.blockerStatus === "blocked") {
    commandIds.add("review-handoff-rehearsal");
    commandIds.add("review-action-walkthrough");
    commandIds.add("review-action-queue");
  }

  if (row.blockerStatus === "deferred") {
    commandIds.add("review-handoff-rehearsal");
  }

  return proofCommands.filter((command) => commandIds.has(command.commandId));
}

function buildGroups(
  items: ReviewGapTriageNextPassItemView[],
): ReviewGapTriageGroupView[] {
  return Object.entries(groupDefinitions)
    .map(([category, definition]) => {
      const groupedItems = items.filter((item) => item.category === category);
      return {
        groupId: `gap-group:${category}`,
        category: category as ReviewGapTriageCategory,
        label: definition.label,
        summary: definition.summary,
        priority: definition.priority,
        itemCount: groupedItems.length,
        items: groupedItems,
      };
    })
    .filter((group) => group.itemCount > 0)
    .sort(
      (left, right) =>
        groupDefinitions[left.category].sortRank -
        groupDefinitions[right.category].sortRank,
    );
}

function compareNextPassItems(
  left: ReviewGapTriageNextPassItemView,
  right: ReviewGapTriageNextPassItemView,
): number {
  return (
    groupDefinitions[left.category].sortRank -
      groupDefinitions[right.category].sortRank ||
    left.sourceMatrixRowIds[0].localeCompare(right.sourceMatrixRowIds[0])
  );
}

function buildCounts(
  items: ReviewGapTriageNextPassItemView[],
  sourceMatrixRowCount: number,
) {
  return {
    totalItemCount: items.length,
    localBlockerItemCount: items.filter(
      (item) =>
        item.category === "local_blocker" || item.category === "missing_target",
    ).length,
    missingTargetItemCount: items.filter(
      (item) => item.category === "missing_target",
    ).length,
    deferredProductionItemCount: items.filter(
      (item) => item.category === "deferred_production",
    ).length,
    sourceMatrixRowCount,
    proofCommandCount: unique(
      items.flatMap((item) =>
        item.proofCommandReferences.map((command) => command.commandId),
      ),
    ).length,
  };
}

function readinessVerdict(
  counts: ReturnType<typeof buildCounts>,
): ReviewGapTriageReadinessVerdict {
  if (counts.localBlockerItemCount > 0 || counts.missingTargetItemCount > 0) {
    return "local_blockers_ranked";
  }
  if (counts.deferredProductionItemCount > 0) {
    return "deferred_production_only";
  }
  return "ready_for_next_local_pass";
}

function readinessLabel(verdict: ReviewGapTriageReadinessVerdict): string {
  switch (verdict) {
    case "local_blockers_ranked":
      return "Local blockers ranked for next pass";
    case "deferred_production_only":
      return "Only deferred production scope remains";
    case "ready_for_next_local_pass":
      return "Ready for the next local review pass";
  }
}

function readinessSummary(
  verdict: ReviewGapTriageReadinessVerdict,
  counts: ReturnType<typeof buildCounts>,
): string {
  switch (verdict) {
    case "local_blockers_ranked":
      return `${counts.localBlockerItemCount} local blocker items are ranked before ${counts.deferredProductionItemCount} deferred production items.`;
    case "deferred_production_only":
      return "Local blockers are clear; production-only boundaries remain documented and non-actionable.";
    case "ready_for_next_local_pass":
      return "No local blockers or production-only deferred items remain in the matrix.";
  }
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}
