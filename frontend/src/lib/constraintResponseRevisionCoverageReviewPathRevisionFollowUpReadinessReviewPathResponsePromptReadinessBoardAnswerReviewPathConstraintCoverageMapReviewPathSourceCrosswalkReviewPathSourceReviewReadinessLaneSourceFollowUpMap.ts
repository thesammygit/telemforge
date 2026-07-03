import type {
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapEntryView,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapStaticCitationCheckPromptCardView,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapStaticNonGoalFlagsView,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSummaryView,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapView,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowView as Stage124Row,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticNonGoalFlagsView as Stage124StaticNonGoalFlags,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardView as Stage124StaticSourceFollowUpCueCard,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneView as Stage124View,
} from "../features/mission-console/types.ts";

const stage125IdPrefix =
  "constraint-response-revision-coverage-review-path-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path-source-crosswalk-review-path-source-review-readiness-lane-source-follow-up-map";

export function buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap(
  sourceReviewReadinessLane: Stage124View | undefined,
): ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapView | undefined {
  if (
    !sourceReviewReadinessLane?.sourceReviewReadinessLaneRows.length ||
    !sourceReviewReadinessLane.staticSourceFollowUpCueCards.length
  ) {
    return undefined;
  }

  const sourceFollowUpMapEntries =
    sourceReviewReadinessLane.sourceReviewReadinessLaneRows.map((row) =>
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
          .constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowId,
    ) ?? sourceFollowUpMapEntries[0];
  const defaultStaticCitationCheckPromptCard =
    staticCitationCheckPromptCards.find(
      (card) =>
        card.sourceStaticSourceFollowUpCueCardId ===
        defaultStaticSourceFollowUpCueCard
          .constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardId,
    ) ?? staticCitationCheckPromptCards[0];
  const defaultStage124Context =
    sourceReviewReadinessLane.summary.defaultSourceReviewReadinessContext;

  return {
    schema:
      "telemforge.constraint_response_revision_coverage_review_path_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response revision coverage review-path revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path source-review readiness lane source follow-up map and static citation-check prompts",
    localStatus: sourceReviewReadinessLane.localStatus,
    summary: {
      constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapId:
        `candidate-local-${stage125IdPrefix}`,
      label: "Local constraint-response source follow-up map",
      summary:
        "A static source follow-up map derives from Stage 124 source-review readiness lane rows and static source-follow-up cue cards so reviewers can inspect source lineage, citation checks, anchors, callbacks, gap prompts, and deferred reminders before drafting outside the app without saved reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, source selections, citation selections, source-review readiness state, source-follow-up state, citation-check state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultSourceFollowUpContext: {
        ...defaultStage124Context,
        defaultSourceFollowUpMapEntryId:
          defaultSourceFollowUpMapEntry.sourceFollowUpMapEntryId,
        defaultStaticCitationCheckPromptCardId:
          defaultStaticCitationCheckPromptCard.staticCitationCheckPromptCardId,
        defaultSourceReviewReadinessLaneRowId:
          defaultSourceFollowUpMapEntry.sourceSourceReviewReadinessLaneRowId,
        defaultStaticSourceFollowUpCueCardId:
          defaultStaticCitationCheckPromptCard.sourceStaticSourceFollowUpCueCardId,
        defaultSourceReviewPathStepId:
          defaultStage124Context.defaultSourceReviewPathStepId,
        defaultStaticSourceReviewPromptCardId:
          defaultStage124Context.defaultStaticSourceReviewPromptCardId,
        sourceStage124SourceReviewReadinessLaneSummary:
          sourceReviewReadinessLane.summary.summary,
        sourceStage124DefaultSourceReviewReadinessContext:
          defaultStage124Context,
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
      "Stage 125 source follow-up map entries and static citation-check prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, source selections, citation selections, source-review readiness state, source-follow-up state, citation-check state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLane:
      sourceReviewReadinessLane,
  };
}

function buildSourceFollowUpMapEntry(
  sourceReviewReadinessLaneRow: Stage124Row,
  staticSourceFollowUpCueCards: Stage124StaticSourceFollowUpCueCard[],
): ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapEntryView {
  const sourceSourceReviewReadinessLaneRowId =
    sourceReviewReadinessLaneRow
      .constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowId;
  const matchedStaticSourceFollowUpCueCards =
    staticSourceFollowUpCueCards.filter((card) =>
      card.sourceSourceReviewReadinessLaneRowIds.includes(
        sourceSourceReviewReadinessLaneRowId,
      ),
    );
  const sourceStaticSourceFollowUpCueCardIds =
    matchedStaticSourceFollowUpCueCards.map(
      (card) =>
        card.constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardId,
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
    `${stage125IdPrefix}:entry:${sourceSourceReviewReadinessLaneRowId}`;

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
      `Source follow-up map entry ${sourceSourceReviewReadinessLaneRowId}: carry Stage 124 source-review readiness lane row ${sourceSourceReviewReadinessLaneRowId}, Stage 124 static source-follow-up cue cards ${joinOrNone(sourceStaticSourceFollowUpCueCardIds)}, Stage 123 source-review path step ${sourceReviewReadinessLaneRow.sourceSourceReviewPathStepId}, Stage 123 static source-review prompt cards ${joinOrNone(sourceReviewReadinessLaneRow.sourceStaticSourceReviewPromptCardIds)}, Stage 122 source-crosswalk row ${sourceReviewReadinessLaneRow.sourceCrosswalkRowId}, Stage 122 static review-check cards ${joinOrNone(sourceReviewReadinessLaneRow.sourceStaticReviewCheckCardIds)}, Stage 121 review-path step ${sourceReviewReadinessLaneRow.sourceConstraintCoverageReviewPathStepId}, Stage 121 response-prompt cards ${joinOrNone(sourceReviewReadinessLaneRow.sourceStaticResponsePromptCardIds)}, Stage 120 constraint-coverage row ${sourceReviewReadinessLaneRow.sourceConstraintCoverageRowId}, Stage 120 response-note prompt cards ${joinOrNone(sourceReviewReadinessLaneRow.sourceStaticResponseNotePromptCardIds)}, Stage 119 answer-review step ${sourceReviewReadinessLaneRow.sourceAnswerReviewPathStepId}, Stage 119 static constraint-note cards ${joinOrNone(sourceReviewReadinessLaneRow.sourceStaticConstraintNoteCardIds)}, Stage 118 answer-check card ${sourceReviewReadinessLaneRow.sourceStaticAnswerCheckCardId}, Stage 118 readiness rows ${joinOrNone(sourceReviewReadinessLaneRow.sourceResponsePromptReadinessRowIds)}, Stage 117 review-path steps ${joinOrNone(sourceReviewReadinessLaneRow.sourceRevisionFollowUpReadinessReviewPathStepIds)}, Stage 116 readiness rows ${joinOrNone(sourceReviewReadinessLaneRow.sourceRevisionFollowUpReadinessRowIds)}, Stage 105 citation prompt ${sourceReviewReadinessLaneRow.sourceStaticCitationCheckPromptCardId}, Stage 107 evidence-check review path steps ${joinOrNone(sourceReviewReadinessLaneRow.sourceEvidenceCheckReviewPathStepIds)}, Stage 108 evidence-gap readiness rows ${joinOrNone(sourceReviewReadinessLaneRow.sourceEvidenceGapReadinessRowIds)}, Stage 109 follow-up review path steps ${joinOrNone(sourceReviewReadinessLaneRow.sourceFollowUpReviewPathStepIds)}, anchors ${joinOrNone(sourceReviewReadinessLaneRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(sourceReviewReadinessLaneRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(sourceReviewReadinessLaneRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(sourceReviewReadinessLaneRow.deferredScopeReminderIds)}, source-follow-up labels ${joinOrNone(sourceFollowUpLabels)}, citation-check labels ${joinOrNone(citationCheckLabels)}, and carried Stage 124 source-readiness text "${displayCarriedText(sourceReviewReadinessLaneRow.sourceReviewReadinessLaneText)}" as deterministic manual source follow-up context only.`,
    citationCheckPromptText:
      `Static citation-check prompt for Stage 124 source-readiness row ${sourceSourceReviewReadinessLaneRowId}: compare Stage 124 cue cards ${joinOrNone(sourceStaticSourceFollowUpCueCardIds)}, Stage 123 source-review path step ${sourceReviewReadinessLaneRow.sourceSourceReviewPathStepId}, Stage 123 static source-review prompt cards ${joinOrNone(sourceReviewReadinessLaneRow.sourceStaticSourceReviewPromptCardIds)}, Stage 122 source-crosswalk row ${sourceReviewReadinessLaneRow.sourceCrosswalkRowId}, Stage 122 review-check cards ${joinOrNone(sourceReviewReadinessLaneRow.sourceStaticReviewCheckCardIds)}, Stage 121 response-prompt cards ${joinOrNone(sourceReviewReadinessLaneRow.sourceStaticResponsePromptCardIds)}, Stage 120 response-note prompt cards ${joinOrNone(sourceReviewReadinessLaneRow.sourceStaticResponseNotePromptCardIds)}, anchors ${joinOrNone(sourceReviewReadinessLaneRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(sourceReviewReadinessLaneRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(sourceReviewReadinessLaneRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(sourceReviewReadinessLaneRow.deferredScopeReminderIds)}, source follow-up labels ${joinOrNone(sourceFollowUpLabels)}, citation-check labels ${joinOrNone(citationCheckLabels)}, and Stage 124 static source-follow-up cue text "${displayCarriedText(sourceReviewReadinessLaneRow.staticSourceFollowUpCueText)}" before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, source-follow-up state, citation-check state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static source follow-up map context: manual source-lineage and citation-check preparation only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved source-follow-up map state, saved citation-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      sourceReviewReadinessLaneRow.staticNonGoalFlags,
    ),
  };
}

function buildStaticCitationCheckPromptCard(
  staticSourceFollowUpCueCard: Stage124StaticSourceFollowUpCueCard,
  sourceFollowUpMapEntries: ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapEntryView[],
): ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapStaticCitationCheckPromptCardView {
  const sourceStaticSourceFollowUpCueCardId =
    staticSourceFollowUpCueCard
      .constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardId;
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
    `${stage125IdPrefix}:static-citation-check:${sourceStaticSourceFollowUpCueCardId}`;

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
      `Static citation-check prompt card ${sourceStaticSourceFollowUpCueCardId}: use Stage 124 static source-follow-up cue card ${sourceStaticSourceFollowUpCueCardId}, matched Stage 125 source follow-up map entries ${joinOrNone(sourceSourceFollowUpMapEntryIds)}, Stage 124 source-readiness lane rows ${joinOrNone(staticSourceFollowUpCueCard.sourceSourceReviewReadinessLaneRowIds)}, Stage 123 static source-review prompt card ${staticSourceFollowUpCueCard.sourceStaticSourceReviewPromptCardId}, Stage 122 static review-check card ${staticSourceFollowUpCueCard.sourceStaticReviewCheckCardId}, Stage 121 static response-prompt card ${staticSourceFollowUpCueCard.sourceStaticResponsePromptCardId}, Stage 120 static response-note prompt card ${staticSourceFollowUpCueCard.sourceStaticResponseNotePromptCardId}, Stage 118 readiness row ${staticSourceFollowUpCueCard.sourceResponsePromptReadinessRowId}, anchors ${joinOrNone(staticSourceFollowUpCueCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticSourceFollowUpCueCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticSourceFollowUpCueCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticSourceFollowUpCueCard.deferredScopeReminderIds)}, citation-check labels ${joinOrNone(staticCitationCheckLabels)}, source-follow-up cue labels ${joinOrNone(staticSourceFollowUpCueCard.staticSourceFollowUpCueLabels)}, and Stage 124 static source-follow-up cue text "${displayCarriedText(staticSourceFollowUpCueCard.staticSourceFollowUpCueText)}" as deterministic manual citation-check context only.`,
    staticNonGoalContext:
      "Static citation-check prompt context: manual citation and source-follow-up checking only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved source-follow-up map state, saved citation-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticSourceFollowUpCueCard.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  sourceFollowUpMapEntries: ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapEntryView[],
  staticCitationCheckPromptCards: ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapStaticCitationCheckPromptCardView[],
  sourceReviewReadinessLane: Stage124View,
): ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSummaryView["counts"] {
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
  sourceReviewReadinessLaneRow: Stage124Row,
  matchedStaticSourceFollowUpCueCards: Stage124StaticSourceFollowUpCueCard[],
): string[] {
  const labels = [
    "source follow-up map entry",
    "Stage 124 source-review readiness lane carry-forward",
  ];

  if (matchedStaticSourceFollowUpCueCards.length) {
    labels.push("Stage 124 static follow-up cue alignment");
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
  sourceReviewReadinessLaneRow: Stage124Row,
  matchedStaticSourceFollowUpCueCards: Stage124StaticSourceFollowUpCueCard[],
): string[] {
  const labels = [
    "static citation-check prompt context",
    "Stage 124 citation lineage carry-forward",
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
  staticSourceFollowUpCueCard: Stage124StaticSourceFollowUpCueCard,
  matchedSourceFollowUpMapEntries: ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapEntryView[],
): string[] {
  const labels = [
    "static citation-check prompt card",
    "Stage 124 source-follow-up cue carry-forward",
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
  sourceFlags: Stage124StaticNonGoalFlags,
): ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapStaticNonGoalFlagsView {
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

function displayCarriedText(value: string | undefined): string {
  return value?.replaceAll("undefined", "none") ?? "none";
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
