import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationCoverage } from "../../frontend/src/lib/reviewObservationCoverage.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationCoverage derives stable phase and source-stage rows from the Stage 32 lens", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const lens = view.reviewObservationLens;
  const coverage = buildReviewObservationCoverage(lens);

  assert.ok(lens);
  assert.ok(coverage);
  assert.equal(coverage.schema, "telemforge.review_observation_coverage.v1");
  assert.equal(coverage.version, 1);
  assert.equal(
    coverage.contractLabel,
    "local deterministic observation coverage matrix and static blind-spot map",
  );
  assert.equal(coverage.localStatus, "fixture");
  assert.strictEqual(coverage.sourceObservationLens, lens);
  assert.equal(
    coverage.summary.defaultPhaseRowId,
    "review-observation-coverage-phase:decision",
  );
  assert.equal(
    coverage.summary.defaultSourceStageRowId,
    "review-observation-coverage-source-stage:14",
  );
  assert.equal(
    coverage.summary.defaultAttentionCoverageRowId,
    "review-observation-coverage-attention:source_alignment",
  );
  assert.deepEqual(
    coverage.phaseCoverageRows.map((row) => [
      row.workflowGroup,
      row.order,
      row.observationRowIds.length,
      row.sourceStageNumbers,
    ]),
    [
      ["decision", 1, 2, [14, 15]],
      ["action", 2, 3, [16, 17, 18]],
      ["readiness", 3, 4, [19, 20, 21, 22]],
      ["evidence", 4, 3, [23, 24, 25]],
      ["proof", 5, 2, [26, 27]],
      ["navigator", 6, 1, [28]],
      ["reconciliation", 7, 1, [29]],
    ],
  );
  assert.deepEqual(
    coverage.sourceStageCoverageRows.map((row) => [
      row.sourceStageNumber,
      row.observationRowIds,
      row.workflowGroups,
      row.anchorIds,
    ]),
    lens.observationRows.map((row) => [
      row.sourceStageNumber,
      [row.observationRowId],
      [row.workflowGroup],
      [row.anchor.anchorId],
    ]),
  );
  assert.equal(coverage.summary.counts.phaseCoverageRowCount, 7);
  assert.equal(coverage.summary.counts.sourceStageCoverageRowCount, 16);
  assert.equal(coverage.summary.counts.attentionCoverageRowCount, 4);
  assert.equal(
    coverage.summary.counts.localAnchorCount,
    lens.anchorReferences.length,
  );
  assert.equal(
    coverage.summary.counts.countSignalCount,
    lens.countSignals.length,
  );
  assert.equal(
    coverage.summary.counts.deferredBoundaryCount,
    lens.deferredBoundarySummaries.length,
  );
  assert.equal(coverage.summary.counts.blindSpotRowCount, 4);
});

test("buildReviewObservationCoverage preserves attention, anchor, count, and deferred coverage as local context", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const lens = view.reviewObservationLens;
  const coverage = view.reviewObservationCoverage;
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(lens);
  assert.ok(coverage);
  assert.deepEqual(
    coverage.attentionCoverageRows.map((row) => [
      row.sourceAttentionGroupId,
      row.kind,
      row.order,
      row.observationRowIds.length,
      row.countSignalIds.length,
      row.deferredBoundarySummaryIds.length,
      row.localOnly,
      row.nonPersistent,
      row.nonExecutable,
      row.nonCertifying,
      row.nonRanking,
    ]),
    lens.attentionGroups.map((group) => [
      group.attentionGroupId,
      group.kind,
      group.order,
      group.observationRowIds.length,
      group.countSignalIds.length,
      group.deferredBoundarySummaryIds.length,
      true,
      true,
      true,
      true,
      true,
    ]),
  );
  assert.deepEqual(
    coverage.anchorCoverage.anchorIds,
    lens.anchorReferences.map((anchor) => anchor.anchorId),
  );
  assert.equal(
    coverage.anchorCoverage.localHrefCount,
    lens.anchorReferences.filter((anchor) => anchor.href.startsWith("#")).length,
  );
  for (const anchorId of coverage.anchorCoverage.anchorIds) {
    assert.ok(
      missionConsoleSource.includes(`id="${anchorId}"`),
      `${anchorId} should remain a local in-page anchor`,
    );
  }
  assert.deepEqual(
    coverage.countSignalCoverage.signalIds,
    lens.countSignals.map((signal) => signal.signalId),
  );
  assert.ok(
    coverage.countSignalCoverage.sourcePaths.every(
      (sourcePath) => !sourcePath.startsWith("/"),
    ),
  );
  assert.deepEqual(
    coverage.deferredBoundaryCoverage.summaryIds,
    lens.deferredBoundarySummaries.map((summary) => summary.summaryId),
  );
  assert.equal(coverage.deferredBoundaryCoverage.nonActionable, true);
  assert.equal(coverage.countSignalCoverage.nonRanking, true);
});

test("buildReviewObservationCoverage blind spots are static notes, not tasks or scoring", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const coverage = view.reviewObservationCoverage;

  assert.ok(coverage);
  assert.deepEqual(
    coverage.blindSpotRows.map((row) => row.kind),
    [
      "absent_saved_review_state",
      "absent_identity_or_signoff",
      "absent_execution_or_scoring",
      "deferred_production_boundary",
    ],
  );
  assert.ok(
    coverage.blindSpotRows.every(
      (row) =>
        row.staticReviewContext &&
        row.informationalOnly &&
        row.nonPersistent &&
        row.nonExecutable &&
        row.nonCertifying &&
        row.nonRanking &&
        row.notATask &&
        row.notATicket &&
        row.notAChecklist &&
        row.notOwnerAssigned &&
        row.sourceObservationRowIds.length ===
          coverage.sourceObservationLens.observationRows.length,
    ),
  );
  assert.equal(
    coverage.blindSpotRows.find(
      (row) => row.kind === "deferred_production_boundary",
    )?.sourceDeferredBoundarySummaryIds.length,
    coverage.sourceObservationLens.deferredBoundarySummaries.length,
  );
  assert.equal(
    coverage.staticCoverageSummary,
    "Stage 33 coverage remains local, static, source-backed, non-persistent, non-executable, non-ranking, and non-certifying; it does not save observations, store notes, assign owners, run commands, export reports, score proofs, certify readiness, or add routes.",
  );
});
