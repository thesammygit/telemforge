import type {
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardView as Stage119StaticConstraintNoteCard,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticNonGoalFlagsView as Stage119StaticNonGoalFlags,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathStepView as Stage119AnswerReviewPathStep,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathSummaryView as Stage119Summary,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathView as Stage119View,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoardRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardRowView as Stage118ReadinessRow,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoardRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardView as Stage118StaticAnswerCheckCard,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoardRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardStaticNonGoalFlagsView as Stage118StaticNonGoalFlags,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoardRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardView as Stage118View,
} from "../features/mission-console/types.ts";

const stage119IdPrefix =
  "constraint-response-revision-coverage-review-path-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path";

export function buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPath(
  sourceResponsePromptReadinessBoard: Stage118View | undefined,
): Stage119View | undefined {
  if (
    !sourceResponsePromptReadinessBoard?.staticAnswerCheckCards.length ||
    !sourceResponsePromptReadinessBoard.responsePromptReadinessRows.length
  ) {
    return undefined;
  }

  const answerReviewPathSteps =
    sourceResponsePromptReadinessBoard.staticAnswerCheckCards.map((card) =>
      buildAnswerReviewPathStep(
        card,
        sourceResponsePromptReadinessBoard.responsePromptReadinessRows,
      ),
    );
  const staticConstraintNoteCards =
    sourceResponsePromptReadinessBoard.responsePromptReadinessRows.map((row) =>
      buildStaticConstraintNoteCard(
        row,
        sourceResponsePromptReadinessBoard.staticAnswerCheckCards,
      ),
    );
  const defaultAnswerReviewPathStep =
    answerReviewPathSteps.find(
      (step) =>
        step.sourceStaticAnswerCheckCardId ===
        sourceResponsePromptReadinessBoard.defaultStaticAnswerCheckCard
          .staticAnswerCheckCardId,
    ) ?? answerReviewPathSteps[0];
  const defaultStaticConstraintNoteCard =
    staticConstraintNoteCards.find(
      (card) =>
        card.sourceResponsePromptReadinessRowId ===
        sourceResponsePromptReadinessBoard.defaultResponsePromptReadinessRow
          .responsePromptReadinessRowId,
    ) ?? staticConstraintNoteCards[0];

  return {
    schema:
      "telemforge.constraint_response_revision_coverage_review_path_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response revision coverage review-path revision follow-up readiness review-path response-prompt readiness-board answer-review path and static constraint notes",
    localStatus: sourceResponsePromptReadinessBoard.localStatus,
    summary: {
      constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathId:
        `candidate-local-${stage119IdPrefix}`,
      label:
        "Local Stage 119 answer-review path and static constraint notes",
      summary:
        "A static answer-review path derives from Stage 118 static answer-check cards and static constraint-note cards derive from Stage 118 response-prompt readiness rows so reviewers can inspect manual answer constraints, Stage 117 response-prompt coverage, Stage 116 response-check lineage, local anchors, callbacks, gap prompts, and deferred reminders before drafting outside the app without saved answers, drafts, reviewer notes, response notes, answer-review state, constraint-note state, prompt-readiness state, answer-check state, routes, exports, signoff, owners, scoring, ranking, certification, meetings, packages, runnable checklists, task launchers, commands, or production handoff semantics.",
      defaultAnswerReviewContext: {
        defaultAnswerReviewPathStepId:
          defaultAnswerReviewPathStep.answerReviewPathStepId,
        defaultStaticConstraintNoteCardId:
          defaultStaticConstraintNoteCard.staticConstraintNoteCardId,
        defaultStaticAnswerCheckCardId:
          defaultAnswerReviewPathStep.sourceStaticAnswerCheckCardId,
        defaultResponsePromptReadinessRowId:
          defaultStaticConstraintNoteCard.sourceResponsePromptReadinessRowId,
        defaultStaticResponsePromptCardId:
          defaultAnswerReviewPathStep.sourceStaticResponsePromptCardId,
        defaultRevisionFollowUpReadinessReviewPathStepId:
          defaultStaticConstraintNoteCard
            .sourceRevisionFollowUpReadinessReviewPathStepId,
        defaultRevisionFollowUpReadinessRowId:
          defaultStaticConstraintNoteCard.sourceRevisionFollowUpReadinessRowId,
        defaultStaticResponseCheckCardId:
          defaultAnswerReviewPathStep.sourceStaticResponseCheckCardId,
        defaultRevisionCoverageReviewPathStepId:
          defaultStaticConstraintNoteCard
            .sourceRevisionCoverageReviewPathStepId,
        defaultStaticRevisionFollowUpPromptCardId:
          defaultAnswerReviewPathStep
            .sourceStaticRevisionFollowUpPromptCardId,
        defaultRevisionCoverageRowId:
          defaultStaticConstraintNoteCard.sourceRevisionCoverageRowId,
        defaultStaticRevisionCheckCardId:
          defaultAnswerReviewPathStep.sourceStaticRevisionCheckCardId,
        defaultResponseReadinessReviewPathStepId:
          defaultStaticConstraintNoteCard
            .sourceResponseReadinessReviewPathStepId,
        defaultStaticRevisionPromptCardId:
          defaultAnswerReviewPathStep.sourceStaticRevisionPromptCardId,
        defaultResponseReadinessRowId:
          defaultStaticConstraintNoteCard.sourceResponseReadinessRowId,
        defaultStaticDraftCheckCardId:
          defaultAnswerReviewPathStep.sourceStaticDraftCheckCardId,
        defaultCoverageReviewPathStepId:
          defaultStaticConstraintNoteCard.sourceCoverageReviewPathStepId,
        defaultStaticResponseCueCardId:
          defaultAnswerReviewPathStep.sourceStaticResponseCueCardId,
        defaultCoverageRowId:
          defaultStaticConstraintNoteCard.sourceCoverageRowId,
        defaultStaticReviewPromptCardId:
          defaultAnswerReviewPathStep.sourceStaticReviewPromptCardId,
        defaultFollowUpReviewPathStepId:
          defaultStaticConstraintNoteCard.sourceFollowUpReviewPathStepId,
        defaultStaticReadinessCueCardId:
          defaultAnswerReviewPathStep.sourceStaticReadinessCueCardId,
        defaultEvidenceGapReadinessRowId:
          defaultStaticConstraintNoteCard.sourceEvidenceGapReadinessRowId,
        defaultStaticFollowUpPromptCardId:
          defaultAnswerReviewPathStep.sourceStaticFollowUpPromptCardId,
        defaultEvidenceCheckReviewPathStepId:
          defaultStaticConstraintNoteCard.sourceEvidenceCheckReviewPathStepId,
        defaultStaticCitationGapCueCardId:
          defaultAnswerReviewPathStep.sourceStaticCitationGapCueCardId,
        defaultStaticEvidenceCheckPromptCardId:
          defaultStaticConstraintNoteCard
            .sourceStaticEvidenceCheckPromptCardId,
        defaultCitationReviewLaneRowId:
          defaultAnswerReviewPathStep.sourceCitationReviewLaneRowId,
        defaultStaticCitationCheckPromptCardId:
          defaultAnswerReviewPathStep.sourceStaticCitationCheckPromptCardId,
        defaultSourceFollowUpMapEntryId:
          defaultStaticConstraintNoteCard.sourceSourceFollowUpMapEntryId,
        sourceStage118ResponsePromptReadinessBoardSummary:
          sourceResponsePromptReadinessBoard.summary.summary,
        sourceStage118DefaultResponsePromptReadinessContext:
          sourceResponsePromptReadinessBoard.summary
            .defaultResponsePromptReadinessContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        answerReviewPathSteps,
        staticConstraintNoteCards,
        sourceResponsePromptReadinessBoard,
      ),
    },
    defaultAnswerReviewPathStep,
    defaultStaticConstraintNoteCard,
    answerReviewPathSteps,
    staticConstraintNoteCards,
    staticConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathBoundarySummary:
      "Stage 119 answer-review path steps and static constraint-note cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, answer-review state, constraint-note state, prompt-readiness state, answer-check state, review-path state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoardRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoard:
      sourceResponsePromptReadinessBoard,
  };
}

function buildAnswerReviewPathStep(
  staticAnswerCheckCard: Stage118StaticAnswerCheckCard,
  responsePromptReadinessRows: Stage118ReadinessRow[],
): Stage119AnswerReviewPathStep {
  const sourceStaticAnswerCheckCardId =
    staticAnswerCheckCard.staticAnswerCheckCardId;
  const matchedResponsePromptReadinessRows =
    responsePromptReadinessRows.filter((row) =>
      responsePromptReadinessRowMatchesStaticAnswerCheckCard(
        row,
        staticAnswerCheckCard,
      ),
    );
  const sourceResponsePromptReadinessRowIds =
    matchedResponsePromptReadinessRows.map(
      (row) => row.responsePromptReadinessRowId,
    );
  const answerReviewPathLabels = buildAnswerReviewPathLabels(
    staticAnswerCheckCard,
    matchedResponsePromptReadinessRows,
  );
  const answerReviewPathStepId =
    `${stage119IdPrefix}:step:${sourceStaticAnswerCheckCardId}`;

  return {
    ...staticAnswerCheckCard,
    answerReviewPathStepId,
    answerReviewPathStepIds: [answerReviewPathStepId],
    answerReviewPathStepOrder: staticAnswerCheckCard.staticAnswerCheckOrder,
    sourceStaticAnswerCheckCardId,
    sourceStaticAnswerCheckCardIds: [sourceStaticAnswerCheckCardId],
    sourceResponsePromptReadinessRowIds,
    answerReviewPathLabels,
    answerReviewPathText:
      `Stage 119 answer-review path step ${answerReviewPathStepId}: walk Stage 118 static answer-check card ${sourceStaticAnswerCheckCardId}, matched Stage 118 readiness rows ${joinOrNone(sourceResponsePromptReadinessRowIds)}, Stage 117 static response-prompt card ${staticAnswerCheckCard.sourceStaticResponsePromptCardId}, Stage 117 review-path steps ${joinOrNone(staticAnswerCheckCard.sourceRevisionFollowUpReadinessReviewPathStepIds)}, Stage 116 static response-check card ${staticAnswerCheckCard.sourceStaticResponseCheckCardId}, Stage 116 readiness rows ${joinOrNone(staticAnswerCheckCard.sourceRevisionFollowUpReadinessRowIds)}, Stage 115 revision coverage review-path steps ${joinOrNone(staticAnswerCheckCard.sourceRevisionCoverageReviewPathStepIds)}, Stage 115 through Stage 64 source lineage ids, anchors ${joinOrNone(staticAnswerCheckCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticAnswerCheckCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticAnswerCheckCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticAnswerCheckCard.deferredScopeReminderIds)}, answer-check labels ${joinOrNone(staticAnswerCheckCard.staticAnswerCheckLabels)}, answer-review labels ${joinOrNone(answerReviewPathLabels)}, static answer-check text "${displayCarriedText(staticAnswerCheckCard.staticAnswerCheckText)}", and response-prompt readiness text "${displayCarriedText(staticAnswerCheckCard.responsePromptReadinessText)}" as deterministic manual answer-review context only.`,
    staticConstraintNoteText:
      `Static constraint note for Stage 119 answer-review step ${sourceStaticAnswerCheckCardId}: compare matched Stage 118 readiness rows ${joinOrNone(sourceResponsePromptReadinessRowIds)} against Stage 118 answer-check card ${sourceStaticAnswerCheckCardId}, Stage 117 response-prompt card ${staticAnswerCheckCard.sourceStaticResponsePromptCardId}, Stage 116 response-check card ${staticAnswerCheckCard.sourceStaticResponseCheckCardId}, anchors ${joinOrNone(staticAnswerCheckCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticAnswerCheckCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticAnswerCheckCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticAnswerCheckCard.deferredScopeReminderIds)}, and manual-answer labels ${joinOrNone(staticAnswerCheckCard.staticAnswerCheckLabels)} without saving reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, answer-review state, constraint-note state, prompt-readiness state, answer-check state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static Stage 119 answer-review path context: manual answer constraints, Stage 118 answer-check cards, Stage 118 readiness rows, Stage 117 response-prompt coverage, Stage 116 response-check lineage, source anchors, callbacks, gap prompts, deferred reminders, and static constraint notes only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved answer-review state, saved constraint-note state, saved prompt-readiness state, saved answer-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticAnswerCheckCard.staticNonGoalFlags,
    ),
  };
}

function buildStaticConstraintNoteCard(
  responsePromptReadinessRow: Stage118ReadinessRow,
  staticAnswerCheckCards: Stage118StaticAnswerCheckCard[],
): Stage119StaticConstraintNoteCard {
  const sourceResponsePromptReadinessRowId =
    responsePromptReadinessRow.responsePromptReadinessRowId;
  const matchedStaticAnswerCheckCards = staticAnswerCheckCards.filter((card) =>
    responsePromptReadinessRowMatchesStaticAnswerCheckCard(
      responsePromptReadinessRow,
      card,
    ),
  );
  const sourceStaticAnswerCheckCardIds = matchedStaticAnswerCheckCards.map(
    (card) => card.staticAnswerCheckCardId,
  );
  const staticConstraintNoteLabels = buildStaticConstraintNoteLabels(
    responsePromptReadinessRow,
    matchedStaticAnswerCheckCards,
  );
  const staticConstraintNoteCardId =
    `${stage119IdPrefix}:static-constraint-note:${sourceResponsePromptReadinessRowId}`;

  return {
    ...responsePromptReadinessRow,
    staticConstraintNoteCardId,
    staticConstraintNoteCardIds: [staticConstraintNoteCardId],
    sourceResponsePromptReadinessRowId,
    sourceResponsePromptReadinessRowIds: [sourceResponsePromptReadinessRowId],
    sourceStaticAnswerCheckCardIds,
    staticConstraintNoteOrder:
      responsePromptReadinessRow.responsePromptReadinessRowOrder,
    staticConstraintNoteLabels,
    staticConstraintNoteText:
      `Stage 119 static constraint-note card ${staticConstraintNoteCardId}: verify Stage 118 readiness row ${sourceResponsePromptReadinessRowId}, matched Stage 118 answer-check cards ${joinOrNone(sourceStaticAnswerCheckCardIds)}, Stage 117 review-path step ${responsePromptReadinessRow.sourceRevisionFollowUpReadinessReviewPathStepId}, Stage 117 static response-prompt cards ${joinOrNone(responsePromptReadinessRow.sourceStaticResponsePromptCardIds)}, Stage 116 readiness row ${responsePromptReadinessRow.sourceRevisionFollowUpReadinessRowId}, Stage 116 static response-check cards ${joinOrNone(responsePromptReadinessRow.sourceStaticResponseCheckCardIds)}, Stage 115 revision coverage review-path step ${responsePromptReadinessRow.sourceRevisionCoverageReviewPathStepId}, Stage 115 through Stage 64 source lineage ids, anchors ${joinOrNone(responsePromptReadinessRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(responsePromptReadinessRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(responsePromptReadinessRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(responsePromptReadinessRow.deferredScopeReminderIds)}, readiness labels ${joinOrNone(responsePromptReadinessRow.responsePromptReadinessLabels)}, constraint-note labels ${joinOrNone(staticConstraintNoteLabels)}, and static readiness text "${displayCarriedText(responsePromptReadinessRow.responsePromptReadinessText)}" as manual answer-review constraint context only.`,
    answerReviewPathText:
      `Stage 119 answer-review prompt for constraint-note row ${sourceResponsePromptReadinessRowId}: compare Stage 118 answer-check cards ${joinOrNone(sourceStaticAnswerCheckCardIds)} with Stage 118 readiness row ${sourceResponsePromptReadinessRowId}, Stage 117 static response-prompt cards ${joinOrNone(responsePromptReadinessRow.sourceStaticResponsePromptCardIds)}, Stage 116 response-check cards ${joinOrNone(responsePromptReadinessRow.sourceStaticResponseCheckCardIds)}, anchors ${joinOrNone(responsePromptReadinessRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(responsePromptReadinessRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(responsePromptReadinessRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(responsePromptReadinessRow.deferredScopeReminderIds)}, and carried readiness labels ${joinOrNone(responsePromptReadinessRow.responsePromptReadinessLabels)} before drafting the next manual response outside the app without saving reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, answer-review state, constraint-note state, prompt-readiness state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static Stage 119 constraint-note context: manual answer constraints, Stage 118 response-prompt readiness rows, Stage 118 answer-check cards, Stage 117 response-prompt coverage, source anchors, callbacks, gap prompts, and deferred reminders only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved answer-review state, saved constraint-note state, saved prompt-readiness state, saved answer-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      responsePromptReadinessRow.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  answerReviewPathSteps: Stage119AnswerReviewPathStep[],
  staticConstraintNoteCards: Stage119StaticConstraintNoteCard[],
  sourceResponsePromptReadinessBoard: Stage118View,
): Stage119Summary["counts"] {
  const sourceCounts = sourceResponsePromptReadinessBoard.summary.counts;

  return {
    ...sourceCounts,
    answerReviewPathStepCount: answerReviewPathSteps.length,
    staticConstraintNoteCardCount: staticConstraintNoteCards.length,
    answerReviewPathLabelCount: unique(
      answerReviewPathSteps.flatMap((step) => step.answerReviewPathLabels),
    ).length,
    staticConstraintNoteLabelCount: unique(
      staticConstraintNoteCards.flatMap(
        (card) => card.staticConstraintNoteLabels,
      ),
    ).length,
    localOnlyAnswerReviewPathStepCount: answerReviewPathSteps.filter(
      (step) => step.localOnly,
    ).length,
    localOnlyStaticConstraintNoteCardCount: staticConstraintNoteCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function buildAnswerReviewPathLabels(
  staticAnswerCheckCard: Stage118StaticAnswerCheckCard,
  matchedResponsePromptReadinessRows: Stage118ReadinessRow[],
): string[] {
  const labels = ["answer-review path step", "static constraint-note context"];

  if (matchedResponsePromptReadinessRows.length) {
    labels.push("response-prompt readiness source alignment");
  }

  if (staticAnswerCheckCard.staticAnswerCheckLabels.length) {
    labels.push("manual answer-check carry-forward");
  }

  if (
    staticAnswerCheckCard.sourceLocalAnchorHrefs.length ||
    staticAnswerCheckCard.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback answer-review context");
  }

  if (
    staticAnswerCheckCard.gapDiscussionPointIds.length ||
    staticAnswerCheckCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder answer-review context");
  }

  return labels;
}

function buildStaticConstraintNoteLabels(
  responsePromptReadinessRow: Stage118ReadinessRow,
  matchedStaticAnswerCheckCards: Stage118StaticAnswerCheckCard[],
): string[] {
  const labels = [
    "static constraint note",
    "manual answer constraint carry-forward",
  ];

  if (matchedStaticAnswerCheckCards.length) {
    labels.push("answer-check source alignment");
  }

  if (responsePromptReadinessRow.responsePromptReadinessLabels.length) {
    labels.push("response-prompt readiness carry-forward");
  }

  if (
    responsePromptReadinessRow.sourceLocalAnchorHrefs.length ||
    responsePromptReadinessRow.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback constraint note");
  }

  if (
    responsePromptReadinessRow.gapDiscussionPointIds.length ||
    responsePromptReadinessRow.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder constraint note");
  }

  return labels;
}

function responsePromptReadinessRowMatchesStaticAnswerCheckCard(
  responsePromptReadinessRow: Stage118ReadinessRow,
  staticAnswerCheckCard: Stage118StaticAnswerCheckCard,
): boolean {
  return (
    responsePromptReadinessRow.sourceStaticResponsePromptCardIds.includes(
      staticAnswerCheckCard.sourceStaticResponsePromptCardId,
    ) ||
    staticAnswerCheckCard.sourceRevisionFollowUpReadinessReviewPathStepIds.includes(
      responsePromptReadinessRow.sourceRevisionFollowUpReadinessReviewPathStepId,
    ) ||
    responsePromptReadinessRow.sourceStaticResponseCheckCardIds.includes(
      staticAnswerCheckCard.sourceStaticResponseCheckCardId,
    )
  );
}

function staticNonGoalFlags(
  sourceFlags: Stage118StaticNonGoalFlags,
): Stage119StaticNonGoalFlags {
  return {
    ...sourceFlags,
    noSavedAnswerReviewState: true,
    noSavedAnswerReviewPathSteps: true,
    noSavedAnswerReviewSelections: true,
    noSavedConstraintNoteState: true,
    noSavedConstraintNoteSelections: true,
    noSavedStaticConstraintNoteCards: true,
    noSavedReviewerAnswers: true,
    noSavedAnswerDrafts: true,
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function joinOrNone(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}

function displayCarriedText(value: string): string {
  return value.length > 280 ? `${value.slice(0, 277)}...` : value;
}
