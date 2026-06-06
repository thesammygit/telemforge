import type {
  ReviewObservationHandoffFollowUpReadinessAnswerCoverageRowView,
  ReviewObservationHandoffFollowUpReadinessAnswerCoverageStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessAnswerCoverageStaticReviewerCheckPromptCardView,
  ReviewObservationHandoffFollowUpReadinessAnswerCoverageView,
  ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughStaticReviewNoteCardView,
  ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughStepView,
  ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughSummaryView,
  ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffFollowUpReadinessAnswerWalkthrough(
  sourceReviewObservationHandoffFollowUpReadinessAnswerCoverage:
    | ReviewObservationHandoffFollowUpReadinessAnswerCoverageView
    | undefined,
): ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughView | undefined {
  if (
    !sourceReviewObservationHandoffFollowUpReadinessAnswerCoverage
      ?.answerCoverageRows.length ||
    !sourceReviewObservationHandoffFollowUpReadinessAnswerCoverage
      .staticReviewerCheckPromptCards.length
  ) {
    return undefined;
  }

  const answerWalkthroughSteps =
    sourceReviewObservationHandoffFollowUpReadinessAnswerCoverage.answerCoverageRows.map(
      (answerCoverageRow) =>
        buildAnswerWalkthroughStep(
          answerCoverageRow,
          sourceReviewObservationHandoffFollowUpReadinessAnswerCoverage
            .staticReviewerCheckPromptCards,
        ),
    );
  const staticReviewNoteCards =
    sourceReviewObservationHandoffFollowUpReadinessAnswerCoverage.staticReviewerCheckPromptCards.map(
      (staticReviewerCheckPromptCard) =>
        buildStaticReviewNoteCard(
          staticReviewerCheckPromptCard,
          answerWalkthroughSteps,
        ),
    );
  const defaultAnswerWalkthroughStep =
    answerWalkthroughSteps.find(
      (step) =>
        step.sourceAnswerCoverageRowId ===
        sourceReviewObservationHandoffFollowUpReadinessAnswerCoverage.summary
          .defaultAnswerCoverageContext.defaultAnswerCoverageRowId,
    ) ?? answerWalkthroughSteps[0];
  const defaultStaticReviewNoteCard =
    staticReviewNoteCards.find(
      (card) =>
        card.sourceStaticReviewerCheckPromptCardId ===
        sourceReviewObservationHandoffFollowUpReadinessAnswerCoverage.summary
          .defaultAnswerCoverageContext.defaultStaticReviewerCheckPromptCardId,
    ) ?? staticReviewNoteCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_follow_up_readiness_answer_walkthrough.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff follow-up readiness answer walkthrough and static review notes",
    localStatus:
      sourceReviewObservationHandoffFollowUpReadinessAnswerCoverage.localStatus,
    summary: {
      followUpReadinessAnswerWalkthroughId:
        "candidate-local-review-observation-handoff-follow-up-readiness-answer-walkthrough",
      label:
        "Local observation handoff follow-up readiness answer walkthrough",
      summary:
        "A static answer walkthrough derives from Stage 68 answer coverage rows and static reviewer-check prompt cards so reviewers can inspect ordered answer coverage, Stage 67 rehearsal path steps, Stage 67 static answer-prep prompt cards, Stage 66 review board rows, Stage 66 static question prompt cards, Stage 65 brief rows, Stage 64 triage rows, source anchors, evidence callbacks, gap discussion prompts, deferred-scope reminders, coverage notes, handoff prompts, static reviewer-check prompt text, and static review note text before human review without saved reviewer answers, saved answer drafts, saved walkthrough state, saved review notes, saved reviewer-check prompts, saved answer coverage state, routes, exports, signoff, audit retention, scoring, certification, owner assignment, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, persistence, or production handoff semantics.",
      defaultAnswerWalkthroughContext: {
        defaultAnswerWalkthroughStepId:
          defaultAnswerWalkthroughStep.followUpReadinessAnswerWalkthroughStepId,
        defaultAnswerCoverageRowId:
          defaultAnswerWalkthroughStep.sourceAnswerCoverageRowId,
        defaultRehearsalPathStepId:
          defaultAnswerWalkthroughStep.sourceRehearsalPathStepId,
        defaultReviewBoardRowId:
          defaultAnswerWalkthroughStep.sourceReviewBoardRowId,
        defaultFollowUpReadinessBriefRowId:
          defaultAnswerWalkthroughStep.followUpReadinessBriefRowId,
        defaultFollowUpTriageRowId:
          defaultAnswerWalkthroughStep
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        defaultSynthesisRowId:
          defaultAnswerWalkthroughStep
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
        defaultReviewLaneRowId:
          defaultAnswerWalkthroughStep
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        defaultReadinessBriefRowId:
          defaultAnswerWalkthroughStep
            .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        defaultReviewPathStepId:
          defaultAnswerWalkthroughStep
            .sourceReadinessResponseTraceCoverageReviewPathStepId,
        defaultCoverageRowId:
          defaultAnswerWalkthroughStep.sourceReadinessResponseTraceCoverageRowId,
        defaultTraceRowId:
          defaultAnswerWalkthroughStep.sourceReadinessResponseTraceRowId,
        defaultStaticReviewNoteCardId:
          defaultStaticReviewNoteCard
            .followUpReadinessAnswerWalkthroughStaticReviewNoteCardId,
        defaultStaticReviewerCheckPromptCardId:
          defaultStaticReviewNoteCard.sourceStaticReviewerCheckPromptCardId,
        defaultStaticAnswerPrepPromptCardId:
          defaultStaticReviewNoteCard.sourceStaticAnswerPrepPromptCardId,
        defaultStaticQuestionPromptCardId:
          defaultStaticReviewNoteCard.sourceStaticQuestionPromptCardId,
        defaultStaticReviewerPromptCardId:
          defaultStaticReviewNoteCard.followUpReadinessBriefStaticReviewerPromptCardId,
        defaultStaticCheckPromptCardId:
          defaultStaticReviewNoteCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
        defaultStaticFollowUpNoteCardId:
          defaultStaticReviewNoteCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
        defaultStaticHumanCheckPromptCardId:
          defaultStaticReviewNoteCard
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
        defaultStaticReviewerCueCardId:
          defaultStaticReviewNoteCard
            .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
        defaultStaticHandoffPromptCardId:
          defaultStaticReviewNoteCard
            .sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
        sourceFollowUpReadinessAnswerCoverageSummary:
          sourceReviewObservationHandoffFollowUpReadinessAnswerCoverage.summary.summary,
        sourceFollowUpReadinessAnswerCoverageDefaultContext:
          sourceReviewObservationHandoffFollowUpReadinessAnswerCoverage.summary
            .defaultAnswerCoverageContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        answerWalkthroughSteps,
        staticReviewNoteCards,
        sourceReviewObservationHandoffFollowUpReadinessAnswerCoverage,
      ),
    },
    defaultAnswerWalkthroughStep,
    defaultStaticReviewNoteCard,
    answerWalkthroughSteps,
    staticReviewNoteCards,
    staticSourceFollowUpReadinessAnswerWalkthroughSummary:
      "Stage 69 answer walkthrough steps and static review note cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, walkthrough state, review notes, reviewer-check prompts, answer coverage state, answer coverage rows, rehearsal state, review board state, question prompt state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffFollowUpReadinessAnswerCoverage:
      sourceReviewObservationHandoffFollowUpReadinessAnswerCoverage,
  };
}

function buildAnswerWalkthroughStep(
  answerCoverageRow: ReviewObservationHandoffFollowUpReadinessAnswerCoverageRowView,
  staticReviewerCheckPromptCards: ReviewObservationHandoffFollowUpReadinessAnswerCoverageStaticReviewerCheckPromptCardView[],
): ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughStepView {
  const matchedStaticReviewerCheckPromptCards =
    staticReviewerCheckPromptCards.filter((card) =>
      staticReviewerCheckPromptCardMatchesAnswerCoverageRow(
        card,
        answerCoverageRow,
      ),
    );
  const sourceStaticReviewerCheckPromptCardIds =
    matchedStaticReviewerCheckPromptCards.map(
      (card) =>
        card.followUpReadinessAnswerCoverageStaticReviewerCheckPromptCardId,
    );
  const followUpReadinessAnswerWalkthroughStepId =
    `review-observation-handoff-follow-up-readiness-answer-walkthrough:${answerCoverageRow.followUpReadinessAnswerCoverageRowId}`;

  return {
    ...answerCoverageRow,
    followUpReadinessAnswerWalkthroughStepId,
    followUpReadinessAnswerWalkthroughStepOrder:
      answerCoverageRow.followUpReadinessAnswerCoverageRowOrder,
    sourceAnswerCoverageRowId:
      answerCoverageRow.followUpReadinessAnswerCoverageRowId,
    sourceAnswerCoverageRowIds: [
      answerCoverageRow.followUpReadinessAnswerCoverageRowId,
    ],
    sourceStaticReviewerCheckPromptCardIds,
    staticReviewNoteText:
      `Static review note for ${answerCoverageRow.followUpReadinessAnswerCoverageRowId}: walk reviewer through Stage 68 reviewer-check prompt cards ${sourceStaticReviewerCheckPromptCardIds.join(", ") || "none"}, Stage 67 rehearsal path step ${answerCoverageRow.sourceRehearsalPathStepId}, Stage 67 static answer-prep prompt cards ${answerCoverageRow.sourceStaticAnswerPrepPromptCardIds.join(", ") || "none"}, Stage 66 review board row ${answerCoverageRow.sourceReviewBoardRowId}, Stage 66 static question prompt text "${answerCoverageRow.staticQuestionPromptText}", Stage 65 brief row ${answerCoverageRow.followUpReadinessBriefRowId}, Stage 64 triage row ${answerCoverageRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${answerCoverageRow.sourceLocalAnchorHrefs.join(", ")}, callbacks ${answerCoverageRow.evidenceCallbackIds.join(", ")}, gaps ${answerCoverageRow.gapDiscussionPointIds.join(", ")}, deferred reminders ${answerCoverageRow.deferredScopeReminderIds.join(", ")}, coverage note "${answerCoverageRow.coverageNoteText}", handoff prompt "${answerCoverageRow.handoffPromptText}", and static reviewer-check prompt text "${answerCoverageRow.staticReviewerCheckPromptText}" as local manual-review context only.`,
    staticNonGoalContext:
      "Static answer walkthrough context: manual static answer walkthrough only; no saved reviewer answers, saved answer drafts, saved walkthrough state, saved review notes, saved reviewer-check prompts, saved answer coverage state, saved rehearsal state, saved review board state, saved question prompt state, persistence, routing, scoring, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(answerCoverageRow.staticNonGoalFlags),
  };
}

function buildStaticReviewNoteCard(
  staticReviewerCheckPromptCard: ReviewObservationHandoffFollowUpReadinessAnswerCoverageStaticReviewerCheckPromptCardView,
  answerWalkthroughSteps: ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughStepView[],
): ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughStaticReviewNoteCardView {
  const sourceStaticReviewerCheckPromptCardId =
    staticReviewerCheckPromptCard.followUpReadinessAnswerCoverageStaticReviewerCheckPromptCardId;
  const followUpReadinessAnswerWalkthroughStaticReviewNoteCardId =
    `review-observation-handoff-follow-up-readiness-answer-walkthrough:static-review-note:${sourceStaticReviewerCheckPromptCardId}`;
  const matchedAnswerWalkthroughSteps = answerWalkthroughSteps.filter((step) =>
    answerWalkthroughStepMatchesStaticReviewerCheckPromptCard(
      step,
      staticReviewerCheckPromptCard,
    ),
  );

  return {
    ...staticReviewerCheckPromptCard,
    followUpReadinessAnswerWalkthroughStaticReviewNoteCardId,
    followUpReadinessAnswerWalkthroughStaticReviewNoteCardIds: [
      followUpReadinessAnswerWalkthroughStaticReviewNoteCardId,
    ],
    sourceStaticReviewerCheckPromptCardId,
    sourceStaticReviewerCheckPromptCardIds: [
      sourceStaticReviewerCheckPromptCardId,
    ],
    sourceAnswerCoverageRowIds:
      staticReviewerCheckPromptCard.matchedAnswerCoverageRowIds,
    staticReviewNoteOrder:
      staticReviewerCheckPromptCard.staticReviewerCheckPromptOrder,
    matchedAnswerWalkthroughStepIds: matchedAnswerWalkthroughSteps.map(
      (step) => step.followUpReadinessAnswerWalkthroughStepId,
    ),
    staticReviewNoteText:
      `Static review note card ${followUpReadinessAnswerWalkthroughStaticReviewNoteCardId}: inspect matched walkthrough steps ${matchedAnswerWalkthroughSteps.map((step) => step.followUpReadinessAnswerWalkthroughStepId).join(", ") || "none"}, answer coverage rows ${staticReviewerCheckPromptCard.matchedAnswerCoverageRowIds.join(", ") || "none"}, rehearsal path steps ${staticReviewerCheckPromptCard.matchedRehearsalPathStepIds.join(", ") || "none"}, review board rows ${staticReviewerCheckPromptCard.matchedReviewBoardRowIds.join(", ") || "none"}, Stage 65 brief rows ${staticReviewerCheckPromptCard.matchedFollowUpReadinessBriefRowIds.join(", ") || "none"}, Stage 64 triage rows ${staticReviewerCheckPromptCard.matchedFollowUpTriageRowIds.join(", ") || "none"}, anchors ${staticReviewerCheckPromptCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticReviewerCheckPromptCard.evidenceCallbackIds.join(", ")}, gaps ${staticReviewerCheckPromptCard.gapDiscussionPointIds.join(", ")}, deferred reminders ${staticReviewerCheckPromptCard.deferredScopeReminderIds.join(", ")}, static reviewer-check prompt text "${staticReviewerCheckPromptCard.staticReviewerCheckPromptText}", and static answer-prep prompt text "${staticReviewerCheckPromptCard.staticAnswerPrepPromptText}" as local static review notes only.`,
    staticNonGoalContext:
      "static review note context: manual static answer walkthrough notes only; no saved reviewer answers, saved answer drafts, saved walkthrough state, saved review notes, saved reviewer-check prompts, saved answer coverage state, persistence, routing, scoring, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticReviewerCheckPromptCard.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  answerWalkthroughSteps: ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughStepView[],
  staticReviewNoteCards: ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughStaticReviewNoteCardView[],
  sourceReviewObservationHandoffFollowUpReadinessAnswerCoverage: ReviewObservationHandoffFollowUpReadinessAnswerCoverageView,
): ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughSummaryView["counts"] {
  const sourceCounts =
    sourceReviewObservationHandoffFollowUpReadinessAnswerCoverage.summary.counts;

  return {
    answerWalkthroughStepCount: answerWalkthroughSteps.length,
    staticReviewNoteCardCount: staticReviewNoteCards.length,
    answerCoverageRowCount: sourceCounts.answerCoverageRowCount,
    staticReviewerCheckPromptCardCount:
      sourceCounts.staticReviewerCheckPromptCardCount,
    rehearsalPathStepCount: sourceCounts.rehearsalPathStepCount,
    staticAnswerPrepPromptCardCount: sourceCounts.staticAnswerPrepPromptCardCount,
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
    localOnlyAnswerWalkthroughStepCount: answerWalkthroughSteps.filter(
      (step) => step.localOnly,
    ).length,
    localOnlyStaticReviewNoteCardCount: staticReviewNoteCards.filter(
      (card) => card.localOnly,
    ).length,
    localOnlyAnswerCoverageRowCount: sourceCounts.localOnlyAnswerCoverageRowCount,
    localOnlyStaticReviewerCheckPromptCardCount:
      sourceCounts.localOnlyStaticReviewerCheckPromptCardCount,
    localOnlyRehearsalPathStepCount: sourceCounts.localOnlyRehearsalPathStepCount,
    localOnlyStaticAnswerPrepPromptCardCount:
      sourceCounts.localOnlyStaticAnswerPrepPromptCardCount,
    localOnlyReviewBoardRowCount: sourceCounts.localOnlyReviewBoardRowCount,
    localOnlyStaticQuestionPromptCardCount:
      sourceCounts.localOnlyStaticQuestionPromptCardCount,
  };
}

function staticNonGoalFlags(
  sourceFlags: ReviewObservationHandoffFollowUpReadinessAnswerCoverageStaticNonGoalFlagsView,
): ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedWalkthroughState: true,
    noSavedAnswerWalkthroughState: true,
    noSavedReviewNotes: true,
    noSavedReviewNoteCards: true,
    noSavedReviewNoteState: true,
  };
}

function staticReviewerCheckPromptCardMatchesAnswerCoverageRow(
  staticReviewerCheckPromptCard: ReviewObservationHandoffFollowUpReadinessAnswerCoverageStaticReviewerCheckPromptCardView,
  answerCoverageRow: ReviewObservationHandoffFollowUpReadinessAnswerCoverageRowView,
): boolean {
  return (
    staticReviewerCheckPromptCard.matchedAnswerCoverageRowIds.includes(
      answerCoverageRow.followUpReadinessAnswerCoverageRowId,
    ) ||
    staticReviewerCheckPromptCard.matchedRehearsalPathStepIds.includes(
      answerCoverageRow.sourceRehearsalPathStepId,
    ) ||
    staticReviewerCheckPromptCard.matchedReviewBoardRowIds.includes(
      answerCoverageRow.sourceReviewBoardRowId,
    ) ||
    staticReviewerCheckPromptCard.matchedFollowUpReadinessBriefRowIds.includes(
      answerCoverageRow.followUpReadinessBriefRowId,
    ) ||
    staticReviewerCheckPromptCard.matchedFollowUpTriageRowIds.includes(
      answerCoverageRow
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
    ) ||
    answerCoverageRow.sourceStaticAnswerPrepPromptCardIds.some((cardId) =>
      staticReviewerCheckPromptCard.sourceStaticAnswerPrepPromptCardIds.includes(
        cardId,
      ),
    )
  );
}

function answerWalkthroughStepMatchesStaticReviewerCheckPromptCard(
  answerWalkthroughStep: ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughStepView,
  staticReviewerCheckPromptCard: ReviewObservationHandoffFollowUpReadinessAnswerCoverageStaticReviewerCheckPromptCardView,
): boolean {
  return (
    answerWalkthroughStep.sourceStaticReviewerCheckPromptCardIds.includes(
      staticReviewerCheckPromptCard
        .followUpReadinessAnswerCoverageStaticReviewerCheckPromptCardId,
    ) ||
    staticReviewerCheckPromptCard.matchedAnswerCoverageRowIds.includes(
      answerWalkthroughStep.sourceAnswerCoverageRowId,
    ) ||
    staticReviewerCheckPromptCard.matchedRehearsalPathStepIds.includes(
      answerWalkthroughStep.sourceRehearsalPathStepId,
    ) ||
    staticReviewerCheckPromptCard.matchedReviewBoardRowIds.includes(
      answerWalkthroughStep.sourceReviewBoardRowId,
    ) ||
    staticReviewerCheckPromptCard.matchedFollowUpReadinessBriefRowIds.includes(
      answerWalkthroughStep.followUpReadinessBriefRowId,
    ) ||
    staticReviewerCheckPromptCard.matchedFollowUpTriageRowIds.includes(
      answerWalkthroughStep
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
    )
  );
}
