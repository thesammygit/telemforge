import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildReviewObservationHandoffCoverage } from "../../frontend/src/lib/reviewObservationHandoffCoverage.ts";
import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffCoverage derives ordered coverage rows from the Stage 38 handoff deck", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const deck = view.reviewObservationHandoffDeck;
  const coverage = buildReviewObservationHandoffCoverage(deck);

  assert.ok(deck);
  assert.ok(coverage);
  assert.equal(
    coverage.schema,
    "telemforge.review_observation_handoff_coverage.v1",
  );
  assert.equal(coverage.version, 1);
  assert.equal(
    coverage.contractLabel,
    "local deterministic observation handoff coverage and static gap map",
  );
  assert.equal(coverage.localStatus, "fixture");
  assert.strictEqual(coverage.sourceObservationHandoffDeck, deck);
  assert.equal(
    coverage.summary.defaultCoverageRowId,
    coverage.coverageRows[0].coverageRowId,
  );
  assert.equal(
    coverage.defaultCoverageRow.sourceHandoffCardId,
    deck.summary.defaultHandoffCardId,
  );
  assert.deepEqual(
    coverage.coverageRows.map((row) => [
      row.rowNumber,
      row.sourceHandoffCardId,
      row.sourceSummaryCoverage.sourceSummaryId,
      row.sourceSummaryCoverage.sourceSummary,
      row.localAnchorHrefs,
      row.relatedObservationRowIds,
      row.sourceStagePromptIds,
      row.guardrailReminderIds,
      row.priorSurfacePromptIds,
      row.staticGapNoteIds,
      row.deferredScopeReminderIds,
      row.staticNonGoalContexts.length,
    ]),
    deck.cards.map((card, index) => [
      index + 1,
      card.cardId,
      card.sourceSummaryId,
      card.sourceSummary,
      card.localAnchorHrefs,
      card.relatedObservationRowIds,
      card.sourceStagePromptIds,
      card.guardrailReminderIds,
      card.priorSurfacePromptIds,
      [`review-observation-handoff-coverage-gap:${card.cardId}`],
      card.staticNonGoalContexts.map(
        (context) =>
          `review-observation-handoff-coverage-deferred-scope:${context.nonGoalNoteId}`,
      ),
      card.staticNonGoalContexts.length,
    ]),
  );
  assert.ok(
    coverage.coverageRows.every(
      (row) =>
        row.localOnly &&
        row.sourceBacked &&
        row.inPageOnly &&
        row.informationalOnly &&
        row.nonActionable &&
        row.nonPersistent &&
        row.nonExecutable &&
        row.nonCertifying &&
        row.nonRanking &&
        row.notATask &&
        row.notATicket &&
        row.notAChecklist &&
        row.notOwnerAssigned,
    ),
  );
});

test("buildReviewObservationHandoffCoverage keeps gap notes, source groups, and deferred scope static", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const deck = view.reviewObservationHandoffDeck;
  const coverage = view.reviewObservationHandoffCoverage;
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(deck);
  assert.ok(coverage);
  assert.equal(
    coverage.summary.counts.coverageRowCount,
    deck.cards.length,
  );
  assert.equal(
    coverage.summary.counts.staticGapNoteCount,
    deck.cards.length,
  );
  assert.equal(
    coverage.summary.counts.sourceCoverageGroupCount,
    deck.sourceStagePrompts.length,
  );
  assert.ok(coverage.summary.counts.deferredScopeReminderCount > 0);
  assert.deepEqual(
    coverage.sourceCoverageGroups.map((group) => [
      group.sourceStagePromptId,
      group.sourceStageNumber,
      group.sourceAnchorHrefs,
      group.coverageRowIds,
      group.relatedObservationRowIds,
    ]),
    deck.sourceStagePrompts.map((prompt) => [
      prompt.promptId,
      prompt.sourceStageNumber,
      prompt.sourceAnchorHrefs,
      deck.cards
        .filter((card) => card.sourceStagePromptIds.includes(prompt.promptId))
        .map((card) => `review-observation-handoff-coverage:${card.cardId}`),
      prompt.relatedObservationRowIds,
    ]),
  );
  assert.ok(
    [
      ...coverage.staticGapNotes,
      ...coverage.sourceCoverageGroups,
      ...coverage.deferredScopeReminders,
    ].every(
      (item) =>
        item.localOnly &&
        item.informationalOnly &&
        item.nonActionable &&
        item.nonPersistent &&
        item.nonExecutable &&
        item.nonCertifying &&
        item.nonRanking,
    ),
  );
  assert.ok(
    coverage.staticGapNotes.every(
      (note) =>
        note.explanatoryOnly &&
        note.notAReadinessScore &&
        note.notACertification,
    ),
  );
  assert.ok(
    missionConsoleSource.includes('id="review-observation-handoff-coverage"'),
    "Mission console should expose a local Stage 39 handoff coverage anchor",
  );
});
