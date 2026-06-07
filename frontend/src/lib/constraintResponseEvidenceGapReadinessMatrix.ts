import type {
  ConstraintResponseEvidenceCheckReviewPathStaticCitationGapCueCardView as Stage87StaticCitationGapCueCard,
  ConstraintResponseEvidenceCheckReviewPathStaticNonGoalFlagsView as Stage87StaticNonGoalFlags,
  ConstraintResponseEvidenceCheckReviewPathStepView as Stage87Step,
  ConstraintResponseEvidenceCheckReviewPathView as Stage87View,
  ConstraintResponseEvidenceGapReadinessMatrixRowView,
  ConstraintResponseEvidenceGapReadinessMatrixStaticFollowUpPromptCardView,
  ConstraintResponseEvidenceGapReadinessMatrixStaticNonGoalFlagsView,
  ConstraintResponseEvidenceGapReadinessMatrixSummaryView,
  ConstraintResponseEvidenceGapReadinessMatrixView,
} from "../features/mission-console/types.ts";

export function buildConstraintResponseEvidenceGapReadinessMatrix(
  evidenceCheckReviewPath: Stage87View | undefined,
): ConstraintResponseEvidenceGapReadinessMatrixView | undefined {
  if (
    !evidenceCheckReviewPath?.evidenceCheckReviewPathSteps.length ||
    !evidenceCheckReviewPath.staticCitationGapCueCards.length
  ) {
    return undefined;
  }

  const evidenceGapReadinessRows =
    evidenceCheckReviewPath.evidenceCheckReviewPathSteps.map((step) =>
      buildEvidenceGapReadinessRow(
        step,
        evidenceCheckReviewPath.staticCitationGapCueCards,
      ),
    );
  const staticFollowUpPromptCards =
    evidenceCheckReviewPath.staticCitationGapCueCards.map((card) =>
      buildStaticFollowUpPromptCard(
        card,
        evidenceCheckReviewPath.evidenceCheckReviewPathSteps,
      ),
    );
  const defaultEvidenceGapReadinessRow =
    evidenceGapReadinessRows.find(
      (row) =>
        row.sourceEvidenceCheckReviewPathStepId ===
        evidenceCheckReviewPath.defaultEvidenceCheckReviewPathStep
          .evidenceCheckReviewPathStepId,
    ) ?? evidenceGapReadinessRows[0];
  const defaultStaticFollowUpPromptCard =
    staticFollowUpPromptCards.find(
      (card) =>
        card.sourceStaticCitationGapCueCardId ===
        evidenceCheckReviewPath.defaultStaticCitationGapCueCard
          .staticCitationGapCueCardId,
    ) ?? staticFollowUpPromptCards[0];
  const defaultStage87Context =
    evidenceCheckReviewPath.summary.defaultEvidenceCheckReviewContext;

  return {
    schema: "telemforge.constraint_response_evidence_gap_readiness_matrix.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response evidence-gap readiness matrix and static follow-up prompts",
    localStatus: evidenceCheckReviewPath.localStatus,
    summary: {
      constraintResponseEvidenceGapReadinessMatrixId:
        "candidate-local-constraint-response-evidence-gap-readiness-matrix",
      label: "Local constraint-response evidence-gap readiness matrix",
      summary:
        "A static evidence-gap readiness matrix derives from Stage 87 evidence-check review path steps and static follow-up prompt cards derive from Stage 87 citation-gap cue cards so reviewers can compare review path steps, citation-gap cues, source lineage, local anchors, callbacks, gap prompts, and deferred reminders before drafting outside the app without saved answers, drafts, reviewer notes, response notes, source selections, citation selections, evidence-check selections, evidence-gap readiness state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultEvidenceGapReadinessContext: {
        defaultEvidenceGapReadinessRowId:
          defaultEvidenceGapReadinessRow.evidenceGapReadinessRowId,
        defaultStaticFollowUpPromptCardId:
          defaultStaticFollowUpPromptCard.staticFollowUpPromptCardId,
        defaultEvidenceCheckReviewPathStepId:
          defaultEvidenceGapReadinessRow.sourceEvidenceCheckReviewPathStepId,
        defaultStaticCitationGapCueCardId:
          defaultStaticFollowUpPromptCard.sourceStaticCitationGapCueCardId,
        defaultStaticEvidenceCheckPromptCardId:
          defaultEvidenceGapReadinessRow.sourceStaticEvidenceCheckPromptCardId,
        defaultCitationReviewLaneRowId:
          defaultStaticFollowUpPromptCard.sourceCitationReviewLaneRowId,
        defaultStaticCitationCheckPromptCardId:
          defaultStaticFollowUpPromptCard.sourceStaticCitationCheckPromptCardId,
        defaultSourceFollowUpMapEntryId:
          defaultEvidenceGapReadinessRow.sourceSourceFollowUpMapEntryId,
        sourceStage87EvidenceCheckReviewPathSummary:
          evidenceCheckReviewPath.summary.summary,
        sourceStage87DefaultEvidenceCheckReviewContext: defaultStage87Context,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        evidenceGapReadinessRows,
        staticFollowUpPromptCards,
        evidenceCheckReviewPath,
      ),
    },
    defaultEvidenceGapReadinessRow,
    defaultStaticFollowUpPromptCard,
    evidenceGapReadinessRows,
    staticFollowUpPromptCards,
    staticEvidenceGapReadinessBoundarySummary:
      "Stage 88 evidence-gap readiness rows and static follow-up prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, evidence-check selections, evidence-gap readiness state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseEvidenceCheckReviewPath: evidenceCheckReviewPath,
  };
}

function buildEvidenceGapReadinessRow(
  evidenceCheckReviewPathStep: Stage87Step,
  staticCitationGapCueCards: Stage87StaticCitationGapCueCard[],
): ConstraintResponseEvidenceGapReadinessMatrixRowView {
  const sourceEvidenceCheckReviewPathStepId =
    evidenceCheckReviewPathStep.evidenceCheckReviewPathStepId;
  const matchedStaticCitationGapCueCards = staticCitationGapCueCards.filter(
    (card) => stepMatchesCitationGapCueCard(evidenceCheckReviewPathStep, card),
  );
  const sourceStaticCitationGapCueCardIds = matchedStaticCitationGapCueCards.map(
    (card) => card.staticCitationGapCueCardId,
  );
  const readinessLabels = buildRowReadinessLabels(
    evidenceCheckReviewPathStep,
    matchedStaticCitationGapCueCards,
  );
  const followUpPromptLabels = buildRowFollowUpPromptLabels(
    evidenceCheckReviewPathStep,
    matchedStaticCitationGapCueCards,
  );
  const evidenceGapReadinessRowId =
    `constraint-response-evidence-gap-readiness-matrix:row:${sourceEvidenceCheckReviewPathStepId}`;

  return {
    ...evidenceCheckReviewPathStep,
    evidenceGapReadinessRowId,
    evidenceGapReadinessRowIds: [evidenceGapReadinessRowId],
    evidenceGapReadinessRowOrder:
      evidenceCheckReviewPathStep.evidenceCheckReviewPathStepOrder,
    sourceEvidenceCheckReviewPathStepId,
    sourceEvidenceCheckReviewPathStepIds: [sourceEvidenceCheckReviewPathStepId],
    sourceStaticCitationGapCueCardIds,
    sourceResponseMapReviewPathStepIds: [
      evidenceCheckReviewPathStep.sourceResponseMapReviewPathStepId,
    ],
    readinessLabels,
    followUpPromptLabels,
    readinessText:
      `Evidence-gap readiness row ${sourceEvidenceCheckReviewPathStepId}: carry Stage 87 evidence-check review path step ${sourceEvidenceCheckReviewPathStepId}, Stage 87 static citation-gap cue cards ${joinOrNone(sourceStaticCitationGapCueCardIds)}, Stage 86 static evidence-check prompt card ${evidenceCheckReviewPathStep.sourceStaticEvidenceCheckPromptCardId}, Stage 86 citation-review lane rows ${joinOrNone(evidenceCheckReviewPathStep.sourceCitationReviewLaneRowIds)}, Stage 85 source follow-up map entry ${evidenceCheckReviewPathStep.sourceSourceFollowUpMapEntryId}, Stage 85 citation prompt cards ${joinOrNone(evidenceCheckReviewPathStep.sourceStaticCitationCheckPromptCardIds)}, Stage 84 readiness row ${evidenceCheckReviewPathStep.sourceSourceReadinessLaneRowId}, Stage 84 cue cards ${joinOrNone(evidenceCheckReviewPathStep.sourceStaticSourceFollowUpCueCardIds)}, Stage 83 source-review path step ${evidenceCheckReviewPathStep.sourceSourceReviewPathStepId}, Stage 83 static source-review prompt cards ${joinOrNone(evidenceCheckReviewPathStep.sourceStaticSourceReviewPromptCardIds)}, Stage 82 source-crosswalk row ${evidenceCheckReviewPathStep.sourceCrosswalkRowId}, Stage 82 static review-check cards ${joinOrNone(evidenceCheckReviewPathStep.sourceStaticReviewCheckCardIds)}, Stage 81 review-path step ${evidenceCheckReviewPathStep.sourceConstraintResponseReviewPathStepId}, Stage 81 response-review prompt cards ${joinOrNone(evidenceCheckReviewPathStep.sourceStaticResponseReviewPromptCardIds)}, Stage 80 constraint-coverage row ${evidenceCheckReviewPathStep.sourceConstraintCoverageRowId}, Stage 80 response-note prompt cards ${joinOrNone(evidenceCheckReviewPathStep.sourceStaticResponseNotePromptCardIds)}, Stage 79 answer-review step ${evidenceCheckReviewPathStep.sourceAnswerReviewPathStepId}, Stage 79 constraint-note cards ${joinOrNone(evidenceCheckReviewPathStep.sourceStaticConstraintNoteCardIds)}, Stage 78 answer-check card ${evidenceCheckReviewPathStep.sourceStaticAnswerCheckCardId}, Stage 78 readiness rows ${joinOrNone(evidenceCheckReviewPathStep.sourceResponsePromptReadinessRowIds)}, Stage 77 response-prompt cards ${joinOrNone(evidenceCheckReviewPathStep.sourceStaticResponsePromptCardIds)}, Stage 77 response-map review-path step ${evidenceCheckReviewPathStep.sourceResponseMapReviewPathStepId}, Stage 76 response-map row ${evidenceCheckReviewPathStep.sourceResponseMapRowId}, Stage 75 coverage-review step ${evidenceCheckReviewPathStep.sourceCoverageReviewPathStepId}, Stage 74 coverage row ${evidenceCheckReviewPathStep.sourceCoverageMatrixRowId}, Stage 73 review-path step ${evidenceCheckReviewPathStep.sourceReviewPathStepId}, Stage 72 source recap row ${evidenceCheckReviewPathStep.sourceSourceRecapRowId}, Stage 71 review-lane row ${evidenceCheckReviewPathStep.sourceAnswerFollowUpReviewLaneRowId}, Stage 70 crosswalk row ${evidenceCheckReviewPathStep.sourceAnswerSourceCrosswalkRowId}, Stage 69 walkthrough step ${evidenceCheckReviewPathStep.sourceAnswerWalkthroughStepId}, Stage 68 answer coverage row ${evidenceCheckReviewPathStep.sourceAnswerCoverageRowId}, Stage 67 rehearsal step ${evidenceCheckReviewPathStep.sourceRehearsalPathStepId}, Stage 66 board row ${evidenceCheckReviewPathStep.sourceReviewBoardRowId}, Stage 65 brief row ${evidenceCheckReviewPathStep.followUpReadinessBriefRowId}, Stage 64 triage row ${evidenceCheckReviewPathStep.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${joinOrNone(evidenceCheckReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(evidenceCheckReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(evidenceCheckReviewPathStep.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(evidenceCheckReviewPathStep.deferredScopeReminderIds)}, readiness labels ${joinOrNone(readinessLabels)}, follow-up prompt labels ${joinOrNone(followUpPromptLabels)}, and Stage 87 evidence-check text "${evidenceCheckReviewPathStep.evidenceCheckReviewText}" as deterministic manual evidence-gap readiness context only.`,
    followUpPromptText:
      `Static follow-up prompt context for readiness row ${sourceEvidenceCheckReviewPathStepId}: compare Stage 87 evidence-check review path step ${sourceEvidenceCheckReviewPathStepId}, Stage 87 citation-gap cue cards ${joinOrNone(sourceStaticCitationGapCueCardIds)}, matched Stage 86 citation-review rows ${joinOrNone(evidenceCheckReviewPathStep.sourceCitationReviewLaneRowIds)}, Stage 85 citation prompt cards ${joinOrNone(evidenceCheckReviewPathStep.sourceStaticCitationCheckPromptCardIds)}, anchors ${joinOrNone(evidenceCheckReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(evidenceCheckReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(evidenceCheckReviewPathStep.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(evidenceCheckReviewPathStep.deferredScopeReminderIds)}, readiness labels ${joinOrNone(readinessLabels)}, and Stage 87 citation-gap cue text "${evidenceCheckReviewPathStep.citationGapCueText}" before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, evidence-check selections, evidence-gap readiness state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static evidence-gap readiness row context: manual review-path, citation-gap, source-lineage, anchor, callback, gap-prompt, and deferred-reminder comparison only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved evidence-check selections, saved evidence-gap readiness state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      evidenceCheckReviewPathStep.staticNonGoalFlags,
    ),
  };
}

function buildStaticFollowUpPromptCard(
  staticCitationGapCueCard: Stage87StaticCitationGapCueCard,
  evidenceCheckReviewPathSteps: Stage87Step[],
): ConstraintResponseEvidenceGapReadinessMatrixStaticFollowUpPromptCardView {
  const sourceStaticCitationGapCueCardId =
    staticCitationGapCueCard.staticCitationGapCueCardId;
  const matchedEvidenceCheckReviewPathSteps = evidenceCheckReviewPathSteps.filter(
    (step) => stepMatchesCitationGapCueCard(step, staticCitationGapCueCard),
  );
  const sourceEvidenceCheckReviewPathStepIds =
    matchedEvidenceCheckReviewPathSteps.map(
      (step) => step.evidenceCheckReviewPathStepId,
    );
  const readinessLabels = buildCardReadinessLabels(
    staticCitationGapCueCard,
    matchedEvidenceCheckReviewPathSteps,
  );
  const followUpPromptLabels = buildCardFollowUpPromptLabels(
    staticCitationGapCueCard,
    matchedEvidenceCheckReviewPathSteps,
  );
  const staticFollowUpPromptCardId =
    `constraint-response-evidence-gap-readiness-matrix:static-follow-up-prompt:${sourceStaticCitationGapCueCardId}`;

  return {
    ...staticCitationGapCueCard,
    staticFollowUpPromptCardId,
    staticFollowUpPromptCardIds: [staticFollowUpPromptCardId],
    staticFollowUpPromptOrder: staticCitationGapCueCard.staticCitationGapCueOrder,
    sourceStaticCitationGapCueCardId,
    sourceStaticCitationGapCueCardIds: [sourceStaticCitationGapCueCardId],
    sourceEvidenceCheckReviewPathStepIds,
    readinessLabels,
    followUpPromptLabels,
    readinessText:
      `Evidence-gap readiness cue ${sourceStaticCitationGapCueCardId}: carry Stage 87 static citation-gap cue card ${sourceStaticCitationGapCueCardId}, Stage 87 evidence-check review path steps ${joinOrNone(sourceEvidenceCheckReviewPathStepIds)}, Stage 86 citation-review lane row ${staticCitationGapCueCard.sourceCitationReviewLaneRowId}, Stage 86 static evidence-check prompt cards ${joinOrNone(staticCitationGapCueCard.sourceStaticEvidenceCheckPromptCardIds)}, Stage 85 citation prompt card ${staticCitationGapCueCard.sourceStaticCitationCheckPromptCardId}, Stage 85 source follow-up map entries ${joinOrNone(staticCitationGapCueCard.sourceSourceFollowUpMapEntryIds)}, Stage 84 readiness rows ${joinOrNone(staticCitationGapCueCard.sourceSourceReadinessLaneRowIds)}, Stage 84 cue card ${staticCitationGapCueCard.sourceStaticSourceFollowUpCueCardId}, Stage 83 source-review path steps ${joinOrNone(staticCitationGapCueCard.sourceSourceReviewPathStepIds)}, Stage 83 static source-review prompt cards ${joinOrNone(staticCitationGapCueCard.sourceStaticSourceReviewPromptCardIds)}, Stage 82 source-crosswalk rows ${joinOrNone(staticCitationGapCueCard.sourceCrosswalkRowIds)}, Stage 82 static review-check cards ${joinOrNone(staticCitationGapCueCard.sourceStaticReviewCheckCardIds)}, Stage 81 review-path steps ${joinOrNone(staticCitationGapCueCard.sourceConstraintResponseReviewPathStepIds)}, Stage 81 response-review prompt cards ${joinOrNone(staticCitationGapCueCard.sourceStaticResponseReviewPromptCardIds)}, Stage 80 constraint-coverage rows ${joinOrNone(staticCitationGapCueCard.sourceConstraintCoverageRowIds)}, Stage 80 response-note prompt cards ${joinOrNone(staticCitationGapCueCard.sourceStaticResponseNotePromptCardIds)}, Stage 79 answer-review steps ${joinOrNone(staticCitationGapCueCard.sourceAnswerReviewPathStepIds)}, Stage 79 constraint-note cards ${joinOrNone(staticCitationGapCueCard.sourceStaticConstraintNoteCardIds)}, Stage 78 answer-check cards ${joinOrNone(staticCitationGapCueCard.sourceStaticAnswerCheckCardIds)}, Stage 78 readiness rows ${joinOrNone(staticCitationGapCueCard.sourceResponsePromptReadinessRowIds)}, Stage 77 response-prompt cards ${joinOrNone(staticCitationGapCueCard.sourceStaticResponsePromptCardIds)}, Stage 77 response-map review-path steps ${joinOrNone(staticCitationGapCueCard.sourceResponseMapReviewPathStepIds)}, Stage 76 response-map rows ${joinOrNone(staticCitationGapCueCard.sourceResponseMapRowIds)}, Stage 75 coverage-review steps ${joinOrNone(staticCitationGapCueCard.sourceCoverageReviewPathStepIds)}, Stage 74 coverage rows ${joinOrNone(staticCitationGapCueCard.sourceCoverageMatrixRowIds)}, Stage 73 review-path steps ${joinOrNone(staticCitationGapCueCard.sourceReviewPathStepIds)}, Stage 72 source recap rows ${joinOrNone(staticCitationGapCueCard.sourceSourceRecapRowIds)}, Stage 71 review-lane rows ${joinOrNone(staticCitationGapCueCard.sourceAnswerFollowUpReviewLaneRowIds)}, Stage 70 crosswalk rows ${joinOrNone(staticCitationGapCueCard.sourceAnswerSourceCrosswalkRowIds)}, Stage 69 walkthrough steps ${joinOrNone(staticCitationGapCueCard.sourceAnswerWalkthroughStepIds)}, Stage 68 answer coverage rows ${joinOrNone(staticCitationGapCueCard.sourceAnswerCoverageRowIds)}, Stage 67 rehearsal steps ${joinOrNone(staticCitationGapCueCard.sourceRehearsalPathStepIds)}, Stage 66 board rows ${joinOrNone(staticCitationGapCueCard.sourceReviewBoardRowIds)}, Stage 65 brief rows ${joinOrNone(staticCitationGapCueCard.sourceFollowUpReadinessBriefRowIds)}, Stage 64 triage rows ${joinOrNone(staticCitationGapCueCard.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowIds)}, anchors ${joinOrNone(staticCitationGapCueCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticCitationGapCueCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticCitationGapCueCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticCitationGapCueCard.deferredScopeReminderIds)}, readiness labels ${joinOrNone(readinessLabels)}, and Stage 87 citation-gap cue text "${staticCitationGapCueCard.citationGapCueText}" as deterministic manual evidence-gap readiness context only.`,
    followUpPromptText:
      `Static follow-up prompt card ${sourceStaticCitationGapCueCardId}: inspect Stage 87 static citation-gap cue ${sourceStaticCitationGapCueCardId}, matched Stage 87 evidence-check review path steps ${joinOrNone(sourceEvidenceCheckReviewPathStepIds)}, Stage 86 citation-review lane row ${staticCitationGapCueCard.sourceCitationReviewLaneRowId}, Stage 86 static evidence-check prompt cards ${joinOrNone(staticCitationGapCueCard.sourceStaticEvidenceCheckPromptCardIds)}, Stage 85 citation prompt ${staticCitationGapCueCard.sourceStaticCitationCheckPromptCardId}, Stage 85 follow-up entries ${joinOrNone(staticCitationGapCueCard.sourceSourceFollowUpMapEntryIds)}, local anchors ${joinOrNone(staticCitationGapCueCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticCitationGapCueCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticCitationGapCueCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticCitationGapCueCard.deferredScopeReminderIds)}, follow-up prompt labels ${joinOrNone(followUpPromptLabels)}, and Stage 87 evidence-check text "${staticCitationGapCueCard.evidenceCheckReviewText}" before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, evidence-check selections, evidence-gap readiness state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static evidence-gap follow-up prompt context: manual citation-gap, evidence-check, source-lineage, anchor, callback, gap-prompt, and deferred-reminder review only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved evidence-check selections, saved evidence-gap readiness state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticCitationGapCueCard.staticNonGoalFlags,
    ),
  };
}

function stepMatchesCitationGapCueCard(
  evidenceCheckReviewPathStep: Stage87Step,
  staticCitationGapCueCard: Stage87StaticCitationGapCueCard,
): boolean {
  return (
    evidenceCheckReviewPathStep.sourceCitationReviewLaneRowIds.includes(
      staticCitationGapCueCard.sourceCitationReviewLaneRowId,
    ) ||
    staticCitationGapCueCard.sourceStaticEvidenceCheckPromptCardIds.includes(
      evidenceCheckReviewPathStep.sourceStaticEvidenceCheckPromptCardId,
    )
  );
}

function buildCounts(
  evidenceGapReadinessRows: ConstraintResponseEvidenceGapReadinessMatrixRowView[],
  staticFollowUpPromptCards: ConstraintResponseEvidenceGapReadinessMatrixStaticFollowUpPromptCardView[],
  evidenceCheckReviewPath: Stage87View,
): ConstraintResponseEvidenceGapReadinessMatrixSummaryView["counts"] {
  const sourceCounts = evidenceCheckReviewPath.summary.counts;

  return {
    ...sourceCounts,
    evidenceGapReadinessRowCount: evidenceGapReadinessRows.length,
    staticFollowUpPromptCardCount: staticFollowUpPromptCards.length,
    readinessLabelCount: unique([
      ...evidenceGapReadinessRows.flatMap((row) => row.readinessLabels),
      ...staticFollowUpPromptCards.flatMap((card) => card.readinessLabels),
    ]).length,
    followUpPromptLabelCount: unique([
      ...evidenceGapReadinessRows.flatMap((row) => row.followUpPromptLabels),
      ...staticFollowUpPromptCards.flatMap(
        (card) => card.followUpPromptLabels,
      ),
    ]).length,
    localOnlyEvidenceGapReadinessRowCount:
      evidenceGapReadinessRows.filter((row) => row.localOnly).length,
    localOnlyStaticFollowUpPromptCardCount: staticFollowUpPromptCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function buildRowReadinessLabels(
  evidenceCheckReviewPathStep: Stage87Step,
  matchedStaticCitationGapCueCards: Stage87StaticCitationGapCueCard[],
): string[] {
  const labels = [
    "evidence-gap readiness matrix row",
    "Stage 87 evidence-check review path carry-forward",
  ];

  if (matchedStaticCitationGapCueCards.length) {
    labels.push("matched Stage 87 citation-gap cue context");
  }

  if (evidenceCheckReviewPathStep.evidenceCheckReviewLabels.length) {
    labels.push("Stage 87 evidence-check label carry-forward");
  }

  return labels;
}

function buildRowFollowUpPromptLabels(
  evidenceCheckReviewPathStep: Stage87Step,
  matchedStaticCitationGapCueCards: Stage87StaticCitationGapCueCard[],
): string[] {
  const labels = [
    "static follow-up prompt context",
    "evidence gap follow-up review",
  ];

  if (matchedStaticCitationGapCueCards.length) {
    labels.push("citation-gap cue follow-up alignment");
  }

  if (
    evidenceCheckReviewPathStep.gapDiscussionPointIds.length ||
    evidenceCheckReviewPathStep.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder follow-up context");
  }

  return labels;
}

function buildCardReadinessLabels(
  staticCitationGapCueCard: Stage87StaticCitationGapCueCard,
  matchedEvidenceCheckReviewPathSteps: Stage87Step[],
): string[] {
  const labels = [
    "citation-gap readiness carry-forward",
    "Stage 87 static citation-gap cue card",
  ];

  if (matchedEvidenceCheckReviewPathSteps.length) {
    labels.push("matched evidence-check review path context");
  }

  if (staticCitationGapCueCard.evidenceCheckReviewLabels.length) {
    labels.push("Stage 87 evidence-check cue label carry-forward");
  }

  return labels;
}

function buildCardFollowUpPromptLabels(
  staticCitationGapCueCard: Stage87StaticCitationGapCueCard,
  matchedEvidenceCheckReviewPathSteps: Stage87Step[],
): string[] {
  const labels = [
    "static follow-up prompt card",
    "Stage 87 citation-gap follow-up context",
  ];

  if (matchedEvidenceCheckReviewPathSteps.length) {
    labels.push("matched evidence-check step follow-up prompt");
  }

  if (
    staticCitationGapCueCard.gapDiscussionPointIds.length ||
    staticCitationGapCueCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder follow-up context");
  }

  return labels;
}

function staticNonGoalFlags(
  sourceFlags: Stage87StaticNonGoalFlags,
): ConstraintResponseEvidenceGapReadinessMatrixStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedEvidenceGapReadinessState: true,
    noSavedEvidenceGapReadinessMatrixState: true,
    noSavedEvidenceGapReadinessSelections: true,
    noSavedStaticFollowUpPromptState: true,
    noSavedStaticFollowUpPromptCards: true,
  };
}

function joinOrNone(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}
