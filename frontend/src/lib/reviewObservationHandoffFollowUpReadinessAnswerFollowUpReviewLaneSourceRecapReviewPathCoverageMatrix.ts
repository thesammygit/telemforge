import type {
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixSummaryView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrix(
  sourceReviewPath:
    | ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathView
    | undefined,
):
  | ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixView
  | undefined {
  if (
    !sourceReviewPath?.reviewPathSteps.length ||
    !sourceReviewPath.staticReviewerCheckCards.length
  ) {
    return undefined;
  }

  const coverageRows = sourceReviewPath.reviewPathSteps.map((reviewPathStep) =>
    buildCoverageRow(reviewPathStep, sourceReviewPath.staticReviewerCheckCards),
  );
  const staticReadinessCueCards = sourceReviewPath.staticReviewerCheckCards.map(
    (staticReviewerCheckCard) =>
      buildStaticReadinessCueCard(staticReviewerCheckCard, coverageRows),
  );
  const defaultCoverageRow =
    coverageRows.find(
      (row) =>
        row.sourceReviewPathStepId ===
        sourceReviewPath.summary.defaultReviewPathContext.defaultReviewPathStepId,
    ) ?? coverageRows[0];
  const defaultStaticReadinessCueCard =
    staticReadinessCueCards.find(
      (card) =>
        card.sourceStaticReviewerCheckCardId ===
        sourceReviewPath.summary.defaultReviewPathContext
          .defaultStaticReviewerCheckCardId,
    ) ?? staticReadinessCueCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage matrix and static readiness cues",
    localStatus: sourceReviewPath.localStatus,
    summary: {
      followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixId:
        "candidate-local-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix",
      label:
        "Local observation handoff follow-up readiness answer follow-up review lane source recap review path coverage matrix",
      summary:
        "A static review-path coverage matrix derives from Stage 73 review-path steps and static reviewer-check cards so reviewers can inspect coverage rows, static readiness cues, Stage 72 source recap and next-pass prompt ids, Stage 71 review-lane and decision-cue ids, Stage 70 crosswalk and prompt ids, Stage 69 walkthrough and review-note ids, Stage 68 coverage and reviewer-check prompt ids, Stage 67 rehearsal and answer-prep ids, Stage 66 board and question ids, Stage 65 brief ids, Stage 64 triage ids, anchors, callbacks, gaps, deferred reminders, lane labels, review-path labels, source recap text, review-path text, reviewer-check text, coverage text, and readiness-cue text before the next human review pass without saved reviewer answers, saved answer drafts, saved reviewer notes, saved recap state, saved review-path state, saved coverage state, saved readiness cues, local storage, routes, exports, signoff, audit retention, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, persistence, or production handoff semantics.",
      defaultCoverageContext: {
        defaultCoverageRowId: defaultCoverageRow.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowId,
        defaultReviewPathStepId: defaultCoverageRow.sourceReviewPathStepId,
        defaultSourceRecapRowId: defaultCoverageRow.sourceSourceRecapRowId,
        defaultAnswerFollowUpReviewLaneRowId:
          defaultCoverageRow.sourceAnswerFollowUpReviewLaneRowId,
        defaultAnswerSourceCrosswalkRowId:
          defaultCoverageRow.sourceAnswerSourceCrosswalkRowId,
        defaultAnswerWalkthroughStepId:
          defaultCoverageRow.sourceAnswerWalkthroughStepId,
        defaultAnswerCoverageRowId: defaultCoverageRow.sourceAnswerCoverageRowId,
        defaultRehearsalPathStepId: defaultCoverageRow.sourceRehearsalPathStepId,
        defaultReviewBoardRowId: defaultCoverageRow.sourceReviewBoardRowId,
        defaultFollowUpReadinessBriefRowId:
          defaultCoverageRow.followUpReadinessBriefRowId,
        defaultFollowUpTriageRowId:
          defaultCoverageRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        defaultSynthesisRowId:
          defaultCoverageRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
        defaultReviewLaneRowId:
          defaultCoverageRow.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        defaultReadinessBriefRowId:
          defaultCoverageRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        defaultCoverageReviewPathStepId:
          defaultCoverageRow.sourceReadinessResponseTraceCoverageReviewPathStepId,
        defaultCoverageRowId: defaultCoverageRow.sourceReadinessResponseTraceCoverageRowId,
        defaultTraceRowId: defaultCoverageRow.sourceReadinessResponseTraceRowId,
        defaultStaticReadinessCueCardId:
          defaultStaticReadinessCueCard.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardId,
        defaultStaticReviewerCheckCardId:
          defaultStaticReadinessCueCard.sourceStaticReviewerCheckCardId,
        defaultStaticNextPassPromptCardId:
          defaultStaticReadinessCueCard.sourceStaticNextPassPromptCardId,
        defaultStaticDecisionCueCardId:
          defaultStaticReadinessCueCard.sourceStaticDecisionCueCardId,
        defaultStaticFollowUpPromptCardId:
          defaultStaticReadinessCueCard.sourceStaticFollowUpPromptCardId,
        defaultStaticReviewNoteCardId:
          defaultStaticReadinessCueCard.sourceStaticReviewNoteCardId,
        defaultStaticReviewerCheckPromptCardId:
          defaultStaticReadinessCueCard.sourceStaticReviewerCheckPromptCardId,
        defaultStaticAnswerPrepPromptCardId:
          defaultStaticReadinessCueCard.sourceStaticAnswerPrepPromptCardId,
        defaultStaticQuestionPromptCardId:
          defaultStaticReadinessCueCard.sourceStaticQuestionPromptCardId,
        defaultStaticReviewerPromptCardId:
          defaultStaticReadinessCueCard.followUpReadinessBriefStaticReviewerPromptCardId,
        defaultStaticCheckPromptCardId:
          defaultStaticReadinessCueCard.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
        defaultStaticFollowUpNoteCardId:
          defaultStaticReadinessCueCard.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
        defaultStaticHumanCheckPromptCardId:
          defaultStaticReadinessCueCard.sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
        defaultStaticReviewerCueCardId:
          defaultStaticReadinessCueCard.sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
        defaultStaticHandoffPromptCardId:
          defaultStaticReadinessCueCard.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathSummary:
          sourceReviewPath.summary.summary,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathDefaultContext:
          sourceReviewPath.summary.defaultReviewPathContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(coverageRows, staticReadinessCueCards, sourceReviewPath),
    },
    defaultCoverageRow,
    defaultStaticReadinessCueCard,
    coverageRows,
    staticReadinessCueCards,
    staticSourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixSummary:
      "Stage 74 review-path coverage rows and static readiness-cue cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, recap state, review-path state, coverage state, readiness cues, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPath:
      sourceReviewPath,
  };
}

function buildCoverageRow(
  reviewPathStep: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepView,
  staticReviewerCheckCards: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardView[],
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowView {
  const matchedStaticReviewerCheckCards = staticReviewerCheckCards.filter((card) =>
    staticReviewerCheckCardMatchesReviewPathStep(card, reviewPathStep),
  );
  const sourceStaticReviewerCheckCardIds = matchedStaticReviewerCheckCards.map(
    (card) =>
      card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardId,
  );
  const coverageLabels = buildCoverageLabels(
    reviewPathStep,
    matchedStaticReviewerCheckCards,
  );
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix:${reviewPathStep.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepId}`;

  return {
    ...reviewPathStep,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowOrder:
      reviewPathStep.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepOrder,
    sourceReviewPathStepId:
      reviewPathStep.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepId,
    sourceReviewPathStepIds: [
      reviewPathStep.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepId,
    ],
    sourceStaticReviewerCheckCardIds,
    coverageLabels,
    coverageText:
      `Coverage matrix row for ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowId}: inspect Stage 73 review-path step ${reviewPathStep.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepId}, Stage 73 static reviewer-check cards ${sourceStaticReviewerCheckCardIds.join(", ") || "none"}, Stage 72 source recap row ${reviewPathStep.sourceSourceRecapRowId}, Stage 72 static next-pass prompt cards ${reviewPathStep.sourceStaticNextPassPromptCardIds.join(", ") || "none"}, Stage 71 review-lane row ${reviewPathStep.sourceAnswerFollowUpReviewLaneRowId}, Stage 71 static decision-cue cards ${reviewPathStep.sourceStaticDecisionCueCardIds.join(", ") || "none"}, Stage 70 crosswalk row ${reviewPathStep.sourceAnswerSourceCrosswalkRowId}, Stage 70 static follow-up prompt cards ${reviewPathStep.sourceStaticFollowUpPromptCardIds.join(", ") || "none"}, Stage 69 walkthrough step ${reviewPathStep.sourceAnswerWalkthroughStepId}, Stage 69 static review note cards ${reviewPathStep.sourceStaticReviewNoteCardIds.join(", ") || "none"}, Stage 68 answer coverage row ${reviewPathStep.sourceAnswerCoverageRowId}, Stage 68 reviewer-check prompt cards ${reviewPathStep.sourceStaticReviewerCheckPromptCardIds.join(", ") || "none"}, Stage 67 rehearsal path step ${reviewPathStep.sourceRehearsalPathStepId}, Stage 67 static answer-prep prompt cards ${reviewPathStep.sourceStaticAnswerPrepPromptCardIds.join(", ") || "none"}, Stage 66 review board row ${reviewPathStep.sourceReviewBoardRowId}, Stage 66 static question prompt cards ${reviewPathStep.matchedStaticQuestionPromptCardIds.join(", ") || "none"}, Stage 65 brief row ${reviewPathStep.followUpReadinessBriefRowId}, Stage 64 triage row ${reviewPathStep.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${reviewPathStep.sourceLocalAnchorHrefs.join(", ")}, callbacks ${reviewPathStep.evidenceCallbackIds.join(", ")}, gap prompts ${reviewPathStep.gapDiscussionPointIds.join(", ")}, deferred reminders ${reviewPathStep.deferredScopeReminderIds.join(", ")}, source recap text "${reviewPathStep.sourceRecapText}", review-path text "${reviewPathStep.reviewPathText}", reviewer-check text "${reviewPathStep.staticReviewerCheckText}", coverage labels ${coverageLabels.join(", ") || "none"}, and deterministic manual-review context only.`,
    readinessCueText:
      `Readiness cue for ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowId}: compare Stage 73 reviewer-check cards ${sourceStaticReviewerCheckCardIds.join(", ") || "none"}, Stage 72 static next-pass prompt cards ${reviewPathStep.sourceStaticNextPassPromptCardIds.join(", ") || "none"}, Stage 71 static decision-cue cards ${reviewPathStep.sourceStaticDecisionCueCardIds.join(", ") || "none"}, Stage 70 static follow-up prompt cards ${reviewPathStep.sourceStaticFollowUpPromptCardIds.join(", ") || "none"}, Stage 69 static review note cards ${reviewPathStep.sourceStaticReviewNoteCardIds.join(", ") || "none"}, anchors ${reviewPathStep.sourceLocalAnchorHrefs.join(", ")}, callbacks ${reviewPathStep.evidenceCallbackIds.join(", ")}, gap prompts ${reviewPathStep.gapDiscussionPointIds.join(", ")}, deferred reminders ${reviewPathStep.deferredScopeReminderIds.join(", ")}, review-path labels ${reviewPathStep.reviewPathLabels.join(", ") || "none"}, coverage labels ${coverageLabels.join(", ") || "none"}, and deterministic manual-review context only without saving reviewer answers, saved answer drafts, saved reviewer notes, saved recap state, saved review-path state, saved coverage state, saved readiness cues, local storage, routes, exports, signoff, audit retention, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, persistence, or production handoff semantics.`,
    staticNonGoalContext:
      "Static review-path coverage matrix context: manual coverage rows and readiness cues only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved recap state, saved review-path state, saved coverage state, saved readiness cues, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(reviewPathStep.staticNonGoalFlags),
  };
}

function buildStaticReadinessCueCard(
  staticReviewerCheckCard: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardView,
  coverageRows: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowView[],
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardView {
  const sourceStaticReviewerCheckCardId =
    staticReviewerCheckCard.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardId;
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix:static-readiness-cue:${sourceStaticReviewerCheckCardId}`;
  const matchedCoverageRows = coverageRows.filter((row) =>
    staticReadinessCueCardMatchesCoverageRow(staticReviewerCheckCard, row),
  );
  const readinessCueLabels = buildReadinessCueLabels(
    staticReviewerCheckCard,
    matchedCoverageRows,
  );

  return {
    ...staticReviewerCheckCard,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardIds:
      [
        followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardId,
      ],
    sourceStaticReviewerCheckCardId,
    sourceStaticReviewerCheckCardIds: [sourceStaticReviewerCheckCardId],
    matchedCoverageRowIds: matchedCoverageRows.map(
      (row) =>
        row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowId,
    ),
    staticReadinessCueOrder: staticReviewerCheckCard.staticReviewerCheckOrder,
    readinessCueLabels,
    staticReadinessCueText:
      `Static readiness cue card ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardId}: inspect Stage 73 reviewer-check card ${sourceStaticReviewerCheckCardId}, matched coverage rows ${matchedCoverageRows.map((row) => row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowId).join(", ") || "none"}, Stage 72 static next-pass prompt card ${staticReviewerCheckCard.sourceStaticNextPassPromptCardId}, Stage 71 static decision-cue card ${staticReviewerCheckCard.sourceStaticDecisionCueCardId}, Stage 70 static follow-up prompt card ${staticReviewerCheckCard.sourceStaticFollowUpPromptCardId}, Stage 69 static review note card ${staticReviewerCheckCard.sourceStaticReviewNoteCardId}, anchors ${staticReviewerCheckCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticReviewerCheckCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticReviewerCheckCard.gapDiscussionPointIds.join(", ")}, deferred reminders ${staticReviewerCheckCard.deferredScopeReminderIds.join(", ")}, review-path labels ${staticReviewerCheckCard.reviewPathLabels.join(", ") || "none"}, readiness-cue labels ${readinessCueLabels.join(", ") || "none"}, and carried static reviewer-check text as local static readiness context only.`,
    staticNonGoalContext:
      "Static readiness cue context: manual readiness cues only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved recap state, saved review-path state, saved coverage state, saved readiness cues, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(staticReviewerCheckCard.staticNonGoalFlags),
  };
}

function buildCounts(
  coverageRows: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowView[],
  staticReadinessCueCards: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardView[],
  sourceReviewPath: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathView,
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixSummaryView["counts"] {
  const sourceCounts = sourceReviewPath.summary.counts;

  return {
    coverageRowCount: coverageRows.length,
    staticReadinessCueCardCount: staticReadinessCueCards.length,
    reviewPathStepCount: sourceCounts.reviewPathStepCount,
    staticReviewerCheckCardCount: sourceCounts.staticReviewerCheckCardCount,
    sourceRecapRowCount: sourceCounts.sourceRecapRowCount,
    staticNextPassPromptCardCount: sourceCounts.staticNextPassPromptCardCount,
    answerFollowUpReviewLaneRowCount: sourceCounts.answerFollowUpReviewLaneRowCount,
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
    staticHandoffPromptCardCount: sourceCounts.staticHandoffPromptCardCount,
    responseTraceRowCount: sourceCounts.responseTraceRowCount,
    responseWalkthroughStepCount: sourceCounts.responseWalkthroughStepCount,
    responseRowCount: sourceCounts.responseRowCount,
    questionRowCount: sourceCounts.questionRowCount,
    sourceAnchorCount: sourceCounts.sourceAnchorCount,
    evidenceCallbackCount: sourceCounts.evidenceCallbackCount,
    gapDiscussionPointCount: sourceCounts.gapDiscussionPointCount,
    deferredScopeReminderCount: sourceCounts.deferredScopeReminderCount,
    laneLabelCount: sourceCounts.laneLabelCount,
    sourceRecapLabelCount: sourceCounts.sourceRecapLabelCount,
    reviewPathLabelCount: sourceCounts.reviewPathLabelCount,
    coverageLabelCount: unique(coverageRows.flatMap((row) => row.coverageLabels)).length,
    readinessCueLabelCount: unique(
      staticReadinessCueCards.flatMap((card) => card.readinessCueLabels),
    ).length,
    localOnlyCoverageRowCount: coverageRows.filter((row) => row.localOnly).length,
    localOnlyStaticReadinessCueCardCount: staticReadinessCueCards.filter(
      (card) => card.localOnly,
    ).length,
    localOnlyReviewPathStepCount: sourceCounts.localOnlyReviewPathStepCount,
    localOnlyStaticReviewerCheckCardCount:
      sourceCounts.localOnlyStaticReviewerCheckCardCount,
    localOnlySourceRecapRowCount: sourceCounts.localOnlySourceRecapRowCount,
    localOnlyStaticNextPassPromptCardCount:
      sourceCounts.localOnlyStaticNextPassPromptCardCount,
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

function buildCoverageLabels(
  reviewPathStep: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepView,
  matchedStaticReviewerCheckCards: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardView[],
): string[] {
  const labels = ["review-path coverage row"];

  if (matchedStaticReviewerCheckCards.length) {
    labels.push("static reviewer-check readiness cue");
  }

  if (
    reviewPathStep.sourceLocalAnchorHrefs.length ||
    matchedStaticReviewerCheckCards.some((card) => card.sourceLocalAnchorHrefs.length)
  ) {
    labels.push("anchor and callback coverage");
  }

  if (
    reviewPathStep.gapDiscussionPointIds.length ||
    reviewPathStep.deferredScopeReminderIds.length ||
    matchedStaticReviewerCheckCards.some(
      (card) =>
        card.gapDiscussionPointIds.length || card.deferredScopeReminderIds.length,
    )
  ) {
    labels.push("gap and deferred-reminder coverage");
  }

  if (
    reviewPathStep.sourceRecapLabels.length ||
    matchedStaticReviewerCheckCards.some((card) => card.sourceRecapLabels.length)
  ) {
    labels.push("source-recap carry-forward coverage");
  }

  if (
    reviewPathStep.reviewPathLabels.length ||
    matchedStaticReviewerCheckCards.some((card) => card.reviewPathLabels.length)
  ) {
    labels.push("review-path source alignment");
  }

  return labels;
}

function buildReadinessCueLabels(
  staticReviewerCheckCard: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardView,
  matchedCoverageRows: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowView[],
): string[] {
  const labels = ["static readiness cue", "review-path source alignment"];

  if (matchedCoverageRows.length) {
    labels.push("coverage-row carry-forward cue");
  }

  if (matchedCoverageRows.some((row) => row.sourceRecapLabels.length)) {
    labels.push("source-recap readiness cue");
  }

  if (
    staticReviewerCheckCard.sourceLocalAnchorHrefs.length ||
    staticReviewerCheckCard.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback readiness cue");
  }

  if (
    staticReviewerCheckCard.gapDiscussionPointIds.length ||
    staticReviewerCheckCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder readiness cue");
  }

  return labels;
}

function staticReviewerCheckCardMatchesReviewPathStep(
  staticReviewerCheckCard: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardView,
  reviewPathStep: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepView,
): boolean {
  return (
    staticReviewerCheckCard.matchedReviewPathStepIds.includes(
      reviewPathStep.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepId,
    ) ||
    staticReviewerCheckCard.matchedSourceRecapRowIds.includes(
      reviewPathStep.sourceSourceRecapRowId,
    ) ||
    staticReviewerCheckCard.matchedAnswerFollowUpReviewLaneRowIds.includes(
      reviewPathStep.sourceAnswerFollowUpReviewLaneRowId,
    ) ||
    staticReviewerCheckCard.matchedAnswerSourceCrosswalkRowIds.includes(
      reviewPathStep.sourceAnswerSourceCrosswalkRowId,
    )
  );
}

function staticReadinessCueCardMatchesCoverageRow(
  staticReviewerCheckCard: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardView,
  coverageRow: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowView,
): boolean {
  return (
    staticReviewerCheckCard.matchedReviewPathStepIds.includes(
      coverageRow.sourceReviewPathStepId,
    ) ||
    staticReviewerCheckCard.matchedSourceRecapRowIds.includes(
      coverageRow.sourceSourceRecapRowId,
    ) ||
    staticReviewerCheckCard.matchedAnswerFollowUpReviewLaneRowIds.includes(
      coverageRow.sourceAnswerFollowUpReviewLaneRowId,
    ) ||
    staticReviewerCheckCard.matchedAnswerSourceCrosswalkRowIds.includes(
      coverageRow.sourceAnswerSourceCrosswalkRowId,
    )
  );
}

function staticNonGoalFlags(
  sourceFlags: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticNonGoalFlagsView,
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedCoverageState: true,
    noSavedCoverageRows: true,
    noSavedCoverageMatrix: true,
    noSavedReadinessCues: true,
    noSavedReadinessCueCards: true,
    noSavedReadinessCueState: true,
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
