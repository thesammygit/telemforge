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
