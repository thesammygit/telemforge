import type {
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardView as Stage79StaticConstraintNoteCard,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticNonGoalFlagsView as Stage79StaticNonGoalFlags,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStepView as Stage79AnswerReviewPathStep,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathSummaryView as Stage79Summary,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathView as Stage79View,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardReadinessRowView as Stage78ReadinessRow,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardView as Stage78StaticAnswerCheckCard,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardStaticNonGoalFlagsView as Stage78StaticNonGoalFlags,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardView as Stage78View,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPath(
  sourceResponsePromptReadinessBoard: Stage78View | undefined,
): Stage79View | undefined {
  if (
    !sourceResponsePromptReadinessBoard?.staticAnswerCheckCards.length ||
    !sourceResponsePromptReadinessBoard.responsePromptReadinessRows.length
  ) {
    return undefined;
  }

  const answerReviewPathSteps =
    sourceResponsePromptReadinessBoard.staticAnswerCheckCards.map(
      (staticAnswerCheckCard) =>
        buildAnswerReviewPathStep(
          staticAnswerCheckCard,
          sourceResponsePromptReadinessBoard.responsePromptReadinessRows,
        ),
    );
  const staticConstraintNoteCards =
    sourceResponsePromptReadinessBoard.responsePromptReadinessRows.map(
      (readinessRow) =>
        buildStaticConstraintNoteCard(
          readinessRow,
          sourceResponsePromptReadinessBoard.staticAnswerCheckCards,
        ),
    );
  const defaultAnswerReviewPathStep =
    answerReviewPathSteps.find(
      (step) =>
        step.sourceStaticAnswerCheckCardId ===
        sourceResponsePromptReadinessBoard.defaultStaticAnswerCheckCard
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardId,
    ) ?? answerReviewPathSteps[0];
  const defaultStaticConstraintNoteCard =
    staticConstraintNoteCards.find(
      (card) =>
        card.sourceResponsePromptReadinessRowId ===
        sourceResponsePromptReadinessBoard.defaultResponsePromptReadinessRow
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardReadinessRowId,
    ) ?? staticConstraintNoteCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix_review_path_response_map_review_path_response_prompt_readiness_board_answer_review_path.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage-review response-map review-path response-prompt readiness-board answer-review path and static constraint notes",
    localStatus: sourceResponsePromptReadinessBoard.localStatus,
    summary: {
      followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathId:
        "candidate-local-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-review-response-map-review-path-response-prompt-readiness-board-answer-review-path",
      label:
        "Local observation handoff follow-up readiness answer follow-up review lane source recap review path coverage-review response-map review-path response-prompt readiness-board answer-review path",
      summary:
        "A static answer-review path derives from Stage 78 static answer-check cards and response-prompt readiness rows so reviewers can verify manual-answer constraints, source anchors, response-prompt coverage, gap prompts, deferred reminders, and static constraint notes before drafting the next response outside the app without saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved answer-review state, saved constraint-note state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultAnswerReviewContext: {
        defaultAnswerReviewPathStepId:
          defaultAnswerReviewPathStep
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStepId,
        defaultStaticConstraintNoteCardId:
          defaultStaticConstraintNoteCard
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardId,
        defaultStaticAnswerCheckCardId:
          defaultAnswerReviewPathStep.sourceStaticAnswerCheckCardId,
        defaultResponsePromptReadinessRowId:
          defaultStaticConstraintNoteCard.sourceResponsePromptReadinessRowId,
        defaultStaticResponsePromptCardId:
          defaultStaticConstraintNoteCard.sourceStaticResponsePromptCardId,
        defaultResponseMapReviewPathStepId:
          defaultAnswerReviewPathStep.sourceResponseMapReviewPathStepId,
        defaultResponseMapRowId: defaultAnswerReviewPathStep.sourceResponseMapRowId,
        defaultResponseMapStaticFollowUpPromptCardId:
          defaultStaticConstraintNoteCard.sourceResponseMapStaticFollowUpPromptCardId,
        defaultCoverageReviewPathStepId:
          defaultAnswerReviewPathStep.sourceCoverageReviewPathStepId,
        defaultCoverageMatrixRowId:
          defaultAnswerReviewPathStep.sourceCoverageMatrixRowId,
        defaultReviewPathSourceStepId:
          defaultAnswerReviewPathStep.sourceReviewPathStepId,
        defaultSourceRecapRowId:
          defaultAnswerReviewPathStep.sourceSourceRecapRowId,
        defaultAnswerFollowUpReviewLaneRowId:
          defaultAnswerReviewPathStep.sourceAnswerFollowUpReviewLaneRowId,
        defaultAnswerSourceCrosswalkRowId:
          defaultAnswerReviewPathStep.sourceAnswerSourceCrosswalkRowId,
        defaultAnswerWalkthroughStepId:
          defaultAnswerReviewPathStep.sourceAnswerWalkthroughStepId,
        defaultAnswerCoverageRowId:
          defaultAnswerReviewPathStep.sourceAnswerCoverageRowId,
        defaultRehearsalPathStepId:
          defaultAnswerReviewPathStep.sourceRehearsalPathStepId,
        defaultReviewBoardRowId:
          defaultAnswerReviewPathStep.sourceReviewBoardRowId,
        defaultFollowUpReadinessBriefRowId:
          defaultAnswerReviewPathStep.followUpReadinessBriefRowId,
        defaultFollowUpTriageRowId:
          defaultAnswerReviewPathStep
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        defaultStaticCoveragePromptCardId:
          defaultStaticConstraintNoteCard.sourceStaticCoveragePromptCardId,
        defaultStaticReadinessCueCardId:
          defaultStaticConstraintNoteCard.sourceStaticReadinessCueCardId,
        defaultStaticReviewerCheckCardId:
          defaultStaticConstraintNoteCard.sourceStaticReviewerCheckCardId,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardSummary:
          sourceResponsePromptReadinessBoard.summary.summary,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardDefaultContext:
          sourceResponsePromptReadinessBoard.summary.defaultReadinessContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        answerReviewPathSteps,
        staticConstraintNoteCards,
        sourceResponsePromptReadinessBoard,
      ),
    },
    defaultAnswerReviewPathStep,
    defaultStaticConstraintNoteCard,
    answerReviewPathSteps,
    staticConstraintNoteCards,
    staticSourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathSummary:
      "Stage 79 answer-review path steps and static constraint-note cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, response notes, answer-review state, constraint-note state, prompt readiness state, answer-check state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoard:
      sourceResponsePromptReadinessBoard,
  };
}

function buildAnswerReviewPathStep(
  staticAnswerCheckCard: Stage78StaticAnswerCheckCard,
  responsePromptReadinessRows: Stage78ReadinessRow[],
): Stage79AnswerReviewPathStep {
  const sourceStaticAnswerCheckCardId =
    staticAnswerCheckCard
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardId;
  const matchedResponsePromptReadinessRows =
    responsePromptReadinessRows.filter((row) =>
      responsePromptReadinessRowMatchesStaticAnswerCheckCard(
        row,
        staticAnswerCheckCard,
      ),
    );
  const sourceResponsePromptReadinessRowIds =
    matchedResponsePromptReadinessRows.map(
      (row) =>
        row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardReadinessRowId,
    );
  const answerReviewPathLabels = buildAnswerReviewPathLabels(
    staticAnswerCheckCard,
    matchedResponsePromptReadinessRows,
  );
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStepId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path-response-prompt-readiness-board-answer-review-path:step:${sourceStaticAnswerCheckCardId}`;

  return {
    ...staticAnswerCheckCard,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStepId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStepIds:
      [
        followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStepId,
      ],
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStepOrder:
      staticAnswerCheckCard.staticAnswerCheckOrder,
    sourceStaticAnswerCheckCardId,
    sourceStaticAnswerCheckCardIds: [sourceStaticAnswerCheckCardId],
    sourceResponsePromptReadinessRowIds,
    answerReviewPathLabels,
    answerReviewPathText:
      `Answer-review path step ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStepId}: walk Stage 78 static answer-check card ${sourceStaticAnswerCheckCardId}, matched Stage 78 readiness rows ${sourceResponsePromptReadinessRowIds.join(", ") || "none"}, Stage 77 response-map review-path step ${staticAnswerCheckCard.sourceResponseMapReviewPathStepId}, Stage 77 static response-prompt cards ${staticAnswerCheckCard.sourceStaticResponsePromptCardIds.join(", ") || "none"}, Stage 76 response-map row ${staticAnswerCheckCard.sourceResponseMapRowId}, Stage 76 static follow-up prompt cards ${staticAnswerCheckCard.sourceResponseMapStaticFollowUpPromptCardIds.join(", ") || "none"}, Stage 75 coverage-review step ${staticAnswerCheckCard.sourceCoverageReviewPathStepId}, Stage 75 static coverage-prompt cards ${staticAnswerCheckCard.sourceStaticCoveragePromptCardIds.join(", ") || "none"}, Stage 74 coverage row ${staticAnswerCheckCard.sourceCoverageMatrixRowId}, Stage 74 readiness-cue cards ${staticAnswerCheckCard.sourceStaticReadinessCueCardIds.join(", ") || "none"}, Stage 73 review-path step ${staticAnswerCheckCard.sourceReviewPathStepId}, Stage 73 reviewer-check cards ${staticAnswerCheckCard.sourceStaticReviewerCheckCardIds.join(", ") || "none"}, Stage 72 source recap row ${staticAnswerCheckCard.sourceSourceRecapRowId}, Stage 72 static next-pass prompt cards ${staticAnswerCheckCard.sourceStaticNextPassPromptCardIds.join(", ") || "none"}, Stage 71 review-lane row ${staticAnswerCheckCard.sourceAnswerFollowUpReviewLaneRowId}, Stage 71 decision-cue cards ${staticAnswerCheckCard.sourceStaticDecisionCueCardIds.join(", ") || "none"}, Stage 70 crosswalk row ${staticAnswerCheckCard.sourceAnswerSourceCrosswalkRowId}, Stage 70 follow-up prompt cards ${staticAnswerCheckCard.sourceStaticFollowUpPromptCardIds.join(", ") || "none"}, Stage 69 walkthrough step ${staticAnswerCheckCard.sourceAnswerWalkthroughStepId}, Stage 69 review-note cards ${staticAnswerCheckCard.sourceStaticReviewNoteCardIds.join(", ") || "none"}, Stage 68 answer coverage row ${staticAnswerCheckCard.sourceAnswerCoverageRowId}, Stage 68 reviewer-check prompt cards ${staticAnswerCheckCard.sourceStaticReviewerCheckPromptCardIds.join(", ") || "none"}, Stage 67 rehearsal path step ${staticAnswerCheckCard.sourceRehearsalPathStepId}, Stage 67 answer-prep prompt cards ${staticAnswerCheckCard.sourceStaticAnswerPrepPromptCardIds.join(", ") || "none"}, Stage 66 review board row ${staticAnswerCheckCard.sourceReviewBoardRowId}, Stage 66 question prompt cards ${staticAnswerCheckCard.matchedStaticQuestionPromptCardIds.join(", ") || "none"}, Stage 65 brief row ${staticAnswerCheckCard.followUpReadinessBriefRowId}, Stage 64 triage row ${staticAnswerCheckCard.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${staticAnswerCheckCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticAnswerCheckCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticAnswerCheckCard.gapDiscussionPointIds.join(", ")}, deferred reminders ${staticAnswerCheckCard.deferredScopeReminderIds.join(", ")}, answer-check labels ${staticAnswerCheckCard.staticAnswerCheckLabels.join(", ") || "none"}, answer-review labels ${answerReviewPathLabels.join(", ") || "none"}, static answer-check text "${staticAnswerCheckCard.staticAnswerCheckText}", and deterministic manual-answer constraint context only.`,
    staticConstraintNoteText:
      `Static constraint note for answer-review step ${sourceStaticAnswerCheckCardId}: compare matched readiness rows ${sourceResponsePromptReadinessRowIds.join(", ") || "none"} against Stage 78 static answer-check card ${sourceStaticAnswerCheckCardId}, Stage 77 response-map review-path step ${staticAnswerCheckCard.sourceResponseMapReviewPathStepId}, Stage 76 response-map row ${staticAnswerCheckCard.sourceResponseMapRowId}, anchors ${staticAnswerCheckCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticAnswerCheckCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticAnswerCheckCard.gapDiscussionPointIds.join(", ")}, deferred reminders ${staticAnswerCheckCard.deferredScopeReminderIds.join(", ")}, and manual-answer constraint labels ${staticAnswerCheckCard.staticAnswerCheckLabels.join(", ") || "none"} without saving reviewer answers, answer drafts, reviewer notes, response notes, answer-review state, constraint-note state, prompt readiness state, answer-check state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static answer-review path context: manual answer constraints and response-prompt coverage only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved answer-review state, saved constraint-note state, saved prompt readiness state, saved answer-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(staticAnswerCheckCard.staticNonGoalFlags),
  };
}

function buildStaticConstraintNoteCard(
  responsePromptReadinessRow: Stage78ReadinessRow,
  staticAnswerCheckCards: Stage78StaticAnswerCheckCard[],
): Stage79StaticConstraintNoteCard {
  const sourceResponsePromptReadinessRowId =
    responsePromptReadinessRow
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardReadinessRowId;
  const matchedStaticAnswerCheckCards = staticAnswerCheckCards.filter((card) =>
    responsePromptReadinessRowMatchesStaticAnswerCheckCard(
      responsePromptReadinessRow,
      card,
    ),
  );
  const sourceStaticAnswerCheckCardIds = matchedStaticAnswerCheckCards.map(
    (card) =>
      card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardId,
  );
  const staticConstraintNoteLabels = buildStaticConstraintNoteLabels(
    responsePromptReadinessRow,
    matchedStaticAnswerCheckCards,
  );
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path-response-prompt-readiness-board-answer-review-path:static-constraint-note:${sourceResponsePromptReadinessRowId}`;

  return {
    ...responsePromptReadinessRow,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardIds:
      [
        followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardId,
      ],
    sourceResponsePromptReadinessRowId,
    sourceResponsePromptReadinessRowIds: [sourceResponsePromptReadinessRowId],
    sourceStaticAnswerCheckCardIds,
    staticConstraintNoteOrder:
      responsePromptReadinessRow
        .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardReadinessRowOrder,
    staticConstraintNoteLabels,
    staticConstraintNoteText:
      `Static constraint-note card ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardId}: verify Stage 78 readiness row ${sourceResponsePromptReadinessRowId}, matched Stage 78 answer-check cards ${sourceStaticAnswerCheckCardIds.join(", ") || "none"}, Stage 77 static response-prompt card ${responsePromptReadinessRow.sourceStaticResponsePromptCardId}, Stage 77 review-path steps ${responsePromptReadinessRow.sourceResponseMapReviewPathStepIds.join(", ") || "none"}, Stage 76 response-map rows ${responsePromptReadinessRow.sourceResponseMapRowIds.join(", ") || "none"}, Stage 76 static follow-up prompt ${responsePromptReadinessRow.sourceResponseMapStaticFollowUpPromptCardId}, Stage 75 static coverage-prompt cards ${responsePromptReadinessRow.sourceStaticCoveragePromptCardIds.join(", ") || "none"}, Stage 74 readiness-cue card ${responsePromptReadinessRow.sourceStaticReadinessCueCardId}, Stage 73 reviewer-check card ${responsePromptReadinessRow.sourceStaticReviewerCheckCardId}, Stage 72 next-pass prompt card ${responsePromptReadinessRow.sourceStaticNextPassPromptCardId}, Stage 71 decision-cue card ${responsePromptReadinessRow.sourceStaticDecisionCueCardId}, Stage 70 follow-up prompt card ${responsePromptReadinessRow.sourceStaticFollowUpPromptCardId}, Stage 69 review-note card ${responsePromptReadinessRow.sourceStaticReviewNoteCardId}, anchors ${responsePromptReadinessRow.sourceLocalAnchorHrefs.join(", ")}, callbacks ${responsePromptReadinessRow.evidenceCallbackIds.join(", ")}, gap prompts ${responsePromptReadinessRow.gapDiscussionPointIds.join(", ")}, deferred reminders ${responsePromptReadinessRow.deferredScopeReminderIds.join(", ")}, readiness labels ${responsePromptReadinessRow.responsePromptReadinessLabels.join(", ") || "none"}, constraint-note labels ${staticConstraintNoteLabels.join(", ") || "none"}, and static readiness text "${responsePromptReadinessRow.responsePromptReadinessText}" as manual-answer constraint context only.`,
    answerReviewPathText:
      `Answer-review prompt for constraint-note row ${sourceResponsePromptReadinessRowId}: compare Stage 78 answer-check cards ${sourceStaticAnswerCheckCardIds.join(", ") || "none"} with Stage 78 readiness row ${sourceResponsePromptReadinessRowId}, Stage 77 static response-prompt card ${responsePromptReadinessRow.sourceStaticResponsePromptCardId}, anchors ${responsePromptReadinessRow.sourceLocalAnchorHrefs.join(", ")}, callbacks ${responsePromptReadinessRow.evidenceCallbackIds.join(", ")}, gap prompts ${responsePromptReadinessRow.gapDiscussionPointIds.join(", ")}, deferred reminders ${responsePromptReadinessRow.deferredScopeReminderIds.join(", ")}, and carried readiness labels ${responsePromptReadinessRow.responsePromptReadinessLabels.join(", ") || "none"} before drafting the next manual response outside the app without saving reviewer answers, answer drafts, response notes, answer-review state, constraint-note state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static constraint-note context: manual answer constraints, response-prompt coverage, and deferred-reminder checks only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved answer-review state, saved constraint-note state, saved prompt readiness state, saved answer-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      responsePromptReadinessRow.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  answerReviewPathSteps: Stage79AnswerReviewPathStep[],
  staticConstraintNoteCards: Stage79StaticConstraintNoteCard[],
  sourceResponsePromptReadinessBoard: Stage78View,
): Stage79Summary["counts"] {
  const sourceCounts = sourceResponsePromptReadinessBoard.summary.counts;

  return {
    ...sourceCounts,
    answerReviewPathStepCount: answerReviewPathSteps.length,
    staticConstraintNoteCardCount: staticConstraintNoteCards.length,
    answerReviewPathLabelCount: unique(
      answerReviewPathSteps.flatMap((step) => step.answerReviewPathLabels),
    ).length,
    staticConstraintNoteLabelCount: unique(
      staticConstraintNoteCards.flatMap(
        (card) => card.staticConstraintNoteLabels,
      ),
    ).length,
    localOnlyAnswerReviewPathStepCount: answerReviewPathSteps.filter(
      (step) => step.localOnly,
    ).length,
    localOnlyStaticConstraintNoteCardCount: staticConstraintNoteCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function buildAnswerReviewPathLabels(
  staticAnswerCheckCard: Stage78StaticAnswerCheckCard,
  matchedResponsePromptReadinessRows: Stage78ReadinessRow[],
): string[] {
  const labels = ["answer-review path step", "static constraint-note context"];

  if (matchedResponsePromptReadinessRows.length) {
    labels.push("response-prompt readiness source alignment");
  }

  if (staticAnswerCheckCard.staticAnswerCheckLabels.length) {
    labels.push("manual answer constraint carry-forward");
  }

  if (
    staticAnswerCheckCard.sourceLocalAnchorHrefs.length ||
    staticAnswerCheckCard.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback answer-review context");
  }

  if (
    staticAnswerCheckCard.gapDiscussionPointIds.length ||
    staticAnswerCheckCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder answer-review context");
  }

  return labels;
}

function buildStaticConstraintNoteLabels(
  responsePromptReadinessRow: Stage78ReadinessRow,
  matchedStaticAnswerCheckCards: Stage78StaticAnswerCheckCard[],
): string[] {
  const labels = [
    "static constraint note",
    "manual answer constraint carry-forward",
  ];

  if (matchedStaticAnswerCheckCards.length) {
    labels.push("answer-check source alignment");
  }

  if (responsePromptReadinessRow.responsePromptReadinessLabels.length) {
    labels.push("response-prompt readiness carry-forward");
  }

  if (
    responsePromptReadinessRow.sourceLocalAnchorHrefs.length ||
    responsePromptReadinessRow.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback constraint note");
  }

  if (
    responsePromptReadinessRow.gapDiscussionPointIds.length ||
    responsePromptReadinessRow.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder constraint note");
  }

  return labels;
}

function responsePromptReadinessRowMatchesStaticAnswerCheckCard(
  responsePromptReadinessRow: Stage78ReadinessRow,
  staticAnswerCheckCard: Stage78StaticAnswerCheckCard,
): boolean {
  return (
    responsePromptReadinessRow.sourceResponseMapReviewPathStepIds.includes(
      staticAnswerCheckCard.sourceResponseMapReviewPathStepId,
    ) ||
    staticAnswerCheckCard.sourceStaticResponsePromptCardIds.includes(
      responsePromptReadinessRow.sourceStaticResponsePromptCardId,
    ) ||
    responsePromptReadinessRow.sourceResponseMapRowIds.includes(
      staticAnswerCheckCard.sourceResponseMapRowId,
    )
  );
}

function staticNonGoalFlags(
  sourceFlags: Stage78StaticNonGoalFlags,
): Stage79StaticNonGoalFlags {
  return {
    ...sourceFlags,
    noSavedAnswerReviewState: true,
    noSavedAnswerReviewPath: true,
    noSavedAnswerReviewPathSteps: true,
    noSavedConstraintNoteState: true,
    noSavedConstraintNotes: true,
    noSavedConstraintNoteCards: true,
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
