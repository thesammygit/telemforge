import type {
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapEntryView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapStaticCitationCheckPromptCardView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapStaticNonGoalFlagsView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSummaryView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneView as Stage104View,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowView as Stage104Row,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticNonGoalFlagsView as Stage104StaticNonGoalFlags,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardView as Stage104StaticSourceFollowUpCueCard,
} from "../features/mission-console/types.ts";

const stage105IdPrefix =
  "constraint-response-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path-source-crosswalk-review-path-source-review-readiness-lane-source-follow-up-map";

export function buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap(
  sourceReviewReadinessLane: Stage104View | undefined,
): ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapView | undefined {
  if (
    !sourceReviewReadinessLane?.sourceReviewReadinessLaneRows.length ||
    !sourceReviewReadinessLane.staticSourceFollowUpCueCards.length
  ) {
    return undefined;
  }

  const sourceFollowUpMapEntries = sourceReviewReadinessLane.sourceReviewReadinessLaneRows.map(
    (row) =>
      buildSourceFollowUpMapEntry(
        row,
        sourceReviewReadinessLane.staticSourceFollowUpCueCards,
      ),
  );
  const staticCitationCheckPromptCards =
    sourceReviewReadinessLane.staticSourceFollowUpCueCards.map((card) =>
      buildStaticCitationCheckPromptCard(card, sourceFollowUpMapEntries),
    );
  const defaultSourceReviewReadinessLaneRow =
    sourceReviewReadinessLane.defaultSourceReviewReadinessLaneRow ??
    sourceReviewReadinessLane.sourceReviewReadinessLaneRows[0];
  const defaultStaticSourceFollowUpCueCard =
    sourceReviewReadinessLane.defaultStaticSourceFollowUpCueCard ??
    sourceReviewReadinessLane.staticSourceFollowUpCueCards[0];
  const defaultSourceFollowUpMapEntry =
    sourceFollowUpMapEntries.find(
      (entry) =>
        entry.sourceSourceReviewReadinessLaneRowId ===
        defaultSourceReviewReadinessLaneRow
          .constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowId,
    ) ?? sourceFollowUpMapEntries[0];
  const defaultStaticCitationCheckPromptCard =
    staticCitationCheckPromptCards.find(
      (card) =>
        card.sourceStaticSourceFollowUpCueCardId ===
        defaultStaticSourceFollowUpCueCard
          .constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardId,
    ) ?? staticCitationCheckPromptCards[0];
  const defaultStage104Context =
    sourceReviewReadinessLane.summary.defaultSourceReviewReadinessContext;

  return {
    schema:
      "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path source-review readiness lane source follow-up map and static citation-check prompts",
    localStatus: sourceReviewReadinessLane.localStatus,
    summary: {
      constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapId:
        `candidate-local-${stage105IdPrefix}`,
      label: "Local constraint-response revision follow-up source follow-up map",
      summary:
        "A static source follow-up map derives from Stage 104 source-review readiness lane rows and static source-follow-up cue cards so reviewers can inspect source lineage, citation checks, anchors, callbacks, gap prompts, and deferred reminders before drafting outside the app without saved answers, drafts, notes, source selections, citation selections, source-follow-up state, citation-check state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultSourceFollowUpContext: {
        defaultSourceFollowUpMapEntryId:
          defaultSourceFollowUpMapEntry.sourceFollowUpMapEntryId,
        defaultStaticCitationCheckPromptCardId:
          defaultStaticCitationCheckPromptCard.staticCitationCheckPromptCardId,
        defaultSourceReviewReadinessLaneRowId:
          defaultSourceFollowUpMapEntry.sourceSourceReviewReadinessLaneRowId,
        defaultStaticSourceFollowUpCueCardId:
          defaultStaticCitationCheckPromptCard.sourceStaticSourceFollowUpCueCardId,
        defaultSourceReviewPathStepId:
          defaultStage104Context.defaultSourceReviewPathStepId,
        defaultStaticSourceReviewPromptCardId:
          defaultStage104Context.defaultStaticSourceReviewPromptCardId,
        defaultSourceCrosswalkRowId:
          defaultStage104Context.defaultSourceCrosswalkRowId,
        defaultStaticReviewCheckCardId:
          defaultStage104Context.defaultStaticReviewCheckCardId,
        defaultConstraintCoverageReviewPathStepId:
          defaultStage104Context.defaultConstraintCoverageReviewPathStepId,
        defaultStaticResponsePromptCardId:
          defaultStage104Context.defaultStaticResponsePromptCardId,
        defaultConstraintCoverageRowId:
          defaultStage104Context.defaultConstraintCoverageRowId,
        defaultStaticResponseNotePromptCardId:
          defaultStage104Context.defaultStaticResponseNotePromptCardId,
        defaultAnswerReviewPathStepId:
          defaultStage104Context.defaultAnswerReviewPathStepId,
        defaultStaticConstraintNoteCardId:
          defaultStage104Context.defaultStaticConstraintNoteCardId,
        defaultStaticAnswerCheckCardId:
          defaultStage104Context.defaultStaticAnswerCheckCardId,
        defaultResponsePromptReadinessRowId:
          defaultStage104Context.defaultResponsePromptReadinessRowId,
        defaultResponseMapReviewPathStepId:
          defaultStage104Context.defaultResponseMapReviewPathStepId,
        defaultResponseMapRowId:
          defaultStage104Context.defaultResponseMapRowId,
        defaultResponseMapStaticFollowUpPromptCardId:
          defaultStage104Context.defaultResponseMapStaticFollowUpPromptCardId,
        defaultCoverageReviewPathStepId:
          defaultStage104Context.defaultCoverageReviewPathStepId,
        defaultCoverageMatrixRowId:
          defaultStage104Context.defaultCoverageMatrixRowId,
        defaultReviewPathSourceStepId:
          defaultStage104Context.defaultReviewPathSourceStepId,
        defaultSourceRecapRowId:
          defaultStage104Context.defaultSourceRecapRowId,
        defaultAnswerFollowUpReviewLaneRowId:
          defaultStage104Context.defaultAnswerFollowUpReviewLaneRowId,
        defaultAnswerSourceCrosswalkRowId:
          defaultStage104Context.defaultAnswerSourceCrosswalkRowId,
        defaultAnswerWalkthroughStepId:
          defaultStage104Context.defaultAnswerWalkthroughStepId,
        defaultAnswerCoverageRowId:
          defaultStage104Context.defaultAnswerCoverageRowId,
        defaultRehearsalPathStepId:
          defaultStage104Context.defaultRehearsalPathStepId,
        defaultReviewBoardRowId:
          defaultStage104Context.defaultReviewBoardRowId,
        defaultFollowUpReadinessBriefRowId:
          defaultStage104Context.defaultFollowUpReadinessBriefRowId,
        defaultFollowUpTriageRowId:
          defaultStage104Context.defaultFollowUpTriageRowId,
        defaultStaticCoveragePromptCardId:
          defaultStage104Context.defaultStaticCoveragePromptCardId,
        defaultStaticReadinessCueCardId:
          defaultStage104Context.defaultStaticReadinessCueCardId,
        defaultStaticReviewerCheckCardId:
          defaultStage104Context.defaultStaticReviewerCheckCardId,
        sourceStage104SourceReviewReadinessLaneSummary:
          sourceReviewReadinessLane.summary.summary,
        sourceStage104DefaultSourceReviewReadinessContext:
          defaultStage104Context,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        sourceFollowUpMapEntries,
        staticCitationCheckPromptCards,
        sourceReviewReadinessLane,
      ),
    },
    defaultSourceFollowUpMapEntry,
    defaultStaticCitationCheckPromptCard,
    sourceFollowUpMapEntries,
    staticCitationCheckPromptCards,
    staticCitationCheckBoundarySummary:
      "Stage 105 source follow-up map entries and static citation-check prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, source-follow-up state, citation-check state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLane:
      sourceReviewReadinessLane,
  };
}

function buildSourceFollowUpMapEntry(
  sourceReviewReadinessLaneRow: Stage104Row,
  staticSourceFollowUpCueCards: Stage104StaticSourceFollowUpCueCard[],
): ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapEntryView {
  const sourceSourceReviewReadinessLaneRowId =
    sourceReviewReadinessLaneRow
      .constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowId;
  const matchedStaticSourceFollowUpCueCards = staticSourceFollowUpCueCards.filter(
    (card) =>
      card.sourceSourceReviewReadinessLaneRowIds.includes(
        sourceSourceReviewReadinessLaneRowId,
      ),
  );
  const sourceStaticSourceFollowUpCueCardIds =
    matchedStaticSourceFollowUpCueCards.map(
      (card) =>
        card.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardId,
    );
  const sourceFollowUpLabels = buildSourceFollowUpLabels(
    sourceReviewReadinessLaneRow,
    matchedStaticSourceFollowUpCueCards,
  );
  const citationCheckLabels = buildCitationCheckLabels(
    sourceReviewReadinessLaneRow,
    matchedStaticSourceFollowUpCueCards,
  );
  const sourceFollowUpMapEntryId =
    `${stage105IdPrefix}:entry:${sourceSourceReviewReadinessLaneRowId}`;

  return {
    ...sourceReviewReadinessLaneRow,
    sourceFollowUpMapEntryId,
    sourceFollowUpMapEntryIds: [sourceFollowUpMapEntryId],
    sourceFollowUpMapEntryOrder:
      sourceReviewReadinessLaneRow.sourceReviewReadinessLaneRowOrder,
    sourceSourceReviewReadinessLaneRowId,
    sourceSourceReviewReadinessLaneRowIds: [sourceSourceReviewReadinessLaneRowId],
    sourceStaticSourceFollowUpCueCardIds,
    sourceFollowUpLabels,
    citationCheckLabels,
    sourceFollowUpText:
      `Source follow-up map entry ${sourceSourceReviewReadinessLaneRowId}: carry Stage 104 source-review readiness lane row ${sourceSourceReviewReadinessLaneRowId}, Stage 104 static source-follow-up cue cards ${joinOrNone(sourceStaticSourceFollowUpCueCardIds)}, Stage 103 source-review path step ${sourceReviewReadinessLaneRow.sourceSourceReviewPathStepId}, Stage 103 static source-review prompt cards ${joinOrNone(sourceReviewReadinessLaneRow.sourceStaticSourceReviewPromptCardIds)}, Stage 102 source-crosswalk row ${sourceReviewReadinessLaneRow.sourceCrosswalkRowId}, Stage 102 static review-check cards ${joinOrNone(sourceReviewReadinessLaneRow.sourceStaticReviewCheckCardIds)}, Stage 101 review-path step ${sourceReviewReadinessLaneRow.sourceConstraintCoverageReviewPathStepId}, Stage 101 response-review prompt cards ${joinOrNone(sourceReviewReadinessLaneRow.sourceStaticResponseReviewPromptCardIds)}, Stage 100 constraint-coverage row ${sourceReviewReadinessLaneRow.sourceConstraintCoverageRowId}, Stage 100 response-note prompt cards ${joinOrNone(sourceReviewReadinessLaneRow.sourceStaticResponseNotePromptCardIds)}, Stage 99 answer-review step ${sourceReviewReadinessLaneRow.sourceAnswerReviewPathStepId}, Stage 99 static constraint-note cards ${joinOrNone(sourceReviewReadinessLaneRow.sourceStaticConstraintNoteCardIds)}, Stage 98 answer-check card ${sourceReviewReadinessLaneRow.sourceStaticAnswerCheckCardId}, Stage 98 readiness rows ${joinOrNone(sourceReviewReadinessLaneRow.sourceResponsePromptReadinessRowIds)}, Stage 97 response-prompt cards ${joinOrNone(sourceReviewReadinessLaneRow.sourceStaticResponsePromptCardIds)}, Stage 97 response-map review-path step ${sourceReviewReadinessLaneRow.sourceResponseMapReviewPathStepId}, Stage 96 response-map row ${sourceReviewReadinessLaneRow.sourceResponseMapRowId}, Stage 95 coverage-review step ${sourceReviewReadinessLaneRow.sourceCoverageReviewPathStepId}, Stage 94 coverage row ${sourceReviewReadinessLaneRow.sourceCoverageMatrixRowId}, Stage 93 review-path step ${sourceReviewReadinessLaneRow.sourceReviewPathStepId}, Stage 92 source recap row ${sourceReviewReadinessLaneRow.sourceSourceRecapRowId}, Stage 91 review-lane row ${sourceReviewReadinessLaneRow.sourceAnswerFollowUpReviewLaneRowId}, Stage 90 crosswalk row ${sourceReviewReadinessLaneRow.sourceAnswerSourceCrosswalkRowId}, Stage 89 walkthrough step ${sourceReviewReadinessLaneRow.sourceAnswerWalkthroughStepId}, Stage 88 answer coverage row ${sourceReviewReadinessLaneRow.sourceAnswerCoverageRowId}, Stage 87 rehearsal step ${sourceReviewReadinessLaneRow.sourceRehearsalPathStepId}, Stage 86 board row ${sourceReviewReadinessLaneRow.sourceReviewBoardRowId}, Stage 85 brief row ${sourceReviewReadinessLaneRow.followUpReadinessBriefRowId}, Stage 84 triage row ${sourceReviewReadinessLaneRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${joinOrNone(sourceReviewReadinessLaneRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(sourceReviewReadinessLaneRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(sourceReviewReadinessLaneRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(sourceReviewReadinessLaneRow.deferredScopeReminderIds)}, source-follow-up labels ${joinOrNone(sourceFollowUpLabels)}, and Stage 104 source-readiness text "${sourceReviewReadinessLaneRow.sourceReadinessLaneText}" as deterministic manual source follow-up context only.`,
    citationCheckPromptText:
      `Static citation-check prompt for Stage 104 source-readiness row ${sourceSourceReviewReadinessLaneRowId}: compare Stage 104 cue cards ${joinOrNone(sourceStaticSourceFollowUpCueCardIds)}, Stage 103 source-review path step ${sourceReviewReadinessLaneRow.sourceSourceReviewPathStepId}, Stage 103 static source-review prompt cards ${joinOrNone(sourceReviewReadinessLaneRow.sourceStaticSourceReviewPromptCardIds)}, Stage 102 source-crosswalk row ${sourceReviewReadinessLaneRow.sourceCrosswalkRowId}, Stage 102 review-check cards ${joinOrNone(sourceReviewReadinessLaneRow.sourceStaticReviewCheckCardIds)}, Stage 101 response-review prompt cards ${joinOrNone(sourceReviewReadinessLaneRow.sourceStaticResponseReviewPromptCardIds)}, Stage 100 response-note prompt cards ${joinOrNone(sourceReviewReadinessLaneRow.sourceStaticResponseNotePromptCardIds)}, anchors ${joinOrNone(sourceReviewReadinessLaneRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(sourceReviewReadinessLaneRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(sourceReviewReadinessLaneRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(sourceReviewReadinessLaneRow.deferredScopeReminderIds)}, source follow-up labels ${joinOrNone(sourceFollowUpLabels)}, citation-check labels ${joinOrNone(citationCheckLabels)}, and Stage 104 static source-follow-up cue text "${sourceReviewReadinessLaneRow.staticSourceFollowUpCueText}" before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, source-follow-up state, citation-check state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static source follow-up map context: manual source-lineage and citation-check preparation only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved source-follow-up map state, saved citation-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(sourceReviewReadinessLaneRow.staticNonGoalFlags),
  };
}

function buildStaticCitationCheckPromptCard(
  staticSourceFollowUpCueCard: Stage104StaticSourceFollowUpCueCard,
  sourceFollowUpMapEntries: ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapEntryView[],
): ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapStaticCitationCheckPromptCardView {
  const sourceStaticSourceFollowUpCueCardId =
    staticSourceFollowUpCueCard
      .constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardId;
  const matchedSourceFollowUpMapEntries = sourceFollowUpMapEntries.filter(
    (entry) =>
      entry.sourceStaticSourceFollowUpCueCardIds.includes(
        sourceStaticSourceFollowUpCueCardId,
      ),
  );
  const sourceSourceFollowUpMapEntryIds = matchedSourceFollowUpMapEntries.map(
    (entry) => entry.sourceFollowUpMapEntryId,
  );
  const staticCitationCheckLabels = buildStaticCitationCheckLabels(
    staticSourceFollowUpCueCard,
    matchedSourceFollowUpMapEntries,
  );
  const staticCitationCheckPromptCardId =
    `${stage105IdPrefix}:static-citation-check:${sourceStaticSourceFollowUpCueCardId}`;

  return {
    ...staticSourceFollowUpCueCard,
    staticCitationCheckPromptCardId,
    staticCitationCheckPromptCardIds: [staticCitationCheckPromptCardId],
    sourceStaticSourceFollowUpCueCardId,
    sourceStaticSourceFollowUpCueCardIds: [sourceStaticSourceFollowUpCueCardId],
    sourceSourceFollowUpMapEntryIds,
    staticCitationCheckPromptOrder:
      staticSourceFollowUpCueCard.staticSourceFollowUpCueOrder,
    staticCitationCheckLabels,
    citationCheckPromptText:
      `Static citation-check prompt card ${sourceStaticSourceFollowUpCueCardId}: use Stage 104 static source-follow-up cue card ${sourceStaticSourceFollowUpCueCardId}, matched Stage 105 source follow-up map entries ${joinOrNone(sourceSourceFollowUpMapEntryIds)}, Stage 104 source-readiness lane rows ${joinOrNone(staticSourceFollowUpCueCard.sourceSourceReviewReadinessLaneRowIds)}, Stage 103 static source-review prompt card ${staticSourceFollowUpCueCard.sourceStaticSourceReviewPromptCardId}, Stage 102 static review-check card ${staticSourceFollowUpCueCard.sourceStaticReviewCheckCardId}, Stage 101 static response-review prompt card ${staticSourceFollowUpCueCard.sourceStaticResponseReviewPromptCardId}, Stage 100 static response-note prompt card ${staticSourceFollowUpCueCard.sourceStaticResponseNotePromptCardId}, Stage 98 readiness row ${staticSourceFollowUpCueCard.sourceResponsePromptReadinessRowId}, Stage 97 response-prompt card ${staticSourceFollowUpCueCard.sourceStaticResponsePromptCardId}, Stage 96 response-map rows ${joinOrNone(staticSourceFollowUpCueCard.sourceResponseMapRowIds)}, anchors ${joinOrNone(staticSourceFollowUpCueCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticSourceFollowUpCueCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticSourceFollowUpCueCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticSourceFollowUpCueCard.deferredScopeReminderIds)}, citation-check labels ${joinOrNone(staticCitationCheckLabels)}, source-follow-up cue labels ${joinOrNone(staticSourceFollowUpCueCard.staticSourceFollowUpCueLabels)}, and Stage 104 static source-follow-up cue text "${staticSourceFollowUpCueCard.staticSourceFollowUpCueText}" as deterministic manual citation-check context only.`,
    staticNonGoalContext:
      "Static citation-check prompt context: manual citation and source-follow-up checking only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved source-follow-up map state, saved citation-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(staticSourceFollowUpCueCard.staticNonGoalFlags),
  };
}

function buildCounts(
  sourceFollowUpMapEntries: ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapEntryView[],
  staticCitationCheckPromptCards: ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapStaticCitationCheckPromptCardView[],
  sourceReviewReadinessLane: Stage104View,
): ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSummaryView["counts"] {
  const sourceCounts = sourceReviewReadinessLane.summary.counts;

  return {
    ...sourceCounts,
    sourceFollowUpMapEntryCount: sourceFollowUpMapEntries.length,
    staticCitationCheckPromptCardCount: staticCitationCheckPromptCards.length,
    sourceFollowUpLabelCount: unique(
      sourceFollowUpMapEntries.flatMap((entry) => entry.sourceFollowUpLabels),
    ).length,
    citationCheckPromptLabelCount: unique([
      ...sourceFollowUpMapEntries.flatMap((entry) => entry.citationCheckLabels),
      ...staticCitationCheckPromptCards.flatMap(
        (card) => card.staticCitationCheckLabels,
      ),
    ]).length,
    localOnlySourceFollowUpMapEntryCount: sourceFollowUpMapEntries.filter(
      (entry) => entry.localOnly,
    ).length,
    localOnlyStaticCitationCheckPromptCardCount:
      staticCitationCheckPromptCards.filter((card) => card.localOnly).length,
  };
}

function buildSourceFollowUpLabels(
  sourceReviewReadinessLaneRow: Stage104Row,
  matchedStaticSourceFollowUpCueCards: Stage104StaticSourceFollowUpCueCard[],
): string[] {
  const labels = [
    "source follow-up map entry",
    "Stage 104 source-review readiness lane carry-forward",
  ];

  if (matchedStaticSourceFollowUpCueCards.length) {
    labels.push("Stage 104 static follow-up cue alignment");
  }

  if (sourceReviewReadinessLaneRow.sourceReviewReadinessLaneLabels.length) {
    labels.push("source-review readiness label carry-forward");
  }

  if (
    sourceReviewReadinessLaneRow.sourceLocalAnchorHrefs.length ||
    sourceReviewReadinessLaneRow.evidenceCallbackIds.length
  ) {
    labels.push("local anchor and callback follow-up context");
  }

  if (
    sourceReviewReadinessLaneRow.gapDiscussionPointIds.length ||
    sourceReviewReadinessLaneRow.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder follow-up context");
  }

  return labels;
}

function buildCitationCheckLabels(
  sourceReviewReadinessLaneRow: Stage104Row,
  matchedStaticSourceFollowUpCueCards: Stage104StaticSourceFollowUpCueCard[],
): string[] {
  const labels = [
    "static citation-check prompt context",
    "Stage 104 citation lineage carry-forward",
  ];

  if (matchedStaticSourceFollowUpCueCards.length) {
    labels.push("source follow-up cue citation alignment");
  }

  if (sourceReviewReadinessLaneRow.sourceStaticSourceReviewPromptCardIds.length) {
    labels.push("static source-review prompt citation context");
  }

  return labels;
}

function buildStaticCitationCheckLabels(
  staticSourceFollowUpCueCard: Stage104StaticSourceFollowUpCueCard,
  matchedSourceFollowUpMapEntries: ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapEntryView[],
): string[] {
  const labels = [
    "static citation-check prompt card",
    "Stage 104 source-follow-up cue carry-forward",
  ];

  if (matchedSourceFollowUpMapEntries.length) {
    labels.push("source follow-up map entry alignment");
  }

  if (staticSourceFollowUpCueCard.staticSourceFollowUpCueLabels.length) {
    labels.push("static source-follow-up cue context");
  }

  if (
    staticSourceFollowUpCueCard.sourceLocalAnchorHrefs.length ||
    staticSourceFollowUpCueCard.evidenceCallbackIds.length
  ) {
    labels.push("local anchor and callback citation context");
  }

  return labels;
}

function staticNonGoalFlags(
  sourceFlags: Stage104StaticNonGoalFlags,
): ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedSourceFollowUpMapState: true,
    noSavedCitationSelections: true,
    noSavedCitationCheckState: true,
    noSavedCitationCheckPromptState: true,
    noSavedStaticCitationCheckPrompts: true,
    noSavedStaticCitationCheckPromptCards: true,
  };
}

function joinOrNone(values: string[] | undefined): string {
  return values?.length ? values.join(", ") : "none";
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
