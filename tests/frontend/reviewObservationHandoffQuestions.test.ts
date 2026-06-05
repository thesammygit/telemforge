import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffQuestions } from "../../frontend/src/lib/reviewObservationHandoffQuestions.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffQuestions derives ordered prompt groups from Stage 39 coverage", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const coverage = view.reviewObservationHandoffCoverage;
  const questions = buildReviewObservationHandoffQuestions(coverage);

  assert.ok(coverage);
  assert.ok(questions);
  assert.equal(
    questions.schema,
    "telemforge.review_observation_handoff_questions.v1",
  );
  assert.equal(questions.version, 1);
  assert.equal(
    questions.contractLabel,
    "local deterministic observation handoff questions and static prompt rail",
  );
  assert.equal(questions.localStatus, "fixture");
  assert.strictEqual(questions.sourceObservationHandoffCoverage, coverage);
  assert.equal(
    questions.summary.defaultPromptGroupId,
    questions.defaultPromptGroup.promptGroupId,
  );
  assert.equal(
    questions.defaultPromptGroup.sourceCoverageRowId,
    coverage.summary.defaultCoverageRowId,
  );
  assert.deepEqual(
    questions.promptGroups.map((group) => [
      group.groupNumber,
      group.sourceCoverageRowId,
      group.sourceHandoffCardId,
      group.sourceSummaryReference.sourceSummaryId,
      group.localAnchorHrefs,
      group.relatedCoverageRowIds,
      group.relatedGapNoteIds,
      group.relatedDeferredScopeIds,
      group.reviewQuestionIds.length,
      group.evidencePromptIds.length,
      group.gapPromptIds.length,
      group.deferredScopePromptIds.length,
      group.staticNonGoalContexts.length,
    ]),
    coverage.coverageRows.map((row, index) => [
      index + 1,
      row.coverageRowId,
      row.sourceHandoffCardId,
      row.sourceSummaryCoverage.sourceSummaryId,
      row.localAnchorHrefs,
      [row.coverageRowId],
      row.staticGapNoteIds,
      row.deferredScopeReminderIds,
      2,
      1,
      row.staticGapNoteIds.length,
      row.deferredScopeReminderIds.length,
      row.staticNonGoalContexts.length,
    ]),
  );
  assert.ok(
    questions.promptGroups.every(
      (group) =>
        group.localOnly &&
        group.sourceBacked &&
        group.inPageOnly &&
        group.informationalOnly &&
        group.nonActionable &&
        group.nonPersistent &&
        group.nonExecutable &&
        group.nonCertifying &&
        group.nonRanking &&
        group.notATask &&
        group.notATicket &&
        group.notAChecklist &&
        group.notOwnerAssigned,
    ),
  );
});

test("buildReviewObservationHandoffQuestions keeps review prompts explanatory, local, and non-executable", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const coverage = view.reviewObservationHandoffCoverage;
  const questions = view.reviewObservationHandoffQuestions;
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(coverage);
  assert.ok(questions);
  assert.equal(
    questions.summary.counts.promptGroupCount,
    coverage.coverageRows.length,
  );
  assert.equal(
    questions.summary.counts.reviewQuestionCount,
    coverage.coverageRows.length * 2,
  );
  assert.equal(
    questions.summary.counts.evidencePromptCount,
    coverage.coverageRows.length,
  );
  assert.equal(
    questions.summary.counts.gapPromptCount,
    coverage.staticGapNotes.length,
  );
  assert.equal(
    questions.summary.counts.deferredScopePromptCount,
    coverage.coverageRows.reduce(
      (total, row) => total + row.deferredScopeReminderIds.length,
      0,
    ),
  );
  assert.deepEqual(
    questions.reviewQuestions.map((question) => [
      question.promptGroupId,
      question.sourceCoverageRowId,
      question.relatedCoverageRowIds,
      question.relatedGapNoteIds,
      question.relatedDeferredScopeIds,
    ]),
    questions.promptGroups.flatMap((group) =>
      group.reviewQuestionIds.map(() => [
        group.promptGroupId,
        group.sourceCoverageRowId,
        group.relatedCoverageRowIds,
        group.relatedGapNoteIds,
        group.relatedDeferredScopeIds,
      ]),
    ),
  );
  assert.ok(
    [
      ...questions.reviewQuestions,
      ...questions.evidencePrompts,
      ...questions.gapPrompts,
      ...questions.deferredScopePrompts,
    ].every(
      (prompt) =>
        prompt.explanatoryOnly &&
        prompt.localOnly &&
        prompt.inPageOnly &&
        prompt.informationalOnly &&
        prompt.nonActionable &&
        prompt.nonPersistent &&
        prompt.nonExecutable &&
        prompt.nonCertifying &&
        prompt.nonRanking &&
        prompt.notATask &&
        prompt.notATicket &&
        prompt.notAChecklist &&
        prompt.notOwnerAssigned,
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      'id="review-observation-handoff-questions"',
    ),
    "Mission console should expose a local Stage 40 handoff questions anchor",
  );
});
