import type {
  ReviewObservationHandoffFollowUpReadinessAnswerCoverageRowView,
  ReviewObservationHandoffFollowUpReadinessAnswerCoverageStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessAnswerCoverageStaticReviewerCheckPromptCardView,
  ReviewObservationHandoffFollowUpReadinessAnswerCoverageSummaryView,
  ReviewObservationHandoffFollowUpReadinessAnswerCoverageView,
  ReviewObservationHandoffFollowUpReadinessRehearsalPathStepView,
  ReviewObservationHandoffFollowUpReadinessRehearsalPathStaticAnswerPrepPromptCardView,
  ReviewObservationHandoffFollowUpReadinessRehearsalPathView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffFollowUpReadinessAnswerCoverage(
  sourceReviewObservationHandoffFollowUpReadinessRehearsalPath:
    | ReviewObservationHandoffFollowUpReadinessRehearsalPathView
    | undefined,
): ReviewObservationHandoffFollowUpReadinessAnswerCoverageView | undefined {
  if (
    !sourceReviewObservationHandoffFollowUpReadinessRehearsalPath?.rehearsalPathSteps.length
  ) {
    return undefined;
  }

  const answerCoverageRows =
    sourceReviewObservationHandoffFollowUpReadinessRehearsalPath.rehearsalPathSteps.map(
      (rehearsalPathStep) =>
        buildAnswerCoverageRow(
          rehearsalPathStep,
          sourceReviewObservationHandoffFollowUpReadinessRehearsalPath
            .staticAnswerPrepPromptCards,
        ),
    );
  const staticReviewerCheckPromptCards =
    sourceReviewObservationHandoffFollowUpReadinessRehearsalPath.staticAnswerPrepPromptCards.map(
      (staticAnswerPrepPromptCard) =>
        buildStaticReviewerCheckPromptCard(
          staticAnswerPrepPromptCard,
          answerCoverageRows,
        ),
    );
  const defaultAnswerCoverageRow =
    answerCoverageRows.find(
      (row) =>
        row.sourceRehearsalPathStepId ===
        sourceReviewObservationHandoffFollowUpReadinessRehearsalPath.summary
          .defaultRehearsalContext.defaultRehearsalPathStepId,
    ) ?? answerCoverageRows[0];
  const defaultStaticReviewerCheckPromptCard =
    staticReviewerCheckPromptCards.find(
      (card) =>
        card.sourceStaticAnswerPrepPromptCardId ===
        sourceReviewObservationHandoffFollowUpReadinessRehearsalPath.summary
          .defaultRehearsalContext.defaultStaticAnswerPrepPromptCardId,
    ) ?? staticReviewerCheckPromptCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_follow_up_readiness_answer_coverage.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff follow-up readiness answer coverage and static reviewer-check prompts",
    localStatus:
      sourceReviewObservationHandoffFollowUpReadinessRehearsalPath.localStatus,
    summary: {
      followUpReadinessAnswerCoverageId:
        "candidate-local-review-observation-handoff-follow-up-readiness-answer-coverage",
      label:
        "Local observation handoff follow-up readiness answer coverage",
      summary:
        "A static answer coverage board derives from Stage 67 rehearsal path steps and static answer-prep prompt cards so reviewers can inspect answer coverage rows, Stage 66 review board rows, Stage 66 static question prompt cards, Stage 65 brief rows, Stage 64 triage rows, source anchors, evidence callbacks, gap discussion prompts, deferred-scope reminders, coverage notes, gap notes, handoff prompts, readiness brief text, review-lane text, follow-up notes, static question prompt text, static answer-prep prompt text, and static reviewer-check prompt text before human review without saved reviewer answers, saved answer drafts, saved answer coverage state, saved reviewer-check prompts, saved rehearsal state, saved review board state, saved question prompt state, saved readiness brief state, saved prompt state, saved notes, saved gap notes, saved handoff prompt edits, saved source readiness progress, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, persistence, or production handoff semantics.",
      defaultAnswerCoverageContext: {
        defaultAnswerCoverageRowId:
          defaultAnswerCoverageRow.followUpReadinessAnswerCoverageRowId,
        defaultRehearsalPathStepId:
          defaultAnswerCoverageRow.followUpReadinessRehearsalPathStepId,
        defaultReviewBoardRowId:
          defaultAnswerCoverageRow.sourceReviewBoardRowId,
        defaultFollowUpReadinessBriefRowId:
          defaultAnswerCoverageRow.followUpReadinessBriefRowId,
        defaultFollowUpTriageRowId:
          defaultAnswerCoverageRow
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        defaultSynthesisRowId:
          defaultAnswerCoverageRow
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
        defaultReviewLaneRowId:
          defaultAnswerCoverageRow
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        defaultReadinessBriefRowId:
          defaultAnswerCoverageRow
            .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        defaultReviewPathStepId:
          defaultAnswerCoverageRow.sourceReadinessResponseTraceCoverageReviewPathStepId,
        defaultCoverageRowId:
          defaultAnswerCoverageRow.sourceReadinessResponseTraceCoverageRowId,
        defaultTraceRowId:
          defaultAnswerCoverageRow.sourceReadinessResponseTraceRowId,
        defaultStaticReviewerCheckPromptCardId:
          defaultStaticReviewerCheckPromptCard
            .followUpReadinessAnswerCoverageStaticReviewerCheckPromptCardId,
        defaultStaticAnswerPrepPromptCardId:
          defaultStaticReviewerCheckPromptCard
            .sourceStaticAnswerPrepPromptCardId,
        defaultStaticQuestionPromptCardId:
          defaultStaticReviewerCheckPromptCard.sourceStaticQuestionPromptCardId,
        defaultStaticReviewerPromptCardId:
          defaultStaticReviewerCheckPromptCard
            .followUpReadinessBriefStaticReviewerPromptCardId,
        defaultStaticCheckPromptCardId:
          defaultStaticReviewerCheckPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
        defaultStaticFollowUpNoteCardId:
          defaultStaticReviewerCheckPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
        defaultStaticHumanCheckPromptCardId:
          defaultStaticReviewerCheckPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
        defaultStaticReviewerCueCardId:
          defaultStaticReviewerCheckPromptCard
            .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
        defaultStaticHandoffPromptCardId:
          defaultStaticReviewerCheckPromptCard
            .sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
        sourceFollowUpReadinessRehearsalPathSummary:
          sourceReviewObservationHandoffFollowUpReadinessRehearsalPath.summary.summary,
        sourceFollowUpReadinessRehearsalPathDefaultContext:
          sourceReviewObservationHandoffFollowUpReadinessRehearsalPath.summary
            .defaultRehearsalContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        answerCoverageRows,
        staticReviewerCheckPromptCards,
        sourceReviewObservationHandoffFollowUpReadinessRehearsalPath,
      ),
    },
    defaultAnswerCoverageRow,
    defaultStaticReviewerCheckPromptCard,
    answerCoverageRows,
    staticReviewerCheckPromptCards,
    staticSourceFollowUpReadinessAnswerCoverageSummary:
      "Stage 68 answer coverage rows and static reviewer-check prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, saved answer drafts, saved answer coverage state, saved reviewer-check prompts, saved rehearsal state, saved review board state, saved question prompt state, saved readiness brief state, saved prompt state, saved notes, saved gap notes, saved handoff prompt edits, saved source readiness progress, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffFollowUpReadinessRehearsalPath,
  };
}

function buildAnswerCoverageRow(
  rehearsalPathStep: ReviewObservationHandoffFollowUpReadinessRehearsalPathStepView,
  staticAnswerPrepPromptCards: ReviewObservationHandoffFollowUpReadinessRehearsalPathStaticAnswerPrepPromptCardView[],
): ReviewObservationHandoffFollowUpReadinessAnswerCoverageRowView {
  const matchedStaticAnswerPrepPromptCards = staticAnswerPrepPromptCards.filter((card) =>
    staticAnswerPrepPromptCardMatchesRehearsalPathStep(card, rehearsalPathStep),
  );
  const matchedStaticAnswerPrepPromptCardIds = matchedStaticAnswerPrepPromptCards.map(
    (card) => card.followUpReadinessRehearsalPathStaticAnswerPrepPromptCardId,
  );

  return {
    ...rehearsalPathStep,
    followUpReadinessAnswerCoverageRowId:
      `review-observation-handoff-follow-up-readiness-answer-coverage:${rehearsalPathStep.followUpReadinessRehearsalPathStepId}`,
    followUpReadinessAnswerCoverageRowOrder:
      rehearsalPathStep.followUpReadinessRehearsalPathStepOrder,
    sourceRehearsalPathStepId: rehearsalPathStep.followUpReadinessRehearsalPathStepId,
    sourceRehearsalPathStepIds: [rehearsalPathStep.followUpReadinessRehearsalPathStepId],
    matchedStaticAnswerPrepPromptCardIds,
    sourceStaticAnswerPrepPromptCardIds: matchedStaticAnswerPrepPromptCardIds,
    staticReviewerCheckPromptText:
      `Static reviewer-check prompt for ${rehearsalPathStep.followUpReadinessRehearsalPathStepId}: verify that static answer-prep prompts ${matchedStaticAnswerPrepPromptCardIds.join(", ") || "none"} cover review board row ${rehearsalPathStep.sourceReviewBoardRowId}, Stage 65 brief row ${rehearsalPathStep.followUpReadinessBriefRowId}, Stage 64 follow-up triage row ${rehearsalPathStep.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, synthesis row ${rehearsalPathStep.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId}, review-lane row ${rehearsalPathStep.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId}, readiness brief row ${rehearsalPathStep.sourceReadinessResponseTraceCoverageReadinessBriefRowId}, review path step ${rehearsalPathStep.sourceReadinessResponseTraceCoverageReviewPathStepId}, coverage row ${rehearsalPathStep.sourceReadinessResponseTraceCoverageRowId}, trace row ${rehearsalPathStep.sourceReadinessResponseTraceRowId}, walkthrough step ${rehearsalPathStep.sourceReadinessResponseWalkthroughStepId}, response row ${rehearsalPathStep.sourceReadinessResponseRowId}, question row ${rehearsalPathStep.sourceReadinessQuestionRowId}, anchors ${rehearsalPathStep.sourceLocalAnchorHrefs.join(", ")}, callbacks ${rehearsalPathStep.evidenceCallbackIds.join(", ")}, gap prompts ${rehearsalPathStep.gapDiscussionPointIds.join(", ")}, deferred reminders ${rehearsalPathStep.deferredScopeReminderIds.join(", ")}, coverage note "${rehearsalPathStep.coverageNoteText}", gap note "${rehearsalPathStep.gapNoteText}", handoff prompt "${rehearsalPathStep.handoffPromptText}", readiness brief text "${rehearsalPathStep.readinessBriefText}", review-lane text "${rehearsalPathStep.reviewLaneText}", follow-up note text "${rehearsalPathStep.followUpNoteText}", static question prompt text "${rehearsalPathStep.staticQuestionPromptText}", and static answer-prep prompt text "${rehearsalPathStep.staticAnswerPrepPromptText}" as local manual-review context only.`,
    staticNonGoalContext:
      "Static answer coverage context: manual static answer coverage only; no saved reviewer answers, saved answer drafts, saved answer coverage state, saved reviewer-check prompts, saved rehearsal state, saved review board state, saved question prompt state, persistence, routing, scoring, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(rehearsalPathStep.staticNonGoalFlags),
  };
}

function buildStaticReviewerCheckPromptCard(
  staticAnswerPrepPromptCard: ReviewObservationHandoffFollowUpReadinessRehearsalPathStaticAnswerPrepPromptCardView,
  answerCoverageRows: ReviewObservationHandoffFollowUpReadinessAnswerCoverageRowView[],
): ReviewObservationHandoffFollowUpReadinessAnswerCoverageStaticReviewerCheckPromptCardView {
  const sourceStaticAnswerPrepPromptCardId =
    staticAnswerPrepPromptCard.followUpReadinessRehearsalPathStaticAnswerPrepPromptCardId;
  const followUpReadinessAnswerCoverageStaticReviewerCheckPromptCardId =
    `review-observation-handoff-follow-up-readiness-answer-coverage:static-reviewer-check-prompt:${sourceStaticAnswerPrepPromptCardId}`;
  const matchedAnswerCoverageRows = answerCoverageRows.filter((row) =>
    answerCoverageRowMatchesStaticAnswerPrepPromptCard(row, staticAnswerPrepPromptCard),
  );

  return {
    ...staticAnswerPrepPromptCard,
    followUpReadinessAnswerCoverageStaticReviewerCheckPromptCardId,
    followUpReadinessAnswerCoverageStaticReviewerCheckPromptCardIds: [
      followUpReadinessAnswerCoverageStaticReviewerCheckPromptCardId,
    ],
    sourceStaticAnswerPrepPromptCardId,
    sourceStaticAnswerPrepPromptCardIds: [sourceStaticAnswerPrepPromptCardId],
    staticReviewerCheckPromptOrder:
      staticAnswerPrepPromptCard.staticAnswerPrepPromptOrder,
    matchedAnswerCoverageRowIds: matchedAnswerCoverageRows.map(
      (row) => row.followUpReadinessAnswerCoverageRowId,
    ),
    staticReviewerCheckPromptText:
      `Static reviewer-check prompt card ${followUpReadinessAnswerCoverageStaticReviewerCheckPromptCardId}: inspect matched answer coverage rows ${matchedAnswerCoverageRows.map((row) => row.followUpReadinessAnswerCoverageRowId).join(", ") || "none"}, rehearsal path steps ${matchedAnswerCoverageRows.map((row) => row.followUpReadinessRehearsalPathStepId).join(", ") || "none"}, review board rows ${matchedAnswerCoverageRows.map((row) => row.sourceReviewBoardRowId).join(", ") || "none"}, Stage 65 brief rows ${matchedAnswerCoverageRows.map((row) => row.followUpReadinessBriefRowId).join(", ") || "none"}, Stage 64 triage rows ${matchedAnswerCoverageRows.map((row) => row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId).join(", ") || "none"}, anchors ${staticAnswerPrepPromptCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticAnswerPrepPromptCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticAnswerPrepPromptCard.gapDiscussionPointIds.join(", ")}, deferred reminders ${staticAnswerPrepPromptCard.deferredScopeReminderIds.join(", ")}, static question prompt text "${staticAnswerPrepPromptCard.staticQuestionPromptText}", static answer-prep prompt text "${staticAnswerPrepPromptCard.staticAnswerPrepPromptText}", and answer coverage context only.`,
    staticNonGoalContext:
      "static reviewer-check prompt context: manual static answer coverage only; no saved reviewer answers, saved answer drafts, saved answer coverage state, saved reviewer-check prompts, saved rehearsal state, saved review board state, saved question prompt state, persistence, routing, scoring, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(staticAnswerPrepPromptCard.staticNonGoalFlags),
  };
}

function buildCounts(
  answerCoverageRows: ReviewObservationHandoffFollowUpReadinessAnswerCoverageRowView[],
  staticReviewerCheckPromptCards: ReviewObservationHandoffFollowUpReadinessAnswerCoverageStaticReviewerCheckPromptCardView[],
  sourceReviewObservationHandoffFollowUpReadinessRehearsalPath: ReviewObservationHandoffFollowUpReadinessRehearsalPathView,
): ReviewObservationHandoffFollowUpReadinessAnswerCoverageSummaryView["counts"] {
  const sourceCounts =
    sourceReviewObservationHandoffFollowUpReadinessRehearsalPath.summary.counts;

  return {
    answerCoverageRowCount: answerCoverageRows.length,
    staticReviewerCheckPromptCardCount: staticReviewerCheckPromptCards.length,
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
    localOnlyAnswerCoverageRowCount: answerCoverageRows.filter((row) => row.localOnly).length,
    localOnlyStaticReviewerCheckPromptCardCount:
      staticReviewerCheckPromptCards.filter((card) => card.localOnly).length,
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
): ReviewObservationHandoffFollowUpReadinessAnswerCoverageStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedAnswerCoverageState: true,
    noSavedAnswerCoverageRows: true,
    noSavedReviewerCheckPrompts: true,
    noSavedReviewerCheckPromptCards: true,
    noSavedReviewerCheckPromptState: true,
  };
}

function staticAnswerPrepPromptCardMatchesRehearsalPathStep(
  staticAnswerPrepPromptCard: ReviewObservationHandoffFollowUpReadinessRehearsalPathStaticAnswerPrepPromptCardView,
  rehearsalPathStep: ReviewObservationHandoffFollowUpReadinessRehearsalPathStepView,
): boolean {
  return (
    staticAnswerPrepPromptCard.matchedRehearsalPathStepIds.includes(
      rehearsalPathStep.followUpReadinessRehearsalPathStepId,
    ) ||
    staticAnswerPrepPromptCard.matchedReviewBoardRowIds.includes(
      rehearsalPathStep.sourceReviewBoardRowId,
    ) ||
    staticAnswerPrepPromptCard.matchedFollowUpReadinessBriefRowIds.includes(
      rehearsalPathStep.followUpReadinessBriefRowId,
    ) ||
    staticAnswerPrepPromptCard.matchedFollowUpTriageRowIds.includes(
      rehearsalPathStep
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
    ) ||
    staticAnswerPrepPromptCard.matchedSynthesisRowIds.includes(
      rehearsalPathStep
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
    ) ||
    staticAnswerPrepPromptCard.matchedReviewLaneRowIds.includes(
      rehearsalPathStep.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
    ) ||
    staticAnswerPrepPromptCard.matchedReadinessBriefRowIds.includes(
      rehearsalPathStep.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    ) ||
    staticAnswerPrepPromptCard.matchedReviewPathStepIds.includes(
      rehearsalPathStep.sourceReadinessResponseTraceCoverageReviewPathStepId,
    ) ||
    staticAnswerPrepPromptCard.matchedCoverageRowIds.includes(
      rehearsalPathStep.sourceReadinessResponseTraceCoverageRowId,
    ) ||
    staticAnswerPrepPromptCard.matchedResponseTraceRowIds.includes(
      rehearsalPathStep.sourceReadinessResponseTraceRowId,
    ) ||
    staticAnswerPrepPromptCard.matchedResponseWalkthroughStepIds.includes(
      rehearsalPathStep.sourceReadinessResponseWalkthroughStepId,
    ) ||
    staticAnswerPrepPromptCard.matchedResponseRowIds.includes(
      rehearsalPathStep.sourceReadinessResponseRowId,
    ) ||
    staticAnswerPrepPromptCard.matchedQuestionRowIds.includes(
      rehearsalPathStep.sourceReadinessQuestionRowId,
    )
  );
}

function answerCoverageRowMatchesStaticAnswerPrepPromptCard(
  answerCoverageRow: ReviewObservationHandoffFollowUpReadinessAnswerCoverageRowView,
  staticAnswerPrepPromptCard: ReviewObservationHandoffFollowUpReadinessRehearsalPathStaticAnswerPrepPromptCardView,
): boolean {
  return (
    answerCoverageRow.matchedStaticAnswerPrepPromptCardIds.includes(
      staticAnswerPrepPromptCard.followUpReadinessRehearsalPathStaticAnswerPrepPromptCardId,
    ) ||
    staticAnswerPrepPromptCard.matchedRehearsalPathStepIds.includes(
      answerCoverageRow.sourceRehearsalPathStepId,
    ) ||
    staticAnswerPrepPromptCard.matchedReviewBoardRowIds.includes(
      answerCoverageRow.sourceReviewBoardRowId,
    ) ||
    staticAnswerPrepPromptCard.matchedFollowUpReadinessBriefRowIds.includes(
      answerCoverageRow.followUpReadinessBriefRowId,
    ) ||
    staticAnswerPrepPromptCard.matchedFollowUpTriageRowIds.includes(
      answerCoverageRow
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
    ) ||
    staticAnswerPrepPromptCard.matchedSynthesisRowIds.includes(
      answerCoverageRow
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
    ) ||
    staticAnswerPrepPromptCard.matchedReviewLaneRowIds.includes(
      answerCoverageRow.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
    ) ||
    staticAnswerPrepPromptCard.matchedReadinessBriefRowIds.includes(
      answerCoverageRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    ) ||
    staticAnswerPrepPromptCard.matchedReviewPathStepIds.includes(
      answerCoverageRow.sourceReadinessResponseTraceCoverageReviewPathStepId,
    ) ||
    staticAnswerPrepPromptCard.matchedCoverageRowIds.includes(
      answerCoverageRow.sourceReadinessResponseTraceCoverageRowId,
    ) ||
    staticAnswerPrepPromptCard.matchedResponseTraceRowIds.includes(
      answerCoverageRow.sourceReadinessResponseTraceRowId,
    ) ||
    staticAnswerPrepPromptCard.matchedResponseWalkthroughStepIds.includes(
      answerCoverageRow.sourceReadinessResponseWalkthroughStepId,
    ) ||
    staticAnswerPrepPromptCard.matchedResponseRowIds.includes(
      answerCoverageRow.sourceReadinessResponseRowId,
    ) ||
    staticAnswerPrepPromptCard.matchedQuestionRowIds.includes(
      answerCoverageRow.sourceReadinessQuestionRowId,
    )
  );
}
