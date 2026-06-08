import type {
  ConstraintResponseRevisionFollowUpReadinessBoardRowView as Stage96Row,
  ConstraintResponseRevisionFollowUpReadinessBoardStaticNonGoalFlagsView as Stage96StaticNonGoalFlags,
  ConstraintResponseRevisionFollowUpReadinessBoardStaticResponseCheckCardView as Stage96StaticResponseCheckCard,
  ConstraintResponseRevisionFollowUpReadinessBoardView as Stage96View,
  ConstraintResponseRevisionFollowUpReadinessReviewPathStaticNonGoalFlagsView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathStaticResponsePromptCardView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathStepView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathSummaryView,
  ConstraintResponseRevisionFollowUpReadinessReviewPathView,
} from "../features/mission-console/types.ts";

export function buildConstraintResponseRevisionFollowUpReadinessReviewPath(
  revisionFollowUpReadinessBoard: Stage96View | undefined,
): ConstraintResponseRevisionFollowUpReadinessReviewPathView | undefined {
  if (
    !revisionFollowUpReadinessBoard?.revisionFollowUpReadinessRows.length ||
    !revisionFollowUpReadinessBoard.staticResponseCheckCards.length
  ) {
    return undefined;
  }

  const revisionFollowUpReadinessReviewPathSteps =
    revisionFollowUpReadinessBoard.revisionFollowUpReadinessRows.map((row) =>
      buildRevisionFollowUpReadinessReviewPathStep(
        row,
        revisionFollowUpReadinessBoard.staticResponseCheckCards,
      ),
    );
  const staticResponsePromptCards =
    revisionFollowUpReadinessBoard.staticResponseCheckCards.map((card) =>
      buildStaticResponsePromptCard(
        card,
        revisionFollowUpReadinessBoard.revisionFollowUpReadinessRows,
      ),
    );
  const defaultRevisionFollowUpReadinessReviewPathStep =
    revisionFollowUpReadinessReviewPathSteps.find(
      (step) =>
        step.sourceRevisionFollowUpReadinessRowId ===
        revisionFollowUpReadinessBoard.defaultRevisionFollowUpReadinessRow
          .revisionFollowUpReadinessRowId,
    ) ?? revisionFollowUpReadinessReviewPathSteps[0];
  const defaultStaticResponsePromptCard =
    staticResponsePromptCards.find(
      (card) =>
        card.sourceStaticResponseCheckCardId ===
        revisionFollowUpReadinessBoard.defaultStaticResponseCheckCard
          .staticResponseCheckCardId,
    ) ?? staticResponsePromptCards[0];
  const defaultStage96Context =
    revisionFollowUpReadinessBoard.summary
      .defaultRevisionFollowUpReadinessContext;

  return {
    schema:
      "telemforge.constraint_response_revision_follow_up_readiness_review_path.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response revision follow-up readiness review path and static response prompts",
    localStatus: revisionFollowUpReadinessBoard.localStatus,
    summary: {
      constraintResponseRevisionFollowUpReadinessReviewPathId:
        "candidate-local-constraint-response-revision-follow-up-readiness-review-path",
      label: "Local constraint-response revision follow-up readiness review path",
      summary:
        "A static revision follow-up readiness review path derives steps from Stage 96 readiness rows and static response-prompt cards from Stage 96 static response-check cards so reviewers can walk each readiness row to the next manual response prompt before editing outside the app without saved answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, revision follow-up readiness selections, response-check selections, response-prompt selections, review-path state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultRevisionFollowUpReadinessReviewPathContext: {
        defaultRevisionFollowUpReadinessReviewPathStepId:
          defaultRevisionFollowUpReadinessReviewPathStep
            .revisionFollowUpReadinessReviewPathStepId,
        defaultStaticResponsePromptCardId:
          defaultStaticResponsePromptCard.staticResponsePromptCardId,
        defaultRevisionFollowUpReadinessRowId:
          defaultRevisionFollowUpReadinessReviewPathStep
            .sourceRevisionFollowUpReadinessRowId,
        defaultStaticResponseCheckCardId:
          defaultStaticResponsePromptCard.sourceStaticResponseCheckCardId,
        defaultRevisionCoverageReviewPathStepId:
          defaultRevisionFollowUpReadinessReviewPathStep
            .sourceRevisionCoverageReviewPathStepId,
        defaultStaticRevisionFollowUpPromptCardId:
          defaultStaticResponsePromptCard
            .sourceStaticRevisionFollowUpPromptCardId,
        defaultRevisionCoverageRowId:
          defaultRevisionFollowUpReadinessReviewPathStep
            .sourceRevisionCoverageRowId,
        defaultStaticRevisionCheckCardId:
          defaultStaticResponsePromptCard.sourceStaticRevisionCheckCardId,
        defaultResponseReadinessReviewPathStepId:
          defaultRevisionFollowUpReadinessReviewPathStep
            .sourceResponseReadinessReviewPathStepId,
        defaultStaticRevisionPromptCardId:
          defaultStaticResponsePromptCard.sourceStaticRevisionPromptCardId,
        defaultResponseReadinessRowId:
          defaultRevisionFollowUpReadinessReviewPathStep
            .sourceResponseReadinessRowId,
        defaultStaticDraftCheckCardId:
          defaultStaticResponsePromptCard.sourceStaticDraftCheckCardId,
        defaultCoverageReviewPathStepId:
          defaultRevisionFollowUpReadinessReviewPathStep
            .sourceCoverageReviewPathStepId,
        defaultStaticResponseCueCardId:
          defaultStaticResponsePromptCard.sourceStaticResponseCueCardId,
        defaultCoverageRowId:
          defaultRevisionFollowUpReadinessReviewPathStep.sourceCoverageRowId,
        defaultStaticReviewPromptCardId:
          defaultStaticResponsePromptCard.sourceStaticReviewPromptCardId,
        defaultFollowUpReviewPathStepId:
          defaultRevisionFollowUpReadinessReviewPathStep
            .sourceFollowUpReviewPathStepId,
        defaultStaticReadinessCueCardId:
          defaultStaticResponsePromptCard.sourceStaticReadinessCueCardId,
        defaultEvidenceGapReadinessRowId:
          defaultRevisionFollowUpReadinessReviewPathStep
            .sourceEvidenceGapReadinessRowId,
        defaultStaticFollowUpPromptCardId:
          defaultStaticResponsePromptCard.sourceStaticFollowUpPromptCardId,
        defaultEvidenceCheckReviewPathStepId:
          defaultRevisionFollowUpReadinessReviewPathStep
            .sourceEvidenceCheckReviewPathStepId,
        defaultStaticCitationGapCueCardId:
          defaultStaticResponsePromptCard.sourceStaticCitationGapCueCardId,
        defaultStaticEvidenceCheckPromptCardId:
          defaultRevisionFollowUpReadinessReviewPathStep
            .sourceStaticEvidenceCheckPromptCardId,
        defaultCitationReviewLaneRowId:
          defaultStaticResponsePromptCard.sourceCitationReviewLaneRowId,
        defaultStaticCitationCheckPromptCardId:
          defaultStaticResponsePromptCard.sourceStaticCitationCheckPromptCardId,
        defaultSourceFollowUpMapEntryId:
          defaultRevisionFollowUpReadinessReviewPathStep
            .sourceSourceFollowUpMapEntryId,
        sourceStage96RevisionFollowUpReadinessBoardSummary:
          revisionFollowUpReadinessBoard.summary.summary,
        sourceStage96DefaultRevisionFollowUpReadinessContext:
          defaultStage96Context,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        revisionFollowUpReadinessReviewPathSteps,
        staticResponsePromptCards,
        revisionFollowUpReadinessBoard,
      ),
    },
    defaultRevisionFollowUpReadinessReviewPathStep,
    defaultStaticResponsePromptCard,
    revisionFollowUpReadinessReviewPathSteps,
    staticResponsePromptCards,
    staticRevisionFollowUpReadinessReviewPathBoundarySummary:
      "Stage 97 revision follow-up readiness review-path steps and static response-prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, revision follow-up readiness selections, response-check selections, response-prompt selections, review-path state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseRevisionFollowUpReadinessBoard:
      revisionFollowUpReadinessBoard,
  };
}

function buildRevisionFollowUpReadinessReviewPathStep(
  revisionFollowUpReadinessRow: Stage96Row,
  staticResponseCheckCards: Stage96StaticResponseCheckCard[],
): ConstraintResponseRevisionFollowUpReadinessReviewPathStepView {
  const sourceRevisionFollowUpReadinessRowId =
    revisionFollowUpReadinessRow.revisionFollowUpReadinessRowId;
  const matchedStaticResponseCheckCards = staticResponseCheckCards.filter(
    (card) =>
      rowMatchesStaticResponsePromptCard(revisionFollowUpReadinessRow, card),
  );
  const sourceStaticResponseCheckCardIds = matchedStaticResponseCheckCards.map(
    (card) => card.staticResponseCheckCardId,
  );
  const revisionFollowUpReadinessReviewPathLabels =
    buildStepRevisionFollowUpReadinessReviewPathLabels(
      revisionFollowUpReadinessRow,
      matchedStaticResponseCheckCards,
    );
  const staticResponsePromptLabels = buildStepStaticResponsePromptLabels(
    revisionFollowUpReadinessRow,
    matchedStaticResponseCheckCards,
  );
  const revisionFollowUpReadinessReviewPathStepId =
    `constraint-response-revision-follow-up-readiness-review-path:step:${sourceRevisionFollowUpReadinessRowId}`;

  return {
    ...revisionFollowUpReadinessRow,
    revisionFollowUpReadinessReviewPathStepId,
    revisionFollowUpReadinessReviewPathStepIds: [
      revisionFollowUpReadinessReviewPathStepId,
    ],
    revisionFollowUpReadinessReviewPathStepOrder:
      revisionFollowUpReadinessRow.revisionFollowUpReadinessRowOrder,
    sourceRevisionFollowUpReadinessRowId,
    sourceRevisionFollowUpReadinessRowIds: [
      sourceRevisionFollowUpReadinessRowId,
    ],
    sourceStaticResponseCheckCardIds,
    revisionFollowUpReadinessReviewPathLabels,
    staticResponsePromptLabels,
    revisionFollowUpReadinessReviewPathText:
      `Revision follow-up readiness review-path step ${sourceRevisionFollowUpReadinessRowId}: carry Stage 96 revision follow-up readiness row ${sourceRevisionFollowUpReadinessRowId}, Stage 96 static response-check cards ${joinOrNone(sourceStaticResponseCheckCardIds)}, Stage 95 revision coverage review-path step ${revisionFollowUpReadinessRow.sourceRevisionCoverageReviewPathStepId}, Stage 95 static revision follow-up prompt cards ${joinOrNone(revisionFollowUpReadinessRow.sourceStaticRevisionFollowUpPromptCardIds)}, Stage 94 revision coverage row ${revisionFollowUpReadinessRow.sourceRevisionCoverageRowId}, Stage 94 static revision-check cards ${joinOrNone(revisionFollowUpReadinessRow.sourceStaticRevisionCheckCardIds)}, Stage 93 response-readiness review-path step ${revisionFollowUpReadinessRow.sourceResponseReadinessReviewPathStepId}, Stage 93 static revision-prompt cards ${joinOrNone(revisionFollowUpReadinessRow.sourceStaticRevisionPromptCardIds)}, Stage 92 response-readiness row ${revisionFollowUpReadinessRow.sourceResponseReadinessRowId}, Stage 92 static draft-check cards ${joinOrNone(revisionFollowUpReadinessRow.sourceStaticDraftCheckCardIds)}, Stage 91 coverage-review path step ${revisionFollowUpReadinessRow.sourceCoverageReviewPathStepId}, Stage 91 static response cue cards ${joinOrNone(revisionFollowUpReadinessRow.sourceStaticResponseCueCardIds)}, Stage 90 coverage row ${revisionFollowUpReadinessRow.sourceCoverageRowId}, Stage 90 static review prompt cards ${joinOrNone(revisionFollowUpReadinessRow.sourceStaticReviewPromptCardIds)}, Stage 89 follow-up review path step ${revisionFollowUpReadinessRow.sourceFollowUpReviewPathStepId}, Stage 89 static readiness cue cards ${joinOrNone(revisionFollowUpReadinessRow.sourceStaticReadinessCueCardIds)}, Stage 88 readiness row ${revisionFollowUpReadinessRow.sourceEvidenceGapReadinessRowId}, Stage 88 static follow-up prompt cards ${joinOrNone(revisionFollowUpReadinessRow.sourceStaticFollowUpPromptCardIds)}, Stage 87 evidence-check review path step ${revisionFollowUpReadinessRow.sourceEvidenceCheckReviewPathStepId}, Stage 87 citation-gap cue cards ${joinOrNone(revisionFollowUpReadinessRow.sourceStaticCitationGapCueCardIds)}, Stage 86 evidence-check prompt card ${revisionFollowUpReadinessRow.sourceStaticEvidenceCheckPromptCardId}, Stage 86 citation-review lane rows ${joinOrNone(revisionFollowUpReadinessRow.sourceCitationReviewLaneRowIds)}, Stage 85 source follow-up map entry ${revisionFollowUpReadinessRow.sourceSourceFollowUpMapEntryId}, Stage 85 citation prompt cards ${joinOrNone(revisionFollowUpReadinessRow.sourceStaticCitationCheckPromptCardIds)}, anchors ${joinOrNone(revisionFollowUpReadinessRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(revisionFollowUpReadinessRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(revisionFollowUpReadinessRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(revisionFollowUpReadinessRow.deferredScopeReminderIds)}, review-path labels ${joinOrNone(revisionFollowUpReadinessReviewPathLabels)}, response-prompt labels ${joinOrNone(staticResponsePromptLabels)}, Stage 96 readiness text "${revisionFollowUpReadinessRow.revisionFollowUpReadinessText}", and Stage 96 static response-check text "${revisionFollowUpReadinessRow.staticResponseCheckText}" as deterministic manual revision follow-up readiness review-path context only.`,
    staticResponsePromptText:
      `Static response-prompt context for review-path step ${sourceRevisionFollowUpReadinessRowId}: inspect Stage 96 readiness row ${sourceRevisionFollowUpReadinessRowId}, Stage 96 static response-check cards ${joinOrNone(sourceStaticResponseCheckCardIds)}, Stage 95 revision coverage review-path step ${revisionFollowUpReadinessRow.sourceRevisionCoverageReviewPathStepId}, Stage 95 static revision follow-up prompt cards ${joinOrNone(revisionFollowUpReadinessRow.sourceStaticRevisionFollowUpPromptCardIds)}, Stage 94 revision coverage row ${revisionFollowUpReadinessRow.sourceRevisionCoverageRowId}, Stage 93 response-readiness review-path step ${revisionFollowUpReadinessRow.sourceResponseReadinessReviewPathStepId}, anchors ${joinOrNone(revisionFollowUpReadinessRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(revisionFollowUpReadinessRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(revisionFollowUpReadinessRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(revisionFollowUpReadinessRow.deferredScopeReminderIds)}, and Stage 96 labels ${joinOrNone([...revisionFollowUpReadinessRow.revisionFollowUpReadinessLabels, ...revisionFollowUpReadinessRow.staticResponseCheckLabels])} before editing outside the app without saved reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, revision follow-up readiness selections, response-check selections, response-prompt selections, review-path state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static revision follow-up readiness review-path context: manual Stage 96 readiness row, static response-check, source-lineage, anchor, callback, gap-prompt, deferred-reminder, and response-prompt comparison only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved revision follow-up readiness selections, saved response-check selections, saved response-prompt selections, saved review-path state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      revisionFollowUpReadinessRow.staticNonGoalFlags,
    ),
  };
}

function buildStaticResponsePromptCard(
  staticResponseCheckCard: Stage96StaticResponseCheckCard,
  revisionFollowUpReadinessRows: Stage96Row[],
): ConstraintResponseRevisionFollowUpReadinessReviewPathStaticResponsePromptCardView {
  const sourceStaticResponseCheckCardId =
    staticResponseCheckCard.staticResponseCheckCardId;
  const matchedRevisionFollowUpReadinessRows =
    revisionFollowUpReadinessRows.filter((row) =>
      rowMatchesStaticResponsePromptCard(row, staticResponseCheckCard),
    );
  const sourceRevisionFollowUpReadinessRowIds =
    matchedRevisionFollowUpReadinessRows.map(
      (row) => row.revisionFollowUpReadinessRowId,
    );
  const revisionFollowUpReadinessReviewPathLabels =
    buildCardRevisionFollowUpReadinessReviewPathLabels(
      staticResponseCheckCard,
      matchedRevisionFollowUpReadinessRows,
    );
  const staticResponsePromptLabels = buildCardStaticResponsePromptLabels(
    staticResponseCheckCard,
    matchedRevisionFollowUpReadinessRows,
  );
  const staticResponsePromptCardId =
    `constraint-response-revision-follow-up-readiness-review-path:static-response-prompt:${sourceStaticResponseCheckCardId}`;

  return {
    ...staticResponseCheckCard,
    staticResponsePromptCardId,
    staticResponsePromptCardIds: [staticResponsePromptCardId],
    staticResponsePromptOrder: staticResponseCheckCard.staticResponseCheckOrder,
    sourceStaticResponseCheckCardId,
    sourceStaticResponseCheckCardIds: [sourceStaticResponseCheckCardId],
    sourceRevisionFollowUpReadinessRowIds,
    revisionFollowUpReadinessReviewPathLabels,
    staticResponsePromptLabels,
    revisionFollowUpReadinessReviewPathText:
      `Revision follow-up readiness review-path card ${sourceStaticResponseCheckCardId}: carry Stage 96 static response-check card ${sourceStaticResponseCheckCardId}, Stage 96 readiness rows ${joinOrNone(sourceRevisionFollowUpReadinessRowIds)}, Stage 95 static revision follow-up prompt card ${staticResponseCheckCard.sourceStaticRevisionFollowUpPromptCardId}, Stage 95 revision coverage review-path steps ${joinOrNone(staticResponseCheckCard.sourceRevisionCoverageReviewPathStepIds)}, Stage 94 static revision-check card ${staticResponseCheckCard.sourceStaticRevisionCheckCardId}, Stage 93 static revision-prompt card ${staticResponseCheckCard.sourceStaticRevisionPromptCardId}, Stage 92 static draft-check card ${staticResponseCheckCard.sourceStaticDraftCheckCardId}, anchors ${joinOrNone(staticResponseCheckCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticResponseCheckCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticResponseCheckCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticResponseCheckCard.deferredScopeReminderIds)}, review-path labels ${joinOrNone(revisionFollowUpReadinessReviewPathLabels)}, response-prompt labels ${joinOrNone(staticResponsePromptLabels)}, Stage 96 readiness text "${staticResponseCheckCard.revisionFollowUpReadinessText}", and Stage 96 static response-check text "${staticResponseCheckCard.staticResponseCheckText}" as deterministic manual response-prompt context only.`,
    staticResponsePromptText:
      `Static response-prompt card ${sourceStaticResponseCheckCardId}: inspect Stage 96 static response-check card ${sourceStaticResponseCheckCardId}, Stage 96 readiness rows ${joinOrNone(sourceRevisionFollowUpReadinessRowIds)}, Stage 95 static revision follow-up prompt card ${staticResponseCheckCard.sourceStaticRevisionFollowUpPromptCardId}, Stage 95 revision coverage review-path steps ${joinOrNone(staticResponseCheckCard.sourceRevisionCoverageReviewPathStepIds)}, Stage 94 static revision-check card ${staticResponseCheckCard.sourceStaticRevisionCheckCardId}, Stage 94 revision coverage rows ${joinOrNone(staticResponseCheckCard.sourceRevisionCoverageRowIds)}, Stage 93 static revision-prompt card ${staticResponseCheckCard.sourceStaticRevisionPromptCardId}, Stage 92 static draft-check card ${staticResponseCheckCard.sourceStaticDraftCheckCardId}, Stage 91 static response cue card ${staticResponseCheckCard.sourceStaticResponseCueCardId}, Stage 90 static review prompt card ${staticResponseCheckCard.sourceStaticReviewPromptCardId}, Stage 89 static readiness cue ${staticResponseCheckCard.sourceStaticReadinessCueCardId}, Stage 88 static follow-up prompt card ${staticResponseCheckCard.sourceStaticFollowUpPromptCardId}, Stage 87 citation-gap cue ${staticResponseCheckCard.sourceStaticCitationGapCueCardId}, Stage 86 citation-review lane row ${staticResponseCheckCard.sourceCitationReviewLaneRowId}, Stage 85 citation prompt card ${staticResponseCheckCard.sourceStaticCitationCheckPromptCardId}, anchors ${joinOrNone(staticResponseCheckCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticResponseCheckCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticResponseCheckCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticResponseCheckCard.deferredScopeReminderIds)}, and Stage 96 labels ${joinOrNone([...staticResponseCheckCard.revisionFollowUpReadinessLabels, ...staticResponseCheckCard.staticResponseCheckLabels])} before editing outside the app without saved reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, revision follow-up readiness selections, response-check selections, response-prompt selections, review-path state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static response-prompt card context: manual Stage 96 static response-check, revision-follow-up readiness row, source-lineage, anchor, callback, gap-prompt, and deferred-reminder comparison only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved revision follow-up readiness selections, saved response-check selections, saved response-prompt selections, saved review-path state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticResponseCheckCard.staticNonGoalFlags,
    ),
  };
}

function rowMatchesStaticResponsePromptCard(
  revisionFollowUpReadinessRow: Stage96Row,
  staticResponseCheckCard: Stage96StaticResponseCheckCard,
): boolean {
  return (
    revisionFollowUpReadinessRow.sourceStaticRevisionFollowUpPromptCardIds.includes(
      staticResponseCheckCard.sourceStaticRevisionFollowUpPromptCardId,
    ) ||
    staticResponseCheckCard.sourceRevisionCoverageReviewPathStepIds.includes(
      revisionFollowUpReadinessRow.sourceRevisionCoverageReviewPathStepId,
    ) ||
    revisionFollowUpReadinessRow.sourceStaticRevisionCheckCardIds.includes(
      staticResponseCheckCard.sourceStaticRevisionCheckCardId,
    )
  );
}

function buildCounts(
  revisionFollowUpReadinessReviewPathSteps: ConstraintResponseRevisionFollowUpReadinessReviewPathStepView[],
  staticResponsePromptCards: ConstraintResponseRevisionFollowUpReadinessReviewPathStaticResponsePromptCardView[],
  revisionFollowUpReadinessBoard: Stage96View,
): ConstraintResponseRevisionFollowUpReadinessReviewPathSummaryView["counts"] {
  const sourceCounts = revisionFollowUpReadinessBoard.summary.counts;

  return {
    ...sourceCounts,
    revisionFollowUpReadinessReviewPathStepCount:
      revisionFollowUpReadinessReviewPathSteps.length,
    staticResponsePromptCardCount: staticResponsePromptCards.length,
    revisionFollowUpReadinessReviewPathLabelCount: unique([
      ...revisionFollowUpReadinessReviewPathSteps.flatMap(
        (step) => step.revisionFollowUpReadinessReviewPathLabels,
      ),
      ...staticResponsePromptCards.flatMap(
        (card) => card.revisionFollowUpReadinessReviewPathLabels,
      ),
    ]).length,
    staticResponsePromptLabelCount: unique([
      ...revisionFollowUpReadinessReviewPathSteps.flatMap(
        (step) => step.staticResponsePromptLabels,
      ),
      ...staticResponsePromptCards.flatMap(
        (card) => card.staticResponsePromptLabels,
      ),
    ]).length,
    localOnlyRevisionFollowUpReadinessReviewPathStepCount:
      revisionFollowUpReadinessReviewPathSteps.filter(
        (step) => step.localOnly,
      ).length,
    localOnlyStaticResponsePromptCardCount: staticResponsePromptCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function buildStepRevisionFollowUpReadinessReviewPathLabels(
  revisionFollowUpReadinessRow: Stage96Row,
  matchedStaticResponseCheckCards: Stage96StaticResponseCheckCard[],
): string[] {
  const labels = [
    "revision follow-up readiness review-path step",
    "Stage 96 readiness row carry-forward",
  ];

  if (matchedStaticResponseCheckCards.length) {
    labels.push("matched Stage 96 static response-check card");
  }

  if (revisionFollowUpReadinessRow.revisionFollowUpReadinessLabels.length) {
    labels.push("readiness board label carry-forward");
  }

  return labels;
}

function buildStepStaticResponsePromptLabels(
  revisionFollowUpReadinessRow: Stage96Row,
  matchedStaticResponseCheckCards: Stage96StaticResponseCheckCard[],
): string[] {
  const labels = [
    "static response-prompt carry-forward",
    "Stage 96 static response-check comparison",
  ];

  if (matchedStaticResponseCheckCards.length) {
    labels.push("matched Stage 96 response-check card");
  }

  if (
    revisionFollowUpReadinessRow.gapDiscussionPointIds.length ||
    revisionFollowUpReadinessRow.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder response prompt");
  }

  return labels;
}

function buildCardRevisionFollowUpReadinessReviewPathLabels(
  staticResponseCheckCard: Stage96StaticResponseCheckCard,
  matchedRevisionFollowUpReadinessRows: Stage96Row[],
): string[] {
  const labels = [
    "revision follow-up readiness review-path card",
    "Stage 96 static response-check carry-forward",
  ];

  if (matchedRevisionFollowUpReadinessRows.length) {
    labels.push("matched revision follow-up readiness rows");
  }

  if (staticResponseCheckCard.revisionFollowUpReadinessLabels.length) {
    labels.push("readiness card label carry-forward");
  }

  return labels;
}

function buildCardStaticResponsePromptLabels(
  staticResponseCheckCard: Stage96StaticResponseCheckCard,
  matchedRevisionFollowUpReadinessRows: Stage96Row[],
): string[] {
  const labels = [
    "static response-prompt card",
    "Stage 96 static response-check carry-forward",
  ];

  if (matchedRevisionFollowUpReadinessRows.length) {
    labels.push("matched review-path step context");
  }

  if (
    staticResponseCheckCard.gapDiscussionPointIds.length ||
    staticResponseCheckCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder response prompt");
  }

  return labels;
}

function staticNonGoalFlags(
  sourceFlags: Stage96StaticNonGoalFlags,
): ConstraintResponseRevisionFollowUpReadinessReviewPathStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedReviewPathState: true,
    noSavedRevisionFollowUpReadinessReviewPathState: true,
    noSavedRevisionFollowUpReadinessReviewPathSteps: true,
    noSavedRevisionFollowUpReadinessReviewPathSelections: true,
    noSavedResponsePromptState: true,
    noSavedResponsePromptSelections: true,
    noSavedStaticResponsePromptCards: true,
    noSavedResponseDrafts: true,
    noSavedResponseNotes: true,
  };
}

function joinOrNone(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}
