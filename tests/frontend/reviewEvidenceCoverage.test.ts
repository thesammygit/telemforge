import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewEvidenceCoverage } from "../../frontend/src/lib/reviewEvidenceCoverage.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("Stage 25 evidence coverage derives coverage rows from Stage 24 trace rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const coverage = buildReviewEvidenceCoverage(view.reviewEvidenceTrace);

  assert.ok(coverage);
  assert.equal(coverage.schema, "telemforge.review_evidence_coverage.v1");
  assert.equal(coverage.version, 1);
  assert.equal(
    coverage.contractLabel,
    "local deterministic review evidence coverage map",
  );
  assert.equal(coverage.localStatus, "fixture");
  assert.deepEqual(coverage.summary, {
    coverageId: "candidate-local-review-evidence-coverage",
    label: "Local proof coverage map",
    summary:
      "2 unresolved local proof gap rows are ranked first; inspect Alert lifecycle needs local follow-up.",
    defaultCoverageRowId:
      "coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
    defaultCoverageGroupId: "coverage-group:unresolved_local_proof_gap",
    defaultProofBucketLabel: "Unresolved local proof gaps",
    informationalOnly: true,
    nonCertifying: true,
    counts: {
      totalCoverageRowCount: 3,
      unresolvedLocalProofGapCount: 2,
      readyLocalEvidenceRowCount: 0,
      deferredProductionScopeRowCount: 1,
      sourceTraceRowCount: 3,
      sourceOutcomeRowCount: 3,
      sourceReadinessRowCount: 3,
      sourceResolutionRowCount: 3,
      sourceMatrixRowCount: 3,
      evidenceTargetCount: 3,
      sourceBucketLabelCount: 6,
      proofBucketCount: 4,
      proofCommandReferenceCount: 12,
      staticReviewStepCount: 3,
      bucketRowCount: 12,
      deferredBoundaryNoteCount: 1,
    },
  });
  assert.deepEqual(
    coverage.coverageRows.map((row) => [
      row.rank,
      row.status,
      row.actionability,
      row.label,
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
  assert.strictEqual(coverage.sourceTrace, view.reviewEvidenceTrace);
});

test("Stage 25 coverage rows expose trace, outcome, evidence, bucket, proof, and static review step fields", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const coverage = view.reviewEvidenceCoverage;

  assert.ok(coverage);

  const firstRow = coverage.coverageRows[0];
  assert.deepEqual(firstRow.sourceTraceRowIds, [
    "evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
  ]);
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
  assert.deepEqual(firstRow.proofBucketLabels, [
    "Unresolved local proof gaps",
    "local_proof_gap",
  ]);
  assert.deepEqual(
    firstRow.proofCommandIds,
    [
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
  );
  assert.deepEqual(firstRow.nextStaticReviewSteps, [
    {
      stepId:
        "coverage-static-step:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
      label: "Alert lifecycle needs local follow-up",
      summary:
        "Review Alert lifecycle needs local follow-up in the Stage 21 resolution checklist, confirm the mapped Stage 19 source rows, then run the listed static proof references before the next local review pass.",
      sourceTraceRowIds: [
        "evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
      ],
      sourceOutcomeRowIds: [
        "review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
      ],
      evidenceTargetIds: [
        "evidence-target:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
      ],
      proofCommandIds: firstRow.proofCommandIds,
      repoRelativeReference: "tests/frontend/reviewEvidenceCoverage.test.ts",
      nonExecutable: true,
    },
  ]);
  assert.deepEqual(firstRow.deferredBoundaryNotes, []);
});

test("Stage 25 proof-gap groups and bucket rows separate local gaps from deferred production scope", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const coverage = view.reviewEvidenceCoverage;

  assert.ok(coverage);
  assert.deepEqual(
    coverage.coverageGroups.map((group) => [
      group.groupId,
      group.priority,
      group.rowCount,
      group.proofBucketLabel,
    ]),
    [
      [
        "coverage-group:unresolved_local_proof_gap",
        "p0",
        2,
        "Unresolved local proof gaps",
      ],
      [
        "coverage-group:deferred_production_scope",
        "p2",
        1,
        "Deferred production boundaries",
      ],
    ],
  );

  const briefingBucket = coverage.bucketRows.find(
    (row) =>
      row.status === "unresolved_local_proof_gap" &&
      row.sourceBucketLabel === "Briefing board rows",
  );
  assert.ok(briefingBucket);
  assert.deepEqual(briefingBucket, {
    bucketRowId:
      "coverage-bucket:unresolved_local_proof_gap:briefing-board-rows",
    status: "unresolved_local_proof_gap",
    sourceBucketLabel: "Briefing board rows",
    proofBucketLabel: "Unresolved local proof gaps",
    rowCount: 2,
    sourceTraceRowIds: [
      "evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
      "evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-2:action:follow-up:decision:evidence-export-boundary",
    ],
    sourceOutcomeRowIds: [
      "review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
      "review-pass-outcome:review-pass:resolution:next-pass-2:action:follow-up:decision:evidence-export-boundary",
    ],
    evidenceTargetIds: [
      "evidence-target:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
      "evidence-target:next-pass-2:action:follow-up:decision:evidence-export-boundary",
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
    nextStaticReviewStepIds: [
      "coverage-static-step:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
      "coverage-static-step:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-2:action:follow-up:decision:evidence-export-boundary",
    ],
  });
});

test("Stage 25 deferred boundary rollups stay visible, non-actionable, and non-certifying", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const coverage = view.reviewEvidenceCoverage;

  assert.ok(coverage);
  assert.deepEqual(coverage.deferredBoundaryRollups, [
    {
      boundaryId:
        "coverage:trace-boundary:deferred-scope:review-pass:resolution:next-pass-3:action:deferred-production-handoff-scope",
      label: "Keep production handoff scope deferred",
      summary:
        "Production-only scope remains visible for boundary awareness and is not actionable in this local pass.",
      sourceTraceRowIds: [
        "evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-3:action:deferred-production-handoff-scope",
      ],
      sourceOutcomeRowIds: [
        "review-pass-outcome:review-pass:resolution:next-pass-3:action:deferred-production-handoff-scope",
      ],
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
      nonActionable: true,
    },
  ]);

  const deferredRow = coverage.coverageRows.find(
    (row) => row.status === "deferred_production_scope",
  );
  assert.ok(deferredRow);
  assert.deepEqual(deferredRow.deferredBoundaryNotes, [
    "Production-only scope remains visible for boundary awareness and is not actionable in this local pass.",
  ]);
  assert.equal(deferredRow.informationalOnly, true);
  assert.equal(deferredRow.nonCertifying, true);
});

test("Stage 25 proof references remain static, repo-relative, and non-executable", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const coverage = view.reviewEvidenceCoverage;

  assert.ok(coverage);
  assert.equal(
    coverage.staticProofChecklistSummary,
    "Stage 25 coverage checks are static repo-relative references only; the mission console does not execute commands, save coverage filters, store progress, or certify production readiness.",
  );

  for (const step of coverage.staticReviewSteps) {
    assert.equal(step.nonExecutable, true);
    assert.equal(step.repoRelativeReference.startsWith("/"), false);
  }

  for (const command of coverage.proofCommandReferences) {
    assert.equal(command.command.startsWith("/"), false);
    assert.equal(command.command.includes("&&"), false);
    assert.equal(command.command.includes(";"), false);
    assert.equal(command.command.includes("$("), false);
    assert.equal(command.command.includes("`"), false);
    assert.match(command.command, /^(node|python3) /);
  }
});
