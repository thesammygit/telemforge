# TelemForge Development Path

This folder defines a human-centric way to build TelemForge without one-shotting the whole system.

Current rule: do not keep runnable backend/frontend implementation code in the repo before the relevant stage is approved. Placeholder workspace README files and fixture directories are allowed when a stage explicitly calls for conventions or human-testable artifacts.

The intent is:

- small, reviewable steps
- explicit design decisions before implementation
- real artifacts at each stage
- visible data and behavior over hidden complexity
- AI collaboration that teaches, compares options, and pauses for review

## How To Use This Folder

For each stage:

1. read the stage file
2. choose the design options that fit the project
3. build only that stage
4. run the human test gate
5. review the logic and outputs
6. let the AI explain what changed, why it works, and what options remain
7. only then move forward

## Recommended Sequence

0. [Working Agreement](steps/00-working-agreement.md)
1. [Stack And Workspace Decisions](steps/01-stack-and-workspace.md)
2. [Telemetry Contracts And Fixtures](steps/02-telemetry-contracts-and-fixtures.md)
3. [Simulation Spike And Visualization](steps/03-simulation-spike-and-visualization.md)
4. [API Skeleton And Storage](steps/04-api-skeleton-and-storage.md)
5. [Live Console Foundation](steps/05-live-console-foundation.md)
6. [Faults, Alerts, And Events](steps/06-faults-alerts-and-events.md)
7. [Replay And Anomaly Layer](steps/07-replay-and-anomaly.md)
8. [Hardening, Docker, And Release](steps/08-hardening-docker-and-release.md)

## Development Rules

- Do not skip from idea to full integration.
- Do not introduce scaffolding before the stage that actually needs it.
- Prefer artifacts that a human can inspect:
  - plots
  - tables
  - static JSON fixtures
  - screenshots
  - small API responses
  - simple UI states
- Prefer tests that explain behavior, not just line coverage.
- Treat design decisions as first-class artifacts, not side comments.

## Required Companion Docs

- [Working Principles](principles.md)
- [Review Loop](review-loop.md)
- [ADR Template](adr-template.md)
- [Workspace Conventions](workspace-conventions.md)
- [Decision Records](decisions/README.md)

## What The AI Should Do At Each Stage

At each stage the AI should:

- restate the stage goal in plain language
- present 2-3 realistic options where design choices matter
- recommend one option and explain why
- implement only the agreed stage
- show how to test it as a human
- explain what is happening internally
- call out what remains uncertain or deferred

The AI should not:

- jump ahead multiple stages without review
- hide tradeoffs
- treat “it compiles” as enough
- replace human review with automated confidence
