import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffAgenda } from "../../frontend/src/lib/reviewObservationHandoffAgenda.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffAgenda derives ordered agenda sections from Stage 40 prompt groups", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const questions = view.reviewObservationHandoffQuestions;
  const agenda = buildReviewObservationHandoffAgenda(questions);

  assert.ok(questions);
  assert.ok(agenda);
  assert.equal(
    agenda.schema,
    "telemforge.review_observation_handoff_agenda.v1",
  );
  assert.equal(agenda.version, 1);
  assert.equal(
    agenda.contractLabel,
    "local deterministic observation handoff agenda and static facilitation guide",
  );
  assert.equal(agenda.localStatus, "fixture");
  assert.strictEqual(agenda.sourceObservationHandoffQuestions, questions);
  assert.equal(
    agenda.summary.defaultAgendaSectionId,
    agenda.defaultAgendaSection.sectionId,
  );
  assert.equal(
    agenda.defaultAgendaSection.sourcePromptGroupId,
    questions.defaultPromptGroup.promptGroupId,
  );
  assert.equal(
    agenda.sections[0].sourcePromptGroupId,
    questions.defaultPromptGroup.promptGroupId,
  );
  assert.deepEqual(
    agenda.sections.map((section) => [
      section.sectionNumber,
      section.sourcePromptGroupId,
      section.sourcePromptGroupIds,
      section.sourceCoverageRowId,
      section.sourceHandoffCardId,
      section.sourceSummaryReference.sourceSummaryId,
      section.localAnchorHrefs,
      section.relatedReviewQuestionIds,
      section.relatedEvidencePromptIds,
      section.relatedGapPromptIds,
      section.relatedDeferredScopePromptIds,
      section.facilitationPromptIds.length,
      section.evidenceStopIds.length,
      section.gapDiscussionPointIds.length,
      section.deferredScopeReminderIds.length,
      section.staticNonGoalContexts.length,
    ]),
    questions.promptGroups.map((group, index) => [
      index + 1,
      group.promptGroupId,
      [group.promptGroupId],
      group.sourceCoverageRowId,
      group.sourceHandoffCardId,
      group.sourceSummaryReference.sourceSummaryId,
      group.localAnchorHrefs,
      group.reviewQuestionIds,
      group.evidencePromptIds,
      group.gapPromptIds,
      group.deferredScopePromptIds,
      group.reviewQuestionIds.length,
      group.evidencePromptIds.length,
      group.gapPromptIds.length,
      group.deferredScopePromptIds.length,
      group.staticNonGoalContexts.length,
    ]),
  );
  assert.ok(
    agenda.sections.every(
      (section) =>
        section.localOnly &&
        section.sourceBacked &&
        section.inPageOnly &&
        section.informationalOnly &&
        section.nonActionable &&
        section.nonPersistent &&
        section.nonExecutable &&
        section.nonCertifying &&
        section.nonRanking &&
        section.notATask &&
        section.notATicket &&
        section.notAChecklist &&
        section.notOwnerAssigned,
    ),
  );
});

test("buildReviewObservationHandoffAgenda keeps facilitation guide items static and non-executable", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const questions = view.reviewObservationHandoffQuestions;
  const agenda = view.reviewObservationHandoffAgenda;
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(questions);
  assert.ok(agenda);
  assert.equal(
    agenda.summary.counts.agendaSectionCount,
    questions.promptGroups.length,
  );
  assert.equal(
    agenda.summary.counts.facilitationPromptCount,
    questions.reviewQuestions.length,
  );
  assert.equal(
    agenda.summary.counts.evidenceStopCount,
    questions.evidencePrompts.length,
  );
  assert.equal(
    agenda.summary.counts.gapDiscussionPointCount,
    questions.gapPrompts.length,
  );
  assert.equal(
    agenda.summary.counts.deferredScopeReminderCount,
    questions.deferredScopePrompts.length,
  );
  assert.deepEqual(
    agenda.facilitationPrompts.map((prompt) => [
      prompt.sectionId,
      prompt.sourcePromptGroupId,
      prompt.sourceReviewQuestionId,
      prompt.relatedEvidencePromptIds,
      prompt.relatedGapPromptIds,
      prompt.relatedDeferredScopePromptIds,
    ]),
    agenda.sections.flatMap((section) =>
      section.relatedReviewQuestionIds.map((questionId) => [
        section.sectionId,
        section.sourcePromptGroupId,
        questionId,
        section.relatedEvidencePromptIds,
        section.relatedGapPromptIds,
        section.relatedDeferredScopePromptIds,
      ]),
    ),
  );
  assert.ok(
    [
      ...agenda.facilitationPrompts,
      ...agenda.evidenceStops,
      ...agenda.gapDiscussionPoints,
      ...agenda.deferredScopeReminders,
    ].every(
      (item) =>
        item.explanatoryOnly &&
        item.localOnly &&
        item.inPageOnly &&
        item.informationalOnly &&
        item.nonActionable &&
        item.nonPersistent &&
        item.nonExecutable &&
        item.nonCertifying &&
        item.nonRanking &&
        item.notATask &&
        item.notATicket &&
        item.notAChecklist &&
        item.notOwnerAssigned,
    ),
  );
  assert.ok(
    missionConsoleSource.includes('id="review-observation-handoff-agenda"'),
    "Mission console should expose a local Stage 41 handoff agenda anchor",
  );
});
