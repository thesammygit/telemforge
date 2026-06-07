import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildConstraintResponseSourceFollowUpMap } from "../../frontend/src/lib/constraintResponseSourceFollowUpMap.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("buildConstraintResponseSourceFollowUpMap derives deterministic entries from Stage 84 rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceReadinessLane =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLane;

  assert.ok(sourceReadinessLane);

  const sourceFollowUpMap =
    buildConstraintResponseSourceFollowUpMap(sourceReadinessLane);

  assert.ok(sourceFollowUpMap);
  assert.equal(
    sourceFollowUpMap.schema,
    "telemforge.constraint_response_source_follow_up_map.v1",
  );
  assert.strictEqual(
    sourceFollowUpMap.sourceConstraintResponseSourceReadinessLane,
    sourceReadinessLane,
  );
  assert.equal(
    sourceFollowUpMap.sourceFollowUpMapEntries.length,
    sourceReadinessLane.sourceReadinessLaneRows.length,
  );
  assert.equal(
    sourceFollowUpMap.staticCitationCheckPromptCards.length,
    sourceReadinessLane.staticSourceFollowUpCueCards.length,
  );
  assert.deepEqual(
    sourceFollowUpMap.sourceFollowUpMapEntries.map(
      (entry) => entry.sourceSourceReadinessLaneRowId,
    ),
    sourceReadinessLane.sourceReadinessLaneRows.map(
      (row) =>
        row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneRowId,
    ),
  );
  assert.deepEqual(
    sourceFollowUpMap.staticCitationCheckPromptCards.map(
      (card) => card.sourceStaticSourceFollowUpCueCardId,
    ),
    sourceReadinessLane.staticSourceFollowUpCueCards.map(
      (card) =>
        card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReadinessLaneStaticSourceFollowUpCueCardId,
    ),
  );
  assert.deepEqual(
    sourceFollowUpMap.summary.defaultFollowUpContext
      .sourceStage84DefaultSourceReadinessContext,
    sourceReadinessLane.summary.defaultSourceReadinessContext,
  );

  const firstEntry = sourceFollowUpMap.sourceFollowUpMapEntries[0];
  assert.equal(firstEntry.sourceFollowUpMapEntryOrder, 1);
  assert.ok(
    firstEntry.sourceFollowUpText.includes(
      firstEntry.sourceSourceReadinessLaneRowId,
    ),
  );
  assert.ok(firstEntry.sourceFollowUpText.includes(firstEntry.sourceCrosswalkRowId));
  assert.ok(
    firstEntry.sourceFollowUpText.includes(
      firstEntry.sourceConstraintResponseReviewPathStepId,
    ),
  );
  assert.ok(
    firstEntry.sourceFollowUpText.includes(firstEntry.sourceConstraintCoverageRowId),
  );
  assert.ok(
    firstEntry.citationCheckPromptText.includes(
      firstEntry.sourceSourceReviewPathStepId,
    ),
  );
  assert.ok(
    firstEntry.sourceFollowUpLabels.includes("source follow-up map entry"),
  );
  assert.ok(
    firstEntry.citationCheckLabels.includes(
      "static citation-check prompt context",
    ),
  );
  assert.equal(firstEntry.staticNonGoalFlags.noSavedSourceFollowUpMapState, true);
  assert.equal(firstEntry.staticNonGoalFlags.noSavedCitationSelections, true);
  assert.equal(firstEntry.staticNonGoalFlags.noSavedCitationCheckState, true);
  assert.equal(firstEntry.staticNonGoalFlags.noSavedReviewerAnswers, true);

  const firstCard = sourceFollowUpMap.staticCitationCheckPromptCards[0];
  assert.equal(firstCard.staticCitationCheckPromptOrder, 1);
  assert.ok(
    firstCard.citationCheckPromptText.includes(
      firstCard.sourceStaticSourceFollowUpCueCardId,
    ),
  );
  assert.ok(
    firstCard.staticCitationCheckLabels.includes(
      "static citation-check prompt card",
    ),
  );
  assert.equal(
    firstCard.staticNonGoalFlags.noSavedStaticCitationCheckPrompts,
    true,
  );
  assert.equal(firstCard.staticNonGoalFlags.noSavedCitationSelections, true);
  assert.equal(firstCard.staticNonGoalFlags.noSavedSourceSelections, true);
});
