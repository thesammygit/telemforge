import type {
  ConstraintResponseSourceCitationReviewLaneRowView,
  ConstraintResponseSourceCitationReviewLaneStaticEvidenceCheckPromptCardView,
  ConstraintResponseSourceCitationReviewLaneStaticNonGoalFlagsView,
  ConstraintResponseSourceCitationReviewLaneSummaryView,
  ConstraintResponseSourceCitationReviewLaneView,
  ConstraintResponseSourceFollowUpMapEntryView as Stage85Entry,
  ConstraintResponseSourceFollowUpMapStaticCitationCheckPromptCardView as Stage85StaticCitationCard,
  ConstraintResponseSourceFollowUpMapStaticNonGoalFlagsView as Stage85StaticNonGoalFlags,
  ConstraintResponseSourceFollowUpMapView as Stage85View,
} from "../features/mission-console/types.ts";

export function buildConstraintResponseSourceCitationReviewLane(
  sourceFollowUpMap: Stage85View | undefined,
): ConstraintResponseSourceCitationReviewLaneView | undefined {
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
  const defaultStage85Context =
    sourceFollowUpMap.summary.defaultFollowUpContext;

  return {
    schema: "telemforge.constraint_response_source_citation_review_lane.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response source citation-review lane and static evidence-check prompts",
    localStatus: sourceFollowUpMap.localStatus,
    summary: {
      constraintResponseSourceCitationReviewLaneId:
        "candidate-local-constraint-response-source-citation-review-lane",
      label: "Local constraint-response source citation-review lane",
      summary:
        "A static source citation-review lane derives from Stage 85 citation-check prompt cards and static evidence-check prompt cards derive from Stage 85 source follow-up map entries so reviewers can inspect citation prompts, follow-up entries, source lineage, local anchors, and evidence callbacks before drafting outside the app without saved answers, drafts, notes, source selections, citation selections, citation-review state, evidence-check state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultCitationReviewContext: {
        defaultCitationReviewLaneRowId:
          defaultCitationReviewLaneRow.citationReviewLaneRowId,
        defaultStaticEvidenceCheckPromptCardId:
          defaultStaticEvidenceCheckPromptCard.staticEvidenceCheckPromptCardId,
        defaultStaticCitationCheckPromptCardId:
          defaultCitationReviewLaneRow.sourceStaticCitationCheckPromptCardId,
        defaultSourceFollowUpMapEntryId:
          defaultStaticEvidenceCheckPromptCard.sourceSourceFollowUpMapEntryId,
        defaultSourceReadinessLaneRowId:
          defaultStage85Context.defaultSourceReadinessLaneRowId,
        defaultStaticSourceFollowUpCueCardId:
          defaultStage85Context.defaultStaticSourceFollowUpCueCardId,
        sourceStage85SourceFollowUpMapSummary: sourceFollowUpMap.summary.summary,
        sourceStage85DefaultFollowUpContext: defaultStage85Context,
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
      "Stage 86 source citation-review lane rows and static evidence-check prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, citation-review state, evidence-check state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseSourceFollowUpMap: sourceFollowUpMap,
  };
}

function buildCitationReviewLaneRow(
  staticCitationCheckPromptCard: Stage85StaticCitationCard,
  sourceFollowUpMapEntries: Stage85Entry[],
): ConstraintResponseSourceCitationReviewLaneRowView {
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
    `constraint-response-source-citation-review-lane:row:${sourceStaticCitationCheckPromptCardId}`;

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
      `Source citation-review lane row ${sourceStaticCitationCheckPromptCardId}: carry Stage 85 static citation-check prompt card ${sourceStaticCitationCheckPromptCardId}, Stage 85 source follow-up map entries ${joinOrNone(sourceSourceFollowUpMapEntryIds)}, Stage 84 readiness rows ${joinOrNone(staticCitationCheckPromptCard.sourceSourceReadinessLaneRowIds)}, Stage 84 source-follow-up cue ${staticCitationCheckPromptCard.sourceStaticSourceFollowUpCueCardId}, Stage 83 source-review path steps ${joinOrNone(lineage.sourceSourceReviewPathStepIds)}, Stage 83 static source-review prompt cards ${joinOrNone(lineage.sourceStaticSourceReviewPromptCardIds)}, Stage 82 source-crosswalk rows ${joinOrNone(lineage.sourceCrosswalkRowIds)}, Stage 82 static review-check cards ${joinOrNone(lineage.sourceStaticReviewCheckCardIds)}, Stage 81 review-path steps ${joinOrNone(lineage.sourceConstraintResponseReviewPathStepIds)}, Stage 81 response-review prompt cards ${joinOrNone(lineage.sourceStaticResponseReviewPromptCardIds)}, Stage 80 constraint-coverage rows ${joinOrNone(lineage.sourceConstraintCoverageRowIds)}, Stage 80 response-note prompt cards ${joinOrNone(lineage.sourceStaticResponseNotePromptCardIds)}, Stage 79 answer-review steps ${joinOrNone(lineage.sourceAnswerReviewPathStepIds)}, Stage 79 constraint-note cards ${joinOrNone(lineage.sourceStaticConstraintNoteCardIds)}, Stage 78 answer-check cards ${joinOrNone(lineage.sourceStaticAnswerCheckCardIds)}, Stage 78 readiness rows ${joinOrNone(lineage.sourceResponsePromptReadinessRowIds)}, Stage 77 response-prompt cards ${joinOrNone(lineage.sourceStaticResponsePromptCardIds)}, Stage 77 response-map review-path steps ${joinOrNone(lineage.sourceResponseMapReviewPathStepIds)}, Stage 76 response-map rows ${joinOrNone(lineage.sourceResponseMapRowIds)}, Stage 75 coverage-review steps ${joinOrNone(lineage.sourceCoverageReviewPathStepIds)}, Stage 74 coverage rows ${joinOrNone(lineage.sourceCoverageMatrixRowIds)}, Stage 73 review-path steps ${joinOrNone(lineage.sourceReviewPathStepIds)}, Stage 72 source-recap rows ${joinOrNone(lineage.sourceSourceRecapRowIds)}, Stage 71 review-lane rows ${joinOrNone(lineage.sourceAnswerFollowUpReviewLaneRowIds)}, Stage 70 crosswalk rows ${joinOrNone(lineage.sourceAnswerSourceCrosswalkRowIds)}, Stage 69 walkthrough steps ${joinOrNone(lineage.sourceAnswerWalkthroughStepIds)}, Stage 68 answer coverage rows ${joinOrNone(lineage.sourceAnswerCoverageRowIds)}, Stage 67 rehearsal steps ${joinOrNone(lineage.sourceRehearsalPathStepIds)}, Stage 66 board rows ${joinOrNone(lineage.sourceReviewBoardRowIds)}, Stage 65 brief rows ${joinOrNone(lineage.sourceFollowUpReadinessBriefRowIds)}, Stage 64 triage rows ${joinOrNone(lineage.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowIds)}, anchors ${joinOrNone(staticCitationCheckPromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticCitationCheckPromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticCitationCheckPromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticCitationCheckPromptCard.deferredScopeReminderIds)}, citation-review labels ${joinOrNone(citationReviewLabels)}, and Stage 85 citation prompt text "${staticCitationCheckPromptCard.citationCheckPromptText}" as deterministic manual citation-review context only.`,
    evidenceCheckPromptText:
      `Static evidence-check prompt for Stage 85 citation prompt ${sourceStaticCitationCheckPromptCardId}: inspect Stage 85 follow-up entries ${joinOrNone(sourceSourceFollowUpMapEntryIds)}, Stage 84 readiness rows ${joinOrNone(staticCitationCheckPromptCard.sourceSourceReadinessLaneRowIds)}, Stage 84 cue ${staticCitationCheckPromptCard.sourceStaticSourceFollowUpCueCardId}, Stage 83 source-review prompts ${joinOrNone(lineage.sourceStaticSourceReviewPromptCardIds)}, Stage 82 review-check cards ${joinOrNone(lineage.sourceStaticReviewCheckCardIds)}, anchors ${joinOrNone(staticCitationCheckPromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticCitationCheckPromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticCitationCheckPromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticCitationCheckPromptCard.deferredScopeReminderIds)}, and evidence-check labels ${joinOrNone(evidenceCheckLabels)} before drafting outside the app without saved reviewer answers, answer drafts, reviewer notes, response notes, source selections, citation selections, citation-review state, evidence-check state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static source citation-review lane context: manual citation, source-lineage, and evidence-callback checking only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved citation-review lane state, saved evidence-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticCitationCheckPromptCard.staticNonGoalFlags,
    ),
  };
}

function buildStaticEvidenceCheckPromptCard(
  sourceFollowUpMapEntry: Stage85Entry,
  staticCitationCheckPromptCards: Stage85StaticCitationCard[],
): ConstraintResponseSourceCitationReviewLaneStaticEvidenceCheckPromptCardView {
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
    `constraint-response-source-citation-review-lane:static-evidence-check:${sourceSourceFollowUpMapEntryId}`;

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
      `Static evidence-check prompt card ${sourceSourceFollowUpMapEntryId}: use Stage 85 source follow-up map entry ${sourceSourceFollowUpMapEntryId}, matched Stage 85 citation prompt cards ${joinOrNone(sourceStaticCitationCheckPromptCardIds)}, Stage 84 readiness row ${sourceFollowUpMapEntry.sourceSourceReadinessLaneRowId}, Stage 84 cue cards ${joinOrNone(sourceFollowUpMapEntry.sourceStaticSourceFollowUpCueCardIds)}, Stage 83 source-review path step ${sourceFollowUpMapEntry.sourceSourceReviewPathStepId}, Stage 83 static source-review prompt cards ${joinOrNone(sourceFollowUpMapEntry.sourceStaticSourceReviewPromptCardIds)}, Stage 82 source-crosswalk row ${sourceFollowUpMapEntry.sourceCrosswalkRowId}, Stage 82 static review-check cards ${joinOrNone(sourceFollowUpMapEntry.sourceStaticReviewCheckCardIds)}, Stage 81 review-path step ${sourceFollowUpMapEntry.sourceConstraintResponseReviewPathStepId}, Stage 81 response-review prompt cards ${joinOrNone(sourceFollowUpMapEntry.sourceStaticResponseReviewPromptCardIds)}, Stage 80 constraint-coverage row ${sourceFollowUpMapEntry.sourceConstraintCoverageRowId}, Stage 80 response-note prompt cards ${joinOrNone(sourceFollowUpMapEntry.sourceStaticResponseNotePromptCardIds)}, Stage 79 answer-review step ${sourceFollowUpMapEntry.sourceAnswerReviewPathStepId}, Stage 79 static constraint-note cards ${joinOrNone(sourceFollowUpMapEntry.sourceStaticConstraintNoteCardIds)}, Stage 78 answer-check card ${sourceFollowUpMapEntry.sourceStaticAnswerCheckCardId}, Stage 78 readiness rows ${joinOrNone(sourceFollowUpMapEntry.sourceResponsePromptReadinessRowIds)}, Stage 77 response-prompt cards ${joinOrNone(sourceFollowUpMapEntry.sourceStaticResponsePromptCardIds)}, Stage 76 response-map row ${sourceFollowUpMapEntry.sourceResponseMapRowId}, Stage 75 coverage-review step ${sourceFollowUpMapEntry.sourceCoverageReviewPathStepId}, Stage 74 coverage row ${sourceFollowUpMapEntry.sourceCoverageMatrixRowId}, Stage 73 review-path step ${sourceFollowUpMapEntry.sourceReviewPathStepId}, Stage 72 source recap row ${sourceFollowUpMapEntry.sourceSourceRecapRowId}, Stage 71 review-lane row ${sourceFollowUpMapEntry.sourceAnswerFollowUpReviewLaneRowId}, Stage 70 crosswalk row ${sourceFollowUpMapEntry.sourceAnswerSourceCrosswalkRowId}, Stage 69 walkthrough step ${sourceFollowUpMapEntry.sourceAnswerWalkthroughStepId}, Stage 68 answer coverage row ${sourceFollowUpMapEntry.sourceAnswerCoverageRowId}, Stage 67 rehearsal step ${sourceFollowUpMapEntry.sourceRehearsalPathStepId}, Stage 66 board row ${sourceFollowUpMapEntry.sourceReviewBoardRowId}, Stage 65 brief row ${sourceFollowUpMapEntry.followUpReadinessBriefRowId}, Stage 64 triage row ${sourceFollowUpMapEntry.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${joinOrNone(sourceFollowUpMapEntry.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(sourceFollowUpMapEntry.evidenceCallbackIds)}, gap prompts ${joinOrNone(sourceFollowUpMapEntry.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(sourceFollowUpMapEntry.deferredScopeReminderIds)}, evidence-check labels ${joinOrNone(evidenceCheckLabels)}, and Stage 85 source-follow-up text "${sourceFollowUpMapEntry.sourceFollowUpText}" as deterministic manual evidence-check context only.`,
    staticNonGoalContext:
      "Static evidence-check prompt context: manual source-lineage, anchor, callback, gap, and deferred-reminder review only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved source selections, saved citation selections, saved citation-review state, saved evidence-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      sourceFollowUpMapEntry.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  citationReviewLaneRows: ConstraintResponseSourceCitationReviewLaneRowView[],
  staticEvidenceCheckPromptCards: ConstraintResponseSourceCitationReviewLaneStaticEvidenceCheckPromptCardView[],
  sourceFollowUpMap: Stage85View,
): ConstraintResponseSourceCitationReviewLaneSummaryView["counts"] {
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

function collectLineage(entries: Stage85Entry[]) {
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
    sourceConstraintResponseReviewPathStepIds: unique(
      entries.map((entry) => entry.sourceConstraintResponseReviewPathStepId),
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
      entries.map((entry) => entry.sourceResponseMapReviewPathStepId),
    ),
    sourceResponseMapRowIds: unique(
      entries.map((entry) => entry.sourceResponseMapRowId),
    ),
    sourceCoverageReviewPathStepIds: unique(
      entries.map((entry) => entry.sourceCoverageReviewPathStepId),
    ),
    sourceCoverageMatrixRowIds: unique(
      entries.map((entry) => entry.sourceCoverageMatrixRowId),
    ),
    sourceReviewPathStepIds: unique(
      entries.map((entry) => entry.sourceReviewPathStepId),
    ),
    sourceSourceRecapRowIds: unique(
      entries.map((entry) => entry.sourceSourceRecapRowId),
    ),
    sourceAnswerFollowUpReviewLaneRowIds: unique(
      entries.map((entry) => entry.sourceAnswerFollowUpReviewLaneRowId),
    ),
    sourceAnswerSourceCrosswalkRowIds: unique(
      entries.map((entry) => entry.sourceAnswerSourceCrosswalkRowId),
    ),
    sourceAnswerWalkthroughStepIds: unique(
      entries.map((entry) => entry.sourceAnswerWalkthroughStepId),
    ),
    sourceAnswerCoverageRowIds: unique(
      entries.map((entry) => entry.sourceAnswerCoverageRowId),
    ),
    sourceRehearsalPathStepIds: unique(
      entries.map((entry) => entry.sourceRehearsalPathStepId),
    ),
    sourceReviewBoardRowIds: unique(
      entries.map((entry) => entry.sourceReviewBoardRowId),
    ),
    sourceFollowUpReadinessBriefRowIds: unique(
      entries.map((entry) => entry.followUpReadinessBriefRowId),
    ),
    sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowIds:
      unique(
        entries.map(
          (entry) =>
            entry.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        ),
      ),
  };
}

function buildCitationReviewLabels(
  staticCitationCheckPromptCard: Stage85StaticCitationCard,
  matchedSourceFollowUpMapEntries: Stage85Entry[],
): string[] {
  const labels = [
    "source citation-review lane row",
    "Stage 85 static citation-check prompt carry-forward",
  ];

  if (matchedSourceFollowUpMapEntries.length) {
    labels.push("Stage 85 source follow-up map entry alignment");
  }

  if (staticCitationCheckPromptCard.staticCitationCheckLabels.length) {
    labels.push("static citation-check label carry-forward");
  }

  return labels;
}

function buildRowEvidenceCheckLabels(
  staticCitationCheckPromptCard: Stage85StaticCitationCard,
  matchedSourceFollowUpMapEntries: Stage85Entry[],
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
  sourceFollowUpMapEntry: Stage85Entry,
  matchedStaticCitationCheckPromptCards: Stage85StaticCitationCard[],
): string[] {
  const labels = [
    "source follow-up citation-review carry-forward",
    "Stage 85 source follow-up map entry",
  ];

  if (matchedStaticCitationCheckPromptCards.length) {
    labels.push("matched Stage 85 citation prompt context");
  }

  if (sourceFollowUpMapEntry.citationCheckLabels.length) {
    labels.push("citation-check label carry-forward");
  }

  return labels;
}

function buildEvidenceCardEvidenceCheckLabels(
  sourceFollowUpMapEntry: Stage85Entry,
  matchedStaticCitationCheckPromptCards: Stage85StaticCitationCard[],
): string[] {
  const labels = [
    "static evidence-check prompt card",
    "Stage 85 follow-up entry evidence context",
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
  sourceFlags: Stage85StaticNonGoalFlags,
): ConstraintResponseSourceCitationReviewLaneStaticNonGoalFlagsView {
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

function joinOrNone(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}
