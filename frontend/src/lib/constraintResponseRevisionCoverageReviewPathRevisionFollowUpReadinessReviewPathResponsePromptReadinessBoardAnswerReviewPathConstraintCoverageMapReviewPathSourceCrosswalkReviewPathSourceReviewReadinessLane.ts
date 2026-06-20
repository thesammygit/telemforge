import type {
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewPathStepView as Stage123SourceReviewPathStep,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticNonGoalFlagsView as Stage123StaticNonGoalFlags,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardView as Stage123StaticSourceReviewPromptCard,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSummaryView as Stage123Summary,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathView as Stage123View,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowView as Stage124SourceReviewReadinessLaneRow,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticNonGoalFlagsView as Stage124StaticNonGoalFlags,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardView as Stage124StaticSourceFollowUpCueCard,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSummaryView as Stage124Summary,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneView as Stage124View,
} from "../features/mission-console/types.ts";

const stage124IdPrefix =
  "constraint-response-revision-coverage-review-path-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path-source-crosswalk-review-path-source-review-readiness-lane";

export function buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLane(
  sourceReviewPath: Stage123View | undefined,
): Stage124View | undefined {
  if (
    !sourceReviewPath?.sourceReviewPathSteps.length ||
    !sourceReviewPath.staticSourceReviewPromptCards.length
  ) {
    return undefined;
  }

  const sourceReviewReadinessLaneRows =
    sourceReviewPath.sourceReviewPathSteps.map((step) =>
      buildSourceReviewReadinessLaneRow(
        step,
        sourceReviewPath.staticSourceReviewPromptCards,
      ),
    );
  const staticSourceFollowUpCueCards =
    sourceReviewPath.staticSourceReviewPromptCards.map((card) =>
      buildStaticSourceFollowUpCueCard(card, sourceReviewReadinessLaneRows),
    );
  const defaultSourceReviewReadinessLaneRow =
    sourceReviewReadinessLaneRows.find(
      (row) =>
        row.sourceSourceReviewPathStepId ===
        sourceReviewPath.defaultSourceReviewPathStep
          .constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId,
    ) ?? sourceReviewReadinessLaneRows[0];
  const defaultStaticSourceFollowUpCueCard =
    staticSourceFollowUpCueCards.find(
      (card) =>
        card.sourceStaticSourceReviewPromptCardId ===
        sourceReviewPath.defaultStaticSourceReviewPromptCard
          .constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId,
    ) ?? staticSourceFollowUpCueCards[0];
  const sourceDefaultContext =
    sourceReviewPath.summary.defaultSourceReviewContext;

  return {
    schema:
      "telemforge.constraint_response_revision_coverage_review_path_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response revision coverage review-path revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path source-review readiness lane and static source-follow-up cues",
    localStatus: sourceReviewPath.localStatus,
    summary: {
      constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneId:
        `candidate-local-${stage124IdPrefix}`,
      label: "Local constraint-response source-review readiness lane",
      summary:
        "A static source-review readiness lane derives from Stage 123 source-review path steps and static source-review prompt cards so reviewers can check which source-review steps are ready before drafting outside the app without saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved source selections, saved source-review readiness state, saved source-follow-up state, saved source-crosswalk state, review-check state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultSourceReviewReadinessContext: {
        ...sourceDefaultContext,
        defaultSourceReviewReadinessLaneRowId:
          defaultSourceReviewReadinessLaneRow
            .constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowId,
        defaultStaticSourceFollowUpCueCardId:
          defaultStaticSourceFollowUpCueCard
            .constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardId,
        defaultSourceReviewPathStepId:
          defaultSourceReviewReadinessLaneRow.sourceSourceReviewPathStepId,
        defaultStaticSourceReviewPromptCardId:
          defaultStaticSourceFollowUpCueCard.sourceStaticSourceReviewPromptCardId,
        sourceStage123SourceReviewPathSummary: sourceReviewPath.summary.summary,
        sourceStage123DefaultSourceReviewContext: sourceDefaultContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        sourceReviewReadinessLaneRows,
        staticSourceFollowUpCueCards,
        sourceReviewPath,
      ),
    },
    defaultSourceReviewReadinessLaneRow,
    defaultStaticSourceFollowUpCueCard,
    sourceReviewReadinessLaneRows,
    staticSourceFollowUpCueCards,
    staticConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSummary:
      "Stage 124 source-review readiness lane rows and static source-follow-up cue cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, source selections, source-review readiness state, source-follow-up state, source-crosswalk state, review-check state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath:
      sourceReviewPath,
  };
}

function buildSourceReviewReadinessLaneRow(
  sourceReviewPathStep: Stage123SourceReviewPathStep,
  staticSourceReviewPromptCards: Stage123StaticSourceReviewPromptCard[],
): Stage124SourceReviewReadinessLaneRow {
  const sourceReviewPathStepId =
    sourceReviewPathStep
      .constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId;
  const matchedStaticSourceReviewPromptCards =
    staticSourceReviewPromptCards.filter((card) =>
      staticSourceReviewPromptCardMatchesSourceReviewReadinessLaneRow(
        card,
        sourceReviewPathStep,
      ),
    );
  const sourceStaticSourceReviewPromptCardIds =
    matchedStaticSourceReviewPromptCards.map(
      (card) =>
        card.constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId,
    );
  const sourceReviewReadinessLaneLabels =
    buildSourceReviewReadinessLaneLabels(
      sourceReviewPathStep,
      matchedStaticSourceReviewPromptCards,
    );
  const sourceReviewReadinessLaneRowId =
    `${stage124IdPrefix}:row:${sourceReviewPathStepId}`;

  return {
    ...sourceReviewPathStep,
    constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowId:
      sourceReviewReadinessLaneRowId,
    constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowIds:
      [sourceReviewReadinessLaneRowId],
    sourceReviewReadinessLaneRowOrder:
      sourceReviewPathStep.sourceReviewPathStepOrder,
    sourceSourceReviewPathStepId: sourceReviewPathStepId,
    sourceSourceReviewPathStepIds: [sourceReviewPathStepId],
    sourceStaticSourceReviewPromptCardIds,
    sourceReviewReadinessLaneLabels,
    sourceReviewReadinessLaneText:
      `Source-review readiness lane row ${sourceReviewReadinessLaneRowId}: check Stage 123 source-review path step ${sourceReviewPathStepId}, Stage 123 static source-review prompt cards ${joinOrNone(sourceStaticSourceReviewPromptCardIds)}, Stage 122 source-crosswalk row ${sourceReviewPathStep.sourceCrosswalkRowId}, Stage 122 static review-check cards ${joinOrNone(sourceReviewPathStep.sourceStaticReviewCheckCardIds)}, Stage 121 review-path step ${sourceReviewPathStep.sourceConstraintCoverageReviewPathStepId}, Stage 121 response-prompt cards ${joinOrNone(sourceReviewPathStep.sourceStaticResponsePromptCardIds)}, Stage 120 constraint-coverage row ${sourceReviewPathStep.sourceConstraintCoverageRowId}, Stage 120 response-note prompt cards ${joinOrNone(sourceReviewPathStep.sourceStaticResponseNotePromptCardIds)}, Stage 119 answer-review step ${sourceReviewPathStep.sourceAnswerReviewPathStepId}, Stage 119 static constraint-note cards ${joinOrNone(sourceReviewPathStep.sourceStaticConstraintNoteCardIds)}, Stage 118 answer-check card ${sourceReviewPathStep.sourceStaticAnswerCheckCardId}, Stage 118 readiness rows ${joinOrNone(sourceReviewPathStep.sourceResponsePromptReadinessRowIds)}, Stage 117 review-path steps ${joinOrNone(sourceReviewPathStep.sourceRevisionFollowUpReadinessReviewPathStepIds)}, Stage 116 readiness rows ${joinOrNone(sourceReviewPathStep.sourceRevisionFollowUpReadinessRowIds)}, Stage 116 response-check card ${sourceReviewPathStep.sourceStaticResponseCheckCardId}, Stage 115 static revision follow-up prompt card ${sourceReviewPathStep.sourceStaticRevisionFollowUpPromptCardId}, Stage 114 revision-review path step ${sourceReviewPathStep.sourceRevisionCoverageReviewPathStepId}, Stage 114 revision-coverage row ${sourceReviewPathStep.sourceRevisionCoverageRowId}, Stage 114 static revision-check card ${sourceReviewPathStep.sourceStaticRevisionCheckCardId}, Stage 113 static revision-prompt card ${sourceReviewPathStep.sourceStaticRevisionPromptCardId}, Stage 112 static draft-check card ${sourceReviewPathStep.sourceStaticDraftCheckCardId}, Stage 111 static response cue card ${sourceReviewPathStep.sourceStaticResponseCueCardId}, Stage 110 static review prompt card ${sourceReviewPathStep.sourceStaticReviewPromptCardId}, Stage 109 static readiness cue ${sourceReviewPathStep.sourceStaticReadinessCueCardId}, Stage 108 static follow-up prompt ${sourceReviewPathStep.sourceStaticFollowUpPromptCardId}, Stage 107 citation-gap cue ${sourceReviewPathStep.sourceStaticCitationGapCueCardId}, Stage 106 citation-review lane row ${sourceReviewPathStep.sourceCitationReviewLaneRowId}, Stage 105 citation prompt card ${sourceReviewPathStep.sourceStaticCitationCheckPromptCardId}, anchors ${joinOrNone(sourceReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(sourceReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(sourceReviewPathStep.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(sourceReviewPathStep.deferredScopeReminderIds)}, source-review readiness labels ${joinOrNone(sourceReviewReadinessLaneLabels)}, source-review path labels ${joinOrNone(sourceReviewPathStep.sourceReviewPathLabels)}, source-crosswalk labels ${joinOrNone(sourceReviewPathStep.sourceCrosswalkLabels)}, source-crosswalk text "${sourceReviewPathStep.sourceCrosswalkText}", source-review path text "${sourceReviewPathStep.sourceReviewPathText}", static source-review prompt text "${sourceReviewPathStep.staticSourceReviewPromptText}", local-only flag ${sourceReviewPathStep.localOnly ? "true" : "false"}, and static non-goal context "${sourceReviewPathStep.staticNonGoalContext}" as deterministic manual source-review readiness context only.`,
    staticSourceFollowUpCueText:
      `Static source-follow-up cue for Stage 123 source-review path step ${sourceReviewPathStepId}: compare Stage 123 static source-review prompt cards ${joinOrNone(sourceStaticSourceReviewPromptCardIds)}, Stage 122 source-crosswalk row ${sourceReviewPathStep.sourceCrosswalkRowId}, Stage 122 static review-check cards ${joinOrNone(sourceReviewPathStep.sourceStaticReviewCheckCardIds)}, Stage 121 review-path step ${sourceReviewPathStep.sourceConstraintCoverageReviewPathStepId}, Stage 120 constraint-coverage row ${sourceReviewPathStep.sourceConstraintCoverageRowId}, Stage 119 answer-review step ${sourceReviewPathStep.sourceAnswerReviewPathStepId}, Stage 118 readiness rows ${joinOrNone(sourceReviewPathStep.sourceResponsePromptReadinessRowIds)}, anchors ${joinOrNone(sourceReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(sourceReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(sourceReviewPathStep.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(sourceReviewPathStep.deferredScopeReminderIds)}, and carried source-review prompt text "${sourceReviewPathStep.staticSourceReviewPromptText}" before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, source-review readiness state, source-follow-up state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static source-review readiness lane context: manual source-review preparation and source-follow-up cue checking only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved source selections, saved source-review readiness state, saved source-follow-up state, saved source-crosswalk state, review-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(sourceReviewPathStep.staticNonGoalFlags),
  };
}

function buildStaticSourceFollowUpCueCard(
  staticSourceReviewPromptCard: Stage123StaticSourceReviewPromptCard,
  sourceReviewReadinessLaneRows: Stage124SourceReviewReadinessLaneRow[],
): Stage124StaticSourceFollowUpCueCard {
  const sourceStaticSourceReviewPromptCardId =
    staticSourceReviewPromptCard
      .constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId;
  const matchedSourceReviewReadinessLaneRows =
    sourceReviewReadinessLaneRows.filter((row) =>
      row.sourceStaticSourceReviewPromptCardIds.includes(
        sourceStaticSourceReviewPromptCardId,
      ),
    );
  const sourceSourceReviewReadinessLaneRowIds =
    matchedSourceReviewReadinessLaneRows.map(
      (row) =>
        row.constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowId,
    );
  const staticSourceFollowUpCueLabels = buildStaticSourceFollowUpCueLabels(
    staticSourceReviewPromptCard,
    matchedSourceReviewReadinessLaneRows,
  );
  const staticSourceFollowUpCueCardId =
    `${stage124IdPrefix}:static-source-follow-up-cue:${sourceStaticSourceReviewPromptCardId}`;

  return {
    ...staticSourceReviewPromptCard,
    constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardId:
      staticSourceFollowUpCueCardId,
    constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardIds:
      [staticSourceFollowUpCueCardId],
    sourceStaticSourceReviewPromptCardId,
    sourceStaticSourceReviewPromptCardIds: [sourceStaticSourceReviewPromptCardId],
    sourceSourceReviewReadinessLaneRowIds,
    staticSourceFollowUpCueOrder:
      staticSourceReviewPromptCard.staticSourceReviewPromptOrder,
    staticSourceFollowUpCueLabels,
    staticSourceFollowUpCueText:
      `Static source-follow-up cue card ${staticSourceFollowUpCueCardId}: use Stage 123 static source-review prompt card ${sourceStaticSourceReviewPromptCardId}, matched Stage 124 source-review readiness lane rows ${joinOrNone(sourceSourceReviewReadinessLaneRowIds)}, matched Stage 123 source-review path steps ${joinOrNone(staticSourceReviewPromptCard.sourceSourceCrosswalkReviewPathStepIds)}, Stage 122 static review-check card ${staticSourceReviewPromptCard.sourceStaticReviewCheckCardId}, Stage 121 response-prompt card ${staticSourceReviewPromptCard.sourceStaticResponsePromptCardId}, Stage 120 response-note prompt card ${staticSourceReviewPromptCard.sourceStaticResponseNotePromptCardId}, Stage 118 readiness row ${staticSourceReviewPromptCard.sourceResponsePromptReadinessRowId}, anchors ${joinOrNone(staticSourceReviewPromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticSourceReviewPromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticSourceReviewPromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticSourceReviewPromptCard.deferredScopeReminderIds)}, source-follow-up cue labels ${joinOrNone(staticSourceFollowUpCueLabels)}, source-review prompt labels ${joinOrNone(staticSourceReviewPromptCard.staticSourceReviewPromptLabels)}, static review-check text "${staticSourceReviewPromptCard.staticReviewCheckText}", static source-review prompt text "${staticSourceReviewPromptCard.staticSourceReviewPromptText}", local-only flag ${staticSourceReviewPromptCard.localOnly ? "true" : "false"}, and static non-goal context "${staticSourceReviewPromptCard.staticNonGoalContext}" as deterministic manual source-follow-up context only.`,
    staticNonGoalContext:
      "Static source-follow-up cue context: manual source-review readiness checking and follow-up cue preparation only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved source selections, saved source-review readiness state, saved source-follow-up state, saved source-crosswalk state, review-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticSourceReviewPromptCard.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  sourceReviewReadinessLaneRows: Stage124SourceReviewReadinessLaneRow[],
  staticSourceFollowUpCueCards: Stage124StaticSourceFollowUpCueCard[],
  sourceReviewPath: Stage123View,
): Stage124Summary["counts"] {
  const sourceCounts = sourceReviewPath.summary.counts;

  return {
    ...sourceCounts,
    sourceReviewReadinessLaneRowCount: sourceReviewReadinessLaneRows.length,
    staticSourceFollowUpCueCardCount: staticSourceFollowUpCueCards.length,
    sourceReviewReadinessLaneLabelCount: unique(
      sourceReviewReadinessLaneRows.flatMap(
        (row) => row.sourceReviewReadinessLaneLabels,
      ),
    ).length,
    staticSourceFollowUpCueLabelCount: unique(
      staticSourceFollowUpCueCards.flatMap(
        (card) => card.staticSourceFollowUpCueLabels,
      ),
    ).length,
    localOnlySourceReviewReadinessLaneRowCount:
      sourceReviewReadinessLaneRows.filter((row) => row.localOnly).length,
    localOnlyStaticSourceFollowUpCueCardCount:
      staticSourceFollowUpCueCards.filter((card) => card.localOnly).length,
  };
}

function buildSourceReviewReadinessLaneLabels(
  sourceReviewPathStep: Stage123SourceReviewPathStep,
  matchedStaticSourceReviewPromptCards: Stage123StaticSourceReviewPromptCard[],
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
    labels.push("anchor and callback source-review readiness context");
  }

  if (
    sourceReviewPathStep.gapDiscussionPointIds.length ||
    sourceReviewPathStep.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder source-review readiness context");
  }

  return labels;
}

function buildStaticSourceFollowUpCueLabels(
  staticSourceReviewPromptCard: Stage123StaticSourceReviewPromptCard,
  matchedSourceReviewReadinessLaneRows: Stage124SourceReviewReadinessLaneRow[],
): string[] {
  const labels = [
    "static source-follow-up cue card",
    "static source-review prompt carry-forward",
  ];

  if (matchedSourceReviewReadinessLaneRows.length) {
    labels.push("source-review readiness lane alignment");
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

function staticSourceReviewPromptCardMatchesSourceReviewReadinessLaneRow(
  staticSourceReviewPromptCard: Stage123StaticSourceReviewPromptCard,
  sourceReviewPathStep: Stage123SourceReviewPathStep,
): boolean {
  return (
    staticSourceReviewPromptCard.sourceSourceCrosswalkReviewPathStepIds.includes(
      sourceReviewPathStep
        .constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId,
    ) ||
    sourceReviewPathStep.sourceStaticReviewCheckCardIds.includes(
      staticSourceReviewPromptCard.sourceStaticReviewCheckCardId,
    ) ||
    sourceReviewPathStep.sourceStaticResponsePromptCardIds.includes(
      staticSourceReviewPromptCard.sourceStaticResponsePromptCardId,
    )
  );
}

function staticNonGoalFlags(
  sourceFlags: Stage123StaticNonGoalFlags,
): Stage124StaticNonGoalFlags {
  return {
    ...sourceFlags,
    noSavedSourceReviewReadinessState: true,
    noSavedSourceReviewReadinessLaneState: true,
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

function joinOrNone(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}
