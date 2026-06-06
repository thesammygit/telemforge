import type {
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathSummaryView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPath(
  sourceCoverageMatrix:
    | ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixView
    | undefined,
):
  | ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathView
  | undefined {
  if (
    !sourceCoverageMatrix?.coverageRows.length ||
    !sourceCoverageMatrix.staticReadinessCueCards.length
  ) {
    return undefined;
  }

  const coverageReviewPathSteps = sourceCoverageMatrix.coverageRows.map(
    (coverageRow) =>
      buildCoverageReviewPathStep(
        coverageRow,
        sourceCoverageMatrix.staticReadinessCueCards,
      ),
  );
  const staticCoveragePromptCards =
    sourceCoverageMatrix.staticReadinessCueCards.map((staticReadinessCueCard) =>
      buildStaticCoveragePromptCard(
        staticReadinessCueCard,
        coverageReviewPathSteps,
      ),
    );
  const defaultCoverageReviewPathStep =
    coverageReviewPathSteps.find(
      (step) =>
        step.sourceCoverageMatrixRowId ===
        sourceCoverageMatrix.defaultCoverageRow
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowId,
    ) ?? coverageReviewPathSteps[0];
  const defaultStaticCoveragePromptCard =
    staticCoveragePromptCards.find(
      (card) =>
        card.sourceStaticReadinessCueCardId ===
        sourceCoverageMatrix.defaultStaticReadinessCueCard
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardId,
    ) ?? staticCoveragePromptCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix_review_path.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage matrix review path and static coverage prompts",
    localStatus: sourceCoverageMatrix.localStatus,
    summary: {
      followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathId:
        "candidate-local-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path",
      label:
        "Local observation handoff follow-up readiness answer follow-up review lane source recap review path coverage matrix review path",
      summary:
        "A static coverage-review path derives from Stage 74 coverage rows and static readiness-cue cards so reviewers can walk coverage rows, readiness cues, source anchors, callbacks, gap prompts, and deferred reminders in a stable manual-review order before the next human pass without saved reviewer answers, saved answer drafts, saved reviewer notes, saved recap state, saved review-path state, saved coverage state, saved coverage-review state, saved coverage prompts, local storage, routes, exports, signoff, audit retention, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, persistence, or production handoff semantics.",
      defaultCoverageReviewContext: {
        defaultCoverageReviewPathStepId:
          defaultCoverageReviewPathStep
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepId,
        defaultCoverageMatrixRowId:
          defaultCoverageReviewPathStep.sourceCoverageMatrixRowId,
        defaultReviewPathStepId:
          defaultCoverageReviewPathStep.sourceReviewPathStepId,
        defaultSourceRecapRowId:
          defaultCoverageReviewPathStep.sourceSourceRecapRowId,
        defaultAnswerFollowUpReviewLaneRowId:
          defaultCoverageReviewPathStep.sourceAnswerFollowUpReviewLaneRowId,
        defaultAnswerSourceCrosswalkRowId:
          defaultCoverageReviewPathStep.sourceAnswerSourceCrosswalkRowId,
        defaultAnswerWalkthroughStepId:
          defaultCoverageReviewPathStep.sourceAnswerWalkthroughStepId,
        defaultAnswerCoverageRowId:
          defaultCoverageReviewPathStep.sourceAnswerCoverageRowId,
        defaultRehearsalPathStepId:
          defaultCoverageReviewPathStep.sourceRehearsalPathStepId,
        defaultReviewBoardRowId:
          defaultCoverageReviewPathStep.sourceReviewBoardRowId,
        defaultFollowUpReadinessBriefRowId:
          defaultCoverageReviewPathStep.followUpReadinessBriefRowId,
        defaultFollowUpTriageRowId:
          defaultCoverageReviewPathStep
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        defaultSynthesisRowId:
          defaultCoverageReviewPathStep
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
        defaultReviewLaneRowId:
          defaultCoverageReviewPathStep
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        defaultReadinessBriefRowId:
          defaultCoverageReviewPathStep
            .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        defaultCoverageReviewSourcePathStepId:
          defaultCoverageReviewPathStep
            .sourceReadinessResponseTraceCoverageReviewPathStepId,
        defaultSourceCoverageRowId:
          defaultCoverageReviewPathStep.sourceReadinessResponseTraceCoverageRowId,
        defaultTraceRowId:
          defaultCoverageReviewPathStep.sourceReadinessResponseTraceRowId,
        defaultStaticCoveragePromptCardId:
          defaultStaticCoveragePromptCard
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardId,
        defaultStaticReadinessCueCardId:
          defaultStaticCoveragePromptCard.sourceStaticReadinessCueCardId,
        defaultStaticReviewerCheckCardId:
          defaultStaticCoveragePromptCard.sourceStaticReviewerCheckCardId,
        defaultStaticNextPassPromptCardId:
          defaultStaticCoveragePromptCard.sourceStaticNextPassPromptCardId,
        defaultStaticDecisionCueCardId:
          defaultStaticCoveragePromptCard.sourceStaticDecisionCueCardId,
        defaultStaticFollowUpPromptCardId:
          defaultStaticCoveragePromptCard.sourceStaticFollowUpPromptCardId,
        defaultStaticReviewNoteCardId:
          defaultStaticCoveragePromptCard.sourceStaticReviewNoteCardId,
        defaultStaticReviewerCheckPromptCardId:
          defaultStaticCoveragePromptCard.sourceStaticReviewerCheckPromptCardId,
        defaultStaticAnswerPrepPromptCardId:
          defaultStaticCoveragePromptCard.sourceStaticAnswerPrepPromptCardId,
        defaultStaticQuestionPromptCardId:
          defaultStaticCoveragePromptCard.sourceStaticQuestionPromptCardId,
        defaultStaticReviewerPromptCardId:
          defaultStaticCoveragePromptCard
            .followUpReadinessBriefStaticReviewerPromptCardId,
        defaultStaticCheckPromptCardId:
          defaultStaticCoveragePromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
        defaultStaticFollowUpNoteCardId:
          defaultStaticCoveragePromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
        defaultStaticHumanCheckPromptCardId:
          defaultStaticCoveragePromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
        defaultStaticReviewerCueCardId:
          defaultStaticCoveragePromptCard
            .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
        defaultStaticHandoffPromptCardId:
          defaultStaticCoveragePromptCard
            .sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixSummary:
          sourceCoverageMatrix.summary.summary,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixDefaultContext:
          sourceCoverageMatrix.summary.defaultCoverageContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        coverageReviewPathSteps,
        staticCoveragePromptCards,
        sourceCoverageMatrix,
      ),
    },
    defaultCoverageReviewPathStep,
    defaultStaticCoveragePromptCard,
    coverageReviewPathSteps,
    staticCoveragePromptCards,
    staticSourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathSummary:
      "Stage 75 coverage-review path steps and static coverage-prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, source recap state, review-path state, coverage state, coverage-review state, coverage prompts, readiness cues, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrix:
      sourceCoverageMatrix,
  };
}

function buildCoverageReviewPathStep(
  coverageRow: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowView,
  staticReadinessCueCards: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardView[],
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepView {
  const matchedStaticReadinessCueCards = staticReadinessCueCards.filter((card) =>
    staticReadinessCueCardMatchesCoverageRow(card, coverageRow),
  );
  const sourceStaticReadinessCueCardIds = matchedStaticReadinessCueCards.map(
    (card) =>
      card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardId,
  );
  const coverageReviewLabels = buildCoverageReviewLabels(
    coverageRow,
    matchedStaticReadinessCueCards,
  );
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path:${coverageRow.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowId}`;

  return {
    ...coverageRow,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepOrder:
      coverageRow.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowOrder,
    sourceCoverageMatrixRowId:
      coverageRow.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowId,
    sourceCoverageMatrixRowIds: [
      coverageRow.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowId,
    ],
    sourceStaticReadinessCueCardIds,
    coverageReviewLabels,
    coverageReviewText:
      `Coverage-review path step ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepId}: inspect Stage 74 coverage row ${coverageRow.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowId}, Stage 74 static readiness-cue cards ${sourceStaticReadinessCueCardIds.join(", ") || "none"}, Stage 73 review-path step ${coverageRow.sourceReviewPathStepId}, Stage 73 reviewer-check cards ${coverageRow.sourceStaticReviewerCheckCardIds.join(", ") || "none"}, Stage 72 source recap row ${coverageRow.sourceSourceRecapRowId}, Stage 72 static next-pass prompt cards ${coverageRow.sourceStaticNextPassPromptCardIds.join(", ") || "none"}, Stage 71 review-lane row ${coverageRow.sourceAnswerFollowUpReviewLaneRowId}, Stage 71 static decision-cue cards ${coverageRow.sourceStaticDecisionCueCardIds.join(", ") || "none"}, Stage 70 crosswalk row ${coverageRow.sourceAnswerSourceCrosswalkRowId}, Stage 70 static follow-up prompt cards ${coverageRow.sourceStaticFollowUpPromptCardIds.join(", ") || "none"}, Stage 69 walkthrough step ${coverageRow.sourceAnswerWalkthroughStepId}, Stage 69 static review note cards ${coverageRow.sourceStaticReviewNoteCardIds.join(", ") || "none"}, Stage 68 answer coverage row ${coverageRow.sourceAnswerCoverageRowId}, Stage 68 reviewer-check prompt cards ${coverageRow.sourceStaticReviewerCheckPromptCardIds.join(", ") || "none"}, Stage 67 rehearsal path step ${coverageRow.sourceRehearsalPathStepId}, Stage 67 static answer-prep prompt cards ${coverageRow.sourceStaticAnswerPrepPromptCardIds.join(", ") || "none"}, Stage 66 review board row ${coverageRow.sourceReviewBoardRowId}, Stage 66 static question prompt cards ${coverageRow.matchedStaticQuestionPromptCardIds.join(", ") || "none"}, Stage 65 brief row ${coverageRow.followUpReadinessBriefRowId}, Stage 64 triage row ${coverageRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${coverageRow.sourceLocalAnchorHrefs.join(", ")}, callbacks ${coverageRow.evidenceCallbackIds.join(", ")}, gap prompts ${coverageRow.gapDiscussionPointIds.join(", ")}, deferred reminders ${coverageRow.deferredScopeReminderIds.join(", ")}, lane labels ${coverageRow.laneLabels.join(", ") || "none"}, review-path labels ${coverageRow.reviewPathLabels.join(", ") || "none"}, coverage labels ${coverageRow.coverageLabels.join(", ") || "none"}, readiness-cue labels ${matchedStaticReadinessCueCards.flatMap((card) => card.readinessCueLabels).join(", ") || "none"}, source recap text "${coverageRow.sourceRecapText}", review-path text "${coverageRow.reviewPathText}", reviewer-check text "${coverageRow.staticReviewerCheckText}", coverage text "${coverageRow.coverageText}", readiness-cue text "${coverageRow.readinessCueText}", coverage-review labels ${coverageReviewLabels.join(", ") || "none"}, and deterministic manual-review context only.`,
    staticCoveragePromptText:
      `Static coverage prompt for ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepId}: compare Stage 74 coverage row ${coverageRow.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowId} with static readiness-cue cards ${sourceStaticReadinessCueCardIds.join(", ") || "none"}, source anchors ${coverageRow.sourceLocalAnchorHrefs.join(", ")}, callbacks ${coverageRow.evidenceCallbackIds.join(", ")}, gap prompts ${coverageRow.gapDiscussionPointIds.join(", ")}, deferred reminders ${coverageRow.deferredScopeReminderIds.join(", ")}, coverage text "${coverageRow.coverageText}", readiness-cue text "${coverageRow.readinessCueText}", and coverage-review labels ${coverageReviewLabels.join(", ") || "none"} before the next human pass without saving reviewer answers, answer drafts, reviewer notes, recap state, review-path state, coverage state, coverage-review state, coverage prompts, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static coverage-review path context: manual coverage-review steps and static coverage prompts only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved recap state, saved review-path state, saved coverage state, saved readiness cues, saved coverage-review state, saved coverage prompts, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(coverageRow.staticNonGoalFlags),
  };
}

function buildStaticCoveragePromptCard(
  staticReadinessCueCard: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardView,
  coverageReviewPathSteps: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepView[],
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardView {
  const sourceStaticReadinessCueCardId =
    staticReadinessCueCard.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardId;
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path:static-coverage-prompt:${sourceStaticReadinessCueCardId}`;
  const matchedCoverageReviewPathSteps = coverageReviewPathSteps.filter((step) =>
    staticCoveragePromptCardMatchesCoverageReviewPathStep(
      staticReadinessCueCard,
      step,
    ),
  );
  const coverageReviewLabels = buildStaticCoveragePromptLabels(
    staticReadinessCueCard,
    matchedCoverageReviewPathSteps,
  );

  return {
    ...staticReadinessCueCard,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardIds:
      [
        followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardId,
      ],
    sourceStaticReadinessCueCardId,
    sourceStaticReadinessCueCardIds: [sourceStaticReadinessCueCardId],
    matchedCoverageReviewPathStepIds: matchedCoverageReviewPathSteps.map(
      (step) =>
        step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepId,
    ),
    staticCoveragePromptOrder: staticReadinessCueCard.staticReadinessCueOrder,
    coverageReviewLabels,
    staticCoveragePromptText:
      `Static coverage prompt card ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardId}: inspect Stage 74 readiness-cue card ${sourceStaticReadinessCueCardId}, matched coverage-review steps ${matchedCoverageReviewPathSteps.map((step) => step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepId).join(", ") || "none"}, Stage 74 coverage rows ${staticReadinessCueCard.matchedCoverageRowIds.join(", ") || "none"}, Stage 73 reviewer-check card ${staticReadinessCueCard.sourceStaticReviewerCheckCardId}, Stage 72 static next-pass prompt card ${staticReadinessCueCard.sourceStaticNextPassPromptCardId}, Stage 71 static decision-cue card ${staticReadinessCueCard.sourceStaticDecisionCueCardId}, Stage 70 static follow-up prompt card ${staticReadinessCueCard.sourceStaticFollowUpPromptCardId}, Stage 69 static review note card ${staticReadinessCueCard.sourceStaticReviewNoteCardId}, anchors ${staticReadinessCueCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticReadinessCueCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticReadinessCueCard.gapDiscussionPointIds.join(", ")}, deferred reminders ${staticReadinessCueCard.deferredScopeReminderIds.join(", ")}, review-path labels ${staticReadinessCueCard.reviewPathLabels.join(", ") || "none"}, readiness-cue labels ${staticReadinessCueCard.readinessCueLabels.join(", ") || "none"}, coverage-review labels ${coverageReviewLabels.join(", ") || "none"}, and carried static readiness cue text as local static coverage-prompt context only.`,
    staticNonGoalContext:
      "Static coverage-prompt card context: manual coverage-prompt comparison only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved recap state, saved review-path state, saved coverage state, saved readiness cues, saved coverage-review state, saved coverage prompts, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(staticReadinessCueCard.staticNonGoalFlags),
  };
}

function buildCounts(
  coverageReviewPathSteps: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepView[],
  staticCoveragePromptCards: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardView[],
  sourceCoverageMatrix: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixView,
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathSummaryView["counts"] {
  const sourceCounts = sourceCoverageMatrix.summary.counts;

  return {
    coverageReviewPathStepCount: coverageReviewPathSteps.length,
    staticCoveragePromptCardCount: staticCoveragePromptCards.length,
    coverageMatrixRowCount: sourceCounts.coverageRowCount,
    staticReadinessCueCardCount: sourceCounts.staticReadinessCueCardCount,
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
    coverageLabelCount: sourceCounts.coverageLabelCount,
    readinessCueLabelCount: sourceCounts.readinessCueLabelCount,
    coverageReviewLabelCount: unique(
      coverageReviewPathSteps.flatMap((step) => step.coverageReviewLabels),
    ).length,
    localOnlyCoverageReviewPathStepCount: coverageReviewPathSteps.filter(
      (step) => step.localOnly,
    ).length,
    localOnlyStaticCoveragePromptCardCount: staticCoveragePromptCards.filter(
      (card) => card.localOnly,
    ).length,
    localOnlyCoverageMatrixRowCount: sourceCounts.localOnlyCoverageRowCount,
    localOnlyStaticReadinessCueCardCount:
      sourceCounts.localOnlyStaticReadinessCueCardCount,
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

function buildCoverageReviewLabels(
  coverageRow: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowView,
  matchedStaticReadinessCueCards: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardView[],
): string[] {
  const labels = ["coverage-review path step"];

  if (matchedStaticReadinessCueCards.length) {
    labels.push("static coverage-prompt cue");
  }

  if (
    coverageRow.coverageLabels.length ||
    matchedStaticReadinessCueCards.some((card) => card.readinessCueLabels.length)
  ) {
    labels.push("coverage matrix carry-forward");
  }

  if (
    coverageRow.sourceLocalAnchorHrefs.length ||
    coverageRow.evidenceCallbackIds.length ||
    matchedStaticReadinessCueCards.some(
      (card) => card.sourceLocalAnchorHrefs.length || card.evidenceCallbackIds.length,
    )
  ) {
    labels.push("anchor and callback review path");
  }

  if (
    coverageRow.gapDiscussionPointIds.length ||
    coverageRow.deferredScopeReminderIds.length ||
    matchedStaticReadinessCueCards.some(
      (card) =>
        card.gapDiscussionPointIds.length || card.deferredScopeReminderIds.length,
    )
  ) {
    labels.push("gap and deferred-reminder review path");
  }

  if (
    coverageRow.sourceRecapLabels.length ||
    coverageRow.reviewPathLabels.length ||
    matchedStaticReadinessCueCards.some(
      (card) => card.sourceRecapLabels.length || card.reviewPathLabels.length,
    )
  ) {
    labels.push("source recap and review-path alignment");
  }

  return labels;
}

function buildStaticCoveragePromptLabels(
  staticReadinessCueCard: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardView,
  matchedCoverageReviewPathSteps: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepView[],
): string[] {
  const labels = ["static coverage prompt", "readiness-cue carry-forward"];

  if (matchedCoverageReviewPathSteps.length) {
    labels.push("coverage-review path source alignment");
  }

  if (staticReadinessCueCard.matchedCoverageRowIds.length) {
    labels.push("coverage-row prompt cue");
  }

  if (
    staticReadinessCueCard.sourceLocalAnchorHrefs.length ||
    staticReadinessCueCard.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback coverage prompt");
  }

  if (
    staticReadinessCueCard.gapDiscussionPointIds.length ||
    staticReadinessCueCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder coverage prompt");
  }

  return labels;
}

function staticReadinessCueCardMatchesCoverageRow(
  staticReadinessCueCard: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardView,
  coverageRow: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowView,
): boolean {
  return (
    staticReadinessCueCard.matchedCoverageRowIds.includes(
      coverageRow.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowId,
    ) ||
    coverageRow.sourceStaticReviewerCheckCardIds.includes(
      staticReadinessCueCard.sourceStaticReviewerCheckCardId,
    ) ||
    staticReadinessCueCard.matchedReviewPathStepIds.includes(
      coverageRow.sourceReviewPathStepId,
    ) ||
    staticReadinessCueCard.matchedSourceRecapRowIds.includes(
      coverageRow.sourceSourceRecapRowId,
    ) ||
    staticReadinessCueCard.matchedAnswerFollowUpReviewLaneRowIds.includes(
      coverageRow.sourceAnswerFollowUpReviewLaneRowId,
    ) ||
    staticReadinessCueCard.matchedAnswerSourceCrosswalkRowIds.includes(
      coverageRow.sourceAnswerSourceCrosswalkRowId,
    )
  );
}

function staticCoveragePromptCardMatchesCoverageReviewPathStep(
  staticReadinessCueCard: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardView,
  coverageReviewPathStep: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepView,
): boolean {
  const sourceStaticReadinessCueCardId =
    staticReadinessCueCard.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardId;

  return (
    coverageReviewPathStep.sourceStaticReadinessCueCardIds.includes(
      sourceStaticReadinessCueCardId,
    ) ||
    staticReadinessCueCard.matchedCoverageRowIds.includes(
      coverageReviewPathStep.sourceCoverageMatrixRowId,
    ) ||
    coverageReviewPathStep.sourceStaticReviewerCheckCardIds.includes(
      staticReadinessCueCard.sourceStaticReviewerCheckCardId,
    ) ||
    staticReadinessCueCard.matchedReviewPathStepIds.includes(
      coverageReviewPathStep.sourceReviewPathStepId,
    )
  );
}

function staticNonGoalFlags(
  sourceFlags: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticNonGoalFlagsView,
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedCoverageReviewState: true,
    noSavedCoverageReviewPathSteps: true,
    noSavedCoverageReviewPathState: true,
    noSavedCoveragePrompts: true,
    noSavedCoveragePromptCards: true,
    noSavedCoveragePromptState: true,
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
