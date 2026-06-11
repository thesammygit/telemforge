import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath derives Stage 107 review path from Stage 106", async () => {
  const {
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 107 helper module to exist: ${error.message}`),
  );
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceCitationReviewLane =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane;
  const evidenceCheckReviewPath =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath;
  const builtEvidenceCheckReviewPath =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath(
      sourceCitationReviewLane,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceCitationReviewLane);
  assert.ok(evidenceCheckReviewPath);
  assert.ok(builtEvidenceCheckReviewPath);
  assert.deepEqual(evidenceCheckReviewPath, builtEvidenceCheckReviewPath);
  assert.strictEqual(
    evidenceCheckReviewPath.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane,
    sourceCitationReviewLane,
  );
  assert.equal(
    evidenceCheckReviewPath.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map_source_citation_review_lane_evidence_check_review_path.v1",
  );
  assert.equal(
    evidenceCheckReviewPath.contractLabel,
    "local deterministic constraint-response revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path source-review readiness lane source follow-up map source citation-review lane evidence-check review path and static citation-gap cues",
  );
  assert.equal(evidenceCheckReviewPath.localStatus, "fixture");
  assert.equal(
    evidenceCheckReviewPath.summary.counts.evidenceCheckReviewPathStepCount,
    sourceCitationReviewLane.staticEvidenceCheckPromptCards.length,
  );
  assert.equal(
    evidenceCheckReviewPath.summary.counts.staticCitationGapCueCardCount,
    sourceCitationReviewLane.citationReviewLaneRows.length,
  );
  assert.deepEqual(
    evidenceCheckReviewPath.evidenceCheckReviewPathSteps.map(
      (step) => step.sourceStaticEvidenceCheckPromptCardId,
    ),
    sourceCitationReviewLane.staticEvidenceCheckPromptCards.map(
      (card) => card.staticEvidenceCheckPromptCardId,
    ),
  );
  assert.deepEqual(
    evidenceCheckReviewPath.staticCitationGapCueCards.map(
      (card) => card.sourceCitationReviewLaneRowId,
    ),
    sourceCitationReviewLane.citationReviewLaneRows.map(
      (row) => row.citationReviewLaneRowId,
    ),
  );
  assert.deepEqual(
    evidenceCheckReviewPath.summary.defaultEvidenceCheckReviewContext
      .sourceStage106DefaultCitationReviewContext,
    sourceCitationReviewLane.summary.defaultCitationReviewContext,
  );

  const firstStep = evidenceCheckReviewPath.evidenceCheckReviewPathSteps[0];
  assert.equal(firstStep.evidenceCheckReviewPathStepOrder, 1);
  assert.ok(
    firstStep.evidenceCheckReviewText.includes(
      firstStep.sourceStaticEvidenceCheckPromptCardId,
    ),
  );
  assert.ok(
    firstStep.evidenceCheckReviewText.includes(
      firstStep.sourceCitationReviewLaneRowIds[0],
    ),
  );
  assert.ok(
    firstStep.evidenceCheckReviewText.includes(
      firstStep.sourceSourceFollowUpMapEntryId,
    ),
  );
  assert.ok(
    firstStep.evidenceCheckReviewText.includes(firstStep.sourceSourceReviewPathStepId),
  );
  assert.ok(
    firstStep.evidenceCheckReviewText.includes(firstStep.sourceCrosswalkRowId),
  );
  assert.ok(
    firstStep.evidenceCheckReviewLabels.includes(
      "evidence-check review path step",
    ),
  );
  assert.ok(
    firstStep.citationGapCueLabels.includes(
      "matched citation-gap cue context",
    ),
  );
  assert.equal(firstStep.staticNonGoalFlags.noSavedEvidenceCheckReviewState, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedEvidenceCheckSelections, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedReviewerAnswers, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedCitationSelections, true);

  const firstCue = evidenceCheckReviewPath.staticCitationGapCueCards[0];
  assert.equal(firstCue.staticCitationGapCueOrder, 1);
  assert.ok(
    firstCue.citationGapCueText.includes(firstCue.sourceCitationReviewLaneRowId),
  );
  assert.ok(
    firstCue.citationGapCueText.includes(
      firstCue.sourceStaticCitationCheckPromptCardId,
    ),
  );
  assert.ok(
    firstCue.citationGapCueText.includes(
      firstCue.sourceStaticEvidenceCheckPromptCardIds[0],
    ),
  );
  assert.ok(
    firstCue.citationGapCueLabels.includes("static citation-gap cue card"),
  );
  assert.equal(firstCue.staticNonGoalFlags.noSavedStaticCitationGapCueCards, true);
  assert.equal(firstCue.staticNonGoalFlags.noSavedEvidenceCheckReviewPathState, true);
  assert.equal(firstCue.staticNonGoalFlags.noSavedSourceSelections, true);
  assert.ok(
    evidenceCheckReviewPath.staticCitationGapBoundarySummary.includes(
      "no saved reviewer answers",
    ),
  );
  assert.ok(
    missionConsoleSource.includes("Stage 107 evidence check review path"),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Evidence check review path and static citation gap cues",
    ),
  );
});
