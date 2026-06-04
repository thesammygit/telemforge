import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewWalkthroughPath } from "../../frontend/src/lib/reviewWalkthroughPath.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewWalkthroughPath derives the local walkthrough from the Stage 30 surface index", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceIndex = view.reviewSurfaceIndex;
  const walkthrough = buildReviewWalkthroughPath(sourceIndex);

  assert.ok(sourceIndex);
  assert.ok(walkthrough);
  assert.equal(walkthrough?.schema, "telemforge.review_walkthrough_path.v1");
  assert.equal(
    walkthrough?.contractLabel,
    "local deterministic review walkthrough path and static prompt deck",
  );
  assert.equal(walkthrough?.sourceSurfaceIndex, sourceIndex);
  assert.equal(walkthrough?.summary.defaultStepId, "review-walkthrough-step:review-decision-register");
  assert.equal(walkthrough?.summary.defaultAnchorId, "review-decision-register");
  assert.deepEqual(
    walkthrough?.steps.map((step) => [
      step.sourceStageNumber,
      step.workflowGroup,
      step.anchor.anchorId,
    ]),
    sourceIndex?.rows.map((row) => [
      row.stageNumber,
      row.workflowGroup,
      row.anchor.anchorId,
    ]),
  );
  assert.deepEqual(
    walkthrough?.anchorReferences.map((anchor) => anchor.href),
    sourceIndex?.anchorReferences.map((anchor) => anchor.href),
  );
  assert.deepEqual(
    walkthrough?.promptGroups.map((group) => [
      group.workflowGroup,
      group.localCounts.stepCount,
      group.anchorIds[0],
    ]),
    [
      ["decision", 2, "review-decision-register"],
      ["action", 3, "review-action-queue"],
      ["readiness", 4, "review-coverage-matrix"],
      ["evidence", 3, "review-pass-outcome-board"],
      ["proof", 2, "review-proof-priority-radar"],
      ["navigator", 1, "review-proof-navigator"],
      ["reconciliation", 1, "review-proof-reconciliation"],
    ],
  );
  assert.equal(walkthrough?.summary.counts.totalStepCount, 16);
  assert.equal(walkthrough?.summary.counts.promptGroupCount, 7);
  assert.equal(walkthrough?.summary.counts.localAnchorCount, 16);
  assert.equal(walkthrough?.summary.counts.sourceSchemaCount, 16);
  assert.equal(walkthrough?.summary.counts.deferredBoundaryNoteCount, 7);
  assert.equal(walkthrough?.summary.counts.localOnlyStepCount, 16);
  assert.ok(
    walkthrough?.summary.counts.sourceCountMetricCount <
      sourceIndex!.summary.counts.sourceCountMetricCount,
  );
});

test("buildReviewWalkthroughPath keeps prompts informational and anchors local", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const walkthrough = view.reviewWalkthroughPath;
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(walkthrough);
  assert.equal(
    walkthrough?.steps.every(
      (step) =>
        step.localOnly &&
        step.informationalOnly &&
        step.nonPersistent &&
        step.nonExecutable &&
        step.nonCertifying,
    ),
    true,
  );
  assert.ok(
    walkthrough?.steps[0].staticInspectionPrompt.includes(
      "telemforge.review_decision_register.v1",
    ),
  );
  assert.ok(
    walkthrough?.steps[0].expectedObservation.includes("no saved progress"),
  );
  assert.ok(
    walkthrough?.promptGroups[0].staticInspectionPrompt.includes(
      "Review decision register",
    ),
  );
  assert.equal(
    walkthrough?.promptGroups.every(
      (group) =>
        group.localOnly &&
        group.informationalOnly &&
        group.nonPersistent &&
        group.nonExecutable &&
        group.nonCertifying,
    ),
    true,
  );
  assert.equal(
    walkthrough?.deferredBoundaryNotes.every(
      (note) =>
        note.actionability === "deferred_non_actionable" &&
        note.nonActionable &&
        note.informationalOnly &&
        note.nonExecutable &&
        note.nonCertifying,
    ),
    true,
  );

  for (const step of walkthrough!.steps) {
    assert.ok(step.anchor.href.startsWith("#"));
    assert.ok(
      missionConsoleSource.includes(`id="${step.anchor.anchorId}"`),
      `${step.anchor.anchorId} should resolve to an existing mission-console section`,
    );
  }
});
