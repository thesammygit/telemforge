import type {
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardRowView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardStaticNonGoalFlagsView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardSummaryView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathStaticNonGoalFlagsView as Stage97StaticNonGoalFlags,
  ConstraintResponseRevisionFollowUpReadinessReviewPathStaticResponsePromptCardView as Stage97StaticResponsePromptCard,
  ConstraintResponseRevisionFollowUpReadinessReviewPathStepView as Stage97Step,
  ConstraintResponseRevisionFollowUpReadinessReviewPathView as Stage97View,
} from "../features/mission-console/types.ts";

export function buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoard(
  revisionFollowUpReadinessReviewPath: Stage97View | undefined,
): ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardView | undefined {
  if (
    !revisionFollowUpReadinessReviewPath?.revisionFollowUpReadinessReviewPathSteps
      .length ||
    !revisionFollowUpReadinessReviewPath.staticResponsePromptCards.length
  ) {
    return undefined;
  }

  const responsePromptReadinessRows =
    revisionFollowUpReadinessReviewPath.revisionFollowUpReadinessReviewPathSteps.map(
      (step) =>
        buildResponsePromptReadinessRow(
          step,
          revisionFollowUpReadinessReviewPath.staticResponsePromptCards,
        ),
    );
  const staticAnswerCheckCards =
    revisionFollowUpReadinessReviewPath.staticResponsePromptCards.map((card) =>
      buildStaticAnswerCheckCard(
        card,
        revisionFollowUpReadinessReviewPath.revisionFollowUpReadinessReviewPathSteps,
      ),
    );
  const defaultResponsePromptReadinessRow =
    responsePromptReadinessRows.find(
      (row) =>
        row.sourceRevisionFollowUpReadinessReviewPathStepId ===
        revisionFollowUpReadinessReviewPath
          .defaultRevisionFollowUpReadinessReviewPathStep
          .revisionFollowUpReadinessReviewPathStepId,
    ) ?? responsePromptReadinessRows[0];
  const defaultStaticAnswerCheckCard =
    staticAnswerCheckCards.find(
      (card) =>
        card.sourceStaticResponsePromptCardId ===
        revisionFollowUpReadinessReviewPath.defaultStaticResponsePromptCard
          .staticResponsePromptCardId,
    ) ?? staticAnswerCheckCards[0];
  const defaultStage97Context =
    revisionFollowUpReadinessReviewPath.summary
      .defaultRevisionFollowUpReadinessReviewPathContext;

  return {
    schema:
      "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response revision follow-up readiness review path response-prompt readiness board and static answer checks",
    localStatus: revisionFollowUpReadinessReviewPath.localStatus,
    summary: {
      constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardId:
        "candidate-local-constraint-response-revision-follow-up-readiness-review-path-response-prompt-readiness-board",
      label:
        "Local constraint-response response-prompt readiness board and static answer checks",
      summary:
        "A static response-prompt readiness board derives rows from Stage 97 revision follow-up readiness review-path steps and static answer-check cards from Stage 97 static response-prompt cards so reviewers can inspect which manual response prompts are ready for answer drafting outside the app without saved answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, prompt readiness selections, answer-check selections, response-prompt selections, review-path state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultResponsePromptReadinessContext: {
        defaultResponsePromptReadinessRowId:
          defaultResponsePromptReadinessRow.responsePromptReadinessRowId,
        defaultStaticAnswerCheckCardId:
          defaultStaticAnswerCheckCard.staticAnswerCheckCardId,
        defaultRevisionFollowUpReadinessReviewPathStepId:
          defaultResponsePromptReadinessRow
            .sourceRevisionFollowUpReadinessReviewPathStepId,
        defaultStaticResponsePromptCardId:
          defaultStaticAnswerCheckCard.sourceStaticResponsePromptCardId,
        defaultRevisionFollowUpReadinessRowId:
          defaultResponsePromptReadinessRow.sourceRevisionFollowUpReadinessRowId,
        defaultStaticResponseCheckCardId:
          defaultStaticAnswerCheckCard.sourceStaticResponseCheckCardId,
        defaultRevisionCoverageReviewPathStepId:
          defaultResponsePromptReadinessRow.sourceRevisionCoverageReviewPathStepId,
        defaultStaticRevisionFollowUpPromptCardId:
          defaultStaticAnswerCheckCard
            .sourceStaticRevisionFollowUpPromptCardId,
        defaultRevisionCoverageRowId:
          defaultResponsePromptReadinessRow.sourceRevisionCoverageRowId,
        defaultStaticRevisionCheckCardId:
          defaultStaticAnswerCheckCard.sourceStaticRevisionCheckCardId,
        defaultResponseReadinessReviewPathStepId:
          defaultResponsePromptReadinessRow
            .sourceResponseReadinessReviewPathStepId,
        defaultStaticRevisionPromptCardId:
          defaultStaticAnswerCheckCard.sourceStaticRevisionPromptCardId,
        defaultResponseReadinessRowId:
          defaultResponsePromptReadinessRow.sourceResponseReadinessRowId,
        defaultStaticDraftCheckCardId:
          defaultStaticAnswerCheckCard.sourceStaticDraftCheckCardId,
        defaultCoverageReviewPathStepId:
          defaultResponsePromptReadinessRow.sourceCoverageReviewPathStepId,
        defaultStaticResponseCueCardId:
          defaultStaticAnswerCheckCard.sourceStaticResponseCueCardId,
        defaultCoverageRowId:
          defaultResponsePromptReadinessRow.sourceCoverageRowId,
        defaultStaticReviewPromptCardId:
          defaultStaticAnswerCheckCard.sourceStaticReviewPromptCardId,
        defaultFollowUpReviewPathStepId:
          defaultResponsePromptReadinessRow.sourceFollowUpReviewPathStepId,
        defaultStaticReadinessCueCardId:
          defaultStaticAnswerCheckCard.sourceStaticReadinessCueCardId,
        defaultEvidenceGapReadinessRowId:
          defaultResponsePromptReadinessRow.sourceEvidenceGapReadinessRowId,
        defaultStaticFollowUpPromptCardId:
          defaultStaticAnswerCheckCard.sourceStaticFollowUpPromptCardId,
        defaultEvidenceCheckReviewPathStepId:
          defaultResponsePromptReadinessRow.sourceEvidenceCheckReviewPathStepId,
        defaultStaticCitationGapCueCardId:
          defaultStaticAnswerCheckCard.sourceStaticCitationGapCueCardId,
        defaultStaticEvidenceCheckPromptCardId:
          defaultResponsePromptReadinessRow
            .sourceStaticEvidenceCheckPromptCardId,
        defaultCitationReviewLaneRowId:
          defaultStaticAnswerCheckCard.sourceCitationReviewLaneRowId,
        defaultStaticCitationCheckPromptCardId:
          defaultStaticAnswerCheckCard.sourceStaticCitationCheckPromptCardId,
        defaultSourceFollowUpMapEntryId:
          defaultResponsePromptReadinessRow.sourceSourceFollowUpMapEntryId,
        sourceStage97RevisionFollowUpReadinessReviewPathSummary:
          revisionFollowUpReadinessReviewPath.summary.summary,
        sourceStage97DefaultRevisionFollowUpReadinessReviewPathContext:
          defaultStage97Context,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        responsePromptReadinessRows,
        staticAnswerCheckCards,
        revisionFollowUpReadinessReviewPath,
      ),
    },
    defaultResponsePromptReadinessRow,
    defaultStaticAnswerCheckCard,
    responsePromptReadinessRows,
    staticAnswerCheckCards,
    staticResponsePromptReadinessBoundarySummary:
      "Stage 98 response-prompt readiness rows and static answer-check cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, prompt readiness selections, answer-check selections, response-prompt selections, review-path state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseRevisionFollowUpReadinessReviewPath:
      revisionFollowUpReadinessReviewPath,
  };
}

function buildResponsePromptReadinessRow(
  revisionFollowUpReadinessReviewPathStep: Stage97Step,
  staticResponsePromptCards: Stage97StaticResponsePromptCard[],
): ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardRowView {
  const sourceRevisionFollowUpReadinessReviewPathStepId =
    revisionFollowUpReadinessReviewPathStep.revisionFollowUpReadinessReviewPathStepId;
  const matchedStaticResponsePromptCards = staticResponsePromptCards.filter(
    (card) =>
      rowMatchesStaticAnswerCheckCard(revisionFollowUpReadinessReviewPathStep, card),
  );
  const sourceStaticResponsePromptCardIds = matchedStaticResponsePromptCards.map(
    (card) => card.staticResponsePromptCardId,
  );
  const responsePromptReadinessLabels =
    buildRowResponsePromptReadinessLabels(
      revisionFollowUpReadinessReviewPathStep,
      matchedStaticResponsePromptCards,
    );
  const staticAnswerCheckLabels = buildRowStaticAnswerCheckLabels(
    revisionFollowUpReadinessReviewPathStep,
    matchedStaticResponsePromptCards,
  );
  const responsePromptReadinessRowId =
    `constraint-response-revision-follow-up-readiness-review-path-response-prompt-readiness-board:row:${sourceRevisionFollowUpReadinessReviewPathStepId}`;

  return {
    ...revisionFollowUpReadinessReviewPathStep,
    responsePromptReadinessRowId,
    responsePromptReadinessRowIds: [responsePromptReadinessRowId],
    responsePromptReadinessRowOrder:
      revisionFollowUpReadinessReviewPathStep
        .revisionFollowUpReadinessReviewPathStepOrder,
    sourceRevisionFollowUpReadinessReviewPathStepId,
    sourceRevisionFollowUpReadinessReviewPathStepIds: [
      sourceRevisionFollowUpReadinessReviewPathStepId,
    ],
    sourceStaticResponsePromptCardIds,
    responsePromptReadinessLabels,
    staticAnswerCheckLabels,
    responsePromptReadinessText:
      `Response-prompt readiness row ${sourceRevisionFollowUpReadinessReviewPathStepId}: carry Stage 97 revision follow-up readiness review-path step ${sourceRevisionFollowUpReadinessReviewPathStepId}, Stage 97 static response-prompt cards ${joinOrNone(sourceStaticResponsePromptCardIds)}, Stage 96 readiness row ${revisionFollowUpReadinessReviewPathStep.sourceRevisionFollowUpReadinessRowId}, Stage 96 static response-check cards ${joinOrNone(revisionFollowUpReadinessReviewPathStep.sourceStaticResponseCheckCardIds)}, Stage 95 revision coverage review-path step ${revisionFollowUpReadinessReviewPathStep.sourceRevisionCoverageReviewPathStepId}, Stage 95 static revision follow-up prompt cards ${joinOrNone(revisionFollowUpReadinessReviewPathStep.sourceStaticRevisionFollowUpPromptCardIds)}, Stage 94 revision coverage row ${revisionFollowUpReadinessReviewPathStep.sourceRevisionCoverageRowId}, Stage 94 static revision-check cards ${joinOrNone(revisionFollowUpReadinessReviewPathStep.sourceStaticRevisionCheckCardIds)}, Stage 93 response-readiness review-path step ${revisionFollowUpReadinessReviewPathStep.sourceResponseReadinessReviewPathStepId}, Stage 93 static revision-prompt cards ${joinOrNone(revisionFollowUpReadinessReviewPathStep.sourceStaticRevisionPromptCardIds)}, Stage 92 response-readiness row ${revisionFollowUpReadinessReviewPathStep.sourceResponseReadinessRowId}, Stage 92 static draft-check cards ${joinOrNone(revisionFollowUpReadinessReviewPathStep.sourceStaticDraftCheckCardIds)}, Stage 91 coverage-review path step ${revisionFollowUpReadinessReviewPathStep.sourceCoverageReviewPathStepId}, Stage 91 static response cue cards ${joinOrNone(revisionFollowUpReadinessReviewPathStep.sourceStaticResponseCueCardIds)}, Stage 90 coverage row ${revisionFollowUpReadinessReviewPathStep.sourceCoverageRowId}, Stage 90 static review prompt cards ${joinOrNone(revisionFollowUpReadinessReviewPathStep.sourceStaticReviewPromptCardIds)}, Stage 89 follow-up review path step ${revisionFollowUpReadinessReviewPathStep.sourceFollowUpReviewPathStepId}, Stage 89 static readiness cue cards ${joinOrNone(revisionFollowUpReadinessReviewPathStep.sourceStaticReadinessCueCardIds)}, Stage 88 readiness row ${revisionFollowUpReadinessReviewPathStep.sourceEvidenceGapReadinessRowId}, Stage 88 static follow-up prompt cards ${joinOrNone(revisionFollowUpReadinessReviewPathStep.sourceStaticFollowUpPromptCardIds)}, Stage 87 evidence-check review path step ${revisionFollowUpReadinessReviewPathStep.sourceEvidenceCheckReviewPathStepId}, Stage 87 citation-gap cue cards ${joinOrNone(revisionFollowUpReadinessReviewPathStep.sourceStaticCitationGapCueCardIds)}, Stage 86 evidence-check prompt card ${revisionFollowUpReadinessReviewPathStep.sourceStaticEvidenceCheckPromptCardId}, Stage 86 citation-review lane rows ${joinOrNone(revisionFollowUpReadinessReviewPathStep.sourceCitationReviewLaneRowIds)}, Stage 85 source follow-up map entry ${revisionFollowUpReadinessReviewPathStep.sourceSourceFollowUpMapEntryId}, Stage 85 citation prompt cards ${joinOrNone(revisionFollowUpReadinessReviewPathStep.sourceStaticCitationCheckPromptCardIds)}, anchors ${joinOrNone(revisionFollowUpReadinessReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(revisionFollowUpReadinessReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(revisionFollowUpReadinessReviewPathStep.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(revisionFollowUpReadinessReviewPathStep.deferredScopeReminderIds)}, readiness labels ${joinOrNone(responsePromptReadinessLabels)}, answer-check labels ${joinOrNone(staticAnswerCheckLabels)}, Stage 97 review-path text "${revisionFollowUpReadinessReviewPathStep.revisionFollowUpReadinessReviewPathText}", and Stage 97 static response-prompt text "${revisionFollowUpReadinessReviewPathStep.staticResponsePromptText}" as deterministic manual response-prompt readiness context only.`,
    staticAnswerCheckText:
      `Static answer-check context for response-prompt readiness row ${sourceRevisionFollowUpReadinessReviewPathStepId}: inspect Stage 97 review-path step ${sourceRevisionFollowUpReadinessReviewPathStepId}, Stage 97 static response-prompt cards ${joinOrNone(sourceStaticResponsePromptCardIds)}, Stage 96 response-check cards ${joinOrNone(revisionFollowUpReadinessReviewPathStep.sourceStaticResponseCheckCardIds)}, Stage 95 static revision follow-up prompt cards ${joinOrNone(revisionFollowUpReadinessReviewPathStep.sourceStaticRevisionFollowUpPromptCardIds)}, anchors ${joinOrNone(revisionFollowUpReadinessReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(revisionFollowUpReadinessReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(revisionFollowUpReadinessReviewPathStep.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(revisionFollowUpReadinessReviewPathStep.deferredScopeReminderIds)}, and Stage 97 labels ${joinOrNone([...revisionFollowUpReadinessReviewPathStep.revisionFollowUpReadinessReviewPathLabels, ...revisionFollowUpReadinessReviewPathStep.staticResponsePromptLabels])} before answer drafting outside the app without saved reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, prompt readiness selections, answer-check selections, response-prompt selections, review-path state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static response-prompt readiness context: manual Stage 97 review-path, static response-prompt, source-lineage, anchor, callback, gap-prompt, deferred-reminder, and answer-check comparison only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved prompt readiness selections, saved answer-check selections, saved response-prompt selections, saved review-path state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      revisionFollowUpReadinessReviewPathStep.staticNonGoalFlags,
    ),
  };
}

function buildStaticAnswerCheckCard(
  staticResponsePromptCard: Stage97StaticResponsePromptCard,
  revisionFollowUpReadinessReviewPathSteps: Stage97Step[],
): ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardView {
  const sourceStaticResponsePromptCardId =
    staticResponsePromptCard.staticResponsePromptCardId;
  const matchedRevisionFollowUpReadinessReviewPathSteps =
    revisionFollowUpReadinessReviewPathSteps.filter((step) =>
      rowMatchesStaticAnswerCheckCard(step, staticResponsePromptCard),
    );
  const sourceRevisionFollowUpReadinessReviewPathStepIds =
    matchedRevisionFollowUpReadinessReviewPathSteps.map(
      (step) => step.revisionFollowUpReadinessReviewPathStepId,
    );
  const responsePromptReadinessLabels =
    buildCardResponsePromptReadinessLabels(
      staticResponsePromptCard,
      matchedRevisionFollowUpReadinessReviewPathSteps,
    );
  const staticAnswerCheckLabels = buildCardStaticAnswerCheckLabels(
    staticResponsePromptCard,
    matchedRevisionFollowUpReadinessReviewPathSteps,
  );
  const staticAnswerCheckCardId =
    `constraint-response-revision-follow-up-readiness-review-path-response-prompt-readiness-board:static-answer-check:${sourceStaticResponsePromptCardId}`;

  return {
    ...staticResponsePromptCard,
    staticAnswerCheckCardId,
    staticAnswerCheckCardIds: [staticAnswerCheckCardId],
    staticAnswerCheckOrder: staticResponsePromptCard.staticResponsePromptOrder,
    sourceStaticResponsePromptCardId,
    sourceStaticResponsePromptCardIds: [sourceStaticResponsePromptCardId],
    sourceRevisionFollowUpReadinessReviewPathStepIds,
    responsePromptReadinessLabels,
    staticAnswerCheckLabels,
    responsePromptReadinessText:
      `Response-prompt readiness card ${sourceStaticResponsePromptCardId}: carry Stage 97 static response-prompt card ${sourceStaticResponsePromptCardId}, Stage 97 review-path steps ${joinOrNone(sourceRevisionFollowUpReadinessReviewPathStepIds)}, Stage 96 static response-check card ${staticResponsePromptCard.sourceStaticResponseCheckCardId}, Stage 96 readiness rows ${joinOrNone(staticResponsePromptCard.sourceRevisionFollowUpReadinessRowIds)}, Stage 95 static revision follow-up prompt card ${staticResponsePromptCard.sourceStaticRevisionFollowUpPromptCardId}, Stage 95 revision coverage review-path steps ${joinOrNone(staticResponsePromptCard.sourceRevisionCoverageReviewPathStepIds)}, Stage 94 static revision-check card ${staticResponsePromptCard.sourceStaticRevisionCheckCardId}, anchors ${joinOrNone(staticResponsePromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticResponsePromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticResponsePromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticResponsePromptCard.deferredScopeReminderIds)}, readiness labels ${joinOrNone(responsePromptReadinessLabels)}, answer-check labels ${joinOrNone(staticAnswerCheckLabels)}, Stage 97 review-path text "${staticResponsePromptCard.revisionFollowUpReadinessReviewPathText}", and Stage 97 static response-prompt text "${staticResponsePromptCard.staticResponsePromptText}" as deterministic manual answer-check context only.`,
    staticAnswerCheckText:
      `Static answer-check card ${sourceStaticResponsePromptCardId}: inspect Stage 97 static response-prompt card ${sourceStaticResponsePromptCardId}, Stage 97 review-path steps ${joinOrNone(sourceRevisionFollowUpReadinessReviewPathStepIds)}, Stage 96 static response-check card ${staticResponsePromptCard.sourceStaticResponseCheckCardId}, Stage 96 readiness rows ${joinOrNone(staticResponsePromptCard.sourceRevisionFollowUpReadinessRowIds)}, Stage 95 static revision follow-up prompt card ${staticResponsePromptCard.sourceStaticRevisionFollowUpPromptCardId}, Stage 94 static revision-check card ${staticResponsePromptCard.sourceStaticRevisionCheckCardId}, Stage 93 static revision-prompt card ${staticResponsePromptCard.sourceStaticRevisionPromptCardId}, Stage 92 static draft-check card ${staticResponsePromptCard.sourceStaticDraftCheckCardId}, Stage 91 static response cue card ${staticResponsePromptCard.sourceStaticResponseCueCardId}, Stage 90 static review prompt card ${staticResponsePromptCard.sourceStaticReviewPromptCardId}, Stage 89 static readiness cue ${staticResponsePromptCard.sourceStaticReadinessCueCardId}, Stage 88 static follow-up prompt card ${staticResponsePromptCard.sourceStaticFollowUpPromptCardId}, Stage 87 citation-gap cue ${staticResponsePromptCard.sourceStaticCitationGapCueCardId}, Stage 86 citation-review lane row ${staticResponsePromptCard.sourceCitationReviewLaneRowId}, Stage 85 citation prompt card ${staticResponsePromptCard.sourceStaticCitationCheckPromptCardId}, anchors ${joinOrNone(staticResponsePromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticResponsePromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticResponsePromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticResponsePromptCard.deferredScopeReminderIds)}, and Stage 97 labels ${joinOrNone([...staticResponsePromptCard.revisionFollowUpReadinessReviewPathLabels, ...staticResponsePromptCard.staticResponsePromptLabels])} before answer drafting outside the app without saved reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, prompt readiness selections, answer-check selections, response-prompt selections, review-path state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static answer-check card context: manual Stage 97 static response-prompt, review-path, source-lineage, anchor, callback, gap-prompt, and deferred-reminder comparison only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved prompt readiness selections, saved answer-check selections, saved response-prompt selections, saved review-path state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticResponsePromptCard.staticNonGoalFlags,
    ),
  };
}

function rowMatchesStaticAnswerCheckCard(
  revisionFollowUpReadinessReviewPathStep: Stage97Step,
  staticResponsePromptCard: Stage97StaticResponsePromptCard,
): boolean {
  return (
    revisionFollowUpReadinessReviewPathStep.sourceStaticResponseCheckCardIds.includes(
      staticResponsePromptCard.sourceStaticResponseCheckCardId,
    ) ||
    staticResponsePromptCard.sourceRevisionFollowUpReadinessRowIds.includes(
      revisionFollowUpReadinessReviewPathStep.sourceRevisionFollowUpReadinessRowId,
    ) ||
    revisionFollowUpReadinessReviewPathStep.sourceStaticRevisionFollowUpPromptCardIds.includes(
      staticResponsePromptCard.sourceStaticRevisionFollowUpPromptCardId,
    )
  );
}

function buildCounts(
  responsePromptReadinessRows: ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardRowView[],
  staticAnswerCheckCards: ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardView[],
  revisionFollowUpReadinessReviewPath: Stage97View,
): ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardSummaryView["counts"] {
  const sourceCounts = revisionFollowUpReadinessReviewPath.summary.counts;

  return {
    ...sourceCounts,
    responsePromptReadinessRowCount: responsePromptReadinessRows.length,
    staticAnswerCheckCardCount: staticAnswerCheckCards.length,
    responsePromptReadinessLabelCount: unique([
      ...responsePromptReadinessRows.flatMap(
        (row) => row.responsePromptReadinessLabels,
      ),
      ...staticAnswerCheckCards.flatMap(
        (card) => card.responsePromptReadinessLabels,
      ),
    ]).length,
    staticAnswerCheckLabelCount: unique([
      ...responsePromptReadinessRows.flatMap(
        (row) => row.staticAnswerCheckLabels,
      ),
      ...staticAnswerCheckCards.flatMap(
        (card) => card.staticAnswerCheckLabels,
      ),
    ]).length,
    localOnlyResponsePromptReadinessRowCount:
      responsePromptReadinessRows.filter((row) => row.localOnly).length,
    localOnlyStaticAnswerCheckCardCount: staticAnswerCheckCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function buildRowResponsePromptReadinessLabels(
  revisionFollowUpReadinessReviewPathStep: Stage97Step,
  matchedStaticResponsePromptCards: Stage97StaticResponsePromptCard[],
): string[] {
  const labels = [
    "response-prompt readiness row",
    "Stage 97 review-path step carry-forward",
  ];

  if (matchedStaticResponsePromptCards.length) {
    labels.push("matched Stage 97 static response-prompt card");
  }

  if (
    revisionFollowUpReadinessReviewPathStep
      .revisionFollowUpReadinessReviewPathLabels.length
  ) {
    labels.push("review-path label carry-forward");
  }

  return labels;
}

function buildRowStaticAnswerCheckLabels(
  revisionFollowUpReadinessReviewPathStep: Stage97Step,
  matchedStaticResponsePromptCards: Stage97StaticResponsePromptCard[],
): string[] {
  const labels = [
    "static answer-check carry-forward",
    "Stage 97 static response-prompt comparison",
  ];

  if (matchedStaticResponsePromptCards.length) {
    labels.push("matched Stage 97 response-prompt card");
  }

  if (
    revisionFollowUpReadinessReviewPathStep.gapDiscussionPointIds.length ||
    revisionFollowUpReadinessReviewPathStep.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder answer check");
  }

  return labels;
}

function buildCardResponsePromptReadinessLabels(
  staticResponsePromptCard: Stage97StaticResponsePromptCard,
  matchedRevisionFollowUpReadinessReviewPathSteps: Stage97Step[],
): string[] {
  const labels = [
    "response-prompt readiness card",
    "Stage 97 static response-prompt carry-forward",
  ];

  if (matchedRevisionFollowUpReadinessReviewPathSteps.length) {
    labels.push("matched response-prompt readiness rows");
  }

  if (staticResponsePromptCard.revisionFollowUpReadinessReviewPathLabels.length) {
    labels.push("review-path card label carry-forward");
  }

  return labels;
}

function buildCardStaticAnswerCheckLabels(
  staticResponsePromptCard: Stage97StaticResponsePromptCard,
  matchedRevisionFollowUpReadinessReviewPathSteps: Stage97Step[],
): string[] {
  const labels = [
    "static answer-check card",
    "Stage 97 static response-prompt carry-forward",
  ];

  if (matchedRevisionFollowUpReadinessReviewPathSteps.length) {
    labels.push("matched review-path step context");
  }

  if (
    staticResponsePromptCard.gapDiscussionPointIds.length ||
    staticResponsePromptCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder answer check");
  }

  return labels;
}

function staticNonGoalFlags(
  sourceFlags: Stage97StaticNonGoalFlags,
): ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedPromptReadinessState: true,
    noSavedPromptReadinessRows: true,
    noSavedPromptReadinessSelections: true,
    noSavedAnswerCheckState: true,
    noSavedAnswerCheckSelections: true,
    noSavedStaticAnswerCheckCards: true,
    noSavedAnswerDrafts: true,
  };
}

function joinOrNone(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}
