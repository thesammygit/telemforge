import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMap } from "../../frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMap.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildMissionConsoleView derives Stage 76 response-map rows and static follow-up prompts from Stage 75", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const coverageReviewPath =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPath;
  const responseMap =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMap;
  const builtResponseMap =
    buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMap(
      coverageReviewPath,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(coverageReviewPath);
  assert.ok(responseMap);
  assert.ok(builtResponseMap);
  assert.strictEqual(
    builtResponseMap.sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPath,
    coverageReviewPath,
  );
  assert.equal(
    responseMap.schema,
    "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix_review_path_response_map.v1",
  );
  assert.equal(responseMap.version, 1);
  assert.equal(
    responseMap.contractLabel,
    "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage-review response map and static follow-up prompts",
  );
  assert.equal(responseMap.localStatus, "fixture");
  assert.deepEqual(
    responseMap.summary.defaultResponseMapContext
      .sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathDefaultContext,
    coverageReviewPath.summary.defaultCoverageReviewContext,
  );
  assert.equal(
    responseMap.summary.defaultResponseMapContext
      .defaultStaticResponseMapFollowUpPromptCardId,
    responseMap.defaultStaticFollowUpPromptCard
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticFollowUpPromptCardId,
  );
  assert.equal(
    responseMap.summary.counts.responseMapRowCount,
    coverageReviewPath.coverageReviewPathSteps.length,
  );
  assert.equal(
    responseMap.summary.counts.staticFollowUpPromptCardCount,
    coverageReviewPath.staticCoveragePromptCards.length,
  );
  assert.equal(
    responseMap.summary.counts.coverageReviewPathStepCount,
    coverageReviewPath.summary.counts.coverageReviewPathStepCount,
  );
  assert.equal(
    responseMap.summary.counts.staticCoveragePromptCardCount,
    coverageReviewPath.summary.counts.staticCoveragePromptCardCount,
  );
  assert.deepEqual(
    responseMap.responseMapRows.map((row) => [
      row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowOrder,
      row.sourceCoverageReviewPathStepId,
      row.sourceCoverageReviewPathStepIds,
      row.sourceStaticCoveragePromptCardIds,
      row.sourceCoverageMatrixRowId,
      row.sourceStaticReadinessCueCardIds,
      row.sourceReviewPathStepId,
      row.sourceStaticReviewerCheckCardIds,
      row.sourceSourceRecapRowId,
      row.sourceStaticNextPassPromptCardIds,
      row.sourceAnswerFollowUpReviewLaneRowId,
      row.sourceStaticDecisionCueCardIds,
      row.sourceAnswerSourceCrosswalkRowId,
      row.sourceStaticFollowUpPromptCardIds,
      row.sourceAnswerWalkthroughStepId,
      row.sourceStaticReviewNoteCardIds,
      row.sourceAnswerCoverageRowId,
      row.sourceStaticReviewerCheckPromptCardIds,
      row.sourceRehearsalPathStepId,
      row.sourceStaticAnswerPrepPromptCardIds,
      row.sourceReviewBoardRowId,
      row.matchedStaticQuestionPromptCardIds,
      row.followUpReadinessBriefRowId,
      row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
      row.sourceLocalAnchorHrefs,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
      row.laneLabels,
      row.reviewPathLabels,
      row.coverageLabels,
      row.coverageReviewLabels,
      row.responseMapLabels,
      row.coverageReviewText,
      row.staticCoveragePromptText,
    ]),
    coverageReviewPath.coverageReviewPathSteps.map((step) => [
      step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepOrder,
      step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepId,
      [
        step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepId,
      ],
      responseMap.responseMapRows.find(
        (row) =>
          row.sourceCoverageReviewPathStepId ===
          step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepId,
      )?.sourceStaticCoveragePromptCardIds,
      step.sourceCoverageMatrixRowId,
      step.sourceStaticReadinessCueCardIds,
      step.sourceReviewPathStepId,
      step.sourceStaticReviewerCheckCardIds,
      step.sourceSourceRecapRowId,
      step.sourceStaticNextPassPromptCardIds,
      step.sourceAnswerFollowUpReviewLaneRowId,
      step.sourceStaticDecisionCueCardIds,
      step.sourceAnswerSourceCrosswalkRowId,
      step.sourceStaticFollowUpPromptCardIds,
      step.sourceAnswerWalkthroughStepId,
      step.sourceStaticReviewNoteCardIds,
      step.sourceAnswerCoverageRowId,
      step.sourceStaticReviewerCheckPromptCardIds,
      step.sourceRehearsalPathStepId,
      step.sourceStaticAnswerPrepPromptCardIds,
      step.sourceReviewBoardRowId,
      step.matchedStaticQuestionPromptCardIds,
      step.followUpReadinessBriefRowId,
      step.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
      step.sourceLocalAnchorHrefs,
      step.evidenceCallbackIds,
      step.gapDiscussionPointIds,
      step.deferredScopeReminderIds,
      step.laneLabels,
      step.reviewPathLabels,
      step.coverageLabels,
      step.coverageReviewLabels,
      responseMap.responseMapRows.find(
        (row) =>
          row.sourceCoverageReviewPathStepId ===
          step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepId,
      )?.responseMapLabels,
      step.coverageReviewText,
      step.staticCoveragePromptText,
    ]),
  );
  assert.deepEqual(
    responseMap.staticFollowUpPromptCards.map((card) => [
      card.staticFollowUpPromptOrder,
      card.sourceStaticCoveragePromptCardId,
      card.sourceStaticCoveragePromptCardIds,
      card.sourceStaticReadinessCueCardId,
      card.sourceStaticReviewerCheckCardId,
      card.matchedResponseMapRowIds,
      card.matchedCoverageReviewPathStepIds,
      card.matchedCoverageRowIds,
      card.matchedReviewPathStepIds,
      card.matchedSourceRecapRowIds,
      card.matchedAnswerFollowUpReviewLaneRowIds,
      card.matchedAnswerSourceCrosswalkRowIds,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.coverageReviewLabels,
      card.responseMapLabels,
      card.staticCoveragePromptText,
    ]),
    coverageReviewPath.staticCoveragePromptCards.map((card) => [
      card.staticCoveragePromptOrder,
      card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardId,
      [
        card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardId,
      ],
      card.sourceStaticReadinessCueCardId,
      card.sourceStaticReviewerCheckCardId,
      responseMap.staticFollowUpPromptCards.find(
        (promptCard) =>
          promptCard.sourceStaticCoveragePromptCardId ===
          card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardId,
      )?.matchedResponseMapRowIds,
      card.matchedCoverageReviewPathStepIds,
      card.matchedCoverageRowIds,
      card.matchedReviewPathStepIds,
      card.matchedSourceRecapRowIds,
      card.matchedAnswerFollowUpReviewLaneRowIds,
      card.matchedAnswerSourceCrosswalkRowIds,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.coverageReviewLabels,
      responseMap.staticFollowUpPromptCards.find(
        (promptCard) =>
          promptCard.sourceStaticCoveragePromptCardId ===
          card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStaticCoveragePromptCardId,
      )?.responseMapLabels,
      card.staticCoveragePromptText,
    ]),
  );

  const firstResponseMapRow = responseMap.responseMapRows[0];
  const firstStaticFollowUpPrompt = responseMap.staticFollowUpPromptCards[0];
  assert.ok(
    firstResponseMapRow.responseMapText.includes(
      firstResponseMapRow.sourceCoverageReviewPathStepId,
    ) &&
      firstResponseMapRow.responseMapText.includes(
        firstResponseMapRow.sourceCoverageMatrixRowId,
      ) &&
      firstResponseMapRow.responseMapText.includes(
        firstResponseMapRow.sourceReviewPathStepId,
      ) &&
      firstResponseMapRow.responseMapText.includes(
        firstResponseMapRow.sourceSourceRecapRowId,
      ) &&
      firstResponseMapRow.responseMapText.includes(
        firstResponseMapRow.sourceAnswerFollowUpReviewLaneRowId,
      ) &&
      firstResponseMapRow.responseMapText.includes(
        firstResponseMapRow.sourceAnswerSourceCrosswalkRowId,
      ) &&
      firstResponseMapRow.responseMapText.includes(
        firstResponseMapRow.sourceAnswerWalkthroughStepId,
      ) &&
      firstResponseMapRow.responseMapText.includes(
        firstResponseMapRow.sourceAnswerCoverageRowId,
      ) &&
      firstResponseMapRow.staticFollowUpPromptText.includes(
        firstResponseMapRow.sourceCoverageReviewPathStepId,
      ) &&
      firstResponseMapRow.responseMapLabels.includes(
        "coverage-review response map row",
      ) &&
      firstResponseMapRow.responseMapLabels.includes(
        "static follow-up prompt cue",
      ) &&
      firstResponseMapRow.responseMapLabels.includes(
        "coverage-review carry-forward",
      ) &&
      firstResponseMapRow.staticNonGoalFlags.noSavedCoverageReviewState &&
      firstResponseMapRow.staticNonGoalFlags.noSavedCoveragePrompts &&
      firstResponseMapRow.staticNonGoalFlags.noSavedResponseNotes &&
      firstResponseMapRow.staticNonGoalFlags.noSavedResponseMapState &&
      firstResponseMapRow.staticNonGoalFlags.noSavedResponseMapRows &&
      firstResponseMapRow.staticNonGoalFlags.noSavedFollowUpPrompts &&
      firstResponseMapRow.staticNonGoalFlags.noSavedFollowUpPromptCards,
  );
  assert.ok(
    firstStaticFollowUpPrompt.staticFollowUpPromptText.includes(
      firstStaticFollowUpPrompt.sourceStaticCoveragePromptCardId,
    ) &&
      firstStaticFollowUpPrompt.staticFollowUpPromptText.includes(
        firstStaticFollowUpPrompt.sourceStaticReadinessCueCardId,
      ) &&
      firstStaticFollowUpPrompt.staticFollowUpPromptText.includes(
        firstStaticFollowUpPrompt.sourceStaticReviewerCheckCardId,
      ) &&
      firstStaticFollowUpPrompt.responseMapLabels.includes(
        "static follow-up prompt",
      ) &&
      firstStaticFollowUpPrompt.responseMapLabels.includes(
        "coverage-prompt carry-forward",
      ) &&
      firstStaticFollowUpPrompt.staticNonGoalFlags.noSavedCoverageReviewState &&
      firstStaticFollowUpPrompt.staticNonGoalFlags.noSavedCoveragePrompts &&
      firstStaticFollowUpPrompt.staticNonGoalFlags.noSavedResponseMapState &&
      firstStaticFollowUpPrompt.staticNonGoalFlags.noSavedFollowUpPrompts &&
      firstStaticFollowUpPrompt.staticNonGoalFlags.noSavedFollowUpPromptCards,
  );
  assert.ok(
    missionConsoleSource.includes("Stage 76 coverage-review response map") &&
      missionConsoleSource.includes(
        "Response map and static follow-up prompts",
      ) &&
      missionConsoleSource.includes("No saved response-map state") &&
      missionConsoleSource.includes("No saved follow-up prompts") &&
      missionConsoleSource.includes(
        "review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map",
      ),
  );
});
