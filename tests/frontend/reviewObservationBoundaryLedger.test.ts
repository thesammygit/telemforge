import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationBoundaryLedger } from "../../frontend/src/lib/reviewObservationBoundaryLedger.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationBoundaryLedger derives stable rows from Stage 34 citations", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const citations = view.reviewObservationCitations;
  const ledger = buildReviewObservationBoundaryLedger(citations);

  assert.ok(citations);
  assert.ok(ledger);
  assert.equal(
    ledger.schema,
    "telemforge.review_observation_boundary_ledger.v1",
  );
  assert.equal(ledger.version, 1);
  assert.equal(
    ledger.contractLabel,
    "local deterministic deferred-boundary ledger and static non-goal map",
  );
  assert.equal(ledger.localStatus, "fixture");
  assert.strictEqual(ledger.sourceObservationCitations, citations);
  assert.equal(
    ledger.summary.defaultBoundaryRowId,
    `review-observation-boundary-ledger:${citations.deferredBoundaryCitations[0].sourceSummaryId}`,
  );
  assert.deepEqual(
    ledger.boundaryRows.map((row) => [
      row.sourceSummaryId,
      row.sourceBoundaryCitationId,
      row.label,
      row.sourceSummary,
      row.sourceAnchorIds,
      row.relatedObservationRowIds,
    ]),
    citations.deferredBoundaryCitations.map((citation) => [
      citation.sourceSummaryId,
      citation.citationId,
      citation.label,
      citation.summaryReference,
      citation.sourceAnchorIds,
      citation.sourceObservationRowIds,
    ]),
  );
  assert.deepEqual(
    ledger.boundaryRows.map((row) => row.relatedCitationRowIds),
    citations.deferredBoundaryCitations.map((citation) =>
      citation.sourceObservationRowIds.map(
        (rowId) =>
          `review-observation-citation:${rowId}`,
      ),
    ),
  );
  assert.ok(
    ledger.boundaryRows.every(
      (row) =>
        row.localOnly &&
        row.sourceBacked &&
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

test("buildReviewObservationBoundaryLedger preserves observation, anchor, and source-stage groups as local context", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const citations = view.reviewObservationCitations;
  const ledger = view.reviewObservationBoundaryLedger;
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(citations);
  assert.ok(ledger);
  assert.deepEqual(
    ledger.observationReferenceGroups.map((group) => [
      group.sourceObservationRowId,
      group.sourceCitationRowId,
      group.observationNumber,
      group.workflowGroup,
      group.sourceStageNumber,
      group.sourceSummaryIds,
    ]),
    citations.citationRows.map((row) => [
      row.sourceObservationRowId,
      row.citationRowId,
      row.observationNumber,
      row.workflowGroup,
      row.sourceStageNumber,
      row.deferredBoundarySummaryIds,
    ]),
  );
  const expectedAnchorGroups = citations.anchorCitationGroups.filter((group) =>
    citations.deferredBoundaryCitations.some((citation) =>
      citation.sourceAnchorIds.includes(group.anchorId),
    ),
  );
  assert.deepEqual(
    ledger.anchorReferenceGroups.map((group) => [
      group.anchorId,
      group.href,
      group.localOnly,
      group.inPageOnly,
      group.nonActionable,
      group.nonExecutable,
    ]),
    expectedAnchorGroups.map((group) => [
      group.anchorId,
      group.href,
      true,
      true,
      true,
      true,
    ]),
  );
  for (const group of ledger.anchorReferenceGroups) {
    assert.ok(group.href.startsWith("#"));
    assert.ok(
      missionConsoleSource.includes(`id="${group.anchorId}"`),
      `${group.anchorId} should remain a local in-page anchor`,
    );
  }
  assert.deepEqual(
    ledger.sourceStageBoundaryGroups.map((group) => [
      group.sourceStageNumber,
      group.sourceMapRowId,
      group.boundaryRowIds.length,
      group.sourceSchemas,
      group.sourceContractLabels,
    ]),
    citations.sourceMapRows.map((row) => [
      row.sourceStageNumber,
      row.sourceMapRowId,
      row.deferredBoundarySummaryIds.length,
      row.sourceSchemas,
      row.sourceContractLabels,
    ]),
  );
});

test("buildReviewObservationBoundaryLedger keeps static non-goals explanatory and non-certifying", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const citations = view.reviewObservationCitations;
  const ledger = view.reviewObservationBoundaryLedger;

  assert.ok(citations);
  assert.ok(ledger);
  assert.deepEqual(
    ledger.staticNonGoalNotes.map((note) => [
      note.kind,
      note.sourceBlindSpotCitationNoteId,
      note.relatedBoundaryRowIds.length,
    ]),
    citations.blindSpotCitationNotes.map((note) => [
      note.kind,
      note.citationNoteId,
      note.sourceDeferredBoundarySummaryIds.length,
    ]),
  );
  assert.ok(
    ledger.staticNonGoalNotes.every(
      (note) =>
        note.staticReviewContext &&
        note.informationalOnly &&
        note.nonActionable &&
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
    ledger.staticBoundarySummary,
    "Stage 35 boundary ledger rows are local, static, source-backed, non-actionable, non-persistent, non-executable, non-ranking, and non-certifying; they do not save boundary selections, assign owners, launch tasks, run commands, export reports, score proofs, certify readiness, or add routes.",
  );
});
