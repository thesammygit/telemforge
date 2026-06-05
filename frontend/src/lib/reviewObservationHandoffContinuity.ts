import type {
  ReviewObservationHandoffContinuityCardView,
  ReviewObservationHandoffContinuityNextPassMapEntryView,
  ReviewObservationHandoffContinuityStaticNonGoalFlagsView,
  ReviewObservationHandoffContinuityView,
  ReviewObservationHandoffDebriefFollowUpMapEntryView,
  ReviewObservationHandoffDebriefPromptView,
  ReviewObservationHandoffDebriefView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffContinuity(
  sourceObservationHandoffDebrief: ReviewObservationHandoffDebriefView | undefined,
): ReviewObservationHandoffContinuityView | undefined {
  if (!sourceObservationHandoffDebrief?.debriefPrompts.length) {
    return undefined;
  }

  const followUpEntriesByCueId = groupFollowUpEntriesByCueId(
    sourceObservationHandoffDebrief.followUpMapEntries,
  );
  const continuityCards = sourceObservationHandoffDebrief.debriefPrompts.map(
    (prompt, index) =>
      buildContinuityCard(
        prompt,
        index + 1,
        followUpEntriesByCueId.get(prompt.sourceCueId) ?? [],
      ),
  );
  const continuityCardByCueId = new Map(
    continuityCards.map((card) => [card.sourceCueId, card]),
  );
  const nextPassMapEntries =
    sourceObservationHandoffDebrief.followUpMapEntries.map((entry, index) =>
      buildNextPassMapEntry(
        entry,
        index + 1,
        continuityCardByCueId.get(entry.sourceCueId),
      ),
    );
  const defaultContinuityCard =
    continuityCards.find(
      (card) =>
        card.sourceDebriefPromptId ===
        sourceObservationHandoffDebrief.defaultDebriefPrompt.debriefPromptId,
    ) ?? continuityCards[0];

  return {
    schema: "telemforge.review_observation_handoff_continuity.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff continuity snapshot and static next-pass map",
    localStatus: sourceObservationHandoffDebrief.localStatus,
    summary: {
      continuityId: "candidate-local-review-observation-handoff-continuity",
      label: "Local observation handoff continuity",
      summary:
        "A static continuity snapshot and next-pass map derive from the Stage 44 debrief prompts and follow-up map so reviewers can inspect how debrief context carries forward without saved notes, saved reviewer progress, saved continuity progress, owner assignment, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, or commands.",
      defaultContinuityCardId: defaultContinuityCard.continuityCardId,
      defaultDebriefPromptId:
        sourceObservationHandoffDebrief.defaultDebriefPrompt.debriefPromptId,
      defaultCueId: sourceObservationHandoffDebrief.summary.defaultCueId,
      defaultAnchorTargetId:
        sourceObservationHandoffDebrief.summary.defaultAnchorTargetId,
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        sourceObservationHandoffDebrief,
        continuityCards,
        nextPassMapEntries,
      ),
    },
    defaultContinuityCard,
    continuityCards,
    nextPassMapEntries,
    staticContinuitySummary:
      "Stage 45 continuity cards and next-pass map entries are deterministic, local, static, source-backed, in-page only, explanatory, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save debrief notes, reviewer progress, continuity progress, follow-up progress, follow-up ownership, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceObservationHandoffDebrief,
  };
}

function buildContinuityCard(
  prompt: ReviewObservationHandoffDebriefPromptView,
  cardNumber: number,
  followUpEntries: ReviewObservationHandoffDebriefFollowUpMapEntryView[],
): ReviewObservationHandoffContinuityCardView {
  return {
    continuityCardId: buildContinuityCardId(prompt.debriefPromptId),
    cardNumber,
    label: prompt.label,
    summary: `${prompt.summary} This continuity card keeps the same debrief prompt, local anchors, evidence callbacks, gap discussion points, and deferred-scope reminders visible for the next manual pass without saving notes, progress, ownership, signoff, audit state, scores, exports, meetings, packages, task launchers, runnable checklists, routes, or commands.`,
    continuityPrompt:
      `Carry forward ${prompt.label} from ${prompt.debriefPromptId}; compare ${followUpEntries.length} source follow-up map entries, ${prompt.anchorTargetIds.length} local anchors, ${prompt.evidenceCallbackIds.length} evidence callbacks, ${prompt.gapDiscussionPointIds.length} gap discussion points, and ${prompt.deferredScopeReminderIds.length} deferred-scope reminders while keeping the next pass static, local, non-persistent, non-executable, non-routing, non-ranking, and non-certifying.`,
    sourceCueId: prompt.sourceCueId,
    sourceCueIds: prompt.sourceCueIds,
    sourceDebriefPromptId: prompt.debriefPromptId,
    sourceDebriefPromptIds: [prompt.debriefPromptId],
    sourceFollowUpMapEntryIds: followUpEntries.map(
      (entry) => entry.followUpMapEntryId,
    ),
    sourcePathStepId: prompt.sourcePathStepId,
    sourcePathStepIds: prompt.sourcePathStepIds,
    sourceAgendaSectionId: prompt.sourceAgendaSectionId,
    sourceAgendaSectionIds: prompt.sourceAgendaSectionIds,
    sourcePromptGroupId: prompt.sourcePromptGroupId,
    sourcePromptGroupIds: prompt.sourcePromptGroupIds,
    sourceCoverageRowId: prompt.sourceCoverageRowId,
    sourceCoverageRowIds: prompt.sourceCoverageRowIds,
    sourceHandoffCardId: prompt.sourceHandoffCardId,
    sourceHandoffCardIds: prompt.sourceHandoffCardIds,
    sourceSummaryReference: prompt.sourceSummaryReference,
    sourceReferences: prompt.sourceReferences,
    localAnchorHrefs: prompt.localAnchorHrefs,
    anchorTargetIds: prompt.anchorTargetIds,
    evidenceCallbackIds: prompt.evidenceCallbackIds,
    gapDiscussionPointIds: prompt.gapDiscussionPointIds,
    deferredScopeReminderIds: prompt.deferredScopeReminderIds,
    staticNonGoalContexts: prompt.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticContinuityItemFlags(),
  };
}

function buildNextPassMapEntry(
  followUpEntry: ReviewObservationHandoffDebriefFollowUpMapEntryView,
  nextPassOrder: number,
  continuityCard: ReviewObservationHandoffContinuityCardView | undefined,
): ReviewObservationHandoffContinuityNextPassMapEntryView {
  const sourceDebriefPromptId =
    continuityCard?.sourceDebriefPromptId ??
    buildFallbackDebriefPromptId(followUpEntry.sourceCueId);

  return {
    nextPassMapEntryId: `review-observation-handoff-continuity:next-pass:${followUpEntry.followUpMapEntryId}`,
    nextPassOrder,
    sourceCueId: followUpEntry.sourceCueId,
    sourceCueIds: followUpEntry.sourceCueIds,
    sourceDebriefPromptId,
    sourceDebriefPromptIds: [sourceDebriefPromptId],
    sourceFollowUpMapEntryId: followUpEntry.followUpMapEntryId,
    sourceFollowUpMapEntryIds: [followUpEntry.followUpMapEntryId],
    sourceAnchorCoverageEntryId: followUpEntry.sourceAnchorCoverageEntryId,
    sourceAnchorCoverageEntryIds:
      followUpEntry.sourceAnchorCoverageEntryIds,
    sourcePathStepId: followUpEntry.sourcePathStepId,
    sourcePathStepIds: followUpEntry.sourcePathStepIds,
    sourceAnchorOrder: followUpEntry.sourceAnchorOrder,
    sourceAgendaSectionId: followUpEntry.sourceAgendaSectionId,
    sourceAgendaSectionIds: followUpEntry.sourceAgendaSectionIds,
    sourcePromptGroupId: followUpEntry.sourcePromptGroupId,
    sourcePromptGroupIds: [followUpEntry.sourcePromptGroupId],
    sourceCoverageRowId: followUpEntry.sourceCoverageRowId,
    sourceCoverageRowIds: followUpEntry.sourceCoverageRowIds,
    sourceHandoffCardId: followUpEntry.sourceHandoffCardId,
    sourceHandoffCardIds: followUpEntry.sourceHandoffCardIds,
    sourceSummaryReference: followUpEntry.sourceSummaryReference,
    localAnchorHref: followUpEntry.localAnchorHref,
    anchorTargetId: followUpEntry.anchorTargetId,
    label: `${followUpEntry.label} continuity next-pass`,
    summary:
      `Next-pass map entry ${nextPassOrder} mirrors Stage 44 follow-up order for ${followUpEntry.localAnchorHref} and ${sourceDebriefPromptId}; it is static review continuity context only, not a saved note, saved progress, owner assignment, task launcher, runnable checklist, ticket, route, report, handoff package, signoff, audit record, score, certification, meeting workflow, export, or command.`,
    evidenceCallbackIds: followUpEntry.evidenceCallbackIds,
    gapDiscussionPointIds: followUpEntry.gapDiscussionPointIds,
    deferredScopeReminderIds: followUpEntry.deferredScopeReminderIds,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticContinuityItemFlags(),
  };
}

function buildCounts(
  sourceObservationHandoffDebrief: ReviewObservationHandoffDebriefView,
  continuityCards: ReviewObservationHandoffContinuityCardView[],
  nextPassMapEntries: ReviewObservationHandoffContinuityNextPassMapEntryView[],
): ReviewObservationHandoffContinuityView["summary"]["counts"] {
  return {
    continuityCardCount: continuityCards.length,
    nextPassMapEntryCount: nextPassMapEntries.length,
    sourceDebriefPromptCount:
      sourceObservationHandoffDebrief.debriefPrompts.length,
    sourceFollowUpMapEntryCount:
      sourceObservationHandoffDebrief.followUpMapEntries.length,
    sourceCueCount: new Set(continuityCards.map((card) => card.sourceCueId))
      .size,
    sourcePathStepCount: new Set(
      continuityCards.map((card) => card.sourcePathStepId),
    ).size,
    sourceAgendaSectionCount: new Set(
      continuityCards.map((card) => card.sourceAgendaSectionId),
    ).size,
    sourcePromptGroupCount: new Set(
      continuityCards.map((card) => card.sourcePromptGroupId),
    ).size,
    sourceCoverageRowCount: new Set(
      continuityCards.map((card) => card.sourceCoverageRowId),
    ).size,
    sourceHandoffCardCount: new Set(
      continuityCards.map((card) => card.sourceHandoffCardId),
    ).size,
    localOnlyContinuityCardCount: continuityCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function groupFollowUpEntriesByCueId(
  followUpEntries: ReviewObservationHandoffDebriefFollowUpMapEntryView[],
): Map<string, ReviewObservationHandoffDebriefFollowUpMapEntryView[]> {
  const grouped = new Map<
    string,
    ReviewObservationHandoffDebriefFollowUpMapEntryView[]
  >();

  for (const entry of followUpEntries) {
    const entries = grouped.get(entry.sourceCueId) ?? [];
    entries.push(entry);
    grouped.set(entry.sourceCueId, entries);
  }

  return grouped;
}

function staticNonGoalFlags(): ReviewObservationHandoffContinuityStaticNonGoalFlagsView {
  return {
    noSavedDebriefNotes: true,
    noSavedReviewerProgress: true,
    noSavedContinuityProgress: true,
    noSavedFollowUpProgress: true,
    noSavedFollowUpOwnership: true,
    noSavedDryRunProgress: true,
    noSavedRehearsalSessions: true,
    noSavedPathProgress: true,
    noSavedAgendaProgress: true,
    noSavedQuestionAnswers: true,
    noSavedSelections: true,
    noPersistence: true,
    noRouteChanges: true,
    noCommandExecution: true,
    noExports: true,
    noSignoff: true,
    noAuditRetention: true,
    noOwnerAssignment: true,
    noScoring: true,
    noCertification: true,
    noMeetingWorkflow: true,
    noExternalTicketing: true,
    noHandoffPackageGeneration: true,
    noTaskLaunchers: true,
    noRunnableChecklists: true,
  };
}

function staticContinuityItemFlags() {
  return {
    localOnly: true,
    sourceBacked: true,
    inPageOnly: true,
    explanatoryOnly: true,
    informationalOnly: true,
    nonActionable: true,
    nonPersistent: true,
    nonExecutable: true,
    nonRouting: true,
    nonCertifying: true,
    nonRanking: true,
    notATask: true,
    notATicket: true,
    notAChecklist: true,
    notOwnerAssigned: true,
  } as const;
}

function buildContinuityCardId(debriefPromptId: string): string {
  return `review-observation-handoff-continuity:${debriefPromptId}`;
}

function buildFallbackDebriefPromptId(sourceCueId: string): string {
  return `review-observation-handoff-debrief:${sourceCueId}`;
}
