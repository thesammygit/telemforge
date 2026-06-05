import type {
  ReviewObservationHandoffAgendaDeferredScopeReminderView,
  ReviewObservationHandoffAgendaEvidenceStopView,
  ReviewObservationHandoffAgendaFacilitationPromptView,
  ReviewObservationHandoffAgendaGapDiscussionPointView,
  ReviewObservationHandoffAgendaSectionView,
  ReviewObservationHandoffAgendaView,
  ReviewObservationHandoffDeferredScopePromptView,
  ReviewObservationHandoffEvidencePromptView,
  ReviewObservationHandoffGapPromptView,
  ReviewObservationHandoffQuestionView,
  ReviewObservationHandoffQuestionsPromptGroupView,
  ReviewObservationHandoffQuestionsView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffAgenda(
  sourceObservationHandoffQuestions:
    | ReviewObservationHandoffQuestionsView
    | undefined,
): ReviewObservationHandoffAgendaView | undefined {
  if (!sourceObservationHandoffQuestions?.promptGroups.length) {
    return undefined;
  }

  const questionById = new Map(
    sourceObservationHandoffQuestions.reviewQuestions.map((question) => [
      question.questionId,
      question,
    ]),
  );
  const evidencePromptById = new Map(
    sourceObservationHandoffQuestions.evidencePrompts.map((prompt) => [
      prompt.promptId,
      prompt,
    ]),
  );
  const gapPromptById = new Map(
    sourceObservationHandoffQuestions.gapPrompts.map((prompt) => [
      prompt.promptId,
      prompt,
    ]),
  );
  const deferredScopePromptById = new Map(
    sourceObservationHandoffQuestions.deferredScopePrompts.map((prompt) => [
      prompt.promptId,
      prompt,
    ]),
  );
  const sections = sourceObservationHandoffQuestions.promptGroups.map(
    (group, index) => buildAgendaSection(group, index + 1),
  );
  const facilitationPrompts = sections.flatMap((section) =>
    buildFacilitationPrompts(section, questionById),
  );
  const evidenceStops = sections.flatMap((section) =>
    buildEvidenceStops(section, evidencePromptById),
  );
  const gapDiscussionPoints = sections.flatMap((section) =>
    buildGapDiscussionPoints(section, gapPromptById),
  );
  const deferredScopeReminders = sections.flatMap((section) =>
    buildDeferredScopeReminders(section, deferredScopePromptById),
  );
  const defaultAgendaSection =
    sections.find(
      (section) =>
        section.sourcePromptGroupId ===
        sourceObservationHandoffQuestions.defaultPromptGroup.promptGroupId,
    ) ?? sections[0];

  return {
    schema: "telemforge.review_observation_handoff_agenda.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff agenda and static facilitation guide",
    localStatus: sourceObservationHandoffQuestions.localStatus,
    summary: {
      agendaId: "candidate-local-review-observation-handoff-agenda",
      label: "Local observation handoff agenda",
      summary:
        "A static facilitation guide derives manual agenda sections from Stage 40 prompt groups, questions, evidence prompts, gap prompts, and deferred-scope prompts without storing agenda progress or creating executable workflow state.",
      defaultAgendaSectionId: defaultAgendaSection.sectionId,
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
      counts: {
        agendaSectionCount: sections.length,
        facilitationPromptCount: facilitationPrompts.length,
        evidenceStopCount: evidenceStops.length,
        gapDiscussionPointCount: gapDiscussionPoints.length,
        deferredScopeReminderCount: deferredScopeReminders.length,
        sourcePromptGroupCount:
          sourceObservationHandoffQuestions.promptGroups.length,
        sourceReviewQuestionCount:
          sourceObservationHandoffQuestions.reviewQuestions.length,
        sourceEvidencePromptCount:
          sourceObservationHandoffQuestions.evidencePrompts.length,
        sourceGapPromptCount:
          sourceObservationHandoffQuestions.gapPrompts.length,
        sourceDeferredScopePromptCount:
          sourceObservationHandoffQuestions.deferredScopePrompts.length,
      },
    },
    defaultAgendaSection,
    sections,
    facilitationPrompts,
    evidenceStops,
    gapDiscussionPoints,
    deferredScopeReminders,
    staticFacilitationGuideSummary:
      "Stage 41 handoff agenda sections, facilitation prompts, evidence stops, gap discussion points, and deferred-scope reminders are deterministic, local, static, source-backed, in-page only, explanatory, non-actionable, non-persistent, non-executable, non-ranking, and non-certifying; they do not save agendas, answers, coverage selections, deck selections, storyline selections, walkthrough selections, boundary selections, source-map selections, citation selections, reviewer progress, observations, notes, filters, reports, handoff packages, owners, scores, certifications, routes, command runners, task launchers, or runnable checklists.",
    sourceObservationHandoffQuestions,
  };
}

function buildAgendaSection(
  group: ReviewObservationHandoffQuestionsPromptGroupView,
  sectionNumber: number,
): ReviewObservationHandoffAgendaSectionView {
  const sectionId = buildAgendaSectionId(group.promptGroupId);

  return {
    sectionId,
    sectionNumber,
    sourcePromptGroupId: group.promptGroupId,
    sourcePromptGroupIds: [group.promptGroupId],
    sourceCoverageRowId: group.sourceCoverageRowId,
    sourceHandoffCardId: group.sourceHandoffCardId,
    label: group.label,
    goal: `Facilitate ${group.label} by walking the reviewer through ${group.reviewQuestionIds.length} manual questions, ${group.evidencePromptIds.length} evidence stops, ${group.gapPromptIds.length} gap discussion points, and ${group.deferredScopePromptIds.length} deferred-scope reminders in source-backed order.`,
    sourceSummaryReference: group.sourceSummaryReference,
    localAnchorHrefs: group.localAnchorHrefs,
    relatedReviewQuestionIds: group.reviewQuestionIds,
    relatedEvidencePromptIds: group.evidencePromptIds,
    relatedGapPromptIds: group.gapPromptIds,
    relatedDeferredScopePromptIds: group.deferredScopePromptIds,
    facilitationPromptIds: group.reviewQuestionIds.map((questionId) =>
      buildFacilitationPromptId(sectionId, questionId),
    ),
    evidenceStopIds: group.evidencePromptIds.map((promptId) =>
      buildEvidenceStopId(sectionId, promptId),
    ),
    gapDiscussionPointIds: group.gapPromptIds.map((promptId) =>
      buildGapDiscussionPointId(sectionId, promptId),
    ),
    deferredScopeReminderIds: group.deferredScopePromptIds.map((promptId) =>
      buildDeferredScopeReminderId(sectionId, promptId),
    ),
    staticNonGoalContexts: group.staticNonGoalContexts,
    ...staticSectionFlags(),
  };
}

function buildFacilitationPrompts(
  section: ReviewObservationHandoffAgendaSectionView,
  questionById: Map<string, ReviewObservationHandoffQuestionView>,
): ReviewObservationHandoffAgendaFacilitationPromptView[] {
  return section.relatedReviewQuestionIds.map((questionId) => {
    const question = questionById.get(questionId);

    return {
      promptId: buildFacilitationPromptId(section.sectionId, questionId),
      sectionId: section.sectionId,
      sourcePromptGroupId: section.sourcePromptGroupId,
      sourceCoverageRowId: section.sourceCoverageRowId,
      sourceHandoffCardId: section.sourceHandoffCardId,
      sourceReviewQuestionId: questionId,
      label: question?.label ?? `${section.label} facilitation prompt`,
      prompt: `${question?.question ?? section.goal} Keep the answer outside this local guide; no saved agenda progress, ownership, scoring, certification, exports, or command execution are introduced.`,
      localAnchorHrefs: section.localAnchorHrefs,
      relatedReviewQuestionIds: [questionId],
      relatedEvidencePromptIds: section.relatedEvidencePromptIds,
      relatedGapPromptIds: section.relatedGapPromptIds,
      relatedDeferredScopePromptIds: section.relatedDeferredScopePromptIds,
      ...staticGuideItemFlags(),
    };
  });
}

function buildEvidenceStops(
  section: ReviewObservationHandoffAgendaSectionView,
  evidencePromptById: Map<string, ReviewObservationHandoffEvidencePromptView>,
): ReviewObservationHandoffAgendaEvidenceStopView[] {
  return section.relatedEvidencePromptIds.map((promptId) => {
    const prompt = evidencePromptById.get(promptId);

    return {
      stopId: buildEvidenceStopId(section.sectionId, promptId),
      sectionId: section.sectionId,
      sourcePromptGroupId: section.sourcePromptGroupId,
      sourceCoverageRowId: section.sourceCoverageRowId,
      sourceHandoffCardId: section.sourceHandoffCardId,
      sourceEvidencePromptId: promptId,
      label: prompt?.label ?? `${section.label} evidence stop`,
      summary: `${prompt?.prompt ?? section.goal} The stop is a static source-backed agenda reference, not an executable checklist or export step.`,
      sourceSummaryReference: section.sourceSummaryReference,
      localAnchorHrefs: section.localAnchorHrefs,
      relatedReviewQuestionIds: section.relatedReviewQuestionIds,
      relatedEvidencePromptIds: [promptId],
      relatedGapPromptIds: section.relatedGapPromptIds,
      relatedDeferredScopePromptIds: section.relatedDeferredScopePromptIds,
      ...staticGuideItemFlags(),
    };
  });
}

function buildGapDiscussionPoints(
  section: ReviewObservationHandoffAgendaSectionView,
  gapPromptById: Map<string, ReviewObservationHandoffGapPromptView>,
): ReviewObservationHandoffAgendaGapDiscussionPointView[] {
  return section.relatedGapPromptIds.map((promptId) => {
    const prompt = gapPromptById.get(promptId);

    return {
      pointId: buildGapDiscussionPointId(section.sectionId, promptId),
      sectionId: section.sectionId,
      sourcePromptGroupId: section.sourcePromptGroupId,
      sourceCoverageRowId: section.sourceCoverageRowId,
      sourceHandoffCardId: section.sourceHandoffCardId,
      sourceGapPromptId: promptId,
      label: prompt?.label ?? `${section.label} gap discussion point`,
      discussionPoint: `${prompt?.prompt ?? section.goal} Keep the discussion explanatory and manual; do not create owners, tickets, scores, certification, saved notes, reports, or commands.`,
      localAnchorHrefs: section.localAnchorHrefs,
      relatedReviewQuestionIds: section.relatedReviewQuestionIds,
      relatedEvidencePromptIds: section.relatedEvidencePromptIds,
      relatedGapPromptIds: [promptId],
      relatedDeferredScopePromptIds: section.relatedDeferredScopePromptIds,
      ...staticGuideItemFlags(),
    };
  });
}

function buildDeferredScopeReminders(
  section: ReviewObservationHandoffAgendaSectionView,
  deferredScopePromptById: Map<
    string,
    ReviewObservationHandoffDeferredScopePromptView
  >,
): ReviewObservationHandoffAgendaDeferredScopeReminderView[] {
  return section.relatedDeferredScopePromptIds.map((promptId) => {
    const prompt = deferredScopePromptById.get(promptId);

    return {
      reminderId: buildDeferredScopeReminderId(section.sectionId, promptId),
      sectionId: section.sectionId,
      sourcePromptGroupId: section.sourcePromptGroupId,
      sourceCoverageRowId: section.sourceCoverageRowId,
      sourceHandoffCardId: section.sourceHandoffCardId,
      sourceDeferredScopePromptId: promptId,
      label: prompt?.label ?? `${section.label} deferred-scope reminder`,
      reminder: `${prompt?.prompt ?? section.goal} This remains deferred production scope, not local storage, signoff, ownership, report export, handoff packaging, scoring, certification, or command execution.`,
      localAnchorHrefs: section.localAnchorHrefs,
      relatedReviewQuestionIds: section.relatedReviewQuestionIds,
      relatedEvidencePromptIds: section.relatedEvidencePromptIds,
      relatedGapPromptIds: section.relatedGapPromptIds,
      relatedDeferredScopePromptIds: [promptId],
      ...staticGuideItemFlags(),
    };
  });
}

function staticSectionFlags() {
  return {
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
  } as const;
}

function staticGuideItemFlags() {
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

function buildAgendaSectionId(promptGroupId: string): string {
  return `review-observation-handoff-agenda:${promptGroupId}`;
}

function buildFacilitationPromptId(
  sectionId: string,
  questionId: string,
): string {
  return `${sectionId}:facilitation:${questionId}`;
}

function buildEvidenceStopId(sectionId: string, promptId: string): string {
  return `${sectionId}:evidence-stop:${promptId}`;
}

function buildGapDiscussionPointId(
  sectionId: string,
  promptId: string,
): string {
  return `${sectionId}:gap-discussion:${promptId}`;
}

function buildDeferredScopeReminderId(
  sectionId: string,
  promptId: string,
): string {
  return `${sectionId}:deferred-scope:${promptId}`;
}
