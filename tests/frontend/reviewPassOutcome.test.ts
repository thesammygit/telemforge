import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("Stage 23 review-pass outcome board derives candidate outcome rows from Stage 22 readiness", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const outcome = view.reviewPassOutcome;

  assert.ok(outcome);
  assert.equal(outcome.schema, "telemforge.review_pass_outcome.v1");
  assert.equal(outcome.version, 1);
  assert.equal(
    outcome.contractLabel,
    "local deterministic review-pass outcome board",
  );
  assert.equal(outcome.localStatus, "fixture");
  assert.deepEqual(outcome.candidateOutcome, {
    outcomeId: "candidate-local-review-pass",
    verdict: "local_proof_gaps_remaining",
    label: "Local proof gaps remain",
    summary:
      "2 unresolved local proof gap rows must be checked before this local pass can be treated as review-ready.",
    informationalOnly: true,
    nonCertifying: true,
    counts: {
      totalOutcomeRowCount: 3,
      readyLocalEvidenceRowCount: 0,
      unresolvedLocalProofGapCount: 2,
      deferredProductionScopeRowCount: 1,
      sourceReadinessRowCount: 3,
      evidenceTargetCount: 3,
      proofCommandReferenceCount: 10,
    },
  });
  assert.deepEqual(
    outcome.outcomeRows.map((row) => [
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
  assert.strictEqual(outcome.sourceReadiness, view.reviewPassReadiness);
});

test("Stage 23 outcome rows expose source readiness, resolution, matrix, action, evidence, and proof ids", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const outcome = view.reviewPassOutcome;

  assert.ok(outcome);

  const firstRow = outcome.outcomeRows[0];
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
  assert.deepEqual(firstRow.sourceBuckets.map((bucket) => bucket.label), [
    "Briefing board rows",
    "Replay frames",
    "Runbook targets",
    "Incident packet refs",
    "Evidence export refs",
    "Source paths",
  ]);
  assert.deepEqual(
    firstRow.proofCommandReferences.map((command) => command.commandId),
    [
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
  assert.equal(
    firstRow.nextStaticLocalReviewStep,
    "Review Alert lifecycle needs local follow-up in the Stage 21 resolution checklist, confirm the mapped Stage 19 source rows, then run the listed static proof references before the next local review pass.",
  );
});

test("Stage 23 keeps local proof gaps and deferred production scope separated", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const outcome = view.reviewPassOutcome;

  assert.ok(outcome);
  assert.deepEqual(
    outcome.localProofGapRows.map((row) => [
      row.gapRowId,
      row.sourceReadinessRowId,
      row.evidenceTargetIds[0],
    ]),
    [
      [
        "local-proof-gap:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
        "review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
        "evidence-target:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
      ],
      [
        "local-proof-gap:review-pass:resolution:next-pass-2:action:follow-up:decision:evidence-export-boundary",
        "review-pass:resolution:next-pass-2:action:follow-up:decision:evidence-export-boundary",
        "evidence-target:next-pass-2:action:follow-up:decision:evidence-export-boundary",
      ],
    ],
  );
  assert.deepEqual(outcome.deferredScopeLedgerRows, [
    {
      ledgerRowId:
        "deferred-scope:review-pass:resolution:next-pass-3:action:deferred-production-handoff-scope",
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
      sourceBucketLabels: [
        "Briefing board rows",
        "Replay frames",
        "Runbook targets",
        "Incident packet refs",
        "Evidence export refs",
        "Source paths",
      ],
      proofCommandIds: [
        "review-pass-outcome",
        "review-pass-readiness",
        "review-gap-resolution",
        "review-gap-triage",
        "review-coverage-matrix",
        "review-handoff-rehearsal",
        "console-view-model",
        "public-repo-guard",
      ],
      actionability: "deferred_non_actionable",
      nextStaticLocalReviewStep:
        "Keep production handoff scope deferred in Stage 23; do not add reviewer ownership, signoff, persistence, production handoff, ticketing, report export, or command-runner work.",
    },
  ]);
});

test("Stage 23 verdict notes and proof commands remain static and non-certifying", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const outcome = view.reviewPassOutcome;

  assert.ok(outcome);
  assert.deepEqual(outcome.staticVerdictNotes, [
    {
      noteId: "stage23-informational-only",
      label: "Informational local candidate",
      summary:
        "The Stage 23 outcome board summarizes deterministic local evidence only; it is not reviewer signoff, audit retention, or production certification.",
    },
    {
      noteId: "stage23-static-non-executable",
      label: "Static proof references",
      summary:
        "Proof commands are repo-relative text references for reviewer inspection; the mission console does not execute shell commands or store progress.",
    },
    {
      noteId: "stage23-deferred-production-visible",
      label: "Deferred production scope",
      summary:
        "Production-only auth, identity, handoff exports, ticketing, report authoring, and deploy work remain visible but non-actionable.",
    },
  ]);

  for (const command of outcome.proofCommandReferences) {
    assert.equal(command.command.startsWith("/"), false);
    assert.equal(command.command.includes("&&"), false);
    assert.equal(command.command.includes(";"), false);
    assert.equal(command.command.includes("$("), false);
    assert.equal(command.command.includes("`"), false);
    assert.match(command.command, /^(node|python3) /);
  }
});
