import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationBoundaryWalkthrough } from "../../frontend/src/lib/reviewObservationBoundaryWalkthrough.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationBoundaryWalkthrough derives ordered steps from the Stage 35 ledger", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const ledger = view.reviewObservationBoundaryLedger;
  const walkthrough = buildReviewObservationBoundaryWalkthrough(ledger);

  assert.ok(ledger);
  assert.ok(walkthrough);
  assert.equal(
    walkthrough.schema,
    "telemforge.review_observation_boundary_walkthrough.v1",
  );
  assert.equal(walkthrough.version, 1);
  assert.equal(
    walkthrough.contractLabel,
    "local deterministic boundary walkthrough and static source path",
  );
  assert.equal(walkthrough.localStatus, "fixture");
  assert.strictEqual(walkthrough.sourceObservationBoundaryLedger, ledger);
  assert.equal(
    walkthrough.summary.defaultStepId,
    walkthrough.steps[0].stepId,
  );
  assert.equal(
    walkthrough.defaultFocus.sourceBoundaryRowId,
    ledger.boundaryRows[0].boundaryRowId,
  );
  assert.deepEqual(
    walkthrough.steps.map((step) => [
      step.stepNumber,
      step.sourceBoundaryRowId,
      step.sourceBoundaryCitationId,
      step.sourceSummaryId,
      step.label,
      step.sourceSummary,
      step.sourceAnchorHrefs,
      step.relatedObservationRowIds,
      step.relatedSourceStageNumbers,
      step.staticNonGoalNoteIds,
    ]),
    ledger.boundaryRows.map((row, index) => [
      index + 1,
      row.boundaryRowId,
      row.sourceBoundaryCitationId,
      row.sourceSummaryId,
      row.label,
      row.sourceSummary,
      row.sourceAnchorHrefs,
      row.relatedObservationRowIds,
      row.relatedSourceStageNumbers,
      row.staticNonGoalNoteIds,
    ]),
  );
  assert.ok(
    walkthrough.steps.every(
      (step) =>
        step.localOnly &&
        step.sourceBacked &&
        step.informationalOnly &&
        step.nonActionable &&
        step.nonPersistent &&
        step.nonExecutable &&
        step.nonCertifying &&
        step.nonRanking &&
        step.inPageOnly &&
        step.notATask &&
        step.notATicket &&
        step.notAChecklist &&
        step.notOwnerAssigned,
    ),
  );
});

test("buildReviewObservationBoundaryWalkthrough keeps source paths and guardrails source-backed", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const ledger = view.reviewObservationBoundaryLedger;
  const walkthrough = view.reviewObservationBoundaryWalkthrough;
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(ledger);
  assert.ok(walkthrough);
  assert.equal(
    walkthrough.summary.counts.sourcePathGroupCount,
    ledger.sourceStageBoundaryGroups.length,
  );
  assert.equal(
    walkthrough.summary.counts.staticGuardrailGroupCount,
    ledger.staticNonGoalNotes.length,
  );
  assert.deepEqual(
    walkthrough.sourcePathGroups.map((group) => [
      group.sourceStageNumber,
      group.sourceStageGroupId,
      group.boundaryRowIds,
      group.anchorHrefs,
      group.sourceSchemas,
      group.sourceContractLabels,
    ]),
    ledger.sourceStageBoundaryGroups.map((group) => [
      group.sourceStageNumber,
      group.sourceStageGroupId,
      group.boundaryRowIds,
      group.anchorHrefs,
      group.sourceSchemas,
      group.sourceContractLabels,
    ]),
  );
  assert.deepEqual(
    walkthrough.staticGuardrailGroups.map((group) => [
      group.sourceNonGoalNoteId,
      group.kind,
      group.boundaryRowIds,
      group.sourceObservationRowIds,
      group.sourceAnchorIds,
    ]),
    ledger.staticNonGoalNotes.map((note) => [
      note.nonGoalNoteId,
      note.kind,
      note.relatedBoundaryRowIds,
      note.sourceObservationRowIds,
      note.sourceAnchorIds,
    ]),
  );
  for (const group of walkthrough.sourcePathGroups) {
    assert.ok(group.anchorHrefs.every((href) => href.startsWith("#")));
  }
  assert.ok(
    walkthrough.sourcePathGroups.every(
      (group) =>
        group.localOnly &&
        group.sourceBacked &&
        group.informationalOnly &&
        group.nonActionable &&
        group.nonPersistent &&
        group.nonExecutable &&
        group.nonCertifying &&
        group.nonRanking &&
        group.inPageOnly,
    ),
  );
  assert.ok(
    walkthrough.staticGuardrailGroups.every(
      (group) =>
        group.localOnly &&
        group.staticReviewContext &&
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
  assert.ok(
    missionConsoleSource.includes('id="review-observation-boundary-walkthrough"'),
    "Mission console should expose a local Stage 36 walkthrough anchor",
  );
});

test("buildReviewObservationBoundaryWalkthrough returns undefined without ledger rows", () => {
  assert.equal(buildReviewObservationBoundaryWalkthrough(undefined), undefined);
});
