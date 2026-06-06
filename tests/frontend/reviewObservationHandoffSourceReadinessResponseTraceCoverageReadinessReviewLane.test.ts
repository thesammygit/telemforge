import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief } from "../../frontend/src/lib/reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief.ts";
import { buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane } from "../../frontend/src/lib/reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane derives ordered review lane rows from Stage 61 readiness brief rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const reviewPath =
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath;
  const readinessBrief =
    buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief(
      reviewPath,
    );
  const reviewLane =
    buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane(
      readinessBrief,
    );
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(reviewPath);
  assert.ok(readinessBrief);
  assert.ok(reviewLane);
  assert.equal(
    reviewLane.schema,
    "telemforge.review_observation_handoff_source_readiness_response_trace_coverage_readiness_review_lane.v1",
  );
  assert.equal(reviewLane.version, 1);
  assert.equal(
    reviewLane.contractLabel,
    "local deterministic observation handoff source readiness response trace coverage readiness review lane and static human-check prompts",
  );
  assert.equal(reviewLane.localStatus, "fixture");
  assert.strictEqual(
    reviewLane.sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief,
    readinessBrief,
  );
  assert.deepEqual(reviewLane.summary.defaultReviewLaneContext, {
    defaultReviewLaneRowId:
      reviewLane.defaultReviewLaneRow
        .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
    defaultReadinessBriefRowId:
      reviewLane.defaultReviewLaneRow
        .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    defaultReviewPathStepId:
      readinessBrief.summary.defaultReadinessBriefContext
        .defaultReviewPathStepId,
    defaultCoverageRowId:
      reviewLane.defaultReviewLaneRow.sourceReadinessResponseTraceCoverageRowId,
    defaultTraceRowId:
      reviewLane.defaultReviewLaneRow.sourceReadinessResponseTraceRowId,
    defaultResponseTraceRowId:
      reviewLane.defaultReviewLaneRow.sourceReadinessResponseTraceRowId,
    defaultStaticHumanCheckPromptCardId:
      reviewLane.defaultStaticHumanCheckPromptCard
        .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
    defaultStaticReviewerCueCardId:
      reviewLane.defaultStaticHumanCheckPromptCard
        .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
    defaultStaticHandoffPromptCardId:
      reviewLane.defaultStaticHumanCheckPromptCard
        .sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
    defaultGapNoteCardId:
      reviewLane.defaultStaticHumanCheckPromptCard
        .sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
    sourceReadinessResponseTraceCoverageReadinessBriefSummary:
      readinessBrief.summary.summary,
    sourceReadinessResponseTraceCoverageReadinessBriefDefaultContext:
      readinessBrief.summary.defaultReadinessBriefContext,
  });
  assert.equal(
    reviewLane.summary.counts.reviewLaneRowCount,
    readinessBrief.readinessBriefRows.length,
  );
  assert.equal(
    reviewLane.summary.counts.staticHumanCheckPromptCardCount,
    readinessBrief.staticReviewerCueCards.length,
  );
  assert.deepEqual(
    reviewLane.reviewLaneRows.map(
      (row) => row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    ),
    readinessBrief.readinessBriefRows.map(
      (row) => row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    ),
  );
  assert.deepEqual(
    reviewLane.reviewLaneRows.map(
      (row) => row.sourceReadinessResponseTraceCoverageReviewPathStepId,
    ),
    readinessBrief.readinessBriefRows.map(
      (row) => row.sourceReadinessResponseTraceCoverageReviewPathStepId,
    ),
  );
  assert.deepEqual(
    reviewLane.reviewLaneRows.map((row) => row.reviewLaneOrder),
    readinessBrief.readinessBriefRows.map((row) => row.readinessBriefOrder),
  );
  assert.deepEqual(
    reviewLane.reviewLaneRows.map(
      (row) => row.matchedStaticReviewerCueCardIds.length,
    ),
    readinessBrief.readinessBriefRows.map((row) =>
      readinessBrief.staticReviewerCueCards.filter(
        (card) =>
          card.matchedReviewPathStepIds.includes(
            row.sourceReadinessResponseTraceCoverageReviewPathStepId,
          ) ||
          card.matchedCoverageRowIds.includes(
            row.sourceReadinessResponseTraceCoverageRowId,
          ) ||
          row.matchedStaticHandoffPromptCardIds.includes(
            card.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
          ),
      ).length,
    ),
  );
  assert.ok(
    reviewLane.reviewLaneRows.every(
      (row) =>
        row.reviewLaneText.includes(
          row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        ) &&
        row.humanCheckPromptText.includes(
          row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
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
  assert.deepEqual(
    reviewLane.staticHumanCheckPromptCards.map(
      (card) => card.sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
    ),
    readinessBrief.staticReviewerCueCards.map(
      (card) => card.sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
    ),
  );
  assert.deepEqual(
    reviewLane.staticHumanCheckPromptCards.map((card) => card.humanCheckPromptOrder),
    readinessBrief.staticReviewerCueCards.map((card) => card.reviewerCueOrder),
  );
  assert.deepEqual(
    reviewLane.staticHumanCheckPromptCards.map((card) => card.matchedReadinessBriefRowIds.length),
    readinessBrief.staticReviewerCueCards.map((card) =>
      readinessBrief.readinessBriefRows.filter(
        (row) =>
          card.matchedReviewPathStepIds.includes(
            row.sourceReadinessResponseTraceCoverageReviewPathStepId,
          ) ||
          card.matchedCoverageRowIds.includes(
            row.sourceReadinessResponseTraceCoverageRowId,
          ) ||
          row.matchedStaticHandoffPromptCardIds.includes(
            card.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
          ),
      ).length,
    ),
  );
  assert.ok(
    reviewLane.staticHumanCheckPromptCards.every(
      (card) =>
        card.humanCheckPromptText.includes(card.anchorTargetId) &&
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
        card.staticNonGoalFlags
          .noSavedSourceReadinessResponseTraceCoverageReviewProgress &&
        card.staticNonGoalFlags.noSavedCoverageReviewProgress &&
        card.staticNonGoalFlags.noSavedCoverageProgress &&
        card.staticNonGoalFlags.noSavedHandoffPromptEdits &&
        card.staticNonGoalFlags.noSavedTraceCoverageProgress &&
        card.staticNonGoalFlags.noSavedGapNotes &&
        card.staticNonGoalFlags.noSavedReviewerAnswers &&
        card.staticNonGoalFlags.noSavedSourceReadinessResponseProgress &&
        card.staticNonGoalFlags.noSavedSourceInspectionState &&
        card.staticNonGoalFlags.noSavedAnchorState &&
        card.staticNonGoalFlags.noSavedRelayProgress &&
        card.staticNonGoalFlags
          .noSavedSourceReadinessResponseTraceCoverageReadinessReviewLaneState &&
        card.staticNonGoalFlags.noSavedReviewLaneState &&
        card.staticNonGoalFlags.noSavedHumanCheckPrompts &&
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
      "review-observation-handoff-source-readiness-response-trace-coverage-readiness-review-lane",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Readiness review lane and static human-check prompts",
    ),
  );
  assert.ok(
    missionConsoleSource.includes("No saved review-lane state"),
  );
  assert.ok(
    missionConsoleSource.includes("No saved human-check prompts"),
  );
});
