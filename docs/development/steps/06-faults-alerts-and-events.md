# Stage 06: Faults, Alerts, And Events

## Goal

Make the system operationally interactive.

## Why This Stage Exists

Until faults and alerts are visible, TelemForge is mostly a data viewer. This stage creates incident behavior that humans can trigger and inspect.

## Decisions To Make

### Alerting Style

Option A: threshold rules first

- easiest to explain
- best for operator trust

Option B: anomaly-only alerts

- more flexible later
- harder to explain early

Recommended: `Option A` first.

### Fault Scope

Option A: immediate manual faults only

- easiest to test
- enough for V1

Option B: immediate plus scheduled faults

- better replay stories
- slightly more complexity

Recommended: `Option B` if it stays understandable.

## Work Items

- add fault injection controls
- record injected faults in history
- generate operator-facing alerts
- log event transitions clearly
- make the UI show the causal chain

## Human Test Gate

A human should be able to:

- inject a fault
- observe the telemetry change
- observe the alert or event response
- explain the causal story in plain language

## Test Preference

Favor:

- fault-to-telemetry behavior tests
- alert rule tests
- event log tests

## AI Teaching Agenda

- explain how faults enter the system
- explain why each alert fired
- explain how events differ from alerts

## Exit Criteria

- incident flows are visible and understandable
- humans can validate the system reaction logic
