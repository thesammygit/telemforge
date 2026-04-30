# Stage 03: Simulation Spike And Visualization

## Goal

Build the deterministic simulation as an isolated, inspectable unit before wrapping it in a service.

## Why This Stage Exists

If the underlying telemetry does not look believable, no amount of API or UI polish will rescue the system.

## Decisions To Make

### First Simulation Form

Option A: embed simulation directly in the API

- fewer files initially
- harder to inspect and test in isolation

Option B: standalone simulation module with CLI or script runner

- easiest to visualize and reason about
- easier to test determinism

Recommended: `Option B`.

### First Visualization Method

Option A: CLI tables only

- fastest
- weaker intuition for trends

Option B: quick plots or CSV export plus tables

- best human review value
- slightly more setup

Recommended: `Option B`.

## Work Items

- implement deterministic stepping with a seed
- produce nominal time-series output
- produce at least one degraded scenario output
- visualize key channels over time
- confirm that the data tells a coherent story

## Human Test Gate

A human should be able to look at plots or tables and answer:

- what subsystem behavior looks nominal
- what changed under a fault or scenario change
- whether the transitions feel coherent
- whether the simulation is reproducible

## Test Preference

Favor:

- determinism tests
- envelope/range tests
- scenario comparison tests

## AI Teaching Agenda

- explain how the simulation step function works
- explain how seeds produce reproducibility
- explain how to tell whether a curve “looks wrong”

## Exit Criteria

- deterministic outputs exist
- visible plots or summaries exist
- a human reviewed the simulation logic and data signatures
