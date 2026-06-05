import type {
  ReviewObservationHandoffCoverageDeferredScopeReminderView,
  ReviewObservationHandoffCoverageRowView,
  ReviewObservationHandoffCoverageSourceCoverageGroupView,
  ReviewObservationHandoffCoverageStaticGapNoteView,
  ReviewObservationHandoffCoverageView,
  ReviewObservationHandoffDeckCardView,
  ReviewObservationHandoffDeckView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffCoverage(
  sourceObservationHandoffDeck: ReviewObservationHandoffDeckView | undefined,
): ReviewObservationHandoffCoverageView | undefined {
  if (!sourceObservationHandoffDeck?.cards.length) {
    return undefined;
  }

  const coverageRows = sourceObservationHandoffDeck.cards.map((card, index) =>
    buildCoverageRow(card, index + 1),
  );
  const coverageRowsByCardId = new Map(
    coverageRows.map((row) => [row.sourceHandoffCardId, row]),
  );
  const staticGapNotes = sourceObservationHandoffDeck.cards.map((card) =>
    buildStaticGapNote(card, coverageRowsByCardId.get(card.cardId)),
  );
  const sourceCoverageGroups =
    sourceObservationHandoffDeck.sourceStagePrompts.map((prompt) => ({
      sourceCoverageGroupId: buildSourceCoverageGroupId(prompt.promptId),
      sourceStagePromptId: prompt.promptId,
      sourceStageNumber: prompt.sourceStageNumber,
      label: prompt.label,
      summary: `Source Stage ${prompt.sourceStageNumber} coverage is represented by ${prompt.segmentIds.length} local handoff cards and remains static in-page review context.`,
      sourceAnchorHrefs: prompt.sourceAnchorHrefs,
      coverageRowIds: sourceObservationHandoffDeck.cards
        .filter((card) => card.sourceStagePromptIds.includes(prompt.promptId))
        .map((card) => buildCoverageRowId(card.cardId)),
      relatedObservationRowIds: prompt.relatedObservationRowIds,
      sourceSchemas: prompt.sourceSchemas,
      sourceContractLabels: prompt.sourceContractLabels,
      localOnly: true,
      sourceBacked: true,
      inPageOnly: true,
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
    })) satisfies ReviewObservationHandoffCoverageSourceCoverageGroupView[];
  const deferredScopeReminders = buildDeferredScopeReminders(
    sourceObservationHandoffDeck.cards,
    coverageRows,
  );
  const defaultCoverageRow =
    coverageRowsByCardId.get(
      sourceObservationHandoffDeck.summary.defaultHandoffCardId,
    ) ?? coverageRows[0];
  const defaultStaticGapNote =
    staticGapNotes.find(
      (note) => note.coverageRowId === defaultCoverageRow.coverageRowId,
    ) ?? staticGapNotes[0];
  const defaultSourceCoverageGroup =
    sourceCoverageGroups.find((group) =>
      defaultCoverageRow.sourceStagePromptIds.includes(group.sourceStagePromptId),
    ) ?? sourceCoverageGroups[0];
  const defaultDeferredScopeReminder =
    deferredScopeReminders.find((reminder) =>
      defaultCoverageRow.deferredScopeReminderIds.includes(reminder.reminderId),
    ) ?? deferredScopeReminders[0];

  return {
    schema: "telemforge.review_observation_handoff_coverage.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff coverage and static gap map",
    localStatus: sourceObservationHandoffDeck.localStatus,
    summary: {
      coverageId: "candidate-local-review-observation-handoff-coverage",
      label: "Local observation handoff coverage",
      summary:
        "A static coverage map checks each Stage 38 handoff card for source summaries, local anchors, source-stage prompts, guardrail reminders, prior-surface prompts, gap notes, and deferred-scope reminders without storing reviewer state.",
      defaultCoverageRowId: defaultCoverageRow.coverageRowId,
      defaultStaticGapNoteId: defaultStaticGapNote?.gapNoteId ?? "",
      defaultSourceCoverageGroupId:
        defaultSourceCoverageGroup?.sourceCoverageGroupId ?? "",
      defaultDeferredScopeReminderId:
        defaultDeferredScopeReminder?.reminderId ?? "",
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
      counts: {
        coverageRowCount: coverageRows.length,
        staticGapNoteCount: staticGapNotes.length,
        sourceCoverageGroupCount: sourceCoverageGroups.length,
        deferredScopeReminderCount: deferredScopeReminders.length,
        sourceHandoffCardCount:
          sourceObservationHandoffDeck.summary.counts.handoffCardCount,
        sourceStagePromptCount:
          sourceObservationHandoffDeck.summary.counts.sourceStagePromptCount,
        guardrailReminderCount:
          sourceObservationHandoffDeck.summary.counts.guardrailReminderCount,
        priorSurfacePromptCount:
          sourceObservationHandoffDeck.summary.counts.priorSurfacePromptCount,
      },
    },
    defaultCoverageRow,
    coverageRows,
    staticGapNotes,
    sourceCoverageGroups,
    deferredScopeReminders,
    staticCoverageSummary:
      "Stage 39 handoff coverage rows, gap notes, source groups, and deferred-scope reminders are deterministic, local, static, source-backed, in-page only, non-actionable, non-persistent, non-executable, non-ranking, and non-certifying; they do not save coverage selections, deck selections, storyline selections, reviewer progress, observations, notes, filters, anchors, reports, handoff packages, owners, scores, certifications, routes, command runners, task launchers, or runnable checklists.",
    sourceObservationHandoffDeck,
  };
}

function buildCoverageRow(
  card: ReviewObservationHandoffDeckCardView,
  rowNumber: number,
): ReviewObservationHandoffCoverageRowView {
  const coverageRowId = buildCoverageRowId(card.cardId);

  return {
    coverageRowId,
    rowNumber,
    sourceHandoffCardId: card.cardId,
    sourceSegmentId: card.sourceSegmentId,
    label: card.label,
    sourceSummaryCoverage: {
      sourceSummaryId: card.sourceSummaryId,
      sourceHandoffCardId: card.cardId,
      label: card.label,
      sourceSummary: card.sourceSummary,
      coverageLabel: "Source summary present on the local handoff card",
      coveredByLocalCard: true,
      localOnly: true,
      sourceBacked: true,
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
    },
    localAnchorHrefs: card.localAnchorHrefs,
    relatedObservationRowIds: card.relatedObservationRowIds,
    sourceStagePromptIds: card.sourceStagePromptIds,
    guardrailReminderIds: card.guardrailReminderIds,
    priorSurfacePromptIds: card.priorSurfacePromptIds,
    staticGapNoteIds: [buildStaticGapNoteId(card.cardId)],
    deferredScopeReminderIds: card.staticNonGoalContexts.map((context) =>
      buildDeferredScopeReminderId(context.nonGoalNoteId),
    ),
    staticNonGoalContexts: card.staticNonGoalContexts,
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

function buildStaticGapNote(
  card: ReviewObservationHandoffDeckCardView,
  coverageRow: ReviewObservationHandoffCoverageRowView | undefined,
): ReviewObservationHandoffCoverageStaticGapNoteView {
  return {
    gapNoteId: buildStaticGapNoteId(card.cardId),
    coverageRowId: coverageRow?.coverageRowId ?? buildCoverageRowId(card.cardId),
    sourceHandoffCardId: card.cardId,
    label: `${card.label} static gap note`,
    summary: `The local card exposes ${card.localAnchorHrefs.length} anchors, ${card.relatedObservationRowIds.length} observations, ${card.sourceStagePromptIds.length} source-stage prompts, ${card.guardrailReminderIds.length} guardrail reminders, and ${card.priorSurfacePromptIds.length} prior-surface prompts; production handoff packages, saved progress, scoring, certification, ownership, and command execution remain deferred.`,
    localAnchorHrefs: card.localAnchorHrefs,
    relatedObservationRowIds: card.relatedObservationRowIds,
    sourceStagePromptIds: card.sourceStagePromptIds,
    guardrailReminderIds: card.guardrailReminderIds,
    priorSurfacePromptIds: card.priorSurfacePromptIds,
    explanatoryOnly: true,
    notAReadinessScore: true,
    notACertification: true,
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

function buildDeferredScopeReminders(
  cards: ReviewObservationHandoffDeckCardView[],
  coverageRows: ReviewObservationHandoffCoverageRowView[],
): ReviewObservationHandoffCoverageDeferredScopeReminderView[] {
  const remindersByNoteId = new Map<
    string,
    ReviewObservationHandoffCoverageDeferredScopeReminderView
  >();

  cards.forEach((card) => {
    const coverageRow = coverageRows.find(
      (row) => row.sourceHandoffCardId === card.cardId,
    );

    card.staticNonGoalContexts.forEach((context) => {
      const reminderId = buildDeferredScopeReminderId(context.nonGoalNoteId);
      const existing = remindersByNoteId.get(context.nonGoalNoteId);

      if (existing) {
        existing.coverageRowIds.push(coverageRow?.coverageRowId ?? "");
        existing.sourceHandoffCardIds.push(card.cardId);
        existing.relatedObservationRowIds = unique([
          ...existing.relatedObservationRowIds,
          ...card.relatedObservationRowIds,
        ]);
        existing.localAnchorHrefs = unique([
          ...existing.localAnchorHrefs,
          ...card.localAnchorHrefs,
        ]);
        return;
      }

      remindersByNoteId.set(context.nonGoalNoteId, {
        reminderId,
        sourceNonGoalNoteId: context.nonGoalNoteId,
        kind: context.kind,
        label: context.label,
        summary: `${context.summary} This reminder is static deferred-scope context only and does not create saved progress, ownership, scoring, certification, reports, handoff packages, or command execution.`,
        coverageRowIds: coverageRow ? [coverageRow.coverageRowId] : [],
        sourceHandoffCardIds: [card.cardId],
        relatedObservationRowIds: card.relatedObservationRowIds,
        localAnchorHrefs: card.localAnchorHrefs,
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
      });
    });
  });

  return Array.from(remindersByNoteId.values()).map((reminder) => ({
    ...reminder,
    coverageRowIds: reminder.coverageRowIds.filter(Boolean),
    sourceHandoffCardIds: unique(reminder.sourceHandoffCardIds),
    relatedObservationRowIds: unique(reminder.relatedObservationRowIds),
    localAnchorHrefs: unique(reminder.localAnchorHrefs),
  }));
}

function buildCoverageRowId(cardId: string): string {
  return `review-observation-handoff-coverage:${cardId}`;
}

function buildStaticGapNoteId(cardId: string): string {
  return `review-observation-handoff-coverage-gap:${cardId}`;
}

function buildSourceCoverageGroupId(sourceStagePromptId: string): string {
  return `review-observation-handoff-coverage-source:${sourceStagePromptId}`;
}

function buildDeferredScopeReminderId(nonGoalNoteId: string): string {
  return `review-observation-handoff-coverage-deferred-scope:${nonGoalNoteId}`;
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}
