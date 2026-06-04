import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewProofNavigator } from "../../frontend/src/lib/reviewProofNavigator.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("Stage 28 proof navigator derives ordered navigator rows from Stage 27 proof packets", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const proofNavigator = buildReviewProofNavigator(view.reviewProofPacket);

  assert.ok(proofNavigator);
  assert.ok(view.reviewProofPacket);
  assert.equal(proofNavigator.schema, "telemforge.review_proof_navigator.v1");
  assert.equal(proofNavigator.version, 1);
  assert.equal(
    proofNavigator.contractLabel,
    "local deterministic review proof navigator and source crosswalk",
  );
  assert.equal(proofNavigator.localStatus, "fixture");
  assert.equal(
    proofNavigator.summary.defaultPacketId,
    view.reviewProofPacket.summary.defaultPacketId,
  );
  assert.equal(
    proofNavigator.summary.defaultNavigatorRowId,
    `proof-navigator:${view.reviewProofPacket.summary.defaultPacketId}`,
  );
  assert.equal(proofNavigator.summary.defaultLaneId, "proof-navigator-lane:local_proof_gap");
  assert.equal(proofNavigator.summary.counts.totalNavigatorRowCount, 3);
  assert.equal(proofNavigator.summary.counts.localProofGapNavigatorRowCount, 2);
  assert.equal(proofNavigator.summary.counts.readyLocalEvidenceNavigatorRowCount, 0);
  assert.equal(proofNavigator.summary.counts.deferredProductionNavigatorRowCount, 1);
  assert.equal(proofNavigator.summary.counts.reviewLaneCount, 3);
  assert.equal(proofNavigator.summary.counts.sourceCrosswalkRowCount, 3);
  assert.equal(proofNavigator.summary.counts.staticInspectionPromptCount, 3);
  assert.equal(
    proofNavigator.summary.counts.staticCommandReferenceCount,
    view.reviewProofPacket.proofCommandReferences.length + 1,
  );
  assert.deepEqual(
    proofNavigator.navigatorRows.map((row) => [
      row.rank,
      row.laneKind,
      row.packetStatus,
      row.actionability,
      row.defaultRow,
      row.packetId,
    ]),
    view.reviewProofPacket.packets.map((packet, index) => [
      index + 1,
      packet.status === "deferred_production_scope"
        ? "deferred_production_scope"
        : packet.status === "ready_local_evidence"
          ? "ready_local_evidence"
          : "local_proof_gap",
      packet.status,
      packet.actionability,
      packet.packetId === view.reviewProofPacket?.summary.defaultPacketId,
      packet.packetId,
    ]),
  );
  assert.deepEqual(
    proofNavigator.reviewLanes.map((lane) => [
      lane.laneKind,
      lane.rowCount,
      lane.navigatorRowIds,
      lane.localOnly,
      lane.nonCertifying,
    ]),
    [
      [
        "local_proof_gap",
        2,
        proofNavigator.navigatorRows.slice(0, 2).map((row) => row.navigatorRowId),
        true,
        true,
      ],
      ["ready_local_evidence", 0, [], true, true],
      [
        "deferred_production_scope",
        1,
        [proofNavigator.navigatorRows[2].navigatorRowId],
        true,
        true,
      ],
    ],
  );
  assert.strictEqual(proofNavigator.sourceProofPacket, view.reviewProofPacket);
});

test("Stage 28 default navigator row follows the Stage 27 default packet and preserves source chains", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const proofNavigator = view.reviewProofNavigator;

  assert.ok(proofNavigator);
  assert.ok(view.reviewProofPacket);

  const defaultPacket = view.reviewProofPacket.defaultPacket;
  const defaultRow = proofNavigator.defaultNavigatorRow;
  const defaultCrosswalk = proofNavigator.sourceCrosswalkRows.find(
    (row) => row.packetId === defaultPacket.packetId,
  );

  assert.equal(defaultRow.packetId, defaultPacket.packetId);
  assert.equal(defaultRow.sourcePriorityRowId, defaultPacket.sourcePriorityRowId);
  assert.deepEqual(defaultRow.sourceCoverageRowIds, defaultPacket.sourceCoverageRowIds);
  assert.deepEqual(defaultRow.sourceTraceRowIds, defaultPacket.sourceTraceRowIds);
  assert.deepEqual(defaultRow.sourceOutcomeRowIds, defaultPacket.sourceOutcomeRowIds);
  assert.deepEqual(defaultRow.sourceReadinessRowIds, defaultPacket.sourceReadinessRowIds);
  assert.deepEqual(defaultRow.sourceResolutionIds, defaultPacket.sourceResolutionIds);
  assert.deepEqual(defaultRow.sourceMatrixRowIds, defaultPacket.sourceMatrixRowIds);
  assert.deepEqual(defaultRow.sourceActionIds, defaultPacket.sourceActionIds);
  assert.deepEqual(defaultRow.evidenceTargetIds, defaultPacket.evidenceTargetIds);
  assert.deepEqual(defaultRow.proofBucketLabels, defaultPacket.proofBucketLabels);
  assert.deepEqual(defaultRow.proofCommandIds, defaultPacket.proofCommandIds);
  assert.deepEqual(
    defaultRow.staticHumanGateStepIds,
    defaultPacket.staticHumanGateSteps.map((step) => step.gateStepId),
  );
  assert.deepEqual(defaultRow.sourceStaticReviewStepIds, defaultPacket.staticReviewStepIds);
  assert.equal(defaultRow.informationalOnly, true);
  assert.equal(defaultRow.nonCertifying, true);

  assert.ok(defaultCrosswalk);
  assert.equal(defaultCrosswalk.navigatorRowId, defaultRow.navigatorRowId);
  assert.equal(defaultCrosswalk.sourcePriorityRowId, defaultPacket.sourcePriorityRowId);
  assert.deepEqual(defaultCrosswalk.sourceCoverageRowIds, defaultPacket.sourceCoverageRowIds);
  assert.deepEqual(defaultCrosswalk.sourceTraceRowIds, defaultPacket.sourceTraceRowIds);
  assert.deepEqual(defaultCrosswalk.sourceOutcomeRowIds, defaultPacket.sourceOutcomeRowIds);
  assert.deepEqual(defaultCrosswalk.evidenceTargetIds, defaultPacket.evidenceTargetIds);
  assert.deepEqual(defaultCrosswalk.proofCommandIds, defaultPacket.proofCommandIds);
  assert.deepEqual(defaultCrosswalk.staticHumanGateStepIds, defaultRow.staticHumanGateStepIds);
  assert.ok(defaultCrosswalk.repoRelativeReferences.length > 0);
  assert.ok(
    defaultCrosswalk.repoRelativeReferences.every(
      (reference) => !reference.startsWith("/"),
    ),
  );
  assert.equal(defaultCrosswalk.localOnly, true);
  assert.equal(defaultCrosswalk.sourceBacked, true);
  assert.equal(defaultCrosswalk.nonExecutable, true);
  assert.equal(defaultCrosswalk.nonCertifying, true);
});

test("Stage 28 static prompts and deferred markers stay local, non-executing, and non-certifying", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const proofNavigator = view.reviewProofNavigator;

  assert.ok(proofNavigator);
  assert.ok(view.reviewProofPacket);

  assert.ok(
    proofNavigator.staticInspectionPrompts.every(
      (prompt) =>
        prompt.localOnly &&
        prompt.sourceBacked &&
        prompt.staticOnly &&
        prompt.nonExecutable &&
        prompt.nonCertifying &&
        prompt.repoRelativeReferences.includes(
          "frontend/src/lib/reviewProofNavigator.ts",
        ) &&
        prompt.repoRelativeReferences.every(
          (reference) => !reference.startsWith("/"),
        ),
    ),
  );
  assert.equal(
    proofNavigator.staticCommandReferences[0].commandId,
    "review-proof-navigator",
  );
  assert.equal(
    proofNavigator.staticCommandReferences[0].repoRelativeReference,
    "tests/frontend/reviewProofNavigator.test.ts",
  );
  assert.ok(
    proofNavigator.staticCommandReferences.every(
      (reference) =>
        reference.localOnly &&
        reference.staticOnly &&
        reference.nonExecutable &&
        !reference.repoRelativeReference.startsWith("/"),
    ),
  );
  assert.equal(
    proofNavigator.staticNavigatorSummary,
    "Stage 28 proof navigator rows, source crosswalks, prompts, and command references are static, local, non-executable, informational, and non-certifying; the mission console does not save navigator selections, store reviewer progress, run commands, or export handoff reports.",
  );

  const deferredPacket = view.reviewProofPacket.packets.find(
    (packet) => packet.status === "deferred_production_scope",
  );

  assert.ok(deferredPacket);
  assert.deepEqual(proofNavigator.deferredBoundaryMarkers, [
    {
      markerId: `proof-navigator-boundary:${proofNavigator.navigatorRows[2].navigatorRowId}:${deferredPacket.deferredBoundaryContext[0].boundaryId}`,
      navigatorRowId: proofNavigator.navigatorRows[2].navigatorRowId,
      packetId: deferredPacket.packetId,
      label: deferredPacket.deferredBoundaryContext[0].label,
      summary: deferredPacket.deferredBoundaryContext[0].summary,
      sourcePriorityRowIds: deferredPacket.deferredBoundaryContext[0].sourcePriorityRowIds,
      sourceCoverageRowIds: deferredPacket.deferredBoundaryContext[0].sourceCoverageRowIds,
      sourceTraceRowIds: deferredPacket.deferredBoundaryContext[0].sourceTraceRowIds,
      sourceOutcomeRowIds: deferredPacket.deferredBoundaryContext[0].sourceOutcomeRowIds,
      evidenceTargetIds: deferredPacket.deferredBoundaryContext[0].evidenceTargetIds,
      actionability: "deferred_non_actionable",
      nonActionable: true,
      nonCertifying: true,
    },
  ]);
  assert.deepEqual(proofNavigator.defaultNavigatorRow.deferredBoundaryMarkerIds, []);
});
