import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  buildFixtureStreamConnection,
  buildReplayInspectionView,
  buildMissionConsoleView,
  formatTelemetryValue,
  selectedStage05ChannelIds,
} from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage05ConsoleFixture } from "../../frontend/src/lib/stage05ConsoleFixture.ts";
import { stage06ConsoleFixture } from "../../frontend/src/lib/stage06ConsoleFixture.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";
import {
  acknowledgeAlertInFixture,
  resolveAlertInFixture,
} from "../../frontend/src/lib/operatorWorkflow.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildMissionConsoleView summarizes degraded mission health", () => {
  const view = buildMissionConsoleView(stage05ConsoleFixture);

  assert.equal(view.mission.spacecraftId, "tf-sat-01");
  assert.equal(view.mission.scenario, "degraded-eclipse-thermal-comms");
  assert.equal(view.mission.healthState, "critical");
  assert.deepEqual(view.mission.statusCounts, {
    nominal: 1,
    warning: 7,
    critical: 2,
    offline: 0,
  });
  assert.equal(view.mission.activeAlertCount, 3);
});

test("buildMissionConsoleView ranks subsystem status by worst channel", () => {
  const view = buildMissionConsoleView(stage05ConsoleFixture, "thermal");

  assert.deepEqual(
    view.subsystems.map((subsystem) => [
      subsystem.id,
      subsystem.status,
      subsystem.channelCount,
    ]),
    [
      ["thermal", "critical", 2],
      ["comms", "critical", 2],
      ["eps", "warning", 2],
      ["adcs", "warning", 2],
      ["payload", "warning", 1],
      ["prop", "nominal", 1],
    ],
  );
  assert.equal(view.selectedSubsystem.id, "thermal");
  assert.equal(
    view.selectedSubsystem.channels[0].channelId,
    "thermal.avionics_temp",
  );
  assert.equal(view.selectedSubsystem.channels[0].formattedValue, "62.8 degC");
});

test("formatTelemetryValue respects channel precision and units", () => {
  assert.equal(formatTelemetryValue(25.4, "V", 2), "25.40 V");
  assert.equal(formatTelemetryValue(3460, "rpm", 0), "3460 rpm");
  assert.equal(formatTelemetryValue(0.33, "deg", 3), "0.330 deg");
});

test("buildMissionConsoleView exposes deterministic trend summaries", () => {
  const view = buildMissionConsoleView(stage05ConsoleFixture, "thermal");
  const avionics = view.trends.find(
    (trend) => trend.channelId === "thermal.avionics_temp",
  );

  assert.ok(avionics);
  assert.equal(avionics.name, "Avionics Bay Temperature");
  assert.equal(avionics.unit, "degC");
  assert.equal(avionics.direction, "rising");
  assert.equal(avionics.samples.length, 12);
  assert.equal(avionics.firstValue, 24.7);
  assert.equal(avionics.lastValue, 62.8);
  assert.equal(avionics.minimum, 24.7);
  assert.equal(avionics.maximum, 62.8);
  assert.ok(avionics.svgPath.startsWith("M "));
});

test("Stage 05 fixture keeps trend channels intentionally small", () => {
  assert.deepEqual(selectedStage05ChannelIds, [
    "eps.battery_voltage",
    "thermal.avionics_temp",
    "comms.downlink_snr_db",
    "comms.packet_error_rate_pct",
  ]);
});

test("Stage 05 frontend fixture matches source snapshot and trend artifacts", () => {
  const snapshot = JSON.parse(
    readFileSync(
      resolve(repoRoot, "fixtures/telemetry/degraded_snapshot.json"),
      "utf8",
    ),
  );
  const trendRows = readCsv(
    resolve(
      repoRoot,
      "docs/development/artifacts/stage03-simulation/degraded-eclipse-thermal-comms.csv",
    ),
  );

  assert.deepEqual(
    stage05ConsoleFixture.points.map((point) => ({
      channel_id: point.channelId,
      value: point.value,
      status: point.status,
    })),
    snapshot.points.map(
      (point: { channel_id: string; value: number; status: string }) => ({
        channel_id: point.channel_id,
        value: point.value,
        status: point.status,
      }),
    ),
  );

  const selectedTrendRows = trendRows
    .filter((row) => selectedStage05ChannelIds.includes(row.channel_id))
    .sort(
      (left, right) =>
        selectedStage05ChannelIds.indexOf(left.channel_id) -
          selectedStage05ChannelIds.indexOf(right.channel_id) ||
        Number(left.sample) - Number(right.sample),
    )
    .map((row) => ({
      channelId: row.channel_id,
      sample: Number(row.sample),
      value: Number(row.value),
      status: row.status,
    }));

  assert.deepEqual(
    stage05ConsoleFixture.trends.map((sample) => ({
      channelId: sample.channelId,
      sample: sample.sample,
      value: sample.value,
      status: sample.status,
    })),
    selectedTrendRows,
  );
});

test("buildMissionConsoleView exposes the Stage 06 incident timeline", () => {
  const view = buildMissionConsoleView(stage06ConsoleFixture, "thermal");

  assert.equal(view.mission.activeFaultCount, 1);
  assert.equal(view.incident.activeFaults[0].faultType, "thermal_avionics_overheat");
  assert.equal(view.incident.timeline.length, 3);
  assert.deepEqual(
    view.incident.timeline.map((event) => event.eventType),
    ["fault.injected", "telemetry.affected", "alert.raised"],
  );
  assert.equal(view.incident.timeline[1].channelId, "thermal.avionics_temp");
  assert.equal(view.incident.timeline[2].severity, "critical");
  assert.equal(
    view.alerts.find((alert) => alert.alertId === "alert-stage06-thermal-avionics")?.relatedFaultId,
    "fault-stage06-thermal-avionics",
  );
});

test("buildReplayInspectionView summarizes Stage 07 markers and anomalies", () => {
  assert.ok(stage07ConsoleFixture.replay);

  const replay = buildReplayInspectionView(stage07ConsoleFixture.replay);

  assert.equal(
    replay.windowLabel,
    "2026-04-30T19:14:50Z to 2026-04-30T19:15:10Z",
  );
  assert.equal(replay.markerCount, 5);
  assert.deepEqual(
    replay.timelineMarkers.map((marker) => marker.kind),
    ["fault", "event", "event", "event", "alert"],
  );
  assert.equal(replay.topAnomalies[0].channelId, "thermal.avionics_temp");
  assert.equal(replay.topAnomalies[0].severity, "critical");
  assert.equal(replay.topAnomalies[0].scoreLabel, "100%");
  assert.ok(
    replay.topAnomalies[0].reason.includes("warning high limit 55.0 degC"),
  );
});

test("buildMissionConsoleView includes Stage 07 replay overlay data when provided", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");

  assert.ok(view.replay);
  assert.equal(view.replay.markerCount, 5);
  assert.equal(view.replay.topAnomalies[0].channelName, "Avionics Bay Temperature");
});

test("buildMissionConsoleView exposes deterministic Stage 13 replay playback frames", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");

  assert.ok(view.replayPlayback);
  assert.equal(view.replayPlayback.schema, "telemforge.replay_playback.v1");
  assert.equal(view.replayPlayback.version, 1);
  assert.equal(
    view.replayPlayback.contractLabel,
    "local deterministic replay playback",
  );
  assert.equal(view.replayPlayback.localStatus, "fixture");
  assert.equal(view.replayPlayback.totalFrameCount, 5);
  assert.equal(view.replayPlayback.frameIndex, 1);
  assert.equal(view.replayPlayback.selectedTimestamp, "2026-04-30T19:15:00Z");
  assert.deepEqual(
    view.replayPlayback.frames.map((frame) => frame.frameIndex),
    [1, 2, 3, 4, 5],
  );
  assert.equal(view.replayPlayback.currentFrame.marker.markerType, "fault.active");
  assert.equal(
    view.replayPlayback.currentFrame.anomalyContext?.channelId,
    "thermal.avionics_temp",
  );
  assert.equal(
    view.replayPlayback.currentFrame.runbookTarget?.stepId,
    "review-event-history",
  );
  assert.equal(
    view.replayPlayback.currentFrame.packetReference?.packetId,
    "incident-review:tf-sat-01:thermal-alert-response-local",
  );
  assert.equal(
    view.replayPlayback.currentFrame.exportReference?.schema,
    "telemforge.incident_review_export.v1",
  );
  assert.ok(view.reviewDecisionRegister);
  assert.ok(view.reviewBriefingBoard);
  assert.ok(view.reviewActionQueue);
  assert.equal(
    view.reviewDecisionRegister.schema,
    "telemforge.review_decision_register.v1",
  );
  assert.equal(view.reviewDecisionRegister.summary.readyCount, 1);
  assert.equal(view.reviewDecisionRegister.summary.followUpCount, 2);
  assert.equal(
    view.reviewBriefingBoard?.schema,
    "telemforge.review_briefing_board.v1",
  );
  assert.equal(view.reviewBriefingBoard?.summary.followUpActionCount, 2);
  assert.equal(
    view.reviewActionQueue.readiness.verdict,
    "blocked_by_local_follow_up",
  );
  assert.equal(view.reviewActionQueue.readiness.counts.blockingActionCount, 2);
  assert.ok(view.reviewActionWalkthrough);
  assert.equal(
    view.reviewActionWalkthrough?.selectedActionId,
    "action:follow-up:decision:alert-lifecycle-handoff",
  );
  assert.equal(view.reviewActionWalkthrough?.coverage.missingTargetCount, 0);
  assert.equal(view.reviewActionWalkthrough?.evidencePathRows.length, 3);
  assert.ok(view.reviewHandoffRehearsal);
  assert.equal(
    view.reviewHandoffRehearsal?.schema,
    "telemforge.review_handoff_rehearsal.v1",
  );
  assert.equal(
    view.reviewHandoffRehearsal?.readiness.verdict,
    "blocked_by_local_follow_up",
  );
  assert.equal(view.reviewHandoffRehearsal?.readiness.counts.totalStepCount, 3);
  assert.equal(
    view.reviewHandoffRehearsal?.unresolvedLocalBlockers.length,
    2,
  );
  assert.ok(view.reviewHandoffCoverageMatrix);
  assert.equal(
    view.reviewHandoffCoverageMatrix?.schema,
    "telemforge.review_handoff_coverage_matrix.v1",
  );
  assert.equal(
    view.reviewHandoffCoverageMatrix?.readiness.verdict,
    "blocked_by_local_follow_up",
  );
  assert.equal(
    view.reviewHandoffCoverageMatrix?.readiness.counts.totalRowCount,
    3,
  );
  assert.equal(
    view.reviewHandoffCoverageMatrix?.readiness.counts.blockingRowCount,
    2,
  );
  assert.ok(view.reviewGapTriage);
  assert.equal(
    view.reviewGapTriage?.schema,
    "telemforge.review_gap_triage.v1",
  );
  assert.equal(view.reviewGapTriage?.readiness.verdict, "local_blockers_ranked");
  assert.equal(view.reviewGapTriage?.groups.length, 2);
  assert.equal(view.reviewGapTriage?.groups[0].category, "local_blocker");
  assert.equal(view.reviewGapTriage?.groups[1].category, "deferred_production");
  assert.equal(view.reviewGapTriage?.nextPassItems.length, 3);
  assert.equal(
    view.reviewGapTriage?.nextPassItems[0].sourceMatrixRowIds[0],
    view.reviewHandoffCoverageMatrix?.rows[0].rowId,
  );
  assert.equal(view.reviewGapTriage?.proofCommandReferences[0].commandId, "review-gap-triage");
  assert.equal(view.reviewGapTriage?.proofCommandReferences[0].source, "stage20_triage");
  assert.equal(view.reviewGapTriage?.proofCommandReferences.at(-1)?.commandId, "public-repo-guard");
  assert.equal(
    view.reviewGapTriage?.staticProofChecklistSummary,
    "Proof commands are static repo-relative references for the reviewer; the mission console does not execute shell commands.",
  );
  assert.ok(view.reviewGapResolution);
  assert.equal(
    view.reviewGapResolution?.schema,
    "telemforge.review_gap_resolution.v1",
  );
  assert.equal(
    view.reviewGapResolution?.readiness.verdict,
    "local_resolution_targets_ready",
  );
  assert.equal(view.reviewGapResolution?.resolutionRows.length, 3);
  assert.equal(
    view.reviewGapResolution?.resolutionRows[0].sourceMatrixRowIds[0],
    view.reviewGapTriage?.nextPassItems[0].sourceMatrixRowIds[0],
  );
  assert.equal(
    view.reviewGapResolution?.resolutionRows[0].evidenceTargetChecklistRows[0]
      .proofCommandIds[0],
    "review-gap-resolution",
  );
  assert.equal(
    view.reviewGapResolution?.staticProofChecklistSummary,
    "Stage 21 proof commands are static repo-relative references only; the mission console does not execute commands or store reviewer progress.",
  );
  assert.ok(view.reviewPassReadiness);
  assert.equal(
    view.reviewPassReadiness?.schema,
    "telemforge.review_pass_readiness.v1",
  );
  assert.equal(
    view.reviewPassReadiness?.readiness.verdict,
    "local_proof_targets_pending",
  );
  assert.equal(view.reviewPassReadiness?.readinessRows.length, 3);
  assert.equal(view.reviewPassReadiness?.evidenceMapRows.length, 3);
  assert.equal(
    view.reviewPassReadiness?.readinessRows[0].sourceResolutionId,
    view.reviewGapResolution?.resolutionRows[0].resolutionId,
  );
  assert.equal(
    view.reviewPassReadiness?.evidenceMapRows[0].evidenceTargetId,
    view.reviewGapResolution?.evidenceTargetChecklistRows[0].targetRowId,
  );
  assert.equal(
    view.reviewPassReadiness?.proofCommandReferences[0].commandId,
    "review-pass-readiness",
  );
  assert.equal(
    view.reviewPassReadiness?.staticEvidenceMapSummary,
    "Stage 22 evidence map rows are static repo-relative references only; the mission console does not execute proof commands or store reviewer progress.",
  );
  assert.ok(view.reviewPassOutcome);
  assert.equal(
    view.reviewPassOutcome?.schema,
    "telemforge.review_pass_outcome.v1",
  );
  assert.equal(
    view.reviewPassOutcome?.candidateOutcome.verdict,
    "local_proof_gaps_remaining",
  );
  assert.equal(view.reviewPassOutcome?.outcomeRows.length, 3);
  assert.equal(view.reviewPassOutcome?.localProofGapRows.length, 2);
  assert.equal(view.reviewPassOutcome?.deferredScopeLedgerRows.length, 1);
  assert.equal(
    view.reviewPassOutcome?.outcomeRows[0].sourceReadinessRowIds[0],
    view.reviewPassReadiness?.readinessRows[0].readinessRowId,
  );
  assert.equal(
    view.reviewPassOutcome?.deferredScopeLedgerRows[0].sourceMatrixRowIds[0],
    "coverage-row-3:action:deferred-production-handoff-scope",
  );
  assert.equal(
    view.reviewPassOutcome?.staticVerdictNotes[0].noteId,
    "stage23-informational-only",
  );
  assert.ok(view.reviewEvidenceTrace);
  assert.equal(
    view.reviewEvidenceTrace?.schema,
    "telemforge.review_evidence_trace.v1",
  );
  assert.equal(
    view.reviewEvidenceTrace?.summary.defaultTraceRowId,
    "evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
  );
  assert.equal(view.reviewEvidenceTrace?.traceRows.length, 3);
  assert.equal(
    view.reviewEvidenceTrace?.selectedTraceRow.sourceOutcomeRowIds[0],
    view.reviewPassOutcome?.outcomeRows[0].outcomeRowId,
  );
  assert.equal(
    view.reviewEvidenceTrace?.selectedTraceRow.sourceReadinessRowIds[0],
    view.reviewPassReadiness?.readinessRows[0].readinessRowId,
  );
  assert.equal(
    view.reviewEvidenceTrace?.selectedTraceRow.sourceResolutionIds[0],
    view.reviewGapResolution?.resolutionRows[0].resolutionId,
  );
  assert.equal(
    view.reviewEvidenceTrace?.selectedTraceRow.sourceMatrixRowIds[0],
    view.reviewHandoffCoverageMatrix?.rows[0].rowId,
  );
  assert.equal(
    view.reviewEvidenceTrace?.proofCommandReferences[0].commandId,
    "review-evidence-trace",
  );
  assert.equal(view.reviewEvidenceTrace?.deferredBoundaryNotes.length, 1);
  assert.ok(view.reviewEvidenceCoverage);
  assert.equal(
    view.reviewEvidenceCoverage?.schema,
    "telemforge.review_evidence_coverage.v1",
  );
  assert.equal(
    view.reviewEvidenceCoverage?.summary.defaultCoverageRowId,
    "coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
  );
  assert.equal(view.reviewEvidenceCoverage?.coverageRows.length, 3);
  assert.equal(view.reviewEvidenceCoverage?.coverageGroups[0].rowCount, 2);
  assert.equal(
    view.reviewEvidenceCoverage?.coverageRows[0].sourceTraceRowIds[0],
    view.reviewEvidenceTrace?.traceRows[0].traceRowId,
  );
  assert.equal(
    view.reviewEvidenceCoverage?.coverageRows[0].sourceOutcomeRowIds[0],
    view.reviewPassOutcome?.outcomeRows[0].outcomeRowId,
  );
  assert.equal(
    view.reviewEvidenceCoverage?.coverageRows[0].sourceReadinessRowIds[0],
    view.reviewPassReadiness?.readinessRows[0].readinessRowId,
  );
  assert.equal(
    view.reviewEvidenceCoverage?.coverageRows[0].sourceResolutionIds[0],
    view.reviewGapResolution?.resolutionRows[0].resolutionId,
  );
  assert.equal(
    view.reviewEvidenceCoverage?.coverageRows[0].sourceMatrixRowIds[0],
    view.reviewHandoffCoverageMatrix?.rows[0].rowId,
  );
  assert.equal(
    view.reviewEvidenceCoverage?.proofCommandReferences[0].commandId,
    "review-evidence-coverage",
  );
  assert.equal(view.reviewEvidenceCoverage?.deferredBoundaryRollups.length, 1);
  assert.ok(view.reviewProofPriority);
  assert.equal(
    view.reviewProofPriority?.schema,
    "telemforge.review_proof_priority.v1",
  );
  assert.equal(
    view.reviewProofPriority?.summary.defaultPriorityRowId,
    "priority-row:coverage-row:evidence-trace:review-pass-outcome:review-pass:resolution:next-pass-1:action:follow-up:decision:alert-lifecycle-handoff",
  );
  assert.equal(view.reviewProofPriority?.priorityRows.length, 3);
  assert.equal(
    view.reviewProofPriority?.defaultPriorityRow.sourceCoverageRowIds[0],
    view.reviewEvidenceCoverage?.coverageRows[0].coverageRowId,
  );
  assert.equal(
    view.reviewProofPriority?.staticCheckRadarGroups[0].sourceCoverageRowIds[0],
    view.reviewEvidenceCoverage?.coverageRows[0].coverageRowId,
  );
  assert.equal(view.reviewProofPriority?.deferredBoundaryContexts.length, 1);
  assert.ok(view.reviewProofPacket);
  assert.equal(
    view.reviewProofPacket?.schema,
    "telemforge.review_proof_packet.v1",
  );
  assert.equal(
    view.reviewProofPacket?.summary.defaultPriorityRowId,
    view.reviewProofPriority?.summary.defaultPriorityRowId,
  );
  assert.equal(
    view.reviewProofPacket?.defaultPacket.sourcePriorityRowId,
    view.reviewProofPriority?.defaultPriorityRow.priorityRowId,
  );
  assert.equal(
    view.reviewProofPacket?.defaultPacket.sourceEvidenceChain
      .sourceCoverageRowIds[0],
    view.reviewEvidenceCoverage?.coverageRows[0].coverageRowId,
  );
  assert.equal(
    view.reviewProofPacket?.defaultPacket.staticHumanGateSteps[0]
      .sourcePriorityRowIds[0],
    view.reviewProofPriority?.defaultPriorityRow.priorityRowId,
  );
  assert.ok(view.reviewProofNavigator);
  assert.equal(
    view.reviewProofNavigator?.schema,
    "telemforge.review_proof_navigator.v1",
  );
  assert.equal(
    view.reviewProofNavigator?.summary.defaultPacketId,
    view.reviewProofPacket?.summary.defaultPacketId,
  );
  assert.equal(
    view.reviewProofNavigator?.defaultNavigatorRow.packetId,
    view.reviewProofPacket?.defaultPacket.packetId,
  );
  assert.equal(
    view.reviewProofNavigator?.defaultNavigatorRow.sourcePriorityRowId,
    view.reviewProofPriority?.defaultPriorityRow.priorityRowId,
  );
  assert.deepEqual(
    view.reviewProofNavigator?.navigatorRows.map((row) => row.laneKind),
    ["local_proof_gap", "local_proof_gap", "deferred_production_scope"],
  );
  assert.equal(view.reviewProofNavigator?.sourceCrosswalkRows.length, 3);
  assert.equal(view.reviewProofNavigator?.staticInspectionPrompts.length, 3);
  assert.equal(view.reviewProofNavigator?.deferredBoundaryMarkers.length, 1);
  assert.ok(view.reviewProofReconciliation);
  assert.equal(
    view.reviewProofReconciliation?.schema,
    "telemforge.review_proof_reconciliation.v1",
  );
  assert.equal(
    view.reviewProofReconciliation?.summary.defaultNavigatorRowId,
    view.reviewProofNavigator?.summary.defaultNavigatorRowId,
  );
  assert.equal(
    view.reviewProofReconciliation?.defaultReconciliationRow.navigatorRowId,
    view.reviewProofNavigator?.defaultNavigatorRow.navigatorRowId,
  );
  assert.equal(
    view.reviewProofReconciliation?.defaultReconciliationRow.sourcePriorityRowId,
    view.reviewProofPriority?.defaultPriorityRow.priorityRowId,
  );
  assert.deepEqual(
    view.reviewProofReconciliation?.reconciliationRows.map(
      (row) => row.bucketKind,
    ),
    [
      "local_inspection_gap",
      "local_inspection_gap",
      "deferred_production_boundary",
    ],
  );
  assert.equal(
    view.reviewProofReconciliation?.summary.counts.staticInspectionPromptCount,
    view.reviewProofNavigator?.staticInspectionPrompts.length,
  );
  assert.equal(
    view.reviewProofReconciliation?.summary.counts.proofCommandReferenceCount,
    view.reviewProofNavigator?.staticCommandReferences.length,
  );
  assert.equal(view.reviewProofReconciliation?.deferredBoundaryNotes.length, 1);
  assert.ok(view.reviewSurfaceIndex);
  assert.equal(
    view.reviewSurfaceIndex?.schema,
    "telemforge.review_surface_index.v1",
  );
  assert.deepEqual(
    view.reviewSurfaceIndex?.rows.map((row) => [
      row.stageNumber,
      row.workflowGroup,
      row.anchor.anchorId,
    ]),
    [
      [14, "decision", "review-decision-register"],
      [15, "decision", "review-briefing-board"],
      [16, "action", "review-action-queue"],
      [17, "action", "review-action-walkthrough"],
      [18, "action", "review-handoff-rehearsal"],
      [19, "readiness", "review-coverage-matrix"],
      [20, "readiness", "review-gap-triage"],
      [21, "readiness", "review-gap-resolution"],
      [22, "readiness", "review-pass-readiness"],
      [23, "evidence", "review-pass-outcome-board"],
      [24, "evidence", "review-evidence-trace-navigator"],
      [25, "evidence", "review-evidence-coverage-map"],
      [26, "proof", "review-proof-priority-radar"],
      [27, "proof", "review-proof-packet-gate"],
      [28, "navigator", "review-proof-navigator"],
      [29, "reconciliation", "review-proof-reconciliation"],
    ],
  );
  assert.deepEqual(
    view.reviewSurfaceIndex?.workflowGroups.map((group) => [
      group.workflowGroup,
      group.rowCount,
      group.anchorIds[0],
    ]),
    [
      ["decision", 2, "review-decision-register"],
      ["action", 3, "review-action-queue"],
      ["readiness", 4, "review-coverage-matrix"],
      ["evidence", 3, "review-pass-outcome-board"],
      ["proof", 2, "review-proof-priority-radar"],
      ["navigator", 1, "review-proof-navigator"],
      ["reconciliation", 1, "review-proof-reconciliation"],
    ],
  );
  assert.deepEqual(
    view.reviewSurfaceIndex?.anchorReferences.map((anchor) => anchor.anchorId),
    [
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
    ],
  );
  assert.equal(view.reviewSurfaceIndex?.summary.counts.totalSurfaceCount, 16);
  assert.equal(
    view.reviewSurfaceIndex?.summary.counts.workflowGroupCount,
    7,
  );
  assert.equal(view.reviewSurfaceIndex?.summary.counts.localAnchorCount, 16);
  assert.equal(view.reviewSurfaceIndex?.summary.counts.decisionSurfaceCount, 2);
  assert.equal(view.reviewSurfaceIndex?.summary.counts.actionSurfaceCount, 3);
  assert.equal(view.reviewSurfaceIndex?.summary.counts.readinessSurfaceCount, 4);
  assert.equal(view.reviewSurfaceIndex?.summary.counts.evidenceSurfaceCount, 3);
  assert.equal(view.reviewSurfaceIndex?.summary.counts.proofSurfaceCount, 2);
  assert.equal(view.reviewSurfaceIndex?.summary.counts.navigatorSurfaceCount, 1);
  assert.equal(
    view.reviewSurfaceIndex?.summary.counts.reconciliationSurfaceCount,
    1,
  );
  assert.equal(view.reviewSurfaceIndex?.deferredBoundaryNotes.length, 7);
  assert.equal(
    view.reviewSurfaceIndex?.deferredBoundaryNotes[0].sourceSurfaceIds[0],
    "review-decision-register",
  );
  assert.equal(
    view.reviewSurfaceIndex?.sourceReconciliation,
    view.reviewProofReconciliation,
  );
  assert.ok(view.reviewWalkthroughPath);
  assert.equal(
    view.reviewWalkthroughPath?.schema,
    "telemforge.review_walkthrough_path.v1",
  );
  assert.equal(
    view.reviewWalkthroughPath?.sourceSurfaceIndex,
    view.reviewSurfaceIndex,
  );
  assert.deepEqual(
    view.reviewWalkthroughPath?.steps.map((step) => [
      step.sourceStageNumber,
      step.workflowGroup,
      step.anchor.anchorId,
    ]),
    view.reviewSurfaceIndex?.rows.map((row) => [
      row.stageNumber,
      row.workflowGroup,
      row.anchor.anchorId,
    ]),
  );
  assert.deepEqual(
    view.reviewWalkthroughPath?.promptGroups.map((group) => [
      group.workflowGroup,
      group.localCounts.stepCount,
    ]),
    [
      ["decision", 2],
      ["action", 3],
      ["readiness", 4],
      ["evidence", 3],
      ["proof", 2],
      ["navigator", 1],
      ["reconciliation", 1],
    ],
  );
  assert.ok(view.reviewObservationLens);
  assert.equal(
    view.reviewObservationLens?.schema,
    "telemforge.review_observation_lens.v1",
  );
  assert.equal(
    view.reviewObservationLens?.sourceWalkthroughPath,
    view.reviewWalkthroughPath,
  );
  assert.deepEqual(
    view.reviewObservationLens?.observationRows.map((row) => [
      row.sourceStageNumber,
      row.workflowGroup,
      row.anchor.anchorId,
      row.sourceStepId,
    ]),
    view.reviewWalkthroughPath?.steps.map((step) => [
      step.sourceStageNumber,
      step.workflowGroup,
      step.anchor.anchorId,
      step.stepId,
    ]),
  );
  assert.deepEqual(
    view.reviewObservationLens?.attentionGroups.map((group) => [
      group.kind,
      group.observationRowIds.length,
    ]),
    [
      ["source_alignment", 16],
      ["anchor_resolution", 16],
      ["count_signal", 16],
      ["deferred_boundary", 16],
    ],
  );
  assert.equal(
    view.reviewObservationLens?.summary.counts.countSignalCount,
    view.reviewWalkthroughPath?.summary.counts.sourceCountMetricCount,
  );
  assert.ok(view.reviewObservationCoverage);
  assert.equal(
    view.reviewObservationCoverage?.schema,
    "telemforge.review_observation_coverage.v1",
  );
  assert.equal(
    view.reviewObservationCoverage?.sourceObservationLens,
    view.reviewObservationLens,
  );
  assert.deepEqual(
    view.reviewObservationCoverage?.phaseCoverageRows.map((row) => [
      row.workflowGroup,
      row.observationRowIds.length,
    ]),
    [
      ["decision", 2],
      ["action", 3],
      ["readiness", 4],
      ["evidence", 3],
      ["proof", 2],
      ["navigator", 1],
      ["reconciliation", 1],
    ],
  );
  assert.equal(
    view.reviewObservationCoverage?.summary.counts.sourceStageCoverageRowCount,
    view.reviewObservationLens?.observationRows.length,
  );
  assert.ok(view.reviewObservationCitations);
  assert.equal(
    view.reviewObservationCitations?.schema,
    "telemforge.review_observation_citations.v1",
  );
  assert.equal(
    view.reviewObservationCitations?.sourceObservationCoverage,
    view.reviewObservationCoverage,
  );
  assert.deepEqual(
    view.reviewObservationCitations?.citationRows.map((row) => [
      row.sourceStageNumber,
      row.workflowGroup,
      row.localAnchor.anchorId,
      row.sourceObservationRowId,
    ]),
    view.reviewObservationLens?.observationRows.map((row) => [
      row.sourceStageNumber,
      row.workflowGroup,
      row.anchor.anchorId,
      row.observationRowId,
    ]),
  );
  assert.equal(
    view.reviewObservationCitations?.summary.counts.sourceMapRowCount,
    view.reviewObservationCoverage?.sourceStageCoverageRows.length,
  );
  assert.equal(
    view.reviewObservationCitations?.summary.counts.phaseCitationGroupCount,
    view.reviewObservationCoverage?.phaseCoverageRows.length,
  );
  assert.ok(view.reviewObservationBoundaryLedger);
  assert.equal(
    view.reviewObservationBoundaryLedger?.schema,
    "telemforge.review_observation_boundary_ledger.v1",
  );
  assert.equal(
    view.reviewObservationBoundaryLedger?.sourceObservationCitations,
    view.reviewObservationCitations,
  );
  assert.deepEqual(
    view.reviewObservationBoundaryLedger?.boundaryRows.map((row) => [
      row.sourceSummaryId,
      row.sourceBoundaryCitationId,
      row.relatedObservationRowIds.length,
    ]),
    view.reviewObservationCitations?.deferredBoundaryCitations.map((citation) => [
      citation.sourceSummaryId,
      citation.citationId,
      citation.sourceObservationRowIds.length,
    ]),
  );
  assert.equal(
    view.reviewObservationBoundaryLedger?.summary.counts.sourceCitationRowCount,
    view.reviewObservationCitations?.citationRows.length,
  );
  assert.ok(view.reviewObservationBoundaryWalkthrough);
  assert.equal(
    view.reviewObservationBoundaryWalkthrough?.schema,
    "telemforge.review_observation_boundary_walkthrough.v1",
  );
  assert.equal(
    view.reviewObservationBoundaryWalkthrough?.sourceObservationBoundaryLedger,
    view.reviewObservationBoundaryLedger,
  );
  assert.deepEqual(
    view.reviewObservationBoundaryWalkthrough?.steps.map((step) => [
      step.sourceBoundaryRowId,
      step.sourceSummaryId,
      step.relatedObservationRowIds.length,
    ]),
    view.reviewObservationBoundaryLedger?.boundaryRows.map((row) => [
      row.boundaryRowId,
      row.sourceSummaryId,
      row.relatedObservationRowIds.length,
    ]),
  );
  assert.equal(
    view.reviewObservationBoundaryWalkthrough?.summary.counts.boundaryStepCount,
    view.reviewObservationBoundaryLedger?.boundaryRows.length,
  );
  assert.ok(view.reviewObservationStoryline);
  assert.equal(
    view.reviewObservationStoryline?.schema,
    "telemforge.review_observation_storyline.v1",
  );
  assert.equal(
    view.reviewObservationStoryline?.sourceObservationBoundaryWalkthrough,
    view.reviewObservationBoundaryWalkthrough,
  );
  assert.deepEqual(
    view.reviewObservationStoryline?.segments.map((segment) => [
      segment.sourceStepId,
      segment.sourceSummaryId,
      segment.relatedObservationRowIds.length,
    ]),
    view.reviewObservationBoundaryWalkthrough?.steps.map((step) => [
      step.stepId,
      step.sourceSummaryId,
      step.relatedObservationRowIds.length,
    ]),
  );
  assert.equal(
    view.reviewObservationStoryline?.summary.counts.storylineSegmentCount,
    view.reviewObservationBoundaryWalkthrough?.steps.length,
  );
  assert.ok(view.reviewObservationHandoffDeck);
  assert.equal(
    view.reviewObservationHandoffDeck?.schema,
    "telemforge.review_observation_handoff_deck.v1",
  );
  assert.equal(
    view.reviewObservationHandoffDeck?.sourceObservationStoryline,
    view.reviewObservationStoryline,
  );
  assert.deepEqual(
    view.reviewObservationHandoffDeck?.cards.map((card) => [
      card.sourceSegmentId,
      card.sourceSummaryId,
      card.relatedObservationRowIds.length,
    ]),
    view.reviewObservationStoryline?.segments.map((segment) => [
      segment.segmentId,
      segment.sourceSummaryId,
      segment.relatedObservationRowIds.length,
    ]),
  );
  assert.equal(
    view.reviewObservationHandoffDeck?.summary.counts.handoffCardCount,
    view.reviewObservationStoryline?.segments.length,
  );
  assert.ok(view.reviewObservationHandoffCoverage);
  assert.equal(
    view.reviewObservationHandoffCoverage?.schema,
    "telemforge.review_observation_handoff_coverage.v1",
  );
  assert.equal(
    view.reviewObservationHandoffCoverage?.sourceObservationHandoffDeck,
    view.reviewObservationHandoffDeck,
  );
  assert.deepEqual(
    view.reviewObservationHandoffCoverage?.coverageRows.map((row) => [
      row.sourceHandoffCardId,
      row.sourceSummaryCoverage.sourceSummaryId,
      row.relatedObservationRowIds.length,
    ]),
    view.reviewObservationHandoffDeck?.cards.map((card) => [
      card.cardId,
      card.sourceSummaryId,
      card.relatedObservationRowIds.length,
    ]),
  );
  assert.equal(
    view.reviewObservationHandoffCoverage?.summary.counts.coverageRowCount,
    view.reviewObservationHandoffDeck?.cards.length,
  );
  assert.ok(view.reviewObservationHandoffQuestions);
  assert.equal(
    view.reviewObservationHandoffQuestions?.schema,
    "telemforge.review_observation_handoff_questions.v1",
  );
  assert.equal(
    view.reviewObservationHandoffQuestions?.sourceObservationHandoffCoverage,
    view.reviewObservationHandoffCoverage,
  );
  assert.deepEqual(
    view.reviewObservationHandoffQuestions?.promptGroups.map((group) => [
      group.sourceCoverageRowId,
      group.sourceHandoffCardId,
      group.sourceSummaryReference.sourceSummaryId,
      group.relatedCoverageRowIds,
      group.relatedGapNoteIds,
      group.relatedDeferredScopeIds,
    ]),
    view.reviewObservationHandoffCoverage?.coverageRows.map((row) => [
      row.coverageRowId,
      row.sourceHandoffCardId,
      row.sourceSummaryCoverage.sourceSummaryId,
      [row.coverageRowId],
      row.staticGapNoteIds,
      row.deferredScopeReminderIds,
    ]),
  );
  assert.equal(
    view.reviewObservationHandoffQuestions?.summary.counts.promptGroupCount,
    view.reviewObservationHandoffCoverage?.coverageRows.length,
  );
  assert.ok(view.reviewObservationHandoffAgenda);
  assert.equal(
    view.reviewObservationHandoffAgenda?.schema,
    "telemforge.review_observation_handoff_agenda.v1",
  );
  assert.equal(
    view.reviewObservationHandoffAgenda?.sourceObservationHandoffQuestions,
    view.reviewObservationHandoffQuestions,
  );
  assert.deepEqual(
    view.reviewObservationHandoffAgenda?.sections.map((section) => [
      section.sourcePromptGroupId,
      section.sourceCoverageRowId,
      section.sourceHandoffCardId,
      section.relatedReviewQuestionIds,
      section.relatedEvidencePromptIds,
      section.relatedGapPromptIds,
      section.relatedDeferredScopePromptIds,
    ]),
    view.reviewObservationHandoffQuestions?.promptGroups.map((group) => [
      group.promptGroupId,
      group.sourceCoverageRowId,
      group.sourceHandoffCardId,
      group.reviewQuestionIds,
      group.evidencePromptIds,
      group.gapPromptIds,
      group.deferredScopePromptIds,
    ]),
  );
  assert.equal(
    view.reviewObservationHandoffAgenda?.summary.counts.agendaSectionCount,
    view.reviewObservationHandoffQuestions?.promptGroups.length,
  );
  assert.ok(view.reviewObservationHandoffPath);
  assert.equal(
    view.reviewObservationHandoffPath?.schema,
    "telemforge.review_observation_handoff_path.v1",
  );
  assert.equal(
    view.reviewObservationHandoffPath?.sourceObservationHandoffAgenda,
    view.reviewObservationHandoffAgenda,
  );
  assert.deepEqual(
    view.reviewObservationHandoffPath?.pathSteps.map((step) => [
      step.sourceAgendaSectionId,
      step.sourcePromptGroupId,
      step.sourceCoverageRowId,
      step.sourceHandoffCardId,
      step.localAnchorHrefs,
      step.relatedFacilitationPromptIds,
      step.relatedEvidenceStopIds,
      step.relatedGapDiscussionPointIds,
      step.relatedDeferredScopeReminderIds,
    ]),
    view.reviewObservationHandoffAgenda?.sections.map((section) => [
      section.sectionId,
      section.sourcePromptGroupId,
      section.sourceCoverageRowId,
      section.sourceHandoffCardId,
      section.localAnchorHrefs,
      section.facilitationPromptIds,
      section.evidenceStopIds,
      section.gapDiscussionPointIds,
      section.deferredScopeReminderIds,
    ]),
  );
  assert.equal(
    view.reviewObservationHandoffPath?.summary.counts.pathStepCount,
    view.reviewObservationHandoffAgenda?.sections.length,
  );
  assert.equal(
    view.reviewObservationHandoffPath?.summary.counts.anchorMapEntryCount,
    view.reviewObservationHandoffAgenda?.sections.reduce(
      (total, section) => total + section.localAnchorHrefs.length,
      0,
    ),
  );
  assert.ok(view.reviewObservationHandoffDryRun);
  assert.equal(
    view.reviewObservationHandoffDryRun?.schema,
    "telemforge.review_observation_handoff_dry_run.v1",
  );
  assert.equal(
    view.reviewObservationHandoffDryRun?.sourceObservationHandoffPath,
    view.reviewObservationHandoffPath,
  );
  assert.deepEqual(
    view.reviewObservationHandoffDryRun?.cues.map((cue) => [
      cue.sourcePathStepId,
      cue.sourceAgendaSectionId,
      cue.sourcePromptGroupId,
      cue.sourceCoverageRowId,
      cue.sourceHandoffCardId,
      cue.localAnchorHrefs,
      cue.anchorTargetIds,
      cue.evidenceCallbackIds,
      cue.gapDiscussionPointIds,
      cue.deferredScopeReminderIds,
    ]),
    view.reviewObservationHandoffPath?.pathSteps.map((step) => [
      step.pathStepId,
      step.sourceAgendaSectionId,
      step.sourcePromptGroupId,
      step.sourceCoverageRowId,
      step.sourceHandoffCardId,
      step.localAnchorHrefs,
      step.anchorTargetIds,
      step.relatedEvidenceStopIds,
      step.relatedGapDiscussionPointIds,
      step.relatedDeferredScopeReminderIds,
    ]),
  );
  assert.equal(
    view.reviewObservationHandoffDryRun?.summary.counts.dryRunCueCount,
    view.reviewObservationHandoffPath?.pathSteps.length,
  );
  assert.equal(
    view.reviewObservationHandoffDryRun?.summary.counts.cueAnchorCoverageEntryCount,
    view.reviewObservationHandoffPath?.anchorMapEntries.length,
  );
  assert.ok(view.reviewObservationHandoffDebrief);
  assert.equal(
    view.reviewObservationHandoffDebrief?.schema,
    "telemforge.review_observation_handoff_debrief.v1",
  );
  assert.equal(
    view.reviewObservationHandoffDebrief?.sourceObservationHandoffDryRun,
    view.reviewObservationHandoffDryRun,
  );
  assert.deepEqual(
    view.reviewObservationHandoffDebrief?.debriefPrompts.map((prompt) => [
      prompt.sourceCueId,
      prompt.sourceCueIds,
      prompt.sourcePathStepId,
      prompt.sourceAgendaSectionId,
      prompt.sourcePromptGroupId,
      prompt.sourceCoverageRowId,
      prompt.sourceCoverageRowIds,
      prompt.sourceHandoffCardId,
      prompt.sourceHandoffCardIds,
      prompt.localAnchorHrefs,
      prompt.anchorTargetIds,
      prompt.evidenceCallbackIds,
      prompt.gapDiscussionPointIds,
      prompt.deferredScopeReminderIds,
    ]),
    view.reviewObservationHandoffDryRun?.cues.map((cue) => [
      cue.cueId,
      [cue.cueId],
      cue.sourcePathStepId,
      cue.sourceAgendaSectionId,
      cue.sourcePromptGroupId,
      cue.sourceCoverageRowId,
      [cue.sourceCoverageRowId],
      cue.sourceHandoffCardId,
      [cue.sourceHandoffCardId],
      cue.localAnchorHrefs,
      cue.anchorTargetIds,
      cue.evidenceCallbackIds,
      cue.gapDiscussionPointIds,
      cue.deferredScopeReminderIds,
    ]),
  );
  assert.equal(
    view.reviewObservationHandoffDebrief?.summary.counts.debriefPromptCount,
    view.reviewObservationHandoffDryRun?.cues.length,
  );
  assert.equal(
    view.reviewObservationHandoffDebrief?.summary.counts.followUpMapEntryCount,
    view.reviewObservationHandoffDryRun?.cueAnchorCoverageEntries.length,
  );
  assert.ok(view.reviewObservationHandoffContinuity);
  assert.equal(
    view.reviewObservationHandoffContinuity?.schema,
    "telemforge.review_observation_handoff_continuity.v1",
  );
  assert.equal(
    view.reviewObservationHandoffContinuity?.sourceObservationHandoffDebrief,
    view.reviewObservationHandoffDebrief,
  );
  assert.deepEqual(
    view.reviewObservationHandoffContinuity?.continuityCards.map((card) => [
      card.sourceCueId,
      card.sourceDebriefPromptId,
      card.sourceFollowUpMapEntryIds,
      card.sourcePathStepId,
      card.sourceAgendaSectionId,
      card.sourcePromptGroupId,
      card.sourceCoverageRowId,
      card.sourceHandoffCardId,
      card.localAnchorHrefs,
      card.anchorTargetIds,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
    ]),
    view.reviewObservationHandoffDebrief?.debriefPrompts.map((prompt) => [
      prompt.sourceCueId,
      prompt.debriefPromptId,
      view.reviewObservationHandoffDebrief?.followUpMapEntries
        .filter((entry) => entry.sourceCueId === prompt.sourceCueId)
        .map((entry) => entry.followUpMapEntryId),
      prompt.sourcePathStepId,
      prompt.sourceAgendaSectionId,
      prompt.sourcePromptGroupId,
      prompt.sourceCoverageRowId,
      prompt.sourceHandoffCardId,
      prompt.localAnchorHrefs,
      prompt.anchorTargetIds,
      prompt.evidenceCallbackIds,
      prompt.gapDiscussionPointIds,
      prompt.deferredScopeReminderIds,
    ]),
  );
  assert.equal(
    view.reviewObservationHandoffContinuity?.summary.counts.continuityCardCount,
    view.reviewObservationHandoffDebrief?.debriefPrompts.length,
  );
  assert.equal(
    view.reviewObservationHandoffContinuity?.summary.counts.nextPassMapEntryCount,
    view.reviewObservationHandoffDebrief?.followUpMapEntries.length,
  );
  assert.ok(view.reviewObservationHandoffDriftGuard);
  assert.equal(
    view.reviewObservationHandoffDriftGuard?.schema,
    "telemforge.review_observation_handoff_drift_guard.v1",
  );
  assert.equal(
    view.reviewObservationHandoffDriftGuard?.sourceObservationHandoffContinuity,
    view.reviewObservationHandoffContinuity,
  );
  assert.deepEqual(
    view.reviewObservationHandoffDriftGuard?.driftGuardRows.map((row) => [
      row.sourceCueId,
      row.sourceDebriefPromptId,
      row.sourceFollowUpMapEntryIds,
      row.sourcePathStepId,
      row.sourceAgendaSectionId,
      row.sourcePromptGroupId,
      row.sourceCoverageRowId,
      row.sourceHandoffCardId,
      row.localAnchorHrefs,
      row.anchorTargetIds,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
    ]),
    view.reviewObservationHandoffContinuity?.continuityCards.map((card) => [
      card.sourceCueId,
      card.sourceDebriefPromptId,
      card.sourceFollowUpMapEntryIds,
      card.sourcePathStepId,
      card.sourceAgendaSectionId,
      card.sourcePromptGroupId,
      card.sourceCoverageRowId,
      card.sourceHandoffCardId,
      card.localAnchorHrefs,
      card.anchorTargetIds,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
    ]),
  );
  assert.equal(
    view.reviewObservationHandoffDriftGuard?.summary.counts.driftGuardRowCount,
    view.reviewObservationHandoffContinuity?.continuityCards.length,
  );
  assert.equal(
    view.reviewObservationHandoffDriftGuard?.summary.counts
      .staticRegressionMapEntryCount,
    view.reviewObservationHandoffContinuity?.nextPassMapEntries.length,
  );
  assert.ok(view.reviewObservationHandoffCalibration);
  assert.equal(
    view.reviewObservationHandoffCalibration?.schema,
    "telemforge.review_observation_handoff_calibration.v1",
  );
  assert.equal(
    view.reviewObservationHandoffCalibration?.sourceObservationHandoffDriftGuard,
    view.reviewObservationHandoffDriftGuard,
  );
  assert.deepEqual(
    view.reviewObservationHandoffCalibration?.calibrationCards.map((card) => [
      card.sourceDriftGuardRowId,
      card.sourceCueId,
      card.sourceDebriefPromptId,
      card.sourceFollowUpMapEntryIds,
      card.sourcePathStepId,
      card.sourceAgendaSectionId,
      card.sourcePromptGroupId,
      card.sourceCoverageRowId,
      card.sourceHandoffCardId,
      card.localAnchorHrefs,
      card.anchorTargetIds,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
    ]),
    view.reviewObservationHandoffDriftGuard?.driftGuardRows.map((row) => [
      row.driftGuardRowId,
      row.sourceCueId,
      row.sourceDebriefPromptId,
      row.sourceFollowUpMapEntryIds,
      row.sourcePathStepId,
      row.sourceAgendaSectionId,
      row.sourcePromptGroupId,
      row.sourceCoverageRowId,
      row.sourceHandoffCardId,
      row.localAnchorHrefs,
      row.anchorTargetIds,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
    ]),
  );
  assert.equal(
    view.reviewObservationHandoffCalibration?.summary.counts
      .calibrationCardCount,
    view.reviewObservationHandoffDriftGuard?.driftGuardRows.length,
  );
  assert.equal(
    view.reviewObservationHandoffCalibration?.summary.counts
      .staticAlignmentNoteCount,
    view.reviewObservationHandoffDriftGuard?.staticRegressionMapEntries.length,
  );
  assert.ok(view.reviewObservationHandoffSynthesis);
  assert.equal(
    view.reviewObservationHandoffSynthesis?.schema,
    "telemforge.review_observation_handoff_synthesis.v1",
  );
  assert.equal(
    view.reviewObservationHandoffSynthesis
      ?.sourceObservationHandoffCalibration,
    view.reviewObservationHandoffCalibration,
  );
  assert.deepEqual(
    view.reviewObservationHandoffSynthesis?.synthesisRows.map((row) => [
      row.sourceCalibrationCardId,
      row.sourceCueId,
      row.sourceDebriefPromptId,
      row.sourceFollowUpMapEntryIds,
      row.sourcePathStepId,
      row.sourceAgendaSectionId,
      row.sourcePromptGroupId,
      row.sourceCoverageRowId,
      row.sourceHandoffCardId,
      row.localAnchorHrefs,
      row.anchorTargetIds,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
    ]),
    view.reviewObservationHandoffCalibration?.calibrationCards.map((card) => [
      card.calibrationCardId,
      card.sourceCueId,
      card.sourceDebriefPromptId,
      card.sourceFollowUpMapEntryIds,
      card.sourcePathStepId,
      card.sourceAgendaSectionId,
      card.sourcePromptGroupId,
      card.sourceCoverageRowId,
      card.sourceHandoffCardId,
      card.localAnchorHrefs,
      card.anchorTargetIds,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
    ]),
  );
  assert.equal(
    view.reviewObservationHandoffSynthesis?.summary.counts.synthesisRowCount,
    view.reviewObservationHandoffCalibration?.calibrationCards.length,
  );
  assert.equal(
    view.reviewObservationHandoffSynthesis?.summary.counts
      .staticRelayNoteCount,
    view.reviewObservationHandoffCalibration?.staticAlignmentNotes.length,
  );
  assert.ok(view.reviewObservationHandoffRelayTrail);
  assert.equal(
    view.reviewObservationHandoffRelayTrail?.schema,
    "telemforge.review_observation_handoff_relay_trail.v1",
  );
  assert.equal(
    view.reviewObservationHandoffRelayTrail
      ?.sourceObservationHandoffSynthesis,
    view.reviewObservationHandoffSynthesis,
  );
  assert.deepEqual(
    view.reviewObservationHandoffRelayTrail?.relaySteps.map((step) => [
      step.sourceSynthesisRowId,
      step.sourceCalibrationCardId,
      step.sourceAlignmentNoteIds,
      step.sourceCueId,
      step.sourceDebriefPromptId,
      step.sourceFollowUpMapEntryIds,
      step.sourcePathStepId,
      step.sourceAgendaSectionId,
      step.sourcePromptGroupId,
      step.sourceCoverageRowId,
      step.sourceHandoffCardId,
      step.localAnchorHrefs,
      step.anchorTargetIds,
      step.evidenceCallbackIds,
      step.gapDiscussionPointIds,
      step.deferredScopeReminderIds,
    ]),
    view.reviewObservationHandoffSynthesis?.synthesisRows.map((row) => [
      row.synthesisRowId,
      row.sourceCalibrationCardId,
      row.sourceAlignmentNoteIds,
      row.sourceCueId,
      row.sourceDebriefPromptId,
      row.sourceFollowUpMapEntryIds,
      row.sourcePathStepId,
      row.sourceAgendaSectionId,
      row.sourcePromptGroupId,
      row.sourceCoverageRowId,
      row.sourceHandoffCardId,
      row.localAnchorHrefs,
      row.anchorTargetIds,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
    ]),
  );
  assert.equal(
    view.reviewObservationHandoffRelayTrail?.summary.counts.relayStepCount,
    view.reviewObservationHandoffSynthesis?.synthesisRows.length,
  );
  assert.equal(
    view.reviewObservationHandoffRelayTrail?.summary.counts
      .staticInspectionNoteCount,
    view.reviewObservationHandoffSynthesis?.staticRelayNotes.length,
  );
  assert.ok(view.reviewObservationHandoffSourceCrosswalk);
  assert.equal(
    view.reviewObservationHandoffSourceCrosswalk?.schema,
    "telemforge.review_observation_handoff_source_crosswalk.v1",
  );
  assert.equal(
    view.reviewObservationHandoffSourceCrosswalk
      ?.sourceReviewObservationHandoffRelayTrail,
    view.reviewObservationHandoffRelayTrail,
  );
  assert.deepEqual(
    view.reviewObservationHandoffSourceCrosswalk?.sourceCrosswalkRows.map(
      (row) => [
        row.sourceRelayStepId,
        row.sourceSynthesisRowIds,
        row.sourceInspectionReferenceIds,
        row.sourceKinds,
        row.sourceIds,
        row.localAnchorHrefs,
        row.anchorTargetIds,
        row.sourceCalibrationCardIds,
        row.sourceAlignmentNoteIds,
        row.sourceCueIds,
        row.sourceDebriefPromptIds,
        row.sourceFollowUpMapEntryIds,
        row.sourcePathStepIds,
        row.sourceAgendaSectionIds,
        row.sourcePromptGroupIds,
        row.sourceCoverageRowIds,
        row.sourceHandoffCardIds,
        row.evidenceCallbackIds,
        row.gapDiscussionPointIds,
        row.deferredScopeReminderIds,
      ],
    ),
    view.reviewObservationHandoffRelayTrail?.relaySteps.map((step) => [
      step.relayStepId,
      step.sourceSynthesisRowIds,
      step.sourceInspectionReferences.map((reference) => reference.referenceId),
      step.sourceInspectionReferences.map((reference) => reference.sourceKind),
      step.sourceInspectionReferences.map((reference) => reference.sourceId),
      step.localAnchorHrefs,
      step.anchorTargetIds,
      step.sourceCalibrationCardIds,
      step.sourceAlignmentNoteIds,
      step.sourceCueIds,
      step.sourceDebriefPromptIds,
      step.sourceFollowUpMapEntryIds,
      step.sourcePathStepIds,
      step.sourceAgendaSectionIds,
      step.sourcePromptGroupIds,
      step.sourceCoverageRowIds,
      step.sourceHandoffCardIds,
      step.evidenceCallbackIds,
      step.gapDiscussionPointIds,
      step.deferredScopeReminderIds,
    ]),
  );
  assert.equal(
    view.reviewObservationHandoffSourceCrosswalk?.summary.counts
      .sourceCrosswalkRowCount,
    view.reviewObservationHandoffRelayTrail?.relaySteps.length,
  );
  assert.equal(
    view.reviewObservationHandoffSourceCrosswalk?.summary.counts
      .staticAnchorNoteCount,
    view.reviewObservationHandoffRelayTrail?.staticInspectionNotes.length,
  );
  assert.ok(view.reviewObservationHandoffSourceWalkthrough);
  assert.equal(
    view.reviewObservationHandoffSourceWalkthrough?.schema,
    "telemforge.review_observation_handoff_source_walkthrough.v1",
  );
  assert.equal(
    view.reviewObservationHandoffSourceWalkthrough
      ?.sourceReviewObservationHandoffSourceCrosswalk,
    view.reviewObservationHandoffSourceCrosswalk,
  );
  assert.deepEqual(
    view.reviewObservationHandoffSourceWalkthrough?.walkthroughSections.map(
      (section) => [
        section.sourceCrosswalkRowId,
        section.sourceRelayStepId,
        section.sourceInspectionReferenceIds,
        section.sourceKinds,
        section.sourceIds,
        section.sourceLabels,
        section.localAnchorHrefs,
        section.anchorTargetIds,
        section.sourceSynthesisRowIds,
        section.sourceCalibrationCardIds,
        section.sourceAlignmentNoteIds,
        section.sourceCueIds,
        section.sourceDebriefPromptIds,
        section.sourceFollowUpMapEntryIds,
        section.sourcePathStepIds,
        section.sourceAgendaSectionIds,
        section.sourcePromptGroupIds,
        section.sourceCoverageRowIds,
        section.sourceHandoffCardIds,
        section.evidenceCallbackIds,
        section.gapDiscussionPointIds,
        section.deferredScopeReminderIds,
      ],
    ),
    view.reviewObservationHandoffSourceCrosswalk?.sourceCrosswalkRows.map(
      (row) => [
        row.sourceCrosswalkRowId,
        row.sourceRelayStepId,
        row.sourceInspectionReferenceIds,
        row.sourceKinds,
        row.sourceIds,
        row.sourceLabels,
        row.localAnchorHrefs,
        row.anchorTargetIds,
        row.sourceSynthesisRowIds,
        row.sourceCalibrationCardIds,
        row.sourceAlignmentNoteIds,
        row.sourceCueIds,
        row.sourceDebriefPromptIds,
        row.sourceFollowUpMapEntryIds,
        row.sourcePathStepIds,
        row.sourceAgendaSectionIds,
        row.sourcePromptGroupIds,
        row.sourceCoverageRowIds,
        row.sourceHandoffCardIds,
        row.evidenceCallbackIds,
        row.gapDiscussionPointIds,
        row.deferredScopeReminderIds,
      ],
    ),
  );
  assert.equal(
    view.reviewObservationHandoffSourceWalkthrough?.summary.counts
      .walkthroughSectionCount,
    view.reviewObservationHandoffSourceCrosswalk?.sourceCrosswalkRows.length,
  );
  assert.equal(
    view.reviewObservationHandoffSourceWalkthrough?.summary.counts
      .staticReviewPromptCount,
    view.reviewObservationHandoffSourceCrosswalk?.staticAnchorNotes.length,
  );
  assert.ok(view.reviewObservationHandoffSourceReadout);
  assert.equal(
    view.reviewObservationHandoffSourceReadout?.schema,
    "telemforge.review_observation_handoff_source_readout.v1",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadout
      ?.sourceReviewObservationHandoffSourceWalkthrough,
    view.reviewObservationHandoffSourceWalkthrough,
  );
  assert.deepEqual(
    view.reviewObservationHandoffSourceReadout?.sourceReadoutRows.map((row) => [
      row.sourceWalkthroughSectionId,
      row.sourceCrosswalkRowId,
      row.sourceRelayStepId,
      row.sourceInspectionReferenceIds,
      row.sourceKinds,
      row.sourceIds,
      row.sourceLabels,
      row.localAnchorHrefs,
      row.anchorTargetIds,
      row.sourceSynthesisRowIds,
      row.sourceCalibrationCardIds,
      row.sourceAlignmentNoteIds,
      row.sourceCueIds,
      row.sourceDebriefPromptIds,
      row.sourceFollowUpMapEntryIds,
      row.sourcePathStepIds,
      row.sourceAgendaSectionIds,
      row.sourcePromptGroupIds,
      row.sourceCoverageRowIds,
      row.sourceHandoffCardIds,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
    ]),
    view.reviewObservationHandoffSourceWalkthrough?.walkthroughSections.map(
      (section) => [
        section.sourceWalkthroughSectionId,
        section.sourceCrosswalkRowId,
        section.sourceRelayStepId,
        section.sourceInspectionReferenceIds,
        section.sourceKinds,
        section.sourceIds,
        section.sourceLabels,
        section.localAnchorHrefs,
        section.anchorTargetIds,
        section.sourceSynthesisRowIds,
        section.sourceCalibrationCardIds,
        section.sourceAlignmentNoteIds,
        section.sourceCueIds,
        section.sourceDebriefPromptIds,
        section.sourceFollowUpMapEntryIds,
        section.sourcePathStepIds,
        section.sourceAgendaSectionIds,
        section.sourcePromptGroupIds,
        section.sourceCoverageRowIds,
        section.sourceHandoffCardIds,
        section.evidenceCallbackIds,
        section.gapDiscussionPointIds,
        section.deferredScopeReminderIds,
      ],
    ),
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadout?.summary.counts
      .sourceReadoutRowCount,
    view.reviewObservationHandoffSourceWalkthrough?.walkthroughSections.length,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadout?.summary.counts
      .staticReviewCueCount,
    view.reviewObservationHandoffSourceWalkthrough?.staticReviewPrompts.length,
  );
  assert.ok(view.reviewObservationHandoffSourceReadiness);
  assert.equal(
    view.reviewObservationHandoffSourceReadiness?.schema,
    "telemforge.review_observation_handoff_source_readiness.v1",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadiness
      ?.sourceReviewObservationHandoffSourceReadout,
    view.reviewObservationHandoffSourceReadout,
  );
  assert.deepEqual(
    view.reviewObservationHandoffSourceReadiness?.sourceReadinessRows.map(
      (row) => [
        row.sourceReadoutRowId,
        row.sourceWalkthroughSectionId,
        row.sourceCrosswalkRowId,
        row.sourceRelayStepId,
        row.sourceInspectionReferenceIds,
        row.sourceKinds,
        row.sourceIds,
        row.sourceLabels,
        row.localAnchorHrefs,
        row.anchorTargetIds,
        row.sourceSynthesisRowIds,
        row.sourceCalibrationCardIds,
        row.sourceAlignmentNoteIds,
        row.sourceCueIds,
        row.sourceDebriefPromptIds,
        row.sourceFollowUpMapEntryIds,
        row.sourcePathStepIds,
        row.sourceAgendaSectionIds,
        row.sourcePromptGroupIds,
        row.sourceCoverageRowIds,
        row.sourceHandoffCardIds,
        row.evidenceCallbackIds,
        row.gapDiscussionPointIds,
        row.deferredScopeReminderIds,
        row.matchedStaticReviewCueIds,
      ],
    ),
    view.reviewObservationHandoffSourceReadout?.sourceReadoutRows.map((row) => [
      row.sourceReadoutRowId,
      row.sourceWalkthroughSectionId,
      row.sourceCrosswalkRowId,
      row.sourceRelayStepId,
      row.sourceInspectionReferenceIds,
      row.sourceKinds,
      row.sourceIds,
      row.sourceLabels,
      row.localAnchorHrefs,
      row.anchorTargetIds,
      row.sourceSynthesisRowIds,
      row.sourceCalibrationCardIds,
      row.sourceAlignmentNoteIds,
      row.sourceCueIds,
      row.sourceDebriefPromptIds,
      row.sourceFollowUpMapEntryIds,
      row.sourcePathStepIds,
      row.sourceAgendaSectionIds,
      row.sourcePromptGroupIds,
      row.sourceCoverageRowIds,
      row.sourceHandoffCardIds,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
      view.reviewObservationHandoffSourceReadout?.staticReviewCues
        .filter((cue) =>
          cue.matchedSourceWalkthroughSectionIds.includes(
            row.sourceWalkthroughSectionId,
          ),
        )
        .map((cue) => cue.staticReviewCueRowId),
    ]),
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadiness?.summary.counts
      .sourceReadinessRowCount,
    view.reviewObservationHandoffSourceReadout?.sourceReadoutRows.length,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadiness?.summary.counts
      .staticReviewCheckCount,
    view.reviewObservationHandoffSourceReadout?.staticReviewCues.length,
  );
  assert.ok(view.reviewObservationHandoffSourceReadinessRehearsal);
  assert.equal(
    view.reviewObservationHandoffSourceReadinessRehearsal?.schema,
    "telemforge.review_observation_handoff_source_readiness_rehearsal.v1",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessRehearsal
      ?.sourceReviewObservationHandoffSourceReadiness,
    view.reviewObservationHandoffSourceReadiness,
  );
  assert.deepEqual(
    view.reviewObservationHandoffSourceReadinessRehearsal?.rehearsalPromptRows.map(
      (row) => [
        row.sourceReadinessRowId,
        row.sourceReadoutRowId,
        row.sourceWalkthroughSectionId,
        row.sourceCrosswalkRowId,
        row.sourceRelayStepId,
        row.sourceInspectionReferenceIds,
        row.localAnchorHrefs,
        row.anchorTargetIds,
        row.evidenceCallbackIds,
        row.gapDiscussionPointIds,
        row.deferredScopeReminderIds,
        row.matchedStaticReviewCheckIds,
        row.staticReviewCueIds,
      ],
    ),
    view.reviewObservationHandoffSourceReadiness?.sourceReadinessRows.map(
      (row) => [
        row.sourceReadinessRowId,
        row.sourceReadoutRowId,
        row.sourceWalkthroughSectionId,
        row.sourceCrosswalkRowId,
        row.sourceRelayStepId,
        row.sourceInspectionReferenceIds,
        row.localAnchorHrefs,
        row.anchorTargetIds,
        row.evidenceCallbackIds,
        row.gapDiscussionPointIds,
        row.deferredScopeReminderIds,
        view.reviewObservationHandoffSourceReadiness?.staticReviewChecks
          .filter((check) =>
            row.matchedStaticReviewCueIds.includes(
              check.sourceStaticReviewCueRowId,
            ),
          )
          .map((check) => check.staticReviewCheckRowId),
        row.matchedStaticReviewCueIds,
      ],
    ),
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessRehearsal?.summary.counts
      .rehearsalPromptRowCount,
    view.reviewObservationHandoffSourceReadiness?.sourceReadinessRows.length,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessRehearsal?.summary.counts
      .staticReviewerPromptCheckCount,
    view.reviewObservationHandoffSourceReadiness?.staticReviewChecks.length,
  );
  assert.ok(view.reviewObservationHandoffSourceReadinessQuestionBoard);
  assert.equal(
    view.reviewObservationHandoffSourceReadinessQuestionBoard?.schema,
    "telemforge.review_observation_handoff_source_readiness_question_board.v1",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessQuestionBoard
      ?.sourceReviewObservationHandoffSourceReadinessRehearsal,
    view.reviewObservationHandoffSourceReadinessRehearsal,
  );
  assert.deepEqual(
    view.reviewObservationHandoffSourceReadinessQuestionBoard?.questionRows.map(
      (row) => [
        row.sourceReadinessRehearsalPromptRowId,
        row.sourceReadinessRowId,
        row.sourceReadoutRowId,
        row.sourceWalkthroughSectionId,
        row.sourceCrosswalkRowId,
        row.sourceRelayStepId,
        row.sourceInspectionReferenceIds,
        row.localAnchorHrefs,
        row.anchorTargetIds,
        row.evidenceCallbackIds,
        row.gapDiscussionPointIds,
        row.deferredScopeReminderIds,
        row.matchedStaticReviewCheckIds,
        row.staticReviewCueIds,
      ],
    ),
    view.reviewObservationHandoffSourceReadinessRehearsal?.rehearsalPromptRows.map(
      (row) => [
        row.sourceReadinessRehearsalPromptRowId,
        row.sourceReadinessRowId,
        row.sourceReadoutRowId,
        row.sourceWalkthroughSectionId,
        row.sourceCrosswalkRowId,
        row.sourceRelayStepId,
        row.sourceInspectionReferenceIds,
        row.localAnchorHrefs,
        row.anchorTargetIds,
        row.evidenceCallbackIds,
        row.gapDiscussionPointIds,
        row.deferredScopeReminderIds,
        row.matchedStaticReviewCheckIds,
        row.staticReviewCueIds,
      ],
    ),
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessQuestionBoard?.summary.counts
      .questionRowCount,
    view.reviewObservationHandoffSourceReadinessRehearsal?.rehearsalPromptRows
      .length,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessQuestionBoard?.summary.counts
      .staticFollowUpPromptCount,
    view.reviewObservationHandoffSourceReadinessRehearsal
      ?.staticReviewerPromptChecks.length,
  );
  assert.ok(view.reviewObservationHandoffSourceReadinessResponseMatrix);
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseMatrix?.schema,
    "telemforge.review_observation_handoff_source_readiness_response_matrix.v1",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseMatrix
      ?.sourceReviewObservationHandoffSourceReadinessQuestionBoard,
    view.reviewObservationHandoffSourceReadinessQuestionBoard,
  );
  assert.deepEqual(
    view.reviewObservationHandoffSourceReadinessResponseMatrix?.responseRows.map(
      (row) => [
        row.sourceReadinessQuestionRowId,
        row.sourceReadinessRehearsalPromptRowId,
        row.sourceReadinessRowId,
        row.sourceReadoutRowId,
        row.sourceWalkthroughSectionId,
        row.sourceCrosswalkRowId,
        row.sourceRelayStepId,
        row.sourceInspectionReferenceIds,
        row.localAnchorHrefs,
        row.anchorTargetIds,
        row.evidenceCallbackIds,
        row.gapDiscussionPointIds,
        row.deferredScopeReminderIds,
        row.matchedStaticReviewCheckIds,
        row.matchedStaticReviewerPromptCheckRowIds,
        row.staticReviewCueIds,
      ],
    ),
    view.reviewObservationHandoffSourceReadinessQuestionBoard?.questionRows.map(
      (row) => [
        row.sourceReadinessQuestionRowId,
        row.sourceReadinessRehearsalPromptRowId,
        row.sourceReadinessRowId,
        row.sourceReadoutRowId,
        row.sourceWalkthroughSectionId,
        row.sourceCrosswalkRowId,
        row.sourceRelayStepId,
        row.sourceInspectionReferenceIds,
        row.localAnchorHrefs,
        row.anchorTargetIds,
        row.evidenceCallbackIds,
        row.gapDiscussionPointIds,
        row.deferredScopeReminderIds,
        row.matchedStaticReviewCheckIds,
        row.matchedStaticReviewerPromptCheckRowIds,
        row.staticReviewCueIds,
      ],
    ),
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseMatrix?.summary.counts
      .responseRowCount,
    view.reviewObservationHandoffSourceReadinessQuestionBoard?.questionRows
      .length,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseMatrix?.summary.counts
      .staticEvidenceNoteCount,
    view.reviewObservationHandoffSourceReadinessQuestionBoard
      ?.staticFollowUpPrompts.length,
  );
  assert.ok(view.reviewObservationHandoffSourceReadinessResponseWalkthrough);
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseWalkthrough?.schema,
    "telemforge.review_observation_handoff_source_readiness_response_walkthrough.v1",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseWalkthrough
      ?.sourceReviewObservationHandoffSourceReadinessResponseMatrix,
    view.reviewObservationHandoffSourceReadinessResponseMatrix,
  );
  assert.deepEqual(
    view.reviewObservationHandoffSourceReadinessResponseWalkthrough?.walkthroughSteps.map(
      (step) => [
        step.sourceReadinessResponseRowId,
        step.sourceReadinessQuestionRowId,
        step.sourceReadinessRehearsalPromptRowId,
        step.sourceReadinessRowId,
        step.sourceReadoutRowId,
        step.sourceWalkthroughSectionId,
        step.sourceCrosswalkRowId,
        step.sourceRelayStepId,
        step.sourceInspectionReferenceIds,
        step.localAnchorHrefs,
        step.anchorTargetIds,
        step.evidenceCallbackIds,
        step.gapDiscussionPointIds,
        step.deferredScopeReminderIds,
        step.matchedStaticEvidenceNoteRowIds,
        step.matchedStaticFollowUpPromptRowIds,
        step.staticReviewCueIds,
      ],
    ),
    view.reviewObservationHandoffSourceReadinessResponseMatrix?.responseRows.map(
      (row) => [
        row.sourceReadinessResponseRowId,
        row.sourceReadinessQuestionRowId,
        row.sourceReadinessRehearsalPromptRowId,
        row.sourceReadinessRowId,
        row.sourceReadoutRowId,
        row.sourceWalkthroughSectionId,
        row.sourceCrosswalkRowId,
        row.sourceRelayStepId,
        row.sourceInspectionReferenceIds,
        row.localAnchorHrefs,
        row.anchorTargetIds,
        row.evidenceCallbackIds,
        row.gapDiscussionPointIds,
        row.deferredScopeReminderIds,
        view.reviewObservationHandoffSourceReadinessResponseMatrix?.staticEvidenceNotes
          .filter(
            (note) =>
              row.matchedStaticFollowUpPromptRowIds.includes(
                note.sourceReadinessStaticFollowUpPromptRowId,
              ) ||
              note.matchedQuestionRowIds.includes(
                row.sourceReadinessQuestionRowId,
              ),
          )
          .map((note) => note.sourceReadinessStaticEvidenceNoteRowId),
        row.matchedStaticFollowUpPromptRowIds,
        row.staticReviewCueIds,
      ],
    ),
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseWalkthrough?.summary
      .counts.walkthroughStepCount,
    view.reviewObservationHandoffSourceReadinessResponseMatrix?.responseRows
      .length,
  );
  assert.ok(view.reviewObservationHandoffSourceReadinessResponseTraceMap);
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceMap?.schema,
    "telemforge.review_observation_handoff_source_readiness_response_trace_map.v1",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceMap
      ?.sourceReviewObservationHandoffSourceReadinessResponseWalkthrough,
    view.reviewObservationHandoffSourceReadinessResponseWalkthrough,
  );
  assert.deepEqual(
    view.reviewObservationHandoffSourceReadinessResponseTraceMap?.responseTraceRows.map(
      (row) => [
        row.sourceReadinessResponseWalkthroughStepId,
        row.sourceReadinessResponseRowId,
        row.sourceReadinessQuestionRowId,
        row.sourceReadinessRehearsalPromptRowId,
        row.sourceReadinessRowId,
        row.sourceReadoutRowId,
        row.sourceWalkthroughSectionId,
        row.sourceCrosswalkRowId,
        row.sourceRelayStepId,
        row.sourceInspectionReferenceIds,
        row.localAnchorHrefs,
        row.anchorTargetIds,
        row.evidenceCallbackIds,
        row.gapDiscussionPointIds,
        row.deferredScopeReminderIds,
        row.matchedStaticEvidenceNoteRowIds,
        row.matchedStaticFollowUpPromptRowIds,
        row.staticReviewCueIds,
      ],
    ),
    view.reviewObservationHandoffSourceReadinessResponseWalkthrough?.walkthroughSteps.map(
      (step) => [
        step.sourceReadinessResponseWalkthroughStepId,
        step.sourceReadinessResponseRowId,
        step.sourceReadinessQuestionRowId,
        step.sourceReadinessRehearsalPromptRowId,
        step.sourceReadinessRowId,
        step.sourceReadoutRowId,
        step.sourceWalkthroughSectionId,
        step.sourceCrosswalkRowId,
        step.sourceRelayStepId,
        step.sourceInspectionReferenceIds,
        step.localAnchorHrefs,
        step.anchorTargetIds,
        step.evidenceCallbackIds,
        step.gapDiscussionPointIds,
        step.deferredScopeReminderIds,
        step.matchedStaticEvidenceNoteRowIds,
        step.matchedStaticFollowUpPromptRowIds,
        step.staticReviewCueIds,
      ],
    ),
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceMap?.summary.counts
      .responseTraceRowCount,
    view.reviewObservationHandoffSourceReadinessResponseWalkthrough
      ?.walkthroughSteps.length,
  );
  assert.ok(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageBoard,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageBoard
      ?.schema,
    "telemforge.review_observation_handoff_source_readiness_response_trace_coverage_board.v1",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageBoard
      ?.sourceReviewObservationHandoffSourceReadinessResponseTraceMap,
    view.reviewObservationHandoffSourceReadinessResponseTraceMap,
  );
  assert.deepEqual(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageBoard?.coverageRows.map(
      (row) => [
        row.coverageOrder,
        row.sourceReadinessResponseTraceRowId,
        row.sourceReadinessResponseWalkthroughStepId,
        row.sourceReadinessResponseRowId,
        row.sourceReadinessQuestionRowId,
        row.matchedStaticEvidenceNoteRowIds,
        row.matchedStaticFollowUpPromptRowIds,
        row.matchedSourceAlignmentNoteCardIds,
        row.sourceLocalAnchorHrefs,
        row.sourceAnchorTargetIds,
        row.evidenceCallbackIds,
        row.gapDiscussionPointIds,
        row.deferredScopeReminderIds,
        row.responseNoteCue,
        row.reviewerCueText,
        row.sourceAlignmentNoteText,
      ],
    ),
    view.reviewObservationHandoffSourceReadinessResponseTraceMap?.responseTraceRows.map(
      (row) => [
        row.traceOrder,
        row.sourceReadinessResponseTraceRowId,
        row.sourceReadinessResponseWalkthroughStepId,
        row.sourceReadinessResponseRowId,
        row.sourceReadinessQuestionRowId,
        row.matchedStaticEvidenceNoteRowIds,
        row.matchedStaticFollowUpPromptRowIds,
        view.reviewObservationHandoffSourceReadinessResponseTraceMap?.staticSourceAlignmentNoteCards
          .filter(
            (card) =>
              card.matchedResponseRowIds.includes(
                row.sourceReadinessResponseRowId,
              ) ||
              card.matchedQuestionRowIds.includes(
                row.sourceReadinessQuestionRowId,
              ),
          )
          .map(
            (card) =>
              card.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
          ),
        row.localAnchorHrefs,
        row.anchorTargetIds,
        row.evidenceCallbackIds,
        row.gapDiscussionPointIds,
        row.deferredScopeReminderIds,
        row.responseNoteCue,
        row.reviewerCueText,
        row.sourceAlignmentNoteText,
      ],
    ),
  );
  assert.ok(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageBoard
      ?.coverageRows.every(
        (row) =>
          row.coverageNoteText.includes(
            row.sourceReadinessResponseTraceRowId,
          ) &&
          row.coverageNoteText.includes(row.sourceReadinessResponseRowId) &&
          row.localOnly &&
          row.sourceBacked &&
          row.inPageOnly &&
          row.explanatoryOnly &&
          row.staticOnly &&
          row.informationalOnly &&
          row.nonActionable &&
          row.nonPersistent &&
          row.nonExecutable &&
          row.nonRouting &&
          row.nonCertifying &&
          row.nonRanking &&
          row.notATask &&
          row.notATicket &&
          row.notAChecklist &&
          row.notOwnerAssigned &&
          row.staticNonGoalFlags
            .noSavedSourceReadinessResponseTraceCoverageProgress &&
          row.staticNonGoalFlags.noSavedTraceCoverageProgress &&
          row.staticNonGoalFlags.noSavedGapNotes &&
          row.staticNonGoalFlags.noSavedSourceReadinessResponseTraceProgress &&
          row.staticNonGoalFlags.noSavedTraceProgress &&
          row.staticNonGoalFlags.noSavedSourceReadinessResponseWalkthroughProgress &&
          row.staticNonGoalFlags.noSavedWalkthroughProgress &&
          row.staticNonGoalFlags.noSavedSourceReadinessResponseProgress &&
          row.staticNonGoalFlags.noSavedReviewerAnswers &&
          row.staticNonGoalFlags.noSavedSourceReadinessQuestionProgress &&
          row.staticNonGoalFlags.noSavedSourceReadinessRehearsalProgress &&
          row.staticNonGoalFlags.noSavedSourceReadinessProgress &&
          row.staticNonGoalFlags.noSavedSourceReadoutProgress &&
          row.staticNonGoalFlags.noSavedSourceWalkthroughProgress &&
          row.staticNonGoalFlags.noSavedSourceInspectionState &&
          row.staticNonGoalFlags.noSavedAnchorState &&
          row.staticNonGoalFlags.noSavedRelayProgress &&
          row.staticNonGoalFlags.noPersistence &&
          row.staticNonGoalFlags.noRouteChanges &&
          row.staticNonGoalFlags.noCommandExecution &&
          row.staticNonGoalFlags.noExports &&
          row.staticNonGoalFlags.noSignoff &&
          row.staticNonGoalFlags.noAuditRetention &&
          row.staticNonGoalFlags.noOwnerAssignment &&
          row.staticNonGoalFlags.noScoring &&
          row.staticNonGoalFlags.noCertification &&
          row.staticNonGoalFlags.noMeetingWorkflow &&
          row.staticNonGoalFlags.noHandoffPackageGeneration &&
          row.staticNonGoalFlags.noTaskLaunchers &&
          row.staticNonGoalFlags.noRunnableChecklists,
      ),
  );
  assert.ok(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageBoard
      ?.staticGapNoteCards.every(
        (card) =>
          card.gapNoteText.includes(
            card.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
          ) &&
          card.gapNoteText.includes(card.sourceReadinessStaticEvidenceNoteRowId) &&
          card.localOnly &&
          card.sourceBacked &&
          card.inPageOnly &&
          card.explanatoryOnly &&
          card.staticOnly &&
          card.informationalOnly &&
          card.nonActionable &&
          card.nonPersistent &&
          card.nonExecutable &&
          card.nonRouting &&
          card.nonCertifying &&
          card.nonRanking &&
          card.notATask &&
          card.notATicket &&
          card.notAChecklist &&
          card.notOwnerAssigned &&
          card.staticNonGoalFlags
            .noSavedSourceReadinessResponseTraceCoverageProgress &&
          card.staticNonGoalFlags.noSavedTraceCoverageProgress &&
          card.staticNonGoalFlags.noSavedGapNotes &&
          card.staticNonGoalFlags.noSavedSourceReadinessResponseTraceProgress &&
          card.staticNonGoalFlags.noSavedTraceProgress &&
          card.staticNonGoalFlags.noSavedSourceReadinessResponseWalkthroughProgress &&
          card.staticNonGoalFlags.noSavedWalkthroughProgress &&
          card.staticNonGoalFlags.noSavedSourceReadinessResponseProgress &&
          card.staticNonGoalFlags.noSavedReviewerAnswers &&
          card.staticNonGoalFlags.noSavedSourceReadinessQuestionProgress &&
          card.staticNonGoalFlags.noSavedSourceReadinessRehearsalProgress &&
          card.staticNonGoalFlags.noSavedSourceReadinessProgress &&
          card.staticNonGoalFlags.noSavedSourceReadoutProgress &&
          card.staticNonGoalFlags.noSavedSourceWalkthroughProgress &&
          card.staticNonGoalFlags.noSavedSourceInspectionState &&
          card.staticNonGoalFlags.noSavedAnchorState &&
          card.staticNonGoalFlags.noSavedRelayProgress &&
          card.staticNonGoalFlags.noPersistence &&
          card.staticNonGoalFlags.noRouteChanges &&
          card.staticNonGoalFlags.noCommandExecution &&
          card.staticNonGoalFlags.noExports &&
          card.staticNonGoalFlags.noSignoff &&
          card.staticNonGoalFlags.noAuditRetention &&
          card.staticNonGoalFlags.noOwnerAssignment &&
          card.staticNonGoalFlags.noScoring &&
          card.staticNonGoalFlags.noCertification &&
          card.staticNonGoalFlags.noMeetingWorkflow &&
          card.staticNonGoalFlags.noHandoffPackageGeneration &&
          card.staticNonGoalFlags.noTaskLaunchers &&
          card.staticNonGoalFlags.noRunnableChecklists,
      ),
  );
  assert.ok(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath
      ?.schema,
    "telemforge.review_observation_handoff_source_readiness_response_trace_coverage_review_path.v1",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath
      ?.sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageBoard,
  );
  assert.deepEqual(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath?.reviewPathSteps.map(
      (step) => [
        step.reviewPathOrder,
        step.sourceReadinessResponseTraceCoverageRowId,
        step.sourceReadinessResponseTraceRowId,
        step.sourceReadinessResponseWalkthroughStepId,
        step.sourceReadinessResponseRowId,
        step.sourceReadinessQuestionRowId,
        step.matchedSourceAlignmentNoteCardIds,
        step.matchedStaticEvidenceNoteRowIds,
        step.matchedStaticFollowUpPromptRowIds,
        step.sourceLocalAnchorHrefs,
        step.sourceAnchorTargetIds,
        step.evidenceCallbackIds,
        step.gapDiscussionPointIds,
        step.deferredScopeReminderIds,
        step.responseNoteCue,
        step.reviewerCueText,
        step.coverageNoteText,
      ],
    ),
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageBoard?.coverageRows.map(
      (row) => [
        row.coverageOrder,
        row.sourceReadinessResponseTraceCoverageRowId,
        row.sourceReadinessResponseTraceRowId,
        row.sourceReadinessResponseWalkthroughStepId,
        row.sourceReadinessResponseRowId,
        row.sourceReadinessQuestionRowId,
        row.matchedSourceAlignmentNoteCardIds,
        row.matchedStaticEvidenceNoteRowIds,
        row.matchedStaticFollowUpPromptRowIds,
        row.sourceLocalAnchorHrefs,
        row.sourceAnchorTargetIds,
        row.evidenceCallbackIds,
        row.gapDiscussionPointIds,
        row.deferredScopeReminderIds,
        row.responseNoteCue,
        row.reviewerCueText,
        row.coverageNoteText,
      ],
    ),
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath
      ?.summary.counts.reviewPathStepCount,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageBoard
      ?.coverageRows.length,
  );
  assert.ok(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath
      ?.reviewPathSteps.every(
        (step) =>
          step.staticHandoffPromptText.includes(
            step.sourceReadinessResponseTraceCoverageRowId,
          ) &&
          step.localOnly &&
          step.sourceBacked &&
          step.inPageOnly &&
          step.explanatoryOnly &&
          step.staticOnly &&
          step.informationalOnly &&
          step.nonActionable &&
          step.nonPersistent &&
          step.nonExecutable &&
          step.nonRouting &&
          step.nonCertifying &&
          step.nonRanking &&
          step.notATask &&
          step.notATicket &&
          step.notAChecklist &&
          step.notOwnerAssigned &&
          step.staticNonGoalFlags
            .noSavedSourceReadinessResponseTraceCoverageReviewProgress &&
          step.staticNonGoalFlags.noSavedCoverageReviewProgress &&
          step.staticNonGoalFlags.noSavedCoverageProgress &&
          step.staticNonGoalFlags.noSavedHandoffPromptEdits &&
          step.staticNonGoalFlags.noSavedTraceCoverageProgress &&
          step.staticNonGoalFlags.noSavedGapNotes &&
          step.staticNonGoalFlags.noSavedReviewerAnswers &&
          step.staticNonGoalFlags.noPersistence &&
          step.staticNonGoalFlags.noRouteChanges &&
          step.staticNonGoalFlags.noCommandExecution &&
          step.staticNonGoalFlags.noExports &&
          step.staticNonGoalFlags.noSignoff &&
          step.staticNonGoalFlags.noAuditRetention &&
          step.staticNonGoalFlags.noOwnerAssignment &&
          step.staticNonGoalFlags.noScoring &&
          step.staticNonGoalFlags.noCertification &&
          step.staticNonGoalFlags.noMeetingWorkflow &&
          step.staticNonGoalFlags.noHandoffPackageGeneration &&
          step.staticNonGoalFlags.noTaskLaunchers &&
          step.staticNonGoalFlags.noRunnableChecklists,
      ),
  );
  assert.ok(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief
      ?.schema,
    "telemforge.review_observation_handoff_source_readiness_response_trace_coverage_readiness_brief.v1",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief
      ?.sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
      ?.localStatus,
    "fixture",
  );
  assert.strictEqual(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
      ?.sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
      ?.summary.counts.reviewLaneRowCount,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief
      ?.readinessBriefRows.length,
  );
  assert.deepEqual(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief?.readinessBriefRows.map(
      (row) => [
        row.readinessBriefOrder,
        row.sourceReadinessResponseTraceCoverageReviewPathStepId,
        row.sourceReadinessResponseTraceCoverageRowId,
        row.sourceReadinessResponseTraceRowId,
        row.sourceReadinessResponseWalkthroughStepId,
        row.sourceReadinessResponseRowId,
        row.sourceReadinessQuestionRowId,
        row.matchedSourceAlignmentNoteCardIds,
        row.matchedStaticEvidenceNoteRowIds,
        row.matchedStaticFollowUpPromptRowIds,
        row.sourceLocalAnchorHrefs,
        row.sourceAnchorTargetIds,
        row.evidenceCallbackIds,
        row.gapDiscussionPointIds,
        row.deferredScopeReminderIds,
        row.responseNoteCue,
        row.reviewerCueText,
        row.coverageNoteText,
        row.gapNoteText,
      ],
    ),
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath?.reviewPathSteps.map(
      (step) => [
        step.reviewPathOrder,
        step.sourceReadinessResponseTraceCoverageReviewPathStepId,
        step.sourceReadinessResponseTraceCoverageRowId,
        step.sourceReadinessResponseTraceRowId,
        step.sourceReadinessResponseWalkthroughStepId,
        step.sourceReadinessResponseRowId,
        step.sourceReadinessQuestionRowId,
        step.matchedSourceAlignmentNoteCardIds,
        step.matchedStaticEvidenceNoteRowIds,
        step.matchedStaticFollowUpPromptRowIds,
        step.sourceLocalAnchorHrefs,
        step.sourceAnchorTargetIds,
        step.evidenceCallbackIds,
        step.gapDiscussionPointIds,
        step.deferredScopeReminderIds,
        step.responseNoteCue,
        step.reviewerCueText,
        step.coverageNoteText,
        step.gapNoteText,
      ],
    ),
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief
      ?.summary.counts.readinessBriefRowCount,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath
      ?.reviewPathSteps.length,
  );
  assert.ok(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief
      ?.readinessBriefRows.every(
        (row) =>
          row.readinessBriefText.includes(
            row.sourceReadinessResponseTraceCoverageReviewPathStepId,
          ) &&
          row.localOnly &&
          row.sourceBacked &&
          row.inPageOnly &&
          row.explanatoryOnly &&
          row.staticOnly &&
          row.informationalOnly &&
          row.nonActionable &&
          row.nonPersistent &&
          row.nonExecutable &&
          row.nonRouting &&
          row.nonCertifying &&
          row.nonRanking &&
          row.notATask &&
          row.notATicket &&
          row.notAChecklist &&
          row.notOwnerAssigned &&
          row.staticNonGoalFlags
            .noSavedSourceReadinessResponseTraceCoverageReadinessBriefState &&
          row.staticNonGoalFlags.noSavedReadinessBriefState &&
          row.staticNonGoalFlags.noSavedReviewerCues &&
          row.staticNonGoalFlags
            .noSavedSourceReadinessResponseTraceCoverageReviewProgress &&
          row.staticNonGoalFlags.noSavedCoverageReviewProgress &&
          row.staticNonGoalFlags.noSavedCoverageProgress &&
          row.staticNonGoalFlags.noSavedHandoffPromptEdits &&
          row.staticNonGoalFlags.noSavedTraceCoverageProgress &&
          row.staticNonGoalFlags.noSavedGapNotes &&
          row.staticNonGoalFlags.noSavedReviewerAnswers &&
          row.staticNonGoalFlags.noPersistence &&
          row.staticNonGoalFlags.noRouteChanges &&
          row.staticNonGoalFlags.noCommandExecution &&
          row.staticNonGoalFlags.noExports &&
          row.staticNonGoalFlags.noSignoff &&
          row.staticNonGoalFlags.noAuditRetention &&
          row.staticNonGoalFlags.noOwnerAssignment &&
          row.staticNonGoalFlags.noScoring &&
          row.staticNonGoalFlags.noCertification &&
          row.staticNonGoalFlags.noMeetingWorkflow &&
          row.staticNonGoalFlags.noHandoffPackageGeneration &&
          row.staticNonGoalFlags.noTaskLaunchers &&
          row.staticNonGoalFlags.noRunnableChecklists,
      ),
  );
  assert.ok(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
      ?.schema,
    "telemforge.review_observation_handoff_source_readiness_response_trace_coverage_readiness_review_lane.v1",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
      ?.sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief,
  );
  assert.deepEqual(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane?.reviewLaneRows.map(
      (row) => [
        row.reviewLaneOrder,
        row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        row.sourceReadinessResponseTraceCoverageReviewPathStepId,
        row.sourceReadinessResponseTraceCoverageRowId,
        row.sourceReadinessResponseTraceRowId,
        row.sourceReadinessResponseWalkthroughStepId,
        row.sourceReadinessResponseRowId,
        row.sourceReadinessQuestionRowId,
        row.matchedStaticReviewerCueCardIds,
        row.matchedStaticHandoffPromptCardIds,
        row.sourceLocalAnchorHrefs,
        row.sourceAnchorTargetIds,
        row.evidenceCallbackIds,
        row.gapDiscussionPointIds,
        row.deferredScopeReminderIds,
        row.reviewerCueText,
        row.coverageNoteText,
        row.gapNoteText,
        row.handoffPromptText,
        row.readinessBriefText,
      ],
    ),
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief?.readinessBriefRows.map(
      (readinessBriefRow) => {
        const matchedStaticReviewerCueCards =
          view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief?.staticReviewerCueCards.filter(
            (card) =>
              card.matchedReviewPathStepIds.includes(
                readinessBriefRow
                  .sourceReadinessResponseTraceCoverageReviewPathStepId,
              ) ||
              card.matchedCoverageRowIds.includes(
                readinessBriefRow.sourceReadinessResponseTraceCoverageRowId,
              ) ||
              readinessBriefRow.matchedStaticHandoffPromptCardIds.includes(
                card.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
              ),
          ) ?? [];

        return [
          readinessBriefRow.readinessBriefOrder,
          readinessBriefRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
          readinessBriefRow.sourceReadinessResponseTraceCoverageReviewPathStepId,
          readinessBriefRow.sourceReadinessResponseTraceCoverageRowId,
          readinessBriefRow.sourceReadinessResponseTraceRowId,
          readinessBriefRow.sourceReadinessResponseWalkthroughStepId,
          readinessBriefRow.sourceReadinessResponseRowId,
          readinessBriefRow.sourceReadinessQuestionRowId,
          matchedStaticReviewerCueCards.map(
            (card) =>
              card.sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
          ),
          readinessBriefRow.matchedStaticHandoffPromptCardIds,
          readinessBriefRow.sourceLocalAnchorHrefs,
          readinessBriefRow.sourceAnchorTargetIds,
          readinessBriefRow.evidenceCallbackIds,
          readinessBriefRow.gapDiscussionPointIds,
          readinessBriefRow.deferredScopeReminderIds,
          readinessBriefRow.reviewerCueText,
          readinessBriefRow.coverageNoteText,
          readinessBriefRow.gapNoteText,
          readinessBriefRow.handoffPromptText,
          readinessBriefRow.readinessBriefText,
        ];
      },
    ),
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
      ?.summary.counts.reviewLaneRowCount,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief
      ?.readinessBriefRows.length,
  );
  assert.ok(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
      ?.reviewLaneRows.every(
        (row) =>
          row.reviewLaneText.includes(
            row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
          ) &&
          row.humanCheckPromptText.includes(row.coverageNoteText) &&
          row.localOnly &&
          row.sourceBacked &&
          row.inPageOnly &&
          row.explanatoryOnly &&
          row.staticOnly &&
          row.informationalOnly &&
          row.nonActionable &&
          row.nonPersistent &&
          row.nonExecutable &&
          row.nonRouting &&
          row.nonCertifying &&
          row.nonRanking &&
          row.notATask &&
          row.notATicket &&
          row.notAChecklist &&
          row.notOwnerAssigned &&
          row.staticNonGoalFlags
            .noSavedSourceReadinessResponseTraceCoverageReadinessReviewLaneState &&
          row.staticNonGoalFlags.noSavedReviewLaneState &&
          row.staticNonGoalFlags.noSavedHumanCheckPrompts &&
          row.staticNonGoalFlags.noSavedReadinessBriefState &&
          row.staticNonGoalFlags.noSavedReviewerCues &&
          row.staticNonGoalFlags.noSavedCoverageReviewProgress &&
          row.staticNonGoalFlags.noSavedTraceCoverageProgress &&
          row.staticNonGoalFlags.noSavedGapNotes &&
          row.staticNonGoalFlags.noSavedReviewerAnswers &&
          row.staticNonGoalFlags.noPersistence &&
          row.staticNonGoalFlags.noRouteChanges &&
          row.staticNonGoalFlags.noCommandExecution &&
          row.staticNonGoalFlags.noExports &&
          row.staticNonGoalFlags.noSignoff &&
          row.staticNonGoalFlags.noAuditRetention &&
          row.staticNonGoalFlags.noOwnerAssignment &&
          row.staticNonGoalFlags.noScoring &&
          row.staticNonGoalFlags.noCertification &&
          row.staticNonGoalFlags.noMeetingWorkflow &&
          row.staticNonGoalFlags.noHandoffPackageGeneration &&
          row.staticNonGoalFlags.noTaskLaunchers &&
          row.staticNonGoalFlags.noRunnableChecklists,
      ),
  );
  assert.ok(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
      ?.schema,
    "telemforge.review_observation_handoff_source_readiness_response_trace_coverage_readiness_review_synthesis.v1",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
      ?.localStatus,
    "fixture",
  );
  assert.strictEqual(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
      ?.sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
      ?.summary.counts.synthesisRowCount,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
      ?.reviewLaneRows.length,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
      ?.summary.counts.staticFollowUpNoteCardCount,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
      ?.staticHumanCheckPromptCards.length,
  );
  assert.ok(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
      ?.synthesisRows.every(
        (row) =>
          row.followUpNoteText.includes(
            row.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
          ) &&
          row.staticNonGoalFlags.noSavedSynthesisState &&
          row.staticNonGoalFlags.noSavedFollowUpNotes &&
          row.staticNonGoalFlags.noSavedReviewLaneState &&
          row.staticNonGoalFlags.noSavedHumanCheckPrompts &&
          row.staticNonGoalFlags.noRouteChanges &&
          row.staticNonGoalFlags.noCommandExecution &&
          row.staticNonGoalFlags.noExports &&
          row.staticNonGoalFlags.noOwnerAssignment &&
          row.staticNonGoalFlags.noScoring &&
          row.staticNonGoalFlags.noCertification,
      ),
  );
  assert.ok(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
      ?.schema,
    "telemforge.review_observation_handoff_source_readiness_response_trace_coverage_readiness_review_synthesis_follow_up_triage.v1",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
      ?.localStatus,
    "fixture",
  );
  assert.strictEqual(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
      ?.sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
      ?.summary.counts.followUpTriageRowCount,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
      ?.synthesisRows.length,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
      ?.summary.counts.staticCheckPromptCardCount,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
      ?.staticFollowUpNoteCards.length,
  );
  assert.ok(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
      ?.followUpTriageRows.every(
        (row) =>
          row.staticCheckPromptText.includes(
            row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
          ) &&
          row.staticNonGoalFlags.noSavedSynthesisState &&
          row.staticNonGoalFlags.noSavedFollowUpNotes &&
          row.staticNonGoalFlags.noSavedTriageState &&
          row.staticNonGoalFlags.noSavedCheckPrompts &&
          row.staticNonGoalFlags.noRouteChanges &&
          row.staticNonGoalFlags.noCommandExecution &&
          row.staticNonGoalFlags.noExports &&
          row.staticNonGoalFlags.noOwnerAssignment &&
          row.staticNonGoalFlags.noScoring &&
          row.staticNonGoalFlags.noCertification,
      ),
  );
  assert.ok(view.reviewObservationHandoffFollowUpReadinessBrief);
  assert.equal(
    view.reviewObservationHandoffFollowUpReadinessBrief?.schema,
    "telemforge.review_observation_handoff_follow_up_readiness_brief.v1",
  );
  assert.equal(
    view.reviewObservationHandoffFollowUpReadinessBrief?.localStatus,
    "fixture",
  );
  assert.strictEqual(
    view.reviewObservationHandoffFollowUpReadinessBrief
      ?.sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage,
  );
  assert.equal(
    view.reviewObservationHandoffFollowUpReadinessBrief?.summary.counts
      .followUpReadinessBriefRowCount,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
      ?.followUpTriageRows.length,
  );
  assert.equal(
    view.reviewObservationHandoffFollowUpReadinessBrief?.summary.counts
      .staticReviewerPromptCardCount,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
      ?.staticCheckPromptCards.length,
  );
  assert.equal(
    view.reviewObservationHandoffFollowUpReadinessBrief?.summary
      .defaultFollowUpReadinessBriefContext.defaultFollowUpTriageRowId,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
      ?.summary.defaultFollowUpTriageContext.defaultFollowUpTriageRowId,
  );
  assert.ok(
    view.reviewObservationHandoffFollowUpReadinessBrief?.followUpReadinessBriefRows.every(
      (row) =>
        row.followUpReadinessBriefRowId.length > 0 &&
        row.followUpReadinessBriefRowOrder > 0 &&
        row.staticReviewerPromptText.includes(
          row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        ) &&
        row.staticNonGoalFlags.noSavedFollowUpReadinessBriefState &&
        row.staticNonGoalFlags.noSavedFollowUpReadinessBriefRows &&
        row.staticNonGoalFlags.noSavedBriefState &&
        row.staticNonGoalFlags.noSavedStaticReviewerPrompts &&
        row.staticNonGoalFlags.noSavedStaticReviewerPromptCards &&
        row.staticNonGoalFlags.noSavedStaticReviewerPromptState &&
        row.staticNonGoalFlags.noSavedPromptState,
    ),
  );
  assert.ok(
    view.reviewObservationHandoffFollowUpReadinessBrief?.staticReviewerPromptCards.every(
      (card) =>
        card.followUpReadinessBriefStaticReviewerPromptCardId.length > 0 &&
        card.staticReviewerPromptText.includes(
          card.followUpReadinessBriefStaticReviewerPromptCardId,
        ) &&
        card.staticNonGoalFlags.noSavedFollowUpReadinessBriefState &&
        card.staticNonGoalFlags.noSavedFollowUpReadinessBriefRows &&
        card.staticNonGoalFlags.noSavedBriefState &&
        card.staticNonGoalFlags.noSavedStaticReviewerPrompts &&
        card.staticNonGoalFlags.noSavedStaticReviewerPromptCards &&
        card.staticNonGoalFlags.noSavedStaticReviewerPromptState &&
        card.staticNonGoalFlags.noSavedPromptState,
    ),
  );
});

test("buildMissionConsoleView keeps the surface index aligned with local-live mode", () => {
  const liveStream = {
    ...buildFixtureStreamConnection(stage07ConsoleFixture),
    state: "live" as const,
    label: "Live review stream",
    detail: "Connected to the local websocket",
  };

  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal", liveStream);

  assert.equal(view.stream.state, "live");
  assert.equal(view.reviewSurfaceIndex?.localStatus, "local-live");
  assert.equal(view.reviewWalkthroughPath?.localStatus, "local-live");
  assert.equal(view.reviewObservationLens?.localStatus, "local-live");
  assert.equal(view.reviewObservationCoverage?.localStatus, "local-live");
  assert.equal(view.reviewObservationCitations?.localStatus, "local-live");
  assert.equal(view.reviewObservationBoundaryLedger?.localStatus, "local-live");
  assert.equal(
    view.reviewObservationBoundaryWalkthrough?.localStatus,
    "local-live",
  );
  assert.equal(view.reviewObservationStoryline?.localStatus, "local-live");
  assert.equal(view.reviewObservationHandoffDeck?.localStatus, "local-live");
  assert.equal(
    view.reviewObservationHandoffCoverage?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffQuestions?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffQuestions?.sourceObservationHandoffCoverage,
    view.reviewObservationHandoffCoverage,
  );
  assert.equal(
    view.reviewObservationHandoffAgenda?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffAgenda?.sourceObservationHandoffQuestions,
    view.reviewObservationHandoffQuestions,
  );
  assert.equal(
    view.reviewObservationHandoffPath?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffPath?.sourceObservationHandoffAgenda,
    view.reviewObservationHandoffAgenda,
  );
  assert.equal(
    view.reviewObservationHandoffDryRun?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffDryRun?.sourceObservationHandoffPath,
    view.reviewObservationHandoffPath,
  );
  assert.equal(
    view.reviewObservationHandoffDebrief?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffDebrief?.sourceObservationHandoffDryRun,
    view.reviewObservationHandoffDryRun,
  );
  assert.equal(
    view.reviewObservationHandoffContinuity?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffContinuity?.sourceObservationHandoffDebrief,
    view.reviewObservationHandoffDebrief,
  );
  assert.equal(
    view.reviewObservationHandoffDriftGuard?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffDriftGuard
      ?.sourceObservationHandoffContinuity,
    view.reviewObservationHandoffContinuity,
  );
  assert.equal(
    view.reviewObservationHandoffCalibration?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffCalibration
      ?.sourceObservationHandoffDriftGuard,
    view.reviewObservationHandoffDriftGuard,
  );
  assert.equal(
    view.reviewObservationHandoffSynthesis?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffSynthesis
      ?.sourceObservationHandoffCalibration,
    view.reviewObservationHandoffCalibration,
  );
  assert.equal(
    view.reviewObservationHandoffRelayTrail?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffRelayTrail
      ?.sourceObservationHandoffSynthesis,
    view.reviewObservationHandoffSynthesis,
  );
  assert.equal(
    view.reviewObservationHandoffSourceCrosswalk?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffSourceCrosswalk
      ?.sourceReviewObservationHandoffRelayTrail,
    view.reviewObservationHandoffRelayTrail,
  );
  assert.equal(
    view.reviewObservationHandoffSourceWalkthrough?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffSourceWalkthrough
      ?.sourceReviewObservationHandoffSourceCrosswalk,
    view.reviewObservationHandoffSourceCrosswalk,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadout?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadout
      ?.sourceReviewObservationHandoffSourceWalkthrough,
    view.reviewObservationHandoffSourceWalkthrough,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadiness?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadiness
      ?.sourceReviewObservationHandoffSourceReadout,
    view.reviewObservationHandoffSourceReadout,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessRehearsal?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessRehearsal
      ?.sourceReviewObservationHandoffSourceReadiness,
    view.reviewObservationHandoffSourceReadiness,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessQuestionBoard?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessQuestionBoard
      ?.sourceReviewObservationHandoffSourceReadinessRehearsal,
    view.reviewObservationHandoffSourceReadinessRehearsal,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseMatrix?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseMatrix
      ?.sourceReviewObservationHandoffSourceReadinessQuestionBoard,
    view.reviewObservationHandoffSourceReadinessQuestionBoard,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseWalkthrough?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseWalkthrough
      ?.sourceReviewObservationHandoffSourceReadinessResponseMatrix,
    view.reviewObservationHandoffSourceReadinessResponseMatrix,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceMap?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceMap
      ?.sourceReviewObservationHandoffSourceReadinessResponseWalkthrough,
    view.reviewObservationHandoffSourceReadinessResponseWalkthrough,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageBoard
      ?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageBoard
      ?.sourceReviewObservationHandoffSourceReadinessResponseTraceMap,
    view.reviewObservationHandoffSourceReadinessResponseTraceMap,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath
      ?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath
      ?.sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageBoard,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief
      ?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief
      ?.sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
      ?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane
      ?.sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
      ?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
      ?.sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewLane,
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
      ?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage
      ?.sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis,
  );
  assert.equal(
    view.reviewObservationHandoffFollowUpReadinessBrief?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffFollowUpReadinessBrief
      ?.sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage,
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage,
  );
  assert.equal(view.reviewSurfaceIndex?.rows[0].localStatusLabel, "Local live mode");
  assert.equal(
    view.reviewWalkthroughPath?.steps[0].localStatusLabel,
    "Local live mode",
  );
  assert.equal(
    view.reviewObservationLens?.observationRows[0].localStatusLabel,
    "Local live mode",
  );
});

test("buildMissionConsoleView surfaces acknowledged alerts and lifecycle history", () => {
  const acknowledgedFixture = acknowledgeAlertInFixture(
    stage07ConsoleFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-23T04:10:00Z",
  );
  const view = buildMissionConsoleView(acknowledgedFixture, "thermal");

  assert.equal(view.mission.activeAlertCount, 2);
  assert.equal(view.mission.acknowledgedAlertCount, 1);
  assert.equal(
    view.alerts.find(
      (alert) => alert.alertId === "alert-stage06-thermal-avionics",
    )?.state,
    "acknowledged",
  );
  assert.equal(view.incident.timeline.at(-1)?.eventType, "alert.acknowledged");
  assert.ok(view.replay);
  assert.equal(view.replay?.markerCount, 6);
  assert.equal(view.replay?.timelineMarkers.at(-1)?.markerType, "alert.acknowledged");
});

test("buildMissionConsoleView surfaces resolved alerts and lifecycle history", () => {
  const acknowledgedFixture = acknowledgeAlertInFixture(
    stage07ConsoleFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-23T04:10:00Z",
  );
  const resolvedFixture = resolveAlertInFixture(
    acknowledgedFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-23T04:12:00Z",
  );
  const view = buildMissionConsoleView(resolvedFixture, "thermal");

  assert.equal(view.mission.activeAlertCount, 2);
  assert.equal(view.mission.acknowledgedAlertCount, 0);
  assert.equal(view.mission.resolvedAlertCount, 1);
  assert.equal(
    view.alerts.find(
      (alert) => alert.alertId === "alert-stage06-thermal-avionics",
    )?.state,
    "resolved",
  );
  assert.equal(view.incident.timeline.at(-1)?.eventType, "alert.resolved");
  assert.ok(view.replay);
  assert.equal(view.replay?.markerCount, 7);
  assert.equal(view.replay?.timelineMarkers.at(-1)?.markerType, "alert.resolved");
});

test("buildMissionConsoleView exposes the selected Stage 11 runbook playback state", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");

  assert.ok(view.runbook);
  assert.equal(view.runbook.selectedRunbookId, "thermal-alert-response-local");
  assert.equal(view.runbook.steps.length, 5);
  assert.equal(view.runbook.currentStepId, "acknowledge-alert");
  assert.equal(view.runbook.nextAction?.kind, "acknowledge_alert");
});

test("buildMissionConsoleView exposes the Stage 12 incident review packet", () => {
  const acknowledgedFixture = acknowledgeAlertInFixture(
    stage07ConsoleFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-26T04:30:00Z",
  );
  const resolvedFixture = resolveAlertInFixture(
    acknowledgedFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-26T04:32:00Z",
  );
  const view = buildMissionConsoleView(resolvedFixture, "thermal");

  assert.ok(view.incidentReviewPacket);
  assert.equal(view.incidentReviewPacket.readiness.status, "ready");
  assert.equal(view.incidentReviewPacket.eventHistory.relatedEventCount, 5);
  assert.equal(view.incidentReviewPacket.replayEvidence.relatedMarkerCount, 7);
});

test("buildMissionConsoleView exposes the Stage 12 evidence export payload", () => {
  const acknowledgedFixture = acknowledgeAlertInFixture(
    stage07ConsoleFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-26T04:30:00Z",
  );
  const resolvedFixture = resolveAlertInFixture(
    acknowledgedFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-26T04:32:00Z",
  );
  const view = buildMissionConsoleView(resolvedFixture, "thermal");

  assert.ok(view.incidentReviewExport);
  assert.equal(
    view.incidentReviewExport.schema,
    "telemforge.incident_review_export.v1",
  );
  assert.equal(view.incidentReviewExport.operatorActions.completeCount, 2);
  assert.equal(view.incidentReviewExport.unresolvedGaps.length, 0);
  assert.ok(view.incidentReviewExport.scopeNotes[0].includes("Local fixture export"));
});

test("buildMissionConsoleView selects a completed Stage 13 playback frame", () => {
  const acknowledgedFixture = acknowledgeAlertInFixture(
    stage07ConsoleFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-26T04:30:00Z",
  );
  const resolvedFixture = resolveAlertInFixture(
    acknowledgedFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-26T04:32:00Z",
  );
  const baselineView = buildMissionConsoleView(resolvedFixture, "thermal");
  const resolvedFrame = baselineView.replayPlayback?.frames.find(
    (frame) => frame.marker.markerType === "alert.resolved",
  );

  assert.ok(resolvedFrame);

  const selectedView = buildMissionConsoleView(
    resolvedFixture,
    "thermal",
    buildFixtureStreamConnection(resolvedFixture),
    undefined,
    resolvedFrame.frameId,
    "action:deferred-production-handoff-scope",
  );

  assert.ok(selectedView.replayPlayback);
  assert.equal(selectedView.replayPlayback.totalFrameCount, 7);
  assert.equal(
    selectedView.replayPlayback.currentFrame.marker.markerType,
    "alert.resolved",
  );
  assert.equal(
    selectedView.replayPlayback.currentFrame.runbookTarget?.stepId,
    "resolve-alert",
  );
  assert.equal(
    selectedView.replayPlayback.currentFrame.packetReference?.readinessStatus,
    "ready",
  );
  assert.equal(
    selectedView.replayPlayback.currentFrame.exportReference?.exportId,
    "incident-review-export:incident-review:tf-sat-01:thermal-alert-response-local",
  );
  assert.equal(
    selectedView.reviewBriefingBoard?.readinessStatus,
    "ready_for_handoff",
  );
  assert.equal(
    selectedView.reviewActionQueue?.readiness.verdict,
    "deferred_production_scope_only",
  );
  assert.equal(
    selectedView.reviewActionWalkthrough?.selectedActionId,
    "action:deferred-production-handoff-scope",
  );
  assert.equal(
    selectedView.reviewActionWalkthrough?.selectedAction.blocking,
    false,
  );
  assert.deepEqual(
    selectedView.reviewActionWalkthrough?.evidencePathRows.map((row) => row.target),
    ["review-decision-register"],
  );
  assert.equal(
    selectedView.reviewHandoffRehearsal?.readiness.verdict,
    "deferred_production_scope_only",
  );
  assert.equal(
    selectedView.reviewHandoffRehearsal?.unresolvedLocalBlockers.length,
    0,
  );
  assert.equal(
    selectedView.reviewHandoffCoverageMatrix?.readiness.verdict,
    "deferred_production_scope_only",
  );
  assert.equal(
    selectedView.reviewHandoffCoverageMatrix?.readiness.counts.totalRowCount,
    1,
  );
  assert.equal(
    selectedView.reviewHandoffCoverageMatrix?.unresolvedLocalBlockers.length,
    0,
  );
  assert.equal(
    selectedView.reviewGapTriage?.readiness.verdict,
    "deferred_production_only",
  );
  assert.equal(
    selectedView.reviewGapTriage?.nextPassItems[0].actionability,
    "deferred_non_actionable",
  );
  assert.equal(
    selectedView.reviewGapResolution?.readiness.verdict,
    "deferred_production_only",
  );
  assert.equal(
    selectedView.reviewGapResolution?.resolutionRows[0].actionability,
    "deferred_non_actionable",
  );
  assert.ok(
    selectedView.replayPlayback.scopeNotes.some((note) =>
      note.includes("does not persist saved reviewer sessions"),
    ),
  );
});

function readCsv(path: string): Array<Record<string, string>> {
  const [headerLine, ...lines] = readFileSync(path, "utf8").trim().split("\n");
  const headers = headerLine.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(
      headers.map((header, index) => [header, values[index]]),
    );
  });
}
