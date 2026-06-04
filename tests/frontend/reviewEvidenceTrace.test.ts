import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewEvidenceTrace } from "../../frontend/src/lib/reviewEvidenceTrace.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("Stage 24 evidence trace derives trace rows from Stage 23 outcome rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const trace = buildReviewEvidenceTrace(view.reviewPassOutcome);

  assert.ok(trace);
  assert.equal(trace.schema, "telemforge.review_evidence_trace.v1");
  assert.equal(trace.version, 1);
  assert.equal(
    trace.contractLabel,
    "local deterministic review evidence trace navigator",
  );
  assert.equal(trace.localStatus, "fixture");
  assert.deepEqual(trace.summary, {
    traceId: "candidate-local-review-evidence-trace",
    label: "Local proof trace navigator",
    summary:
      "2 unresolved local proof gap rows remain; the default trace selects Alert lifecycle needs local follow-up.",
    defaultTraceRowId:
      "evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
    informationalOnly: true,
    nonCertifying: true,
    counts: {
      totalTraceRowCount: 3,
      unresolvedLocalProofGapCount: 2,
      readyLocalEvidenceRowCount: 0,
      deferredProductionScopeRowCount: 1,
      sourceOutcomeRowCount: 3,
      sourceReadinessRowCount: 3,
      sourceResolutionRowCount: 3,
      sourceMatrixRowCount: 3,
      evidenceTargetCount: 3,
      proofCommandReferenceCount: 11,
    },
  });
  assert.deepEqual(
    trace.traceRows.map((row) => [
      row.rank,
      row.status,
      row.outcomeBucket,
      row.label,
    ]),
    [
      [
        1,
        "unresolved_local_proof_gap",
        "local_proof_gap",
        "Alert lifecycle needs local follow-up",
      ],
      [
        2,
        "unresolved_local_proof_gap",
        "local_proof_gap",
        "Evidence export waits on packet gaps",
      ],
      [
        3,
        "deferred_production_scope",
        "deferred_production_scope",
        "Keep production handoff scope deferred",
      ],
    ],
  );
  assert.strictEqual(trace.sourceOutcome, view.reviewPassOutcome);
});

test("Stage 24 default trace selects the highest-priority unresolved local proof gap", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const trace = view.reviewEvidenceTrace;

  assert.ok(trace);
  assert.equal(
    trace.selectedTraceRow.traceRowId,
    trace.summary.defaultTraceRowId,
  );
  assert.equal(trace.selectedTraceRow.rank, 1);
  assert.equal(trace.selectedTraceRow.status, "unresolved_local_proof_gap");
  assert.equal(
    trace.selectedTraceRow.sourceOutcomeRowIds[0],
    view.reviewPassOutcome?.outcomeRows[0].outcomeRowId,
  );
});

test("Stage 24 trace rows expose source outcome, readiness, resolution, matrix, action, evidence, bucket, and proof ids", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const trace = view.reviewEvidenceTrace;

  assert.ok(trace);

  const firstRow = trace.traceRows[0];
  assert.deepEqual(firstRow.sourceOutcomeRowIds, [
    "review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
  ]);
  assert.deepEqual(firstRow.sourceReadinessRowIds, [
    "review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
  ]);
  assert.deepEqual(firstRow.sourceResolutionIds, [
    "resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
  ]);
  assert.deepEqual(firstRow.sourceMatrixRowIds, [
    "coverage-row-1:action:follow-up:decision:alert-lifecycle-handoff",
  ]);
  assert.deepEqual(firstRow.sourceActionIds, [
    "action:follow-up:decision:alert-lifecycle-handoff",
  ]);
  assert.deepEqual(firstRow.evidenceTargetIds, [
    "evidence-target:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
  ]);
  assert.deepEqual(firstRow.sourceBucketLabels, [
    "Briefing board rows",
    "Replay frames",
    "Runbook targets",
    "Incident packet refs",
    "Evidence export refs",
    "Source paths",
  ]);
  assert.deepEqual(
    firstRow.sourceReferenceGroups.map((group) => [
      group.sourceKind,
      group.label,
      group.sourceIds.length,
    ]),
    [
      ["outcome", "Stage 23 outcome rows", 1],
      ["readiness", "Stage 22 readiness rows", 1],
      ["resolution", "Stage 21 resolution rows", 1],
      ["coverage", "Stage 19 coverage matrix rows", 1],
      ["action", "Source action ids", 1],
      ["evidence_target", "Evidence target ids", 1],
      ["source_bucket", "Source bucket ids", 6],
    ],
  );
  assert.deepEqual(
    firstRow.proofCommandReferences.map((command) => command.commandId),
    [
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
  );
});

test("Stage 24 trace segments preserve outcome, readiness, resolution, coverage, proof, and deferred boundaries", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const trace = view.reviewEvidenceTrace;

  assert.ok(trace);
  assert.deepEqual(
    trace.selectedTraceRow.traceSegments.map((segment) => segment.segmentKind),
    ["outcome", "readiness", "resolution", "coverage", "proof"],
  );

  const proofSegment = trace.selectedTraceRow.traceSegments.find(
    (segment) => segment.segmentKind === "proof",
  );
  assert.ok(proofSegment);
  assert.equal(proofSegment.proofCommandIds[0], "review-evidence-trace");
  assert.equal(
    proofSegment.nextStaticLocalReviewStep,
    trace.selectedTraceRow.nextStaticLocalReviewStep,
  );

  const deferredTrace = trace.traceRows.find(
    (row) => row.status === "deferred_production_scope",
  );
  assert.ok(deferredTrace);
  assert.deepEqual(
    deferredTrace.traceSegments.map((segment) => segment.segmentKind),
    [
      "outcome",
      "readiness",
      "resolution",
      "coverage",
      "proof",
      "deferred_scope",
    ],
  );
  assert.deepEqual(trace.deferredBoundaryNotes, [
    {
      noteId:
        "trace-boundary:deferred-scope:review-pass:resolution:next-pass-3:action:deferred-production-handoff-scope",
      label: "Keep production handoff scope deferred",
      summary:
        "Production-only scope remains visible for boundary awareness and is not actionable in this local pass.",
      sourceReadinessRowIds: [
        "review-pass:resolution:next-pass-3:action:deferred-production-handoff-scope",
      ],
      sourceResolutionIds: [
        "resolution:next-pass-3:action:deferred-production-handoff-scope",
      ],
      sourceMatrixRowIds: [
        "coverage-row-3:action:deferred-production-handoff-scope",
      ],
      sourceActionIds: ["action:deferred-production-handoff-scope"],
      evidenceTargetIds: [
        "evidence-target:next-pass-3:action:deferred-production-handoff-scope",
      ],
      actionability: "deferred_non_actionable",
      nextStaticLocalReviewStep:
        "Keep production handoff scope deferred in Stage 23; do not add reviewer ownership, signoff, persistence, production handoff, ticketing, report export, or command-runner work.",
    },
  ]);
});

test("Stage 24 proof drilldown remains static, repo-relative, informational, and non-certifying", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const trace = view.reviewEvidenceTrace;

  assert.ok(trace);
  assert.equal(trace.summary.informationalOnly, true);
  assert.equal(trace.summary.nonCertifying, true);
  assert.equal(trace.selectedTraceRow.informationalOnly, true);
  assert.equal(trace.selectedTraceRow.nonCertifying, true);
  assert.equal(
    trace.staticProofChecklistSummary,
    "Stage 24 proof drilldown references are static repo-relative text only; the mission console does not execute commands, store selections, or certify production readiness.",
  );

  for (const command of trace.proofCommandReferences) {
    assert.equal(command.command.startsWith("/"), false);
    assert.equal(command.command.includes("&&"), false);
    assert.equal(command.command.includes(";"), false);
    assert.equal(command.command.includes("$("), false);
    assert.equal(command.command.includes("`"), false);
    assert.match(command.command, /^(node|python3) /);
  }
});
