import type {
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneRowView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneStaticDecisionCueCardView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSummaryView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneView,
  ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkRowView,
  ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkStaticFollowUpPromptCardView,
  ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane(
  sourceReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk:
    | ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkView
    | undefined,
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneView | undefined {
  if (
    !sourceReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk
      ?.answerSourceCrosswalkRows.length ||
    !sourceReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk
      .staticFollowUpPromptCards.length
  ) {
    return undefined;
  }

  const answerFollowUpReviewLaneRows =
    sourceReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk.answerSourceCrosswalkRows.map(
      (answerSourceCrosswalkRow) =>
        buildAnswerFollowUpReviewLaneRow(
          answerSourceCrosswalkRow,
          sourceReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk
            .staticFollowUpPromptCards,
        ),
    );
  const staticDecisionCueCards =
    sourceReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk.staticFollowUpPromptCards.map(
      (staticFollowUpPromptCard) =>
        buildStaticDecisionCueCard(
          staticFollowUpPromptCard,
          answerFollowUpReviewLaneRows,
        ),
    );
  const defaultAnswerFollowUpReviewLaneRow =
    answerFollowUpReviewLaneRows.find(
      (row) =>
        row.sourceAnswerSourceCrosswalkRowId ===
        sourceReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk.summary
          .defaultAnswerSourceCrosswalkContext
          .defaultAnswerSourceCrosswalkRowId,
    ) ?? answerFollowUpReviewLaneRows[0];
  const defaultStaticDecisionCueCard =
    staticDecisionCueCards.find(
      (card) =>
        card.sourceStaticFollowUpPromptCardId ===
        sourceReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk.summary
          .defaultAnswerSourceCrosswalkContext
          .defaultStaticFollowUpPromptCardId,
    ) ?? staticDecisionCueCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff follow-up readiness answer follow-up review lane and static decision cues",
    localStatus:
      sourceReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk.localStatus,
    summary: {
      followUpReadinessAnswerFollowUpReviewLaneId:
        "candidate-local-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane",
      label:
        "Local observation handoff follow-up readiness answer follow-up review lane",
      summary:
        "A static answer follow-up review lane derives from Stage 70 answer-source crosswalk rows and static follow-up prompt cards so reviewers can scan source-ready, gap-focused, deferred-scope, and handoff-context follow-up prompts before the next human review pass without saved reviewer answers, saved answer drafts, saved answer-source crosswalk state, saved follow-up prompts, saved follow-up lane state, saved decision cues, routes, exports, signoff, audit retention, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, persistence, or production handoff semantics.",
      defaultAnswerFollowUpReviewLaneContext: {
        defaultAnswerFollowUpReviewLaneRowId:
          defaultAnswerFollowUpReviewLaneRow
            .followUpReadinessAnswerFollowUpReviewLaneRowId,
        defaultAnswerSourceCrosswalkRowId:
          defaultAnswerFollowUpReviewLaneRow.sourceAnswerSourceCrosswalkRowId,
        defaultAnswerWalkthroughStepId:
          defaultAnswerFollowUpReviewLaneRow.sourceAnswerWalkthroughStepId,
        defaultAnswerCoverageRowId:
          defaultAnswerFollowUpReviewLaneRow.sourceAnswerCoverageRowId,
        defaultRehearsalPathStepId:
          defaultAnswerFollowUpReviewLaneRow.sourceRehearsalPathStepId,
        defaultReviewBoardRowId:
          defaultAnswerFollowUpReviewLaneRow.sourceReviewBoardRowId,
        defaultFollowUpReadinessBriefRowId:
          defaultAnswerFollowUpReviewLaneRow.followUpReadinessBriefRowId,
        defaultFollowUpTriageRowId:
          defaultAnswerFollowUpReviewLaneRow
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        defaultSynthesisRowId:
          defaultAnswerFollowUpReviewLaneRow
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
        defaultReviewLaneRowId:
          defaultAnswerFollowUpReviewLaneRow
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        defaultReadinessBriefRowId:
          defaultAnswerFollowUpReviewLaneRow
            .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        defaultReviewPathStepId:
          defaultAnswerFollowUpReviewLaneRow
            .sourceReadinessResponseTraceCoverageReviewPathStepId,
        defaultCoverageRowId:
          defaultAnswerFollowUpReviewLaneRow
            .sourceReadinessResponseTraceCoverageRowId,
        defaultTraceRowId:
          defaultAnswerFollowUpReviewLaneRow.sourceReadinessResponseTraceRowId,
        defaultStaticDecisionCueCardId:
          defaultStaticDecisionCueCard
            .followUpReadinessAnswerFollowUpReviewLaneStaticDecisionCueCardId,
        defaultStaticFollowUpPromptCardId:
          defaultStaticDecisionCueCard.sourceStaticFollowUpPromptCardId,
        defaultStaticReviewNoteCardId:
          defaultStaticDecisionCueCard.sourceStaticReviewNoteCardId,
        defaultStaticReviewerCheckPromptCardId:
          defaultStaticDecisionCueCard.sourceStaticReviewerCheckPromptCardId,
        defaultStaticAnswerPrepPromptCardId:
          defaultStaticDecisionCueCard.sourceStaticAnswerPrepPromptCardId,
        defaultStaticQuestionPromptCardId:
          defaultStaticDecisionCueCard.sourceStaticQuestionPromptCardId,
        defaultStaticReviewerPromptCardId:
          defaultStaticDecisionCueCard.followUpReadinessBriefStaticReviewerPromptCardId,
        defaultStaticCheckPromptCardId:
          defaultStaticDecisionCueCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
        defaultStaticFollowUpNoteCardId:
          defaultStaticDecisionCueCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
        defaultStaticHumanCheckPromptCardId:
          defaultStaticDecisionCueCard
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
        defaultStaticReviewerCueCardId:
          defaultStaticDecisionCueCard
            .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
        defaultStaticHandoffPromptCardId:
          defaultStaticDecisionCueCard
            .sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
        sourceFollowUpReadinessAnswerSourceCrosswalkSummary:
          sourceReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk
            .summary.summary,
        sourceFollowUpReadinessAnswerSourceCrosswalkDefaultContext:
          sourceReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk
            .summary.defaultAnswerSourceCrosswalkContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        answerFollowUpReviewLaneRows,
        staticDecisionCueCards,
        sourceReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk,
      ),
    },
    defaultAnswerFollowUpReviewLaneRow,
    defaultStaticDecisionCueCard,
    answerFollowUpReviewLaneRows,
    staticDecisionCueCards,
    staticSourceFollowUpReadinessAnswerFollowUpReviewLaneSummary:
      "Stage 71 answer follow-up review lane rows and static decision-cue cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, answer-source crosswalk state, follow-up prompts, follow-up lane state, decision cues, walkthrough state, review notes, reviewer-check prompts, answer coverage state, rehearsal state, review board state, question prompt state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk:
      sourceReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk,
  };
}

function buildAnswerFollowUpReviewLaneRow(
  answerSourceCrosswalkRow: ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkRowView,
  staticFollowUpPromptCards: ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkStaticFollowUpPromptCardView[],
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneRowView {
  const matchedStaticFollowUpPromptCards = staticFollowUpPromptCards.filter(
    (card) =>
      card.matchedAnswerSourceCrosswalkRowIds.includes(
        answerSourceCrosswalkRow.followUpReadinessAnswerSourceCrosswalkRowId,
      ) ||
      answerSourceCrosswalkRow.sourceStaticReviewNoteCardIds.includes(
        card.sourceStaticReviewNoteCardId,
      ),
  );
  const sourceStaticFollowUpPromptCardIds =
    matchedStaticFollowUpPromptCards.map(
      (card) =>
        card.followUpReadinessAnswerSourceCrosswalkStaticFollowUpPromptCardId,
    );
  const laneLabels = buildLaneLabels(
    answerSourceCrosswalkRow,
    matchedStaticFollowUpPromptCards,
  );
  const followUpReadinessAnswerFollowUpReviewLaneRowId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane:${answerSourceCrosswalkRow.followUpReadinessAnswerSourceCrosswalkRowId}`;

  return {
    ...answerSourceCrosswalkRow,
    followUpReadinessAnswerFollowUpReviewLaneRowId,
    followUpReadinessAnswerFollowUpReviewLaneRowOrder:
      answerSourceCrosswalkRow.followUpReadinessAnswerSourceCrosswalkRowOrder,
    sourceAnswerSourceCrosswalkRowId:
      answerSourceCrosswalkRow.followUpReadinessAnswerSourceCrosswalkRowId,
    sourceAnswerSourceCrosswalkRowIds: [
      answerSourceCrosswalkRow.followUpReadinessAnswerSourceCrosswalkRowId,
    ],
    sourceStaticFollowUpPromptCardIds,
    laneLabels,
    answerFollowUpReviewLaneText:
      `Answer follow-up review lane ${followUpReadinessAnswerFollowUpReviewLaneRowId}: inspect Stage 70 crosswalk row ${answerSourceCrosswalkRow.followUpReadinessAnswerSourceCrosswalkRowId}, Stage 70 static follow-up prompt cards ${sourceStaticFollowUpPromptCardIds.join(", ") || "none"}, Stage 69 answer walkthrough step ${answerSourceCrosswalkRow.sourceAnswerWalkthroughStepId}, Stage 69 static review note cards ${answerSourceCrosswalkRow.sourceStaticReviewNoteCardIds.join(", ") || "none"}, Stage 68 answer coverage row ${answerSourceCrosswalkRow.sourceAnswerCoverageRowId}, Stage 68 reviewer-check prompt cards ${answerSourceCrosswalkRow.sourceStaticReviewerCheckPromptCardIds.join(", ") || "none"}, Stage 67 rehearsal path step ${answerSourceCrosswalkRow.sourceRehearsalPathStepId}, Stage 67 static answer-prep prompt cards ${answerSourceCrosswalkRow.sourceStaticAnswerPrepPromptCardIds.join(", ") || "none"}, Stage 66 review board row ${answerSourceCrosswalkRow.sourceReviewBoardRowId}, Stage 66 static question prompt cards ${answerSourceCrosswalkRow.matchedStaticQuestionPromptCardIds.join(", ") || "none"}, Stage 65 brief row ${answerSourceCrosswalkRow.followUpReadinessBriefRowId}, Stage 64 triage row ${answerSourceCrosswalkRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${answerSourceCrosswalkRow.sourceLocalAnchorHrefs.join(", ")}, callbacks ${answerSourceCrosswalkRow.evidenceCallbackIds.join(", ")}, gaps ${answerSourceCrosswalkRow.gapDiscussionPointIds.join(", ")}, deferred reminders ${answerSourceCrosswalkRow.deferredScopeReminderIds.join(", ")}, coverage note "${answerSourceCrosswalkRow.coverageNoteText}", handoff prompt "${answerSourceCrosswalkRow.handoffPromptText}", static follow-up prompt "${answerSourceCrosswalkRow.staticFollowUpPromptText}", and lane labels ${laneLabels.join(", ")} as static manual-review context only.`,
    staticDecisionCueText:
      `Static decision cue for ${followUpReadinessAnswerFollowUpReviewLaneRowId}: compare source-ready, gap-focused, deferred-scope, and handoff-context prompts for Stage 70 crosswalk row ${answerSourceCrosswalkRow.followUpReadinessAnswerSourceCrosswalkRowId} and follow-up prompt cards ${sourceStaticFollowUpPromptCardIds.join(", ") || "none"} without saving reviewer decisions, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static answer follow-up review lane context: manual static decision cues only; no saved reviewer answers, saved answer drafts, saved answer-source crosswalk state, saved follow-up prompts, saved follow-up lane state, saved decision cues, saved walkthrough state, saved review notes, saved reviewer-check prompts, saved answer coverage state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      answerSourceCrosswalkRow.staticNonGoalFlags,
    ),
  };
}

function buildStaticDecisionCueCard(
  staticFollowUpPromptCard: ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkStaticFollowUpPromptCardView,
  answerFollowUpReviewLaneRows: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneRowView[],
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneStaticDecisionCueCardView {
  const sourceStaticFollowUpPromptCardId =
    staticFollowUpPromptCard.followUpReadinessAnswerSourceCrosswalkStaticFollowUpPromptCardId;
  const followUpReadinessAnswerFollowUpReviewLaneStaticDecisionCueCardId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane:static-decision-cue:${sourceStaticFollowUpPromptCardId}`;
  const matchedAnswerFollowUpReviewLaneRows =
    answerFollowUpReviewLaneRows.filter(
      (row) =>
        row.sourceStaticFollowUpPromptCardIds.includes(
          sourceStaticFollowUpPromptCardId,
        ) ||
        staticFollowUpPromptCard.matchedAnswerSourceCrosswalkRowIds.includes(
          row.sourceAnswerSourceCrosswalkRowId,
        ) ||
        row.sourceStaticReviewNoteCardIds.includes(
          staticFollowUpPromptCard.sourceStaticReviewNoteCardId,
        ),
    );
  const laneLabels = unique(
    matchedAnswerFollowUpReviewLaneRows.flatMap((row) => row.laneLabels),
  );

  return {
    ...staticFollowUpPromptCard,
    followUpReadinessAnswerFollowUpReviewLaneStaticDecisionCueCardId,
    followUpReadinessAnswerFollowUpReviewLaneStaticDecisionCueCardIds: [
      followUpReadinessAnswerFollowUpReviewLaneStaticDecisionCueCardId,
    ],
    sourceStaticFollowUpPromptCardId,
    sourceStaticFollowUpPromptCardIds: [sourceStaticFollowUpPromptCardId],
    matchedAnswerFollowUpReviewLaneRowIds:
      matchedAnswerFollowUpReviewLaneRows.map(
        (row) => row.followUpReadinessAnswerFollowUpReviewLaneRowId,
      ),
    staticDecisionCueOrder:
      staticFollowUpPromptCard.staticFollowUpPromptOrder,
    laneLabels,
    staticDecisionCueText:
      `Static decision cue card ${followUpReadinessAnswerFollowUpReviewLaneStaticDecisionCueCardId}: inspect source Stage 70 static follow-up prompt card ${sourceStaticFollowUpPromptCardId}, matched Stage 71 lane rows ${matchedAnswerFollowUpReviewLaneRows.map((row) => row.followUpReadinessAnswerFollowUpReviewLaneRowId).join(", ") || "none"}, matched Stage 70 crosswalk rows ${staticFollowUpPromptCard.matchedAnswerSourceCrosswalkRowIds.join(", ") || "none"}, Stage 69 static review note card ${staticFollowUpPromptCard.sourceStaticReviewNoteCardId}, Stage 69 walkthrough steps ${staticFollowUpPromptCard.matchedAnswerWalkthroughStepIds.join(", ") || "none"}, Stage 68 answer coverage rows ${staticFollowUpPromptCard.sourceAnswerCoverageRowIds.join(", ") || "none"}, anchors ${staticFollowUpPromptCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticFollowUpPromptCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticFollowUpPromptCard.gapDiscussionPointIds.join(", ")}, deferred reminders ${staticFollowUpPromptCard.deferredScopeReminderIds.join(", ")}, source follow-up prompt text "${staticFollowUpPromptCard.staticFollowUpPromptText}", and lane labels ${laneLabels.join(", ") || "none"} as static manual-review context only.`,
    staticNonGoalContext:
      "static decision-cue context: manual answer follow-up review lane cues only; no saved reviewer answers, saved answer drafts, saved answer-source crosswalk state, saved follow-up prompts, saved follow-up lane state, saved decision cues, saved walkthrough state, saved review notes, saved reviewer-check prompts, saved answer coverage state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticFollowUpPromptCard.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  answerFollowUpReviewLaneRows: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneRowView[],
  staticDecisionCueCards: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneStaticDecisionCueCardView[],
  sourceReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk: ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkView,
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSummaryView["counts"] {
  const sourceCounts =
    sourceReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk.summary
      .counts;

  return {
    answerFollowUpReviewLaneRowCount: answerFollowUpReviewLaneRows.length,
    staticDecisionCueCardCount: staticDecisionCueCards.length,
    answerSourceCrosswalkRowCount: sourceCounts.answerSourceCrosswalkRowCount,
    staticFollowUpPromptCardCount: sourceCounts.staticFollowUpPromptCardCount,
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
    laneLabelCount: unique(
      answerFollowUpReviewLaneRows.flatMap((row) => row.laneLabels),
    ).length,
    localOnlyAnswerFollowUpReviewLaneRowCount:
      answerFollowUpReviewLaneRows.filter((row) => row.localOnly).length,
    localOnlyStaticDecisionCueCardCount: staticDecisionCueCards.filter(
      (card) => card.localOnly,
    ).length,
    localOnlyAnswerSourceCrosswalkRowCount:
      sourceCounts.localOnlyAnswerSourceCrosswalkRowCount,
    localOnlyStaticFollowUpPromptCardCount:
      sourceCounts.localOnlyStaticFollowUpPromptCardCount,
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

function buildLaneLabels(
  answerSourceCrosswalkRow: ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkRowView,
  matchedStaticFollowUpPromptCards: ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkStaticFollowUpPromptCardView[],
): string[] {
  const labels = ["source-ready follow-up scan"];

  if (
    answerSourceCrosswalkRow.gapDiscussionPointIds.length ||
    matchedStaticFollowUpPromptCards.some(
      (card) => card.gapDiscussionPointIds.length,
    )
  ) {
    labels.push("gap-focused prompt review");
  }

  if (
    answerSourceCrosswalkRow.deferredScopeReminderIds.length ||
    matchedStaticFollowUpPromptCards.some(
      (card) => card.deferredScopeReminderIds.length,
    )
  ) {
    labels.push("deferred-scope boundary check");
  }

  if (
    answerSourceCrosswalkRow.handoffPromptText ||
    answerSourceCrosswalkRow.evidenceCallbackIds.length
  ) {
    labels.push("handoff-context source check");
  }

  return labels;
}

function staticNonGoalFlags(
  sourceFlags: ReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalkStaticNonGoalFlagsView,
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedAnswerFollowUpReviewLaneState: true,
    noSavedFollowUpReviewLaneRows: true,
    noSavedFollowUpLaneState: true,
    noSavedDecisionCues: true,
    noSavedDecisionCueCards: true,
    noSavedDecisionCueState: true,
    noSavedReviewerDecisions: true,
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
