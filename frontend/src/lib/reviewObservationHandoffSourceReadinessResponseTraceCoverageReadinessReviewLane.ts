import type {
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefRowView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneRowView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneSummaryView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane(
  sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief:
    | ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefView
    | undefined,
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneView | undefined {
  if (
    !sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief
      ?.readinessBriefRows.length
  ) {
    return undefined;
  }

  const reviewLaneRows =
    sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief.readinessBriefRows.map(
      (readinessBriefRow) =>
        buildReviewLaneRow(
          readinessBriefRow,
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief.staticReviewerCueCards,
        ),
    );
  const staticHumanCheckPromptCards =
    sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief.staticReviewerCueCards.map(
      (staticReviewerCueCard) =>
        buildStaticHumanCheckPromptCard(
          staticReviewerCueCard,
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief.readinessBriefRows,
        ),
    );
  const defaultReviewLaneRow =
    reviewLaneRows.find(
      (row) =>
        row.sourceReadinessResponseTraceCoverageReadinessBriefRowId ===
        sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief
          .summary.defaultReadinessBriefContext.defaultReadinessBriefRowId,
    ) ?? reviewLaneRows[0];
  const defaultStaticHumanCheckPromptCard =
    staticHumanCheckPromptCards.find(
      (card) =>
        card.sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId ===
        sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief
          .summary.defaultReadinessBriefContext
          .defaultStaticReviewerCueCardId,
    ) ?? staticHumanCheckPromptCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_source_readiness_response_trace_coverage_readiness_review_lane.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff source readiness response trace coverage readiness review lane and static human-check prompts",
    localStatus:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief.localStatus,
    summary: {
      sourceReadinessResponseTraceCoverageReadinessReviewLaneId:
        "candidate-local-review-observation-handoff-source-readiness-response-trace-coverage-readiness-review-lane",
      label:
        "Local observation handoff source readiness response trace coverage readiness review lane",
      summary:
        "A static readiness review lane derives from Stage 61 readiness brief rows and static reviewer cue cards so reviewers can inspect readiness brief row ids, review path steps, coverage rows, response trace rows, walkthrough steps, response rows, question rows, source anchors, evidence callbacks, gap discussion prompts, deferred-scope reminders, coverage notes, gap notes, handoff prompts, readiness brief text, reviewer cue text, review-lane text, and human-check prompts before human review without saved reviewer answers, saved trace coverage progress, saved coverage review progress, saved readiness brief state, saved review-lane state, saved reviewer cues, saved human-check prompts, saved gap notes, saved handoff prompt edits, saved response progress, saved source readiness progress, saved source inspection state, saved anchor state, saved relay progress, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, owner assignment, or commands.",
      defaultReviewLaneContext: {
        defaultReviewLaneRowId:
          defaultReviewLaneRow
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        defaultReadinessBriefRowId:
          defaultReviewLaneRow
            .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        defaultReviewPathStepId:
          defaultReviewLaneRow
            .sourceReadinessResponseTraceCoverageReviewPathStepId,
        defaultCoverageRowId:
          defaultReviewLaneRow.sourceReadinessResponseTraceCoverageRowId,
        defaultTraceRowId:
          defaultReviewLaneRow.sourceReadinessResponseTraceRowId,
        defaultResponseTraceRowId:
          defaultReviewLaneRow.sourceReadinessResponseTraceRowId,
        defaultStaticHumanCheckPromptCardId:
          defaultStaticHumanCheckPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
        defaultStaticReviewerCueCardId:
          defaultStaticHumanCheckPromptCard
            .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
        defaultStaticHandoffPromptCardId:
          defaultStaticHumanCheckPromptCard
            .sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
        defaultGapNoteCardId:
          defaultStaticHumanCheckPromptCard
            .sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
        sourceReadinessResponseTraceCoverageReadinessBriefSummary:
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief
            .summary.summary,
        sourceReadinessResponseTraceCoverageReadinessBriefDefaultContext:
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief
            .summary.defaultReadinessBriefContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        reviewLaneRows,
        staticHumanCheckPromptCards,
        sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief,
      ),
    },
    defaultReviewLaneRow,
    defaultStaticHumanCheckPromptCard,
    reviewLaneRows,
    staticHumanCheckPromptCards,
    staticSourceReadinessResponseTraceCoverageReadinessReviewLaneSummary:
      "Stage 62 readiness review lane rows and static human-check prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, trace coverage progress, coverage review progress, readiness brief state, review-lane state, reviewer cues, human-check prompts, gap notes, handoff prompt edits, response progress, source readiness progress, source inspection state, anchor state, relay progress, review sessions, reviewer progress, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief,
  };
}

function buildReviewLaneRow(
  readinessBriefRow: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefRowView,
  staticReviewerCueCards: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardView[],
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneRowView {
  const matchedStaticReviewerCueCards = staticReviewerCueCards.filter(
    (card) =>
      card.matchedReviewPathStepIds.includes(
        readinessBriefRow.sourceReadinessResponseTraceCoverageReviewPathStepId,
      ) ||
      card.matchedCoverageRowIds.includes(
        readinessBriefRow.sourceReadinessResponseTraceCoverageRowId,
      ) ||
      readinessBriefRow.matchedStaticHandoffPromptCardIds.includes(
        card.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
      ),
  );

  return {
    sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId: `review-observation-handoff-source-readiness-response-trace-coverage-readiness-review-lane:${readinessBriefRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId}`,
    reviewLaneOrder: readinessBriefRow.readinessBriefOrder,
    label: `${readinessBriefRow.label} review lane`,
    summary:
      `Readiness review lane row ${readinessBriefRow.readinessBriefOrder} preserves Stage 61 readiness brief order for ${readinessBriefRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId}, review path step ${readinessBriefRow.sourceReadinessResponseTraceCoverageReviewPathStepId}, coverage row ${readinessBriefRow.sourceReadinessResponseTraceCoverageRowId}, trace row ${readinessBriefRow.sourceReadinessResponseTraceRowId}, walkthrough step ${readinessBriefRow.sourceReadinessResponseWalkthroughStepId}, response row ${readinessBriefRow.sourceReadinessResponseRowId}, question row ${readinessBriefRow.sourceReadinessQuestionRowId}, ${matchedStaticReviewerCueCards.length} static reviewer cues, ${readinessBriefRow.matchedStaticHandoffPromptCardIds.length} static handoff prompts, ${readinessBriefRow.sourceAnchorTargetIds.length} anchors, ${readinessBriefRow.evidenceCallbackIds.length} callbacks, ${readinessBriefRow.gapDiscussionPointIds.length} gap prompts, and ${readinessBriefRow.deferredScopeReminderIds.length} deferred reminders without saved review-lane state, saved human-check prompts, saved readiness brief state, saved reviewer cues, saved coverage review progress, saved trace coverage progress, saved gap notes, saved handoff prompt edits, saved reviewer answers, routes, exports, signoff, audit state, scores, certification, owner assignment, meetings, packages, task launchers, runnable checklists, or commands.`,
    sourceReadinessResponseTraceCoverageReadinessBriefRowId:
      readinessBriefRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    sourceReadinessResponseTraceCoverageReadinessBriefRowIds: [
      readinessBriefRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    ],
    sourceReadinessResponseTraceCoverageReviewPathStepId:
      readinessBriefRow.sourceReadinessResponseTraceCoverageReviewPathStepId,
    sourceReadinessResponseTraceCoverageReviewPathStepIds:
      readinessBriefRow.sourceReadinessResponseTraceCoverageReviewPathStepIds,
    sourceReadinessResponseTraceCoverageRowId:
      readinessBriefRow.sourceReadinessResponseTraceCoverageRowId,
    sourceReadinessResponseTraceCoverageRowIds:
      readinessBriefRow.sourceReadinessResponseTraceCoverageRowIds,
    sourceReadinessResponseTraceRowId:
      readinessBriefRow.sourceReadinessResponseTraceRowId,
    sourceReadinessResponseTraceRowIds:
      readinessBriefRow.sourceReadinessResponseTraceRowIds,
    sourceReadinessResponseWalkthroughStepId:
      readinessBriefRow.sourceReadinessResponseWalkthroughStepId,
    sourceReadinessResponseWalkthroughStepIds:
      readinessBriefRow.sourceReadinessResponseWalkthroughStepIds,
    sourceReadinessResponseRowId:
      readinessBriefRow.sourceReadinessResponseRowId,
    sourceReadinessResponseRowIds:
      readinessBriefRow.sourceReadinessResponseRowIds,
    sourceReadinessQuestionRowId:
      readinessBriefRow.sourceReadinessQuestionRowId,
    sourceReadinessQuestionRowIds:
      readinessBriefRow.sourceReadinessQuestionRowIds,
    matchedStaticReviewerCueCardIds: matchedStaticReviewerCueCards.map(
      (card) =>
        card.sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
    ),
    matchedStaticHandoffPromptCardIds:
      readinessBriefRow.matchedStaticHandoffPromptCardIds,
    sourceLocalAnchorHrefs: readinessBriefRow.sourceLocalAnchorHrefs,
    sourceAnchorTargetIds: readinessBriefRow.sourceAnchorTargetIds,
    evidenceCallbackIds: readinessBriefRow.evidenceCallbackIds,
    gapDiscussionPointIds: readinessBriefRow.gapDiscussionPointIds,
    deferredScopeReminderIds: readinessBriefRow.deferredScopeReminderIds,
    reviewerCueText: readinessBriefRow.reviewerCueText,
    coverageNoteText: readinessBriefRow.coverageNoteText,
    gapNoteText: readinessBriefRow.gapNoteText,
    handoffPromptText: readinessBriefRow.handoffPromptText,
    readinessBriefText: readinessBriefRow.readinessBriefText,
    reviewLaneText:
      `Review lane for ${readinessBriefRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId}: inspect readiness brief row ${readinessBriefRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId}, review path step ${readinessBriefRow.sourceReadinessResponseTraceCoverageReviewPathStepId}, coverage row ${readinessBriefRow.sourceReadinessResponseTraceCoverageRowId}, static reviewer cues ${matchedStaticReviewerCueCards.map((card) => card.sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId).join(", ") || "none"}, anchors ${readinessBriefRow.sourceAnchorTargetIds.join(", ")}, callbacks ${readinessBriefRow.evidenceCallbackIds.join(", ")}, gap prompts ${readinessBriefRow.gapDiscussionPointIds.join(", ")}, and deferred reminders ${readinessBriefRow.deferredScopeReminderIds.join(", ")} as a static review lane only.`,
    humanCheckPromptText:
      `Human check for ${readinessBriefRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId}: confirm readiness brief order ${readinessBriefRow.readinessBriefOrder}, source anchors ${readinessBriefRow.sourceLocalAnchorHrefs.join(", ")}, coverage note "${readinessBriefRow.coverageNoteText}", gap note "${readinessBriefRow.gapNoteText}", and handoff prompt "${readinessBriefRow.handoffPromptText}" remain static, local, non-saved, non-executable, non-routing, non-ranking, and non-certifying.`,
    staticNonGoalContexts: readinessBriefRow.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(readinessBriefRow.staticNonGoalFlags),
    ...staticResponseTraceCoverageReadinessReviewLaneItemFlags(),
  };
}

function buildStaticHumanCheckPromptCard(
  staticReviewerCueCard: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardView,
  readinessBriefRows: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefRowView[],
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardView {
  const matchedReadinessBriefRows = readinessBriefRows.filter(
    (row) =>
      staticReviewerCueCard.matchedReviewPathStepIds.includes(
        row.sourceReadinessResponseTraceCoverageReviewPathStepId,
      ) ||
      staticReviewerCueCard.matchedCoverageRowIds.includes(
        row.sourceReadinessResponseTraceCoverageRowId,
      ) ||
      row.matchedStaticHandoffPromptCardIds.includes(
        staticReviewerCueCard.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
      ),
  );

  return {
    sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId: `review-observation-handoff-source-readiness-response-trace-coverage-readiness-review-lane:human-check:${staticReviewerCueCard.sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId}`,
    humanCheckPromptOrder: staticReviewerCueCard.reviewerCueOrder,
    sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId:
      staticReviewerCueCard.sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
    sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardIds:
      [
        staticReviewerCueCard.sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
      ],
    sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId:
      staticReviewerCueCard.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
    sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardIds:
      staticReviewerCueCard.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardIds,
    sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId:
      staticReviewerCueCard.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
    sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardIds:
      staticReviewerCueCard.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardIds,
    matchedReadinessBriefRowIds: matchedReadinessBriefRows.map(
      (row) =>
        row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    ),
    matchedReviewPathStepIds: staticReviewerCueCard.matchedReviewPathStepIds,
    matchedCoverageRowIds: staticReviewerCueCard.matchedCoverageRowIds,
    matchedResponseTraceRowIds:
      staticReviewerCueCard.matchedResponseTraceRowIds,
    matchedResponseRowIds: staticReviewerCueCard.matchedResponseRowIds,
    matchedQuestionRowIds: staticReviewerCueCard.matchedQuestionRowIds,
    sourceLocalAnchorHrefs: staticReviewerCueCard.sourceLocalAnchorHrefs,
    sourceAnchorTargetIds: staticReviewerCueCard.sourceAnchorTargetIds,
    localAnchorHref: staticReviewerCueCard.localAnchorHref,
    anchorTargetId: staticReviewerCueCard.anchorTargetId,
    evidenceCallbackIds: staticReviewerCueCard.evidenceCallbackIds,
    gapDiscussionPointIds: staticReviewerCueCard.gapDiscussionPointIds,
    deferredScopeReminderIds: staticReviewerCueCard.deferredScopeReminderIds,
    label: `${staticReviewerCueCard.label} human check`,
    summary:
      `Static human-check prompt ${staticReviewerCueCard.reviewerCueOrder} preserves Stage 61 static reviewer cue order for ${staticReviewerCueCard.sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId} and matched readiness brief rows ${matchedReadinessBriefRows.map((row) => row.sourceReadinessResponseTraceCoverageReadinessBriefRowId).join(", ") || "none"} while remaining local, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying.`,
    cueText: staticReviewerCueCard.cueText,
    handoffPromptText: staticReviewerCueCard.handoffPromptText,
    readinessBriefText: staticReviewerCueCard.readinessBriefText,
    humanCheckPromptText:
      `Human-check prompt for ${staticReviewerCueCard.sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId}: compare matched readiness brief rows ${matchedReadinessBriefRows.map((row) => row.sourceReadinessResponseTraceCoverageReadinessBriefRowId).join(", ") || "none"}, review path steps ${staticReviewerCueCard.matchedReviewPathStepIds.join(", ") || "none"}, coverage rows ${staticReviewerCueCard.matchedCoverageRowIds.join(", ") || "none"}, anchors ${staticReviewerCueCard.sourceAnchorTargetIds.join(", ")}, callbacks ${staticReviewerCueCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticReviewerCueCard.gapDiscussionPointIds.join(", ")}, and deferred reminders ${staticReviewerCueCard.deferredScopeReminderIds.join(", ")} as static manual-review context only.`,
    staticNonGoalFlags: staticNonGoalFlags(
      staticReviewerCueCard.staticNonGoalFlags,
    ),
    ...staticResponseTraceCoverageReadinessReviewLaneItemFlags(),
  };
}

function buildCounts(
  reviewLaneRows: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneRowView[],
  staticHumanCheckPromptCards: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardView[],
  sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefView,
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneSummaryView["counts"] {
  return {
    reviewLaneRowCount: reviewLaneRows.length,
    staticHumanCheckPromptCardCount: staticHumanCheckPromptCards.length,
    readinessBriefRowCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief
        .readinessBriefRows.length,
    staticReviewerCueCardCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief
        .staticReviewerCueCards.length,
    reviewPathStepCount: new Set(
      reviewLaneRows.flatMap((row) =>
        row.sourceReadinessResponseTraceCoverageReviewPathStepIds,
      ),
    ).size,
    staticHandoffPromptCardCount: new Set(
      reviewLaneRows.flatMap((row) => row.matchedStaticHandoffPromptCardIds),
    ).size,
    coverageRowCount: new Set(
      reviewLaneRows.flatMap((row) =>
        row.sourceReadinessResponseTraceCoverageRowIds,
      ),
    ).size,
    responseTraceRowCount: new Set(
      reviewLaneRows.flatMap((row) => row.sourceReadinessResponseTraceRowIds),
    ).size,
    responseWalkthroughStepCount: new Set(
      reviewLaneRows.flatMap((row) =>
        row.sourceReadinessResponseWalkthroughStepIds,
      ),
    ).size,
    responseRowCount: new Set(
      reviewLaneRows.flatMap((row) => row.sourceReadinessResponseRowIds),
    ).size,
    questionRowCount: new Set(
      reviewLaneRows.flatMap((row) => row.sourceReadinessQuestionRowIds),
    ).size,
    sourceAnchorCount: new Set(
      reviewLaneRows.flatMap((row) => row.sourceAnchorTargetIds),
    ).size,
    evidenceCallbackCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief.readinessBriefRows.reduce(
        (count, row) => count + row.evidenceCallbackIds.length,
        0,
      ),
    gapDiscussionPointCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief.readinessBriefRows.reduce(
        (count, row) => count + row.gapDiscussionPointIds.length,
        0,
      ),
    deferredScopeReminderCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief.readinessBriefRows.reduce(
        (count, row) => count + row.deferredScopeReminderIds.length,
        0,
      ),
    localOnlyReviewLaneRowCount: reviewLaneRows.filter((row) => row.localOnly)
      .length,
    localOnlyStaticHumanCheckPromptCardCount:
      staticHumanCheckPromptCards.filter((card) => card.localOnly).length,
  };
}

function staticNonGoalFlags(
  sourceFlags: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBriefStaticNonGoalFlagsView,
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedSourceReadinessResponseTraceCoverageReadinessReviewLaneState: true,
    noSavedReviewLaneState: true,
    noSavedHumanCheckPrompts: true,
  };
}

function staticResponseTraceCoverageReadinessReviewLaneItemFlags() {
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
