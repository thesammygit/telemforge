import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import type {
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardView,
} from "../../frontend/src/features/mission-console/types.ts";
import { buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage } from "../../frontend/src/lib/reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage derives ordered triage rows from Stage 63 synthesis rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const synthesis =
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis;
  const followUpTriage =
    buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage(
      synthesis,
    );
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(synthesis);
  assert.ok(followUpTriage);
  assert.equal(
    followUpTriage.schema,
    "telemforge.review_observation_handoff_source_readiness_response_trace_coverage_readiness_review_synthesis_follow_up_triage.v1",
  );
  assert.equal(followUpTriage.version, 1);
  assert.equal(
    followUpTriage.contractLabel,
    "local deterministic observation handoff source readiness response trace coverage readiness review synthesis follow-up triage and static check prompts",
  );
  assert.equal(followUpTriage.localStatus, "fixture");
  assert.strictEqual(
    followUpTriage.sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis,
    synthesis,
  );
  assert.deepEqual(followUpTriage.summary.defaultFollowUpTriageContext, {
    defaultFollowUpTriageRowId:
      followUpTriage.defaultFollowUpTriageRow
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
    defaultSynthesisRowId:
      followUpTriage.defaultFollowUpTriageRow
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
    defaultReviewLaneRowId:
      followUpTriage.defaultFollowUpTriageRow
        .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
    defaultReadinessBriefRowId:
      followUpTriage.defaultFollowUpTriageRow
        .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    defaultReviewPathStepId:
      followUpTriage.defaultFollowUpTriageRow
        .sourceReadinessResponseTraceCoverageReviewPathStepId,
    defaultCoverageRowId:
      followUpTriage.defaultFollowUpTriageRow
        .sourceReadinessResponseTraceCoverageRowId,
    defaultTraceRowId:
      followUpTriage.defaultFollowUpTriageRow
        .sourceReadinessResponseTraceRowId,
    defaultStaticCheckPromptCardId:
      followUpTriage.defaultStaticCheckPromptCard
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
    defaultStaticFollowUpNoteCardId:
      followUpTriage.defaultStaticCheckPromptCard
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
    defaultStaticHumanCheckPromptCardId:
      followUpTriage.defaultStaticCheckPromptCard
        .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
    defaultStaticReviewerCueCardId:
      followUpTriage.defaultStaticCheckPromptCard
        .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
    defaultStaticHandoffPromptCardId:
      synthesis.summary.defaultReviewSynthesisContext
        .defaultStaticHandoffPromptCardId,
    sourceReadinessResponseTraceCoverageReadinessReviewSynthesisSummary:
      synthesis.summary.summary,
    sourceReadinessResponseTraceCoverageReadinessReviewSynthesisDefaultContext:
      synthesis.summary.defaultReviewSynthesisContext,
  });
  assert.equal(
    followUpTriage.summary.counts.followUpTriageRowCount,
    synthesis.synthesisRows.length,
  );
  assert.equal(
    followUpTriage.summary.counts.staticCheckPromptCardCount,
    synthesis.staticFollowUpNoteCards.length,
  );
  assert.deepEqual(
    followUpTriage.followUpTriageRows.map(
      (row) =>
        row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
    ),
    synthesis.synthesisRows.map(
      (row) =>
        row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
    ),
  );
  assert.deepEqual(
    followUpTriage.followUpTriageRows.map(
      (row) => row.followUpTriageRowOrder,
    ),
    synthesis.synthesisRows.map((row) => row.synthesisRowOrder),
  );
  assert.deepEqual(
    followUpTriage.followUpTriageRows.map((row) => [
      row.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
      row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
      row.sourceReadinessResponseTraceCoverageReviewPathStepId,
      row.sourceReadinessResponseTraceCoverageRowId,
      row.sourceReadinessResponseTraceRowId,
      row.sourceReadinessResponseWalkthroughStepId,
      row.sourceReadinessResponseRowId,
      row.sourceReadinessQuestionRowId,
      row.matchedStaticReviewerCueCardIds,
      row.matchedStaticHumanCheckPromptCardIds,
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
      row.followUpNoteText,
    ]),
    synthesis.synthesisRows.map((row) => [
      row.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
      row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
      row.sourceReadinessResponseTraceCoverageReviewPathStepId,
      row.sourceReadinessResponseTraceCoverageRowId,
      row.sourceReadinessResponseTraceRowId,
      row.sourceReadinessResponseWalkthroughStepId,
      row.sourceReadinessResponseRowId,
      row.sourceReadinessQuestionRowId,
      row.matchedStaticReviewerCueCardIds,
      row.matchedStaticHumanCheckPromptCardIds,
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
      row.followUpNoteText,
    ]),
  );
  assert.deepEqual(
    followUpTriage.followUpTriageRows.map(
      (row) => row.matchedStaticFollowUpNoteCardIds,
    ),
    synthesis.synthesisRows.map((row) =>
      expectedStaticFollowUpNoteCardIdsForSynthesisRow(
        row,
        synthesis.staticFollowUpNoteCards,
      ),
    ),
  );
  assert.ok(
    followUpTriage.followUpTriageRows.every(
      (row) =>
        row.staticCheckPromptText.length > 0 &&
        row.staticCheckPromptText.includes(
          row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
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
        row.staticNonGoalFlags.noSavedSynthesisState &&
        row.staticNonGoalFlags.noSavedFollowUpNotes &&
        row.staticNonGoalFlags.noSavedTriageState &&
        row.staticNonGoalFlags.noSavedFollowUpTriageState &&
        row.staticNonGoalFlags.noSavedStaticCheckPrompts &&
        row.staticNonGoalFlags.noSavedCheckPrompts &&
        row.staticNonGoalFlags.noSavedReviewLaneState &&
        row.staticNonGoalFlags.noSavedHumanCheckPrompts &&
        row.staticNonGoalFlags.noSavedReadinessBriefState &&
        row.staticNonGoalFlags.noSavedReviewerCues &&
        row.staticNonGoalFlags.noSavedCoverageReviewProgress &&
        row.staticNonGoalFlags.noSavedTraceCoverageProgress &&
        row.staticNonGoalFlags.noSavedGapNotes &&
        row.staticNonGoalFlags.noSavedReviewerAnswers &&
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
      "review-observation-handoff-source-readiness-response-trace-coverage-readiness-review-synthesis-follow-up-triage",
    ),
  );
  assert.ok(
    missionConsoleSource.includes("Follow-up triage and static check prompts"),
  );
  assert.ok(missionConsoleSource.includes("No saved triage state"));
  assert.ok(missionConsoleSource.includes("No saved check prompts"));
});

test("buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage preserves Stage 63 static follow-up order for static check prompts", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const synthesis =
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis;
  const followUpTriage =
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage;

  assert.ok(synthesis);
  assert.ok(followUpTriage);
  assert.deepEqual(
    followUpTriage.staticCheckPromptCards.map(
      (card) =>
        card.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
    ),
    synthesis.staticFollowUpNoteCards.map(
      (card) =>
        card.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
    ),
  );
  assert.deepEqual(
    followUpTriage.staticCheckPromptCards.map(
      (card) => card.staticCheckPromptOrder,
    ),
    synthesis.staticFollowUpNoteCards.map((card) => card.followUpNoteOrder),
  );
  assert.deepEqual(
    followUpTriage.staticCheckPromptCards.map((card) => [
      card.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardIds,
      card.sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
      card.sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
      card.matchedFollowUpTriageRowIds,
      card.matchedSynthesisRowIds,
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
    synthesis.staticFollowUpNoteCards.map((card) => {
      const matchedRows = followUpTriage.followUpTriageRows.filter((row) =>
        expectedStaticFollowUpNoteCardIdsForSynthesisRow(
          synthesis.synthesisRows.find(
            (synthesisRow) =>
              synthesisRow
                .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId ===
              row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
          ) ?? synthesis.synthesisRows[0],
          [card],
        ).includes(
          card.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
        ),
      );

      return [
        [
          card.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
        ],
        card.sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
        card.sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
        matchedRows.map(
          (row) =>
            row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        ),
        uniqueStrings([
          ...card.matchedSynthesisRowIds,
          ...matchedRows.map(
            (row) =>
              row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
          ),
        ]),
        uniqueStrings([
          ...card.matchedReviewLaneRowIds,
          ...matchedRows.map(
            (row) =>
              row.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
          ),
        ]),
        uniqueStrings([
          ...card.matchedReadinessBriefRowIds,
          ...matchedRows.map(
            (row) =>
              row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
          ),
        ]),
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
        uniqueStrings([
          ...card.matchedResponseWalkthroughStepIds,
          ...matchedRows.flatMap(
            (row) => row.sourceReadinessResponseWalkthroughStepIds,
          ),
        ]),
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
    followUpTriage.staticCheckPromptCards.every(
      (card) =>
        card.reviewLaneText.length > 0 &&
        card.followUpNoteText.length > 0 &&
        card.staticCheckPromptText.length > 0 &&
        card.staticCheckPromptText.includes(
          card.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
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
        card.staticNonGoalFlags.noSavedSynthesisState &&
        card.staticNonGoalFlags.noSavedFollowUpNotes &&
        card.staticNonGoalFlags.noSavedTriageState &&
        card.staticNonGoalFlags.noSavedStaticCheckPrompts &&
        card.staticNonGoalFlags.noSavedCheckPrompts &&
        card.staticNonGoalFlags.noSavedReviewLaneState &&
        card.staticNonGoalFlags.noSavedHumanCheckPrompts &&
        card.staticNonGoalFlags.noSavedReviewerAnswers &&
        card.staticNonGoalFlags.noPersistence &&
        card.staticNonGoalFlags.noRouteChanges &&
        card.staticNonGoalFlags.noCommandExecution &&
        card.staticNonGoalFlags.noExports &&
        card.staticNonGoalFlags.noOwnerAssignment &&
        card.staticNonGoalFlags.noScoring &&
        card.staticNonGoalFlags.noCertification,
    ),
  );
});

function expectedStaticFollowUpNoteCardIdsForSynthesisRow(
  row: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowView,
  cards: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardView[],
): string[] {
  return cards
    .filter(
      (card) =>
        card.matchedSynthesisRowIds.includes(
          row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
        ) ||
        card.matchedReviewLaneRowIds.includes(
          row.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        ) ||
        row.matchedStaticHumanCheckPromptCardIds.includes(
          card.sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
        ),
    )
    .map(
      (card) =>
        card.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
    );
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)];
}
