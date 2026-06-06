import type {
  ReviewObservationHandoffFollowUpReadinessRehearsalPathStaticAnswerPrepPromptCardView,
  ReviewObservationHandoffFollowUpReadinessRehearsalPathStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessRehearsalPathStepView,
  ReviewObservationHandoffFollowUpReadinessRehearsalPathSummaryView,
  ReviewObservationHandoffFollowUpReadinessRehearsalPathView,
  ReviewObservationHandoffFollowUpReadinessReviewBoardRowView,
  ReviewObservationHandoffFollowUpReadinessReviewBoardStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessReviewBoardStaticQuestionPromptCardView,
  ReviewObservationHandoffFollowUpReadinessReviewBoardView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffFollowUpReadinessRehearsalPath(
  sourceReviewObservationHandoffFollowUpReadinessReviewBoard:
    | ReviewObservationHandoffFollowUpReadinessReviewBoardView
    | undefined,
): ReviewObservationHandoffFollowUpReadinessRehearsalPathView | undefined {
  if (!sourceReviewObservationHandoffFollowUpReadinessReviewBoard?.reviewBoardRows.length) {
    return undefined;
  }

  const rehearsalPathSteps =
    sourceReviewObservationHandoffFollowUpReadinessReviewBoard.reviewBoardRows.map(
      (reviewBoardRow) =>
        buildRehearsalPathStep(
          reviewBoardRow,
          sourceReviewObservationHandoffFollowUpReadinessReviewBoard
            .staticQuestionPromptCards,
        ),
    );
  const staticAnswerPrepPromptCards =
    sourceReviewObservationHandoffFollowUpReadinessReviewBoard.staticQuestionPromptCards.map(
      (staticQuestionPromptCard) =>
        buildStaticAnswerPrepPromptCard(staticQuestionPromptCard, rehearsalPathSteps),
    );
  const defaultRehearsalPathStep =
    rehearsalPathSteps.find(
      (step) =>
        step.sourceReviewBoardRowId ===
        sourceReviewObservationHandoffFollowUpReadinessReviewBoard.summary
          .defaultReviewBoardContext.defaultReviewBoardRowId,
    ) ?? rehearsalPathSteps[0];
  const defaultStaticAnswerPrepPromptCard =
    staticAnswerPrepPromptCards.find(
      (card) =>
        card.sourceStaticQuestionPromptCardId ===
        sourceReviewObservationHandoffFollowUpReadinessReviewBoard.summary
          .defaultReviewBoardContext.defaultStaticQuestionPromptCardId,
    ) ?? staticAnswerPrepPromptCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_follow_up_readiness_rehearsal_path.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff follow-up readiness rehearsal path and static answer-prep prompts",
    localStatus:
      sourceReviewObservationHandoffFollowUpReadinessReviewBoard.localStatus,
    summary: {
      followUpReadinessRehearsalPathId:
        "candidate-local-review-observation-handoff-follow-up-readiness-rehearsal-path",
      label:
        "Local observation handoff follow-up readiness rehearsal path",
      summary:
        "A static readiness rehearsal path derives from Stage 66 review board rows and static question prompt cards so reviewers can step through board rows, static question prompts, Stage 65 brief references, Stage 64 triage references, source anchors, evidence callbacks, gap prompts, deferred reminders, follow-up notes, and manual static answer-prep prompts before human review without saved reviewer answers, saved answer drafts, saved rehearsal state, saved review board state, saved question prompt state, saved readiness brief state, saved prompt state, saved notes, saved gap notes, saved handoff prompt edits, saved source readiness progress, owner assignment, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, persistence, or production handoff semantics.",
      defaultRehearsalContext: {
        defaultRehearsalPathStepId:
          defaultRehearsalPathStep.followUpReadinessRehearsalPathStepId,
        defaultReviewBoardRowId:
          defaultRehearsalPathStep.sourceReviewBoardRowId,
        defaultFollowUpReadinessBriefRowId:
          defaultRehearsalPathStep.followUpReadinessBriefRowId,
        defaultFollowUpTriageRowId:
          defaultRehearsalPathStep
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        defaultSynthesisRowId:
          defaultRehearsalPathStep
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
        defaultReviewLaneRowId:
          defaultRehearsalPathStep
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        defaultReadinessBriefRowId:
          defaultRehearsalPathStep
            .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        defaultReviewPathStepId:
          defaultRehearsalPathStep.sourceReadinessResponseTraceCoverageReviewPathStepId,
        defaultCoverageRowId:
          defaultRehearsalPathStep.sourceReadinessResponseTraceCoverageRowId,
        defaultTraceRowId:
          defaultRehearsalPathStep.sourceReadinessResponseTraceRowId,
        defaultStaticAnswerPrepPromptCardId:
          defaultStaticAnswerPrepPromptCard
            .followUpReadinessRehearsalPathStaticAnswerPrepPromptCardId,
        defaultStaticQuestionPromptCardId:
          defaultStaticAnswerPrepPromptCard.sourceStaticQuestionPromptCardId,
        defaultStaticReviewerPromptCardId:
          defaultStaticAnswerPrepPromptCard
            .followUpReadinessBriefStaticReviewerPromptCardId,
        defaultStaticCheckPromptCardId:
          defaultStaticAnswerPrepPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
        defaultStaticFollowUpNoteCardId:
          defaultStaticAnswerPrepPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
        defaultStaticHumanCheckPromptCardId:
          defaultStaticAnswerPrepPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
        defaultStaticReviewerCueCardId:
          defaultStaticAnswerPrepPromptCard
            .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
        defaultStaticHandoffPromptCardId:
          defaultStaticAnswerPrepPromptCard
            .sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
        sourceFollowUpReadinessReviewBoardSummary:
          sourceReviewObservationHandoffFollowUpReadinessReviewBoard.summary.summary,
        sourceReviewBoardDefaultContext:
          sourceReviewObservationHandoffFollowUpReadinessReviewBoard.summary
            .defaultReviewBoardContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        rehearsalPathSteps,
        staticAnswerPrepPromptCards,
        sourceReviewObservationHandoffFollowUpReadinessReviewBoard,
      ),
    },
    defaultRehearsalPathStep,
    defaultStaticAnswerPrepPromptCard,
    rehearsalPathSteps,
    staticAnswerPrepPromptCards,
    staticSourceFollowUpReadinessRehearsalPathSummary:
      "Stage 67 readiness rehearsal path steps and static answer-prep prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, rehearsal state, rehearsal steps, static answer-prep prompts, review board state, board rows, static question prompts, readiness brief state, brief rows, static reviewer prompts, triage state, prompt state, notes, gap notes, handoff prompt edits, source readiness progress, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffFollowUpReadinessReviewBoard,
  };
}

function buildRehearsalPathStep(
  reviewBoardRow: ReviewObservationHandoffFollowUpReadinessReviewBoardRowView,
  staticQuestionPromptCards: ReviewObservationHandoffFollowUpReadinessReviewBoardStaticQuestionPromptCardView[],
): ReviewObservationHandoffFollowUpReadinessRehearsalPathStepView {
  const matchedStaticQuestionPromptCardIds = staticQuestionPromptCards
    .filter((card) => staticQuestionPromptCardMatchesReviewBoardRow(card, reviewBoardRow))
    .map((card) => card.followUpReadinessReviewBoardStaticQuestionPromptCardId);

  return {
    ...reviewBoardRow,
    followUpReadinessRehearsalPathStepId:
      `review-observation-handoff-follow-up-readiness-rehearsal-path:${reviewBoardRow.followUpReadinessReviewBoardRowId}`,
    followUpReadinessRehearsalPathStepOrder:
      reviewBoardRow.followUpReadinessReviewBoardRowOrder,
    sourceReviewBoardRowId: reviewBoardRow.followUpReadinessReviewBoardRowId,
    sourceReviewBoardRowIds: [reviewBoardRow.followUpReadinessReviewBoardRowId],
    matchedStaticQuestionPromptCardIds,
    summary:
      `Readiness rehearsal path step ${reviewBoardRow.followUpReadinessReviewBoardRowOrder} preserves Stage 66 review board order for ${reviewBoardRow.followUpReadinessReviewBoardRowId}, Stage 65 brief row ${reviewBoardRow.followUpReadinessBriefRowId}, Stage 64 follow-up triage row ${reviewBoardRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, synthesis row ${reviewBoardRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId}, review-lane row ${reviewBoardRow.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId}, readiness brief row ${reviewBoardRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId}, review path step ${reviewBoardRow.sourceReadinessResponseTraceCoverageReviewPathStepId}, coverage row ${reviewBoardRow.sourceReadinessResponseTraceCoverageRowId}, trace row ${reviewBoardRow.sourceReadinessResponseTraceRowId}, walkthrough step ${reviewBoardRow.sourceReadinessResponseWalkthroughStepId}, response row ${reviewBoardRow.sourceReadinessResponseRowId}, question row ${reviewBoardRow.sourceReadinessQuestionRowId}, static reviewer prompts ${reviewBoardRow.matchedStaticReviewerPromptCardIds.join(", ") || "none"}, static question prompts ${matchedStaticQuestionPromptCardIds.join(", ") || "none"}, anchors ${reviewBoardRow.sourceLocalAnchorHrefs.join(", ")}, callbacks ${reviewBoardRow.evidenceCallbackIds.join(", ")}, gap prompts ${reviewBoardRow.gapDiscussionPointIds.join(", ")}, and deferred reminders ${reviewBoardRow.deferredScopeReminderIds.join(", ")} without saved reviewer answers, saved answer drafts, saved rehearsal state, saved review board state, saved question prompt state, routes, exports, signoff, scoring, certification, owner assignment, meetings, handoff packages, task launchers, runnable checklists, or commands.`,
    staticAnswerPrepPromptText:
      `Manual static answer-prep prompt for ${reviewBoardRow.followUpReadinessReviewBoardRowId}: rehearse the Stage 66 static question context "${reviewBoardRow.staticQuestionPromptText}" alongside review-lane text "${reviewBoardRow.reviewLaneText}", follow-up note "${reviewBoardRow.followUpNoteText}", coverage note "${reviewBoardRow.coverageNoteText}", gap note "${reviewBoardRow.gapNoteText}", handoff prompt "${reviewBoardRow.handoffPromptText}", and source anchors ${reviewBoardRow.sourceLocalAnchorHrefs.join(", ")} as local manual-review context only.`,
    staticNonGoalContext:
      "Static non-goal context: manual static answer prep only; no saved reviewer answers, saved answer drafts, saved rehearsal state, saved review board state, saved question prompt state, persistence, routing, scoring, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(reviewBoardRow.staticNonGoalFlags),
  };
}

function buildStaticAnswerPrepPromptCard(
  staticQuestionPromptCard: ReviewObservationHandoffFollowUpReadinessReviewBoardStaticQuestionPromptCardView,
  rehearsalPathSteps: ReviewObservationHandoffFollowUpReadinessRehearsalPathStepView[],
): ReviewObservationHandoffFollowUpReadinessRehearsalPathStaticAnswerPrepPromptCardView {
  const sourceStaticQuestionPromptCardId =
    staticQuestionPromptCard.followUpReadinessReviewBoardStaticQuestionPromptCardId;
  const followUpReadinessRehearsalPathStaticAnswerPrepPromptCardId =
    `review-observation-handoff-follow-up-readiness-rehearsal-path:static-answer-prep:${sourceStaticQuestionPromptCardId}`;
  const matchedRehearsalPathSteps = rehearsalPathSteps.filter((step) =>
    staticQuestionPromptCardMatchesRehearsalPathStep(staticQuestionPromptCard, step),
  );

  return {
    ...staticQuestionPromptCard,
    followUpReadinessRehearsalPathStaticAnswerPrepPromptCardId,
    followUpReadinessRehearsalPathStaticAnswerPrepPromptCardIds: [
      followUpReadinessRehearsalPathStaticAnswerPrepPromptCardId,
    ],
    sourceStaticQuestionPromptCardId,
    sourceStaticQuestionPromptCardIds: [sourceStaticQuestionPromptCardId],
    staticAnswerPrepPromptOrder:
      staticQuestionPromptCard.staticQuestionPromptOrder,
    matchedRehearsalPathStepIds: matchedRehearsalPathSteps.map(
      (step) => step.followUpReadinessRehearsalPathStepId,
    ),
    summary:
      `Static answer-prep prompt card ${followUpReadinessRehearsalPathStaticAnswerPrepPromptCardId} preserves Stage 66 static question prompt order for ${sourceStaticQuestionPromptCardId} and matched rehearsal path steps ${matchedRehearsalPathSteps.map((step) => step.followUpReadinessRehearsalPathStepId).join(", ") || "none"} without saved reviewer answers, saved answer drafts, saved prompt state, persistence, routing, owner assignment, signoff, scoring, certification, meeting workflow, exports, handoff packages, runnable checklists, task launchers, or commands.`,
    staticAnswerPrepPromptText:
      `Manual static answer-prep prompt card ${followUpReadinessRehearsalPathStaticAnswerPrepPromptCardId}: prepare a spoken answer for source Stage 66 static question prompt ${sourceStaticQuestionPromptCardId} using "${staticQuestionPromptCard.staticQuestionPromptText}", review-lane text "${staticQuestionPromptCard.reviewLaneText}", follow-up note "${staticQuestionPromptCard.followUpNoteText}", static reviewer prompt "${staticQuestionPromptCard.staticReviewerPromptText}", anchors ${staticQuestionPromptCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticQuestionPromptCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticQuestionPromptCard.gapDiscussionPointIds.join(", ")}, and deferred reminders ${staticQuestionPromptCard.deferredScopeReminderIds.join(", ")} as static manual-review prep only.`,
    staticNonGoalContext:
      "Static answer-prep prompt context: static answer-prep prompt is explanatory local manual-review context only; no saved reviewer answers, saved answer drafts, saved rehearsal state, saved review board state, saved question prompt state, persistence, routing, scoring, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(staticQuestionPromptCard.staticNonGoalFlags),
  };
}

function buildCounts(
  rehearsalPathSteps: ReviewObservationHandoffFollowUpReadinessRehearsalPathStepView[],
  staticAnswerPrepPromptCards: ReviewObservationHandoffFollowUpReadinessRehearsalPathStaticAnswerPrepPromptCardView[],
  sourceReviewObservationHandoffFollowUpReadinessReviewBoard: ReviewObservationHandoffFollowUpReadinessReviewBoardView,
): ReviewObservationHandoffFollowUpReadinessRehearsalPathSummaryView["counts"] {
  const sourceCounts =
    sourceReviewObservationHandoffFollowUpReadinessReviewBoard.summary.counts;

  return {
    rehearsalPathStepCount: rehearsalPathSteps.length,
    staticAnswerPrepPromptCardCount: staticAnswerPrepPromptCards.length,
    reviewBoardRowCount: sourceCounts.reviewBoardRowCount,
    staticQuestionPromptCardCount: sourceCounts.staticQuestionPromptCardCount,
    followUpReadinessBriefRowCount: sourceCounts.followUpReadinessBriefRowCount,
    staticReviewerPromptCardCount: sourceCounts.staticReviewerPromptCardCount,
    followUpTriageRowCount: sourceCounts.followUpTriageRowCount,
    staticCheckPromptCardCount: sourceCounts.staticCheckPromptCardCount,
    synthesisRowCount: sourceCounts.synthesisRowCount,
    staticFollowUpNoteCardCount: sourceCounts.staticFollowUpNoteCardCount,
    reviewLaneRowCount: sourceCounts.reviewLaneRowCount,
    staticHumanCheckPromptCardCount: sourceCounts.staticHumanCheckPromptCardCount,
    readinessBriefRowCount: sourceCounts.readinessBriefRowCount,
    staticReviewerCueCardCount: sourceCounts.staticReviewerCueCardCount,
    reviewPathStepCount: sourceCounts.reviewPathStepCount,
    staticHandoffPromptCardCount: sourceCounts.staticHandoffPromptCardCount,
    coverageRowCount: sourceCounts.coverageRowCount,
    responseTraceRowCount: sourceCounts.responseTraceRowCount,
    responseWalkthroughStepCount: sourceCounts.responseWalkthroughStepCount,
    responseRowCount: sourceCounts.responseRowCount,
    questionRowCount: sourceCounts.questionRowCount,
    sourceAnchorCount: sourceCounts.sourceAnchorCount,
    evidenceCallbackCount: sourceCounts.evidenceCallbackCount,
    gapDiscussionPointCount: sourceCounts.gapDiscussionPointCount,
    deferredScopeReminderCount: sourceCounts.deferredScopeReminderCount,
    localOnlyRehearsalPathStepCount: rehearsalPathSteps.filter(
      (step) => step.localOnly,
    ).length,
    localOnlyStaticAnswerPrepPromptCardCount: staticAnswerPrepPromptCards.filter(
      (card) => card.localOnly,
    ).length,
    localOnlyReviewBoardRowCount: sourceCounts.localOnlyReviewBoardRowCount,
    localOnlyStaticQuestionPromptCardCount:
      sourceCounts.localOnlyStaticQuestionPromptCardCount,
  };
}

function staticNonGoalFlags(
  sourceFlags: ReviewObservationHandoffFollowUpReadinessReviewBoardStaticNonGoalFlagsView,
): ReviewObservationHandoffFollowUpReadinessRehearsalPathStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedReviewerAnswers: true,
    noSavedAnswerDrafts: true,
    noSavedRehearsalState: true,
    noSavedRehearsalSteps: true,
    noSavedRehearsalPathState: true,
    noSavedStaticAnswerPrepPrompts: true,
    noSavedStaticAnswerPrepPromptCards: true,
    noSavedAnswerPrepPromptState: true,
  };
}

function staticQuestionPromptCardMatchesReviewBoardRow(
  staticQuestionPromptCard: ReviewObservationHandoffFollowUpReadinessReviewBoardStaticQuestionPromptCardView,
  reviewBoardRow: ReviewObservationHandoffFollowUpReadinessReviewBoardRowView,
): boolean {
  return (
    staticQuestionPromptCard.matchedReviewBoardRowIds.includes(
      reviewBoardRow.followUpReadinessReviewBoardRowId,
    ) ||
    staticQuestionPromptCard.matchedFollowUpReadinessBriefRowIds.includes(
      reviewBoardRow.followUpReadinessBriefRowId,
    ) ||
    staticQuestionPromptCard.matchedFollowUpTriageRowIds.includes(
      reviewBoardRow
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
    ) ||
    staticQuestionPromptCard.matchedSynthesisRowIds.includes(
      reviewBoardRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
    ) ||
    staticQuestionPromptCard.matchedReviewLaneRowIds.includes(
      reviewBoardRow.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
    ) ||
    staticQuestionPromptCard.matchedReadinessBriefRowIds.includes(
      reviewBoardRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    ) ||
    staticQuestionPromptCard.matchedReviewPathStepIds.includes(
      reviewBoardRow.sourceReadinessResponseTraceCoverageReviewPathStepId,
    ) ||
    staticQuestionPromptCard.matchedCoverageRowIds.includes(
      reviewBoardRow.sourceReadinessResponseTraceCoverageRowId,
    ) ||
    staticQuestionPromptCard.matchedResponseTraceRowIds.includes(
      reviewBoardRow.sourceReadinessResponseTraceRowId,
    ) ||
    staticQuestionPromptCard.matchedResponseWalkthroughStepIds.includes(
      reviewBoardRow.sourceReadinessResponseWalkthroughStepId,
    ) ||
    staticQuestionPromptCard.matchedResponseRowIds.includes(
      reviewBoardRow.sourceReadinessResponseRowId,
    ) ||
    staticQuestionPromptCard.matchedQuestionRowIds.includes(
      reviewBoardRow.sourceReadinessQuestionRowId,
    )
  );
}

function staticQuestionPromptCardMatchesRehearsalPathStep(
  staticQuestionPromptCard: ReviewObservationHandoffFollowUpReadinessReviewBoardStaticQuestionPromptCardView,
  rehearsalPathStep: ReviewObservationHandoffFollowUpReadinessRehearsalPathStepView,
): boolean {
  return (
    staticQuestionPromptCard.matchedReviewBoardRowIds.includes(
      rehearsalPathStep.sourceReviewBoardRowId,
    ) ||
    staticQuestionPromptCard.matchedFollowUpReadinessBriefRowIds.includes(
      rehearsalPathStep.followUpReadinessBriefRowId,
    ) ||
    staticQuestionPromptCard.matchedFollowUpTriageRowIds.includes(
      rehearsalPathStep
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
    ) ||
    staticQuestionPromptCard.matchedSynthesisRowIds.includes(
      rehearsalPathStep
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
    ) ||
    staticQuestionPromptCard.matchedReviewLaneRowIds.includes(
      rehearsalPathStep
        .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
    ) ||
    staticQuestionPromptCard.matchedReadinessBriefRowIds.includes(
      rehearsalPathStep.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    ) ||
    staticQuestionPromptCard.matchedReviewPathStepIds.includes(
      rehearsalPathStep.sourceReadinessResponseTraceCoverageReviewPathStepId,
    ) ||
    staticQuestionPromptCard.matchedCoverageRowIds.includes(
      rehearsalPathStep.sourceReadinessResponseTraceCoverageRowId,
    ) ||
    staticQuestionPromptCard.matchedResponseTraceRowIds.includes(
      rehearsalPathStep.sourceReadinessResponseTraceRowId,
    ) ||
    staticQuestionPromptCard.matchedResponseWalkthroughStepIds.includes(
      rehearsalPathStep.sourceReadinessResponseWalkthroughStepId,
    ) ||
    staticQuestionPromptCard.matchedResponseRowIds.includes(
      rehearsalPathStep.sourceReadinessResponseRowId,
    ) ||
    staticQuestionPromptCard.matchedQuestionRowIds.includes(
      rehearsalPathStep.sourceReadinessQuestionRowId,
    )
  );
}
