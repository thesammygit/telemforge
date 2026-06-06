import type {
  ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkRowView,
  ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkStaticFollowUpPromptCardView,
  ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkSummaryView,
  ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkView,
  ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughStaticReviewNoteCardView,
  ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughStepView,
  ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk(
  sourceReviewObservationHandoffFollowUpReadinessAnswerWalkthrough:
    | ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughView
    | undefined,
): ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkView | undefined {
  if (
    !sourceReviewObservationHandoffFollowUpReadinessAnswerWalkthrough
      ?.answerWalkthroughSteps.length ||
    !sourceReviewObservationHandoffFollowUpReadinessAnswerWalkthrough
      .staticReviewNoteCards.length
  ) {
    return undefined;
  }

  const answerSourceCrosswalkRows =
    sourceReviewObservationHandoffFollowUpReadinessAnswerWalkthrough.answerWalkthroughSteps.map(
      (answerWalkthroughStep) =>
        buildAnswerSourceCrosswalkRow(
          answerWalkthroughStep,
          sourceReviewObservationHandoffFollowUpReadinessAnswerWalkthrough
            .staticReviewNoteCards,
        ),
    );
  const staticFollowUpPromptCards =
    sourceReviewObservationHandoffFollowUpReadinessAnswerWalkthrough.staticReviewNoteCards.map(
      (staticReviewNoteCard) =>
        buildStaticFollowUpPromptCard(
          staticReviewNoteCard,
          answerSourceCrosswalkRows,
        ),
    );
  const defaultAnswerSourceCrosswalkRow =
    answerSourceCrosswalkRows.find(
      (row) =>
        row.sourceAnswerWalkthroughStepId ===
        sourceReviewObservationHandoffFollowUpReadinessAnswerWalkthrough.summary
          .defaultAnswerWalkthroughContext.defaultAnswerWalkthroughStepId,
    ) ?? answerSourceCrosswalkRows[0];
  const defaultStaticFollowUpPromptCard =
    staticFollowUpPromptCards.find(
      (card) =>
        card.sourceStaticReviewNoteCardId ===
        sourceReviewObservationHandoffFollowUpReadinessAnswerWalkthrough.summary
          .defaultAnswerWalkthroughContext.defaultStaticReviewNoteCardId,
    ) ?? staticFollowUpPromptCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_follow_up_readiness_answer_source_crosswalk.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff follow-up readiness answer-source crosswalk and static follow-up prompts",
    localStatus:
      sourceReviewObservationHandoffFollowUpReadinessAnswerWalkthrough.localStatus,
    summary: {
      followUpReadinessAnswerSourceCrosswalkId:
        "candidate-local-review-observation-handoff-follow-up-readiness-answer-source-crosswalk",
      label:
        "Local observation handoff follow-up readiness answer-source crosswalk",
      summary:
        "A static answer-source crosswalk derives from Stage 69 answer walkthrough steps and static review note cards so reviewers can inspect Stage 69 walkthrough step ids, Stage 69 static review note card ids, Stage 68 answer coverage row ids, Stage 68 static reviewer-check prompt card ids, Stage 67 rehearsal path step ids, Stage 67 static answer-prep prompt ids, Stage 66 review board rows, Stage 66 static question prompt cards, Stage 65 brief rows, Stage 64 triage rows, local anchors, evidence callbacks, gap discussion prompts, deferred-scope reminders, coverage notes, handoff prompts, static review note text, and static follow-up prompt text before human review without saved reviewer answers, saved answer drafts, saved answer-source crosswalk state, saved follow-up prompts, saved walkthrough state, saved review notes, owner assignment, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, persistence, or production handoff semantics.",
      defaultAnswerSourceCrosswalkContext: {
        defaultAnswerSourceCrosswalkRowId:
          defaultAnswerSourceCrosswalkRow
            .followUpReadinessAnswerSourceCrosswalkRowId,
        defaultAnswerWalkthroughStepId:
          defaultAnswerSourceCrosswalkRow.sourceAnswerWalkthroughStepId,
        defaultAnswerCoverageRowId:
          defaultAnswerSourceCrosswalkRow.sourceAnswerCoverageRowId,
        defaultRehearsalPathStepId:
          defaultAnswerSourceCrosswalkRow.sourceRehearsalPathStepId,
        defaultReviewBoardRowId:
          defaultAnswerSourceCrosswalkRow.sourceReviewBoardRowId,
        defaultFollowUpReadinessBriefRowId:
          defaultAnswerSourceCrosswalkRow.followUpReadinessBriefRowId,
        defaultFollowUpTriageRowId:
          defaultAnswerSourceCrosswalkRow
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        defaultSynthesisRowId:
          defaultAnswerSourceCrosswalkRow
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
        defaultReviewLaneRowId:
          defaultAnswerSourceCrosswalkRow
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        defaultReadinessBriefRowId:
          defaultAnswerSourceCrosswalkRow
            .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        defaultReviewPathStepId:
          defaultAnswerSourceCrosswalkRow
            .sourceReadinessResponseTraceCoverageReviewPathStepId,
        defaultCoverageRowId:
          defaultAnswerSourceCrosswalkRow
            .sourceReadinessResponseTraceCoverageRowId,
        defaultTraceRowId:
          defaultAnswerSourceCrosswalkRow.sourceReadinessResponseTraceRowId,
        defaultStaticFollowUpPromptCardId:
          defaultStaticFollowUpPromptCard
            .followUpReadinessAnswerSourceCrosswalkStaticFollowUpPromptCardId,
        defaultStaticReviewNoteCardId:
          defaultStaticFollowUpPromptCard.sourceStaticReviewNoteCardId,
        defaultStaticReviewerCheckPromptCardId:
          defaultStaticFollowUpPromptCard.sourceStaticReviewerCheckPromptCardId,
        defaultStaticAnswerPrepPromptCardId:
          defaultStaticFollowUpPromptCard.sourceStaticAnswerPrepPromptCardId,
        defaultStaticQuestionPromptCardId:
          defaultStaticFollowUpPromptCard.sourceStaticQuestionPromptCardId,
        defaultStaticReviewerPromptCardId:
          defaultStaticFollowUpPromptCard.followUpReadinessBriefStaticReviewerPromptCardId,
        defaultStaticCheckPromptCardId:
          defaultStaticFollowUpPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
        defaultStaticFollowUpNoteCardId:
          defaultStaticFollowUpPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
        defaultStaticHumanCheckPromptCardId:
          defaultStaticFollowUpPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
        defaultStaticReviewerCueCardId:
          defaultStaticFollowUpPromptCard
            .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
        defaultStaticHandoffPromptCardId:
          defaultStaticFollowUpPromptCard
            .sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
        sourceFollowUpReadinessAnswerWalkthroughSummary:
          sourceReviewObservationHandoffFollowUpReadinessAnswerWalkthrough.summary.summary,
        sourceFollowUpReadinessAnswerWalkthroughDefaultContext:
          sourceReviewObservationHandoffFollowUpReadinessAnswerWalkthrough.summary
            .defaultAnswerWalkthroughContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        answerSourceCrosswalkRows,
        staticFollowUpPromptCards,
        sourceReviewObservationHandoffFollowUpReadinessAnswerWalkthrough,
      ),
    },
    defaultAnswerSourceCrosswalkRow,
    defaultStaticFollowUpPromptCard,
    answerSourceCrosswalkRows,
    staticFollowUpPromptCards,
    staticSourceFollowUpReadinessAnswerSourceCrosswalkSummary:
      "Stage 70 answer-source crosswalk rows and static follow-up prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, answer-source crosswalk state, follow-up prompts, walkthrough state, review notes, reviewer-check prompts, answer coverage state, rehearsal state, review board state, question prompt state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffFollowUpReadinessAnswerWalkthrough:
      sourceReviewObservationHandoffFollowUpReadinessAnswerWalkthrough,
  };
}

function buildAnswerSourceCrosswalkRow(
  answerWalkthroughStep: ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughStepView,
  staticReviewNoteCards: ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughStaticReviewNoteCardView[],
): ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkRowView {
  const matchedStaticReviewNoteCards = staticReviewNoteCards.filter((card) =>
    staticReviewNoteCardMatchesAnswerWalkthroughStep(
      card,
      answerWalkthroughStep,
    ),
  );
  const sourceStaticReviewNoteCardIds = matchedStaticReviewNoteCards.map(
    (card) => card.followUpReadinessAnswerWalkthroughStaticReviewNoteCardId,
  );
  const followUpReadinessAnswerSourceCrosswalkRowId =
    `review-observation-handoff-follow-up-readiness-answer-source-crosswalk:${answerWalkthroughStep.followUpReadinessAnswerWalkthroughStepId}`;

  return {
    ...answerWalkthroughStep,
    followUpReadinessAnswerSourceCrosswalkRowId,
    followUpReadinessAnswerSourceCrosswalkRowOrder:
      answerWalkthroughStep.followUpReadinessAnswerWalkthroughStepOrder,
    sourceAnswerWalkthroughStepId:
      answerWalkthroughStep.followUpReadinessAnswerWalkthroughStepId,
    sourceAnswerWalkthroughStepIds: [
      answerWalkthroughStep.followUpReadinessAnswerWalkthroughStepId,
    ],
    sourceStaticReviewNoteCardIds,
    staticFollowUpPromptText:
      `Static follow-up prompt for ${answerWalkthroughStep.followUpReadinessAnswerWalkthroughStepId}: inspect Stage 69 static review note cards ${sourceStaticReviewNoteCardIds.join(", ") || "none"}, Stage 68 answer coverage row ${answerWalkthroughStep.sourceAnswerCoverageRowId}, Stage 68 reviewer-check prompt cards ${answerWalkthroughStep.sourceStaticReviewerCheckPromptCardIds.join(", ") || "none"}, Stage 67 rehearsal path step ${answerWalkthroughStep.sourceRehearsalPathStepId}, Stage 67 static answer-prep prompt cards ${answerWalkthroughStep.sourceStaticAnswerPrepPromptCardIds.join(", ") || "none"}, Stage 66 review board row ${answerWalkthroughStep.sourceReviewBoardRowId}, Stage 66 static question prompt text "${answerWalkthroughStep.staticQuestionPromptText}", Stage 65 brief row ${answerWalkthroughStep.followUpReadinessBriefRowId}, Stage 64 triage row ${answerWalkthroughStep.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${answerWalkthroughStep.sourceLocalAnchorHrefs.join(", ")}, callbacks ${answerWalkthroughStep.evidenceCallbackIds.join(", ")}, gaps ${answerWalkthroughStep.gapDiscussionPointIds.join(", ")}, deferred reminders ${answerWalkthroughStep.deferredScopeReminderIds.join(", ")}, coverage note "${answerWalkthroughStep.coverageNoteText}", handoff prompt "${answerWalkthroughStep.handoffPromptText}", static review note "${answerWalkthroughStep.staticReviewNoteText}", and source anchor targets ${answerWalkthroughStep.sourceAnchorTargetIds.join(", ")} as local manual-review context only.`,
    staticNonGoalContext:
      "Static answer-source crosswalk context: manual static answer-source crosswalk only; no saved reviewer answers, saved answer drafts, saved answer-source crosswalk state, saved follow-up prompts, saved walkthrough state, saved review notes, saved reviewer-check prompts, saved answer coverage state, saved rehearsal state, saved review board state, saved question prompt state, persistence, routing, scoring, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      answerWalkthroughStep.staticNonGoalFlags,
    ),
  };
}

function buildStaticFollowUpPromptCard(
  staticReviewNoteCard: ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughStaticReviewNoteCardView,
  answerSourceCrosswalkRows: ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkRowView[],
): ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkStaticFollowUpPromptCardView {
  const sourceStaticReviewNoteCardId =
    staticReviewNoteCard.followUpReadinessAnswerWalkthroughStaticReviewNoteCardId;
  const followUpReadinessAnswerSourceCrosswalkStaticFollowUpPromptCardId =
    `review-observation-handoff-follow-up-readiness-answer-source-crosswalk:static-follow-up-prompt:${sourceStaticReviewNoteCardId}`;
  const matchedAnswerSourceCrosswalkRows =
    answerSourceCrosswalkRows.filter((row) =>
      answerSourceCrosswalkRowMatchesStaticReviewNoteCard(
        row,
        staticReviewNoteCard,
      ),
    );

  return {
    ...staticReviewNoteCard,
    followUpReadinessAnswerSourceCrosswalkStaticFollowUpPromptCardId,
    followUpReadinessAnswerSourceCrosswalkStaticFollowUpPromptCardIds: [
      followUpReadinessAnswerSourceCrosswalkStaticFollowUpPromptCardId,
    ],
    sourceStaticReviewNoteCardId,
    sourceStaticReviewNoteCardIds: [sourceStaticReviewNoteCardId],
    matchedAnswerSourceCrosswalkRowIds: matchedAnswerSourceCrosswalkRows.map(
      (row) => row.followUpReadinessAnswerSourceCrosswalkRowId,
    ),
    staticFollowUpPromptOrder: staticReviewNoteCard.staticReviewNoteOrder,
    staticFollowUpPromptText:
      `Static follow-up prompt card ${followUpReadinessAnswerSourceCrosswalkStaticFollowUpPromptCardId}: inspect source Stage 69 static review note card ${sourceStaticReviewNoteCardId}, matched Stage 70 crosswalk rows ${matchedAnswerSourceCrosswalkRows.map((row) => row.followUpReadinessAnswerSourceCrosswalkRowId).join(", ") || "none"}, Stage 69 answer walkthrough steps ${staticReviewNoteCard.matchedAnswerWalkthroughStepIds.join(", ") || "none"}, Stage 68 answer coverage rows ${staticReviewNoteCard.sourceAnswerCoverageRowIds.join(", ") || "none"}, Stage 68 reviewer-check prompt card ${staticReviewNoteCard.sourceStaticReviewerCheckPromptCardId}, anchors ${staticReviewNoteCard.sourceLocalAnchorHrefs.join(", ")}, anchor targets ${staticReviewNoteCard.sourceAnchorTargetIds.join(", ")}, callbacks ${staticReviewNoteCard.evidenceCallbackIds.join(", ")}, gaps ${staticReviewNoteCard.gapDiscussionPointIds.join(", ")}, deferred reminders ${staticReviewNoteCard.deferredScopeReminderIds.join(", ")}, static review note text "${staticReviewNoteCard.staticReviewNoteText}", and static reviewer-check prompt text "${staticReviewNoteCard.staticReviewerCheckPromptText}" as local static follow-up prompts only.`,
    staticNonGoalContext:
      "static follow-up prompt context: manual static answer-source crosswalk prompts only; no saved reviewer answers, saved answer drafts, saved answer-source crosswalk state, saved follow-up prompts, saved walkthrough state, saved review notes, saved reviewer-check prompts, saved answer coverage state, persistence, routing, scoring, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticReviewNoteCard.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  answerSourceCrosswalkRows: ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkRowView[],
  staticFollowUpPromptCards: ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkStaticFollowUpPromptCardView[],
  sourceReviewObservationHandoffFollowUpReadinessAnswerWalkthrough: ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughView,
): ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkSummaryView["counts"] {
  const sourceCounts =
    sourceReviewObservationHandoffFollowUpReadinessAnswerWalkthrough.summary
      .counts;

  return {
    answerSourceCrosswalkRowCount: answerSourceCrosswalkRows.length,
    staticFollowUpPromptCardCount: staticFollowUpPromptCards.length,
    answerWalkthroughStepCount: sourceCounts.answerWalkthroughStepCount,
    staticReviewNoteCardCount: sourceCounts.staticReviewNoteCardCount,
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
    localOnlyAnswerSourceCrosswalkRowCount: answerSourceCrosswalkRows.filter(
      (row) => row.localOnly,
    ).length,
    localOnlyStaticFollowUpPromptCardCount: staticFollowUpPromptCards.filter(
      (card) => card.localOnly,
    ).length,
    localOnlyAnswerWalkthroughStepCount:
      sourceCounts.localOnlyAnswerWalkthroughStepCount,
    localOnlyStaticReviewNoteCardCount:
      sourceCounts.localOnlyStaticReviewNoteCardCount,
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
  sourceFlags: ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughStaticNonGoalFlagsView,
): ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedAnswerSourceCrosswalkState: true,
    noSavedAnswerSourceCrosswalkRows: true,
    noSavedFollowUpPrompts: true,
    noSavedFollowUpPromptCards: true,
    noSavedFollowUpPromptState: true,
  };
}

function staticReviewNoteCardMatchesAnswerWalkthroughStep(
  staticReviewNoteCard: ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughStaticReviewNoteCardView,
  answerWalkthroughStep: ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughStepView,
): boolean {
  return (
    staticReviewNoteCard.matchedAnswerWalkthroughStepIds.includes(
      answerWalkthroughStep.followUpReadinessAnswerWalkthroughStepId,
    ) ||
    staticReviewNoteCard.sourceAnswerCoverageRowIds.includes(
      answerWalkthroughStep.sourceAnswerCoverageRowId,
    ) ||
    staticReviewNoteCard.sourceStaticReviewerCheckPromptCardIds.some((cardId) =>
      answerWalkthroughStep.sourceStaticReviewerCheckPromptCardIds.includes(
        cardId,
      ),
    )
  );
}

function answerSourceCrosswalkRowMatchesStaticReviewNoteCard(
  answerSourceCrosswalkRow: ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkRowView,
  staticReviewNoteCard: ReviewObservationHandoffFollowUpReadinessAnswerWalkthroughStaticReviewNoteCardView,
): boolean {
  return (
    answerSourceCrosswalkRow.sourceStaticReviewNoteCardIds.includes(
      staticReviewNoteCard.followUpReadinessAnswerWalkthroughStaticReviewNoteCardId,
    ) ||
    staticReviewNoteCard.matchedAnswerWalkthroughStepIds.includes(
      answerSourceCrosswalkRow.sourceAnswerWalkthroughStepId,
    ) ||
    staticReviewNoteCard.sourceAnswerCoverageRowIds.includes(
      answerSourceCrosswalkRow.sourceAnswerCoverageRowId,
    ) ||
    staticReviewNoteCard.sourceStaticReviewerCheckPromptCardIds.some((cardId) =>
      answerSourceCrosswalkRow.sourceStaticReviewerCheckPromptCardIds.includes(
        cardId,
      ),
    )
  );
}
