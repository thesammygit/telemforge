import type {
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewPathStepView as Stage123SourceReviewPathStep,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticNonGoalFlagsView as Stage123StaticNonGoalFlags,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardView as Stage123StaticSourceReviewPromptCard,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSummaryView as Stage123Summary,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathView as Stage123View,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowView as Stage122SourceCrosswalkRow,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticNonGoalFlagsView as Stage122StaticNonGoalFlags,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardView as Stage122StaticReviewCheckCard,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkView as Stage122View,
} from "../features/mission-console/types.ts";

const stage123IdPrefix =
  "constraint-response-revision-coverage-review-path-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path-source-crosswalk-review-path";

export function buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath(
  sourceConstraintResponseSourceCrosswalk: Stage122View | undefined,
): Stage123View | undefined {
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
          .constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId,
    ) ?? sourceReviewPathSteps[0];
  const defaultStaticSourceReviewPromptCard =
    staticSourceReviewPromptCards.find(
      (card) =>
        card.sourceStaticReviewCheckCardId ===
        sourceConstraintResponseSourceCrosswalk.defaultStaticReviewCheckCard
          .constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId,
    ) ?? staticSourceReviewPromptCards[0];
  const sourceDefaultContext =
    sourceConstraintResponseSourceCrosswalk.summary.defaultSourceCheckContext;

  return {
    schema:
      "telemforge.constraint_response_revision_coverage_review_path_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response revision coverage review-path revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path and static source-review prompts",
    localStatus: sourceConstraintResponseSourceCrosswalk.localStatus,
    summary: {
      constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathId:
        `candidate-local-${stage123IdPrefix}`,
      label: "Local constraint-response source-crosswalk review path",
      summary:
        "A static source-crosswalk review path derives from Stage 122 source-crosswalk rows and static review-check cards so reviewers can walk each source-review step in order before drafting outside the app without saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved source selections, saved source-review state, saved source-crosswalk state, review-check state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultSourceReviewContext: {
        ...sourceDefaultContext,
        defaultSourceReviewPathStepId:
          defaultSourceReviewPathStep
            .constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId,
        defaultStaticSourceReviewPromptCardId:
          defaultStaticSourceReviewPromptCard
            .constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId,
        defaultSourceCrosswalkRowId:
          defaultSourceReviewPathStep.sourceCrosswalkRowId,
        defaultStaticReviewCheckCardId:
          defaultStaticSourceReviewPromptCard.sourceStaticReviewCheckCardId,
        sourceStage122SourceCrosswalkSummary:
          sourceConstraintResponseSourceCrosswalk.summary.summary,
        sourceStage122DefaultSourceCheckContext: sourceDefaultContext,
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
    staticConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSummary:
      "Stage 123 source-crosswalk review path steps and static source-review prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, source selections, source-review state, source-crosswalk state, review-check state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk:
      sourceConstraintResponseSourceCrosswalk,
  };
}

function buildSourceReviewPathStep(
  sourceCrosswalkRow: Stage122SourceCrosswalkRow,
  staticReviewCheckCards: Stage122StaticReviewCheckCard[],
): Stage123SourceReviewPathStep {
  const sourceCrosswalkRowId =
    sourceCrosswalkRow
      .constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId;
  const matchedStaticReviewCheckCards = staticReviewCheckCards.filter((card) =>
    staticReviewCheckCardMatchesSourceCrosswalkRow(card, sourceCrosswalkRow),
  );
  const sourceStaticReviewCheckCardIds = matchedStaticReviewCheckCards.map(
    (card) =>
      card.constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId,
  );
  const sourceReviewPathLabels = buildSourceReviewPathLabels(
    sourceCrosswalkRow,
    matchedStaticReviewCheckCards,
  );
  const sourceStaticReviewText = matchedStaticReviewCheckCards
    .map((card) => card.staticReviewCheckText)
    .join(" | ");
  const sourceReviewPathStepId =
    `${stage123IdPrefix}:step:${sourceCrosswalkRowId}`;

  return {
    ...sourceCrosswalkRow,
    constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId:
      sourceReviewPathStepId,
    constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepIds:
      [sourceReviewPathStepId],
    sourceReviewPathStepOrder: sourceCrosswalkRow.sourceCrosswalkRowOrder,
    sourceCrosswalkRowId,
    sourceCrosswalkRowIds: [sourceCrosswalkRowId],
    sourceStaticReviewCheckCardIds,
    sourceReviewPathLabels,
    sourceReviewPathText:
      `Source-crosswalk review path step ${sourceReviewPathStepId}: walk Stage 122 source-crosswalk row ${sourceCrosswalkRowId}, Stage 122 static review-check cards ${joinOrNone(sourceStaticReviewCheckCardIds)}, Stage 121 review-path step ${sourceCrosswalkRow.sourceConstraintCoverageReviewPathStepId}, Stage 121 response-prompt cards ${joinOrNone(sourceCrosswalkRow.sourceStaticResponsePromptCardIds)}, Stage 120 constraint-coverage row ${sourceCrosswalkRow.sourceConstraintCoverageRowId}, Stage 120 response-note prompt cards ${joinOrNone(sourceCrosswalkRow.sourceStaticResponseNotePromptCardIds)}, Stage 119 answer-review step ${sourceCrosswalkRow.sourceAnswerReviewPathStepId}, Stage 119 static constraint-note cards ${joinOrNone(sourceCrosswalkRow.sourceStaticConstraintNoteCardIds)}, Stage 118 answer-check card ${sourceCrosswalkRow.sourceStaticAnswerCheckCardId}, Stage 118 readiness rows ${joinOrNone(sourceCrosswalkRow.sourceResponsePromptReadinessRowIds)}, Stage 117 response-prompt cards ${joinOrNone(sourceCrosswalkRow.sourceStaticResponsePromptCardIds)}, Stage 117 review-path steps ${joinOrNone(sourceCrosswalkRow.sourceRevisionFollowUpReadinessReviewPathStepIds)}, Stage 116 readiness rows ${joinOrNone(sourceCrosswalkRow.sourceRevisionFollowUpReadinessRowIds)}, Stage 116 response-check card ${sourceCrosswalkRow.sourceStaticResponseCheckCardId}, Stage 115 static revision follow-up prompt card ${sourceCrosswalkRow.sourceStaticRevisionFollowUpPromptCardId}, Stage 114 static revision-check card ${sourceCrosswalkRow.sourceStaticRevisionCheckCardId}, Stage 113 static revision-prompt card ${sourceCrosswalkRow.sourceStaticRevisionPromptCardId}, Stage 112 static draft-check card ${sourceCrosswalkRow.sourceStaticDraftCheckCardId}, Stage 111 static response cue card ${sourceCrosswalkRow.sourceStaticResponseCueCardId}, Stage 110 static review prompt card ${sourceCrosswalkRow.sourceStaticReviewPromptCardId}, Stage 109 static readiness cue ${sourceCrosswalkRow.sourceStaticReadinessCueCardId}, Stage 108 static follow-up prompt ${sourceCrosswalkRow.sourceStaticFollowUpPromptCardId}, Stage 107 citation-gap cue ${sourceCrosswalkRow.sourceStaticCitationGapCueCardId}, Stage 106 citation-review lane row ${sourceCrosswalkRow.sourceCitationReviewLaneRowId}, Stage 105 citation prompt card ${sourceCrosswalkRow.sourceStaticCitationCheckPromptCardId}, anchors ${joinOrNone(sourceCrosswalkRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(sourceCrosswalkRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(sourceCrosswalkRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(sourceCrosswalkRow.deferredScopeReminderIds)}, source-crosswalk labels ${joinOrNone(sourceCrosswalkRow.sourceCrosswalkLabels)}, source-review labels ${joinOrNone(sourceReviewPathLabels)}, source-crosswalk text "${sourceCrosswalkRow.sourceCrosswalkText}", static review-check text "${sourceCrosswalkRow.staticReviewCheckText}", carried static source-review text "${sourceStaticReviewText}", local-only flag ${sourceCrosswalkRow.localOnly ? "true" : "false"}, and static non-goal context "${sourceCrosswalkRow.staticNonGoalContext}" as deterministic manual source-review context only.`,
    staticSourceReviewPromptText:
      `Static source-review prompt for Stage 122 source-crosswalk row ${sourceCrosswalkRowId}: compare Stage 122 static review-check cards ${joinOrNone(sourceStaticReviewCheckCardIds)}, Stage 121 review-path step ${sourceCrosswalkRow.sourceConstraintCoverageReviewPathStepId}, Stage 120 constraint-coverage row ${sourceCrosswalkRow.sourceConstraintCoverageRowId}, Stage 119 answer-review step ${sourceCrosswalkRow.sourceAnswerReviewPathStepId}, Stage 118 readiness rows ${joinOrNone(sourceCrosswalkRow.sourceResponsePromptReadinessRowIds)}, Stage 117 review-path steps ${joinOrNone(sourceCrosswalkRow.sourceRevisionFollowUpReadinessReviewPathStepIds)}, anchors ${joinOrNone(sourceCrosswalkRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(sourceCrosswalkRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(sourceCrosswalkRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(sourceCrosswalkRow.deferredScopeReminderIds)}, and carried source-crosswalk text "${sourceCrosswalkRow.sourceCrosswalkText}" before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, source-review state, source-crosswalk state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static source-crosswalk review-path context: manual source-review preparation and source lineage only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved source-review state, saved source-crosswalk state, review-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(sourceCrosswalkRow.staticNonGoalFlags),
  };
}

function buildStaticSourceReviewPromptCard(
  staticReviewCheckCard: Stage122StaticReviewCheckCard,
  sourceReviewPathSteps: Stage123SourceReviewPathStep[],
): Stage123StaticSourceReviewPromptCard {
  const sourceStaticReviewCheckCardId =
    staticReviewCheckCard
      .constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId;
  const matchedSourceReviewPathSteps = sourceReviewPathSteps.filter((step) =>
    step.sourceStaticReviewCheckCardIds.includes(sourceStaticReviewCheckCardId),
  );
  const sourceSourceCrosswalkReviewPathStepIds =
    matchedSourceReviewPathSteps.map(
      (step) =>
        step.constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId,
    );
  const staticSourceReviewPromptLabels = buildStaticSourceReviewPromptLabels(
    staticReviewCheckCard,
    matchedSourceReviewPathSteps,
  );
  const staticSourceReviewPromptCardId =
    `${stage123IdPrefix}:static-source-review-prompt:${sourceStaticReviewCheckCardId}`;

  return {
    ...staticReviewCheckCard,
    constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId:
      staticSourceReviewPromptCardId,
    constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardIds:
      [staticSourceReviewPromptCardId],
    sourceStaticReviewCheckCardId,
    sourceStaticReviewCheckCardIds: [sourceStaticReviewCheckCardId],
    sourceSourceCrosswalkReviewPathStepIds,
    staticSourceReviewPromptOrder: staticReviewCheckCard.staticReviewCheckOrder,
    staticSourceReviewPromptLabels,
    staticSourceReviewPromptText:
      `Static source-review prompt card ${staticSourceReviewPromptCardId}: use Stage 122 static review-check card ${sourceStaticReviewCheckCardId}, Stage 121 response-prompt card ${staticReviewCheckCard.sourceStaticResponsePromptCardId}, matched Stage 123 source-crosswalk review-path steps ${joinOrNone(sourceSourceCrosswalkReviewPathStepIds)}, matched Stage 121 review-path steps ${joinOrNone(staticReviewCheckCard.sourceConstraintCoverageReviewPathStepIds)}, Stage 120 response-note prompt card ${staticReviewCheckCard.sourceStaticResponseNotePromptCardId}, Stage 118 readiness row ${staticReviewCheckCard.sourceResponsePromptReadinessRowId}, Stage 117 response-prompt card ${staticReviewCheckCard.sourceStaticResponsePromptCardId}, anchors ${joinOrNone(staticReviewCheckCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticReviewCheckCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticReviewCheckCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticReviewCheckCard.deferredScopeReminderIds)}, review-check labels ${joinOrNone(staticReviewCheckCard.staticReviewCheckLabels)}, source-review labels ${joinOrNone(staticSourceReviewPromptLabels)}, and carried static review-check text "${staticReviewCheckCard.staticReviewCheckText}" as static manual source-review context only.`,
    staticNonGoalContext:
      "Static source-review prompt context: compare source-review steps with review-check cards only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved source-review state, saved source-crosswalk state, review-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticReviewCheckCard.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  sourceReviewPathSteps: Stage123SourceReviewPathStep[],
  staticSourceReviewPromptCards: Stage123StaticSourceReviewPromptCard[],
  sourceConstraintResponseSourceCrosswalk: Stage122View,
): Stage123Summary["counts"] {
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
  sourceCrosswalkRow: Stage122SourceCrosswalkRow,
  matchedStaticReviewCheckCards: Stage122StaticReviewCheckCard[],
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
  staticReviewCheckCard: Stage122StaticReviewCheckCard,
  matchedSourceReviewPathSteps: Stage123SourceReviewPathStep[],
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
  staticReviewCheckCard: Stage122StaticReviewCheckCard,
  sourceCrosswalkRow: Stage122SourceCrosswalkRow,
): boolean {
  return (
    sourceCrosswalkRow.sourceStaticResponsePromptCardIds.includes(
      staticReviewCheckCard.sourceStaticResponsePromptCardId,
    ) ||
    staticReviewCheckCard.sourceConstraintCoverageReviewPathStepIds.includes(
      sourceCrosswalkRow.sourceConstraintCoverageReviewPathStepId,
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
  sourceFlags: Stage122StaticNonGoalFlags,
): Stage123StaticNonGoalFlags {
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

function joinOrNone(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}
