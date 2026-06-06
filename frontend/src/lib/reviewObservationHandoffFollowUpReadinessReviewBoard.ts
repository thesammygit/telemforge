import type {
  ReviewObservationHandoffFollowUpReadinessBriefRowView,
  ReviewObservationHandoffFollowUpReadinessBriefStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessBriefStaticReviewerPromptCardView,
  ReviewObservationHandoffFollowUpReadinessBriefView,
  ReviewObservationHandoffFollowUpReadinessReviewBoardRowView,
  ReviewObservationHandoffFollowUpReadinessReviewBoardStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessReviewBoardStaticQuestionPromptCardView,
  ReviewObservationHandoffFollowUpReadinessReviewBoardSummaryView,
  ReviewObservationHandoffFollowUpReadinessReviewBoardView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffFollowUpReadinessReviewBoard(
  sourceReviewObservationHandoffFollowUpReadinessBrief:
    | ReviewObservationHandoffFollowUpReadinessBriefView
    | undefined,
): ReviewObservationHandoffFollowUpReadinessReviewBoardView | undefined {
  if (!sourceReviewObservationHandoffFollowUpReadinessBrief?.followUpReadinessBriefRows.length) {
    return undefined;
  }

  const reviewBoardRows =
    sourceReviewObservationHandoffFollowUpReadinessBrief.followUpReadinessBriefRows.map(
      (followUpReadinessBriefRow) =>
        buildReviewBoardRow(
          followUpReadinessBriefRow,
          sourceReviewObservationHandoffFollowUpReadinessBrief.staticReviewerPromptCards,
        ),
    );
  const staticQuestionPromptCards =
    sourceReviewObservationHandoffFollowUpReadinessBrief.staticReviewerPromptCards.map(
      (staticReviewerPromptCard) =>
        buildStaticQuestionPromptCard(staticReviewerPromptCard, reviewBoardRows),
    );
  const defaultReviewBoardRow =
    reviewBoardRows.find(
      (row) =>
        row.followUpReadinessBriefRowId ===
        sourceReviewObservationHandoffFollowUpReadinessBrief.summary
          .defaultFollowUpReadinessBriefContext.defaultFollowUpReadinessBriefRowId,
    ) ?? reviewBoardRows[0];
  const defaultStaticQuestionPromptCard =
    staticQuestionPromptCards.find(
      (card) =>
        card.followUpReadinessBriefStaticReviewerPromptCardId ===
        sourceReviewObservationHandoffFollowUpReadinessBrief.summary
          .defaultFollowUpReadinessBriefContext.defaultStaticReviewerPromptCardId,
    ) ?? staticQuestionPromptCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_follow_up_readiness_review_board.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff follow-up readiness review board and static question prompts",
    localStatus: sourceReviewObservationHandoffFollowUpReadinessBrief.localStatus,
    summary: {
      followUpReadinessReviewBoardId:
        "candidate-local-review-observation-handoff-follow-up-readiness-review-board",
      label:
        "Local observation handoff follow-up readiness review board",
      summary:
        "A static readiness review board derives from Stage 65 follow-up readiness brief rows and static reviewer prompt cards so reviewers can inspect brief rows, Stage 64 triage references, synthesis row ids, review-lane row ids, readiness brief row ids, review path step ids, coverage rows, response trace rows, walkthrough steps, response rows, question rows, static reviewer prompt ids, static check prompt ids, local anchors, evidence callbacks, gap discussion prompts, deferred-scope reminders, coverage notes, gap notes, handoff prompts, readiness brief text, review-lane text, human-check prompt text, follow-up note text, static check prompt text, static reviewer prompt text, and static question prompt text before human review without saved reviewer answers, saved review board state, saved board rows, saved static question prompts, saved readiness brief state, saved brief rows, saved static reviewer prompts, saved triage state, saved prompt state, saved notes, saved gap notes, saved handoff prompt edits, saved source readiness progress, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, owner assignment, or commands.",
      defaultReviewBoardContext: {
        defaultReviewBoardRowId:
          defaultReviewBoardRow.followUpReadinessReviewBoardRowId,
        defaultFollowUpReadinessBriefRowId:
          defaultReviewBoardRow.followUpReadinessBriefRowId,
        defaultFollowUpTriageRowId:
          defaultReviewBoardRow
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        defaultSynthesisRowId:
          defaultReviewBoardRow
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
        defaultReviewLaneRowId:
          defaultReviewBoardRow
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        defaultReadinessBriefRowId:
          defaultReviewBoardRow
            .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        defaultReviewPathStepId:
          defaultReviewBoardRow.sourceReadinessResponseTraceCoverageReviewPathStepId,
        defaultCoverageRowId:
          defaultReviewBoardRow.sourceReadinessResponseTraceCoverageRowId,
        defaultTraceRowId:
          defaultReviewBoardRow.sourceReadinessResponseTraceRowId,
        defaultStaticQuestionPromptCardId:
          defaultStaticQuestionPromptCard
            .followUpReadinessReviewBoardStaticQuestionPromptCardId,
        defaultStaticReviewerPromptCardId:
          defaultStaticQuestionPromptCard
            .followUpReadinessBriefStaticReviewerPromptCardId,
        defaultStaticCheckPromptCardId:
          defaultStaticQuestionPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
        defaultStaticFollowUpNoteCardId:
          defaultStaticQuestionPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
        defaultStaticHumanCheckPromptCardId:
          defaultStaticQuestionPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
        defaultStaticReviewerCueCardId:
          defaultStaticQuestionPromptCard
            .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
        defaultStaticHandoffPromptCardId:
          defaultStaticQuestionPromptCard
            .sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
        sourceFollowUpReadinessBriefSummary:
          sourceReviewObservationHandoffFollowUpReadinessBrief.summary.summary,
        sourceFollowUpReadinessBriefDefaultContext:
          sourceReviewObservationHandoffFollowUpReadinessBrief.summary
            .defaultFollowUpReadinessBriefContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        reviewBoardRows,
        staticQuestionPromptCards,
        sourceReviewObservationHandoffFollowUpReadinessBrief,
      ),
    },
    defaultReviewBoardRow,
    defaultStaticQuestionPromptCard,
    reviewBoardRows,
    staticQuestionPromptCards,
    staticSourceFollowUpReadinessReviewBoardSummary:
      "Stage 66 readiness review board rows and static question prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, saved review board state, saved board rows, saved static question prompts, saved readiness brief state, saved brief rows, saved static reviewer prompts, saved triage state, saved prompt state, saved notes, saved gap notes, saved handoff prompt edits, saved source readiness progress, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffFollowUpReadinessBrief,
  };
}

function buildReviewBoardRow(
  followUpReadinessBriefRow: ReviewObservationHandoffFollowUpReadinessBriefRowView,
  staticReviewerPromptCards: ReviewObservationHandoffFollowUpReadinessBriefStaticReviewerPromptCardView[],
): ReviewObservationHandoffFollowUpReadinessReviewBoardRowView {
  const matchedStaticReviewerPromptCards = staticReviewerPromptCards.filter((card) =>
    staticReviewerPromptCardMatchesBriefRow(card, followUpReadinessBriefRow),
  );
  const matchedStaticReviewerPromptCardIds = matchedStaticReviewerPromptCards.map(
    (card) => card.followUpReadinessBriefStaticReviewerPromptCardId,
  );

  return {
    ...followUpReadinessBriefRow,
    followUpReadinessReviewBoardRowId: `review-observation-handoff-follow-up-readiness-review-board:${followUpReadinessBriefRow.followUpReadinessBriefRowId}`,
    followUpReadinessReviewBoardRowOrder:
      followUpReadinessBriefRow.followUpReadinessBriefRowOrder,
    summary:
      `Readiness review board row ${followUpReadinessBriefRow.followUpReadinessBriefRowOrder} preserves Stage 65 brief order for ${followUpReadinessBriefRow.followUpReadinessBriefRowId}, Stage 64 follow-up triage row ${followUpReadinessBriefRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, synthesis row ${followUpReadinessBriefRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId}, review-lane row ${followUpReadinessBriefRow.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId}, readiness brief row ${followUpReadinessBriefRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId}, review path step ${followUpReadinessBriefRow.sourceReadinessResponseTraceCoverageReviewPathStepId}, coverage row ${followUpReadinessBriefRow.sourceReadinessResponseTraceCoverageRowId}, trace row ${followUpReadinessBriefRow.sourceReadinessResponseTraceRowId}, walkthrough step ${followUpReadinessBriefRow.sourceReadinessResponseWalkthroughStepId}, response row ${followUpReadinessBriefRow.sourceReadinessResponseRowId}, question row ${followUpReadinessBriefRow.sourceReadinessQuestionRowId}, ${matchedStaticReviewerPromptCardIds.length} static reviewer prompts, ${followUpReadinessBriefRow.matchedStaticCheckPromptCardIds.length} static check prompts, ${followUpReadinessBriefRow.sourceLocalAnchorHrefs.length} anchors, ${followUpReadinessBriefRow.evidenceCallbackIds.length} callbacks, ${followUpReadinessBriefRow.gapDiscussionPointIds.length} gap prompts, and ${followUpReadinessBriefRow.deferredScopeReminderIds.length} deferred reminders without saved review board state, saved board rows, saved static question prompts, saved readiness brief state, saved brief rows, saved static reviewer prompts, saved triage state, saved prompt state, saved notes, saved gap notes, saved handoff prompt edits, saved reviewer answers, routes, exports, signoff, audit state, scores, certification, owner assignment, meetings, packages, task launchers, runnable checklists, or commands.`,
    matchedStaticReviewerPromptCardIds,
    staticQuestionPromptText:
      `Static question prompt for ${followUpReadinessBriefRow.followUpReadinessBriefRowId}: compare Stage 65 static reviewer prompt cards ${matchedStaticReviewerPromptCardIds.join(", ") || "none"}, Stage 64 triage row ${followUpReadinessBriefRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, review-lane text, follow-up note text, static check prompt text, static reviewer prompt text, anchors ${followUpReadinessBriefRow.sourceLocalAnchorHrefs.join(", ")}, callbacks ${followUpReadinessBriefRow.evidenceCallbackIds.join(", ")}, gap prompts ${followUpReadinessBriefRow.gapDiscussionPointIds.join(", ")}, and deferred reminders ${followUpReadinessBriefRow.deferredScopeReminderIds.join(", ")} as local manual-review context only.`,
    staticNonGoalFlags: staticNonGoalFlags(followUpReadinessBriefRow.staticNonGoalFlags),
  };
}

function buildStaticQuestionPromptCard(
  staticReviewerPromptCard: ReviewObservationHandoffFollowUpReadinessBriefStaticReviewerPromptCardView,
  reviewBoardRows: ReviewObservationHandoffFollowUpReadinessReviewBoardRowView[],
): ReviewObservationHandoffFollowUpReadinessReviewBoardStaticQuestionPromptCardView {
  const cardId = staticReviewerPromptCard.followUpReadinessBriefStaticReviewerPromptCardId;
  const followUpReadinessReviewBoardStaticQuestionPromptCardId =
    `review-observation-handoff-follow-up-readiness-review-board:static-question-prompt:${cardId}`;
  const matchedReviewBoardRows = reviewBoardRows.filter(
    (row) =>
      row.matchedStaticReviewerPromptCardIds.includes(cardId) ||
      staticReviewerPromptCard.matchedFollowUpReadinessBriefRowIds.includes(
        row.followUpReadinessBriefRowId,
      ) ||
      staticReviewerPromptCard.matchedFollowUpTriageRowIds.includes(
        row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
      ) ||
      staticReviewerPromptCard.matchedSynthesisRowIds.includes(
        row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
      ) ||
      staticReviewerPromptCard.matchedReviewLaneRowIds.includes(
        row.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
      ) ||
      staticReviewerPromptCard.matchedReadinessBriefRowIds.includes(
        row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
      ) ||
      staticReviewerPromptCard.matchedReviewPathStepIds.includes(
        row.sourceReadinessResponseTraceCoverageReviewPathStepId,
      ) ||
      staticReviewerPromptCard.matchedCoverageRowIds.includes(
        row.sourceReadinessResponseTraceCoverageRowId,
      ) ||
      staticReviewerPromptCard.matchedResponseTraceRowIds.includes(
        row.sourceReadinessResponseTraceRowId,
      ) ||
      staticReviewerPromptCard.matchedResponseWalkthroughStepIds.includes(
        row.sourceReadinessResponseWalkthroughStepId,
      ) ||
      staticReviewerPromptCard.matchedResponseRowIds.includes(
        row.sourceReadinessResponseRowId,
      ) ||
      staticReviewerPromptCard.matchedQuestionRowIds.includes(
        row.sourceReadinessQuestionRowId,
      ),
  );

  return {
    ...staticReviewerPromptCard,
    followUpReadinessReviewBoardStaticQuestionPromptCardId,
    followUpReadinessReviewBoardStaticQuestionPromptCardIds: [
      followUpReadinessReviewBoardStaticQuestionPromptCardId,
    ],
    staticQuestionPromptOrder: staticReviewerPromptCard.staticReviewerPromptOrder,
    matchedReviewBoardRowIds: matchedReviewBoardRows.map(
      (row) => row.followUpReadinessReviewBoardRowId,
    ),
    staticQuestionPromptText:
      `Static question prompt card ${followUpReadinessReviewBoardStaticQuestionPromptCardId}: inspect matched readiness review board rows ${matchedReviewBoardRows.map((row) => row.followUpReadinessReviewBoardRowId).join(", ") || "none"}, Stage 65 brief rows ${matchedReviewBoardRows.map((row) => row.followUpReadinessBriefRowId).join(", ") || "none"}, Stage 64 triage rows ${matchedReviewBoardRows.map((row) => row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId).join(", ") || "none"}, anchors ${staticReviewerPromptCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticReviewerPromptCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticReviewerPromptCard.gapDiscussionPointIds.join(", ")}, and deferred reminders ${staticReviewerPromptCard.deferredScopeReminderIds.join(", ")} as local manual-review context only.`,
    staticNonGoalFlags: staticNonGoalFlags(staticReviewerPromptCard.staticNonGoalFlags),
  };
}

function buildCounts(
  reviewBoardRows: ReviewObservationHandoffFollowUpReadinessReviewBoardRowView[],
  staticQuestionPromptCards: ReviewObservationHandoffFollowUpReadinessReviewBoardStaticQuestionPromptCardView[],
  sourceReviewObservationHandoffFollowUpReadinessBrief: ReviewObservationHandoffFollowUpReadinessBriefView,
): ReviewObservationHandoffFollowUpReadinessReviewBoardSummaryView["counts"] {
  const sourceCounts = sourceReviewObservationHandoffFollowUpReadinessBrief.summary.counts;

  return {
    reviewBoardRowCount: reviewBoardRows.length,
    staticQuestionPromptCardCount: staticQuestionPromptCards.length,
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
    localOnlyReviewBoardRowCount: reviewBoardRows.filter((row) => row.localOnly).length,
    localOnlyStaticQuestionPromptCardCount: staticQuestionPromptCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function staticNonGoalFlags(
  sourceFlags: ReviewObservationHandoffFollowUpReadinessBriefStaticNonGoalFlagsView,
): ReviewObservationHandoffFollowUpReadinessReviewBoardStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedReviewBoardState: true,
    noSavedReviewBoardRows: true,
    noSavedBoardState: true,
    noSavedBoardRows: true,
    noSavedStaticQuestionPrompts: true,
    noSavedStaticQuestionPromptCards: true,
    noSavedQuestionPromptState: true,
  };
}

function staticReviewerPromptCardMatchesBriefRow(
  staticReviewerPromptCard: ReviewObservationHandoffFollowUpReadinessBriefStaticReviewerPromptCardView,
  followUpReadinessBriefRow: ReviewObservationHandoffFollowUpReadinessBriefRowView,
): boolean {
  return (
    staticReviewerPromptCard.matchedFollowUpReadinessBriefRowIds.includes(
      followUpReadinessBriefRow.followUpReadinessBriefRowId,
    ) ||
    staticReviewerPromptCard.matchedFollowUpTriageRowIds.includes(
      followUpReadinessBriefRow
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
    ) ||
    staticReviewerPromptCard.matchedSynthesisRowIds.includes(
      followUpReadinessBriefRow
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
    ) ||
    staticReviewerPromptCard.matchedReviewLaneRowIds.includes(
      followUpReadinessBriefRow
        .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
    ) ||
    staticReviewerPromptCard.matchedReadinessBriefRowIds.includes(
      followUpReadinessBriefRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    ) ||
    staticReviewerPromptCard.matchedReviewPathStepIds.includes(
      followUpReadinessBriefRow.sourceReadinessResponseTraceCoverageReviewPathStepId,
    ) ||
    staticReviewerPromptCard.matchedCoverageRowIds.includes(
      followUpReadinessBriefRow.sourceReadinessResponseTraceCoverageRowId,
    ) ||
    staticReviewerPromptCard.matchedResponseTraceRowIds.includes(
      followUpReadinessBriefRow.sourceReadinessResponseTraceRowId,
    ) ||
    staticReviewerPromptCard.matchedResponseWalkthroughStepIds.includes(
      followUpReadinessBriefRow.sourceReadinessResponseWalkthroughStepId,
    ) ||
    staticReviewerPromptCard.matchedResponseRowIds.includes(
      followUpReadinessBriefRow.sourceReadinessResponseRowId,
    ) ||
    staticReviewerPromptCard.matchedQuestionRowIds.includes(
      followUpReadinessBriefRow.sourceReadinessQuestionRowId,
    )
  );
}
