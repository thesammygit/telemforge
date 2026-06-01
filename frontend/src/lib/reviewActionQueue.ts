import type {
  ReviewActionBlockerCategory,
  ReviewActionPriority,
  ReviewActionQueueActionView,
  ReviewActionQueueReadinessVerdict,
  ReviewActionQueueView,
  ReviewBriefingBoardEvidenceRowView,
  ReviewBriefingBoardFollowUpActionView,
  ReviewBriefingBoardView,
} from "../features/mission-console/types.ts";

export function buildReviewActionQueue(
  reviewBriefingBoard: ReviewBriefingBoardView | undefined,
): ReviewActionQueueView | undefined {
  if (!reviewBriefingBoard) {
    return undefined;
  }

  const followUpActions = reviewBriefingBoard.followUpActions.map(
    (action, index) =>
      buildFollowUpQueueAction(
        action,
        evidenceRowsForAction(reviewBriefingBoard.evidenceDrilldownRows, action),
        index,
      ),
  );
  const fallbackGapAction = buildFallbackEvidenceGapAction(
    reviewBriefingBoard,
    followUpActions.length,
  );
  const deferredProductionAction =
    buildDeferredProductionScopeAction(reviewBriefingBoard);
  const actions = [
    ...followUpActions,
    ...(fallbackGapAction ? [fallbackGapAction] : []),
    ...(deferredProductionAction ? [deferredProductionAction] : []),
  ];
  const blockingActionCount = actions.filter((action) => action.blocking).length;
  const deferredProductionActionCount = actions.filter(
    (action) => action.blockerCategory === "deferred_production_scope",
  ).length;
  const verdict = readinessVerdict(
    blockingActionCount,
    deferredProductionActionCount,
  );

  return {
    schema: "telemforge.review_action_queue.v1",
    version: 1,
    contractLabel: "local deterministic review action queue",
    localStatus: reviewBriefingBoard.localStatus,
    readiness: {
      verdict,
      label: readinessLabel(verdict),
      summary: readinessSummary(verdict, blockingActionCount),
      counts: {
        totalActionCount: actions.length,
        blockingActionCount,
        deferredProductionActionCount,
      },
    },
    actions,
    deferredScopeNotes: selectDeferredScopeNotes(reviewBriefingBoard),
    humanTestGateSummary:
      "Inspect the Stage 15 briefing board, scan the Stage 16 queue, follow each evidence target, and confirm deferred production scope stays outside local handoff.",
  };
}

function buildFollowUpQueueAction(
  action: ReviewBriefingBoardFollowUpActionView,
  evidenceRows: ReviewBriefingBoardEvidenceRowView[],
  index: number,
): ReviewActionQueueActionView {
  const evidenceTargets = unique([
    ...action.evidenceTargets,
    ...evidenceRows.map((row) => row.target),
  ]);

  return {
    actionId: `action:${action.actionId}`,
    label: action.label,
    summary: action.summary,
    priority: priorityForCategory("local_follow_up", index),
    blockerCategory: "local_follow_up",
    blocking: true,
    decisionIds: action.decisionIds,
    evidenceTargets,
    nextLocalStep: `Review ${formatTargets(evidenceTargets)} and resolve this item before local handoff.`,
    readinessImpact: "Blocks local handoff until the linked evidence is reviewed.",
  };
}

function buildFallbackEvidenceGapAction(
  reviewBriefingBoard: ReviewBriefingBoardView,
  existingFollowUpCount: number,
): ReviewActionQueueActionView | null {
  if (
    reviewBriefingBoard.readinessStatus !== "needs_follow_up" ||
    existingFollowUpCount > 0
  ) {
    return null;
  }

  const followUpRows = reviewBriefingBoard.evidenceDrilldownRows.filter(
    (row) => row.decisionStatus === "follow_up",
  );
  const evidenceTargets = withDefaultTarget(
    unique(followUpRows.map((row) => row.target)),
    "review-briefing-board",
  );

  return {
    actionId: "action:local-evidence-gap",
    label: "Review local evidence gaps",
    summary:
      "The briefing board is not ready for handoff but did not expose a follow-up action.",
    priority: priorityForCategory("local_evidence_gap", 0),
    blockerCategory: "local_evidence_gap",
    blocking: true,
    decisionIds: unique(followUpRows.map((row) => row.decisionId)),
    evidenceTargets,
    nextLocalStep:
      "Inspect the follow-up evidence rows and add a bounded local action before handoff.",
    readinessImpact: "Blocks local handoff until the missing local evidence path is explicit.",
  };
}

function buildDeferredProductionScopeAction(
  reviewBriefingBoard: ReviewBriefingBoardView,
): ReviewActionQueueActionView | null {
  const deferredRows = reviewBriefingBoard.evidenceDrilldownRows.filter(
    (row) => row.decisionStatus === "deferred" || row.source === "scope_boundary",
  );
  const deferredScopeNotes = selectDeferredScopeNotes(reviewBriefingBoard);

  if (!deferredRows.length && !deferredScopeNotes.length) {
    return null;
  }
  const evidenceTargets = withDefaultTarget(
    unique(deferredRows.map((row) => row.target)),
    "review-decision-register",
  );

  return {
    actionId: "action:deferred-production-handoff-scope",
    label: "Keep production handoff scope deferred",
    summary:
      deferredScopeNotes[0] ??
      "Production handoff scope remains explicitly deferred outside Stage 16.",
    priority: priorityForCategory("deferred_production_scope", 0),
    blockerCategory: "deferred_production_scope",
    blocking: false,
    decisionIds: unique(deferredRows.map((row) => row.decisionId)),
    evidenceTargets,
    nextLocalStep:
      "Confirm deferred production scope remains outside the local action queue before later-stage planning.",
    readinessImpact:
      "Does not block local handoff; it marks production workflow as later-stage scope.",
  };
}

function evidenceRowsForAction(
  rows: ReviewBriefingBoardEvidenceRowView[],
  action: ReviewBriefingBoardFollowUpActionView,
): ReviewBriefingBoardEvidenceRowView[] {
  return rows.filter((row) => action.decisionIds.includes(row.decisionId));
}

function selectDeferredScopeNotes(
  reviewBriefingBoard: ReviewBriefingBoardView,
): string[] {
  const notes = reviewBriefingBoard.localOnlyScopeNotes.filter((note) => {
    const lower = note.toLowerCase();
    return (
      lower.includes("production") ||
      lower.includes("external") ||
      lower.includes("saved") ||
      lower.includes("persistent") ||
      lower.includes("ticket") ||
      lower.includes("cloud") ||
      lower.includes("handoff")
    );
  });

  return notes.length
    ? unique(notes)
    : ["Production handoff scope remains deferred outside the local action queue."];
}

function priorityForCategory(
  category: ReviewActionBlockerCategory,
  index: number,
): ReviewActionPriority {
  if (category === "deferred_production_scope") {
    return "p2";
  }
  if (category === "local_evidence_gap") {
    return "p1";
  }
  return index === 0 ? "p0" : "p1";
}

function readinessVerdict(
  blockingActionCount: number,
  deferredProductionActionCount: number,
): ReviewActionQueueReadinessVerdict {
  if (blockingActionCount > 0) {
    return "blocked_by_local_follow_up";
  }
  if (deferredProductionActionCount > 0) {
    return "deferred_production_scope_only";
  }
  return "ready_for_local_handoff";
}

function readinessLabel(verdict: ReviewActionQueueReadinessVerdict): string {
  switch (verdict) {
    case "blocked_by_local_follow_up":
      return "Local handoff blocked";
    case "deferred_production_scope_only":
      return "Local evidence ready; production scope deferred";
    case "ready_for_local_handoff":
      return "Local handoff ready";
  }
}

function readinessSummary(
  verdict: ReviewActionQueueReadinessVerdict,
  blockingActionCount: number,
): string {
  switch (verdict) {
    case "blocked_by_local_follow_up":
      return `${blockingActionCount} local follow-up actions must be reviewed before local handoff.`;
    case "deferred_production_scope_only":
      return "Local evidence is ready; production handoff scope remains a later-stage boundary.";
    case "ready_for_local_handoff":
      return "Local evidence is ready with no blocking review actions.";
  }
}

function formatTargets(targets: string[]): string {
  if (!targets.length) {
    return "the linked evidence";
  }
  if (targets.length === 1) {
    return targets[0];
  }
  return `${targets.slice(0, -1).join(", ")} and ${targets.at(-1)}`;
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

function withDefaultTarget(values: string[], fallback: string): string[] {
  return values.length ? values : [fallback];
}
