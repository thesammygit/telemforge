import type {
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoardRowView as Stage92Row,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoardStaticDraftCheckCardView as Stage92StaticDraftCheckCard,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoardStaticNonGoalFlagsView as Stage92StaticNonGoalFlags,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoardView as Stage92View,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathStaticNonGoalFlagsView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathStaticRevisionPromptCardView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathStepView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathSummaryView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathView,
} from "../features/mission-console/types.ts";

export function buildConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPath(
  responseReadinessBoard: Stage92View | undefined,
): ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathView | undefined {
  if (
    !responseReadinessBoard?.responseReadinessRows.length ||
    !responseReadinessBoard.staticDraftCheckCards.length
  ) {
    return undefined;
  }

  const responseReadinessReviewPathSteps =
    responseReadinessBoard.responseReadinessRows.map((row) =>
      buildResponseReadinessReviewPathStep(
        row,
        responseReadinessBoard.staticDraftCheckCards,
      ),
    );
  const staticRevisionPromptCards =
    responseReadinessBoard.staticDraftCheckCards.map((card) =>
      buildStaticRevisionPromptCard(
        card,
        responseReadinessBoard.responseReadinessRows,
      ),
    );
  const defaultResponseReadinessReviewPathStep =
    responseReadinessReviewPathSteps.find(
      (step) =>
        step.sourceResponseReadinessRowId ===
        responseReadinessBoard.defaultResponseReadinessRow.responseReadinessRowId,
    ) ?? responseReadinessReviewPathSteps[0];
  const defaultStaticRevisionPromptCard =
    staticRevisionPromptCards.find(
      (card) =>
        card.sourceStaticDraftCheckCardId ===
        responseReadinessBoard.defaultStaticDraftCheckCard.staticDraftCheckCardId,
    ) ?? staticRevisionPromptCards[0];
  const defaultStage92Context =
    responseReadinessBoard.summary.defaultResponseReadinessContext;

  return {
    schema:
      "telemforge.constraint_response_evidence_gap_follow_up_coverage_review_response_readiness_review_path.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response evidence-gap follow-up coverage-review response-readiness review path and static revision prompts",
    localStatus: responseReadinessBoard.localStatus,
    summary: {
      constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathId:
        "candidate-local-constraint-response-evidence-gap-follow-up-coverage-review-response-readiness-review-path",
      label:
        "Local constraint-response evidence-gap follow-up coverage-review response-readiness review path",
      summary:
        "A static response-readiness review path derives steps from Stage 92 response-readiness rows and static revision-prompt cards from Stage 92 static draft-check cards so reviewers can walk readiness rows, draft checks, source lineage, local anchors, callbacks, gap prompts, deferred reminders, and revision prompts before editing outside the app without saved answers, answer drafts, revision drafts, reviewer notes, response notes, response-readiness selections, draft-check selections, revision-prompt state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultResponseReadinessReviewContext: {
        defaultResponseReadinessReviewPathStepId:
          defaultResponseReadinessReviewPathStep
            .responseReadinessReviewPathStepId,
        defaultStaticRevisionPromptCardId:
          defaultStaticRevisionPromptCard.staticRevisionPromptCardId,
        defaultResponseReadinessRowId:
          defaultResponseReadinessReviewPathStep.sourceResponseReadinessRowId,
        defaultStaticDraftCheckCardId:
          defaultStaticRevisionPromptCard.sourceStaticDraftCheckCardId,
        defaultCoverageReviewPathStepId:
          defaultResponseReadinessReviewPathStep.sourceCoverageReviewPathStepId,
        defaultStaticResponseCueCardId:
          defaultStaticRevisionPromptCard.sourceStaticResponseCueCardId,
        defaultCoverageRowId:
          defaultResponseReadinessReviewPathStep.sourceCoverageRowId,
        defaultStaticReviewPromptCardId:
          defaultStaticRevisionPromptCard.sourceStaticReviewPromptCardId,
        defaultFollowUpReviewPathStepId:
          defaultResponseReadinessReviewPathStep.sourceFollowUpReviewPathStepId,
        defaultStaticReadinessCueCardId:
          defaultStaticRevisionPromptCard.sourceStaticReadinessCueCardId,
        defaultEvidenceGapReadinessRowId:
          defaultResponseReadinessReviewPathStep.sourceEvidenceGapReadinessRowId,
        defaultStaticFollowUpPromptCardId:
          defaultStaticRevisionPromptCard.sourceStaticFollowUpPromptCardId,
        defaultEvidenceCheckReviewPathStepId:
          defaultResponseReadinessReviewPathStep.sourceEvidenceCheckReviewPathStepId,
        defaultStaticCitationGapCueCardId:
          defaultStaticRevisionPromptCard.sourceStaticCitationGapCueCardId,
        defaultStaticEvidenceCheckPromptCardId:
          defaultResponseReadinessReviewPathStep
            .sourceStaticEvidenceCheckPromptCardId,
        defaultCitationReviewLaneRowId:
          defaultStaticRevisionPromptCard.sourceCitationReviewLaneRowId,
        defaultStaticCitationCheckPromptCardId:
          defaultStaticRevisionPromptCard.sourceStaticCitationCheckPromptCardId,
        defaultSourceFollowUpMapEntryId:
          defaultResponseReadinessReviewPathStep.sourceSourceFollowUpMapEntryId,
        sourceStage92ResponseReadinessBoardSummary:
          responseReadinessBoard.summary.summary,
        sourceStage92DefaultResponseReadinessContext: defaultStage92Context,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        responseReadinessReviewPathSteps,
        staticRevisionPromptCards,
        responseReadinessBoard,
      ),
    },
    defaultResponseReadinessReviewPathStep,
    defaultStaticRevisionPromptCard,
    responseReadinessReviewPathSteps,
    staticRevisionPromptCards,
    staticResponseReadinessReviewBoundarySummary:
      "Stage 93 response-readiness review path steps and static revision-prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, revision drafts, reviewer notes, response notes, response-readiness selections, draft-check selections, revision-prompt selections, review-path state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoard:
      responseReadinessBoard,
  };
}

function buildResponseReadinessReviewPathStep(
  responseReadinessRow: Stage92Row,
  staticDraftCheckCards: Stage92StaticDraftCheckCard[],
): ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathStepView {
  const sourceResponseReadinessRowId =
    responseReadinessRow.responseReadinessRowId;
  const matchedStaticDraftCheckCards = staticDraftCheckCards.filter((card) =>
    rowMatchesStaticRevisionPromptCard(responseReadinessRow, card),
  );
  const sourceStaticDraftCheckCardIds = matchedStaticDraftCheckCards.map(
    (card) => card.staticDraftCheckCardId,
  );
  const responseReadinessReviewLabels =
    buildStepResponseReadinessReviewLabels(
      responseReadinessRow,
      matchedStaticDraftCheckCards,
    );
  const staticRevisionPromptLabels = buildStepStaticRevisionPromptLabels(
    responseReadinessRow,
    matchedStaticDraftCheckCards,
  );
  const responseReadinessReviewPathStepId =
    `constraint-response-evidence-gap-follow-up-coverage-review-response-readiness-review-path:step:${sourceResponseReadinessRowId}`;

  return {
    ...responseReadinessRow,
    responseReadinessReviewPathStepId,
    responseReadinessReviewPathStepIds: [responseReadinessReviewPathStepId],
    responseReadinessReviewPathStepOrder:
      responseReadinessRow.responseReadinessRowOrder,
    sourceResponseReadinessRowId,
    sourceResponseReadinessRowIds: [sourceResponseReadinessRowId],
    sourceStaticDraftCheckCardIds,
    responseReadinessReviewLabels,
    staticRevisionPromptLabels,
    responseReadinessReviewText:
      `Response-readiness review path step ${sourceResponseReadinessRowId}: carry Stage 92 response-readiness row ${sourceResponseReadinessRowId}, Stage 92 static draft-check cards ${joinOrNone(sourceStaticDraftCheckCardIds)}, Stage 91 coverage-review path step ${responseReadinessRow.sourceCoverageReviewPathStepId}, Stage 91 static response cue cards ${joinOrNone(responseReadinessRow.sourceStaticResponseCueCardIds)}, Stage 90 coverage row ${responseReadinessRow.sourceCoverageRowId}, Stage 90 static review prompt cards ${joinOrNone(responseReadinessRow.sourceStaticReviewPromptCardIds)}, Stage 89 follow-up review path step ${responseReadinessRow.sourceFollowUpReviewPathStepId}, Stage 89 static readiness cue cards ${joinOrNone(responseReadinessRow.sourceStaticReadinessCueCardIds)}, Stage 88 readiness row ${responseReadinessRow.sourceEvidenceGapReadinessRowId}, Stage 88 static follow-up prompt cards ${joinOrNone(responseReadinessRow.sourceStaticFollowUpPromptCardIds)}, Stage 87 evidence-check review path step ${responseReadinessRow.sourceEvidenceCheckReviewPathStepId}, Stage 87 citation-gap cue cards ${joinOrNone(responseReadinessRow.sourceStaticCitationGapCueCardIds)}, Stage 86 static evidence-check prompt card ${responseReadinessRow.sourceStaticEvidenceCheckPromptCardId}, Stage 86 citation-review lane rows ${joinOrNone(responseReadinessRow.sourceCitationReviewLaneRowIds)}, Stage 85 source follow-up map entry ${responseReadinessRow.sourceSourceFollowUpMapEntryId}, Stage 85 citation prompt cards ${joinOrNone(responseReadinessRow.sourceStaticCitationCheckPromptCardIds)}, Stage 84 readiness row ${responseReadinessRow.sourceSourceReadinessLaneRowId}, Stage 84 cue cards ${joinOrNone(responseReadinessRow.sourceStaticSourceFollowUpCueCardIds)}, Stage 83 source-review path step ${responseReadinessRow.sourceSourceReviewPathStepId}, Stage 83 static source-review prompt cards ${joinOrNone(responseReadinessRow.sourceStaticSourceReviewPromptCardIds)}, Stage 82 source-crosswalk row ${responseReadinessRow.sourceCrosswalkRowId}, Stage 82 static review-check cards ${joinOrNone(responseReadinessRow.sourceStaticReviewCheckCardIds)}, Stage 81 review-path step ${responseReadinessRow.sourceConstraintResponseReviewPathStepId}, Stage 81 response-review prompt cards ${joinOrNone(responseReadinessRow.sourceStaticResponseReviewPromptCardIds)}, Stage 80 constraint-coverage row ${responseReadinessRow.sourceConstraintCoverageRowId}, Stage 80 response-note prompt cards ${joinOrNone(responseReadinessRow.sourceStaticResponseNotePromptCardIds)}, Stage 79 answer-review step ${responseReadinessRow.sourceAnswerReviewPathStepId}, Stage 79 constraint-note cards ${joinOrNone(responseReadinessRow.sourceStaticConstraintNoteCardIds)}, Stage 78 answer-check card ${responseReadinessRow.sourceStaticAnswerCheckCardId}, Stage 78 readiness rows ${joinOrNone(responseReadinessRow.sourceResponsePromptReadinessRowIds)}, Stage 77 response-prompt cards ${joinOrNone(responseReadinessRow.sourceStaticResponsePromptCardIds)}, Stage 77 response-map review-path step ${responseReadinessRow.sourceResponseMapReviewPathStepId}, Stage 76 response-map row ${responseReadinessRow.sourceResponseMapRowId}, Stage 75 coverage-review step ${responseReadinessRow.sourceCoverageReviewPathStepId}, Stage 74 coverage row ${responseReadinessRow.sourceCoverageMatrixRowId}, Stage 73 review-path step ${responseReadinessRow.sourceReviewPathStepId}, Stage 72 source recap row ${responseReadinessRow.sourceSourceRecapRowId}, Stage 71 review-lane row ${responseReadinessRow.sourceAnswerFollowUpReviewLaneRowId}, Stage 70 crosswalk row ${responseReadinessRow.sourceAnswerSourceCrosswalkRowId}, Stage 69 walkthrough step ${responseReadinessRow.sourceAnswerWalkthroughStepId}, Stage 68 answer coverage row ${responseReadinessRow.sourceAnswerCoverageRowId}, Stage 67 rehearsal step ${responseReadinessRow.sourceRehearsalPathStepId}, Stage 66 board row ${responseReadinessRow.sourceReviewBoardRowId}, Stage 65 brief row ${responseReadinessRow.followUpReadinessBriefRowId}, Stage 64 triage row ${responseReadinessRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${joinOrNone(responseReadinessRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(responseReadinessRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(responseReadinessRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(responseReadinessRow.deferredScopeReminderIds)}, response-readiness review labels ${joinOrNone(responseReadinessReviewLabels)}, static revision-prompt labels ${joinOrNone(staticRevisionPromptLabels)}, Stage 92 response-readiness text "${responseReadinessRow.responseReadinessText}", and Stage 92 draft-check text "${responseReadinessRow.staticDraftCheckText}" as deterministic manual response-readiness review context only.`,
    revisionPromptText:
      `Static revision-prompt context for response-readiness review path step ${sourceResponseReadinessRowId}: compare Stage 92 response-readiness row ${sourceResponseReadinessRowId}, Stage 92 static draft-check cards ${joinOrNone(sourceStaticDraftCheckCardIds)}, Stage 91 coverage-review path step ${responseReadinessRow.sourceCoverageReviewPathStepId}, Stage 91 static response cue cards ${joinOrNone(responseReadinessRow.sourceStaticResponseCueCardIds)}, Stage 90 coverage row ${responseReadinessRow.sourceCoverageRowId}, Stage 89 follow-up review path step ${responseReadinessRow.sourceFollowUpReviewPathStepId}, Stage 88 readiness row ${responseReadinessRow.sourceEvidenceGapReadinessRowId}, Stage 87 evidence-check review path step ${responseReadinessRow.sourceEvidenceCheckReviewPathStepId}, anchors ${joinOrNone(responseReadinessRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(responseReadinessRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(responseReadinessRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(responseReadinessRow.deferredScopeReminderIds)}, and Stage 92 labels ${joinOrNone([...responseReadinessRow.responseReadinessLabels, ...responseReadinessRow.staticDraftCheckLabels])} before editing outside the app without saved reviewer answers, answer drafts, revision drafts, reviewer notes, response notes, response-readiness selections, draft-check selections, revision-prompt selections, review-path state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static response-readiness review path context: manual Stage 92 response-readiness-row, static-draft-check, source-lineage, anchor, callback, gap-prompt, deferred-reminder, and revision-prompt comparison only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved reviewer notes, saved response notes, saved response-readiness selections, saved draft-check selections, saved revision-prompt selections, saved review-path state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      responseReadinessRow.staticNonGoalFlags,
    ),
  };
}

function buildStaticRevisionPromptCard(
  staticDraftCheckCard: Stage92StaticDraftCheckCard,
  responseReadinessRows: Stage92Row[],
): ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathStaticRevisionPromptCardView {
  const sourceStaticDraftCheckCardId =
    staticDraftCheckCard.staticDraftCheckCardId;
  const matchedResponseReadinessRows = responseReadinessRows.filter((row) =>
    rowMatchesStaticRevisionPromptCard(row, staticDraftCheckCard),
  );
  const sourceResponseReadinessRowIds = matchedResponseReadinessRows.map(
    (row) => row.responseReadinessRowId,
  );
  const responseReadinessReviewLabels =
    buildCardResponseReadinessReviewLabels(
      staticDraftCheckCard,
      matchedResponseReadinessRows,
    );
  const staticRevisionPromptLabels = buildCardStaticRevisionPromptLabels(
    staticDraftCheckCard,
    matchedResponseReadinessRows,
  );
  const staticRevisionPromptCardId =
    `constraint-response-evidence-gap-follow-up-coverage-review-response-readiness-review-path:static-revision-prompt:${sourceStaticDraftCheckCardId}`;

  return {
    ...staticDraftCheckCard,
    staticRevisionPromptCardId,
    staticRevisionPromptCardIds: [staticRevisionPromptCardId],
    staticRevisionPromptOrder: staticDraftCheckCard.staticDraftCheckOrder,
    sourceStaticDraftCheckCardId,
    sourceStaticDraftCheckCardIds: [sourceStaticDraftCheckCardId],
    sourceResponseReadinessRowIds,
    responseReadinessReviewLabels,
    staticRevisionPromptLabels,
    responseReadinessReviewText:
      `Response-readiness review revision card ${sourceStaticDraftCheckCardId}: carry Stage 92 static draft-check card ${sourceStaticDraftCheckCardId}, Stage 92 response-readiness rows ${joinOrNone(sourceResponseReadinessRowIds)}, Stage 91 static response cue card ${staticDraftCheckCard.sourceStaticResponseCueCardId}, Stage 91 coverage-review path steps ${joinOrNone(staticDraftCheckCard.sourceCoverageReviewPathStepIds)}, Stage 90 static review prompt card ${staticDraftCheckCard.sourceStaticReviewPromptCardId}, Stage 90 coverage rows ${joinOrNone(staticDraftCheckCard.sourceCoverageRowIds)}, Stage 89 static readiness cue ${staticDraftCheckCard.sourceStaticReadinessCueCardId}, Stage 89 follow-up review path steps ${joinOrNone(staticDraftCheckCard.sourceFollowUpReviewPathStepIds)}, Stage 88 static follow-up prompt card ${staticDraftCheckCard.sourceStaticFollowUpPromptCardId}, Stage 88 readiness rows ${joinOrNone(staticDraftCheckCard.sourceEvidenceGapReadinessRowIds)}, Stage 87 static citation-gap cue ${staticDraftCheckCard.sourceStaticCitationGapCueCardId}, Stage 87 evidence-check review path steps ${joinOrNone(staticDraftCheckCard.sourceEvidenceCheckReviewPathStepIds)}, Stage 86 citation-review lane row ${staticDraftCheckCard.sourceCitationReviewLaneRowId}, Stage 86 static evidence-check prompt cards ${joinOrNone(staticDraftCheckCard.sourceStaticEvidenceCheckPromptCardIds)}, Stage 85 citation prompt card ${staticDraftCheckCard.sourceStaticCitationCheckPromptCardId}, Stage 85 source follow-up map entries ${joinOrNone(staticDraftCheckCard.sourceSourceFollowUpMapEntryIds)}, anchors ${joinOrNone(staticDraftCheckCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticDraftCheckCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticDraftCheckCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticDraftCheckCard.deferredScopeReminderIds)}, and response-readiness review labels ${joinOrNone(responseReadinessReviewLabels)} as deterministic manual review context only.`,
    revisionPromptText:
      `Static revision-prompt card ${sourceStaticDraftCheckCardId}: inspect Stage 92 static draft-check card ${sourceStaticDraftCheckCardId}, Stage 91 static response cue card ${staticDraftCheckCard.sourceStaticResponseCueCardId}, Stage 90 static review prompt card ${staticDraftCheckCard.sourceStaticReviewPromptCardId}, Stage 89 static readiness cue ${staticDraftCheckCard.sourceStaticReadinessCueCardId}, Stage 88 static follow-up prompt card ${staticDraftCheckCard.sourceStaticFollowUpPromptCardId}, Stage 87 citation-gap cue ${staticDraftCheckCard.sourceStaticCitationGapCueCardId}, Stage 86 citation-review lane row ${staticDraftCheckCard.sourceCitationReviewLaneRowId}, Stage 85 citation prompt ${staticDraftCheckCard.sourceStaticCitationCheckPromptCardId}, Stage 84 readiness rows ${joinOrNone(staticDraftCheckCard.sourceSourceReadinessLaneRowIds)}, Stage 83 source-review path steps ${joinOrNone(staticDraftCheckCard.sourceSourceReviewPathStepIds)}, Stage 82 crosswalk rows ${joinOrNone(staticDraftCheckCard.sourceCrosswalkRowIds)}, Stage 81 review-path steps ${joinOrNone(staticDraftCheckCard.sourceConstraintResponseReviewPathStepIds)}, anchors ${joinOrNone(staticDraftCheckCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticDraftCheckCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticDraftCheckCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticDraftCheckCard.deferredScopeReminderIds)}, static revision-prompt labels ${joinOrNone(staticRevisionPromptLabels)}, and Stage 92 draft-check text "${staticDraftCheckCard.staticDraftCheckText}" before editing outside the app without saved reviewer answers, answer drafts, revision drafts, reviewer notes, response notes, response-readiness selections, draft-check selections, revision-prompt state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static revision-prompt context: manual Stage 92 static-draft-check, response-readiness-row, source-lineage, anchor, callback, gap-prompt, and deferred-reminder review only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved reviewer notes, saved response notes, saved response-readiness selections, saved draft-check selections, saved revision-prompt state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticDraftCheckCard.staticNonGoalFlags,
    ),
  };
}

function rowMatchesStaticRevisionPromptCard(
  responseReadinessRow: Stage92Row,
  staticDraftCheckCard: Stage92StaticDraftCheckCard,
): boolean {
  return (
    responseReadinessRow.sourceStaticResponseCueCardIds.includes(
      staticDraftCheckCard.sourceStaticResponseCueCardId,
    ) ||
    staticDraftCheckCard.sourceCoverageReviewPathStepIds.includes(
      responseReadinessRow.sourceCoverageReviewPathStepId,
    ) ||
    responseReadinessRow.sourceStaticReviewPromptCardIds.includes(
      staticDraftCheckCard.sourceStaticReviewPromptCardId,
    )
  );
}

function buildCounts(
  responseReadinessReviewPathSteps: ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathStepView[],
  staticRevisionPromptCards: ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathStaticRevisionPromptCardView[],
  responseReadinessBoard: Stage92View,
): ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathSummaryView["counts"] {
  const sourceCounts = responseReadinessBoard.summary.counts;

  return {
    ...sourceCounts,
    responseReadinessReviewPathStepCount:
      responseReadinessReviewPathSteps.length,
    staticRevisionPromptCardCount: staticRevisionPromptCards.length,
    responseReadinessReviewLabelCount: unique([
      ...responseReadinessReviewPathSteps.flatMap(
        (step) => step.responseReadinessReviewLabels,
      ),
      ...staticRevisionPromptCards.flatMap(
        (card) => card.responseReadinessReviewLabels,
      ),
    ]).length,
    staticRevisionPromptLabelCount: unique([
      ...responseReadinessReviewPathSteps.flatMap(
        (step) => step.staticRevisionPromptLabels,
      ),
      ...staticRevisionPromptCards.flatMap(
        (card) => card.staticRevisionPromptLabels,
      ),
    ]).length,
    localOnlyResponseReadinessReviewPathStepCount:
      responseReadinessReviewPathSteps.filter((step) => step.localOnly).length,
    localOnlyStaticRevisionPromptCardCount: staticRevisionPromptCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function buildStepResponseReadinessReviewLabels(
  responseReadinessRow: Stage92Row,
  matchedStaticDraftCheckCards: Stage92StaticDraftCheckCard[],
): string[] {
  const labels = [
    "response-readiness review path step",
    "Stage 92 response-readiness row carry-forward",
  ];

  if (matchedStaticDraftCheckCards.length) {
    labels.push("matched Stage 92 static draft-check context");
  }

  if (responseReadinessRow.responseReadinessLabels.length) {
    labels.push("response-readiness label carry-forward");
  }

  return labels;
}

function buildStepStaticRevisionPromptLabels(
  responseReadinessRow: Stage92Row,
  matchedStaticDraftCheckCards: Stage92StaticDraftCheckCard[],
): string[] {
  const labels = [
    "static revision-prompt carry-forward",
    "Stage 92 draft-check comparison",
  ];

  if (matchedStaticDraftCheckCards.length) {
    labels.push("matched static draft-check revision prompt");
  }

  if (
    responseReadinessRow.gapDiscussionPointIds.length ||
    responseReadinessRow.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder revision prompt");
  }

  return labels;
}

function buildCardResponseReadinessReviewLabels(
  staticDraftCheckCard: Stage92StaticDraftCheckCard,
  matchedResponseReadinessRows: Stage92Row[],
): string[] {
  const labels = [
    "static revision-prompt response-readiness review context",
    "Stage 92 static draft-check card",
  ];

  if (matchedResponseReadinessRows.length) {
    labels.push("matched response-readiness review path steps");
  }

  if (staticDraftCheckCard.responseReadinessLabels.length) {
    labels.push("response-readiness card label carry-forward");
  }

  return labels;
}

function buildCardStaticRevisionPromptLabels(
  staticDraftCheckCard: Stage92StaticDraftCheckCard,
  matchedResponseReadinessRows: Stage92Row[],
): string[] {
  const labels = [
    "static revision-prompt card",
    "Stage 92 static draft-check carry-forward",
  ];

  if (matchedResponseReadinessRows.length) {
    labels.push("matched response-readiness row revision context");
  }

  if (
    staticDraftCheckCard.gapDiscussionPointIds.length ||
    staticDraftCheckCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder revision prompt");
  }

  return labels;
}

function staticNonGoalFlags(
  sourceFlags: Stage92StaticNonGoalFlags,
): ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedResponseReadinessReviewPathState: true,
    noSavedResponseReadinessReviewPathSelections: true,
    noSavedRevisionPromptState: true,
    noSavedRevisionPromptSelections: true,
    noSavedStaticRevisionPromptCards: true,
    noSavedRevisionDrafts: true,
    noSavedAnswerDrafts: true,
    noSavedReviewerNotes: true,
    noSavedResponseNotes: true,
  };
}

function joinOrNone(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}
