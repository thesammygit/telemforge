import type {
  ReviewObservationHandoffFollowUpReadinessBriefRowView,
  ReviewObservationHandoffFollowUpReadinessBriefStaticNonGoalFlagsView,
  ReviewObservationHandoffFollowUpReadinessBriefStaticReviewerPromptCardView,
  ReviewObservationHandoffFollowUpReadinessBriefSummaryView,
  ReviewObservationHandoffFollowUpReadinessBriefView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageSummaryView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffFollowUpReadinessBrief(
  sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage:
    | ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageView
    | undefined,
): ReviewObservationHandoffFollowUpReadinessBriefView | undefined {
  if (
    !sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
      ?.followUpTriageRows.length
  ) {
    return undefined;
  }

  const followUpReadinessBriefRows =
    sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage.followUpTriageRows.map(
      (followUpTriageRow) =>
        buildFollowUpReadinessBriefRow(
          followUpTriageRow,
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage.staticCheckPromptCards,
        ),
    );
  const staticReviewerPromptCards =
    sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage.staticCheckPromptCards.map(
      (staticCheckPromptCard) =>
        buildStaticReviewerPromptCard(
          staticCheckPromptCard,
          followUpReadinessBriefRows,
        ),
    );
  const defaultFollowUpReadinessBriefRow =
    followUpReadinessBriefRows.find(
      (row) =>
        row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId ===
        sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
          .summary.defaultFollowUpTriageContext.defaultFollowUpTriageRowId,
    ) ?? followUpReadinessBriefRows[0];
  const defaultStaticReviewerPromptCard =
    staticReviewerPromptCards.find(
      (card) =>
        card.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId ===
        sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
          .summary.defaultFollowUpTriageContext.defaultStaticCheckPromptCardId,
    ) ?? staticReviewerPromptCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_follow_up_readiness_brief.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff follow-up readiness brief and static reviewer prompts",
    localStatus:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage.localStatus,
    summary: {
      followUpReadinessBriefId:
        "candidate-local-review-observation-handoff-follow-up-readiness-brief",
      label:
        "Local observation handoff follow-up readiness brief",
      summary:
        "A static follow-up readiness brief derives from Stage 64 follow-up triage rows and static check prompt cards so reviewers can inspect triage rows, source synthesis row ids, review-lane row ids, readiness brief row ids, review path step ids, coverage rows, response trace rows, walkthrough steps, response rows, question rows, static reviewer cue ids, static human-check prompt ids, static handoff prompt ids, static follow-up note ids, static check prompt ids, local anchors, evidence callbacks, gap discussion prompts, deferred-scope reminders, coverage notes, gap notes, handoff prompts, readiness brief text, review-lane text, human-check prompt text, follow-up note text, static check prompt text, and static reviewer prompt text before human review without saved reviewer answers, saved follow-up readiness brief state, saved brief rows, saved static reviewer prompts, saved triage state, saved prompt state, saved notes, saved gap notes, saved handoff prompt edits, saved source readiness progress, saved source inspection state, saved anchor state, saved relay progress, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, owner assignment, or commands.",
      defaultFollowUpReadinessBriefContext: {
        defaultFollowUpReadinessBriefRowId:
          defaultFollowUpReadinessBriefRow.followUpReadinessBriefRowId,
        defaultFollowUpTriageRowId:
          defaultFollowUpReadinessBriefRow
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        defaultSynthesisRowId:
          defaultFollowUpReadinessBriefRow
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
        defaultReviewLaneRowId:
          defaultFollowUpReadinessBriefRow
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        defaultReadinessBriefRowId:
          defaultFollowUpReadinessBriefRow
            .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        defaultReviewPathStepId:
          defaultFollowUpReadinessBriefRow
            .sourceReadinessResponseTraceCoverageReviewPathStepId,
        defaultCoverageRowId:
          defaultFollowUpReadinessBriefRow.sourceReadinessResponseTraceCoverageRowId,
        defaultTraceRowId:
          defaultFollowUpReadinessBriefRow.sourceReadinessResponseTraceRowId,
        defaultStaticReviewerPromptCardId:
          defaultStaticReviewerPromptCard.followUpReadinessBriefStaticReviewerPromptCardId,
        defaultStaticCheckPromptCardId:
          defaultStaticReviewerPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
        defaultStaticFollowUpNoteCardId:
          defaultStaticReviewerPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
        defaultStaticHumanCheckPromptCardId:
          defaultStaticReviewerPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
        defaultStaticReviewerCueCardId:
          defaultStaticReviewerPromptCard
            .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
        defaultStaticHandoffPromptCardId:
          defaultStaticReviewerPromptCard
            .sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
        sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageSummary:
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
            .summary.summary,
        sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageDefaultContext:
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
            .summary.defaultFollowUpTriageContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        followUpReadinessBriefRows,
        staticReviewerPromptCards,
        sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage,
      ),
    },
    defaultFollowUpReadinessBriefRow,
    defaultStaticReviewerPromptCard,
    followUpReadinessBriefRows,
    staticReviewerPromptCards,
    staticSourceFollowUpReadinessBriefSummary:
      "Stage 65 follow-up readiness brief rows and static reviewer prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, saved follow-up readiness brief state, saved brief rows, saved static reviewer prompts, saved triage state, saved prompt state, saved notes, saved gap notes, saved handoff prompt edits, saved source readiness progress, saved source inspection state, saved anchor state, saved relay progress, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage,
  };
}

function buildFollowUpReadinessBriefRow(
  followUpTriageRow: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowView,
  staticCheckPromptCards: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardView[],
): ReviewObservationHandoffFollowUpReadinessBriefRowView {
  const matchedStaticCheckPromptCards = staticCheckPromptCards.filter((card) =>
    staticCheckPromptCardMatchesFollowUpTriageRow(card, followUpTriageRow),
  );
  const matchedStaticCheckPromptCardIds = matchedStaticCheckPromptCards.map(
    (card) =>
      card.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
  );

  return {
    ...followUpTriageRow,
    followUpReadinessBriefRowId: `review-observation-handoff-follow-up-readiness-brief:${followUpTriageRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}`,
    followUpReadinessBriefRowOrder: followUpTriageRow.followUpTriageRowOrder,
    summary:
      `Follow-up readiness brief row ${followUpTriageRow.followUpTriageRowOrder} preserves Stage 64 follow-up triage order for ${followUpTriageRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, synthesis row ${followUpTriageRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId}, review-lane row ${followUpTriageRow.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId}, readiness brief row ${followUpTriageRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId}, review path step ${followUpTriageRow.sourceReadinessResponseTraceCoverageReviewPathStepId}, coverage row ${followUpTriageRow.sourceReadinessResponseTraceCoverageRowId}, trace row ${followUpTriageRow.sourceReadinessResponseTraceRowId}, walkthrough step ${followUpTriageRow.sourceReadinessResponseWalkthroughStepId}, response row ${followUpTriageRow.sourceReadinessResponseRowId}, question row ${followUpTriageRow.sourceReadinessQuestionRowId}, ${followUpTriageRow.matchedStaticReviewerCueCardIds.length} static reviewer cues, ${followUpTriageRow.matchedStaticHumanCheckPromptCardIds.length} static human checks, ${followUpTriageRow.matchedStaticHandoffPromptCardIds.length} static handoff prompts, ${followUpTriageRow.matchedStaticFollowUpNoteCardIds.length} static follow-up notes, ${matchedStaticCheckPromptCardIds.length} static check prompts, ${followUpTriageRow.sourceLocalAnchorHrefs.length} anchors, ${followUpTriageRow.evidenceCallbackIds.length} callbacks, ${followUpTriageRow.gapDiscussionPointIds.length} gap prompts, and ${followUpTriageRow.deferredScopeReminderIds.length} deferred reminders without saved follow-up readiness brief state, saved brief rows, saved static reviewer prompts, saved triage state, saved prompt state, saved notes, saved gap notes, saved handoff prompt edits, saved reviewer answers, routes, exports, signoff, audit state, scores, certification, owner assignment, meetings, packages, task launchers, runnable checklists, or commands.`,
    matchedStaticCheckPromptCardIds,
    staticReviewerPromptText:
      `Static reviewer prompt for ${followUpTriageRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}: compare Stage 64 static check prompt cards ${matchedStaticCheckPromptCardIds.join(", ") || "none"}, review-lane text, human-check prompt text, follow-up note text, anchors ${followUpTriageRow.sourceLocalAnchorHrefs.join(", ")}, callbacks ${followUpTriageRow.evidenceCallbackIds.join(", ")}, gap prompts ${followUpTriageRow.gapDiscussionPointIds.join(", ")}, and deferred reminders ${followUpTriageRow.deferredScopeReminderIds.join(", ")} as local manual-review context only.`,
    staticNonGoalFlags: staticNonGoalFlags(followUpTriageRow.staticNonGoalFlags),
  };
}

function buildStaticReviewerPromptCard(
  staticCheckPromptCard: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardView,
  followUpReadinessBriefRows: ReviewObservationHandoffFollowUpReadinessBriefRowView[],
): ReviewObservationHandoffFollowUpReadinessBriefStaticReviewerPromptCardView {
  const cardId =
    staticCheckPromptCard.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId;
  const followUpReadinessBriefStaticReviewerPromptCardId = `review-observation-handoff-follow-up-readiness-brief:static-reviewer-prompt:${cardId}`;
  const matchedFollowUpReadinessBriefRows = followUpReadinessBriefRows.filter(
    (row) =>
      row.matchedStaticCheckPromptCardIds.includes(cardId) ||
      staticCheckPromptCard.matchedSynthesisRowIds.includes(
        row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
      ) ||
      staticCheckPromptCard.matchedReviewLaneRowIds.includes(
        row.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
      ) ||
      staticCheckPromptCard.matchedReadinessBriefRowIds.includes(
        row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
      ) ||
      staticCheckPromptCard.matchedReviewPathStepIds.includes(
        row.sourceReadinessResponseTraceCoverageReviewPathStepId,
      ) ||
      staticCheckPromptCard.matchedCoverageRowIds.includes(
        row.sourceReadinessResponseTraceCoverageRowId,
      ) ||
      staticCheckPromptCard.matchedResponseTraceRowIds.includes(
        row.sourceReadinessResponseTraceRowId,
      ) ||
      staticCheckPromptCard.matchedResponseRowIds.includes(
        row.sourceReadinessResponseRowId,
      ) ||
      staticCheckPromptCard.matchedQuestionRowIds.includes(
        row.sourceReadinessQuestionRowId,
      ),
  );

  return {
    ...staticCheckPromptCard,
    followUpReadinessBriefStaticReviewerPromptCardId,
    followUpReadinessBriefStaticReviewerPromptCardIds: [
      followUpReadinessBriefStaticReviewerPromptCardId,
    ],
    staticReviewerPromptOrder: staticCheckPromptCard.staticCheckPromptOrder,
    matchedFollowUpReadinessBriefRowIds: matchedFollowUpReadinessBriefRows.map(
      (row) => row.followUpReadinessBriefRowId,
    ),
    staticReviewerPromptText:
      `Static reviewer prompt card ${followUpReadinessBriefStaticReviewerPromptCardId}: inspect matched follow-up readiness brief rows ${matchedFollowUpReadinessBriefRows.map((row) => row.followUpReadinessBriefRowId).join(", ") || "none"}, follow-up triage rows ${matchedFollowUpReadinessBriefRows.map((row) => row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId).join(", ") || "none"}, anchors ${staticCheckPromptCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticCheckPromptCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticCheckPromptCard.gapDiscussionPointIds.join(", ")}, and deferred reminders ${staticCheckPromptCard.deferredScopeReminderIds.join(", ")} as local manual-review context only.`,
    staticNonGoalFlags: staticNonGoalFlags(staticCheckPromptCard.staticNonGoalFlags),
  };
}

function buildCounts(
  followUpReadinessBriefRows: ReviewObservationHandoffFollowUpReadinessBriefRowView[],
  staticReviewerPromptCards: ReviewObservationHandoffFollowUpReadinessBriefStaticReviewerPromptCardView[],
  sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageView,
): ReviewObservationHandoffFollowUpReadinessBriefSummaryView["counts"] {
  return {
    followUpReadinessBriefRowCount: followUpReadinessBriefRows.length,
    staticReviewerPromptCardCount: staticReviewerPromptCards.length,
    followUpTriageRowCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
        .followUpTriageRows.length,
    staticCheckPromptCardCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
        .staticCheckPromptCards.length,
    synthesisRowCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
        .sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .synthesisRows.length,
    staticFollowUpNoteCardCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
        .sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .staticFollowUpNoteCards.length,
    reviewLaneRowCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
        .sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
        .reviewLaneRows.length,
    staticHumanCheckPromptCardCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
        .sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
        .staticHumanCheckPromptCards.length,
    readinessBriefRowCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
        .sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
        .sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief
        .readinessBriefRows.length,
    staticReviewerCueCardCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
        .sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
        .sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief
        .staticReviewerCueCards.length,
    reviewPathStepCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
        .sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
        .sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief
        .sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath
        .reviewPathSteps.length,
    staticHandoffPromptCardCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
        .sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
        .sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief
        .sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath
        .staticHandoffPromptCards.length,
    coverageRowCount: new Set(
      followUpReadinessBriefRows.flatMap((row) =>
        row.sourceReadinessResponseTraceCoverageRowIds,
      ),
    ).size,
    responseTraceRowCount: new Set(
      followUpReadinessBriefRows.flatMap((row) => row.sourceReadinessResponseTraceRowIds),
    ).size,
    responseWalkthroughStepCount: new Set(
      followUpReadinessBriefRows.flatMap((row) =>
        row.sourceReadinessResponseWalkthroughStepIds,
      ),
    ).size,
    responseRowCount: new Set(
      followUpReadinessBriefRows.flatMap((row) => row.sourceReadinessResponseRowIds),
    ).size,
    questionRowCount: new Set(
      followUpReadinessBriefRows.flatMap((row) => row.sourceReadinessQuestionRowIds),
    ).size,
    sourceAnchorCount: new Set(
      followUpReadinessBriefRows.flatMap((row) => row.sourceAnchorTargetIds),
    ).size,
    evidenceCallbackCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
        .followUpTriageRows.reduce(
          (count, row) => count + row.evidenceCallbackIds.length,
          0,
        ),
    gapDiscussionPointCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
        .followUpTriageRows.reduce(
          (count, row) => count + row.gapDiscussionPointIds.length,
          0,
        ),
    deferredScopeReminderCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
        .followUpTriageRows.reduce(
          (count, row) => count + row.deferredScopeReminderIds.length,
          0,
        ),
    localOnlyFollowUpReadinessBriefRowCount: followUpReadinessBriefRows.filter(
      (row) => row.localOnly,
    ).length,
    localOnlyStaticReviewerPromptCardCount: staticReviewerPromptCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function staticNonGoalFlags(
  sourceFlags: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticNonGoalFlagsView,
): ReviewObservationHandoffFollowUpReadinessBriefStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedFollowUpReadinessBriefState: true,
    noSavedFollowUpReadinessBriefRows: true,
    noSavedBriefState: true,
    noSavedStaticReviewerPrompts: true,
    noSavedStaticReviewerPromptCards: true,
    noSavedStaticReviewerPromptState: true,
    noSavedPromptState: true,
  };
}

function staticCheckPromptCardMatchesFollowUpTriageRow(
  staticCheckPromptCard: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardView,
  followUpTriageRow: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowView,
): boolean {
  return (
    staticCheckPromptCard.matchedFollowUpTriageRowIds.includes(
      followUpTriageRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
    ) ||
    staticCheckPromptCard.matchedSynthesisRowIds.includes(
      followUpTriageRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
    ) ||
    staticCheckPromptCard.matchedReviewLaneRowIds.includes(
      followUpTriageRow.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
    ) ||
    staticCheckPromptCard.matchedReadinessBriefRowIds.includes(
      followUpTriageRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    ) ||
    staticCheckPromptCard.matchedReviewPathStepIds.includes(
      followUpTriageRow.sourceReadinessResponseTraceCoverageReviewPathStepId,
    ) ||
    staticCheckPromptCard.matchedCoverageRowIds.includes(
      followUpTriageRow.sourceReadinessResponseTraceCoverageRowId,
    ) ||
    staticCheckPromptCard.matchedResponseTraceRowIds.includes(
      followUpTriageRow.sourceReadinessResponseTraceRowId,
    ) ||
    staticCheckPromptCard.matchedResponseWalkthroughStepIds.includes(
      followUpTriageRow.sourceReadinessResponseWalkthroughStepId,
    ) ||
    staticCheckPromptCard.matchedResponseRowIds.includes(
      followUpTriageRow.sourceReadinessResponseRowId,
    ) ||
    staticCheckPromptCard.matchedQuestionRowIds.includes(
      followUpTriageRow.sourceReadinessQuestionRowId,
    )
  );
}
