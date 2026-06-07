import type {
  ConstraintResponseEvidenceCheckReviewPathStaticCitationGapCueCardView,
  ConstraintResponseEvidenceCheckReviewPathStaticNonGoalFlagsView,
  ConstraintResponseEvidenceCheckReviewPathStepView,
  ConstraintResponseEvidenceCheckReviewPathSummaryView,
  ConstraintResponseEvidenceCheckReviewPathView,
  ConstraintResponseSourceCitationReviewLaneRowView as Stage86Row,
  ConstraintResponseSourceCitationReviewLaneStaticEvidenceCheckPromptCardView as Stage86StaticEvidenceCard,
  ConstraintResponseSourceCitationReviewLaneStaticNonGoalFlagsView as Stage86StaticNonGoalFlags,
  ConstraintResponseSourceCitationReviewLaneView as Stage86View,
} from "../features/mission-console/types.ts";

export function buildConstraintResponseEvidenceCheckReviewPath(
  sourceCitationReviewLane: Stage86View | undefined,
): ConstraintResponseEvidenceCheckReviewPathView | undefined {
  if (
    !sourceCitationReviewLane?.staticEvidenceCheckPromptCards.length ||
    !sourceCitationReviewLane.citationReviewLaneRows.length
  ) {
    return undefined;
  }

  const evidenceCheckReviewPathSteps =
    sourceCitationReviewLane.staticEvidenceCheckPromptCards.map((card) =>
      buildEvidenceCheckReviewPathStep(
        card,
        sourceCitationReviewLane.citationReviewLaneRows,
      ),
    );
  const staticCitationGapCueCards =
    sourceCitationReviewLane.citationReviewLaneRows.map((row) =>
      buildStaticCitationGapCueCard(
        row,
        sourceCitationReviewLane.staticEvidenceCheckPromptCards,
      ),
    );
  const defaultEvidenceCheckReviewPathStep =
    evidenceCheckReviewPathSteps.find(
      (step) =>
        step.sourceStaticEvidenceCheckPromptCardId ===
        sourceCitationReviewLane.defaultStaticEvidenceCheckPromptCard
          .staticEvidenceCheckPromptCardId,
    ) ?? evidenceCheckReviewPathSteps[0];
  const defaultStaticCitationGapCueCard =
    staticCitationGapCueCards.find(
      (card) =>
        card.sourceCitationReviewLaneRowId ===
        sourceCitationReviewLane.defaultCitationReviewLaneRow
          .citationReviewLaneRowId,
    ) ?? staticCitationGapCueCards[0];
  const defaultStage86Context =
    sourceCitationReviewLane.summary.defaultCitationReviewContext;

  return {
    schema: "telemforge.constraint_response_evidence_check_review_path.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response evidence-check review path and static citation-gap cues",
    localStatus: sourceCitationReviewLane.localStatus,
    summary: {
      constraintResponseEvidenceCheckReviewPathId:
        "candidate-local-constraint-response-evidence-check-review-path",
      label: "Local constraint-response evidence-check review path",
      summary:
        "A static evidence-check review path derives from Stage 86 evidence-check prompt cards and static citation-gap cues derive from Stage 86 citation-review lane rows so reviewers can inspect evidence prompts, citation rows, source lineage, local anchors, callbacks, gaps, and deferred reminders before drafting outside the app without saved answers, drafts, reviewer notes, response notes, source selections, citation selections, evidence-check selections, evidence-check review state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultEvidenceCheckReviewContext: {
        defaultEvidenceCheckReviewPathStepId:
          defaultEvidenceCheckReviewPathStep.evidenceCheckReviewPathStepId,
        defaultStaticCitationGapCueCardId:
          defaultStaticCitationGapCueCard.staticCitationGapCueCardId,
        defaultStaticEvidenceCheckPromptCardId:
          defaultEvidenceCheckReviewPathStep.sourceStaticEvidenceCheckPromptCardId,
        defaultCitationReviewLaneRowId:
          defaultStaticCitationGapCueCard.sourceCitationReviewLaneRowId,
        defaultStaticCitationCheckPromptCardId:
          defaultStaticCitationGapCueCard.sourceStaticCitationCheckPromptCardId,
        defaultSourceFollowUpMapEntryId:
          defaultEvidenceCheckReviewPathStep.sourceSourceFollowUpMapEntryId,
        sourceStage86SourceCitationReviewLaneSummary:
          sourceCitationReviewLane.summary.summary,
        sourceStage86DefaultCitationReviewContext: defaultStage86Context,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        evidenceCheckReviewPathSteps,
        staticCitationGapCueCards,
        sourceCitationReviewLane,
      ),
    },
    defaultEvidenceCheckReviewPathStep,
    defaultStaticCitationGapCueCard,
    evidenceCheckReviewPathSteps,
    staticCitationGapCueCards,
    staticCitationGapBoundarySummary:
      "Stage 87 evidence-check review path steps and static citation-gap cue cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, evidence-check selections, evidence-check review state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseSourceCitationReviewLane: sourceCitationReviewLane,
  };
}

function buildEvidenceCheckReviewPathStep(
  staticEvidenceCheckPromptCard: Stage86StaticEvidenceCard,
  citationReviewLaneRows: Stage86Row[],
): ConstraintResponseEvidenceCheckReviewPathStepView {
  const sourceStaticEvidenceCheckPromptCardId =
    staticEvidenceCheckPromptCard.staticEvidenceCheckPromptCardId;
  const matchedCitationReviewLaneRows = citationReviewLaneRows.filter((row) =>
    rowMatchesEvidenceCard(row, staticEvidenceCheckPromptCard),
  );
  const sourceCitationReviewLaneRowIds = matchedCitationReviewLaneRows.map(
    (row) => row.citationReviewLaneRowId,
  );
  const evidenceCheckReviewLabels = buildStepEvidenceCheckReviewLabels(
    staticEvidenceCheckPromptCard,
    matchedCitationReviewLaneRows,
  );
  const citationGapCueLabels = buildStepCitationGapCueLabels(
    staticEvidenceCheckPromptCard,
    matchedCitationReviewLaneRows,
  );
  const evidenceCheckReviewPathStepId =
    `constraint-response-evidence-check-review-path:step:${sourceStaticEvidenceCheckPromptCardId}`;

  return {
    ...staticEvidenceCheckPromptCard,
    evidenceCheckReviewPathStepId,
    evidenceCheckReviewPathStepIds: [evidenceCheckReviewPathStepId],
    evidenceCheckReviewPathStepOrder:
      staticEvidenceCheckPromptCard.staticEvidenceCheckPromptOrder,
    sourceStaticEvidenceCheckPromptCardId,
    sourceStaticEvidenceCheckPromptCardIds: [
      sourceStaticEvidenceCheckPromptCardId,
    ],
    sourceCitationReviewLaneRowIds,
    sourceSourceReviewPathStepIds: [
      staticEvidenceCheckPromptCard.sourceSourceReviewPathStepId,
    ],
    sourceCrosswalkRowIds: [staticEvidenceCheckPromptCard.sourceCrosswalkRowId],
    sourceConstraintResponseReviewPathStepIds: [
      staticEvidenceCheckPromptCard.sourceConstraintResponseReviewPathStepId,
    ],
    sourceConstraintCoverageRowIds: [
      staticEvidenceCheckPromptCard.sourceConstraintCoverageRowId,
    ],
    sourceAnswerReviewPathStepIds: [
      staticEvidenceCheckPromptCard.sourceAnswerReviewPathStepId,
    ],
    sourceStaticAnswerCheckCardIds: [
      staticEvidenceCheckPromptCard.sourceStaticAnswerCheckCardId,
    ],
    sourceResponseMapRowIds: [
      staticEvidenceCheckPromptCard.sourceResponseMapRowId,
    ],
    sourceCoverageReviewPathStepIds: [
      staticEvidenceCheckPromptCard.sourceCoverageReviewPathStepId,
    ],
    sourceCoverageMatrixRowIds: [
      staticEvidenceCheckPromptCard.sourceCoverageMatrixRowId,
    ],
    sourceReviewPathStepIds: [
      staticEvidenceCheckPromptCard.sourceReviewPathStepId,
    ],
    sourceSourceRecapRowIds: [
      staticEvidenceCheckPromptCard.sourceSourceRecapRowId,
    ],
    sourceAnswerFollowUpReviewLaneRowIds: [
      staticEvidenceCheckPromptCard.sourceAnswerFollowUpReviewLaneRowId,
    ],
    sourceAnswerSourceCrosswalkRowIds: [
      staticEvidenceCheckPromptCard.sourceAnswerSourceCrosswalkRowId,
    ],
    sourceAnswerWalkthroughStepIds: [
      staticEvidenceCheckPromptCard.sourceAnswerWalkthroughStepId,
    ],
    sourceAnswerCoverageRowIds: [
      staticEvidenceCheckPromptCard.sourceAnswerCoverageRowId,
    ],
    sourceRehearsalPathStepIds: [
      staticEvidenceCheckPromptCard.sourceRehearsalPathStepId,
    ],
    sourceReviewBoardRowIds: [
      staticEvidenceCheckPromptCard.sourceReviewBoardRowId,
    ],
    sourceFollowUpReadinessBriefRowIds: [
      staticEvidenceCheckPromptCard.followUpReadinessBriefRowId,
    ],
    sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowIds:
      [
        staticEvidenceCheckPromptCard
          .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
      ],
    evidenceCheckReviewLabels,
    citationGapCueLabels,
    evidenceCheckReviewText:
      `Evidence-check review path step ${sourceStaticEvidenceCheckPromptCardId}: carry Stage 86 static evidence-check prompt card ${sourceStaticEvidenceCheckPromptCardId}, Stage 86 citation-review lane rows ${joinOrNone(sourceCitationReviewLaneRowIds)}, Stage 85 source follow-up map entry ${staticEvidenceCheckPromptCard.sourceSourceFollowUpMapEntryId}, Stage 85 citation prompt cards ${joinOrNone(staticEvidenceCheckPromptCard.sourceStaticCitationCheckPromptCardIds)}, Stage 84 readiness row ${staticEvidenceCheckPromptCard.sourceSourceReadinessLaneRowId}, Stage 84 cue cards ${joinOrNone(staticEvidenceCheckPromptCard.sourceStaticSourceFollowUpCueCardIds)}, Stage 83 source-review path step ${staticEvidenceCheckPromptCard.sourceSourceReviewPathStepId}, Stage 83 static source-review prompt cards ${joinOrNone(staticEvidenceCheckPromptCard.sourceStaticSourceReviewPromptCardIds)}, Stage 82 source-crosswalk row ${staticEvidenceCheckPromptCard.sourceCrosswalkRowId}, Stage 82 static review-check cards ${joinOrNone(staticEvidenceCheckPromptCard.sourceStaticReviewCheckCardIds)}, Stage 81 review-path step ${staticEvidenceCheckPromptCard.sourceConstraintResponseReviewPathStepId}, Stage 81 response-review prompt cards ${joinOrNone(staticEvidenceCheckPromptCard.sourceStaticResponseReviewPromptCardIds)}, Stage 80 constraint-coverage row ${staticEvidenceCheckPromptCard.sourceConstraintCoverageRowId}, Stage 80 response-note prompt cards ${joinOrNone(staticEvidenceCheckPromptCard.sourceStaticResponseNotePromptCardIds)}, Stage 79 answer-review step ${staticEvidenceCheckPromptCard.sourceAnswerReviewPathStepId}, Stage 79 constraint-note cards ${joinOrNone(staticEvidenceCheckPromptCard.sourceStaticConstraintNoteCardIds)}, Stage 78 answer-check card ${staticEvidenceCheckPromptCard.sourceStaticAnswerCheckCardId}, Stage 78 readiness rows ${joinOrNone(staticEvidenceCheckPromptCard.sourceResponsePromptReadinessRowIds)}, Stage 77 response-prompt cards ${joinOrNone(staticEvidenceCheckPromptCard.sourceStaticResponsePromptCardIds)}, Stage 77 response-map review-path step ${staticEvidenceCheckPromptCard.sourceResponseMapReviewPathStepId}, Stage 76 response-map row ${staticEvidenceCheckPromptCard.sourceResponseMapRowId}, Stage 75 coverage-review step ${staticEvidenceCheckPromptCard.sourceCoverageReviewPathStepId}, Stage 74 coverage row ${staticEvidenceCheckPromptCard.sourceCoverageMatrixRowId}, Stage 73 review-path step ${staticEvidenceCheckPromptCard.sourceReviewPathStepId}, Stage 72 source recap row ${staticEvidenceCheckPromptCard.sourceSourceRecapRowId}, Stage 71 review-lane row ${staticEvidenceCheckPromptCard.sourceAnswerFollowUpReviewLaneRowId}, Stage 70 crosswalk row ${staticEvidenceCheckPromptCard.sourceAnswerSourceCrosswalkRowId}, Stage 69 walkthrough step ${staticEvidenceCheckPromptCard.sourceAnswerWalkthroughStepId}, Stage 68 answer coverage row ${staticEvidenceCheckPromptCard.sourceAnswerCoverageRowId}, Stage 67 rehearsal step ${staticEvidenceCheckPromptCard.sourceRehearsalPathStepId}, Stage 66 board row ${staticEvidenceCheckPromptCard.sourceReviewBoardRowId}, Stage 65 brief row ${staticEvidenceCheckPromptCard.followUpReadinessBriefRowId}, Stage 64 triage row ${staticEvidenceCheckPromptCard.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${joinOrNone(staticEvidenceCheckPromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticEvidenceCheckPromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticEvidenceCheckPromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticEvidenceCheckPromptCard.deferredScopeReminderIds)}, evidence-check review labels ${joinOrNone(evidenceCheckReviewLabels)}, citation-gap cue labels ${joinOrNone(citationGapCueLabels)}, and Stage 86 evidence prompt text "${staticEvidenceCheckPromptCard.evidenceCheckPromptText}" as deterministic manual evidence-check review context only.`,
    citationGapCueText:
      `Static citation-gap cue for evidence-check step ${sourceStaticEvidenceCheckPromptCardId}: compare matched Stage 86 citation-review rows ${joinOrNone(sourceCitationReviewLaneRowIds)}, Stage 85 citation prompts ${joinOrNone(staticEvidenceCheckPromptCard.sourceStaticCitationCheckPromptCardIds)}, source follow-up entry ${staticEvidenceCheckPromptCard.sourceSourceFollowUpMapEntryId}, local anchors ${joinOrNone(staticEvidenceCheckPromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticEvidenceCheckPromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticEvidenceCheckPromptCard.gapDiscussionPointIds)}, and deferred reminders ${joinOrNone(staticEvidenceCheckPromptCard.deferredScopeReminderIds)} before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, evidence-check selections, evidence-check review state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static evidence-check review path context: manual evidence-prompt, citation-row, source-lineage, anchor, callback, gap, and deferred-reminder review only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved evidence-check selections, saved evidence-check review path state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticEvidenceCheckPromptCard.staticNonGoalFlags,
    ),
  };
}

function buildStaticCitationGapCueCard(
  citationReviewLaneRow: Stage86Row,
  staticEvidenceCheckPromptCards: Stage86StaticEvidenceCard[],
): ConstraintResponseEvidenceCheckReviewPathStaticCitationGapCueCardView {
  const sourceCitationReviewLaneRowId =
    citationReviewLaneRow.citationReviewLaneRowId;
  const matchedStaticEvidenceCheckPromptCards =
    staticEvidenceCheckPromptCards.filter((card) =>
      rowMatchesEvidenceCard(citationReviewLaneRow, card),
    );
  const sourceStaticEvidenceCheckPromptCardIds =
    matchedStaticEvidenceCheckPromptCards.map(
      (card) => card.staticEvidenceCheckPromptCardId,
    );
  const evidenceCheckReviewLabels = buildCueEvidenceCheckReviewLabels(
    citationReviewLaneRow,
    matchedStaticEvidenceCheckPromptCards,
  );
  const citationGapCueLabels = buildCueCitationGapCueLabels(
    citationReviewLaneRow,
    matchedStaticEvidenceCheckPromptCards,
  );
  const staticCitationGapCueCardId =
    `constraint-response-evidence-check-review-path:static-citation-gap-cue:${sourceCitationReviewLaneRowId}`;

  return {
    ...citationReviewLaneRow,
    staticCitationGapCueCardId,
    staticCitationGapCueCardIds: [staticCitationGapCueCardId],
    staticCitationGapCueOrder: citationReviewLaneRow.citationReviewLaneRowOrder,
    sourceCitationReviewLaneRowId,
    sourceCitationReviewLaneRowIds: [sourceCitationReviewLaneRowId],
    sourceStaticEvidenceCheckPromptCardIds,
    evidenceCheckReviewLabels,
    citationGapCueLabels,
    evidenceCheckReviewText:
      `Evidence-check review cue ${sourceCitationReviewLaneRowId}: carry Stage 86 citation-review lane row ${sourceCitationReviewLaneRowId}, matched Stage 86 static evidence-check prompt cards ${joinOrNone(sourceStaticEvidenceCheckPromptCardIds)}, Stage 85 citation prompt card ${citationReviewLaneRow.sourceStaticCitationCheckPromptCardId}, Stage 85 source follow-up map entries ${joinOrNone(citationReviewLaneRow.sourceSourceFollowUpMapEntryIds)}, Stage 84 readiness rows ${joinOrNone(citationReviewLaneRow.sourceSourceReadinessLaneRowIds)}, Stage 83 source-review path steps ${joinOrNone(citationReviewLaneRow.sourceSourceReviewPathStepIds)}, Stage 82 source-crosswalk rows ${joinOrNone(citationReviewLaneRow.sourceCrosswalkRowIds)}, anchors ${joinOrNone(citationReviewLaneRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(citationReviewLaneRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(citationReviewLaneRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(citationReviewLaneRow.deferredScopeReminderIds)}, and evidence-check review labels ${joinOrNone(evidenceCheckReviewLabels)} as deterministic manual evidence-check context only.`,
    citationGapCueText:
      `Static citation-gap cue card ${sourceCitationReviewLaneRowId}: inspect Stage 86 citation-review row ${sourceCitationReviewLaneRowId}, Stage 86 static evidence-check prompts ${joinOrNone(sourceStaticEvidenceCheckPromptCardIds)}, Stage 85 static citation prompt ${citationReviewLaneRow.sourceStaticCitationCheckPromptCardId}, Stage 85 follow-up entries ${joinOrNone(citationReviewLaneRow.sourceSourceFollowUpMapEntryIds)}, Stage 84 cue ${citationReviewLaneRow.sourceStaticSourceFollowUpCueCardId}, Stage 83 source-review prompts ${joinOrNone(citationReviewLaneRow.sourceStaticSourceReviewPromptCardIds)}, Stage 82 review-check cards ${joinOrNone(citationReviewLaneRow.sourceStaticReviewCheckCardIds)}, local anchors ${joinOrNone(citationReviewLaneRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(citationReviewLaneRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(citationReviewLaneRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(citationReviewLaneRow.deferredScopeReminderIds)}, citation-gap labels ${joinOrNone(citationGapCueLabels)}, and Stage 86 citation-review text "${citationReviewLaneRow.citationReviewText}" before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, evidence-check selections, evidence-check review state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static citation-gap cue context: manual citation-gap, source-lineage, anchor, callback, gap-prompt, and deferred-reminder review only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved evidence-check selections, saved evidence-check review path state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      citationReviewLaneRow.staticNonGoalFlags,
    ),
  };
}

function rowMatchesEvidenceCard(
  citationReviewLaneRow: Stage86Row,
  staticEvidenceCheckPromptCard: Stage86StaticEvidenceCard,
): boolean {
  return (
    citationReviewLaneRow.sourceSourceFollowUpMapEntryIds.includes(
      staticEvidenceCheckPromptCard.sourceSourceFollowUpMapEntryId,
    ) ||
    staticEvidenceCheckPromptCard.sourceStaticCitationCheckPromptCardIds.includes(
      citationReviewLaneRow.sourceStaticCitationCheckPromptCardId,
    )
  );
}

function buildCounts(
  evidenceCheckReviewPathSteps: ConstraintResponseEvidenceCheckReviewPathStepView[],
  staticCitationGapCueCards: ConstraintResponseEvidenceCheckReviewPathStaticCitationGapCueCardView[],
  sourceCitationReviewLane: Stage86View,
): ConstraintResponseEvidenceCheckReviewPathSummaryView["counts"] {
  const sourceCounts = sourceCitationReviewLane.summary.counts;

  return {
    ...sourceCounts,
    evidenceCheckReviewPathStepCount: evidenceCheckReviewPathSteps.length,
    staticCitationGapCueCardCount: staticCitationGapCueCards.length,
    evidenceCheckReviewLabelCount: unique([
      ...evidenceCheckReviewPathSteps.flatMap(
        (step) => step.evidenceCheckReviewLabels,
      ),
      ...staticCitationGapCueCards.flatMap(
        (card) => card.evidenceCheckReviewLabels,
      ),
    ]).length,
    citationGapCueLabelCount: unique([
      ...evidenceCheckReviewPathSteps.flatMap(
        (step) => step.citationGapCueLabels,
      ),
      ...staticCitationGapCueCards.flatMap(
        (card) => card.citationGapCueLabels,
      ),
    ]).length,
    localOnlyEvidenceCheckReviewPathStepCount:
      evidenceCheckReviewPathSteps.filter((step) => step.localOnly).length,
    localOnlyStaticCitationGapCueCardCount: staticCitationGapCueCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function buildStepEvidenceCheckReviewLabels(
  staticEvidenceCheckPromptCard: Stage86StaticEvidenceCard,
  matchedCitationReviewLaneRows: Stage86Row[],
): string[] {
  const labels = [
    "evidence-check review path step",
    "Stage 86 static evidence-check prompt carry-forward",
  ];

  if (matchedCitationReviewLaneRows.length) {
    labels.push("matched Stage 86 citation-review row context");
  }

  if (staticEvidenceCheckPromptCard.evidenceCheckLabels.length) {
    labels.push("Stage 86 evidence-check label carry-forward");
  }

  return labels;
}

function buildStepCitationGapCueLabels(
  staticEvidenceCheckPromptCard: Stage86StaticEvidenceCard,
  matchedCitationReviewLaneRows: Stage86Row[],
): string[] {
  const labels = [
    "matched citation-gap cue context",
    "evidence prompt citation-gap review",
  ];

  if (matchedCitationReviewLaneRows.length) {
    labels.push("citation-review lane row alignment");
  }

  if (
    staticEvidenceCheckPromptCard.gapDiscussionPointIds.length ||
    staticEvidenceCheckPromptCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder context");
  }

  return labels;
}

function buildCueEvidenceCheckReviewLabels(
  citationReviewLaneRow: Stage86Row,
  matchedStaticEvidenceCheckPromptCards: Stage86StaticEvidenceCard[],
): string[] {
  const labels = [
    "citation row evidence-check carry-forward",
    "Stage 86 citation-review lane row",
  ];

  if (matchedStaticEvidenceCheckPromptCards.length) {
    labels.push("matched static evidence-check prompt context");
  }

  if (citationReviewLaneRow.evidenceCheckLabels.length) {
    labels.push("Stage 86 evidence-check label carry-forward");
  }

  return labels;
}

function buildCueCitationGapCueLabels(
  citationReviewLaneRow: Stage86Row,
  matchedStaticEvidenceCheckPromptCards: Stage86StaticEvidenceCard[],
): string[] {
  const labels = [
    "static citation-gap cue card",
    "Stage 86 citation-review row gap context",
  ];

  if (matchedStaticEvidenceCheckPromptCards.length) {
    labels.push("matched evidence prompt gap cue");
  }

  if (
    citationReviewLaneRow.gapDiscussionPointIds.length ||
    citationReviewLaneRow.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder context");
  }

  return labels;
}

function staticNonGoalFlags(
  sourceFlags: Stage86StaticNonGoalFlags,
): ConstraintResponseEvidenceCheckReviewPathStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedEvidenceCheckReviewState: true,
    noSavedEvidenceCheckReviewPathState: true,
    noSavedEvidenceCheckSelections: true,
    noSavedStaticEvidenceCheckReviewSteps: true,
    noSavedStaticCitationGapCueState: true,
    noSavedStaticCitationGapCueCards: true,
  };
}

function joinOrNone(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}
