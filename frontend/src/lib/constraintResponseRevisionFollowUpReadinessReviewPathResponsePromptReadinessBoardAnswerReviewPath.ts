import type {
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardView as Stage99StaticConstraintNoteCard,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticNonGoalFlagsView as Stage99StaticNonGoalFlags,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathStepView as Stage99AnswerReviewPathStep,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathSummaryView as Stage99Summary,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathView as Stage99View,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardRowView as Stage98ReadinessRow,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardView as Stage98StaticAnswerCheckCard,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardStaticNonGoalFlagsView as Stage98StaticNonGoalFlags,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardView as Stage98View,
} from "../features/mission-console/types.ts";

export function buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPath(
  sourceResponsePromptReadinessBoard: Stage98View | undefined,
): Stage99View | undefined {
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
      "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response revision follow-up readiness review-path response-prompt readiness-board answer-review path and static constraint notes",
    localStatus: sourceResponsePromptReadinessBoard.localStatus,
    summary: {
      constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathId:
        "candidate-local-constraint-response-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path",
      label:
        "Local constraint-response answer-review path and static constraint notes",
      summary:
        "A static answer-review path derives from Stage 98 static answer-check cards and response-prompt readiness rows so reviewers can rehearse manual-answer constraints, source anchors, response-prompt coverage, gap prompts, deferred reminders, and static constraint notes before drafting the next response outside the app without saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved answer-review state, saved constraint-note state, saved prompt-readiness state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
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
        defaultCoverageRowId: defaultStaticConstraintNoteCard.sourceCoverageRowId,
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
        sourceStage98ResponsePromptReadinessBoardSummary:
          sourceResponsePromptReadinessBoard.summary.summary,
        sourceStage98DefaultResponsePromptReadinessContext:
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
    staticConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathBoundarySummary:
      "Stage 99 answer-review path steps and static constraint-note cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, answer-review state, constraint-note state, prompt-readiness state, answer-check state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoard:
      sourceResponsePromptReadinessBoard,
  };
}

function buildAnswerReviewPathStep(
  staticAnswerCheckCard: Stage98StaticAnswerCheckCard,
  responsePromptReadinessRows: Stage98ReadinessRow[],
): Stage99AnswerReviewPathStep {
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
    `constraint-response-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path:step:${sourceStaticAnswerCheckCardId}`;

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
      `Answer-review path step ${answerReviewPathStepId}: walk Stage 98 static answer-check card ${sourceStaticAnswerCheckCardId}, matched Stage 98 readiness rows ${joinOrNone(sourceResponsePromptReadinessRowIds)}, Stage 97 static response-prompt card ${staticAnswerCheckCard.sourceStaticResponsePromptCardId}, Stage 97 review-path steps ${joinOrNone(staticAnswerCheckCard.sourceRevisionFollowUpReadinessReviewPathStepIds)}, Stage 96 static response-check card ${staticAnswerCheckCard.sourceStaticResponseCheckCardId}, Stage 96 readiness rows ${joinOrNone(staticAnswerCheckCard.sourceRevisionFollowUpReadinessRowIds)}, Stage 95 static revision follow-up prompt card ${staticAnswerCheckCard.sourceStaticRevisionFollowUpPromptCardId}, Stage 95 revision coverage review-path steps ${joinOrNone(staticAnswerCheckCard.sourceRevisionCoverageReviewPathStepIds)}, Stage 94 static revision-check card ${staticAnswerCheckCard.sourceStaticRevisionCheckCardId}, Stage 93 static revision-prompt card ${staticAnswerCheckCard.sourceStaticRevisionPromptCardId}, Stage 92 static draft-check card ${staticAnswerCheckCard.sourceStaticDraftCheckCardId}, Stage 91 static response cue card ${staticAnswerCheckCard.sourceStaticResponseCueCardId}, Stage 90 static review prompt card ${staticAnswerCheckCard.sourceStaticReviewPromptCardId}, Stage 89 static readiness cue ${staticAnswerCheckCard.sourceStaticReadinessCueCardId}, Stage 88 static follow-up prompt ${staticAnswerCheckCard.sourceStaticFollowUpPromptCardId}, Stage 87 citation-gap cue ${staticAnswerCheckCard.sourceStaticCitationGapCueCardId}, Stage 86 citation-review lane row ${staticAnswerCheckCard.sourceCitationReviewLaneRowId}, Stage 85 citation prompt card ${staticAnswerCheckCard.sourceStaticCitationCheckPromptCardId}, anchors ${joinOrNone(staticAnswerCheckCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticAnswerCheckCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticAnswerCheckCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticAnswerCheckCard.deferredScopeReminderIds)}, answer-check labels ${joinOrNone(staticAnswerCheckCard.staticAnswerCheckLabels)}, answer-review labels ${joinOrNone(answerReviewPathLabels)}, static answer-check text "${staticAnswerCheckCard.staticAnswerCheckText}", and response-prompt readiness text "${staticAnswerCheckCard.responsePromptReadinessText}" as deterministic manual-answer constraint context only.`,
    staticConstraintNoteText:
      `Static constraint note for answer-review step ${sourceStaticAnswerCheckCardId}: compare matched Stage 98 readiness rows ${joinOrNone(sourceResponsePromptReadinessRowIds)} against Stage 98 static answer-check card ${sourceStaticAnswerCheckCardId}, Stage 97 response-prompt card ${staticAnswerCheckCard.sourceStaticResponsePromptCardId}, Stage 96 response-check card ${staticAnswerCheckCard.sourceStaticResponseCheckCardId}, anchors ${joinOrNone(staticAnswerCheckCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticAnswerCheckCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticAnswerCheckCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticAnswerCheckCard.deferredScopeReminderIds)}, and manual-answer labels ${joinOrNone(staticAnswerCheckCard.staticAnswerCheckLabels)} without saving reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, answer-review state, constraint-note state, prompt-readiness state, answer-check state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static answer-review path context: manual answer constraints, source anchors, response-prompt coverage, gap prompts, deferred reminders, and static constraint notes only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved answer-review state, saved constraint-note state, saved prompt-readiness state, saved answer-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticAnswerCheckCard.staticNonGoalFlags,
    ),
  };
}

function buildStaticConstraintNoteCard(
  responsePromptReadinessRow: Stage98ReadinessRow,
  staticAnswerCheckCards: Stage98StaticAnswerCheckCard[],
): Stage99StaticConstraintNoteCard {
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
    `constraint-response-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path:static-constraint-note:${sourceResponsePromptReadinessRowId}`;

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
      `Static constraint-note card ${staticConstraintNoteCardId}: verify Stage 98 readiness row ${sourceResponsePromptReadinessRowId}, matched Stage 98 answer-check cards ${joinOrNone(sourceStaticAnswerCheckCardIds)}, Stage 97 review-path step ${responsePromptReadinessRow.sourceRevisionFollowUpReadinessReviewPathStepId}, Stage 97 static response-prompt cards ${joinOrNone(responsePromptReadinessRow.sourceStaticResponsePromptCardIds)}, Stage 96 readiness row ${responsePromptReadinessRow.sourceRevisionFollowUpReadinessRowId}, Stage 96 static response-check cards ${joinOrNone(responsePromptReadinessRow.sourceStaticResponseCheckCardIds)}, Stage 95 revision coverage review-path step ${responsePromptReadinessRow.sourceRevisionCoverageReviewPathStepId}, Stage 95 static revision follow-up prompt cards ${joinOrNone(responsePromptReadinessRow.sourceStaticRevisionFollowUpPromptCardIds)}, Stage 94 revision coverage row ${responsePromptReadinessRow.sourceRevisionCoverageRowId}, Stage 94 static revision-check cards ${joinOrNone(responsePromptReadinessRow.sourceStaticRevisionCheckCardIds)}, Stage 93 response-readiness review-path step ${responsePromptReadinessRow.sourceResponseReadinessReviewPathStepId}, Stage 93 static revision-prompt cards ${joinOrNone(responsePromptReadinessRow.sourceStaticRevisionPromptCardIds)}, Stage 92 response-readiness row ${responsePromptReadinessRow.sourceResponseReadinessRowId}, Stage 92 static draft-check cards ${joinOrNone(responsePromptReadinessRow.sourceStaticDraftCheckCardIds)}, Stage 91 coverage-review path step ${responsePromptReadinessRow.sourceCoverageReviewPathStepId}, Stage 91 static response cue cards ${joinOrNone(responsePromptReadinessRow.sourceStaticResponseCueCardIds)}, Stage 90 coverage row ${responsePromptReadinessRow.sourceCoverageRowId}, Stage 90 static review prompt cards ${joinOrNone(responsePromptReadinessRow.sourceStaticReviewPromptCardIds)}, Stage 89 follow-up review path step ${responsePromptReadinessRow.sourceFollowUpReviewPathStepId}, Stage 89 static readiness cue cards ${joinOrNone(responsePromptReadinessRow.sourceStaticReadinessCueCardIds)}, Stage 88 readiness row ${responsePromptReadinessRow.sourceEvidenceGapReadinessRowId}, Stage 88 static follow-up prompt cards ${joinOrNone(responsePromptReadinessRow.sourceStaticFollowUpPromptCardIds)}, Stage 87 evidence-check review path step ${responsePromptReadinessRow.sourceEvidenceCheckReviewPathStepId}, Stage 87 citation-gap cues ${joinOrNone(responsePromptReadinessRow.sourceStaticCitationGapCueCardIds)}, Stage 86 evidence-check prompt card ${responsePromptReadinessRow.sourceStaticEvidenceCheckPromptCardId}, Stage 86 citation-review lane rows ${joinOrNone(responsePromptReadinessRow.sourceCitationReviewLaneRowIds)}, Stage 85 source follow-up map entry ${responsePromptReadinessRow.sourceSourceFollowUpMapEntryId}, anchors ${joinOrNone(responsePromptReadinessRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(responsePromptReadinessRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(responsePromptReadinessRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(responsePromptReadinessRow.deferredScopeReminderIds)}, readiness labels ${joinOrNone(responsePromptReadinessRow.responsePromptReadinessLabels)}, constraint-note labels ${joinOrNone(staticConstraintNoteLabels)}, and static readiness text "${responsePromptReadinessRow.responsePromptReadinessText}" as manual-answer constraint context only.`,
    answerReviewPathText:
      `Answer-review prompt for constraint-note row ${sourceResponsePromptReadinessRowId}: compare Stage 98 answer-check cards ${joinOrNone(sourceStaticAnswerCheckCardIds)} with Stage 98 readiness row ${sourceResponsePromptReadinessRowId}, Stage 97 static response-prompt cards ${joinOrNone(responsePromptReadinessRow.sourceStaticResponsePromptCardIds)}, anchors ${joinOrNone(responsePromptReadinessRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(responsePromptReadinessRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(responsePromptReadinessRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(responsePromptReadinessRow.deferredScopeReminderIds)}, and carried readiness labels ${joinOrNone(responsePromptReadinessRow.responsePromptReadinessLabels)} before drafting the next manual response outside the app without saving reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, answer-review state, constraint-note state, prompt-readiness state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static constraint-note context: manual answer constraints, response-prompt coverage, source anchors, callbacks, gap prompts, and deferred reminders only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved answer-review state, saved constraint-note state, saved prompt-readiness state, saved answer-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      responsePromptReadinessRow.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  answerReviewPathSteps: Stage99AnswerReviewPathStep[],
  staticConstraintNoteCards: Stage99StaticConstraintNoteCard[],
  sourceResponsePromptReadinessBoard: Stage98View,
): Stage99Summary["counts"] {
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
  staticAnswerCheckCard: Stage98StaticAnswerCheckCard,
  matchedResponsePromptReadinessRows: Stage98ReadinessRow[],
): string[] {
  const labels = ["answer-review path step", "static constraint-note context"];

  if (matchedResponsePromptReadinessRows.length) {
    labels.push("response-prompt readiness source alignment");
  }

  if (staticAnswerCheckCard.staticAnswerCheckLabels.length) {
    labels.push("manual answer constraint carry-forward");
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
  responsePromptReadinessRow: Stage98ReadinessRow,
  matchedStaticAnswerCheckCards: Stage98StaticAnswerCheckCard[],
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
  responsePromptReadinessRow: Stage98ReadinessRow,
  staticAnswerCheckCard: Stage98StaticAnswerCheckCard,
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
  sourceFlags: Stage98StaticNonGoalFlags,
): Stage99StaticNonGoalFlags {
  return {
    ...sourceFlags,
    noSavedAnswerReviewState: true,
    noSavedAnswerReviewPath: true,
    noSavedAnswerReviewPathSteps: true,
    noSavedConstraintNoteState: true,
    noSavedConstraintNotes: true,
    noSavedConstraintNoteCards: true,
    noSavedReviewerAnswers: true,
  };
}

function joinOrNone(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}
