import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationCitations } from "../../frontend/src/lib/reviewObservationCitations.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationCitations derives stable citation rows from Stage 33 coverage", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const coverage = view.reviewObservationCoverage;
  const lens = view.reviewObservationLens;
  const citations = buildReviewObservationCitations(coverage);

  assert.ok(coverage);
  assert.ok(lens);
  assert.ok(citations);
  assert.equal(citations.schema, "telemforge.review_observation_citations.v1");
  assert.equal(citations.version, 1);
  assert.equal(
    citations.contractLabel,
    "local deterministic observation citation trail and source map",
  );
  assert.equal(citations.localStatus, "fixture");
  assert.strictEqual(citations.sourceObservationCoverage, coverage);
  assert.equal(
    citations.summary.defaultCitationRowId,
    "review-observation-citation:review-observation:review-walkthrough-step:review-decision-register",
  );
  assert.equal(
    citations.summary.defaultSourceMapRowId,
    "review-observation-citation-source-map:14",
  );
  assert.equal(
    citations.summary.defaultPhaseCitationGroupId,
    "review-observation-citation-phase:decision",
  );
  assert.deepEqual(
    citations.citationRows.map((row) => [
      row.sourceStageNumber,
      row.workflowGroup,
      row.localAnchor.anchorId,
      row.sourceSchema,
      row.sourceContractLabel,
      row.sourceCoveragePhaseRowId,
      row.sourceCoverageStageRowId,
    ]),
    lens.observationRows.map((row) => [
      row.sourceStageNumber,
      row.workflowGroup,
      row.anchor.anchorId,
      row.sourceSchema,
      row.sourceContractLabel,
      `review-observation-coverage-phase:${row.workflowGroup}`,
      `review-observation-coverage-source-stage:${row.sourceStageNumber}`,
    ]),
  );
  assert.deepEqual(
    citations.phaseCitationGroups.map((group) => [
      group.workflowGroup,
      group.order,
      group.citationRowIds.length,
      group.sourceStageNumbers,
    ]),
    coverage.phaseCoverageRows.map((row) => [
      row.workflowGroup,
      row.order,
      row.observationRowIds.length,
      row.sourceStageNumbers,
    ]),
  );
  assert.deepEqual(
    citations.sourceMapRows.map((row) => [
      row.sourceStageNumber,
      row.citationRowIds.length,
      row.workflowGroups,
      row.sourceSchemas,
      row.sourceContractLabels,
    ]),
    coverage.sourceStageCoverageRows.map((row) => [
      row.sourceStageNumber,
      row.observationRowIds.length,
      row.workflowGroups,
      row.sourceSchemas,
      row.sourceContractLabels,
    ]),
  );
});

test("buildReviewObservationCitations preserves anchors, count paths, and deferred-boundary references as local context", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const citations = view.reviewObservationCitations;
  const lens = view.reviewObservationLens;
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(citations);
  assert.ok(lens);
  assert.equal(
    citations.summary.counts.citationRowCount,
    lens.observationRows.length,
  );
  assert.equal(
    citations.summary.counts.countSignalCitationCount,
    lens.countSignals.length,
  );
  assert.equal(
    citations.summary.counts.deferredBoundaryCitationCount,
    lens.deferredBoundarySummaries.length,
  );
  assert.deepEqual(
    citations.anchorCitationGroups.map((group) => [
      group.anchorId,
      group.href,
      group.citationRowIds.length,
      group.localOnly,
      group.inPageOnly,
    ]),
    lens.anchorReferences.map((anchor) => [
      anchor.anchorId,
      anchor.href,
      1,
      true,
      true,
    ]),
  );
  for (const group of citations.anchorCitationGroups) {
    assert.ok(group.href.startsWith("#"));
    assert.ok(
      missionConsoleSource.includes(`id="${group.anchorId}"`),
      `${group.anchorId} should remain a local in-page anchor`,
    );
  }
  assert.ok(
    citations.countSignalCitations.every(
      (citation) =>
        citation.localOnly &&
        citation.sourceBacked &&
        citation.informationalOnly &&
        citation.nonPersistent &&
        citation.nonExecutable &&
        citation.nonCertifying &&
        citation.nonRanking &&
        !citation.sourcePath.startsWith("/"),
    ),
  );
  assert.deepEqual(
    citations.deferredBoundaryCitations.map((citation) => [
      citation.sourceSummaryId,
      citation.sourceObservationRowIds.length,
      citation.nonActionable,
      citation.nonExecutable,
      citation.nonCertifying,
      citation.nonRanking,
    ]),
    lens.deferredBoundarySummaries.map((summary) => [
      summary.summaryId,
      lens.observationRows.filter((row) =>
        row.deferredBoundarySummaryIds.includes(summary.summaryId),
      ).length,
      true,
      true,
      true,
      true,
    ]),
  );
});

test("buildReviewObservationCitations keeps blind-spot notes static and non-certifying", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const citations = view.reviewObservationCitations;
  const coverage = view.reviewObservationCoverage;

  assert.ok(citations);
  assert.ok(coverage);
  assert.deepEqual(
    citations.blindSpotCitationNotes.map((note) => note.kind),
    coverage.blindSpotRows.map((row) => row.kind),
  );
  assert.ok(
    citations.blindSpotCitationNotes.every(
      (note) =>
        note.staticReviewContext &&
        note.informationalOnly &&
        note.nonPersistent &&
        note.nonExecutable &&
        note.nonCertifying &&
        note.nonRanking &&
        note.notATask &&
        note.notATicket &&
        note.notAChecklist &&
        note.notOwnerAssigned,
    ),
  );
  assert.equal(
    citations.staticCitationSummary,
    "Stage 34 citations are local, static, source-backed, non-persistent, non-executable, non-ranking, and non-certifying; they do not save citation selections, store observations, assign owners, run commands, export reports, score proofs, certify readiness, or add routes.",
  );
});
