# Stage 05: Live Console Foundation

## Goal

Build the UI foundation against known-good data before chasing full real-time complexity.

## Decisions To Make

### UI Build Order

Option A: full dashboard first

- faster visual impact
- harder to debug

Option B: one view at a time

- easier review and better logic checks

Recommended: `Option B`.

### Data Source Strategy

Option A: live-only immediately

- exciting demo path
- harder to debug

Option B: static fixture mode first, then live mode

- easier UI validation
- much better for human review

Recommended: `Option B`.

## Work Items

- create a mission overview
- add a subsystem detail panel
- show telemetry trends for a small selected set of channels
- ensure the UI works well with fixture data first
- then connect it to live API responses

## Human Test Gate

A reviewer should be able to answer:

- what mission state am I looking at
- which subsystem is healthy or degraded
- which channels matter for that subsystem
- whether the charts and values make sense together

## Test Preference

Favor:

- build verification
- small UI logic tests for formatters/selectors
- visual smoke checks

## AI Teaching Agenda

- explain the UI state model
- explain how data moves from API to component
- explain what is intentionally missing at this stage

## Exit Criteria

- the live console can be used to inspect telemetry coherently
- humans can review the displayed logic and layout
