import type {
  ReviewEvidenceTraceDeferredBoundaryNoteView,
  ReviewEvidenceTraceProofCommandReferenceView,
  ReviewEvidenceTraceRowView,
  ReviewEvidenceTraceSegmentKind,
  ReviewEvidenceTraceSegmentView,
  ReviewEvidenceTraceSourceReferenceGroupView,
  ReviewEvidenceTraceSourceReferenceKind,
  ReviewEvidenceTraceView,
  ReviewPassDeferredScopeLedgerRowView,
  ReviewPassOutcomeProofCommandReferenceView,
  ReviewPassOutcomeRowView,
  ReviewPassOutcomeView,
} from "../features/mission-console/types.ts";

type TraceCounts = ReviewEvidenceTraceView["summary"]["counts"];

const stage24ProofCommand: ReviewEvidenceTraceProofCommandReferenceView = {
  commandId: "review-evidence-trace",
  command:
    "node --experimental-strip-types --test tests/frontend/reviewEvidenceTrace.test.ts",
  label: "Stage 24 review evidence trace test",
  purpose:
    "Proves the local review evidence trace is derived from Stage 23 outcome rows.",
  source: "stage24_trace",
};

export function buildReviewEvidenceTrace(
  reviewPassOutcome: ReviewPassOutcomeView | undefined,
): ReviewEvidenceTraceView | undefined {
  if (!reviewPassOutcome?.outcomeRows.length) {
    return undefined;
  }

  const traceRows = reviewPassOutcome.outcomeRows.map(buildTraceRow);
  const selectedTraceRow =
    traceRows.find((row) => row.status === "unresolved_local_proof_gap") ??
    traceRows[0];
  const counts = buildCounts(traceRows, reviewPassOutcome);

  return {
    schema: "telemforge.review_evidence_trace.v1",
    version: 1,
    contractLabel: "local deterministic review evidence trace navigator",
    localStatus: reviewPassOutcome.localStatus,
    summary: {
      traceId: "candidate-local-review-evidence-trace",
      label: "Local proof trace navigator",
      summary: summaryText(selectedTraceRow, counts),
      defaultTraceRowId: selectedTraceRow.traceRowId,
      informationalOnly: true,
      nonCertifying: true,
      counts,
    },
    traceRows,
    selectedTraceRow,
    proofCommandReferences: uniqueCommandReferences([
      stage24ProofCommand,
      ...reviewPassOutcome.proofCommandReferences.map(toTraceProofCommand),
    ]),
    deferredBoundaryNotes: reviewPassOutcome.deferredScopeLedgerRows.map(
      buildDeferredBoundaryNote,
    ),
    staticProofChecklistSummary:
      "Stage 24 proof drilldown references are static repo-relative text only; the mission console does not execute commands, store selections, or certify production readiness.",
    sourceOutcome: reviewPassOutcome,
  };
}

function buildTraceRow(
  row: ReviewPassOutcomeRowView,
): ReviewEvidenceTraceRowView {
  const proofCommandReferences = uniqueCommandReferences([
    stage24ProofCommand,
    ...row.proofCommandReferences.map(toTraceProofCommand),
  ]);
  const sourceReferenceGroups = buildSourceReferenceGroups(row);

  return {
    traceRowId: `evidence-trace:${row.outcomeRowId}`,
    rank: row.rank,
    status: row.status,
    outcomeBucket: row.outcomeBucket,
    label: row.label,
    summary: row.summary,
    sourceOutcomeRowIds: [row.outcomeRowId],
    sourceReadinessRowIds: row.sourceReadinessRowIds,
    sourceResolutionIds: row.sourceResolutionIds,
    sourceMatrixRowIds: row.sourceMatrixRowIds,
    sourceActionIds: row.sourceActionIds,
    evidenceTargetIds: row.evidenceTargetIds,
    sourceBucketLabels: row.sourceBuckets.map((bucket) => bucket.label),
    sourceReferenceGroups,
    proofCommandReferences,
    traceSegments: buildTraceSegments(row, sourceReferenceGroups, proofCommandReferences),
    nextStaticLocalReviewStep: row.nextStaticLocalReviewStep,
    informationalOnly: true,
    nonCertifying: true,
  };
}

function buildSourceReferenceGroups(
  row: ReviewPassOutcomeRowView,
): ReviewEvidenceTraceSourceReferenceGroupView[] {
  return [
    sourceGroup(
      row,
      "outcome",
      "Stage 23 outcome rows",
      [row.outcomeRowId],
    ),
    sourceGroup(
      row,
      "readiness",
      "Stage 22 readiness rows",
      row.sourceReadinessRowIds,
    ),
    sourceGroup(
      row,
      "resolution",
      "Stage 21 resolution rows",
      row.sourceResolutionIds,
    ),
    sourceGroup(
      row,
      "coverage",
      "Stage 19 coverage matrix rows",
      row.sourceMatrixRowIds,
    ),
    sourceGroup(row, "action", "Source action ids", row.sourceActionIds),
    sourceGroup(
      row,
      "evidence_target",
      "Evidence target ids",
      row.evidenceTargetIds,
    ),
    sourceGroup(
      row,
      "source_bucket",
      "Source bucket ids",
      row.sourceBuckets.map((bucket) => bucket.bucketId),
    ),
  ];
}

function sourceGroup(
  row: ReviewPassOutcomeRowView,
  sourceKind: ReviewEvidenceTraceSourceReferenceKind,
  label: string,
  sourceIds: string[],
): ReviewEvidenceTraceSourceReferenceGroupView {
  return {
    groupId: `trace-source:${row.outcomeRowId}:${sourceKind}`,
    sourceKind,
    label,
    sourceIds,
  };
}

function buildTraceSegments(
  row: ReviewPassOutcomeRowView,
  sourceReferenceGroups: ReviewEvidenceTraceSourceReferenceGroupView[],
  proofCommandReferences: ReviewEvidenceTraceProofCommandReferenceView[],
): ReviewEvidenceTraceSegmentView[] {
  const segments: ReviewEvidenceTraceSegmentView[] = [
    segment(row, "outcome", "Stage 23 outcome row", row.summary, [
      groupId(sourceReferenceGroups, "outcome"),
    ]),
    segment(
      row,
      "readiness",
      "Stage 22 readiness source",
      "Trace follows the source readiness row ids carried by the Stage 23 outcome row.",
      [groupId(sourceReferenceGroups, "readiness")],
    ),
    segment(
      row,
      "resolution",
      "Stage 21 resolution source",
      "Trace follows the source resolution ids carried by the Stage 23 outcome row.",
      [groupId(sourceReferenceGroups, "resolution")],
    ),
    segment(
      row,
      "coverage",
      "Stage 19 coverage and evidence targets",
      "Trace keeps matrix rows, source action ids, evidence targets, and source buckets as separate source references.",
      [
        groupId(sourceReferenceGroups, "coverage"),
        groupId(sourceReferenceGroups, "action"),
        groupId(sourceReferenceGroups, "evidence_target"),
        groupId(sourceReferenceGroups, "source_bucket"),
      ],
    ),
    segment(
      row,
      "proof",
      "Static local proof references",
      row.nextStaticLocalReviewStep,
      [],
      proofCommandReferences.map((command) => command.commandId),
      row.nextStaticLocalReviewStep,
    ),
  ];

  if (row.status === "deferred_production_scope") {
    segments.push(
      segment(
        row,
        "deferred_scope",
        "Deferred production boundary",
        "Production-only scope remains visible, non-actionable, and outside this local trace.",
        [
          groupId(sourceReferenceGroups, "readiness"),
          groupId(sourceReferenceGroups, "resolution"),
          groupId(sourceReferenceGroups, "action"),
        ],
      ),
    );
  }

  return segments;
}

function segment(
  row: ReviewPassOutcomeRowView,
  segmentKind: ReviewEvidenceTraceSegmentKind,
  label: string,
  summary: string,
  sourceReferenceGroupIds: string[],
  proofCommandIds: string[] = [],
  nextStaticLocalReviewStep?: string,
): ReviewEvidenceTraceSegmentView {
  return {
    segmentId: `trace-segment:${row.outcomeRowId}:${segmentKind}`,
    segmentKind,
    label,
    summary,
    sourceReferenceGroupIds,
    proofCommandIds,
    nextStaticLocalReviewStep,
  };
}

function groupId(
  sourceReferenceGroups: ReviewEvidenceTraceSourceReferenceGroupView[],
  sourceKind: ReviewEvidenceTraceSourceReferenceKind,
): string {
  const group = sourceReferenceGroups.find(
    (candidate) => candidate.sourceKind === sourceKind,
  );

  if (!group) {
    throw new Error(`Missing Stage 24 source reference group ${sourceKind}`);
  }

  return group.groupId;
}

function buildCounts(
  traceRows: ReviewEvidenceTraceRowView[],
  reviewPassOutcome: ReviewPassOutcomeView,
): TraceCounts {
  return {
    totalTraceRowCount: traceRows.length,
    unresolvedLocalProofGapCount: traceRows.filter(
      (row) => row.status === "unresolved_local_proof_gap",
    ).length,
    readyLocalEvidenceRowCount: traceRows.filter(
      (row) => row.status === "ready_local_evidence",
    ).length,
    deferredProductionScopeRowCount: traceRows.filter(
      (row) => row.status === "deferred_production_scope",
    ).length,
    sourceOutcomeRowCount: reviewPassOutcome.outcomeRows.length,
    sourceReadinessRowCount: unique(
      traceRows.flatMap((row) => row.sourceReadinessRowIds),
    ).length,
    sourceResolutionRowCount: unique(
      traceRows.flatMap((row) => row.sourceResolutionIds),
    ).length,
    sourceMatrixRowCount: unique(
      traceRows.flatMap((row) => row.sourceMatrixRowIds),
    ).length,
    evidenceTargetCount: unique(
      traceRows.flatMap((row) => row.evidenceTargetIds),
    ).length,
    proofCommandReferenceCount: unique(
      traceRows.flatMap((row) =>
        row.proofCommandReferences.map((command) => command.commandId),
      ),
    ).length,
  };
}

function summaryText(
  selectedTraceRow: ReviewEvidenceTraceRowView,
  counts: TraceCounts,
): string {
  if (counts.unresolvedLocalProofGapCount > 0) {
    return `${counts.unresolvedLocalProofGapCount} unresolved local proof gap rows remain; the default trace selects ${selectedTraceRow.label}.`;
  }

  if (counts.readyLocalEvidenceRowCount > 0) {
    return `${counts.readyLocalEvidenceRowCount} ready local evidence rows are traceable through static proof references.`;
  }

  return "Only deferred production scope remains visible and non-actionable.";
}

function buildDeferredBoundaryNote(
  row: ReviewPassDeferredScopeLedgerRowView,
): ReviewEvidenceTraceDeferredBoundaryNoteView {
  return {
    noteId: `trace-boundary:${row.ledgerRowId}`,
    label: row.label,
    summary: row.summary,
    sourceReadinessRowIds: row.sourceReadinessRowIds,
    sourceResolutionIds: row.sourceResolutionIds,
    sourceMatrixRowIds: row.sourceMatrixRowIds,
    sourceActionIds: row.sourceActionIds,
    evidenceTargetIds: row.evidenceTargetIds,
    actionability: row.actionability,
    nextStaticLocalReviewStep: row.nextStaticLocalReviewStep,
  };
}

function toTraceProofCommand(
  command: ReviewPassOutcomeProofCommandReferenceView,
): ReviewEvidenceTraceProofCommandReferenceView {
  return { ...command };
}

function uniqueCommandReferences(
  commands: ReviewEvidenceTraceProofCommandReferenceView[],
): ReviewEvidenceTraceProofCommandReferenceView[] {
  const seen = new Set<string>();
  const uniqueCommands: ReviewEvidenceTraceProofCommandReferenceView[] = [];

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
