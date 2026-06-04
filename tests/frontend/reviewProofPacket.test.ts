import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewProofPacket } from "../../frontend/src/lib/reviewProofPacket.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("Stage 27 proof packet derives packet rows from Stage 26 priority rows and Stage 25 coverage rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const proofPacket = buildReviewProofPacket(view.reviewProofPriority);

  assert.ok(proofPacket);
  assert.equal(proofPacket.schema, "telemforge.review_proof_packet.v1");
  assert.equal(proofPacket.version, 1);
  assert.equal(
    proofPacket.contractLabel,
    "local deterministic review proof packet and static human test gate",
  );
  assert.equal(proofPacket.localStatus, "fixture");
  assert.deepEqual(proofPacket.summary, {
    packetSetId: "candidate-local-review-proof-packet",
    label: "Local proof packet gate",
    summary:
      "3 local proof packets keep the Stage 26 default priority row inspectable; 2 unresolved local packets require static human inspection.",
    defaultPacketId:
      "proof-packet:priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
    defaultPriorityRowId:
      "priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
    defaultCoverageRowId:
      "coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
    defaultHumanGateStepId:
      "proof-gate-step:proof-packet:priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff:inspect-source-chain",
    informationalOnly: true,
    nonCertifying: true,
    counts: {
      totalPacketCount: 3,
      unresolvedLocalProofGapPacketCount: 2,
      readyLocalEvidencePacketCount: 0,
      deferredProductionScopePacketCount: 1,
      sourcePriorityRowCount: 3,
      sourceCoverageRowCount: 3,
      sourceTraceRowCount: 3,
      sourceOutcomeRowCount: 3,
      sourceReadinessRowCount: 3,
      sourceResolutionRowCount: 3,
      sourceMatrixRowCount: 3,
      sourceActionCount: 3,
      evidenceTargetCount: 3,
      proofBucketCount: 4,
      packetSectionCount: 12,
      expectedObservationCount: 12,
      staticHumanGateStepCount: 9,
      staticCommandReferenceCount: 37,
      deferredBoundaryContextCount: 1,
    },
  });
  assert.deepEqual(
    proofPacket.packets.map((packet) => [
      packet.rank,
      packet.status,
      packet.actionability,
      packet.label,
    ]),
    [
      [
        1,
        "unresolved_local_proof_gap",
        "local_review_required",
        "Alert lifecycle needs local follow-up",
      ],
      [
        2,
        "unresolved_local_proof_gap",
        "local_review_required",
        "Evidence export waits on packet gaps",
      ],
      [
        3,
        "deferred_production_scope",
        "deferred_non_actionable",
        "Keep production handoff scope deferred",
      ],
    ],
  );
  assert.strictEqual(proofPacket.sourcePriority, view.reviewProofPriority);
});

test("Stage 27 default proof packet follows the Stage 26 default priority row and preserves source evidence chain ids", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const proofPacket = view.reviewProofPacket;

  assert.ok(proofPacket);
  assert.ok(view.reviewProofPriority);

  const defaultPacket = proofPacket.defaultPacket;
  assert.equal(
    defaultPacket.packetId,
    `proof-packet:${view.reviewProofPriority.defaultPriorityRow.priorityRowId}`,
  );
  assert.equal(
    defaultPacket.sourcePriorityRowId,
    view.reviewProofPriority.defaultPriorityRow.priorityRowId,
  );
  assert.equal(
    defaultPacket.sourceCoverageRowIds[0],
    view.reviewEvidenceCoverage?.coverageRows[0].coverageRowId,
  );
  assert.deepEqual(defaultPacket.sourceEvidenceChain, {
    sourceCoverageRowIds: [
      "coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
    ],
    sourceTraceRowIds: [
      "evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
    ],
    sourceOutcomeRowIds: [
      "review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
    ],
    sourceReadinessRowIds: [
      "review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
    ],
    sourceResolutionIds: [
      "resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
    ],
    sourceMatrixRowIds: [
      "coverage-row-1:action:follow-up:decision:alert-lifecycle-handoff",
    ],
    sourceActionIds: [
      "action:follow-up:decision:alert-lifecycle-handoff",
    ],
    evidenceTargetIds: [
      "evidence-target:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
    ],
    proofBucketLabels: [
      "Unresolved local proof gaps",
      "local_proof_gap",
    ],
    proofCommandIds: [
      "review-evidence-coverage",
      "review-evidence-trace",
      "review-pass-outcome",
      "review-pass-readiness",
      "review-gap-resolution",
      "review-gap-triage",
      "review-coverage-matrix",
      "review-handoff-rehearsal",
      "review-action-walkthrough",
      "review-action-queue",
      "console-view-model",
      "public-repo-guard",
    ],
    staticReviewStepIds: [
      "coverage-static-step:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
    ],
  });
  assert.deepEqual(
    defaultPacket.sections.map((section) => [
      section.kind,
      section.sourcePriorityRowIds,
      section.sourceCoverageRowIds,
      section.localOnly,
      section.nonCertifying,
    ]),
    [
      [
        "source_evidence_chain",
        [defaultPacket.sourcePriorityRowId],
        defaultPacket.sourceCoverageRowIds,
        true,
        true,
      ],
      [
        "expected_local_observations",
        [defaultPacket.sourcePriorityRowId],
        defaultPacket.sourceCoverageRowIds,
        true,
        true,
      ],
      [
        "static_human_gate",
        [defaultPacket.sourcePriorityRowId],
        defaultPacket.sourceCoverageRowIds,
        true,
        true,
      ],
      [
        "deferred_boundary_context",
        [defaultPacket.sourcePriorityRowId],
        defaultPacket.sourceCoverageRowIds,
        true,
        true,
      ],
    ],
  );
  assert.equal(defaultPacket.informationalOnly, true);
  assert.equal(defaultPacket.nonCertifying, true);
});

test("Stage 27 expected observations and static human gate are local, source-backed, non-executing, and non-certifying", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const proofPacket = view.reviewProofPacket;

  assert.ok(proofPacket);

  const defaultPacket = proofPacket.defaultPacket;
  assert.deepEqual(
    defaultPacket.expectedObservations.map((observation) => [
      observation.kind,
      observation.localOnly,
      observation.sourceBacked,
      observation.informationalOnly,
      observation.nonCertifying,
    ]),
    [
      ["source_chain_visible", true, true, true, true],
      ["priority_reason_visible", true, true, true, true],
      ["static_reference_visible", true, true, true, true],
      ["deferred_boundary_visible", true, true, true, true],
    ],
  );
  assert.deepEqual(
    defaultPacket.staticHumanGateSteps.map((step) => [
      step.kind,
      step.repoRelativeReference,
      step.sourcePriorityRowIds,
      step.sourceCoverageRowIds,
      step.localOnly,
      step.sourceBacked,
      step.staticOnly,
      step.nonExecutable,
      step.nonCertifying,
    ]),
    [
      [
        "inspect_source_chain",
        "frontend/src/lib/reviewProofPacket.ts",
        [defaultPacket.sourcePriorityRowId],
        defaultPacket.sourceCoverageRowIds,
        true,
        true,
        true,
        true,
        true,
      ],
      [
        "compare_expected_observations",
        "tests/frontend/reviewProofPacket.test.ts",
        [defaultPacket.sourcePriorityRowId],
        defaultPacket.sourceCoverageRowIds,
        true,
        true,
        true,
        true,
        true,
      ],
      [
        "confirm_non_executing_gate",
        "frontend/src/features/mission-console/MissionConsole.tsx",
        [defaultPacket.sourcePriorityRowId],
        defaultPacket.sourceCoverageRowIds,
        true,
        true,
        true,
        true,
        true,
      ],
    ],
  );
  assert.equal(
    defaultPacket.staticCommandReferences[0].commandId,
    "review-proof-packet",
  );
  assert.equal(
    defaultPacket.staticCommandReferences[0].repoRelativeReference,
    "tests/frontend/reviewProofPacket.test.ts",
  );
  assert.ok(
    defaultPacket.staticCommandReferences.every(
      (command) =>
        command.localOnly &&
        command.staticOnly &&
        command.nonExecutable &&
        !command.repoRelativeReference.startsWith("/") &&
        command.sourcePriorityRowIds.includes(defaultPacket.sourcePriorityRowId),
    ),
  );
});

test("Stage 27 deferred production context stays visible, non-actionable, and separated from the local proof packet gate", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const proofPacket = view.reviewProofPacket;

  assert.ok(proofPacket);

  const deferredPacket = proofPacket.packets.find(
    (packet) => packet.status === "deferred_production_scope",
  );

  assert.ok(deferredPacket);
  assert.equal(deferredPacket.actionability, "deferred_non_actionable");
  assert.deepEqual(deferredPacket.deferredBoundaryContext, [
    {
      boundaryId:
        "proof-packet-boundary:priority-boundary:coverage:trace-boundary:deferred-scope:review-pass:resolution:next-pass-3:action:deferred-production-handoff-scope",
      label: "Keep production handoff scope deferred",
      summary:
        "Production-only scope remains visible for boundary awareness and is not actionable in this local pass.",
      sourcePriorityRowIds: [
        "priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-3:action:deferred-production-handoff-scope",
      ],
      sourceCoverageRowIds: [
        "coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-3:action:deferred-production-handoff-scope",
      ],
      sourceTraceRowIds: [
        "evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-3:action:deferred-production-handoff-scope",
      ],
      sourceOutcomeRowIds: [
        "review-pass-outcome:review-pass:resolution:next-pass-3:action:deferred-production-handoff-scope",
      ],
      evidenceTargetIds: [
        "evidence-target:next-pass-3:action:deferred-production-handoff-scope",
      ],
      actionability: "deferred_non_actionable",
      nonActionable: true,
      nonCertifying: true,
    },
  ]);
  assert.deepEqual(
    proofPacket.deferredBoundaryContexts,
    deferredPacket.deferredBoundaryContext,
  );
  assert.equal(
    proofPacket.defaultPacket.deferredBoundaryContext.length,
    0,
  );
});
