import type {
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathStaticCitationGapCueCardView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathStaticNonGoalFlagsView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathStepView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathSummaryView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneRowView as Stage106Row,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneStaticEvidenceCheckPromptCardView as Stage106StaticEvidenceCard,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneStaticNonGoalFlagsView as Stage106StaticNonGoalFlags,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneView as Stage106View,
} from "../features/mission-console/types.ts";

const stage107IdPrefix =
  "constraint-response-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path-source-crosswalk-review-path-source-review-readiness-lane-source-follow-up-map-source-citation-review-lane-evidence-check-review-path";

export function buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath(
  sourceCitationReviewLane: Stage106View | undefined,
): ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathView | undefined {
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
        sourceCitationReviewLane.defaultCitationReviewLaneRow.citationReviewLaneRowId,
    ) ?? staticCitationGapCueCards[0];
  const defaultStage106Context =
    sourceCitationReviewLane.summary.defaultCitationReviewContext;

  return {
    schema:
      "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map_source_citation_review_lane_evidence_check_review_path.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path source-review readiness lane source follow-up map source citation-review lane evidence-check review path and static citation-gap cues",
    localStatus: sourceCitationReviewLane.localStatus,
    summary: {
      constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathId:
        `candidate-local-${stage107IdPrefix}`,
      label: "Local constraint-response revision follow-up evidence-check review path",
      summary:
        "A static evidence-check review path derives from Stage 106 evidence-check prompt cards and static citation-gap cues derive from Stage 106 citation-review lane rows so reviewers can inspect evidence prompts, citation rows, source lineage, local anchors, callbacks, gaps, and deferred reminders before drafting outside the app without saved answers, drafts, reviewer notes, response notes, source selections, citation selections, evidence-check selections, evidence-check review state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
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
        sourceStage106SourceCitationReviewLaneSummary:
          sourceCitationReviewLane.summary.summary,
        sourceStage106DefaultCitationReviewContext: defaultStage106Context,
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
      "Stage 107 evidence-check review path steps and static citation-gap cue cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; no saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, evidence-check selections, evidence-check review state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane:
      sourceCitationReviewLane,
  };
}

function buildEvidenceCheckReviewPathStep(
  staticEvidenceCheckPromptCard: Stage106StaticEvidenceCard,
  citationReviewLaneRows: Stage106Row[],
): ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathStepView {
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
    `${stage107IdPrefix}:step:${sourceStaticEvidenceCheckPromptCardId}`;

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
    sourceSourceReviewPathStepIds: oneOrNone(
      staticEvidenceCheckPromptCard.sourceSourceReviewPathStepId,
    ),
    sourceCrosswalkRowIds: oneOrNone(staticEvidenceCheckPromptCard.sourceCrosswalkRowId),
    sourceConstraintCoverageReviewPathStepIds: oneOrNone(
      staticEvidenceCheckPromptCard.sourceConstraintCoverageReviewPathStepId,
    ),
    sourceConstraintCoverageRowIds: oneOrNone(
      staticEvidenceCheckPromptCard.sourceConstraintCoverageRowId,
    ),
    sourceAnswerReviewPathStepIds: oneOrNone(
      staticEvidenceCheckPromptCard.sourceAnswerReviewPathStepId,
    ),
    sourceStaticAnswerCheckCardIds: oneOrNone(
      staticEvidenceCheckPromptCard.sourceStaticAnswerCheckCardId,
    ),
    sourceResponseMapRowIds: staticEvidenceCheckPromptCard.sourceResponseMapRowIds,
    sourceCoverageReviewPathStepIds:
      staticEvidenceCheckPromptCard.sourceCoverageReviewPathStepIds,
    sourceCoverageMatrixRowIds:
      staticEvidenceCheckPromptCard.sourceCoverageMatrixRowIds,
    sourceReviewPathStepIds: staticEvidenceCheckPromptCard.sourceReviewPathStepIds,
    sourceSourceRecapRowIds: staticEvidenceCheckPromptCard.sourceSourceRecapRowIds,
    sourceAnswerFollowUpReviewLaneRowIds:
      staticEvidenceCheckPromptCard.sourceAnswerFollowUpReviewLaneRowIds,
    sourceAnswerSourceCrosswalkRowIds:
      staticEvidenceCheckPromptCard.sourceAnswerSourceCrosswalkRowIds,
    sourceAnswerWalkthroughStepIds:
      staticEvidenceCheckPromptCard.sourceAnswerWalkthroughStepIds,
    sourceAnswerCoverageRowIds:
      staticEvidenceCheckPromptCard.sourceAnswerCoverageRowIds,
    sourceRehearsalPathStepIds:
      staticEvidenceCheckPromptCard.sourceRehearsalPathStepIds,
    sourceReviewBoardRowIds: staticEvidenceCheckPromptCard.sourceReviewBoardRowIds,
    sourceFollowUpReadinessBriefRowIds:
      staticEvidenceCheckPromptCard.sourceFollowUpReadinessBriefRowIds,
    sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowIds:
      staticEvidenceCheckPromptCard
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowIds,
    evidenceCheckReviewLabels,
    citationGapCueLabels,
    evidenceCheckReviewText:
      `Evidence-check review path step ${sourceStaticEvidenceCheckPromptCardId}: carry Stage 106 static evidence-check prompt card ${sourceStaticEvidenceCheckPromptCardId}, Stage 106 citation-review lane rows ${joinOrNone(sourceCitationReviewLaneRowIds)}, Stage 105 source follow-up map entry ${staticEvidenceCheckPromptCard.sourceSourceFollowUpMapEntryId}, Stage 105 citation prompt cards ${joinOrNone(staticEvidenceCheckPromptCard.sourceStaticCitationCheckPromptCardIds)}, Stage 104 readiness row ${staticEvidenceCheckPromptCard.sourceSourceReviewReadinessLaneRowId}, Stage 104 cue cards ${joinOrNone(staticEvidenceCheckPromptCard.sourceStaticSourceFollowUpCueCardIds)}, Stage 103 source-review path step ${staticEvidenceCheckPromptCard.sourceSourceReviewPathStepId}, Stage 103 static source-review prompt cards ${joinOrNone(staticEvidenceCheckPromptCard.sourceStaticSourceReviewPromptCardIds)}, Stage 102 source-crosswalk row ${staticEvidenceCheckPromptCard.sourceCrosswalkRowId}, Stage 102 static review-check cards ${joinOrNone(staticEvidenceCheckPromptCard.sourceStaticReviewCheckCardIds)}, Stage 101 review-path step ${staticEvidenceCheckPromptCard.sourceConstraintCoverageReviewPathStepId}, Stage 101 response-review prompt cards ${joinOrNone(staticEvidenceCheckPromptCard.sourceStaticResponseReviewPromptCardIds)}, Stage 100 constraint-coverage row ${staticEvidenceCheckPromptCard.sourceConstraintCoverageRowId}, Stage 100 response-note prompt cards ${joinOrNone(staticEvidenceCheckPromptCard.sourceStaticResponseNotePromptCardIds)}, Stage 99 answer-review step ${staticEvidenceCheckPromptCard.sourceAnswerReviewPathStepId}, Stage 99 constraint-note cards ${joinOrNone(staticEvidenceCheckPromptCard.sourceStaticConstraintNoteCardIds)}, Stage 98 answer-check card ${staticEvidenceCheckPromptCard.sourceStaticAnswerCheckCardId}, Stage 98 readiness rows ${joinOrNone(staticEvidenceCheckPromptCard.sourceResponsePromptReadinessRowIds)}, Stage 97 response-prompt cards ${joinOrNone(staticEvidenceCheckPromptCard.sourceStaticResponsePromptCardIds)}, Stage 97 response-map review-path steps ${joinOrNone(staticEvidenceCheckPromptCard.sourceResponseMapReviewPathStepIds)}, Stage 96 response-map rows ${joinOrNone(staticEvidenceCheckPromptCard.sourceResponseMapRowIds)}, Stage 95 coverage-review steps ${joinOrNone(staticEvidenceCheckPromptCard.sourceCoverageReviewPathStepIds)}, Stage 94 coverage rows ${joinOrNone(staticEvidenceCheckPromptCard.sourceCoverageMatrixRowIds)}, Stage 93 review-path steps ${joinOrNone(staticEvidenceCheckPromptCard.sourceReviewPathStepIds)}, Stage 92 source recap rows ${joinOrNone(staticEvidenceCheckPromptCard.sourceSourceRecapRowIds)}, Stage 91 review-lane rows ${joinOrNone(staticEvidenceCheckPromptCard.sourceAnswerFollowUpReviewLaneRowIds)}, Stage 90 crosswalk rows ${joinOrNone(staticEvidenceCheckPromptCard.sourceAnswerSourceCrosswalkRowIds)}, Stage 89 walkthrough steps ${joinOrNone(staticEvidenceCheckPromptCard.sourceAnswerWalkthroughStepIds)}, Stage 88 answer coverage rows ${joinOrNone(staticEvidenceCheckPromptCard.sourceAnswerCoverageRowIds)}, Stage 87 rehearsal steps ${joinOrNone(staticEvidenceCheckPromptCard.sourceRehearsalPathStepIds)}, Stage 86 board rows ${joinOrNone(staticEvidenceCheckPromptCard.sourceReviewBoardRowIds)}, Stage 85 brief rows ${joinOrNone(staticEvidenceCheckPromptCard.sourceFollowUpReadinessBriefRowIds)}, Stage 84 triage rows ${joinOrNone(staticEvidenceCheckPromptCard.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowIds)}, and Stage 64 through Stage 83 carried source lineage ids, anchors ${joinOrNone(staticEvidenceCheckPromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticEvidenceCheckPromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticEvidenceCheckPromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticEvidenceCheckPromptCard.deferredScopeReminderIds)}, evidence-check review labels ${joinOrNone(evidenceCheckReviewLabels)}, citation-gap cue labels ${joinOrNone(citationGapCueLabels)}, and Stage 106 evidence prompt text "${displayCarriedText(staticEvidenceCheckPromptCard.evidenceCheckPromptText)}" as deterministic manual evidence-check review context only.`,
    citationGapCueText:
      `Static citation-gap cue for evidence-check step ${sourceStaticEvidenceCheckPromptCardId}: compare matched Stage 106 citation-review rows ${joinOrNone(sourceCitationReviewLaneRowIds)}, Stage 105 citation prompts ${joinOrNone(staticEvidenceCheckPromptCard.sourceStaticCitationCheckPromptCardIds)}, source follow-up entry ${staticEvidenceCheckPromptCard.sourceSourceFollowUpMapEntryId}, local anchors ${joinOrNone(staticEvidenceCheckPromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticEvidenceCheckPromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticEvidenceCheckPromptCard.gapDiscussionPointIds)}, and deferred reminders ${joinOrNone(staticEvidenceCheckPromptCard.deferredScopeReminderIds)} before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, evidence-check selections, evidence-check review state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static Stage 107 evidence-check review path context: manual evidence-prompt, citation-row, source-lineage, anchor, callback, gap, and deferred-reminder review only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved evidence-check selections, saved evidence-check review path state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticEvidenceCheckPromptCard.staticNonGoalFlags,
    ),
  };
}

function buildStaticCitationGapCueCard(
  citationReviewLaneRow: Stage106Row,
  staticEvidenceCheckPromptCards: Stage106StaticEvidenceCard[],
): ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathStaticCitationGapCueCardView {
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
    `${stage107IdPrefix}:static-citation-gap-cue:${sourceCitationReviewLaneRowId}`;

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
      `Evidence-check review cue ${sourceCitationReviewLaneRowId}: carry Stage 106 citation-review lane row ${sourceCitationReviewLaneRowId}, matched Stage 106 static evidence-check prompt cards ${joinOrNone(sourceStaticEvidenceCheckPromptCardIds)}, Stage 105 citation prompt card ${citationReviewLaneRow.sourceStaticCitationCheckPromptCardId}, Stage 105 source follow-up map entries ${joinOrNone(citationReviewLaneRow.sourceSourceFollowUpMapEntryIds)}, Stage 104 readiness rows ${joinOrNone(citationReviewLaneRow.sourceSourceReviewReadinessLaneRowIds)}, Stage 103 source-review path steps ${joinOrNone(citationReviewLaneRow.sourceSourceReviewPathStepIds)}, Stage 102 source-crosswalk rows ${joinOrNone(citationReviewLaneRow.sourceCrosswalkRowIds)}, Stage 101 review-path steps ${joinOrNone(citationReviewLaneRow.sourceConstraintCoverageReviewPathStepIds)}, Stage 100 constraint-coverage rows ${joinOrNone(citationReviewLaneRow.sourceConstraintCoverageRowIds)}, Stage 99 answer-review steps ${joinOrNone(citationReviewLaneRow.sourceAnswerReviewPathStepIds)}, Stage 98 answer-check cards ${joinOrNone(citationReviewLaneRow.sourceStaticAnswerCheckCardIds)}, Stage 97 response-map review-path steps ${joinOrNone(citationReviewLaneRow.sourceResponseMapReviewPathStepIds)}, Stage 96 response-map rows ${joinOrNone(citationReviewLaneRow.sourceResponseMapRowIds)}, Stage 95 through Stage 64 lineage ids, anchors ${joinOrNone(citationReviewLaneRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(citationReviewLaneRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(citationReviewLaneRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(citationReviewLaneRow.deferredScopeReminderIds)}, and evidence-check review labels ${joinOrNone(evidenceCheckReviewLabels)} as deterministic manual evidence-check context only.`,
    citationGapCueText:
      `Static citation-gap cue card ${sourceCitationReviewLaneRowId}: inspect Stage 106 citation-review row ${sourceCitationReviewLaneRowId}, Stage 106 static evidence-check prompts ${joinOrNone(sourceStaticEvidenceCheckPromptCardIds)}, Stage 105 static citation prompt ${citationReviewLaneRow.sourceStaticCitationCheckPromptCardId}, Stage 105 follow-up entries ${joinOrNone(citationReviewLaneRow.sourceSourceFollowUpMapEntryIds)}, Stage 104 cue ${citationReviewLaneRow.sourceStaticSourceFollowUpCueCardId}, Stage 103 source-review prompts ${joinOrNone(citationReviewLaneRow.sourceStaticSourceReviewPromptCardIds)}, Stage 102 review-check cards ${joinOrNone(citationReviewLaneRow.sourceStaticReviewCheckCardIds)}, local anchors ${joinOrNone(citationReviewLaneRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(citationReviewLaneRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(citationReviewLaneRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(citationReviewLaneRow.deferredScopeReminderIds)}, citation-gap labels ${joinOrNone(citationGapCueLabels)}, and Stage 106 citation-review text "${displayCarriedText(citationReviewLaneRow.citationReviewText)}" before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, evidence-check selections, evidence-check review state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static Stage 107 citation-gap cue context: manual citation-gap, source-lineage, anchor, callback, gap-prompt, and deferred-reminder review only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved evidence-check selections, saved evidence-check review path state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(citationReviewLaneRow.staticNonGoalFlags),
  };
}

function rowMatchesEvidenceCard(
  citationReviewLaneRow: Stage106Row,
  staticEvidenceCheckPromptCard: Stage106StaticEvidenceCard,
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
  evidenceCheckReviewPathSteps: ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathStepView[],
  staticCitationGapCueCards: ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathStaticCitationGapCueCardView[],
  sourceCitationReviewLane: Stage106View,
): ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathSummaryView["counts"] {
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
      ...staticCitationGapCueCards.flatMap((card) => card.citationGapCueLabels),
    ]).length,
    localOnlyEvidenceCheckReviewPathStepCount:
      evidenceCheckReviewPathSteps.filter((step) => step.localOnly).length,
    localOnlyStaticCitationGapCueCardCount: staticCitationGapCueCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function buildStepEvidenceCheckReviewLabels(
  staticEvidenceCheckPromptCard: Stage106StaticEvidenceCard,
  matchedCitationReviewLaneRows: Stage106Row[],
): string[] {
  const labels = [
    "evidence-check review path step",
    "Stage 106 static evidence-check prompt carry-forward",
  ];

  if (matchedCitationReviewLaneRows.length) {
    labels.push("matched Stage 106 citation-review row context");
  }

  if (staticEvidenceCheckPromptCard.evidenceCheckLabels.length) {
    labels.push("Stage 106 evidence-check label carry-forward");
  }

  return labels;
}

function buildStepCitationGapCueLabels(
  staticEvidenceCheckPromptCard: Stage106StaticEvidenceCard,
  matchedCitationReviewLaneRows: Stage106Row[],
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
  citationReviewLaneRow: Stage106Row,
  matchedStaticEvidenceCheckPromptCards: Stage106StaticEvidenceCard[],
): string[] {
  const labels = [
    "citation row evidence-check carry-forward",
    "Stage 106 citation-review lane row",
  ];

  if (matchedStaticEvidenceCheckPromptCards.length) {
    labels.push("matched static evidence-check prompt context");
  }

  if (citationReviewLaneRow.evidenceCheckLabels.length) {
    labels.push("Stage 106 evidence-check label carry-forward");
  }

  return labels;
}

function buildCueCitationGapCueLabels(
  citationReviewLaneRow: Stage106Row,
  matchedStaticEvidenceCheckPromptCards: Stage106StaticEvidenceCard[],
): string[] {
  const labels = [
    "static citation-gap cue card",
    "Stage 106 citation-review row gap context",
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
  sourceFlags: Stage106StaticNonGoalFlags,
): ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathStaticNonGoalFlagsView {
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

function oneOrNone(value: string | undefined): string[] {
  return value ? [value] : [];
}

function joinOrNone(values: string[] | undefined): string {
  return values?.length ? values.join(", ") : "none";
}

function displayCarriedText(value: string | undefined): string {
  return value?.replaceAll("undefined", "none") ?? "none";
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}
