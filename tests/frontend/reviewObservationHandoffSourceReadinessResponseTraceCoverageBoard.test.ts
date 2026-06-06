import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  buildMissionConsoleView,
} from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard } from "../../frontend/src/lib/reviewObservationHandoffSourceReadinessResponseTraceCoverageBoard.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard derives ordered coverage rows from Stage 58 trace rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const traceMap = view.reviewObservationHandoffSourceReadinessResponseTraceMap;
  const coverageBoard =
    buildReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard(
      traceMap,
    );
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(traceMap);
  assert.ok(coverageBoard);
  assert.equal(
    coverageBoard.schema,
    "telemforge.review_observation_handoff_source_readiness_response_trace_coverage_board.v1",
  );
  assert.equal(coverageBoard.version, 1);
  assert.equal(
    coverageBoard.contractLabel,
    "local deterministic observation handoff source readiness response trace coverage board and static gap notes",
  );
  assert.equal(coverageBoard.localStatus, "fixture");
  assert.strictEqual(
    coverageBoard.sourceReviewObservationHandoffSourceReadinessResponseTraceMap,
    traceMap,
  );
  assert.deepEqual(coverageBoard.summary.defaultCoverageContext, {
    defaultCoverageRowId:
      coverageBoard.defaultCoverageRow.sourceReadinessResponseTraceCoverageRowId,
    defaultTraceRowId:
      traceMap.summary.defaultResponseTraceContext.defaultTraceRowId,
    defaultResponseTraceRowId:
      coverageBoard.defaultCoverageRow.sourceReadinessResponseTraceRowId,
    defaultGapNoteCardId:
      coverageBoard.defaultGapNoteCard
        .sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
    defaultSourceAlignmentNoteCardId:
      coverageBoard.defaultGapNoteCard
        .sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
    sourceReadinessResponseTraceMapSummary: traceMap.summary.summary,
    sourceReadinessResponseTraceMapDefaultContext:
      traceMap.summary.defaultResponseTraceContext,
  });
  assert.deepEqual(
    coverageBoard.coverageRows.map((row) => [
      row.coverageOrder,
      row.sourceReadinessResponseTraceRowId,
      row.sourceReadinessResponseTraceRowIds,
      row.sourceReadinessResponseWalkthroughStepId,
      row.sourceReadinessResponseWalkthroughStepIds,
      row.sourceReadinessResponseRowId,
      row.sourceReadinessResponseRowIds,
      row.sourceReadinessQuestionRowId,
      row.sourceReadinessQuestionRowIds,
      row.matchedStaticEvidenceNoteRowIds,
      row.matchedStaticFollowUpPromptRowIds,
      row.matchedSourceAlignmentNoteCardIds,
      row.sourceLocalAnchorHrefs,
      row.sourceAnchorTargetIds,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
      row.responseNoteCue,
      row.reviewerCueText,
      row.sourceAlignmentNoteText,
      row.coverageNoteText,
    ]),
    traceMap.responseTraceRows.map((row) => [
      row.traceOrder,
      row.sourceReadinessResponseTraceRowId,
      [row.sourceReadinessResponseTraceRowId],
      row.sourceReadinessResponseWalkthroughStepId,
      [row.sourceReadinessResponseWalkthroughStepId],
      row.sourceReadinessResponseRowId,
      row.sourceReadinessResponseRowIds,
      row.sourceReadinessQuestionRowId,
      row.sourceReadinessQuestionRowIds,
      row.matchedStaticEvidenceNoteRowIds,
      row.matchedStaticFollowUpPromptRowIds,
      traceMap.staticSourceAlignmentNoteCards
        .filter(
          (card) =>
            card.matchedResponseRowIds.includes(
              row.sourceReadinessResponseRowId,
            ) ||
            card.matchedQuestionRowIds.includes(
              row.sourceReadinessQuestionRowId,
            ),
        )
        .map(
          (card) =>
            card.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
        ),
      row.localAnchorHrefs,
      row.anchorTargetIds,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
      row.responseNoteCue,
      row.reviewerCueText,
      row.sourceAlignmentNoteText,
      `Coverage ${row.sourceReadinessResponseTraceRowId} connects to source alignment notes ${traceMap.staticSourceAlignmentNoteCards
        .filter(
          (card) =>
            card.matchedResponseRowIds.includes(
              row.sourceReadinessResponseRowId,
            ) ||
            card.matchedQuestionRowIds.includes(
              row.sourceReadinessQuestionRowId,
            ),
        )
        .map(
          (card) =>
            card.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
        )
        .join(", ") || "none"}, evidence notes ${row.matchedStaticEvidenceNoteRowIds.join(", ")}, follow-up prompts ${row.matchedStaticFollowUpPromptRowIds.join(", ")}, anchors ${row.anchorTargetIds.join(", ")}, callbacks ${row.evidenceCallbackIds.join(", ")}, gap prompts ${row.gapDiscussionPointIds.join(", ")}, and deferred reminders ${row.deferredScopeReminderIds.join(", ")} as static coverage context only.`,
    ]),
  );
  assert.deepEqual(
    coverageBoard.staticGapNoteCards.map((card) => [
      card.gapNoteOrder,
      card.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
      card.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardIds,
      card.sourceReadinessStaticEvidenceNoteRowId,
      card.sourceReadinessStaticEvidenceNoteRowIds,
      card.sourceReadinessStaticFollowUpPromptRowId,
      card.sourceReadinessStaticFollowUpPromptRowIds,
      card.matchedResponseTraceRowIds,
      card.matchedResponseRowIds,
      card.matchedQuestionRowIds,
      card.matchedSourceFollowUpPromptRowIds,
      card.sourceLocalAnchorHrefs,
      card.sourceAnchorTargetIds,
      card.localAnchorHref,
      card.anchorTargetId,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.responseNoteCue,
      card.cueText,
      card.gapNoteText,
      card.sourceAlignmentNoteText,
    ]),
    traceMap.staticSourceAlignmentNoteCards.map((card) => [
      card.noteOrder,
      card.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
      [card.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId],
      card.sourceReadinessStaticEvidenceNoteRowId,
      card.sourceReadinessStaticEvidenceNoteRowIds,
      card.sourceReadinessStaticFollowUpPromptRowId,
      card.sourceReadinessStaticFollowUpPromptRowIds,
      traceMap.responseTraceRows
        .filter(
          (row) =>
            card.matchedResponseRowIds.includes(
              row.sourceReadinessResponseRowId,
            ) ||
            card.matchedQuestionRowIds.includes(
              row.sourceReadinessQuestionRowId,
            ),
        )
        .map((row) => row.sourceReadinessResponseTraceRowId),
      card.matchedResponseRowIds,
      card.matchedQuestionRowIds,
      card.matchedSourceFollowUpPromptRowIds,
      card.sourceLocalAnchorHrefs,
      card.sourceAnchorTargetIds,
      card.localAnchorHref,
      card.anchorTargetId,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.responseNoteCue,
      card.cueText,
      `Gap note ${card.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId} ties trace rows ${traceMap.responseTraceRows
        .filter(
          (row) =>
            card.matchedResponseRowIds.includes(
              row.sourceReadinessResponseRowId,
            ) ||
            card.matchedQuestionRowIds.includes(
              row.sourceReadinessQuestionRowId,
            ),
        )
        .map((row) => row.sourceReadinessResponseTraceRowId)
        .join(", ") || "none"} to evidence note ${card.sourceReadinessStaticEvidenceNoteRowId}, follow-up prompt ${card.sourceReadinessStaticFollowUpPromptRowId}, anchors ${card.sourceAnchorTargetIds.join(", ")}, callbacks ${card.evidenceCallbackIds.join(", ")}, gap prompts ${card.gapDiscussionPointIds.join(", ")}, and deferred reminders ${card.deferredScopeReminderIds.join(", ")} as a static gap-note reference only.`,
      card.alignmentNoteText,
    ]),
  );
  assert.ok(
    coverageBoard.coverageRows.every(
      (row) =>
        row.coverageNoteText.includes(row.sourceReadinessResponseTraceRowId) &&
        row.coverageNoteText.includes(row.sourceReadinessResponseRowId) &&
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
          .noSavedSourceReadinessResponseTraceCoverageProgress &&
        row.staticNonGoalFlags.noSavedTraceCoverageProgress &&
        row.staticNonGoalFlags.noSavedGapNotes &&
        row.staticNonGoalFlags.noSavedSourceReadinessResponseTraceProgress &&
        row.staticNonGoalFlags.noSavedTraceProgress &&
        row.staticNonGoalFlags
          .noSavedSourceReadinessResponseWalkthroughProgress &&
        row.staticNonGoalFlags.noSavedWalkthroughProgress &&
        row.staticNonGoalFlags.noSavedSourceReadinessResponseProgress &&
        row.staticNonGoalFlags.noSavedReviewerAnswers &&
        row.staticNonGoalFlags.noSavedSourceReadinessQuestionProgress &&
        row.staticNonGoalFlags.noSavedSourceReadinessRehearsalProgress &&
        row.staticNonGoalFlags.noSavedSourceReadinessProgress &&
        row.staticNonGoalFlags.noSavedSourceReadoutProgress &&
        row.staticNonGoalFlags.noSavedSourceWalkthroughProgress &&
        row.staticNonGoalFlags.noSavedSourceInspectionState &&
        row.staticNonGoalFlags.noSavedAnchorState &&
        row.staticNonGoalFlags.noSavedRelayProgress &&
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
    coverageBoard.staticGapNoteCards.every(
      (card) =>
        card.gapNoteText.includes(
          card.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
        ) &&
        card.gapNoteText.includes(card.sourceReadinessStaticEvidenceNoteRowId) &&
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
          .noSavedSourceReadinessResponseTraceCoverageProgress &&
        card.staticNonGoalFlags.noSavedTraceCoverageProgress &&
        card.staticNonGoalFlags.noSavedGapNotes &&
        card.staticNonGoalFlags.noSavedSourceReadinessResponseTraceProgress &&
        card.staticNonGoalFlags.noSavedTraceProgress &&
        card.staticNonGoalFlags
          .noSavedSourceReadinessResponseWalkthroughProgress &&
        card.staticNonGoalFlags.noSavedWalkthroughProgress &&
        card.staticNonGoalFlags.noSavedSourceReadinessResponseProgress &&
        card.staticNonGoalFlags.noSavedReviewerAnswers &&
        card.staticNonGoalFlags.noSavedSourceReadinessQuestionProgress &&
        card.staticNonGoalFlags.noSavedSourceReadinessRehearsalProgress &&
        card.staticNonGoalFlags.noSavedSourceReadinessProgress &&
        card.staticNonGoalFlags.noSavedSourceReadoutProgress &&
        card.staticNonGoalFlags.noSavedSourceWalkthroughProgress &&
        card.staticNonGoalFlags.noSavedSourceInspectionState &&
        card.staticNonGoalFlags.noSavedAnchorState &&
        card.staticNonGoalFlags.noSavedRelayProgress &&
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

  assert.ok(
    missionConsoleSource.includes(
      'id="review-observation-handoff-source-readiness-response-trace-coverage-board"',
    ),
    "Mission console should expose a local Stage 59 trace coverage board anchor",
  );
});
