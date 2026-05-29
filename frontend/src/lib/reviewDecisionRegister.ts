import type {
  IncidentReviewExportPayload,
  IncidentReviewPacketView,
  ReplayPlaybackFrameView,
  ReplayPlaybackView,
  ReviewDecisionRegisterView,
  ReviewDecisionStatus,
  ReviewDecisionView,
  ReviewHandoffChecklistItem,
  ScenarioRunbookPlaybackView,
} from "../features/mission-console/types.ts";

export function buildReviewDecisionRegister(
  replayPlayback: ReplayPlaybackView | undefined,
  runbook: ScenarioRunbookPlaybackView,
  incidentReviewPacket: IncidentReviewPacketView,
  incidentReviewExport: IncidentReviewExportPayload,
): ReviewDecisionRegisterView | undefined {
  if (!replayPlayback) {
    return undefined;
  }

  const anomalyFrame =
    replayPlayback.frames.find((frame) => frame.anomalyContext) ??
    replayPlayback.currentFrame;
  const lifecycleFrame = selectFrameByMarkerType(replayPlayback, [
    "alert.resolved",
    "alert.acknowledged",
    "alert.active",
    "alert.raised",
  ]);
  const exportFrame = selectFrameByMarkerType(replayPlayback, [
    "alert.resolved",
    "alert.acknowledged",
    "alert.active",
  ]);
  const packetReady = incidentReviewPacket.readiness.status === "ready";
  const exportReady =
    packetReady && incidentReviewExport.unresolvedGaps.length === 0;
  const runbookComplete =
    runbook.completedStepIds.length === runbook.steps.length &&
    runbook.steps.length > 0;

  const decisions: ReviewDecisionView[] = [
    {
      decisionId: "decision:thermal-anomaly-triage",
      status: anomalyFrame.anomalyContext ? "ready" : "follow_up",
      label: "Thermal anomaly context is reviewable",
      summary: anomalyFrame.anomalyContext
        ? `${anomalyFrame.anomalyContext.channelName} is tied to playback frame ${anomalyFrame.frameIndex}.`
        : "No playback frame currently carries anomaly context.",
      supportingEvidence: [
        playbackEvidence(anomalyFrame),
        {
          label: "Replay anomaly inspection",
          target: "replay-anomaly-inspection",
          source: "playback_frame",
          frameId: anomalyFrame.frameId,
          markerId: anomalyFrame.marker.markerId,
        },
      ],
      relatedPlaybackFrameId: anomalyFrame.frameId,
      followUpReason: anomalyFrame.anomalyContext
        ? null
        : "Capture replay anomaly context before handoff.",
      localOnlyScopeNotes: [
        "Decision is derived from local replay markers and anomaly rows.",
        "No production telemetry archive or cloud evidence service is introduced.",
      ],
    },
    {
      decisionId: "decision:alert-lifecycle-handoff",
      status: packetReady ? "ready" : "follow_up",
      label: packetReady
        ? "Alert lifecycle evidence is ready for handoff"
        : "Alert lifecycle needs local follow-up",
      summary: `${incidentReviewPacket.readiness.completedStepCount}/${incidentReviewPacket.readiness.totalStepCount} runbook steps complete with ${incidentReviewPacket.readiness.unresolvedGapCount} evidence gaps.`,
      supportingEvidence: [
        playbackEvidence(lifecycleFrame),
        {
          label: "Guided runbook playback",
          target: lifecycleFrame.runbookTarget?.evidenceTarget ?? "alert-lifecycle",
          source: "runbook",
        },
        {
          label: "Incident packet readiness",
          target: "incident-review-packet",
          source: "incident_packet",
        },
      ],
      relatedPlaybackFrameId: lifecycleFrame.frameId,
      followUpReason: packetReady
        ? null
        : evidenceGapReason(incidentReviewPacket) ??
          runbook.nextAction?.label ??
          "Complete the local runbook before handoff.",
      localOnlyScopeNotes: [
        "Lifecycle status is derived from local fixture/local-live state.",
        "No saved reviewer session, account identity, or ticket workflow is created.",
      ],
    },
    {
      decisionId: "decision:evidence-export-boundary",
      status: exportReady ? "ready" : "follow_up",
      label: exportReady
        ? "Evidence export can support local handoff"
        : "Evidence export waits on packet gaps",
      summary: `${incidentReviewExport.operatorActions.completeCount} complete actions, ${incidentReviewExport.operatorActions.pendingCount} pending actions, ${incidentReviewExport.unresolvedGaps.length} unresolved gaps.`,
      supportingEvidence: [
        playbackEvidence(exportFrame),
        {
          label: incidentReviewExport.exportId,
          target: "incident-review-packet",
          source: "evidence_export",
          path: "frontend/src/lib/incidentReviewPackets.ts",
        },
      ],
      relatedPlaybackFrameId: exportFrame.frameId,
      followUpReason: exportReady
        ? null
        : exportGapReason(incidentReviewExport) ??
          "Resolve packet gaps before treating the export as handoff-ready.",
      localOnlyScopeNotes: [
        "Export payload is deterministic and local-only.",
        "No file download system, report designer, or production evidence archive is introduced.",
      ],
    },
    {
      decisionId: "decision:production-handoff-scope",
      status: "deferred",
      label: "Production handoff integrations are deferred",
      summary:
        "Auth, collaboration identity, external ticketing, persistence, and deploy paths stay outside Stage 14.",
      supportingEvidence: [
        {
          label: "Stage 14 scope boundary",
          target: "review-decision-register",
          source: "scope_boundary",
          frameId: replayPlayback.currentFrame.frameId,
          path: "docs/development/steps/14-review-decision-register-and-handoff-checklist.md",
        },
      ],
      relatedPlaybackFrameId: replayPlayback.currentFrame.frameId,
      followUpReason:
        "Requires a separately approved production workflow stage before implementation.",
      localOnlyScopeNotes: [
        "This register is a deterministic local review aid.",
        "Production ownership, retention, identity, and external workflow integrations remain deferred.",
      ],
    },
  ];

  return {
    schema: "telemforge.review_decision_register.v1",
    version: 1,
    contractLabel: "local deterministic review decision register",
    localStatus: replayPlayback.localStatus,
    summary: {
      totalDecisionCount: decisions.length,
      readyCount: countDecisionStatus(decisions, "ready"),
      followUpCount: countDecisionStatus(decisions, "follow_up"),
      deferredCount: countDecisionStatus(decisions, "deferred"),
    },
    decisions,
    handoffChecklist: buildHandoffChecklist(
      incidentReviewPacket,
      incidentReviewExport,
      runbookComplete,
    ),
    scopeNotes: [
      "Review decisions are derived from playback, runbook, packet, and export evidence already present in local state.",
      "The register is deterministic in fixture mode and local-live compatible through the existing console state.",
      "Editable reviewer notes, saved sessions, external ticketing, and production handoff services remain deferred.",
    ],
  };
}

function selectFrameByMarkerType(
  playback: ReplayPlaybackView,
  markerTypes: string[],
): ReplayPlaybackFrameView {
  for (const markerType of markerTypes) {
    const frame = playback.frames.find(
      (candidate) => candidate.marker.markerType === markerType,
    );
    if (frame) {
      return frame;
    }
  }
  return playback.currentFrame;
}

function playbackEvidence(
  frame: ReplayPlaybackFrameView,
): ReviewDecisionView["supportingEvidence"][number] {
  return {
    label: `Frame ${frame.frameIndex}: ${frame.marker.markerType}`,
    target: "replay-playback-timeline",
    source: "playback_frame",
    frameId: frame.frameId,
    markerId: frame.marker.markerId,
  };
}

function evidenceGapReason(
  packet: IncidentReviewPacketView,
): string | null {
  if (!packet.evidenceGaps.length) {
    return null;
  }
  return packet.evidenceGaps.map((gap) => gap.summary).join(" ");
}

function exportGapReason(
  incidentReviewExport: IncidentReviewExportPayload,
): string | null {
  if (!incidentReviewExport.unresolvedGaps.length) {
    return null;
  }
  return incidentReviewExport.unresolvedGaps
    .map((gap) => gap.summary)
    .join(" ");
}

function countDecisionStatus(
  decisions: ReviewDecisionView[],
  status: ReviewDecisionStatus,
): number {
  return decisions.filter((decision) => decision.status === status).length;
}

function buildHandoffChecklist(
  packet: IncidentReviewPacketView,
  incidentReviewExport: IncidentReviewExportPayload,
  runbookComplete: boolean,
): ReviewHandoffChecklistItem[] {
  return [
    {
      itemId: "handoff:runbook-playback",
      label: "Runbook playback",
      status: runbookComplete ? "ready" : "follow_up",
      evidenceTarget: "alert-lifecycle",
      summary: runbookComplete
        ? "All local guided playback steps are complete."
        : "Complete the remaining local runbook steps.",
    },
    {
      itemId: "handoff:incident-packet",
      label: "Incident packet",
      status: packet.readiness.status === "ready" ? "ready" : "follow_up",
      evidenceTarget: "incident-review-packet",
      summary: `${packet.readiness.completedStepCount}/${packet.readiness.totalStepCount} steps, ${packet.readiness.unresolvedGapCount} gaps.`,
    },
    {
      itemId: "handoff:evidence-export",
      label: "Evidence export",
      status:
        incidentReviewExport.unresolvedGaps.length === 0 ? "ready" : "follow_up",
      evidenceTarget: "incident-review-packet",
      summary: `${incidentReviewExport.operatorActions.completeCount} complete actions, ${incidentReviewExport.unresolvedGaps.length} gaps.`,
    },
    {
      itemId: "handoff:production-integrations",
      label: "Production integrations",
      status: "deferred",
      evidenceTarget: "review-decision-register",
      summary: "Auth, persistence, ticketing, and deploy paths need a later stage.",
    },
  ];
}
