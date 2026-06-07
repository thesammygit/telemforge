import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildConstraintResponseSourceCitationReviewLane } from "../../frontend/src/lib/constraintResponseSourceCitationReviewLane.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("buildConstraintResponseSourceCitationReviewLane derives deterministic rows from Stage 85 citation prompts", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceFollowUpMap = view.constraintResponseSourceFollowUpMap;

  assert.ok(sourceFollowUpMap);

  const citationReviewLane =
    buildConstraintResponseSourceCitationReviewLane(sourceFollowUpMap);

  assert.ok(citationReviewLane);
  assert.equal(
    citationReviewLane.schema,
    "telemforge.constraint_response_source_citation_review_lane.v1",
  );
  assert.strictEqual(
    citationReviewLane.sourceConstraintResponseSourceFollowUpMap,
    sourceFollowUpMap,
  );
  assert.equal(
    citationReviewLane.citationReviewLaneRows.length,
    sourceFollowUpMap.staticCitationCheckPromptCards.length,
  );
  assert.equal(
    citationReviewLane.staticEvidenceCheckPromptCards.length,
    sourceFollowUpMap.sourceFollowUpMapEntries.length,
  );
  assert.deepEqual(
    citationReviewLane.citationReviewLaneRows.map(
      (row) => row.sourceStaticCitationCheckPromptCardId,
    ),
    sourceFollowUpMap.staticCitationCheckPromptCards.map(
      (card) => card.staticCitationCheckPromptCardId,
    ),
  );
  assert.deepEqual(
    citationReviewLane.staticEvidenceCheckPromptCards.map(
      (card) => card.sourceSourceFollowUpMapEntryId,
    ),
    sourceFollowUpMap.sourceFollowUpMapEntries.map(
      (entry) => entry.sourceFollowUpMapEntryId,
    ),
  );
  assert.deepEqual(
    citationReviewLane.summary.defaultCitationReviewContext
      .sourceStage85DefaultFollowUpContext,
    sourceFollowUpMap.summary.defaultFollowUpContext,
  );

  const firstRow = citationReviewLane.citationReviewLaneRows[0];
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
    firstRow.citationReviewText.includes(
      firstRow.sourceStaticSourceReviewPromptCardId,
    ),
  );
  assert.ok(
    firstRow.evidenceCheckPromptText.includes(
      firstRow.sourceSourceFollowUpMapEntryIds[0],
    ),
  );
  assert.ok(
    firstRow.citationReviewLabels.includes("source citation-review lane row"),
  );
  assert.equal(firstRow.staticNonGoalFlags.noSavedCitationReviewLaneState, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedEvidenceCheckState, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedCitationSelections, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedReviewerAnswers, true);

  const firstCard = citationReviewLane.staticEvidenceCheckPromptCards[0];
  assert.equal(firstCard.staticEvidenceCheckPromptOrder, 1);
  assert.ok(
    firstCard.evidenceCheckPromptText.includes(
      firstCard.sourceSourceFollowUpMapEntryId,
    ),
  );
  assert.ok(
    firstCard.evidenceCheckPromptText.includes(
      firstCard.sourceSourceReadinessLaneRowId,
    ),
  );
  assert.ok(
    firstCard.evidenceCheckLabels.includes("static evidence-check prompt card"),
  );
  assert.equal(firstCard.staticNonGoalFlags.noSavedEvidenceCheckPromptState, true);
  assert.equal(firstCard.staticNonGoalFlags.noSavedCitationReviewState, true);
  assert.equal(firstCard.staticNonGoalFlags.noSavedSourceSelections, true);
});
