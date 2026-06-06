import type {
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefRowView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefSummaryView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathStepView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief(
  sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath:
    | ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathView
    | undefined,
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefView | undefined {
  if (
    !sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath
      ?.reviewPathSteps.length
  ) {
    return undefined;
  }

  const readinessBriefRows =
    sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath.reviewPathSteps.map(
      (reviewPathStep) =>
        buildReadinessBriefRow(
          reviewPathStep,
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath.staticHandoffPromptCards,
        ),
    );
  const staticReviewerCueCards =
    sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath.staticHandoffPromptCards.map(
      (handoffPromptCard) =>
        buildStaticReviewerCueCard(
          handoffPromptCard,
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath.reviewPathSteps,
        ),
    );
  const defaultReadinessBriefRow =
    readinessBriefRows.find(
      (row) =>
        row.sourceReadinessResponseTraceCoverageReviewPathStepId ===
        sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath
          .summary.defaultCoverageReviewPathContext.defaultReviewPathStepId,
    ) ?? readinessBriefRows[0];
  const defaultStaticReviewerCueCard =
    staticReviewerCueCards.find(
      (card) =>
        card.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId ===
        sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath
          .summary.defaultCoverageReviewPathContext
          .defaultStaticHandoffPromptCardId,
    ) ?? staticReviewerCueCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_source_readiness_response_trace_coverage_readiness_brief.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff source readiness response trace coverage readiness brief and static reviewer cues",
    localStatus:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath.localStatus,
    summary: {
      sourceReadinessResponseTraceCoverageReadinessBriefId:
        "candidate-local-review-observation-handoff-source-readiness-response-trace-coverage-readiness-brief",
      label:
        "Local observation handoff source readiness response trace coverage readiness brief",
      summary:
        "A static coverage readiness brief derives from Stage 60 review path steps and static handoff prompt cards so reviewers can inspect readiness order, source anchors, evidence callbacks, gap discussion prompts, deferred-scope reminders, coverage notes, gap notes, handoff prompts, and static reviewer cues before human review without saved reviewer answers, saved trace coverage progress, saved coverage review progress, saved readiness brief state, saved reviewer cues, saved gap notes, saved handoff prompt edits, saved response progress, saved source readiness progress, saved source inspection state, saved anchor state, saved relay progress, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, owner assignment, or commands.",
      defaultReadinessBriefContext: {
        defaultReadinessBriefRowId:
          defaultReadinessBriefRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        defaultReviewPathStepId:
          defaultReadinessBriefRow.sourceReadinessResponseTraceCoverageReviewPathStepId,
        defaultCoverageRowId:
          defaultReadinessBriefRow.sourceReadinessResponseTraceCoverageRowId,
        defaultTraceRowId:
          defaultReadinessBriefRow.sourceReadinessResponseTraceRowId,
        defaultResponseTraceRowId:
          defaultReadinessBriefRow.sourceReadinessResponseTraceRowId,
        defaultStaticReviewerCueCardId:
          defaultStaticReviewerCueCard
            .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
        defaultStaticHandoffPromptCardId:
          defaultStaticReviewerCueCard
            .sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
        defaultGapNoteCardId:
          defaultStaticReviewerCueCard
            .sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
        sourceReadinessResponseTraceCoverageReviewPathSummary:
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath
            .summary.summary,
        sourceReadinessResponseTraceCoverageReviewPathDefaultContext:
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath
            .summary.defaultCoverageReviewPathContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        readinessBriefRows,
        staticReviewerCueCards,
        sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath,
      ),
    },
    defaultReadinessBriefRow,
    defaultStaticReviewerCueCard,
    readinessBriefRows,
    staticReviewerCueCards,
    staticSourceReadinessResponseTraceCoverageReadinessBriefSummary:
      "Stage 61 coverage readiness brief rows and static reviewer cue cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, trace coverage progress, coverage review progress, readiness brief state, reviewer cues, gap notes, handoff prompt edits, response progress, source readiness progress, source inspection state, anchor state, relay progress, review sessions, reviewer progress, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath,
  };
}

function buildReadinessBriefRow(
  reviewPathStep: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathStepView,
  staticHandoffPromptCards: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardView[],
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefRowView {
  const matchedStaticHandoffPromptCards = staticHandoffPromptCards.filter(
    (card) =>
      card.matchedCoverageRowIds.includes(
        reviewPathStep.sourceReadinessResponseTraceCoverageRowId,
      ) ||
      reviewPathStep.matchedStaticGapNoteCardIds.includes(
        card.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
      ),
  );

  return {
    sourceReadinessResponseTraceCoverageReadinessBriefRowId: `review-observation-handoff-source-readiness-response-trace-coverage-readiness-brief:${reviewPathStep.sourceReadinessResponseTraceCoverageReviewPathStepId}`,
    readinessBriefOrder: reviewPathStep.reviewPathOrder,
    label: `${reviewPathStep.label} readiness brief`,
    summary:
      `Readiness brief row ${reviewPathStep.reviewPathOrder} preserves Stage 60 review path order for ${reviewPathStep.sourceReadinessResponseTraceCoverageReviewPathStepId}, coverage row ${reviewPathStep.sourceReadinessResponseTraceCoverageRowId}, trace row ${reviewPathStep.sourceReadinessResponseTraceRowId}, walkthrough step ${reviewPathStep.sourceReadinessResponseWalkthroughStepId}, response row ${reviewPathStep.sourceReadinessResponseRowId}, question row ${reviewPathStep.sourceReadinessQuestionRowId}, ${matchedStaticHandoffPromptCards.length} static handoff prompts, ${reviewPathStep.matchedSourceAlignmentNoteCardIds.length} source alignment notes, ${reviewPathStep.matchedStaticEvidenceNoteRowIds.length} evidence notes, ${reviewPathStep.matchedStaticFollowUpPromptRowIds.length} follow-up prompts, ${reviewPathStep.sourceAnchorTargetIds.length} anchors, ${reviewPathStep.evidenceCallbackIds.length} callbacks, ${reviewPathStep.gapDiscussionPointIds.length} gap prompts, and ${reviewPathStep.deferredScopeReminderIds.length} deferred reminders without saved readiness brief state, saved reviewer cues, saved coverage review progress, saved trace coverage progress, saved gap notes, saved handoff prompt edits, saved reviewer answers, routes, exports, signoff, audit state, scores, certification, owner assignment, meetings, packages, task launchers, runnable checklists, or commands.`,
    sourceReadinessResponseTraceCoverageReviewPathStepId:
      reviewPathStep.sourceReadinessResponseTraceCoverageReviewPathStepId,
    sourceReadinessResponseTraceCoverageReviewPathStepIds: [
      reviewPathStep.sourceReadinessResponseTraceCoverageReviewPathStepId,
    ],
    sourceReadinessResponseTraceCoverageRowId:
      reviewPathStep.sourceReadinessResponseTraceCoverageRowId,
    sourceReadinessResponseTraceCoverageRowIds:
      reviewPathStep.sourceReadinessResponseTraceCoverageRowIds,
    sourceReadinessResponseTraceRowId:
      reviewPathStep.sourceReadinessResponseTraceRowId,
    sourceReadinessResponseTraceRowIds:
      reviewPathStep.sourceReadinessResponseTraceRowIds,
    sourceReadinessResponseWalkthroughStepId:
      reviewPathStep.sourceReadinessResponseWalkthroughStepId,
    sourceReadinessResponseWalkthroughStepIds:
      reviewPathStep.sourceReadinessResponseWalkthroughStepIds,
    sourceReadinessResponseRowId:
      reviewPathStep.sourceReadinessResponseRowId,
    sourceReadinessResponseRowIds:
      reviewPathStep.sourceReadinessResponseRowIds,
    sourceReadinessQuestionRowId:
      reviewPathStep.sourceReadinessQuestionRowId,
    sourceReadinessQuestionRowIds:
      reviewPathStep.sourceReadinessQuestionRowIds,
    matchedSourceAlignmentNoteCardIds:
      reviewPathStep.matchedSourceAlignmentNoteCardIds,
    matchedStaticGapNoteCardIds: reviewPathStep.matchedStaticGapNoteCardIds,
    matchedStaticEvidenceNoteRowIds:
      reviewPathStep.matchedStaticEvidenceNoteRowIds,
    matchedStaticFollowUpPromptRowIds:
      reviewPathStep.matchedStaticFollowUpPromptRowIds,
    matchedStaticHandoffPromptCardIds: matchedStaticHandoffPromptCards.map(
      (card) =>
        card.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
    ),
    sourceLocalAnchorHrefs: reviewPathStep.sourceLocalAnchorHrefs,
    sourceAnchorTargetIds: reviewPathStep.sourceAnchorTargetIds,
    evidenceCallbackIds: reviewPathStep.evidenceCallbackIds,
    gapDiscussionPointIds: reviewPathStep.gapDiscussionPointIds,
    deferredScopeReminderIds: reviewPathStep.deferredScopeReminderIds,
    responseNoteCue: reviewPathStep.responseNoteCue,
    reviewerCueText: reviewPathStep.reviewerCueText,
    coverageNoteText: reviewPathStep.coverageNoteText,
    gapNoteText: reviewPathStep.gapNoteText,
    handoffPromptText: matchedStaticHandoffPromptCards
      .map((card) => card.handoffPromptText)
      .join(" ") || reviewPathStep.staticHandoffPromptText,
    readinessBriefText:
      `Readiness brief for ${reviewPathStep.sourceReadinessResponseTraceCoverageReviewPathStepId}: inspect review path step ${reviewPathStep.sourceReadinessResponseTraceCoverageReviewPathStepId}, coverage row ${reviewPathStep.sourceReadinessResponseTraceCoverageRowId}, static handoff prompts ${matchedStaticHandoffPromptCards.map((card) => card.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId).join(", ") || "none"}, anchors ${reviewPathStep.sourceAnchorTargetIds.join(", ")}, callbacks ${reviewPathStep.evidenceCallbackIds.join(", ")}, gap prompts ${reviewPathStep.gapDiscussionPointIds.join(", ")}, and deferred reminders ${reviewPathStep.deferredScopeReminderIds.join(", ")} as a static readiness brief only.`,
    staticNonGoalContexts: reviewPathStep.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(reviewPathStep.staticNonGoalFlags),
    ...staticResponseTraceCoverageReadinessBriefItemFlags(),
  };
}

function buildStaticReviewerCueCard(
  handoffPromptCard: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardView,
  reviewPathSteps: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathStepView[],
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardView {
  const matchedReviewPathSteps = reviewPathSteps.filter(
    (step) =>
      handoffPromptCard.matchedCoverageRowIds.includes(
        step.sourceReadinessResponseTraceCoverageRowId,
      ) ||
      step.matchedStaticGapNoteCardIds.includes(
        handoffPromptCard.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
      ),
  );

  return {
    sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId: `review-observation-handoff-source-readiness-response-trace-coverage-readiness-brief:reviewer-cue:${handoffPromptCard.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId}`,
    reviewerCueOrder: handoffPromptCard.handoffPromptOrder,
    sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId:
      handoffPromptCard.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
    sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardIds: [
      handoffPromptCard.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
    ],
    sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId:
      handoffPromptCard.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
    sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardIds:
      handoffPromptCard.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardIds,
    matchedReviewPathStepIds: matchedReviewPathSteps.map(
      (step) => step.sourceReadinessResponseTraceCoverageReviewPathStepId,
    ),
    matchedCoverageRowIds: handoffPromptCard.matchedCoverageRowIds,
    matchedResponseTraceRowIds: handoffPromptCard.matchedResponseTraceRowIds,
    matchedResponseRowIds: handoffPromptCard.matchedResponseRowIds,
    matchedQuestionRowIds: handoffPromptCard.matchedQuestionRowIds,
    matchedStaticEvidenceNoteRowIds:
      handoffPromptCard.matchedStaticEvidenceNoteRowIds,
    matchedStaticFollowUpPromptRowIds:
      handoffPromptCard.matchedStaticFollowUpPromptRowIds,
    sourceLocalAnchorHrefs: handoffPromptCard.sourceLocalAnchorHrefs,
    sourceAnchorTargetIds: handoffPromptCard.sourceAnchorTargetIds,
    localAnchorHref: handoffPromptCard.localAnchorHref,
    anchorTargetId: handoffPromptCard.anchorTargetId,
    evidenceCallbackIds: handoffPromptCard.evidenceCallbackIds,
    gapDiscussionPointIds: handoffPromptCard.gapDiscussionPointIds,
    deferredScopeReminderIds: handoffPromptCard.deferredScopeReminderIds,
    label: `${handoffPromptCard.label} reviewer cue`,
    summary:
      `Static reviewer cue ${handoffPromptCard.handoffPromptOrder} preserves Stage 60 static handoff prompt order for ${handoffPromptCard.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId} and matched review path steps ${matchedReviewPathSteps.map((step) => step.sourceReadinessResponseTraceCoverageReviewPathStepId).join(", ") || "none"} while remaining local, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying.`,
    cueText: handoffPromptCard.cueText,
    gapNoteText: handoffPromptCard.gapNoteText,
    handoffPromptText: handoffPromptCard.handoffPromptText,
    readinessBriefText:
      `Reviewer cue ${handoffPromptCard.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId}: brief matched review path steps ${matchedReviewPathSteps.map((step) => step.sourceReadinessResponseTraceCoverageReviewPathStepId).join(", ") || "none"}, coverage rows ${handoffPromptCard.matchedCoverageRowIds.join(", ") || "none"}, anchors ${handoffPromptCard.sourceAnchorTargetIds.join(", ")}, callbacks ${handoffPromptCard.evidenceCallbackIds.join(", ")}, gap prompts ${handoffPromptCard.gapDiscussionPointIds.join(", ")}, and deferred reminders ${handoffPromptCard.deferredScopeReminderIds.join(", ")} as a static reviewer cue only.`,
    staticNonGoalFlags: staticNonGoalFlags(
      handoffPromptCard.staticNonGoalFlags,
    ),
    ...staticResponseTraceCoverageReadinessBriefItemFlags(),
  };
}

function buildCounts(
  readinessBriefRows: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefRowView[],
  staticReviewerCueCards: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardView[],
  sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathView,
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefSummaryView["counts"] {
  return {
    readinessBriefRowCount: readinessBriefRows.length,
    staticReviewerCueCardCount: staticReviewerCueCards.length,
    reviewPathStepCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath
        .reviewPathSteps.length,
    staticHandoffPromptCardCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath
        .staticHandoffPromptCards.length,
    coverageRowCount: new Set(
      readinessBriefRows.flatMap((row) =>
        row.sourceReadinessResponseTraceCoverageRowIds,
      ),
    ).size,
    responseTraceRowCount: new Set(
      readinessBriefRows.flatMap((row) =>
        row.sourceReadinessResponseTraceRowIds,
      ),
    ).size,
    responseWalkthroughStepCount: new Set(
      readinessBriefRows.flatMap((row) =>
        row.sourceReadinessResponseWalkthroughStepIds,
      ),
    ).size,
    responseRowCount: new Set(
      readinessBriefRows.flatMap((row) => row.sourceReadinessResponseRowIds),
    ).size,
    questionRowCount: new Set(
      readinessBriefRows.flatMap((row) => row.sourceReadinessQuestionRowIds),
    ).size,
    sourceAlignmentNoteCardCount: new Set(
      readinessBriefRows.flatMap((row) =>
        row.matchedSourceAlignmentNoteCardIds,
      ),
    ).size,
    staticEvidenceNoteCount: new Set(
      readinessBriefRows.flatMap((row) => row.matchedStaticEvidenceNoteRowIds),
    ).size,
    staticFollowUpPromptCount: new Set(
      readinessBriefRows.flatMap((row) =>
        row.matchedStaticFollowUpPromptRowIds,
      ),
    ).size,
    staticHandoffPromptCount: new Set(
      readinessBriefRows.flatMap((row) =>
        row.matchedStaticHandoffPromptCardIds,
      ),
    ).size,
    sourceAnchorCount: new Set(
      readinessBriefRows.flatMap((row) => row.sourceAnchorTargetIds),
    ).size,
    evidenceCallbackCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath.reviewPathSteps.reduce(
        (count, step) => count + step.evidenceCallbackIds.length,
        0,
      ),
    gapDiscussionPointCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath.reviewPathSteps.reduce(
        (count, step) => count + step.gapDiscussionPointIds.length,
        0,
      ),
    deferredScopeReminderCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath.reviewPathSteps.reduce(
        (count, step) => count + step.deferredScopeReminderIds.length,
        0,
      ),
    localOnlyReadinessBriefRowCount: readinessBriefRows.filter(
      (row) => row.localOnly,
    ).length,
    localOnlyStaticReviewerCueCardCount: staticReviewerCueCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function staticNonGoalFlags(
  sourceFlags: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathStaticNonGoalFlagsView,
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedSourceReadinessResponseTraceCoverageReadinessBriefState: true,
    noSavedReadinessBriefState: true,
    noSavedReviewerCues: true,
  };
}

function staticResponseTraceCoverageReadinessBriefItemFlags() {
  return {
    localOnly: true,
    sourceBacked: true,
    inPageOnly: true,
    explanatoryOnly: true,
    staticOnly: true,
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
