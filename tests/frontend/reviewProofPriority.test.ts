import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewProofPriority } from "../../frontend/src/lib/reviewProofPriority.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("Stage 26 proof priority derives priority rows from Stage 25 coverage rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const priority = buildReviewProofPriority(view.reviewEvidenceCoverage);

  assert.ok(priority);
  assert.equal(priority.schema, "telemforge.review_proof_priority.v1");
  assert.equal(priority.version, 1);
  assert.equal(
    priority.contractLabel,
    "local deterministic review proof priority radar",
  );
  assert.equal(priority.localStatus, "fixture");
  assert.deepEqual(priority.summary, {
    priorityId: "candidate-local-review-proof-priority",
    label: "Local proof priority lens",
    summary:
      "2 unresolved local proof gap rows are ranked before ready evidence and deferred scope; inspect Alert lifecycle needs local follow-up first.",
    defaultPriorityRowId:
      "priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
    defaultStaticRadarGroupId:
      "static-radar:priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff:unresolved-local-proof-gaps",
    defaultProofBucketLabel: "Unresolved local proof gaps",
    informationalOnly: true,
    nonCertifying: true,
    counts: {
      totalPriorityRowCount: 3,
      unresolvedLocalProofGapCount: 2,
      readyLocalEvidenceRowCount: 0,
      deferredProductionScopeRowCount: 1,
      sourceCoverageRowCount: 3,
      sourceTraceRowCount: 3,
      sourceOutcomeRowCount: 3,
      sourceReadinessRowCount: 3,
      sourceResolutionRowCount: 3,
      sourceMatrixRowCount: 3,
      sourceActionCount: 3,
      evidenceTargetCount: 3,
      proofBucketCount: 4,
      proofCommandReferenceCount: 15,
      staticRadarGroupCount: 3,
      staticCheckReferenceCount: 34,
      deferredBoundaryContextCount: 1,
    },
  });
  assert.deepEqual(
    priority.priorityRows.map((row) => [
      row.rank,
      row.priority,
      row.status,
      row.actionability,
      row.label,
    ]),
    [
      [
        1,
        "p0",
        "unresolved_local_proof_gap",
        "local_review_required",
        "Alert lifecycle needs local follow-up",
      ],
      [
        2,
        "p0",
        "unresolved_local_proof_gap",
        "local_review_required",
        "Evidence export waits on packet gaps",
      ],
      [
        3,
        "p2",
        "deferred_production_scope",
        "deferred_non_actionable",
        "Keep production handoff scope deferred",
      ],
    ],
  );
  assert.strictEqual(priority.sourceCoverage, view.reviewEvidenceCoverage);
});

test("Stage 26 default priority row preserves source coverage, trace, outcome, evidence, proof, and reason fields", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const priority = view.reviewProofPriority;

  assert.ok(priority);

  const firstRow = priority.defaultPriorityRow;
  assert.deepEqual(firstRow.sourceCoverageRowIds, [
    "coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
  ]);
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
  assert.deepEqual(firstRow.proofBucketLabels, [
    "Unresolved local proof gaps",
    "local_proof_gap",
  ]);
  assert.deepEqual(firstRow.proofCommandIds, [
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
  ]);
  assert.deepEqual(firstRow.staticReviewStepIds, [
    "coverage-static-step:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
  ]);
  assert.deepEqual(firstRow.rankingReasons, [
    {
      reasonId:
        "priority-reason:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff:status",
      label: "Unresolved local proof gap",
      summary:
        "Ranked first because Stage 25 marks this coverage row as an unresolved local proof gap with local static proof still required.",
      sourceCoverageRowIds: firstRow.sourceCoverageRowIds,
      sourceTraceRowIds: firstRow.sourceTraceRowIds,
      evidenceTargetIds: firstRow.evidenceTargetIds,
      proofBucketLabels: firstRow.proofBucketLabels,
      staticReviewStepIds: firstRow.staticReviewStepIds,
    },
  ]);
  assert.deepEqual(firstRow.sourceCoverageReferences, [
    {
      coverageRowId:
        "coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
      sourceTraceRowIds: firstRow.sourceTraceRowIds,
      sourceOutcomeRowIds: firstRow.sourceOutcomeRowIds,
      sourceReadinessRowIds: firstRow.sourceReadinessRowIds,
      sourceResolutionIds: firstRow.sourceResolutionIds,
      sourceMatrixRowIds: firstRow.sourceMatrixRowIds,
      sourceActionIds: firstRow.sourceActionIds,
      evidenceTargetIds: firstRow.evidenceTargetIds,
      sourceBucketLabels: [
        "Briefing board rows",
        "Replay frames",
        "Runbook targets",
        "Incident packet refs",
        "Evidence export refs",
        "Source paths",
      ],
    },
  ]);
  assert.equal(firstRow.informationalOnly, true);
  assert.equal(firstRow.nonCertifying, true);
});

test("Stage 26 static check radar groups are repo-relative, local, non-executable, and source-backed", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const priority = view.reviewProofPriority;

  assert.ok(priority);

  const firstGroup = priority.staticCheckRadarGroups[0];
  assert.equal(
    firstGroup.radarGroupId,
    "static-radar:priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff:unresolved-local-proof-gaps",
  );
  assert.equal(firstGroup.priorityRowId, priority.defaultPriorityRow.priorityRowId);
  assert.equal(firstGroup.proofBucketLabel, "Unresolved local proof gaps");
  assert.deepEqual(firstGroup.sourceCoverageRowIds, [
    "coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
  ]);
  assert.deepEqual(firstGroup.evidenceTargetIds, [
    "evidence-target:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
  ]);
  assert.equal(firstGroup.localOnly, true);
  assert.equal(firstGroup.nonExecutable, true);
  assert.equal(firstGroup.staticOnly, true);
  assert.equal(firstGroup.checks.length, 12);
  assert.ok(
    firstGroup.checks.every(
      (check) =>
        check.localOnly &&
        check.staticOnly &&
        check.nonExecutable &&
        !check.repoRelativeReference.startsWith("/") &&
        check.sourceCoverageRowIds.includes(
          priority.defaultPriorityRow.sourceCoverageRowIds[0],
        ),
    ),
  );
  assert.deepEqual(
    firstGroup.checks.map((check) => [
      check.proofCommandId,
      check.repoRelativeReference,
    ]),
    [
      ["review-evidence-coverage", "tests/frontend/reviewEvidenceCoverage.test.ts"],
      ["review-evidence-trace", "tests/frontend/reviewEvidenceTrace.test.ts"],
      ["review-pass-outcome", "tests/frontend/reviewPassOutcome.test.ts"],
      ["review-pass-readiness", "tests/frontend/reviewPassReadiness.test.ts"],
      ["review-gap-resolution", "tests/frontend/reviewGapResolution.test.ts"],
      ["review-gap-triage", "tests/frontend/reviewGapTriage.test.ts"],
      ["review-coverage-matrix", "tests/frontend/reviewHandoffCoverageMatrix.test.ts"],
      ["review-handoff-rehearsal", "tests/frontend/reviewHandoffRehearsal.test.ts"],
      ["review-action-walkthrough", "tests/frontend/reviewActionWalkthrough.test.ts"],
      ["review-action-queue", "tests/frontend/reviewActionQueue.test.ts"],
      ["console-view-model", "tests/frontend/consoleViewModel.test.ts"],
      ["public-repo-guard", "scripts/public_repo_guard.py"],
    ],
  );
});

test("Stage 26 deferred production context remains visible, non-actionable, and separated from local priorities", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const priority = view.reviewProofPriority;

  assert.ok(priority);

  const deferredRow = priority.priorityRows.find(
    (row) => row.status === "deferred_production_scope",
  );
  assert.ok(deferredRow);
  assert.equal(deferredRow.priority, "p2");
  assert.equal(deferredRow.actionability, "deferred_non_actionable");
  assert.deepEqual(deferredRow.deferredBoundaryNotes, [
    "Production-only scope remains visible for boundary awareness and is not actionable in this local pass.",
  ]);
  assert.deepEqual(priority.deferredBoundaryContexts, [
    {
      boundaryId:
        "priority-boundary:coverage:trace-boundary:deferred-scope:review-pass:resolution:next-pass-3:action:deferred-production-handoff-scope",
      label: "Keep production handoff scope deferred",
      summary:
        "Production-only scope remains visible for boundary awareness and is not actionable in this local pass.",
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
});
