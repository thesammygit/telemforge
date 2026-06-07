import type {
  ConstraintResponseSourceFollowUpMapEntryView,
  ConstraintResponseSourceFollowUpMapStaticCitationCheckPromptCardView,
  ConstraintResponseSourceFollowUpMapStaticNonGoalFlagsView,
  ConstraintResponseSourceFollowUpMapSummaryView,
  ConstraintResponseSourceFollowUpMapView,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneRowView as Stage84Row,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneStaticNonGoalFlagsView as Stage84StaticNonGoalFlags,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneStaticSourceFollowUpCueCardView as Stage84StaticSourceFollowUpCueCard,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneView as Stage84View,
} from "../features/mission-console/types.ts";

export function buildConstraintResponseSourceFollowUpMap(
  sourceReadinessLane: Stage84View | undefined,
): ConstraintResponseSourceFollowUpMapView | undefined {
  if (
    !sourceReadinessLane?.sourceReadinessLaneRows.length ||
    !sourceReadinessLane.staticSourceFollowUpCueCards.length
  ) {
    return undefined;
  }

  const sourceFollowUpMapEntries = sourceReadinessLane.sourceReadinessLaneRows.map(
    (row) =>
      buildSourceFollowUpMapEntry(
        row,
        sourceReadinessLane.staticSourceFollowUpCueCards,
      ),
  );
  const staticCitationCheckPromptCards =
    sourceReadinessLane.staticSourceFollowUpCueCards.map((card) =>
      buildStaticCitationCheckPromptCard(card, sourceFollowUpMapEntries),
    );
  const defaultSourceFollowUpMapEntry =
    sourceFollowUpMapEntries.find(
      (entry) =>
        entry.sourceSourceReadinessLaneRowId ===
        sourceReadinessLane.defaultSourceReadinessLaneRow
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneRowId,
    ) ?? sourceFollowUpMapEntries[0];
  const defaultStaticCitationCheckPromptCard =
    staticCitationCheckPromptCards.find(
      (card) =>
        card.sourceStaticSourceFollowUpCueCardId ===
        sourceReadinessLane.defaultStaticSourceFollowUpCueCard
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneStaticSourceFollowUpCueCardId,
    ) ?? staticCitationCheckPromptCards[0];
  const defaultStage84Context =
    sourceReadinessLane.summary.defaultSourceReadinessContext;

  return {
    schema: "telemforge.constraint_response_source_follow_up_map.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response source follow-up map and static citation-check prompts",
    localStatus: sourceReadinessLane.localStatus,
    summary: {
      constraintResponseSourceFollowUpMapId:
        "candidate-local-constraint-response-source-follow-up-map",
      label: "Local constraint-response source follow-up map",
      summary:
        "A static source follow-up map derives from Stage 84 source-readiness lane rows and static source follow-up cue cards so reviewers can inspect source lineage, citation checks, anchors, callbacks, gap prompts, and deferred reminders before drafting outside the app without saved answers, drafts, notes, source selections, citation selections, source-follow-up state, citation-check state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultFollowUpContext: {
        defaultSourceFollowUpMapEntryId:
          defaultSourceFollowUpMapEntry.sourceFollowUpMapEntryId,
        defaultStaticCitationCheckPromptCardId:
          defaultStaticCitationCheckPromptCard.staticCitationCheckPromptCardId,
        defaultSourceReadinessLaneRowId:
          defaultSourceFollowUpMapEntry.sourceSourceReadinessLaneRowId,
        defaultStaticSourceFollowUpCueCardId:
          defaultStaticCitationCheckPromptCard.sourceStaticSourceFollowUpCueCardId,
        defaultSourceReviewPathStepId:
          defaultStage84Context.defaultSourceReviewPathStepId,
        defaultStaticSourceReviewPromptCardId:
          defaultStage84Context.defaultStaticSourceReviewPromptCardId,
        defaultSourceCrosswalkRowId:
          defaultStage84Context.defaultSourceCrosswalkRowId,
        defaultConstraintResponseReviewPathStepId:
          defaultStage84Context.defaultConstraintResponseReviewPathStepId,
        defaultConstraintCoverageRowId:
          defaultStage84Context.defaultConstraintCoverageRowId,
        sourceStage84SourceReadinessLaneSummary:
          sourceReadinessLane.summary.summary,
        sourceStage84DefaultSourceReadinessContext: defaultStage84Context,
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
        sourceReadinessLane,
      ),
    },
    defaultSourceFollowUpMapEntry,
    defaultStaticCitationCheckPromptCard,
    sourceFollowUpMapEntries,
    staticCitationCheckPromptCards,
    staticCitationCheckBoundarySummary:
      "Stage 85 source follow-up map entries and static citation-check prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, source-follow-up state, citation-check state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseSourceReadinessLane: sourceReadinessLane,
  };
}

function buildSourceFollowUpMapEntry(
  sourceReadinessLaneRow: Stage84Row,
  staticSourceFollowUpCueCards: Stage84StaticSourceFollowUpCueCard[],
): ConstraintResponseSourceFollowUpMapEntryView {
  const sourceSourceReadinessLaneRowId =
    sourceReadinessLaneRow
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneRowId;
  const matchedStaticSourceFollowUpCueCards = staticSourceFollowUpCueCards.filter(
    (card) =>
      card.sourceSourceReadinessLaneRowIds.includes(
        sourceSourceReadinessLaneRowId,
      ),
  );
  const sourceStaticSourceFollowUpCueCardIds =
    matchedStaticSourceFollowUpCueCards.map(
      (card) =>
        card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneStaticSourceFollowUpCueCardId,
    );
  const sourceFollowUpLabels = buildSourceFollowUpLabels(
    sourceReadinessLaneRow,
    matchedStaticSourceFollowUpCueCards,
  );
  const citationCheckLabels = buildEntryCitationCheckLabels(
    sourceReadinessLaneRow,
    matchedStaticSourceFollowUpCueCards,
  );
  const sourceFollowUpMapEntryId =
    `constraint-response-source-follow-up-map:entry:${sourceSourceReadinessLaneRowId}`;

  return {
    ...sourceReadinessLaneRow,
    sourceFollowUpMapEntryId,
    sourceFollowUpMapEntryIds: [sourceFollowUpMapEntryId],
    sourceFollowUpMapEntryOrder:
      sourceReadinessLaneRow.sourceReadinessLaneRowOrder,
    sourceSourceReadinessLaneRowId,
    sourceSourceReadinessLaneRowIds: [sourceSourceReadinessLaneRowId],
    sourceStaticSourceFollowUpCueCardIds,
    sourceFollowUpLabels,
    citationCheckLabels,
    sourceFollowUpText:
      `Source follow-up map entry ${sourceSourceReadinessLaneRowId}: carry Stage 84 source-readiness lane row ${sourceSourceReadinessLaneRowId}, Stage 84 static source-follow-up cue cards ${joinOrNone(sourceStaticSourceFollowUpCueCardIds)}, Stage 83 source-review path step ${sourceReadinessLaneRow.sourceSourceReviewPathStepId}, Stage 83 static source-review prompt cards ${joinOrNone(sourceReadinessLaneRow.sourceStaticSourceReviewPromptCardIds)}, Stage 82 source-crosswalk row ${sourceReadinessLaneRow.sourceCrosswalkRowId}, Stage 82 static review-check cards ${joinOrNone(sourceReadinessLaneRow.sourceStaticReviewCheckCardIds)}, Stage 81 review-path step ${sourceReadinessLaneRow.sourceConstraintResponseReviewPathStepId}, Stage 81 response-review prompt cards ${joinOrNone(sourceReadinessLaneRow.sourceStaticResponseReviewPromptCardIds)}, Stage 80 constraint-coverage row ${sourceReadinessLaneRow.sourceConstraintCoverageRowId}, Stage 80 response-note prompt cards ${joinOrNone(sourceReadinessLaneRow.sourceStaticResponseNotePromptCardIds)}, Stage 79 answer-review step ${sourceReadinessLaneRow.sourceAnswerReviewPathStepId}, Stage 79 static constraint-note cards ${joinOrNone(sourceReadinessLaneRow.sourceStaticConstraintNoteCardIds)}, Stage 78 answer-check card ${sourceReadinessLaneRow.sourceStaticAnswerCheckCardId}, Stage 78 readiness rows ${joinOrNone(sourceReadinessLaneRow.sourceResponsePromptReadinessRowIds)}, Stage 77 response-prompt cards ${joinOrNone(sourceReadinessLaneRow.sourceStaticResponsePromptCardIds)}, Stage 77 response-map review-path step ${sourceReadinessLaneRow.sourceResponseMapReviewPathStepId}, Stage 76 response-map row ${sourceReadinessLaneRow.sourceResponseMapRowId}, Stage 75 coverage-review step ${sourceReadinessLaneRow.sourceCoverageReviewPathStepId}, Stage 74 coverage row ${sourceReadinessLaneRow.sourceCoverageMatrixRowId}, Stage 73 review-path step ${sourceReadinessLaneRow.sourceReviewPathStepId}, Stage 72 source recap row ${sourceReadinessLaneRow.sourceSourceRecapRowId}, Stage 71 review-lane row ${sourceReadinessLaneRow.sourceAnswerFollowUpReviewLaneRowId}, Stage 70 crosswalk row ${sourceReadinessLaneRow.sourceAnswerSourceCrosswalkRowId}, Stage 69 walkthrough step ${sourceReadinessLaneRow.sourceAnswerWalkthroughStepId}, Stage 68 answer coverage row ${sourceReadinessLaneRow.sourceAnswerCoverageRowId}, Stage 67 rehearsal step ${sourceReadinessLaneRow.sourceRehearsalPathStepId}, Stage 66 board row ${sourceReadinessLaneRow.sourceReviewBoardRowId}, Stage 65 brief row ${sourceReadinessLaneRow.followUpReadinessBriefRowId}, Stage 64 triage row ${sourceReadinessLaneRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${joinOrNone(sourceReadinessLaneRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(sourceReadinessLaneRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(sourceReadinessLaneRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(sourceReadinessLaneRow.deferredScopeReminderIds)}, source-follow-up labels ${joinOrNone(sourceFollowUpLabels)}, and Stage 84 source-readiness text "${sourceReadinessLaneRow.sourceReadinessLaneText}" as deterministic manual source follow-up context only.`,
    citationCheckPromptText:
      `Static citation-check prompt for Stage 84 source-readiness row ${sourceSourceReadinessLaneRowId}: compare Stage 84 cue cards ${joinOrNone(sourceStaticSourceFollowUpCueCardIds)}, Stage 83 source-review path step ${sourceReadinessLaneRow.sourceSourceReviewPathStepId}, Stage 83 static source-review prompt cards ${joinOrNone(sourceReadinessLaneRow.sourceStaticSourceReviewPromptCardIds)}, Stage 82 source-crosswalk row ${sourceReadinessLaneRow.sourceCrosswalkRowId}, Stage 82 review-check cards ${joinOrNone(sourceReadinessLaneRow.sourceStaticReviewCheckCardIds)}, Stage 81 response-review prompt cards ${joinOrNone(sourceReadinessLaneRow.sourceStaticResponseReviewPromptCardIds)}, Stage 80 response-note prompt cards ${joinOrNone(sourceReadinessLaneRow.sourceStaticResponseNotePromptCardIds)}, anchors ${joinOrNone(sourceReadinessLaneRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(sourceReadinessLaneRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(sourceReadinessLaneRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(sourceReadinessLaneRow.deferredScopeReminderIds)}, source follow-up labels ${joinOrNone(sourceFollowUpLabels)}, citation-check labels ${joinOrNone(citationCheckLabels)}, and Stage 84 static source follow-up cue text "${sourceReadinessLaneRow.staticSourceFollowUpCueText}" before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, source-follow-up state, citation-check state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static source follow-up map context: manual source-lineage and citation-check preparation only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved source-follow-up map state, saved citation-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      sourceReadinessLaneRow.staticNonGoalFlags,
    ),
  };
}

function buildStaticCitationCheckPromptCard(
  staticSourceFollowUpCueCard: Stage84StaticSourceFollowUpCueCard,
  sourceFollowUpMapEntries: ConstraintResponseSourceFollowUpMapEntryView[],
): ConstraintResponseSourceFollowUpMapStaticCitationCheckPromptCardView {
  const sourceStaticSourceFollowUpCueCardId =
    staticSourceFollowUpCueCard
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneStaticSourceFollowUpCueCardId;
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
    `constraint-response-source-follow-up-map:static-citation-check:${sourceStaticSourceFollowUpCueCardId}`;

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
      `Static citation-check prompt card ${sourceStaticSourceFollowUpCueCardId}: use Stage 84 static source-follow-up cue card ${sourceStaticSourceFollowUpCueCardId}, matched Stage 85 source follow-up map entries ${joinOrNone(sourceSourceFollowUpMapEntryIds)}, Stage 84 source-readiness lane rows ${joinOrNone(staticSourceFollowUpCueCard.sourceSourceReadinessLaneRowIds)}, Stage 83 static source-review prompt card ${staticSourceFollowUpCueCard.sourceStaticSourceReviewPromptCardId}, Stage 82 static review-check card ${staticSourceFollowUpCueCard.sourceStaticReviewCheckCardId}, Stage 81 response-review prompt card ${staticSourceFollowUpCueCard.sourceStaticResponseReviewPromptCardId}, Stage 80 response-note prompt card ${staticSourceFollowUpCueCard.sourceStaticResponseNotePromptCardId}, Stage 78 readiness row ${staticSourceFollowUpCueCard.sourceResponsePromptReadinessRowId}, Stage 77 response-prompt card ${staticSourceFollowUpCueCard.sourceStaticResponsePromptCardId}, Stage 76 response-map rows ${joinOrNone(staticSourceFollowUpCueCard.sourceResponseMapRowIds)}, anchors ${joinOrNone(staticSourceFollowUpCueCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticSourceFollowUpCueCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticSourceFollowUpCueCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticSourceFollowUpCueCard.deferredScopeReminderIds)}, citation-check labels ${joinOrNone(staticCitationCheckLabels)}, source-follow-up cue labels ${joinOrNone(staticSourceFollowUpCueCard.staticSourceFollowUpCueLabels)}, and Stage 84 static source-follow-up cue text "${staticSourceFollowUpCueCard.staticSourceFollowUpCueText}" as deterministic manual citation-check context only.`,
    staticNonGoalContext:
      "Static citation-check prompt context: manual citation and source-follow-up checking only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved source-follow-up map state, saved citation-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticSourceFollowUpCueCard.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  sourceFollowUpMapEntries: ConstraintResponseSourceFollowUpMapEntryView[],
  staticCitationCheckPromptCards: ConstraintResponseSourceFollowUpMapStaticCitationCheckPromptCardView[],
  sourceReadinessLane: Stage84View,
): ConstraintResponseSourceFollowUpMapSummaryView["counts"] {
  const sourceCounts = sourceReadinessLane.summary.counts;

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
  sourceReadinessLaneRow: Stage84Row,
  matchedStaticSourceFollowUpCueCards: Stage84StaticSourceFollowUpCueCard[],
): string[] {
  const labels = [
    "source follow-up map entry",
    "Stage 84 source-readiness lane carry-forward",
  ];

  if (matchedStaticSourceFollowUpCueCards.length) {
    labels.push("Stage 84 static follow-up cue alignment");
  }

  if (sourceReadinessLaneRow.sourceReadinessLaneLabels.length) {
    labels.push("source-readiness label carry-forward");
  }

  if (
    sourceReadinessLaneRow.sourceLocalAnchorHrefs.length ||
    sourceReadinessLaneRow.evidenceCallbackIds.length
  ) {
    labels.push("local anchor and callback follow-up context");
  }

  if (
    sourceReadinessLaneRow.gapDiscussionPointIds.length ||
    sourceReadinessLaneRow.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder follow-up context");
  }

  return labels;
}

function buildEntryCitationCheckLabels(
  sourceReadinessLaneRow: Stage84Row,
  matchedStaticSourceFollowUpCueCards: Stage84StaticSourceFollowUpCueCard[],
): string[] {
  const labels = [
    "static citation-check prompt context",
    "Stage 84 citation lineage carry-forward",
  ];

  if (matchedStaticSourceFollowUpCueCards.length) {
    labels.push("source follow-up cue citation alignment");
  }

  if (sourceReadinessLaneRow.sourceStaticSourceReviewPromptCardIds.length) {
    labels.push("static source-review prompt citation context");
  }

  return labels;
}

function buildStaticCitationCheckLabels(
  staticSourceFollowUpCueCard: Stage84StaticSourceFollowUpCueCard,
  matchedSourceFollowUpMapEntries: ConstraintResponseSourceFollowUpMapEntryView[],
): string[] {
  const labels = [
    "static citation-check prompt card",
    "Stage 84 source-follow-up cue carry-forward",
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
  sourceFlags: Stage84StaticNonGoalFlags,
): ConstraintResponseSourceFollowUpMapStaticNonGoalFlagsView {
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

function joinOrNone(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
