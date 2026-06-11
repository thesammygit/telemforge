import type {
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapEntryView as Stage105Entry,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneRowView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneStaticEvidenceCheckPromptCardView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneStaticNonGoalFlagsView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneSummaryView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapStaticCitationCheckPromptCardView as Stage105StaticCitationCard,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapStaticNonGoalFlagsView as Stage105StaticNonGoalFlags,
  ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapView as Stage105View,
} from "../features/mission-console/types.ts";

const stage106IdPrefix =
  "constraint-response-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map-review-path-source-crosswalk-review-path-source-review-readiness-lane-source-follow-up-map-source-citation-review-lane";

export function buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane(
  sourceFollowUpMap: Stage105View | undefined,
): ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneView | undefined {
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
  const defaultStage105Context =
    sourceFollowUpMap.summary.defaultSourceFollowUpContext;

  return {
    schema:
      "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map_source_citation_review_lane.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path source-review readiness lane source follow-up map source citation-review lane and static evidence-check prompts",
    localStatus: sourceFollowUpMap.localStatus,
    summary: {
      constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneId:
        `candidate-local-${stage106IdPrefix}`,
      label: "Local constraint-response revision follow-up source citation-review lane",
      summary:
        "A static source citation-review lane derives from Stage 105 citation-check prompt cards and static evidence-check prompt cards derive from Stage 105 source follow-up map entries so reviewers can inspect citation prompts, follow-up entries, source lineage, local anchors, callbacks, gap prompts, and deferred reminders before drafting outside the app without saved answers, drafts, notes, source selections, citation selections, citation-review state, evidence-check state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
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
          defaultStage105Context.defaultSourceReviewReadinessLaneRowId,
        defaultStaticSourceFollowUpCueCardId:
          defaultStage105Context.defaultStaticSourceFollowUpCueCardId,
        sourceStage105SourceFollowUpMapSummary: sourceFollowUpMap.summary.summary,
        sourceStage105DefaultSourceFollowUpContext: defaultStage105Context,
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
      "Stage 106 source citation-review lane rows and static evidence-check prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; no saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, citation-review state, evidence-check state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap:
      sourceFollowUpMap,
  };
}

function buildCitationReviewLaneRow(
  staticCitationCheckPromptCard: Stage105StaticCitationCard,
  sourceFollowUpMapEntries: Stage105Entry[],
): ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneRowView {
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
    `${stage106IdPrefix}:row:${sourceStaticCitationCheckPromptCardId}`;

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
      `Source citation-review lane row ${sourceStaticCitationCheckPromptCardId}: carry Stage 105 static citation-check prompt card ${sourceStaticCitationCheckPromptCardId}, Stage 105 source follow-up map entries ${joinOrNone(sourceSourceFollowUpMapEntryIds)}, Stage 104 source-readiness lane rows ${joinOrNone(staticCitationCheckPromptCard.sourceSourceReviewReadinessLaneRowIds)}, Stage 104 source-follow-up cue ${staticCitationCheckPromptCard.sourceStaticSourceFollowUpCueCardId}, Stage 103 source-review path steps ${joinOrNone(lineage.sourceSourceReviewPathStepIds)}, Stage 103 static source-review prompt cards ${joinOrNone(lineage.sourceStaticSourceReviewPromptCardIds)}, Stage 102 source-crosswalk rows ${joinOrNone(lineage.sourceCrosswalkRowIds)}, Stage 102 static review-check cards ${joinOrNone(lineage.sourceStaticReviewCheckCardIds)}, Stage 101 review-path steps ${joinOrNone(lineage.sourceConstraintCoverageReviewPathStepIds)}, Stage 101 response-review prompt cards ${joinOrNone(lineage.sourceStaticResponseReviewPromptCardIds)}, Stage 100 constraint-coverage rows ${joinOrNone(lineage.sourceConstraintCoverageRowIds)}, Stage 100 response-note prompt cards ${joinOrNone(lineage.sourceStaticResponseNotePromptCardIds)}, Stage 99 answer-review steps ${joinOrNone(lineage.sourceAnswerReviewPathStepIds)}, Stage 99 constraint-note cards ${joinOrNone(lineage.sourceStaticConstraintNoteCardIds)}, Stage 98 answer-check cards ${joinOrNone(lineage.sourceStaticAnswerCheckCardIds)}, Stage 98 readiness rows ${joinOrNone(lineage.sourceResponsePromptReadinessRowIds)}, Stage 97 response-prompt cards ${joinOrNone(lineage.sourceStaticResponsePromptCardIds)}, Stage 97 response-map review-path steps ${joinOrNone(lineage.sourceResponseMapReviewPathStepIds)}, Stage 96 response-map rows ${joinOrNone(lineage.sourceResponseMapRowIds)}, Stage 95 coverage-review steps ${joinOrNone(lineage.sourceCoverageReviewPathStepIds)}, Stage 94 coverage rows ${joinOrNone(lineage.sourceCoverageMatrixRowIds)}, Stage 93 review-path steps ${joinOrNone(lineage.sourceReviewPathStepIds)}, Stage 92 source-recap rows ${joinOrNone(lineage.sourceSourceRecapRowIds)}, Stage 91 review-lane rows ${joinOrNone(lineage.sourceAnswerFollowUpReviewLaneRowIds)}, Stage 90 crosswalk rows ${joinOrNone(lineage.sourceAnswerSourceCrosswalkRowIds)}, Stage 89 walkthrough steps ${joinOrNone(lineage.sourceAnswerWalkthroughStepIds)}, Stage 88 answer coverage rows ${joinOrNone(lineage.sourceAnswerCoverageRowIds)}, Stage 87 rehearsal steps ${joinOrNone(lineage.sourceRehearsalPathStepIds)}, Stage 86 board rows ${joinOrNone(lineage.sourceReviewBoardRowIds)}, Stage 85 brief rows ${joinOrNone(lineage.sourceFollowUpReadinessBriefRowIds)}, Stage 84 triage rows ${joinOrNone(lineage.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowIds)}, anchors ${joinOrNone(staticCitationCheckPromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticCitationCheckPromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticCitationCheckPromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticCitationCheckPromptCard.deferredScopeReminderIds)}, citation-review labels ${joinOrNone(citationReviewLabels)}, and Stage 105 citation prompt text "${displayCarriedText(staticCitationCheckPromptCard.citationCheckPromptText)}" as deterministic manual citation-review context only.`,
    evidenceCheckPromptText:
      `Static evidence-check prompt for Stage 105 citation prompt ${sourceStaticCitationCheckPromptCardId}: inspect Stage 105 follow-up entries ${joinOrNone(sourceSourceFollowUpMapEntryIds)}, Stage 104 readiness rows ${joinOrNone(staticCitationCheckPromptCard.sourceSourceReviewReadinessLaneRowIds)}, Stage 104 cue ${staticCitationCheckPromptCard.sourceStaticSourceFollowUpCueCardId}, Stage 103 source-review prompts ${joinOrNone(lineage.sourceStaticSourceReviewPromptCardIds)}, Stage 102 review-check cards ${joinOrNone(lineage.sourceStaticReviewCheckCardIds)}, anchors ${joinOrNone(staticCitationCheckPromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticCitationCheckPromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticCitationCheckPromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticCitationCheckPromptCard.deferredScopeReminderIds)}, and evidence-check labels ${joinOrNone(evidenceCheckLabels)} before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, citation-review state, evidence-check state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static Stage 106 source citation-review lane context: manual citation, source-lineage, and evidence-callback checking only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved citation-review lane state, saved evidence-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticCitationCheckPromptCard.staticNonGoalFlags,
    ),
  };
}

function buildStaticEvidenceCheckPromptCard(
  sourceFollowUpMapEntry: Stage105Entry,
  staticCitationCheckPromptCards: Stage105StaticCitationCard[],
): ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneStaticEvidenceCheckPromptCardView {
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
    `${stage106IdPrefix}:static-evidence-check:${sourceSourceFollowUpMapEntryId}`;

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
      `Static evidence-check prompt card ${sourceSourceFollowUpMapEntryId}: use Stage 105 source follow-up map entry ${sourceSourceFollowUpMapEntryId}, matched Stage 105 citation prompt cards ${joinOrNone(sourceStaticCitationCheckPromptCardIds)}, Stage 104 source-readiness row ${sourceFollowUpMapEntry.sourceSourceReviewReadinessLaneRowId}, Stage 104 cue cards ${joinOrNone(sourceFollowUpMapEntry.sourceStaticSourceFollowUpCueCardIds)}, Stage 103 source-review path step ${sourceFollowUpMapEntry.sourceSourceReviewPathStepId}, Stage 103 static source-review prompt cards ${joinOrNone(sourceFollowUpMapEntry.sourceStaticSourceReviewPromptCardIds)}, Stage 102 source-crosswalk row ${sourceFollowUpMapEntry.sourceCrosswalkRowId}, Stage 102 static review-check cards ${joinOrNone(sourceFollowUpMapEntry.sourceStaticReviewCheckCardIds)}, Stage 101 review-path step ${sourceFollowUpMapEntry.sourceConstraintCoverageReviewPathStepId}, Stage 101 response-review prompt cards ${joinOrNone(sourceFollowUpMapEntry.sourceStaticResponseReviewPromptCardIds)}, Stage 100 constraint-coverage row ${sourceFollowUpMapEntry.sourceConstraintCoverageRowId}, Stage 100 response-note prompt cards ${joinOrNone(sourceFollowUpMapEntry.sourceStaticResponseNotePromptCardIds)}, Stage 99 answer-review step ${sourceFollowUpMapEntry.sourceAnswerReviewPathStepId}, Stage 99 static constraint-note cards ${joinOrNone(sourceFollowUpMapEntry.sourceStaticConstraintNoteCardIds)}, Stage 98 answer-check card ${sourceFollowUpMapEntry.sourceStaticAnswerCheckCardId}, Stage 98 readiness rows ${joinOrNone(sourceFollowUpMapEntry.sourceResponsePromptReadinessRowIds)}, Stage 97 response-prompt cards ${joinOrNone(sourceFollowUpMapEntry.sourceStaticResponsePromptCardIds)}, Stage 97 response-map review-path steps ${joinOrNone(sourceFollowUpMapEntry.sourceResponseMapReviewPathStepIds)}, Stage 96 response-map rows ${joinOrNone(sourceFollowUpMapEntry.sourceResponseMapRowIds)}, Stage 95 coverage-review steps ${joinOrNone(sourceFollowUpMapEntry.sourceCoverageReviewPathStepIds)}, Stage 94 coverage rows ${joinOrNone(sourceFollowUpMapEntry.sourceCoverageMatrixRowIds)}, Stage 93 review-path steps ${joinOrNone(sourceFollowUpMapEntry.sourceReviewPathStepIds)}, Stage 92 source recap rows ${joinOrNone(sourceFollowUpMapEntry.sourceSourceRecapRowIds)}, Stage 91 review-lane rows ${joinOrNone(sourceFollowUpMapEntry.sourceAnswerFollowUpReviewLaneRowIds)}, Stage 90 crosswalk rows ${joinOrNone(sourceFollowUpMapEntry.sourceAnswerSourceCrosswalkRowIds)}, Stage 89 walkthrough steps ${joinOrNone(sourceFollowUpMapEntry.sourceAnswerWalkthroughStepIds)}, Stage 88 answer coverage rows ${joinOrNone(sourceFollowUpMapEntry.sourceAnswerCoverageRowIds)}, Stage 87 rehearsal steps ${joinOrNone(sourceFollowUpMapEntry.sourceRehearsalPathStepIds)}, Stage 86 board rows ${joinOrNone(sourceFollowUpMapEntry.sourceReviewBoardRowIds)}, Stage 85 brief rows ${joinOrNone(sourceFollowUpMapEntry.sourceFollowUpReadinessBriefRowIds)}, Stage 84 triage rows ${joinOrNone(sourceFollowUpMapEntry.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowIds)}, anchors ${joinOrNone(sourceFollowUpMapEntry.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(sourceFollowUpMapEntry.evidenceCallbackIds)}, gap prompts ${joinOrNone(sourceFollowUpMapEntry.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(sourceFollowUpMapEntry.deferredScopeReminderIds)}, evidence-check labels ${joinOrNone(evidenceCheckLabels)}, and Stage 105 source-follow-up text "${displayCarriedText(sourceFollowUpMapEntry.sourceFollowUpText)}" as deterministic manual evidence-check context only.`,
    staticNonGoalContext:
      "Static Stage 106 evidence-check prompt context: manual source-lineage, anchor, callback, gap, and deferred-reminder review only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved citation-review state, saved evidence-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      sourceFollowUpMapEntry.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  citationReviewLaneRows: ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneRowView[],
  staticEvidenceCheckPromptCards: ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneStaticEvidenceCheckPromptCardView[],
  sourceFollowUpMap: Stage105View,
): ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneSummaryView["counts"] {
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

function collectLineage(entries: Stage105Entry[]) {
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
    sourceStaticResponseReviewPromptCardIds: unique(
      entries.flatMap((entry) => entry.sourceStaticResponseReviewPromptCardIds),
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
    sourceStaticResponsePromptCardIds: unique(
      entries.flatMap((entry) => entry.sourceStaticResponsePromptCardIds),
    ),
    sourceResponseMapReviewPathStepIds: unique(
      entries.flatMap((entry) => entry.sourceResponseMapReviewPathStepIds),
    ),
    sourceResponseMapRowIds: unique(
      entries.flatMap((entry) => entry.sourceResponseMapRowIds),
    ),
    sourceCoverageReviewPathStepIds: unique(
      entries.flatMap((entry) => entry.sourceCoverageReviewPathStepIds),
    ),
    sourceCoverageMatrixRowIds: unique(
      entries.flatMap((entry) => entry.sourceCoverageMatrixRowIds),
    ),
    sourceReviewPathStepIds: unique(
      entries.flatMap((entry) => entry.sourceReviewPathStepIds),
    ),
    sourceSourceRecapRowIds: unique(
      entries.flatMap((entry) => entry.sourceSourceRecapRowIds),
    ),
    sourceAnswerFollowUpReviewLaneRowIds: unique(
      entries.flatMap((entry) => entry.sourceAnswerFollowUpReviewLaneRowIds),
    ),
    sourceAnswerSourceCrosswalkRowIds: unique(
      entries.flatMap((entry) => entry.sourceAnswerSourceCrosswalkRowIds),
    ),
    sourceAnswerWalkthroughStepIds: unique(
      entries.flatMap((entry) => entry.sourceAnswerWalkthroughStepIds),
    ),
    sourceAnswerCoverageRowIds: unique(
      entries.flatMap((entry) => entry.sourceAnswerCoverageRowIds),
    ),
    sourceRehearsalPathStepIds: unique(
      entries.flatMap((entry) => entry.sourceRehearsalPathStepIds),
    ),
    sourceReviewBoardRowIds: unique(
      entries.flatMap((entry) => entry.sourceReviewBoardRowIds),
    ),
    sourceFollowUpReadinessBriefRowIds: unique(
      entries.flatMap((entry) => entry.sourceFollowUpReadinessBriefRowIds),
    ),
    sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowIds:
      unique(
        entries.flatMap(
          (entry) =>
            entry.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowIds,
        ),
      ),
  };
}

function buildCitationReviewLabels(
  staticCitationCheckPromptCard: Stage105StaticCitationCard,
  matchedSourceFollowUpMapEntries: Stage105Entry[],
): string[] {
  const labels = [
    "source citation-review lane row",
    "Stage 105 static citation-check prompt carry-forward",
  ];

  if (matchedSourceFollowUpMapEntries.length) {
    labels.push("Stage 105 source follow-up map entry alignment");
  }

  if (staticCitationCheckPromptCard.staticCitationCheckLabels.length) {
    labels.push("static citation-check label carry-forward");
  }

  return labels;
}

function buildRowEvidenceCheckLabels(
  staticCitationCheckPromptCard: Stage105StaticCitationCard,
  matchedSourceFollowUpMapEntries: Stage105Entry[],
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
  sourceFollowUpMapEntry: Stage105Entry,
  matchedStaticCitationCheckPromptCards: Stage105StaticCitationCard[],
): string[] {
  const labels = [
    "source follow-up citation-review carry-forward",
    "Stage 105 source follow-up map entry",
  ];

  if (matchedStaticCitationCheckPromptCards.length) {
    labels.push("matched Stage 105 citation prompt context");
  }

  if (sourceFollowUpMapEntry.citationCheckLabels.length) {
    labels.push("citation-check label carry-forward");
  }

  return labels;
}

function buildEvidenceCardEvidenceCheckLabels(
  sourceFollowUpMapEntry: Stage105Entry,
  matchedStaticCitationCheckPromptCards: Stage105StaticCitationCard[],
): string[] {
  const labels = [
    "static evidence-check prompt card",
    "Stage 105 follow-up entry evidence context",
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
  sourceFlags: Stage105StaticNonGoalFlags,
): ConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneStaticNonGoalFlagsView {
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
