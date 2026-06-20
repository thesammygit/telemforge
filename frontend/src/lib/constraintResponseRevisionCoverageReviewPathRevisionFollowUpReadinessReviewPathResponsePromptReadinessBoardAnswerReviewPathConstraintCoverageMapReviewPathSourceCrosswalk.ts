import type {
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowView as Stage102SourceCrosswalkRow,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticNonGoalFlagsView as Stage102StaticNonGoalFlags,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardView as Stage102StaticReviewCheckCard,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkSummaryView as Stage102Summary,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkView as Stage102View,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepView as Stage101ConstraintCoverageReviewPathStep,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticNonGoalFlagsView as Stage101StaticNonGoalFlags,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticResponsePromptCardView as Stage101StaticResponsePromptCard,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathView as Stage101View,
} from "../features/mission-console/types.ts";

const stage122IdPrefix =
  "constraint-response-revision-coverage-review-path-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path-source-crosswalk";

export function buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk(
  sourceConstraintResponseReviewPath: Stage101View | undefined,
): Stage102View | undefined {
  if (
    !sourceConstraintResponseReviewPath?.constraintCoverageReviewPathSteps
      .length ||
    !sourceConstraintResponseReviewPath.staticResponsePromptCards.length
  ) {
    return undefined;
  }

  const sourceCrosswalkRows =
    sourceConstraintResponseReviewPath.constraintCoverageReviewPathSteps.map(
      (step) =>
        buildSourceCrosswalkRow(
          step,
          sourceConstraintResponseReviewPath.staticResponsePromptCards,
        ),
    );
  const staticReviewCheckCards =
    sourceConstraintResponseReviewPath.staticResponsePromptCards.map((card) =>
      buildStaticReviewCheckCard(card, sourceCrosswalkRows),
    );
  const defaultSourceCrosswalkRow =
    sourceCrosswalkRows.find(
      (row) =>
        row.sourceConstraintCoverageReviewPathStepId ===
        sourceConstraintResponseReviewPath.defaultConstraintCoverageReviewPathStep
          .constraintCoverageReviewPathStepId,
    ) ?? sourceCrosswalkRows[0];
  const defaultStaticReviewCheckCard =
    staticReviewCheckCards.find(
      (card) =>
        card.sourceStaticResponsePromptCardId ===
        sourceConstraintResponseReviewPath.defaultStaticResponsePromptCard
          .staticResponsePromptCardId,
    ) ?? staticReviewCheckCards[0];
  const sourceDefaultContext =
    sourceConstraintResponseReviewPath.summary.defaultResponsePromptContext;

  return {
    schema:
      "telemforge.constraint_response_revision_coverage_review_path_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response revision coverage review-path revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source crosswalk and static review checks",
    localStatus: sourceConstraintResponseReviewPath.localStatus,
    summary: {
      constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkId:
        `candidate-local-${stage122IdPrefix}`,
      label: "Local constraint-response source crosswalk",
      summary:
        "A static source crosswalk derives from Stage 121 review-path steps and static response-prompt cards so reviewers can compare each response-prep prompt with its source chain before drafting outside the app without saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved source selections, saved source-crosswalk state, saved review-check state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultSourceCheckContext: {
        defaultSourceCrosswalkRowId:
          defaultSourceCrosswalkRow
            .constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId,
        defaultStaticReviewCheckCardId:
          defaultStaticReviewCheckCard
            .constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId,
        defaultConstraintCoverageReviewPathStepId:
          defaultSourceCrosswalkRow.sourceConstraintCoverageReviewPathStepId,
        defaultStaticResponsePromptCardId:
          defaultStaticReviewCheckCard.sourceStaticResponsePromptCardId,
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
        defaultAnswerCoverageRowId: sourceDefaultContext.defaultAnswerCoverageRowId,
        defaultRehearsalPathStepId: sourceDefaultContext.defaultRehearsalPathStepId,
        defaultReviewBoardRowId: sourceDefaultContext.defaultReviewBoardRowId,
        defaultFollowUpReadinessBriefRowId:
          sourceDefaultContext.defaultFollowUpReadinessBriefRowId,
        defaultFollowUpTriageRowId: sourceDefaultContext.defaultFollowUpTriageRowId,
        defaultStaticCoveragePromptCardId:
          sourceDefaultContext.defaultStaticCoveragePromptCardId,
        defaultStaticReadinessCueCardId:
          sourceDefaultContext.defaultStaticReadinessCueCardId,
        defaultStaticReviewerCheckCardId:
          sourceDefaultContext.defaultStaticReviewerCheckCardId,
        sourceStage121ConstraintCoverageMapReviewPathSummary:
          sourceConstraintResponseReviewPath.summary.summary,
        sourceStage121DefaultResponsePromptContext: sourceDefaultContext,
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
    staticConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkSummary:
      "Stage 122 source-crosswalk rows and static review-check cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, source selections, source-crosswalk state, review-check state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath:
      sourceConstraintResponseReviewPath,
  };
}

function buildSourceCrosswalkRow(
  constraintCoverageReviewPathStep: Stage101ConstraintCoverageReviewPathStep,
  staticResponsePromptCards: Stage101StaticResponsePromptCard[],
): Stage102SourceCrosswalkRow {
  const sourceConstraintCoverageReviewPathStepId =
    constraintCoverageReviewPathStep.constraintCoverageReviewPathStepId;
  const matchedStaticResponsePromptCards =
    staticResponsePromptCards.filter((card) =>
      staticResponsePromptCardMatchesConstraintCoverageReviewPathStep(
        card,
        constraintCoverageReviewPathStep,
      ),
    );
  const sourceStaticResponsePromptCardIds = matchedStaticResponsePromptCards.map(
    (card) => card.staticResponsePromptCardId,
  );
  const sourceCrosswalkLabels = buildSourceCrosswalkLabels(
    constraintCoverageReviewPathStep,
    matchedStaticResponsePromptCards,
  );
  const sourceReviewCheckText = matchedStaticResponsePromptCards
    .map((card) => card.staticReviewCheckText)
    .join(" | ");
  const sourceCrosswalkRowId =
    `${stage122IdPrefix}:row:${sourceConstraintCoverageReviewPathStepId}`;

  return {
    ...constraintCoverageReviewPathStep,
    constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId:
      sourceCrosswalkRowId,
    constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowIds:
      [sourceCrosswalkRowId],
    sourceCrosswalkRowOrder:
      constraintCoverageReviewPathStep.constraintCoverageReviewPathStepOrder,
    sourceConstraintCoverageReviewPathStepId,
    sourceConstraintCoverageReviewPathStepIds: [sourceConstraintCoverageReviewPathStepId],
    sourceCrosswalkLabels,
    sourceCrosswalkText:
      `Constraint-response source crosswalk row ${sourceCrosswalkRowId}: compare Stage 121 review-path step ${sourceConstraintCoverageReviewPathStepId}, Stage 121 response-prompt cards ${joinOrNone(sourceStaticResponsePromptCardIds)}, Stage 120 constraint-coverage row ${constraintCoverageReviewPathStep.sourceConstraintCoverageRowId}, Stage 120 response-note prompt cards ${joinOrNone(constraintCoverageReviewPathStep.sourceStaticResponseNotePromptCardIds)}, Stage 119 answer-review step ${constraintCoverageReviewPathStep.sourceAnswerReviewPathStepId}, Stage 119 static constraint-note cards ${joinOrNone(constraintCoverageReviewPathStep.sourceStaticConstraintNoteCardIds)}, Stage 118 answer-check card ${constraintCoverageReviewPathStep.sourceStaticAnswerCheckCardId}, Stage 118 readiness rows ${joinOrNone(constraintCoverageReviewPathStep.sourceResponsePromptReadinessRowIds)}, Stage 117 response-prompt cards ${joinOrNone(constraintCoverageReviewPathStep.sourceStaticResponsePromptCardIds)}, Stage 117 review-path steps ${joinOrNone(constraintCoverageReviewPathStep.sourceRevisionFollowUpReadinessReviewPathStepIds)}, Stage 116 readiness rows ${joinOrNone(constraintCoverageReviewPathStep.sourceRevisionFollowUpReadinessRowIds)}, Stage 116 response-check card ${constraintCoverageReviewPathStep.sourceStaticResponseCheckCardId}, Stage 115 static revision follow-up prompt card ${constraintCoverageReviewPathStep.sourceStaticRevisionFollowUpPromptCardId}, Stage 114 static revision-check card ${constraintCoverageReviewPathStep.sourceStaticRevisionCheckCardId}, Stage 113 static revision-prompt card ${constraintCoverageReviewPathStep.sourceStaticRevisionPromptCardId}, Stage 112 static draft-check card ${constraintCoverageReviewPathStep.sourceStaticDraftCheckCardId}, Stage 111 static response cue card ${constraintCoverageReviewPathStep.sourceStaticResponseCueCardId}, Stage 110 static review prompt card ${constraintCoverageReviewPathStep.sourceStaticReviewPromptCardId}, Stage 109 static readiness cue ${constraintCoverageReviewPathStep.sourceStaticReadinessCueCardId}, Stage 108 static follow-up prompt ${constraintCoverageReviewPathStep.sourceStaticFollowUpPromptCardId}, Stage 107 citation-gap cue ${constraintCoverageReviewPathStep.sourceStaticCitationGapCueCardId}, Stage 106 citation-review lane row ${constraintCoverageReviewPathStep.sourceCitationReviewLaneRowId}, Stage 105 citation prompt card ${constraintCoverageReviewPathStep.sourceStaticCitationCheckPromptCardId}, anchors ${joinOrNone(constraintCoverageReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(constraintCoverageReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(constraintCoverageReviewPathStep.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(constraintCoverageReviewPathStep.deferredScopeReminderIds)}, source-crosswalk labels ${joinOrNone(sourceCrosswalkLabels)}, static review-check labels ${joinOrNone(buildStaticReviewCheckLabelsForRow(constraintCoverageReviewPathStep, matchedStaticResponsePromptCards))}, static response-prompt text "${constraintCoverageReviewPathStep.staticResponsePromptText}", static review-check text "${sourceReviewCheckText}", local-only flag ${constraintCoverageReviewPathStep.localOnly ? "true" : "false"}, and static non-goal context "${constraintCoverageReviewPathStep.staticNonGoalContext}" as deterministic manual source-check context only.`,
    staticReviewCheckText:
      `Static review-check text for Stage 121 review-path step ${sourceConstraintCoverageReviewPathStepId}: compare Stage 121 response-prompt cards ${joinOrNone(sourceStaticResponsePromptCardIds)}, Stage 120 response-note prompt cards ${joinOrNone(constraintCoverageReviewPathStep.sourceStaticResponseNotePromptCardIds)}, Stage 119 answer-review step ${constraintCoverageReviewPathStep.sourceAnswerReviewPathStepId}, Stage 118 readiness rows ${joinOrNone(constraintCoverageReviewPathStep.sourceResponsePromptReadinessRowIds)}, Stage 117 response-prompt cards ${joinOrNone(constraintCoverageReviewPathStep.sourceStaticResponsePromptCardIds)}, anchors ${joinOrNone(constraintCoverageReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(constraintCoverageReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(constraintCoverageReviewPathStep.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(constraintCoverageReviewPathStep.deferredScopeReminderIds)}, and carried static response-prompt text "${constraintCoverageReviewPathStep.staticResponsePromptText}" before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, source-review state, source-crosswalk state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static source-crosswalk review-path context: manual source-review preparation and source lineage only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved source-review state, saved source-crosswalk state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      constraintCoverageReviewPathStep.staticNonGoalFlags,
    ),
  };
}

function buildStaticReviewCheckCard(
  staticResponsePromptCard: Stage101StaticResponsePromptCard,
  sourceCrosswalkRows: Stage102SourceCrosswalkRow[],
): Stage102StaticReviewCheckCard {
  const sourceStaticResponsePromptCardId =
    staticResponsePromptCard.staticResponsePromptCardId;
  const matchedSourceCrosswalkRows = sourceCrosswalkRows.filter((row) =>
    row.sourceStaticResponsePromptCardIds.includes(
      sourceStaticResponsePromptCardId,
    ),
  );
  const sourceConstraintCoverageReviewPathStepIds =
    matchedSourceCrosswalkRows.map((row) => row.sourceConstraintCoverageReviewPathStepId);
  const staticReviewCheckLabels = buildStaticReviewCheckLabels(
    staticResponsePromptCard,
    matchedSourceCrosswalkRows,
  );
  const sourceCrosswalkStaticReviewCheckCardId =
    `${stage122IdPrefix}:static-review-check:${sourceStaticResponsePromptCardId}`;

  return {
    ...staticResponsePromptCard,
    constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId:
      sourceCrosswalkStaticReviewCheckCardId,
    constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardIds:
      [sourceCrosswalkStaticReviewCheckCardId],
    sourceStaticResponsePromptCardId,
    sourceStaticResponsePromptCardIds:
      staticResponsePromptCard.sourceStaticResponsePromptCardIds,
    sourceConstraintCoverageReviewPathStepIds,
    staticReviewCheckOrder: staticResponsePromptCard.staticResponsePromptOrder,
    staticReviewCheckLabels,
    staticReviewCheckText:
      `Static review-check card ${sourceCrosswalkStaticReviewCheckCardId}: verify Stage 121 response-prompt card ${sourceStaticResponsePromptCardId}, Stage 120 response-note prompt card ${staticResponsePromptCard.sourceStaticResponseNotePromptCardId}, matched Stage 121 review-path steps ${joinOrNone(sourceConstraintCoverageReviewPathStepIds)}, Stage 120 constraint-coverage row ${staticResponsePromptCard.sourceConstraintCoverageRowId}, Stage 119 answer-review step ${staticResponsePromptCard.sourceAnswerReviewPathStepId}, Stage 118 readiness row ${staticResponsePromptCard.sourceResponsePromptReadinessRowId}, Stage 117 response-prompt cards ${joinOrNone(staticResponsePromptCard.sourceStaticResponsePromptCardIds)}, anchors ${joinOrNone(staticResponsePromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticResponsePromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticResponsePromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticResponsePromptCard.deferredScopeReminderIds)}, review-check labels ${joinOrNone(staticReviewCheckLabels)}, source-crosswalk labels ${joinOrNone(buildSourceCrosswalkLabelsForCard(staticResponsePromptCard, matchedSourceCrosswalkRows))}, and carried static response-prompt text "${staticResponsePromptCard.staticResponsePromptText}" as static manual source-check context only.`,
    staticNonGoalContext:
      "Static review-check context: compare response-prep prompts with source chains only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved response-review state, saved source-crosswalk state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(staticResponsePromptCard.staticNonGoalFlags),
  };
}

function buildCounts(
  sourceCrosswalkRows: Stage102SourceCrosswalkRow[],
  staticReviewCheckCards: Stage102StaticReviewCheckCard[],
  sourceConstraintResponseReviewPath: Stage101View,
): Stage102Summary["counts"] {
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
    localOnlySourceCrosswalkRowCount: sourceCrosswalkRows.filter((row) => row.localOnly)
      .length,
    localOnlyStaticReviewCheckCardCount: staticReviewCheckCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function buildSourceCrosswalkLabels(
  constraintCoverageReviewPathStep: Stage101ConstraintCoverageReviewPathStep,
  matchedStaticResponsePromptCards: Stage101StaticResponsePromptCard[],
): string[] {
  const labels = [
    "constraint-response source crosswalk row",
    "static review-check source chain",
  ];

  if (matchedStaticResponsePromptCards.length) {
    labels.push("response-prompt source alignment");
  }

  if (constraintCoverageReviewPathStep.constraintCoverageReviewPathLabels.length) {
    labels.push("constraint-coverage review-path carry-forward");
  }

  if (
    constraintCoverageReviewPathStep.sourceLocalAnchorHrefs.length ||
    constraintCoverageReviewPathStep.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback source-check context");
  }

  if (
    constraintCoverageReviewPathStep.gapDiscussionPointIds.length ||
    constraintCoverageReviewPathStep.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder source-check context");
  }

  return labels;
}

function buildSourceCrosswalkLabelsForCard(
  staticResponsePromptCard: Stage101StaticResponsePromptCard,
  matchedSourceCrosswalkRows: Stage102SourceCrosswalkRow[],
): string[] {
  const labels = [
    "static review-check card",
    "response-prompt source check",
  ];

  if (matchedSourceCrosswalkRows.length) {
    labels.push("constraint-response source crosswalk alignment");
  }

  if (staticResponsePromptCard.staticResponsePromptLabels.length) {
    labels.push("static response-prompt context");
  }

  if (
    staticResponsePromptCard.sourceLocalAnchorHrefs.length ||
    staticResponsePromptCard.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback review-check context");
  }

  if (
    staticResponsePromptCard.gapDiscussionPointIds.length ||
    staticResponsePromptCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder review-check context");
  }

  return labels;
}

function buildStaticReviewCheckLabelsForRow(
  constraintCoverageReviewPathStep: Stage101ConstraintCoverageReviewPathStep,
  matchedStaticResponsePromptCards: Stage101StaticResponsePromptCard[],
): string[] {
  const labels = [
    "constraint-response source crosswalk row",
    "static review-check source chain",
  ];

  if (matchedStaticResponsePromptCards.length) {
    labels.push("response-prompt source alignment");
  }

  if (constraintCoverageReviewPathStep.constraintCoverageReviewPathLabels.length) {
    labels.push("constraint-coverage review-path carry-forward");
  }

  if (
    constraintCoverageReviewPathStep.sourceLocalAnchorHrefs.length ||
    constraintCoverageReviewPathStep.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback source-check context");
  }

  if (
    constraintCoverageReviewPathStep.gapDiscussionPointIds.length ||
    constraintCoverageReviewPathStep.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder source-check context");
  }

  return labels;
}

function buildStaticReviewCheckLabels(
  staticResponsePromptCard: Stage101StaticResponsePromptCard,
  matchedSourceCrosswalkRows: Stage102SourceCrosswalkRow[],
): string[] {
  return buildSourceCrosswalkLabelsForCard(
    staticResponsePromptCard,
    matchedSourceCrosswalkRows,
  );
}

function staticResponsePromptCardMatchesConstraintCoverageReviewPathStep(
  staticResponsePromptCard: Stage101StaticResponsePromptCard,
  constraintCoverageReviewPathStep: Stage101ConstraintCoverageReviewPathStep,
): boolean {
  return (
    constraintCoverageReviewPathStep.sourceStaticResponseNotePromptCardIds.includes(
      staticResponsePromptCard.sourceStaticResponseNotePromptCardId,
    ) ||
    staticResponsePromptCard.sourceConstraintCoverageReviewPathStepIds.includes(
      constraintCoverageReviewPathStep.constraintCoverageReviewPathStepId,
    ) ||
    staticResponsePromptCard.sourceAnswerReviewPathStepIds.includes(
      constraintCoverageReviewPathStep.sourceAnswerReviewPathStepId,
    ) ||
    constraintCoverageReviewPathStep.sourceResponsePromptReadinessRowIds.includes(
      staticResponsePromptCard.sourceResponsePromptReadinessRowId,
    )
  );
}

function staticNonGoalFlags(
  sourceFlags: Stage101StaticNonGoalFlags,
): Stage102StaticNonGoalFlags {
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

function joinOrNone(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}
