import type {
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathSummaryView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapRowView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPath(
  sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap:
    | ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapView
    | undefined,
):
  | ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathView
  | undefined {
  if (
    !sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap
      ?.sourceRecapRows.length ||
    !sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap
      .staticNextPassPromptCards.length
  ) {
    return undefined;
  }

  const reviewPathSteps =
    sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap.sourceRecapRows.map(
      (sourceRecapRow) =>
        buildReviewPathStep(
          sourceRecapRow,
          sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap
            .staticNextPassPromptCards,
        ),
    );
  const staticReviewerCheckCards =
    sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap.staticNextPassPromptCards.map(
      (staticNextPassPromptCard) =>
        buildStaticReviewerCheckCard(staticNextPassPromptCard, reviewPathSteps),
    );
  const defaultReviewPathStep =
    reviewPathSteps.find(
      (step) =>
        step.sourceSourceRecapRowId ===
        sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap
          .summary.defaultSourceRecapContext.defaultSourceRecapRowId,
    ) ?? reviewPathSteps[0];
  const defaultStaticReviewerCheckCard =
    staticReviewerCheckCards.find(
      (card) =>
        card.sourceStaticNextPassPromptCardId ===
        sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap
          .summary.defaultSourceRecapContext.defaultStaticNextPassPromptCardId,
    ) ?? staticReviewerCheckCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review path and static reviewer checks",
    localStatus:
      sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap
        .localStatus,
    summary: {
      followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathId:
        "candidate-local-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path",
      label:
        "Local observation handoff follow-up readiness answer follow-up review lane source recap review path",
      summary:
        "A static source recap review path derives from Stage 72 source-recap rows and static next-pass prompt cards so reviewers can step through recap cues in source order, compare next-pass prompts, and keep deferred production boundaries visible before the next review pass without saved reviewer answers, saved answer drafts, saved reviewer notes, saved recap state, saved review-path state, saved reviewer checks, local storage, routes, exports, signoff, audit retention, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, persistence, or production handoff semantics.",
      defaultReviewPathContext: {
        defaultReviewPathStepId:
          defaultReviewPathStep
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepId,
        defaultSourceRecapRowId:
          defaultReviewPathStep.sourceSourceRecapRowId,
        defaultAnswerFollowUpReviewLaneRowId:
          defaultReviewPathStep.sourceAnswerFollowUpReviewLaneRowId,
        defaultAnswerSourceCrosswalkRowId:
          defaultReviewPathStep.sourceAnswerSourceCrosswalkRowId,
        defaultAnswerWalkthroughStepId:
          defaultReviewPathStep.sourceAnswerWalkthroughStepId,
        defaultAnswerCoverageRowId:
          defaultReviewPathStep.sourceAnswerCoverageRowId,
        defaultRehearsalPathStepId:
          defaultReviewPathStep.sourceRehearsalPathStepId,
        defaultReviewBoardRowId:
          defaultReviewPathStep.sourceReviewBoardRowId,
        defaultFollowUpReadinessBriefRowId:
          defaultReviewPathStep.followUpReadinessBriefRowId,
        defaultFollowUpTriageRowId:
          defaultReviewPathStep
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        defaultSynthesisRowId:
          defaultReviewPathStep
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
        defaultReviewLaneRowId:
          defaultReviewPathStep
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        defaultReadinessBriefRowId:
          defaultReviewPathStep
            .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        defaultCoverageReviewPathStepId:
          defaultReviewPathStep
            .sourceReadinessResponseTraceCoverageReviewPathStepId,
        defaultCoverageRowId:
          defaultReviewPathStep.sourceReadinessResponseTraceCoverageRowId,
        defaultTraceRowId:
          defaultReviewPathStep.sourceReadinessResponseTraceRowId,
        defaultStaticReviewerCheckCardId:
          defaultStaticReviewerCheckCard
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardId,
        defaultStaticNextPassPromptCardId:
          defaultStaticReviewerCheckCard.sourceStaticNextPassPromptCardId,
        defaultStaticDecisionCueCardId:
          defaultStaticReviewerCheckCard.sourceStaticDecisionCueCardId,
        defaultStaticFollowUpPromptCardId:
          defaultStaticReviewerCheckCard.sourceStaticFollowUpPromptCardId,
        defaultStaticReviewNoteCardId:
          defaultStaticReviewerCheckCard.sourceStaticReviewNoteCardId,
        defaultStaticReviewerCheckPromptCardId:
          defaultStaticReviewerCheckCard.sourceStaticReviewerCheckPromptCardId,
        defaultStaticAnswerPrepPromptCardId:
          defaultStaticReviewerCheckCard.sourceStaticAnswerPrepPromptCardId,
        defaultStaticQuestionPromptCardId:
          defaultStaticReviewerCheckCard.sourceStaticQuestionPromptCardId,
        defaultStaticReviewerPromptCardId:
          defaultStaticReviewerCheckCard
            .followUpReadinessBriefStaticReviewerPromptCardId,
        defaultStaticCheckPromptCardId:
          defaultStaticReviewerCheckCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
        defaultStaticFollowUpNoteCardId:
          defaultStaticReviewerCheckCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
        defaultStaticHumanCheckPromptCardId:
          defaultStaticReviewerCheckCard
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
        defaultStaticReviewerCueCardId:
          defaultStaticReviewerCheckCard
            .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
        defaultStaticHandoffPromptCardId:
          defaultStaticReviewerCheckCard
            .sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapSummary:
          sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap
            .summary.summary,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapDefaultContext:
          sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap
            .summary.defaultSourceRecapContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        reviewPathSteps,
        staticReviewerCheckCards,
        sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap,
      ),
    },
    defaultReviewPathStep,
    defaultStaticReviewerCheckCard,
    reviewPathSteps,
    staticReviewerCheckCards,
    staticSourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathSummary:
      "Stage 73 answer follow-up review lane source recap review-path steps and static reviewer-check cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, source recap state, review-path state, reviewer checks, next-pass prompts, decision cues, walkthrough state, review notes, reviewer-check prompts, answer coverage state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap:
      sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap,
  };
}

function buildReviewPathStep(
  sourceRecapRow: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapRowView,
  staticNextPassPromptCards: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardView[],
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepView {
  const matchedStaticNextPassPromptCards = staticNextPassPromptCards.filter(
    (card) => staticNextPassPromptCardMatchesSourceRecapRow(card, sourceRecapRow),
  );
  const sourceStaticNextPassPromptCardIds =
    matchedStaticNextPassPromptCards.map(
      (card) =>
        card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardId,
    );
  const reviewPathLabels = buildReviewPathLabels(
    sourceRecapRow,
    matchedStaticNextPassPromptCards,
  );
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path:${sourceRecapRow.followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowId}`;

  return {
    ...sourceRecapRow,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepOrder:
      sourceRecapRow.followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowOrder,
    sourceSourceRecapRowId:
      sourceRecapRow.followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowId,
    sourceSourceRecapRowIds: [
      sourceRecapRow.followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowId,
    ],
    sourceStaticNextPassPromptCardIds,
    reviewPathLabels,
    reviewPathText:
      `Review path step ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepId}: inspect Stage 72 source recap row ${sourceRecapRow.followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowId}, Stage 72 static next-pass prompt cards ${sourceStaticNextPassPromptCardIds.join(", ") || "none"}, Stage 71 review-lane row ${sourceRecapRow.sourceAnswerFollowUpReviewLaneRowId}, Stage 71 static decision-cue cards ${sourceRecapRow.sourceStaticDecisionCueCardIds.join(", ") || "none"}, Stage 70 crosswalk row ${sourceRecapRow.sourceAnswerSourceCrosswalkRowId}, Stage 70 static follow-up prompt cards ${sourceRecapRow.sourceStaticFollowUpPromptCardIds.join(", ") || "none"}, Stage 69 walkthrough step ${sourceRecapRow.sourceAnswerWalkthroughStepId}, Stage 69 static review note cards ${sourceRecapRow.sourceStaticReviewNoteCardIds.join(", ") || "none"}, Stage 68 answer coverage row ${sourceRecapRow.sourceAnswerCoverageRowId}, Stage 68 reviewer-check prompt cards ${sourceRecapRow.sourceStaticReviewerCheckPromptCardIds.join(", ") || "none"}, Stage 67 rehearsal path step ${sourceRecapRow.sourceRehearsalPathStepId}, Stage 67 static answer-prep prompt cards ${sourceRecapRow.sourceStaticAnswerPrepPromptCardIds.join(", ") || "none"}, Stage 66 review board row ${sourceRecapRow.sourceReviewBoardRowId}, Stage 66 static question prompt cards ${sourceRecapRow.matchedStaticQuestionPromptCardIds.join(", ") || "none"}, Stage 65 brief row ${sourceRecapRow.followUpReadinessBriefRowId}, Stage 64 triage row ${sourceRecapRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${sourceRecapRow.sourceLocalAnchorHrefs.join(", ")}, callbacks ${sourceRecapRow.evidenceCallbackIds.join(", ")}, gap prompts ${sourceRecapRow.gapDiscussionPointIds.join(", ")}, deferred reminders ${sourceRecapRow.deferredScopeReminderIds.join(", ")}, lane labels ${sourceRecapRow.laneLabels.join(", ") || "none"}, carried source recap text, carried static next-pass prompt text, and review-path labels ${reviewPathLabels.join(", ")} as deterministic manual-review context only.`,
    staticReviewerCheckText:
      `Static reviewer check for ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepId}: compare source recap row ${sourceRecapRow.followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowId} with Stage 72 next-pass prompt cards ${sourceStaticNextPassPromptCardIds.join(", ") || "none"} before the next pass without saving reviewer answers, answer drafts, reviewer notes, source recap state, review-path state, reviewer checks, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static source recap review path context: manual review-path steps and static reviewer checks only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved recap state, saved review-path state, saved reviewer checks, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(sourceRecapRow.staticNonGoalFlags),
  };
}

function buildStaticReviewerCheckCard(
  staticNextPassPromptCard: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardView,
  reviewPathSteps: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepView[],
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardView {
  const sourceStaticNextPassPromptCardId =
    staticNextPassPromptCard.followUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardId;
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path:static-reviewer-check:${sourceStaticNextPassPromptCardId}`;
  const matchedReviewPathSteps = reviewPathSteps.filter((step) =>
    reviewPathStepMatchesStaticNextPassPromptCard(step, staticNextPassPromptCard),
  );
  const reviewPathLabels = unique(
    matchedReviewPathSteps.flatMap((step) => step.reviewPathLabels),
  );

  return {
    ...staticNextPassPromptCard,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardIds:
      [
        followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardId,
      ],
    sourceStaticNextPassPromptCardId,
    sourceStaticNextPassPromptCardIds: [sourceStaticNextPassPromptCardId],
    matchedReviewPathStepIds: matchedReviewPathSteps.map(
      (step) =>
        step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepId,
    ),
    staticReviewerCheckOrder:
      staticNextPassPromptCard.staticNextPassPromptOrder,
    reviewPathLabels,
    staticReviewerCheckText:
      `Static reviewer-check card ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardId}: compare Stage 72 static next-pass prompt card ${sourceStaticNextPassPromptCardId}, matched review-path steps ${matchedReviewPathSteps.map((step) => step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepId).join(", ") || "none"}, Stage 72 source recap rows ${staticNextPassPromptCard.matchedSourceRecapRowIds.join(", ") || "none"}, Stage 71 static decision-cue card ${staticNextPassPromptCard.sourceStaticDecisionCueCardId}, Stage 70 static follow-up prompt card ${staticNextPassPromptCard.sourceStaticFollowUpPromptCardId}, Stage 69 static review note card ${staticNextPassPromptCard.sourceStaticReviewNoteCardId}, anchors ${staticNextPassPromptCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticNextPassPromptCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticNextPassPromptCard.gapDiscussionPointIds.join(", ")}, deferred reminders ${staticNextPassPromptCard.deferredScopeReminderIds.join(", ")}, source recap labels ${staticNextPassPromptCard.sourceRecapLabels.join(", ") || "none"}, review-path labels ${reviewPathLabels.join(", ") || "none"}, and carried static next-pass prompt text as local static reviewer-check context only.`,
    staticNonGoalContext:
      "Static reviewer-check card context: manual next-pass comparison only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved source recap state, saved review-path state, saved reviewer checks, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticNextPassPromptCard.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  reviewPathSteps: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepView[],
  staticReviewerCheckCards: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardView[],
  sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapView,
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathSummaryView["counts"] {
  const sourceCounts =
    sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap
      .summary.counts;

  return {
    reviewPathStepCount: reviewPathSteps.length,
    staticReviewerCheckCardCount: staticReviewerCheckCards.length,
    sourceRecapRowCount: sourceCounts.sourceRecapRowCount,
    staticNextPassPromptCardCount: sourceCounts.staticNextPassPromptCardCount,
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
    coverageReviewPathStepCount: sourceCounts.reviewPathStepCount,
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
    sourceRecapLabelCount: sourceCounts.sourceRecapLabelCount,
    reviewPathLabelCount: unique(
      reviewPathSteps.flatMap((step) => step.reviewPathLabels),
    ).length,
    localOnlyReviewPathStepCount: reviewPathSteps.filter((step) => step.localOnly)
      .length,
    localOnlyStaticReviewerCheckCardCount: staticReviewerCheckCards.filter(
      (card) => card.localOnly,
    ).length,
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

function buildReviewPathLabels(
  sourceRecapRow: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapRowView,
  matchedStaticNextPassPromptCards: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardView[],
): string[] {
  const labels = ["source-order review step", "next-pass prompt comparison"];

  if (
    sourceRecapRow.gapDiscussionPointIds.length ||
    matchedStaticNextPassPromptCards.some(
      (card) => card.gapDiscussionPointIds.length,
    )
  ) {
    labels.push("gap-prompt reviewer check");
  }

  if (
    sourceRecapRow.deferredScopeReminderIds.length ||
    matchedStaticNextPassPromptCards.some(
      (card) => card.deferredScopeReminderIds.length,
    )
  ) {
    labels.push("deferred-boundary reviewer check");
  }

  if (
    sourceRecapRow.sourceRecapLabels.length ||
    matchedStaticNextPassPromptCards.some((card) => card.sourceRecapLabels.length)
  ) {
    labels.push("source-recap label carry-forward");
  }

  if (
    sourceRecapRow.evidenceCallbackIds.length ||
    matchedStaticNextPassPromptCards.some(
      (card) => card.evidenceCallbackIds.length,
    )
  ) {
    labels.push("evidence-callback review cue");
  }

  return labels;
}

function staticNextPassPromptCardMatchesSourceRecapRow(
  staticNextPassPromptCard: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardView,
  sourceRecapRow: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapRowView,
): boolean {
  return (
    staticNextPassPromptCard.matchedSourceRecapRowIds.includes(
      sourceRecapRow.followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowId,
    ) ||
    sourceRecapRow.sourceStaticDecisionCueCardIds.includes(
      staticNextPassPromptCard.sourceStaticDecisionCueCardId,
    ) ||
    staticNextPassPromptCard.matchedAnswerFollowUpReviewLaneRowIds.includes(
      sourceRecapRow.sourceAnswerFollowUpReviewLaneRowId,
    ) ||
    staticNextPassPromptCard.matchedAnswerSourceCrosswalkRowIds.includes(
      sourceRecapRow.sourceAnswerSourceCrosswalkRowId,
    )
  );
}

function reviewPathStepMatchesStaticNextPassPromptCard(
  reviewPathStep: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepView,
  staticNextPassPromptCard: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardView,
): boolean {
  return (
    reviewPathStep.sourceStaticNextPassPromptCardIds.includes(
      staticNextPassPromptCard
        .followUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardId,
    ) ||
    staticNextPassPromptCard.matchedSourceRecapRowIds.includes(
      reviewPathStep.sourceSourceRecapRowId,
    ) ||
    staticNextPassPromptCard.matchedAnswerFollowUpReviewLaneRowIds.includes(
      reviewPathStep.sourceAnswerFollowUpReviewLaneRowId,
    ) ||
    staticNextPassPromptCard.matchedAnswerSourceCrosswalkRowIds.includes(
      reviewPathStep.sourceAnswerSourceCrosswalkRowId,
    )
  );
}

function staticNonGoalFlags(
  sourceFlags: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNonGoalFlagsView,
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedReviewPathState: true,
    noSavedReviewPathSteps: true,
    noSavedReviewerChecks: true,
    noSavedReviewerCheckCards: true,
    noSavedReviewerCheckState: true,
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
