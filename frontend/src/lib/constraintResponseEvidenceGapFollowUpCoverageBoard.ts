import type {
  ConstraintResponseEvidenceGapFollowUpCoverageBoardRowView,
  ConstraintResponseEvidenceGapFollowUpCoverageBoardStaticNonGoalFlagsView,
  ConstraintResponseEvidenceGapFollowUpCoverageBoardStaticReviewPromptCardView,
  ConstraintResponseEvidenceGapFollowUpCoverageBoardSummaryView,
  ConstraintResponseEvidenceGapFollowUpCoverageBoardView,
  ConstraintResponseEvidenceGapFollowUpReviewPathStaticNonGoalFlagsView as Stage89StaticNonGoalFlags,
  ConstraintResponseEvidenceGapFollowUpReviewPathStaticReadinessCueCardView as Stage89StaticReadinessCueCard,
  ConstraintResponseEvidenceGapFollowUpReviewPathStepView as Stage89Step,
  ConstraintResponseEvidenceGapFollowUpReviewPathView as Stage89View,
} from "../features/mission-console/types.ts";

export function buildConstraintResponseEvidenceGapFollowUpCoverageBoard(
  evidenceGapFollowUpReviewPath: Stage89View | undefined,
): ConstraintResponseEvidenceGapFollowUpCoverageBoardView | undefined {
  if (
    !evidenceGapFollowUpReviewPath?.followUpReviewPathSteps.length ||
    !evidenceGapFollowUpReviewPath.staticReadinessCueCards.length
  ) {
    return undefined;
  }

  const coverageRows =
    evidenceGapFollowUpReviewPath.followUpReviewPathSteps.map((step) =>
      buildCoverageRow(
        step,
        evidenceGapFollowUpReviewPath.staticReadinessCueCards,
      ),
    );
  const staticReviewPromptCards =
    evidenceGapFollowUpReviewPath.staticReadinessCueCards.map((card) =>
      buildStaticReviewPromptCard(
        card,
        evidenceGapFollowUpReviewPath.followUpReviewPathSteps,
      ),
    );
  const defaultCoverageRow =
    coverageRows.find(
      (row) =>
        row.sourceFollowUpReviewPathStepId ===
        evidenceGapFollowUpReviewPath.defaultFollowUpReviewPathStep
          .followUpReviewPathStepId,
    ) ?? coverageRows[0];
  const defaultStaticReviewPromptCard =
    staticReviewPromptCards.find(
      (card) =>
        card.sourceStaticReadinessCueCardId ===
        evidenceGapFollowUpReviewPath.defaultStaticReadinessCueCard
          .staticReadinessCueCardId,
    ) ?? staticReviewPromptCards[0];
  const defaultStage89Context =
    evidenceGapFollowUpReviewPath.summary.defaultFollowUpReviewContext;

  return {
    schema:
      "telemforge.constraint_response_evidence_gap_follow_up_coverage_board.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response evidence-gap follow-up coverage board and static review prompts",
    localStatus: evidenceGapFollowUpReviewPath.localStatus,
    summary: {
      constraintResponseEvidenceGapFollowUpCoverageBoardId:
        "candidate-local-constraint-response-evidence-gap-follow-up-coverage-board",
      label: "Local constraint-response evidence-gap follow-up coverage board",
      summary:
        "A static evidence-gap follow-up coverage board derives rows from Stage 89 follow-up review path steps and static review prompt cards from Stage 89 static readiness cue cards so reviewers can trace review steps, readiness cues, prompt lineage, local anchors, callbacks, gap prompts, and deferred reminders before drafting outside the app without saved answers, drafts, reviewer notes, response notes, source selections, citation selections, evidence-check selections, evidence-gap readiness selections, evidence-gap follow-up selections, coverage-board selections, coverage state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultCoverageContext: {
        defaultCoverageRowId: defaultCoverageRow.coverageRowId,
        defaultStaticReviewPromptCardId:
          defaultStaticReviewPromptCard.staticReviewPromptCardId,
        defaultFollowUpReviewPathStepId:
          defaultCoverageRow.sourceFollowUpReviewPathStepId,
        defaultStaticReadinessCueCardId:
          defaultStaticReviewPromptCard.sourceStaticReadinessCueCardId,
        defaultEvidenceGapReadinessRowId:
          defaultCoverageRow.sourceEvidenceGapReadinessRowId,
        defaultStaticFollowUpPromptCardId:
          defaultStaticReviewPromptCard.sourceStaticFollowUpPromptCardId,
        defaultEvidenceCheckReviewPathStepId:
          defaultCoverageRow.sourceEvidenceCheckReviewPathStepId,
        defaultStaticCitationGapCueCardId:
          defaultStaticReviewPromptCard.sourceStaticCitationGapCueCardId,
        defaultStaticEvidenceCheckPromptCardId:
          defaultCoverageRow.sourceStaticEvidenceCheckPromptCardId,
        defaultCitationReviewLaneRowId:
          defaultStaticReviewPromptCard.sourceCitationReviewLaneRowId,
        defaultStaticCitationCheckPromptCardId:
          defaultStaticReviewPromptCard.sourceStaticCitationCheckPromptCardId,
        defaultSourceFollowUpMapEntryId:
          defaultCoverageRow.sourceSourceFollowUpMapEntryId,
        sourceStage89EvidenceGapFollowUpReviewPathSummary:
          evidenceGapFollowUpReviewPath.summary.summary,
        sourceStage89DefaultFollowUpReviewContext: defaultStage89Context,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        coverageRows,
        staticReviewPromptCards,
        evidenceGapFollowUpReviewPath,
      ),
    },
    defaultCoverageRow,
    defaultStaticReviewPromptCard,
    coverageRows,
    staticReviewPromptCards,
    staticCoverageBoardBoundarySummary:
      "Stage 90 evidence-gap follow-up coverage rows and static review prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, evidence-check selections, evidence-gap readiness selections, evidence-gap follow-up selections, coverage-board selections, coverage state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseEvidenceGapFollowUpReviewPath:
      evidenceGapFollowUpReviewPath,
  };
}

function buildCoverageRow(
  followUpReviewPathStep: Stage89Step,
  staticReadinessCueCards: Stage89StaticReadinessCueCard[],
): ConstraintResponseEvidenceGapFollowUpCoverageBoardRowView {
  const sourceFollowUpReviewPathStepId =
    followUpReviewPathStep.followUpReviewPathStepId;
  const matchedStaticReadinessCueCards = staticReadinessCueCards.filter((card) =>
    rowMatchesStaticReviewPromptCard(followUpReviewPathStep, card),
  );
  const sourceStaticReadinessCueCardIds =
    matchedStaticReadinessCueCards.map((card) => card.staticReadinessCueCardId);
  const coverageLabels = buildRowCoverageLabels(
    followUpReviewPathStep,
    matchedStaticReadinessCueCards,
  );
  const staticReviewPromptLabels = buildRowStaticReviewPromptLabels(
    followUpReviewPathStep,
    matchedStaticReadinessCueCards,
  );
  const coverageRowId =
    `constraint-response-evidence-gap-follow-up-coverage-board:row:${sourceFollowUpReviewPathStepId}`;

  return {
    ...followUpReviewPathStep,
    coverageRowId,
    coverageRowIds: [coverageRowId],
    coverageRowOrder: followUpReviewPathStep.followUpReviewPathStepOrder,
    sourceFollowUpReviewPathStepId,
    sourceFollowUpReviewPathStepIds: [sourceFollowUpReviewPathStepId],
    sourceStaticReadinessCueCardIds,
    coverageLabels,
    staticReviewPromptLabels,
    coverageText:
      `Evidence-gap follow-up coverage row ${sourceFollowUpReviewPathStepId}: carry Stage 89 follow-up review path step ${sourceFollowUpReviewPathStepId}, Stage 89 static readiness cue cards ${joinOrNone(sourceStaticReadinessCueCardIds)}, Stage 88 readiness row ${followUpReviewPathStep.sourceEvidenceGapReadinessRowId}, Stage 88 static follow-up prompt cards ${joinOrNone(followUpReviewPathStep.sourceStaticFollowUpPromptCardIds)}, Stage 87 evidence-check review path step ${followUpReviewPathStep.sourceEvidenceCheckReviewPathStepId}, Stage 87 citation-gap cue cards ${joinOrNone(followUpReviewPathStep.sourceStaticCitationGapCueCardIds)}, Stage 86 static evidence-check prompt card ${followUpReviewPathStep.sourceStaticEvidenceCheckPromptCardId}, Stage 86 citation-review lane rows ${joinOrNone(followUpReviewPathStep.sourceCitationReviewLaneRowIds)}, Stage 85 source follow-up map entry ${followUpReviewPathStep.sourceSourceFollowUpMapEntryId}, Stage 85 citation prompt cards ${joinOrNone(followUpReviewPathStep.sourceStaticCitationCheckPromptCardIds)}, Stage 84 readiness row ${followUpReviewPathStep.sourceSourceReadinessLaneRowId}, Stage 84 cue cards ${joinOrNone(followUpReviewPathStep.sourceStaticSourceFollowUpCueCardIds)}, Stage 83 source-review path step ${followUpReviewPathStep.sourceSourceReviewPathStepId}, Stage 83 static source-review prompt cards ${joinOrNone(followUpReviewPathStep.sourceStaticSourceReviewPromptCardIds)}, Stage 82 source-crosswalk row ${followUpReviewPathStep.sourceCrosswalkRowId}, Stage 82 static review-check cards ${joinOrNone(followUpReviewPathStep.sourceStaticReviewCheckCardIds)}, Stage 81 review-path step ${followUpReviewPathStep.sourceConstraintResponseReviewPathStepId}, Stage 81 response-review prompt cards ${joinOrNone(followUpReviewPathStep.sourceStaticResponseReviewPromptCardIds)}, Stage 80 constraint-coverage row ${followUpReviewPathStep.sourceConstraintCoverageRowId}, Stage 80 response-note prompt cards ${joinOrNone(followUpReviewPathStep.sourceStaticResponseNotePromptCardIds)}, Stage 79 answer-review step ${followUpReviewPathStep.sourceAnswerReviewPathStepId}, Stage 79 constraint-note cards ${joinOrNone(followUpReviewPathStep.sourceStaticConstraintNoteCardIds)}, Stage 78 answer-check card ${followUpReviewPathStep.sourceStaticAnswerCheckCardId}, Stage 78 readiness rows ${joinOrNone(followUpReviewPathStep.sourceResponsePromptReadinessRowIds)}, Stage 77 response-prompt cards ${joinOrNone(followUpReviewPathStep.sourceStaticResponsePromptCardIds)}, Stage 77 response-map review-path step ${followUpReviewPathStep.sourceResponseMapReviewPathStepId}, Stage 76 response-map row ${followUpReviewPathStep.sourceResponseMapRowId}, Stage 75 coverage-review step ${followUpReviewPathStep.sourceCoverageReviewPathStepId}, Stage 74 coverage row ${followUpReviewPathStep.sourceCoverageMatrixRowId}, Stage 73 review-path step ${followUpReviewPathStep.sourceReviewPathStepId}, Stage 72 source recap row ${followUpReviewPathStep.sourceSourceRecapRowId}, Stage 71 review-lane row ${followUpReviewPathStep.sourceAnswerFollowUpReviewLaneRowId}, Stage 70 crosswalk row ${followUpReviewPathStep.sourceAnswerSourceCrosswalkRowId}, Stage 69 walkthrough step ${followUpReviewPathStep.sourceAnswerWalkthroughStepId}, Stage 68 answer coverage row ${followUpReviewPathStep.sourceAnswerCoverageRowId}, Stage 67 rehearsal step ${followUpReviewPathStep.sourceRehearsalPathStepId}, Stage 66 board row ${followUpReviewPathStep.sourceReviewBoardRowId}, Stage 65 brief row ${followUpReviewPathStep.followUpReadinessBriefRowId}, Stage 64 triage row ${followUpReviewPathStep.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${joinOrNone(followUpReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(followUpReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(followUpReviewPathStep.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(followUpReviewPathStep.deferredScopeReminderIds)}, coverage labels ${joinOrNone(coverageLabels)}, static review prompt labels ${joinOrNone(staticReviewPromptLabels)}, Stage 89 follow-up text "${followUpReviewPathStep.followUpReviewText}", and Stage 89 readiness cue text "${followUpReviewPathStep.readinessCueText}" as deterministic manual coverage context only.`,
    staticReviewPromptText:
      `Static review prompt context for coverage row ${sourceFollowUpReviewPathStepId}: compare Stage 89 follow-up review path step ${sourceFollowUpReviewPathStepId}, Stage 89 static readiness cue cards ${joinOrNone(sourceStaticReadinessCueCardIds)}, Stage 88 readiness row ${followUpReviewPathStep.sourceEvidenceGapReadinessRowId}, Stage 88 static follow-up prompt cards ${joinOrNone(followUpReviewPathStep.sourceStaticFollowUpPromptCardIds)}, Stage 87 evidence-check review path step ${followUpReviewPathStep.sourceEvidenceCheckReviewPathStepId}, anchors ${joinOrNone(followUpReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(followUpReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(followUpReviewPathStep.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(followUpReviewPathStep.deferredScopeReminderIds)}, and Stage 89 labels ${joinOrNone([...followUpReviewPathStep.followUpReviewLabels, ...followUpReviewPathStep.readinessCueLabels])} before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, evidence-check selections, evidence-gap readiness selections, evidence-gap follow-up selections, coverage-board selections, coverage state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static evidence-gap follow-up coverage context: manual review-path, readiness-cue, prompt-card, source-lineage, anchor, callback, gap-prompt, and deferred-reminder comparison only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved evidence-check selections, saved evidence-gap readiness selections, saved evidence-gap follow-up selections, saved coverage-board selections, saved coverage state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      followUpReviewPathStep.staticNonGoalFlags,
    ),
  };
}

function buildStaticReviewPromptCard(
  staticReadinessCueCard: Stage89StaticReadinessCueCard,
  followUpReviewPathSteps: Stage89Step[],
): ConstraintResponseEvidenceGapFollowUpCoverageBoardStaticReviewPromptCardView {
  const sourceStaticReadinessCueCardId =
    staticReadinessCueCard.staticReadinessCueCardId;
  const matchedFollowUpReviewPathSteps = followUpReviewPathSteps.filter((step) =>
    rowMatchesStaticReviewPromptCard(step, staticReadinessCueCard),
  );
  const sourceFollowUpReviewPathStepIds =
    matchedFollowUpReviewPathSteps.map((step) => step.followUpReviewPathStepId);
  const coverageLabels = buildCardCoverageLabels(
    staticReadinessCueCard,
    matchedFollowUpReviewPathSteps,
  );
  const staticReviewPromptLabels = buildCardStaticReviewPromptLabels(
    staticReadinessCueCard,
    matchedFollowUpReviewPathSteps,
  );
  const staticReviewPromptCardId =
    `constraint-response-evidence-gap-follow-up-coverage-board:static-review-prompt:${sourceStaticReadinessCueCardId}`;

  return {
    ...staticReadinessCueCard,
    staticReviewPromptCardId,
    staticReviewPromptCardIds: [staticReviewPromptCardId],
    staticReviewPromptOrder: staticReadinessCueCard.staticReadinessCueOrder,
    sourceStaticReadinessCueCardId,
    sourceStaticReadinessCueCardIds: [sourceStaticReadinessCueCardId],
    sourceFollowUpReviewPathStepIds,
    coverageLabels,
    staticReviewPromptLabels,
    coverageText:
      `Coverage prompt ${sourceStaticReadinessCueCardId}: carry Stage 89 static readiness cue card ${sourceStaticReadinessCueCardId}, Stage 89 follow-up review path steps ${joinOrNone(sourceFollowUpReviewPathStepIds)}, Stage 88 static follow-up prompt card ${staticReadinessCueCard.sourceStaticFollowUpPromptCardId}, Stage 88 readiness rows ${joinOrNone(staticReadinessCueCard.sourceEvidenceGapReadinessRowIds)}, Stage 87 static citation-gap cue card ${staticReadinessCueCard.sourceStaticCitationGapCueCardId}, Stage 87 evidence-check review path steps ${joinOrNone(staticReadinessCueCard.sourceEvidenceCheckReviewPathStepIds)}, Stage 86 citation-review lane row ${staticReadinessCueCard.sourceCitationReviewLaneRowId}, Stage 86 static evidence-check prompt cards ${joinOrNone(staticReadinessCueCard.sourceStaticEvidenceCheckPromptCardIds)}, Stage 85 citation prompt card ${staticReadinessCueCard.sourceStaticCitationCheckPromptCardId}, Stage 85 source follow-up map entries ${joinOrNone(staticReadinessCueCard.sourceSourceFollowUpMapEntryIds)}, anchors ${joinOrNone(staticReadinessCueCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticReadinessCueCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticReadinessCueCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticReadinessCueCard.deferredScopeReminderIds)}, coverage labels ${joinOrNone(coverageLabels)}, and Stage 89 follow-up review text "${staticReadinessCueCard.followUpReviewText}" as deterministic manual coverage context only.`,
    staticReviewPromptText:
      `Static review prompt card ${sourceStaticReadinessCueCardId}: inspect Stage 89 static readiness cue card ${sourceStaticReadinessCueCardId}, Stage 89 review path steps ${joinOrNone(sourceFollowUpReviewPathStepIds)}, Stage 88 static follow-up prompt card ${staticReadinessCueCard.sourceStaticFollowUpPromptCardId}, Stage 88 readiness rows ${joinOrNone(staticReadinessCueCard.sourceEvidenceGapReadinessRowIds)}, Stage 87 citation-gap cue ${staticReadinessCueCard.sourceStaticCitationGapCueCardId}, Stage 86 citation-review lane row ${staticReadinessCueCard.sourceCitationReviewLaneRowId}, Stage 85 citation prompt ${staticReadinessCueCard.sourceStaticCitationCheckPromptCardId}, Stage 84 readiness rows ${joinOrNone(staticReadinessCueCard.sourceSourceReadinessLaneRowIds)}, Stage 83 source-review path steps ${joinOrNone(staticReadinessCueCard.sourceSourceReviewPathStepIds)}, Stage 82 crosswalk rows ${joinOrNone(staticReadinessCueCard.sourceCrosswalkRowIds)}, Stage 81 review-path steps ${joinOrNone(staticReadinessCueCard.sourceConstraintResponseReviewPathStepIds)}, anchors ${joinOrNone(staticReadinessCueCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticReadinessCueCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticReadinessCueCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticReadinessCueCard.deferredScopeReminderIds)}, static review prompt labels ${joinOrNone(staticReviewPromptLabels)}, and Stage 89 readiness cue text "${staticReadinessCueCard.readinessCueText}" before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, evidence-check selections, evidence-gap readiness selections, evidence-gap follow-up selections, coverage-board selections, coverage state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static review prompt context: manual Stage 89 readiness-cue, review-path, source-lineage, anchor, callback, gap-prompt, and deferred-reminder review only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved evidence-check selections, saved evidence-gap readiness selections, saved evidence-gap follow-up selections, saved coverage-board selections, saved coverage state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticReadinessCueCard.staticNonGoalFlags,
    ),
  };
}

function rowMatchesStaticReviewPromptCard(
  followUpReviewPathStep: Stage89Step,
  staticReadinessCueCard: Stage89StaticReadinessCueCard,
): boolean {
  return (
    staticReadinessCueCard.sourceEvidenceGapReadinessRowIds.includes(
      followUpReviewPathStep.sourceEvidenceGapReadinessRowId,
    ) ||
    followUpReviewPathStep.sourceStaticFollowUpPromptCardIds.includes(
      staticReadinessCueCard.sourceStaticFollowUpPromptCardId,
    ) ||
    staticReadinessCueCard.sourceEvidenceCheckReviewPathStepIds.includes(
      followUpReviewPathStep.sourceEvidenceCheckReviewPathStepId,
    )
  );
}

function buildCounts(
  coverageRows: ConstraintResponseEvidenceGapFollowUpCoverageBoardRowView[],
  staticReviewPromptCards: ConstraintResponseEvidenceGapFollowUpCoverageBoardStaticReviewPromptCardView[],
  evidenceGapFollowUpReviewPath: Stage89View,
): ConstraintResponseEvidenceGapFollowUpCoverageBoardSummaryView["counts"] {
  const sourceCounts = evidenceGapFollowUpReviewPath.summary.counts;

  return {
    ...sourceCounts,
    coverageRowCount: coverageRows.length,
    staticReviewPromptCardCount: staticReviewPromptCards.length,
    coverageLabelCount: unique([
      ...coverageRows.flatMap((row) => row.coverageLabels),
      ...staticReviewPromptCards.flatMap((card) => card.coverageLabels),
    ]).length,
    staticReviewPromptLabelCount: unique([
      ...coverageRows.flatMap((row) => row.staticReviewPromptLabels),
      ...staticReviewPromptCards.flatMap((card) => card.staticReviewPromptLabels),
    ]).length,
    localOnlyCoverageRowCount: coverageRows.filter((row) => row.localOnly).length,
    localOnlyStaticReviewPromptCardCount: staticReviewPromptCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function buildRowCoverageLabels(
  followUpReviewPathStep: Stage89Step,
  matchedStaticReadinessCueCards: Stage89StaticReadinessCueCard[],
): string[] {
  const labels = [
    "evidence-gap follow-up coverage row",
    "Stage 89 review path carry-forward",
  ];

  if (matchedStaticReadinessCueCards.length) {
    labels.push("matched Stage 89 static readiness cue context");
  }

  if (followUpReviewPathStep.followUpReviewLabels.length) {
    labels.push("Stage 89 follow-up review label carry-forward");
  }

  return labels;
}

function buildRowStaticReviewPromptLabels(
  followUpReviewPathStep: Stage89Step,
  matchedStaticReadinessCueCards: Stage89StaticReadinessCueCard[],
): string[] {
  const labels = [
    "static review prompt context",
    "Stage 89 static prompt carry-forward",
  ];

  if (matchedStaticReadinessCueCards.length) {
    labels.push("matched static readiness cue prompt context");
  }

  if (
    followUpReviewPathStep.gapDiscussionPointIds.length ||
    followUpReviewPathStep.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder review prompt");
  }

  return labels;
}

function buildCardCoverageLabels(
  staticReadinessCueCard: Stage89StaticReadinessCueCard,
  matchedFollowUpReviewPathSteps: Stage89Step[],
): string[] {
  const labels = [
    "static review prompt coverage context",
    "Stage 89 static readiness cue card",
  ];

  if (matchedFollowUpReviewPathSteps.length) {
    labels.push("matched follow-up review path coverage");
  }

  if (staticReadinessCueCard.followUpReviewLabels.length) {
    labels.push("Stage 89 follow-up review cue label carry-forward");
  }

  return labels;
}

function buildCardStaticReviewPromptLabels(
  staticReadinessCueCard: Stage89StaticReadinessCueCard,
  matchedFollowUpReviewPathSteps: Stage89Step[],
): string[] {
  const labels = [
    "static review prompt card",
    "Stage 89 readiness cue review prompt",
  ];

  if (matchedFollowUpReviewPathSteps.length) {
    labels.push("matched coverage row context");
  }

  if (
    staticReadinessCueCard.gapDiscussionPointIds.length ||
    staticReadinessCueCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder review prompt");
  }

  return labels;
}

function staticNonGoalFlags(
  sourceFlags: Stage89StaticNonGoalFlags,
): ConstraintResponseEvidenceGapFollowUpCoverageBoardStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedCoverageBoardState: true,
    noSavedCoverageBoardSelections: true,
    noSavedStaticReviewPromptState: true,
    noSavedStaticReviewPromptCards: true,
  };
}

function joinOrNone(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}
