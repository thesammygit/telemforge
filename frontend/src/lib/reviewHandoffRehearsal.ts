import type {
  IncidentReviewExportPayload,
  IncidentReviewPacketView,
  ReplayPlaybackView,
  ReviewActionQueueView,
  ReviewActionWalkthroughView,
  ReviewBriefingBoardView,
  ReviewHandoffRehearsalBlockerView,
  ReviewHandoffRehearsalReadinessVerdict,
  ReviewHandoffRehearsalStepView,
  ReviewHandoffRehearsalView,
  ScenarioRunbookPlaybackView,
} from "../features/mission-console/types.ts";
import { buildReviewActionWalkthrough } from "./reviewActionWalkthrough.ts";

type RehearsalCounts = ReviewHandoffRehearsalView["readiness"]["counts"];

export function buildReviewHandoffRehearsal(
  reviewActionQueue: ReviewActionQueueView | undefined,
  reviewBriefingBoard: ReviewBriefingBoardView | undefined,
  replayPlayback: ReplayPlaybackView | undefined,
  runbook: ScenarioRunbookPlaybackView | undefined,
  incidentReviewPacket: IncidentReviewPacketView | undefined,
  incidentReviewExport: IncidentReviewExportPayload | undefined,
): ReviewHandoffRehearsalView | undefined {
  if (!reviewActionQueue || !reviewBriefingBoard) {
    return undefined;
  }

  const walkthroughs = reviewActionQueue.actions
    .map((action) =>
      buildReviewActionWalkthrough(
        reviewActionQueue,
        reviewBriefingBoard,
        replayPlayback,
        runbook,
        incidentReviewPacket,
        incidentReviewExport,
        action.actionId,
      ),
    )
    .filter((walkthrough): walkthrough is ReviewActionWalkthroughView =>
      Boolean(walkthrough),
    );
  const steps = walkthroughs.map((walkthrough, index) =>
    buildRehearsalStep(walkthrough, index),
  );

  if (!steps.length) {
    return undefined;
  }

  const counts = buildCounts(steps);
  const verdict = readinessVerdict(counts);

  return {
    schema: "telemforge.review_handoff_rehearsal.v1",
    version: 1,
    contractLabel: "local deterministic review handoff rehearsal",
    localStatus: reviewActionQueue.localStatus,
    readiness: {
      verdict,
      label: readinessLabel(verdict),
      summary: readinessSummary(verdict, counts),
      counts,
    },
    steps,
    unresolvedLocalBlockers: buildUnresolvedLocalBlockers(steps),
    deferredProductionNotes: unique(
      walkthroughs.flatMap((walkthrough) => [
        ...walkthrough.deferredProductionBoundaryNotes,
        ...reviewActionQueue.deferredScopeNotes,
      ]),
    ),
    nextLocalPrompt:
      "Run the Stage 18 local review rehearsal in order, confirm each Stage 17 evidence path, and leave saved sessions, signoff, ticketing, reports, and production handoff services deferred.",
    sourceEvidenceReferences: unique(
      steps.flatMap((step) => step.sourceEvidenceReferences),
    ),
  };
}

function buildRehearsalStep(
  walkthrough: ReviewActionWalkthroughView,
  index: number,
): ReviewHandoffRehearsalStepView {
  const action = walkthrough.selectedAction;
  const missingTargetStatus =
    walkthrough.coverage.missingTargetCount > 0
      ? "missing_targets"
      : "all_targets_resolved";

  return {
    stepId: `handoff-step-${index + 1}:${action.actionId}`,
    stepNumber: index + 1,
    actionId: action.actionId,
    actionLabel: action.label,
    actionSummary: action.summary,
    priority: action.priority,
    blockerCategory: action.blockerCategory,
    blocking: action.blocking,
    checkpointCounts: walkthrough.coverage,
    missingTargetStatus,
    missingTargets: walkthrough.missingTargetRecords,
    reviewerPrompt: buildReviewerPrompt(walkthrough),
    expectedLocalOutcome: buildExpectedLocalOutcome(walkthrough),
    nextLocalStep: walkthrough.nextLocalStep,
    sourceEvidenceReferences: unique(
      walkthrough.evidencePathRows.flatMap((row) => row.sourcePaths),
    ),
  };
}

function buildReviewerPrompt(
  walkthrough: ReviewActionWalkthroughView,
): string {
  const action = walkthrough.selectedAction;
  const targetLabel =
    walkthrough.coverage.totalTargetCount === 1 ? "target" : "targets";
  return `Review ${action.actionId}: inspect ${walkthrough.coverage.totalTargetCount} local evidence ${targetLabel}, confirm missing targets are explicit, and decide the next local-only handoff step.`;
}

function buildExpectedLocalOutcome(
  walkthrough: ReviewActionWalkthroughView,
): string {
  const action = walkthrough.selectedAction;
  if (walkthrough.coverage.missingTargetCount > 0) {
    return "Reviewer identifies unresolved local evidence targets before local handoff.";
  }
  if (action.blocking) {
    return "Reviewer confirms the local follow-up remains explicit and traceable before local handoff.";
  }
  if (action.blockerCategory === "deferred_production_scope") {
    return "Reviewer confirms the deferred production scope is visible and non-blocking for the local rehearsal.";
  }
  return "Reviewer confirms the local rehearsal step is ready for handoff review.";
}

function buildCounts(
  steps: ReviewHandoffRehearsalStepView[],
): RehearsalCounts {
  return {
    totalStepCount: steps.length,
    blockingStepCount: steps.filter((step) => step.blocking).length,
    missingTargetStepCount: steps.filter(
      (step) => step.missingTargetStatus === "missing_targets",
    ).length,
    deferredProductionStepCount: steps.filter(
      (step) => step.blockerCategory === "deferred_production_scope",
    ).length,
    resolvedCheckpointCount: steps.reduce(
      (count, step) => count + step.checkpointCounts.resolvedTargetCount,
      0,
    ),
    missingCheckpointCount: steps.reduce(
      (count, step) => count + step.checkpointCounts.missingTargetCount,
      0,
    ),
  };
}

function readinessVerdict(
  counts: RehearsalCounts,
): ReviewHandoffRehearsalReadinessVerdict {
  if (counts.blockingStepCount > 0 || counts.missingTargetStepCount > 0) {
    return "blocked_by_local_follow_up";
  }
  if (counts.deferredProductionStepCount > 0) {
    return "deferred_production_scope_only";
  }
  return "ready_for_local_handoff_rehearsal";
}

function readinessLabel(
  verdict: ReviewHandoffRehearsalReadinessVerdict,
): string {
  switch (verdict) {
    case "blocked_by_local_follow_up":
      return "Local rehearsal has blockers";
    case "deferred_production_scope_only":
      return "Local rehearsal ready; production scope deferred";
    case "ready_for_local_handoff_rehearsal":
      return "Local rehearsal ready";
  }
}

function readinessSummary(
  verdict: ReviewHandoffRehearsalReadinessVerdict,
  counts: RehearsalCounts,
): string {
  switch (verdict) {
    case "blocked_by_local_follow_up":
      return `${counts.blockingStepCount} local follow-up steps and ${counts.missingTargetStepCount} missing-target steps must stay explicit before handoff.`;
    case "deferred_production_scope_only":
      return "Local evidence paths are ready; production handoff remains a later-stage boundary.";
    case "ready_for_local_handoff_rehearsal":
      return "Local evidence paths are ready with no blocking rehearsal steps.";
  }
}

function buildUnresolvedLocalBlockers(
  steps: ReviewHandoffRehearsalStepView[],
): ReviewHandoffRehearsalBlockerView[] {
  return steps
    .filter(
      (step) =>
        step.blocking || step.missingTargetStatus === "missing_targets",
    )
    .map((step) => ({
      blockerId: `handoff-blocker:${step.actionId}`,
      actionId: step.actionId,
      label: step.actionLabel,
      reason:
        step.missingTargetStatus === "missing_targets"
          ? `${step.checkpointCounts.missingTargetCount} missing evidence target checks must be resolved or kept explicit.`
          : `Local follow-up remains blocking: ${step.expectedLocalOutcome}`,
      nextLocalStep: step.nextLocalStep,
    }));
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}
