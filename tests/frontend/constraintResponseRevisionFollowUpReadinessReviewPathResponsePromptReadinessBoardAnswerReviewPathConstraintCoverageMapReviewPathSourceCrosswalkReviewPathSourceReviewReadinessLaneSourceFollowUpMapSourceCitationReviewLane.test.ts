import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane derives Stage 106 citation lane from Stage 105", async () => {
  const {
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 106 helper module to exist: ${error.message}`),
  );
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceFollowUpMap =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap;
  const sourceCitationReviewLane =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane;
  const builtSourceCitationReviewLane =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane(
      sourceFollowUpMap,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceFollowUpMap);
  assert.ok(sourceCitationReviewLane);
  assert.ok(builtSourceCitationReviewLane);
  assert.deepEqual(sourceCitationReviewLane, builtSourceCitationReviewLane);
  assert.strictEqual(
    sourceCitationReviewLane.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap,
    sourceFollowUpMap,
  );
  assert.equal(
    sourceCitationReviewLane.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map_source_citation_review_lane.v1",
  );
  assert.equal(
    sourceCitationReviewLane.contractLabel,
    "local deterministic constraint-response revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path source-review readiness lane source follow-up map source citation-review lane and static evidence-check prompts",
  );
  assert.equal(sourceCitationReviewLane.localStatus, "fixture");
  assert.equal(
    sourceCitationReviewLane.summary.counts.citationReviewLaneRowCount,
    sourceFollowUpMap.staticCitationCheckPromptCards.length,
  );
  assert.equal(
    sourceCitationReviewLane.summary.counts.staticEvidenceCheckPromptCardCount,
    sourceFollowUpMap.sourceFollowUpMapEntries.length,
  );
  assert.deepEqual(
    sourceCitationReviewLane.citationReviewLaneRows.map(
      (row) => row.sourceStaticCitationCheckPromptCardId,
    ),
    sourceFollowUpMap.staticCitationCheckPromptCards.map(
      (card) => card.staticCitationCheckPromptCardId,
    ),
  );
  assert.deepEqual(
    sourceCitationReviewLane.staticEvidenceCheckPromptCards.map(
      (card) => card.sourceSourceFollowUpMapEntryId,
    ),
    sourceFollowUpMap.sourceFollowUpMapEntries.map(
      (entry) => entry.sourceFollowUpMapEntryId,
    ),
  );
  assert.deepEqual(
    sourceCitationReviewLane.summary.defaultCitationReviewContext
      .sourceStage105DefaultSourceFollowUpContext,
    sourceFollowUpMap.summary.defaultSourceFollowUpContext,
  );

  const firstRow = sourceCitationReviewLane.citationReviewLaneRows[0];
  assert.equal(firstRow.citationReviewLaneRowOrder, 1);
  assert.ok(
    firstRow.citationReviewText.includes(
      firstRow.sourceStaticCitationCheckPromptCardId,
    ),
  );
  assert.ok(
    firstRow.citationReviewText.includes(
      firstRow.sourceStaticSourceFollowUpCueCardId,
    ),
  );
  assert.ok(
    firstRow.citationReviewText.includes(firstRow.sourceStaticSourceReviewPromptCardId),
  );
  assert.ok(
    firstRow.citationReviewText.includes(firstRow.sourceStaticReviewCheckCardId),
  );
  assert.ok(
    firstRow.evidenceCheckPromptText.includes(
      firstRow.sourceSourceFollowUpMapEntryIds[0],
    ),
  );
  assert.ok(
    firstRow.citationReviewLabels.includes("source citation-review lane row"),
  );
  assert.ok(
    firstRow.evidenceCheckLabels.includes("static evidence-check prompt context"),
  );
  assert.equal(firstRow.staticNonGoalFlags.noSavedCitationReviewLaneState, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedEvidenceCheckState, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedCitationSelections, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedReviewerAnswers, true);

  const firstCard = sourceCitationReviewLane.staticEvidenceCheckPromptCards[0];
  assert.equal(firstCard.staticEvidenceCheckPromptOrder, 1);
  assert.ok(
    firstCard.evidenceCheckPromptText.includes(
      firstCard.sourceSourceFollowUpMapEntryId,
    ),
  );
  assert.ok(
    firstCard.evidenceCheckPromptText.includes(
      firstCard.sourceSourceReviewReadinessLaneRowId,
    ),
  );
  assert.ok(
    firstCard.evidenceCheckPromptText.includes(firstCard.sourceSourceReviewPathStepId),
  );
  assert.ok(
    firstCard.evidenceCheckPromptText.includes(firstCard.sourceCrosswalkRowId),
  );
  assert.ok(
    firstCard.evidenceCheckLabels.includes("static evidence-check prompt card"),
  );
  assert.equal(firstCard.staticNonGoalFlags.noSavedEvidenceCheckPromptState, true);
  assert.equal(firstCard.staticNonGoalFlags.noSavedCitationReviewState, true);
  assert.equal(firstCard.staticNonGoalFlags.noSavedSourceSelections, true);
  assert.equal(firstCard.staticNonGoalFlags.noSavedReviewerAnswers, true);
  assert.ok(
    sourceCitationReviewLane.staticEvidenceCheckBoundarySummary.includes(
      "no saved reviewer answers",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Stage 106 source citation review lane",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Source citation review lane and static evidence checks",
    ),
  );
});
