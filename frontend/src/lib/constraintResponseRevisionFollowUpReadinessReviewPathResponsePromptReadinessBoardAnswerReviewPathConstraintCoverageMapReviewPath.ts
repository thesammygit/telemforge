import type {
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticNonGoalFlagsView as Stage101StaticNonGoalFlags,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticResponsePromptCardView as Stage101StaticResponsePromptCard,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepView as Stage101ConstraintCoverageReviewPathStep,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSummaryView as Stage101Summary,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathView as Stage101View,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapRowView as Stage100ConstraintCoverageRow,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticNonGoalFlagsView as Stage100StaticNonGoalFlags,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardView as Stage100StaticResponseNotePromptCard,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapSummaryView as Stage100Summary,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapView as Stage100View,
} from "../features/mission-console/types.ts";

const stage101IdPrefix =
  "constraint-response-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path";

export function buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath(
  sourceConstraintCoverageMap: Stage100View | undefined,
): Stage101View | undefined {
  if (
    !sourceConstraintCoverageMap?.constraintCoverageRows.length ||
    !sourceConstraintCoverageMap.staticResponseNotePromptCards.length
  ) {
    return undefined;
  }

  const constraintCoverageReviewPathSteps =
    sourceConstraintCoverageMap.constraintCoverageRows.map((row) =>
      buildConstraintCoverageReviewPathStep(
        row,
        sourceConstraintCoverageMap.staticResponseNotePromptCards,
      ),
    );
  const staticResponsePromptCards =
    sourceConstraintCoverageMap.staticResponseNotePromptCards.map((card) =>
      buildStaticResponsePromptCard(card, constraintCoverageReviewPathSteps),
    );
  const defaultConstraintCoverageReviewPathStep =
    constraintCoverageReviewPathSteps.find(
      (step) =>
        step.sourceConstraintCoverageRowId ===
        sourceConstraintCoverageMap.defaultConstraintCoverageRow
          .constraintCoverageRowId,
    ) ?? constraintCoverageReviewPathSteps[0];
  const defaultStaticResponsePromptCard =
    staticResponsePromptCards.find(
      (card) =>
        card.sourceStaticResponseNotePromptCardId ===
        sourceConstraintCoverageMap.defaultStaticResponseNotePromptCard
          .staticResponseNotePromptCardId,
    ) ?? staticResponsePromptCards[0];

  return {
    schema:
      "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path and static response prompts",
    localStatus: sourceConstraintCoverageMap.localStatus,
    summary: {
      constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathId:
        `candidate-local-${stage101IdPrefix}`,
      label: "Local constraint-response constraint-coverage review path",
      summary:
        "A static constraint-coverage review path derives from Stage 100 constraint-coverage rows and static response-note prompt cards so reviewers can walk coverage rows in order and prepare response drafting outside the app without saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved constraint-coverage review state, saved response-prompt state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultResponsePromptContext: {
        ...sourceConstraintCoverageMap.summary.defaultResponseNoteContext,
        defaultConstraintCoverageReviewPathStepId:
          defaultConstraintCoverageReviewPathStep.constraintCoverageReviewPathStepId,
        defaultStaticResponsePromptCardId:
          defaultStaticResponsePromptCard.staticResponsePromptCardId,
        sourceStage100ConstraintCoverageMapSummary:
          sourceConstraintCoverageMap.summary.summary,
        sourceStage100DefaultResponseNoteContext:
          sourceConstraintCoverageMap.summary.defaultResponseNoteContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: {
        ...sourceConstraintCoverageMap.summary.counts,
        constraintCoverageReviewPathStepCount:
          constraintCoverageReviewPathSteps.length,
        staticResponsePromptCardCount: staticResponsePromptCards.length,
        constraintCoverageReviewPathLabelCount: unique(
          constraintCoverageReviewPathSteps.flatMap(
            (step) => step.constraintCoverageReviewPathLabels,
          ),
        ).length,
        staticResponsePromptLabelCount: unique(
          staticResponsePromptCards.flatMap(
            (card) => card.staticResponsePromptLabels,
          ),
        ).length,
        localOnlyConstraintCoverageReviewPathStepCount:
          constraintCoverageReviewPathSteps.filter((step) => step.localOnly)
            .length,
        localOnlyStaticResponsePromptCardCount:
          staticResponsePromptCards.filter((card) => card.localOnly).length,
      },
    },
    defaultConstraintCoverageReviewPathStep,
    defaultStaticResponsePromptCard,
    constraintCoverageReviewPathSteps,
    staticResponsePromptCards,
    staticConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSummary:
      "Stage 101 constraint-coverage review path steps and static response prompts are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, constraint-coverage review-path state, response-prompt state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap:
      sourceConstraintCoverageMap,
  };
}

function buildConstraintCoverageReviewPathStep(
  constraintCoverageRow: Stage100ConstraintCoverageRow,
  staticResponseNotePromptCards: Stage100StaticResponseNotePromptCard[],
): Stage101ConstraintCoverageReviewPathStep {
  const sourceConstraintCoverageRowId = constraintCoverageRow.constraintCoverageRowId;
  const matchedStaticResponseNotePromptCards =
    staticResponseNotePromptCards.filter((card) =>
      staticResponseNotePromptCardMatchesConstraintCoverageRow(
        card,
        constraintCoverageRow,
      ),
    );
  const sourceStaticResponseNotePromptCardIds =
    matchedStaticResponseNotePromptCards.map(
      (card) => card.staticResponseNotePromptCardId,
    );
  const constraintCoverageReviewPathLabels =
    buildConstraintCoverageReviewPathLabels(
      constraintCoverageRow,
      matchedStaticResponseNotePromptCards,
    );
  const constraintCoverageReviewPathStepId =
    `${stage101IdPrefix}:step:${sourceConstraintCoverageRowId}`;

  return {
    ...constraintCoverageRow,
    constraintCoverageReviewPathStepId,
    constraintCoverageReviewPathStepIds: [constraintCoverageReviewPathStepId],
    constraintCoverageReviewPathStepOrder: constraintCoverageRow.constraintCoverageRowOrder,
    sourceConstraintCoverageRowId,
    sourceConstraintCoverageRowIds: [sourceConstraintCoverageRowId],
    sourceStaticResponseNotePromptCardIds,
    constraintCoverageReviewPathLabels,
    constraintCoverageReviewPathText:
      `Constraint-coverage review path step ${constraintCoverageReviewPathStepId}: walk Stage 100 constraint-coverage row ${sourceConstraintCoverageRowId}, Stage 100 static response-note prompt cards ${joinOrNone(sourceStaticResponseNotePromptCardIds)}, Stage 99 answer-review step ${constraintCoverageRow.sourceAnswerReviewPathStepId}, Stage 99 static constraint-note cards ${joinOrNone(constraintCoverageRow.sourceStaticConstraintNoteCardIds)}, Stage 98 static answer-check card ${constraintCoverageRow.sourceStaticAnswerCheckCardId}, Stage 98 readiness rows ${joinOrNone(constraintCoverageRow.sourceResponsePromptReadinessRowIds)}, Stage 97 static response-prompt cards ${joinOrNone(constraintCoverageRow.sourceStaticResponsePromptCardIds)}, Stage 97 revision follow-up readiness review-path steps ${joinOrNone(constraintCoverageRow.sourceRevisionFollowUpReadinessReviewPathStepIds)}, Stage 96 readiness rows ${joinOrNone(constraintCoverageRow.sourceRevisionFollowUpReadinessRowIds)}, Stage 96 static response-check card ${constraintCoverageRow.sourceStaticResponseCheckCardId}, Stage 95 static revision follow-up prompt card ${constraintCoverageRow.sourceStaticRevisionFollowUpPromptCardId}, Stage 94 static revision-check card ${constraintCoverageRow.sourceStaticRevisionCheckCardId}, Stage 93 static revision-prompt card ${constraintCoverageRow.sourceStaticRevisionPromptCardId}, Stage 92 static draft-check card ${constraintCoverageRow.sourceStaticDraftCheckCardId}, Stage 91 static response cue card ${constraintCoverageRow.sourceStaticResponseCueCardId}, Stage 90 static review prompt card ${constraintCoverageRow.sourceStaticReviewPromptCardId}, Stage 89 static readiness cue ${constraintCoverageRow.sourceStaticReadinessCueCardId}, Stage 88 static follow-up prompt ${constraintCoverageRow.sourceStaticFollowUpPromptCardId}, Stage 87 citation-gap cue ${constraintCoverageRow.sourceStaticCitationGapCueCardId}, Stage 86 citation-review lane row ${constraintCoverageRow.sourceCitationReviewLaneRowId}, Stage 85 citation prompt card ${constraintCoverageRow.sourceStaticCitationCheckPromptCardId}, anchors ${joinOrNone(constraintCoverageRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(constraintCoverageRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(constraintCoverageRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(constraintCoverageRow.deferredScopeReminderIds)}, constraint-coverage labels ${joinOrNone(constraintCoverageRow.constraintCoverageLabels)}, and static response-note prompt labels ${joinOrNone(
        matchedStaticResponseNotePromptCards.flatMap(
          (card) => card.staticResponseNotePromptLabels,
        ),
      )} as deterministic manual response-prompt context only.`,
    staticResponsePromptText:
      `Static response prompt for constraint-coverage review path step ${sourceConstraintCoverageRowId}: compare Stage 100 static response-note prompt cards ${joinOrNone(sourceStaticResponseNotePromptCardIds)}, Stage 100 constraint-coverage row ${sourceConstraintCoverageRowId}, Stage 99 answer-review step ${constraintCoverageRow.sourceAnswerReviewPathStepId}, Stage 99 static constraint-note cards ${joinOrNone(constraintCoverageRow.sourceStaticConstraintNoteCardIds)}, Stage 98 static answer-check card ${constraintCoverageRow.sourceStaticAnswerCheckCardId}, anchors ${joinOrNone(constraintCoverageRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(constraintCoverageRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(constraintCoverageRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(constraintCoverageRow.deferredScopeReminderIds)}, and carried constraint-coverage labels ${joinOrNone(constraintCoverageRow.constraintCoverageLabels)} before drafting the next response outside the app without saving reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, constraint-coverage review state, response-prompt state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static constraint-coverage review-path context: manual response-prompt preparation and source lineage only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved constraint-coverage review state, saved response-prompt state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(constraintCoverageRow.staticNonGoalFlags),
  };
}

function buildStaticResponsePromptCard(
  staticResponseNotePromptCard: Stage100StaticResponseNotePromptCard,
  constraintCoverageReviewPathSteps: Stage101ConstraintCoverageReviewPathStep[],
): Stage101StaticResponsePromptCard {
  const sourceStaticResponseNotePromptCardId =
    staticResponseNotePromptCard.staticResponseNotePromptCardId;
  const matchedConstraintCoverageReviewPathSteps =
    constraintCoverageReviewPathSteps.filter((step) =>
      step.sourceStaticResponseNotePromptCardIds.includes(
        sourceStaticResponseNotePromptCardId,
      ),
    );
  const sourceConstraintCoverageReviewPathStepIds =
    matchedConstraintCoverageReviewPathSteps.map(
      (step) => step.constraintCoverageReviewPathStepId,
    );
  const staticResponsePromptLabels = buildStaticResponsePromptLabels(
    staticResponseNotePromptCard,
    matchedConstraintCoverageReviewPathSteps,
  );
  const staticResponsePromptCardId =
    `${stage101IdPrefix}:static-response-prompt:${sourceStaticResponseNotePromptCardId}`;

  return {
    ...staticResponseNotePromptCard,
    staticResponsePromptCardId,
    staticResponsePromptCardIds: [staticResponsePromptCardId],
    sourceStaticResponseNotePromptCardId,
    sourceStaticResponseNotePromptCardIds: [sourceStaticResponseNotePromptCardId],
    sourceConstraintCoverageReviewPathStepIds,
    staticResponsePromptOrder:
      staticResponseNotePromptCard.staticResponseNotePromptOrder,
    staticResponsePromptLabels,
    staticResponsePromptText:
      `Static response prompt ${staticResponsePromptCardId}: use Stage 100 static response-note prompt card ${sourceStaticResponseNotePromptCardId}, matched Stage 101 constraint-coverage review path steps ${joinOrNone(sourceConstraintCoverageReviewPathStepIds)}, Stage 99 static constraint-note card ${staticResponseNotePromptCard.sourceStaticConstraintNoteCardId}, Stage 99 answer-review path steps ${joinOrNone(staticResponseNotePromptCard.sourceAnswerReviewPathStepIds)}, Stage 98 readiness row ${staticResponseNotePromptCard.sourceResponsePromptReadinessRowId}, Stage 98 static answer-check cards ${joinOrNone(staticResponseNotePromptCard.sourceStaticAnswerCheckCardIds)}, Stage 97 static response-prompt cards ${joinOrNone(staticResponseNotePromptCard.sourceStaticResponsePromptCardIds)}, anchors ${joinOrNone(staticResponseNotePromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticResponseNotePromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticResponseNotePromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticResponseNotePromptCard.deferredScopeReminderIds)}, static response-note labels ${joinOrNone(staticResponseNotePromptCard.staticResponseNotePromptLabels)}, static response-prompt labels ${joinOrNone(staticResponsePromptLabels)}, and carried Stage 100 response-note text "${staticResponseNotePromptCard.staticResponseNotePromptText}" as static manual response-prompt context only.`,
    staticNonGoalContext:
      "Static response-prompt context: manual response drafting outside the app only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved constraint-coverage review state, saved response-prompt state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticResponseNotePromptCard.staticNonGoalFlags,
    ),
  };
}

function buildConstraintCoverageReviewPathLabels(
  constraintCoverageRow: Stage100ConstraintCoverageRow,
  matchedStaticResponseNotePromptCards: Stage100StaticResponseNotePromptCard[],
): string[] {
  const labels = [
    "constraint-coverage review path step",
    "static response-prompt carry-forward",
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
    labels.push("anchor and callback response-prompt context");
  }

  if (
    constraintCoverageRow.gapDiscussionPointIds.length ||
    constraintCoverageRow.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder response-prompt context");
  }

  return labels;
}

function buildStaticResponsePromptLabels(
  staticResponseNotePromptCard: Stage100StaticResponseNotePromptCard,
  matchedConstraintCoverageReviewPathSteps: Stage101ConstraintCoverageReviewPathStep[],
): string[] {
  const labels = ["static response prompt", "response-note prompt carry-forward"];

  if (matchedConstraintCoverageReviewPathSteps.length) {
    labels.push("constraint-coverage review path source alignment");
  }

  if (staticResponseNotePromptCard.staticResponseNotePromptLabels.length) {
    labels.push("static response-note prompt context");
  }

  if (
    staticResponseNotePromptCard.sourceLocalAnchorHrefs.length ||
    staticResponseNotePromptCard.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback response-prompt context");
  }

  if (
    staticResponseNotePromptCard.gapDiscussionPointIds.length ||
    staticResponseNotePromptCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder response-prompt context");
  }

  return labels;
}

function staticResponseNotePromptCardMatchesConstraintCoverageRow(
  staticResponseNotePromptCard: Stage100StaticResponseNotePromptCard,
  constraintCoverageRow: Stage100ConstraintCoverageRow,
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
    constraintCoverageRow.sourceStaticResponsePromptCardIds.some(
      (sourcePromptCardId) =>
        staticResponseNotePromptCard.sourceStaticResponsePromptCardIds.includes(
          sourcePromptCardId,
        ),
    )
  );
}

function staticNonGoalFlags(
  sourceFlags: Stage100StaticNonGoalFlags,
): Stage101StaticNonGoalFlags {
  return {
    ...sourceFlags,
    noSavedConstraintCoverageReviewState: true,
    noSavedConstraintCoverageReviewPath: true,
    noSavedConstraintCoverageReviewPathSteps: true,
    noSavedConstraintCoverageReviewPathSelections: true,
    noSavedReviewPathState: true,
    noSavedResponsePromptState: true,
    noSavedResponsePromptSelections: true,
    noSavedStaticResponsePromptCards: true,
    noSavedResponseDrafts: true,
    noSavedReviewerAnswers: true,
    noSavedResponseNotes: true,
  };
}

function joinOrNone(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
