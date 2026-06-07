import type {
  ConstraintResponseEvidenceGapFollowUpCoverageBoardRowView as Stage90Row,
  ConstraintResponseEvidenceGapFollowUpCoverageBoardStaticNonGoalFlagsView as Stage90StaticNonGoalFlags,
  ConstraintResponseEvidenceGapFollowUpCoverageBoardStaticReviewPromptCardView as Stage90StaticReviewPromptCard,
  ConstraintResponseEvidenceGapFollowUpCoverageBoardView as Stage90View,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewPathStaticNonGoalFlagsView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewPathStaticResponseCueCardView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewPathStepView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewPathSummaryView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewPathView,
} from "../features/mission-console/types.ts";

export function buildConstraintResponseEvidenceGapFollowUpCoverageReviewPath(
  evidenceGapFollowUpCoverageBoard: Stage90View | undefined,
): ConstraintResponseEvidenceGapFollowUpCoverageReviewPathView | undefined {
  if (
    !evidenceGapFollowUpCoverageBoard?.coverageRows.length ||
    !evidenceGapFollowUpCoverageBoard.staticReviewPromptCards.length
  ) {
    return undefined;
  }

  const coverageReviewPathSteps =
    evidenceGapFollowUpCoverageBoard.coverageRows.map((row) =>
      buildCoverageReviewPathStep(
        row,
        evidenceGapFollowUpCoverageBoard.staticReviewPromptCards,
      ),
    );
  const staticResponseCueCards =
    evidenceGapFollowUpCoverageBoard.staticReviewPromptCards.map((card) =>
      buildStaticResponseCueCard(
        card,
        evidenceGapFollowUpCoverageBoard.coverageRows,
      ),
    );
  const defaultCoverageReviewPathStep =
    coverageReviewPathSteps.find(
      (step) =>
        step.sourceCoverageRowId ===
        evidenceGapFollowUpCoverageBoard.defaultCoverageRow.coverageRowId,
    ) ?? coverageReviewPathSteps[0];
  const defaultStaticResponseCueCard =
    staticResponseCueCards.find(
      (card) =>
        card.sourceStaticReviewPromptCardId ===
        evidenceGapFollowUpCoverageBoard.defaultStaticReviewPromptCard
          .staticReviewPromptCardId,
    ) ?? staticResponseCueCards[0];
  const defaultStage90Context =
    evidenceGapFollowUpCoverageBoard.summary.defaultCoverageContext;

  return {
    schema:
      "telemforge.constraint_response_evidence_gap_follow_up_coverage_review_path.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response evidence-gap follow-up coverage-review path and static response cues",
    localStatus: evidenceGapFollowUpCoverageBoard.localStatus,
    summary: {
      constraintResponseEvidenceGapFollowUpCoverageReviewPathId:
        "candidate-local-constraint-response-evidence-gap-follow-up-coverage-review-path",
      label: "Local constraint-response evidence-gap follow-up coverage-review path",
      summary:
        "A static evidence-gap follow-up coverage-review path derives steps from Stage 90 coverage rows and static response cue cards from Stage 90 static review prompt cards so reviewers can walk coverage rows, review prompts, source lineage, local anchors, callbacks, gap prompts, deferred reminders, and response cues before drafting outside the app without saved answers, answer drafts, reviewer notes, response notes, coverage-review selections, response cue selections, coverage state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultCoverageReviewContext: {
        defaultCoverageReviewPathStepId:
          defaultCoverageReviewPathStep.coverageReviewPathStepId,
        defaultStaticResponseCueCardId:
          defaultStaticResponseCueCard.staticResponseCueCardId,
        defaultCoverageRowId: defaultCoverageReviewPathStep.sourceCoverageRowId,
        defaultStaticReviewPromptCardId:
          defaultStaticResponseCueCard.sourceStaticReviewPromptCardId,
        defaultFollowUpReviewPathStepId:
          defaultCoverageReviewPathStep.sourceFollowUpReviewPathStepId,
        defaultStaticReadinessCueCardId:
          defaultStaticResponseCueCard.sourceStaticReadinessCueCardId,
        defaultEvidenceGapReadinessRowId:
          defaultCoverageReviewPathStep.sourceEvidenceGapReadinessRowId,
        defaultStaticFollowUpPromptCardId:
          defaultStaticResponseCueCard.sourceStaticFollowUpPromptCardId,
        defaultEvidenceCheckReviewPathStepId:
          defaultCoverageReviewPathStep.sourceEvidenceCheckReviewPathStepId,
        defaultStaticCitationGapCueCardId:
          defaultStaticResponseCueCard.sourceStaticCitationGapCueCardId,
        defaultStaticEvidenceCheckPromptCardId:
          defaultCoverageReviewPathStep.sourceStaticEvidenceCheckPromptCardId,
        defaultCitationReviewLaneRowId:
          defaultStaticResponseCueCard.sourceCitationReviewLaneRowId,
        defaultStaticCitationCheckPromptCardId:
          defaultStaticResponseCueCard.sourceStaticCitationCheckPromptCardId,
        defaultSourceFollowUpMapEntryId:
          defaultCoverageReviewPathStep.sourceSourceFollowUpMapEntryId,
        sourceStage90CoverageBoardSummary:
          evidenceGapFollowUpCoverageBoard.summary.summary,
        sourceStage90DefaultCoverageContext: defaultStage90Context,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        coverageReviewPathSteps,
        staticResponseCueCards,
        evidenceGapFollowUpCoverageBoard,
      ),
    },
    defaultCoverageReviewPathStep,
    defaultStaticResponseCueCard,
    coverageReviewPathSteps,
    staticResponseCueCards,
    staticCoverageReviewPathBoundarySummary:
      "Stage 91 coverage-review path steps and static response cue cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, response notes, coverage-review selections, response cue selections, evidence-gap follow-up selections, coverage-board selections, coverage state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseEvidenceGapFollowUpCoverageBoard:
      evidenceGapFollowUpCoverageBoard,
  };
}

function buildCoverageReviewPathStep(
  coverageRow: Stage90Row,
  staticReviewPromptCards: Stage90StaticReviewPromptCard[],
): ConstraintResponseEvidenceGapFollowUpCoverageReviewPathStepView {
  const sourceCoverageRowId = coverageRow.coverageRowId;
  const matchedStaticReviewPromptCards = staticReviewPromptCards.filter((card) =>
    rowMatchesStaticResponseCueCard(coverageRow, card),
  );
  const sourceStaticReviewPromptCardIds =
    matchedStaticReviewPromptCards.map((card) => card.staticReviewPromptCardId);
  const coverageReviewLabels = buildStepCoverageReviewLabels(
    coverageRow,
    matchedStaticReviewPromptCards,
  );
  const responseCueLabels = buildStepResponseCueLabels(
    coverageRow,
    matchedStaticReviewPromptCards,
  );
  const coverageReviewPathStepId =
    `constraint-response-evidence-gap-follow-up-coverage-review-path:step:${sourceCoverageRowId}`;

  return {
    ...coverageRow,
    coverageReviewPathStepId,
    coverageReviewPathStepIds: [coverageReviewPathStepId],
    coverageReviewPathStepOrder: coverageRow.coverageRowOrder,
    sourceCoverageRowId,
    sourceCoverageRowIds: [sourceCoverageRowId],
    sourceStaticReviewPromptCardIds,
    coverageReviewLabels,
    responseCueLabels,
    coverageReviewText:
      `Coverage-review path step ${sourceCoverageRowId}: carry Stage 90 coverage row ${sourceCoverageRowId}, Stage 90 static review prompt cards ${joinOrNone(sourceStaticReviewPromptCardIds)}, Stage 89 follow-up review path step ${coverageRow.sourceFollowUpReviewPathStepId}, Stage 89 static readiness cue cards ${joinOrNone(coverageRow.sourceStaticReadinessCueCardIds)}, Stage 88 readiness row ${coverageRow.sourceEvidenceGapReadinessRowId}, Stage 88 static follow-up prompt cards ${joinOrNone(coverageRow.sourceStaticFollowUpPromptCardIds)}, Stage 87 evidence-check review path step ${coverageRow.sourceEvidenceCheckReviewPathStepId}, Stage 87 citation-gap cue cards ${joinOrNone(coverageRow.sourceStaticCitationGapCueCardIds)}, Stage 86 static evidence-check prompt card ${coverageRow.sourceStaticEvidenceCheckPromptCardId}, Stage 86 citation-review lane rows ${joinOrNone(coverageRow.sourceCitationReviewLaneRowIds)}, Stage 85 source follow-up map entry ${coverageRow.sourceSourceFollowUpMapEntryId}, Stage 85 citation prompt cards ${joinOrNone(coverageRow.sourceStaticCitationCheckPromptCardIds)}, Stage 84 readiness row ${coverageRow.sourceSourceReadinessLaneRowId}, Stage 84 cue cards ${joinOrNone(coverageRow.sourceStaticSourceFollowUpCueCardIds)}, Stage 83 source-review path step ${coverageRow.sourceSourceReviewPathStepId}, Stage 83 static source-review prompt cards ${joinOrNone(coverageRow.sourceStaticSourceReviewPromptCardIds)}, Stage 82 source-crosswalk row ${coverageRow.sourceCrosswalkRowId}, Stage 82 static review-check cards ${joinOrNone(coverageRow.sourceStaticReviewCheckCardIds)}, Stage 81 review-path step ${coverageRow.sourceConstraintResponseReviewPathStepId}, Stage 81 response-review prompt cards ${joinOrNone(coverageRow.sourceStaticResponseReviewPromptCardIds)}, Stage 80 constraint-coverage row ${coverageRow.sourceConstraintCoverageRowId}, Stage 80 response-note prompt cards ${joinOrNone(coverageRow.sourceStaticResponseNotePromptCardIds)}, Stage 79 answer-review step ${coverageRow.sourceAnswerReviewPathStepId}, Stage 79 constraint-note cards ${joinOrNone(coverageRow.sourceStaticConstraintNoteCardIds)}, Stage 78 answer-check card ${coverageRow.sourceStaticAnswerCheckCardId}, Stage 78 readiness rows ${joinOrNone(coverageRow.sourceResponsePromptReadinessRowIds)}, Stage 77 response-prompt cards ${joinOrNone(coverageRow.sourceStaticResponsePromptCardIds)}, Stage 77 response-map review-path step ${coverageRow.sourceResponseMapReviewPathStepId}, Stage 76 response-map row ${coverageRow.sourceResponseMapRowId}, Stage 75 coverage-review step ${coverageRow.sourceCoverageReviewPathStepId}, Stage 74 coverage row ${coverageRow.sourceCoverageMatrixRowId}, Stage 73 review-path step ${coverageRow.sourceReviewPathStepId}, Stage 72 source recap row ${coverageRow.sourceSourceRecapRowId}, Stage 71 review-lane row ${coverageRow.sourceAnswerFollowUpReviewLaneRowId}, Stage 70 crosswalk row ${coverageRow.sourceAnswerSourceCrosswalkRowId}, Stage 69 walkthrough step ${coverageRow.sourceAnswerWalkthroughStepId}, Stage 68 answer coverage row ${coverageRow.sourceAnswerCoverageRowId}, Stage 67 rehearsal step ${coverageRow.sourceRehearsalPathStepId}, Stage 66 board row ${coverageRow.sourceReviewBoardRowId}, Stage 65 brief row ${coverageRow.followUpReadinessBriefRowId}, Stage 64 triage row ${coverageRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${joinOrNone(coverageRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(coverageRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(coverageRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(coverageRow.deferredScopeReminderIds)}, coverage-review labels ${joinOrNone(coverageReviewLabels)}, response cue labels ${joinOrNone(responseCueLabels)}, Stage 90 coverage text "${coverageRow.coverageText}", and Stage 90 static review prompt text "${coverageRow.staticReviewPromptText}" as deterministic manual coverage-review context only.`,
    responseCueText:
      `Static response cue context for coverage-review path step ${sourceCoverageRowId}: compare Stage 90 coverage row ${sourceCoverageRowId}, Stage 90 static review prompt cards ${joinOrNone(sourceStaticReviewPromptCardIds)}, Stage 89 follow-up review path step ${coverageRow.sourceFollowUpReviewPathStepId}, Stage 89 static readiness cue cards ${joinOrNone(coverageRow.sourceStaticReadinessCueCardIds)}, Stage 88 readiness row ${coverageRow.sourceEvidenceGapReadinessRowId}, Stage 87 evidence-check review path step ${coverageRow.sourceEvidenceCheckReviewPathStepId}, anchors ${joinOrNone(coverageRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(coverageRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(coverageRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(coverageRow.deferredScopeReminderIds)}, and Stage 90 labels ${joinOrNone([...coverageRow.coverageLabels, ...coverageRow.staticReviewPromptLabels])} before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, coverage-review selections, response cue selections, coverage-board selections, coverage state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static evidence-gap follow-up coverage-review path context: manual Stage 90 coverage-row, static-review-prompt, source-lineage, anchor, callback, gap-prompt, deferred-reminder, and response-cue comparison only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved coverage-review selections, saved response cue selections, saved coverage-board selections, saved coverage state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(coverageRow.staticNonGoalFlags),
  };
}

function buildStaticResponseCueCard(
  staticReviewPromptCard: Stage90StaticReviewPromptCard,
  coverageRows: Stage90Row[],
): ConstraintResponseEvidenceGapFollowUpCoverageReviewPathStaticResponseCueCardView {
  const sourceStaticReviewPromptCardId =
    staticReviewPromptCard.staticReviewPromptCardId;
  const matchedCoverageRows = coverageRows.filter((row) =>
    rowMatchesStaticResponseCueCard(row, staticReviewPromptCard),
  );
  const sourceCoverageRowIds = matchedCoverageRows.map((row) => row.coverageRowId);
  const coverageReviewLabels = buildCardCoverageReviewLabels(
    staticReviewPromptCard,
    matchedCoverageRows,
  );
  const staticResponseCueLabels = buildCardStaticResponseCueLabels(
    staticReviewPromptCard,
    matchedCoverageRows,
  );
  const staticResponseCueCardId =
    `constraint-response-evidence-gap-follow-up-coverage-review-path:static-response-cue:${sourceStaticReviewPromptCardId}`;

  return {
    ...staticReviewPromptCard,
    staticResponseCueCardId,
    staticResponseCueCardIds: [staticResponseCueCardId],
    staticResponseCueOrder: staticReviewPromptCard.staticReviewPromptOrder,
    sourceStaticReviewPromptCardId,
    sourceStaticReviewPromptCardIds: [sourceStaticReviewPromptCardId],
    sourceCoverageRowIds,
    coverageReviewLabels,
    staticResponseCueLabels,
    coverageReviewText:
      `Coverage-review cue ${sourceStaticReviewPromptCardId}: carry Stage 90 static review prompt card ${sourceStaticReviewPromptCardId}, Stage 90 coverage rows ${joinOrNone(sourceCoverageRowIds)}, Stage 89 static readiness cue card ${staticReviewPromptCard.sourceStaticReadinessCueCardId}, Stage 89 follow-up review path steps ${joinOrNone(staticReviewPromptCard.sourceFollowUpReviewPathStepIds)}, Stage 88 static follow-up prompt card ${staticReviewPromptCard.sourceStaticFollowUpPromptCardId}, Stage 88 readiness rows ${joinOrNone(staticReviewPromptCard.sourceEvidenceGapReadinessRowIds)}, Stage 87 static citation-gap cue card ${staticReviewPromptCard.sourceStaticCitationGapCueCardId}, Stage 87 evidence-check review path steps ${joinOrNone(staticReviewPromptCard.sourceEvidenceCheckReviewPathStepIds)}, Stage 86 citation-review lane row ${staticReviewPromptCard.sourceCitationReviewLaneRowId}, Stage 86 static evidence-check prompt cards ${joinOrNone(staticReviewPromptCard.sourceStaticEvidenceCheckPromptCardIds)}, Stage 85 citation prompt card ${staticReviewPromptCard.sourceStaticCitationCheckPromptCardId}, Stage 85 source follow-up map entries ${joinOrNone(staticReviewPromptCard.sourceSourceFollowUpMapEntryIds)}, anchors ${joinOrNone(staticReviewPromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticReviewPromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticReviewPromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticReviewPromptCard.deferredScopeReminderIds)}, coverage-review labels ${joinOrNone(coverageReviewLabels)}, and Stage 90 coverage text "${staticReviewPromptCard.coverageText}" as deterministic manual coverage-review context only.`,
    staticResponseCueText:
      `Static response cue card ${sourceStaticReviewPromptCardId}: inspect Stage 90 static review prompt card ${sourceStaticReviewPromptCardId}, Stage 90 coverage rows ${joinOrNone(sourceCoverageRowIds)}, Stage 89 static readiness cue ${staticReviewPromptCard.sourceStaticReadinessCueCardId}, Stage 88 static follow-up prompt card ${staticReviewPromptCard.sourceStaticFollowUpPromptCardId}, Stage 87 citation-gap cue ${staticReviewPromptCard.sourceStaticCitationGapCueCardId}, Stage 86 citation-review lane row ${staticReviewPromptCard.sourceCitationReviewLaneRowId}, Stage 85 citation prompt ${staticReviewPromptCard.sourceStaticCitationCheckPromptCardId}, Stage 84 readiness rows ${joinOrNone(staticReviewPromptCard.sourceSourceReadinessLaneRowIds)}, Stage 83 source-review path steps ${joinOrNone(staticReviewPromptCard.sourceSourceReviewPathStepIds)}, Stage 82 crosswalk rows ${joinOrNone(staticReviewPromptCard.sourceCrosswalkRowIds)}, Stage 81 review-path steps ${joinOrNone(staticReviewPromptCard.sourceConstraintResponseReviewPathStepIds)}, anchors ${joinOrNone(staticReviewPromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticReviewPromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticReviewPromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticReviewPromptCard.deferredScopeReminderIds)}, static response cue labels ${joinOrNone(staticResponseCueLabels)}, and Stage 90 static review prompt text "${staticReviewPromptCard.staticReviewPromptText}" before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, coverage-review selections, response cue selections, coverage-board selections, coverage state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static response cue context: manual Stage 90 static-review-prompt, coverage-row, source-lineage, anchor, callback, gap-prompt, and deferred-reminder review only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved coverage-review selections, saved response cue selections, saved coverage-board selections, saved coverage state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticReviewPromptCard.staticNonGoalFlags,
    ),
  };
}

function rowMatchesStaticResponseCueCard(
  coverageRow: Stage90Row,
  staticReviewPromptCard: Stage90StaticReviewPromptCard,
): boolean {
  return (
    coverageRow.sourceStaticReadinessCueCardIds.includes(
      staticReviewPromptCard.sourceStaticReadinessCueCardId,
    ) ||
    staticReviewPromptCard.sourceFollowUpReviewPathStepIds.includes(
      coverageRow.sourceFollowUpReviewPathStepId,
    ) ||
    staticReviewPromptCard.sourceEvidenceGapReadinessRowIds.includes(
      coverageRow.sourceEvidenceGapReadinessRowId,
    )
  );
}

function buildCounts(
  coverageReviewPathSteps: ConstraintResponseEvidenceGapFollowUpCoverageReviewPathStepView[],
  staticResponseCueCards: ConstraintResponseEvidenceGapFollowUpCoverageReviewPathStaticResponseCueCardView[],
  evidenceGapFollowUpCoverageBoard: Stage90View,
): ConstraintResponseEvidenceGapFollowUpCoverageReviewPathSummaryView["counts"] {
  const sourceCounts = evidenceGapFollowUpCoverageBoard.summary.counts;

  return {
    ...sourceCounts,
    coverageReviewPathStepCount: coverageReviewPathSteps.length,
    staticResponseCueCardCount: staticResponseCueCards.length,
    coverageReviewLabelCount: unique([
      ...coverageReviewPathSteps.flatMap((step) => step.coverageReviewLabels),
      ...staticResponseCueCards.flatMap((card) => card.coverageReviewLabels),
    ]).length,
    responseCueLabelCount: unique([
      ...coverageReviewPathSteps.flatMap((step) => step.responseCueLabels),
      ...staticResponseCueCards.flatMap((card) => card.staticResponseCueLabels),
    ]).length,
    localOnlyCoverageReviewPathStepCount: coverageReviewPathSteps.filter(
      (step) => step.localOnly,
    ).length,
    localOnlyStaticResponseCueCardCount: staticResponseCueCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function buildStepCoverageReviewLabels(
  coverageRow: Stage90Row,
  matchedStaticReviewPromptCards: Stage90StaticReviewPromptCard[],
): string[] {
  const labels = [
    "coverage-review path step",
    "Stage 90 coverage row carry-forward",
  ];

  if (matchedStaticReviewPromptCards.length) {
    labels.push("matched Stage 90 static review prompt context");
  }

  if (coverageRow.coverageLabels.length) {
    labels.push("Stage 90 coverage label carry-forward");
  }

  return labels;
}

function buildStepResponseCueLabels(
  coverageRow: Stage90Row,
  matchedStaticReviewPromptCards: Stage90StaticReviewPromptCard[],
): string[] {
  const labels = [
    "static response cue context",
    "Stage 90 response cue carry-forward",
  ];

  if (matchedStaticReviewPromptCards.length) {
    labels.push("matched static review prompt response context");
  }

  if (
    coverageRow.gapDiscussionPointIds.length ||
    coverageRow.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder response cue");
  }

  return labels;
}

function buildCardCoverageReviewLabels(
  staticReviewPromptCard: Stage90StaticReviewPromptCard,
  matchedCoverageRows: Stage90Row[],
): string[] {
  const labels = [
    "static response cue coverage-review context",
    "Stage 90 static review prompt card",
  ];

  if (matchedCoverageRows.length) {
    labels.push("matched coverage-review path rows");
  }

  if (staticReviewPromptCard.coverageLabels.length) {
    labels.push("Stage 90 coverage prompt label carry-forward");
  }

  return labels;
}

function buildCardStaticResponseCueLabels(
  staticReviewPromptCard: Stage90StaticReviewPromptCard,
  matchedCoverageRows: Stage90Row[],
): string[] {
  const labels = [
    "static response cue card",
    "Stage 90 static review prompt carry-forward",
  ];

  if (matchedCoverageRows.length) {
    labels.push("matched coverage-review row context");
  }

  if (
    staticReviewPromptCard.gapDiscussionPointIds.length ||
    staticReviewPromptCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder response cue");
  }

  return labels;
}

function staticNonGoalFlags(
  sourceFlags: Stage90StaticNonGoalFlags,
): ConstraintResponseEvidenceGapFollowUpCoverageReviewPathStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedCoverageReviewPathState: true,
    noSavedCoverageReviewSelections: true,
    noSavedResponseCueState: true,
    noSavedResponseCueSelections: true,
    noSavedStaticResponseCueCards: true,
  };
}

function joinOrNone(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}
