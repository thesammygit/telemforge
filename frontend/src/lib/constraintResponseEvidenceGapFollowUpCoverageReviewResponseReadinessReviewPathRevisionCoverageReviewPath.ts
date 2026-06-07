import type {
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoardRowView as Stage94Row,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoardStaticNonGoalFlagsView as Stage94StaticNonGoalFlags,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoardStaticRevisionCheckCardView as Stage94StaticRevisionCheckCard,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoardView as Stage94View,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPathStaticNonGoalFlagsView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPathStaticRevisionFollowUpPromptCardView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPathStepView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPathSummaryView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPathView,
} from "../features/mission-console/types.ts";

export function buildConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPath(
  revisionCoverageBoard: Stage94View | undefined,
): ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPathView | undefined {
  if (
    !revisionCoverageBoard?.revisionCoverageRows.length ||
    !revisionCoverageBoard.staticRevisionCheckCards.length
  ) {
    return undefined;
  }

  const revisionCoverageReviewPathSteps =
    revisionCoverageBoard.revisionCoverageRows.map((row) =>
      buildRevisionCoverageReviewPathStep(
        row,
        revisionCoverageBoard.staticRevisionCheckCards,
      ),
    );
  const staticRevisionFollowUpPromptCards =
    revisionCoverageBoard.staticRevisionCheckCards.map((card) =>
      buildStaticRevisionFollowUpPromptCard(
        card,
        revisionCoverageBoard.revisionCoverageRows,
      ),
    );
  const defaultRevisionCoverageReviewPathStep =
    revisionCoverageReviewPathSteps.find(
      (step) =>
        step.sourceRevisionCoverageRowId ===
        revisionCoverageBoard.defaultRevisionCoverageRow.revisionCoverageRowId,
    ) ?? revisionCoverageReviewPathSteps[0];
  const defaultStaticRevisionFollowUpPromptCard =
    staticRevisionFollowUpPromptCards.find(
      (card) =>
        card.sourceStaticRevisionCheckCardId ===
        revisionCoverageBoard.defaultStaticRevisionCheckCard.staticRevisionCheckCardId,
    ) ?? staticRevisionFollowUpPromptCards[0];
  const defaultStage94Context =
    revisionCoverageBoard.summary.defaultRevisionCoverageContext;

  return {
    schema:
      "telemforge.constraint_response_evidence_gap_follow_up_coverage_review_response_readiness_review_path_revision_coverage_review_path.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response evidence-gap follow-up coverage-review response-readiness review-path revision coverage review path and static revision follow-up prompts",
    localStatus: revisionCoverageBoard.localStatus,
    summary: {
      constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPathId:
        "candidate-local-constraint-response-evidence-gap-follow-up-coverage-review-response-readiness-review-path-revision-coverage-review-path",
      label:
        "Local constraint-response evidence-gap follow-up coverage-review response-readiness review-path revision coverage review path",
      summary:
        "A static revision coverage review path derives steps from Stage 94 revision coverage rows and static revision follow-up prompt cards from Stage 94 static revision-check cards so reviewers can walk each revision coverage row to the next manual follow-up prompt before editing outside the app without saved answers, answer drafts, revision drafts, reviewer notes, response notes, response-readiness selections, draft-check selections, revision-prompt selections, revision coverage selections, revision-check selections, revision follow-up selections, saved review path state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultRevisionCoverageReviewPathContext: {
        defaultRevisionCoverageReviewPathStepId:
          defaultRevisionCoverageReviewPathStep.revisionCoverageReviewPathStepId,
        defaultStaticRevisionFollowUpPromptCardId:
          defaultStaticRevisionFollowUpPromptCard
            .staticRevisionFollowUpPromptCardId,
        defaultRevisionCoverageRowId:
          defaultRevisionCoverageReviewPathStep.sourceRevisionCoverageRowId,
        defaultStaticRevisionCheckCardId:
          defaultStaticRevisionFollowUpPromptCard.sourceStaticRevisionCheckCardId,
        defaultResponseReadinessReviewPathStepId:
          defaultRevisionCoverageReviewPathStep
            .sourceResponseReadinessReviewPathStepId,
        defaultStaticRevisionPromptCardId:
          defaultStaticRevisionFollowUpPromptCard.sourceStaticRevisionPromptCardId,
        defaultResponseReadinessRowId:
          defaultRevisionCoverageReviewPathStep.sourceResponseReadinessRowId,
        defaultStaticDraftCheckCardId:
          defaultStaticRevisionFollowUpPromptCard.sourceStaticDraftCheckCardId,
        defaultCoverageReviewPathStepId:
          defaultRevisionCoverageReviewPathStep.sourceCoverageReviewPathStepId,
        defaultStaticResponseCueCardId:
          defaultStaticRevisionFollowUpPromptCard.sourceStaticResponseCueCardId,
        defaultCoverageRowId:
          defaultRevisionCoverageReviewPathStep.sourceCoverageRowId,
        defaultStaticReviewPromptCardId:
          defaultStaticRevisionFollowUpPromptCard.sourceStaticReviewPromptCardId,
        defaultFollowUpReviewPathStepId:
          defaultRevisionCoverageReviewPathStep.sourceFollowUpReviewPathStepId,
        defaultStaticReadinessCueCardId:
          defaultStaticRevisionFollowUpPromptCard.sourceStaticReadinessCueCardId,
        defaultEvidenceGapReadinessRowId:
          defaultRevisionCoverageReviewPathStep.sourceEvidenceGapReadinessRowId,
        defaultStaticFollowUpPromptCardId:
          defaultStaticRevisionFollowUpPromptCard.sourceStaticFollowUpPromptCardId,
        defaultEvidenceCheckReviewPathStepId:
          defaultRevisionCoverageReviewPathStep.sourceEvidenceCheckReviewPathStepId,
        defaultStaticCitationGapCueCardId:
          defaultStaticRevisionFollowUpPromptCard.sourceStaticCitationGapCueCardId,
        defaultStaticEvidenceCheckPromptCardId:
          defaultRevisionCoverageReviewPathStep
            .sourceStaticEvidenceCheckPromptCardId,
        defaultCitationReviewLaneRowId:
          defaultStaticRevisionFollowUpPromptCard.sourceCitationReviewLaneRowId,
        defaultStaticCitationCheckPromptCardId:
          defaultStaticRevisionFollowUpPromptCard
            .sourceStaticCitationCheckPromptCardId,
        defaultSourceFollowUpMapEntryId:
          defaultRevisionCoverageReviewPathStep.sourceSourceFollowUpMapEntryId,
        sourceStage94RevisionCoverageBoardSummary:
          revisionCoverageBoard.summary.summary,
        sourceStage94DefaultRevisionCoverageContext: defaultStage94Context,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        revisionCoverageReviewPathSteps,
        staticRevisionFollowUpPromptCards,
        revisionCoverageBoard,
      ),
    },
    defaultRevisionCoverageReviewPathStep,
    defaultStaticRevisionFollowUpPromptCard,
    revisionCoverageReviewPathSteps,
    staticRevisionFollowUpPromptCards,
    staticRevisionCoverageReviewPathBoundarySummary:
      "Stage 95 revision coverage review-path steps and static revision follow-up prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, revision drafts, reviewer notes, response notes, response-readiness selections, draft-check selections, revision-prompt selections, revision coverage selections, revision-check selections, revision follow-up selections, review path state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoard:
      revisionCoverageBoard,
  };
}

function buildRevisionCoverageReviewPathStep(
  revisionCoverageRow: Stage94Row,
  staticRevisionCheckCards: Stage94StaticRevisionCheckCard[],
): ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPathStepView {
  const sourceRevisionCoverageRowId = revisionCoverageRow.revisionCoverageRowId;
  const matchedStaticRevisionCheckCards = staticRevisionCheckCards.filter((card) =>
    rowMatchesStaticRevisionFollowUpPromptCard(revisionCoverageRow, card),
  );
  const sourceStaticRevisionCheckCardIds =
    matchedStaticRevisionCheckCards.map((card) => card.staticRevisionCheckCardId);
  const revisionCoverageReviewPathLabels =
    buildStepRevisionCoverageReviewPathLabels(
      revisionCoverageRow,
      matchedStaticRevisionCheckCards,
    );
  const staticRevisionFollowUpPromptLabels =
    buildStepStaticRevisionFollowUpPromptLabels(
      revisionCoverageRow,
      matchedStaticRevisionCheckCards,
    );
  const revisionCoverageReviewPathStepId =
    `constraint-response-evidence-gap-follow-up-coverage-review-response-readiness-review-path-revision-coverage-review-path:step:${sourceRevisionCoverageRowId}`;

  return {
    ...revisionCoverageRow,
    revisionCoverageReviewPathStepId,
    revisionCoverageReviewPathStepIds: [revisionCoverageReviewPathStepId],
    revisionCoverageReviewPathStepOrder:
      revisionCoverageRow.revisionCoverageRowOrder,
    sourceRevisionCoverageRowId,
    sourceRevisionCoverageRowIds: [sourceRevisionCoverageRowId],
    sourceStaticRevisionCheckCardIds,
    revisionCoverageReviewPathLabels,
    staticRevisionFollowUpPromptLabels,
    revisionCoverageReviewPathText:
      `Revision coverage review-path step ${sourceRevisionCoverageRowId}: carry Stage 94 revision coverage row ${sourceRevisionCoverageRowId}, Stage 94 static revision-check cards ${joinOrNone(sourceStaticRevisionCheckCardIds)}, Stage 93 response-readiness review-path step ${revisionCoverageRow.sourceResponseReadinessReviewPathStepId}, Stage 93 static revision-prompt cards ${joinOrNone(revisionCoverageRow.sourceStaticRevisionPromptCardIds)}, Stage 92 response-readiness row ${revisionCoverageRow.sourceResponseReadinessRowId}, Stage 92 static draft-check cards ${joinOrNone(revisionCoverageRow.sourceStaticDraftCheckCardIds)}, Stage 91 coverage-review path step ${revisionCoverageRow.sourceCoverageReviewPathStepId}, Stage 91 static response cue cards ${joinOrNone(revisionCoverageRow.sourceStaticResponseCueCardIds)}, Stage 90 coverage row ${revisionCoverageRow.sourceCoverageRowId}, Stage 90 static review prompt cards ${joinOrNone(revisionCoverageRow.sourceStaticReviewPromptCardIds)}, Stage 89 follow-up review path step ${revisionCoverageRow.sourceFollowUpReviewPathStepId}, Stage 89 static readiness cue cards ${joinOrNone(revisionCoverageRow.sourceStaticReadinessCueCardIds)}, Stage 88 readiness row ${revisionCoverageRow.sourceEvidenceGapReadinessRowId}, Stage 88 static follow-up prompt cards ${joinOrNone(revisionCoverageRow.sourceStaticFollowUpPromptCardIds)}, Stage 87 evidence-check review path step ${revisionCoverageRow.sourceEvidenceCheckReviewPathStepId}, Stage 87 citation-gap cue cards ${joinOrNone(revisionCoverageRow.sourceStaticCitationGapCueCardIds)}, Stage 86 static evidence-check prompt card ${revisionCoverageRow.sourceStaticEvidenceCheckPromptCardId}, Stage 86 citation-review lane rows ${joinOrNone(revisionCoverageRow.sourceCitationReviewLaneRowIds)}, Stage 85 source follow-up map entry ${revisionCoverageRow.sourceSourceFollowUpMapEntryId}, Stage 85 citation prompt cards ${joinOrNone(revisionCoverageRow.sourceStaticCitationCheckPromptCardIds)}, Stage 84 readiness row ${revisionCoverageRow.sourceSourceReadinessLaneRowId}, Stage 84 cue cards ${joinOrNone(revisionCoverageRow.sourceStaticSourceFollowUpCueCardIds)}, Stage 83 source-review path step ${revisionCoverageRow.sourceSourceReviewPathStepId}, Stage 83 static source-review prompt cards ${joinOrNone(revisionCoverageRow.sourceStaticSourceReviewPromptCardIds)}, Stage 82 source-crosswalk row ${revisionCoverageRow.sourceCrosswalkRowId}, Stage 82 static review-check cards ${joinOrNone(revisionCoverageRow.sourceStaticReviewCheckCardIds)}, Stage 81 review-path step ${revisionCoverageRow.sourceConstraintResponseReviewPathStepId}, Stage 81 response-review prompt cards ${joinOrNone(revisionCoverageRow.sourceStaticResponseReviewPromptCardIds)}, Stage 80 constraint-coverage row ${revisionCoverageRow.sourceConstraintCoverageRowId}, Stage 80 response-note prompt cards ${joinOrNone(revisionCoverageRow.sourceStaticResponseNotePromptCardIds)}, Stage 79 answer-review step ${revisionCoverageRow.sourceAnswerReviewPathStepId}, Stage 79 constraint-note cards ${joinOrNone(revisionCoverageRow.sourceStaticConstraintNoteCardIds)}, Stage 78 answer-check card ${revisionCoverageRow.sourceStaticAnswerCheckCardId}, Stage 78 readiness rows ${joinOrNone(revisionCoverageRow.sourceResponsePromptReadinessRowIds)}, Stage 77 response-prompt cards ${joinOrNone(revisionCoverageRow.sourceStaticResponsePromptCardIds)}, Stage 77 response-map review-path step ${revisionCoverageRow.sourceResponseMapReviewPathStepId}, Stage 76 response-map row ${revisionCoverageRow.sourceResponseMapRowId}, Stage 75 coverage-review step ${revisionCoverageRow.sourceCoverageReviewPathStepId}, Stage 74 coverage row ${revisionCoverageRow.sourceCoverageMatrixRowId}, Stage 73 review-path step ${revisionCoverageRow.sourceReviewPathStepId}, Stage 72 source recap row ${revisionCoverageRow.sourceSourceRecapRowId}, Stage 71 review-lane row ${revisionCoverageRow.sourceAnswerFollowUpReviewLaneRowId}, Stage 70 crosswalk row ${revisionCoverageRow.sourceAnswerSourceCrosswalkRowId}, Stage 69 walkthrough step ${revisionCoverageRow.sourceAnswerWalkthroughStepId}, Stage 68 answer coverage row ${revisionCoverageRow.sourceAnswerCoverageRowId}, Stage 67 rehearsal step ${revisionCoverageRow.sourceRehearsalPathStepId}, Stage 66 board row ${revisionCoverageRow.sourceReviewBoardRowId}, Stage 65 brief row ${revisionCoverageRow.followUpReadinessBriefRowId}, Stage 64 triage row ${revisionCoverageRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${joinOrNone(revisionCoverageRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(revisionCoverageRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(revisionCoverageRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(revisionCoverageRow.deferredScopeReminderIds)}, revision coverage review-path labels ${joinOrNone(revisionCoverageReviewPathLabels)}, static revision follow-up prompt labels ${joinOrNone(staticRevisionFollowUpPromptLabels)}, Stage 94 revision coverage text "${revisionCoverageRow.revisionCoverageText}", and Stage 94 static revision-check text "${revisionCoverageRow.staticRevisionCheckText}" as deterministic manual revision coverage review-path context only.`,
    staticRevisionFollowUpPromptText:
      `Static revision follow-up prompt for revision coverage row ${sourceRevisionCoverageRowId}: inspect Stage 94 revision coverage row ${sourceRevisionCoverageRowId}, Stage 94 static revision-check cards ${joinOrNone(sourceStaticRevisionCheckCardIds)}, Stage 93 response-readiness review-path step ${revisionCoverageRow.sourceResponseReadinessReviewPathStepId}, Stage 93 static revision-prompt cards ${joinOrNone(revisionCoverageRow.sourceStaticRevisionPromptCardIds)}, Stage 92 response-readiness row ${revisionCoverageRow.sourceResponseReadinessRowId}, Stage 92 static draft-check cards ${joinOrNone(revisionCoverageRow.sourceStaticDraftCheckCardIds)}, anchors ${joinOrNone(revisionCoverageRow.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(revisionCoverageRow.evidenceCallbackIds)}, gap prompts ${joinOrNone(revisionCoverageRow.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(revisionCoverageRow.deferredScopeReminderIds)}, and Stage 94 labels ${joinOrNone([...revisionCoverageRow.revisionCoverageLabels, ...revisionCoverageRow.staticRevisionCheckLabels])} before editing outside the app without saved reviewer answers, answer drafts, revision drafts, reviewer notes, response notes, response-readiness selections, draft-check selections, revision-prompt selections, revision coverage selections, revision-check selections, revision follow-up selections, review path state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static revision coverage review-path context: manual Stage 94 revision-coverage-row, static-revision-check, source-lineage, anchor, callback, gap-prompt, deferred-reminder, and revision follow-up prompt comparison only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved reviewer notes, saved response notes, saved response-readiness selections, saved revision coverage selections, saved revision-check selections, saved revision follow-up selections, saved review path state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      revisionCoverageRow.staticNonGoalFlags,
    ),
  };
}

function buildStaticRevisionFollowUpPromptCard(
  staticRevisionCheckCard: Stage94StaticRevisionCheckCard,
  revisionCoverageRows: Stage94Row[],
): ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPathStaticRevisionFollowUpPromptCardView {
  const sourceStaticRevisionCheckCardId =
    staticRevisionCheckCard.staticRevisionCheckCardId;
  const matchedRevisionCoverageRows = revisionCoverageRows.filter((row) =>
    rowMatchesStaticRevisionFollowUpPromptCard(row, staticRevisionCheckCard),
  );
  const sourceRevisionCoverageRowIds = matchedRevisionCoverageRows.map(
    (row) => row.revisionCoverageRowId,
  );
  const revisionCoverageReviewPathLabels =
    buildCardRevisionCoverageReviewPathLabels(
      staticRevisionCheckCard,
      matchedRevisionCoverageRows,
    );
  const staticRevisionFollowUpPromptLabels =
    buildCardStaticRevisionFollowUpPromptLabels(
      staticRevisionCheckCard,
      matchedRevisionCoverageRows,
    );
  const staticRevisionFollowUpPromptCardId =
    `constraint-response-evidence-gap-follow-up-coverage-review-response-readiness-review-path-revision-coverage-review-path:static-revision-follow-up:${sourceStaticRevisionCheckCardId}`;

  return {
    ...staticRevisionCheckCard,
    staticRevisionFollowUpPromptCardId,
    staticRevisionFollowUpPromptCardIds: [staticRevisionFollowUpPromptCardId],
    staticRevisionFollowUpPromptOrder:
      staticRevisionCheckCard.staticRevisionCheckOrder,
    sourceStaticRevisionCheckCardId,
    sourceStaticRevisionCheckCardIds: [sourceStaticRevisionCheckCardId],
    sourceRevisionCoverageRowIds,
    revisionCoverageReviewPathLabels,
    staticRevisionFollowUpPromptLabels,
    revisionCoverageReviewPathText:
      `Revision coverage review-path card ${sourceStaticRevisionCheckCardId}: carry Stage 94 static revision-check card ${sourceStaticRevisionCheckCardId}, Stage 94 revision coverage rows ${joinOrNone(sourceRevisionCoverageRowIds)}, Stage 93 static revision-prompt card ${staticRevisionCheckCard.sourceStaticRevisionPromptCardId}, Stage 93 response-readiness review path steps ${joinOrNone(staticRevisionCheckCard.sourceResponseReadinessReviewPathStepIds)}, Stage 92 static draft-check card ${staticRevisionCheckCard.sourceStaticDraftCheckCardId}, Stage 92 response-readiness rows ${joinOrNone(staticRevisionCheckCard.sourceResponseReadinessRowIds)}, Stage 91 static response cue card ${staticRevisionCheckCard.sourceStaticResponseCueCardId}, Stage 91 coverage-review path steps ${joinOrNone(staticRevisionCheckCard.sourceCoverageReviewPathStepIds)}, Stage 90 static review prompt card ${staticRevisionCheckCard.sourceStaticReviewPromptCardId}, Stage 90 coverage rows ${joinOrNone(staticRevisionCheckCard.sourceCoverageRowIds)}, Stage 89 static readiness cue ${staticRevisionCheckCard.sourceStaticReadinessCueCardId}, Stage 89 follow-up review path steps ${joinOrNone(staticRevisionCheckCard.sourceFollowUpReviewPathStepIds)}, Stage 88 static follow-up prompt card ${staticRevisionCheckCard.sourceStaticFollowUpPromptCardId}, Stage 88 readiness rows ${joinOrNone(staticRevisionCheckCard.sourceEvidenceGapReadinessRowIds)}, Stage 87 citation-gap cue ${staticRevisionCheckCard.sourceStaticCitationGapCueCardId}, Stage 87 evidence-check review path steps ${joinOrNone(staticRevisionCheckCard.sourceEvidenceCheckReviewPathStepIds)}, Stage 86 citation-review lane row ${staticRevisionCheckCard.sourceCitationReviewLaneRowId}, Stage 86 static evidence-check prompt cards ${joinOrNone(staticRevisionCheckCard.sourceStaticEvidenceCheckPromptCardIds)}, Stage 85 citation prompt card ${staticRevisionCheckCard.sourceStaticCitationCheckPromptCardId}, Stage 85 source follow-up map entries ${joinOrNone(staticRevisionCheckCard.sourceSourceFollowUpMapEntryIds)}, anchors ${joinOrNone(staticRevisionCheckCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticRevisionCheckCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticRevisionCheckCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticRevisionCheckCard.deferredScopeReminderIds)}, revision coverage review-path labels ${joinOrNone(revisionCoverageReviewPathLabels)}, static revision follow-up prompt labels ${joinOrNone(staticRevisionFollowUpPromptLabels)}, Stage 94 revision coverage text "${staticRevisionCheckCard.revisionCoverageText}", and Stage 94 static revision-check text "${staticRevisionCheckCard.staticRevisionCheckText}" as deterministic manual revision coverage review-path context only.`,
    staticRevisionFollowUpPromptText:
      `Static revision follow-up prompt card ${sourceStaticRevisionCheckCardId}: inspect Stage 94 static revision-check card ${sourceStaticRevisionCheckCardId}, Stage 94 revision coverage rows ${joinOrNone(sourceRevisionCoverageRowIds)}, Stage 93 static revision-prompt card ${staticRevisionCheckCard.sourceStaticRevisionPromptCardId}, Stage 92 static draft-check card ${staticRevisionCheckCard.sourceStaticDraftCheckCardId}, Stage 91 static response cue card ${staticRevisionCheckCard.sourceStaticResponseCueCardId}, Stage 90 static review prompt card ${staticRevisionCheckCard.sourceStaticReviewPromptCardId}, Stage 89 static readiness cue ${staticRevisionCheckCard.sourceStaticReadinessCueCardId}, Stage 88 static follow-up prompt card ${staticRevisionCheckCard.sourceStaticFollowUpPromptCardId}, Stage 87 citation-gap cue ${staticRevisionCheckCard.sourceStaticCitationGapCueCardId}, Stage 86 citation-review lane row ${staticRevisionCheckCard.sourceCitationReviewLaneRowId}, Stage 85 citation prompt card ${staticRevisionCheckCard.sourceStaticCitationCheckPromptCardId}, anchors ${joinOrNone(staticRevisionCheckCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticRevisionCheckCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticRevisionCheckCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticRevisionCheckCard.deferredScopeReminderIds)}, and Stage 94 labels ${joinOrNone([...staticRevisionCheckCard.revisionCoverageLabels, ...staticRevisionCheckCard.staticRevisionCheckLabels])} before editing outside the app without saved reviewer answers, answer drafts, revision drafts, reviewer notes, response notes, response-readiness selections, draft-check selections, revision-prompt selections, revision coverage selections, revision-check selections, revision follow-up selections, review path state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static revision follow-up prompt context: manual Stage 94 static-revision-check, revision-coverage-row, source-lineage, anchor, callback, gap-prompt, and deferred-reminder review only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved reviewer notes, saved response notes, saved response-readiness selections, saved revision coverage selections, saved revision-check selections, saved revision follow-up selections, saved review path state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticRevisionCheckCard.staticNonGoalFlags,
    ),
  };
}

function rowMatchesStaticRevisionFollowUpPromptCard(
  revisionCoverageRow: Stage94Row,
  staticRevisionCheckCard: Stage94StaticRevisionCheckCard,
): boolean {
  return (
    revisionCoverageRow.sourceStaticRevisionPromptCardIds.includes(
      staticRevisionCheckCard.sourceStaticRevisionPromptCardId,
    ) ||
    staticRevisionCheckCard.sourceResponseReadinessReviewPathStepIds.includes(
      revisionCoverageRow.sourceResponseReadinessReviewPathStepId,
    )
  );
}

function buildCounts(
  revisionCoverageReviewPathSteps: ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPathStepView[],
  staticRevisionFollowUpPromptCards: ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPathStaticRevisionFollowUpPromptCardView[],
  revisionCoverageBoard: Stage94View,
): ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPathSummaryView["counts"] {
  const sourceCounts = revisionCoverageBoard.summary.counts;

  return {
    ...sourceCounts,
    revisionCoverageReviewPathStepCount:
      revisionCoverageReviewPathSteps.length,
    staticRevisionFollowUpPromptCardCount:
      staticRevisionFollowUpPromptCards.length,
    revisionCoverageReviewPathLabelCount: unique([
      ...revisionCoverageReviewPathSteps.flatMap(
        (step) => step.revisionCoverageReviewPathLabels,
      ),
      ...staticRevisionFollowUpPromptCards.flatMap(
        (card) => card.revisionCoverageReviewPathLabels,
      ),
    ]).length,
    staticRevisionFollowUpPromptLabelCount: unique([
      ...revisionCoverageReviewPathSteps.flatMap(
        (step) => step.staticRevisionFollowUpPromptLabels,
      ),
      ...staticRevisionFollowUpPromptCards.flatMap(
        (card) => card.staticRevisionFollowUpPromptLabels,
      ),
    ]).length,
    localOnlyRevisionCoverageReviewPathStepCount:
      revisionCoverageReviewPathSteps.filter((step) => step.localOnly).length,
    localOnlyStaticRevisionFollowUpPromptCardCount:
      staticRevisionFollowUpPromptCards.filter((card) => card.localOnly).length,
  };
}

function buildStepRevisionCoverageReviewPathLabels(
  revisionCoverageRow: Stage94Row,
  matchedStaticRevisionCheckCards: Stage94StaticRevisionCheckCard[],
): string[] {
  const labels = [
    "revision coverage review-path step",
    "Stage 94 revision coverage row carry-forward",
  ];

  if (matchedStaticRevisionCheckCards.length) {
    labels.push("matched Stage 94 static revision-check context");
  }

  if (revisionCoverageRow.revisionCoverageLabels.length) {
    labels.push("revision coverage label carry-forward");
  }

  return labels;
}

function buildStepStaticRevisionFollowUpPromptLabels(
  revisionCoverageRow: Stage94Row,
  matchedStaticRevisionCheckCards: Stage94StaticRevisionCheckCard[],
): string[] {
  const labels = [
    "static revision follow-up prompt carry-forward",
    "Stage 94 revision coverage review-path comparison",
  ];

  if (matchedStaticRevisionCheckCards.length) {
    labels.push("matched Stage 94 static revision-check card");
  }

  if (
    revisionCoverageRow.gapDiscussionPointIds.length ||
    revisionCoverageRow.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder follow-up");
  }

  return labels;
}

function buildCardRevisionCoverageReviewPathLabels(
  staticRevisionCheckCard: Stage94StaticRevisionCheckCard,
  matchedRevisionCoverageRows: Stage94Row[],
): string[] {
  const labels = [
    "revision coverage review-path card",
    "Stage 94 static revision-check carry-forward",
  ];

  if (matchedRevisionCoverageRows.length) {
    labels.push("matched revision coverage rows");
  }

  if (staticRevisionCheckCard.revisionCoverageLabels.length) {
    labels.push("revision coverage card label carry-forward");
  }

  return labels;
}

function buildCardStaticRevisionFollowUpPromptLabels(
  staticRevisionCheckCard: Stage94StaticRevisionCheckCard,
  matchedRevisionCoverageRows: Stage94Row[],
): string[] {
  const labels = [
    "static revision follow-up prompt card",
    "Stage 94 static revision-check carry-forward",
  ];

  if (matchedRevisionCoverageRows.length) {
    labels.push("matched revision coverage row context");
  }

  if (
    staticRevisionCheckCard.gapDiscussionPointIds.length ||
    staticRevisionCheckCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder follow-up");
  }

  return labels;
}

function staticNonGoalFlags(
  sourceFlags: StaticRevisionCoverageReviewPathSourceFlags,
): ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPathStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedRevisionCoverageReviewPathState: true,
    noSavedRevisionCoverageReviewPathSteps: true,
    noSavedRevisionCoverageReviewPathSelections: true,
    noSavedRevisionFollowUpPromptState: true,
    noSavedRevisionFollowUpPromptSelections: true,
    noSavedStaticRevisionFollowUpPromptCards: true,
  };
}

function joinOrNone(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

type StaticRevisionCoverageReviewPathSourceFlags = Stage94StaticNonGoalFlags;
