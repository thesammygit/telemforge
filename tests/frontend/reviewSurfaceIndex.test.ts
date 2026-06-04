import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("buildMissionConsoleView derives the local review surface index deterministically", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const index = view.reviewSurfaceIndex;

  assert.ok(index);
  assert.equal(index?.schema, "telemforge.review_surface_index.v1");
  assert.equal(index?.contractLabel, "local deterministic review surface index and navigation map");
  assert.equal(index?.summary.defaultSurfaceId, "review-decision-register");
  assert.equal(index?.summary.defaultAnchorId, "review-decision-register");
  assert.deepEqual(index?.rows.map((row) => row.stageNumber), [
    14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  ]);
  assert.deepEqual(index?.rows.map((row) => row.anchor.anchorId), [
    "review-decision-register",
    "review-briefing-board",
    "review-action-queue",
    "review-action-walkthrough",
    "review-handoff-rehearsal",
    "review-coverage-matrix",
    "review-gap-triage",
    "review-gap-resolution",
    "review-pass-readiness",
    "review-pass-outcome-board",
    "review-evidence-trace-navigator",
    "review-evidence-coverage-map",
    "review-proof-priority-radar",
    "review-proof-packet-gate",
    "review-proof-navigator",
    "review-proof-reconciliation",
  ]);
  assert.equal(index?.rows[0].sourceSchema, "telemforge.review_decision_register.v1");
  assert.deepEqual(index?.rows[0].sourceLabels, [
    "Stage 14 decision register",
    "local deterministic review decision register",
  ]);
  assert.equal(index?.rows[0].sourceCounts[0].sourcePath, "frontend/src/lib/reviewDecisionRegister.ts");
  assert.equal(index?.rows[0].sourceCounts[0].label, "Total decisions");
  assert.equal(index?.rows[0].sourceCounts[0].value, 4);
  assert.equal(index?.rows[15].sourceSchema, "telemforge.review_proof_reconciliation.v1");
  assert.equal(index?.rows[15].statusLabel, "Local proof-chain reconciliation");
  assert.equal(index?.workflowGroups.length, 7);
  assert.deepEqual(index?.workflowGroups.map((group) => group.workflowGroup), [
    "decision",
    "action",
    "readiness",
    "evidence",
    "proof",
    "navigator",
    "reconciliation",
  ]);
  assert.deepEqual(index?.workflowGroups.map((group) => group.rowCount), [
    2, 3, 4, 3, 2, 1, 1,
  ]);
  assert.deepEqual(index?.anchorReferences.map((anchor) => anchor.href), [
    "#review-decision-register",
    "#review-briefing-board",
    "#review-action-queue",
    "#review-action-walkthrough",
    "#review-handoff-rehearsal",
    "#review-coverage-matrix",
    "#review-gap-triage",
    "#review-gap-resolution",
    "#review-pass-readiness",
    "#review-pass-outcome-board",
    "#review-evidence-trace-navigator",
    "#review-evidence-coverage-map",
    "#review-proof-priority-radar",
    "#review-proof-packet-gate",
    "#review-proof-navigator",
    "#review-proof-reconciliation",
  ]);
  assert.equal(index?.deferredBoundaryNotes.length, 7);
  assert.deepEqual(index?.deferredBoundaryNotes.map((note) => note.noteId), [
    "review-surface-boundary:decision",
    "review-surface-boundary:action",
    "review-surface-boundary:readiness",
    "review-surface-boundary:evidence",
    "review-surface-boundary:proof",
    "review-surface-boundary:navigator",
    "review-surface-boundary:reconciliation",
  ]);
  assert.equal(index?.summary.counts.totalSurfaceCount, 16);
  assert.equal(index?.summary.counts.workflowGroupCount, 7);
  assert.equal(index?.summary.counts.localAnchorCount, 16);
  assert.equal(index?.summary.counts.sourceSchemaCount, 16);
  assert.equal(index?.summary.counts.sourceCountMetricCount, 74);
});
