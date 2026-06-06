import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import type {
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneRowView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardView,
} from "../../frontend/src/features/mission-console/types.ts";
import { buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis } from "../../frontend/src/lib/reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis derives ordered synthesis rows from Stage 62 review-lane rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const reviewLane =
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane;
  const synthesis =
    buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis(
      reviewLane,
    );
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(reviewLane);
  assert.ok(synthesis);
  assert.equal(
    synthesis.schema,
    "telemforge.review_observation_handoff_source_readiness_response_trace_coverage_readiness_review_synthesis.v1",
  );
  assert.equal(synthesis.version, 1);
  assert.equal(
    synthesis.contractLabel,
    "local deterministic observation handoff source readiness response trace coverage readiness review synthesis and static follow-up notes",
  );
  assert.equal(synthesis.localStatus, "fixture");
  assert.strictEqual(
    synthesis.sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane,
    reviewLane,
  );
  assert.deepEqual(synthesis.summary.defaultReviewSynthesisContext, {
    defaultSynthesisRowId:
      synthesis.defaultSynthesisRow
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
    defaultReviewLaneRowId:
      synthesis.defaultSynthesisRow
        .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
    defaultReadinessBriefRowId:
      synthesis.defaultSynthesisRow
        .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    defaultReviewPathStepId:
      synthesis.defaultSynthesisRow
        .sourceReadinessResponseTraceCoverageReviewPathStepId,
    defaultCoverageRowId:
      synthesis.defaultSynthesisRow.sourceReadinessResponseTraceCoverageRowId,
    defaultTraceRowId:
      synthesis.defaultSynthesisRow.sourceReadinessResponseTraceRowId,
    defaultStaticFollowUpNoteCardId:
      synthesis.defaultStaticFollowUpNoteCard
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
    defaultStaticHumanCheckPromptCardId:
      synthesis.defaultStaticFollowUpNoteCard
        .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
    defaultStaticReviewerCueCardId:
      synthesis.defaultStaticFollowUpNoteCard
        .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
    defaultStaticHandoffPromptCardId:
      reviewLane.summary.defaultReviewLaneContext
        .defaultStaticHandoffPromptCardId,
    sourceReadinessResponseTraceCoverageReadinessReviewLaneSummary:
      reviewLane.summary.summary,
    sourceReadinessResponseTraceCoverageReadinessReviewLaneDefaultContext:
      reviewLane.summary.defaultReviewLaneContext,
  });
  assert.equal(
    synthesis.summary.counts.synthesisRowCount,
    reviewLane.reviewLaneRows.length,
  );
  assert.equal(
    synthesis.summary.counts.staticFollowUpNoteCardCount,
    reviewLane.staticHumanCheckPromptCards.length,
  );
  assert.deepEqual(
    synthesis.synthesisRows.map(
      (row) =>
        row.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
    ),
    reviewLane.reviewLaneRows.map(
      (row) =>
        row.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
    ),
  );
  assert.deepEqual(
    synthesis.synthesisRows.map((row) => row.synthesisRowOrder),
    reviewLane.reviewLaneRows.map((row) => row.reviewLaneOrder),
  );
  assert.deepEqual(
    synthesis.synthesisRows.map((row) => [
      row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
      row.sourceReadinessResponseTraceCoverageReviewPathStepId,
      row.sourceReadinessResponseTraceCoverageRowId,
      row.sourceReadinessResponseTraceRowId,
      row.sourceReadinessResponseWalkthroughStepId,
      row.sourceReadinessResponseRowId,
      row.sourceReadinessQuestionRowId,
      row.matchedStaticReviewerCueCardIds,
      row.matchedStaticHandoffPromptCardIds,
      row.sourceLocalAnchorHrefs,
      row.sourceAnchorTargetIds,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
      row.coverageNoteText,
      row.gapNoteText,
      row.handoffPromptText,
      row.readinessBriefText,
      row.reviewerCueText,
      row.reviewLaneText,
      row.humanCheckPromptText,
    ]),
    reviewLane.reviewLaneRows.map((row) => [
      row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
      row.sourceReadinessResponseTraceCoverageReviewPathStepId,
      row.sourceReadinessResponseTraceCoverageRowId,
      row.sourceReadinessResponseTraceRowId,
      row.sourceReadinessResponseWalkthroughStepId,
      row.sourceReadinessResponseRowId,
      row.sourceReadinessQuestionRowId,
      row.matchedStaticReviewerCueCardIds,
      row.matchedStaticHandoffPromptCardIds,
      row.sourceLocalAnchorHrefs,
      row.sourceAnchorTargetIds,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
      row.coverageNoteText,
      row.gapNoteText,
      row.handoffPromptText,
      row.readinessBriefText,
      row.reviewerCueText,
      row.reviewLaneText,
      row.humanCheckPromptText,
    ]),
  );
  assert.deepEqual(
    synthesis.synthesisRows.map(
      (row) => row.matchedStaticHumanCheckPromptCardIds,
    ),
    reviewLane.reviewLaneRows.map((row) =>
      expectedHumanCheckPromptCardIdsForReviewLaneRow(
        row,
        reviewLane.staticHumanCheckPromptCards,
      ),
    ),
  );
  assert.ok(
    synthesis.synthesisRows.every(
      (row) =>
        row.reviewLaneText.length > 0 &&
        row.humanCheckPromptText.length > 0 &&
        row.followUpNoteText.length > 0 &&
        row.followUpNoteText.includes(
          row.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        ) &&
        row.localOnly &&
        row.sourceBacked &&
        row.inPageOnly &&
        row.explanatoryOnly &&
        row.staticOnly &&
        row.informationalOnly &&
        row.nonActionable &&
        row.nonPersistent &&
        row.nonExecutable &&
        row.nonRouting &&
        row.nonCertifying &&
        row.nonRanking &&
        row.notATask &&
        row.notATicket &&
        row.notAChecklist &&
        row.notOwnerAssigned &&
        row.staticNonGoalFlags
          .noSavedSourceReadinessResponseTraceCoverageReadinessBriefState &&
        row.staticNonGoalFlags.noSavedReadinessBriefState &&
        row.staticNonGoalFlags.noSavedReviewerCues &&
        row.staticNonGoalFlags
          .noSavedSourceReadinessResponseTraceCoverageReviewProgress &&
        row.staticNonGoalFlags.noSavedCoverageReviewProgress &&
        row.staticNonGoalFlags.noSavedCoverageProgress &&
        row.staticNonGoalFlags.noSavedHandoffPromptEdits &&
        row.staticNonGoalFlags
          .noSavedSourceReadinessResponseTraceCoverageProgress &&
        row.staticNonGoalFlags.noSavedTraceCoverageProgress &&
        row.staticNonGoalFlags.noSavedGapNotes &&
        row.staticNonGoalFlags.noSavedReviewerAnswers &&
        row.staticNonGoalFlags.noSavedSourceReadinessResponseProgress &&
        row.staticNonGoalFlags.noSavedSourceInspectionState &&
        row.staticNonGoalFlags.noSavedAnchorState &&
        row.staticNonGoalFlags.noSavedRelayProgress &&
        row.staticNonGoalFlags
          .noSavedSourceReadinessResponseTraceCoverageReadinessReviewLaneState &&
        row.staticNonGoalFlags.noSavedReviewLaneState &&
        row.staticNonGoalFlags.noSavedHumanCheckPrompts &&
        row.staticNonGoalFlags
          .noSavedSourceReadinessResponseTraceCoverageReadinessReviewSynthesisState &&
        row.staticNonGoalFlags.noSavedSynthesisState &&
        row.staticNonGoalFlags.noSavedFollowUpNotes &&
        row.staticNonGoalFlags.noPersistence &&
        row.staticNonGoalFlags.noRouteChanges &&
        row.staticNonGoalFlags.noCommandExecution &&
        row.staticNonGoalFlags.noExports &&
        row.staticNonGoalFlags.noSignoff &&
        row.staticNonGoalFlags.noAuditRetention &&
        row.staticNonGoalFlags.noOwnerAssignment &&
        row.staticNonGoalFlags.noScoring &&
        row.staticNonGoalFlags.noCertification &&
        row.staticNonGoalFlags.noMeetingWorkflow &&
        row.staticNonGoalFlags.noHandoffPackageGeneration &&
        row.staticNonGoalFlags.noTaskLaunchers &&
        row.staticNonGoalFlags.noRunnableChecklists,
    ),
  );

  assert.ok(
    missionConsoleSource.includes(
      "review-observation-handoff-source-readiness-response-trace-coverage-readiness-review-synthesis",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Readiness review synthesis and static follow-up notes",
    ),
  );
  assert.ok(missionConsoleSource.includes("No saved synthesis state"));
  assert.ok(missionConsoleSource.includes("No saved follow-up notes"));
});

test("buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis preserves Stage 62 static human-check order for follow-up notes", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const reviewLane =
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane;
  const synthesis =
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis;

  assert.ok(reviewLane);
  assert.ok(synthesis);
  assert.deepEqual(
    synthesis.staticFollowUpNoteCards.map(
      (card) =>
        card.sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
    ),
    reviewLane.staticHumanCheckPromptCards.map(
      (card) =>
        card.sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
    ),
  );
  assert.deepEqual(
    synthesis.staticFollowUpNoteCards.map((card) => card.followUpNoteOrder),
    reviewLane.staticHumanCheckPromptCards.map(
      (card) => card.humanCheckPromptOrder,
    ),
  );
  assert.deepEqual(
    synthesis.staticFollowUpNoteCards.map((card) => [
      card.sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardIds,
      card.sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
      card.matchedReviewLaneRowIds,
      card.matchedReadinessBriefRowIds,
      card.matchedReviewPathStepIds,
      card.matchedCoverageRowIds,
      card.matchedResponseTraceRowIds,
      card.matchedResponseWalkthroughStepIds,
      card.matchedResponseRowIds,
      card.matchedQuestionRowIds,
      card.sourceLocalAnchorHrefs,
      card.sourceAnchorTargetIds,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
    ]),
    reviewLane.staticHumanCheckPromptCards.map((card) => {
      const matchedRows = reviewLane.reviewLaneRows.filter((row) =>
        expectedHumanCheckPromptCardIdsForReviewLaneRow(row, [card]).includes(
          card.sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
        ),
      );

      return [
        [
          card.sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
        ],
        card.sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
        matchedRows.map(
          (row) =>
            row.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        ),
        card.matchedReadinessBriefRowIds,
        uniqueStrings([
          ...card.matchedReviewPathStepIds,
          ...matchedRows.map(
            (row) =>
              row.sourceReadinessResponseTraceCoverageReviewPathStepId,
          ),
        ]),
        uniqueStrings([
          ...card.matchedCoverageRowIds,
          ...matchedRows.map(
            (row) => row.sourceReadinessResponseTraceCoverageRowId,
          ),
        ]),
        uniqueStrings([
          ...card.matchedResponseTraceRowIds,
          ...matchedRows.map((row) => row.sourceReadinessResponseTraceRowId),
        ]),
        uniqueStrings(
          matchedRows.flatMap(
            (row) => row.sourceReadinessResponseWalkthroughStepIds,
          ),
        ),
        uniqueStrings([
          ...card.matchedResponseRowIds,
          ...matchedRows.map((row) => row.sourceReadinessResponseRowId),
        ]),
        uniqueStrings([
          ...card.matchedQuestionRowIds,
          ...matchedRows.map((row) => row.sourceReadinessQuestionRowId),
        ]),
        card.sourceLocalAnchorHrefs,
        card.sourceAnchorTargetIds,
        card.evidenceCallbackIds,
        card.gapDiscussionPointIds,
        card.deferredScopeReminderIds,
      ];
    }),
  );
  assert.ok(
    synthesis.staticFollowUpNoteCards.every(
      (card) =>
        card.reviewLaneText.length > 0 &&
        card.humanCheckPromptText.length > 0 &&
        card.followUpNoteText.length > 0 &&
        card.humanCheckPromptText.includes(card.anchorTargetId) &&
        card.followUpNoteText.includes(
          card.sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
        ) &&
        card.localOnly &&
        card.sourceBacked &&
        card.inPageOnly &&
        card.explanatoryOnly &&
        card.staticOnly &&
        card.informationalOnly &&
        card.nonActionable &&
        card.nonPersistent &&
        card.nonExecutable &&
        card.nonRouting &&
        card.nonCertifying &&
        card.nonRanking &&
        card.notATask &&
        card.notATicket &&
        card.notAChecklist &&
        card.notOwnerAssigned &&
        card.staticNonGoalFlags
          .noSavedSourceReadinessResponseTraceCoverageReadinessBriefState &&
        card.staticNonGoalFlags.noSavedReadinessBriefState &&
        card.staticNonGoalFlags.noSavedReviewerCues &&
        card.staticNonGoalFlags.noSavedCoverageReviewProgress &&
        card.staticNonGoalFlags.noSavedTraceCoverageProgress &&
        card.staticNonGoalFlags.noSavedGapNotes &&
        card.staticNonGoalFlags.noSavedReviewerAnswers &&
        card.staticNonGoalFlags.noSavedSourceReadinessResponseProgress &&
        card.staticNonGoalFlags.noSavedSourceInspectionState &&
        card.staticNonGoalFlags.noSavedAnchorState &&
        card.staticNonGoalFlags.noSavedRelayProgress &&
        card.staticNonGoalFlags.noSavedReviewLaneState &&
        card.staticNonGoalFlags.noSavedHumanCheckPrompts &&
        card.staticNonGoalFlags.noSavedSynthesisState &&
        card.staticNonGoalFlags.noSavedFollowUpNotes &&
        card.staticNonGoalFlags.noPersistence &&
        card.staticNonGoalFlags.noRouteChanges &&
        card.staticNonGoalFlags.noCommandExecution &&
        card.staticNonGoalFlags.noExports &&
        card.staticNonGoalFlags.noSignoff &&
        card.staticNonGoalFlags.noAuditRetention &&
        card.staticNonGoalFlags.noOwnerAssignment &&
        card.staticNonGoalFlags.noScoring &&
        card.staticNonGoalFlags.noCertification &&
        card.staticNonGoalFlags.noMeetingWorkflow &&
        card.staticNonGoalFlags.noHandoffPackageGeneration &&
        card.staticNonGoalFlags.noTaskLaunchers &&
        card.staticNonGoalFlags.noRunnableChecklists,
    ),
  );
});

function expectedHumanCheckPromptCardIdsForReviewLaneRow(
  row: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneRowView,
  cards: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardView[],
): string[] {
  return cards
    .filter(
      (card) =>
        card.matchedReadinessBriefRowIds.includes(
          row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        ) ||
        row.matchedStaticReviewerCueCardIds.includes(
          card.sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
        ) ||
        row.matchedStaticHandoffPromptCardIds.includes(
          card.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
        ),
    )
    .map(
      (card) =>
        card.sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
    );
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)];
}
