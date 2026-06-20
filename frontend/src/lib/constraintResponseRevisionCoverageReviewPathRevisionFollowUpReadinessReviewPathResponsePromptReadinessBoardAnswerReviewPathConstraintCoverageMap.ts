import type {
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapRowView as Stage120ConstraintCoverageRow,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticNonGoalFlagsView as Stage120StaticNonGoalFlags,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardView as Stage120StaticResponseNotePromptCard,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapSummaryView as Stage120Summary,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapView as Stage120View,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardView as Stage119StaticConstraintNoteCard,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticNonGoalFlagsView as Stage119StaticNonGoalFlags,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathStepView as Stage119AnswerReviewPathStep,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathView as Stage119View,
} from "../features/mission-console/types.ts";

const stage120IdPrefix =
  "constraint-response-revision-coverage-review-path-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map";

export function buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap(
  sourceAnswerReviewPath: Stage119View | undefined,
): Stage120View | undefined {
  if (
    !sourceAnswerReviewPath?.answerReviewPathSteps.length ||
    !sourceAnswerReviewPath.staticConstraintNoteCards.length
  ) {
    return undefined;
  }

  const constraintCoverageRows = sourceAnswerReviewPath.answerReviewPathSteps.map(
    (step) =>
      buildConstraintCoverageRow(
        step,
        sourceAnswerReviewPath.staticConstraintNoteCards,
      ),
  );
  const staticResponseNotePromptCards =
    sourceAnswerReviewPath.staticConstraintNoteCards.map((constraintNote) =>
      buildStaticResponseNotePromptCard(
        constraintNote,
        sourceAnswerReviewPath.answerReviewPathSteps,
      ),
    );
  const defaultConstraintCoverageRow =
    constraintCoverageRows.find(
      (row) =>
        row.sourceAnswerReviewPathStepId ===
        sourceAnswerReviewPath.defaultAnswerReviewPathStep.answerReviewPathStepId,
    ) ?? constraintCoverageRows[0];
  const defaultStaticResponseNotePromptCard =
    staticResponseNotePromptCards.find(
      (card) =>
        card.sourceStaticConstraintNoteCardId ===
        sourceAnswerReviewPath.defaultStaticConstraintNoteCard
          .staticConstraintNoteCardId,
    ) ?? staticResponseNotePromptCards[0];

  return {
    schema:
      "telemforge.constraint_response_revision_coverage_review_path_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response revision coverage review-path revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map and static response notes",
    localStatus: sourceAnswerReviewPath.localStatus,
    summary: {
      constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapId:
        `candidate-local-${stage120IdPrefix}`,
      label:
        "Local Stage 120 answer-review constraint-coverage map",
      summary:
        "A static constraint-coverage map derives from Stage 119 answer-review path steps and static constraint-note cards so reviewers can verify manual answer-review constraints and response-note prompts before drafting the next response outside the app without saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved constraint-coverage state, saved response-note state, saved answer-review state, saved constraint-note state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultResponseNoteContext: {
        defaultConstraintCoverageRowId:
          defaultConstraintCoverageRow.constraintCoverageRowId,
        defaultStaticResponseNotePromptCardId:
          defaultStaticResponseNotePromptCard.staticResponseNotePromptCardId,
        defaultAnswerReviewPathStepId:
          defaultConstraintCoverageRow.sourceAnswerReviewPathStepId,
        defaultStaticConstraintNoteCardId:
          defaultStaticResponseNotePromptCard.sourceStaticConstraintNoteCardId,
        defaultStaticAnswerCheckCardId:
          defaultConstraintCoverageRow.sourceStaticAnswerCheckCardId,
        defaultResponsePromptReadinessRowId:
          defaultStaticResponseNotePromptCard.sourceResponsePromptReadinessRowId,
        defaultStaticResponsePromptCardId:
          defaultConstraintCoverageRow.sourceStaticResponsePromptCardId,
        defaultRevisionFollowUpReadinessReviewPathStepId:
          defaultStaticResponseNotePromptCard
            .sourceRevisionFollowUpReadinessReviewPathStepId,
        defaultRevisionFollowUpReadinessRowId:
          defaultStaticResponseNotePromptCard
            .sourceRevisionFollowUpReadinessRowId,
        defaultStaticResponseCheckCardId:
          defaultConstraintCoverageRow.sourceStaticResponseCheckCardId,
        defaultRevisionCoverageReviewPathStepId:
          defaultStaticResponseNotePromptCard
            .sourceRevisionCoverageReviewPathStepId,
        defaultStaticRevisionFollowUpPromptCardId:
          defaultConstraintCoverageRow
            .sourceStaticRevisionFollowUpPromptCardId,
        defaultRevisionCoverageRowId:
          defaultStaticResponseNotePromptCard.sourceRevisionCoverageRowId,
        defaultStaticRevisionCheckCardId:
          defaultConstraintCoverageRow.sourceStaticRevisionCheckCardId,
        defaultResponseReadinessReviewPathStepId:
          defaultStaticResponseNotePromptCard
            .sourceResponseReadinessReviewPathStepId,
        defaultStaticRevisionPromptCardId:
          defaultConstraintCoverageRow.sourceStaticRevisionPromptCardId,
        defaultResponseReadinessRowId:
          defaultStaticResponseNotePromptCard.sourceResponseReadinessRowId,
        defaultStaticDraftCheckCardId:
          defaultConstraintCoverageRow.sourceStaticDraftCheckCardId,
        defaultCoverageReviewPathStepId:
          defaultStaticResponseNotePromptCard.sourceCoverageReviewPathStepId,
        defaultStaticResponseCueCardId:
          defaultConstraintCoverageRow.sourceStaticResponseCueCardId,
        defaultCoverageRowId:
          defaultStaticResponseNotePromptCard.sourceCoverageRowId,
        defaultStaticReviewPromptCardId:
          defaultConstraintCoverageRow.sourceStaticReviewPromptCardId,
        defaultFollowUpReviewPathStepId:
          defaultStaticResponseNotePromptCard.sourceFollowUpReviewPathStepId,
        defaultStaticReadinessCueCardId:
          defaultConstraintCoverageRow.sourceStaticReadinessCueCardId,
        defaultEvidenceGapReadinessRowId:
          defaultStaticResponseNotePromptCard.sourceEvidenceGapReadinessRowId,
        defaultStaticFollowUpPromptCardId:
          defaultConstraintCoverageRow.sourceStaticFollowUpPromptCardId,
        defaultEvidenceCheckReviewPathStepId:
          defaultStaticResponseNotePromptCard.sourceEvidenceCheckReviewPathStepId,
        defaultStaticCitationGapCueCardId:
          defaultConstraintCoverageRow.sourceStaticCitationGapCueCardId,
        defaultStaticEvidenceCheckPromptCardId:
          defaultStaticResponseNotePromptCard
            .sourceStaticEvidenceCheckPromptCardId,
        defaultCitationReviewLaneRowId:
          defaultConstraintCoverageRow.sourceCitationReviewLaneRowId,
        defaultStaticCitationCheckPromptCardId:
          defaultConstraintCoverageRow.sourceStaticCitationCheckPromptCardId,
        defaultSourceFollowUpMapEntryId:
          defaultStaticResponseNotePromptCard.sourceSourceFollowUpMapEntryId,
        sourceStage119AnswerReviewPathSummary:
          sourceAnswerReviewPath.summary.summary,
        sourceStage119DefaultAnswerReviewContext:
          sourceAnswerReviewPath.summary.defaultAnswerReviewContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        constraintCoverageRows,
        staticResponseNotePromptCards,
        sourceAnswerReviewPath,
      ),
    },
    defaultConstraintCoverageRow,
    defaultStaticResponseNotePromptCard,
    constraintCoverageRows,
    staticResponseNotePromptCards,
    staticConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapSummary:
      "Stage 120 constraint-coverage rows and static response-note prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, constraint-coverage state, response-note state, answer-review state, constraint-note state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPath:
      sourceAnswerReviewPath,
  };
}

function buildConstraintCoverageRow(
  answerReviewPathStep: Stage119AnswerReviewPathStep,
  staticConstraintNoteCards: Stage119StaticConstraintNoteCard[],
): Stage120ConstraintCoverageRow {
  const sourceAnswerReviewPathStepId = answerReviewPathStep.answerReviewPathStepId;
  const matchedStaticConstraintNoteCards = staticConstraintNoteCards.filter(
    (card) =>
      staticConstraintNoteCardMatchesAnswerReviewPathStep(
        card,
        answerReviewPathStep,
      ),
  );
  const sourceStaticConstraintNoteCardIds =
    matchedStaticConstraintNoteCards.map((card) => card.staticConstraintNoteCardId);
  const staticConstraintNoteLabels = matchedStaticConstraintNoteCards.flatMap(
    (card) => card.staticConstraintNoteLabels,
  );
  const staticResponsePromptReadinessText = matchedStaticConstraintNoteCards
    .map((card) => card.responsePromptReadinessText)
    .join(" | ");
  const constraintCoverageLabels = buildConstraintCoverageLabels(
    answerReviewPathStep,
    matchedStaticConstraintNoteCards,
  );
  const constraintCoverageRowId =
    `${stage120IdPrefix}:row:${sourceAnswerReviewPathStepId}`;

  return {
    ...answerReviewPathStep,
    constraintCoverageRowId,
    constraintCoverageRowIds: [constraintCoverageRowId],
    constraintCoverageRowOrder: answerReviewPathStep.answerReviewPathStepOrder,
    sourceAnswerReviewPathStepId,
    sourceAnswerReviewPathStepIds: [sourceAnswerReviewPathStepId],
    sourceStaticConstraintNoteCardIds,
    staticConstraintNoteLabels,
    constraintCoverageLabels,
    staticResponsePromptReadinessText,
    constraintCoverageText:
      `Stage 120 constraint-coverage row ${constraintCoverageRowId}: verify Stage 119 answer-review path step ${sourceAnswerReviewPathStepId}, Stage 119 static constraint-note cards ${joinOrNone(sourceStaticConstraintNoteCardIds)}, Stage 118 static answer-check card ${answerReviewPathStep.sourceStaticAnswerCheckCardId}, Stage 118 readiness rows ${joinOrNone(answerReviewPathStep.sourceResponsePromptReadinessRowIds)}, Stage 117 static response-prompt card ${answerReviewPathStep.sourceStaticResponsePromptCardId}, Stage 117 review-path steps ${joinOrNone(answerReviewPathStep.sourceRevisionFollowUpReadinessReviewPathStepIds)}, Stage 116 readiness rows ${joinOrNone(answerReviewPathStep.sourceRevisionFollowUpReadinessRowIds)}, Stage 116 static response-check card ${answerReviewPathStep.sourceStaticResponseCheckCardId}, Stage 115 through Stage 64 source lineage ids, anchors ${joinOrNone(answerReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(answerReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(answerReviewPathStep.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(answerReviewPathStep.deferredScopeReminderIds)}, answer-review labels ${joinOrNone(answerReviewPathStep.answerReviewPathLabels)}, constraint-note labels ${joinOrNone(staticConstraintNoteLabels)}, static answer-check text "${answerReviewPathStep.staticAnswerCheckText}", response-prompt readiness text "${staticResponsePromptReadinessText}", answer-review text "${answerReviewPathStep.answerReviewPathText}", and static constraint-note text "${answerReviewPathStep.staticConstraintNoteText}" as deterministic manual-answer constraint support only.`,
    staticResponseNotePromptText:
      `Static response-note prompt for Stage 120 constraint-coverage row ${sourceAnswerReviewPathStepId}: compare answer-review path step ${sourceAnswerReviewPathStepId}, Stage 119 constraint notes ${joinOrNone(sourceStaticConstraintNoteCardIds)}, Stage 118 static answer-check card ${answerReviewPathStep.sourceStaticAnswerCheckCardId}, response-prompt readiness text "${staticResponsePromptReadinessText}", anchors ${joinOrNone(answerReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(answerReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(answerReviewPathStep.gapDiscussionPointIds)}, and deferred reminders ${joinOrNone(answerReviewPathStep.deferredScopeReminderIds)} before drafting the next response note outside the app without saving reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, constraint-coverage state, response-note state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static Stage 120 constraint-coverage context: manual-answer constraint support, Stage 119 answer-review path steps, Stage 119 constraint-note cards, Stage 118 readiness rows, source lineage, anchors, callbacks, gap prompts, and deferred reminders only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved constraint-coverage state, saved response-note state, saved answer-review state, saved constraint-note state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      answerReviewPathStep.staticNonGoalFlags,
    ),
  };
}

function buildStaticResponseNotePromptCard(
  staticConstraintNoteCard: Stage119StaticConstraintNoteCard,
  answerReviewPathSteps: Stage119AnswerReviewPathStep[],
): Stage120StaticResponseNotePromptCard {
  const sourceStaticConstraintNoteCardId =
    staticConstraintNoteCard.staticConstraintNoteCardId;
  const matchedAnswerReviewPathSteps = answerReviewPathSteps.filter((step) =>
    staticConstraintNoteCardMatchesAnswerReviewPathStep(
      staticConstraintNoteCard,
      step,
    ),
  );
  const sourceAnswerReviewPathStepIds = matchedAnswerReviewPathSteps.map(
    (step) => step.answerReviewPathStepId,
  );
  const staticResponseNotePromptLabels = buildStaticResponseNotePromptLabels(
    staticConstraintNoteCard,
    matchedAnswerReviewPathSteps,
  );
  const staticResponseNotePromptCardId =
    `${stage120IdPrefix}:static-response-note-prompt:${sourceStaticConstraintNoteCardId}`;

  return {
    ...staticConstraintNoteCard,
    staticResponseNotePromptCardId,
    staticResponseNotePromptCardIds: [staticResponseNotePromptCardId],
    sourceStaticConstraintNoteCardId,
    sourceStaticConstraintNoteCardIds: [sourceStaticConstraintNoteCardId],
    sourceAnswerReviewPathStepIds,
    staticResponseNotePromptOrder:
      staticConstraintNoteCard.staticConstraintNoteOrder,
    staticResponseNotePromptLabels,
    staticResponseNotePromptText:
      `Stage 120 static response-note prompt ${staticResponseNotePromptCardId}: use Stage 119 static constraint-note card ${sourceStaticConstraintNoteCardId}, matched Stage 119 answer-review path steps ${joinOrNone(sourceAnswerReviewPathStepIds)}, Stage 118 readiness row ${staticConstraintNoteCard.sourceResponsePromptReadinessRowId}, Stage 118 answer-check cards ${joinOrNone(staticConstraintNoteCard.sourceStaticAnswerCheckCardIds)}, Stage 117 static response-prompt cards ${joinOrNone(staticConstraintNoteCard.sourceStaticResponsePromptCardIds)}, anchors ${joinOrNone(staticConstraintNoteCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticConstraintNoteCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticConstraintNoteCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticConstraintNoteCard.deferredScopeReminderIds)}, response-prompt readiness labels ${joinOrNone(staticConstraintNoteCard.responsePromptReadinessLabels)}, and constraint-note labels ${joinOrNone(staticConstraintNoteCard.staticConstraintNoteLabels)} as static manual response-note context only.`,
    staticNonGoalContext:
      "Static Stage 120 response-note prompt context: manual response drafting outside the app only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved constraint-coverage state, saved response-note state, saved answer-review state, saved constraint-note state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticConstraintNoteCard.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  constraintCoverageRows: Stage120ConstraintCoverageRow[],
  staticResponseNotePromptCards: Stage120StaticResponseNotePromptCard[],
  sourceAnswerReviewPath: Stage119View,
): Stage120Summary["counts"] {
  const sourceCounts = sourceAnswerReviewPath.summary.counts;

  return {
    ...sourceCounts,
    constraintCoverageRowCount: constraintCoverageRows.length,
    staticResponseNotePromptCardCount: staticResponseNotePromptCards.length,
    constraintCoverageLabelCount: unique(
      constraintCoverageRows.flatMap((row) => row.constraintCoverageLabels),
    ).length,
    staticResponseNotePromptLabelCount: unique(
      staticResponseNotePromptCards.flatMap(
        (card) => card.staticResponseNotePromptLabels,
      ),
    ).length,
    localOnlyConstraintCoverageRowCount: constraintCoverageRows.filter(
      (row) => row.localOnly,
    ).length,
    localOnlyStaticResponseNotePromptCardCount:
      staticResponseNotePromptCards.filter((card) => card.localOnly).length,
  };
}

function buildConstraintCoverageLabels(
  answerReviewPathStep: Stage119AnswerReviewPathStep,
  matchedStaticConstraintNoteCards: Stage119StaticConstraintNoteCard[],
): string[] {
  const labels = [
    "constraint-coverage row",
    "manual-answer constraint support map",
  ];

  if (matchedStaticConstraintNoteCards.length) {
    labels.push("static constraint-note source alignment");
  }

  if (answerReviewPathStep.answerReviewPathLabels.length) {
    labels.push("answer-review path carry-forward");
  }

  if (
    answerReviewPathStep.sourceLocalAnchorHrefs.length ||
    answerReviewPathStep.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback constraint coverage");
  }

  if (
    answerReviewPathStep.gapDiscussionPointIds.length ||
    answerReviewPathStep.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder constraint coverage");
  }

  return labels;
}

function buildStaticResponseNotePromptLabels(
  staticConstraintNoteCard: Stage119StaticConstraintNoteCard,
  matchedAnswerReviewPathSteps: Stage119AnswerReviewPathStep[],
): string[] {
  const labels = [
    "static response-note prompt",
    "manual answer constraint carry-forward",
  ];

  if (matchedAnswerReviewPathSteps.length) {
    labels.push("answer-review path source alignment");
  }

  if (staticConstraintNoteCard.staticConstraintNoteLabels.length) {
    labels.push("constraint-note carry-forward");
  }

  if (
    staticConstraintNoteCard.sourceLocalAnchorHrefs.length ||
    staticConstraintNoteCard.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback response-note context");
  }

  if (
    staticConstraintNoteCard.gapDiscussionPointIds.length ||
    staticConstraintNoteCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder response-note context");
  }

  return labels;
}

function staticConstraintNoteCardMatchesAnswerReviewPathStep(
  staticConstraintNoteCard: Stage119StaticConstraintNoteCard,
  answerReviewPathStep: Stage119AnswerReviewPathStep,
): boolean {
  return (
    answerReviewPathStep.sourceResponsePromptReadinessRowIds.includes(
      staticConstraintNoteCard.sourceResponsePromptReadinessRowId,
    ) ||
    staticConstraintNoteCard.sourceStaticAnswerCheckCardIds.includes(
      answerReviewPathStep.sourceStaticAnswerCheckCardId,
    ) ||
    answerReviewPathStep.sourceStaticResponsePromptCardIds.includes(
      staticConstraintNoteCard.sourceStaticResponsePromptCardIds[0],
    )
  );
}

function staticNonGoalFlags(
  sourceFlags: Stage119StaticNonGoalFlags,
): Stage120StaticNonGoalFlags {
  return {
    ...sourceFlags,
    noSavedConstraintCoverageState: true,
    noSavedConstraintCoverageMap: true,
    noSavedConstraintCoverageRows: true,
    noSavedResponseNoteState: true,
    noSavedResponseNotes: true,
    noSavedResponseNotePromptCards: true,
  };
}

function joinOrNone(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}
