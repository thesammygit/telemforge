import type {
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowView as Stage82SourceCrosswalkRow,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticNonGoalFlagsView as Stage82StaticNonGoalFlags,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardView as Stage82StaticReviewCheckCard,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewPathStepView as Stage83SourceReviewPathStep,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticNonGoalFlagsView as Stage83StaticNonGoalFlags,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardView as Stage83StaticSourceReviewPromptCard,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSummaryView as Stage83Summary,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathView as Stage83View,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkView as Stage82View,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath(
  sourceConstraintResponseSourceCrosswalk: Stage82View | undefined,
): Stage83View | undefined {
  if (
    !sourceConstraintResponseSourceCrosswalk?.sourceCrosswalkRows.length ||
    !sourceConstraintResponseSourceCrosswalk.staticReviewCheckCards.length
  ) {
    return undefined;
  }

  const sourceReviewPathSteps =
    sourceConstraintResponseSourceCrosswalk.sourceCrosswalkRows.map((row) =>
      buildSourceReviewPathStep(
        row,
        sourceConstraintResponseSourceCrosswalk.staticReviewCheckCards,
      ),
    );
  const staticSourceReviewPromptCards =
    sourceConstraintResponseSourceCrosswalk.staticReviewCheckCards.map((card) =>
      buildStaticSourceReviewPromptCard(card, sourceReviewPathSteps),
    );
  const defaultSourceReviewPathStep =
    sourceReviewPathSteps.find(
      (step) =>
        step.sourceCrosswalkRowId ===
        sourceConstraintResponseSourceCrosswalk.defaultSourceCrosswalkRow
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId,
    ) ?? sourceReviewPathSteps[0];
  const defaultStaticSourceReviewPromptCard =
    staticSourceReviewPromptCards.find(
      (card) =>
        card.sourceStaticReviewCheckCardId ===
        sourceConstraintResponseSourceCrosswalk.defaultStaticReviewCheckCard
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId,
    ) ?? staticSourceReviewPromptCards[0];
  const sourceDefaultContext =
    sourceConstraintResponseSourceCrosswalk.summary.defaultSourceCheckContext;

  return {
    schema:
      "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix_review_path_response_map_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage-review response-map review-path response-prompt readiness-board answer-review path constraint-response source-crosswalk review path and static source-review prompts",
    localStatus: sourceConstraintResponseSourceCrosswalk.localStatus,
    summary: {
      followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathId:
        "candidate-local-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-review-response-map-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path-source-crosswalk-review-path",
      label:
        "Local observation handoff follow-up readiness answer follow-up review lane source recap review path coverage-review response-map review-path response-prompt readiness-board answer-review path constraint-response source-crosswalk review path",
      summary:
        "A static source-crosswalk review path derives from Stage 82 source-crosswalk rows and static review-check cards so reviewers can walk each source-check step in order before drafting outside the app without saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved source-review state, saved source-crosswalk state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultSourceReviewContext: {
        defaultSourceReviewPathStepId:
          defaultSourceReviewPathStep
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId,
        defaultStaticSourceReviewPromptCardId:
          defaultStaticSourceReviewPromptCard
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId,
        defaultSourceCrosswalkRowId:
          defaultSourceReviewPathStep.sourceCrosswalkRowId,
        defaultStaticReviewCheckCardId:
          defaultStaticSourceReviewPromptCard.sourceStaticReviewCheckCardId,
        defaultConstraintResponseReviewPathStepId:
          sourceDefaultContext.defaultConstraintResponseReviewPathStepId,
        defaultStaticResponseReviewPromptCardId:
          sourceDefaultContext.defaultStaticResponseReviewPromptCardId,
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
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkSummary:
          sourceConstraintResponseSourceCrosswalk.summary.summary,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkDefaultContext:
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
        sourceReviewPathSteps,
        staticSourceReviewPromptCards,
        sourceConstraintResponseSourceCrosswalk,
      ),
    },
    defaultSourceReviewPathStep,
    defaultStaticSourceReviewPromptCard,
    sourceReviewPathSteps,
    staticSourceReviewPromptCards,
    staticSourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSummary:
      "Stage 83 source-crosswalk review path steps and static source-review prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, response notes, source selections, source-review state, source-crosswalk state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk:
      sourceConstraintResponseSourceCrosswalk,
  };
}

function buildSourceReviewPathStep(
  sourceCrosswalkRow: Stage82SourceCrosswalkRow,
  staticReviewCheckCards: Stage82StaticReviewCheckCard[],
): Stage83SourceReviewPathStep {
  const sourceCrosswalkRowId =
    sourceCrosswalkRow
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId;
  const matchedStaticReviewCheckCards = staticReviewCheckCards.filter((card) =>
    staticReviewCheckCardMatchesSourceCrosswalkRow(card, sourceCrosswalkRow),
  );
  const sourceStaticReviewCheckCardIds = matchedStaticReviewCheckCards.map(
    (card) =>
      card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId,
  );
  const sourceReviewPathLabels = buildSourceReviewPathLabels(
    sourceCrosswalkRow,
    matchedStaticReviewCheckCards,
  );
  const sourceStaticReviewText =
    matchedStaticReviewCheckCards
      .map((card) => card.staticReviewCheckText)
      .join(" | ");
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path-source-crosswalk-review-path:step:${sourceCrosswalkRowId}`;

  return {
    ...sourceCrosswalkRow,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepIds:
      [
        followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId,
      ],
    sourceReviewPathStepOrder: sourceCrosswalkRow.sourceCrosswalkRowOrder,
    sourceCrosswalkRowId,
    sourceCrosswalkRowIds: [sourceCrosswalkRowId],
    sourceStaticReviewCheckCardIds,
    sourceReviewPathLabels,
    sourceReviewPathText:
      `Source-crosswalk review path step ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId}: walk Stage 82 source-crosswalk row ${sourceCrosswalkRowId}, Stage 82 static review-check cards ${sourceStaticReviewCheckCardIds.join(", ") || "none"}, Stage 81 review-path step ${sourceCrosswalkRow.sourceConstraintResponseReviewPathStepId}, Stage 81 response-review prompt cards ${sourceCrosswalkRow.sourceStaticResponseReviewPromptCardIds.join(", ") || "none"}, Stage 80 constraint-coverage row ${sourceCrosswalkRow.sourceConstraintCoverageRowId}, Stage 80 response-note prompt cards ${sourceCrosswalkRow.sourceStaticResponseNotePromptCardIds.join(", ") || "none"}, Stage 79 answer-review step ${sourceCrosswalkRow.sourceAnswerReviewPathStepId}, Stage 79 static constraint-note cards ${sourceCrosswalkRow.sourceStaticConstraintNoteCardIds.join(", ") || "none"}, Stage 78 answer-check card ${sourceCrosswalkRow.sourceStaticAnswerCheckCardId}, Stage 78 readiness rows ${sourceCrosswalkRow.sourceResponsePromptReadinessRowIds.join(", ") || "none"}, Stage 77 response-prompt cards ${sourceCrosswalkRow.sourceStaticResponsePromptCardIds.join(", ") || "none"}, Stage 77 response-map review-path step ${sourceCrosswalkRow.sourceResponseMapReviewPathStepId}, Stage 76 response-map row ${sourceCrosswalkRow.sourceResponseMapRowId}, Stage 76 static follow-up prompt cards ${sourceCrosswalkRow.sourceResponseMapStaticFollowUpPromptCardIds.join(", ") || "none"}, Stage 75 coverage-review step ${sourceCrosswalkRow.sourceCoverageReviewPathStepId}, Stage 74 coverage row ${sourceCrosswalkRow.sourceCoverageMatrixRowId}, Stage 73 review-path step ${sourceCrosswalkRow.sourceReviewPathStepId}, Stage 72 source recap row ${sourceCrosswalkRow.sourceSourceRecapRowId}, Stage 71 review-lane row ${sourceCrosswalkRow.sourceAnswerFollowUpReviewLaneRowId}, Stage 70 crosswalk row ${sourceCrosswalkRow.sourceAnswerSourceCrosswalkRowId}, Stage 69 walkthrough step ${sourceCrosswalkRow.sourceAnswerWalkthroughStepId}, Stage 68 answer coverage row ${sourceCrosswalkRow.sourceAnswerCoverageRowId}, Stage 67 rehearsal step ${sourceCrosswalkRow.sourceRehearsalPathStepId}, Stage 66 board row ${sourceCrosswalkRow.sourceReviewBoardRowId}, Stage 65 brief row ${sourceCrosswalkRow.followUpReadinessBriefRowId}, Stage 64 triage row ${sourceCrosswalkRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${sourceCrosswalkRow.sourceLocalAnchorHrefs.join(", ")}, callbacks ${sourceCrosswalkRow.evidenceCallbackIds.join(", ")}, gap prompts ${sourceCrosswalkRow.gapDiscussionPointIds.join(", ")}, deferred reminders ${sourceCrosswalkRow.deferredScopeReminderIds.join(", ")}, source-crosswalk labels ${sourceCrosswalkRow.sourceCrosswalkLabels.join(", ") || "none"}, source-review labels ${sourceReviewPathLabels.join(", ") || "none"}, source-crosswalk text "${sourceCrosswalkRow.sourceCrosswalkText}", static review-check text "${sourceCrosswalkRow.staticReviewCheckText}", carried static source-review text "${sourceStaticReviewText}", local-only flag ${sourceCrosswalkRow.localOnly ? "true" : "false"}, and static non-goal context "${sourceCrosswalkRow.staticNonGoalContext}" as deterministic manual source-review context only.`,
    staticSourceReviewPromptText:
      `Static source-review prompt for Stage 82 source-crosswalk row ${sourceCrosswalkRowId}: compare Stage 82 static review-check cards ${sourceStaticReviewCheckCardIds.join(", ") || "none"}, Stage 81 review-path step ${sourceCrosswalkRow.sourceConstraintResponseReviewPathStepId}, Stage 80 constraint-coverage row ${sourceCrosswalkRow.sourceConstraintCoverageRowId}, Stage 79 answer-review step ${sourceCrosswalkRow.sourceAnswerReviewPathStepId}, Stage 78 readiness rows ${sourceCrosswalkRow.sourceResponsePromptReadinessRowIds.join(", ") || "none"}, Stage 77 response-map review-path step ${sourceCrosswalkRow.sourceResponseMapReviewPathStepId}, anchors ${sourceCrosswalkRow.sourceLocalAnchorHrefs.join(", ")}, callbacks ${sourceCrosswalkRow.evidenceCallbackIds.join(", ")}, gap prompts ${sourceCrosswalkRow.gapDiscussionPointIds.join(", ")}, deferred reminders ${sourceCrosswalkRow.deferredScopeReminderIds.join(", ")}, and carried source-crosswalk text "${sourceCrosswalkRow.sourceCrosswalkText}" before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, source-review state, source-crosswalk state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static source-crosswalk review-path context: manual source-review preparation and source lineage only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved source-review state, saved source-crosswalk state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(sourceCrosswalkRow.staticNonGoalFlags),
  };
}

function buildStaticSourceReviewPromptCard(
  staticReviewCheckCard: Stage82StaticReviewCheckCard,
  sourceReviewPathSteps: Stage83SourceReviewPathStep[],
): Stage83StaticSourceReviewPromptCard {
  const sourceStaticReviewCheckCardId =
    staticReviewCheckCard
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId;
  const matchedSourceReviewPathSteps = sourceReviewPathSteps.filter((step) =>
    step.sourceStaticReviewCheckCardIds.includes(sourceStaticReviewCheckCardId),
  );
  const sourceSourceCrosswalkReviewPathStepIds =
    matchedSourceReviewPathSteps.map(
      (step) =>
        step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId,
    );
  const staticSourceReviewPromptLabels = buildStaticSourceReviewPromptLabels(
    staticReviewCheckCard,
    matchedSourceReviewPathSteps,
  );
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path-source-crosswalk-review-path:static-source-review-prompt:${sourceStaticReviewCheckCardId}`;

  return {
    ...staticReviewCheckCard,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardIds:
      [
        followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId,
      ],
    sourceStaticReviewCheckCardId,
    sourceStaticReviewCheckCardIds: [sourceStaticReviewCheckCardId],
    sourceSourceCrosswalkReviewPathStepIds,
    staticSourceReviewPromptOrder:
      staticReviewCheckCard.staticReviewCheckOrder,
    staticSourceReviewPromptLabels,
    staticSourceReviewPromptText:
      `Static source-review prompt card ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId}: use Stage 82 static review-check card ${sourceStaticReviewCheckCardId}, Stage 81 response-review prompt card ${staticReviewCheckCard.sourceStaticResponseReviewPromptCardId}, matched Stage 83 source-crosswalk review-path steps ${sourceSourceCrosswalkReviewPathStepIds.join(", ") || "none"}, matched Stage 81 review-path steps ${staticReviewCheckCard.sourceConstraintResponseReviewPathStepIds.join(", ") || "none"}, Stage 80 response-note prompt card ${staticReviewCheckCard.sourceStaticResponseNotePromptCardId}, Stage 78 readiness row ${staticReviewCheckCard.sourceResponsePromptReadinessRowId}, Stage 77 response-prompt card ${staticReviewCheckCard.sourceStaticResponsePromptCardId}, Stage 76 response-map rows ${staticReviewCheckCard.sourceResponseMapRowIds.join(", ") || "none"}, anchors ${staticReviewCheckCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticReviewCheckCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticReviewCheckCard.gapDiscussionPointIds.join(", ")}, deferred reminders ${staticReviewCheckCard.deferredScopeReminderIds.join(", ")}, review-check labels ${staticReviewCheckCard.staticReviewCheckLabels.join(", ") || "none"}, source-review labels ${staticSourceReviewPromptLabels.join(", ") || "none"}, and carried static review-check text "${staticReviewCheckCard.staticReviewCheckText}" as static manual source-review context only.`,
    staticNonGoalContext:
      "Static source-review prompt context: compare source-check steps with review-check cards only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved source-review state, saved source-crosswalk state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticReviewCheckCard.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  sourceReviewPathSteps: Stage83SourceReviewPathStep[],
  staticSourceReviewPromptCards: Stage83StaticSourceReviewPromptCard[],
  sourceConstraintResponseSourceCrosswalk: Stage82View,
): Stage83Summary["counts"] {
  const sourceCounts = sourceConstraintResponseSourceCrosswalk.summary.counts;

  return {
    ...sourceCounts,
    sourceReviewPathStepCount: sourceReviewPathSteps.length,
    staticSourceReviewPromptCardCount: staticSourceReviewPromptCards.length,
    sourceReviewPathLabelCount: unique(
      sourceReviewPathSteps.flatMap((step) => step.sourceReviewPathLabels),
    ).length,
    staticSourceReviewPromptLabelCount: unique(
      staticSourceReviewPromptCards.flatMap(
        (card) => card.staticSourceReviewPromptLabels,
      ),
    ).length,
    localOnlySourceReviewPathStepCount: sourceReviewPathSteps.filter(
      (step) => step.localOnly,
    ).length,
    localOnlyStaticSourceReviewPromptCardCount:
      staticSourceReviewPromptCards.filter((card) => card.localOnly).length,
  };
}

function buildSourceReviewPathLabels(
  sourceCrosswalkRow: Stage82SourceCrosswalkRow,
  matchedStaticReviewCheckCards: Stage82StaticReviewCheckCard[],
): string[] {
  const labels = [
    "source-crosswalk review path step",
    "static source-review prompt carry-forward",
  ];

  if (matchedStaticReviewCheckCards.length) {
    labels.push("static review-check source alignment");
  }

  if (sourceCrosswalkRow.sourceCrosswalkLabels.length) {
    labels.push("source-crosswalk row carry-forward");
  }

  if (
    sourceCrosswalkRow.sourceLocalAnchorHrefs.length ||
    sourceCrosswalkRow.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback source-review context");
  }

  if (
    sourceCrosswalkRow.gapDiscussionPointIds.length ||
    sourceCrosswalkRow.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder source-review context");
  }

  return labels;
}

function buildStaticSourceReviewPromptLabels(
  staticReviewCheckCard: Stage82StaticReviewCheckCard,
  matchedSourceReviewPathSteps: Stage83SourceReviewPathStep[],
): string[] {
  const labels = [
    "static source-review prompt card",
    "static review-check carry-forward",
  ];

  if (matchedSourceReviewPathSteps.length) {
    labels.push("source-crosswalk review-path alignment");
  }

  if (staticReviewCheckCard.staticReviewCheckLabels.length) {
    labels.push("static review-check context");
  }

  if (
    staticReviewCheckCard.sourceLocalAnchorHrefs.length ||
    staticReviewCheckCard.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback source-review prompt context");
  }

  if (
    staticReviewCheckCard.gapDiscussionPointIds.length ||
    staticReviewCheckCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder source-review prompt context");
  }

  return labels;
}

function staticReviewCheckCardMatchesSourceCrosswalkRow(
  staticReviewCheckCard: Stage82StaticReviewCheckCard,
  sourceCrosswalkRow: Stage82SourceCrosswalkRow,
): boolean {
  return (
    sourceCrosswalkRow.sourceStaticResponseReviewPromptCardIds.includes(
      staticReviewCheckCard.sourceStaticResponseReviewPromptCardId,
    ) ||
    staticReviewCheckCard.sourceConstraintResponseReviewPathStepIds.includes(
      sourceCrosswalkRow.sourceConstraintResponseReviewPathStepId,
    ) ||
    sourceCrosswalkRow.sourceStaticResponseNotePromptCardIds.includes(
      staticReviewCheckCard.sourceStaticResponseNotePromptCardId,
    ) ||
    sourceCrosswalkRow.sourceResponsePromptReadinessRowIds.includes(
      staticReviewCheckCard.sourceResponsePromptReadinessRowId,
    )
  );
}

function staticNonGoalFlags(
  sourceFlags: Stage82StaticNonGoalFlags,
): Stage83StaticNonGoalFlags {
  return {
    ...sourceFlags,
    noSavedSourceReviewState: true,
    noSavedSourceReviewPathState: true,
    noSavedSourceReviewPrompts: true,
    noSavedStaticSourceReviewPrompts: true,
    noSavedStaticSourceReviewPromptCards: true,
    noSavedSourceReviewSelections: true,
    noSavedSourceCrosswalkReviewPathState: true,
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
