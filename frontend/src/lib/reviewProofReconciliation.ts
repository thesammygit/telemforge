import type {
  ReviewProofNavigatorDeferredBoundaryMarkerView,
  ReviewProofNavigatorStaticCommandReferenceView,
  ReviewProofNavigatorStaticInspectionPromptView,
  ReviewProofNavigatorSourceCrosswalkRowView,
  ReviewProofNavigatorView,
  ReviewProofReconciliationBucketKind,
  ReviewProofReconciliationBucketView,
  ReviewProofReconciliationDeferredBoundaryNoteView,
  ReviewProofReconciliationReferenceKind,
  ReviewProofReconciliationRowView,
  ReviewProofReconciliationSegmentKind,
  ReviewProofReconciliationSegmentSummaryView,
  ReviewProofReconciliationStaticReferenceView,
  ReviewProofReconciliationSummaryView,
  ReviewProofReconciliationView,
} from "../features/mission-console/types.ts";

type BucketDefinition = {
  bucketKind: ReviewProofReconciliationBucketKind;
  order: number;
  label: string;
  summary: string;
};

type ReferenceInput = {
  kind: ReviewProofReconciliationReferenceKind;
  label: string;
  summary: string;
  repoRelativeReference: string;
  rows: ReviewProofReconciliationRowView[];
  proofCommandIds?: string[];
  staticInspectionPromptIds?: string[];
};

const bucketDefinitions: Record<
  ReviewProofReconciliationBucketKind,
  BucketDefinition
> = {
  complete_local_chain: {
    bucketKind: "complete_local_chain",
    order: 1,
    label: "Complete local chains",
    summary:
      "Navigator rows with local evidence ready are source-backed and informational, with no certification semantics.",
  },
  local_inspection_gap: {
    bucketKind: "local_inspection_gap",
    order: 2,
    label: "Static local inspection gaps",
    summary:
      "Navigator rows with unresolved local proof gaps still need static human inspection before the chain can be treated as locally complete.",
  },
  deferred_production_boundary: {
    bucketKind: "deferred_production_boundary",
    order: 3,
    label: "Deferred production boundaries",
    summary:
      "Navigator rows scoped to production handoff remain visible, non-actionable, and non-certifying.",
  },
};

const orderedBucketDefinitions = [
  bucketDefinitions.complete_local_chain,
  bucketDefinitions.local_inspection_gap,
  bucketDefinitions.deferred_production_boundary,
];

const segmentLabels: Record<ReviewProofReconciliationSegmentKind, string> = {
  proof_packet: "Proof packet",
  priority: "Priority row",
  coverage: "Coverage rows",
  trace: "Trace rows",
  outcome: "Outcome rows",
  readiness: "Readiness rows",
  resolution: "Resolution rows",
  matrix: "Coverage matrix rows",
  action: "Action rows",
  evidence_target: "Evidence targets",
  proof_command: "Proof command ids",
  static_human_gate: "Static human gate steps",
  static_inspection_prompt: "Static inspection prompts",
  deferred_boundary: "Deferred boundary markers",
};

export function buildReviewProofReconciliation(
  reviewProofNavigator: ReviewProofNavigatorView | undefined,
): ReviewProofReconciliationView | undefined {
  if (!reviewProofNavigator?.navigatorRows.length) {
    return undefined;
  }

  const promptsByNavigatorRowId = groupPromptsByNavigatorRowId(
    reviewProofNavigator.staticInspectionPrompts,
  );
  const crosswalkByNavigatorRowId = new Map(
    reviewProofNavigator.sourceCrosswalkRows.map((row) => [
      row.navigatorRowId,
      row,
    ]),
  );
  const deferredMarkersByNavigatorRowId = groupDeferredMarkersByNavigatorRowId(
    reviewProofNavigator.deferredBoundaryMarkers,
  );
  const reconciliationRows = reviewProofNavigator.navigatorRows.map(
    (navigatorRow, index) =>
      buildReconciliationRow(
        navigatorRow,
        index + 1,
        crosswalkByNavigatorRowId.get(navigatorRow.navigatorRowId) ?? null,
        promptsByNavigatorRowId.get(navigatorRow.navigatorRowId) ?? [],
        deferredMarkersByNavigatorRowId.get(navigatorRow.navigatorRowId) ?? [],
      ),
  );
  const defaultReconciliationRow =
    reconciliationRows.find(
      (row) =>
        row.navigatorRowId ===
        reviewProofNavigator.summary.defaultNavigatorRowId,
    ) ?? reconciliationRows[0];
  const consistencyBuckets = buildConsistencyBuckets(reconciliationRows);
  const sourceChainSegments = reconciliationRows.flatMap(
    (row) => row.sourceChainSegments,
  );
  const staticReviewReferences = buildStaticReviewReferences(
    reconciliationRows,
    reviewProofNavigator,
  );
  const deferredBoundaryNotes = buildDeferredBoundaryNotes(
    reconciliationRows,
    reviewProofNavigator.deferredBoundaryMarkers,
  );
  const counts = buildCounts(
    reconciliationRows,
    consistencyBuckets,
    sourceChainSegments,
    staticReviewReferences,
    reviewProofNavigator.staticInspectionPrompts,
    reviewProofNavigator.staticCommandReferences,
    deferredBoundaryNotes,
  );

  return {
    schema: "telemforge.review_proof_reconciliation.v1",
    version: 1,
    contractLabel: "local deterministic review proof-chain reconciliation map",
    localStatus: reviewProofNavigator.localStatus,
    summary: {
      reconciliationId: "candidate-local-review-proof-reconciliation",
      label: "Local proof-chain reconciliation",
      summary: summaryText(counts),
      defaultReconciliationRowId:
        defaultReconciliationRow.reconciliationRowId,
      defaultNavigatorRowId: defaultReconciliationRow.navigatorRowId,
      defaultPacketId: defaultReconciliationRow.packetId,
      defaultBucketId: `proof-reconciliation-bucket:${defaultReconciliationRow.bucketKind}`,
      informationalOnly: true,
      nonCertifying: true,
      counts,
    },
    reconciliationRows,
    defaultReconciliationRow,
    consistencyBuckets,
    sourceChainSegments,
    staticReviewReferences,
    deferredBoundaryNotes,
    staticReconciliationSummary:
      "Stage 29 proof-chain reconciliation rows, consistency buckets, static references, and deferred notes are local, source-backed, non-executable, informational, and non-certifying; the mission console does not save reconciliation selections, store reviewer progress, run commands, score proof readiness, or export handoff reports.",
    sourceNavigator: reviewProofNavigator,
  };
}

function buildReconciliationRow(
  navigatorRow: ReviewProofNavigatorView["navigatorRows"][number],
  rank: number,
  sourceCrosswalkRow: ReviewProofNavigatorSourceCrosswalkRowView | null,
  prompts: ReviewProofNavigatorStaticInspectionPromptView[],
  deferredMarkers: ReviewProofNavigatorDeferredBoundaryMarkerView[],
): ReviewProofReconciliationRowView {
  const bucketDefinition = bucketDefinitions[classifyRow(navigatorRow)];
  const reconciliationRowId = `proof-reconciliation:${navigatorRow.navigatorRowId}`;
  const staticInspectionPromptIds = prompts.map((prompt) => prompt.promptId);
  const deferredBoundaryMarkerIds = deferredMarkers.length
    ? deferredMarkers.map((marker) => marker.markerId)
    : navigatorRow.deferredBoundaryMarkerIds;

  return {
    reconciliationRowId,
    navigatorRowId: navigatorRow.navigatorRowId,
    sourceCrosswalkRowId: sourceCrosswalkRow?.crosswalkRowId ?? null,
    rank,
    bucketKind: bucketDefinition.bucketKind,
    bucketLabel: bucketDefinition.label,
    bucketSummary: bucketDefinition.summary,
    packetId: navigatorRow.packetId,
    laneKind: navigatorRow.laneKind,
    packetStatus: navigatorRow.packetStatus,
    priority: navigatorRow.priority,
    actionability: navigatorRow.actionability,
    label: navigatorRow.label,
    summary: `${navigatorRow.summary} ${bucketDefinition.summary}`,
    sourcePriorityRowId: navigatorRow.sourcePriorityRowId,
    sourceCoverageRowIds: navigatorRow.sourceCoverageRowIds,
    sourceTraceRowIds: navigatorRow.sourceTraceRowIds,
    sourceOutcomeRowIds: navigatorRow.sourceOutcomeRowIds,
    sourceReadinessRowIds: navigatorRow.sourceReadinessRowIds,
    sourceResolutionIds: navigatorRow.sourceResolutionIds,
    sourceMatrixRowIds: navigatorRow.sourceMatrixRowIds,
    sourceActionIds: navigatorRow.sourceActionIds,
    evidenceTargetIds: navigatorRow.evidenceTargetIds,
    proofBucketLabels: navigatorRow.proofBucketLabels,
    proofCommandIds: navigatorRow.proofCommandIds,
    staticHumanGateStepIds: navigatorRow.staticHumanGateStepIds,
    sourceStaticReviewStepIds: navigatorRow.sourceStaticReviewStepIds,
    staticInspectionPromptIds,
    deferredBoundaryMarkerIds,
    sourceChainSegments: buildSourceChainSegments(
      reconciliationRowId,
      navigatorRow.navigatorRowId,
      navigatorRow.packetId,
      navigatorRow.sourcePriorityRowId,
      navigatorRow.sourceCoverageRowIds,
      navigatorRow.sourceTraceRowIds,
      navigatorRow.sourceOutcomeRowIds,
      navigatorRow.sourceReadinessRowIds,
      navigatorRow.sourceResolutionIds,
      navigatorRow.sourceMatrixRowIds,
      navigatorRow.sourceActionIds,
      navigatorRow.evidenceTargetIds,
      navigatorRow.proofCommandIds,
      navigatorRow.staticHumanGateStepIds,
      staticInspectionPromptIds,
      deferredBoundaryMarkerIds,
    ),
    defaultRow: navigatorRow.defaultRow,
    localChainComplete: bucketDefinition.bucketKind === "complete_local_chain",
    localInspectionRequired:
      bucketDefinition.bucketKind === "local_inspection_gap",
    deferredProductionBoundary:
      bucketDefinition.bucketKind === "deferred_production_boundary",
    informationalOnly: true,
    nonExecutable: true,
    nonCertifying: true,
  };
}

function buildSourceChainSegments(
  reconciliationRowId: string,
  navigatorRowId: string,
  packetId: string,
  sourcePriorityRowId: string,
  sourceCoverageRowIds: string[],
  sourceTraceRowIds: string[],
  sourceOutcomeRowIds: string[],
  sourceReadinessRowIds: string[],
  sourceResolutionIds: string[],
  sourceMatrixRowIds: string[],
  sourceActionIds: string[],
  evidenceTargetIds: string[],
  proofCommandIds: string[],
  staticHumanGateStepIds: string[],
  staticInspectionPromptIds: string[],
  deferredBoundaryMarkerIds: string[],
): ReviewProofReconciliationSegmentSummaryView[] {
  return [
    buildSegment(reconciliationRowId, navigatorRowId, "proof_packet", [packetId]),
    buildSegment(reconciliationRowId, navigatorRowId, "priority", [
      sourcePriorityRowId,
    ]),
    buildSegment(
      reconciliationRowId,
      navigatorRowId,
      "coverage",
      sourceCoverageRowIds,
    ),
    buildSegment(reconciliationRowId, navigatorRowId, "trace", sourceTraceRowIds),
    buildSegment(
      reconciliationRowId,
      navigatorRowId,
      "outcome",
      sourceOutcomeRowIds,
    ),
    buildSegment(
      reconciliationRowId,
      navigatorRowId,
      "readiness",
      sourceReadinessRowIds,
    ),
    buildSegment(
      reconciliationRowId,
      navigatorRowId,
      "resolution",
      sourceResolutionIds,
    ),
    buildSegment(reconciliationRowId, navigatorRowId, "matrix", sourceMatrixRowIds),
    buildSegment(reconciliationRowId, navigatorRowId, "action", sourceActionIds),
    buildSegment(
      reconciliationRowId,
      navigatorRowId,
      "evidence_target",
      evidenceTargetIds,
    ),
    buildSegment(
      reconciliationRowId,
      navigatorRowId,
      "proof_command",
      proofCommandIds,
    ),
    buildSegment(
      reconciliationRowId,
      navigatorRowId,
      "static_human_gate",
      staticHumanGateStepIds,
    ),
    buildSegment(
      reconciliationRowId,
      navigatorRowId,
      "static_inspection_prompt",
      staticInspectionPromptIds,
    ),
    buildSegment(
      reconciliationRowId,
      navigatorRowId,
      "deferred_boundary",
      deferredBoundaryMarkerIds,
    ),
  ];
}

function buildSegment(
  reconciliationRowId: string,
  navigatorRowId: string,
  kind: ReviewProofReconciliationSegmentKind,
  sourceIds: string[],
): ReviewProofReconciliationSegmentSummaryView {
  return {
    segmentId: `proof-reconciliation-segment:${reconciliationRowId}:${kind}`,
    reconciliationRowId,
    navigatorRowId,
    kind,
    label: segmentLabels[kind],
    sourceIds,
    complete: sourceIds.length > 0,
    localOnly: true,
    sourceBacked: true,
    informationalOnly: true,
    nonExecutable: true,
    nonCertifying: true,
  };
}

function buildConsistencyBuckets(
  rows: ReviewProofReconciliationRowView[],
): ReviewProofReconciliationBucketView[] {
  return orderedBucketDefinitions.map((definition) => {
    const bucketRows = rows.filter(
      (row) => row.bucketKind === definition.bucketKind,
    );

    return {
      bucketId: `proof-reconciliation-bucket:${definition.bucketKind}`,
      bucketKind: definition.bucketKind,
      order: definition.order,
      label: definition.label,
      summary: definition.summary,
      rowCount: bucketRows.length,
      reconciliationRowIds: bucketRows.map((row) => row.reconciliationRowId),
      firstReconciliationRowId: bucketRows[0]?.reconciliationRowId ?? null,
      localOnly: true,
      informationalOnly: true,
      nonCertifying: true,
    };
  });
}

function buildStaticReviewReferences(
  rows: ReviewProofReconciliationRowView[],
  navigator: ReviewProofNavigatorView,
): ReviewProofReconciliationStaticReferenceView[] {
  const references = new Map<string, ReviewProofReconciliationStaticReferenceView>();
  const rowByNavigatorRowId = new Map(
    rows.map((row) => [row.navigatorRowId, row]),
  );

  addStaticReference(references, {
    kind: "stage29_reconciliation_source",
    label: "Stage 29 reconciliation helper",
    summary:
      "Source file that derives the local proof-chain reconciliation map from Stage 28 navigator rows.",
    repoRelativeReference: "frontend/src/lib/reviewProofReconciliation.ts",
    rows,
    proofCommandIds: ["review-proof-reconciliation"],
  });

  for (const crosswalk of navigator.sourceCrosswalkRows) {
    const row = rowByNavigatorRowId.get(crosswalk.navigatorRowId);
    if (!row) {
      continue;
    }

    for (const repoRelativeReference of crosswalk.repoRelativeReferences) {
      addStaticReference(references, {
        kind: "source_crosswalk",
        label: "Stage 28 source crosswalk",
        summary:
          "Repo-relative source crosswalk reference preserved from the Stage 28 navigator.",
        repoRelativeReference,
        rows: [row],
        proofCommandIds: crosswalk.proofCommandIds,
      });
    }
  }

  for (const prompt of navigator.staticInspectionPrompts) {
    const promptRows = prompt.navigatorRowIds
      .map((navigatorRowId) => rowByNavigatorRowId.get(navigatorRowId))
      .filter((row): row is ReviewProofReconciliationRowView => Boolean(row));

    for (const repoRelativeReference of prompt.repoRelativeReferences) {
      addStaticReference(references, {
        kind: "static_inspection_prompt",
        label: prompt.label,
        summary: prompt.summary,
        repoRelativeReference,
        rows: promptRows,
        proofCommandIds: prompt.proofCommandIds,
        staticInspectionPromptIds: [prompt.promptId],
      });
    }
  }

  for (const commandReference of navigator.staticCommandReferences) {
    const commandRows = rowsForCommandReference(commandReference, rows);

    addStaticReference(references, {
      kind: "static_command_reference",
      label: commandReference.label,
      summary: commandReference.purpose,
      repoRelativeReference: commandReference.repoRelativeReference,
      rows: commandRows,
      proofCommandIds: [commandReference.commandId],
    });
  }

  return Array.from(references.values()).sort(
    (left, right) =>
      left.kind.localeCompare(right.kind) ||
      left.repoRelativeReference.localeCompare(right.repoRelativeReference),
  );
}

function addStaticReference(
  references: Map<string, ReviewProofReconciliationStaticReferenceView>,
  input: ReferenceInput,
): void {
  if (!input.rows.length || input.repoRelativeReference.startsWith("/")) {
    return;
  }

  const key = `${input.kind}:${input.repoRelativeReference}`;
  const existing = references.get(key);
  const rowIds = input.rows.map((row) => row.reconciliationRowId);
  const navigatorRowIds = input.rows.map((row) => row.navigatorRowId);
  const packetIds = input.rows.map((row) => row.packetId);
  const proofCommandIds =
    input.proofCommandIds ?? input.rows.flatMap((row) => row.proofCommandIds);
  const staticHumanGateStepIds = input.rows.flatMap(
    (row) => row.staticHumanGateStepIds,
  );
  const staticInspectionPromptIds =
    input.staticInspectionPromptIds ??
    input.rows.flatMap((row) => row.staticInspectionPromptIds);

  if (existing) {
    existing.reconciliationRowIds = unique([
      ...existing.reconciliationRowIds,
      ...rowIds,
    ]);
    existing.navigatorRowIds = unique([
      ...existing.navigatorRowIds,
      ...navigatorRowIds,
    ]);
    existing.packetIds = unique([...existing.packetIds, ...packetIds]);
    existing.proofCommandIds = unique([
      ...existing.proofCommandIds,
      ...proofCommandIds,
    ]);
    existing.staticHumanGateStepIds = unique([
      ...existing.staticHumanGateStepIds,
      ...staticHumanGateStepIds,
    ]);
    existing.staticInspectionPromptIds = unique([
      ...existing.staticInspectionPromptIds,
      ...staticInspectionPromptIds,
    ]);
    return;
  }

  references.set(key, {
    referenceId: `proof-reconciliation-reference:${sanitizeId(key)}`,
    kind: input.kind,
    label: input.label,
    summary: input.summary,
    repoRelativeReference: input.repoRelativeReference,
    reconciliationRowIds: unique(rowIds),
    navigatorRowIds: unique(navigatorRowIds),
    packetIds: unique(packetIds),
    proofCommandIds: unique(proofCommandIds),
    staticHumanGateStepIds: unique(staticHumanGateStepIds),
    staticInspectionPromptIds: unique(staticInspectionPromptIds),
    localOnly: true,
    sourceBacked: true,
    staticOnly: true,
    nonExecutable: true,
    nonCertifying: true,
  });
}

function buildDeferredBoundaryNotes(
  rows: ReviewProofReconciliationRowView[],
  markers: ReviewProofNavigatorDeferredBoundaryMarkerView[],
): ReviewProofReconciliationDeferredBoundaryNoteView[] {
  const rowByNavigatorRowId = new Map(
    rows.map((row) => [row.navigatorRowId, row]),
  );

  return markers.flatMap((marker) => {
    const row = rowByNavigatorRowId.get(marker.navigatorRowId);
    if (!row) {
      return [];
    }

    return {
      noteId: `proof-reconciliation-note:${marker.markerId}`,
      markerId: marker.markerId,
      reconciliationRowId: row.reconciliationRowId,
      navigatorRowId: marker.navigatorRowId,
      packetId: marker.packetId,
      label: marker.label,
      summary: marker.summary,
      sourcePriorityRowIds: marker.sourcePriorityRowIds,
      sourceCoverageRowIds: marker.sourceCoverageRowIds,
      sourceTraceRowIds: marker.sourceTraceRowIds,
      sourceOutcomeRowIds: marker.sourceOutcomeRowIds,
      evidenceTargetIds: marker.evidenceTargetIds,
      actionability: "deferred_non_actionable",
      nonActionable: true,
      informationalOnly: true,
      nonCertifying: true,
    };
  });
}

function buildCounts(
  rows: ReviewProofReconciliationRowView[],
  buckets: ReviewProofReconciliationBucketView[],
  segments: ReviewProofReconciliationSegmentSummaryView[],
  staticReferences: ReviewProofReconciliationStaticReferenceView[],
  prompts: ReviewProofNavigatorStaticInspectionPromptView[],
  commandReferences: ReviewProofNavigatorStaticCommandReferenceView[],
  deferredBoundaryNotes: ReviewProofReconciliationDeferredBoundaryNoteView[],
): ReviewProofReconciliationSummaryView["counts"] {
  return {
    totalReconciliationRowCount: rows.length,
    completeLocalChainRowCount: rows.filter(
      (row) => row.bucketKind === "complete_local_chain",
    ).length,
    localInspectionGapRowCount: rows.filter(
      (row) => row.bucketKind === "local_inspection_gap",
    ).length,
    deferredProductionBoundaryRowCount: rows.filter(
      (row) => row.bucketKind === "deferred_production_boundary",
    ).length,
    sourceChainSegmentCount: segments.length,
    consistencyBucketCount: buckets.length,
    staticReviewReferenceCount: staticReferences.length,
    staticInspectionPromptCount: prompts.length,
    proofCommandReferenceCount: commandReferences.length,
    deferredBoundaryNoteCount: deferredBoundaryNotes.length,
    sourcePriorityRowCount: unique(rows.map((row) => row.sourcePriorityRowId))
      .length,
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
    proofBucketCount: unique(rows.flatMap((row) => row.proofBucketLabels)).length,
    staticHumanGateStepCount: unique(
      rows.flatMap((row) => row.staticHumanGateStepIds),
    ).length,
  };
}

function classifyRow(
  row: ReviewProofNavigatorView["navigatorRows"][number],
): ReviewProofReconciliationBucketKind {
  if (row.packetStatus === "ready_local_evidence") {
    return "complete_local_chain";
  }

  if (row.packetStatus === "deferred_production_scope") {
    return "deferred_production_boundary";
  }

  return "local_inspection_gap";
}

function groupPromptsByNavigatorRowId(
  prompts: ReviewProofNavigatorStaticInspectionPromptView[],
): Map<string, ReviewProofNavigatorStaticInspectionPromptView[]> {
  const byNavigatorRowId = new Map<
    string,
    ReviewProofNavigatorStaticInspectionPromptView[]
  >();

  for (const prompt of prompts) {
    for (const navigatorRowId of prompt.navigatorRowIds) {
      const rows = byNavigatorRowId.get(navigatorRowId) ?? [];
      rows.push(prompt);
      byNavigatorRowId.set(navigatorRowId, rows);
    }
  }

  return byNavigatorRowId;
}

function groupDeferredMarkersByNavigatorRowId(
  markers: ReviewProofNavigatorDeferredBoundaryMarkerView[],
): Map<string, ReviewProofNavigatorDeferredBoundaryMarkerView[]> {
  const byNavigatorRowId = new Map<
    string,
    ReviewProofNavigatorDeferredBoundaryMarkerView[]
  >();

  for (const marker of markers) {
    const rows = byNavigatorRowId.get(marker.navigatorRowId) ?? [];
    rows.push(marker);
    byNavigatorRowId.set(marker.navigatorRowId, rows);
  }

  return byNavigatorRowId;
}

function rowsForCommandReference(
  commandReference: ReviewProofNavigatorStaticCommandReferenceView,
  rows: ReviewProofReconciliationRowView[],
): ReviewProofReconciliationRowView[] {
  if (commandReference.navigatorRowIds.length) {
    const navigatorRowIds = new Set(commandReference.navigatorRowIds);
    return rows.filter((row) => navigatorRowIds.has(row.navigatorRowId));
  }

  return rows.filter(
    (row) =>
      commandReference.packetIds.includes(row.packetId) ||
      commandReference.sourcePriorityRowIds.includes(row.sourcePriorityRowId) ||
      intersects(commandReference.sourceCoverageRowIds, row.sourceCoverageRowIds) ||
      intersects(commandReference.sourceTraceRowIds, row.sourceTraceRowIds) ||
      intersects(commandReference.sourceOutcomeRowIds, row.sourceOutcomeRowIds) ||
      intersects(commandReference.evidenceTargetIds, row.evidenceTargetIds),
  );
}

function summaryText(
  counts: ReviewProofReconciliationSummaryView["counts"],
): string {
  return `${counts.totalReconciliationRowCount} proof-chain reconciliation rows distinguish ${counts.completeLocalChainRowCount} complete local chains, ${counts.localInspectionGapRowCount} static local inspection gaps, and ${counts.deferredProductionBoundaryRowCount} deferred production boundaries.`;
}

function intersects(left: string[], right: string[]): boolean {
  const rightValues = new Set(right);
  return left.some((value) => rightValues.has(value));
}

function sanitizeId(value: string): string {
  return value.replace(/[^a-zA-Z0-9:-]+/g, "-").replace(/-+$/g, "");
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}
