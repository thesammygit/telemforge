import type {
  ReviewObservationHandoffCoverageDeferredScopeReminderView,
  ReviewObservationHandoffCoverageRowView,
  ReviewObservationHandoffCoverageStaticGapNoteView,
  ReviewObservationHandoffCoverageView,
  ReviewObservationHandoffDeferredScopePromptView,
  ReviewObservationHandoffEvidencePromptView,
  ReviewObservationHandoffGapPromptView,
  ReviewObservationHandoffQuestionView,
  ReviewObservationHandoffQuestionsPromptGroupView,
  ReviewObservationHandoffQuestionsSourceSummaryReferenceView,
  ReviewObservationHandoffQuestionsView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffQuestions(
  sourceObservationHandoffCoverage:
    | ReviewObservationHandoffCoverageView
    | undefined,
): ReviewObservationHandoffQuestionsView | undefined {
  if (!sourceObservationHandoffCoverage?.coverageRows.length) {
    return undefined;
  }

  const staticGapNoteById = new Map(
    sourceObservationHandoffCoverage.staticGapNotes.map((note) => [
      note.gapNoteId,
      note,
    ]),
  );
  const deferredScopeReminderById = new Map(
    sourceObservationHandoffCoverage.deferredScopeReminders.map((reminder) => [
      reminder.reminderId,
      reminder,
    ]),
  );
  const promptGroups = sourceObservationHandoffCoverage.coverageRows.map(
    (row, index) => buildPromptGroup(row, index + 1),
  );
  const reviewQuestions = promptGroups.flatMap((group) =>
    buildReviewQuestions(group),
  );
  const evidencePrompts = promptGroups.map((group) =>
    buildEvidencePrompt(group),
  );
  const gapPrompts = promptGroups.flatMap((group) =>
    buildGapPrompts(group, staticGapNoteById),
  );
  const deferredScopePrompts = promptGroups.flatMap((group) =>
    buildDeferredScopePrompts(group, deferredScopeReminderById),
  );
  const defaultPromptGroup =
    promptGroups.find(
      (group) =>
        group.sourceCoverageRowId ===
        sourceObservationHandoffCoverage.summary.defaultCoverageRowId,
    ) ?? promptGroups[0];

  return {
    schema: "telemforge.review_observation_handoff_questions.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff questions and static prompt rail",
    localStatus: sourceObservationHandoffCoverage.localStatus,
    summary: {
      promptRailId: "candidate-local-review-observation-handoff-questions",
      label: "Local observation handoff questions",
      summary:
        "A static prompt rail derives manual review questions from Stage 39 coverage rows, source summaries, local anchors, gap notes, and deferred-scope reminders without saving answers or creating executable work.",
      defaultPromptGroupId: defaultPromptGroup.promptGroupId,
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
      counts: {
        promptGroupCount: promptGroups.length,
        reviewQuestionCount: reviewQuestions.length,
        evidencePromptCount: evidencePrompts.length,
        gapPromptCount: gapPrompts.length,
        deferredScopePromptCount: deferredScopePrompts.length,
        sourceCoverageRowCount:
          sourceObservationHandoffCoverage.coverageRows.length,
        sourceStaticGapNoteCount:
          sourceObservationHandoffCoverage.staticGapNotes.length,
        sourceCoverageGroupCount:
          sourceObservationHandoffCoverage.sourceCoverageGroups.length,
        sourceDeferredScopeReminderCount:
          sourceObservationHandoffCoverage.deferredScopeReminders.length,
      },
    },
    defaultPromptGroup,
    promptGroups,
    reviewQuestions,
    evidencePrompts,
    gapPrompts,
    deferredScopePrompts,
    staticPromptRailSummary:
      "Stage 40 handoff question groups, review questions, evidence prompts, gap prompts, and deferred-scope prompts are deterministic, local, static, source-backed, in-page only, explanatory, non-actionable, non-persistent, non-executable, non-ranking, and non-certifying; they do not save answers, coverage selections, deck selections, storyline selections, reviewer progress, observations, notes, filters, reports, handoff packages, owners, scores, certifications, routes, command runners, task launchers, or runnable checklists.",
    sourceObservationHandoffCoverage,
  };
}

function buildPromptGroup(
  row: ReviewObservationHandoffCoverageRowView,
  groupNumber: number,
): ReviewObservationHandoffQuestionsPromptGroupView {
  const promptGroupId = buildPromptGroupId(row.coverageRowId);
  const reviewQuestionIds = [
    buildReviewQuestionId(promptGroupId, "source-summary"),
    buildReviewQuestionId(promptGroupId, "static-boundary"),
  ];
  const evidencePromptIds = [buildEvidencePromptId(promptGroupId)];
  const gapPromptIds = row.staticGapNoteIds.map((gapNoteId) =>
    buildGapPromptId(promptGroupId, gapNoteId),
  );
  const deferredScopePromptIds = row.deferredScopeReminderIds.map((reminderId) =>
    buildDeferredScopePromptId(promptGroupId, reminderId),
  );

  return {
    promptGroupId,
    groupNumber,
    sourceCoverageRowId: row.coverageRowId,
    sourceHandoffCardId: row.sourceHandoffCardId,
    label: row.label,
    sourceSummaryReference: buildSourceSummaryReference(row),
    localAnchorHrefs: row.localAnchorHrefs,
    relatedObservationRowIds: row.relatedObservationRowIds,
    relatedCoverageRowIds: [row.coverageRowId],
    relatedGapNoteIds: row.staticGapNoteIds,
    relatedDeferredScopeIds: row.deferredScopeReminderIds,
    reviewQuestionIds,
    evidencePromptIds,
    gapPromptIds,
    deferredScopePromptIds,
    staticNonGoalContexts: row.staticNonGoalContexts,
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

function buildReviewQuestions(
  group: ReviewObservationHandoffQuestionsPromptGroupView,
): ReviewObservationHandoffQuestionView[] {
  return [
    {
      questionId: group.reviewQuestionIds[0],
      promptGroupId: group.promptGroupId,
      sourceCoverageRowId: group.sourceCoverageRowId,
      sourceHandoffCardId: group.sourceHandoffCardId,
      label: `${group.label} source-summary question`,
      question: `What should a reviewer ask about ${group.label} to confirm the source summary, ${group.localAnchorHrefs.length} local anchors, and ${group.relatedObservationRowIds.length} observation references still match the Stage 39 coverage row?`,
      sourceSummaryReference: group.sourceSummaryReference,
      localAnchorHrefs: group.localAnchorHrefs,
      relatedCoverageRowIds: group.relatedCoverageRowIds,
      relatedGapNoteIds: group.relatedGapNoteIds,
      relatedDeferredScopeIds: group.relatedDeferredScopeIds,
      ...staticPromptFlags(),
    },
    {
      questionId: group.reviewQuestionIds[1],
      promptGroupId: group.promptGroupId,
      sourceCoverageRowId: group.sourceCoverageRowId,
      sourceHandoffCardId: group.sourceHandoffCardId,
      label: `${group.label} boundary question`,
      question: `Which manual handoff question should mention ${group.relatedGapNoteIds.length} static gap notes and ${group.relatedDeferredScopeIds.length} deferred-scope reminders while avoiding saved answers, owners, scores, certification, exports, and command execution?`,
      sourceSummaryReference: group.sourceSummaryReference,
      localAnchorHrefs: group.localAnchorHrefs,
      relatedCoverageRowIds: group.relatedCoverageRowIds,
      relatedGapNoteIds: group.relatedGapNoteIds,
      relatedDeferredScopeIds: group.relatedDeferredScopeIds,
      ...staticPromptFlags(),
    },
  ];
}

function buildEvidencePrompt(
  group: ReviewObservationHandoffQuestionsPromptGroupView,
): ReviewObservationHandoffEvidencePromptView {
  return {
    promptId: group.evidencePromptIds[0],
    promptGroupId: group.promptGroupId,
    sourceCoverageRowId: group.sourceCoverageRowId,
    sourceHandoffCardId: group.sourceHandoffCardId,
    label: `${group.label} evidence prompt`,
    prompt: `Use ${group.sourceSummaryReference.coverageLabel} and the in-page anchors ${group.localAnchorHrefs.join(", ")} as manual evidence context for ${group.label}; keep the prompt explanatory and local-only.`,
    sourceSummaryReference: group.sourceSummaryReference,
    localAnchorHrefs: group.localAnchorHrefs,
    relatedCoverageRowIds: group.relatedCoverageRowIds,
    relatedGapNoteIds: group.relatedGapNoteIds,
    relatedDeferredScopeIds: group.relatedDeferredScopeIds,
    ...staticPromptFlags(),
  };
}

function buildGapPrompts(
  group: ReviewObservationHandoffQuestionsPromptGroupView,
  staticGapNoteById: Map<
    string,
    ReviewObservationHandoffCoverageStaticGapNoteView
  >,
): ReviewObservationHandoffGapPromptView[] {
  return group.relatedGapNoteIds.map((gapNoteId) => {
    const gapNote = staticGapNoteById.get(gapNoteId);

    return {
      promptId: buildGapPromptId(group.promptGroupId, gapNoteId),
      promptGroupId: group.promptGroupId,
      sourceCoverageRowId: group.sourceCoverageRowId,
      sourceHandoffCardId: group.sourceHandoffCardId,
      sourceGapNoteId: gapNoteId,
      label: gapNote?.label ?? `${group.label} static gap prompt`,
      prompt: `What static manual review question follows from ${gapNote?.summary ?? group.label} Keep the answer space outside this local rail; no saved progress, scoring, certification, owner assignment, exports, or commands are introduced.`,
      localAnchorHrefs: group.localAnchorHrefs,
      relatedCoverageRowIds: group.relatedCoverageRowIds,
      relatedGapNoteIds: [gapNoteId],
      relatedDeferredScopeIds: group.relatedDeferredScopeIds,
      ...staticPromptFlags(),
    };
  });
}

function buildDeferredScopePrompts(
  group: ReviewObservationHandoffQuestionsPromptGroupView,
  deferredScopeReminderById: Map<
    string,
    ReviewObservationHandoffCoverageDeferredScopeReminderView
  >,
): ReviewObservationHandoffDeferredScopePromptView[] {
  return group.relatedDeferredScopeIds.map((reminderId) => {
    const reminder = deferredScopeReminderById.get(reminderId);

    return {
      promptId: buildDeferredScopePromptId(group.promptGroupId, reminderId),
      promptGroupId: group.promptGroupId,
      sourceCoverageRowId: group.sourceCoverageRowId,
      sourceHandoffCardId: group.sourceHandoffCardId,
      sourceDeferredScopeId: reminderId,
      label: reminder?.label ?? `${group.label} deferred-scope prompt`,
      prompt: `Which deferred-scope boundary from ${reminder?.summary ?? group.label} should be visible beside ${group.label}, and why does it remain non-actionable local review context?`,
      localAnchorHrefs: group.localAnchorHrefs,
      relatedCoverageRowIds: group.relatedCoverageRowIds,
      relatedGapNoteIds: group.relatedGapNoteIds,
      relatedDeferredScopeIds: [reminderId],
      ...staticPromptFlags(),
    };
  });
}

function buildSourceSummaryReference(
  row: ReviewObservationHandoffCoverageRowView,
): ReviewObservationHandoffQuestionsSourceSummaryReferenceView {
  return {
    sourceSummaryId: row.sourceSummaryCoverage.sourceSummaryId,
    sourceHandoffCardId: row.sourceHandoffCardId,
    sourceCoverageRowId: row.coverageRowId,
    label: row.sourceSummaryCoverage.label,
    sourceSummary: row.sourceSummaryCoverage.sourceSummary,
    coverageLabel: row.sourceSummaryCoverage.coverageLabel,
  };
}

function staticPromptFlags() {
  return {
    explanatoryOnly: true,
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
  } as const;
}

function buildPromptGroupId(coverageRowId: string): string {
  return `review-observation-handoff-questions:${coverageRowId}`;
}

function buildReviewQuestionId(promptGroupId: string, kind: string): string {
  return `${promptGroupId}:question:${kind}`;
}

function buildEvidencePromptId(promptGroupId: string): string {
  return `${promptGroupId}:evidence`;
}

function buildGapPromptId(promptGroupId: string, gapNoteId: string): string {
  return `${promptGroupId}:gap:${gapNoteId}`;
}

function buildDeferredScopePromptId(
  promptGroupId: string,
  reminderId: string,
): string {
  return `${promptGroupId}:deferred-scope:${reminderId}`;
}
