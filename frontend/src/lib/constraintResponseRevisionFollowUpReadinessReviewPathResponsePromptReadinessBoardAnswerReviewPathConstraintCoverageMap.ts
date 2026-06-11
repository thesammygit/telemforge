import type {
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapRowView as Stage100ConstraintCoverageRow,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticNonGoalFlagsView as Stage100StaticNonGoalFlags,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardView as Stage100StaticResponseNotePromptCard,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapSummaryView as Stage100Summary,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapView as Stage100View,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardView as Stage99StaticConstraintNoteCard,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticNonGoalFlagsView as Stage99StaticNonGoalFlags,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathStepView as Stage99AnswerReviewPathStep,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathView as Stage99View,
} from "../features/mission-console/types.ts";

export function buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap(
  sourceAnswerReviewPath: Stage99View | undefined,
): Stage100View | undefined {
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
      "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map and static response notes",
    localStatus: sourceAnswerReviewPath.localStatus,
    summary: {
      constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapId:
        "candidate-local-constraint-response-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map",
      label:
        "Local constraint-response answer-review constraint-coverage map",
      summary:
        "A static constraint-coverage map derives from Stage 99 answer-review path steps and static constraint-note cards so reviewers can verify manual-answer constraints and response-note prompts before drafting the next response outside the app without saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved constraint-coverage state, saved response-note state, saved answer-review state, saved constraint-note state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
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
        sourceStage99AnswerReviewPathSummary:
          sourceAnswerReviewPath.summary.summary,
        sourceStage99DefaultAnswerReviewContext:
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
    staticConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapSummary:
      "Stage 100 constraint-coverage rows and static response-note prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, constraint-coverage state, response-note state, answer-review state, constraint-note state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPath:
      sourceAnswerReviewPath,
  };
}

function buildConstraintCoverageRow(
  answerReviewPathStep: Stage99AnswerReviewPathStep,
  staticConstraintNoteCards: Stage99StaticConstraintNoteCard[],
): Stage100ConstraintCoverageRow {
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
    `constraint-response-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map:row:${sourceAnswerReviewPathStepId}`;

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
      `Constraint-coverage row ${constraintCoverageRowId}: verify Stage 99 answer-review path step ${sourceAnswerReviewPathStepId}, Stage 99 static constraint-note cards ${joinOrNone(sourceStaticConstraintNoteCardIds)}, Stage 98 static answer-check card ${answerReviewPathStep.sourceStaticAnswerCheckCardId}, Stage 98 readiness rows ${joinOrNone(answerReviewPathStep.sourceResponsePromptReadinessRowIds)}, Stage 97 static response-prompt card ${answerReviewPathStep.sourceStaticResponsePromptCardId}, Stage 97 review-path steps ${joinOrNone(answerReviewPathStep.sourceRevisionFollowUpReadinessReviewPathStepIds)}, Stage 96 readiness rows ${joinOrNone(answerReviewPathStep.sourceRevisionFollowUpReadinessRowIds)}, Stage 96 static response-check card ${answerReviewPathStep.sourceStaticResponseCheckCardId}, Stage 95 static revision follow-up prompt card ${answerReviewPathStep.sourceStaticRevisionFollowUpPromptCardId}, Stage 94 static revision-check card ${answerReviewPathStep.sourceStaticRevisionCheckCardId}, Stage 93 static revision-prompt card ${answerReviewPathStep.sourceStaticRevisionPromptCardId}, Stage 92 static draft-check card ${answerReviewPathStep.sourceStaticDraftCheckCardId}, Stage 91 static response cue card ${answerReviewPathStep.sourceStaticResponseCueCardId}, Stage 90 static review prompt card ${answerReviewPathStep.sourceStaticReviewPromptCardId}, Stage 89 static readiness cue ${answerReviewPathStep.sourceStaticReadinessCueCardId}, Stage 88 static follow-up prompt ${answerReviewPathStep.sourceStaticFollowUpPromptCardId}, Stage 87 citation-gap cue ${answerReviewPathStep.sourceStaticCitationGapCueCardId}, Stage 86 citation-review lane row ${answerReviewPathStep.sourceCitationReviewLaneRowId}, Stage 85 citation prompt card ${answerReviewPathStep.sourceStaticCitationCheckPromptCardId}, anchors ${joinOrNone(answerReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(answerReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(answerReviewPathStep.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(answerReviewPathStep.deferredScopeReminderIds)}, answer-review labels ${joinOrNone(answerReviewPathStep.answerReviewPathLabels)}, constraint-note labels ${joinOrNone(staticConstraintNoteLabels)}, static answer-check text "${answerReviewPathStep.staticAnswerCheckText}", response-prompt readiness text "${staticResponsePromptReadinessText}", answer-review text "${answerReviewPathStep.answerReviewPathText}", and static constraint-note text "${answerReviewPathStep.staticConstraintNoteText}" as deterministic manual-answer constraint support only.`,
    staticResponseNotePromptText:
      `Static response-note prompt for constraint-coverage row ${sourceAnswerReviewPathStepId}: compare answer-review path step ${sourceAnswerReviewPathStepId}, Stage 99 constraint notes ${joinOrNone(sourceStaticConstraintNoteCardIds)}, Stage 98 static answer-check card ${answerReviewPathStep.sourceStaticAnswerCheckCardId}, response-prompt readiness text "${staticResponsePromptReadinessText}", anchors ${joinOrNone(answerReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(answerReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(answerReviewPathStep.gapDiscussionPointIds)}, and deferred reminders ${joinOrNone(answerReviewPathStep.deferredScopeReminderIds)} before drafting the next response note outside the app without saving reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, constraint-coverage state, response-note state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static constraint-coverage context: manual-answer constraint support, response-prompt readiness, source lineage, anchors, callbacks, gap prompts, and deferred reminders only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved constraint-coverage state, saved response-note state, saved answer-review state, saved constraint-note state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      answerReviewPathStep.staticNonGoalFlags,
    ),
  };
}

function buildStaticResponseNotePromptCard(
  staticConstraintNoteCard: Stage99StaticConstraintNoteCard,
  answerReviewPathSteps: Stage99AnswerReviewPathStep[],
): Stage100StaticResponseNotePromptCard {
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
    `constraint-response-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map:static-response-note-prompt:${sourceStaticConstraintNoteCardId}`;

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
      `Static response-note prompt ${staticResponseNotePromptCardId}: use Stage 99 static constraint-note card ${sourceStaticConstraintNoteCardId}, matched Stage 99 answer-review path steps ${joinOrNone(sourceAnswerReviewPathStepIds)}, Stage 98 readiness row ${staticConstraintNoteCard.sourceResponsePromptReadinessRowId}, Stage 98 answer-check cards ${joinOrNone(staticConstraintNoteCard.sourceStaticAnswerCheckCardIds)}, Stage 97 static response-prompt cards ${joinOrNone(staticConstraintNoteCard.sourceStaticResponsePromptCardIds)}, anchors ${joinOrNone(staticConstraintNoteCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticConstraintNoteCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticConstraintNoteCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticConstraintNoteCard.deferredScopeReminderIds)}, response-prompt readiness labels ${joinOrNone(staticConstraintNoteCard.responsePromptReadinessLabels)}, and constraint-note labels ${joinOrNone(staticConstraintNoteCard.staticConstraintNoteLabels)} as static manual response-note context only.`,
    staticNonGoalContext:
      "Static response-note prompt context: manual response drafting outside the app only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved constraint-coverage state, saved response-note state, saved answer-review state, saved constraint-note state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticConstraintNoteCard.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  constraintCoverageRows: Stage100ConstraintCoverageRow[],
  staticResponseNotePromptCards: Stage100StaticResponseNotePromptCard[],
  sourceAnswerReviewPath: Stage99View,
): Stage100Summary["counts"] {
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
  answerReviewPathStep: Stage99AnswerReviewPathStep,
  matchedStaticConstraintNoteCards: Stage99StaticConstraintNoteCard[],
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
  staticConstraintNoteCard: Stage99StaticConstraintNoteCard,
  matchedAnswerReviewPathSteps: Stage99AnswerReviewPathStep[],
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
  staticConstraintNoteCard: Stage99StaticConstraintNoteCard,
  answerReviewPathStep: Stage99AnswerReviewPathStep,
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
  sourceFlags: Stage99StaticNonGoalFlags,
): Stage100StaticNonGoalFlags {
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
