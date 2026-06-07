import type {
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticNonGoalFlagsView as Stage81StaticNonGoalFlags,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticResponsePromptCardView as Stage81StaticResponsePromptCard,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepView as Stage81ReviewPathStep,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSummaryView as Stage81Summary,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathView as Stage81View,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapRowView as Stage80ConstraintCoverageRow,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticNonGoalFlagsView as Stage80StaticNonGoalFlags,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardView as Stage80StaticResponseNotePromptCard,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapView as Stage80View,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath(
  sourceConstraintCoverageMap: Stage80View | undefined,
): Stage81View | undefined {
  if (
    !sourceConstraintCoverageMap?.constraintCoverageRows.length ||
    !sourceConstraintCoverageMap.staticResponseNotePromptCards.length
  ) {
    return undefined;
  }

  const constraintResponseReviewPathSteps =
    sourceConstraintCoverageMap.constraintCoverageRows.map((row) =>
      buildConstraintResponseReviewPathStep(
        row,
        sourceConstraintCoverageMap.staticResponseNotePromptCards,
      ),
    );
  const staticResponseReviewPromptCards =
    sourceConstraintCoverageMap.staticResponseNotePromptCards.map((card) =>
      buildStaticResponseReviewPromptCard(
        card,
        constraintResponseReviewPathSteps,
      ),
    );
  const defaultConstraintResponseReviewPathStep =
    constraintResponseReviewPathSteps.find(
      (step) =>
        step.sourceConstraintCoverageRowId ===
        sourceConstraintCoverageMap.defaultConstraintCoverageRow
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapRowId,
    ) ?? constraintResponseReviewPathSteps[0];
  const defaultStaticResponseReviewPromptCard =
    staticResponseReviewPromptCards.find(
      (card) =>
        card.sourceStaticResponseNotePromptCardId ===
        sourceConstraintCoverageMap.defaultStaticResponseNotePromptCard
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardId,
    ) ?? staticResponseReviewPromptCards[0];
  const sourceDefaultContext =
    sourceConstraintCoverageMap.summary.defaultResponseNoteContext;

  return {
    schema:
      "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix_review_path_response_map_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage-review response-map review-path response-prompt readiness-board answer-review path constraint-coverage map constraint-response review path and static response prompts",
    localStatus: sourceConstraintCoverageMap.localStatus,
    summary: {
      followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathId:
        "candidate-local-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-review-response-map-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path",
      label:
        "Local observation handoff follow-up readiness answer follow-up review lane source recap review path coverage-review response-map review-path response-prompt readiness-board answer-review path constraint-response review path",
      summary:
        "A static constraint-response review path derives from Stage 80 constraint-coverage rows and response-note prompt cards so reviewers can walk coverage rows in order and prepare response drafting outside the app without saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved response-review prompt state, saved review-path state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultConstraintResponseReviewContext: {
        defaultConstraintResponseReviewPathStepId:
          defaultConstraintResponseReviewPathStep
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepId,
        defaultStaticResponseReviewPromptCardId:
          defaultStaticResponseReviewPromptCard
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticResponsePromptCardId,
        defaultConstraintCoverageRowId:
          defaultConstraintResponseReviewPathStep.sourceConstraintCoverageRowId,
        defaultStaticResponseNotePromptCardId:
          defaultStaticResponseReviewPromptCard.sourceStaticResponseNotePromptCardId,
        defaultAnswerReviewPathStepId:
          sourceDefaultContext.defaultAnswerReviewPathStepId,
        defaultStaticConstraintNoteCardId:
          sourceDefaultContext.defaultStaticConstraintNoteCardId,
        defaultStaticAnswerCheckCardId:
          sourceDefaultContext.defaultStaticAnswerCheckCardId,
        defaultResponsePromptReadinessRowId:
          sourceDefaultContext.defaultResponsePromptReadinessRowId,
        defaultStaticResponsePromptCardId:
          sourceDefaultContext.defaultStaticResponsePromptCardId,
        defaultResponseMapReviewPathStepId:
          sourceDefaultContext.defaultResponseMapReviewPathStepId,
        defaultResponseMapRowId: sourceDefaultContext.defaultResponseMapRowId,
        defaultResponseMapStaticFollowUpPromptCardId:
          sourceDefaultContext.defaultResponseMapStaticFollowUpPromptCardId,
        defaultCoverageReviewPathStepId:
          sourceDefaultContext.defaultCoverageReviewPathStepId,
        defaultCoverageMatrixRowId:
          sourceDefaultContext.defaultCoverageMatrixRowId,
        defaultReviewPathSourceStepId:
          sourceDefaultContext.defaultReviewPathSourceStepId,
        defaultSourceRecapRowId: sourceDefaultContext.defaultSourceRecapRowId,
        defaultAnswerFollowUpReviewLaneRowId:
          sourceDefaultContext.defaultAnswerFollowUpReviewLaneRowId,
        defaultAnswerSourceCrosswalkRowId:
          sourceDefaultContext.defaultAnswerSourceCrosswalkRowId,
        defaultAnswerWalkthroughStepId:
          sourceDefaultContext.defaultAnswerWalkthroughStepId,
        defaultAnswerCoverageRowId:
          sourceDefaultContext.defaultAnswerCoverageRowId,
        defaultRehearsalPathStepId:
          sourceDefaultContext.defaultRehearsalPathStepId,
        defaultReviewBoardRowId:
          sourceDefaultContext.defaultReviewBoardRowId,
        defaultFollowUpReadinessBriefRowId:
          sourceDefaultContext.defaultFollowUpReadinessBriefRowId,
        defaultFollowUpTriageRowId:
          sourceDefaultContext.defaultFollowUpTriageRowId,
        defaultStaticCoveragePromptCardId:
          sourceDefaultContext.defaultStaticCoveragePromptCardId,
        defaultStaticReadinessCueCardId:
          sourceDefaultContext.defaultStaticReadinessCueCardId,
        defaultStaticReviewerCheckCardId:
          sourceDefaultContext.defaultStaticReviewerCheckCardId,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapSummary:
          sourceConstraintCoverageMap.summary.summary,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapDefaultContext:
          sourceDefaultContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        constraintResponseReviewPathSteps,
        staticResponseReviewPromptCards,
        sourceConstraintCoverageMap,
      ),
    },
    defaultConstraintResponseReviewPathStep,
    defaultStaticResponseReviewPromptCard,
    constraintResponseReviewPathSteps,
    staticResponseReviewPromptCards,
    staticSourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSummary:
      "Stage 81 constraint-response review path steps and static response-review prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, response notes, response-review prompt state, review-path state, constraint-response review state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap:
      sourceConstraintCoverageMap,
  };
}

function buildConstraintResponseReviewPathStep(
  constraintCoverageRow: Stage80ConstraintCoverageRow,
  staticResponseNotePromptCards: Stage80StaticResponseNotePromptCard[],
): Stage81ReviewPathStep {
  const sourceConstraintCoverageRowId =
    constraintCoverageRow
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapRowId;
  const matchedStaticResponseNotePromptCards =
    staticResponseNotePromptCards.filter((card) =>
      staticResponseNotePromptCardMatchesConstraintCoverageRow(
        card,
        constraintCoverageRow,
      ),
    );
  const sourceStaticResponseNotePromptCardIds =
    matchedStaticResponseNotePromptCards.map(
      (card) =>
        card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardId,
    );
  const staticResponseReviewPromptText =
    matchedStaticResponseNotePromptCards
      .map((card) => card.staticResponseNotePromptText)
      .join(" | ");
  const constraintResponseReviewPathLabels =
    buildConstraintResponseReviewPathLabels(
      constraintCoverageRow,
      matchedStaticResponseNotePromptCards,
    );
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path:step:${sourceConstraintCoverageRowId}`;

  return {
    ...constraintCoverageRow,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepIds:
      [
        followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepId,
      ],
    constraintResponseReviewPathStepOrder:
      constraintCoverageRow.constraintCoverageRowOrder,
    sourceConstraintCoverageRowId,
    sourceConstraintCoverageRowIds: [sourceConstraintCoverageRowId],
    sourceStaticResponseNotePromptCardIds,
    constraintResponseReviewPathLabels,
    constraintResponseReviewPathText:
      `Constraint-response review path step ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepId}: walk Stage 80 constraint-coverage row ${sourceConstraintCoverageRowId}, Stage 80 response-note prompt cards ${sourceStaticResponseNotePromptCardIds.join(", ") || "none"}, Stage 79 answer-review step ${constraintCoverageRow.sourceAnswerReviewPathStepId}, Stage 79 static constraint-note cards ${constraintCoverageRow.sourceStaticConstraintNoteCardIds.join(", ") || "none"}, Stage 78 static answer-check card ${constraintCoverageRow.sourceStaticAnswerCheckCardId}, Stage 78 readiness rows ${constraintCoverageRow.sourceResponsePromptReadinessRowIds.join(", ") || "none"}, Stage 77 static response-prompt cards ${constraintCoverageRow.sourceStaticResponsePromptCardIds.join(", ") || "none"}, Stage 77 response-map review-path step ${constraintCoverageRow.sourceResponseMapReviewPathStepId}, Stage 76 response-map row ${constraintCoverageRow.sourceResponseMapRowId}, Stage 76 static follow-up prompt cards ${constraintCoverageRow.sourceResponseMapStaticFollowUpPromptCardIds.join(", ") || "none"}, Stage 75 coverage-review step ${constraintCoverageRow.sourceCoverageReviewPathStepId}, Stage 74 coverage row ${constraintCoverageRow.sourceCoverageMatrixRowId}, Stage 73 review-path step ${constraintCoverageRow.sourceReviewPathStepId}, Stage 72 source recap row ${constraintCoverageRow.sourceSourceRecapRowId}, Stage 71 review-lane row ${constraintCoverageRow.sourceAnswerFollowUpReviewLaneRowId}, Stage 70 crosswalk row ${constraintCoverageRow.sourceAnswerSourceCrosswalkRowId}, Stage 69 walkthrough step ${constraintCoverageRow.sourceAnswerWalkthroughStepId}, Stage 68 answer coverage row ${constraintCoverageRow.sourceAnswerCoverageRowId}, Stage 67 rehearsal step ${constraintCoverageRow.sourceRehearsalPathStepId}, Stage 66 board row ${constraintCoverageRow.sourceReviewBoardRowId}, Stage 65 brief row ${constraintCoverageRow.followUpReadinessBriefRowId}, Stage 64 triage row ${constraintCoverageRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${constraintCoverageRow.sourceLocalAnchorHrefs.join(", ")}, callbacks ${constraintCoverageRow.evidenceCallbackIds.join(", ")}, gap prompts ${constraintCoverageRow.gapDiscussionPointIds.join(", ")}, deferred reminders ${constraintCoverageRow.deferredScopeReminderIds.join(", ")}, constraint labels ${constraintCoverageRow.constraintCoverageLabels.join(", ") || "none"}, response-review labels ${constraintResponseReviewPathLabels.join(", ") || "none"}, static response-note text "${constraintCoverageRow.staticResponseNotePromptText}", response-review prompt text "${staticResponseReviewPromptText}", local-only flag ${constraintCoverageRow.localOnly ? "true" : "false"}, and static non-goal context "${constraintCoverageRow.staticNonGoalContext}" as deterministic manual-review response context only.`,
    staticResponseReviewPromptText:
      `Static response-review prompt for constraint-response step ${constraintCoverageRow.sourceAnswerReviewPathStepId}: compare Stage 80 constraint-coverage row ${sourceConstraintCoverageRowId}, Stage 80 response-note prompt cards ${sourceStaticResponseNotePromptCardIds.join(", ") || "none"}, Stage 79 answer-review step ${constraintCoverageRow.sourceAnswerReviewPathStepId}, Stage 79 constraint notes ${constraintCoverageRow.sourceStaticConstraintNoteCardIds.join(", ") || "none"}, Stage 78 static answer-check card ${constraintCoverageRow.sourceStaticAnswerCheckCardId}, Stage 77 response-map review-path step ${constraintCoverageRow.sourceResponseMapReviewPathStepId}, anchors ${constraintCoverageRow.sourceLocalAnchorHrefs.join(", ")}, callbacks ${constraintCoverageRow.evidenceCallbackIds.join(", ")}, gap prompts ${constraintCoverageRow.gapDiscussionPointIds.join(", ")}, deferred reminders ${constraintCoverageRow.deferredScopeReminderIds.join(", ")}, and carried response-note prompt text "${constraintCoverageRow.staticResponseNotePromptText}" before drafting the next response outside the app without saving reviewer answers, answer drafts, reviewer notes, response notes, response-review prompt state, review-path state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static constraint-response review-path context: manual response-review preparation and source lineage only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved response-review prompt state, saved review-path state, saved constraint-response review state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      constraintCoverageRow.staticNonGoalFlags,
    ),
  };
}

function buildStaticResponseReviewPromptCard(
  staticResponseNotePromptCard: Stage80StaticResponseNotePromptCard,
  constraintResponseReviewPathSteps: Stage81ReviewPathStep[],
): Stage81StaticResponsePromptCard {
  const sourceStaticResponseNotePromptCardId =
    staticResponseNotePromptCard
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardId;
  const matchedConstraintResponseReviewPathSteps =
    constraintResponseReviewPathSteps.filter((step) =>
      step.sourceStaticResponseNotePromptCardIds.includes(
        sourceStaticResponseNotePromptCardId,
      ),
    );
  const sourceConstraintResponseReviewPathStepIds =
    matchedConstraintResponseReviewPathSteps.map(
      (step) =>
        step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepId,
    );
  const staticResponseReviewPromptLabels =
    buildStaticResponseReviewPromptLabels(
      staticResponseNotePromptCard,
      matchedConstraintResponseReviewPathSteps,
    );
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticResponsePromptCardId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path:static-response-prompt:${sourceStaticResponseNotePromptCardId}`;

  return {
    ...staticResponseNotePromptCard,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticResponsePromptCardId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticResponsePromptCardIds:
      [
        followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticResponsePromptCardId,
      ],
    sourceStaticResponseNotePromptCardId,
    sourceStaticResponseNotePromptCardIds: [sourceStaticResponseNotePromptCardId],
    sourceConstraintResponseReviewPathStepIds,
    staticResponseReviewPromptOrder:
      staticResponseNotePromptCard.staticResponseNotePromptOrder,
    staticResponseReviewPromptLabels,
    staticResponseReviewPromptText:
      `Static response-review prompt ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticResponsePromptCardId}: use Stage 80 response-note prompt card ${sourceStaticResponseNotePromptCardId}, matched Stage 81 constraint-response review path steps ${sourceConstraintResponseReviewPathStepIds.join(", ") || "none"}, Stage 79 static constraint-note card ${staticResponseNotePromptCard.sourceStaticConstraintNoteCardId}, Stage 79 answer-review path steps ${staticResponseNotePromptCard.sourceAnswerReviewPathStepIds.join(", ") || "none"}, Stage 78 readiness row ${staticResponseNotePromptCard.sourceResponsePromptReadinessRowId}, Stage 78 static answer-check cards ${staticResponseNotePromptCard.sourceStaticAnswerCheckCardIds.join(", ") || "none"}, Stage 77 static response-prompt card ${staticResponseNotePromptCard.sourceStaticResponsePromptCardId}, Stage 76 response-map rows ${staticResponseNotePromptCard.sourceResponseMapRowIds.join(", ") || "none"}, anchors ${staticResponseNotePromptCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticResponseNotePromptCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticResponseNotePromptCard.gapDiscussionPointIds.join(", ")}, deferred reminders ${staticResponseNotePromptCard.deferredScopeReminderIds.join(", ")}, response-note labels ${staticResponseNotePromptCard.staticResponseNotePromptLabels.join(", ") || "none"}, response-review labels ${staticResponseReviewPromptLabels.join(", ") || "none"}, and carried response-note prompt text "${staticResponseNotePromptCard.staticResponseNotePromptText}" as static manual response-review context only.`,
    staticNonGoalContext:
      "Static response-review prompt context: manual response drafting outside the app only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved response-review prompt state, saved review-path state, saved constraint-response review state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticResponseNotePromptCard.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  constraintResponseReviewPathSteps: Stage81ReviewPathStep[],
  staticResponseReviewPromptCards: Stage81StaticResponsePromptCard[],
  sourceConstraintCoverageMap: Stage80View,
): Stage81Summary["counts"] {
  const sourceCounts = sourceConstraintCoverageMap.summary.counts;

  return {
    ...sourceCounts,
    constraintResponseReviewPathStepCount:
      constraintResponseReviewPathSteps.length,
    staticResponseReviewPromptCardCount:
      staticResponseReviewPromptCards.length,
    constraintResponseReviewPathLabelCount: unique(
      constraintResponseReviewPathSteps.flatMap(
        (step) => step.constraintResponseReviewPathLabels,
      ),
    ).length,
    staticResponseReviewPromptLabelCount: unique(
      staticResponseReviewPromptCards.flatMap(
        (card) => card.staticResponseReviewPromptLabels,
      ),
    ).length,
    localOnlyConstraintResponseReviewPathStepCount:
      constraintResponseReviewPathSteps.filter((step) => step.localOnly).length,
    localOnlyStaticResponseReviewPromptCardCount:
      staticResponseReviewPromptCards.filter((card) => card.localOnly).length,
  };
}

function buildConstraintResponseReviewPathLabels(
  constraintCoverageRow: Stage80ConstraintCoverageRow,
  matchedStaticResponseNotePromptCards: Stage80StaticResponseNotePromptCard[],
): string[] {
  const labels = [
    "constraint-response review path step",
    "static response prompt carry-forward",
  ];

  if (matchedStaticResponseNotePromptCards.length) {
    labels.push("response-note prompt source alignment");
  }

  if (constraintCoverageRow.constraintCoverageLabels.length) {
    labels.push("constraint-coverage carry-forward");
  }

  if (
    constraintCoverageRow.sourceLocalAnchorHrefs.length ||
    constraintCoverageRow.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback response-review context");
  }

  if (
    constraintCoverageRow.gapDiscussionPointIds.length ||
    constraintCoverageRow.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder response-review context");
  }

  return labels;
}

function buildStaticResponseReviewPromptLabels(
  staticResponseNotePromptCard: Stage80StaticResponseNotePromptCard,
  matchedConstraintResponseReviewPathSteps: Stage81ReviewPathStep[],
): string[] {
  const labels = [
    "static response-review prompt",
    "response-note prompt carry-forward",
  ];

  if (matchedConstraintResponseReviewPathSteps.length) {
    labels.push("constraint-response review path source alignment");
  }

  if (staticResponseNotePromptCard.staticResponseNotePromptLabels.length) {
    labels.push("static response-note prompt context");
  }

  if (
    staticResponseNotePromptCard.sourceLocalAnchorHrefs.length ||
    staticResponseNotePromptCard.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback response-review prompt context");
  }

  if (
    staticResponseNotePromptCard.gapDiscussionPointIds.length ||
    staticResponseNotePromptCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder response-review prompt context");
  }

  return labels;
}

function staticResponseNotePromptCardMatchesConstraintCoverageRow(
  staticResponseNotePromptCard: Stage80StaticResponseNotePromptCard,
  constraintCoverageRow: Stage80ConstraintCoverageRow,
): boolean {
  return (
    staticResponseNotePromptCard.sourceAnswerReviewPathStepIds.includes(
      constraintCoverageRow.sourceAnswerReviewPathStepId,
    ) ||
    constraintCoverageRow.sourceStaticConstraintNoteCardIds.includes(
      staticResponseNotePromptCard.sourceStaticConstraintNoteCardId,
    ) ||
    constraintCoverageRow.sourceResponsePromptReadinessRowIds.includes(
      staticResponseNotePromptCard.sourceResponsePromptReadinessRowId,
    ) ||
    constraintCoverageRow.sourceStaticResponsePromptCardIds.includes(
      staticResponseNotePromptCard.sourceStaticResponsePromptCardId,
    )
  );
}

function staticNonGoalFlags(
  sourceFlags: Stage80StaticNonGoalFlags,
): Stage81StaticNonGoalFlags {
  return {
    ...sourceFlags,
    noSavedConstraintResponseReviewState: true,
    noSavedConstraintResponseReviewPath: true,
    noSavedConstraintResponseReviewPathSteps: true,
    noSavedReviewPathState: true,
    noSavedResponseReviewPromptState: true,
    noSavedResponseReviewPrompts: true,
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
