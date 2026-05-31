import type {
  ReviewBriefingBoardDecisionView,
  ReviewBriefingBoardEvidenceRowView,
  ReviewBriefingBoardFollowUpActionView,
  ReviewBriefingBoardGroupView,
  ReviewBriefingBoardView,
  ReviewDecisionEvidenceRef,
  ReviewDecisionRegisterView,
  ReviewDecisionStatus,
  ReviewDecisionView,
} from "../features/mission-console/types.ts";

const decisionStatusOrder: ReviewDecisionStatus[] = [
  "ready",
  "follow_up",
  "deferred",
];

const groupLabelByStatus: Record<ReviewDecisionStatus, string> = {
  ready: "Ready decisions",
  follow_up: "Follow-up decisions",
  deferred: "Deferred decisions",
};

export function buildReviewBriefingBoard(
  reviewDecisionRegister: ReviewDecisionRegisterView | undefined,
): ReviewBriefingBoardView | undefined {
  if (!reviewDecisionRegister) {
    return undefined;
  }

  const groupedDecisionSummaries = decisionStatusOrder.map((status) =>
    buildDecisionGroup(reviewDecisionRegister.decisions, status),
  );
  const evidenceDrilldownRows = buildEvidenceDrilldownRows(
    reviewDecisionRegister.decisions,
  );
  const followUpActions = buildFollowUpActions(reviewDecisionRegister.decisions);

  return {
    schema: "telemforge.review_briefing_board.v1",
    version: 1,
    contractLabel: "local deterministic review briefing board",
    localStatus: reviewDecisionRegister.localStatus,
    readinessStatus:
      reviewDecisionRegister.summary.followUpCount === 0
        ? "ready_for_handoff"
        : "needs_follow_up",
    summary: {
      totalDecisionCount: reviewDecisionRegister.summary.totalDecisionCount,
      readyCount: reviewDecisionRegister.summary.readyCount,
      followUpCount: reviewDecisionRegister.summary.followUpCount,
      deferredCount: reviewDecisionRegister.summary.deferredCount,
      groupCount: groupedDecisionSummaries.length,
      evidenceRowCount: evidenceDrilldownRows.length,
      followUpActionCount: followUpActions.length,
    },
    groupedDecisionSummaries,
    evidenceDrilldownRows,
    followUpActions,
    localOnlyScopeNotes: [
      ...reviewDecisionRegister.scopeNotes,
      "The briefing board is a local review surface derived from the Stage 14 decision register.",
      "Evidence rows stay tied to local playback, packet, export, and scope-boundary references.",
    ],
  };
}

function buildDecisionGroup(
  decisions: ReviewDecisionView[],
  status: ReviewDecisionStatus,
): ReviewBriefingBoardGroupView {
  const groupDecisions = decisions
    .filter((decision) => decision.status === status)
    .map((decision): ReviewBriefingBoardDecisionView => ({
      decisionId: decision.decisionId,
      status: decision.status,
      label: decision.label,
      summary: decision.summary,
      relatedPlaybackFrameId: decision.relatedPlaybackFrameId,
      followUpReason: decision.followUpReason,
    }));

  return {
    status,
    label: groupLabelByStatus[status],
    summary: groupSummary(status, groupDecisions.length),
    decisionCount: groupDecisions.length,
    decisions: groupDecisions,
  };
}

function buildEvidenceDrilldownRows(
  decisions: ReviewDecisionView[],
): ReviewBriefingBoardEvidenceRowView[] {
  const rows: ReviewBriefingBoardEvidenceRowView[] = [];

  decisions.forEach((decision) => {
    decision.supportingEvidence.forEach((evidence, index) => {
      rows.push({
        rowId: `${decision.decisionId}:${index + 1}`,
        decisionId: decision.decisionId,
        decisionLabel: decision.label,
        decisionStatus: decision.status,
        evidenceLabel: evidence.label,
        target: evidence.target,
        source: evidence.source,
        frameId: evidence.frameId,
        markerId: evidence.markerId,
        path: evidence.path,
        reviewNote: reviewNoteForEvidence(decision, evidence),
      });
    });
  });

  return rows;
}

function buildFollowUpActions(
  decisions: ReviewDecisionView[],
): ReviewBriefingBoardFollowUpActionView[] {
  return decisions
    .filter((decision) => decision.status === "follow_up")
    .map((decision) => ({
      actionId: `follow-up:${decision.decisionId}`,
      label: decision.label,
      summary:
        decision.followUpReason ??
        "Complete the local evidence review before human handoff.",
      decisionIds: [decision.decisionId],
      evidenceTargets: unique(decision.supportingEvidence.map((evidence) => evidence.target)),
    }));
}

function groupSummary(status: ReviewDecisionStatus, decisionCount: number): string {
  const suffix = decisionCount === 1 ? "decision" : "decisions";
  switch (status) {
    case "ready":
      return `${decisionCount} ready ${suffix} can support a local handoff review.`;
    case "follow_up":
      return `${decisionCount} follow-up ${suffix} still need local evidence review.`;
    case "deferred":
      return `${decisionCount} deferred ${suffix} keep production handoff scope out of Stage 15.`;
  }
}

function reviewNoteForEvidence(
  decision: ReviewDecisionView,
  evidence: ReviewDecisionEvidenceRef,
): string {
  if (evidence.source === "scope_boundary") {
    return decision.followUpReason
      ? `${decision.followUpReason} This evidence row marks the explicit local-only scope boundary.`
      : "This evidence row marks the explicit local-only scope boundary.";
  }

  if (decision.status === "follow_up") {
    return decision.followUpReason ??
      "This evidence row supports the local follow-up review path.";
  }

  if (decision.status === "deferred") {
    return "This evidence row keeps production integrations intentionally deferred.";
  }

  return "This evidence row supports the ready local handoff path.";
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}
