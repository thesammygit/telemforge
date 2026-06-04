import type {
  ReviewPassDeferredScopeLedgerRowView,
  ReviewPassLocalProofGapRowView,
  ReviewPassOutcomeBucket,
  ReviewPassOutcomeProofCommandReferenceView,
  ReviewPassOutcomeRowStatus,
  ReviewPassOutcomeRowView,
  ReviewPassOutcomeSummaryView,
  ReviewPassOutcomeVerdict,
  ReviewPassOutcomeView,
  ReviewPassProofCommandReferenceView,
  ReviewPassReadinessRowStatus,
  ReviewPassReadinessRowView,
  ReviewPassReadinessView,
  ReviewPassStaticVerdictNoteView,
} from "../features/mission-console/types.ts";

type OutcomeCounts = ReviewPassOutcomeSummaryView["counts"];

const stage23ProofCommand: ReviewPassOutcomeProofCommandReferenceView = {
  commandId: "review-pass-outcome",
  command:
    "node --experimental-strip-types --test tests/frontend/reviewPassOutcome.test.ts",
  label: "Stage 23 review-pass outcome test",
  purpose:
    "Proves the local review-pass outcome board is derived from Stage 22 readiness rows.",
  source: "stage23_outcome",
};

export function buildReviewPassOutcome(
  reviewPassReadiness: ReviewPassReadinessView | undefined,
): ReviewPassOutcomeView | undefined {
  if (!reviewPassReadiness?.readinessRows.length) {
    return undefined;
  }

  const outcomeRows = reviewPassReadiness.readinessRows
    .map(buildOutcomeRow)
    .sort(compareOutcomeRows)
    .map((row, index) => ({ ...row, rank: index + 1 }));
  const localProofGapRows = outcomeRows
    .filter((row) => row.status === "unresolved_local_proof_gap")
    .map(buildLocalProofGapRow);
  const deferredScopeLedgerRows = outcomeRows
    .filter((row) => row.status === "deferred_production_scope")
    .map(buildDeferredScopeLedgerRow);
  const counts = buildCounts(
    outcomeRows,
    reviewPassReadiness.readinessRows.length,
  );

  return {
    schema: "telemforge.review_pass_outcome.v1",
    version: 1,
    contractLabel: "local deterministic review-pass outcome board",
    localStatus: reviewPassReadiness.localStatus,
    candidateOutcome: buildCandidateOutcome(counts),
    outcomeRows,
    localProofGapRows,
    deferredScopeLedgerRows,
    staticVerdictNotes,
    proofCommandReferences: uniqueCommandReferences([
      stage23ProofCommand,
      ...reviewPassReadiness.proofCommandReferences.map(toOutcomeProofCommand),
    ]),
    sourceReadiness: reviewPassReadiness,
    sourceEvidenceMapRows: reviewPassReadiness.evidenceMapRows,
  };
}

function buildOutcomeRow(
  row: ReviewPassReadinessRowView,
): ReviewPassOutcomeRowView {
  const status = outcomeStatus(row.status);

  return {
    outcomeRowId: `review-pass-outcome:${row.readinessRowId}`,
    rank: row.rank,
    status,
    outcomeBucket: outcomeBucket(status),
    label: row.label,
    summary: outcomeSummary(row, status),
    sourceReadinessRowIds: [row.readinessRowId],
    sourceResolutionIds: [row.sourceResolutionId],
    sourceMatrixRowIds: row.sourceMatrixRowIds,
    sourceActionIds: row.sourceActionIds,
    evidenceTargetIds: row.evidenceTargetIds,
    sourceBuckets: row.sourceBuckets,
    proofCommandReferences: uniqueCommandReferences([
      stage23ProofCommand,
      ...row.proofCommandReferences.map(toOutcomeProofCommand),
    ]),
    nextStaticLocalReviewStep:
      status === "deferred_production_scope"
        ? deferredNextStep(row)
        : row.nextStaticReviewPassStep,
  };
}

function outcomeStatus(
  status: ReviewPassReadinessRowStatus,
): ReviewPassOutcomeRowStatus {
  switch (status) {
    case "needs_local_proof":
      return "unresolved_local_proof_gap";
    case "static_proof_ready":
      return "ready_local_evidence";
    case "deferred_production_boundary":
      return "deferred_production_scope";
  }
}

function outcomeBucket(
  status: ReviewPassOutcomeRowStatus,
): ReviewPassOutcomeBucket {
  switch (status) {
    case "ready_local_evidence":
      return "ready_local_evidence";
    case "unresolved_local_proof_gap":
      return "local_proof_gap";
    case "deferred_production_scope":
      return "deferred_production_scope";
  }
}

function outcomeSummary(
  row: ReviewPassReadinessRowView,
  status: ReviewPassOutcomeRowStatus,
): string {
  switch (status) {
    case "ready_local_evidence":
      return "Static local evidence is ready for the candidate local pass.";
    case "unresolved_local_proof_gap":
    case "deferred_production_scope":
      return row.summary;
  }
}

function buildLocalProofGapRow(
  row: ReviewPassOutcomeRowView,
): ReviewPassLocalProofGapRowView {
  return {
    gapRowId: `local-proof-gap:${row.sourceReadinessRowIds[0]}`,
    sourceReadinessRowId: row.sourceReadinessRowIds[0],
    label: row.label,
    summary: row.summary,
    evidenceTargetIds: row.evidenceTargetIds,
    sourceMatrixRowIds: row.sourceMatrixRowIds,
    proofCommandIds: row.proofCommandReferences.map(
      (command) => command.commandId,
    ),
    nextStaticLocalReviewStep: row.nextStaticLocalReviewStep,
  };
}

function buildDeferredScopeLedgerRow(
  row: ReviewPassOutcomeRowView,
): ReviewPassDeferredScopeLedgerRowView {
  return {
    ledgerRowId: `deferred-scope:${row.sourceReadinessRowIds[0]}`,
    label: row.label,
    summary: row.summary,
    sourceReadinessRowIds: row.sourceReadinessRowIds,
    sourceResolutionIds: row.sourceResolutionIds,
    sourceMatrixRowIds: row.sourceMatrixRowIds,
    sourceActionIds: row.sourceActionIds,
    evidenceTargetIds: row.evidenceTargetIds,
    sourceBucketLabels: row.sourceBuckets.map((bucket) => bucket.label),
    proofCommandIds: row.proofCommandReferences.map(
      (command) => command.commandId,
    ),
    actionability: "deferred_non_actionable",
    nextStaticLocalReviewStep: row.nextStaticLocalReviewStep,
  };
}

function buildCounts(
  rows: ReviewPassOutcomeRowView[],
  sourceReadinessRowCount: number,
): OutcomeCounts {
  return {
    totalOutcomeRowCount: rows.length,
    readyLocalEvidenceRowCount: rows.filter(
      (row) => row.status === "ready_local_evidence",
    ).length,
    unresolvedLocalProofGapCount: rows.filter(
      (row) => row.status === "unresolved_local_proof_gap",
    ).length,
    deferredProductionScopeRowCount: rows.filter(
      (row) => row.status === "deferred_production_scope",
    ).length,
    sourceReadinessRowCount,
    evidenceTargetCount: unique(rows.flatMap((row) => row.evidenceTargetIds))
      .length,
    proofCommandReferenceCount: unique(
      rows.flatMap((row) =>
        row.proofCommandReferences.map((command) => command.commandId),
      ),
    ).length,
  };
}

function buildCandidateOutcome(
  counts: OutcomeCounts,
): ReviewPassOutcomeSummaryView {
  const verdict = outcomeVerdict(counts);

  return {
    outcomeId: "candidate-local-review-pass",
    verdict,
    label: outcomeLabel(verdict),
    summary: outcomeCandidateSummary(verdict, counts),
    informationalOnly: true,
    nonCertifying: true,
    counts,
  };
}

function outcomeVerdict(counts: OutcomeCounts): ReviewPassOutcomeVerdict {
  if (counts.unresolvedLocalProofGapCount > 0) {
    return "local_proof_gaps_remaining";
  }
  if (
    counts.readyLocalEvidenceRowCount === 0 &&
    counts.deferredProductionScopeRowCount > 0
  ) {
    return "deferred_production_scope_only";
  }
  return "local_pass_candidate";
}

function outcomeLabel(verdict: ReviewPassOutcomeVerdict): string {
  switch (verdict) {
    case "local_proof_gaps_remaining":
      return "Local proof gaps remain";
    case "local_pass_candidate":
      return "Candidate local pass";
    case "deferred_production_scope_only":
      return "Deferred production scope only";
  }
}

function outcomeCandidateSummary(
  verdict: ReviewPassOutcomeVerdict,
  counts: OutcomeCounts,
): string {
  switch (verdict) {
    case "local_proof_gaps_remaining":
      return `${counts.unresolvedLocalProofGapCount} unresolved local proof gap rows must be checked before this local pass can be treated as review-ready.`;
    case "local_pass_candidate":
      return `${counts.readyLocalEvidenceRowCount} ready local evidence rows support an informational candidate local pass.`;
    case "deferred_production_scope_only":
      return "Local evidence rows are clear; only non-actionable deferred production scope remains visible.";
  }
}

function deferredNextStep(row: ReviewPassReadinessRowView): string {
  return `${row.label} in Stage 23; do not add reviewer ownership, signoff, persistence, production handoff, ticketing, report export, or command-runner work.`;
}

function compareOutcomeRows(
  left: ReviewPassOutcomeRowView,
  right: ReviewPassOutcomeRowView,
): number {
  return (
    outcomeStatusRank(left.status) - outcomeStatusRank(right.status) ||
    left.sourceReadinessRowIds[0].localeCompare(right.sourceReadinessRowIds[0])
  );
}

function outcomeStatusRank(status: ReviewPassOutcomeRowStatus): number {
  switch (status) {
    case "unresolved_local_proof_gap":
      return 0;
    case "ready_local_evidence":
      return 1;
    case "deferred_production_scope":
      return 2;
  }
}

function toOutcomeProofCommand(
  command: ReviewPassProofCommandReferenceView,
): ReviewPassOutcomeProofCommandReferenceView {
  return { ...command };
}

function uniqueCommandReferences(
  commands: ReviewPassOutcomeProofCommandReferenceView[],
): ReviewPassOutcomeProofCommandReferenceView[] {
  const seen = new Set<string>();
  const uniqueCommands: ReviewPassOutcomeProofCommandReferenceView[] = [];

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

const staticVerdictNotes: ReviewPassStaticVerdictNoteView[] = [
  {
    noteId: "stage23-informational-only",
    label: "Informational local candidate",
    summary:
      "The Stage 23 outcome board summarizes deterministic local evidence only; it is not reviewer signoff, audit retention, or production certification.",
  },
  {
    noteId: "stage23-static-non-executable",
    label: "Static proof references",
    summary:
      "Proof commands are repo-relative text references for reviewer inspection; the mission console does not execute shell commands or store progress.",
  },
  {
    noteId: "stage23-deferred-production-visible",
    label: "Deferred production scope",
    summary:
      "Production-only auth, identity, handoff exports, ticketing, report authoring, and deploy work remain visible but non-actionable.",
  },
];
