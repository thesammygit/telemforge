import type {
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticNonGoalFlagsView as Stage121StaticNonGoalFlags,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticResponsePromptCardView as Stage121StaticResponsePromptCard,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepView as Stage121ConstraintCoverageReviewPathStep,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathView as Stage121View,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapRowView as Stage120ConstraintCoverageRow,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticNonGoalFlagsView as Stage120StaticNonGoalFlags,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardView as Stage120StaticResponseNotePromptCard,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapView as Stage120View,
} from "../features/mission-console/types.ts";

const stage121IdPrefix =
  "constraint-response-revision-coverage-review-path-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path";

export function buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath(
  sourceConstraintCoverageMap: Stage120View | undefined,
): Stage121View | undefined {
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
      "telemforge.constraint_response_revision_coverage_review_path_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response revision coverage review-path revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path and static response prompts",
    localStatus: sourceConstraintCoverageMap.localStatus,
    summary: {
      constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathId:
        `candidate-local-${stage121IdPrefix}`,
      label: "Local Stage 121 constraint-coverage review path",
      summary:
        "A static constraint-coverage review path derives from Stage 120 constraint-coverage rows and static response-note prompt cards so reviewers can walk coverage rows in order and prepare response prompts outside the app without saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved coverage-review state, saved response-prompt state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultResponsePromptContext: {
        ...sourceConstraintCoverageMap.summary.defaultResponseNoteContext,
        defaultConstraintCoverageReviewPathStepId:
          defaultConstraintCoverageReviewPathStep.constraintCoverageReviewPathStepId,
        defaultStaticResponsePromptCardId:
          defaultStaticResponsePromptCard.staticResponsePromptCardId,
        sourceStage120ConstraintCoverageMapSummary:
          sourceConstraintCoverageMap.summary.summary,
        sourceStage120DefaultResponseNoteContext:
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
    staticConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSummary:
      "Stage 121 constraint-coverage review path steps and static response prompts are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, coverage-review state, response-prompt state, constraint-coverage state, response-note state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap:
      sourceConstraintCoverageMap,
  };
}

function buildConstraintCoverageReviewPathStep(
  constraintCoverageRow: Stage120ConstraintCoverageRow,
  staticResponseNotePromptCards: Stage120StaticResponseNotePromptCard[],
): Stage121ConstraintCoverageReviewPathStep {
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
    `${stage121IdPrefix}:step:${sourceConstraintCoverageRowId}`;

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
      `Stage 121 constraint-coverage review path step ${constraintCoverageReviewPathStepId}: walk Stage 120 constraint-coverage row ${sourceConstraintCoverageRowId}, Stage 120 static response-note prompt cards ${joinOrNone(sourceStaticResponseNotePromptCardIds)}, Stage 119 answer-review step ${constraintCoverageRow.sourceAnswerReviewPathStepId}, Stage 119 static constraint-note cards ${joinOrNone(constraintCoverageRow.sourceStaticConstraintNoteCardIds)}, Stage 118 static answer-check card ${constraintCoverageRow.sourceStaticAnswerCheckCardId}, Stage 118 readiness rows ${joinOrNone(constraintCoverageRow.sourceResponsePromptReadinessRowIds)}, Stage 117 static response-prompt cards ${joinOrNone(constraintCoverageRow.sourceStaticResponsePromptCardIds)}, Stage 117 revision follow-up readiness review-path steps ${joinOrNone(constraintCoverageRow.sourceRevisionFollowUpReadinessReviewPathStepIds)}, Stage 116 readiness rows ${joinOrNone(constraintCoverageRow.sourceRevisionFollowUpReadinessRowIds)}, Stage 116 static response-check card ${constraintCoverageRow.sourceStaticResponseCheckCardId}, Stage 115 static revision follow-up prompt card ${constraintCoverageRow.sourceStaticRevisionFollowUpPromptCardId}, Stage 114 revision coverage review-path step ${constraintCoverageRow.sourceRevisionCoverageReviewPathStepId}, Stage 114 revision coverage row ${constraintCoverageRow.sourceRevisionCoverageRowId}, Stage 113 static revision-check card ${constraintCoverageRow.sourceStaticRevisionCheckCardId}, Stage 112 static revision-prompt card ${constraintCoverageRow.sourceStaticRevisionPromptCardId}, Stage 111 static draft-check card ${constraintCoverageRow.sourceStaticDraftCheckCardId}, Stage 110 static response cue card ${constraintCoverageRow.sourceStaticResponseCueCardId}, Stage 109 static review prompt card ${constraintCoverageRow.sourceStaticReviewPromptCardId}, Stage 108 static readiness cue ${constraintCoverageRow.sourceStaticReadinessCueCardId}, Stage 107 static follow-up prompt ${constraintCoverageRow.sourceStaticFollowUpPromptCardId}, Stage 106 citation-gap cue ${constraintCoverageRow.sourceStaticCitationGapCueCardId}, Stage 105 citation-review lane row ${constraintCoverageRow.sourceCitationReviewLaneRowId}, Stage 104 citation prompt card ${constraintCoverageRow.sourceStaticCitationCheckPromptCardId}, anchors ${joinOrNone(constraintCoverageRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(constraintCoverageRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(constraintCoverageRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(constraintCoverageRow.deferredScopeReminderIds)}, constraint-coverage labels ${joinOrNone(constraintCoverageRow.constraintCoverageLabels)}, and static response-note prompt labels ${joinOrNone(
        matchedStaticResponseNotePromptCards.flatMap(
          (card) => card.staticResponseNotePromptLabels,
        ),
      )} as deterministic manual response-prompt context only.`,
    staticResponsePromptText:
      `Static response prompt for Stage 121 constraint-coverage review path step ${sourceConstraintCoverageRowId}: compare Stage 120 static response-note prompt cards ${joinOrNone(sourceStaticResponseNotePromptCardIds)}, Stage 120 constraint-coverage row ${sourceConstraintCoverageRowId}, Stage 119 answer-review step ${constraintCoverageRow.sourceAnswerReviewPathStepId}, Stage 119 static constraint-note cards ${joinOrNone(constraintCoverageRow.sourceStaticConstraintNoteCardIds)}, Stage 118 static answer-check card ${constraintCoverageRow.sourceStaticAnswerCheckCardId}, anchors ${joinOrNone(constraintCoverageRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(constraintCoverageRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(constraintCoverageRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(constraintCoverageRow.deferredScopeReminderIds)}, and carried constraint-coverage labels ${joinOrNone(constraintCoverageRow.constraintCoverageLabels)} before drafting the next response outside the app without saving reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, coverage-review state, response-prompt state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static Stage 121 constraint-coverage review-path context: manual response-prompt preparation and Stage 120 source lineage only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved coverage-review state, saved response-prompt state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(constraintCoverageRow.staticNonGoalFlags),
  };
}

function buildStaticResponsePromptCard(
  staticResponseNotePromptCard: Stage120StaticResponseNotePromptCard,
  constraintCoverageReviewPathSteps: Stage121ConstraintCoverageReviewPathStep[],
): Stage121StaticResponsePromptCard {
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
    `${stage121IdPrefix}:static-response-prompt:${sourceStaticResponseNotePromptCardId}`;

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
      `Stage 121 static response prompt ${staticResponsePromptCardId}: use Stage 120 static response-note prompt card ${sourceStaticResponseNotePromptCardId}, matched Stage 121 constraint-coverage review path steps ${joinOrNone(sourceConstraintCoverageReviewPathStepIds)}, Stage 119 static constraint-note card ${staticResponseNotePromptCard.sourceStaticConstraintNoteCardId}, Stage 119 answer-review path steps ${joinOrNone(staticResponseNotePromptCard.sourceAnswerReviewPathStepIds)}, Stage 118 readiness row ${staticResponseNotePromptCard.sourceResponsePromptReadinessRowId}, Stage 118 static answer-check cards ${joinOrNone(staticResponseNotePromptCard.sourceStaticAnswerCheckCardIds)}, Stage 117 static response-prompt cards ${joinOrNone(staticResponseNotePromptCard.sourceStaticResponsePromptCardIds)}, anchors ${joinOrNone(staticResponseNotePromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticResponseNotePromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticResponseNotePromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticResponseNotePromptCard.deferredScopeReminderIds)}, static response-note labels ${joinOrNone(staticResponseNotePromptCard.staticResponseNotePromptLabels)}, static response-prompt labels ${joinOrNone(staticResponsePromptLabels)}, and carried Stage 120 response-note text "${staticResponseNotePromptCard.staticResponseNotePromptText}" as static manual response-prompt context only.`,
    staticNonGoalContext:
      "Static Stage 121 response-prompt context: manual response drafting outside the app only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved coverage-review state, saved response-prompt state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticResponseNotePromptCard.staticNonGoalFlags,
    ),
  };
}

function buildConstraintCoverageReviewPathLabels(
  constraintCoverageRow: Stage120ConstraintCoverageRow,
  matchedStaticResponseNotePromptCards: Stage120StaticResponseNotePromptCard[],
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
  staticResponseNotePromptCard: Stage120StaticResponseNotePromptCard,
  matchedConstraintCoverageReviewPathSteps: Stage121ConstraintCoverageReviewPathStep[],
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
  staticResponseNotePromptCard: Stage120StaticResponseNotePromptCard,
  constraintCoverageRow: Stage120ConstraintCoverageRow,
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
  sourceFlags: Stage120StaticNonGoalFlags,
): Stage121StaticNonGoalFlags {
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
