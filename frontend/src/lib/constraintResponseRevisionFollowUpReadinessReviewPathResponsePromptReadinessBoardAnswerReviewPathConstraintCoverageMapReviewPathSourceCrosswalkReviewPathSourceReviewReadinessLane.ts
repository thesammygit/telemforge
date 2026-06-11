import type {
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewPathStepView as Stage103SourceReviewPathStep,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticNonGoalFlagsView as Stage103StaticNonGoalFlags,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardView as Stage103StaticSourceReviewPromptCard,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSummaryView as Stage103Summary,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathView as Stage103View,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowView as Stage104SourceReviewReadinessLaneRow,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticNonGoalFlagsView as Stage104StaticNonGoalFlags,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardView as Stage104StaticSourceFollowUpCueCard,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSummaryView as Stage104Summary,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneView as Stage104View,
} from "../features/mission-console/types.ts";

const stage104IdPrefix =
  "constraint-response-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path-source-crosswalk-review-path-source-review-readiness-lane";

export function buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLane(
  sourceReviewPath: Stage103View | undefined,
): Stage104View | undefined {
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
          .constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId,
    ) ?? sourceReviewReadinessLaneRows[0];
  const defaultStaticSourceFollowUpCueCard =
    staticSourceFollowUpCueCards.find(
      (card) =>
        card.sourceStaticSourceReviewPromptCardId ===
        sourceReviewPath.defaultStaticSourceReviewPromptCard
          .constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId,
    ) ?? staticSourceFollowUpCueCards[0];
  const sourceDefaultContext =
    sourceReviewPath.summary.defaultSourceReviewContext;

  return {
    schema:
      "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path source-review readiness lane and static source-follow-up cues",
    localStatus: sourceReviewPath.localStatus,
    summary: {
      constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneId:
        `candidate-local-${stage104IdPrefix}`,
      label: "Local constraint-response source-review readiness lane",
      summary:
        "A static source-review readiness lane derives from Stage 103 source-review path steps and static source-review prompt cards so reviewers can check which source-review steps are ready before drafting outside the app without saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved source selections, saved source-review readiness state, saved source-follow-up state, saved source-crosswalk state, review-check state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultSourceReviewReadinessContext: {
        defaultSourceReviewReadinessLaneRowId:
          defaultSourceReviewReadinessLaneRow
            .constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowId,
        defaultStaticSourceFollowUpCueCardId:
          defaultStaticSourceFollowUpCueCard
            .constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardId,
        defaultSourceReviewPathStepId:
          defaultSourceReviewReadinessLaneRow.sourceSourceReviewPathStepId,
        defaultStaticSourceReviewPromptCardId:
          defaultStaticSourceFollowUpCueCard.sourceStaticSourceReviewPromptCardId,
        defaultSourceCrosswalkRowId:
          sourceDefaultContext.defaultSourceCrosswalkRowId,
        defaultStaticReviewCheckCardId:
          sourceDefaultContext.defaultStaticReviewCheckCardId,
        defaultConstraintCoverageReviewPathStepId:
          sourceDefaultContext.defaultConstraintCoverageReviewPathStepId,
        defaultStaticResponsePromptCardId:
          sourceDefaultContext.defaultStaticResponsePromptCardId,
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
        sourceStage103SourceReviewPathSummary: sourceReviewPath.summary.summary,
        sourceStage103DefaultSourceReviewContext: sourceDefaultContext,
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
    staticConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSummary:
      "Stage 104 source-review readiness lane rows and static source-follow-up cue cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, source selections, source-review readiness state, source-follow-up state, source-crosswalk state, review-check state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath:
      sourceReviewPath,
  };
}

function buildSourceReviewReadinessLaneRow(
  sourceReviewPathStep: Stage103SourceReviewPathStep,
  staticSourceReviewPromptCards: Stage103StaticSourceReviewPromptCard[],
): Stage104SourceReviewReadinessLaneRow {
  const sourceReviewPathStepId =
    sourceReviewPathStep
      .constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId;
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
        card.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId,
    );
  const sourceReviewReadinessLaneLabels =
    buildSourceReviewReadinessLaneLabels(
      sourceReviewPathStep,
      matchedStaticSourceReviewPromptCards,
    );
  const sourceReviewReadinessLaneRowId =
    `${stage104IdPrefix}:row:${sourceReviewPathStepId}`;

  return {
    ...sourceReviewPathStep,
    constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowId:
      sourceReviewReadinessLaneRowId,
    constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowIds:
      [sourceReviewReadinessLaneRowId],
    sourceReviewReadinessLaneRowOrder:
      sourceReviewPathStep.sourceReviewPathStepOrder,
    sourceSourceReviewPathStepId: sourceReviewPathStepId,
    sourceSourceReviewPathStepIds: [sourceReviewPathStepId],
    sourceStaticSourceReviewPromptCardIds,
    sourceReviewReadinessLaneLabels,
    sourceReviewReadinessLaneText:
      `Source-review readiness lane row ${sourceReviewReadinessLaneRowId}: check Stage 103 source-review path step ${sourceReviewPathStepId}, Stage 103 static source-review prompt cards ${joinOrNone(sourceStaticSourceReviewPromptCardIds)}, Stage 102 source-crosswalk row ${sourceReviewPathStep.sourceCrosswalkRowId}, Stage 102 static review-check cards ${joinOrNone(sourceReviewPathStep.sourceStaticReviewCheckCardIds)}, Stage 101 review-path step ${sourceReviewPathStep.sourceConstraintCoverageReviewPathStepId}, Stage 101 response-prompt cards ${joinOrNone(sourceReviewPathStep.sourceStaticResponsePromptCardIds)}, Stage 100 constraint-coverage row ${sourceReviewPathStep.sourceConstraintCoverageRowId}, Stage 100 response-note prompt cards ${joinOrNone(sourceReviewPathStep.sourceStaticResponseNotePromptCardIds)}, Stage 99 answer-review step ${sourceReviewPathStep.sourceAnswerReviewPathStepId}, Stage 99 static constraint-note cards ${joinOrNone(sourceReviewPathStep.sourceStaticConstraintNoteCardIds)}, Stage 98 answer-check card ${sourceReviewPathStep.sourceStaticAnswerCheckCardId}, Stage 98 readiness rows ${joinOrNone(sourceReviewPathStep.sourceResponsePromptReadinessRowIds)}, Stage 97 review-path steps ${joinOrNone(sourceReviewPathStep.sourceRevisionFollowUpReadinessReviewPathStepIds)}, Stage 96 readiness rows ${joinOrNone(sourceReviewPathStep.sourceRevisionFollowUpReadinessRowIds)}, Stage 96 response-check card ${sourceReviewPathStep.sourceStaticResponseCheckCardId}, Stage 95 static revision follow-up prompt card ${sourceReviewPathStep.sourceStaticRevisionFollowUpPromptCardId}, Stage 94 static revision-check card ${sourceReviewPathStep.sourceStaticRevisionCheckCardId}, Stage 93 static revision-prompt card ${sourceReviewPathStep.sourceStaticRevisionPromptCardId}, Stage 92 static draft-check card ${sourceReviewPathStep.sourceStaticDraftCheckCardId}, Stage 91 static response cue card ${sourceReviewPathStep.sourceStaticResponseCueCardId}, Stage 90 static review prompt card ${sourceReviewPathStep.sourceStaticReviewPromptCardId}, Stage 89 static readiness cue ${sourceReviewPathStep.sourceStaticReadinessCueCardId}, Stage 88 static follow-up prompt ${sourceReviewPathStep.sourceStaticFollowUpPromptCardId}, Stage 87 citation-gap cue ${sourceReviewPathStep.sourceStaticCitationGapCueCardId}, Stage 86 citation-review lane row ${sourceReviewPathStep.sourceCitationReviewLaneRowId}, Stage 85 citation prompt card ${sourceReviewPathStep.sourceStaticCitationCheckPromptCardId}, anchors ${joinOrNone(sourceReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(sourceReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(sourceReviewPathStep.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(sourceReviewPathStep.deferredScopeReminderIds)}, source-review readiness labels ${joinOrNone(sourceReviewReadinessLaneLabels)}, source-review path labels ${joinOrNone(sourceReviewPathStep.sourceReviewPathLabels)}, source-crosswalk labels ${joinOrNone(sourceReviewPathStep.sourceCrosswalkLabels)}, source-crosswalk text "${sourceReviewPathStep.sourceCrosswalkText}", source-review path text "${sourceReviewPathStep.sourceReviewPathText}", static source-review prompt text "${sourceReviewPathStep.staticSourceReviewPromptText}", local-only flag ${sourceReviewPathStep.localOnly ? "true" : "false"}, and static non-goal context "${sourceReviewPathStep.staticNonGoalContext}" as deterministic manual source-review readiness context only.`,
    staticSourceFollowUpCueText:
      `Static source-follow-up cue for Stage 103 source-review path step ${sourceReviewPathStepId}: compare Stage 103 static source-review prompt cards ${joinOrNone(sourceStaticSourceReviewPromptCardIds)}, Stage 102 source-crosswalk row ${sourceReviewPathStep.sourceCrosswalkRowId}, Stage 102 static review-check cards ${joinOrNone(sourceReviewPathStep.sourceStaticReviewCheckCardIds)}, Stage 101 review-path step ${sourceReviewPathStep.sourceConstraintCoverageReviewPathStepId}, Stage 100 constraint-coverage row ${sourceReviewPathStep.sourceConstraintCoverageRowId}, Stage 99 answer-review step ${sourceReviewPathStep.sourceAnswerReviewPathStepId}, Stage 98 readiness rows ${joinOrNone(sourceReviewPathStep.sourceResponsePromptReadinessRowIds)}, anchors ${joinOrNone(sourceReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(sourceReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(sourceReviewPathStep.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(sourceReviewPathStep.deferredScopeReminderIds)}, and carried source-review prompt text "${sourceReviewPathStep.staticSourceReviewPromptText}" before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, source-review readiness state, source-follow-up state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static source-review readiness lane context: manual source-review preparation and source-follow-up cue checking only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved source selections, saved source-review readiness state, saved source-follow-up state, saved source-crosswalk state, review-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(sourceReviewPathStep.staticNonGoalFlags),
  };
}

function buildStaticSourceFollowUpCueCard(
  staticSourceReviewPromptCard: Stage103StaticSourceReviewPromptCard,
  sourceReviewReadinessLaneRows: Stage104SourceReviewReadinessLaneRow[],
): Stage104StaticSourceFollowUpCueCard {
  const sourceStaticSourceReviewPromptCardId =
    staticSourceReviewPromptCard
      .constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId;
  const matchedSourceReviewReadinessLaneRows =
    sourceReviewReadinessLaneRows.filter((row) =>
      row.sourceStaticSourceReviewPromptCardIds.includes(
        sourceStaticSourceReviewPromptCardId,
      ),
    );
  const sourceSourceReviewReadinessLaneRowIds =
    matchedSourceReviewReadinessLaneRows.map(
      (row) =>
        row.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowId,
    );
  const staticSourceFollowUpCueLabels = buildStaticSourceFollowUpCueLabels(
    staticSourceReviewPromptCard,
    matchedSourceReviewReadinessLaneRows,
  );
  const staticSourceFollowUpCueCardId =
    `${stage104IdPrefix}:static-source-follow-up-cue:${sourceStaticSourceReviewPromptCardId}`;

  return {
    ...staticSourceReviewPromptCard,
    constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardId:
      staticSourceFollowUpCueCardId,
    constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardIds:
      [staticSourceFollowUpCueCardId],
    sourceStaticSourceReviewPromptCardId,
    sourceStaticSourceReviewPromptCardIds: [sourceStaticSourceReviewPromptCardId],
    sourceSourceReviewReadinessLaneRowIds,
    staticSourceFollowUpCueOrder:
      staticSourceReviewPromptCard.staticSourceReviewPromptOrder,
    staticSourceFollowUpCueLabels,
    staticSourceFollowUpCueText:
      `Static source-follow-up cue card ${staticSourceFollowUpCueCardId}: use Stage 103 static source-review prompt card ${sourceStaticSourceReviewPromptCardId}, matched Stage 104 source-review readiness lane rows ${joinOrNone(sourceSourceReviewReadinessLaneRowIds)}, matched Stage 103 source-review path steps ${joinOrNone(staticSourceReviewPromptCard.sourceSourceCrosswalkReviewPathStepIds)}, Stage 102 static review-check card ${staticSourceReviewPromptCard.sourceStaticReviewCheckCardId}, Stage 101 response-prompt card ${staticSourceReviewPromptCard.sourceStaticResponsePromptCardId}, Stage 100 response-note prompt card ${staticSourceReviewPromptCard.sourceStaticResponseNotePromptCardId}, Stage 98 readiness row ${staticSourceReviewPromptCard.sourceResponsePromptReadinessRowId}, anchors ${joinOrNone(staticSourceReviewPromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticSourceReviewPromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticSourceReviewPromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticSourceReviewPromptCard.deferredScopeReminderIds)}, source-follow-up cue labels ${joinOrNone(staticSourceFollowUpCueLabels)}, source-review prompt labels ${joinOrNone(staticSourceReviewPromptCard.staticSourceReviewPromptLabels)}, static review-check text "${staticSourceReviewPromptCard.staticReviewCheckText}", static source-review prompt text "${staticSourceReviewPromptCard.staticSourceReviewPromptText}", local-only flag ${staticSourceReviewPromptCard.localOnly ? "true" : "false"}, and static non-goal context "${staticSourceReviewPromptCard.staticNonGoalContext}" as deterministic manual source-follow-up context only.`,
    staticNonGoalContext:
      "Static source-follow-up cue context: manual source-review readiness checking and follow-up cue preparation only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved source selections, saved source-review readiness state, saved source-follow-up state, saved source-crosswalk state, review-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticSourceReviewPromptCard.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  sourceReviewReadinessLaneRows: Stage104SourceReviewReadinessLaneRow[],
  staticSourceFollowUpCueCards: Stage104StaticSourceFollowUpCueCard[],
  sourceReviewPath: Stage103View,
): Stage104Summary["counts"] {
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
  sourceReviewPathStep: Stage103SourceReviewPathStep,
  matchedStaticSourceReviewPromptCards: Stage103StaticSourceReviewPromptCard[],
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
  staticSourceReviewPromptCard: Stage103StaticSourceReviewPromptCard,
  matchedSourceReviewReadinessLaneRows: Stage104SourceReviewReadinessLaneRow[],
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
  staticSourceReviewPromptCard: Stage103StaticSourceReviewPromptCard,
  sourceReviewPathStep: Stage103SourceReviewPathStep,
): boolean {
  return (
    staticSourceReviewPromptCard.sourceSourceCrosswalkReviewPathStepIds.includes(
      sourceReviewPathStep
        .constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId,
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
  sourceFlags: Stage103StaticNonGoalFlags,
): Stage104StaticNonGoalFlags {
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
