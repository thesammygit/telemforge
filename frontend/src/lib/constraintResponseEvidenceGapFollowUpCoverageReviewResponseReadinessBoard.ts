import type {
  ConstraintResponseEvidenceGapFollowUpCoverageReviewPathStaticNonGoalFlagsView as Stage91StaticNonGoalFlags,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewPathStaticResponseCueCardView as Stage91StaticResponseCueCard,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewPathStepView as Stage91Step,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewPathView as Stage91View,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoardRowView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoardStaticDraftCheckCardView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoardStaticNonGoalFlagsView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoardSummaryView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoardView,
} from "../features/mission-console/types.ts";

export function buildConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoard(
  coverageReviewPath: Stage91View | undefined,
): ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoardView | undefined {
  if (
    !coverageReviewPath?.coverageReviewPathSteps.length ||
    !coverageReviewPath.staticResponseCueCards.length
  ) {
    return undefined;
  }

  const responseReadinessRows = coverageReviewPath.coverageReviewPathSteps.map(
    (step) =>
      buildResponseReadinessRow(step, coverageReviewPath.staticResponseCueCards),
  );
  const staticDraftCheckCards = coverageReviewPath.staticResponseCueCards.map(
    (card) =>
      buildStaticDraftCheckCard(card, coverageReviewPath.coverageReviewPathSteps),
  );
  const defaultResponseReadinessRow =
    responseReadinessRows.find(
      (row) =>
        row.sourceCoverageReviewPathStepId ===
        coverageReviewPath.defaultCoverageReviewPathStep.coverageReviewPathStepId,
    ) ?? responseReadinessRows[0];
  const defaultStaticDraftCheckCard =
    staticDraftCheckCards.find(
      (card) =>
        card.sourceStaticResponseCueCardId ===
        coverageReviewPath.defaultStaticResponseCueCard.staticResponseCueCardId,
    ) ?? staticDraftCheckCards[0];
  const defaultStage91Context =
    coverageReviewPath.summary.defaultCoverageReviewContext;

  return {
    schema:
      "telemforge.constraint_response_evidence_gap_follow_up_coverage_review_response_readiness_board.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response evidence-gap follow-up coverage-review response-readiness board and static draft checks",
    localStatus: coverageReviewPath.localStatus,
    summary: {
      constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoardId:
        "candidate-local-constraint-response-evidence-gap-follow-up-coverage-review-response-readiness-board",
      label:
        "Local constraint-response evidence-gap follow-up coverage-review response-readiness board",
      summary:
        "A static response-readiness board derives rows from Stage 91 coverage-review path steps and static draft-check cards from Stage 91 static response cue cards so reviewers can compare response cues, source lineage, local anchors, callbacks, gap prompts, deferred reminders, and draft checks before writing outside the app without saved answers, drafts, reviewer notes, response notes, response-readiness selections, draft-check state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultResponseReadinessContext: {
        defaultResponseReadinessRowId:
          defaultResponseReadinessRow.responseReadinessRowId,
        defaultStaticDraftCheckCardId:
          defaultStaticDraftCheckCard.staticDraftCheckCardId,
        defaultCoverageReviewPathStepId:
          defaultResponseReadinessRow.sourceCoverageReviewPathStepId,
        defaultStaticResponseCueCardId:
          defaultStaticDraftCheckCard.sourceStaticResponseCueCardId,
        defaultCoverageRowId: defaultResponseReadinessRow.sourceCoverageRowId,
        defaultStaticReviewPromptCardId:
          defaultStaticDraftCheckCard.sourceStaticReviewPromptCardId,
        defaultFollowUpReviewPathStepId:
          defaultResponseReadinessRow.sourceFollowUpReviewPathStepId,
        defaultStaticReadinessCueCardId:
          defaultStaticDraftCheckCard.sourceStaticReadinessCueCardId,
        defaultEvidenceGapReadinessRowId:
          defaultResponseReadinessRow.sourceEvidenceGapReadinessRowId,
        defaultStaticFollowUpPromptCardId:
          defaultStaticDraftCheckCard.sourceStaticFollowUpPromptCardId,
        defaultEvidenceCheckReviewPathStepId:
          defaultResponseReadinessRow.sourceEvidenceCheckReviewPathStepId,
        defaultStaticCitationGapCueCardId:
          defaultStaticDraftCheckCard.sourceStaticCitationGapCueCardId,
        defaultStaticEvidenceCheckPromptCardId:
          defaultResponseReadinessRow.sourceStaticEvidenceCheckPromptCardId,
        defaultCitationReviewLaneRowId:
          defaultStaticDraftCheckCard.sourceCitationReviewLaneRowId,
        defaultStaticCitationCheckPromptCardId:
          defaultStaticDraftCheckCard.sourceStaticCitationCheckPromptCardId,
        defaultSourceFollowUpMapEntryId:
          defaultResponseReadinessRow.sourceSourceFollowUpMapEntryId,
        sourceStage91CoverageReviewPathSummary:
          coverageReviewPath.summary.summary,
        sourceStage91DefaultCoverageReviewContext: defaultStage91Context,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        responseReadinessRows,
        staticDraftCheckCards,
        coverageReviewPath,
      ),
    },
    defaultResponseReadinessRow,
    defaultStaticDraftCheckCard,
    responseReadinessRows,
    staticDraftCheckCards,
    staticResponseReadinessBoundarySummary:
      "Stage 92 response-readiness rows and static draft-check cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, response notes, coverage-review selections, response cue selections, response-readiness selections, draft-check state, coverage state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseEvidenceGapFollowUpCoverageReviewPath:
      coverageReviewPath,
  };
}

function buildResponseReadinessRow(
  coverageReviewPathStep: Stage91Step,
  staticResponseCueCards: Stage91StaticResponseCueCard[],
): ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoardRowView {
  const sourceCoverageReviewPathStepId =
    coverageReviewPathStep.coverageReviewPathStepId;
  const matchedStaticResponseCueCards = staticResponseCueCards.filter((card) =>
    stepMatchesStaticDraftCheckCard(coverageReviewPathStep, card),
  );
  const sourceStaticResponseCueCardIds = matchedStaticResponseCueCards.map(
    (card) => card.staticResponseCueCardId,
  );
  const responseReadinessLabels = buildRowResponseReadinessLabels(
    coverageReviewPathStep,
    matchedStaticResponseCueCards,
  );
  const staticDraftCheckLabels = buildRowStaticDraftCheckLabels(
    coverageReviewPathStep,
    matchedStaticResponseCueCards,
  );
  const responseReadinessRowId =
    `constraint-response-evidence-gap-follow-up-coverage-review-response-readiness-board:row:${sourceCoverageReviewPathStepId}`;

  return {
    ...coverageReviewPathStep,
    responseReadinessRowId,
    responseReadinessRowIds: [responseReadinessRowId],
    responseReadinessRowOrder:
      coverageReviewPathStep.coverageReviewPathStepOrder,
    sourceCoverageReviewPathStepId,
    sourceCoverageReviewPathStepIds: [sourceCoverageReviewPathStepId],
    sourceStaticResponseCueCardIds,
    responseReadinessLabels,
    staticDraftCheckLabels,
    responseReadinessText:
      `Response-readiness row ${sourceCoverageReviewPathStepId}: carry Stage 91 coverage-review path step ${sourceCoverageReviewPathStepId}, Stage 91 static response cue cards ${joinOrNone(sourceStaticResponseCueCardIds)}, Stage 90 coverage row ${coverageReviewPathStep.sourceCoverageRowId}, Stage 90 static review prompt cards ${joinOrNone(coverageReviewPathStep.sourceStaticReviewPromptCardIds)}, Stage 89 follow-up review path step ${coverageReviewPathStep.sourceFollowUpReviewPathStepId}, Stage 89 static readiness cue cards ${joinOrNone(coverageReviewPathStep.sourceStaticReadinessCueCardIds)}, Stage 88 readiness row ${coverageReviewPathStep.sourceEvidenceGapReadinessRowId}, Stage 88 static follow-up prompt cards ${joinOrNone(coverageReviewPathStep.sourceStaticFollowUpPromptCardIds)}, Stage 87 evidence-check review path step ${coverageReviewPathStep.sourceEvidenceCheckReviewPathStepId}, Stage 87 citation-gap cue cards ${joinOrNone(coverageReviewPathStep.sourceStaticCitationGapCueCardIds)}, Stage 86 static evidence-check prompt card ${coverageReviewPathStep.sourceStaticEvidenceCheckPromptCardId}, Stage 86 citation-review lane rows ${joinOrNone(coverageReviewPathStep.sourceCitationReviewLaneRowIds)}, Stage 85 source follow-up map entry ${coverageReviewPathStep.sourceSourceFollowUpMapEntryId}, Stage 85 citation prompt cards ${joinOrNone(coverageReviewPathStep.sourceStaticCitationCheckPromptCardIds)}, Stage 84 readiness row ${coverageReviewPathStep.sourceSourceReadinessLaneRowId}, Stage 84 cue cards ${joinOrNone(coverageReviewPathStep.sourceStaticSourceFollowUpCueCardIds)}, Stage 83 source-review path step ${coverageReviewPathStep.sourceSourceReviewPathStepId}, Stage 83 static source-review prompt cards ${joinOrNone(coverageReviewPathStep.sourceStaticSourceReviewPromptCardIds)}, Stage 82 source-crosswalk row ${coverageReviewPathStep.sourceCrosswalkRowId}, Stage 82 static review-check cards ${joinOrNone(coverageReviewPathStep.sourceStaticReviewCheckCardIds)}, Stage 81 review-path step ${coverageReviewPathStep.sourceConstraintResponseReviewPathStepId}, Stage 81 response-review prompt cards ${joinOrNone(coverageReviewPathStep.sourceStaticResponseReviewPromptCardIds)}, Stage 80 constraint-coverage row ${coverageReviewPathStep.sourceConstraintCoverageRowId}, Stage 80 response-note prompt cards ${joinOrNone(coverageReviewPathStep.sourceStaticResponseNotePromptCardIds)}, Stage 79 answer-review step ${coverageReviewPathStep.sourceAnswerReviewPathStepId}, Stage 79 constraint-note cards ${joinOrNone(coverageReviewPathStep.sourceStaticConstraintNoteCardIds)}, Stage 78 answer-check card ${coverageReviewPathStep.sourceStaticAnswerCheckCardId}, Stage 78 readiness rows ${joinOrNone(coverageReviewPathStep.sourceResponsePromptReadinessRowIds)}, Stage 77 response-prompt cards ${joinOrNone(coverageReviewPathStep.sourceStaticResponsePromptCardIds)}, Stage 77 response-map review-path step ${coverageReviewPathStep.sourceResponseMapReviewPathStepId}, Stage 76 response-map row ${coverageReviewPathStep.sourceResponseMapRowId}, Stage 75 coverage-review step ${coverageReviewPathStep.sourceCoverageReviewPathStepId}, Stage 74 coverage row ${coverageReviewPathStep.sourceCoverageMatrixRowId}, Stage 73 review-path step ${coverageReviewPathStep.sourceReviewPathStepId}, Stage 72 source recap row ${coverageReviewPathStep.sourceSourceRecapRowId}, Stage 71 review-lane row ${coverageReviewPathStep.sourceAnswerFollowUpReviewLaneRowId}, Stage 70 crosswalk row ${coverageReviewPathStep.sourceAnswerSourceCrosswalkRowId}, Stage 69 walkthrough step ${coverageReviewPathStep.sourceAnswerWalkthroughStepId}, Stage 68 answer coverage row ${coverageReviewPathStep.sourceAnswerCoverageRowId}, Stage 67 rehearsal step ${coverageReviewPathStep.sourceRehearsalPathStepId}, Stage 66 board row ${coverageReviewPathStep.sourceReviewBoardRowId}, Stage 65 brief row ${coverageReviewPathStep.followUpReadinessBriefRowId}, Stage 64 triage row ${coverageReviewPathStep.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${joinOrNone(coverageReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(coverageReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(coverageReviewPathStep.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(coverageReviewPathStep.deferredScopeReminderIds)}, response-readiness labels ${joinOrNone(responseReadinessLabels)}, static draft-check labels ${joinOrNone(staticDraftCheckLabels)}, Stage 91 coverage-review text "${coverageReviewPathStep.coverageReviewText}", and Stage 91 response cue text "${coverageReviewPathStep.responseCueText}" as deterministic manual response-readiness context only.`,
    staticDraftCheckText:
      `Static draft-check context for ${sourceCoverageReviewPathStepId}: compare Stage 91 coverage-review path step ${sourceCoverageReviewPathStepId}, Stage 91 static response cue cards ${joinOrNone(sourceStaticResponseCueCardIds)}, Stage 90 coverage row ${coverageReviewPathStep.sourceCoverageRowId}, Stage 89 follow-up review path step ${coverageReviewPathStep.sourceFollowUpReviewPathStepId}, Stage 88 readiness row ${coverageReviewPathStep.sourceEvidenceGapReadinessRowId}, Stage 87 evidence-check review path step ${coverageReviewPathStep.sourceEvidenceCheckReviewPathStepId}, anchors ${joinOrNone(coverageReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(coverageReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(coverageReviewPathStep.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(coverageReviewPathStep.deferredScopeReminderIds)}, and Stage 91 labels ${joinOrNone([...coverageReviewPathStep.coverageReviewLabels, ...coverageReviewPathStep.responseCueLabels])} before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, coverage-review selections, response cue selections, response-readiness selections, draft-check state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static response-readiness board context: manual Stage 91 coverage-review-path, static-response-cue, source-lineage, anchor, callback, gap-prompt, deferred-reminder, and draft-check comparison only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved coverage-review selections, saved response cue selections, saved response-readiness selections, saved draft-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      coverageReviewPathStep.staticNonGoalFlags,
    ),
  };
}

function buildStaticDraftCheckCard(
  staticResponseCueCard: Stage91StaticResponseCueCard,
  coverageReviewPathSteps: Stage91Step[],
): ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoardStaticDraftCheckCardView {
  const sourceStaticResponseCueCardId = staticResponseCueCard.staticResponseCueCardId;
  const matchedCoverageReviewPathSteps = coverageReviewPathSteps.filter((step) =>
    stepMatchesStaticDraftCheckCard(step, staticResponseCueCard),
  );
  const sourceCoverageReviewPathStepIds = matchedCoverageReviewPathSteps.map(
    (step) => step.coverageReviewPathStepId,
  );
  const responseReadinessLabels = buildCardResponseReadinessLabels(
    staticResponseCueCard,
    matchedCoverageReviewPathSteps,
  );
  const staticDraftCheckLabels = buildCardStaticDraftCheckLabels(
    staticResponseCueCard,
    matchedCoverageReviewPathSteps,
  );
  const staticDraftCheckCardId =
    `constraint-response-evidence-gap-follow-up-coverage-review-response-readiness-board:static-draft-check:${sourceStaticResponseCueCardId}`;

  return {
    ...staticResponseCueCard,
    staticDraftCheckCardId,
    staticDraftCheckCardIds: [staticDraftCheckCardId],
    staticDraftCheckOrder: staticResponseCueCard.staticResponseCueOrder,
    sourceStaticResponseCueCardId,
    sourceStaticResponseCueCardIds: [sourceStaticResponseCueCardId],
    sourceCoverageReviewPathStepIds,
    responseReadinessLabels,
    staticDraftCheckLabels,
    responseReadinessText:
      `Response-readiness draft card ${sourceStaticResponseCueCardId}: carry Stage 91 static response cue card ${sourceStaticResponseCueCardId}, Stage 91 coverage-review path steps ${joinOrNone(sourceCoverageReviewPathStepIds)}, Stage 90 static review prompt card ${staticResponseCueCard.sourceStaticReviewPromptCardId}, Stage 90 coverage rows ${joinOrNone(staticResponseCueCard.sourceCoverageRowIds)}, Stage 89 static readiness cue ${staticResponseCueCard.sourceStaticReadinessCueCardId}, Stage 89 follow-up review path steps ${joinOrNone(staticResponseCueCard.sourceFollowUpReviewPathStepIds)}, Stage 88 static follow-up prompt card ${staticResponseCueCard.sourceStaticFollowUpPromptCardId}, Stage 88 readiness rows ${joinOrNone(staticResponseCueCard.sourceEvidenceGapReadinessRowIds)}, Stage 87 static citation-gap cue ${staticResponseCueCard.sourceStaticCitationGapCueCardId}, Stage 87 evidence-check review path steps ${joinOrNone(staticResponseCueCard.sourceEvidenceCheckReviewPathStepIds)}, Stage 86 citation-review lane row ${staticResponseCueCard.sourceCitationReviewLaneRowId}, Stage 86 static evidence-check prompt cards ${joinOrNone(staticResponseCueCard.sourceStaticEvidenceCheckPromptCardIds)}, Stage 85 citation prompt card ${staticResponseCueCard.sourceStaticCitationCheckPromptCardId}, Stage 85 source follow-up map entries ${joinOrNone(staticResponseCueCard.sourceSourceFollowUpMapEntryIds)}, anchors ${joinOrNone(staticResponseCueCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticResponseCueCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticResponseCueCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticResponseCueCard.deferredScopeReminderIds)}, and response-readiness labels ${joinOrNone(responseReadinessLabels)} as deterministic manual response-readiness context only.`,
    staticDraftCheckText:
      `Static draft-check card ${sourceStaticResponseCueCardId}: inspect Stage 91 static response cue card ${sourceStaticResponseCueCardId}, Stage 90 static review prompt card ${staticResponseCueCard.sourceStaticReviewPromptCardId}, Stage 89 static readiness cue ${staticResponseCueCard.sourceStaticReadinessCueCardId}, Stage 88 static follow-up prompt card ${staticResponseCueCard.sourceStaticFollowUpPromptCardId}, Stage 87 citation-gap cue ${staticResponseCueCard.sourceStaticCitationGapCueCardId}, Stage 86 citation-review lane row ${staticResponseCueCard.sourceCitationReviewLaneRowId}, Stage 85 citation prompt ${staticResponseCueCard.sourceStaticCitationCheckPromptCardId}, Stage 84 readiness rows ${joinOrNone(staticResponseCueCard.sourceSourceReadinessLaneRowIds)}, Stage 83 source-review path steps ${joinOrNone(staticResponseCueCard.sourceSourceReviewPathStepIds)}, Stage 82 crosswalk rows ${joinOrNone(staticResponseCueCard.sourceCrosswalkRowIds)}, Stage 81 review-path steps ${joinOrNone(staticResponseCueCard.sourceConstraintResponseReviewPathStepIds)}, anchors ${joinOrNone(staticResponseCueCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticResponseCueCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticResponseCueCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticResponseCueCard.deferredScopeReminderIds)}, static draft-check labels ${joinOrNone(staticDraftCheckLabels)}, and Stage 91 response cue text "${staticResponseCueCard.staticResponseCueText}" before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, response-readiness selections, draft-check state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static draft-check context: manual Stage 91 static-response-cue, coverage-review-path, source-lineage, anchor, callback, gap-prompt, and deferred-reminder review only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved response-readiness selections, saved draft-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticResponseCueCard.staticNonGoalFlags,
    ),
  };
}

function stepMatchesStaticDraftCheckCard(
  coverageReviewPathStep: Stage91Step,
  staticResponseCueCard: Stage91StaticResponseCueCard,
): boolean {
  return (
    coverageReviewPathStep.sourceStaticReviewPromptCardIds.includes(
      staticResponseCueCard.sourceStaticReviewPromptCardId,
    ) ||
    staticResponseCueCard.sourceCoverageRowIds.includes(
      coverageReviewPathStep.sourceCoverageRowId,
    ) ||
    staticResponseCueCard.sourceFollowUpReviewPathStepIds.includes(
      coverageReviewPathStep.sourceFollowUpReviewPathStepId,
    )
  );
}

function buildCounts(
  responseReadinessRows: ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoardRowView[],
  staticDraftCheckCards: ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoardStaticDraftCheckCardView[],
  coverageReviewPath: Stage91View,
): ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoardSummaryView["counts"] {
  const sourceCounts = coverageReviewPath.summary.counts;

  return {
    ...sourceCounts,
    responseReadinessRowCount: responseReadinessRows.length,
    staticDraftCheckCardCount: staticDraftCheckCards.length,
    responseReadinessLabelCount: unique([
      ...responseReadinessRows.flatMap((row) => row.responseReadinessLabels),
      ...staticDraftCheckCards.flatMap((card) => card.responseReadinessLabels),
    ]).length,
    staticDraftCheckLabelCount: unique([
      ...responseReadinessRows.flatMap((row) => row.staticDraftCheckLabels),
      ...staticDraftCheckCards.flatMap((card) => card.staticDraftCheckLabels),
    ]).length,
    localOnlyResponseReadinessRowCount: responseReadinessRows.filter(
      (row) => row.localOnly,
    ).length,
    localOnlyStaticDraftCheckCardCount: staticDraftCheckCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function buildRowResponseReadinessLabels(
  coverageReviewPathStep: Stage91Step,
  matchedStaticResponseCueCards: Stage91StaticResponseCueCard[],
): string[] {
  const labels = [
    "response-readiness row",
    "Stage 91 coverage-review path carry-forward",
  ];

  if (matchedStaticResponseCueCards.length) {
    labels.push("matched Stage 91 static response cue context");
  }

  if (coverageReviewPathStep.coverageReviewLabels.length) {
    labels.push("coverage-review label carry-forward");
  }

  return labels;
}

function buildRowStaticDraftCheckLabels(
  coverageReviewPathStep: Stage91Step,
  matchedStaticResponseCueCards: Stage91StaticResponseCueCard[],
): string[] {
  const labels = [
    "static draft-check carry-forward",
    "Stage 91 response cue comparison",
  ];

  if (matchedStaticResponseCueCards.length) {
    labels.push("matched static response cue draft check");
  }

  if (
    coverageReviewPathStep.gapDiscussionPointIds.length ||
    coverageReviewPathStep.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder draft check");
  }

  return labels;
}

function buildCardResponseReadinessLabels(
  staticResponseCueCard: Stage91StaticResponseCueCard,
  matchedCoverageReviewPathSteps: Stage91Step[],
): string[] {
  const labels = [
    "static draft-check response-readiness context",
    "Stage 91 static response cue card",
  ];

  if (matchedCoverageReviewPathSteps.length) {
    labels.push("matched response-readiness rows");
  }

  if (staticResponseCueCard.coverageReviewLabels.length) {
    labels.push("coverage-review cue label carry-forward");
  }

  return labels;
}

function buildCardStaticDraftCheckLabels(
  staticResponseCueCard: Stage91StaticResponseCueCard,
  matchedCoverageReviewPathSteps: Stage91Step[],
): string[] {
  const labels = [
    "static draft-check card",
    "Stage 91 static response cue carry-forward",
  ];

  if (matchedCoverageReviewPathSteps.length) {
    labels.push("matched response-readiness row context");
  }

  if (
    staticResponseCueCard.gapDiscussionPointIds.length ||
    staticResponseCueCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder draft check");
  }

  return labels;
}

function staticNonGoalFlags(
  sourceFlags: Stage91StaticNonGoalFlags,
): ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoardStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedResponseReadinessState: true,
    noSavedResponseReadinessSelections: true,
    noSavedDraftCheckState: true,
    noSavedDraftCheckSelections: true,
    noSavedStaticDraftCheckCards: true,
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
