import { TrendSparkline } from "./TrendSparkline.tsx";
import type { MissionConsoleView, TelemetryStatus } from "./types.ts";

interface MissionConsoleProps {
  view: MissionConsoleView;
  onSelectSubsystem: (subsystemId: string) => void;
  onSelectRunbook: (runbookId: string) => void;
  onSelectReplayFrame: (frameId: string) => void;
  onSelectReviewAction: (actionId: string) => void;
  onAcknowledgeAlert: (alertId: string) => void;
  onResolveAlert: (alertId: string) => void;
}

const statusOrder: TelemetryStatus[] = [
  "critical",
  "warning",
  "nominal",
  "offline",
];

export function MissionConsole({
  view,
  onSelectSubsystem,
  onSelectRunbook,
  onSelectReplayFrame,
  onSelectReviewAction,
  onAcknowledgeAlert,
  onResolveAlert,
}: MissionConsoleProps) {
  const activeAlerts = view.alerts.filter((alert) => alert.state === "active");
  const acknowledgedAlerts = view.alerts.filter(
    (alert) => alert.state === "acknowledged",
  );
  const resolvedAlerts = view.alerts.filter((alert) => alert.state === "resolved");
  const playback = view.replayPlayback;
  const currentPlaybackFrame = playback?.currentFrame;
  const observationLens = view.reviewObservationLens;
  const observationCoverage = view.reviewObservationCoverage;
  const observationCitations = view.reviewObservationCitations;
  const observationBoundaryLedger = view.reviewObservationBoundaryLedger;
  const observationBoundaryWalkthrough =
    view.reviewObservationBoundaryWalkthrough;
  const observationStoryline = view.reviewObservationStoryline;
  const observationHandoffDeck = view.reviewObservationHandoffDeck;
  const observationHandoffCoverage = view.reviewObservationHandoffCoverage;
  const observationHandoffQuestions = view.reviewObservationHandoffQuestions;
  const observationHandoffAgenda = view.reviewObservationHandoffAgenda;
  const observationHandoffPath = view.reviewObservationHandoffPath;
  const observationHandoffDryRun = view.reviewObservationHandoffDryRun;
  const observationHandoffDebrief = view.reviewObservationHandoffDebrief;
  const observationHandoffContinuity =
    view.reviewObservationHandoffContinuity;
  const observationHandoffDriftGuard =
    view.reviewObservationHandoffDriftGuard;
  const observationHandoffCalibration =
    view.reviewObservationHandoffCalibration;
  const observationHandoffSynthesis =
    view.reviewObservationHandoffSynthesis;
  const observationCountSignalById = new Map(
    observationLens?.countSignals.map((signal) => [signal.signalId, signal]) ??
      [],
  );
  const observationDeferredSummaryById = new Map(
    observationLens?.deferredBoundarySummaries.map((summary) => [
      summary.summaryId,
      summary,
    ]) ?? [],
  );

  return (
    <main className="console-shell">
      <header className="console-header">
        <div>
          <p className="console-kicker">
            {view.stream.state === "fixture"
              ? "TelemForge Stage 07"
              : "TelemForge Stage 09"}
          </p>
          <h1>Replay And Anomaly Layer</h1>
          <p>{view.mission.description}</p>
        </div>
        <div className="header-state-stack">
          <div className={`mission-state status-${view.mission.healthState}`}>
            <span>{view.mission.healthState}</span>
            <strong>{view.mission.spacecraftId}</strong>
          </div>
          <div className={`stream-state stream-${view.stream.state}`}>
            <span>{view.stream.state}</span>
            <strong>{view.stream.label}</strong>
            <small>{view.stream.detail}</small>
          </div>
        </div>
      </header>

      <section className="overview-band" aria-label="Mission overview">
        <div>
          <span className="metric-label">Scenario</span>
          <strong>{view.mission.scenario}</strong>
        </div>
        <div>
          <span className="metric-label">Captured</span>
          <strong>{view.mission.capturedAt}</strong>
        </div>
        <div>
          <span className="metric-label">Active alerts</span>
          <strong>{view.mission.activeAlertCount}</strong>
        </div>
        <div>
          <span className="metric-label">Acknowledged alerts</span>
          <strong>{view.mission.acknowledgedAlertCount}</strong>
        </div>
        <div>
          <span className="metric-label">Resolved alerts</span>
          <strong>{view.mission.resolvedAlertCount}</strong>
        </div>
        <div>
          <span className="metric-label">Active faults</span>
          <strong>{view.mission.activeFaultCount}</strong>
        </div>
        <div>
          <span className="metric-label">Telemetry source</span>
          <strong>{view.mission.sourceLabel}</strong>
        </div>
      </section>

      <section className="status-counts" aria-label="Telemetry status counts">
        {statusOrder.map((status) => (
          <div key={status} className="status-count">
            <span className={`status-dot status-${status}`} />
            <span>{status}</span>
            <strong>{view.mission.statusCounts[status]}</strong>
          </div>
        ))}
      </section>

      {view.runbook ? (
        <section className="runbook-section" aria-label="Guided scenario runbook">
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 11 guided playback</span>
              <h2>{view.runbook.title}</h2>
            </div>
            <span className="event-time">{view.runbook.mode}</span>
          </div>
          <div className="runbook-layout">
            <div className="runbook-selector" aria-label="Scenario runbooks">
              {view.runbook.availableRunbooks.map((runbook) => (
                <button
                  key={runbook.runbookId}
                  className={
                    runbook.runbookId === view.runbook.selectedRunbookId
                      ? "runbook-choice selected"
                      : "runbook-choice"
                  }
                  type="button"
                  onClick={() => onSelectRunbook(runbook.runbookId)}
                >
                  <span>{runbook.mode}</span>
                  <strong>{runbook.title}</strong>
                </button>
              ))}
            </div>
            <div className="runbook-progress">
              <div className="runbook-next-action">
                <span className="metric-label">Next action</span>
                <strong>{view.runbook.nextAction?.label ?? "No action available"}</strong>
              </div>
              <div className="runbook-step-list">
                {view.runbook.steps.map((step, index) => (
                  <article
                    key={step.stepId}
                    className={`runbook-step runbook-step-${step.status}`}
                  >
                    <span className="runbook-step-index">{index + 1}</span>
                    <div>
                      <span className="event-type">{step.status}</span>
                      <h3>{step.title}</h3>
                      <p>{step.summary}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="runbook-evidence">
                {view.runbook.evidenceLinks.map((link) => (
                  <a
                    key={link.target}
                    className={`runbook-evidence-link evidence-${link.state}`}
                    href={`#${link.target}`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {view.incidentReviewPacket ? (
        <section
          className="incident-packet-section"
          aria-label="Incident review packet"
        >
          <a id="incident-review-packet" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 12 incident packet</span>
              <h2>{view.incidentReviewPacket.title}</h2>
            </div>
            <span
              className={`status-chip packet-status-${view.incidentReviewPacket.readiness.status}`}
            >
              {view.incidentReviewPacket.readiness.status.replace("_", " ")}
            </span>
          </div>
          <div className="packet-summary-grid">
            <div>
              <span className="metric-label">Runbook steps</span>
              <strong>
                {view.incidentReviewPacket.readiness.completedStepCount}/
                {view.incidentReviewPacket.readiness.totalStepCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Alert state</span>
              <strong>{view.incidentReviewPacket.alertLifecycle.state}</strong>
            </div>
            <div>
              <span className="metric-label">Related events</span>
              <strong>{view.incidentReviewPacket.eventHistory.relatedEventCount}</strong>
            </div>
            <div>
              <span className="metric-label">Replay markers</span>
              <strong>
                {view.incidentReviewPacket.replayEvidence.relatedMarkerCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Evidence gaps</span>
              <strong>
                {view.incidentReviewPacket.readiness.unresolvedGapCount}
              </strong>
            </div>
          </div>
          <div className="packet-detail-grid">
            <div className="packet-panel">
              <span className="metric-label">Operator actions</span>
              {view.incidentReviewPacket.operatorActions.map((action) => (
                <article key={action.actionKind} className="packet-action-row">
                  <span className={`status-dot packet-action-${action.status}`} />
                  <div>
                    <strong>{action.actionKind.replace("_", " ")}</strong>
                    <p>
                      {action.status === "complete"
                        ? `${action.actor ?? "operator"} at ${action.timestamp}`
                        : "Pending local operator action"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <div className="packet-panel">
              <span className="metric-label">Replay evidence</span>
              <p className="packet-marker-types">
                {view.incidentReviewPacket.replayEvidence.markerTypes.join(", ") ||
                  "No related markers"}
              </p>
              <p className="packet-meta-line">
                {view.incidentReviewPacket.replayEvidence.sampleCount} samples,{" "}
                {view.incidentReviewPacket.replayEvidence.anomalyCount} anomalies
              </p>
            </div>
            <div className="packet-panel">
              <span className="metric-label">Unresolved gaps</span>
              {view.incidentReviewPacket.evidenceGaps.length ? (
                <ul className="packet-gap-list">
                  {view.incidentReviewPacket.evidenceGaps.map((gap) => (
                    <li key={gap.gapId}>{gap.summary}</li>
                  ))}
                </ul>
              ) : (
                <p className="packet-meta-line">No unresolved evidence gaps.</p>
              )}
            </div>
          </div>
          {view.incidentReviewExport ? (
            <div className="packet-export-panel">
              <div>
                <span className="metric-label">Local evidence export</span>
                <strong>{view.incidentReviewExport.exportId}</strong>
                <p className="packet-meta-line">
                  {view.incidentReviewExport.schema}
                </p>
              </div>
              <div className="packet-export-facts">
                <span>
                  {view.incidentReviewExport.operatorActions.completeCount} actions
                </span>
                <span>{view.incidentReviewExport.sourceRefs.length} sources</span>
                <span>
                  {view.incidentReviewExport.deferredFeatures.length} deferred
                </span>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {playback && currentPlaybackFrame ? (
        <section
          className="replay-playback-section"
          aria-label="Replay playback timeline"
        >
          <a id="replay-playback-timeline" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 13 playback</span>
              <h2>Local replay timeline</h2>
            </div>
            <span className={`status-chip playback-status-${playback.localStatus}`}>
              {playback.localStatus}
            </span>
          </div>
          <div className="playback-contract-row">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{playback.schema}</strong>
            </div>
            <div>
              <span className="metric-label">Selected timestamp</span>
              <strong>{playback.selectedTimestamp}</strong>
            </div>
            <div>
              <span className="metric-label">Frame</span>
              <strong>
                {playback.frameIndex}/{playback.totalFrameCount}
              </strong>
            </div>
          </div>
          <div className="playback-frame-strip" aria-label="Replay frames">
            {playback.frames.map((frame) => (
              <button
                key={frame.frameId}
                className={
                  frame.frameId === currentPlaybackFrame.frameId
                    ? "playback-frame-button selected"
                    : "playback-frame-button"
                }
                type="button"
                aria-pressed={frame.frameId === currentPlaybackFrame.frameId}
                onClick={() => onSelectReplayFrame(frame.frameId)}
              >
                <span>Frame {frame.frameIndex}</span>
                <strong>{frame.marker.markerType}</strong>
                <small>{frame.timestamp}</small>
              </button>
            ))}
          </div>
          <div className="playback-current-frame">
            <article className="playback-marker-panel">
              <div className="playback-marker-heading">
                <span
                  className={`status-dot status-${currentPlaybackFrame.marker.severity}`}
                />
                <div>
                  <span className="event-type">
                    {currentPlaybackFrame.marker.markerType}
                  </span>
                  <h3>{currentPlaybackFrame.marker.label}</h3>
                </div>
              </div>
              <p>{currentPlaybackFrame.marker.message}</p>
              {currentPlaybackFrame.marker.channelId ? (
                <strong>{currentPlaybackFrame.marker.channelId}</strong>
              ) : null}
            </article>
            <div className="playback-context-grid">
              <div className="playback-context-panel">
                <span className="metric-label">Related anomaly</span>
                {currentPlaybackFrame.anomalyContext ? (
                  <>
                    <strong>
                      {currentPlaybackFrame.anomalyContext.channelName}
                    </strong>
                    <p>
                      {currentPlaybackFrame.anomalyContext.observedValueLabel} /{" "}
                      {currentPlaybackFrame.anomalyContext.scoreLabel}
                    </p>
                    <p>{currentPlaybackFrame.anomalyContext.reason}</p>
                  </>
                ) : (
                  <p>No related anomaly context for this frame.</p>
                )}
              </div>
              <div className="playback-context-panel">
                <span className="metric-label">Runbook target</span>
                {currentPlaybackFrame.runbookTarget ? (
                  <>
                    <a href={`#${currentPlaybackFrame.runbookTarget.evidenceTarget}`}>
                      {currentPlaybackFrame.runbookTarget.title}
                    </a>
                    <p>
                      {currentPlaybackFrame.runbookTarget.stepStatus} /{" "}
                      {currentPlaybackFrame.runbookTarget.evidenceTarget}
                    </p>
                  </>
                ) : (
                  <p>No runbook target is available.</p>
                )}
              </div>
              <div className="playback-context-panel">
                <span className="metric-label">Packet/export reference</span>
                {currentPlaybackFrame.packetReference ? (
                  <>
                    <strong>
                      {currentPlaybackFrame.packetReference.readinessStatus.replace(
                        "_",
                        " ",
                      )}
                    </strong>
                    <p>{currentPlaybackFrame.packetReference.packetId}</p>
                    {currentPlaybackFrame.exportReference ? (
                      <p>{currentPlaybackFrame.exportReference.exportId}</p>
                    ) : null}
                  </>
                ) : (
                  <p>No packet reference is available.</p>
                )}
              </div>
            </div>
          </div>
          <div className="playback-scope-notes">
            {playback.scopeNotes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
        </section>
      ) : null}

      {view.reviewSurfaceIndex ? (
        <section
          className="review-surface-index-section"
          aria-label="Review surface index and local navigation map"
        >
          <a id="review-surface-index" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 30 surface index</span>
              <h2>Review surface index and local navigation map</h2>
            </div>
            <span
              className={`status-chip playback-status-${view.reviewSurfaceIndex.localStatus}`}
            >
              {view.reviewSurfaceIndex.localStatus}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewSurfaceIndex.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Surfaces</span>
              <strong>
                {view.reviewSurfaceIndex.summary.counts.totalSurfaceCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Groups</span>
              <strong>
                {view.reviewSurfaceIndex.summary.counts.workflowGroupCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Anchors</span>
              <strong>
                {view.reviewSurfaceIndex.summary.counts.localAnchorCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Deferred</span>
              <strong>
                {
                  view.reviewSurfaceIndex.summary.counts
                    .deferredBoundaryNoteCount
                }
              </strong>
            </div>
          </div>
          <div className="surface-index-layout">
            <div className="surface-index-row-list">
              {view.reviewSurfaceIndex.rows.map((row) => (
                <article
                  key={row.surfaceId}
                  className={`surface-index-row surface-index-row-${row.workflowGroup}`}
                >
                  <div className="surface-index-row-heading">
                    <div>
                      <span className="event-type">
                        Stage {row.stageNumber} ·{" "}
                        {row.workflowGroup.replace(/_/g, " ")}
                      </span>
                      <h3>{row.label}</h3>
                    </div>
                    <a className="surface-index-anchor" href={row.anchor.href}>
                      {row.anchor.anchorId}
                    </a>
                  </div>
                  <p>{row.summary}</p>
                  <div className="surface-index-label-strip">
                    <span>{row.sourceSchema}</span>
                    <span>{row.sourceContractLabel}</span>
                    <span>{row.localStatusLabel}</span>
                    <span>{row.statusLabel.replace(/_/g, " ")}</span>
                  </div>
                  <div className="surface-index-count-grid">
                    {row.sourceCounts.map((sourceCount) => (
                      <div
                        key={`${row.surfaceId}:${sourceCount.sourcePath}:${sourceCount.label}`}
                      >
                        <span className="metric-label">{sourceCount.label}</span>
                        <strong>{sourceCount.value}</strong>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className="surface-index-panel">
              <span className="metric-label">Workflow groups</span>
              <strong>{view.reviewSurfaceIndex.summary.label}</strong>
              <p>{view.reviewSurfaceIndex.summary.summary}</p>
              <div className="surface-index-nav-grid">
                {view.reviewSurfaceIndex.anchorReferences.map((anchor) => (
                  <a
                    key={anchor.anchorId}
                    className="surface-index-nav-chip"
                    href={anchor.href}
                  >
                    {anchor.label}
                  </a>
                ))}
              </div>
              <div className="surface-index-group-list">
                {view.reviewSurfaceIndex.workflowGroups.map((group) => (
                  <article key={group.groupId}>
                    <span className="event-type">
                      Group {group.order} ·{" "}
                      {group.workflowGroup.replace(/_/g, " ")}
                    </span>
                    <strong>{group.label}</strong>
                    <p>{group.summary}</p>
                    <div className="gap-reference-strip">
                      {group.anchorIds.map((anchorId) => (
                        <span key={`${group.groupId}:${anchorId}`}>
                          {anchorId}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <p>{view.reviewSurfaceIndex.staticBoundarySummary}</p>
              <div className="surface-index-deferred-list">
                {view.reviewSurfaceIndex.deferredBoundaryNotes.map((note) => (
                  <article key={note.noteId}>
                    <span className="event-type">
                      {note.actionability.replace(/_/g, " ")}
                    </span>
                    <strong>{note.label}</strong>
                    <p>{note.summary}</p>
                    <div className="gap-reference-strip">
                      {note.sourceAnchorIds.map((anchorId) => (
                        <span key={`${note.noteId}:${anchorId}`}>
                          {anchorId}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {view.reviewWalkthroughPath ? (
        <section
          className="review-walkthrough-path-section"
          aria-label="Review walkthrough path and static prompt deck"
        >
          <a id="review-walkthrough-path" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 31 walkthrough path</span>
              <h2>Review walkthrough path and static prompt deck</h2>
            </div>
            <span
              className={`status-chip playback-status-${view.reviewWalkthroughPath.localStatus}`}
            >
              {view.reviewWalkthroughPath.localStatus}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewWalkthroughPath.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Steps</span>
              <strong>
                {view.reviewWalkthroughPath.summary.counts.totalStepCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Prompt groups</span>
              <strong>
                {view.reviewWalkthroughPath.summary.counts.promptGroupCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Anchors</span>
              <strong>
                {view.reviewWalkthroughPath.summary.counts.localAnchorCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Deferred</span>
              <strong>
                {
                  view.reviewWalkthroughPath.summary.counts
                    .deferredBoundaryNoteCount
                }
              </strong>
            </div>
          </div>
          <div className="walkthrough-path-layout">
            <div className="walkthrough-path-step-list">
              {view.reviewWalkthroughPath.steps.map((step) => (
                <article
                  key={step.stepId}
                  className={`walkthrough-path-step walkthrough-path-step-${step.workflowGroup}`}
                >
                  <div className="surface-index-row-heading">
                    <div>
                      <span className="event-type">
                        Step {step.stepNumber} · Stage {step.sourceStageNumber} ·{" "}
                        {step.workflowGroup.replace(/_/g, " ")}
                      </span>
                      <h3>{step.label}</h3>
                    </div>
                    <a className="surface-index-anchor" href={step.anchor.href}>
                      {step.anchor.anchorId}
                    </a>
                  </div>
                  <p>{step.summary}</p>
                  <div className="surface-index-label-strip">
                    <span>{step.sourceSchema}</span>
                    <span>{step.sourceContractLabel}</span>
                    <span>{step.localStatusLabel}</span>
                    <span>{step.statusLabel.replace(/_/g, " ")}</span>
                  </div>
                  <div className="walkthrough-prompt-block">
                    <span className="metric-label">Static prompt</span>
                    <p>{step.staticInspectionPrompt}</p>
                    <span className="metric-label">Expected observation</span>
                    <p>{step.expectedObservation}</p>
                  </div>
                  <div className="surface-index-count-grid">
                    {step.usefulCounts.map((sourceCount) => (
                      <div
                        key={`${step.stepId}:${sourceCount.sourcePath}:${sourceCount.label}`}
                      >
                        <span className="metric-label">{sourceCount.label}</span>
                        <strong>{sourceCount.value}</strong>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className="walkthrough-path-panel">
              <span className="metric-label">Static prompt deck</span>
              <strong>{view.reviewWalkthroughPath.summary.label}</strong>
              <p>{view.reviewWalkthroughPath.summary.summary}</p>
              <div className="surface-index-nav-grid">
                {view.reviewWalkthroughPath.anchorReferences.map((anchor) => (
                  <a
                    key={anchor.anchorId}
                    className="surface-index-nav-chip"
                    href={anchor.href}
                  >
                    {anchor.label}
                  </a>
                ))}
              </div>
              <div className="walkthrough-prompt-group-list">
                {view.reviewWalkthroughPath.promptGroups.map((group) => (
                  <article key={group.promptGroupId}>
                    <span className="event-type">
                      Phase {group.order} ·{" "}
                      {group.workflowGroup.replace(/_/g, " ")}
                    </span>
                    <strong>{group.label}</strong>
                    <p>{group.staticInspectionPrompt}</p>
                    <p>{group.expectedObservation}</p>
                    <div className="surface-index-count-grid">
                      <div>
                        <span className="metric-label">Steps</span>
                        <strong>{group.localCounts.stepCount}</strong>
                      </div>
                      <div>
                        <span className="metric-label">Anchors</span>
                        <strong>{group.localCounts.anchorCount}</strong>
                      </div>
                      <div>
                        <span className="metric-label">Schemas</span>
                        <strong>{group.localCounts.sourceSchemaCount}</strong>
                      </div>
                      <div>
                        <span className="metric-label">Deferred</span>
                        <strong>{group.localCounts.deferredBoundaryCount}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <p>{view.reviewWalkthroughPath.staticBoundarySummary}</p>
              <div className="walkthrough-deferred-list">
                {view.reviewWalkthroughPath.deferredBoundaryNotes.map((note) => (
                  <article key={note.noteId}>
                    <span className="event-type">
                      {note.actionability.replace(/_/g, " ")}
                    </span>
                    <strong>{note.label}</strong>
                    <p>{note.summary}</p>
                    <div className="gap-reference-strip">
                      {note.sourceAnchorIds.map((anchorId) => (
                        <span key={`${note.noteId}:${anchorId}`}>
                          {anchorId}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {observationLens ? (
        <section
          className="review-observation-lens-section"
          aria-label="Review observation lens and static attention map"
        >
          <a id="review-observation-lens" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 32 observation lens</span>
              <h2>Review observation lens and static attention map</h2>
            </div>
            <span
              className={`status-chip playback-status-${observationLens.localStatus}`}
            >
              {observationLens.localStatus}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{observationLens.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Observations</span>
              <strong>
                {observationLens.summary.counts.totalObservationRowCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Attention groups</span>
              <strong>{observationLens.summary.counts.attentionGroupCount}</strong>
            </div>
            <div>
              <span className="metric-label">Count signals</span>
              <strong>{observationLens.summary.counts.countSignalCount}</strong>
            </div>
            <div>
              <span className="metric-label">Deferred</span>
              <strong>
                {
                  observationLens.summary.counts
                    .deferredBoundarySummaryCount
                }
              </strong>
            </div>
          </div>
          <div className="observation-lens-layout">
            <div className="observation-row-list">
              {observationLens.observationRows.map((row) => (
                <article
                  key={row.observationRowId}
                  className={`observation-row observation-row-${row.workflowGroup}`}
                >
                  <div className="surface-index-row-heading">
                    <div>
                      <span className="event-type">
                        Observation {row.observationNumber} · Stage{" "}
                        {row.sourceStageNumber} ·{" "}
                        {row.workflowGroup.replace(/_/g, " ")}
                      </span>
                      <h3>{row.label}</h3>
                    </div>
                    <a className="surface-index-anchor" href={row.anchor.href}>
                      {row.anchor.anchorId}
                    </a>
                  </div>
                  <p>{row.summary}</p>
                  <div className="surface-index-label-strip">
                    <span>{row.sourceSchema}</span>
                    <span>{row.sourceContractLabel}</span>
                    <span>{row.localStatusLabel}</span>
                    <span>{row.statusLabel.replace(/_/g, " ")}</span>
                  </div>
                  <div className="walkthrough-prompt-block">
                    <span className="metric-label">Expected observation</span>
                    <p>{row.staticExpectedObservation}</p>
                    <span className="metric-label">Attention</span>
                    <div className="surface-index-label-strip">
                      {row.attentionKinds.map((kind) => (
                        <span key={`${row.observationRowId}:${kind}`}>
                          {kind.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="surface-index-count-grid">
                    {row.countSignalIds.map((signalId) => {
                      const signal = observationCountSignalById.get(signalId);
                      return signal ? (
                        <div key={`${row.observationRowId}:${signal.signalId}`}>
                          <span className="metric-label">{signal.label}</span>
                          <strong>{signal.value}</strong>
                        </div>
                      ) : null;
                    })}
                  </div>
                  <div className="gap-reference-strip">
                    {row.deferredBoundarySummaryIds.map((summaryId) => {
                      const summary = observationDeferredSummaryById.get(summaryId);
                      return summary ? (
                        <span key={`${row.observationRowId}:${summary.summaryId}`}>
                          {summary.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </article>
              ))}
            </div>
            <aside className="observation-panel">
              <span className="metric-label">Static attention map</span>
              <strong>{observationLens.summary.label}</strong>
              <p>{observationLens.summary.summary}</p>
              <div className="surface-index-nav-grid">
                {observationLens.anchorReferences.map((anchor) => (
                  <a
                    key={anchor.anchorReferenceId}
                    className="surface-index-nav-chip"
                    href={anchor.href}
                  >
                    {anchor.label}
                  </a>
                ))}
              </div>
              <div className="observation-attention-list">
                {observationLens.attentionGroups.map((group) => (
                  <article key={group.attentionGroupId}>
                    <span className="event-type">
                      Attention {group.order} · {group.kind.replace(/_/g, " ")}
                    </span>
                    <strong>{group.label}</strong>
                    <p>{group.summary}</p>
                    <div className="surface-index-count-grid">
                      <div>
                        <span className="metric-label">Rows</span>
                        <strong>{group.observationRowIds.length}</strong>
                      </div>
                      <div>
                        <span className="metric-label">Anchors</span>
                        <strong>{group.anchorIds.length}</strong>
                      </div>
                      <div>
                        <span className="metric-label">Counts</span>
                        <strong>{group.countSignalIds.length}</strong>
                      </div>
                      <div>
                        <span className="metric-label">Deferred</span>
                        <strong>{group.deferredBoundarySummaryIds.length}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <p>{observationLens.staticAttentionSummary}</p>
              <div className="observation-boundary-list">
                {observationLens.deferredBoundarySummaries.map((summary) => (
                  <article key={summary.summaryId}>
                    <span className="event-type">
                      {summary.actionability.replace(/_/g, " ")}
                    </span>
                    <strong>{summary.label}</strong>
                    <p>{summary.summary}</p>
                    <div className="gap-reference-strip">
                      {summary.sourceAnchorIds.map((anchorId) => (
                        <span key={`${summary.summaryId}:${anchorId}`}>
                          {anchorId}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {observationCoverage ? (
        <section
          className="review-observation-coverage-section"
          aria-label="Review observation coverage matrix and static blind spot map"
        >
          <a id="review-observation-coverage" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 33 observation coverage</span>
              <h2>Observation coverage matrix and blind-spot map</h2>
            </div>
            <span
              className={`status-chip playback-status-${observationCoverage.localStatus}`}
            >
              {observationCoverage.localStatus}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{observationCoverage.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Phases</span>
              <strong>
                {observationCoverage.summary.counts.phaseCoverageRowCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Source stages</span>
              <strong>
                {observationCoverage.summary.counts.sourceStageCoverageRowCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Anchors</span>
              <strong>{observationCoverage.summary.counts.localAnchorCount}</strong>
            </div>
            <div>
              <span className="metric-label">Blind spots</span>
              <strong>{observationCoverage.summary.counts.blindSpotRowCount}</strong>
            </div>
          </div>
          <div className="observation-coverage-layout">
            <div className="observation-coverage-phase-list">
              {observationCoverage.phaseCoverageRows.map((row) => (
                <article
                  key={row.phaseRowId}
                  className={`observation-coverage-row observation-coverage-row-${row.workflowGroup}`}
                >
                  <div className="surface-index-row-heading">
                    <div>
                      <span className="event-type">
                        Phase {row.order} · {row.workflowGroup.replace(/_/g, " ")}
                      </span>
                      <h3>{row.label}</h3>
                    </div>
                    <strong>{row.observationRowIds.length} rows</strong>
                  </div>
                  <p>{row.summary}</p>
                  <div className="surface-index-label-strip">
                    {row.sourceStageNumbers.map((stageNumber) => (
                      <span key={`${row.phaseRowId}:${stageNumber}`}>
                        Stage {stageNumber}
                      </span>
                    ))}
                  </div>
                  <div className="surface-index-count-grid">
                    <div>
                      <span className="metric-label">Anchors</span>
                      <strong>{row.anchorIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Attention</span>
                      <strong>{row.attentionKinds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Counts</span>
                      <strong>{row.countSignalIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Deferred</span>
                      <strong>{row.deferredBoundarySummaryIds.length}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <aside className="observation-coverage-panel">
              <span className="metric-label">Coverage summary</span>
              <strong>{observationCoverage.summary.label}</strong>
              <p>{observationCoverage.summary.summary}</p>
              <div className="surface-index-count-grid">
                <div>
                  <span className="metric-label">Local hrefs</span>
                  <strong>{observationCoverage.anchorCoverage.localHrefCount}</strong>
                </div>
                <div>
                  <span className="metric-label">Count signals</span>
                  <strong>
                    {observationCoverage.countSignalCoverage.totalSignalCount}
                  </strong>
                </div>
                <div>
                  <span className="metric-label">Deferred boundaries</span>
                  <strong>
                    {
                      observationCoverage.deferredBoundaryCoverage
                        .totalBoundaryCount
                    }
                  </strong>
                </div>
                <div>
                  <span className="metric-label">Attention rows</span>
                  <strong>
                    {observationCoverage.summary.counts.attentionCoverageRowCount}
                  </strong>
                </div>
              </div>
              <div className="observation-coverage-source-list">
                {observationCoverage.sourceStageCoverageRows.map((row) => (
                  <article key={row.sourceStageRowId}>
                    <span className="event-type">
                      {row.workflowGroups.map((group) => group.replace(/_/g, " ")).join(", ")}
                    </span>
                    <strong>{row.label}</strong>
                    <p>{row.sourceContractLabels.join(", ")}</p>
                    <div className="gap-reference-strip">
                      {row.anchorIds.map((anchorId) => (
                        <a key={`${row.sourceStageRowId}:${anchorId}`} href={`#${anchorId}`}>
                          {anchorId}
                        </a>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <div className="observation-coverage-attention-list">
                {observationCoverage.attentionCoverageRows.map((row) => (
                  <article key={row.attentionCoverageRowId}>
                    <span className="event-type">
                      Attention {row.order} · {row.kind.replace(/_/g, " ")}
                    </span>
                    <strong>{row.label}</strong>
                    <p>{row.summary}</p>
                    <div className="surface-index-count-grid">
                      <div>
                        <span className="metric-label">Rows</span>
                        <strong>{row.observationRowIds.length}</strong>
                      </div>
                      <div>
                        <span className="metric-label">Anchors</span>
                        <strong>{row.anchorIds.length}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="observation-coverage-blind-spot-list">
                {observationCoverage.blindSpotRows.map((row) => (
                  <article key={row.blindSpotRowId}>
                    <span className="event-type">
                      {row.kind.replace(/_/g, " ")}
                    </span>
                    <strong>{row.label}</strong>
                    <p>{row.summary}</p>
                    <div className="gap-reference-strip">
                      {row.sourceDeferredBoundarySummaryIds.map((summaryId) => (
                        <span key={`${row.blindSpotRowId}:${summaryId}`}>
                          {summaryId.replace("review-observation-boundary:", "")}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <p>{observationCoverage.staticCoverageSummary}</p>
            </aside>
          </div>
        </section>
      ) : null}

      {observationCitations ? (
        <section
          className="review-observation-citation-section"
          aria-label="Review observation citation trail and local source map"
        >
          <a id="review-observation-citations" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 34 observation citations</span>
              <h2>Observation citation trail and local source map</h2>
            </div>
            <span
              className={`status-chip playback-status-${observationCitations.localStatus}`}
            >
              {observationCitations.localStatus}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{observationCitations.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Citation rows</span>
              <strong>
                {observationCitations.summary.counts.citationRowCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Source map</span>
              <strong>
                {observationCitations.summary.counts.sourceMapRowCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Count refs</span>
              <strong>
                {observationCitations.summary.counts.countSignalCitationCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Boundary refs</span>
              <strong>
                {
                  observationCitations.summary.counts
                    .deferredBoundaryCitationCount
                }
              </strong>
            </div>
          </div>
          <div className="observation-citation-layout">
            <div className="observation-citation-row-list">
              {observationCitations.citationRows.map((row) => (
                <article
                  key={row.citationRowId}
                  className={`observation-citation-row observation-citation-row-${row.workflowGroup}`}
                >
                  <div className="surface-index-row-heading">
                    <div>
                      <span className="event-type">
                        Citation {row.observationNumber} · Stage{" "}
                        {row.sourceStageNumber} ·{" "}
                        {row.workflowGroup.replace(/_/g, " ")}
                      </span>
                      <h3>{row.label}</h3>
                    </div>
                    <a
                      className="surface-index-anchor"
                      href={row.localAnchor.href}
                    >
                      {row.localAnchor.anchorId}
                    </a>
                  </div>
                  <p>{row.sourceContractLabel}</p>
                  <div className="surface-index-label-strip">
                    <span>{row.sourceSchema}</span>
                    <span>{row.sourceReferenceId}</span>
                    <span>{row.sourceCoveragePhaseRowId}</span>
                    <span>{row.sourceCoverageStageRowId}</span>
                  </div>
                  <div className="surface-index-count-grid">
                    <div>
                      <span className="metric-label">Count paths</span>
                      <strong>{row.countSignalSourcePaths.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Boundaries</span>
                      <strong>{row.deferredBoundarySummaryIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Local anchor</span>
                      <strong>{row.localAnchor.inPageOnly ? "in page" : "route"}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Executable</span>
                      <strong>{row.nonExecutable ? "no" : "yes"}</strong>
                    </div>
                  </div>
                  <div className="gap-reference-strip">
                    {row.countSignalSourcePaths.map((sourcePath) => (
                      <span key={`${row.citationRowId}:${sourcePath}`}>
                        {sourcePath}
                      </span>
                    ))}
                    {row.deferredBoundarySummaryIds.map((summaryId) => (
                      <span key={`${row.citationRowId}:${summaryId}`}>
                        {summaryId.replace("review-observation-boundary:", "")}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className="observation-citation-panel">
              <span className="metric-label">Citation summary</span>
              <strong>{observationCitations.summary.label}</strong>
              <p>{observationCitations.summary.summary}</p>
              <div className="observation-citation-source-list">
                {observationCitations.sourceMapRows.map((row) => (
                  <article key={row.sourceMapRowId}>
                    <span className="event-type">
                      {row.workflowGroups.map((group) => group.replace(/_/g, " ")).join(", ")}
                    </span>
                    <strong>{row.label}</strong>
                    <p>{row.sourceContractLabels.join(", ")}</p>
                    <div className="gap-reference-strip">
                      {row.anchorHrefs.map((href) => (
                        <a key={`${row.sourceMapRowId}:${href}`} href={href}>
                          {href.replace("#", "")}
                        </a>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <div className="observation-citation-phase-list">
                {observationCitations.phaseCitationGroups.map((group) => (
                  <article key={group.phaseCitationGroupId}>
                    <span className="event-type">
                      Phase {group.order} ·{" "}
                      {group.workflowGroup.replace(/_/g, " ")}
                    </span>
                    <strong>{group.label}</strong>
                    <div className="surface-index-count-grid">
                      <div>
                        <span className="metric-label">Rows</span>
                        <strong>{group.citationRowIds.length}</strong>
                      </div>
                      <div>
                        <span className="metric-label">Stages</span>
                        <strong>{group.sourceStageNumbers.length}</strong>
                      </div>
                      <div>
                        <span className="metric-label">Counts</span>
                        <strong>{group.countSignalCitationIds.length}</strong>
                      </div>
                      <div>
                        <span className="metric-label">Deferred</span>
                        <strong>{group.deferredBoundaryCitationIds.length}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="surface-index-nav-grid">
                {observationCitations.anchorCitationGroups.map((group) => (
                  <a
                    key={group.anchorCitationGroupId}
                    className="surface-index-nav-chip"
                    href={group.href}
                  >
                    {group.label}
                  </a>
                ))}
              </div>
              <div className="observation-citation-boundary-list">
                {observationCitations.deferredBoundaryCitations.map((citation) => (
                  <article key={citation.citationId}>
                    <span className="event-type">Deferred boundary citation</span>
                    <strong>{citation.label}</strong>
                    <p>{citation.summaryReference}</p>
                    <div className="gap-reference-strip">
                      {citation.sourceAnchorIds.map((anchorId) => (
                        <span key={`${citation.citationId}:${anchorId}`}>
                          {anchorId}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <div className="observation-citation-blind-spot-list">
                {observationCitations.blindSpotCitationNotes.map((note) => (
                  <article key={note.citationNoteId}>
                    <span className="event-type">
                      {note.kind.replace(/_/g, " ")}
                    </span>
                    <strong>{note.label}</strong>
                    <p>{note.summary}</p>
                  </article>
                ))}
              </div>
              <p>{observationCitations.staticCitationSummary}</p>
            </aside>
          </div>
        </section>
      ) : null}

      {observationBoundaryLedger ? (
        <section
          className="review-observation-boundary-ledger-section"
          aria-label="Review observation deferred-boundary ledger"
        >
          <a id="review-observation-boundary-ledger" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 35 boundary ledger</span>
              <h2>Deferred-boundary ledger and static non-goal map</h2>
            </div>
            <span
              className={`status-chip playback-status-${observationBoundaryLedger.localStatus}`}
            >
              {observationBoundaryLedger.localStatus}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{observationBoundaryLedger.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Boundary rows</span>
              <strong>
                {observationBoundaryLedger.summary.counts.boundaryRowCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Observation refs</span>
              <strong>
                {
                  observationBoundaryLedger.summary.counts
                    .observationReferenceGroupCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Anchor refs</span>
              <strong>
                {
                  observationBoundaryLedger.summary.counts
                    .anchorReferenceGroupCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Non-goals</span>
              <strong>
                {observationBoundaryLedger.summary.counts.staticNonGoalNoteCount}
              </strong>
            </div>
          </div>
          <div className="observation-boundary-ledger-layout">
            <div className="observation-boundary-ledger-row-list">
              {observationBoundaryLedger.boundaryRows.map((row) => (
                <article key={row.boundaryRowId}>
                  <div className="surface-index-row-heading">
                    <div>
                      <span className="event-type">
                        Deferred boundary · {row.sourceSummaryId.replace("review-observation-boundary:", "")}
                      </span>
                      <h3>{row.label}</h3>
                    </div>
                    <span className="score-pill">
                      {row.relatedObservationRowIds.length} obs
                    </span>
                  </div>
                  <p>{row.sourceSummary}</p>
                  <div className="surface-index-count-grid">
                    <div>
                      <span className="metric-label">Anchors</span>
                      <strong>{row.sourceAnchorIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Stages</span>
                      <strong>{row.relatedSourceStageNumbers.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Notes</span>
                      <strong>{row.staticNonGoalNoteIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Actionable</span>
                      <strong>{row.nonActionable ? "no" : "yes"}</strong>
                    </div>
                  </div>
                  <div className="gap-reference-strip">
                    {row.sourceAnchorHrefs.map((href) => (
                      <a key={`${row.boundaryRowId}:${href}`} href={href}>
                        {href.replace("#", "")}
                      </a>
                    ))}
                    {row.relatedSourceStageNumbers.map((stageNumber) => (
                      <span key={`${row.boundaryRowId}:stage:${stageNumber}`}>
                        Stage {stageNumber}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className="observation-boundary-ledger-panel">
              <span className="metric-label">Ledger summary</span>
              <strong>{observationBoundaryLedger.summary.label}</strong>
              <p>{observationBoundaryLedger.summary.summary}</p>
              <div className="observation-boundary-ledger-observation-list">
                {observationBoundaryLedger.observationReferenceGroups.map(
                  (group) => (
                    <article key={group.observationGroupId}>
                      <span className="event-type">
                        Observation {group.observationNumber} · Stage{" "}
                        {group.sourceStageNumber}
                      </span>
                      <strong>{group.label}</strong>
                      <div className="surface-index-count-grid">
                        <div>
                          <span className="metric-label">Boundaries</span>
                          <strong>{group.boundaryRowIds.length}</strong>
                        </div>
                        <div>
                          <span className="metric-label">Local anchor</span>
                          <strong>
                            {group.localAnchor.inPageOnly ? "in page" : "route"}
                          </strong>
                        </div>
                      </div>
                    </article>
                  ),
                )}
              </div>
              <div className="observation-boundary-ledger-anchor-list">
                {observationBoundaryLedger.anchorReferenceGroups.map((group) => (
                  <article key={group.anchorGroupId}>
                    <span className="event-type">Local anchor boundary</span>
                    <strong>{group.label}</strong>
                    <div className="gap-reference-strip">
                      <a href={group.href}>{group.anchorId}</a>
                      {group.relatedSourceStageNumbers.map((stageNumber) => (
                        <span key={`${group.anchorGroupId}:${stageNumber}`}>
                          Stage {stageNumber}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <div className="observation-boundary-ledger-source-list">
                {observationBoundaryLedger.sourceStageBoundaryGroups.map(
                  (group) => (
                    <article key={group.sourceStageGroupId}>
                      <span className="event-type">Source-stage boundary</span>
                      <strong>{group.label}</strong>
                      <p>{group.sourceContractLabels.join(", ")}</p>
                    </article>
                  ),
                )}
              </div>
              <div className="observation-boundary-ledger-non-goal-list">
                {observationBoundaryLedger.staticNonGoalNotes.map((note) => (
                  <article key={note.nonGoalNoteId}>
                    <span className="event-type">
                      {note.kind.replace(/_/g, " ")}
                    </span>
                    <strong>{note.label}</strong>
                    <p>{note.summary}</p>
                  </article>
                ))}
              </div>
              <p>{observationBoundaryLedger.staticBoundarySummary}</p>
            </aside>
          </div>
        </section>
      ) : null}

      {observationBoundaryWalkthrough ? (
        <section
          className="review-observation-boundary-walkthrough-section"
          aria-label="Review observation boundary walkthrough"
        >
          <a
            id="review-observation-boundary-walkthrough"
            className="section-anchor"
          />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 36 boundary walkthrough</span>
              <h2>Boundary source path and static guardrails</h2>
            </div>
            <span
              className={`status-chip playback-status-${observationBoundaryWalkthrough.localStatus}`}
            >
              {observationBoundaryWalkthrough.localStatus}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{observationBoundaryWalkthrough.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Steps</span>
              <strong>
                {observationBoundaryWalkthrough.summary.counts.boundaryStepCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Source paths</span>
              <strong>
                {
                  observationBoundaryWalkthrough.summary.counts
                    .sourcePathGroupCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Guardrails</span>
              <strong>
                {
                  observationBoundaryWalkthrough.summary.counts
                    .staticGuardrailGroupCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Default focus</span>
              <strong>
                {observationBoundaryWalkthrough.defaultFocus.sourceSummaryId.replace(
                  "review-observation-boundary:",
                  "",
                )}
              </strong>
            </div>
          </div>
          <div className="observation-boundary-walkthrough-layout">
            <div className="observation-boundary-walkthrough-step-list">
              {observationBoundaryWalkthrough.steps.map((step) => (
                <article key={step.stepId}>
                  <div className="surface-index-row-heading">
                    <div>
                      <span className="event-type">
                        Step {step.stepNumber} ·{" "}
                        {step.sourceSummaryId.replace(
                          "review-observation-boundary:",
                          "",
                        )}
                      </span>
                      <h3>{step.label}</h3>
                    </div>
                    <span className="score-pill">
                      {step.relatedObservationRowIds.length} obs
                    </span>
                  </div>
                  <p>{step.sourceSummary}</p>
                  <div className="surface-index-count-grid">
                    <div>
                      <span className="metric-label">Anchors</span>
                      <strong>{step.sourceAnchorHrefs.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Stages</span>
                      <strong>{step.relatedSourceStageNumbers.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Source paths</span>
                      <strong>{step.sourcePathGroupIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Guardrails</span>
                      <strong>{step.staticGuardrailGroupIds.length}</strong>
                    </div>
                  </div>
                  <div className="gap-reference-strip">
                    {step.sourceAnchorHrefs.map((href) => (
                      <a key={`${step.stepId}:${href}`} href={href}>
                        {href.replace("#", "")}
                      </a>
                    ))}
                    {step.relatedSourceStageNumbers.map((stageNumber) => (
                      <span key={`${step.stepId}:stage:${stageNumber}`}>
                        Stage {stageNumber}
                      </span>
                    ))}
                    {step.staticNonGoalNoteIds.map((noteId) => (
                      <span key={`${step.stepId}:${noteId}`}>
                        {noteId.replace(
                          "review-observation-boundary-non-goal:",
                          "",
                        )}
                      </span>
                    ))}
                  </div>
                  {step.staticNonGoalContexts.length ? (
                    <div className="observation-boundary-walkthrough-context-list">
                      {step.staticNonGoalContexts.map((context) => (
                        <div key={`${step.stepId}:${context.nonGoalNoteId}`}>
                          <span className="event-type">
                            {context.kind.replace(/_/g, " ")}
                          </span>
                          <strong>{context.label}</strong>
                          <p>{context.summary}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
            <aside className="observation-boundary-walkthrough-panel">
              <span className="metric-label">Default source path</span>
              <strong>{observationBoundaryWalkthrough.defaultFocus.label}</strong>
              <p>{observationBoundaryWalkthrough.defaultFocus.summary}</p>
              <div className="observation-boundary-walkthrough-source-list">
                {observationBoundaryWalkthrough.sourcePathGroups.map((group) => (
                  <article key={group.sourcePathGroupId}>
                    <span className="event-type">
                      Source Stage {group.sourceStageNumber}
                    </span>
                    <strong>{group.label}</strong>
                    <p>{group.sourceContractLabels.join(", ")}</p>
                    <div className="gap-reference-strip">
                      {group.anchorHrefs.map((href) => (
                        <a key={`${group.sourcePathGroupId}:${href}`} href={href}>
                          {href.replace("#", "")}
                        </a>
                      ))}
                      <span>{group.boundaryStepIds.length} steps</span>
                    </div>
                  </article>
                ))}
              </div>
              <div className="observation-boundary-walkthrough-guardrail-list">
                {observationBoundaryWalkthrough.staticGuardrailGroups.map(
                  (group) => (
                    <article key={group.guardrailGroupId}>
                      <span className="event-type">
                        {group.kind.replace(/_/g, " ")}
                      </span>
                      <strong>{group.label}</strong>
                      <p>{group.summary}</p>
                    </article>
                  ),
                )}
              </div>
              <p>{observationBoundaryWalkthrough.staticWalkthroughSummary}</p>
            </aside>
          </div>
        </section>
      ) : null}

      {observationStoryline ? (
        <section
          className="review-observation-storyline-section"
          aria-label="Review observation storyline"
        >
          <a id="review-observation-storyline" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 37 observation storyline</span>
              <h2>Static evidence path and prior surfaces</h2>
            </div>
            <span
              className={`status-chip playback-status-${observationStoryline.localStatus}`}
            >
              {observationStoryline.localStatus}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{observationStoryline.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Segments</span>
              <strong>
                {observationStoryline.summary.counts.storylineSegmentCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Source stages</span>
              <strong>
                {
                  observationStoryline.summary.counts
                    .sourceStageEvidenceGroupCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Guardrails</span>
              <strong>
                {
                  observationStoryline.summary.counts
                    .staticGuardrailReferenceCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Opening</span>
              <strong>
                {observationStoryline.defaultOpening.sourceSummaryId.replace(
                  "review-observation-boundary:",
                  "",
                )}
              </strong>
            </div>
          </div>
          <div className="observation-storyline-layout">
            <div className="observation-storyline-segment-list">
              {observationStoryline.segments.map((segment) => (
                <article key={segment.segmentId}>
                  <div className="surface-index-row-heading">
                    <div>
                      <span className="event-type">
                        Segment {segment.segmentNumber} ·{" "}
                        {segment.sourceSummaryId.replace(
                          "review-observation-boundary:",
                          "",
                        )}
                      </span>
                      <h3>{segment.label}</h3>
                    </div>
                    <span className="score-pill">
                      {segment.priorSurfaceReferences.length} refs
                    </span>
                  </div>
                  <p>{segment.sourceSummary}</p>
                  <div className="surface-index-count-grid">
                    <div>
                      <span className="metric-label">Anchors</span>
                      <strong>{segment.sourceAnchorHrefs.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Observations</span>
                      <strong>{segment.relatedObservationRowIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Stages</span>
                      <strong>{segment.relatedSourceStageNumbers.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Guardrails</span>
                      <strong>{segment.staticGuardrailReferenceIds.length}</strong>
                    </div>
                  </div>
                  <div className="gap-reference-strip">
                    {segment.sourceAnchorHrefs.map((href) => (
                      <a key={`${segment.segmentId}:${href}`} href={href}>
                        {href.replace("#", "")}
                      </a>
                    ))}
                    {segment.relatedSourceStageNumbers.map((stageNumber) => (
                      <span key={`${segment.segmentId}:stage:${stageNumber}`}>
                        Stage {stageNumber}
                      </span>
                    ))}
                    {segment.priorSurfaceReferences.map((reference) => (
                      <a
                        key={reference.referenceId}
                        href={reference.anchorHref}
                      >
                        Stage {reference.sourceStageNumber}
                      </a>
                    ))}
                  </div>
                  {segment.staticNonGoalContexts.length ? (
                    <div className="observation-storyline-context-list">
                      {segment.staticNonGoalContexts.map((context) => (
                        <div key={`${segment.segmentId}:${context.nonGoalNoteId}`}>
                          <span className="event-type">
                            {context.kind.replace(/_/g, " ")}
                          </span>
                          <strong>{context.label}</strong>
                          <p>{context.summary}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
            <aside className="observation-storyline-panel">
              <span className="metric-label">Opening context</span>
              <strong>{observationStoryline.defaultOpening.label}</strong>
              <p>{observationStoryline.defaultOpening.summary}</p>
              <div className="observation-storyline-source-list">
                {observationStoryline.sourceStageEvidenceGroups.map((group) => (
                  <article key={group.evidenceGroupId}>
                    <span className="event-type">
                      Source Stage {group.sourceStageNumber}
                    </span>
                    <strong>{group.label}</strong>
                    <p>{group.sourceContractLabels.join(", ")}</p>
                    <div className="gap-reference-strip">
                      {group.sourceAnchorHrefs.map((href) => (
                        <a key={`${group.evidenceGroupId}:${href}`} href={href}>
                          {href.replace("#", "")}
                        </a>
                      ))}
                      <span>{group.segmentIds.length} segments</span>
                    </div>
                  </article>
                ))}
              </div>
              <div className="observation-storyline-guardrail-list">
                {observationStoryline.staticGuardrailReferences.map(
                  (reference) => (
                    <article key={reference.guardrailReferenceId}>
                      <span className="event-type">
                        {reference.kind.replace(/_/g, " ")}
                      </span>
                      <strong>{reference.label}</strong>
                      <p>{reference.summary}</p>
                    </article>
                  ),
                )}
              </div>
              <p>{observationStoryline.staticStorylineSummary}</p>
            </aside>
          </div>
        </section>
      ) : null}

      {observationHandoffDeck ? (
        <section
          className="review-observation-handoff-deck-section"
          aria-label="Review observation handoff deck"
        >
          <a id="review-observation-handoff-deck" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 38 observation handoff deck</span>
              <h2>Static review path and handoff cards</h2>
            </div>
            <span
              className={`status-chip playback-status-${observationHandoffDeck.localStatus}`}
            >
              {observationHandoffDeck.localStatus}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{observationHandoffDeck.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Cards</span>
              <strong>
                {observationHandoffDeck.summary.counts.handoffCardCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Checkpoints</span>
              <strong>
                {
                  observationHandoffDeck.summary.counts
                    .reviewPathCheckpointCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Prompts</span>
              <strong>
                {
                  observationHandoffDeck.summary.counts
                    .sourceStagePromptCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Opening</span>
              <strong>
                {observationHandoffDeck.defaultReviewContext.sourceSummaryId.replace(
                  "review-observation-boundary:",
                  "",
                )}
              </strong>
            </div>
          </div>
          <div className="observation-handoff-deck-layout">
            <div className="observation-handoff-card-list">
              {observationHandoffDeck.cards.map((card) => (
                <article key={card.cardId}>
                  <div className="surface-index-row-heading">
                    <div>
                      <span className="event-type">
                        Card {card.cardNumber} ·{" "}
                        {card.sourceSummaryId.replace(
                          "review-observation-boundary:",
                          "",
                        )}
                      </span>
                      <h3>{card.label}</h3>
                    </div>
                    <span className="score-pill">
                      {card.sourceStagePromptIds.length} prompts
                    </span>
                  </div>
                  <p>{card.sourceSummary}</p>
                  <div className="surface-index-count-grid">
                    <div>
                      <span className="metric-label">Anchors</span>
                      <strong>{card.localAnchorHrefs.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Observations</span>
                      <strong>{card.relatedObservationRowIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Stages</span>
                      <strong>{card.relatedSourceStageNumbers.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Reminders</span>
                      <strong>{card.guardrailReminderIds.length}</strong>
                    </div>
                  </div>
                  <div className="gap-reference-strip">
                    {card.localAnchorHrefs.map((href) => (
                      <a key={`${card.cardId}:${href}`} href={href}>
                        {href.replace("#", "")}
                      </a>
                    ))}
                    {card.relatedSourceStageNumbers.map((stageNumber) => (
                      <span key={`${card.cardId}:stage:${stageNumber}`}>
                        Stage {stageNumber}
                      </span>
                    ))}
                    <span>{card.priorSurfacePromptIds.length} prior refs</span>
                  </div>
                  {card.staticNonGoalContexts.length ? (
                    <div className="observation-handoff-context-list">
                      {card.staticNonGoalContexts.map((context) => (
                        <div key={`${card.cardId}:${context.nonGoalNoteId}`}>
                          <span className="event-type">
                            {context.kind.replace(/_/g, " ")}
                          </span>
                          <strong>{context.label}</strong>
                          <p>{context.summary}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
            <aside className="observation-handoff-deck-panel">
              <span className="metric-label">Default review context</span>
              <strong>{observationHandoffDeck.defaultReviewContext.label}</strong>
              <p>{observationHandoffDeck.defaultReviewContext.summary}</p>
              <div className="observation-handoff-checkpoint-list">
                {observationHandoffDeck.reviewPathCheckpoints.map(
                  (checkpoint) => (
                    <article key={checkpoint.checkpointId}>
                      <span className="event-type">
                        {checkpoint.relatedObservationRowIds.length} observations
                      </span>
                      <strong>{checkpoint.label}</strong>
                      <p>{checkpoint.summary}</p>
                    </article>
                  ),
                )}
              </div>
              <div className="observation-handoff-source-prompt-list">
                {observationHandoffDeck.sourceStagePrompts.map((prompt) => (
                  <article key={prompt.promptId}>
                    <span className="event-type">
                      Source Stage {prompt.sourceStageNumber}
                    </span>
                    <strong>{prompt.label}</strong>
                    <p>{prompt.prompt}</p>
                    <div className="gap-reference-strip">
                      {prompt.sourceAnchorHrefs.map((href) => (
                        <a key={`${prompt.promptId}:${href}`} href={href}>
                          {href.replace("#", "")}
                        </a>
                      ))}
                      <span>{prompt.segmentIds.length} cards</span>
                    </div>
                  </article>
                ))}
              </div>
              <div className="observation-handoff-guardrail-list">
                {observationHandoffDeck.guardrailReminders.map((reminder) => (
                  <article key={reminder.reminderId}>
                    <span className="event-type">
                      {reminder.kind.replace(/_/g, " ")}
                    </span>
                    <strong>{reminder.label}</strong>
                    <p>{reminder.reminder}</p>
                  </article>
                ))}
              </div>
              <div className="observation-handoff-prior-surface-list">
                {observationHandoffDeck.priorSurfacePrompts.map((prompt) => (
                  <article key={prompt.promptId}>
                    <span className="event-type">
                      Stage {prompt.sourceStageNumber}
                    </span>
                    <strong>{prompt.label}</strong>
                    <p>{prompt.prompt}</p>
                    <a href={prompt.anchorHref}>
                      {prompt.anchorHref.replace("#", "")}
                    </a>
                  </article>
                ))}
              </div>
              <p>{observationHandoffDeck.staticHandoffSummary}</p>
            </aside>
          </div>
        </section>
      ) : null}

      {observationHandoffCoverage ? (
        <section
          className="review-observation-handoff-coverage-section"
          aria-label="Review observation handoff coverage"
        >
          <a
            id="review-observation-handoff-coverage"
            className="section-anchor"
          />
          <div className="section-heading">
            <div>
              <span className="metric-label">
                Stage 39 observation handoff coverage
              </span>
              <h2>Static gap map and source coverage</h2>
            </div>
            <span
              className={`status-chip playback-status-${observationHandoffCoverage.localStatus}`}
            >
              {observationHandoffCoverage.localStatus}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{observationHandoffCoverage.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Rows</span>
              <strong>
                {observationHandoffCoverage.summary.counts.coverageRowCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Gap notes</span>
              <strong>
                {observationHandoffCoverage.summary.counts.staticGapNoteCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Source groups</span>
              <strong>
                {
                  observationHandoffCoverage.summary.counts
                    .sourceCoverageGroupCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Deferred reminders</span>
              <strong>
                {
                  observationHandoffCoverage.summary.counts
                    .deferredScopeReminderCount
                }
              </strong>
            </div>
          </div>
          <div className="observation-handoff-coverage-layout">
            <div className="observation-handoff-coverage-row-list">
              {observationHandoffCoverage.coverageRows.map((row) => (
                <article key={row.coverageRowId}>
                  <div className="surface-index-row-heading">
                    <div>
                      <span className="event-type">
                        Coverage {row.rowNumber} ·{" "}
                        {row.sourceSummaryCoverage.sourceSummaryId.replace(
                          "review-observation-boundary:",
                          "",
                        )}
                      </span>
                      <h3>{row.label}</h3>
                    </div>
                    <span className="score-pill">
                      {row.staticGapNoteIds.length} gap note
                    </span>
                  </div>
                  <p>{row.sourceSummaryCoverage.sourceSummary}</p>
                  <div className="surface-index-count-grid">
                    <div>
                      <span className="metric-label">Anchors</span>
                      <strong>{row.localAnchorHrefs.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Observations</span>
                      <strong>{row.relatedObservationRowIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Prompts</span>
                      <strong>{row.sourceStagePromptIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Deferred</span>
                      <strong>{row.deferredScopeReminderIds.length}</strong>
                    </div>
                  </div>
                  <div className="gap-reference-strip">
                    {row.localAnchorHrefs.map((href) => (
                      <a key={`${row.coverageRowId}:${href}`} href={href}>
                        {href.replace("#", "")}
                      </a>
                    ))}
                    <span>{row.guardrailReminderIds.length} guardrails</span>
                    <span>{row.priorSurfacePromptIds.length} prior refs</span>
                  </div>
                  {row.staticNonGoalContexts.length ? (
                    <div className="observation-handoff-coverage-context-list">
                      {row.staticNonGoalContexts.map((context) => (
                        <div key={`${row.coverageRowId}:${context.nonGoalNoteId}`}>
                          <span className="event-type">
                            {context.kind.replace(/_/g, " ")}
                          </span>
                          <strong>{context.label}</strong>
                          <p>{context.summary}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
            <aside className="observation-handoff-coverage-panel">
              <span className="metric-label">Default coverage row</span>
              <strong>{observationHandoffCoverage.defaultCoverageRow.label}</strong>
              <p>{observationHandoffCoverage.summary.summary}</p>
              <div className="observation-handoff-gap-note-list">
                {observationHandoffCoverage.staticGapNotes.map((note) => (
                  <article key={note.gapNoteId}>
                    <span className="event-type">
                      {note.relatedObservationRowIds.length} observations
                    </span>
                    <strong>{note.label}</strong>
                    <p>{note.summary}</p>
                  </article>
                ))}
              </div>
              <div className="observation-handoff-source-coverage-list">
                {observationHandoffCoverage.sourceCoverageGroups.map((group) => (
                  <article key={group.sourceCoverageGroupId}>
                    <span className="event-type">
                      Source Stage {group.sourceStageNumber}
                    </span>
                    <strong>{group.label}</strong>
                    <p>{group.summary}</p>
                    <div className="gap-reference-strip">
                      {group.sourceAnchorHrefs.map((href) => (
                        <a
                          key={`${group.sourceCoverageGroupId}:${href}`}
                          href={href}
                        >
                          {href.replace("#", "")}
                        </a>
                      ))}
                      <span>{group.coverageRowIds.length} rows</span>
                    </div>
                  </article>
                ))}
              </div>
              <div className="observation-handoff-deferred-scope-list">
                {observationHandoffCoverage.deferredScopeReminders.map(
                  (reminder) => (
                    <article key={reminder.reminderId}>
                      <span className="event-type">
                        {reminder.kind.replace(/_/g, " ")}
                      </span>
                      <strong>{reminder.label}</strong>
                      <p>{reminder.summary}</p>
                    </article>
                  ),
                )}
              </div>
              <p>{observationHandoffCoverage.staticCoverageSummary}</p>
            </aside>
          </div>
        </section>
      ) : null}

      {observationHandoffQuestions ? (
        <section
          className="review-observation-handoff-questions-section"
          aria-label="Review observation handoff questions"
        >
          <a
            id="review-observation-handoff-questions"
            className="section-anchor"
          />
          <div className="section-heading">
            <div>
              <span className="metric-label">
                Stage 40 observation handoff questions
              </span>
              <h2>Static prompt rail and manual review questions</h2>
            </div>
            <span
              className={`status-chip playback-status-${observationHandoffQuestions.localStatus}`}
            >
              {observationHandoffQuestions.localStatus}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{observationHandoffQuestions.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Groups</span>
              <strong>
                {observationHandoffQuestions.summary.counts.promptGroupCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Questions</span>
              <strong>
                {observationHandoffQuestions.summary.counts.reviewQuestionCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Gap prompts</span>
              <strong>
                {observationHandoffQuestions.summary.counts.gapPromptCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Deferred prompts</span>
              <strong>
                {
                  observationHandoffQuestions.summary.counts
                    .deferredScopePromptCount
                }
              </strong>
            </div>
          </div>
          <div className="observation-handoff-questions-layout">
            <div className="observation-handoff-prompt-group-list">
              {observationHandoffQuestions.promptGroups.map((group) => (
                <article key={group.promptGroupId}>
                  <div className="surface-index-row-heading">
                    <div>
                      <span className="event-type">
                        Prompt group {group.groupNumber} ·{" "}
                        {group.sourceSummaryReference.sourceSummaryId.replace(
                          "review-observation-boundary:",
                          "",
                        )}
                      </span>
                      <h3>{group.label}</h3>
                    </div>
                    <span className="score-pill">
                      {group.reviewQuestionIds.length} questions
                    </span>
                  </div>
                  <p>{group.sourceSummaryReference.sourceSummary}</p>
                  <div className="surface-index-count-grid">
                    <div>
                      <span className="metric-label">Anchors</span>
                      <strong>{group.localAnchorHrefs.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Gap notes</span>
                      <strong>{group.relatedGapNoteIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Deferred</span>
                      <strong>{group.relatedDeferredScopeIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Evidence</span>
                      <strong>{group.evidencePromptIds.length}</strong>
                    </div>
                  </div>
                  <div className="gap-reference-strip">
                    {group.localAnchorHrefs.map((href) => (
                      <a key={`${group.promptGroupId}:${href}`} href={href}>
                        {href.replace("#", "")}
                      </a>
                    ))}
                    <span>{group.relatedCoverageRowIds.length} coverage row</span>
                    <span>{group.relatedObservationRowIds.length} observations</span>
                  </div>
                  {group.staticNonGoalContexts.length ? (
                    <div className="observation-handoff-questions-context-list">
                      {group.staticNonGoalContexts.map((context) => (
                        <div
                          key={`${group.promptGroupId}:${context.nonGoalNoteId}`}
                        >
                          <span className="event-type">
                            {context.kind.replace(/_/g, " ")}
                          </span>
                          <strong>{context.label}</strong>
                          <p>{context.summary}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
            <aside className="observation-handoff-questions-panel">
              <span className="metric-label">Default prompt group</span>
              <strong>{observationHandoffQuestions.defaultPromptGroup.label}</strong>
              <p>{observationHandoffQuestions.summary.summary}</p>
              <div className="observation-handoff-review-question-list">
                {observationHandoffQuestions.reviewQuestions.map((question) => (
                  <article key={question.questionId}>
                    <span className="event-type">
                      {question.relatedGapNoteIds.length} gap notes ·{" "}
                      {question.relatedDeferredScopeIds.length} deferred
                    </span>
                    <strong>{question.label}</strong>
                    <p>{question.question}</p>
                  </article>
                ))}
              </div>
              <div className="observation-handoff-evidence-prompt-list">
                {observationHandoffQuestions.evidencePrompts.map((prompt) => (
                  <article key={prompt.promptId}>
                    <span className="event-type">
                      {prompt.localAnchorHrefs.length} anchors
                    </span>
                    <strong>{prompt.label}</strong>
                    <p>{prompt.prompt}</p>
                  </article>
                ))}
              </div>
              <div className="observation-handoff-gap-prompt-list">
                {observationHandoffQuestions.gapPrompts.map((prompt) => (
                  <article key={prompt.promptId}>
                    <span className="event-type">
                      {prompt.relatedDeferredScopeIds.length} deferred refs
                    </span>
                    <strong>{prompt.label}</strong>
                    <p>{prompt.prompt}</p>
                  </article>
                ))}
              </div>
              <div className="observation-handoff-deferred-prompt-list">
                {observationHandoffQuestions.deferredScopePrompts.map(
                  (prompt) => (
                    <article key={prompt.promptId}>
                      <span className="event-type">Deferred scope</span>
                      <strong>{prompt.label}</strong>
                      <p>{prompt.prompt}</p>
                    </article>
                  ),
                )}
              </div>
              <p>{observationHandoffQuestions.staticPromptRailSummary}</p>
            </aside>
          </div>
        </section>
      ) : null}

      {observationHandoffAgenda ? (
        <section
          className="review-observation-handoff-agenda-section"
          aria-label="Review observation handoff agenda"
        >
          <a id="review-observation-handoff-agenda" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">
                Stage 41 observation handoff agenda
              </span>
              <h2>Static facilitation guide and evidence stops</h2>
            </div>
            <span
              className={`status-chip playback-status-${observationHandoffAgenda.localStatus}`}
            >
              {observationHandoffAgenda.localStatus}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{observationHandoffAgenda.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Sections</span>
              <strong>
                {observationHandoffAgenda.summary.counts.agendaSectionCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Facilitation</span>
              <strong>
                {
                  observationHandoffAgenda.summary.counts
                    .facilitationPromptCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Evidence stops</span>
              <strong>
                {observationHandoffAgenda.summary.counts.evidenceStopCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Gap points</span>
              <strong>
                {
                  observationHandoffAgenda.summary.counts
                    .gapDiscussionPointCount
                }
              </strong>
            </div>
          </div>
          <div className="observation-handoff-agenda-layout">
            <div className="observation-handoff-agenda-section-list">
              {observationHandoffAgenda.sections.map((section) => (
                <article key={section.sectionId}>
                  <div className="surface-index-row-heading">
                    <div>
                      <span className="event-type">
                        Agenda section {section.sectionNumber} -{" "}
                        {section.sourceSummaryReference.sourceSummaryId.replace(
                          "review-observation-boundary:",
                          "",
                        )}
                      </span>
                      <h3>{section.label}</h3>
                    </div>
                    <span className="score-pill">
                      {section.facilitationPromptIds.length} prompts
                    </span>
                  </div>
                  <p>{section.goal}</p>
                  <div className="surface-index-count-grid">
                    <div>
                      <span className="metric-label">Questions</span>
                      <strong>{section.relatedReviewQuestionIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Evidence</span>
                      <strong>{section.relatedEvidencePromptIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Gaps</span>
                      <strong>{section.relatedGapPromptIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Deferred</span>
                      <strong>
                        {section.relatedDeferredScopePromptIds.length}
                      </strong>
                    </div>
                  </div>
                  <div className="gap-reference-strip">
                    {section.localAnchorHrefs.map((href) => (
                      <a key={`${section.sectionId}:${href}`} href={href}>
                        {href.replace("#", "")}
                      </a>
                    ))}
                    <span>{section.sourceCoverageRowId}</span>
                  </div>
                  {section.staticNonGoalContexts.length ? (
                    <div className="observation-handoff-agenda-context-list">
                      {section.staticNonGoalContexts.map((context) => (
                        <div
                          key={`${section.sectionId}:${context.nonGoalNoteId}`}
                        >
                          <span className="event-type">
                            {context.kind.replace(/_/g, " ")}
                          </span>
                          <strong>{context.label}</strong>
                          <p>{context.summary}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
            <aside className="observation-handoff-agenda-panel">
              <span className="metric-label">Default agenda section</span>
              <strong>{observationHandoffAgenda.defaultAgendaSection.label}</strong>
              <p>{observationHandoffAgenda.summary.summary}</p>
              <div className="observation-handoff-facilitation-prompt-list">
                {observationHandoffAgenda.facilitationPrompts.map((prompt) => (
                  <article key={prompt.promptId}>
                    <span className="event-type">
                      {prompt.relatedGapPromptIds.length} gap points -{" "}
                      {prompt.relatedDeferredScopePromptIds.length} deferred
                    </span>
                    <strong>{prompt.label}</strong>
                    <p>{prompt.prompt}</p>
                  </article>
                ))}
              </div>
              <div className="observation-handoff-evidence-stop-list">
                {observationHandoffAgenda.evidenceStops.map((stop) => (
                  <article key={stop.stopId}>
                    <span className="event-type">
                      {stop.localAnchorHrefs.length} anchors
                    </span>
                    <strong>{stop.label}</strong>
                    <p>{stop.summary}</p>
                  </article>
                ))}
              </div>
              <div className="observation-handoff-gap-discussion-list">
                {observationHandoffAgenda.gapDiscussionPoints.map((point) => (
                  <article key={point.pointId}>
                    <span className="event-type">Gap discussion</span>
                    <strong>{point.label}</strong>
                    <p>{point.discussionPoint}</p>
                  </article>
                ))}
              </div>
              <div className="observation-handoff-agenda-deferred-list">
                {observationHandoffAgenda.deferredScopeReminders.map(
                  (reminder) => (
                    <article key={reminder.reminderId}>
                      <span className="event-type">Deferred scope</span>
                      <strong>{reminder.label}</strong>
                      <p>{reminder.reminder}</p>
                    </article>
                  ),
                )}
              </div>
              <p>{observationHandoffAgenda.staticFacilitationGuideSummary}</p>
            </aside>
          </div>
        </section>
      ) : null}

      {observationHandoffPath ? (
        <section
          className="review-observation-handoff-path-section"
          aria-label="Review observation handoff path"
        >
          <a id="review-observation-handoff-path" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">
                Stage 42 observation handoff path
              </span>
              <h2>Static anchor map and handoff path</h2>
            </div>
            <span
              className={`status-chip playback-status-${observationHandoffPath.localStatus}`}
            >
              {observationHandoffPath.localStatus}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{observationHandoffPath.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Path steps</span>
              <strong>
                {observationHandoffPath.summary.counts.pathStepCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Anchors</span>
              <strong>
                {observationHandoffPath.summary.counts.anchorMapEntryCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Source prompts</span>
              <strong>
                {
                  observationHandoffPath.summary.counts
                    .sourceFacilitationPromptCount
                }
              </strong>
            </div>
          </div>
          <div className="observation-handoff-path-layout">
            <div className="observation-handoff-path-step-list">
              {observationHandoffPath.pathSteps.map((step) => (
                <article key={step.pathStepId}>
                  <div className="surface-index-row-heading">
                    <div>
                      <span className="event-type">
                        Path step {step.stepNumber} -{" "}
                        {step.sourceSummaryReference.sourceSummaryId.replace(
                          "review-observation-boundary:",
                          "",
                        )}
                      </span>
                      <h3>{step.label}</h3>
                    </div>
                    <span className="score-pill">
                      {step.anchorTargetIds.length} anchors
                    </span>
                  </div>
                  <p>{step.summary}</p>
                  <div className="surface-index-count-grid">
                    <div>
                      <span className="metric-label">Facilitation</span>
                      <strong>
                        {step.relatedFacilitationPromptIds.length}
                      </strong>
                    </div>
                    <div>
                      <span className="metric-label">Evidence</span>
                      <strong>{step.relatedEvidenceStopIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Gaps</span>
                      <strong>
                        {step.relatedGapDiscussionPointIds.length}
                      </strong>
                    </div>
                    <div>
                      <span className="metric-label">Deferred</span>
                      <strong>
                        {step.relatedDeferredScopeReminderIds.length}
                      </strong>
                    </div>
                  </div>
                  <div className="gap-reference-strip">
                    {step.localAnchorHrefs.map((href) => (
                      <a key={`${step.pathStepId}:${href}`} href={href}>
                        {href.replace("#", "")}
                      </a>
                    ))}
                    <span>{step.sourceCoverageRowId}</span>
                  </div>
                  <div className="observation-handoff-path-reference-list">
                    {step.sourceReferences.map((reference) => (
                      <div key={reference.referenceId}>
                        <span className="event-type">
                          {reference.sourceKind.replace(/_/g, " ")}
                        </span>
                        <strong>{reference.label}</strong>
                        <p>{reference.sourceId}</p>
                      </div>
                    ))}
                  </div>
                  <p>{step.staticReviewPrompt}</p>
                </article>
              ))}
            </div>
            <aside className="observation-handoff-path-panel">
              <span className="metric-label">Default path step</span>
              <strong>{observationHandoffPath.defaultPathStep.label}</strong>
              <p>{observationHandoffPath.summary.summary}</p>
              <div className="observation-handoff-anchor-map-list">
                {observationHandoffPath.anchorMapEntries.map((entry) => (
                  <article key={entry.anchorEntryId}>
                    <span className="event-type">
                      Anchor {entry.anchorOrder} - {entry.anchorTargetId}
                    </span>
                    <strong>{entry.label}</strong>
                    <p>{entry.summary}</p>
                    <div className="gap-reference-strip">
                      <a href={entry.localAnchorHref}>
                        {entry.anchorTargetId}
                      </a>
                      <span>{entry.sourcePromptGroupId}</span>
                    </div>
                  </article>
                ))}
              </div>
              <div className="observation-handoff-path-non-goal-list">
                {[
                  "No saved path progress",
                  "No route changes",
                  "No command execution",
                  "No exports or signoff",
                ].map((label) => (
                  <div key={label}>
                    <span className="event-type">Static boundary</span>
                    <strong>{label}</strong>
                  </div>
                ))}
              </div>
              <p>{observationHandoffPath.staticAnchorMapSummary}</p>
            </aside>
          </div>
        </section>
      ) : null}

      {observationHandoffDryRun ? (
        <section
          className="review-observation-handoff-dry-run-section"
          aria-label="Review observation handoff dry run"
        >
          <a id="review-observation-handoff-dry-run" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">
                Stage 43 observation handoff dry run
              </span>
              <h2>Static cue sheet and anchor rehearsal coverage</h2>
            </div>
            <span
              className={`status-chip playback-status-${observationHandoffDryRun.localStatus}`}
            >
              {observationHandoffDryRun.localStatus}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{observationHandoffDryRun.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Cues</span>
              <strong>
                {observationHandoffDryRun.summary.counts.dryRunCueCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Coverage</span>
              <strong>
                {
                  observationHandoffDryRun.summary.counts
                    .cueAnchorCoverageEntryCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Default anchor</span>
              <strong>
                {observationHandoffDryRun.summary.defaultAnchorTargetId}
              </strong>
            </div>
          </div>
          <div className="observation-handoff-dry-run-layout">
            <div className="observation-handoff-dry-run-cue-list">
              {observationHandoffDryRun.cues.map((cue) => (
                <article key={cue.cueId}>
                  <div className="surface-index-row-heading">
                    <div>
                      <span className="event-type">
                        Cue {cue.cueNumber} -{" "}
                        {cue.sourceSummaryReference.sourceSummaryId.replace(
                          "review-observation-boundary:",
                          "",
                        )}
                      </span>
                      <h3>{cue.label}</h3>
                    </div>
                    <span className="score-pill">
                      {cue.anchorTargetIds.length} anchors
                    </span>
                  </div>
                  <p>{cue.summary}</p>
                  <div className="surface-index-count-grid">
                    <div>
                      <span className="metric-label">Evidence callbacks</span>
                      <strong>{cue.evidenceCallbackIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Gap points</span>
                      <strong>{cue.gapDiscussionPointIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Deferred</span>
                      <strong>{cue.deferredScopeReminderIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Persistent</span>
                      <strong>{cue.nonPersistent ? "no" : "yes"}</strong>
                    </div>
                  </div>
                  <div className="gap-reference-strip">
                    {cue.localAnchorHrefs.map((href) => (
                      <a key={`${cue.cueId}:${href}`} href={href}>
                        {href.replace("#", "")}
                      </a>
                    ))}
                    <span>{cue.sourcePathStepId}</span>
                  </div>
                  <div className="observation-handoff-dry-run-source-list">
                    {cue.sourceReferences.map((reference) => (
                      <div key={`${cue.cueId}:${reference.referenceId}`}>
                        <span className="event-type">
                          {reference.sourceKind.replace(/_/g, " ")}
                        </span>
                        <strong>{reference.label}</strong>
                        <p>{reference.sourceId}</p>
                      </div>
                    ))}
                  </div>
                  <p>{cue.dryRunPrompt}</p>
                </article>
              ))}
            </div>
            <aside className="observation-handoff-dry-run-panel">
              <span className="metric-label">Default dry-run cue</span>
              <strong>{observationHandoffDryRun.defaultCue.label}</strong>
              <p>{observationHandoffDryRun.summary.summary}</p>
              <div className="observation-handoff-dry-run-coverage-list">
                {observationHandoffDryRun.cueAnchorCoverageEntries.map(
                  (entry) => (
                    <article key={entry.cueAnchorCoverageEntryId}>
                      <span className="event-type">
                        Coverage {entry.coverageOrder} -{" "}
                        {entry.anchorTargetId}
                      </span>
                      <strong>{entry.label}</strong>
                      <p>{entry.summary}</p>
                      <div className="gap-reference-strip">
                        <a href={entry.localAnchorHref}>
                          {entry.anchorTargetId}
                        </a>
                        <span>{entry.sourceAnchorEntryId}</span>
                      </div>
                    </article>
                  ),
                )}
              </div>
              <div className="observation-handoff-dry-run-non-goal-list">
                {[
                  "No saved dry-run progress",
                  "No saved rehearsal sessions",
                  "No route changes",
                  "No meeting workflow",
                  "No command execution",
                  "No exports or signoff",
                ].map((label) => (
                  <div key={label}>
                    <span className="event-type">Static boundary</span>
                    <strong>{label}</strong>
                  </div>
                ))}
              </div>
              <p>{observationHandoffDryRun.staticDryRunSummary}</p>
            </aside>
          </div>
        </section>
      ) : null}

      {observationHandoffDebrief ? (
        <section
          className="review-observation-handoff-debrief-section"
          aria-label="Review observation handoff debrief"
        >
          <a id="review-observation-handoff-debrief" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">
                Stage 44 observation handoff debrief
              </span>
              <h2>Static debrief prompts and follow-up map</h2>
            </div>
            <span
              className={`status-chip playback-status-${observationHandoffDebrief.localStatus}`}
            >
              {observationHandoffDebrief.localStatus}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{observationHandoffDebrief.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Prompts</span>
              <strong>
                {observationHandoffDebrief.summary.counts.debriefPromptCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Follow-up map</span>
              <strong>
                {
                  observationHandoffDebrief.summary.counts
                    .followUpMapEntryCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Default cue</span>
              <strong>{observationHandoffDebrief.summary.defaultCueId}</strong>
            </div>
          </div>
          <div className="observation-handoff-debrief-layout">
            <div className="observation-handoff-debrief-prompt-list">
              {observationHandoffDebrief.debriefPrompts.map((prompt) => (
                <article key={prompt.debriefPromptId}>
                  <div className="surface-index-row-heading">
                    <div>
                      <span className="event-type">
                        Prompt {prompt.promptNumber} - {prompt.sourceCueId}
                      </span>
                      <h3>{prompt.label}</h3>
                    </div>
                    <span className="score-pill">
                      {prompt.anchorTargetIds.length} anchors
                    </span>
                  </div>
                  <p>{prompt.summary}</p>
                  <div className="surface-index-count-grid">
                    <div>
                      <span className="metric-label">Evidence callbacks</span>
                      <strong>{prompt.evidenceCallbackIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Gap points</span>
                      <strong>{prompt.gapDiscussionPointIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Deferred</span>
                      <strong>{prompt.deferredScopeReminderIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Saved notes</span>
                      <strong>
                        {prompt.staticNonGoalFlags.noSavedDebriefNotes
                          ? "no"
                          : "yes"}
                      </strong>
                    </div>
                  </div>
                  <div className="gap-reference-strip">
                    {prompt.localAnchorHrefs.map((href) => (
                      <a key={`${prompt.debriefPromptId}:${href}`} href={href}>
                        {href.replace("#", "")}
                      </a>
                    ))}
                    <span>{prompt.sourcePathStepId}</span>
                    <span>{prompt.sourceAgendaSectionId}</span>
                    <span>{prompt.sourcePromptGroupId}</span>
                  </div>
                  <div className="observation-handoff-debrief-source-list">
                    {prompt.sourceReferences.map((reference) => (
                      <div
                        key={`${prompt.debriefPromptId}:${reference.referenceId}`}
                      >
                        <span className="event-type">
                          {reference.sourceKind.replace(/_/g, " ")}
                        </span>
                        <strong>{reference.label}</strong>
                        <p>{reference.sourceId}</p>
                      </div>
                    ))}
                  </div>
                  <p>{prompt.debriefPrompt}</p>
                </article>
              ))}
            </div>
            <aside className="observation-handoff-debrief-panel">
              <span className="metric-label">Default debrief prompt</span>
              <strong>{observationHandoffDebrief.defaultDebriefPrompt.label}</strong>
              <p>{observationHandoffDebrief.summary.summary}</p>
              <div className="observation-handoff-debrief-follow-up-list">
                {observationHandoffDebrief.followUpMapEntries.map((entry) => (
                  <article key={entry.followUpMapEntryId}>
                    <span className="event-type">
                      Follow-up {entry.followUpOrder} - {entry.anchorTargetId}
                    </span>
                    <strong>{entry.label}</strong>
                    <p>{entry.summary}</p>
                    <div className="gap-reference-strip">
                      <a href={entry.localAnchorHref}>{entry.anchorTargetId}</a>
                      <span>{entry.sourceAnchorCoverageEntryId}</span>
                      <span>{entry.sourceCueId}</span>
                    </div>
                  </article>
                ))}
              </div>
              <div className="observation-handoff-debrief-non-goal-list">
                {[
                  "No saved debrief notes",
                  "No saved follow-up progress",
                  "No saved follow-up ownership",
                  "No route changes",
                  "No meeting workflow",
                  "No command execution",
                  "No exports or signoff",
                ].map((label) => (
                  <div key={label}>
                    <span className="event-type">Static boundary</span>
                    <strong>{label}</strong>
                  </div>
                ))}
              </div>
              <p>{observationHandoffDebrief.staticDebriefSummary}</p>
            </aside>
          </div>
        </section>
      ) : null}

      {observationHandoffContinuity ? (
        <section
          className="review-observation-handoff-continuity-section"
          aria-label="Review observation handoff continuity"
        >
          <a
            id="review-observation-handoff-continuity"
            className="section-anchor"
          />
          <div className="section-heading">
            <div>
              <span className="metric-label">
                Stage 45 observation handoff continuity
              </span>
              <h2>Continuity snapshot and static next-pass map</h2>
            </div>
            <span
              className={`status-chip playback-status-${observationHandoffContinuity.localStatus}`}
            >
              {observationHandoffContinuity.localStatus}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{observationHandoffContinuity.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Continuity cards</span>
              <strong>
                {
                  observationHandoffContinuity.summary.counts
                    .continuityCardCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Next-pass map</span>
              <strong>
                {
                  observationHandoffContinuity.summary.counts
                    .nextPassMapEntryCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Default debrief</span>
              <strong>
                {
                  observationHandoffContinuity.summary
                    .defaultDebriefPromptId
                }
              </strong>
            </div>
          </div>
          <div className="observation-handoff-continuity-layout">
            <div className="observation-handoff-continuity-card-list">
              {observationHandoffContinuity.continuityCards.map((card) => (
                <article key={card.continuityCardId}>
                  <div className="surface-index-row-heading">
                    <div>
                      <span className="event-type">
                        Card {card.cardNumber} - {card.sourceCueId}
                      </span>
                      <h3>{card.label}</h3>
                    </div>
                    <span className="score-pill">
                      {card.sourceFollowUpMapEntryIds.length} follow-ups
                    </span>
                  </div>
                  <p>{card.summary}</p>
                  <div className="surface-index-count-grid">
                    <div>
                      <span className="metric-label">Evidence callbacks</span>
                      <strong>{card.evidenceCallbackIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Gap points</span>
                      <strong>{card.gapDiscussionPointIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Deferred</span>
                      <strong>{card.deferredScopeReminderIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Saved progress</span>
                      <strong>
                        {card.staticNonGoalFlags.noSavedContinuityProgress
                          ? "no"
                          : "yes"}
                      </strong>
                    </div>
                  </div>
                  <div className="gap-reference-strip">
                    {card.localAnchorHrefs.map((href) => (
                      <a key={`${card.continuityCardId}:${href}`} href={href}>
                        {href.replace("#", "")}
                      </a>
                    ))}
                    <span>{card.sourceDebriefPromptId}</span>
                    <span>{card.sourcePathStepId}</span>
                    <span>{card.sourceAgendaSectionId}</span>
                  </div>
                  <div className="observation-handoff-continuity-source-list">
                    {card.sourceReferences.map((reference) => (
                      <div
                        key={`${card.continuityCardId}:${reference.referenceId}`}
                      >
                        <span className="event-type">
                          {reference.sourceKind.replace(/_/g, " ")}
                        </span>
                        <strong>{reference.label}</strong>
                        <p>{reference.sourceId}</p>
                      </div>
                    ))}
                  </div>
                  <p>{card.continuityPrompt}</p>
                </article>
              ))}
            </div>
            <aside className="observation-handoff-continuity-panel">
              <span className="metric-label">Default continuity card</span>
              <strong>
                {observationHandoffContinuity.defaultContinuityCard.label}
              </strong>
              <p>{observationHandoffContinuity.summary.summary}</p>
              <div className="observation-handoff-continuity-next-pass-list">
                {observationHandoffContinuity.nextPassMapEntries.map(
                  (entry) => (
                    <article key={entry.nextPassMapEntryId}>
                      <span className="event-type">
                        Next pass {entry.nextPassOrder} -{" "}
                        {entry.anchorTargetId}
                      </span>
                      <strong>{entry.label}</strong>
                      <p>{entry.summary}</p>
                      <div className="gap-reference-strip">
                        <a href={entry.localAnchorHref}>
                          {entry.anchorTargetId}
                        </a>
                        <span>{entry.sourceFollowUpMapEntryId}</span>
                        <span>{entry.sourceDebriefPromptId}</span>
                      </div>
                    </article>
                  ),
                )}
              </div>
              <div className="observation-handoff-continuity-non-goal-list">
                {[
                  "No saved debrief notes",
                  "No saved reviewer progress",
                  "No saved continuity progress",
                  "No saved follow-up ownership",
                  "No routes or task launchers",
                  "No runnable checklists",
                  "No audit, scoring, or certification",
                  "No exports, packages, or commands",
                ].map((label) => (
                  <div key={label}>
                    <span className="event-type">Static boundary</span>
                    <strong>{label}</strong>
                  </div>
                ))}
              </div>
              <p>{observationHandoffContinuity.staticContinuitySummary}</p>
            </aside>
          </div>
        </section>
      ) : null}

      {observationHandoffDriftGuard ? (
        <section
          className="review-observation-handoff-drift-guard-section"
          aria-label="Review observation handoff drift guard"
        >
          <a
            id="review-observation-handoff-drift-guard"
            className="section-anchor"
          />
          <div className="section-heading">
            <div>
              <span className="metric-label">
                Stage 46 observation handoff drift guard
              </span>
              <h2>Drift guard and static regression map</h2>
            </div>
            <span
              className={`status-chip playback-status-${observationHandoffDriftGuard.localStatus}`}
            >
              {observationHandoffDriftGuard.localStatus}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{observationHandoffDriftGuard.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Drift rows</span>
              <strong>
                {
                  observationHandoffDriftGuard.summary.counts
                    .driftGuardRowCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Regression map</span>
              <strong>
                {
                  observationHandoffDriftGuard.summary.counts
                    .staticRegressionMapEntryCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Default cue</span>
              <strong>
                {
                  observationHandoffDriftGuard.summary
                    .defaultContinuityContext.defaultCueId
                }
              </strong>
            </div>
          </div>
          <div className="observation-handoff-drift-guard-layout">
            <div className="observation-handoff-drift-guard-row-list">
              {observationHandoffDriftGuard.driftGuardRows.map((row) => (
                <article key={row.driftGuardRowId}>
                  <div className="surface-index-row-heading">
                    <div>
                      <span className="event-type">
                        Row {row.rowNumber} - {row.sourceCueId}
                      </span>
                      <h3>{row.label}</h3>
                    </div>
                    <span className="score-pill">
                      {row.anchorTargetIds.length} anchors
                    </span>
                  </div>
                  <p>{row.summary}</p>
                  <div className="surface-index-count-grid">
                    <div>
                      <span className="metric-label">Evidence callbacks</span>
                      <strong>{row.evidenceCallbackIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Gap points</span>
                      <strong>{row.gapDiscussionPointIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Deferred</span>
                      <strong>{row.deferredScopeReminderIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Saved drift</span>
                      <strong>
                        {row.staticNonGoalFlags.noSavedDriftState
                          ? "no"
                          : "yes"}
                      </strong>
                    </div>
                  </div>
                  <div className="gap-reference-strip">
                    {row.localAnchorHrefs.map((href) => (
                      <a key={`${row.driftGuardRowId}:${href}`} href={href}>
                        {href.replace("#", "")}
                      </a>
                    ))}
                    <span>{row.sourceDebriefPromptId}</span>
                    <span>{row.sourcePathStepId}</span>
                    <span>{row.sourceHandoffCardId}</span>
                  </div>
                  <div className="observation-handoff-drift-guard-source-list">
                    {row.sourceReferences.map((reference) => (
                      <div
                        key={`${row.driftGuardRowId}:${reference.referenceId}`}
                      >
                        <span className="event-type">
                          {reference.sourceKind.replace(/_/g, " ")}
                        </span>
                        <strong>{reference.label}</strong>
                        <p>{reference.sourceId}</p>
                      </div>
                    ))}
                  </div>
                  <p>{row.guardPrompt}</p>
                </article>
              ))}
            </div>
            <aside className="observation-handoff-drift-guard-panel">
              <span className="metric-label">Default continuity context</span>
              <strong>
                {observationHandoffDriftGuard.defaultDriftGuardRow.label}
              </strong>
              <p>{observationHandoffDriftGuard.summary.summary}</p>
              <div className="observation-handoff-drift-guard-regression-list">
                {observationHandoffDriftGuard.staticRegressionMapEntries.map(
                  (entry) => (
                    <article key={entry.staticRegressionMapEntryId}>
                      <span className="event-type">
                        Regression {entry.regressionOrder} -{" "}
                        {entry.anchorTargetId}
                      </span>
                      <strong>{entry.label}</strong>
                      <p>{entry.summary}</p>
                      <div className="gap-reference-strip">
                        <a href={entry.localAnchorHref}>
                          {entry.anchorTargetId}
                        </a>
                        <span>{entry.sourceFollowUpMapEntryId}</span>
                        <span>{entry.sourceAnchorCoverageEntryId}</span>
                        <span>{entry.sourceDebriefPromptId}</span>
                      </div>
                    </article>
                  ),
                )}
              </div>
              <div className="observation-handoff-drift-guard-non-goal-list">
                {[
                  "No saved drift state",
                  "No saved review sessions",
                  "No saved debrief notes",
                  "No saved continuity progress",
                  "No saved follow-up ownership",
                  "No routes or task launchers",
                  "No runnable checklists",
                  "No audit, scoring, or certification",
                  "No exports, packages, or commands",
                ].map((label) => (
                  <div key={label}>
                    <span className="event-type">Static boundary</span>
                    <strong>{label}</strong>
                  </div>
                ))}
              </div>
              <p>{observationHandoffDriftGuard.staticDriftGuardSummary}</p>
            </aside>
          </div>
        </section>
      ) : null}

      {observationHandoffCalibration ? (
        <section
          className="review-observation-handoff-calibration-section"
          aria-label="Review observation handoff calibration"
        >
          <a
            id="review-observation-handoff-calibration"
            className="section-anchor"
          />
          <div className="section-heading">
            <div>
              <span className="metric-label">
                Stage 47 observation handoff calibration
              </span>
              <h2>Calibration board and static alignment notes</h2>
            </div>
            <span
              className={`status-chip playback-status-${observationHandoffCalibration.localStatus}`}
            >
              {observationHandoffCalibration.localStatus}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{observationHandoffCalibration.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Calibration cards</span>
              <strong>
                {
                  observationHandoffCalibration.summary.counts
                    .calibrationCardCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Alignment notes</span>
              <strong>
                {
                  observationHandoffCalibration.summary.counts
                    .staticAlignmentNoteCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Default cue</span>
              <strong>
                {
                  observationHandoffCalibration.summary
                    .defaultDriftGuardContext.defaultCueId
                }
              </strong>
            </div>
          </div>
          <div className="observation-handoff-calibration-layout">
            <div className="observation-handoff-calibration-card-list">
              {observationHandoffCalibration.calibrationCards.map((card) => (
                <article key={card.calibrationCardId}>
                  <div className="surface-index-row-heading">
                    <div>
                      <span className="event-type">
                        Card {card.cardNumber} - {card.sourceCueId}
                      </span>
                      <h3>{card.label}</h3>
                    </div>
                    <span className="score-pill">
                      {card.sourceReferences.length} sources
                    </span>
                  </div>
                  <p>{card.summary}</p>
                  <div className="surface-index-count-grid">
                    <div>
                      <span className="metric-label">Evidence callbacks</span>
                      <strong>{card.evidenceCallbackIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Gap points</span>
                      <strong>{card.gapDiscussionPointIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Deferred</span>
                      <strong>{card.deferredScopeReminderIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Saved calibration</span>
                      <strong>
                        {card.staticNonGoalFlags.noSavedCalibrationState
                          ? "no"
                          : "yes"}
                      </strong>
                    </div>
                  </div>
                  <div className="gap-reference-strip">
                    {card.localAnchorHrefs.map((href) => (
                      <a key={`${card.calibrationCardId}:${href}`} href={href}>
                        {href.replace("#", "")}
                      </a>
                    ))}
                    <span>{card.sourceDebriefPromptId}</span>
                    <span>{card.sourcePathStepId}</span>
                    <span>{card.sourceAgendaSectionId}</span>
                    <span>{card.sourcePromptGroupId}</span>
                    <span>{card.sourceCoverageRowId}</span>
                    <span>{card.sourceHandoffCardId}</span>
                  </div>
                  <div className="observation-handoff-calibration-source-list">
                    {card.sourceReferences.map((reference) => (
                      <div
                        key={`${card.calibrationCardId}:${reference.referenceId}`}
                      >
                        <span className="event-type">
                          {reference.sourceKind.replace(/_/g, " ")}
                        </span>
                        <strong>{reference.label}</strong>
                        <p>{reference.sourceId}</p>
                      </div>
                    ))}
                  </div>
                  <p>{card.calibrationPrompt}</p>
                </article>
              ))}
            </div>
            <aside className="observation-handoff-calibration-panel">
              <span className="metric-label">Default drift guard context</span>
              <strong>
                {observationHandoffCalibration.defaultCalibrationCard.label}
              </strong>
              <p>{observationHandoffCalibration.summary.summary}</p>
              <div className="observation-handoff-calibration-alignment-list">
                {observationHandoffCalibration.staticAlignmentNotes.map(
                  (note) => (
                    <article key={note.staticAlignmentNoteId}>
                      <span className="event-type">
                        Alignment {note.alignmentOrder} -{" "}
                        {note.anchorTargetId}
                      </span>
                      <strong>{note.label}</strong>
                      <p>{note.summary}</p>
                      <div className="gap-reference-strip">
                        <a href={note.localAnchorHref}>
                          {note.anchorTargetId}
                        </a>
                        <span>{note.sourceFollowUpMapEntryId}</span>
                        <span>{note.sourceAnchorCoverageEntryId}</span>
                        <span>{note.sourceDebriefPromptId}</span>
                        <span>{note.sourcePathStepId}</span>
                      </div>
                    </article>
                  ),
                )}
              </div>
              <div className="observation-handoff-calibration-non-goal-list">
                {[
                  "No saved calibration notes",
                  "No saved calibration state",
                  "No saved drift state",
                  "No saved reviewer progress",
                  "No saved follow-up ownership",
                  "No routes or task launchers",
                  "No runnable checklists",
                  "No audit, scoring, or certification",
                  "No exports, packages, or commands",
                ].map((label) => (
                  <div key={label}>
                    <span className="event-type">Static boundary</span>
                    <strong>{label}</strong>
                  </div>
                ))}
              </div>
              <p>{observationHandoffCalibration.staticCalibrationSummary}</p>
            </aside>
          </div>
        </section>
      ) : null}

      {observationHandoffSynthesis ? (
        <section
          className="review-observation-handoff-synthesis-section"
          aria-label="Review observation handoff synthesis"
        >
          <a
            id="review-observation-handoff-synthesis"
            className="section-anchor"
          />
          <div className="section-heading">
            <div>
              <span className="metric-label">
                Stage 48 observation handoff synthesis
              </span>
              <h2>Synthesis map and static relay notes</h2>
            </div>
            <span
              className={`status-chip playback-status-${observationHandoffSynthesis.localStatus}`}
            >
              {observationHandoffSynthesis.localStatus}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{observationHandoffSynthesis.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Synthesis rows</span>
              <strong>
                {observationHandoffSynthesis.summary.counts.synthesisRowCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Relay notes</span>
              <strong>
                {
                  observationHandoffSynthesis.summary.counts
                    .staticRelayNoteCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Default cue</span>
              <strong>
                {
                  observationHandoffSynthesis.summary
                    .defaultCalibrationContext.defaultCueId
                }
              </strong>
            </div>
          </div>
          <div className="observation-handoff-synthesis-layout">
            <div className="observation-handoff-synthesis-row-list">
              {observationHandoffSynthesis.synthesisRows.map((row) => (
                <article key={row.synthesisRowId}>
                  <div className="surface-index-row-heading">
                    <div>
                      <span className="event-type">
                        Row {row.rowNumber} - {row.sourceCueId}
                      </span>
                      <h3>{row.label}</h3>
                    </div>
                    <span className="score-pill">
                      {row.sourceAlignmentNoteIds.length} relay notes
                    </span>
                  </div>
                  <p>{row.summary}</p>
                  <div className="surface-index-count-grid">
                    <div>
                      <span className="metric-label">Evidence callbacks</span>
                      <strong>{row.evidenceCallbackIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Gap points</span>
                      <strong>{row.gapDiscussionPointIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Deferred</span>
                      <strong>{row.deferredScopeReminderIds.length}</strong>
                    </div>
                    <div>
                      <span className="metric-label">Saved synthesis</span>
                      <strong>
                        {row.staticNonGoalFlags.noSavedSynthesisState
                          ? "no"
                          : "yes"}
                      </strong>
                    </div>
                  </div>
                  <div className="gap-reference-strip">
                    {row.localAnchorHrefs.map((href) => (
                      <a key={`${row.synthesisRowId}:${href}`} href={href}>
                        {href.replace("#", "")}
                      </a>
                    ))}
                    <span>{row.sourceCalibrationCardId}</span>
                    <span>{row.sourceDebriefPromptId}</span>
                    <span>{row.sourcePathStepId}</span>
                    <span>{row.sourceAgendaSectionId}</span>
                    <span>{row.sourcePromptGroupId}</span>
                    <span>{row.sourceCoverageRowId}</span>
                    <span>{row.sourceHandoffCardId}</span>
                  </div>
                  <div className="observation-handoff-synthesis-crosswalk-list">
                    {row.sourceCrosswalkReferences.map((reference) => (
                      <div
                        key={`${row.synthesisRowId}:${reference.referenceId}`}
                      >
                        <span className="event-type">
                          {reference.sourceKind.replace(/_/g, " ")}
                        </span>
                        <strong>{reference.label}</strong>
                        <p>{reference.sourceId}</p>
                      </div>
                    ))}
                  </div>
                  <p>{row.relayThreadNote}</p>
                </article>
              ))}
            </div>
            <aside className="observation-handoff-synthesis-panel">
              <span className="metric-label">Default calibration context</span>
              <strong>{observationHandoffSynthesis.defaultSynthesisRow.label}</strong>
              <p>{observationHandoffSynthesis.summary.summary}</p>
              <div className="observation-handoff-synthesis-relay-list">
                {observationHandoffSynthesis.staticRelayNotes.map((note) => (
                  <article key={note.staticRelayNoteEntryId}>
                    <span className="event-type">
                      Relay {note.relayOrder} - {note.anchorTargetId}
                    </span>
                    <strong>{note.label}</strong>
                    <p>{note.summary}</p>
                    <div className="gap-reference-strip">
                      <a href={note.localAnchorHref}>{note.anchorTargetId}</a>
                      <span>{note.sourceAlignmentNoteId}</span>
                      <span>
                        {note.sourceCalibrationCardIds.length} calibration cards
                      </span>
                      <span>{note.sourceFollowUpMapEntryId}</span>
                      <span>{note.sourceDebriefPromptId}</span>
                      <span>{note.sourcePathStepId}</span>
                    </div>
                  </article>
                ))}
              </div>
              <div className="observation-handoff-synthesis-non-goal-list">
                {[
                  "No saved synthesis state",
                  "No saved calibration state",
                  "No saved drift state",
                  "No saved reviewer progress",
                  "No routes or task launchers",
                  "No runnable checklists",
                  "No audit, scoring, or certification",
                  "No exports, packages, or commands",
                ].map((label) => (
                  <div key={label}>
                    <span className="event-type">Static boundary</span>
                    <strong>{label}</strong>
                  </div>
                ))}
              </div>
              <p>{observationHandoffSynthesis.staticSynthesisSummary}</p>
            </aside>
          </div>
        </section>
      ) : null}

      {view.reviewDecisionRegister ? (
        <section
          className="review-decision-section"
          aria-label="Review decision register"
        >
          <a id="review-decision-register" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 14 review decisions</span>
              <h2>Decision register and handoff checklist</h2>
            </div>
            <span
              className={`status-chip playback-status-${view.reviewDecisionRegister.localStatus}`}
            >
              {view.reviewDecisionRegister.localStatus}
            </span>
          </div>
          <div className="decision-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewDecisionRegister.schema}</strong>
            </div>
            <div>
              <span className="metric-label">Ready</span>
              <strong>{view.reviewDecisionRegister.summary.readyCount}</strong>
            </div>
            <div>
              <span className="metric-label">Follow-up</span>
              <strong>{view.reviewDecisionRegister.summary.followUpCount}</strong>
            </div>
            <div>
              <span className="metric-label">Deferred</span>
              <strong>{view.reviewDecisionRegister.summary.deferredCount}</strong>
            </div>
          </div>
          <div className="decision-register-layout">
            <div className="decision-list">
              {view.reviewDecisionRegister.decisions.map((decision) => (
                <article
                  key={decision.decisionId}
                  className={`decision-row decision-${decision.status}`}
                >
                  <div className="decision-row-heading">
                    <span className={`status-chip decision-status-${decision.status}`}>
                      {decision.status.replace("_", " ")}
                    </span>
                    <div>
                      <span className="event-type">{decision.decisionId}</span>
                      <h3>{decision.label}</h3>
                    </div>
                  </div>
                  <p>{decision.summary}</p>
                  {decision.followUpReason ? (
                    <p className="decision-follow-up">{decision.followUpReason}</p>
                  ) : null}
                  <div className="decision-evidence-list">
                    {decision.supportingEvidence.map((evidence) => (
                      <a
                        key={`${decision.decisionId}:${evidence.label}`}
                        href={`#${evidence.target}`}
                      >
                        {evidence.label}
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="handoff-checklist">
              <span className="metric-label">Handoff checklist</span>
              {view.reviewDecisionRegister.handoffChecklist.map((item) => (
                <a
                  key={item.itemId}
                  className={`handoff-item handoff-${item.status}`}
                  href={`#${item.evidenceTarget}`}
                >
                  <span className={`status-dot decision-status-${item.status}`} />
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.summary}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="playback-scope-notes">
            {view.reviewDecisionRegister.scopeNotes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
        </section>
      ) : null}

      {view.reviewBriefingBoard ? (
        <section
          className="review-briefing-section"
          aria-label="Review briefing board"
        >
          <a id="review-briefing-board" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 15 briefing board</span>
              <h2>Review briefing board and evidence drilldown</h2>
            </div>
            <span
              className={`status-chip briefing-status-${view.reviewBriefingBoard.readinessStatus}`}
            >
              {view.reviewBriefingBoard.readinessStatus.replace(/_/g, " ")}
            </span>
          </div>
          <div className="briefing-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewBriefingBoard.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Ready</span>
              <strong>{view.reviewBriefingBoard.summary.readyCount}</strong>
            </div>
            <div>
              <span className="metric-label">Follow-up</span>
              <strong>{view.reviewBriefingBoard.summary.followUpCount}</strong>
            </div>
            <div>
              <span className="metric-label">Deferred</span>
              <strong>{view.reviewBriefingBoard.summary.deferredCount}</strong>
            </div>
          </div>
          <div className="briefing-board-layout">
            <div className="briefing-group-list">
              {view.reviewBriefingBoard.groupedDecisionSummaries.map((group) => (
                <article
                  key={group.status}
                  className={`briefing-group briefing-group-${group.status}`}
                >
                  <div className="briefing-group-heading">
                    <div>
                      <span className={`status-chip decision-status-${group.status}`}>
                        {group.status.replace("_", " ")}
                      </span>
                      <h3>{group.label}</h3>
                    </div>
                    <strong>{group.decisionCount}</strong>
                  </div>
                  <p>{group.summary}</p>
                  <div className="briefing-decision-list">
                    {group.decisions.map((decision) => (
                      <article
                        key={decision.decisionId}
                        className="briefing-decision-card"
                      >
                        <div className="briefing-decision-heading">
                          <span className="event-type">{decision.decisionId}</span>
                          <strong>{decision.label}</strong>
                        </div>
                        <p>{decision.summary}</p>
                        <p className="briefing-decision-frame">
                          Playback frame {decision.relatedPlaybackFrameId}
                        </p>
                        {decision.followUpReason ? (
                          <p className="briefing-decision-follow-up">
                            {decision.followUpReason}
                          </p>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="briefing-sidebar">
              <div className="briefing-panel">
                <span className="metric-label">Follow-up actions</span>
                {view.reviewBriefingBoard.followUpActions.length ? (
                  <div className="briefing-follow-up-list">
                    {view.reviewBriefingBoard.followUpActions.map((action) => (
                      <article key={action.actionId} className="briefing-follow-up-item">
                        <strong>{action.label}</strong>
                        <p>{action.summary}</p>
                        <div className="briefing-follow-up-meta">
                          <span>{action.decisionIds.join(", ")}</span>
                          <span>{action.evidenceTargets.join(", ")}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="empty-state">No follow-up actions remain.</p>
                )}
              </div>
              <div className="briefing-panel">
                <span className="metric-label">Evidence drilldown</span>
                <div className="briefing-evidence-list">
                  {view.reviewBriefingBoard.evidenceDrilldownRows.map((row) => (
                    <article
                      key={row.rowId}
                      className={`briefing-evidence-row evidence-${row.decisionStatus}`}
                    >
                      <span
                        className={`status-chip decision-status-${row.decisionStatus}`}
                      >
                        {row.decisionStatus.replace(/_/g, " ")}
                      </span>
                      <div>
                        <div className="briefing-evidence-heading">
                          <strong>{row.evidenceLabel}</strong>
                          <span>{row.source.replace(/_/g, " ")}</span>
                        </div>
                        <p>{row.decisionLabel}</p>
                        <p>{row.reviewNote}</p>
                        <div className="briefing-evidence-meta">
                          <span>{row.target}</span>
                          {row.frameId ? <span>{row.frameId}</span> : null}
                          {row.path ? <span>{row.path}</span> : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="playback-scope-notes">
            {view.reviewBriefingBoard.localOnlyScopeNotes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
        </section>
      ) : null}

      {view.reviewActionQueue ? (
        <section
          className="review-action-section"
          aria-label="Review action queue and handoff readiness"
        >
          <a id="review-action-queue" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 16 action queue</span>
              <h2>Review action queue and handoff readiness</h2>
            </div>
            <span
              className={`status-chip action-status-${view.reviewActionQueue.readiness.verdict}`}
            >
              {view.reviewActionQueue.readiness.verdict.replace(/_/g, " ")}
            </span>
          </div>
          <div className="action-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewActionQueue.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Actions</span>
              <strong>
                {view.reviewActionQueue.readiness.counts.totalActionCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Blocking</span>
              <strong>
                {view.reviewActionQueue.readiness.counts.blockingActionCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Deferred scope</span>
              <strong>
                {
                  view.reviewActionQueue.readiness.counts
                    .deferredProductionActionCount
                }
              </strong>
            </div>
          </div>
          <div className="action-queue-layout">
            <div className="action-queue-list">
              {view.reviewActionQueue.actions.map((action) => (
                <article
                  key={action.actionId}
                  className={`action-queue-item action-priority-${action.priority} action-category-${action.blockerCategory}`}
                >
                  <div className="action-queue-heading">
                    <span
                      className={`status-chip action-priority-chip-${action.priority}`}
                    >
                      {action.priority.toUpperCase()}
                    </span>
                    <div>
                      <span className="event-type">
                        {action.blockerCategory.replace(/_/g, " ")}
                      </span>
                      <h3>{action.label}</h3>
                    </div>
                  </div>
                  <p>{action.summary}</p>
                  <p className="action-next-step">{action.nextLocalStep}</p>
                  <p className="action-readiness-impact">
                    {action.readinessImpact}
                  </p>
                  <div className="action-evidence-list">
                    {action.evidenceTargets.map((target) => (
                      <a key={`${action.actionId}:${target}`} href={`#${target}`}>
                        {target}
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className="handoff-readiness-panel">
              <span className="metric-label">Handoff readiness</span>
              <strong>{view.reviewActionQueue.readiness.label}</strong>
              <p>{view.reviewActionQueue.readiness.summary}</p>
              <div className="readiness-count-strip">
                <span>
                  {view.reviewActionQueue.readiness.counts.blockingActionCount}{" "}
                  blockers
                </span>
                <span>
                  {
                    view.reviewActionQueue.readiness.counts
                      .deferredProductionActionCount
                  }{" "}
                  deferred
                </span>
              </div>
              <p className="human-test-gate">
                {view.reviewActionQueue.humanTestGateSummary}
              </p>
              <div className="deferred-scope-list">
                {view.reviewActionQueue.deferredScopeNotes.map((note) => (
                  <span key={note}>{note}</span>
                ))}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {view.reviewActionWalkthrough ? (
        <section
          className="review-walkthrough-section"
          aria-label="Action evidence walkthrough"
        >
          <a id="review-action-walkthrough" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 17 action walkthrough</span>
              <h2>Selected action evidence path</h2>
            </div>
            <span
              className={`status-chip action-status-${
                view.reviewActionWalkthrough.selectedAction.blocking
                  ? "blocked_by_local_follow_up"
                  : "deferred_production_scope_only"
              }`}
            >
              {view.reviewActionWalkthrough.selectedAction.blocking
                ? "blocked by local follow up"
                : "deferred production scope only"}
            </span>
          </div>
          <div className="walkthrough-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewActionWalkthrough.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Selected action</span>
              <strong>{view.reviewActionWalkthrough.selectedAction.label}</strong>
            </div>
            <div>
              <span className="metric-label">Targets</span>
              <strong>{view.reviewActionWalkthrough.coverage.totalTargetCount}</strong>
            </div>
            <div>
              <span className="metric-label">Missing</span>
              <strong>
                {view.reviewActionWalkthrough.coverage.missingTargetCount}
              </strong>
            </div>
          </div>
          <div className="walkthrough-layout">
            <div className="walkthrough-selector" aria-label="Action selector">
              {view.reviewActionWalkthrough.actions.map((action) => (
                <button
                  key={action.actionId}
                  className={
                    action.actionId === view.reviewActionWalkthrough?.selectedActionId
                      ? "walkthrough-choice selected"
                      : "walkthrough-choice"
                  }
                  type="button"
                  onClick={() => onSelectReviewAction(action.actionId)}
                >
                  <span className={`status-chip action-priority-chip-${action.priority}`}>
                    {action.priority.toUpperCase()}
                  </span>
                  <strong>{action.label}</strong>
                  <p>{action.summary}</p>
                  <div className="walkthrough-choice-meta">
                    <span>{action.evidenceTargets.length} targets</span>
                    <span>
                      {action.blocking ? "blocking" : "deferred production"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="walkthrough-details">
              <article className="walkthrough-action-card">
                <div className="walkthrough-action-heading">
                  <div>
                    <span className="event-type">
                      {view.reviewActionWalkthrough.selectedAction.blockerCategory.replace(
                        /_/g,
                        " ",
                      )}
                    </span>
                    <h3>{view.reviewActionWalkthrough.selectedAction.label}</h3>
                  </div>
                  <span className="walkthrough-selected-action-id">
                    {view.reviewActionWalkthrough.selectedActionId}
                  </span>
                </div>
                <p>{view.reviewActionWalkthrough.selectedAction.summary}</p>
                <p className="action-next-step">
                  {view.reviewActionWalkthrough.nextLocalStep}
                </p>
                <p className="action-readiness-impact">
                  {view.reviewActionWalkthrough.selectedAction.readinessImpact}
                </p>
                <div className="decision-evidence-list">
                  {view.reviewActionWalkthrough.selectedAction.decisionIds.map(
                    (decisionId) => (
                      <span key={decisionId}>{decisionId}</span>
                    ),
                  )}
                  {view.reviewActionWalkthrough.selectedAction.evidenceTargets.map(
                    (target) => (
                      <a key={target} href={`#${target}`}>
                        {target}
                      </a>
                    ),
                  )}
                </div>
              </article>
              <div className="walkthrough-path-list">
                {view.reviewActionWalkthrough.evidencePathRows.map((row) => (
                  <article
                    key={row.rowId}
                    className={`walkthrough-path-row walkthrough-path-${row.status}`}
                  >
                    <div className="walkthrough-path-heading">
                      <span
                        className={`status-chip decision-status-${
                          row.status === "available" ? "ready" : "follow_up"
                        }`}
                      >
                        {row.status}
                      </span>
                      <div>
                        <span className="event-type">{row.target}</span>
                        <h3>{row.label}</h3>
                      </div>
                    </div>
                    <p>
                      {row.evidenceRows.length} briefing rows,{" "}
                      {row.replayFrameIds.length} replay frames,{" "}
                      {row.runbookTargets.length} runbook targets.
                    </p>
                    <div className="walkthrough-reference-strip">
                      {row.replayFrameIds.map((frameId) => (
                        <span key={`${row.rowId}:${frameId}`}>{frameId}</span>
                      ))}
                      {row.runbookTargets.map((target) => (
                        <span key={`${row.rowId}:${target.stepId}`}>
                          {target.stepId}
                        </span>
                      ))}
                      {row.packetReferences.map((reference) => (
                        <span key={`${row.rowId}:${reference.packetId}`}>
                          {reference.packetId}
                        </span>
                      ))}
                      {row.exportReferences.map((reference) => (
                        <span key={`${row.rowId}:${reference.exportId}`}>
                          {reference.exportId}
                        </span>
                      ))}
                      {row.sourcePaths.map((path) => (
                        <span key={`${row.rowId}:${path}`}>{path}</span>
                      ))}
                    </div>
                    <div className="walkthrough-evidence-list">
                      {row.evidenceRows.map((evidence) => (
                        <article
                          key={evidence.rowId}
                          className="briefing-evidence-row"
                        >
                          <span
                            className={`status-chip decision-status-${evidence.decisionStatus}`}
                          >
                            {evidence.decisionStatus.replace(/_/g, " ")}
                          </span>
                          <div>
                            <div className="briefing-evidence-heading">
                              <strong>{evidence.evidenceLabel}</strong>
                              <span>{evidence.source.replace(/_/g, " ")}</span>
                            </div>
                            <p>{evidence.reviewNote}</p>
                            <div className="briefing-evidence-meta">
                              <span>{evidence.decisionLabel}</span>
                              <span>{evidence.target}</span>
                              {evidence.frameId ? <span>{evidence.frameId}</span> : null}
                              {evidence.path ? <span>{evidence.path}</span> : null}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <div className="walkthrough-missing-panel">
                <span className="metric-label">Missing targets</span>
                {view.reviewActionWalkthrough.missingTargetRecords.length ? (
                  <div className="walkthrough-missing-list">
                    {view.reviewActionWalkthrough.missingTargetRecords.map((record) => (
                      <article key={record.target} className="walkthrough-missing-row">
                        <strong>{record.label}</strong>
                        <p>{record.reason}</p>
                        <div className="briefing-evidence-meta">
                          {record.expectedHints.map((hint) => (
                            <span key={`${record.target}:${hint}`}>{hint}</span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="empty-state">
                    All selected action targets resolved to local evidence.
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="playback-scope-notes">
            {view.reviewActionWalkthrough.deferredProductionBoundaryNotes.map(
              (note) => (
                <span key={note}>{note}</span>
              ),
            )}
          </div>
        </section>
      ) : null}

      {view.reviewHandoffRehearsal ? (
        <section
          className="review-handoff-section"
          aria-label="Local review handoff rehearsal"
        >
          <a id="review-handoff-rehearsal" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 18 handoff rehearsal</span>
              <h2>Local review rehearsal script</h2>
            </div>
            <span
              className={`status-chip action-status-${view.reviewHandoffRehearsal.readiness.verdict}`}
            >
              {view.reviewHandoffRehearsal.readiness.verdict.replace(/_/g, " ")}
            </span>
          </div>
          <div className="handoff-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewHandoffRehearsal.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Steps</span>
              <strong>
                {view.reviewHandoffRehearsal.readiness.counts.totalStepCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Local blockers</span>
              <strong>
                {view.reviewHandoffRehearsal.readiness.counts.blockingStepCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Missing targets</span>
              <strong>
                {
                  view.reviewHandoffRehearsal.readiness.counts
                    .missingCheckpointCount
                }
              </strong>
            </div>
          </div>
          <div className="handoff-rehearsal-layout">
            <div className="handoff-step-list">
              {view.reviewHandoffRehearsal.steps.map((step) => (
                <article
                  key={step.stepId}
                  className={`handoff-step handoff-step-${step.missingTargetStatus}`}
                >
                  <div className="handoff-step-heading">
                    <span
                      className={`status-chip action-priority-chip-${step.priority}`}
                    >
                      Step {step.stepNumber}
                    </span>
                    <div>
                      <span className="event-type">
                        {step.blockerCategory.replace(/_/g, " ")}
                      </span>
                      <h3>{step.actionLabel}</h3>
                    </div>
                  </div>
                  <span className="walkthrough-selected-action-id">
                    {step.actionId}
                  </span>
                  <p>{step.reviewerPrompt}</p>
                  <p className="action-readiness-impact">
                    {step.expectedLocalOutcome}
                  </p>
                  <p className="action-next-step">{step.nextLocalStep}</p>
                  <div className="handoff-checkpoint-strip">
                    <span>
                      {step.checkpointCounts.resolvedTargetCount} resolved
                    </span>
                    <span>{step.checkpointCounts.missingTargetCount} missing</span>
                    <span>{step.checkpointCounts.replayFrameCount} frames</span>
                    <span>
                      {step.checkpointCounts.runbookTargetCount} runbook targets
                    </span>
                    <span>{step.checkpointCounts.sourcePathCount} sources</span>
                  </div>
                  {step.missingTargets.length ? (
                    <div className="handoff-missing-targets">
                      {step.missingTargets.map((target) => (
                        <article key={`${step.stepId}:${target.target}`}>
                          <strong>{target.label}</strong>
                          <p>{target.reason}</p>
                        </article>
                      ))}
                    </div>
                  ) : null}
                  <div className="handoff-source-list">
                    {step.sourceEvidenceReferences.map((source) => (
                      <span key={`${step.stepId}:${source}`}>{source}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className="handoff-readiness-panel rehearsal-readiness-panel">
              <span className="metric-label">Rehearsal readiness</span>
              <strong>{view.reviewHandoffRehearsal.readiness.label}</strong>
              <p>{view.reviewHandoffRehearsal.readiness.summary}</p>
              <p className="human-test-gate">
                {view.reviewHandoffRehearsal.nextLocalPrompt}
              </p>
              {view.reviewHandoffRehearsal.unresolvedLocalBlockers.length ? (
                <div className="handoff-blocker-list">
                  {view.reviewHandoffRehearsal.unresolvedLocalBlockers.map(
                    (blocker) => (
                      <article key={blocker.blockerId}>
                        <strong>{blocker.label}</strong>
                        <p>{blocker.reason}</p>
                      </article>
                    ),
                  )}
                </div>
              ) : (
                <p className="empty-state">No local rehearsal blockers remain.</p>
              )}
              <div className="deferred-scope-list">
                {view.reviewHandoffRehearsal.deferredProductionNotes.map(
                  (note) => (
                    <span key={note}>{note}</span>
                  ),
                )}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {view.reviewHandoffCoverageMatrix ? (
        <section
          className="review-coverage-section"
          aria-label="Local review coverage matrix"
        >
          <a id="review-coverage-matrix" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 19 coverage matrix</span>
              <h2>Local review coverage matrix</h2>
            </div>
            <span
              className={`status-chip action-status-${view.reviewHandoffCoverageMatrix.readiness.verdict}`}
            >
              {view.reviewHandoffCoverageMatrix.readiness.verdict.replace(
                /_/g,
                " ",
              )}
            </span>
          </div>
          <div className="coverage-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewHandoffCoverageMatrix.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Rows</span>
              <strong>{view.reviewHandoffCoverageMatrix.readiness.counts.totalRowCount}</strong>
            </div>
            <div>
              <span className="metric-label">Blocking rows</span>
              <strong>{view.reviewHandoffCoverageMatrix.readiness.counts.blockingRowCount}</strong>
            </div>
            <div>
              <span className="metric-label">Missing targets</span>
              <strong>{view.reviewHandoffCoverageMatrix.readiness.counts.missingTargetCount}</strong>
            </div>
            <div>
              <span className="metric-label">Source refs</span>
              <strong>
                {
                  view.reviewHandoffCoverageMatrix.readiness.counts
                    .sourceEvidenceReferenceCount
                }
              </strong>
            </div>
          </div>
          <div className="coverage-matrix-layout">
            <div className="coverage-row-list">
              {view.reviewHandoffCoverageMatrix.rows.map((row) => (
                <article
                  key={row.rowId}
                  className={`coverage-row coverage-row-${row.blockerStatus}`}
                >
                  <div className="coverage-row-heading">
                    <span
                      className={`status-chip action-status-${row.readinessVerdict}`}
                    >
                      Row {row.rowNumber}
                    </span>
                    <div>
                      <span className="event-type">
                        {row.blockerStatus.replace(/_/g, " ")}
                      </span>
                      <h3>{row.rehearsalStepLabel}</h3>
                    </div>
                  </div>
                  <span className="walkthrough-selected-action-id">
                    {row.actionId}
                  </span>
                  <p>{row.blockerSummary}</p>
                  <p className="action-readiness-impact">{row.nextLocalStep}</p>
                  <div className="coverage-checkpoint-strip">
                    <span>
                      {row.targetCoverageCounts.resolvedTargetCount} resolved
                    </span>
                    <span>{row.targetCoverageCounts.missingTargetCount} missing</span>
                    <span>{row.targetCoverageCounts.replayFrameCount} frames</span>
                    <span>
                      {row.targetCoverageCounts.runbookTargetCount} runbook targets
                    </span>
                    <span>{row.targetCoverageCounts.packetReferenceCount} packet refs</span>
                    <span>
                      {row.targetCoverageCounts.exportReferenceCount} export refs
                    </span>
                    <span>{row.targetCoverageCounts.sourcePathCount} source paths</span>
                  </div>
                  <div className="coverage-source-buckets">
                    {row.sourceCoverageBuckets.map((bucket) => (
                      <span key={`${row.rowId}:${bucket.bucketId}`}>
                        {bucket.label}: {bucket.count}
                      </span>
                    ))}
                  </div>
                  <div className="handoff-source-list">
                    {row.sourceEvidenceReferences.map((source) => (
                      <span key={`${row.rowId}:${source}`}>{source}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className="coverage-readiness-panel rehearsal-readiness-panel">
              <span className="metric-label">Matrix readiness</span>
              <strong>{view.reviewHandoffCoverageMatrix.readiness.label}</strong>
              <p>{view.reviewHandoffCoverageMatrix.readiness.summary}</p>
              <p className="human-test-gate">
                {view.reviewHandoffCoverageMatrix.nextLocalPrompt}
              </p>
              <div className="coverage-command-list">
                {view.reviewHandoffCoverageMatrix.localVerificationCommands.map(
                  (command) => (
                    <article
                      key={command.commandId}
                      className="coverage-command-row"
                    >
                      <strong>{command.label}</strong>
                      <code>{command.command}</code>
                      <p>{command.purpose}</p>
                    </article>
                  ),
                )}
              </div>
              {view.reviewHandoffCoverageMatrix.unresolvedLocalBlockers.length ? (
                <div className="coverage-blocker-list">
                  {view.reviewHandoffCoverageMatrix.unresolvedLocalBlockers.map(
                    (blocker) => (
                      <article key={blocker.blockerId}>
                        <strong>{blocker.label}</strong>
                        <p>{blocker.reason}</p>
                      </article>
                    ),
                  )}
                </div>
              ) : (
                <p className="empty-state">No local coverage blockers remain.</p>
              )}
              <div className="deferred-scope-list">
                {view.reviewHandoffCoverageMatrix.deferredProductionNotes.map(
                  (note) => (
                    <span key={note}>{note}</span>
                  ),
                )}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {view.reviewGapTriage ? (
        <section
          className="review-gap-section"
          aria-label="Local review gap triage"
        >
          <a id="review-gap-triage" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 20 gap triage</span>
              <h2>Next local review pass</h2>
            </div>
            <span
              className={`status-chip action-status-${view.reviewGapTriage.readiness.verdict}`}
            >
              {view.reviewGapTriage.readiness.verdict.replace(/_/g, " ")}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewGapTriage.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Items</span>
              <strong>{view.reviewGapTriage.readiness.counts.totalItemCount}</strong>
            </div>
            <div>
              <span className="metric-label">Local blockers</span>
              <strong>
                {view.reviewGapTriage.readiness.counts.localBlockerItemCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Deferred</span>
              <strong>
                {
                  view.reviewGapTriage.readiness.counts
                    .deferredProductionItemCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Proof refs</span>
              <strong>
                {view.reviewGapTriage.readiness.counts.proofCommandCount}
              </strong>
            </div>
          </div>
          <div className="gap-triage-layout">
            <div className="gap-group-list">
              {view.reviewGapTriage.groups.map((group) => (
                <article
                  key={group.groupId}
                  className={`gap-group gap-group-${group.category}`}
                >
                  <div className="gap-group-heading">
                    <div>
                      <span
                        className={`status-chip action-priority-chip-${group.priority}`}
                      >
                        {group.priority.toUpperCase()}
                      </span>
                      <h3>{group.label}</h3>
                    </div>
                    <strong>{group.itemCount}</strong>
                  </div>
                  <p>{group.summary}</p>
                  <div className="gap-item-list">
                    {group.items.map((item) => (
                      <article
                        key={item.itemId}
                        className={`gap-item gap-item-${item.category}`}
                      >
                        <div className="gap-item-heading">
                          <span className="gap-rank">#{item.rank}</span>
                          <div>
                            <span className="event-type">
                              {item.category.replace(/_/g, " ")}
                            </span>
                            <h4>{item.label}</h4>
                          </div>
                        </div>
                        <p>{item.summary}</p>
                        <p className="action-next-step">{item.nextLocalStep}</p>
                        <div className="gap-reference-strip">
                          {item.sourceMatrixRowIds.map((rowId) => (
                            <span key={`${item.itemId}:${rowId}`}>{rowId}</span>
                          ))}
                          {item.sourceActionIds.map((actionId) => (
                            <span key={`${item.itemId}:${actionId}`}>
                              {actionId}
                            </span>
                          ))}
                        </div>
                        <div className="gap-bucket-strip">
                          {item.sourceBuckets.map((bucket) => (
                            <span key={`${item.itemId}:${bucket.bucketId}`}>
                              {bucket.label}: {bucket.count}
                            </span>
                          ))}
                        </div>
                        <div className="gap-proof-strip">
                          {item.proofCommandReferences.map((command) => (
                            <span key={`${item.itemId}:${command.commandId}`}>
                              {command.label}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className="gap-proof-panel">
              <span className="metric-label">Next-pass readiness</span>
              <strong>{view.reviewGapTriage.readiness.label}</strong>
              <p>{view.reviewGapTriage.readiness.summary}</p>
              <p className="human-test-gate">
                {view.reviewGapTriage.staticProofChecklistSummary}
              </p>
              <div className="coverage-command-list">
                {view.reviewGapTriage.proofCommandReferences.map((command) => (
                  <article key={command.commandId} className="coverage-command-row">
                    <strong>{command.label}</strong>
                    <code>{command.command}</code>
                    <p>{command.purpose}</p>
                  </article>
                ))}
              </div>
              {view.reviewGapTriage.localBlockerSummaries.length ? (
                <div className="gap-blocker-list">
                  {view.reviewGapTriage.localBlockerSummaries.map((blocker) => (
                    <article key={blocker.blockerId}>
                      <strong>{blocker.label}</strong>
                      <p>{blocker.reason}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No local triage blockers remain.</p>
              )}
              <div className="gap-deferred-list">
                {view.reviewGapTriage.deferredProductionBoundaries.map(
                  (boundary) => (
                    <article key={boundary.boundaryId}>
                      <strong>{boundary.label}</strong>
                      <p>{boundary.summary}</p>
                    </article>
                  ),
                )}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {view.reviewGapResolution ? (
        <section
          className="review-gap-section"
          aria-label="Local review gap resolution"
        >
          <a id="review-gap-resolution" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 21 gap resolution</span>
              <h2>Resolution proof checklist</h2>
            </div>
            <span
              className={`status-chip action-status-${view.reviewGapResolution.readiness.verdict}`}
            >
              {view.reviewGapResolution.readiness.verdict.replace(/_/g, " ")}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewGapResolution.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Rows</span>
              <strong>
                {
                  view.reviewGapResolution.readiness.counts
                    .totalResolutionRowCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Local targets</span>
              <strong>
                {
                  view.reviewGapResolution.readiness.counts
                    .localActionableRowCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Checklist</span>
              <strong>
                {
                  view.reviewGapResolution.readiness.counts
                    .evidenceTargetChecklistRowCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Proof refs</span>
              <strong>
                {
                  view.reviewGapResolution.readiness.counts
                    .proofCommandReferenceCount
                }
              </strong>
            </div>
          </div>
          <div className="gap-triage-layout gap-resolution-layout">
            <div className="gap-group-list">
              {view.reviewGapResolution.resolutionRows.map((row) => (
                <article
                  key={row.resolutionId}
                  className={`gap-group gap-group-${row.category}`}
                >
                  <div className="gap-group-heading">
                    <div>
                      <span
                        className={`status-chip action-priority-chip-${row.priority}`}
                      >
                        {row.priority.toUpperCase()}
                      </span>
                      <h3>{row.label}</h3>
                    </div>
                    <strong>#{row.rank}</strong>
                  </div>
                  <p>{row.summary}</p>
                  <p className="action-next-step">
                    {row.nextStaticLocalProofStep}
                  </p>
                  <div className="gap-reference-strip">
                    {row.sourceMatrixRowIds.map((rowId) => (
                      <span key={`${row.resolutionId}:${rowId}`}>{rowId}</span>
                    ))}
                    {row.sourceActionIds.map((actionId) => (
                      <span key={`${row.resolutionId}:${actionId}`}>
                        {actionId}
                      </span>
                    ))}
                  </div>
                  <div className="gap-bucket-strip">
                    {row.sourceBuckets.map((bucket) => (
                      <span key={`${row.resolutionId}:${bucket.bucketId}`}>
                        {bucket.label}: {bucket.count}
                      </span>
                    ))}
                  </div>
                  <div className="resolution-target-list">
                    {row.evidenceTargetChecklistRows.map((target) => (
                      <article
                        key={target.targetRowId}
                        className={`resolution-target-row resolution-target-${target.status}`}
                      >
                        <div>
                          <span className="event-type">
                            {target.status.replace(/_/g, " ")}
                          </span>
                          <strong>{target.label}</strong>
                        </div>
                        <p>{target.nextStaticLocalProofStep}</p>
                      </article>
                    ))}
                  </div>
                  <div className="gap-proof-strip">
                    {row.proofCommandReferences.map((command) => (
                      <span key={`${row.resolutionId}:${command.commandId}`}>
                        {command.label}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className="gap-proof-panel">
              <span className="metric-label">Resolution readiness</span>
              <strong>{view.reviewGapResolution.readiness.label}</strong>
              <p>{view.reviewGapResolution.readiness.summary}</p>
              <p className="human-test-gate">
                {view.reviewGapResolution.staticProofChecklistSummary}
              </p>
              <div className="resolution-summary-card">
                <span className="metric-label">Top local blocker</span>
                <strong>
                  {view.reviewGapResolution.localResolutionSummary
                    .topLocalBlockerLabel ?? "No local blockers"}
                </strong>
                <p>
                  {
                    view.reviewGapResolution.localResolutionSummary
                      .nextStaticLocalProofStep
                  }
                </p>
              </div>
              <div className="coverage-command-list">
                {view.reviewGapResolution.proofCommandReferences.map((command) => (
                  <article key={command.commandId} className="coverage-command-row">
                    <strong>{command.label}</strong>
                    <code>{command.command}</code>
                    <p>{command.purpose}</p>
                  </article>
                ))}
              </div>
              <div className="gap-deferred-list">
                {view.reviewGapResolution.deferredBoundaryNotes.map(
                  (boundary) => (
                    <article key={boundary.boundaryId}>
                      <strong>{boundary.label}</strong>
                      <p>{boundary.summary}</p>
                    </article>
                  ),
                )}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {view.reviewPassReadiness ? (
        <section
          className="review-pass-section"
          aria-label="Review-pass readiness evidence map"
        >
          <a id="review-pass-readiness" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 22 review pass</span>
              <h2>Readiness and evidence map</h2>
            </div>
            <span
              className={`status-chip action-status-${view.reviewPassReadiness.readiness.verdict}`}
            >
              {view.reviewPassReadiness.readiness.verdict.replace(/_/g, " ")}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewPassReadiness.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Rows</span>
              <strong>
                {
                  view.reviewPassReadiness.readiness.counts
                    .totalReadinessRowCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Local proof</span>
              <strong>
                {
                  view.reviewPassReadiness.readiness.counts
                    .localProofTargetCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Evidence map</span>
              <strong>
                {view.reviewPassReadiness.readiness.counts.evidenceMapRowCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Deferred</span>
              <strong>
                {
                  view.reviewPassReadiness.readiness.counts
                    .deferredProductionRowCount
                }
              </strong>
            </div>
          </div>
          <div className="review-pass-layout">
            <div className="review-pass-row-list">
              {view.reviewPassReadiness.readinessRows.map((row) => (
                <article
                  key={row.readinessRowId}
                  className={`review-pass-row review-pass-row-${row.status}`}
                >
                  <div className="gap-group-heading">
                    <div>
                      <span
                        className={`status-chip action-priority-chip-${row.priority}`}
                      >
                        {row.priority.toUpperCase()}
                      </span>
                      <h3>{row.label}</h3>
                    </div>
                    <strong>#{row.rank}</strong>
                  </div>
                  <p>{row.summary}</p>
                  <p className="action-next-step">
                    {row.nextStaticReviewPassStep}
                  </p>
                  <div className="gap-reference-strip">
                    <span>{row.sourceResolutionId}</span>
                    {row.sourceMatrixRowIds.map((rowId) => (
                      <span key={`${row.readinessRowId}:${rowId}`}>{rowId}</span>
                    ))}
                    {row.sourceActionIds.map((actionId) => (
                      <span key={`${row.readinessRowId}:${actionId}`}>
                        {actionId}
                      </span>
                    ))}
                  </div>
                  <div className="gap-bucket-strip">
                    {row.sourceBuckets.map((bucket) => (
                      <span key={`${row.readinessRowId}:${bucket.bucketId}`}>
                        {bucket.label}: {bucket.count}
                      </span>
                    ))}
                  </div>
                  <div className="gap-proof-strip">
                    {row.evidenceTargetIds.map((targetId) => (
                      <span key={`${row.readinessRowId}:${targetId}`}>
                        {targetId}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className="review-pass-panel">
              <span className="metric-label">Local pass readiness</span>
              <strong>{view.reviewPassReadiness.readiness.label}</strong>
              <p>{view.reviewPassReadiness.readiness.summary}</p>
              <p className="human-test-gate">
                {view.reviewPassReadiness.staticEvidenceMapSummary}
              </p>
              <div className="review-pass-evidence-map">
                {view.reviewPassReadiness.evidenceMapRows.map((row) => (
                  <article key={row.mapRowId} className="review-pass-map-row">
                    <div>
                      <span className="event-type">
                        {row.status.replace(/_/g, " ")}
                      </span>
                      <strong>{row.label}</strong>
                    </div>
                    <p>{row.nextStaticReviewPassStep}</p>
                    <div className="gap-reference-strip">
                      <span>{row.sourceResolutionId}</span>
                      <span>{row.evidenceTargetId}</span>
                    </div>
                    <div className="gap-proof-strip">
                      {row.proofCommandIds.map((commandId) => (
                        <span key={`${row.mapRowId}:${commandId}`}>
                          {commandId}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <div className="coverage-command-list">
                {view.reviewPassReadiness.proofCommandReferences.map((command) => (
                  <article key={command.commandId} className="coverage-command-row">
                    <strong>{command.label}</strong>
                    <code>{command.command}</code>
                    <p>{command.purpose}</p>
                  </article>
                ))}
              </div>
              <div className="gap-deferred-list">
                {view.reviewPassReadiness.deferredBoundaryNotes.map((boundary) => (
                  <article key={boundary.boundaryId}>
                    <strong>{boundary.label}</strong>
                    <p>{boundary.summary}</p>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {view.reviewPassOutcome ? (
        <section
          className="review-outcome-section"
          aria-label="Review-pass outcome board"
        >
          <a id="review-pass-outcome-board" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 23 review outcome</span>
              <h2>Outcome board and deferred scope ledger</h2>
            </div>
            <span
              className={`status-chip action-status-${view.reviewPassOutcome.candidateOutcome.verdict}`}
            >
              {view.reviewPassOutcome.candidateOutcome.verdict.replace(/_/g, " ")}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewPassOutcome.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Outcome rows</span>
              <strong>
                {
                  view.reviewPassOutcome.candidateOutcome.counts
                    .totalOutcomeRowCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Ready evidence</span>
              <strong>
                {
                  view.reviewPassOutcome.candidateOutcome.counts
                    .readyLocalEvidenceRowCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Local gaps</span>
              <strong>
                {
                  view.reviewPassOutcome.candidateOutcome.counts
                    .unresolvedLocalProofGapCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Deferred</span>
              <strong>
                {
                  view.reviewPassOutcome.candidateOutcome.counts
                    .deferredProductionScopeRowCount
                }
              </strong>
            </div>
          </div>
          <div className="review-outcome-layout">
            <div className="review-outcome-row-list">
              {view.reviewPassOutcome.outcomeRows.map((row) => (
                <article
                  key={row.outcomeRowId}
                  className={`review-outcome-row review-outcome-row-${row.status}`}
                >
                  <div className="gap-group-heading">
                    <div>
                      <span className="status-chip">
                        {row.outcomeBucket.replace(/_/g, " ")}
                      </span>
                      <h3>{row.label}</h3>
                    </div>
                    <strong>#{row.rank}</strong>
                  </div>
                  <p>{row.summary}</p>
                  <p className="action-next-step">
                    {row.nextStaticLocalReviewStep}
                  </p>
                  <div className="gap-reference-strip">
                    {row.sourceReadinessRowIds.map((rowId) => (
                      <span key={`${row.outcomeRowId}:${rowId}`}>{rowId}</span>
                    ))}
                    {row.sourceResolutionIds.map((resolutionId) => (
                      <span key={`${row.outcomeRowId}:${resolutionId}`}>
                        {resolutionId}
                      </span>
                    ))}
                    {row.sourceMatrixRowIds.map((rowId) => (
                      <span key={`${row.outcomeRowId}:${rowId}`}>{rowId}</span>
                    ))}
                    {row.sourceActionIds.map((actionId) => (
                      <span key={`${row.outcomeRowId}:${actionId}`}>
                        {actionId}
                      </span>
                    ))}
                  </div>
                  <div className="gap-bucket-strip">
                    {row.sourceBuckets.map((bucket) => (
                      <span key={`${row.outcomeRowId}:${bucket.bucketId}`}>
                        {bucket.label}: {bucket.count}
                      </span>
                    ))}
                  </div>
                  <div className="gap-proof-strip">
                    {row.evidenceTargetIds.map((targetId) => (
                      <span key={`${row.outcomeRowId}:${targetId}`}>
                        {targetId}
                      </span>
                    ))}
                  </div>
                  <div className="outcome-proof-list">
                    {row.proofCommandReferences.map((command) => (
                      <span key={`${row.outcomeRowId}:${command.commandId}`}>
                        {command.commandId}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className="review-outcome-panel">
              <span className="metric-label">Candidate local outcome</span>
              <strong>{view.reviewPassOutcome.candidateOutcome.label}</strong>
              <p>{view.reviewPassOutcome.candidateOutcome.summary}</p>
              <div className="outcome-note-list">
                {view.reviewPassOutcome.staticVerdictNotes.map((note) => (
                  <article key={note.noteId}>
                    <strong>{note.label}</strong>
                    <p>{note.summary}</p>
                  </article>
                ))}
              </div>
              <div className="outcome-gap-list">
                {view.reviewPassOutcome.localProofGapRows.map((gap) => (
                  <article key={gap.gapRowId}>
                    <span className="event-type">Local proof gap</span>
                    <strong>{gap.label}</strong>
                    <p>{gap.nextStaticLocalReviewStep}</p>
                    <div className="gap-reference-strip">
                      <span>{gap.sourceReadinessRowId}</span>
                      {gap.evidenceTargetIds.map((targetId) => (
                        <span key={`${gap.gapRowId}:${targetId}`}>
                          {targetId}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <div className="outcome-deferred-ledger">
                {view.reviewPassOutcome.deferredScopeLedgerRows.map((row) => (
                  <article key={row.ledgerRowId}>
                    <span className="event-type">
                      {row.actionability.replace(/_/g, " ")}
                    </span>
                    <strong>{row.label}</strong>
                    <p>{row.summary}</p>
                    <div className="gap-reference-strip">
                      {row.sourceReadinessRowIds.map((rowId) => (
                        <span key={`${row.ledgerRowId}:${rowId}`}>{rowId}</span>
                      ))}
                      {row.evidenceTargetIds.map((targetId) => (
                        <span key={`${row.ledgerRowId}:${targetId}`}>
                          {targetId}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <div className="coverage-command-list">
                {view.reviewPassOutcome.proofCommandReferences.map((command) => (
                  <article key={command.commandId} className="coverage-command-row">
                    <strong>{command.label}</strong>
                    <code>{command.command}</code>
                    <p>{command.purpose}</p>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {view.reviewEvidenceTrace ? (
        <section
          className="review-trace-section"
          aria-label="Review evidence trace navigator"
        >
          <a id="review-evidence-trace-navigator" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 24 evidence trace</span>
              <h2>Trace navigator and proof drilldown</h2>
            </div>
            <span
              className={`status-chip action-status-${view.reviewEvidenceTrace.selectedTraceRow.status}`}
            >
              {view.reviewEvidenceTrace.selectedTraceRow.status.replace(/_/g, " ")}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewEvidenceTrace.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Trace rows</span>
              <strong>
                {view.reviewEvidenceTrace.summary.counts.totalTraceRowCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Default trace</span>
              <strong>{view.reviewEvidenceTrace.selectedTraceRow.rank}</strong>
            </div>
            <div>
              <span className="metric-label">Local gaps</span>
              <strong>
                {
                  view.reviewEvidenceTrace.summary.counts
                    .unresolvedLocalProofGapCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Proof refs</span>
              <strong>
                {
                  view.reviewEvidenceTrace.summary.counts
                    .proofCommandReferenceCount
                }
              </strong>
            </div>
          </div>
          <div className="review-trace-layout">
            <div className="review-trace-row-list">
              {view.reviewEvidenceTrace.traceRows.map((row) => (
                <article
                  key={row.traceRowId}
                  className={`review-trace-row review-trace-row-${row.status}`}
                >
                  <div className="gap-group-heading">
                    <div>
                      <span className="status-chip">
                        {row.outcomeBucket.replace(/_/g, " ")}
                      </span>
                      <h3>{row.label}</h3>
                    </div>
                    <strong>#{row.rank}</strong>
                  </div>
                  <p>{row.summary}</p>
                  <p className="action-next-step">
                    {row.nextStaticLocalReviewStep}
                  </p>
                  <div className="trace-source-grid">
                    {row.sourceReferenceGroups.map((group) => (
                      <div key={group.groupId}>
                        <span className="metric-label">{group.label}</span>
                        <div className="gap-reference-strip">
                          {group.sourceIds.map((sourceId) => (
                            <span key={`${group.groupId}:${sourceId}`}>
                              {sourceId}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="gap-bucket-strip">
                    {row.sourceBucketLabels.map((label) => (
                      <span key={`${row.traceRowId}:${label}`}>{label}</span>
                    ))}
                  </div>
                  <div className="outcome-proof-list">
                    {row.proofCommandReferences.map((command) => (
                      <span key={`${row.traceRowId}:${command.commandId}`}>
                        {command.commandId}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className="review-trace-panel">
              <span className="metric-label">Selected trace</span>
              <strong>{view.reviewEvidenceTrace.selectedTraceRow.label}</strong>
              <p>{view.reviewEvidenceTrace.summary.summary}</p>
              <p>{view.reviewEvidenceTrace.staticProofChecklistSummary}</p>
              <div className="trace-segment-list">
                {view.reviewEvidenceTrace.selectedTraceRow.traceSegments.map(
                  (segment) => (
                    <article key={segment.segmentId}>
                      <span className="event-type">
                        {segment.segmentKind.replace(/_/g, " ")}
                      </span>
                      <strong>{segment.label}</strong>
                      <p>{segment.summary}</p>
                      <div className="gap-reference-strip">
                        {segment.sourceReferenceGroupIds.map((groupId) => (
                          <span key={`${segment.segmentId}:${groupId}`}>
                            {groupId}
                          </span>
                        ))}
                        {segment.proofCommandIds.map((commandId) => (
                          <span key={`${segment.segmentId}:${commandId}`}>
                            {commandId}
                          </span>
                        ))}
                      </div>
                    </article>
                  ),
                )}
              </div>
              <div className="trace-deferred-list">
                {view.reviewEvidenceTrace.deferredBoundaryNotes.map((note) => (
                  <article key={note.noteId}>
                    <span className="event-type">
                      {note.actionability.replace(/_/g, " ")}
                    </span>
                    <strong>{note.label}</strong>
                    <p>{note.summary}</p>
                  </article>
                ))}
              </div>
              <div className="coverage-command-list">
                {view.reviewEvidenceTrace.proofCommandReferences.map((command) => (
                  <article key={command.commandId} className="coverage-command-row">
                    <strong>{command.label}</strong>
                    <code>{command.command}</code>
                    <p>{command.purpose}</p>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {view.reviewEvidenceCoverage ? (
        <section
          className="review-evidence-coverage-section"
          aria-label="Review evidence coverage map"
        >
          <a id="review-evidence-coverage-map" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 25 evidence coverage</span>
              <h2>Coverage map and proof-gap board</h2>
            </div>
            <span
              className={`status-chip action-status-${view.reviewEvidenceCoverage.coverageRows[0].status}`}
            >
              {view.reviewEvidenceCoverage.summary.defaultProofBucketLabel}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewEvidenceCoverage.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Coverage rows</span>
              <strong>
                {
                  view.reviewEvidenceCoverage.summary.counts
                    .totalCoverageRowCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Local gaps</span>
              <strong>
                {
                  view.reviewEvidenceCoverage.summary.counts
                    .unresolvedLocalProofGapCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Source buckets</span>
              <strong>
                {
                  view.reviewEvidenceCoverage.summary.counts
                    .sourceBucketLabelCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Static steps</span>
              <strong>
                {
                  view.reviewEvidenceCoverage.summary.counts
                    .staticReviewStepCount
                }
              </strong>
            </div>
          </div>
          <div className="evidence-coverage-layout">
            <div className="evidence-coverage-row-list">
              {view.reviewEvidenceCoverage.coverageRows.map((row) => (
                <article
                  key={row.coverageRowId}
                  className={`evidence-coverage-row evidence-coverage-row-${row.status}`}
                >
                  <div className="gap-group-heading">
                    <div>
                      <span className="status-chip">
                        {row.actionability.replace(/_/g, " ")}
                      </span>
                      <h3>{row.label}</h3>
                    </div>
                    <strong>#{row.rank}</strong>
                  </div>
                  <p>{row.summary}</p>
                  <div className="trace-source-grid">
                    <div>
                      <span className="metric-label">Trace rows</span>
                      <div className="gap-reference-strip">
                        {row.sourceTraceRowIds.map((sourceId) => (
                          <span key={`${row.coverageRowId}:trace:${sourceId}`}>
                            {sourceId}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="metric-label">Outcome rows</span>
                      <div className="gap-reference-strip">
                        {row.sourceOutcomeRowIds.map((sourceId) => (
                          <span key={`${row.coverageRowId}:outcome:${sourceId}`}>
                            {sourceId}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="metric-label">Readiness rows</span>
                      <div className="gap-reference-strip">
                        {row.sourceReadinessRowIds.map((sourceId) => (
                          <span
                            key={`${row.coverageRowId}:readiness:${sourceId}`}
                          >
                            {sourceId}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="metric-label">Resolution rows</span>
                      <div className="gap-reference-strip">
                        {row.sourceResolutionIds.map((sourceId) => (
                          <span
                            key={`${row.coverageRowId}:resolution:${sourceId}`}
                          >
                            {sourceId}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="metric-label">Coverage rows</span>
                      <div className="gap-reference-strip">
                        {row.sourceMatrixRowIds.map((sourceId) => (
                          <span key={`${row.coverageRowId}:matrix:${sourceId}`}>
                            {sourceId}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="metric-label">Evidence targets</span>
                      <div className="gap-reference-strip">
                        {row.evidenceTargetIds.map((targetId) => (
                          <span key={`${row.coverageRowId}:target:${targetId}`}>
                            {targetId}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="gap-bucket-strip">
                    {row.sourceBucketLabels.map((label) => (
                      <span key={`${row.coverageRowId}:source-bucket:${label}`}>
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="gap-proof-strip">
                    {row.proofBucketLabels.map((label) => (
                      <span key={`${row.coverageRowId}:proof-bucket:${label}`}>
                        {label.replace(/_/g, " ")}
                      </span>
                    ))}
                    {row.proofCommandIds.map((commandId) => (
                      <span key={`${row.coverageRowId}:proof:${commandId}`}>
                        {commandId}
                      </span>
                    ))}
                  </div>
                  <div className="evidence-static-step-list">
                    {row.nextStaticReviewSteps.map((step) => (
                      <article key={step.stepId}>
                        <span className="event-type">
                          {step.nonExecutable ? "static check" : "check"}
                        </span>
                        <strong>{step.label}</strong>
                        <p>{step.summary}</p>
                        <div className="gap-reference-strip">
                          <span>{step.repoRelativeReference}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                  {row.deferredBoundaryNotes.length ? (
                    <div className="trace-deferred-list">
                      {row.deferredBoundaryNotes.map((note) => (
                        <article key={`${row.coverageRowId}:${note}`}>
                          <span className="event-type">deferred boundary</span>
                          <p>{note}</p>
                        </article>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
            <aside className="evidence-coverage-panel">
              <span className="metric-label">Default coverage focus</span>
              <strong>
                {view.reviewEvidenceCoverage.summary.defaultProofBucketLabel}
              </strong>
              <p>{view.reviewEvidenceCoverage.summary.summary}</p>
              <p>{view.reviewEvidenceCoverage.staticProofChecklistSummary}</p>
              <div className="evidence-coverage-group-list">
                {view.reviewEvidenceCoverage.coverageGroups.map((group) => (
                  <article key={group.groupId}>
                    <span className="event-type">
                      {group.priority} · {group.status.replace(/_/g, " ")}
                    </span>
                    <strong>{group.proofBucketLabel}</strong>
                    <p>{group.summary}</p>
                    <div className="gap-reference-strip">
                      {group.sourceTraceRowIds.map((traceId) => (
                        <span key={`${group.groupId}:${traceId}`}>{traceId}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <div className="evidence-coverage-bucket-list">
                {view.reviewEvidenceCoverage.bucketRows.map((bucket) => (
                  <article key={bucket.bucketRowId}>
                    <span className="event-type">
                      {bucket.proofBucketLabel}
                    </span>
                    <strong>{bucket.sourceBucketLabel}</strong>
                    <p>{bucket.rowCount} coverage row(s)</p>
                  </article>
                ))}
              </div>
              <div className="trace-deferred-list">
                {view.reviewEvidenceCoverage.deferredBoundaryRollups.map(
                  (rollup) => (
                    <article key={rollup.boundaryId}>
                      <span className="event-type">
                        {rollup.actionability.replace(/_/g, " ")}
                      </span>
                      <strong>{rollup.label}</strong>
                      <p>{rollup.summary}</p>
                      <div className="gap-reference-strip">
                        {rollup.sourceTraceRowIds.map((traceId) => (
                          <span key={`${rollup.boundaryId}:${traceId}`}>
                            {traceId}
                          </span>
                        ))}
                      </div>
                    </article>
                  ),
                )}
              </div>
              <div className="coverage-command-list">
                {view.reviewEvidenceCoverage.proofCommandReferences.map(
                  (command) => (
                    <article
                      key={command.commandId}
                      className="coverage-command-row"
                    >
                      <strong>{command.label}</strong>
                      <code>{command.command}</code>
                      <p>{command.purpose}</p>
                    </article>
                  ),
                )}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {view.reviewProofPriority ? (
        <section
          className="review-proof-priority-section"
          aria-label="Review proof priority radar"
        >
          <a id="review-proof-priority-radar" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 26 proof priority</span>
              <h2>Proof priority lens and static check radar</h2>
            </div>
            <span
              className={`status-chip action-status-${view.reviewProofPriority.defaultPriorityRow.status}`}
            >
              {view.reviewProofPriority.summary.defaultProofBucketLabel}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewProofPriority.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Priority rows</span>
              <strong>
                {
                  view.reviewProofPriority.summary.counts
                    .totalPriorityRowCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Local gaps</span>
              <strong>
                {
                  view.reviewProofPriority.summary.counts
                    .unresolvedLocalProofGapCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Static checks</span>
              <strong>
                {
                  view.reviewProofPriority.summary.counts
                    .staticCheckReferenceCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Deferred context</span>
              <strong>
                {
                  view.reviewProofPriority.summary.counts
                    .deferredBoundaryContextCount
                }
              </strong>
            </div>
          </div>
          <div className="proof-priority-layout">
            <div className="proof-priority-row-list">
              {view.reviewProofPriority.priorityRows.map((row) => (
                <article
                  key={row.priorityRowId}
                  className={`proof-priority-row proof-priority-row-${row.status}`}
                >
                  <div className="gap-group-heading">
                    <div>
                      <span className="status-chip">
                        {row.priority} · {row.actionability.replace(/_/g, " ")}
                      </span>
                      <h3>{row.label}</h3>
                    </div>
                    <strong>#{row.rank}</strong>
                  </div>
                  <p>{row.rankingSummary}</p>
                  <div className="trace-source-grid">
                    <div>
                      <span className="metric-label">Coverage rows</span>
                      <div className="gap-reference-strip">
                        {row.sourceCoverageRowIds.map((sourceId) => (
                          <span key={`${row.priorityRowId}:coverage:${sourceId}`}>
                            {sourceId}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="metric-label">Trace rows</span>
                      <div className="gap-reference-strip">
                        {row.sourceTraceRowIds.map((sourceId) => (
                          <span key={`${row.priorityRowId}:trace:${sourceId}`}>
                            {sourceId}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="metric-label">Outcome rows</span>
                      <div className="gap-reference-strip">
                        {row.sourceOutcomeRowIds.map((sourceId) => (
                          <span key={`${row.priorityRowId}:outcome:${sourceId}`}>
                            {sourceId}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="metric-label">Evidence targets</span>
                      <div className="gap-reference-strip">
                        {row.evidenceTargetIds.map((targetId) => (
                          <span key={`${row.priorityRowId}:target:${targetId}`}>
                            {targetId}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="gap-proof-strip">
                    {row.proofBucketLabels.map((label) => (
                      <span key={`${row.priorityRowId}:proof-bucket:${label}`}>
                        {label.replace(/_/g, " ")}
                      </span>
                    ))}
                    {row.staticReviewStepIds.map((stepId) => (
                      <span key={`${row.priorityRowId}:step:${stepId}`}>
                        {stepId}
                      </span>
                    ))}
                  </div>
                  <div className="proof-priority-reason-list">
                    {row.rankingReasons.map((reason) => (
                      <article key={reason.reasonId}>
                        <span className="event-type">ranking reason</span>
                        <strong>{reason.label}</strong>
                        <p>{reason.summary}</p>
                      </article>
                    ))}
                  </div>
                  {row.deferredBoundaryNotes.length ? (
                    <div className="proof-deferred-list">
                      {row.deferredBoundaryNotes.map((note) => (
                        <article key={`${row.priorityRowId}:${note}`}>
                          <span className="event-type">deferred boundary</span>
                          <p>{note}</p>
                        </article>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
            <aside className="proof-priority-radar-panel">
              <span className="metric-label">Default proof focus</span>
              <strong>{view.reviewProofPriority.defaultPriorityRow.label}</strong>
              <p>{view.reviewProofPriority.summary.summary}</p>
              <p>{view.reviewProofPriority.staticCheckRadarSummary}</p>
              <div className="proof-radar-group-list">
                {view.reviewProofPriority.staticCheckRadarGroups.map((group) => (
                  <article key={group.radarGroupId}>
                    <span className="event-type">
                      {group.priority} · {group.status.replace(/_/g, " ")}
                    </span>
                    <strong>{group.proofBucketLabel}</strong>
                    <p>{group.summary}</p>
                    <div className="gap-reference-strip">
                      {group.sourceCoverageRowIds.map((sourceId) => (
                        <span key={`${group.radarGroupId}:${sourceId}`}>
                          {sourceId}
                        </span>
                      ))}
                    </div>
                    <div className="proof-static-check-list">
                      {group.checks.map((check) => (
                        <article key={check.checkId}>
                          <span className="event-type">
                            {check.nonExecutable ? "static local check" : "check"}
                          </span>
                          <strong>{check.label}</strong>
                          <code>{check.repoRelativeReference}</code>
                        </article>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <div className="proof-deferred-list">
                {view.reviewProofPriority.deferredBoundaryContexts.map(
                  (boundary) => (
                    <article key={boundary.boundaryId}>
                      <span className="event-type">
                        {boundary.actionability.replace(/_/g, " ")}
                      </span>
                      <strong>{boundary.label}</strong>
                      <p>{boundary.summary}</p>
                      <div className="gap-reference-strip">
                        {boundary.sourceCoverageRowIds.map((sourceId) => (
                          <span key={`${boundary.boundaryId}:${sourceId}`}>
                            {sourceId}
                          </span>
                        ))}
                      </div>
                    </article>
                  ),
                )}
              </div>
              <div className="coverage-command-list">
                {view.reviewProofPriority.proofCommandReferences.map(
                  (command) => (
                    <article
                      key={command.commandId}
                      className="coverage-command-row"
                    >
                      <strong>{command.label}</strong>
                      <code>{command.command}</code>
                      <p>{command.purpose}</p>
                    </article>
                  ),
                )}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {view.reviewProofPacket ? (
        <section
          className="review-proof-packet-section"
          aria-label="Review proof packet human gate"
        >
          <a id="review-proof-packet-gate" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 27 proof packet</span>
              <h2>Local proof packet and static human gate</h2>
            </div>
            <span
              className={`status-chip action-status-${view.reviewProofPacket.defaultPacket.status}`}
            >
              {view.reviewProofPacket.defaultPacket.proofBucketLabels[0]}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewProofPacket.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Packets</span>
              <strong>
                {view.reviewProofPacket.summary.counts.totalPacketCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Expected observations</span>
              <strong>
                {
                  view.reviewProofPacket.summary.counts
                    .expectedObservationCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Static gate steps</span>
              <strong>
                {
                  view.reviewProofPacket.summary.counts
                    .staticHumanGateStepCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Command references</span>
              <strong>
                {
                  view.reviewProofPacket.summary.counts
                    .staticCommandReferenceCount
                }
              </strong>
            </div>
          </div>
          <div className="proof-packet-layout">
            <div className="proof-packet-list">
              {view.reviewProofPacket.packets.map((packet) => (
                <article
                  key={packet.packetId}
                  className={`proof-packet-row proof-packet-row-${packet.status}`}
                >
                  <div className="gap-group-heading">
                    <div>
                      <span className="status-chip">
                        {packet.priority} ·{" "}
                        {packet.actionability.replace(/_/g, " ")}
                      </span>
                      <h3>{packet.label}</h3>
                    </div>
                    <strong>#{packet.rank}</strong>
                  </div>
                  <p>{packet.summary}</p>
                  <div className="trace-source-grid">
                    <div>
                      <span className="metric-label">Priority row</span>
                      <div className="gap-reference-strip">
                        <span>{packet.sourcePriorityRowId}</span>
                      </div>
                    </div>
                    <div>
                      <span className="metric-label">Coverage rows</span>
                      <div className="gap-reference-strip">
                        {packet.sourceCoverageRowIds.map((sourceId) => (
                          <span key={`${packet.packetId}:coverage:${sourceId}`}>
                            {sourceId}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="metric-label">Trace rows</span>
                      <div className="gap-reference-strip">
                        {packet.sourceTraceRowIds.map((sourceId) => (
                          <span key={`${packet.packetId}:trace:${sourceId}`}>
                            {sourceId}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="metric-label">Evidence targets</span>
                      <div className="gap-reference-strip">
                        {packet.evidenceTargetIds.map((targetId) => (
                          <span key={`${packet.packetId}:target:${targetId}`}>
                            {targetId}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="proof-packet-section-list">
                    {packet.sections.map((section) => (
                      <article key={section.sectionId}>
                        <span className="event-type">
                          {section.kind.replace(/_/g, " ")}
                        </span>
                        <strong>{section.label}</strong>
                        <p>{section.summary}</p>
                      </article>
                    ))}
                  </div>
                  <div className="proof-packet-observation-list">
                    {packet.expectedObservations.map((observation) => (
                      <article key={observation.observationId}>
                        <span className="event-type">
                          {observation.kind.replace(/_/g, " ")}
                        </span>
                        <strong>{observation.label}</strong>
                        <p>{observation.summary}</p>
                      </article>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className="proof-packet-gate-panel">
              <span className="metric-label">Default packet gate</span>
              <strong>{view.reviewProofPacket.defaultPacket.label}</strong>
              <p>{view.reviewProofPacket.summary.summary}</p>
              <p>{view.reviewProofPacket.staticHumanGateSummary}</p>
              <div className="proof-packet-gate-list">
                {view.reviewProofPacket.defaultPacket.staticHumanGateSteps.map(
                  (step) => (
                    <article key={step.gateStepId}>
                      <span className="event-type">
                        {step.kind.replace(/_/g, " ")}
                      </span>
                      <strong>{step.label}</strong>
                      <p>{step.summary}</p>
                      <code>{step.repoRelativeReference}</code>
                    </article>
                  ),
                )}
              </div>
              <div className="proof-packet-command-list">
                {view.reviewProofPacket.defaultPacket.staticCommandReferences.map(
                  (command) => (
                    <article
                      key={`${view.reviewProofPacket.defaultPacket.packetId}:${command.commandId}`}
                    >
                      <span className="event-type">
                        {command.nonExecutable
                          ? "static command reference"
                          : "command"}
                      </span>
                      <strong>{command.label}</strong>
                      <code>{command.repoRelativeReference}</code>
                    </article>
                  ),
                )}
              </div>
              <div className="proof-packet-deferred-list">
                {view.reviewProofPacket.deferredBoundaryContexts.map(
                  (boundary) => (
                    <article key={boundary.boundaryId}>
                      <span className="event-type">
                        {boundary.actionability.replace(/_/g, " ")}
                      </span>
                      <strong>{boundary.label}</strong>
                      <p>{boundary.summary}</p>
                      <div className="gap-reference-strip">
                        {boundary.sourcePriorityRowIds.map((sourceId) => (
                          <span key={`${boundary.boundaryId}:${sourceId}`}>
                            {sourceId}
                          </span>
                        ))}
                      </div>
                    </article>
                  ),
                )}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {view.reviewProofNavigator ? (
        <section
          className="review-proof-navigator-section"
          aria-label="Review proof navigator source crosswalk"
        >
          <a id="review-proof-navigator" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 28 proof navigator</span>
              <h2>Navigator and source crosswalk</h2>
            </div>
            <span
              className={`status-chip action-status-${view.reviewProofNavigator.defaultNavigatorRow.packetStatus}`}
            >
              {view.reviewProofNavigator.defaultNavigatorRow.laneLabel}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewProofNavigator.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Navigator rows</span>
              <strong>
                {
                  view.reviewProofNavigator.summary.counts
                    .totalNavigatorRowCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Local gaps</span>
              <strong>
                {
                  view.reviewProofNavigator.summary.counts
                    .localProofGapNavigatorRowCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Crosswalk rows</span>
              <strong>
                {
                  view.reviewProofNavigator.summary.counts
                    .sourceCrosswalkRowCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Static prompts</span>
              <strong>
                {
                  view.reviewProofNavigator.summary.counts
                    .staticInspectionPromptCount
                }
              </strong>
            </div>
          </div>
          <div className="proof-navigator-layout">
            <div className="proof-navigator-list">
              {view.reviewProofNavigator.navigatorRows.map((row) => (
                <article
                  key={row.navigatorRowId}
                  className={`proof-navigator-row proof-navigator-row-${row.packetStatus}`}
                >
                  <div className="gap-group-heading">
                    <div>
                      <span className="status-chip">
                        {row.priority} · {row.laneKind.replace(/_/g, " ")}
                      </span>
                      <h3>{row.label}</h3>
                    </div>
                    <strong>#{row.rank}</strong>
                  </div>
                  <p>{row.laneSummary}</p>
                  <p>{row.summary}</p>
                  <div className="trace-source-grid">
                    <div>
                      <span className="metric-label">Proof packet</span>
                      <div className="gap-reference-strip">
                        <span>{row.packetId}</span>
                      </div>
                    </div>
                    <div>
                      <span className="metric-label">Priority row</span>
                      <div className="gap-reference-strip">
                        <span>{row.sourcePriorityRowId}</span>
                      </div>
                    </div>
                    <div>
                      <span className="metric-label">Coverage rows</span>
                      <div className="gap-reference-strip">
                        {row.sourceCoverageRowIds.map((sourceId) => (
                          <span key={`${row.navigatorRowId}:coverage:${sourceId}`}>
                            {sourceId}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="metric-label">Trace rows</span>
                      <div className="gap-reference-strip">
                        {row.sourceTraceRowIds.map((sourceId) => (
                          <span key={`${row.navigatorRowId}:trace:${sourceId}`}>
                            {sourceId}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="gap-proof-strip">
                    {row.evidenceTargetIds.map((targetId) => (
                      <span key={`${row.navigatorRowId}:target:${targetId}`}>
                        {targetId}
                      </span>
                    ))}
                    {row.proofBucketLabels.map((label) => (
                      <span key={`${row.navigatorRowId}:bucket:${label}`}>
                        {label.replace(/_/g, " ")}
                      </span>
                    ))}
                    {row.staticHumanGateStepIds.map((stepId) => (
                      <span key={`${row.navigatorRowId}:gate:${stepId}`}>
                        {stepId}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className="proof-navigator-panel">
              <span className="metric-label">Default navigator row</span>
              <strong>{view.reviewProofNavigator.defaultNavigatorRow.label}</strong>
              <p>{view.reviewProofNavigator.summary.summary}</p>
              <p>{view.reviewProofNavigator.staticNavigatorSummary}</p>
              <div className="proof-navigator-lane-list">
                {view.reviewProofNavigator.reviewLanes.map((lane) => (
                  <article key={lane.laneId}>
                    <span className="event-type">
                      Lane {lane.order} · {lane.laneKind.replace(/_/g, " ")}
                    </span>
                    <strong>{lane.label}</strong>
                    <p>{lane.summary}</p>
                    <div className="gap-reference-strip">
                      {lane.navigatorRowIds.map((rowId) => (
                        <span key={`${lane.laneId}:${rowId}`}>{rowId}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <div className="proof-navigator-crosswalk-list">
                {view.reviewProofNavigator.sourceCrosswalkRows.map((row) => (
                  <article key={row.crosswalkRowId}>
                    <span className="event-type">
                      {row.laneKind.replace(/_/g, " ")}
                    </span>
                    <strong>{row.label}</strong>
                    <p>{row.summary}</p>
                    <div className="gap-reference-strip">
                      <span>{row.sourcePriorityRowId}</span>
                      {row.sourceCoverageRowIds.map((sourceId) => (
                        <span key={`${row.crosswalkRowId}:coverage:${sourceId}`}>
                          {sourceId}
                        </span>
                      ))}
                    </div>
                    <div className="proof-navigator-reference-list">
                      {row.repoRelativeReferences.map((reference) => (
                        <code key={`${row.crosswalkRowId}:${reference}`}>
                          {reference}
                        </code>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <div className="proof-navigator-prompt-list">
                {view.reviewProofNavigator.staticInspectionPrompts.map(
                  (prompt) => (
                    <article key={prompt.promptId}>
                      <span className="event-type">
                        {prompt.kind.replace(/_/g, " ")}
                      </span>
                      <strong>{prompt.label}</strong>
                      <p>{prompt.summary}</p>
                      <div className="gap-reference-strip">
                        {prompt.staticHumanGateStepIds.map((stepId) => (
                          <span key={`${prompt.promptId}:${stepId}`}>
                            {stepId}
                          </span>
                        ))}
                      </div>
                    </article>
                  ),
                )}
              </div>
              <div className="proof-navigator-boundary-list">
                {view.reviewProofNavigator.deferredBoundaryMarkers.map(
                  (marker) => (
                    <article key={marker.markerId}>
                      <span className="event-type">
                        {marker.actionability.replace(/_/g, " ")}
                      </span>
                      <strong>{marker.label}</strong>
                      <p>{marker.summary}</p>
                    </article>
                  ),
                )}
              </div>
              <div className="proof-navigator-command-list">
                {view.reviewProofNavigator.staticCommandReferences.map(
                  (command) => (
                    <article key={command.commandId}>
                      <span className="event-type">
                        {command.nonExecutable
                          ? "static command reference"
                          : "command"}
                      </span>
                      <strong>{command.label}</strong>
                      <code>{command.repoRelativeReference}</code>
                    </article>
                  ),
                )}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {view.reviewProofReconciliation ? (
        <section
          className="review-proof-reconciliation-section"
          aria-label="Review proof-chain reconciliation map"
        >
          <a id="review-proof-reconciliation" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">
                Stage 29 proof reconciliation
              </span>
              <h2>Proof-chain consistency map</h2>
            </div>
            <span className="status-chip">
              {
                view.reviewProofReconciliation.defaultReconciliationRow
                  .bucketLabel
              }
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>
                {view.reviewProofReconciliation.contractLabel}
              </strong>
            </div>
            <div>
              <span className="metric-label">Rows</span>
              <strong>
                {
                  view.reviewProofReconciliation.summary.counts
                    .totalReconciliationRowCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Inspection gaps</span>
              <strong>
                {
                  view.reviewProofReconciliation.summary.counts
                    .localInspectionGapRowCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Deferred</span>
              <strong>
                {
                  view.reviewProofReconciliation.summary.counts
                    .deferredProductionBoundaryRowCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Static refs</span>
              <strong>
                {
                  view.reviewProofReconciliation.summary.counts
                    .staticReviewReferenceCount
                }
              </strong>
            </div>
          </div>
          <div className="proof-reconciliation-layout">
            <div className="proof-reconciliation-list">
              {view.reviewProofReconciliation.reconciliationRows.map((row) => (
                <article
                  key={row.reconciliationRowId}
                  className={`proof-reconciliation-row proof-reconciliation-row-${row.bucketKind}`}
                >
                  <div className="gap-group-heading">
                    <div>
                      <span className="status-chip">
                        {row.priority} · {row.bucketKind.replace(/_/g, " ")}
                      </span>
                      <h3>{row.label}</h3>
                    </div>
                    <strong>#{row.rank}</strong>
                  </div>
                  <p>{row.bucketSummary}</p>
                  <div className="trace-source-grid">
                    <div>
                      <span className="metric-label">Navigator row</span>
                      <div className="gap-reference-strip">
                        <span>{row.navigatorRowId}</span>
                      </div>
                    </div>
                    <div>
                      <span className="metric-label">Proof packet</span>
                      <div className="gap-reference-strip">
                        <span>{row.packetId}</span>
                      </div>
                    </div>
                    <div>
                      <span className="metric-label">Priority row</span>
                      <div className="gap-reference-strip">
                        <span>{row.sourcePriorityRowId}</span>
                      </div>
                    </div>
                    <div>
                      <span className="metric-label">Static prompts</span>
                      <div className="gap-reference-strip">
                        {row.staticInspectionPromptIds.map((promptId) => (
                          <span
                            key={`${row.reconciliationRowId}:prompt:${promptId}`}
                          >
                            {promptId}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="proof-reconciliation-segment-list">
                    {row.sourceChainSegments.map((segment) => (
                      <div
                        key={segment.segmentId}
                        className={
                          segment.complete
                            ? "proof-reconciliation-segment proof-reconciliation-segment-complete"
                            : "proof-reconciliation-segment proof-reconciliation-segment-gap"
                        }
                      >
                        <span className="event-type">
                          {segment.kind.replace(/_/g, " ")}
                        </span>
                        <strong>{segment.label}</strong>
                        <div className="gap-reference-strip">
                          {segment.sourceIds.length ? (
                            segment.sourceIds.map((sourceId) => (
                              <span
                                key={`${segment.segmentId}:${sourceId}`}
                              >
                                {sourceId}
                              </span>
                            ))
                          ) : (
                            <span>no local marker</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className="proof-reconciliation-panel">
              <span className="metric-label">Default reconciliation row</span>
              <strong>
                {
                  view.reviewProofReconciliation.defaultReconciliationRow
                    .label
                }
              </strong>
              <p>{view.reviewProofReconciliation.summary.summary}</p>
              <p>{view.reviewProofReconciliation.staticReconciliationSummary}</p>
              <div className="proof-reconciliation-bucket-list">
                {view.reviewProofReconciliation.consistencyBuckets.map(
                  (bucket) => (
                    <article key={bucket.bucketId}>
                      <span className="event-type">
                        Bucket {bucket.order} ·{" "}
                        {bucket.bucketKind.replace(/_/g, " ")}
                      </span>
                      <strong>{bucket.label}</strong>
                      <p>{bucket.summary}</p>
                      <div className="gap-reference-strip">
                        {bucket.reconciliationRowIds.map((rowId) => (
                          <span key={`${bucket.bucketId}:${rowId}`}>
                            {rowId}
                          </span>
                        ))}
                      </div>
                    </article>
                  ),
                )}
              </div>
              <div className="proof-reconciliation-reference-list">
                {view.reviewProofReconciliation.staticReviewReferences.map(
                  (reference) => (
                    <article key={reference.referenceId}>
                      <span className="event-type">
                        {reference.kind.replace(/_/g, " ")}
                      </span>
                      <strong>{reference.label}</strong>
                      <p>{reference.summary}</p>
                      <code>{reference.repoRelativeReference}</code>
                    </article>
                  ),
                )}
              </div>
              <div className="proof-reconciliation-boundary-list">
                {view.reviewProofReconciliation.deferredBoundaryNotes.map(
                  (note) => (
                    <article key={note.noteId}>
                      <span className="event-type">
                        {note.actionability.replace(/_/g, " ")}
                      </span>
                      <strong>{note.label}</strong>
                      <p>{note.summary}</p>
                      <div className="gap-reference-strip">
                        {note.evidenceTargetIds.map((targetId) => (
                          <span key={`${note.noteId}:${targetId}`}>
                            {targetId}
                          </span>
                        ))}
                      </div>
                    </article>
                  ),
                )}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      <section className="incident-section" aria-label="Fault incident timeline">
        <a id="fault-incident-timeline" className="section-anchor" />
        <div className="section-heading">
          <div>
            <span className="metric-label">Manual Stage 07 incident</span>
            <h2>Fault-to-alert chain</h2>
          </div>
          {view.incident.latestEventAt ? (
            <span className="event-time">{view.incident.latestEventAt}</span>
          ) : null}
        </div>
        <div className="active-faults">
          {view.incident.activeFaults.map((fault) => (
            <article key={fault.faultId} className="fault-row">
              <span
                className={`status-chip status-${
                  fault.status === "active" ? "critical" : "nominal"
                }`}
              >
                {fault.status}
              </span>
              <div>
                <h3>{fault.faultType}</h3>
                <p>{fault.summary}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="event-timeline">
          {view.incident.timeline.map((event) => (
            <article key={event.eventId} className="event-row">
              <span className={`status-dot status-${event.severity ?? "info"}`} />
              <div>
                <span className="event-type">{event.eventType}</span>
                <p>{event.message}</p>
                {event.channelId ? <strong>{event.channelId}</strong> : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      {view.replay ? (
        <section className="replay-section" aria-label="Replay anomaly inspection">
          <a id="replay-anomaly-inspection" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Replay inspection window</span>
              <h2>Timeline markers and anomalies</h2>
            </div>
            <span className="event-time">{view.replay.windowLabel}</span>
          </div>
          <div className="replay-summary">
            <div>
              <span className="metric-label">Samples</span>
              <strong>{view.replay.sampleCount}</strong>
            </div>
            <div>
              <span className="metric-label">Markers</span>
              <strong>{view.replay.markerCount}</strong>
            </div>
            <div>
              <span className="metric-label">Anomalies</span>
              <strong>{view.replay.anomalyCount}</strong>
            </div>
          </div>
          <div className="replay-grid">
            <div className="replay-marker-list">
              {view.replay.timelineMarkers.map((marker) => (
                <article key={marker.markerId} className="event-row">
                  <span className={`status-dot status-${marker.severity}`} />
                  <div>
                    <span className="event-type">{marker.markerType}</span>
                    <p>{marker.message}</p>
                    {marker.channelId ? <strong>{marker.channelId}</strong> : null}
                  </div>
                </article>
              ))}
            </div>
            <div className="anomaly-list">
              {view.replay.topAnomalies.map((anomaly) => (
                <article key={anomaly.anomalyId} className="anomaly-row">
                  <div>
                    <span className="channel-id">{anomaly.channelId}</span>
                    <h3>{anomaly.channelName}</h3>
                    <p>{anomaly.reason}</p>
                  </div>
                  <span className={`score-pill status-${anomaly.severity}`}>
                    {anomaly.scoreLabel}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className="console-grid">
        <aside className="subsystem-rail" aria-label="Subsystem selector">
          {view.subsystems.map((subsystem) => (
            <button
              key={subsystem.id}
              className={
                subsystem.id === view.selectedSubsystem.id
                  ? "subsystem-button selected"
                  : "subsystem-button"
              }
              type="button"
              onClick={() => onSelectSubsystem(subsystem.id)}
            >
              <span>
                <span className={`status-dot status-${subsystem.status}`} />
                {subsystem.label}
              </span>
              <strong>{subsystem.channelCount}</strong>
            </button>
          ))}
        </aside>

        <section className="detail-panel" aria-label="Selected subsystem details">
          <div className="section-heading">
            <div>
              <span className="metric-label">Selected subsystem</span>
              <h2>{view.selectedSubsystem.label}</h2>
            </div>
            <span
              className={`status-chip status-${view.selectedSubsystem.status}`}
            >
              {view.selectedSubsystem.status}
            </span>
          </div>

          <div className="channel-list">
            {view.selectedSubsystem.channels.map((channel) => (
              <article key={channel.channelId} className="channel-row">
                <div>
                  <span className="channel-id">{channel.channelId}</span>
                  <h3>{channel.name}</h3>
                  <p>{channel.description}</p>
                </div>
                <div className="channel-readout">
                  <strong>{channel.formattedValue}</strong>
                  <span className={`status-chip status-${channel.status}`}>
                    {channel.status}
                  </span>
                  <span>Nominal {channel.nominalRangeLabel}</span>
                  <span>Warning {channel.warningRangeLabel}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="trend-section" aria-label="Selected telemetry trends">
        <div className="section-heading">
          <div>
            <span className="metric-label">Deterministic Stage 03 trend window</span>
            <h2>Selected telemetry trends</h2>
          </div>
        </div>
        <div className="trend-grid">
          {view.trends.map((trend) => (
            <article key={trend.channelId} className="trend-panel">
              <div className="trend-heading">
                <div>
                  <span className="channel-id">{trend.channelId}</span>
                  <h3>{trend.name}</h3>
                </div>
                <span className={`status-chip status-${trend.status}`}>
                  {trend.status}
                </span>
              </div>
              <TrendSparkline trend={trend} />
              <div className="trend-stats">
                <span>
                  first <strong>{trend.firstValue}</strong>
                </span>
                <span>
                  last <strong>{trend.lastValue}</strong>
                </span>
                <span>
                  min <strong>{trend.minimum}</strong>
                </span>
                <span>
                  max <strong>{trend.maximum}</strong>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="alerts-section" aria-label="Alert lifecycle">
        <a id="alert-lifecycle" className="section-anchor" />
        <div className="section-heading">
          <div>
            <span className="metric-label">Threshold-first alert records</span>
            <h2>Alert lifecycle</h2>
          </div>
        </div>
        <div className="alert-groups">
          <div className="alert-group">
            <h3>Active alerts</h3>
            <div className="alert-list">
              {activeAlerts.length ? (
                activeAlerts.map((alert) => (
                  <article key={alert.alertId} className="alert-row">
                    <span className={`status-chip status-${alert.severity}`}>
                      {alert.severity}
                    </span>
                    <div>
                      <h4>{alert.channelId}</h4>
                      <p>{alert.message}</p>
                      <p className="recommended-action">
                        {alert.recommendedAction}
                      </p>
                    </div>
                    <button
                      className="alert-action"
                      type="button"
                      onClick={() => onAcknowledgeAlert(alert.alertId)}
                    >
                      Acknowledge
                    </button>
                  </article>
                ))
              ) : (
                <p className="empty-state">No active alerts remain.</p>
              )}
            </div>
          </div>
          <div className="alert-group">
            <h3>Acknowledged alerts</h3>
            <div className="alert-list">
              {acknowledgedAlerts.length ? (
                acknowledgedAlerts.map((alert) => (
                  <article key={alert.alertId} className="alert-row">
                    <span className={`status-chip status-${alert.severity}`}>
                      {alert.severity}
                    </span>
                    <div>
                      <h4>{alert.channelId}</h4>
                      <p>{alert.message}</p>
                      <p className="recommended-action">
                        {alert.operatorNote}
                      </p>
                      <p className="acknowledgement-meta">
                        Acknowledged by {alert.acknowledgedBy ?? "operator"} at{" "}
                        {alert.acknowledgedAt}
                      </p>
                    </div>
                    <button
                      className="alert-action"
                      type="button"
                      onClick={() => onResolveAlert(alert.alertId)}
                    >
                      Resolve
                    </button>
                  </article>
                ))
              ) : (
                <p className="empty-state">
                  Acknowledged alerts will remain visible here.
                </p>
              )}
            </div>
          </div>
          <div className="alert-group">
            <h3>Resolved alerts</h3>
            <div className="alert-list">
              {resolvedAlerts.length ? (
                resolvedAlerts.map((alert) => (
                  <article key={alert.alertId} className="alert-row">
                    <span className={`status-chip status-${alert.severity}`}>
                      {alert.severity}
                    </span>
                    <div>
                      <h4>{alert.channelId}</h4>
                      <p>{alert.message}</p>
                      <p className="recommended-action">
                        {alert.resolutionNote}
                      </p>
                      <p className="acknowledgement-meta">
                        Resolved by {alert.resolvedBy ?? "operator"} at{" "}
                        {alert.resolvedAt}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <p className="empty-state">
                  Resolved alerts will remain visible here.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
