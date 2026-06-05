import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffDeck } from "../../frontend/src/lib/reviewObservationHandoffDeck.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffDeck derives ordered cards from the Stage 37 storyline", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const storyline = view.reviewObservationStoryline;
  const deck = buildReviewObservationHandoffDeck(storyline);

  assert.ok(storyline);
  assert.ok(deck);
  assert.equal(deck.schema, "telemforge.review_observation_handoff_deck.v1");
  assert.equal(deck.version, 1);
  assert.equal(
    deck.contractLabel,
    "local deterministic observation handoff deck and static review path",
  );
  assert.equal(deck.localStatus, "fixture");
  assert.strictEqual(deck.sourceObservationStoryline, storyline);
  assert.equal(deck.summary.defaultHandoffCardId, deck.cards[0].cardId);
  assert.equal(
    deck.defaultReviewContext.sourceOpeningSegmentId,
    storyline.defaultOpening.defaultOpeningSegmentId,
  );
  assert.equal(
    deck.defaultReviewContext.sourceStepId,
    storyline.defaultOpening.sourceStepId,
  );
  assert.deepEqual(
    deck.cards.map((card) => [
      card.cardNumber,
      card.sourceSegmentId,
      card.sourceStepId,
      card.sourceSummaryId,
      card.label,
      card.sourceSummary,
      card.localAnchorHrefs,
      card.relatedObservationRowIds,
      card.relatedSourceStageNumbers,
      card.sourceStageEvidenceGroupIds,
      card.sourceStagePromptIds.length,
      card.guardrailReminderIds.length,
      card.priorSurfacePromptIds.length,
      card.staticNonGoalContexts.length,
    ]),
    storyline.segments.map((segment, index) => [
      index + 1,
      segment.segmentId,
      segment.sourceStepId,
      segment.sourceSummaryId,
      segment.label,
      segment.sourceSummary,
      segment.sourceAnchorHrefs,
      segment.relatedObservationRowIds,
      segment.relatedSourceStageNumbers,
      segment.sourceStageEvidenceGroupIds,
      segment.sourceStageEvidenceGroupIds.length,
      segment.staticGuardrailReferenceIds.length,
      segment.priorSurfaceReferences.length,
      segment.staticNonGoalContexts.length,
    ]),
  );
  assert.ok(
    deck.cards.every(
      (card) =>
        card.localOnly &&
        card.sourceBacked &&
        card.inPageOnly &&
        card.informationalOnly &&
        card.nonActionable &&
        card.nonPersistent &&
        card.nonExecutable &&
        card.nonCertifying &&
        card.nonRanking &&
        card.notATask &&
        card.notATicket &&
        card.notAChecklist &&
        card.notOwnerAssigned,
    ),
  );
});

test("buildReviewObservationHandoffDeck keeps review prompts static, local, and non-certifying", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const storyline = view.reviewObservationStoryline;
  const deck = view.reviewObservationHandoffDeck;
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(storyline);
  assert.ok(deck);
  assert.equal(
    deck.summary.counts.handoffCardCount,
    storyline.segments.length,
  );
  assert.equal(
    deck.summary.counts.sourceStagePromptCount,
    storyline.sourceStageEvidenceGroups.length,
  );
  assert.equal(
    deck.summary.counts.guardrailReminderCount,
    storyline.staticGuardrailReferences.length,
  );
  assert.equal(
    deck.summary.counts.priorSurfacePromptCount,
    storyline.summary.counts.priorSurfaceReferenceCount,
  );
  assert.deepEqual(
    deck.sourceStagePrompts.map((prompt) => [
      prompt.sourceStageEvidenceGroupId,
      prompt.sourceStageNumber,
      prompt.sourceAnchorHrefs,
      prompt.segmentIds,
      prompt.relatedObservationRowIds,
    ]),
    storyline.sourceStageEvidenceGroups.map((group) => [
      group.evidenceGroupId,
      group.sourceStageNumber,
      group.sourceAnchorHrefs,
      group.segmentIds,
      group.relatedObservationRowIds,
    ]),
  );
  assert.deepEqual(
    deck.guardrailReminders.map((reminder) => [
      reminder.sourceGuardrailReferenceId,
      reminder.kind,
      reminder.sourceObservationRowIds,
      reminder.sourceAnchorIds,
      reminder.segmentIds,
    ]),
    storyline.staticGuardrailReferences.map((reference) => [
      reference.guardrailReferenceId,
      reference.kind,
      reference.sourceObservationRowIds,
      reference.sourceAnchorIds,
      reference.segmentIds,
    ]),
  );
  assert.ok(
    deck.priorSurfacePrompts.every((prompt) =>
      prompt.anchorHref.startsWith("#"),
    ),
  );
  assert.ok(
    [
      ...deck.reviewPathCheckpoints,
      ...deck.sourceStagePrompts,
      ...deck.guardrailReminders,
      ...deck.priorSurfacePrompts,
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
    missionConsoleSource.includes('id="review-observation-handoff-deck"'),
    "Mission console should expose a local Stage 38 handoff deck anchor",
  );
});
