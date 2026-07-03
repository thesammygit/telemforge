import type {
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapEntryView as Stage125Entry,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneRowView,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneStaticEvidenceCheckPromptCardView,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneStaticNonGoalFlagsView,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneSummaryView,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneView,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapStaticCitationCheckPromptCardView as Stage125StaticCitationCard,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapStaticNonGoalFlagsView as Stage125StaticNonGoalFlags,
  ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapView as Stage125View,
} from "../features/mission-console/types.ts";

const stage126IdPrefix =
  "constraint-response-revision-coverage-review-path-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path-source-crosswalk-review-path-source-review-readiness-lane-source-follow-up-map-source-citation-review-lane";

export function buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane(
  sourceFollowUpMap: Stage125View | undefined,
): ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneView | undefined {
  if (
    !sourceFollowUpMap?.staticCitationCheckPromptCards.length ||
    !sourceFollowUpMap.sourceFollowUpMapEntries.length
  ) {
    return undefined;
  }

  const citationReviewLaneRows =
    sourceFollowUpMap.staticCitationCheckPromptCards.map((card) =>
      buildCitationReviewLaneRow(card, sourceFollowUpMap.sourceFollowUpMapEntries),
    );
  const staticEvidenceCheckPromptCards =
    sourceFollowUpMap.sourceFollowUpMapEntries.map((entry) =>
      buildStaticEvidenceCheckPromptCard(
        entry,
        sourceFollowUpMap.staticCitationCheckPromptCards,
      ),
    );
  const defaultCitationReviewLaneRow =
    citationReviewLaneRows.find(
      (row) =>
        row.sourceStaticCitationCheckPromptCardId ===
        sourceFollowUpMap.defaultStaticCitationCheckPromptCard
          .staticCitationCheckPromptCardId,
    ) ?? citationReviewLaneRows[0];
  const defaultStaticEvidenceCheckPromptCard =
    staticEvidenceCheckPromptCards.find(
      (card) =>
        card.sourceSourceFollowUpMapEntryId ===
        sourceFollowUpMap.defaultSourceFollowUpMapEntry.sourceFollowUpMapEntryId,
    ) ?? staticEvidenceCheckPromptCards[0];
  const defaultStage125Context =
    sourceFollowUpMap.summary.defaultSourceFollowUpContext;

  return {
    schema:
      "telemforge.constraint_response_revision_coverage_review_path_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map_source_citation_review_lane.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response revision coverage review-path revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path source-review readiness lane source follow-up map source citation-review lane and static evidence-check prompts",
    localStatus: sourceFollowUpMap.localStatus,
    summary: {
      constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneId:
        `candidate-local-${stage126IdPrefix}`,
      label: "Local constraint-response source citation-review lane",
      summary:
        "A static source citation-review lane derives from Stage 125 citation-check prompt cards and static evidence-check prompt cards derive from Stage 125 source follow-up map entries so reviewers can inspect citation prompts, follow-up entries, source lineage, local anchors, callbacks, gap prompts, and deferred reminders before drafting outside the app without saved reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, source selections, citation selections, source-follow-up state, citation-review state, evidence-check state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultCitationReviewContext: {
        defaultCitationReviewLaneRowId:
          defaultCitationReviewLaneRow.citationReviewLaneRowId,
        defaultStaticEvidenceCheckPromptCardId:
          defaultStaticEvidenceCheckPromptCard.staticEvidenceCheckPromptCardId,
        defaultStaticCitationCheckPromptCardId:
          defaultCitationReviewLaneRow.sourceStaticCitationCheckPromptCardId,
        defaultSourceFollowUpMapEntryId:
          defaultStaticEvidenceCheckPromptCard.sourceSourceFollowUpMapEntryId,
        defaultSourceReviewReadinessLaneRowId:
          defaultStage125Context.defaultSourceReviewReadinessLaneRowId,
        defaultStaticSourceFollowUpCueCardId:
          defaultStage125Context.defaultStaticSourceFollowUpCueCardId,
        sourceStage125SourceFollowUpMapSummary: sourceFollowUpMap.summary.summary,
        sourceStage125DefaultSourceFollowUpContext: defaultStage125Context,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        citationReviewLaneRows,
        staticEvidenceCheckPromptCards,
        sourceFollowUpMap,
      ),
    },
    defaultCitationReviewLaneRow,
    defaultStaticEvidenceCheckPromptCard,
    citationReviewLaneRows,
    staticEvidenceCheckPromptCards,
    staticEvidenceCheckBoundarySummary:
      "Stage 126 source citation-review lane rows and static evidence-check prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; no saved reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, source selections, citation selections, source-follow-up state, citation-review state, evidence-check state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap:
      sourceFollowUpMap,
  };
}

function buildCitationReviewLaneRow(
  staticCitationCheckPromptCard: Stage125StaticCitationCard,
  sourceFollowUpMapEntries: Stage125Entry[],
): ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneRowView {
  const sourceStaticCitationCheckPromptCardId =
    staticCitationCheckPromptCard.staticCitationCheckPromptCardId;
  const matchedSourceFollowUpMapEntries = sourceFollowUpMapEntries.filter(
    (entry) =>
      staticCitationCheckPromptCard.sourceSourceFollowUpMapEntryIds.includes(
        entry.sourceFollowUpMapEntryId,
      ),
  );
  const lineage = collectLineage(matchedSourceFollowUpMapEntries);
  const sourceSourceFollowUpMapEntryIds = matchedSourceFollowUpMapEntries.map(
    (entry) => entry.sourceFollowUpMapEntryId,
  );
  const citationReviewLabels = buildCitationReviewLabels(
    staticCitationCheckPromptCard,
    matchedSourceFollowUpMapEntries,
  );
  const evidenceCheckLabels = buildRowEvidenceCheckLabels(
    staticCitationCheckPromptCard,
    matchedSourceFollowUpMapEntries,
  );
  const citationReviewLaneRowId =
    `${stage126IdPrefix}:row:${sourceStaticCitationCheckPromptCardId}`;

  return {
    ...staticCitationCheckPromptCard,
    ...lineage,
    citationReviewLaneRowId,
    citationReviewLaneRowIds: [citationReviewLaneRowId],
    citationReviewLaneRowOrder:
      staticCitationCheckPromptCard.staticCitationCheckPromptOrder,
    sourceStaticCitationCheckPromptCardId,
    sourceStaticCitationCheckPromptCardIds: [
      sourceStaticCitationCheckPromptCardId,
    ],
    sourceSourceFollowUpMapEntryIds,
    citationReviewLabels,
    evidenceCheckLabels,
    citationReviewText:
      `Source citation-review lane row ${sourceStaticCitationCheckPromptCardId}: carry Stage 125 static citation-check prompt card ${sourceStaticCitationCheckPromptCardId}, Stage 125 source follow-up map entries ${joinOrNone(sourceSourceFollowUpMapEntryIds)}, Stage 124 source-readiness lane rows ${joinOrNone(staticCitationCheckPromptCard.sourceSourceReviewReadinessLaneRowIds)}, Stage 124 source-follow-up cue ${staticCitationCheckPromptCard.sourceStaticSourceFollowUpCueCardId}, Stage 123 source-review path steps ${joinOrNone(lineage.sourceSourceReviewPathStepIds)}, Stage 123 static source-review prompt cards ${joinOrNone(lineage.sourceStaticSourceReviewPromptCardIds)}, Stage 122 source-crosswalk rows ${joinOrNone(lineage.sourceCrosswalkRowIds)}, Stage 122 static review-check cards ${joinOrNone(lineage.sourceStaticReviewCheckCardIds)}, Stage 121 review-path steps ${joinOrNone(lineage.sourceConstraintCoverageReviewPathStepIds)}, Stage 121 response-prompt cards ${joinOrNone(lineage.sourceStaticResponsePromptCardIds)}, Stage 120 constraint-coverage rows ${joinOrNone(lineage.sourceConstraintCoverageRowIds)}, Stage 120 response-note prompt cards ${joinOrNone(lineage.sourceStaticResponseNotePromptCardIds)}, Stage 119 answer-review steps ${joinOrNone(lineage.sourceAnswerReviewPathStepIds)}, Stage 119 constraint-note cards ${joinOrNone(lineage.sourceStaticConstraintNoteCardIds)}, Stage 118 answer-check cards ${joinOrNone(lineage.sourceStaticAnswerCheckCardIds)}, Stage 118 readiness rows ${joinOrNone(lineage.sourceResponsePromptReadinessRowIds)}, Stage 117 review-path steps ${joinOrNone(lineage.sourceRevisionFollowUpReadinessReviewPathStepIds)}, Stage 116 readiness rows ${joinOrNone(lineage.sourceRevisionFollowUpReadinessRowIds)}, Stage 116 response-check cards ${joinOrNone(lineage.sourceStaticResponseCheckCardIds)}, Stage 115 revision follow-up prompts ${joinOrNone(lineage.sourceStaticRevisionFollowUpPromptCardIds)}, Stage 114 revision-review path steps ${joinOrNone(lineage.sourceRevisionCoverageReviewPathStepIds)}, Stage 114 revision-coverage rows ${joinOrNone(lineage.sourceRevisionCoverageRowIds)}, Stage 114 static revision checks ${joinOrNone(lineage.sourceStaticRevisionCheckCardIds)}, Stage 113 revision prompts ${joinOrNone(lineage.sourceStaticRevisionPromptCardIds)}, Stage 112 draft checks ${joinOrNone(lineage.sourceStaticDraftCheckCardIds)}, Stage 111 response cues ${joinOrNone(lineage.sourceStaticResponseCueCardIds)}, Stage 110 review prompts ${joinOrNone(lineage.sourceStaticReviewPromptCardIds)}, Stage 109 readiness cues ${joinOrNone(lineage.sourceStaticReadinessCueCardIds)}, Stage 108 follow-up prompts ${joinOrNone(lineage.sourceStaticFollowUpPromptCardIds)}, Stage 107 citation-gap cues ${joinOrNone(lineage.sourceStaticCitationGapCueCardIds)}, Stage 107 evidence-check review path steps ${joinOrNone(lineage.sourceEvidenceCheckReviewPathStepIds)}, Stage 106 citation-review rows ${joinOrNone(lineage.sourceCitationReviewLaneRowIds)}, Stage 105 citation prompt cards ${joinOrNone(lineage.sourceStaticCitationCheckPromptCardIds)}, anchors ${joinOrNone(staticCitationCheckPromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticCitationCheckPromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticCitationCheckPromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticCitationCheckPromptCard.deferredScopeReminderIds)}, citation-review labels ${joinOrNone(citationReviewLabels)}, and Stage 125 citation prompt text "${displayCarriedText(staticCitationCheckPromptCard.citationCheckPromptText)}" as deterministic manual citation-review context only.`,
    evidenceCheckPromptText:
      `Static evidence-check prompt for Stage 125 citation prompt ${sourceStaticCitationCheckPromptCardId}: inspect Stage 125 follow-up entries ${joinOrNone(sourceSourceFollowUpMapEntryIds)}, Stage 124 readiness rows ${joinOrNone(staticCitationCheckPromptCard.sourceSourceReviewReadinessLaneRowIds)}, Stage 124 cue ${staticCitationCheckPromptCard.sourceStaticSourceFollowUpCueCardId}, Stage 123 source-review prompts ${joinOrNone(lineage.sourceStaticSourceReviewPromptCardIds)}, Stage 122 review-check cards ${joinOrNone(lineage.sourceStaticReviewCheckCardIds)}, Stage 107 evidence-check review path steps ${joinOrNone(lineage.sourceEvidenceCheckReviewPathStepIds)}, anchors ${joinOrNone(staticCitationCheckPromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticCitationCheckPromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticCitationCheckPromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticCitationCheckPromptCard.deferredScopeReminderIds)}, and evidence-check labels ${joinOrNone(evidenceCheckLabels)} before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, citation-review state, evidence-check state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static Stage 126 source citation-review lane context: manual citation, source-lineage, anchor, callback, gap, and deferred-reminder checking only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved citation-review lane state, saved evidence-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticCitationCheckPromptCard.staticNonGoalFlags,
    ),
  };
}

function buildStaticEvidenceCheckPromptCard(
  sourceFollowUpMapEntry: Stage125Entry,
  staticCitationCheckPromptCards: Stage125StaticCitationCard[],
): ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneStaticEvidenceCheckPromptCardView {
  const sourceSourceFollowUpMapEntryId =
    sourceFollowUpMapEntry.sourceFollowUpMapEntryId;
  const matchedStaticCitationCheckPromptCards =
    staticCitationCheckPromptCards.filter((card) =>
      card.sourceSourceFollowUpMapEntryIds.includes(sourceSourceFollowUpMapEntryId),
    );
  const sourceStaticCitationCheckPromptCardIds =
    matchedStaticCitationCheckPromptCards.map(
      (card) => card.staticCitationCheckPromptCardId,
    );
  const citationReviewLabels = buildEvidenceCardCitationReviewLabels(
    sourceFollowUpMapEntry,
    matchedStaticCitationCheckPromptCards,
  );
  const evidenceCheckLabels = buildEvidenceCardEvidenceCheckLabels(
    sourceFollowUpMapEntry,
    matchedStaticCitationCheckPromptCards,
  );
  const staticEvidenceCheckPromptCardId =
    `${stage126IdPrefix}:static-evidence-check:${sourceSourceFollowUpMapEntryId}`;

  return {
    ...sourceFollowUpMapEntry,
    staticEvidenceCheckPromptCardId,
    staticEvidenceCheckPromptCardIds: [staticEvidenceCheckPromptCardId],
    staticEvidenceCheckPromptOrder:
      sourceFollowUpMapEntry.sourceFollowUpMapEntryOrder,
    sourceSourceFollowUpMapEntryId,
    sourceSourceFollowUpMapEntryIds: [sourceSourceFollowUpMapEntryId],
    sourceStaticCitationCheckPromptCardIds,
    citationReviewLabels,
    evidenceCheckLabels,
    evidenceCheckPromptText:
      `Static evidence-check prompt card ${sourceSourceFollowUpMapEntryId}: use Stage 125 source follow-up map entry ${sourceSourceFollowUpMapEntryId}, matched Stage 125 citation prompt cards ${joinOrNone(sourceStaticCitationCheckPromptCardIds)}, Stage 124 source-readiness row ${sourceFollowUpMapEntry.sourceSourceReviewReadinessLaneRowId}, Stage 124 cue cards ${joinOrNone(sourceFollowUpMapEntry.sourceStaticSourceFollowUpCueCardIds)}, Stage 123 source-review path step ${sourceFollowUpMapEntry.sourceSourceReviewPathStepId}, Stage 123 static source-review prompt cards ${joinOrNone(sourceFollowUpMapEntry.sourceStaticSourceReviewPromptCardIds)}, Stage 122 source-crosswalk row ${sourceFollowUpMapEntry.sourceCrosswalkRowId}, Stage 122 static review-check cards ${joinOrNone(sourceFollowUpMapEntry.sourceStaticReviewCheckCardIds)}, Stage 121 review-path step ${sourceFollowUpMapEntry.sourceConstraintCoverageReviewPathStepId}, Stage 121 response-prompt cards ${joinOrNone(sourceFollowUpMapEntry.sourceStaticResponsePromptCardIds)}, Stage 120 constraint-coverage row ${sourceFollowUpMapEntry.sourceConstraintCoverageRowId}, Stage 120 response-note prompt cards ${joinOrNone(sourceFollowUpMapEntry.sourceStaticResponseNotePromptCardIds)}, Stage 119 answer-review step ${sourceFollowUpMapEntry.sourceAnswerReviewPathStepId}, Stage 119 static constraint-note cards ${joinOrNone(sourceFollowUpMapEntry.sourceStaticConstraintNoteCardIds)}, Stage 118 answer-check card ${sourceFollowUpMapEntry.sourceStaticAnswerCheckCardId}, Stage 118 readiness rows ${joinOrNone(sourceFollowUpMapEntry.sourceResponsePromptReadinessRowIds)}, Stage 117 review-path steps ${joinOrNone(sourceFollowUpMapEntry.sourceRevisionFollowUpReadinessReviewPathStepIds)}, Stage 116 readiness rows ${joinOrNone(sourceFollowUpMapEntry.sourceRevisionFollowUpReadinessRowIds)}, Stage 107 evidence-check review path steps ${joinOrNone(sourceFollowUpMapEntry.sourceEvidenceCheckReviewPathStepIds)}, anchors ${joinOrNone(sourceFollowUpMapEntry.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(sourceFollowUpMapEntry.evidenceCallbackIds)}, gap prompts ${joinOrNone(sourceFollowUpMapEntry.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(sourceFollowUpMapEntry.deferredScopeReminderIds)}, evidence-check labels ${joinOrNone(evidenceCheckLabels)}, and Stage 125 source-follow-up text "${displayCarriedText(sourceFollowUpMapEntry.sourceFollowUpText)}" as deterministic manual evidence-check context only.`,
    staticNonGoalContext:
      "Static Stage 126 evidence-check prompt context: manual source-lineage, anchor, callback, gap, and deferred-reminder review only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved source-follow-up state, saved citation-review state, saved evidence-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      sourceFollowUpMapEntry.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  citationReviewLaneRows: ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneRowView[],
  staticEvidenceCheckPromptCards: ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneStaticEvidenceCheckPromptCardView[],
  sourceFollowUpMap: Stage125View,
): ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneSummaryView["counts"] {
  const sourceCounts = sourceFollowUpMap.summary.counts;

  return {
    ...sourceCounts,
    citationReviewLaneRowCount: citationReviewLaneRows.length,
    staticEvidenceCheckPromptCardCount: staticEvidenceCheckPromptCards.length,
    citationReviewLabelCount: unique(
      citationReviewLaneRows.flatMap((row) => row.citationReviewLabels),
    ).length,
    evidenceCheckPromptLabelCount: unique([
      ...citationReviewLaneRows.flatMap((row) => row.evidenceCheckLabels),
      ...staticEvidenceCheckPromptCards.flatMap(
        (card) => card.evidenceCheckLabels,
      ),
    ]).length,
    localOnlyCitationReviewLaneRowCount: citationReviewLaneRows.filter(
      (row) => row.localOnly,
    ).length,
    localOnlyStaticEvidenceCheckPromptCardCount:
      staticEvidenceCheckPromptCards.filter((card) => card.localOnly).length,
  };
}

function collectLineage(entries: Stage125Entry[]) {
  return {
    sourceSourceReviewPathStepIds: unique(
      entries.map((entry) => entry.sourceSourceReviewPathStepId),
    ),
    sourceStaticSourceReviewPromptCardIds: unique(
      entries.flatMap((entry) => entry.sourceStaticSourceReviewPromptCardIds),
    ),
    sourceCrosswalkRowIds: unique(
      entries.map((entry) => entry.sourceCrosswalkRowId),
    ),
    sourceStaticReviewCheckCardIds: unique(
      entries.flatMap((entry) => entry.sourceStaticReviewCheckCardIds),
    ),
    sourceConstraintCoverageReviewPathStepIds: unique(
      entries.map((entry) => entry.sourceConstraintCoverageReviewPathStepId),
    ),
    sourceStaticResponsePromptCardIds: unique(
      entries.flatMap((entry) => entry.sourceStaticResponsePromptCardIds),
    ),
    sourceConstraintCoverageRowIds: unique(
      entries.map((entry) => entry.sourceConstraintCoverageRowId),
    ),
    sourceStaticResponseNotePromptCardIds: unique(
      entries.flatMap((entry) => entry.sourceStaticResponseNotePromptCardIds),
    ),
    sourceAnswerReviewPathStepIds: unique(
      entries.map((entry) => entry.sourceAnswerReviewPathStepId),
    ),
    sourceStaticConstraintNoteCardIds: unique(
      entries.flatMap((entry) => entry.sourceStaticConstraintNoteCardIds),
    ),
    sourceStaticAnswerCheckCardIds: unique(
      entries.map((entry) => entry.sourceStaticAnswerCheckCardId),
    ),
    sourceResponsePromptReadinessRowIds: unique(
      entries.flatMap((entry) => entry.sourceResponsePromptReadinessRowIds),
    ),
    sourceRevisionFollowUpReadinessReviewPathStepIds: unique(
      entries.flatMap(
        (entry) => entry.sourceRevisionFollowUpReadinessReviewPathStepIds,
      ),
    ),
    sourceRevisionFollowUpReadinessRowIds: unique(
      entries.flatMap((entry) => entry.sourceRevisionFollowUpReadinessRowIds),
    ),
    sourceStaticResponseCheckCardIds: unique(
      entries.map((entry) => entry.sourceStaticResponseCheckCardId),
    ),
    sourceStaticRevisionFollowUpPromptCardIds: unique(
      entries.map((entry) => entry.sourceStaticRevisionFollowUpPromptCardId),
    ),
    sourceRevisionCoverageReviewPathStepIds: unique(
      entries.map((entry) => entry.sourceRevisionCoverageReviewPathStepId),
    ),
    sourceRevisionCoverageRowIds: unique(
      entries.map((entry) => entry.sourceRevisionCoverageRowId),
    ),
    sourceStaticRevisionCheckCardIds: unique(
      entries.map((entry) => entry.sourceStaticRevisionCheckCardId),
    ),
    sourceStaticRevisionPromptCardIds: unique(
      entries.map((entry) => entry.sourceStaticRevisionPromptCardId),
    ),
    sourceStaticDraftCheckCardIds: unique(
      entries.map((entry) => entry.sourceStaticDraftCheckCardId),
    ),
    sourceStaticResponseCueCardIds: unique(
      entries.map((entry) => entry.sourceStaticResponseCueCardId),
    ),
    sourceStaticReviewPromptCardIds: unique(
      entries.map((entry) => entry.sourceStaticReviewPromptCardId),
    ),
    sourceStaticReadinessCueCardIds: unique(
      entries.map((entry) => entry.sourceStaticReadinessCueCardId),
    ),
    sourceStaticFollowUpPromptCardIds: unique(
      entries.map((entry) => entry.sourceStaticFollowUpPromptCardId),
    ),
    sourceStaticCitationGapCueCardIds: unique(
      entries.map((entry) => entry.sourceStaticCitationGapCueCardId),
    ),
    sourceCitationReviewLaneRowIds: unique(
      entries.map((entry) => entry.sourceCitationReviewLaneRowId),
    ),
    sourceStaticCitationCheckPromptCardIds: unique(
      entries.map((entry) => entry.sourceStaticCitationCheckPromptCardId),
    ),
    sourceEvidenceCheckReviewPathStepIds: unique(
      entries.flatMap((entry) => entry.sourceEvidenceCheckReviewPathStepIds),
    ),
    sourceEvidenceGapReadinessRowIds: unique(
      entries.flatMap((entry) => entry.sourceEvidenceGapReadinessRowIds),
    ),
    sourceFollowUpReviewPathStepIds: unique(
      entries.flatMap((entry) => entry.sourceFollowUpReviewPathStepIds),
    ),
  };
}

function buildCitationReviewLabels(
  staticCitationCheckPromptCard: Stage125StaticCitationCard,
  matchedSourceFollowUpMapEntries: Stage125Entry[],
): string[] {
  const labels = [
    "source citation-review lane row",
    "Stage 125 static citation-check prompt carry-forward",
  ];

  if (matchedSourceFollowUpMapEntries.length) {
    labels.push("Stage 125 source follow-up map entry alignment");
  }

  if (staticCitationCheckPromptCard.staticCitationCheckLabels.length) {
    labels.push("static citation-check label carry-forward");
  }

  return labels;
}

function buildRowEvidenceCheckLabels(
  staticCitationCheckPromptCard: Stage125StaticCitationCard,
  matchedSourceFollowUpMapEntries: Stage125Entry[],
): string[] {
  const labels = [
    "static evidence-check prompt context",
    "citation prompt evidence callback review",
  ];

  if (matchedSourceFollowUpMapEntries.length) {
    labels.push("matched follow-up entry evidence context");
  }

  if (
    staticCitationCheckPromptCard.sourceLocalAnchorHrefs.length ||
    staticCitationCheckPromptCard.evidenceCallbackIds.length
  ) {
    labels.push("local anchor and callback evidence context");
  }

  return labels;
}

function buildEvidenceCardCitationReviewLabels(
  sourceFollowUpMapEntry: Stage125Entry,
  matchedStaticCitationCheckPromptCards: Stage125StaticCitationCard[],
): string[] {
  const labels = [
    "source follow-up citation-review carry-forward",
    "Stage 125 source follow-up map entry",
  ];

  if (matchedStaticCitationCheckPromptCards.length) {
    labels.push("matched Stage 125 citation prompt context");
  }

  if (sourceFollowUpMapEntry.citationCheckLabels.length) {
    labels.push("citation-check label carry-forward");
  }

  return labels;
}

function buildEvidenceCardEvidenceCheckLabels(
  sourceFollowUpMapEntry: Stage125Entry,
  matchedStaticCitationCheckPromptCards: Stage125StaticCitationCard[],
): string[] {
  const labels = [
    "static evidence-check prompt card",
    "Stage 125 follow-up entry evidence context",
  ];

  if (matchedStaticCitationCheckPromptCards.length) {
    labels.push("static citation prompt evidence alignment");
  }

  if (
    sourceFollowUpMapEntry.sourceLocalAnchorHrefs.length ||
    sourceFollowUpMapEntry.evidenceCallbackIds.length
  ) {
    labels.push("local anchor and callback evidence context");
  }

  return labels;
}

function staticNonGoalFlags(
  sourceFlags: Stage125StaticNonGoalFlags,
): ConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedCitationReviewState: true,
    noSavedCitationReviewLaneState: true,
    noSavedStaticCitationReviewRows: true,
    noSavedEvidenceCheckState: true,
    noSavedEvidenceCheckPromptState: true,
    noSavedStaticEvidenceCheckPrompts: true,
    noSavedStaticEvidenceCheckPromptCards: true,
  };
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
