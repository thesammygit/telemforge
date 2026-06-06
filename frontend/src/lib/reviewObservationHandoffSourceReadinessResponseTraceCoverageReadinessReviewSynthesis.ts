import type {
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneRowView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisSummaryView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis(
  sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane:
    | ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneView
    | undefined,
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisView | undefined {
  if (
    !sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
      ?.reviewLaneRows.length
  ) {
    return undefined;
  }

  const synthesisRows =
    sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane.reviewLaneRows.map(
      (reviewLaneRow) =>
        buildSynthesisRow(
          reviewLaneRow,
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane.staticHumanCheckPromptCards,
        ),
    );
  const staticFollowUpNoteCards =
    sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane.staticHumanCheckPromptCards.map(
      (staticHumanCheckPromptCard) =>
        buildStaticFollowUpNoteCard(
          staticHumanCheckPromptCard,
          synthesisRows,
        ),
    );
  const defaultSynthesisRow =
    synthesisRows.find(
      (row) =>
        row.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId ===
        sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
          .summary.defaultReviewLaneContext.defaultReviewLaneRowId,
    ) ?? synthesisRows[0];
  const defaultStaticFollowUpNoteCard =
    staticFollowUpNoteCards.find(
      (card) =>
        card.sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId ===
        sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
          .summary.defaultReviewLaneContext
          .defaultStaticHumanCheckPromptCardId,
    ) ?? staticFollowUpNoteCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_source_readiness_response_trace_coverage_readiness_review_synthesis.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff source readiness response trace coverage readiness review synthesis and static follow-up notes",
    localStatus:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane.localStatus,
    summary: {
      sourceReadinessResponseTraceCoverageReadinessReviewSynthesisId:
        "candidate-local-review-observation-handoff-source-readiness-response-trace-coverage-readiness-review-synthesis",
      label:
        "Local observation handoff source readiness response trace coverage readiness review synthesis",
      summary:
        "A static readiness review synthesis derives from Stage 62 review-lane rows and static human-check prompt cards so reviewers can inspect review-lane rows, readiness brief rows, review path steps, coverage rows, response trace rows, walkthrough steps, response rows, question rows, source anchors, evidence callbacks, gap discussion prompts, deferred-scope reminders, coverage notes, gap notes, handoff prompts, readiness brief text, reviewer cue text, review-lane text, human-check prompts, and static follow-up notes before human review without saved reviewer answers, saved trace coverage progress, saved coverage review progress, saved readiness brief state, saved review-lane state, saved synthesis state, saved follow-up notes, saved human-check prompts, saved gap notes, saved handoff prompt edits, saved response progress, saved source readiness progress, saved source inspection state, saved anchor state, saved relay progress, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, owner assignment, or commands.",
      defaultReviewSynthesisContext: {
        defaultSynthesisRowId:
          defaultSynthesisRow
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
        defaultReviewLaneRowId:
          defaultSynthesisRow
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        defaultReadinessBriefRowId:
          defaultSynthesisRow
            .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        defaultReviewPathStepId:
          defaultSynthesisRow
            .sourceReadinessResponseTraceCoverageReviewPathStepId,
        defaultCoverageRowId:
          defaultSynthesisRow.sourceReadinessResponseTraceCoverageRowId,
        defaultTraceRowId:
          defaultSynthesisRow.sourceReadinessResponseTraceRowId,
        defaultStaticFollowUpNoteCardId:
          defaultStaticFollowUpNoteCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
        defaultStaticHumanCheckPromptCardId:
          defaultStaticFollowUpNoteCard
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
        defaultStaticReviewerCueCardId:
          defaultStaticFollowUpNoteCard
            .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
        defaultStaticHandoffPromptCardId:
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
            .summary.defaultReviewLaneContext.defaultStaticHandoffPromptCardId,
        sourceReadinessResponseTraceCoverageReadinessReviewLaneSummary:
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
            .summary.summary,
        sourceReadinessResponseTraceCoverageReadinessReviewLaneDefaultContext:
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
            .summary.defaultReviewLaneContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        synthesisRows,
        staticFollowUpNoteCards,
        sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane,
      ),
    },
    defaultSynthesisRow,
    defaultStaticFollowUpNoteCard,
    synthesisRows,
    staticFollowUpNoteCards,
    staticSourceReadinessResponseTraceCoverageReadinessReviewSynthesisSummary:
      "Stage 63 readiness review synthesis rows and static follow-up note cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, trace coverage progress, coverage review progress, readiness brief state, review-lane state, synthesis state, follow-up notes, human-check prompts, gap notes, handoff prompt edits, response progress, source readiness progress, source inspection state, anchor state, relay progress, review sessions, reviewer progress, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane,
  };
}

function buildSynthesisRow(
  reviewLaneRow: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneRowView,
  staticHumanCheckPromptCards: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardView[],
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowView {
  const matchedStaticHumanCheckPromptCards =
    staticHumanCheckPromptCards.filter((card) =>
      staticHumanCheckPromptMatchesReviewLaneRow(card, reviewLaneRow),
    );

  return {
    sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId: `review-observation-handoff-source-readiness-response-trace-coverage-readiness-review-synthesis:${reviewLaneRow.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId}`,
    synthesisRowOrder: reviewLaneRow.reviewLaneOrder,
    label: `${reviewLaneRow.label} synthesis`,
    summary:
      `Readiness review synthesis row ${reviewLaneRow.reviewLaneOrder} preserves Stage 62 review-lane order for ${reviewLaneRow.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId}, readiness brief row ${reviewLaneRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId}, review path step ${reviewLaneRow.sourceReadinessResponseTraceCoverageReviewPathStepId}, coverage row ${reviewLaneRow.sourceReadinessResponseTraceCoverageRowId}, trace row ${reviewLaneRow.sourceReadinessResponseTraceRowId}, walkthrough step ${reviewLaneRow.sourceReadinessResponseWalkthroughStepId}, response row ${reviewLaneRow.sourceReadinessResponseRowId}, question row ${reviewLaneRow.sourceReadinessQuestionRowId}, ${reviewLaneRow.matchedStaticReviewerCueCardIds.length} static reviewer cues, ${matchedStaticHumanCheckPromptCards.length} static human checks, ${reviewLaneRow.matchedStaticHandoffPromptCardIds.length} static handoff prompts, ${reviewLaneRow.sourceAnchorTargetIds.length} anchors, ${reviewLaneRow.evidenceCallbackIds.length} callbacks, ${reviewLaneRow.gapDiscussionPointIds.length} gap prompts, and ${reviewLaneRow.deferredScopeReminderIds.length} deferred reminders without saved synthesis state, saved follow-up notes, saved review-lane state, saved human-check prompts, saved gap notes, saved handoff prompt edits, saved reviewer answers, routes, exports, signoff, audit state, scores, certification, owner assignment, meetings, packages, task launchers, runnable checklists, or commands.`,
    sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId:
      reviewLaneRow.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
    sourceReadinessResponseTraceCoverageReadinessReviewLaneRowIds: [
      reviewLaneRow.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
    ],
    sourceReadinessResponseTraceCoverageReadinessBriefRowId:
      reviewLaneRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    sourceReadinessResponseTraceCoverageReadinessBriefRowIds:
      reviewLaneRow.sourceReadinessResponseTraceCoverageReadinessBriefRowIds,
    sourceReadinessResponseTraceCoverageReviewPathStepId:
      reviewLaneRow.sourceReadinessResponseTraceCoverageReviewPathStepId,
    sourceReadinessResponseTraceCoverageReviewPathStepIds:
      reviewLaneRow.sourceReadinessResponseTraceCoverageReviewPathStepIds,
    sourceReadinessResponseTraceCoverageRowId:
      reviewLaneRow.sourceReadinessResponseTraceCoverageRowId,
    sourceReadinessResponseTraceCoverageRowIds:
      reviewLaneRow.sourceReadinessResponseTraceCoverageRowIds,
    sourceReadinessResponseTraceRowId:
      reviewLaneRow.sourceReadinessResponseTraceRowId,
    sourceReadinessResponseTraceRowIds:
      reviewLaneRow.sourceReadinessResponseTraceRowIds,
    sourceReadinessResponseWalkthroughStepId:
      reviewLaneRow.sourceReadinessResponseWalkthroughStepId,
    sourceReadinessResponseWalkthroughStepIds:
      reviewLaneRow.sourceReadinessResponseWalkthroughStepIds,
    sourceReadinessResponseRowId:
      reviewLaneRow.sourceReadinessResponseRowId,
    sourceReadinessResponseRowIds:
      reviewLaneRow.sourceReadinessResponseRowIds,
    sourceReadinessQuestionRowId:
      reviewLaneRow.sourceReadinessQuestionRowId,
    sourceReadinessQuestionRowIds:
      reviewLaneRow.sourceReadinessQuestionRowIds,
    matchedStaticReviewerCueCardIds:
      reviewLaneRow.matchedStaticReviewerCueCardIds,
    matchedStaticHumanCheckPromptCardIds:
      matchedStaticHumanCheckPromptCards.map(
        (card) =>
          card.sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
      ),
    matchedStaticHandoffPromptCardIds:
      reviewLaneRow.matchedStaticHandoffPromptCardIds,
    sourceLocalAnchorHrefs: reviewLaneRow.sourceLocalAnchorHrefs,
    sourceAnchorTargetIds: reviewLaneRow.sourceAnchorTargetIds,
    evidenceCallbackIds: reviewLaneRow.evidenceCallbackIds,
    gapDiscussionPointIds: reviewLaneRow.gapDiscussionPointIds,
    deferredScopeReminderIds: reviewLaneRow.deferredScopeReminderIds,
    reviewerCueText: reviewLaneRow.reviewerCueText,
    coverageNoteText: reviewLaneRow.coverageNoteText,
    gapNoteText: reviewLaneRow.gapNoteText,
    handoffPromptText: reviewLaneRow.handoffPromptText,
    readinessBriefText: reviewLaneRow.readinessBriefText,
    reviewLaneText: reviewLaneRow.reviewLaneText,
    humanCheckPromptText: reviewLaneRow.humanCheckPromptText,
    followUpNoteText:
      `Static follow-up note for ${reviewLaneRow.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId}: synthesize the review-lane text, human-check prompt text, coverage note, gap note, handoff prompt, anchors ${reviewLaneRow.sourceLocalAnchorHrefs.join(", ")}, callbacks ${reviewLaneRow.evidenceCallbackIds.join(", ")}, gap prompts ${reviewLaneRow.gapDiscussionPointIds.join(", ")}, and deferred reminders ${reviewLaneRow.deferredScopeReminderIds.join(", ")} as local manual-review context only.`,
    staticNonGoalContexts: reviewLaneRow.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(reviewLaneRow.staticNonGoalFlags),
    ...staticResponseTraceCoverageReadinessReviewSynthesisItemFlags(),
  };
}

function buildStaticFollowUpNoteCard(
  staticHumanCheckPromptCard: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardView,
  synthesisRows: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowView[],
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardView {
  const cardId =
    staticHumanCheckPromptCard.sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId;
  const matchedSynthesisRows = synthesisRows.filter((row) =>
    row.matchedStaticHumanCheckPromptCardIds.includes(cardId) ||
    staticHumanCheckPromptCard.matchedReadinessBriefRowIds.includes(
      row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    ) ||
    staticHumanCheckPromptCard.matchedReviewPathStepIds.includes(
      row.sourceReadinessResponseTraceCoverageReviewPathStepId,
    ) ||
    staticHumanCheckPromptCard.matchedCoverageRowIds.includes(
      row.sourceReadinessResponseTraceCoverageRowId,
    ) ||
    staticHumanCheckPromptCard.matchedResponseTraceRowIds.includes(
      row.sourceReadinessResponseTraceRowId,
    ) ||
    staticHumanCheckPromptCard.matchedResponseRowIds.includes(
      row.sourceReadinessResponseRowId,
    ) ||
    staticHumanCheckPromptCard.matchedQuestionRowIds.includes(
      row.sourceReadinessQuestionRowId,
    ),
  );

  return {
    sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId: `review-observation-handoff-source-readiness-response-trace-coverage-readiness-review-synthesis:follow-up:${cardId}`,
    followUpNoteOrder: staticHumanCheckPromptCard.humanCheckPromptOrder,
    sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId:
      staticHumanCheckPromptCard
        .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
    sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardIds:
      [
        staticHumanCheckPromptCard
          .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
      ],
    sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId:
      staticHumanCheckPromptCard
        .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
    sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardIds:
      staticHumanCheckPromptCard
        .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardIds,
    matchedSynthesisRowIds: matchedSynthesisRows.map(
      (row) =>
        row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
    ),
    matchedReviewLaneRowIds: matchedSynthesisRows.map(
      (row) =>
        row.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
    ),
    matchedReadinessBriefRowIds:
      staticHumanCheckPromptCard.matchedReadinessBriefRowIds,
    matchedReviewPathStepIds: uniqueStrings([
      ...staticHumanCheckPromptCard.matchedReviewPathStepIds,
      ...matchedSynthesisRows.map(
        (row) => row.sourceReadinessResponseTraceCoverageReviewPathStepId,
      ),
    ]),
    matchedCoverageRowIds: uniqueStrings([
      ...staticHumanCheckPromptCard.matchedCoverageRowIds,
      ...matchedSynthesisRows.map(
        (row) => row.sourceReadinessResponseTraceCoverageRowId,
      ),
    ]),
    matchedResponseTraceRowIds: uniqueStrings([
      ...staticHumanCheckPromptCard.matchedResponseTraceRowIds,
      ...matchedSynthesisRows.map(
        (row) => row.sourceReadinessResponseTraceRowId,
      ),
    ]),
    matchedResponseWalkthroughStepIds: uniqueStrings(
      matchedSynthesisRows.flatMap(
        (row) => row.sourceReadinessResponseWalkthroughStepIds,
      ),
    ),
    matchedResponseRowIds: uniqueStrings([
      ...staticHumanCheckPromptCard.matchedResponseRowIds,
      ...matchedSynthesisRows.map((row) => row.sourceReadinessResponseRowId),
    ]),
    matchedQuestionRowIds: uniqueStrings([
      ...staticHumanCheckPromptCard.matchedQuestionRowIds,
      ...matchedSynthesisRows.map((row) => row.sourceReadinessQuestionRowId),
    ]),
    sourceLocalAnchorHrefs: staticHumanCheckPromptCard.sourceLocalAnchorHrefs,
    sourceAnchorTargetIds: staticHumanCheckPromptCard.sourceAnchorTargetIds,
    localAnchorHref: staticHumanCheckPromptCard.localAnchorHref,
    anchorTargetId: staticHumanCheckPromptCard.anchorTargetId,
    evidenceCallbackIds: staticHumanCheckPromptCard.evidenceCallbackIds,
    gapDiscussionPointIds: staticHumanCheckPromptCard.gapDiscussionPointIds,
    deferredScopeReminderIds:
      staticHumanCheckPromptCard.deferredScopeReminderIds,
    label: `${staticHumanCheckPromptCard.label} follow-up note`,
    summary:
      `Static follow-up note ${staticHumanCheckPromptCard.humanCheckPromptOrder} preserves Stage 62 static human-check prompt order for ${staticHumanCheckPromptCard.sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId} and matched synthesis rows ${matchedSynthesisRows.map((row) => row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId).join(", ") || "none"} while remaining local, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying.`,
    reviewLaneText:
      matchedSynthesisRows.map((row) => row.reviewLaneText).join(" ") ||
      "No matched review-lane text is available.",
    humanCheckPromptText: staticHumanCheckPromptCard.humanCheckPromptText,
    followUpNoteText:
      `Follow-up note for ${staticHumanCheckPromptCard.sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId}: compare matched review-lane rows ${matchedSynthesisRows.map((row) => row.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId).join(", ") || "none"}, readiness brief rows ${staticHumanCheckPromptCard.matchedReadinessBriefRowIds.join(", ") || "none"}, review path steps ${staticHumanCheckPromptCard.matchedReviewPathStepIds.join(", ") || "none"}, coverage rows ${staticHumanCheckPromptCard.matchedCoverageRowIds.join(", ") || "none"}, response traces ${staticHumanCheckPromptCard.matchedResponseTraceRowIds.join(", ") || "none"}, responses ${staticHumanCheckPromptCard.matchedResponseRowIds.join(", ") || "none"}, questions ${staticHumanCheckPromptCard.matchedQuestionRowIds.join(", ") || "none"}, anchors ${staticHumanCheckPromptCard.sourceAnchorTargetIds.join(", ")}, callbacks ${staticHumanCheckPromptCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticHumanCheckPromptCard.gapDiscussionPointIds.join(", ")}, and deferred reminders ${staticHumanCheckPromptCard.deferredScopeReminderIds.join(", ")} as static manual-review context only.`,
    staticNonGoalFlags: staticNonGoalFlags(
      staticHumanCheckPromptCard.staticNonGoalFlags,
    ),
    ...staticResponseTraceCoverageReadinessReviewSynthesisItemFlags(),
  };
}

function staticHumanCheckPromptMatchesReviewLaneRow(
  staticHumanCheckPromptCard: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardView,
  reviewLaneRow: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneRowView,
): boolean {
  return (
    staticHumanCheckPromptCard.matchedReadinessBriefRowIds.includes(
      reviewLaneRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    ) ||
    reviewLaneRow.matchedStaticReviewerCueCardIds.includes(
      staticHumanCheckPromptCard
        .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
    ) ||
    reviewLaneRow.matchedStaticHandoffPromptCardIds.includes(
      staticHumanCheckPromptCard
        .sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
    )
  );
}

function buildCounts(
  synthesisRows: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowView[],
  staticFollowUpNoteCards: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardView[],
  sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneView,
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisSummaryView["counts"] {
  return {
    synthesisRowCount: synthesisRows.length,
    staticFollowUpNoteCardCount: staticFollowUpNoteCards.length,
    reviewLaneRowCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
        .reviewLaneRows.length,
    staticHumanCheckPromptCardCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
        .staticHumanCheckPromptCards.length,
    readinessBriefRowCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
        .summary.counts.readinessBriefRowCount,
    staticReviewerCueCardCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
        .summary.counts.staticReviewerCueCardCount,
    reviewPathStepCount: new Set(
      synthesisRows.flatMap((row) =>
        row.sourceReadinessResponseTraceCoverageReviewPathStepIds,
      ),
    ).size,
    staticHandoffPromptCardCount: new Set(
      synthesisRows.flatMap((row) => row.matchedStaticHandoffPromptCardIds),
    ).size,
    coverageRowCount: new Set(
      synthesisRows.flatMap((row) =>
        row.sourceReadinessResponseTraceCoverageRowIds,
      ),
    ).size,
    responseTraceRowCount: new Set(
      synthesisRows.flatMap((row) => row.sourceReadinessResponseTraceRowIds),
    ).size,
    responseWalkthroughStepCount: new Set(
      synthesisRows.flatMap((row) =>
        row.sourceReadinessResponseWalkthroughStepIds,
      ),
    ).size,
    responseRowCount: new Set(
      synthesisRows.flatMap((row) => row.sourceReadinessResponseRowIds),
    ).size,
    questionRowCount: new Set(
      synthesisRows.flatMap((row) => row.sourceReadinessQuestionRowIds),
    ).size,
    sourceAnchorCount: new Set(
      synthesisRows.flatMap((row) => row.sourceAnchorTargetIds),
    ).size,
    evidenceCallbackCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane.reviewLaneRows.reduce(
        (count, row) => count + row.evidenceCallbackIds.length,
        0,
      ),
    gapDiscussionPointCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane.reviewLaneRows.reduce(
        (count, row) => count + row.gapDiscussionPointIds.length,
        0,
      ),
    deferredScopeReminderCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane.reviewLaneRows.reduce(
        (count, row) => count + row.deferredScopeReminderIds.length,
        0,
      ),
    localOnlySynthesisRowCount: synthesisRows.filter((row) => row.localOnly)
      .length,
    localOnlyStaticFollowUpNoteCardCount:
      staticFollowUpNoteCards.filter((card) => card.localOnly).length,
  };
}

function staticNonGoalFlags(
  sourceFlags: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneStaticNonGoalFlagsView,
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedSourceReadinessResponseTraceCoverageReadinessReviewSynthesisState:
      true,
    noSavedSynthesisState: true,
    noSavedFollowUpNotes: true,
  };
}

function staticResponseTraceCoverageReadinessReviewSynthesisItemFlags() {
  return {
    localOnly: true,
    sourceBacked: true,
    inPageOnly: true,
    explanatoryOnly: true,
    staticOnly: true,
    informationalOnly: true,
    nonActionable: true,
    nonPersistent: true,
    nonExecutable: true,
    nonRouting: true,
    nonCertifying: true,
    nonRanking: true,
    notATask: true,
    notATicket: true,
    notAChecklist: true,
    notOwnerAssigned: true,
  } as const;
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)];
}
