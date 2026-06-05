import type {
  ReviewObservationHandoffDeckCardView,
  ReviewObservationHandoffDeckDefaultReviewContextView,
  ReviewObservationHandoffDeckGuardrailReminderView,
  ReviewObservationHandoffDeckPriorSurfacePromptView,
  ReviewObservationHandoffDeckReviewPathCheckpointView,
  ReviewObservationHandoffDeckSourceStagePromptView,
  ReviewObservationHandoffDeckView,
  ReviewObservationStorylinePriorSurfaceReferenceView,
  ReviewObservationStorylineSegmentView,
  ReviewObservationStorylineView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffDeck(
  sourceObservationStoryline: ReviewObservationStorylineView | undefined,
): ReviewObservationHandoffDeckView | undefined {
  if (!sourceObservationStoryline?.segments.length) {
    return undefined;
  }

  const sourceStagePrompts =
    sourceObservationStoryline.sourceStageEvidenceGroups.map((group) => ({
      promptId: buildSourceStagePromptId(group.evidenceGroupId),
      sourceStageEvidenceGroupId: group.evidenceGroupId,
      sourcePathGroupId: group.sourcePathGroupId,
      sourceStageGroupId: group.sourceStageGroupId,
      sourceMapRowId: group.sourceMapRowId,
      sourceStageNumber: group.sourceStageNumber,
      label: group.label,
      prompt: `Use ${group.label} as static source context for ${group.segmentIds.length} handoff cards while keeping ${group.sourceContractLabels.join(", ")} local and explanatory.`,
      sourceSchemas: group.sourceSchemas,
      sourceContractLabels: group.sourceContractLabels,
      segmentIds: group.segmentIds,
      relatedObservationRowIds: group.relatedObservationRowIds,
      sourceAnchorHrefs: group.sourceAnchorHrefs,
      localOnly: true,
      sourceBacked: true,
      inPageOnly: true,
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
    })) satisfies ReviewObservationHandoffDeckSourceStagePromptView[];
  const guardrailReminders =
    sourceObservationStoryline.staticGuardrailReferences.map((reference) => ({
      reminderId: buildGuardrailReminderId(reference.guardrailReferenceId),
      sourceGuardrailReferenceId: reference.guardrailReferenceId,
      sourceNonGoalNoteId: reference.sourceNonGoalNoteId,
      kind: reference.kind,
      label: reference.label,
      reminder: `${reference.summary} This remains static review context only and does not become a task, checklist, owner assignment, score, rank, or certification.`,
      sourceObservationRowIds: reference.sourceObservationRowIds,
      sourceAnchorIds: reference.sourceAnchorIds,
      segmentIds: reference.segmentIds,
      localOnly: true,
      staticReviewContext: true,
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
      notATask: true,
      notATicket: true,
      notAChecklist: true,
      notOwnerAssigned: true,
    })) satisfies ReviewObservationHandoffDeckGuardrailReminderView[];
  const priorSurfacePrompts =
    sourceObservationStoryline.segments.flatMap((segment) =>
      segment.priorSurfaceReferences.map((reference) =>
        buildPriorSurfacePrompt(segment.segmentId, reference),
      ),
    );
  const sourceStagePromptIdByGroupId = new Map(
    sourceStagePrompts.map((prompt) => [
      prompt.sourceStageEvidenceGroupId,
      prompt.promptId,
    ]),
  );
  const guardrailReminderIdByReferenceId = new Map(
    guardrailReminders.map((reminder) => [
      reminder.sourceGuardrailReferenceId,
      reminder.reminderId,
    ]),
  );
  const priorSurfacePromptIdByReferenceId = new Map(
    priorSurfacePrompts.map((prompt) => [
      prompt.sourcePriorSurfaceReferenceId,
      prompt.promptId,
    ]),
  );
  const cards = sourceObservationStoryline.segments.map((segment, index) =>
    buildHandoffCard(
      segment,
      index + 1,
      sourceStagePromptIdByGroupId,
      guardrailReminderIdByReferenceId,
      priorSurfacePromptIdByReferenceId,
    ),
  );
  const reviewPathCheckpoints = cards.map((card) =>
    buildReviewPathCheckpoint(card),
  );
  const defaultCard = cards[0];

  return {
    schema: "telemforge.review_observation_handoff_deck.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff deck and static review path",
    localStatus: sourceObservationStoryline.localStatus,
    summary: {
      deckId: "candidate-local-review-observation-handoff-deck",
      label: "Local observation handoff deck",
      summary:
        "A static handoff deck turns each Stage 37 storyline segment into source-backed reviewer cards, checkpoints, source-stage prompts, guardrail reminders, and prior-surface prompts without saving review state.",
      defaultHandoffCardId: defaultCard.cardId,
      defaultReviewContextId:
        "candidate-local-review-observation-handoff-deck-default",
      defaultSourceStagePromptId: defaultCard.sourceStagePromptIds[0] ?? "",
      defaultGuardrailReminderId: defaultCard.guardrailReminderIds[0] ?? "",
      defaultPriorSurfacePromptId: defaultCard.priorSurfacePromptIds[0] ?? "",
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
      counts: {
        handoffCardCount: cards.length,
        reviewPathCheckpointCount: reviewPathCheckpoints.length,
        sourceStagePromptCount: sourceStagePrompts.length,
        guardrailReminderCount: guardrailReminders.length,
        priorSurfacePromptCount: priorSurfacePrompts.length,
        sourceStorylineSegmentCount:
          sourceObservationStoryline.segments.length,
        sourceStageEvidenceGroupCount:
          sourceObservationStoryline.sourceStageEvidenceGroups.length,
      },
    },
    defaultReviewContext: buildDefaultReviewContext(
      sourceObservationStoryline,
      defaultCard,
    ),
    cards,
    reviewPathCheckpoints,
    sourceStagePrompts,
    guardrailReminders,
    priorSurfacePrompts,
    staticHandoffSummary:
      "Stage 38 observation handoff deck cards, checkpoints, prompts, and reminders are local, static, source-backed, in-page only, non-actionable, non-persistent, non-executable, non-ranking, and non-certifying; they do not save deck selections, storyline selections, reviewer progress, observations, notes, filters, anchors, reports, handoff packages, owners, scores, certifications, routes, command runners, task launchers, or runnable checklists.",
    sourceObservationStoryline,
  };
}

function buildHandoffCard(
  segment: ReviewObservationStorylineSegmentView,
  cardNumber: number,
  sourceStagePromptIdByGroupId: Map<string, string>,
  guardrailReminderIdByReferenceId: Map<string, string>,
  priorSurfacePromptIdByReferenceId: Map<string, string>,
): ReviewObservationHandoffDeckCardView {
  const cardId = buildCardId(segment.segmentId);

  return {
    cardId,
    cardNumber,
    sourceSegmentId: segment.segmentId,
    sourceStepId: segment.sourceStepId,
    sourceBoundaryRowId: segment.sourceBoundaryRowId,
    sourceBoundaryCitationId: segment.sourceBoundaryCitationId,
    sourceSummaryId: segment.sourceSummaryId,
    label: segment.label,
    sourceSummary: segment.sourceSummary,
    localAnchorIds: segment.sourceAnchorIds,
    localAnchorHrefs: segment.sourceAnchorHrefs,
    relatedObservationRowIds: segment.relatedObservationRowIds,
    relatedCitationRowIds: segment.relatedCitationRowIds,
    relatedSourceStageNumbers: segment.relatedSourceStageNumbers,
    sourceStageEvidenceGroupIds: segment.sourceStageEvidenceGroupIds,
    sourceStagePromptIds: segment.sourceStageEvidenceGroupIds
      .map((groupId) => sourceStagePromptIdByGroupId.get(groupId))
      .filter((promptId): promptId is string => Boolean(promptId)),
    guardrailReminderIds: segment.staticGuardrailReferenceIds
      .map((referenceId) => guardrailReminderIdByReferenceId.get(referenceId))
      .filter((reminderId): reminderId is string => Boolean(reminderId)),
    priorSurfacePromptIds: segment.priorSurfaceReferences
      .map((reference) =>
        priorSurfacePromptIdByReferenceId.get(reference.referenceId),
      )
      .filter((promptId): promptId is string => Boolean(promptId)),
    staticNonGoalContexts: segment.staticNonGoalContexts,
    localOnly: true,
    sourceBacked: true,
    inPageOnly: true,
    informationalOnly: true,
    nonActionable: true,
    nonPersistent: true,
    nonExecutable: true,
    nonCertifying: true,
    nonRanking: true,
    notATask: true,
    notATicket: true,
    notAChecklist: true,
    notOwnerAssigned: true,
  };
}

function buildReviewPathCheckpoint(
  card: ReviewObservationHandoffDeckCardView,
): ReviewObservationHandoffDeckReviewPathCheckpointView {
  return {
    checkpointId: `review-observation-handoff-deck-checkpoint:${card.cardId}`,
    cardId: card.cardId,
    sourceSegmentId: card.sourceSegmentId,
    label: card.label,
    summary: `Review ${card.label} through its source summary, local anchors, source-stage prompts, guardrail reminders, and prior surfaces without saving progress or executing commands.`,
    localAnchorHrefs: card.localAnchorHrefs,
    relatedObservationRowIds: card.relatedObservationRowIds,
    sourceStagePromptIds: card.sourceStagePromptIds,
    guardrailReminderIds: card.guardrailReminderIds,
    priorSurfacePromptIds: card.priorSurfacePromptIds,
    manualReviewOnly: true,
    localOnly: true,
    inPageOnly: true,
    informationalOnly: true,
    nonActionable: true,
    nonPersistent: true,
    nonExecutable: true,
    nonCertifying: true,
    nonRanking: true,
    notATask: true,
    notATicket: true,
    notAChecklist: true,
    notOwnerAssigned: true,
  };
}

function buildPriorSurfacePrompt(
  sourceSegmentId: string,
  reference: ReviewObservationStorylinePriorSurfaceReferenceView,
): ReviewObservationHandoffDeckPriorSurfacePromptView {
  return {
    promptId: buildPriorSurfacePromptId(reference.referenceId),
    sourcePriorSurfaceReferenceId: reference.referenceId,
    sourceSegmentId,
    sourceStageNumber: reference.sourceStageNumber,
    surfaceId: reference.surfaceId,
    label: reference.label,
    anchorHref: reference.anchorHref,
    sourceIds: reference.sourceIds,
    prompt: `Use ${reference.label} as static in-page context for the handoff card; do not create routes, saved selections, command execution, scores, ranks, or certification.`,
    localOnly: true,
    inPageOnly: true,
    informationalOnly: true,
    nonActionable: true,
    nonPersistent: true,
    nonExecutable: true,
    nonCertifying: true,
    nonRanking: true,
  };
}

function buildDefaultReviewContext(
  sourceObservationStoryline: ReviewObservationStorylineView,
  defaultCard: ReviewObservationHandoffDeckCardView,
): ReviewObservationHandoffDeckDefaultReviewContextView {
  const opening = sourceObservationStoryline.defaultOpening;

  return {
    defaultReviewContextId:
      "candidate-local-review-observation-handoff-deck-default",
    label: opening.label,
    summary:
      "Default review context uses the Stage 37 default opening as the first static handoff card.",
    defaultHandoffCardId: defaultCard.cardId,
    sourceOpeningSegmentId: opening.defaultOpeningSegmentId,
    sourceStepId: opening.sourceStepId,
    sourceBoundaryRowId: opening.sourceBoundaryRowId,
    sourceSummaryId: opening.sourceSummaryId,
    localAnchorHrefs: opening.sourceAnchorHrefs,
    relatedObservationRowIds: opening.relatedObservationRowIds,
    relatedSourceStageNumbers: opening.relatedSourceStageNumbers,
    localOnly: true,
    informationalOnly: true,
    nonActionable: true,
    nonPersistent: true,
    nonExecutable: true,
    nonCertifying: true,
    nonRanking: true,
  };
}

function buildCardId(segmentId: string): string {
  return segmentId.replace(
    "review-observation-storyline:",
    "review-observation-handoff-deck:",
  );
}

function buildSourceStagePromptId(evidenceGroupId: string): string {
  return `review-observation-handoff-deck-source-stage-prompt:${evidenceGroupId}`;
}

function buildGuardrailReminderId(guardrailReferenceId: string): string {
  return `review-observation-handoff-deck-guardrail-reminder:${guardrailReferenceId}`;
}

function buildPriorSurfacePromptId(referenceId: string): string {
  return `review-observation-handoff-deck-prior-surface-prompt:${referenceId}`;
}
