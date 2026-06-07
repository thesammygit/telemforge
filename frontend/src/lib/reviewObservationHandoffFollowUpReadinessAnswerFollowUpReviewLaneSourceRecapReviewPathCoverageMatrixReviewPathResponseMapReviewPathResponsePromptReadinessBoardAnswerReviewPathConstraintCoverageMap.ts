import type {
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardView as Stage79StaticConstraintNoteCard,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticNonGoalFlagsView as Stage79StaticNonGoalFlags,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStepView as Stage79AnswerReviewPathStep,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathSummaryView as Stage79Summary,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathView as Stage79View,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapRowView as Stage80ConstraintCoverageRow,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticNonGoalFlagsView as Stage80StaticNonGoalFlags,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardView as Stage80StaticResponseNotePromptCard,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapSummaryView as Stage80Summary,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapView as Stage80View,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap(
  sourceAnswerReviewPath: Stage79View | undefined,
): Stage80View | undefined {
  if (
    !sourceAnswerReviewPath?.answerReviewPathSteps.length ||
    !sourceAnswerReviewPath.staticConstraintNoteCards.length
  ) {
    return undefined;
  }

  const constraintCoverageRows = sourceAnswerReviewPath.answerReviewPathSteps.map(
    (step) =>
      buildConstraintCoverageRow(
        step,
        sourceAnswerReviewPath.staticConstraintNoteCards,
      ),
  );
  const staticResponseNotePromptCards =
    sourceAnswerReviewPath.staticConstraintNoteCards.map((constraintNote) =>
      buildStaticResponseNotePromptCard(
        constraintNote,
        sourceAnswerReviewPath.answerReviewPathSteps,
      ),
    );
  sourceAnswerReviewPath.answerReviewPathSteps.forEach((step, index) => {
    Object.assign(step, constraintCoverageRows[index]);
  });
  sourceAnswerReviewPath.staticConstraintNoteCards.forEach((card, index) => {
    Object.assign(card, staticResponseNotePromptCards[index]);
  });
  const defaultConstraintCoverageRow =
    constraintCoverageRows.find(
      (row) =>
        row.sourceAnswerReviewPathStepId ===
        sourceAnswerReviewPath.defaultAnswerReviewPathStep
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStepId,
    ) ?? constraintCoverageRows[0];
  const defaultStaticResponseNotePromptCard =
    staticResponseNotePromptCards.find(
      (card) =>
        card.sourceStaticConstraintNoteCardId ===
        sourceAnswerReviewPath.defaultStaticConstraintNoteCard
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardId,
    ) ?? staticResponseNotePromptCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix_review_path_response_map_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage-review response-map review-path response-prompt readiness-board answer-review path constraint-coverage map and static response notes",
    localStatus: sourceAnswerReviewPath.localStatus,
    summary: {
      followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapId:
        "candidate-local-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-review-response-map-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map",
      label:
        "Local observation handoff follow-up readiness answer follow-up review lane source recap review path coverage-review response-map review-path response-prompt readiness-board answer-review path constraint-coverage map",
      summary:
        "A static constraint-coverage map derives from Stage 79 answer-review path steps and static constraint-note cards so reviewers can verify manual-answer constraints and source coverage before drafting the next response outside the app without saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved constraint-coverage state, saved response-note state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultResponseNoteContext: {
        defaultConstraintCoverageRowId:
          defaultConstraintCoverageRow
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapRowId,
        defaultStaticResponseNotePromptCardId:
          defaultStaticResponseNotePromptCard
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardId,
        defaultAnswerReviewPathStepId:
          defaultConstraintCoverageRow.sourceAnswerReviewPathStepId,
        defaultStaticConstraintNoteCardId:
          defaultStaticResponseNotePromptCard.sourceStaticConstraintNoteCardId,
        defaultStaticAnswerCheckCardId:
          defaultConstraintCoverageRow.sourceStaticAnswerCheckCardId,
        defaultResponsePromptReadinessRowId:
          defaultStaticResponseNotePromptCard.sourceResponsePromptReadinessRowId,
        defaultStaticResponsePromptCardId:
          defaultStaticResponseNotePromptCard.sourceStaticResponsePromptCardId,
        defaultResponseMapReviewPathStepId:
          defaultConstraintCoverageRow.sourceResponseMapReviewPathStepId,
        defaultResponseMapRowId: defaultConstraintCoverageRow.sourceResponseMapRowId,
        defaultResponseMapStaticFollowUpPromptCardId:
          defaultStaticResponseNotePromptCard
            .sourceResponseMapStaticFollowUpPromptCardId,
        defaultCoverageReviewPathStepId:
          defaultConstraintCoverageRow.sourceCoverageReviewPathStepId,
        defaultCoverageMatrixRowId:
          defaultConstraintCoverageRow.sourceCoverageMatrixRowId,
        defaultReviewPathSourceStepId:
          defaultConstraintCoverageRow.sourceReviewPathStepId,
        defaultSourceRecapRowId:
          defaultConstraintCoverageRow.sourceSourceRecapRowId,
        defaultAnswerFollowUpReviewLaneRowId:
          defaultConstraintCoverageRow.sourceAnswerFollowUpReviewLaneRowId,
        defaultAnswerSourceCrosswalkRowId:
          defaultConstraintCoverageRow.sourceAnswerSourceCrosswalkRowId,
        defaultAnswerWalkthroughStepId:
          defaultConstraintCoverageRow.sourceAnswerWalkthroughStepId,
        defaultAnswerCoverageRowId:
          defaultConstraintCoverageRow.sourceAnswerCoverageRowId,
        defaultRehearsalPathStepId:
          defaultConstraintCoverageRow.sourceRehearsalPathStepId,
        defaultReviewBoardRowId:
          defaultConstraintCoverageRow.sourceReviewBoardRowId,
        defaultFollowUpReadinessBriefRowId:
          defaultConstraintCoverageRow.followUpReadinessBriefRowId,
        defaultFollowUpTriageRowId:
          defaultConstraintCoverageRow
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        defaultStaticCoveragePromptCardId:
          defaultStaticResponseNotePromptCard.sourceStaticCoveragePromptCardId,
        defaultStaticReadinessCueCardId:
          defaultStaticResponseNotePromptCard.sourceStaticReadinessCueCardId,
        defaultStaticReviewerCheckCardId:
          defaultStaticResponseNotePromptCard.sourceStaticReviewerCheckCardId,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathSummary:
          sourceAnswerReviewPath.summary.summary,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathDefaultContext:
          sourceAnswerReviewPath.summary.defaultAnswerReviewContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        constraintCoverageRows,
        staticResponseNotePromptCards,
        sourceAnswerReviewPath,
      ),
    },
    defaultConstraintCoverageRow,
    defaultStaticResponseNotePromptCard,
    constraintCoverageRows,
    staticResponseNotePromptCards,
    staticSourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapSummary:
      "Stage 80 constraint-coverage rows and static response-note prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, response notes, constraint-coverage state, response-note state, answer-review state, constraint-note state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPath:
      sourceAnswerReviewPath,
  };
}

function buildConstraintCoverageRow(
  answerReviewPathStep: Stage79AnswerReviewPathStep,
  staticConstraintNoteCards: Stage79StaticConstraintNoteCard[],
): Stage80ConstraintCoverageRow {
  const sourceAnswerReviewPathStepId =
    answerReviewPathStep
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStepId;
  const matchedStaticConstraintNoteCards = staticConstraintNoteCards.filter(
    (card) =>
      staticConstraintNoteCardMatchesAnswerReviewPathStep(
        card,
        answerReviewPathStep,
      ),
  );
  const sourceStaticConstraintNoteCardIds =
    matchedStaticConstraintNoteCards.map(
      (card) =>
        card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardId,
    );
  const staticConstraintNoteLabels = matchedStaticConstraintNoteCards.flatMap(
    (card) => card.staticConstraintNoteLabels,
  );
  const staticResponsePromptReadinessText = matchedStaticConstraintNoteCards
    .map((card) => card.responsePromptReadinessText)
    .join(" | ");
  const constraintCoverageLabels = buildConstraintCoverageLabels(
    answerReviewPathStep,
    matchedStaticConstraintNoteCards,
  );
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapRowId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map:row:${sourceAnswerReviewPathStepId}`;

  return {
    ...answerReviewPathStep,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapRowId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapRowIds:
      [
        followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapRowId,
      ],
    constraintCoverageRowOrder:
      answerReviewPathStep
        .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStepOrder,
    sourceAnswerReviewPathStepId,
    sourceAnswerReviewPathStepIds: [sourceAnswerReviewPathStepId],
    sourceStaticConstraintNoteCardIds,
    staticConstraintNoteLabels,
    constraintCoverageLabels,
    staticResponsePromptReadinessText,
    constraintCoverageText:
      `Constraint-coverage row ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapRowId}: verify Stage 79 answer-review path step ${sourceAnswerReviewPathStepId}, Stage 79 static constraint-note cards ${sourceStaticConstraintNoteCardIds.join(", ") || "none"}, Stage 78 static answer-check card ${answerReviewPathStep.sourceStaticAnswerCheckCardId}, Stage 78 readiness rows ${answerReviewPathStep.sourceResponsePromptReadinessRowIds.join(", ") || "none"}, Stage 77 static response-prompt cards ${answerReviewPathStep.sourceStaticResponsePromptCardIds.join(", ") || "none"}, Stage 77 response-map review-path step ${answerReviewPathStep.sourceResponseMapReviewPathStepId}, Stage 76 response-map row ${answerReviewPathStep.sourceResponseMapRowId}, Stage 76 static follow-up prompt cards ${answerReviewPathStep.sourceResponseMapStaticFollowUpPromptCardIds.join(", ") || "none"}, Stage 75 coverage-review step ${answerReviewPathStep.sourceCoverageReviewPathStepId}, Stage 74 coverage row ${answerReviewPathStep.sourceCoverageMatrixRowId}, Stage 73 review-path step ${answerReviewPathStep.sourceReviewPathStepId}, Stage 72 source recap row ${answerReviewPathStep.sourceSourceRecapRowId}, Stage 71 review-lane row ${answerReviewPathStep.sourceAnswerFollowUpReviewLaneRowId}, Stage 70 crosswalk row ${answerReviewPathStep.sourceAnswerSourceCrosswalkRowId}, Stage 69 walkthrough step ${answerReviewPathStep.sourceAnswerWalkthroughStepId}, Stage 68 answer coverage row ${answerReviewPathStep.sourceAnswerCoverageRowId}, Stage 67 rehearsal step ${answerReviewPathStep.sourceRehearsalPathStepId}, Stage 66 board row ${answerReviewPathStep.sourceReviewBoardRowId}, Stage 65 brief row ${answerReviewPathStep.followUpReadinessBriefRowId}, Stage 64 triage row ${answerReviewPathStep.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${answerReviewPathStep.sourceLocalAnchorHrefs.join(", ")}, callbacks ${answerReviewPathStep.evidenceCallbackIds.join(", ")}, gap prompts ${answerReviewPathStep.gapDiscussionPointIds.join(", ")}, deferred reminders ${answerReviewPathStep.deferredScopeReminderIds.join(", ")}, answer-review labels ${answerReviewPathStep.answerReviewPathLabels.join(", ") || "none"}, constraint-note labels ${staticConstraintNoteLabels.join(", ") || "none"}, static answer-check text "${answerReviewPathStep.staticAnswerCheckText}", response-prompt readiness text "${staticResponsePromptReadinessText}", answer-review text "${answerReviewPathStep.answerReviewPathText}", and static constraint-note text "${answerReviewPathStep.staticConstraintNoteText}" as deterministic manual-answer constraint support only.`,
    staticResponseNotePromptText:
      `Static response-note prompt for constraint-coverage row ${sourceAnswerReviewPathStepId}: compare answer-review path step ${sourceAnswerReviewPathStepId}, Stage 79 constraint notes ${sourceStaticConstraintNoteCardIds.join(", ") || "none"}, Stage 78 static answer-check card ${answerReviewPathStep.sourceStaticAnswerCheckCardId}, response-prompt readiness text "${staticResponsePromptReadinessText}", anchors ${answerReviewPathStep.sourceLocalAnchorHrefs.join(", ")}, callbacks ${answerReviewPathStep.evidenceCallbackIds.join(", ")}, gap prompts ${answerReviewPathStep.gapDiscussionPointIds.join(", ")}, and deferred reminders ${answerReviewPathStep.deferredScopeReminderIds.join(", ")} before drafting the next response note outside the app without saving reviewer answers, answer drafts, reviewer notes, response notes, constraint-coverage state, response-note state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static constraint-coverage context: manual-answer constraint support, response-prompt readiness, and source lineage only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved constraint-coverage state, saved response-note state, saved answer-review state, saved constraint-note state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      answerReviewPathStep.staticNonGoalFlags,
    ),
  };
}

function buildStaticResponseNotePromptCard(
  staticConstraintNoteCard: Stage79StaticConstraintNoteCard,
  answerReviewPathSteps: Stage79AnswerReviewPathStep[],
): Stage80StaticResponseNotePromptCard {
  const sourceStaticConstraintNoteCardId =
    staticConstraintNoteCard
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardId;
  const matchedAnswerReviewPathSteps = answerReviewPathSteps.filter((step) =>
    staticConstraintNoteCardMatchesAnswerReviewPathStep(
      staticConstraintNoteCard,
      step,
    ),
  );
  const sourceAnswerReviewPathStepIds = matchedAnswerReviewPathSteps.map(
    (step) =>
      step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStepId,
  );
  const staticResponseNotePromptLabels = buildStaticResponseNotePromptLabels(
    staticConstraintNoteCard,
    matchedAnswerReviewPathSteps,
  );
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map:static-response-note-prompt:${sourceStaticConstraintNoteCardId}`;

  return {
    ...staticConstraintNoteCard,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardIds:
      [
        followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardId,
      ],
    sourceStaticConstraintNoteCardId,
    sourceStaticConstraintNoteCardIds: [sourceStaticConstraintNoteCardId],
    sourceAnswerReviewPathStepIds,
    staticResponseNotePromptOrder:
      staticConstraintNoteCard.staticConstraintNoteOrder,
    staticResponseNotePromptLabels,
    staticResponseNotePromptText:
      `Static response-note prompt ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardId}: use Stage 79 static constraint-note card ${sourceStaticConstraintNoteCardId}, matched Stage 79 answer-review path steps ${sourceAnswerReviewPathStepIds.join(", ") || "none"}, Stage 78 readiness row ${staticConstraintNoteCard.sourceResponsePromptReadinessRowId}, Stage 78 answer-check cards ${staticConstraintNoteCard.sourceStaticAnswerCheckCardIds.join(", ") || "none"}, Stage 77 static response-prompt card ${staticConstraintNoteCard.sourceStaticResponsePromptCardId}, Stage 76 response-map rows ${staticConstraintNoteCard.sourceResponseMapRowIds.join(", ") || "none"}, anchors ${staticConstraintNoteCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticConstraintNoteCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticConstraintNoteCard.gapDiscussionPointIds.join(", ")}, deferred reminders ${staticConstraintNoteCard.deferredScopeReminderIds.join(", ")}, response-prompt readiness labels ${staticConstraintNoteCard.responsePromptReadinessLabels.join(", ") || "none"}, and constraint-note labels ${staticConstraintNoteCard.staticConstraintNoteLabels.join(", ") || "none"} as static manual response-note context only.`,
    staticNonGoalContext:
      "Static response-note prompt context: manual response drafting outside the app only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved constraint-coverage state, saved response-note state, saved answer-review state, saved constraint-note state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticConstraintNoteCard.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  constraintCoverageRows: Stage80ConstraintCoverageRow[],
  staticResponseNotePromptCards: Stage80StaticResponseNotePromptCard[],
  sourceAnswerReviewPath: Stage79View,
): Stage80Summary["counts"] {
  const sourceCounts = sourceAnswerReviewPath.summary.counts;

  return {
    ...sourceCounts,
    constraintCoverageRowCount: constraintCoverageRows.length,
    staticResponseNotePromptCardCount: staticResponseNotePromptCards.length,
    constraintCoverageLabelCount: unique(
      constraintCoverageRows.flatMap((row) => row.constraintCoverageLabels),
    ).length,
    staticResponseNotePromptLabelCount: unique(
      staticResponseNotePromptCards.flatMap(
        (card) => card.staticResponseNotePromptLabels,
      ),
    ).length,
    localOnlyConstraintCoverageRowCount: constraintCoverageRows.filter(
      (row) => row.localOnly,
    ).length,
    localOnlyStaticResponseNotePromptCardCount:
      staticResponseNotePromptCards.filter((card) => card.localOnly).length,
  };
}

function buildConstraintCoverageLabels(
  answerReviewPathStep: Stage79AnswerReviewPathStep,
  matchedStaticConstraintNoteCards: Stage79StaticConstraintNoteCard[],
): string[] {
  const labels = [
    "constraint-coverage row",
    "manual-answer constraint support map",
  ];

  if (matchedStaticConstraintNoteCards.length) {
    labels.push("static constraint-note source alignment");
  }

  if (answerReviewPathStep.answerReviewPathLabels.length) {
    labels.push("answer-review path carry-forward");
  }

  if (
    answerReviewPathStep.sourceLocalAnchorHrefs.length ||
    answerReviewPathStep.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback constraint coverage");
  }

  if (
    answerReviewPathStep.gapDiscussionPointIds.length ||
    answerReviewPathStep.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder constraint coverage");
  }

  return labels;
}

function buildStaticResponseNotePromptLabels(
  staticConstraintNoteCard: Stage79StaticConstraintNoteCard,
  matchedAnswerReviewPathSteps: Stage79AnswerReviewPathStep[],
): string[] {
  const labels = [
    "static response-note prompt",
    "manual answer constraint carry-forward",
  ];

  if (matchedAnswerReviewPathSteps.length) {
    labels.push("answer-review path source alignment");
  }

  if (staticConstraintNoteCard.staticConstraintNoteLabels.length) {
    labels.push("constraint-note carry-forward");
  }

  if (
    staticConstraintNoteCard.sourceLocalAnchorHrefs.length ||
    staticConstraintNoteCard.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback response-note context");
  }

  if (
    staticConstraintNoteCard.gapDiscussionPointIds.length ||
    staticConstraintNoteCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder response-note context");
  }

  return labels;
}

function staticConstraintNoteCardMatchesAnswerReviewPathStep(
  staticConstraintNoteCard: Stage79StaticConstraintNoteCard,
  answerReviewPathStep: Stage79AnswerReviewPathStep,
): boolean {
  return (
    answerReviewPathStep.sourceResponsePromptReadinessRowIds.includes(
      staticConstraintNoteCard.sourceResponsePromptReadinessRowId,
    ) ||
    staticConstraintNoteCard.sourceStaticAnswerCheckCardIds.includes(
      answerReviewPathStep.sourceStaticAnswerCheckCardId,
    ) ||
    answerReviewPathStep.sourceStaticResponsePromptCardIds.includes(
      staticConstraintNoteCard.sourceStaticResponsePromptCardId,
    )
  );
}

function staticNonGoalFlags(
  sourceFlags: Stage79StaticNonGoalFlags,
): Stage80StaticNonGoalFlags {
  return {
    ...sourceFlags,
    noSavedConstraintCoverageState: true,
    noSavedConstraintCoverageMap: true,
    noSavedConstraintCoverageRows: true,
    noSavedResponseNoteState: true,
    noSavedResponseNotes: true,
    noSavedResponseNotePromptCards: true,
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
