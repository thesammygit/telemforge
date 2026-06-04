import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewGapTriage } from "../../frontend/src/lib/reviewGapTriage.ts";
import { buildReviewHandoffCoverageMatrix } from "../../frontend/src/lib/reviewHandoffCoverageMatrix.ts";
import { buildReviewHandoffRehearsal } from "../../frontend/src/lib/reviewHandoffRehearsal.ts";
import {
  acknowledgeAlertInFixture,
  resolveAlertInFixture,
} from "../../frontend/src/lib/operatorWorkflow.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("Stage 20 review gap triage ranks local blockers before deferred production scope", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const triage = view.reviewGapTriage;

  assert.ok(triage);
  assert.equal(triage.schema, "telemforge.review_gap_triage.v1");
  assert.equal(triage.version, 1);
  assert.equal(triage.contractLabel, "local deterministic review gap triage");
  assert.equal(triage.localStatus, "fixture");
  assert.deepEqual(triage.readiness, {
    verdict: "local_blockers_ranked",
    label: "Local blockers ranked for next pass",
    summary: "2 local blocker items are ranked before 1 deferred production items.",
    counts: {
      totalItemCount: 3,
      localBlockerItemCount: 2,
      missingTargetItemCount: 0,
      deferredProductionItemCount: 1,
      sourceMatrixRowCount: 3,
      proofCommandCount: 7,
    },
  });
  assert.deepEqual(
    triage.groups.map((group) => [group.category, group.itemCount, group.priority]),
    [
      ["local_blocker", 2, "p1"],
      ["deferred_production", 1, "p2"],
    ],
  );
  assert.deepEqual(
    triage.nextPassItems.map((item) => [
      item.rank,
      item.category,
      item.priority,
      item.label,
    ]),
    [
      [1, "local_blocker", "p1", "Alert lifecycle needs local follow-up"],
      [2, "local_blocker", "p1", "Evidence export waits on packet gaps"],
      [3, "deferred_production", "p2", "Keep production handoff scope deferred"],
    ],
  );
  assert.deepEqual(triage.nextPassItems[0].sourceMatrixRowIds, [
    "coverage-row-1:action:follow-up:decision:alert-lifecycle-handoff",
  ]);
  assert.deepEqual(triage.nextPassItems[0].sourceBuckets.map((bucket) => bucket.label), [
    "Briefing board rows",
    "Replay frames",
    "Runbook targets",
    "Incident packet refs",
    "Evidence export refs",
    "Source paths",
  ]);
  assert.deepEqual(
    triage.nextPassItems[0].proofCommandReferences.map((command) => command.commandId),
    [
      "review-gap-triage",
      "review-coverage-matrix",
      "review-handoff-rehearsal",
      "review-action-walkthrough",
      "review-action-queue",
      "console-view-model",
      "public-repo-guard",
    ],
  );
  assert.deepEqual(
    triage.localBlockerSummaries.map((summary) => [
      summary.category,
      summary.label,
      summary.sourceMatrixRowIds[0],
    ]),
    [
      [
        "local_blocker",
        "Alert lifecycle needs local follow-up",
        "coverage-row-1:action:follow-up:decision:alert-lifecycle-handoff",
      ],
      [
        "local_blocker",
        "Evidence export waits on packet gaps",
        "coverage-row-2:action:follow-up:decision:evidence-export-boundary",
      ],
    ],
  );
  assert.deepEqual(
    triage.deferredProductionBoundaries.map((boundary) => [
      boundary.actionability,
      boundary.label,
      boundary.deferredNotes[0],
    ]),
    [
      [
        "deferred_non_actionable",
        "Keep production handoff scope deferred",
        "Editable reviewer notes, saved sessions, external ticketing, and production handoff services remain deferred.",
      ],
    ],
  );
  assert.deepEqual(
    triage.proofCommandReferences.map((command) => [
      command.commandId,
      command.source,
    ]),
    [
      ["review-gap-triage", "stage20_triage"],
      ["review-coverage-matrix", "stage19_matrix"],
      ["review-handoff-rehearsal", "stage19_matrix"],
      ["review-action-walkthrough", "stage19_matrix"],
      ["review-action-queue", "stage19_matrix"],
      ["review-briefing-board", "stage19_matrix"],
      ["review-decision-register", "stage19_matrix"],
      ["console-view-model", "stage19_matrix"],
      ["public-repo-guard", "stage19_matrix"],
    ],
  );
  assert.equal(
    triage.staticProofChecklistSummary,
    "Proof commands are static repo-relative references for the reviewer; the mission console does not execute shell commands.",
  );
  assert.strictEqual(triage.sourceMatrixRows, view.reviewHandoffCoverageMatrix?.rows);
  assert.deepEqual(triage.sourceEvidenceReferences, [
    "frontend/src/lib/reviewBriefingBoard.ts",
    "frontend/src/features/mission-console/consoleViewModel.ts",
    "frontend/src/lib/reviewActionQueue.ts",
    "frontend/src/lib/scenarioRunbooks.ts",
    "frontend/src/lib/incidentReviewPackets.ts",
    "docs/development/steps/14-review-decision-register-and-handoff-checklist.md",
  ]);
});

test("Stage 20 review gap triage promotes missing targets ahead of other local rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const queue = {
    ...view.reviewActionQueue!,
    actions: view.reviewActionQueue!.actions.map((action, index) =>
      index === 0
        ? {
            ...action,
            evidenceTargets: [...action.evidenceTargets, "missing-target"],
          }
        : action,
    ),
  };
  const rehearsal = buildReviewHandoffRehearsal(
    queue,
    view.reviewBriefingBoard,
    view.replayPlayback,
    view.runbook,
    view.incidentReviewPacket,
    view.incidentReviewExport,
  );
  const matrix = buildReviewHandoffCoverageMatrix(rehearsal);
  const triage = buildReviewGapTriage(matrix);

  assert.ok(matrix);
  assert.ok(triage);
  assert.equal(matrix.readiness.counts.missingTargetCount, 1);
  assert.equal(triage.readiness.verdict, "local_blockers_ranked");
  assert.deepEqual(triage.readiness.counts, {
    totalItemCount: 3,
    localBlockerItemCount: 2,
    missingTargetItemCount: 1,
    deferredProductionItemCount: 1,
    sourceMatrixRowCount: 3,
    proofCommandCount: 7,
  });
  assert.deepEqual(
    triage.groups.map((group) => group.category),
    ["missing_target", "local_blocker", "deferred_production"],
  );
  assert.equal(triage.nextPassItems[0].category, "missing_target");
  assert.equal(
    triage.nextPassItems[0].summary,
    "1 missing target checks keep this local row at the top of the next-pass plan.",
  );
  assert.equal(
    triage.nextPassItems[0].blockerSummary,
    "1 missing evidence target checks stay explicit for this row.",
  );
  assert.ok(
    triage.nextPassItems[0].proofCommandReferences.some(
      (command) => command.commandId === "review-action-queue",
    ),
  );
  assert.equal(triage.nextPassItems.at(-1)?.actionability, "deferred_non_actionable");
  assert.ok(
    triage.deferredProductionBoundaries[0].deferredNotes[0].includes("production handoff services remain deferred"),
  );
});

test("Stage 20 proof command references stay static, repo-relative, and non-executable", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const triage = view.reviewGapTriage;

  assert.ok(triage);
  assert.equal(triage.proofCommandReferences.length, 9);
  assert.equal(
    triage.proofCommandReferences[0].command,
    "node --experimental-strip-types --test tests/frontend/reviewGapTriage.test.ts",
  );

  for (const command of triage.proofCommandReferences) {
    assert.equal(command.command.startsWith("/"), false);
    assert.equal(command.command.includes("&&"), false);
    assert.equal(command.command.includes(";"), false);
    assert.equal(command.command.includes("$("), false);
    assert.equal(command.command.includes("`"), false);
    assert.match(command.command, /^(node|python3) /);
  }
});

test("Stage 20 review gap triage keeps production-only scope visible but non-actionable", () => {
  const acknowledgedFixture = acknowledgeAlertInFixture(
    stage07ConsoleFixture,
    "alert-stage06-thermal-avionics",
    "2026-06-04T04:30:00Z",
  );
  const resolvedFixture = resolveAlertInFixture(
    acknowledgedFixture,
    "alert-stage06-thermal-avionics",
    "2026-06-04T04:32:00Z",
  );
  const view = buildMissionConsoleView(resolvedFixture, "thermal");
  const triage = view.reviewGapTriage;

  assert.ok(triage);
  assert.equal(triage.readiness.verdict, "deferred_production_only");
  assert.deepEqual(triage.readiness.counts, {
    totalItemCount: 1,
    localBlockerItemCount: 0,
    missingTargetItemCount: 0,
    deferredProductionItemCount: 1,
    sourceMatrixRowCount: 1,
    proofCommandCount: 5,
  });
  assert.deepEqual(
    triage.groups.map((group) => group.category),
    ["deferred_production"],
  );
  assert.equal(triage.nextPassItems[0].actionability, "deferred_non_actionable");
  assert.ok(triage.nextPassItems[0].nextLocalStep.includes("do not turn"));
  assert.equal(triage.localBlockerSummaries.length, 0);
  assert.equal(triage.deferredProductionBoundaries.length, 1);
  assert.ok(
    triage.deferredProductionBoundaries[0].deferredNotes.some((note) =>
      note.toLowerCase().includes("production"),
    ),
  );
});
