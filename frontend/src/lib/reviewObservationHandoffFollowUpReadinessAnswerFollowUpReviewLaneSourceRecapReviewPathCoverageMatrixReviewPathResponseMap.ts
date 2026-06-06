import type {
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticFollowUpPromptCardView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapSummaryView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMap(
  sourceCoverageReviewPath:
    | ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathView
    | undefined,
):
  | ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapView
  | undefined {
  if (
    !sourceCoverageReviewPath?.coverageReviewPathSteps.length ||
    !sourceCoverageReviewPath.staticCoveragePromptCards.length
  ) {
    return undefined;
  }

  const responseMapRows = sourceCoverageReviewPath.coverageReviewPathSteps.map(
    (coverageReviewPathStep) =>
      buildResponseMapRow(
        coverageReviewPathStep,
        sourceCoverageReviewPath.staticCoveragePromptCards,
      ),
  );
  const staticFollowUpPromptCards =
    sourceCoverageReviewPath.staticCoveragePromptCards.map(
      (staticCoveragePromptCard) =>
        buildStaticFollowUpPromptCard(staticCoveragePromptCard, responseMapRows),
    );
  const defaultResponseMapRow =
    responseMapRows.find(
      (row) =>
        row.sourceCoverageReviewPathStepId ===
        sourceCoverageReviewPath.defaultCoverageReviewPathStep
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepId,
    ) ?? responseMapRows[0];
  const defaultStaticFollowUpPromptCard =
    staticFollowUpPromptCards.find(
      (card) =>
        card.sourceStaticCoveragePromptCardId ===
        sourceCoverageReviewPath.defaultStaticCoveragePromptCard
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardId,
    ) ?? staticFollowUpPromptCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix_review_path_response_map.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage-review response map and static follow-up prompts",
    localStatus: sourceCoverageReviewPath.localStatus,
    summary: {
      followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapId:
        "candidate-local-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-review-response-map",
      label:
        "Local observation handoff follow-up readiness answer follow-up review lane source recap review path coverage-review response map",
      summary:
        "A static coverage-review response map derives from Stage 75 coverage-review path steps and static coverage-prompt cards so reviewers can compare response-map rows, follow-up prompts, anchors, callbacks, gap prompts, deferred reminders, coverage-review text, and static coverage-prompt text before the next manual response pass without saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved recap state, saved review-path state, saved coverage state, saved coverage-review state, saved response-map state, saved coverage prompts, saved follow-up prompts, local storage, routes, exports, signoff, audit retention, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, persistence, or production handoff semantics.",
      defaultResponseMapContext: {
        defaultResponseMapRowId:
          defaultResponseMapRow
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowId,
        defaultCoverageReviewPathStepId:
          defaultResponseMapRow.sourceCoverageReviewPathStepId,
        defaultCoverageMatrixRowId: defaultResponseMapRow.sourceCoverageMatrixRowId,
        defaultReviewPathStepId: defaultResponseMapRow.sourceReviewPathStepId,
        defaultSourceRecapRowId: defaultResponseMapRow.sourceSourceRecapRowId,
        defaultAnswerFollowUpReviewLaneRowId:
          defaultResponseMapRow.sourceAnswerFollowUpReviewLaneRowId,
        defaultAnswerSourceCrosswalkRowId:
          defaultResponseMapRow.sourceAnswerSourceCrosswalkRowId,
        defaultAnswerWalkthroughStepId:
          defaultResponseMapRow.sourceAnswerWalkthroughStepId,
        defaultAnswerCoverageRowId: defaultResponseMapRow.sourceAnswerCoverageRowId,
        defaultRehearsalPathStepId:
          defaultResponseMapRow.sourceRehearsalPathStepId,
        defaultReviewBoardRowId: defaultResponseMapRow.sourceReviewBoardRowId,
        defaultFollowUpReadinessBriefRowId:
          defaultResponseMapRow.followUpReadinessBriefRowId,
        defaultFollowUpTriageRowId:
          defaultResponseMapRow
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        defaultSynthesisRowId:
          defaultResponseMapRow
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
        defaultReviewLaneRowId:
          defaultResponseMapRow
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        defaultReadinessBriefRowId:
          defaultResponseMapRow
            .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        defaultCoverageReviewSourcePathStepId:
          defaultResponseMapRow.sourceReadinessResponseTraceCoverageReviewPathStepId,
        defaultSourceCoverageRowId:
          defaultResponseMapRow.sourceReadinessResponseTraceCoverageRowId,
        defaultTraceRowId: defaultResponseMapRow.sourceReadinessResponseTraceRowId,
        defaultStaticResponseMapFollowUpPromptCardId:
          defaultStaticFollowUpPromptCard
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticFollowUpPromptCardId,
        defaultStaticCoveragePromptCardId:
          defaultStaticFollowUpPromptCard.sourceStaticCoveragePromptCardId,
        defaultStaticReadinessCueCardId:
          defaultStaticFollowUpPromptCard.sourceStaticReadinessCueCardId,
        defaultStaticReviewerCheckCardId:
          defaultStaticFollowUpPromptCard.sourceStaticReviewerCheckCardId,
        defaultStaticNextPassPromptCardId:
          defaultStaticFollowUpPromptCard.sourceStaticNextPassPromptCardId,
        defaultStaticDecisionCueCardId:
          defaultStaticFollowUpPromptCard.sourceStaticDecisionCueCardId,
        defaultStaticFollowUpPromptCardId:
          defaultStaticFollowUpPromptCard.sourceStaticFollowUpPromptCardId,
        defaultStaticReviewNoteCardId:
          defaultStaticFollowUpPromptCard.sourceStaticReviewNoteCardId,
        defaultStaticReviewerCheckPromptCardId:
          defaultStaticFollowUpPromptCard.sourceStaticReviewerCheckPromptCardId,
        defaultStaticAnswerPrepPromptCardId:
          defaultStaticFollowUpPromptCard.sourceStaticAnswerPrepPromptCardId,
        defaultStaticQuestionPromptCardId:
          defaultStaticFollowUpPromptCard.sourceStaticQuestionPromptCardId,
        defaultStaticReviewerPromptCardId:
          defaultStaticFollowUpPromptCard
            .followUpReadinessBriefStaticReviewerPromptCardId,
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
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathSummary:
          sourceCoverageReviewPath.summary.summary,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathDefaultContext:
          sourceCoverageReviewPath.summary.defaultCoverageReviewContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        responseMapRows,
        staticFollowUpPromptCards,
        sourceCoverageReviewPath,
      ),
    },
    defaultResponseMapRow,
    defaultStaticFollowUpPromptCard,
    responseMapRows,
    staticFollowUpPromptCards,
    staticSourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapSummary:
      "Stage 76 coverage-review response-map rows and static follow-up prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, response notes, recap state, review-path state, coverage state, coverage-review state, response-map state, coverage prompts, follow-up prompts, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPath:
      sourceCoverageReviewPath,
  };
}

function buildResponseMapRow(
  coverageReviewPathStep: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepView,
  staticCoveragePromptCards: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardView[],
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowView {
  const matchedStaticCoveragePromptCards = staticCoveragePromptCards.filter(
    (card) =>
      staticCoveragePromptCardMatchesCoverageReviewPathStep(
        card,
        coverageReviewPathStep,
      ),
  );
  const sourceStaticCoveragePromptCardIds =
    matchedStaticCoveragePromptCards.map(
      (card) =>
        card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardId,
    );
  const responseMapLabels = buildResponseMapLabels(
    coverageReviewPathStep,
    matchedStaticCoveragePromptCards,
  );
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map:${coverageReviewPathStep.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepId}`;

  return {
    ...coverageReviewPathStep,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowOrder:
      coverageReviewPathStep.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepOrder,
    sourceCoverageReviewPathStepId:
      coverageReviewPathStep
        .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepId,
    sourceCoverageReviewPathStepIds: [
      coverageReviewPathStep
        .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepId,
    ],
    sourceStaticCoveragePromptCardIds,
    responseMapLabels,
    responseMapText:
      `Response map row ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowId}: compare Stage 75 coverage-review step ${coverageReviewPathStep.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepId}, Stage 75 static coverage-prompt cards ${sourceStaticCoveragePromptCardIds.join(", ") || "none"}, Stage 74 coverage row ${coverageReviewPathStep.sourceCoverageMatrixRowId}, Stage 74 static readiness-cue cards ${coverageReviewPathStep.sourceStaticReadinessCueCardIds.join(", ") || "none"}, Stage 73 review-path step ${coverageReviewPathStep.sourceReviewPathStepId}, Stage 73 reviewer-check cards ${coverageReviewPathStep.sourceStaticReviewerCheckCardIds.join(", ") || "none"}, Stage 72 source recap row ${coverageReviewPathStep.sourceSourceRecapRowId}, Stage 72 static next-pass prompt cards ${coverageReviewPathStep.sourceStaticNextPassPromptCardIds.join(", ") || "none"}, Stage 71 review-lane row ${coverageReviewPathStep.sourceAnswerFollowUpReviewLaneRowId}, Stage 71 static decision-cue cards ${coverageReviewPathStep.sourceStaticDecisionCueCardIds.join(", ") || "none"}, Stage 70 crosswalk row ${coverageReviewPathStep.sourceAnswerSourceCrosswalkRowId}, Stage 70 static follow-up prompt cards ${coverageReviewPathStep.sourceStaticFollowUpPromptCardIds.join(", ") || "none"}, Stage 69 walkthrough step ${coverageReviewPathStep.sourceAnswerWalkthroughStepId}, Stage 69 static review-note cards ${coverageReviewPathStep.sourceStaticReviewNoteCardIds.join(", ") || "none"}, Stage 68 answer coverage row ${coverageReviewPathStep.sourceAnswerCoverageRowId}, Stage 68 reviewer-check prompt cards ${coverageReviewPathStep.sourceStaticReviewerCheckPromptCardIds.join(", ") || "none"}, Stage 67 rehearsal path step ${coverageReviewPathStep.sourceRehearsalPathStepId}, Stage 67 static answer-prep prompt cards ${coverageReviewPathStep.sourceStaticAnswerPrepPromptCardIds.join(", ") || "none"}, Stage 66 review board row ${coverageReviewPathStep.sourceReviewBoardRowId}, Stage 66 static question prompt cards ${coverageReviewPathStep.matchedStaticQuestionPromptCardIds.join(", ") || "none"}, Stage 65 brief row ${coverageReviewPathStep.followUpReadinessBriefRowId}, Stage 64 triage row ${coverageReviewPathStep.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${coverageReviewPathStep.sourceLocalAnchorHrefs.join(", ")}, callbacks ${coverageReviewPathStep.evidenceCallbackIds.join(", ")}, gap prompts ${coverageReviewPathStep.gapDiscussionPointIds.join(", ")}, deferred reminders ${coverageReviewPathStep.deferredScopeReminderIds.join(", ")}, lane labels ${coverageReviewPathStep.laneLabels.join(", ") || "none"}, review-path labels ${coverageReviewPathStep.reviewPathLabels.join(", ") || "none"}, coverage labels ${coverageReviewPathStep.coverageLabels.join(", ") || "none"}, coverage-review labels ${coverageReviewPathStep.coverageReviewLabels.join(", ") || "none"}, response-map labels ${responseMapLabels.join(", ") || "none"}, coverage-review text "${coverageReviewPathStep.coverageReviewText}", static coverage-prompt text "${coverageReviewPathStep.staticCoveragePromptText}", and deterministic manual-review context only.`,
    staticFollowUpPromptText:
      `Static follow-up prompt for ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowId}: review Stage 75 coverage-review step ${coverageReviewPathStep.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepId}, Stage 75 static coverage-prompt cards ${sourceStaticCoveragePromptCardIds.join(", ") || "none"}, source anchors ${coverageReviewPathStep.sourceLocalAnchorHrefs.join(", ")}, callbacks ${coverageReviewPathStep.evidenceCallbackIds.join(", ")}, gap prompts ${coverageReviewPathStep.gapDiscussionPointIds.join(", ")}, deferred reminders ${coverageReviewPathStep.deferredScopeReminderIds.join(", ")}, coverage-review text "${coverageReviewPathStep.coverageReviewText}", static coverage-prompt text "${coverageReviewPathStep.staticCoveragePromptText}", and response-map labels ${responseMapLabels.join(", ") || "none"} before the next manual response pass without saving reviewer answers, answer drafts, response notes, coverage-review state, response-map state, coverage prompts, follow-up prompts, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static coverage-review response map context: manual response-map rows and static follow-up prompts only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved recap state, saved review-path state, saved coverage state, saved coverage-review state, saved response-map state, saved coverage prompts, saved follow-up prompts, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      coverageReviewPathStep.staticNonGoalFlags,
    ),
  };
}

function buildStaticFollowUpPromptCard(
  staticCoveragePromptCard: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardView,
  responseMapRows: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowView[],
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticFollowUpPromptCardView {
  const sourceStaticCoveragePromptCardId =
    staticCoveragePromptCard
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardId;
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticFollowUpPromptCardId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map:static-follow-up-prompt:${sourceStaticCoveragePromptCardId}`;
  const matchedResponseMapRows = responseMapRows.filter((row) =>
    staticFollowUpPromptCardMatchesResponseMapRow(staticCoveragePromptCard, row),
  );
  const responseMapLabels = buildStaticFollowUpPromptLabels(
    staticCoveragePromptCard,
    matchedResponseMapRows,
  );

  return {
    ...staticCoveragePromptCard,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticFollowUpPromptCardId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticFollowUpPromptCardIds:
      [
        followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticFollowUpPromptCardId,
      ],
    sourceStaticCoveragePromptCardId,
    sourceStaticCoveragePromptCardIds: [sourceStaticCoveragePromptCardId],
    matchedResponseMapRowIds: matchedResponseMapRows.map(
      (row) =>
        row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowId,
    ),
    staticFollowUpPromptOrder: staticCoveragePromptCard.staticCoveragePromptOrder,
    responseMapLabels,
    staticFollowUpPromptText:
      `Static follow-up prompt card ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticFollowUpPromptCardId}: inspect Stage 75 static coverage-prompt card ${sourceStaticCoveragePromptCardId}, matched response-map rows ${matchedResponseMapRows.map((row) => row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowId).join(", ") || "none"}, Stage 75 coverage-review steps ${staticCoveragePromptCard.matchedCoverageReviewPathStepIds.join(", ") || "none"}, Stage 74 readiness-cue card ${staticCoveragePromptCard.sourceStaticReadinessCueCardId}, Stage 73 reviewer-check card ${staticCoveragePromptCard.sourceStaticReviewerCheckCardId}, Stage 72 static next-pass prompt card ${staticCoveragePromptCard.sourceStaticNextPassPromptCardId}, Stage 71 static decision-cue card ${staticCoveragePromptCard.sourceStaticDecisionCueCardId}, Stage 70 static follow-up prompt card ${staticCoveragePromptCard.sourceStaticFollowUpPromptCardId}, Stage 69 static review-note card ${staticCoveragePromptCard.sourceStaticReviewNoteCardId}, anchors ${staticCoveragePromptCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticCoveragePromptCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticCoveragePromptCard.gapDiscussionPointIds.join(", ")}, deferred reminders ${staticCoveragePromptCard.deferredScopeReminderIds.join(", ")}, coverage-review labels ${staticCoveragePromptCard.coverageReviewLabels.join(", ") || "none"}, response-map labels ${responseMapLabels.join(", ") || "none"}, and carried static coverage-prompt text as local static follow-up prompt context only.`,
    staticNonGoalContext:
      "Static follow-up prompt card context: manual follow-up prompt comparison only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved recap state, saved review-path state, saved coverage state, saved coverage-review state, saved response-map state, saved coverage prompts, saved follow-up prompts, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticCoveragePromptCard.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  responseMapRows: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowView[],
  staticFollowUpPromptCards: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticFollowUpPromptCardView[],
  sourceCoverageReviewPath: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathView,
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapSummaryView["counts"] {
  const sourceCounts = sourceCoverageReviewPath.summary.counts;

  return {
    ...sourceCounts,
    responseMapRowCount: responseMapRows.length,
    staticFollowUpPromptCardCount: staticFollowUpPromptCards.length,
    responseMapLabelCount: unique(
      responseMapRows.flatMap((row) => row.responseMapLabels),
    ).length,
    localOnlyResponseMapRowCount: responseMapRows.filter((row) => row.localOnly)
      .length,
    localOnlyStaticFollowUpPromptCardCount: staticFollowUpPromptCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function buildResponseMapLabels(
  coverageReviewPathStep: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepView,
  matchedStaticCoveragePromptCards: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardView[],
): string[] {
  const labels = ["coverage-review response map row"];

  if (matchedStaticCoveragePromptCards.length) {
    labels.push("static follow-up prompt cue");
  }

  if (
    coverageReviewPathStep.coverageReviewLabels.length ||
    matchedStaticCoveragePromptCards.some((card) => card.coverageReviewLabels.length)
  ) {
    labels.push("coverage-review carry-forward");
  }

  if (
    coverageReviewPathStep.sourceLocalAnchorHrefs.length ||
    coverageReviewPathStep.evidenceCallbackIds.length ||
    matchedStaticCoveragePromptCards.some(
      (card) => card.sourceLocalAnchorHrefs.length || card.evidenceCallbackIds.length,
    )
  ) {
    labels.push("anchor and callback response context");
  }

  if (
    coverageReviewPathStep.gapDiscussionPointIds.length ||
    coverageReviewPathStep.deferredScopeReminderIds.length ||
    matchedStaticCoveragePromptCards.some(
      (card) =>
        card.gapDiscussionPointIds.length || card.deferredScopeReminderIds.length,
    )
  ) {
    labels.push("gap and deferred-reminder response context");
  }

  if (
    coverageReviewPathStep.sourceRecapLabels.length ||
    coverageReviewPathStep.reviewPathLabels.length ||
    coverageReviewPathStep.coverageLabels.length
  ) {
    labels.push("source recap coverage review alignment");
  }

  return labels;
}

function buildStaticFollowUpPromptLabels(
  staticCoveragePromptCard: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardView,
  matchedResponseMapRows: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowView[],
): string[] {
  const labels = ["static follow-up prompt", "coverage-prompt carry-forward"];

  if (matchedResponseMapRows.length) {
    labels.push("response-map source alignment");
  }

  if (staticCoveragePromptCard.matchedCoverageReviewPathStepIds.length) {
    labels.push("coverage-review step prompt cue");
  }

  if (
    staticCoveragePromptCard.sourceLocalAnchorHrefs.length ||
    staticCoveragePromptCard.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback follow-up prompt");
  }

  if (
    staticCoveragePromptCard.gapDiscussionPointIds.length ||
    staticCoveragePromptCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder follow-up prompt");
  }

  return labels;
}

function staticCoveragePromptCardMatchesCoverageReviewPathStep(
  staticCoveragePromptCard: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardView,
  coverageReviewPathStep: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepView,
): boolean {
  return (
    staticCoveragePromptCard.matchedCoverageReviewPathStepIds.includes(
      coverageReviewPathStep
        .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepId,
    ) ||
    coverageReviewPathStep.sourceStaticReadinessCueCardIds.includes(
      staticCoveragePromptCard.sourceStaticReadinessCueCardId,
    ) ||
    staticCoveragePromptCard.matchedCoverageRowIds.includes(
      coverageReviewPathStep.sourceCoverageMatrixRowId,
    ) ||
    staticCoveragePromptCard.matchedReviewPathStepIds.includes(
      coverageReviewPathStep.sourceReviewPathStepId,
    ) ||
    staticCoveragePromptCard.matchedSourceRecapRowIds.includes(
      coverageReviewPathStep.sourceSourceRecapRowId,
    ) ||
    staticCoveragePromptCard.matchedAnswerFollowUpReviewLaneRowIds.includes(
      coverageReviewPathStep.sourceAnswerFollowUpReviewLaneRowId,
    ) ||
    staticCoveragePromptCard.matchedAnswerSourceCrosswalkRowIds.includes(
      coverageReviewPathStep.sourceAnswerSourceCrosswalkRowId,
    )
  );
}

function staticFollowUpPromptCardMatchesResponseMapRow(
  staticCoveragePromptCard: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardView,
  responseMapRow: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowView,
): boolean {
  const sourceStaticCoveragePromptCardId =
    staticCoveragePromptCard
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardId;

  return (
    responseMapRow.sourceStaticCoveragePromptCardIds.includes(
      sourceStaticCoveragePromptCardId,
    ) ||
    staticCoveragePromptCard.matchedCoverageReviewPathStepIds.includes(
      responseMapRow.sourceCoverageReviewPathStepId,
    ) ||
    responseMapRow.sourceStaticReadinessCueCardIds.includes(
      staticCoveragePromptCard.sourceStaticReadinessCueCardId,
    ) ||
    staticCoveragePromptCard.matchedCoverageRowIds.includes(
      responseMapRow.sourceCoverageMatrixRowId,
    )
  );
}

function staticNonGoalFlags(
  sourceFlags: ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticNonGoalFlagsView,
): ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedResponseNotes: true,
    noSavedResponseMapState: true,
    noSavedResponseMapRows: true,
    noSavedResponseMap: true,
    noSavedFollowUpPrompts: true,
    noSavedFollowUpPromptCards: true,
    noSavedFollowUpPromptState: true,
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
