import type {
  ReviewActionWalkthroughCoverageView,
  ReviewHandoffCoverageCommandView,
  ReviewHandoffCoverageMatrixBlockerStatus,
  ReviewHandoffCoverageMatrixReadinessVerdict,
  ReviewHandoffCoverageMatrixRowView,
  ReviewHandoffCoverageMatrixView,
  ReviewHandoffCoverageSourceBucketView,
  ReviewHandoffRehearsalStepView,
  ReviewHandoffRehearsalView,
} from "../features/mission-console/types.ts";

const sourceBucketDefinitions = [
  {
    bucketId: "briefing-board-rows",
    label: "Briefing board rows",
    summary:
      "Local evidence drilldown rows stay attached to the staged review path.",
  },
  {
    bucketId: "replay-frames",
    label: "Replay frames",
    summary:
      "Replay playback frames prove the local action path is tied to evidence.",
  },
  {
    bucketId: "runbook-targets",
    label: "Runbook targets",
    summary:
      "Guided runbook targets remain visible to the local review matrix.",
  },
  {
    bucketId: "incident-packet-refs",
    label: "Incident packet refs",
    summary:
      "Incident packet references keep the local review chain traceable.",
  },
  {
    bucketId: "evidence-export-refs",
    label: "Evidence export refs",
    summary:
      "Evidence export references stay visible without introducing export flows.",
  },
  {
    bucketId: "source-paths",
    label: "Source paths",
    summary:
      "Repo-relative source paths keep the matrix anchored to local code.",
  },
] as const;

const localVerificationCommands: ReviewHandoffCoverageCommandView[] = [
  {
    commandId: "review-coverage-matrix",
    command:
      "node --experimental-strip-types --test tests/frontend/reviewHandoffCoverageMatrix.test.ts",
    label: "Matrix helper test",
    purpose: "Proves the Stage 19 matrix rows are derived deterministically.",
  },
  {
    commandId: "review-handoff-rehearsal",
    command:
      "node --experimental-strip-types --test tests/frontend/reviewHandoffRehearsal.test.ts",
    label: "Stage 18 rehearsal test",
    purpose: "Confirms the matrix stays aligned with the Stage 18 rehearsal.",
  },
  {
    commandId: "review-action-walkthrough",
    command:
      "node --experimental-strip-types --test tests/frontend/reviewActionWalkthrough.test.ts",
    label: "Stage 17 walkthrough test",
    purpose: "Verifies the evidence-path coverage that feeds the rehearsal.",
  },
  {
    commandId: "review-action-queue",
    command:
      "node --experimental-strip-types --test tests/frontend/reviewActionQueue.test.ts",
    label: "Stage 16 queue test",
    purpose: "Keeps the review action queue surface stable for the matrix.",
  },
  {
    commandId: "review-briefing-board",
    command:
      "node --experimental-strip-types --test tests/frontend/reviewBriefingBoard.test.ts",
    label: "Stage 15 briefing board test",
    purpose: "Checks the grouped evidence drilldown the matrix summarizes.",
  },
  {
    commandId: "review-decision-register",
    command:
      "node --experimental-strip-types --test tests/frontend/reviewDecisionRegister.test.ts",
    label: "Stage 14 decision register test",
    purpose: "Protects the upstream decision register that seeds the review path.",
  },
  {
    commandId: "console-view-model",
    command:
      "node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts",
    label: "Console view model test",
    purpose: "Covers the matrix wiring in the mission-console view model.",
  },
  {
    commandId: "public-repo-guard",
    command: "python3 scripts/public_repo_guard.py --scan-history",
    label: "Public repo guard",
    purpose: "Confirms the review slice stays free of private material before push.",
  },
];

export function buildReviewHandoffCoverageMatrix(
  reviewHandoffRehearsal: ReviewHandoffRehearsalView | undefined,
): ReviewHandoffCoverageMatrixView | undefined {
  if (!reviewHandoffRehearsal) {
    return undefined;
  }

  const rows = reviewHandoffRehearsal.steps.map((step, index) =>
    buildCoverageRow(step, index),
  );

  if (!rows.length) {
    return undefined;
  }

  const counts = buildCounts(rows);
  const verdict = readinessVerdict(counts);

  return {
    schema: "telemforge.review_handoff_coverage_matrix.v1",
    version: 1,
    contractLabel: "local deterministic review coverage matrix",
    localStatus: reviewHandoffRehearsal.localStatus,
    readiness: {
      verdict,
      label: readinessLabel(verdict),
      summary: readinessSummary(verdict, counts),
      counts,
    },
    rows,
    localVerificationCommands,
    unresolvedLocalBlockers: reviewHandoffRehearsal.unresolvedLocalBlockers,
    deferredProductionNotes: unique(reviewHandoffRehearsal.deferredProductionNotes),
    nextLocalPrompt:
      "Inspect the Stage 19 local review coverage matrix row by row, run the focused local verification commands, and keep deferred production scope visible but outside the review boundary.",
    sourceEvidenceReferences: unique(
      rows.flatMap((row) => row.sourceEvidenceReferences),
    ),
  };
}

function buildCoverageRow(
  step: ReviewHandoffRehearsalStepView,
  index: number,
): ReviewHandoffCoverageMatrixRowView {
  const readinessVerdict = rowReadinessVerdict(step);
  const blockerStatus = rowBlockerStatus(step, readinessVerdict);
  const sourceCoverageBuckets = buildSourceCoverageBuckets(step.checkpointCounts);

  return {
    rowId: `coverage-row-${index + 1}:${step.actionId}`,
    rowNumber: index + 1,
    actionId: step.actionId,
    rehearsalStepId: step.stepId,
    rehearsalStepLabel: step.actionLabel,
    readinessVerdict,
    readinessLabel: rowReadinessLabel(readinessVerdict),
    blockerStatus,
    blockerSummary: rowBlockerSummary(step, blockerStatus),
    targetCoverageCounts: step.checkpointCounts,
    sourceCoverageBuckets,
    nextLocalStep: step.nextLocalStep,
    sourceEvidenceReferences: unique(step.sourceEvidenceReferences),
  };
}

function buildSourceCoverageBuckets(
  counts: ReviewActionWalkthroughCoverageView,
): ReviewHandoffCoverageSourceBucketView[] {
  return sourceBucketDefinitions.map((definition) => {
    const count = sourceBucketCount(definition.bucketId, counts);
    return {
      bucketId: definition.bucketId,
      label: definition.label,
      count,
      summary: definition.summary,
    };
  });
}

function sourceBucketCount(
  bucketId: string,
  counts: ReviewActionWalkthroughCoverageView,
): number {
  switch (bucketId) {
    case "briefing-board-rows":
      return counts.evidenceRowCount;
    case "replay-frames":
      return counts.replayFrameCount;
    case "runbook-targets":
      return counts.runbookTargetCount;
    case "incident-packet-refs":
      return counts.packetReferenceCount;
    case "evidence-export-refs":
      return counts.exportReferenceCount;
    case "source-paths":
      return counts.sourcePathCount;
  }
  return 0;
}

function rowReadinessVerdict(
  step: ReviewHandoffRehearsalStepView,
): ReviewHandoffCoverageMatrixReadinessVerdict {
  if (step.blocking || step.missingTargetStatus === "missing_targets") {
    return "blocked_by_local_follow_up";
  }
  if (step.blockerCategory === "deferred_production_scope") {
    return "deferred_production_scope_only";
  }
  return "ready_for_local_review";
}

function rowBlockerStatus(
  step: ReviewHandoffRehearsalStepView,
  readinessVerdict: ReviewHandoffCoverageMatrixReadinessVerdict,
): ReviewHandoffCoverageMatrixBlockerStatus {
  switch (readinessVerdict) {
    case "blocked_by_local_follow_up":
      return "blocked";
    case "deferred_production_scope_only":
      return "deferred";
    case "ready_for_local_review":
      return step.blocking ? "blocked" : "clear";
  }
}

function rowReadinessLabel(
  verdict: ReviewHandoffCoverageMatrixReadinessVerdict,
): string {
  switch (verdict) {
    case "blocked_by_local_follow_up":
      return "Local coverage blocked";
    case "deferred_production_scope_only":
      return "Local coverage ready; production scope deferred";
    case "ready_for_local_review":
      return "Local coverage ready";
  }
}

function rowBlockerSummary(
  step: ReviewHandoffRehearsalStepView,
  blockerStatus: ReviewHandoffCoverageMatrixBlockerStatus,
): string {
  if (step.missingTargetStatus === "missing_targets") {
    return `${step.checkpointCounts.missingTargetCount} missing evidence target checks stay explicit for this row.`;
  }
  if (blockerStatus === "blocked") {
    return `Local follow-up remains blocking: ${step.expectedLocalOutcome}`;
  }
  if (blockerStatus === "deferred") {
    return "Deferred production scope stays visible but non-blocking for the local review matrix.";
  }
  return "No local blocker remains for this row.";
}

function buildCounts(rows: ReviewHandoffCoverageMatrixRowView[]) {
  return {
    totalRowCount: rows.length,
    blockingRowCount: rows.filter((row) => row.blockerStatus === "blocked").length,
    missingTargetRowCount: rows.filter(
      (row) => row.targetCoverageCounts.missingTargetCount > 0,
    ).length,
    deferredProductionRowCount: rows.filter(
      (row) => row.blockerStatus === "deferred",
    ).length,
    resolvedTargetCount: rows.reduce(
      (count, row) => count + row.targetCoverageCounts.resolvedTargetCount,
      0,
    ),
    missingTargetCount: rows.reduce(
      (count, row) => count + row.targetCoverageCounts.missingTargetCount,
      0,
    ),
    sourceEvidenceReferenceCount: unique(
      rows.flatMap((row) => row.sourceEvidenceReferences),
    ).length,
  };
}

function readinessVerdict(
  counts: ReturnType<typeof buildCounts>,
): ReviewHandoffCoverageMatrixReadinessVerdict {
  if (counts.blockingRowCount > 0 || counts.missingTargetRowCount > 0) {
    return "blocked_by_local_follow_up";
  }
  if (counts.deferredProductionRowCount > 0) {
    return "deferred_production_scope_only";
  }
  return "ready_for_local_review";
}

function readinessLabel(
  verdict: ReviewHandoffCoverageMatrixReadinessVerdict,
): string {
  switch (verdict) {
    case "blocked_by_local_follow_up":
      return "Local coverage matrix has blockers";
    case "deferred_production_scope_only":
      return "Local coverage ready; production scope deferred";
    case "ready_for_local_review":
      return "Local coverage matrix ready";
  }
}

function readinessSummary(
  verdict: ReviewHandoffCoverageMatrixReadinessVerdict,
  counts: ReturnType<typeof buildCounts>,
): string {
  switch (verdict) {
    case "blocked_by_local_follow_up":
      return `${counts.blockingRowCount} blocking rows and ${counts.missingTargetRowCount} missing-target rows stay explicit before local review closes.`;
    case "deferred_production_scope_only":
      return "Local coverage is complete; production handoff scope remains a later-stage boundary.";
    case "ready_for_local_review":
      return "Local coverage is complete with no blocking rows.";
  }
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}
