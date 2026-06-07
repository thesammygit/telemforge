import type {
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowView as Stage82SourceCrosswalkRow,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticNonGoalFlagsView as Stage82StaticNonGoalFlags,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardView as Stage82StaticReviewCheckCard,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkSummaryView as Stage82Summary,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkView as Stage82View,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticNonGoalFlagsView as Stage81StaticNonGoalFlags,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticResponsePromptCardView as Stage81StaticResponsePromptCard,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepView as Stage81ReviewPathStep,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathView as Stage81View,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk(
  sourceConstraintResponseReviewPath: Stage81View | undefined,
): Stage82View | undefined {
  if (
    !sourceConstraintResponseReviewPath?.constraintResponseReviewPathSteps
      .length ||
    !sourceConstraintResponseReviewPath.staticResponseReviewPromptCards.length
  ) {
    return undefined;
  }

  const sourceCrosswalkRows =
    sourceConstraintResponseReviewPath.constraintResponseReviewPathSteps.map(
      (step) =>
        buildSourceCrosswalkRow(
          step,
          sourceConstraintResponseReviewPath.staticResponseReviewPromptCards,
        ),
    );
  const staticReviewCheckCards =
    sourceConstraintResponseReviewPath.staticResponseReviewPromptCards.map(
      (card) => buildStaticReviewCheckCard(card, sourceCrosswalkRows),
    );
  const defaultSourceCrosswalkRow =
    sourceCrosswalkRows.find(
      (row) =>
        row.sourceConstraintResponseReviewPathStepId ===
        sourceConstraintResponseReviewPath.defaultConstraintResponseReviewPathStep
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepId,
    ) ?? sourceCrosswalkRows[0];
  const defaultStaticReviewCheckCard =
    staticReviewCheckCards.find(
      (card) =>
        card.sourceStaticResponseReviewPromptCardId ===
        sourceConstraintResponseReviewPath.defaultStaticResponseReviewPromptCard
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticResponsePromptCardId,
    ) ?? staticReviewCheckCards[0];
  const sourceDefaultContext =
    sourceConstraintResponseReviewPath.summary
      .defaultConstraintResponseReviewContext;

  return {
    schema:
      "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix_review_path_response_map_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage-review response-map review-path response-prompt readiness-board answer-review path constraint-response source crosswalk and static review checks",
    localStatus: sourceConstraintResponseReviewPath.localStatus,
    summary: {
      followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkId:
        "candidate-local-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-review-response-map-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path-source-crosswalk",
      label:
        "Local observation handoff follow-up readiness answer follow-up review lane source recap review path coverage-review response-map review-path response-prompt readiness-board answer-review path constraint-response source crosswalk",
      summary:
        "A static constraint-response source crosswalk derives from Stage 81 constraint-response review-path steps and response-review prompt cards so reviewers can compare each response-prep prompt with its source chain before drafting outside the app without saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved response-review state, saved source-crosswalk state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultSourceCheckContext: {
        defaultSourceCrosswalkRowId:
          defaultSourceCrosswalkRow
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId,
        defaultStaticReviewCheckCardId:
          defaultStaticReviewCheckCard
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId,
        defaultConstraintResponseReviewPathStepId:
          defaultSourceCrosswalkRow.sourceConstraintResponseReviewPathStepId,
        defaultStaticResponseReviewPromptCardId:
          defaultStaticReviewCheckCard.sourceStaticResponseReviewPromptCardId,
        defaultConstraintCoverageRowId:
          sourceDefaultContext.defaultConstraintCoverageRowId,
        defaultStaticResponseNotePromptCardId:
          sourceDefaultContext.defaultStaticResponseNotePromptCardId,
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
        defaultReviewBoardRowId: sourceDefaultContext.defaultReviewBoardRowId,
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
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSummary:
          sourceConstraintResponseReviewPath.summary.summary,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathDefaultContext:
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
        sourceCrosswalkRows,
        staticReviewCheckCards,
        sourceConstraintResponseReviewPath,
      ),
    },
    defaultSourceCrosswalkRow,
    defaultStaticReviewCheckCard,
    sourceCrosswalkRows,
    staticReviewCheckCards,
    staticSourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkSummary:
      "Stage 82 constraint-response source crosswalk rows and static review-check cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, response notes, source selections, response-review state, source-crosswalk state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath:
      sourceConstraintResponseReviewPath,
  };
}

function buildSourceCrosswalkRow(
  constraintResponseReviewPathStep: Stage81ReviewPathStep,
  staticResponseReviewPromptCards: Stage81StaticResponsePromptCard[],
): Stage82SourceCrosswalkRow {
  const sourceConstraintResponseReviewPathStepId =
    constraintResponseReviewPathStep
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepId;
  const matchedStaticResponseReviewPromptCards =
    staticResponseReviewPromptCards.filter((card) =>
      staticResponseReviewPromptCardMatchesReviewPathStep(
        card,
        constraintResponseReviewPathStep,
      ),
    );
  const sourceStaticResponseReviewPromptCardIds =
    matchedStaticResponseReviewPromptCards.map(
      (card) =>
        card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticResponsePromptCardId,
    );
  const sourceCrosswalkLabels = buildSourceCrosswalkLabels(
    constraintResponseReviewPathStep,
    matchedStaticResponseReviewPromptCards,
  );
  const sourceReviewCheckText =
    matchedStaticResponseReviewPromptCards
      .map((card) => card.staticResponseReviewPromptText)
      .join(" | ");
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path-source-crosswalk:row:${sourceConstraintResponseReviewPathStepId}`;

  return {
    ...constraintResponseReviewPathStep,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowIds:
      [
        followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId,
      ],
    sourceCrosswalkRowOrder:
      constraintResponseReviewPathStep.constraintResponseReviewPathStepOrder,
    sourceConstraintResponseReviewPathStepId,
    sourceConstraintResponseReviewPathStepIds: [
      sourceConstraintResponseReviewPathStepId,
    ],
    sourceStaticResponseReviewPromptCardIds,
    sourceCrosswalkLabels,
    sourceCrosswalkText:
      `Constraint-response source crosswalk row ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId}: compare Stage 81 review-path step ${sourceConstraintResponseReviewPathStepId}, Stage 81 response-review prompt cards ${sourceStaticResponseReviewPromptCardIds.join(", ") || "none"}, Stage 80 constraint-coverage row ${constraintResponseReviewPathStep.sourceConstraintCoverageRowId}, Stage 80 response-note prompt cards ${constraintResponseReviewPathStep.sourceStaticResponseNotePromptCardIds.join(", ") || "none"}, Stage 79 answer-review step ${constraintResponseReviewPathStep.sourceAnswerReviewPathStepId}, Stage 79 static constraint-note cards ${constraintResponseReviewPathStep.sourceStaticConstraintNoteCardIds.join(", ") || "none"}, Stage 78 answer-check card ${constraintResponseReviewPathStep.sourceStaticAnswerCheckCardId}, Stage 78 readiness rows ${constraintResponseReviewPathStep.sourceResponsePromptReadinessRowIds.join(", ") || "none"}, Stage 77 response-prompt cards ${constraintResponseReviewPathStep.sourceStaticResponsePromptCardIds.join(", ") || "none"}, Stage 77 response-map review-path step ${constraintResponseReviewPathStep.sourceResponseMapReviewPathStepId}, Stage 76 response-map row ${constraintResponseReviewPathStep.sourceResponseMapRowId}, Stage 76 static follow-up prompt cards ${constraintResponseReviewPathStep.sourceResponseMapStaticFollowUpPromptCardIds.join(", ") || "none"}, Stage 75 coverage-review step ${constraintResponseReviewPathStep.sourceCoverageReviewPathStepId}, Stage 74 coverage row ${constraintResponseReviewPathStep.sourceCoverageMatrixRowId}, Stage 73 review-path step ${constraintResponseReviewPathStep.sourceReviewPathStepId}, Stage 72 source recap row ${constraintResponseReviewPathStep.sourceSourceRecapRowId}, Stage 71 review-lane row ${constraintResponseReviewPathStep.sourceAnswerFollowUpReviewLaneRowId}, Stage 70 crosswalk row ${constraintResponseReviewPathStep.sourceAnswerSourceCrosswalkRowId}, Stage 69 walkthrough step ${constraintResponseReviewPathStep.sourceAnswerWalkthroughStepId}, Stage 68 answer coverage row ${constraintResponseReviewPathStep.sourceAnswerCoverageRowId}, Stage 67 rehearsal step ${constraintResponseReviewPathStep.sourceRehearsalPathStepId}, Stage 66 board row ${constraintResponseReviewPathStep.sourceReviewBoardRowId}, Stage 65 brief row ${constraintResponseReviewPathStep.followUpReadinessBriefRowId}, Stage 64 triage row ${constraintResponseReviewPathStep.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${constraintResponseReviewPathStep.sourceLocalAnchorHrefs.join(", ")}, callbacks ${constraintResponseReviewPathStep.evidenceCallbackIds.join(", ")}, gap prompts ${constraintResponseReviewPathStep.gapDiscussionPointIds.join(", ")}, deferred reminders ${constraintResponseReviewPathStep.deferredScopeReminderIds.join(", ")}, review-path labels ${constraintResponseReviewPathStep.constraintResponseReviewPathLabels.join(", ") || "none"}, source-crosswalk labels ${sourceCrosswalkLabels.join(", ") || "none"}, static response-review prompt text "${constraintResponseReviewPathStep.staticResponseReviewPromptText}", static review-check source text "${sourceReviewCheckText}", local-only flag ${constraintResponseReviewPathStep.localOnly ? "true" : "false"}, and static non-goal context "${constraintResponseReviewPathStep.staticNonGoalContext}" as deterministic manual source-check context only.`,
    staticReviewCheckText:
      `Static review check for Stage 81 constraint-response review path step ${sourceConstraintResponseReviewPathStepId}: verify Stage 81 response-review prompt cards ${sourceStaticResponseReviewPromptCardIds.join(", ") || "none"} against Stage 80 row ${constraintResponseReviewPathStep.sourceConstraintCoverageRowId}, Stage 79 answer-review step ${constraintResponseReviewPathStep.sourceAnswerReviewPathStepId}, anchors ${constraintResponseReviewPathStep.sourceLocalAnchorHrefs.join(", ")}, callbacks ${constraintResponseReviewPathStep.evidenceCallbackIds.join(", ")}, gap prompts ${constraintResponseReviewPathStep.gapDiscussionPointIds.join(", ")}, deferred reminders ${constraintResponseReviewPathStep.deferredScopeReminderIds.join(", ")}, and carried response-review prompt text "${constraintResponseReviewPathStep.staticResponseReviewPromptText}" before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, response-review state, source-crosswalk state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static constraint-response source-crosswalk context: manual source inspection and response-check preparation only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved response-review state, saved source-crosswalk state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      constraintResponseReviewPathStep.staticNonGoalFlags,
    ),
  };
}

function buildStaticReviewCheckCard(
  staticResponseReviewPromptCard: Stage81StaticResponsePromptCard,
  sourceCrosswalkRows: Stage82SourceCrosswalkRow[],
): Stage82StaticReviewCheckCard {
  const sourceStaticResponseReviewPromptCardId =
    staticResponseReviewPromptCard
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticResponsePromptCardId;
  const matchedSourceCrosswalkRows = sourceCrosswalkRows.filter((row) =>
    row.sourceStaticResponseReviewPromptCardIds.includes(
      sourceStaticResponseReviewPromptCardId,
    ),
  );
  const sourceConstraintResponseReviewPathStepIds =
    matchedSourceCrosswalkRows.map(
      (row) => row.sourceConstraintResponseReviewPathStepId,
    );
  const staticReviewCheckLabels = buildStaticReviewCheckLabels(
    staticResponseReviewPromptCard,
    matchedSourceCrosswalkRows,
  );
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path-source-crosswalk:static-review-check:${sourceStaticResponseReviewPromptCardId}`;

  return {
    ...staticResponseReviewPromptCard,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardIds:
      [
        followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId,
      ],
    sourceStaticResponseReviewPromptCardId,
    sourceStaticResponseReviewPromptCardIds: [
      sourceStaticResponseReviewPromptCardId,
    ],
    sourceConstraintResponseReviewPathStepIds,
    staticReviewCheckOrder:
      staticResponseReviewPromptCard.staticResponseReviewPromptOrder,
    staticReviewCheckLabels,
    staticReviewCheckText:
      `Static review-check card ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId}: verify Stage 81 response-review prompt card ${sourceStaticResponseReviewPromptCardId}, Stage 80 response-note prompt card ${staticResponseReviewPromptCard.sourceStaticResponseNotePromptCardId}, matched Stage 81 review-path steps ${sourceConstraintResponseReviewPathStepIds.join(", ") || "none"}, Stage 78 readiness row ${staticResponseReviewPromptCard.sourceResponsePromptReadinessRowId}, Stage 77 response-prompt card ${staticResponseReviewPromptCard.sourceStaticResponsePromptCardId}, Stage 76 response-map rows ${staticResponseReviewPromptCard.sourceResponseMapRowIds.join(", ") || "none"}, anchors ${staticResponseReviewPromptCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticResponseReviewPromptCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticResponseReviewPromptCard.gapDiscussionPointIds.join(", ")}, deferred reminders ${staticResponseReviewPromptCard.deferredScopeReminderIds.join(", ")}, response-review labels ${staticResponseReviewPromptCard.staticResponseReviewPromptLabels.join(", ") || "none"}, review-check labels ${staticReviewCheckLabels.join(", ") || "none"}, and carried response-review prompt text "${staticResponseReviewPromptCard.staticResponseReviewPromptText}" as static manual source-check context only.`,
    staticNonGoalContext:
      "Static review-check context: compare response-prep prompts with source chains only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved response-review state, saved source-crosswalk state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticResponseReviewPromptCard.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  sourceCrosswalkRows: Stage82SourceCrosswalkRow[],
  staticReviewCheckCards: Stage82StaticReviewCheckCard[],
  sourceConstraintResponseReviewPath: Stage81View,
): Stage82Summary["counts"] {
  const sourceCounts = sourceConstraintResponseReviewPath.summary.counts;

  return {
    ...sourceCounts,
    sourceCrosswalkRowCount: sourceCrosswalkRows.length,
    staticReviewCheckCardCount: staticReviewCheckCards.length,
    sourceCrosswalkLabelCount: unique(
      sourceCrosswalkRows.flatMap((row) => row.sourceCrosswalkLabels),
    ).length,
    staticReviewCheckLabelCount: unique(
      staticReviewCheckCards.flatMap((card) => card.staticReviewCheckLabels),
    ).length,
    localOnlySourceCrosswalkRowCount: sourceCrosswalkRows.filter(
      (row) => row.localOnly,
    ).length,
    localOnlyStaticReviewCheckCardCount: staticReviewCheckCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function buildSourceCrosswalkLabels(
  constraintResponseReviewPathStep: Stage81ReviewPathStep,
  matchedStaticResponseReviewPromptCards: Stage81StaticResponsePromptCard[],
): string[] {
  const labels = [
    "constraint-response source crosswalk row",
    "static review-check source chain",
  ];

  if (matchedStaticResponseReviewPromptCards.length) {
    labels.push("response-review prompt source alignment");
  }

  if (constraintResponseReviewPathStep.constraintResponseReviewPathLabels.length) {
    labels.push("constraint-response review path carry-forward");
  }

  if (
    constraintResponseReviewPathStep.sourceLocalAnchorHrefs.length ||
    constraintResponseReviewPathStep.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback source-check context");
  }

  if (
    constraintResponseReviewPathStep.gapDiscussionPointIds.length ||
    constraintResponseReviewPathStep.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder source-check context");
  }

  return labels;
}

function buildStaticReviewCheckLabels(
  staticResponseReviewPromptCard: Stage81StaticResponsePromptCard,
  matchedSourceCrosswalkRows: Stage82SourceCrosswalkRow[],
): string[] {
  const labels = [
    "static review-check card",
    "response-review prompt source check",
  ];

  if (matchedSourceCrosswalkRows.length) {
    labels.push("constraint-response source crosswalk alignment");
  }

  if (staticResponseReviewPromptCard.staticResponseReviewPromptLabels.length) {
    labels.push("static response-review prompt context");
  }

  if (
    staticResponseReviewPromptCard.sourceLocalAnchorHrefs.length ||
    staticResponseReviewPromptCard.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback review-check context");
  }

  if (
    staticResponseReviewPromptCard.gapDiscussionPointIds.length ||
    staticResponseReviewPromptCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder review-check context");
  }

  return labels;
}

function staticResponseReviewPromptCardMatchesReviewPathStep(
  staticResponseReviewPromptCard: Stage81StaticResponsePromptCard,
  constraintResponseReviewPathStep: Stage81ReviewPathStep,
): boolean {
  return (
    constraintResponseReviewPathStep.sourceStaticResponseNotePromptCardIds.includes(
      staticResponseReviewPromptCard.sourceStaticResponseNotePromptCardId,
    ) ||
    staticResponseReviewPromptCard.sourceConstraintResponseReviewPathStepIds.includes(
      constraintResponseReviewPathStep
        .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepId,
    ) ||
    staticResponseReviewPromptCard.sourceAnswerReviewPathStepIds.includes(
      constraintResponseReviewPathStep.sourceAnswerReviewPathStepId,
    ) ||
    constraintResponseReviewPathStep.sourceResponsePromptReadinessRowIds.includes(
      staticResponseReviewPromptCard.sourceResponsePromptReadinessRowId,
    )
  );
}

function staticNonGoalFlags(
  sourceFlags: Stage81StaticNonGoalFlags,
): Stage82StaticNonGoalFlags {
  return {
    ...sourceFlags,
    noSavedSourceCrosswalkState: true,
    noSavedSourceCrosswalkRows: true,
    noSavedSourceSelections: true,
    noSavedSourceCheckState: true,
    noSavedStaticReviewChecks: true,
    noSavedResponseReviewState: true,
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
