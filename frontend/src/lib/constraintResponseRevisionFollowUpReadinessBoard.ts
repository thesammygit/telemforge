import type {
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPathStaticNonGoalFlagsView as Stage95StaticNonGoalFlags,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPathStaticRevisionFollowUpPromptCardView as Stage95StaticRevisionFollowUpPromptCard,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPathStepView as Stage95Step,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPathView as Stage95View,
  ConstraintResponseRevisionFollowUpReadinessBoardRowView,
  ConstraintResponseRevisionFollowUpReadinessBoardStaticNonGoalFlagsView,
  ConstraintResponseRevisionFollowUpReadinessBoardStaticResponseCheckCardView,
  ConstraintResponseRevisionFollowUpReadinessBoardSummaryView,
  ConstraintResponseRevisionFollowUpReadinessBoardView,
} from "../features/mission-console/types.ts";

export function buildConstraintResponseRevisionFollowUpReadinessBoard(
  revisionCoverageReviewPath: Stage95View | undefined,
): ConstraintResponseRevisionFollowUpReadinessBoardView | undefined {
  if (
    !revisionCoverageReviewPath?.revisionCoverageReviewPathSteps.length ||
    !revisionCoverageReviewPath.staticRevisionFollowUpPromptCards.length
  ) {
    return undefined;
  }

  const revisionFollowUpReadinessRows =
    revisionCoverageReviewPath.revisionCoverageReviewPathSteps.map((step) =>
      buildRevisionFollowUpReadinessRow(
        step,
        revisionCoverageReviewPath.staticRevisionFollowUpPromptCards,
      ),
    );
  const staticResponseCheckCards =
    revisionCoverageReviewPath.staticRevisionFollowUpPromptCards.map((card) =>
      buildStaticResponseCheckCard(
        card,
        revisionCoverageReviewPath.revisionCoverageReviewPathSteps,
      ),
    );
  const defaultRevisionFollowUpReadinessRow =
    revisionFollowUpReadinessRows.find(
      (row) =>
        row.sourceRevisionCoverageReviewPathStepId ===
        revisionCoverageReviewPath.defaultRevisionCoverageReviewPathStep
          .revisionCoverageReviewPathStepId,
    ) ?? revisionFollowUpReadinessRows[0];
  const defaultStaticResponseCheckCard =
    staticResponseCheckCards.find(
      (card) =>
        card.sourceStaticRevisionFollowUpPromptCardId ===
        revisionCoverageReviewPath.defaultStaticRevisionFollowUpPromptCard
          .staticRevisionFollowUpPromptCardId,
    ) ?? staticResponseCheckCards[0];
  const defaultStage95Context =
    revisionCoverageReviewPath.summary.defaultRevisionCoverageReviewPathContext;

  return {
    schema: "telemforge.constraint_response_revision_follow_up_readiness_board.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response revision follow-up readiness board and static response checks",
    localStatus: revisionCoverageReviewPath.localStatus,
    summary: {
      constraintResponseRevisionFollowUpReadinessBoardId:
        "candidate-local-constraint-response-revision-follow-up-readiness-board",
      label: "Local constraint-response revision follow-up readiness board",
      summary:
        "A static revision follow-up readiness board derives rows from Stage 95 revision coverage review-path steps and static response-check cards from Stage 95 static revision follow-up prompt cards so reviewers can compare every follow-up prompt with the next manual response check before editing outside the app without saved answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, revision follow-up selections, response-check selections, readiness board state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultRevisionFollowUpReadinessContext: {
        defaultRevisionFollowUpReadinessRowId:
          defaultRevisionFollowUpReadinessRow.revisionFollowUpReadinessRowId,
        defaultStaticResponseCheckCardId:
          defaultStaticResponseCheckCard.staticResponseCheckCardId,
        defaultRevisionCoverageReviewPathStepId:
          defaultRevisionFollowUpReadinessRow
            .sourceRevisionCoverageReviewPathStepId,
        defaultStaticRevisionFollowUpPromptCardId:
          defaultStaticResponseCheckCard
            .sourceStaticRevisionFollowUpPromptCardId,
        defaultRevisionCoverageRowId:
          defaultRevisionFollowUpReadinessRow.sourceRevisionCoverageRowId,
        defaultStaticRevisionCheckCardId:
          defaultStaticResponseCheckCard.sourceStaticRevisionCheckCardId,
        defaultResponseReadinessReviewPathStepId:
          defaultRevisionFollowUpReadinessRow
            .sourceResponseReadinessReviewPathStepId,
        defaultStaticRevisionPromptCardId:
          defaultStaticResponseCheckCard.sourceStaticRevisionPromptCardId,
        defaultResponseReadinessRowId:
          defaultRevisionFollowUpReadinessRow.sourceResponseReadinessRowId,
        defaultStaticDraftCheckCardId:
          defaultStaticResponseCheckCard.sourceStaticDraftCheckCardId,
        defaultCoverageReviewPathStepId:
          defaultRevisionFollowUpReadinessRow.sourceCoverageReviewPathStepId,
        defaultStaticResponseCueCardId:
          defaultStaticResponseCheckCard.sourceStaticResponseCueCardId,
        defaultCoverageRowId:
          defaultRevisionFollowUpReadinessRow.sourceCoverageRowId,
        defaultStaticReviewPromptCardId:
          defaultStaticResponseCheckCard.sourceStaticReviewPromptCardId,
        defaultFollowUpReviewPathStepId:
          defaultRevisionFollowUpReadinessRow.sourceFollowUpReviewPathStepId,
        defaultStaticReadinessCueCardId:
          defaultStaticResponseCheckCard.sourceStaticReadinessCueCardId,
        defaultEvidenceGapReadinessRowId:
          defaultRevisionFollowUpReadinessRow.sourceEvidenceGapReadinessRowId,
        defaultStaticFollowUpPromptCardId:
          defaultStaticResponseCheckCard.sourceStaticFollowUpPromptCardId,
        defaultEvidenceCheckReviewPathStepId:
          defaultRevisionFollowUpReadinessRow
            .sourceEvidenceCheckReviewPathStepId,
        defaultStaticCitationGapCueCardId:
          defaultStaticResponseCheckCard.sourceStaticCitationGapCueCardId,
        defaultStaticEvidenceCheckPromptCardId:
          defaultRevisionFollowUpReadinessRow
            .sourceStaticEvidenceCheckPromptCardId,
        defaultCitationReviewLaneRowId:
          defaultStaticResponseCheckCard.sourceCitationReviewLaneRowId,
        defaultStaticCitationCheckPromptCardId:
          defaultStaticResponseCheckCard.sourceStaticCitationCheckPromptCardId,
        defaultSourceFollowUpMapEntryId:
          defaultRevisionFollowUpReadinessRow.sourceSourceFollowUpMapEntryId,
        sourceStage95RevisionCoverageReviewPathSummary:
          revisionCoverageReviewPath.summary.summary,
        sourceStage95DefaultRevisionCoverageReviewPathContext:
          defaultStage95Context,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        revisionFollowUpReadinessRows,
        staticResponseCheckCards,
        revisionCoverageReviewPath,
      ),
    },
    defaultRevisionFollowUpReadinessRow,
    defaultStaticResponseCheckCard,
    revisionFollowUpReadinessRows,
    staticResponseCheckCards,
    staticRevisionFollowUpReadinessBoundarySummary:
      "Stage 96 revision follow-up readiness rows and static response-check cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, revision follow-up selections, response-check selections, readiness board state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPath:
      revisionCoverageReviewPath,
  };
}

function buildRevisionFollowUpReadinessRow(
  revisionCoverageReviewPathStep: Stage95Step,
  staticRevisionFollowUpPromptCards: Stage95StaticRevisionFollowUpPromptCard[],
): ConstraintResponseRevisionFollowUpReadinessBoardRowView {
  const sourceRevisionCoverageReviewPathStepId =
    revisionCoverageReviewPathStep.revisionCoverageReviewPathStepId;
  const matchedStaticRevisionFollowUpPromptCards =
    staticRevisionFollowUpPromptCards.filter((card) =>
      rowMatchesStaticResponseCheckCard(revisionCoverageReviewPathStep, card),
    );
  const sourceStaticRevisionFollowUpPromptCardIds =
    matchedStaticRevisionFollowUpPromptCards.map(
      (card) => card.staticRevisionFollowUpPromptCardId,
    );
  const revisionFollowUpReadinessLabels =
    buildRowRevisionFollowUpReadinessLabels(
      revisionCoverageReviewPathStep,
      matchedStaticRevisionFollowUpPromptCards,
    );
  const staticResponseCheckLabels = buildRowStaticResponseCheckLabels(
    revisionCoverageReviewPathStep,
    matchedStaticRevisionFollowUpPromptCards,
  );
  const revisionFollowUpReadinessRowId =
    `constraint-response-revision-follow-up-readiness-board:row:${sourceRevisionCoverageReviewPathStepId}`;

  return {
    ...revisionCoverageReviewPathStep,
    revisionFollowUpReadinessRowId,
    revisionFollowUpReadinessRowIds: [revisionFollowUpReadinessRowId],
    revisionFollowUpReadinessRowOrder:
      revisionCoverageReviewPathStep.revisionCoverageReviewPathStepOrder,
    sourceRevisionCoverageReviewPathStepId,
    sourceRevisionCoverageReviewPathStepIds: [
      sourceRevisionCoverageReviewPathStepId,
    ],
    sourceStaticRevisionFollowUpPromptCardIds,
    revisionFollowUpReadinessLabels,
    staticResponseCheckLabels,
    revisionFollowUpReadinessText:
      `Revision follow-up readiness row ${sourceRevisionCoverageReviewPathStepId}: carry Stage 95 revision coverage review-path step ${sourceRevisionCoverageReviewPathStepId}, Stage 95 static revision follow-up prompt cards ${joinOrNone(sourceStaticRevisionFollowUpPromptCardIds)}, Stage 94 revision coverage row ${revisionCoverageReviewPathStep.sourceRevisionCoverageRowId}, Stage 94 static revision-check cards ${joinOrNone(revisionCoverageReviewPathStep.sourceStaticRevisionCheckCardIds)}, Stage 93 response-readiness review-path step ${revisionCoverageReviewPathStep.sourceResponseReadinessReviewPathStepId}, Stage 93 static revision-prompt cards ${joinOrNone(revisionCoverageReviewPathStep.sourceStaticRevisionPromptCardIds)}, Stage 92 response-readiness row ${revisionCoverageReviewPathStep.sourceResponseReadinessRowId}, Stage 92 static draft-check cards ${joinOrNone(revisionCoverageReviewPathStep.sourceStaticDraftCheckCardIds)}, Stage 91 coverage-review path step ${revisionCoverageReviewPathStep.sourceCoverageReviewPathStepId}, Stage 91 static response cue cards ${joinOrNone(revisionCoverageReviewPathStep.sourceStaticResponseCueCardIds)}, Stage 90 coverage row ${revisionCoverageReviewPathStep.sourceCoverageRowId}, Stage 90 static review prompt cards ${joinOrNone(revisionCoverageReviewPathStep.sourceStaticReviewPromptCardIds)}, Stage 89 follow-up review path step ${revisionCoverageReviewPathStep.sourceFollowUpReviewPathStepId}, Stage 89 static readiness cue cards ${joinOrNone(revisionCoverageReviewPathStep.sourceStaticReadinessCueCardIds)}, Stage 88 readiness row ${revisionCoverageReviewPathStep.sourceEvidenceGapReadinessRowId}, Stage 88 static follow-up prompt cards ${joinOrNone(revisionCoverageReviewPathStep.sourceStaticFollowUpPromptCardIds)}, Stage 87 evidence-check review path step ${revisionCoverageReviewPathStep.sourceEvidenceCheckReviewPathStepId}, Stage 87 citation-gap cue cards ${joinOrNone(revisionCoverageReviewPathStep.sourceStaticCitationGapCueCardIds)}, Stage 86 static evidence-check prompt card ${revisionCoverageReviewPathStep.sourceStaticEvidenceCheckPromptCardId}, Stage 86 citation-review lane rows ${joinOrNone(revisionCoverageReviewPathStep.sourceCitationReviewLaneRowIds)}, Stage 85 source follow-up map entry ${revisionCoverageReviewPathStep.sourceSourceFollowUpMapEntryId}, Stage 85 citation prompt cards ${joinOrNone(revisionCoverageReviewPathStep.sourceStaticCitationCheckPromptCardIds)}, Stage 84 readiness row ${revisionCoverageReviewPathStep.sourceSourceReadinessLaneRowId}, Stage 84 cue cards ${joinOrNone(revisionCoverageReviewPathStep.sourceStaticSourceFollowUpCueCardIds)}, Stage 83 source-review path step ${revisionCoverageReviewPathStep.sourceSourceReviewPathStepId}, Stage 83 static source-review prompt cards ${joinOrNone(revisionCoverageReviewPathStep.sourceStaticSourceReviewPromptCardIds)}, Stage 82 source-crosswalk row ${revisionCoverageReviewPathStep.sourceCrosswalkRowId}, Stage 82 static review-check cards ${joinOrNone(revisionCoverageReviewPathStep.sourceStaticReviewCheckCardIds)}, Stage 81 review-path step ${revisionCoverageReviewPathStep.sourceConstraintResponseReviewPathStepId}, Stage 81 response-review prompt cards ${joinOrNone(revisionCoverageReviewPathStep.sourceStaticResponseReviewPromptCardIds)}, Stage 80 constraint-coverage row ${revisionCoverageReviewPathStep.sourceConstraintCoverageRowId}, Stage 80 response-note prompt cards ${joinOrNone(revisionCoverageReviewPathStep.sourceStaticResponseNotePromptCardIds)}, Stage 79 answer-review step ${revisionCoverageReviewPathStep.sourceAnswerReviewPathStepId}, Stage 79 constraint-note cards ${joinOrNone(revisionCoverageReviewPathStep.sourceStaticConstraintNoteCardIds)}, Stage 78 answer-check card ${revisionCoverageReviewPathStep.sourceStaticAnswerCheckCardId}, Stage 78 readiness rows ${joinOrNone(revisionCoverageReviewPathStep.sourceResponsePromptReadinessRowIds)}, Stage 77 response-prompt cards ${joinOrNone(revisionCoverageReviewPathStep.sourceStaticResponsePromptCardIds)}, Stage 77 response-map review-path step ${revisionCoverageReviewPathStep.sourceResponseMapReviewPathStepId}, Stage 76 response-map row ${revisionCoverageReviewPathStep.sourceResponseMapRowId}, Stage 75 coverage-review step ${revisionCoverageReviewPathStep.sourceCoverageReviewPathStepId}, Stage 74 coverage row ${revisionCoverageReviewPathStep.sourceCoverageMatrixRowId}, Stage 73 review-path step ${revisionCoverageReviewPathStep.sourceReviewPathStepId}, Stage 72 source recap row ${revisionCoverageReviewPathStep.sourceSourceRecapRowId}, Stage 71 review-lane row ${revisionCoverageReviewPathStep.sourceAnswerFollowUpReviewLaneRowId}, Stage 70 crosswalk row ${revisionCoverageReviewPathStep.sourceAnswerSourceCrosswalkRowId}, Stage 69 walkthrough step ${revisionCoverageReviewPathStep.sourceAnswerWalkthroughStepId}, Stage 68 answer coverage row ${revisionCoverageReviewPathStep.sourceAnswerCoverageRowId}, Stage 67 rehearsal step ${revisionCoverageReviewPathStep.sourceRehearsalPathStepId}, Stage 66 board row ${revisionCoverageReviewPathStep.sourceReviewBoardRowId}, Stage 65 brief row ${revisionCoverageReviewPathStep.followUpReadinessBriefRowId}, Stage 64 triage row ${revisionCoverageReviewPathStep.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${joinOrNone(revisionCoverageReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(revisionCoverageReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(revisionCoverageReviewPathStep.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(revisionCoverageReviewPathStep.deferredScopeReminderIds)}, readiness labels ${joinOrNone(revisionFollowUpReadinessLabels)}, response-check labels ${joinOrNone(staticResponseCheckLabels)}, Stage 95 review-path text "${revisionCoverageReviewPathStep.revisionCoverageReviewPathText}", and Stage 95 static revision follow-up prompt text "${revisionCoverageReviewPathStep.staticRevisionFollowUpPromptText}" as deterministic manual revision follow-up readiness context only.`,
    staticResponseCheckText:
      `Static response-check context for readiness row ${sourceRevisionCoverageReviewPathStepId}: inspect Stage 95 revision coverage review-path step ${sourceRevisionCoverageReviewPathStepId}, Stage 95 static revision follow-up prompt cards ${joinOrNone(sourceStaticRevisionFollowUpPromptCardIds)}, Stage 94 revision coverage row ${revisionCoverageReviewPathStep.sourceRevisionCoverageRowId}, Stage 94 static revision-check cards ${joinOrNone(revisionCoverageReviewPathStep.sourceStaticRevisionCheckCardIds)}, Stage 93 response-readiness review-path step ${revisionCoverageReviewPathStep.sourceResponseReadinessReviewPathStepId}, Stage 93 static revision-prompt cards ${joinOrNone(revisionCoverageReviewPathStep.sourceStaticRevisionPromptCardIds)}, anchors ${joinOrNone(revisionCoverageReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(revisionCoverageReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(revisionCoverageReviewPathStep.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(revisionCoverageReviewPathStep.deferredScopeReminderIds)}, and Stage 95 labels ${joinOrNone([...revisionCoverageReviewPathStep.revisionCoverageReviewPathLabels, ...revisionCoverageReviewPathStep.staticRevisionFollowUpPromptLabels])} before editing outside the app without saved reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, revision follow-up selections, response-check selections, readiness board state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static revision follow-up readiness context: manual Stage 95 revision-coverage-review-path, static revision follow-up prompt, source-lineage, anchor, callback, gap-prompt, deferred-reminder, and response-check comparison only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved revision follow-up selections, saved response-check selections, saved readiness board state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      revisionCoverageReviewPathStep.staticNonGoalFlags,
    ),
  };
}

function buildStaticResponseCheckCard(
  staticRevisionFollowUpPromptCard: Stage95StaticRevisionFollowUpPromptCard,
  revisionCoverageReviewPathSteps: Stage95Step[],
): ConstraintResponseRevisionFollowUpReadinessBoardStaticResponseCheckCardView {
  const sourceStaticRevisionFollowUpPromptCardId =
    staticRevisionFollowUpPromptCard.staticRevisionFollowUpPromptCardId;
  const matchedRevisionCoverageReviewPathSteps =
    revisionCoverageReviewPathSteps.filter((step) =>
      rowMatchesStaticResponseCheckCard(step, staticRevisionFollowUpPromptCard),
    );
  const sourceRevisionCoverageReviewPathStepIds =
    matchedRevisionCoverageReviewPathSteps.map(
      (step) => step.revisionCoverageReviewPathStepId,
    );
  const revisionFollowUpReadinessLabels =
    buildCardRevisionFollowUpReadinessLabels(
      staticRevisionFollowUpPromptCard,
      matchedRevisionCoverageReviewPathSteps,
    );
  const staticResponseCheckLabels = buildCardStaticResponseCheckLabels(
    staticRevisionFollowUpPromptCard,
    matchedRevisionCoverageReviewPathSteps,
  );
  const staticResponseCheckCardId =
    `constraint-response-revision-follow-up-readiness-board:static-response-check:${sourceStaticRevisionFollowUpPromptCardId}`;

  return {
    ...staticRevisionFollowUpPromptCard,
    staticResponseCheckCardId,
    staticResponseCheckCardIds: [staticResponseCheckCardId],
    staticResponseCheckOrder:
      staticRevisionFollowUpPromptCard.staticRevisionFollowUpPromptOrder,
    sourceStaticRevisionFollowUpPromptCardId,
    sourceStaticRevisionFollowUpPromptCardIds: [
      sourceStaticRevisionFollowUpPromptCardId,
    ],
    sourceRevisionCoverageReviewPathStepIds,
    revisionFollowUpReadinessLabels,
    staticResponseCheckLabels,
    revisionFollowUpReadinessText:
      `Revision follow-up readiness card ${sourceStaticRevisionFollowUpPromptCardId}: carry Stage 95 static revision follow-up prompt card ${sourceStaticRevisionFollowUpPromptCardId}, Stage 95 revision coverage review-path steps ${joinOrNone(sourceRevisionCoverageReviewPathStepIds)}, Stage 94 static revision-check card ${staticRevisionFollowUpPromptCard.sourceStaticRevisionCheckCardId}, Stage 94 revision coverage rows ${joinOrNone(staticRevisionFollowUpPromptCard.sourceRevisionCoverageRowIds)}, Stage 93 static revision-prompt card ${staticRevisionFollowUpPromptCard.sourceStaticRevisionPromptCardId}, Stage 93 response-readiness review-path steps ${joinOrNone(staticRevisionFollowUpPromptCard.sourceResponseReadinessReviewPathStepIds)}, Stage 92 static draft-check card ${staticRevisionFollowUpPromptCard.sourceStaticDraftCheckCardId}, Stage 92 response-readiness rows ${joinOrNone(staticRevisionFollowUpPromptCard.sourceResponseReadinessRowIds)}, anchors ${joinOrNone(staticRevisionFollowUpPromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticRevisionFollowUpPromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticRevisionFollowUpPromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticRevisionFollowUpPromptCard.deferredScopeReminderIds)}, readiness labels ${joinOrNone(revisionFollowUpReadinessLabels)}, response-check labels ${joinOrNone(staticResponseCheckLabels)}, Stage 95 review-path text "${staticRevisionFollowUpPromptCard.revisionCoverageReviewPathText}", and Stage 95 static revision follow-up prompt text "${staticRevisionFollowUpPromptCard.staticRevisionFollowUpPromptText}" as deterministic manual response-check context only.`,
    staticResponseCheckText:
      `Static response-check card ${sourceStaticRevisionFollowUpPromptCardId}: inspect Stage 95 static revision follow-up prompt card ${sourceStaticRevisionFollowUpPromptCardId}, Stage 95 revision coverage review-path steps ${joinOrNone(sourceRevisionCoverageReviewPathStepIds)}, Stage 94 static revision-check card ${staticRevisionFollowUpPromptCard.sourceStaticRevisionCheckCardId}, Stage 94 revision coverage rows ${joinOrNone(staticRevisionFollowUpPromptCard.sourceRevisionCoverageRowIds)}, Stage 93 static revision-prompt card ${staticRevisionFollowUpPromptCard.sourceStaticRevisionPromptCardId}, Stage 92 static draft-check card ${staticRevisionFollowUpPromptCard.sourceStaticDraftCheckCardId}, Stage 91 static response cue card ${staticRevisionFollowUpPromptCard.sourceStaticResponseCueCardId}, Stage 90 static review prompt card ${staticRevisionFollowUpPromptCard.sourceStaticReviewPromptCardId}, Stage 89 static readiness cue ${staticRevisionFollowUpPromptCard.sourceStaticReadinessCueCardId}, Stage 88 static follow-up prompt card ${staticRevisionFollowUpPromptCard.sourceStaticFollowUpPromptCardId}, Stage 87 citation-gap cue ${staticRevisionFollowUpPromptCard.sourceStaticCitationGapCueCardId}, Stage 86 citation-review lane row ${staticRevisionFollowUpPromptCard.sourceCitationReviewLaneRowId}, Stage 85 citation prompt card ${staticRevisionFollowUpPromptCard.sourceStaticCitationCheckPromptCardId}, anchors ${joinOrNone(staticRevisionFollowUpPromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticRevisionFollowUpPromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticRevisionFollowUpPromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticRevisionFollowUpPromptCard.deferredScopeReminderIds)}, and Stage 95 labels ${joinOrNone([...staticRevisionFollowUpPromptCard.revisionCoverageReviewPathLabels, ...staticRevisionFollowUpPromptCard.staticRevisionFollowUpPromptLabels])} before editing outside the app without saved reviewer answers, answer drafts, revision drafts, response drafts, reviewer notes, response notes, revision follow-up selections, response-check selections, readiness board state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static response-check card context: manual Stage 95 static revision follow-up prompt, revision-coverage-review-path, source-lineage, anchor, callback, gap-prompt, and deferred-reminder comparison only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved response drafts, saved reviewer notes, saved response notes, saved revision follow-up selections, saved response-check selections, saved readiness board state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticRevisionFollowUpPromptCard.staticNonGoalFlags,
    ),
  };
}

function rowMatchesStaticResponseCheckCard(
  revisionCoverageReviewPathStep: Stage95Step,
  staticRevisionFollowUpPromptCard: Stage95StaticRevisionFollowUpPromptCard,
): boolean {
  return (
    revisionCoverageReviewPathStep.sourceStaticRevisionCheckCardIds.includes(
      staticRevisionFollowUpPromptCard.sourceStaticRevisionCheckCardId,
    ) ||
    staticRevisionFollowUpPromptCard.sourceRevisionCoverageRowIds.includes(
      revisionCoverageReviewPathStep.sourceRevisionCoverageRowId,
    )
  );
}

function buildCounts(
  revisionFollowUpReadinessRows: ConstraintResponseRevisionFollowUpReadinessBoardRowView[],
  staticResponseCheckCards: ConstraintResponseRevisionFollowUpReadinessBoardStaticResponseCheckCardView[],
  revisionCoverageReviewPath: Stage95View,
): ConstraintResponseRevisionFollowUpReadinessBoardSummaryView["counts"] {
  const sourceCounts = revisionCoverageReviewPath.summary.counts;

  return {
    ...sourceCounts,
    revisionFollowUpReadinessRowCount:
      revisionFollowUpReadinessRows.length,
    staticResponseCheckCardCount: staticResponseCheckCards.length,
    revisionFollowUpReadinessLabelCount: unique([
      ...revisionFollowUpReadinessRows.flatMap(
        (row) => row.revisionFollowUpReadinessLabels,
      ),
      ...staticResponseCheckCards.flatMap(
        (card) => card.revisionFollowUpReadinessLabels,
      ),
    ]).length,
    staticResponseCheckLabelCount: unique([
      ...revisionFollowUpReadinessRows.flatMap(
        (row) => row.staticResponseCheckLabels,
      ),
      ...staticResponseCheckCards.flatMap(
        (card) => card.staticResponseCheckLabels,
      ),
    ]).length,
    localOnlyRevisionFollowUpReadinessRowCount:
      revisionFollowUpReadinessRows.filter((row) => row.localOnly).length,
    localOnlyStaticResponseCheckCardCount: staticResponseCheckCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function buildRowRevisionFollowUpReadinessLabels(
  revisionCoverageReviewPathStep: Stage95Step,
  matchedStaticRevisionFollowUpPromptCards: Stage95StaticRevisionFollowUpPromptCard[],
): string[] {
  const labels = [
    "revision follow-up readiness row",
    "Stage 95 revision coverage review-path carry-forward",
  ];

  if (matchedStaticRevisionFollowUpPromptCards.length) {
    labels.push("matched Stage 95 static revision follow-up prompt");
  }

  if (revisionCoverageReviewPathStep.revisionCoverageReviewPathLabels.length) {
    labels.push("revision review-path label carry-forward");
  }

  return labels;
}

function buildRowStaticResponseCheckLabels(
  revisionCoverageReviewPathStep: Stage95Step,
  matchedStaticRevisionFollowUpPromptCards: Stage95StaticRevisionFollowUpPromptCard[],
): string[] {
  const labels = [
    "static response-check carry-forward",
    "Stage 95 static revision follow-up prompt comparison",
  ];

  if (matchedStaticRevisionFollowUpPromptCards.length) {
    labels.push("matched Stage 95 prompt card");
  }

  if (
    revisionCoverageReviewPathStep.gapDiscussionPointIds.length ||
    revisionCoverageReviewPathStep.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder response check");
  }

  return labels;
}

function buildCardRevisionFollowUpReadinessLabels(
  staticRevisionFollowUpPromptCard: Stage95StaticRevisionFollowUpPromptCard,
  matchedRevisionCoverageReviewPathSteps: Stage95Step[],
): string[] {
  const labels = [
    "revision follow-up readiness card",
    "Stage 95 static revision follow-up prompt carry-forward",
  ];

  if (matchedRevisionCoverageReviewPathSteps.length) {
    labels.push("matched revision coverage review-path steps");
  }

  if (staticRevisionFollowUpPromptCard.revisionCoverageReviewPathLabels.length) {
    labels.push("review-path card label carry-forward");
  }

  return labels;
}

function buildCardStaticResponseCheckLabels(
  staticRevisionFollowUpPromptCard: Stage95StaticRevisionFollowUpPromptCard,
  matchedRevisionCoverageReviewPathSteps: Stage95Step[],
): string[] {
  const labels = [
    "static response-check card",
    "Stage 95 static revision follow-up prompt carry-forward",
  ];

  if (matchedRevisionCoverageReviewPathSteps.length) {
    labels.push("matched readiness row context");
  }

  if (
    staticRevisionFollowUpPromptCard.gapDiscussionPointIds.length ||
    staticRevisionFollowUpPromptCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder response check");
  }

  return labels;
}

function staticNonGoalFlags(
  sourceFlags: Stage96SourceFlags,
): ConstraintResponseRevisionFollowUpReadinessBoardStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedRevisionFollowUpReadinessBoardState: true,
    noSavedRevisionFollowUpReadinessRows: true,
    noSavedRevisionFollowUpReadinessSelections: true,
    noSavedResponseCheckState: true,
    noSavedResponseCheckSelections: true,
    noSavedStaticResponseCheckCards: true,
    noSavedResponseDrafts: true,
  };
}

function joinOrNone(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

type Stage96SourceFlags = Stage95StaticNonGoalFlags;
