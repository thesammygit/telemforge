# Stage 07: Replay And Anomaly Layer

## Goal

Add historical playback and explainable anomaly signals only after the mission history is trustworthy.

## Decisions To Make

### Replay Source

Option A: rebuild history from raw telemetry only

- simple model
- weaker contextual replay

Option B: replay telemetry plus alerts, events, and faults

- much better incident understanding
- slightly more payload design work

Recommended: `Option B`.

### First Anomaly Method

Option A: rolling z-score / envelope deviation

- explainable
- easy to review

Option B: heavier ML model

- potentially richer
- much harder to trust early

Recommended: `Option A`.

## Work Items

- expose replay windows
- annotate replay with faults and alerts
- compute simple anomaly scores
- explain the anomaly reasons in plain language
- show anomaly overlays in the UI

## Human Test Gate

A reviewer should be able to:

- replay a fault window
- identify what changed and when
- understand why the anomaly score increased
- decide whether the anomaly is plausible or noisy

## Test Preference

Favor:

- replay payload tests
- anomaly explanation tests
- timeline marker tests

## AI Teaching Agenda

- explain how replay windows are assembled
- explain how anomaly scores are computed
- explain the limits of the current detector

## Exit Criteria

- replay is useful for incident review
- anomaly outputs are legible and explainable
