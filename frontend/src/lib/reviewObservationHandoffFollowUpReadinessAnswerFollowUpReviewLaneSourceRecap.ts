import type {
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneRowView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapRowView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapSummaryView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneStaticDecisionCueCardView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap(
  sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane:
    | ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneView
    | undefined,
):
  | ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapView
  | undefined {
  if (
    !sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane
      ?.answerFollowUpReviewLaneRows.length ||
    !sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane
      .staticDecisionCueCards.length
  ) {
    return undefined;
  }

  const sourceRecapRows =
    sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane.answerFollowUpReviewLaneRows.map(
      (answerFollowUpReviewLaneRow) =>
        buildSourceRecapRow(
          answerFollowUpReviewLaneRow,
          sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane
            .staticDecisionCueCards,
        ),
    );
  const staticNextPassPromptCards =
    sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane.staticDecisionCueCards.map(
      (staticDecisionCueCard) =>
        buildStaticNextPassPromptCard(staticDecisionCueCard, sourceRecapRows),
    );
  const defaultSourceRecapRow =
    sourceRecapRows.find(
      (row) =>
        row.sourceAnswerFollowUpReviewLaneRowId ===
        sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane
          .summary.defaultAnswerFollowUpReviewLaneContext
          .defaultAnswerFollowUpReviewLaneRowId,
    ) ?? sourceRecapRows[0];
  const defaultStaticNextPassPromptCard =
    staticNextPassPromptCards.find(
      (card) =>
        card.sourceStaticDecisionCueCardId ===
        sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane
          .summary.defaultAnswerFollowUpReviewLaneContext
          .defaultStaticDecisionCueCardId,
    ) ?? staticNextPassPromptCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap and static next-pass prompts",
    localStatus:
      sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane.localStatus,
    summary: {
      followUpReadinessAnswerFollowUpReviewLaneSourceRecapId:
        "candidate-local-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap",
      label:
        "Local observation handoff follow-up readiness answer follow-up review lane source recap",
      summary:
        "A static source recap derives from Stage 71 answer follow-up review lane rows and static decision-cue cards so reviewers can scan source-backed cues, gap-focused recap rows, deferred-scope reminders, and static next-pass prompts before the next human review pass without saved reviewer answers, saved answer drafts, saved follow-up lane state, saved source recap state, saved next-pass prompts, routes, exports, signoff, audit retention, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, persistence, or production handoff semantics.",
      defaultSourceRecapContext: {
        defaultSourceRecapRowId:
          defaultSourceRecapRow
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowId,
        defaultAnswerFollowUpReviewLaneRowId:
          defaultSourceRecapRow.sourceAnswerFollowUpReviewLaneRowId,
        defaultAnswerSourceCrosswalkRowId:
          defaultSourceRecapRow.sourceAnswerSourceCrosswalkRowId,
        defaultAnswerWalkthroughStepId:
          defaultSourceRecapRow.sourceAnswerWalkthroughStepId,
        defaultAnswerCoverageRowId:
          defaultSourceRecapRow.sourceAnswerCoverageRowId,
        defaultRehearsalPathStepId:
          defaultSourceRecapRow.sourceRehearsalPathStepId,
        defaultReviewBoardRowId: defaultSourceRecapRow.sourceReviewBoardRowId,
        defaultFollowUpReadinessBriefRowId:
          defaultSourceRecapRow.followUpReadinessBriefRowId,
        defaultFollowUpTriageRowId:
          defaultSourceRecapRow
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        defaultSynthesisRowId:
          defaultSourceRecapRow
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
        defaultReviewLaneRowId:
          defaultSourceRecapRow
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        defaultReadinessBriefRowId:
          defaultSourceRecapRow
            .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        defaultReviewPathStepId:
          defaultSourceRecapRow
            .sourceReadinessResponseTraceCoverageReviewPathStepId,
        defaultCoverageRowId:
          defaultSourceRecapRow.sourceReadinessResponseTraceCoverageRowId,
        defaultTraceRowId:
          defaultSourceRecapRow.sourceReadinessResponseTraceRowId,
        defaultStaticNextPassPromptCardId:
          defaultStaticNextPassPromptCard
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardId,
        defaultStaticDecisionCueCardId:
          defaultStaticNextPassPromptCard.sourceStaticDecisionCueCardId,
        defaultStaticFollowUpPromptCardId:
          defaultStaticNextPassPromptCard.sourceStaticFollowUpPromptCardId,
        defaultStaticReviewNoteCardId:
          defaultStaticNextPassPromptCard.sourceStaticReviewNoteCardId,
        defaultStaticReviewerCheckPromptCardId:
          defaultStaticNextPassPromptCard.sourceStaticReviewerCheckPromptCardId,
        defaultStaticAnswerPrepPromptCardId:
          defaultStaticNextPassPromptCard.sourceStaticAnswerPrepPromptCardId,
        defaultStaticQuestionPromptCardId:
          defaultStaticNextPassPromptCard.sourceStaticQuestionPromptCardId,
        defaultStaticReviewerPromptCardId:
          defaultStaticNextPassPromptCard.followUpReadinessBriefStaticReviewerPromptCardId,
        defaultStaticCheckPromptCardId:
          defaultStaticNextPassPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
        defaultStaticFollowUpNoteCardId:
          defaultStaticNextPassPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
        defaultStaticHumanCheckPromptCardId:
          defaultStaticNextPassPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
        defaultStaticReviewerCueCardId:
          defaultStaticNextPassPromptCard
            .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
        defaultStaticHandoffPromptCardId:
          defaultStaticNextPassPromptCard
            .sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSummary:
          sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane
            .summary.summary,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneDefaultContext:
          sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane
            .summary.defaultAnswerFollowUpReviewLaneContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        sourceRecapRows,
        staticNextPassPromptCards,
        sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane,
      ),
    },
    defaultSourceRecapRow,
    defaultStaticNextPassPromptCard,
    sourceRecapRows,
    staticNextPassPromptCards,
    staticSourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapSummary:
      "Stage 72 answer follow-up review lane source recap rows and static next-pass prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, answer-source crosswalk state, follow-up prompts, follow-up lane state, source recap state, next-pass prompts, decision cues, walkthrough state, review notes, reviewer-check prompts, answer coverage state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane:
      sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane,
  };
}

function buildSourceRecapRow(
  answerFollowUpReviewLaneRow: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneRowView,
  staticDecisionCueCards: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneStaticDecisionCueCardView[],
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapRowView {
  const matchedStaticDecisionCueCards = staticDecisionCueCards.filter((card) =>
    staticDecisionCueCardMatchesAnswerFollowUpReviewLaneRow(
      card,
      answerFollowUpReviewLaneRow,
    ),
  );
  const sourceStaticDecisionCueCardIds = matchedStaticDecisionCueCards.map(
    (card) =>
      card.followUpReadinessAnswerFollowUpReviewLaneStaticDecisionCueCardId,
  );
  const sourceRecapLabels = buildSourceRecapLabels(
    answerFollowUpReviewLaneRow,
    matchedStaticDecisionCueCards,
  );
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap:${answerFollowUpReviewLaneRow.followUpReadinessAnswerFollowUpReviewLaneRowId}`;

  return {
    ...answerFollowUpReviewLaneRow,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowOrder:
      answerFollowUpReviewLaneRow
        .followUpReadinessAnswerFollowUpReviewLaneRowOrder,
    sourceAnswerFollowUpReviewLaneRowId:
      answerFollowUpReviewLaneRow
        .followUpReadinessAnswerFollowUpReviewLaneRowId,
    sourceAnswerFollowUpReviewLaneRowIds: [
      answerFollowUpReviewLaneRow
        .followUpReadinessAnswerFollowUpReviewLaneRowId,
    ],
    sourceStaticDecisionCueCardIds,
    sourceRecapLabels,
    sourceRecapText:
      `Source recap for ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowId}: carry Stage 71 review-lane row ${answerFollowUpReviewLaneRow.followUpReadinessAnswerFollowUpReviewLaneRowId}, Stage 71 static decision-cue cards ${sourceStaticDecisionCueCardIds.join(", ") || "none"}, Stage 70 crosswalk row ${answerFollowUpReviewLaneRow.sourceAnswerSourceCrosswalkRowId}, Stage 70 static follow-up prompt cards ${answerFollowUpReviewLaneRow.sourceStaticFollowUpPromptCardIds.join(", ") || "none"}, Stage 69 walkthrough step ${answerFollowUpReviewLaneRow.sourceAnswerWalkthroughStepId}, Stage 69 static review note cards ${answerFollowUpReviewLaneRow.sourceStaticReviewNoteCardIds.join(", ") || "none"}, Stage 68 answer coverage row ${answerFollowUpReviewLaneRow.sourceAnswerCoverageRowId}, Stage 68 reviewer-check prompt cards ${answerFollowUpReviewLaneRow.sourceStaticReviewerCheckPromptCardIds.join(", ") || "none"}, Stage 67 rehearsal path step ${answerFollowUpReviewLaneRow.sourceRehearsalPathStepId}, Stage 67 static answer-prep prompt cards ${answerFollowUpReviewLaneRow.sourceStaticAnswerPrepPromptCardIds.join(", ") || "none"}, Stage 66 review board row ${answerFollowUpReviewLaneRow.sourceReviewBoardRowId}, Stage 66 static question prompt cards ${answerFollowUpReviewLaneRow.matchedStaticQuestionPromptCardIds.join(", ") || "none"}, Stage 65 brief row ${answerFollowUpReviewLaneRow.followUpReadinessBriefRowId}, Stage 64 triage row ${answerFollowUpReviewLaneRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${answerFollowUpReviewLaneRow.sourceLocalAnchorHrefs.join(", ")}, callbacks ${answerFollowUpReviewLaneRow.evidenceCallbackIds.join(", ")}, gaps ${answerFollowUpReviewLaneRow.gapDiscussionPointIds.join(", ")}, deferred reminders ${answerFollowUpReviewLaneRow.deferredScopeReminderIds.join(", ")}, lane labels ${answerFollowUpReviewLaneRow.laneLabels.join(", ")}, static decision cue "${answerFollowUpReviewLaneRow.staticDecisionCueText}", and source recap labels ${sourceRecapLabels.join(", ")} as local manual-review context only.`,
    staticNextPassPromptText:
      `Static next-pass prompt for ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowId}: review Stage 71 lane row ${answerFollowUpReviewLaneRow.followUpReadinessAnswerFollowUpReviewLaneRowId}, decision-cue cards ${sourceStaticDecisionCueCardIds.join(", ") || "none"}, Stage 70 crosswalk row ${answerFollowUpReviewLaneRow.sourceAnswerSourceCrosswalkRowId}, and source recap labels ${sourceRecapLabels.join(", ")} before the next pass without saving reviewer answers, answer drafts, follow-up lane state, source recap state, next-pass prompts, decisions, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static answer follow-up review lane source recap context: manual source-backed recap and static next-pass prompts only; no saved reviewer answers, saved answer drafts, saved answer-source crosswalk state, saved follow-up prompts, saved follow-up lane state, saved source recap state, saved next-pass prompts, saved decision cues, saved walkthrough state, saved review notes, saved reviewer-check prompts, saved answer coverage state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      answerFollowUpReviewLaneRow.staticNonGoalFlags,
    ),
  };
}

function buildStaticNextPassPromptCard(
  staticDecisionCueCard: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneStaticDecisionCueCardView,
  sourceRecapRows: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapRowView[],
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardView {
  const sourceStaticDecisionCueCardId =
    staticDecisionCueCard.followUpReadinessAnswerFollowUpReviewLaneStaticDecisionCueCardId;
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap:static-next-pass-prompt:${sourceStaticDecisionCueCardId}`;
  const matchedSourceRecapRows = sourceRecapRows.filter((row) =>
    sourceRecapRowMatchesStaticDecisionCueCard(row, staticDecisionCueCard),
  );
  const sourceRecapLabels = unique(
    matchedSourceRecapRows.flatMap((row) => row.sourceRecapLabels),
  );

  return {
    ...staticDecisionCueCard,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardIds:
      [
        followUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardId,
      ],
    sourceStaticDecisionCueCardId,
    sourceStaticDecisionCueCardIds: [sourceStaticDecisionCueCardId],
    matchedSourceRecapRowIds: matchedSourceRecapRows.map(
      (row) =>
        row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowId,
    ),
    staticNextPassPromptOrder: staticDecisionCueCard.staticDecisionCueOrder,
    sourceRecapLabels,
    staticNextPassPromptText:
      `Static next-pass prompt card ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardId}: inspect source Stage 71 static decision-cue card ${sourceStaticDecisionCueCardId}, matched Stage 72 source recap rows ${matchedSourceRecapRows.map((row) => row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowId).join(", ") || "none"}, matched Stage 71 lane rows ${staticDecisionCueCard.matchedAnswerFollowUpReviewLaneRowIds.join(", ") || "none"}, Stage 70 static follow-up prompt card ${staticDecisionCueCard.sourceStaticFollowUpPromptCardId}, Stage 70 crosswalk rows ${staticDecisionCueCard.matchedAnswerSourceCrosswalkRowIds.join(", ") || "none"}, Stage 69 static review note card ${staticDecisionCueCard.sourceStaticReviewNoteCardId}, Stage 69 walkthrough steps ${staticDecisionCueCard.matchedAnswerWalkthroughStepIds.join(", ") || "none"}, Stage 68 answer coverage rows ${staticDecisionCueCard.sourceAnswerCoverageRowIds.join(", ") || "none"}, anchors ${staticDecisionCueCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticDecisionCueCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticDecisionCueCard.gapDiscussionPointIds.join(", ")}, deferred reminders ${staticDecisionCueCard.deferredScopeReminderIds.join(", ")}, lane labels ${staticDecisionCueCard.laneLabels.join(", ") || "none"}, static decision cue text "${staticDecisionCueCard.staticDecisionCueText}", and source recap labels ${sourceRecapLabels.join(", ") || "none"} as local static next-pass prompt context only.`,
    staticNonGoalContext:
      "static next-pass prompt context: manual source recap prompts only; no saved reviewer answers, saved answer drafts, saved follow-up lane state, saved source recap state, saved next-pass prompts, saved decision cues, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticDecisionCueCard.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  sourceRecapRows: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapRowView[],
  staticNextPassPromptCards: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardView[],
  sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneView,
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapSummaryView["counts"] {
  const sourceCounts =
    sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane
      .summary.counts;

  return {
    sourceRecapRowCount: sourceRecapRows.length,
    staticNextPassPromptCardCount: staticNextPassPromptCards.length,
    answerFollowUpReviewLaneRowCount:
      sourceCounts.answerFollowUpReviewLaneRowCount,
    staticDecisionCueCardCount: sourceCounts.staticDecisionCueCardCount,
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
    laneLabelCount: sourceCounts.laneLabelCount,
    sourceRecapLabelCount: unique(
      sourceRecapRows.flatMap((row) => row.sourceRecapLabels),
    ).length,
    localOnlySourceRecapRowCount: sourceRecapRows.filter((row) => row.localOnly)
      .length,
    localOnlyStaticNextPassPromptCardCount: staticNextPassPromptCards.filter(
      (card) => card.localOnly,
    ).length,
    localOnlyAnswerFollowUpReviewLaneRowCount:
      sourceCounts.localOnlyAnswerFollowUpReviewLaneRowCount,
    localOnlyStaticDecisionCueCardCount:
      sourceCounts.localOnlyStaticDecisionCueCardCount,
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

function buildSourceRecapLabels(
  answerFollowUpReviewLaneRow: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneRowView,
  matchedStaticDecisionCueCards: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneStaticDecisionCueCardView[],
): string[] {
  const labels = ["source-backed lane recap"];

  if (
    answerFollowUpReviewLaneRow.gapDiscussionPointIds.length ||
    matchedStaticDecisionCueCards.some((card) => card.gapDiscussionPointIds.length)
  ) {
    labels.push("gap-focused source recap");
  }

  if (
    answerFollowUpReviewLaneRow.deferredScopeReminderIds.length ||
    matchedStaticDecisionCueCards.some(
      (card) => card.deferredScopeReminderIds.length,
    )
  ) {
    labels.push("deferred-scope next-pass reminder");
  }

  if (
    answerFollowUpReviewLaneRow.laneLabels.length ||
    matchedStaticDecisionCueCards.some((card) => card.laneLabels.length)
  ) {
    labels.push("lane-label carry-forward");
  }

  if (
    answerFollowUpReviewLaneRow.evidenceCallbackIds.length ||
    matchedStaticDecisionCueCards.some((card) => card.evidenceCallbackIds.length)
  ) {
    labels.push("evidence-callback source cue");
  }

  return labels;
}

function staticDecisionCueCardMatchesAnswerFollowUpReviewLaneRow(
  staticDecisionCueCard: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneStaticDecisionCueCardView,
  answerFollowUpReviewLaneRow: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneRowView,
): boolean {
  return (
    staticDecisionCueCard.matchedAnswerFollowUpReviewLaneRowIds.includes(
      answerFollowUpReviewLaneRow
        .followUpReadinessAnswerFollowUpReviewLaneRowId,
    ) ||
    staticDecisionCueCard.matchedAnswerSourceCrosswalkRowIds.includes(
      answerFollowUpReviewLaneRow.sourceAnswerSourceCrosswalkRowId,
    ) ||
    answerFollowUpReviewLaneRow.sourceStaticFollowUpPromptCardIds.includes(
      staticDecisionCueCard.sourceStaticFollowUpPromptCardId,
    )
  );
}

function sourceRecapRowMatchesStaticDecisionCueCard(
  sourceRecapRow: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapRowView,
  staticDecisionCueCard: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneStaticDecisionCueCardView,
): boolean {
  return (
    sourceRecapRow.sourceStaticDecisionCueCardIds.includes(
      staticDecisionCueCard
        .followUpReadinessAnswerFollowUpReviewLaneStaticDecisionCueCardId,
    ) ||
    staticDecisionCueCard.matchedAnswerFollowUpReviewLaneRowIds.includes(
      sourceRecapRow.sourceAnswerFollowUpReviewLaneRowId,
    ) ||
    staticDecisionCueCard.matchedAnswerSourceCrosswalkRowIds.includes(
      sourceRecapRow.sourceAnswerSourceCrosswalkRowId,
    )
  );
}

function staticNonGoalFlags(
  sourceFlags: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneStaticNonGoalFlagsView,
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedSourceRecapState: true,
    noSavedSourceRecapRows: true,
    noSavedSourceRecapPrompts: true,
    noSavedNextPassPrompts: true,
    noSavedNextPassPromptCards: true,
    noSavedNextPassPromptState: true,
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
