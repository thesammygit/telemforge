import type {
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneRowView as Stage84Row,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneStaticNonGoalFlagsView as Stage84StaticNonGoalFlags,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneStaticSourceFollowUpCueCardView as Stage84StaticSourceFollowUpCueCard,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneSummaryView as Stage84Summary,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneView as Stage84View,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathView as Stage83View,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewPathStepView as Stage83Row,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticNonGoalFlagsView as Stage83StaticNonGoalFlags,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardView as Stage83StaticSourceReviewPromptCard,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSummaryView as Stage83Summary,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLane(
  sourceCrosswalkReviewPath: Stage83View | undefined,
): Stage84View | undefined {
  if (
    !sourceCrosswalkReviewPath?.sourceReviewPathSteps.length ||
    !sourceCrosswalkReviewPath.staticSourceReviewPromptCards.length
  ) {
    return undefined;
  }

  const sourceReadinessLaneRows = sourceCrosswalkReviewPath.sourceReviewPathSteps.map(
    (step) =>
      buildSourceReadinessLaneRow(
        step,
        sourceCrosswalkReviewPath.staticSourceReviewPromptCards,
      ),
  );
  const staticSourceFollowUpCueCards =
    sourceCrosswalkReviewPath.staticSourceReviewPromptCards.map((card) =>
      buildStaticSourceFollowUpCueCard(card, sourceReadinessLaneRows),
    );
  const defaultSourceReadinessLaneRow =
    sourceReadinessLaneRows.find(
      (row) =>
        row.sourceSourceReviewPathStepId ===
        sourceCrosswalkReviewPath.defaultSourceReviewPathStep
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId,
    ) ?? sourceReadinessLaneRows[0];
  const defaultStaticSourceFollowUpCueCard =
    staticSourceFollowUpCueCards.find(
      (card) =>
        card.sourceStaticSourceReviewPromptCardId ===
        sourceCrosswalkReviewPath.defaultStaticSourceReviewPromptCard
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId,
    ) ?? staticSourceFollowUpCueCards[0];
  const sourceDefaultContext =
    sourceCrosswalkReviewPath.summary.defaultSourceReviewContext;

  return {
    schema:
      "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix_review_path_response_map_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_readiness_lane.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage-review response-map review-path response-prompt readiness-board answer-review path constraint-response source-review readiness lane and static source follow-up cues",
    localStatus: sourceCrosswalkReviewPath.localStatus,
    summary: {
      followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneId:
        "candidate-local-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-review-response-map-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path-source-readiness-lane",
      label:
        "Local observation handoff follow-up readiness answer follow-up review lane source recap review path coverage-review response-map review-path response-prompt readiness-board answer-review path constraint-response source crosswalk review path source-review readiness lane",
      summary:
        "A static source-review readiness lane derives from Stage 83 source-review path steps and static source-review prompt cards so reviewers can check which source steps are ready before drafting outside the app without saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved source-review readiness state, saved source-follow-up state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultSourceReadinessContext: {
        defaultSourceReadinessLaneRowId:
          defaultSourceReadinessLaneRow
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneRowId,
        defaultStaticSourceFollowUpCueCardId:
          defaultStaticSourceFollowUpCueCard
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneStaticSourceFollowUpCueCardId,
        defaultSourceReviewPathStepId:
          defaultSourceReadinessLaneRow.sourceSourceReviewPathStepId,
        defaultStaticSourceReviewPromptCardId:
          defaultStaticSourceFollowUpCueCard.sourceStaticSourceReviewPromptCardId,
        defaultSourceCrosswalkRowId:
          sourceDefaultContext.defaultSourceCrosswalkRowId,
        defaultStaticReviewCheckCardId:
          sourceDefaultContext.defaultStaticReviewCheckCardId,
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
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneSummary:
          sourceCrosswalkReviewPath.summary.summary,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathDefaultContext:
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
        sourceReadinessLaneRows,
        staticSourceFollowUpCueCards,
        sourceCrosswalkReviewPath,
      ),
    },
    defaultSourceReadinessLaneRow,
    defaultStaticSourceFollowUpCueCard,
    sourceReadinessLaneRows,
    staticSourceFollowUpCueCards,
    staticSourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceReadinessLaneSummary:
      "Stage 84 source-review readiness lane rows and static source-follow-up cue cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, response notes, source selections, source-review readiness state, source-follow-up state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath:
      sourceCrosswalkReviewPath,
  };
}

function buildSourceReadinessLaneRow(
  sourceReviewPathStep: Stage83Row,
  staticSourceReviewPromptCards: Stage83StaticSourceReviewPromptCard[],
): Stage84Row {
  const sourceReviewPathStepId =
    sourceReviewPathStep
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId;
  const matchedStaticSourceReviewPromptCards =
    staticSourceReviewPromptCards.filter((card) =>
      staticSourceReviewPromptCardMatchesSourceReadinessLaneRow(
        card,
        sourceReviewPathStep,
      ),
    );
  const sourceStaticSourceReviewPromptCardIds =
    matchedStaticSourceReviewPromptCards.map(
      (card) =>
        card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId,
    );
  const sourceReadinessLaneLabels = buildSourceReadinessLaneLabels(
    sourceReviewPathStep,
    matchedStaticSourceReviewPromptCards,
  );
  const sourceReadinessLaneText =
    `Source-readiness lane row ${sourceReviewPathStepId}: check Stage 83 source-review path step ${sourceReviewPathStepId}, Stage 83 static source-review prompt cards ${sourceStaticSourceReviewPromptCardIds.join(", ") || "none"}, Stage 82 source-crosswalk row ${sourceReviewPathStep.sourceCrosswalkRowId}, Stage 82 static review-check cards ${sourceReviewPathStep.sourceStaticReviewCheckCardIds.join(", ") || "none"}, Stage 81 review-path step ${sourceReviewPathStep.sourceConstraintResponseReviewPathStepId}, Stage 81 response-review prompt cards ${sourceReviewPathStep.sourceStaticResponseReviewPromptCardIds.join(", ") || "none"}, Stage 80 constraint-coverage row ${sourceReviewPathStep.sourceConstraintCoverageRowId}, Stage 80 response-note prompt cards ${sourceReviewPathStep.sourceStaticResponseNotePromptCardIds.join(", ") || "none"}, Stage 79 answer-review step ${sourceReviewPathStep.sourceAnswerReviewPathStepId}, Stage 79 static constraint-note cards ${sourceReviewPathStep.sourceStaticConstraintNoteCardIds.join(", ") || "none"}, Stage 78 answer-check card ${sourceReviewPathStep.sourceStaticAnswerCheckCardId}, Stage 78 readiness rows ${sourceReviewPathStep.sourceResponsePromptReadinessRowIds.join(", ") || "none"}, Stage 77 response-prompt cards ${sourceReviewPathStep.sourceStaticResponsePromptCardIds.join(", ") || "none"}, Stage 77 response-map review-path step ${sourceReviewPathStep.sourceResponseMapReviewPathStepId}, Stage 76 response-map row ${sourceReviewPathStep.sourceResponseMapRowId}, Stage 76 static follow-up prompt cards ${sourceReviewPathStep.sourceResponseMapStaticFollowUpPromptCardIds.join(", ") || "none"}, Stage 75 coverage-review step ${sourceReviewPathStep.sourceCoverageReviewPathStepId}, Stage 74 coverage row ${sourceReviewPathStep.sourceCoverageMatrixRowId}, Stage 73 review-path step ${sourceReviewPathStep.sourceReviewPathStepId}, Stage 72 source recap row ${sourceReviewPathStep.sourceSourceRecapRowId}, Stage 71 review-lane row ${sourceReviewPathStep.sourceAnswerFollowUpReviewLaneRowId}, Stage 70 crosswalk row ${sourceReviewPathStep.sourceAnswerSourceCrosswalkRowId}, Stage 69 walkthrough step ${sourceReviewPathStep.sourceAnswerWalkthroughStepId}, Stage 68 answer coverage row ${sourceReviewPathStep.sourceAnswerCoverageRowId}, Stage 67 rehearsal step ${sourceReviewPathStep.sourceRehearsalPathStepId}, Stage 66 board row ${sourceReviewPathStep.sourceReviewBoardRowId}, Stage 65 brief row ${sourceReviewPathStep.followUpReadinessBriefRowId}, Stage 64 triage row ${sourceReviewPathStep.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${sourceReviewPathStep.sourceLocalAnchorHrefs.join(", ")}, callbacks ${sourceReviewPathStep.evidenceCallbackIds.join(", ")}, gap prompts ${sourceReviewPathStep.gapDiscussionPointIds.join(", ")}, deferred reminders ${sourceReviewPathStep.deferredScopeReminderIds.join(", ")}, source-readiness labels ${sourceReadinessLaneLabels.join(", ") || "none"}, source-review path labels ${sourceReviewPathStep.sourceReviewPathLabels.join(", ") || "none"}, source-crosswalk text "${sourceReviewPathStep.sourceCrosswalkText}", source-review path text "${sourceReviewPathStep.sourceReviewPathText}", static source-review prompt text "${sourceReviewPathStep.staticSourceReviewPromptText}", local-only flag ${sourceReviewPathStep.localOnly ? "true" : "false"}, and static non-goal context "${sourceReviewPathStep.staticNonGoalContext}" as deterministic manual source-readiness context only.`;
  const staticSourceFollowUpCueText =
    `Static source-follow-up cue for Stage 83 source-review path step ${sourceReviewPathStepId}: compare Stage 83 static source-review prompt cards ${sourceStaticSourceReviewPromptCardIds.join(", ") || "none"}, Stage 82 static review-check cards ${sourceReviewPathStep.sourceStaticReviewCheckCardIds.join(", ") || "none"}, Stage 81 review-path step ${sourceReviewPathStep.sourceConstraintResponseReviewPathStepId}, Stage 80 constraint-coverage row ${sourceReviewPathStep.sourceConstraintCoverageRowId}, Stage 79 answer-review step ${sourceReviewPathStep.sourceAnswerReviewPathStepId}, Stage 78 readiness rows ${sourceReviewPathStep.sourceResponsePromptReadinessRowIds.join(", ") || "none"}, Stage 77 response-map review-path step ${sourceReviewPathStep.sourceResponseMapReviewPathStepId}, anchors ${sourceReviewPathStep.sourceLocalAnchorHrefs.join(", ")}, callbacks ${sourceReviewPathStep.evidenceCallbackIds.join(", ")}, gap prompts ${sourceReviewPathStep.gapDiscussionPointIds.join(", ")}, deferred reminders ${sourceReviewPathStep.deferredScopeReminderIds.join(", ")}, and carried source-review prompt text "${sourceReviewPathStep.staticSourceReviewPromptText}" before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, source-review readiness state, source-follow-up state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`;
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneRowId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path-source-crosswalk-review-path-source-readiness-lane:row:${sourceReviewPathStepId}`;

  return {
    ...sourceReviewPathStep,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneRowId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneRowIds:
      [
        followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneRowId,
      ],
    sourceReadinessLaneRowOrder: sourceReviewPathStep.sourceReviewPathStepOrder,
    sourceSourceReviewPathStepId: sourceReviewPathStepId,
    sourceSourceReviewPathStepIds: [sourceReviewPathStepId],
    sourceStaticSourceReviewPromptCardIds,
    sourceReadinessLaneLabels,
    sourceReadinessLaneText,
    staticSourceFollowUpCueText,
    staticNonGoalContext:
      "Static source-review readiness lane context: manual source-review preparation and follow-up cue checking only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved source-review readiness state, saved source-follow-up state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(sourceReviewPathStep.staticNonGoalFlags),
  };
}

function buildStaticSourceFollowUpCueCard(
  staticSourceReviewPromptCard: Stage83StaticSourceReviewPromptCard,
  sourceReadinessLaneRows: Stage84Row[],
): Stage84StaticSourceFollowUpCueCard {
  const sourceStaticSourceReviewPromptCardId =
    staticSourceReviewPromptCard
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId;
  const matchedSourceReadinessLaneRows = sourceReadinessLaneRows.filter((row) =>
    row.sourceStaticSourceReviewPromptCardIds.includes(
      sourceStaticSourceReviewPromptCardId,
    ),
  );
  const sourceSourceReadinessLaneRowIds = matchedSourceReadinessLaneRows.map(
    (row) =>
      row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneRowId,
  );
  const staticSourceFollowUpCueLabels = buildStaticSourceFollowUpCueLabels(
    staticSourceReviewPromptCard,
    matchedSourceReadinessLaneRows,
  );

  return {
    ...staticSourceReviewPromptCard,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneStaticSourceFollowUpCueCardId:
      `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path-source-crosswalk-review-path-source-readiness-lane:static-source-follow-up-cue:${sourceStaticSourceReviewPromptCardId}`,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneStaticSourceFollowUpCueCardIds:
      [
        `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path-source-crosswalk-review-path-source-readiness-lane:static-source-follow-up-cue:${sourceStaticSourceReviewPromptCardId}`,
      ],
    sourceStaticSourceReviewPromptCardId,
    sourceStaticSourceReviewPromptCardIds: [sourceStaticSourceReviewPromptCardId],
    sourceSourceReadinessLaneRowIds,
    staticSourceFollowUpCueOrder: staticSourceReviewPromptCard.staticSourceReviewPromptOrder,
    staticSourceFollowUpCueLabels,
    staticSourceFollowUpCueText:
      `Static source-follow-up cue card ${sourceStaticSourceReviewPromptCardId}: use Stage 83 static source-review prompt card ${sourceStaticSourceReviewPromptCardId}, matched Stage 84 source-readiness lane rows ${sourceSourceReadinessLaneRowIds.join(", ") || "none"}, Stage 83 source-review path steps ${staticSourceReviewPromptCard.sourceSourceCrosswalkReviewPathStepIds.join(", ") || "none"}, Stage 82 static review-check card ${staticSourceReviewPromptCard.sourceStaticReviewCheckCardId}, Stage 81 response-review prompt card ${staticSourceReviewPromptCard.sourceStaticResponseReviewPromptCardId}, Stage 80 response-note prompt card ${staticSourceReviewPromptCard.sourceStaticResponseNotePromptCardId}, Stage 78 readiness row ${staticSourceReviewPromptCard.sourceResponsePromptReadinessRowId}, Stage 77 response-prompt card ${staticSourceReviewPromptCard.sourceStaticResponsePromptCardId}, Stage 76 response-map rows ${staticSourceReviewPromptCard.sourceResponseMapRowIds.join(", ") || "none"}, anchors ${staticSourceReviewPromptCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticSourceReviewPromptCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticSourceReviewPromptCard.gapDiscussionPointIds.join(", ")}, deferred reminders ${staticSourceReviewPromptCard.deferredScopeReminderIds.join(", ")}, source-follow-up labels ${staticSourceFollowUpCueLabels.join(", ") || "none"}, source-review prompt labels ${staticSourceReviewPromptCard.staticSourceReviewPromptLabels.join(", ") || "none"}, static review-check text "${staticSourceReviewPromptCard.staticReviewCheckText}", static source-review prompt text "${staticSourceReviewPromptCard.staticSourceReviewPromptText}", local-only flag ${staticSourceReviewPromptCard.localOnly ? "true" : "false"}, and static non-goal context "${staticSourceReviewPromptCard.staticNonGoalContext}" as deterministic manual source-follow-up context only.`,
    staticNonGoalContext:
      "Static source-follow-up cue context: manual source-review readiness checking and follow-up cue preparation only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved source-review readiness state, saved source-follow-up state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticSourceReviewPromptCard.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  sourceReadinessLaneRows: Stage84Row[],
  staticSourceFollowUpCueCards: Stage84StaticSourceFollowUpCueCard[],
  sourceCrosswalkReviewPath: Stage83View,
): Stage84Summary["counts"] {
  const sourceCounts = sourceCrosswalkReviewPath.summary.counts;

  return {
    ...sourceCounts,
    sourceReadinessLaneRowCount: sourceReadinessLaneRows.length,
    staticSourceFollowUpCueCardCount: staticSourceFollowUpCueCards.length,
    sourceReadinessLaneLabelCount: unique(
      sourceReadinessLaneRows.flatMap((row) => row.sourceReadinessLaneLabels),
    ).length,
    staticSourceFollowUpCueLabelCount: unique(
      staticSourceFollowUpCueCards.flatMap((card) => card.staticSourceFollowUpCueLabels),
    ).length,
    localOnlySourceReadinessLaneRowCount: sourceReadinessLaneRows.filter(
      (row) => row.localOnly,
    ).length,
    localOnlyStaticSourceFollowUpCueCardCount:
      staticSourceFollowUpCueCards.filter((card) => card.localOnly).length,
  };
}

function buildSourceReadinessLaneLabels(
  sourceReviewPathStep: Stage83Row,
  matchedStaticSourceReviewPromptCards: Stage83StaticSourceReviewPromptCard[],
): string[] {
  const labels = [
    "source-review readiness lane row",
    "static source-follow-up cue carry-forward",
  ];

  if (matchedStaticSourceReviewPromptCards.length) {
    labels.push("static source-review prompt source alignment");
  }

  if (sourceReviewPathStep.sourceReviewPathLabels.length) {
    labels.push("source-review path carry-forward");
  }

  if (
    sourceReviewPathStep.sourceLocalAnchorHrefs.length ||
    sourceReviewPathStep.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback readiness context");
  }

  if (
    sourceReviewPathStep.gapDiscussionPointIds.length ||
    sourceReviewPathStep.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder readiness context");
  }

  return labels;
}

function buildStaticSourceFollowUpCueLabels(
  staticSourceReviewPromptCard: Stage83StaticSourceReviewPromptCard,
  matchedSourceReadinessLaneRows: Stage84Row[],
): string[] {
  const labels = [
    "static source-follow-up cue card",
    "static source-review prompt carry-forward",
  ];

  if (matchedSourceReadinessLaneRows.length) {
    labels.push("source-readiness lane alignment");
  }

  if (staticSourceReviewPromptCard.staticSourceReviewPromptLabels.length) {
    labels.push("static source-review prompt context");
  }

  if (
    staticSourceReviewPromptCard.sourceLocalAnchorHrefs.length ||
    staticSourceReviewPromptCard.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback source-follow-up context");
  }

  if (
    staticSourceReviewPromptCard.gapDiscussionPointIds.length ||
    staticSourceReviewPromptCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder source-follow-up context");
  }

  return labels;
}

function staticSourceReviewPromptCardMatchesSourceReadinessLaneRow(
  staticSourceReviewPromptCard: Stage83StaticSourceReviewPromptCard,
  sourceReviewPathStep: Stage83Row,
): boolean {
  return (
    staticSourceReviewPromptCard.sourceSourceCrosswalkReviewPathStepIds.includes(
      sourceReviewPathStep.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId,
    ) ||
    sourceReviewPathStep.sourceStaticReviewCheckCardIds.includes(
      staticSourceReviewPromptCard.sourceStaticReviewCheckCardId,
    ) ||
    sourceReviewPathStep.sourceStaticResponseReviewPromptCardIds.includes(
      staticSourceReviewPromptCard.sourceStaticResponseReviewPromptCardId,
    )
  );
}

function staticNonGoalFlags(
  sourceFlags: Stage83StaticNonGoalFlags,
): Stage84StaticNonGoalFlags {
  return {
    ...sourceFlags,
    noSavedSourceReviewReadinessState: true,
    noSavedSourceReadinessLaneState: true,
    noSavedSourceFollowUpState: true,
    noSavedSourceFollowUpCueState: true,
    noSavedStaticSourceFollowUpCues: true,
    noSavedStaticSourceFollowUpCueCards: true,
    noSavedSourceFollowUpSelections: true,
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
