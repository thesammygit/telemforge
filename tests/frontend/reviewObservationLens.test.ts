import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationLens } from "../../frontend/src/lib/reviewObservationLens.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationLens derives observation rows from the Stage 31 walkthrough path", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const walkthrough = view.reviewWalkthroughPath;
  const lens = buildReviewObservationLens(walkthrough);

  assert.ok(walkthrough);
  assert.ok(lens);
  assert.equal(lens.schema, "telemforge.review_observation_lens.v1");
  assert.equal(lens.version, 1);
  assert.equal(
    lens.contractLabel,
    "local deterministic review observation lens and static attention map",
  );
  assert.equal(lens.localStatus, "fixture");
  assert.strictEqual(lens.sourceWalkthroughPath, walkthrough);
  assert.equal(
    lens.summary.defaultObservationRowId,
    "review-observation:review-walkthrough-step:review-decision-register",
  );
  assert.equal(lens.summary.defaultAnchorId, "review-decision-register");
  assert.equal(
    lens.summary.defaultAttentionGroupId,
    "review-observation-attention:source_alignment",
  );
  assert.deepEqual(
    lens.observationRows.map((row) => [
      row.sourceStageNumber,
      row.workflowGroup,
      row.anchor.anchorId,
      row.sourceStepId,
    ]),
    walkthrough?.steps.map((step) => [
      step.sourceStageNumber,
      step.workflowGroup,
      step.anchor.anchorId,
      step.stepId,
    ]),
  );
  assert.deepEqual(
    lens.observationRows.map((row) => row.workflowGroup),
    [
      "decision",
      "decision",
      "action",
      "action",
      "action",
      "readiness",
      "readiness",
      "readiness",
      "readiness",
      "evidence",
      "evidence",
      "evidence",
      "proof",
      "proof",
      "navigator",
      "reconciliation",
    ],
  );
  assert.equal(lens.summary.counts.totalObservationRowCount, 16);
  assert.equal(lens.summary.counts.attentionGroupCount, 4);
  assert.equal(lens.summary.counts.localAnchorCount, 16);
  assert.equal(lens.summary.counts.sourceReferenceCount, 16);
  assert.equal(
    lens.summary.counts.countSignalCount,
    walkthrough?.summary.counts.sourceCountMetricCount,
  );
  assert.equal(lens.summary.counts.deferredBoundarySummaryCount, 7);
  assert.equal(lens.summary.counts.staticExpectedObservationCount, 16);
  assert.equal(lens.summary.counts.localOnlyObservationCount, 16);
});

test("buildReviewObservationLens preserves source labels, anchors, count signals, and deferred summaries", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const lens = view.reviewObservationLens;
  const walkthrough = view.reviewWalkthroughPath;
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(lens);
  assert.ok(walkthrough);
  assert.deepEqual(
    lens.sourceReferences.map((reference) => [
      reference.sourceStepId,
      reference.sourceSchema,
      reference.sourceContractLabel,
      reference.sourceLabels,
    ]),
    walkthrough.steps.map((step) => [
      step.stepId,
      step.sourceSchema,
      step.sourceContractLabel,
      step.sourceLabels,
    ]),
  );
  assert.deepEqual(
    lens.anchorReferences.map((anchor) => [
      anchor.sourceStepId,
      anchor.anchorId,
      anchor.href,
    ]),
    walkthrough.steps.map((step) => [
      step.stepId,
      step.anchor.anchorId,
      step.anchor.href,
    ]),
  );
  assert.deepEqual(
    lens.observationRows[0].countSignalIds,
    lens.countSignals
      .filter((signal) => signal.sourceStepId === walkthrough.steps[0].stepId)
      .map((signal) => signal.signalId),
  );
  assert.equal(lens.observationRows[0].staticExpectedObservation, walkthrough.steps[0].expectedObservation);
  assert.ok(
    lens.countSignals.every(
      (signal) =>
        signal.localOnly &&
        signal.sourceBacked &&
        signal.informationalOnly &&
        signal.nonExecutable &&
        signal.nonCertifying &&
        !signal.sourcePath.startsWith("/"),
    ),
  );
  assert.deepEqual(
    lens.deferredBoundarySummaries.map((summary) => [
      summary.summaryId,
      summary.sourceNoteId,
      summary.sourceStepIds.length,
      summary.actionability,
      summary.nonActionable,
    ]),
    walkthrough.deferredBoundaryNotes.map((note) => [
      note.noteId.replace(
        "review-walkthrough-boundary:",
        "review-observation-boundary:",
      ),
      note.noteId,
      note.sourceStepIds.length,
      "deferred_non_actionable",
      true,
    ]),
  );

  for (const row of lens.observationRows) {
    assert.ok(row.anchor.href.startsWith("#"));
    assert.ok(
      missionConsoleSource.includes(`id="${row.anchor.anchorId}"`),
      `${row.anchor.anchorId} should resolve to an existing mission-console section`,
    );
  }
});

test("buildReviewObservationLens keeps attention groups informational and non-ranking", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const lens = view.reviewObservationLens;

  assert.ok(lens);
  const countSignalCount = lens.countSignals.length;

  assert.deepEqual(
    lens.attentionGroups.map((group) => [
      group.kind,
      group.order,
      group.observationRowIds.length,
      group.countSignalIds.length,
      group.deferredBoundarySummaryIds.length,
      group.localOnly,
      group.nonPersistent,
      group.nonExecutable,
      group.nonCertifying,
      group.nonRanking,
    ]),
    [
      ["source_alignment", 1, 16, 0, 0, true, true, true, true, true],
      ["anchor_resolution", 2, 16, 0, 0, true, true, true, true, true],
      ["count_signal", 3, 16, countSignalCount, 0, true, true, true, true, true],
      ["deferred_boundary", 4, 16, 0, 7, true, true, true, true, true],
    ],
  );
  assert.ok(
    lens.observationRows.every(
      (row) =>
        row.localOnly &&
        row.informationalOnly &&
        row.nonPersistent &&
        row.nonExecutable &&
        row.nonCertifying &&
        row.nonRanking &&
        row.attentionKinds.includes("source_alignment") &&
        row.attentionKinds.includes("anchor_resolution") &&
        row.attentionKinds.includes("count_signal") &&
        row.attentionKinds.includes("deferred_boundary"),
    ),
  );
  assert.equal(
    lens.staticAttentionSummary,
    "Stage 32 observation rows and attention groups are local, static, source-backed, non-persistent, non-executable, non-ranking, and non-certifying; the mission console does not save observations, store reviewer notes, assign owners, run commands, export reports, score proofs, certify readiness, or create routes.",
  );
});
