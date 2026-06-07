import type {
  ConstraintResponseEvidenceGapFollowUpReviewPathStaticNonGoalFlagsView,
  ConstraintResponseEvidenceGapFollowUpReviewPathStaticReadinessCueCardView,
  ConstraintResponseEvidenceGapFollowUpReviewPathStepView,
  ConstraintResponseEvidenceGapFollowUpReviewPathSummaryView,
  ConstraintResponseEvidenceGapFollowUpReviewPathView,
  ConstraintResponseEvidenceGapReadinessMatrixRowView as Stage88Row,
  ConstraintResponseEvidenceGapReadinessMatrixStaticFollowUpPromptCardView as Stage88StaticFollowUpPromptCard,
  ConstraintResponseEvidenceGapReadinessMatrixStaticNonGoalFlagsView as Stage88StaticNonGoalFlags,
  ConstraintResponseEvidenceGapReadinessMatrixView as Stage88View,
} from "../features/mission-console/types.ts";

export function buildConstraintResponseEvidenceGapFollowUpReviewPath(
  evidenceGapReadinessMatrix: Stage88View | undefined,
): ConstraintResponseEvidenceGapFollowUpReviewPathView | undefined {
  if (
    !evidenceGapReadinessMatrix?.evidenceGapReadinessRows.length ||
    !evidenceGapReadinessMatrix.staticFollowUpPromptCards.length
  ) {
    return undefined;
  }

  const followUpReviewPathSteps =
    evidenceGapReadinessMatrix.evidenceGapReadinessRows.map((row) =>
      buildFollowUpReviewPathStep(
        row,
        evidenceGapReadinessMatrix.staticFollowUpPromptCards,
      ),
    );
  const staticReadinessCueCards =
    evidenceGapReadinessMatrix.staticFollowUpPromptCards.map((card) =>
      buildStaticReadinessCueCard(
        card,
        evidenceGapReadinessMatrix.evidenceGapReadinessRows,
      ),
    );
  const defaultFollowUpReviewPathStep =
    followUpReviewPathSteps.find(
      (step) =>
        step.sourceEvidenceGapReadinessRowId ===
        evidenceGapReadinessMatrix.defaultEvidenceGapReadinessRow
          .evidenceGapReadinessRowId,
    ) ?? followUpReviewPathSteps[0];
  const defaultStaticReadinessCueCard =
    staticReadinessCueCards.find(
      (card) =>
        card.sourceStaticFollowUpPromptCardId ===
        evidenceGapReadinessMatrix.defaultStaticFollowUpPromptCard
          .staticFollowUpPromptCardId,
    ) ?? staticReadinessCueCards[0];
  const defaultStage88Context =
    evidenceGapReadinessMatrix.summary.defaultEvidenceGapReadinessContext;

  return {
    schema: "telemforge.constraint_response_evidence_gap_follow_up_review_path.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response evidence-gap follow-up review path and static readiness cues",
    localStatus: evidenceGapReadinessMatrix.localStatus,
    summary: {
      constraintResponseEvidenceGapFollowUpReviewPathId:
        "candidate-local-constraint-response-evidence-gap-follow-up-review-path",
      label: "Local constraint-response evidence-gap follow-up review path",
      summary:
        "A static evidence-gap follow-up review path derives from Stage 88 evidence-gap readiness rows and static readiness cue cards derive from Stage 88 follow-up prompt cards so reviewers can trace readiness rows, prompt cards, source lineage, local anchors, callbacks, gap prompts, and deferred reminders before drafting outside the app without saved answers, drafts, reviewer notes, response notes, source selections, citation selections, evidence-check selections, evidence-gap readiness selections, follow-up review path state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultFollowUpReviewContext: {
        defaultFollowUpReviewPathStepId:
          defaultFollowUpReviewPathStep.followUpReviewPathStepId,
        defaultStaticReadinessCueCardId:
          defaultStaticReadinessCueCard.staticReadinessCueCardId,
        defaultEvidenceGapReadinessRowId:
          defaultFollowUpReviewPathStep.sourceEvidenceGapReadinessRowId,
        defaultStaticFollowUpPromptCardId:
          defaultStaticReadinessCueCard.sourceStaticFollowUpPromptCardId,
        defaultEvidenceCheckReviewPathStepId:
          defaultFollowUpReviewPathStep.sourceEvidenceCheckReviewPathStepId,
        defaultStaticCitationGapCueCardId:
          defaultStaticReadinessCueCard.sourceStaticCitationGapCueCardId,
        defaultStaticEvidenceCheckPromptCardId:
          defaultFollowUpReviewPathStep.sourceStaticEvidenceCheckPromptCardId,
        defaultCitationReviewLaneRowId:
          defaultStaticReadinessCueCard.sourceCitationReviewLaneRowId,
        defaultStaticCitationCheckPromptCardId:
          defaultStaticReadinessCueCard.sourceStaticCitationCheckPromptCardId,
        defaultSourceFollowUpMapEntryId:
          defaultFollowUpReviewPathStep.sourceSourceFollowUpMapEntryId,
        sourceStage88EvidenceGapReadinessMatrixSummary:
          evidenceGapReadinessMatrix.summary.summary,
        sourceStage88DefaultEvidenceGapReadinessContext: defaultStage88Context,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        followUpReviewPathSteps,
        staticReadinessCueCards,
        evidenceGapReadinessMatrix,
      ),
    },
    defaultFollowUpReviewPathStep,
    defaultStaticReadinessCueCard,
    followUpReviewPathSteps,
    staticReadinessCueCards,
    staticFollowUpReviewBoundarySummary:
      "Stage 89 follow-up review path steps and static readiness cue cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, evidence-check selections, evidence-gap readiness selections, follow-up review path state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseEvidenceGapReadinessMatrix:
      evidenceGapReadinessMatrix,
  };
}

function buildFollowUpReviewPathStep(
  evidenceGapReadinessRow: Stage88Row,
  staticFollowUpPromptCards: Stage88StaticFollowUpPromptCard[],
): ConstraintResponseEvidenceGapFollowUpReviewPathStepView {
  const sourceEvidenceGapReadinessRowId =
    evidenceGapReadinessRow.evidenceGapReadinessRowId;
  const matchedStaticFollowUpPromptCards = staticFollowUpPromptCards.filter(
    (card) => rowMatchesStaticFollowUpPromptCard(evidenceGapReadinessRow, card),
  );
  const sourceStaticFollowUpPromptCardIds =
    matchedStaticFollowUpPromptCards.map((card) => card.staticFollowUpPromptCardId);
  const followUpReviewLabels = buildStepFollowUpReviewLabels(
    evidenceGapReadinessRow,
    matchedStaticFollowUpPromptCards,
  );
  const readinessCueLabels = buildStepReadinessCueLabels(
    evidenceGapReadinessRow,
    matchedStaticFollowUpPromptCards,
  );
  const followUpReviewPathStepId =
    `constraint-response-evidence-gap-follow-up-review-path:step:${sourceEvidenceGapReadinessRowId}`;

  return {
    ...evidenceGapReadinessRow,
    followUpReviewPathStepId,
    followUpReviewPathStepIds: [followUpReviewPathStepId],
    followUpReviewPathStepOrder:
      evidenceGapReadinessRow.evidenceGapReadinessRowOrder,
    sourceEvidenceGapReadinessRowId,
    sourceEvidenceGapReadinessRowIds: [sourceEvidenceGapReadinessRowId],
    sourceStaticFollowUpPromptCardIds,
    followUpReviewLabels,
    readinessCueLabels,
    followUpReviewText:
      `Evidence-gap follow-up review step ${sourceEvidenceGapReadinessRowId}: carry Stage 88 readiness row ${sourceEvidenceGapReadinessRowId}, Stage 88 static follow-up prompt cards ${joinOrNone(sourceStaticFollowUpPromptCardIds)}, Stage 87 evidence-check review path step ${evidenceGapReadinessRow.sourceEvidenceCheckReviewPathStepId}, Stage 87 citation-gap cue cards ${joinOrNone(evidenceGapReadinessRow.sourceStaticCitationGapCueCardIds)}, Stage 86 static evidence-check prompt card ${evidenceGapReadinessRow.sourceStaticEvidenceCheckPromptCardId}, Stage 86 citation-review lane rows ${joinOrNone(evidenceGapReadinessRow.sourceCitationReviewLaneRowIds)}, Stage 85 source follow-up map entry ${evidenceGapReadinessRow.sourceSourceFollowUpMapEntryId}, Stage 85 citation prompt cards ${joinOrNone(evidenceGapReadinessRow.sourceStaticCitationCheckPromptCardIds)}, Stage 84 readiness row ${evidenceGapReadinessRow.sourceSourceReadinessLaneRowId}, Stage 84 cue cards ${joinOrNone(evidenceGapReadinessRow.sourceStaticSourceFollowUpCueCardIds)}, Stage 83 source-review path step ${evidenceGapReadinessRow.sourceSourceReviewPathStepId}, Stage 83 static source-review prompt cards ${joinOrNone(evidenceGapReadinessRow.sourceStaticSourceReviewPromptCardIds)}, Stage 82 source-crosswalk row ${evidenceGapReadinessRow.sourceCrosswalkRowId}, Stage 82 static review-check cards ${joinOrNone(evidenceGapReadinessRow.sourceStaticReviewCheckCardIds)}, Stage 81 review-path step ${evidenceGapReadinessRow.sourceConstraintResponseReviewPathStepId}, Stage 81 response-review prompt cards ${joinOrNone(evidenceGapReadinessRow.sourceStaticResponseReviewPromptCardIds)}, Stage 80 constraint-coverage row ${evidenceGapReadinessRow.sourceConstraintCoverageRowId}, Stage 80 response-note prompt cards ${joinOrNone(evidenceGapReadinessRow.sourceStaticResponseNotePromptCardIds)}, Stage 79 answer-review step ${evidenceGapReadinessRow.sourceAnswerReviewPathStepId}, Stage 79 constraint-note cards ${joinOrNone(evidenceGapReadinessRow.sourceStaticConstraintNoteCardIds)}, Stage 78 answer-check card ${evidenceGapReadinessRow.sourceStaticAnswerCheckCardId}, Stage 78 readiness rows ${joinOrNone(evidenceGapReadinessRow.sourceResponsePromptReadinessRowIds)}, Stage 77 response-prompt cards ${joinOrNone(evidenceGapReadinessRow.sourceStaticResponsePromptCardIds)}, Stage 77 response-map review-path step ${evidenceGapReadinessRow.sourceResponseMapReviewPathStepId}, Stage 76 response-map row ${evidenceGapReadinessRow.sourceResponseMapRowId}, Stage 75 coverage-review step ${evidenceGapReadinessRow.sourceCoverageReviewPathStepId}, Stage 74 coverage row ${evidenceGapReadinessRow.sourceCoverageMatrixRowId}, Stage 73 review-path step ${evidenceGapReadinessRow.sourceReviewPathStepId}, Stage 72 source recap row ${evidenceGapReadinessRow.sourceSourceRecapRowId}, Stage 71 review-lane row ${evidenceGapReadinessRow.sourceAnswerFollowUpReviewLaneRowId}, Stage 70 crosswalk row ${evidenceGapReadinessRow.sourceAnswerSourceCrosswalkRowId}, Stage 69 walkthrough step ${evidenceGapReadinessRow.sourceAnswerWalkthroughStepId}, Stage 68 answer coverage row ${evidenceGapReadinessRow.sourceAnswerCoverageRowId}, Stage 67 rehearsal step ${evidenceGapReadinessRow.sourceRehearsalPathStepId}, Stage 66 board row ${evidenceGapReadinessRow.sourceReviewBoardRowId}, Stage 65 brief row ${evidenceGapReadinessRow.followUpReadinessBriefRowId}, Stage 64 triage row ${evidenceGapReadinessRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${joinOrNone(evidenceGapReadinessRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(evidenceGapReadinessRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(evidenceGapReadinessRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(evidenceGapReadinessRow.deferredScopeReminderIds)}, follow-up review labels ${joinOrNone(followUpReviewLabels)}, readiness cue labels ${joinOrNone(readinessCueLabels)}, Stage 88 readiness text "${evidenceGapReadinessRow.readinessText}", and Stage 88 prompt text "${evidenceGapReadinessRow.followUpPromptText}" as deterministic manual follow-up review context only.`,
    readinessCueText:
      `Static readiness cue context for follow-up review step ${sourceEvidenceGapReadinessRowId}: compare Stage 88 readiness row ${sourceEvidenceGapReadinessRowId}, Stage 88 static follow-up prompt cards ${joinOrNone(sourceStaticFollowUpPromptCardIds)}, Stage 87 evidence-check review path step ${evidenceGapReadinessRow.sourceEvidenceCheckReviewPathStepId}, Stage 87 citation-gap cue cards ${joinOrNone(evidenceGapReadinessRow.sourceStaticCitationGapCueCardIds)}, anchors ${joinOrNone(evidenceGapReadinessRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(evidenceGapReadinessRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(evidenceGapReadinessRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(evidenceGapReadinessRow.deferredScopeReminderIds)}, and Stage 88 labels ${joinOrNone([...evidenceGapReadinessRow.readinessLabels, ...evidenceGapReadinessRow.followUpPromptLabels])} before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, evidence-check selections, evidence-gap readiness selections, follow-up review path state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static evidence-gap follow-up review path context: manual readiness-row, prompt-card, source-lineage, anchor, callback, gap-prompt, and deferred-reminder comparison only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved evidence-check selections, saved evidence-gap readiness selections, saved follow-up review path state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      evidenceGapReadinessRow.staticNonGoalFlags,
    ),
  };
}

function buildStaticReadinessCueCard(
  staticFollowUpPromptCard: Stage88StaticFollowUpPromptCard,
  evidenceGapReadinessRows: Stage88Row[],
): ConstraintResponseEvidenceGapFollowUpReviewPathStaticReadinessCueCardView {
  const sourceStaticFollowUpPromptCardId =
    staticFollowUpPromptCard.staticFollowUpPromptCardId;
  const matchedEvidenceGapReadinessRows = evidenceGapReadinessRows.filter((row) =>
    rowMatchesStaticFollowUpPromptCard(row, staticFollowUpPromptCard),
  );
  const sourceEvidenceGapReadinessRowIds =
    matchedEvidenceGapReadinessRows.map((row) => row.evidenceGapReadinessRowId);
  const followUpReviewLabels = buildCardFollowUpReviewLabels(
    staticFollowUpPromptCard,
    matchedEvidenceGapReadinessRows,
  );
  const readinessCueLabels = buildCardReadinessCueLabels(
    staticFollowUpPromptCard,
    matchedEvidenceGapReadinessRows,
  );
  const staticReadinessCueCardId =
    `constraint-response-evidence-gap-follow-up-review-path:static-readiness-cue:${sourceStaticFollowUpPromptCardId}`;

  return {
    ...staticFollowUpPromptCard,
    staticReadinessCueCardId,
    staticReadinessCueCardIds: [staticReadinessCueCardId],
    staticReadinessCueOrder: staticFollowUpPromptCard.staticFollowUpPromptOrder,
    sourceStaticFollowUpPromptCardId,
    sourceStaticFollowUpPromptCardIds: [sourceStaticFollowUpPromptCardId],
    sourceEvidenceGapReadinessRowIds,
    followUpReviewLabels,
    readinessCueLabels,
    followUpReviewText:
      `Follow-up review cue ${sourceStaticFollowUpPromptCardId}: carry Stage 88 static follow-up prompt card ${sourceStaticFollowUpPromptCardId}, Stage 88 evidence-gap readiness rows ${joinOrNone(sourceEvidenceGapReadinessRowIds)}, Stage 87 static citation-gap cue card ${staticFollowUpPromptCard.sourceStaticCitationGapCueCardId}, Stage 87 evidence-check review path steps ${joinOrNone(staticFollowUpPromptCard.sourceEvidenceCheckReviewPathStepIds)}, Stage 86 citation-review lane row ${staticFollowUpPromptCard.sourceCitationReviewLaneRowId}, Stage 86 static evidence-check prompt cards ${joinOrNone(staticFollowUpPromptCard.sourceStaticEvidenceCheckPromptCardIds)}, Stage 85 citation prompt card ${staticFollowUpPromptCard.sourceStaticCitationCheckPromptCardId}, Stage 85 source follow-up map entries ${joinOrNone(staticFollowUpPromptCard.sourceSourceFollowUpMapEntryIds)}, anchors ${joinOrNone(staticFollowUpPromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticFollowUpPromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticFollowUpPromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticFollowUpPromptCard.deferredScopeReminderIds)}, follow-up review labels ${joinOrNone(followUpReviewLabels)}, and Stage 88 follow-up prompt text "${staticFollowUpPromptCard.followUpPromptText}" as deterministic manual follow-up review context only.`,
    readinessCueText:
      `Static readiness cue card ${sourceStaticFollowUpPromptCardId}: inspect Stage 88 static follow-up prompt card ${sourceStaticFollowUpPromptCardId}, Stage 88 readiness rows ${joinOrNone(sourceEvidenceGapReadinessRowIds)}, Stage 87 citation-gap cue ${staticFollowUpPromptCard.sourceStaticCitationGapCueCardId}, Stage 86 citation-review lane row ${staticFollowUpPromptCard.sourceCitationReviewLaneRowId}, Stage 85 citation prompt ${staticFollowUpPromptCard.sourceStaticCitationCheckPromptCardId}, Stage 84 readiness rows ${joinOrNone(staticFollowUpPromptCard.sourceSourceReadinessLaneRowIds)}, Stage 83 source-review path steps ${joinOrNone(staticFollowUpPromptCard.sourceSourceReviewPathStepIds)}, Stage 82 crosswalk rows ${joinOrNone(staticFollowUpPromptCard.sourceCrosswalkRowIds)}, Stage 81 review-path steps ${joinOrNone(staticFollowUpPromptCard.sourceConstraintResponseReviewPathStepIds)}, anchors ${joinOrNone(staticFollowUpPromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticFollowUpPromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticFollowUpPromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticFollowUpPromptCard.deferredScopeReminderIds)}, readiness cue labels ${joinOrNone(readinessCueLabels)}, and Stage 88 readiness text "${staticFollowUpPromptCard.readinessText}" before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, evidence-check selections, evidence-gap readiness selections, follow-up review path state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static readiness cue context: manual Stage 88 prompt-card, readiness-row, source-lineage, anchor, callback, gap-prompt, and deferred-reminder review only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved evidence-check selections, saved evidence-gap readiness selections, saved follow-up review path state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticFollowUpPromptCard.staticNonGoalFlags,
    ),
  };
}

function rowMatchesStaticFollowUpPromptCard(
  evidenceGapReadinessRow: Stage88Row,
  staticFollowUpPromptCard: Stage88StaticFollowUpPromptCard,
): boolean {
  return (
    evidenceGapReadinessRow.sourceStaticCitationGapCueCardIds.includes(
      staticFollowUpPromptCard.sourceStaticCitationGapCueCardId,
    ) ||
    staticFollowUpPromptCard.sourceEvidenceCheckReviewPathStepIds.includes(
      evidenceGapReadinessRow.sourceEvidenceCheckReviewPathStepId,
    )
  );
}

function buildCounts(
  followUpReviewPathSteps: ConstraintResponseEvidenceGapFollowUpReviewPathStepView[],
  staticReadinessCueCards: ConstraintResponseEvidenceGapFollowUpReviewPathStaticReadinessCueCardView[],
  evidenceGapReadinessMatrix: Stage88View,
): ConstraintResponseEvidenceGapFollowUpReviewPathSummaryView["counts"] {
  const sourceCounts = evidenceGapReadinessMatrix.summary.counts;

  return {
    ...sourceCounts,
    followUpReviewPathStepCount: followUpReviewPathSteps.length,
    staticReadinessCueCardCount: staticReadinessCueCards.length,
    followUpReviewLabelCount: unique([
      ...followUpReviewPathSteps.flatMap((step) => step.followUpReviewLabels),
      ...staticReadinessCueCards.flatMap((card) => card.followUpReviewLabels),
    ]).length,
    readinessCueLabelCount: unique([
      ...followUpReviewPathSteps.flatMap((step) => step.readinessCueLabels),
      ...staticReadinessCueCards.flatMap((card) => card.readinessCueLabels),
    ]).length,
    localOnlyFollowUpReviewPathStepCount: followUpReviewPathSteps.filter(
      (step) => step.localOnly,
    ).length,
    localOnlyStaticReadinessCueCardCount: staticReadinessCueCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function buildStepFollowUpReviewLabels(
  evidenceGapReadinessRow: Stage88Row,
  matchedStaticFollowUpPromptCards: Stage88StaticFollowUpPromptCard[],
): string[] {
  const labels = [
    "evidence-gap follow-up review path step",
    "Stage 88 readiness row carry-forward",
  ];

  if (matchedStaticFollowUpPromptCards.length) {
    labels.push("matched Stage 88 static follow-up prompt context");
  }

  if (evidenceGapReadinessRow.followUpPromptLabels.length) {
    labels.push("Stage 88 follow-up prompt label carry-forward");
  }

  return labels;
}

function buildStepReadinessCueLabels(
  evidenceGapReadinessRow: Stage88Row,
  matchedStaticFollowUpPromptCards: Stage88StaticFollowUpPromptCard[],
): string[] {
  const labels = [
    "static readiness cue context",
    "Stage 88 readiness cue carry-forward",
  ];

  if (matchedStaticFollowUpPromptCards.length) {
    labels.push("matched static follow-up prompt cue context");
  }

  if (
    evidenceGapReadinessRow.gapDiscussionPointIds.length ||
    evidenceGapReadinessRow.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder readiness cue");
  }

  return labels;
}

function buildCardFollowUpReviewLabels(
  staticFollowUpPromptCard: Stage88StaticFollowUpPromptCard,
  matchedEvidenceGapReadinessRows: Stage88Row[],
): string[] {
  const labels = [
    "static readiness follow-up review context",
    "Stage 88 static follow-up prompt card",
  ];

  if (matchedEvidenceGapReadinessRows.length) {
    labels.push("matched readiness row follow-up review");
  }

  if (staticFollowUpPromptCard.followUpPromptLabels.length) {
    labels.push("Stage 88 follow-up prompt cue label carry-forward");
  }

  return labels;
}

function buildCardReadinessCueLabels(
  staticFollowUpPromptCard: Stage88StaticFollowUpPromptCard,
  matchedEvidenceGapReadinessRows: Stage88Row[],
): string[] {
  const labels = [
    "static readiness cue card",
    "Stage 88 follow-up prompt readiness cue",
  ];

  if (matchedEvidenceGapReadinessRows.length) {
    labels.push("matched evidence-gap readiness row context");
  }

  if (
    staticFollowUpPromptCard.gapDiscussionPointIds.length ||
    staticFollowUpPromptCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder readiness cue");
  }

  return labels;
}

function staticNonGoalFlags(
  sourceFlags: Stage88StaticNonGoalFlags,
): ConstraintResponseEvidenceGapFollowUpReviewPathStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedFollowUpReviewPathState: true,
    noSavedFollowUpReviewPathSelections: true,
    noSavedEvidenceGapFollowUpSelections: true,
    noSavedStaticReadinessCueState: true,
    noSavedStaticReadinessCueCards: true,
  };
}

function joinOrNone(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}
