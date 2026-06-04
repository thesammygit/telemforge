# TelemForge Development Path

This folder defines a human-centric way to build TelemForge without one-shotting the whole system.

Current rule: continue development through bounded, reviewable stages. The stage policy is [Stage Policy](stage-policy.md); it explicitly forbids forever-stages and requires new numbered stages when scope changes.

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
9. [Realtime Performance And Rust Data Plane](steps/09-realtime-performance-and-rust-data-plane.md)
10. [Operator Workflow And Incident Lifecycle](steps/10-operator-workflow-and-incident-lifecycle.md)
11. [Scenario Runbooks And Guided Playback](steps/11-scenario-runbooks-and-guided-playback.md)
12. [Incident Review Packets And Evidence Export](steps/12-incident-review-packets-and-evidence-export.md)
13. [Replay Playback And Review Timeline](steps/13-replay-playback-and-review-timeline.md)
14. [Review Decision Register And Handoff Checklist](steps/14-review-decision-register-and-handoff-checklist.md)
15. [Review Briefing Board And Evidence Drilldown](steps/15-review-briefing-board-and-evidence-drilldown.md)
16. [Review Action Queue And Handoff Readiness](steps/16-review-action-queue-and-handoff-readiness.md)
17. [Action Evidence Walkthrough And Local Handoff Path](steps/17-action-evidence-walkthrough-and-local-handoff-path.md)
18. [Local Review Handoff Rehearsal And Readiness Script](steps/18-local-review-handoff-rehearsal-and-readiness-script.md)
19. [Local Review Coverage Matrix And Command Checklist](steps/19-local-review-coverage-matrix-and-command-checklist.md)
20. [Review Gap Triage And Next-Pass Plan](steps/20-review-gap-triage-and-next-pass-plan.md)
21. [Review Gap Resolution Playbook And Evidence Target Checklist](steps/21-review-gap-resolution-playbook-and-evidence-target-checklist.md)
22. [Review Pass Readiness Summary And Local Evidence Map](steps/22-review-pass-readiness-summary-and-local-evidence-map.md)
23. [Review Pass Outcome Board And Deferred Scope Ledger](steps/23-review-pass-outcome-board-and-deferred-scope-ledger.md)
24. [Review Evidence Trace Navigator And Local Proof Drilldown](steps/24-review-evidence-trace-navigator-and-local-proof-drilldown.md)

Future stages should be added as new numbered files when the next work crosses a new product domain, risk profile, or review gate. Do not keep appending unrelated work to the current stage.

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
- keep adding unrelated work to a stage whose exit criteria are already satisfied
- hide tradeoffs
- treat “it compiles” as enough
- replace human review with automated confidence
