# TelemForge Roadmap

This file now acts as the short-form roadmap. The detailed, human-reviewable build path lives in [docs/development/README.md](/Users/sam./Desktop/spaceProjects/telemforge/docs/development/README.md).

## Build Order

1. keep the repo implementation-free until the working agreement and stack choices are reviewed
2. choose the working stack and repo conventions
3. define telemetry contracts and static fixture data
4. build the deterministic simulation in isolation with visible outputs
5. add API boundaries and persistence around validated data flows
6. ship a live mission console against known-good sample data, then live data
7. add faults, alerts, and event logging with human-observable behavior
8. add replay and anomaly scoring only after history is trustworthy
9. harden, dockerize, and document the operating workflow

## Guiding Principle

Every stage should be:

- human testable
- reviewable for logic before the next stage begins
- teachable by the AI agent with options and tradeoffs, not just implementation
