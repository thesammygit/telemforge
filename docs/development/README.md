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
25. [Review Evidence Coverage Map And Proof Gap Board](steps/25-review-evidence-coverage-map-and-proof-gap-board.md)
26. [Local Review Proof Priority And Static Check Radar](steps/26-local-review-proof-priority-and-static-check-radar.md)
27. [Local Review Proof Packet And Human Test Gate](steps/27-local-review-proof-packet-and-human-test-gate.md)
28. [Review Proof Navigator And Source Crosswalk](steps/28-review-proof-navigator-and-source-crosswalk.md)
29. [Review Proof Chain Reconciliation And Local Consistency Map](steps/29-review-proof-chain-reconciliation-and-local-consistency-map.md)
30. [Review Surface Index And Local Navigation Map](steps/30-review-surface-index-and-local-navigation-map.md)
31. [Review Walkthrough Path And Static Prompt Deck](steps/31-review-walkthrough-path-and-static-prompt-deck.md)
32. [Review Observation Lens And Static Attention Map](steps/32-review-observation-lens-and-static-attention-map.md)
33. [Review Observation Coverage And Static Blind-Spot Map](steps/33-review-observation-coverage-and-static-blind-spot-map.md)
34. [Review Observation Citation Trail And Local Source Map](steps/34-review-observation-citation-trail-and-local-source-map.md)
35. [Review Observation Boundary Ledger And Static Deferred Map](steps/35-review-observation-boundary-ledger-and-static-deferred-map.md)
36. [Review Observation Boundary Walkthrough And Static Source Path](steps/36-review-observation-boundary-walkthrough-and-static-source-path.md)
37. [Review Observation Storyline And Static Evidence Path](steps/37-review-observation-storyline-and-static-evidence-path.md)
38. [Review Observation Handoff Deck And Static Review Path](steps/38-review-observation-handoff-deck-and-static-review-path.md)
39. [Review Observation Handoff Coverage And Static Gap Map](steps/39-review-observation-handoff-coverage-and-static-gap-map.md)
40. [Review Observation Handoff Questions And Static Prompt Rail](steps/40-review-observation-handoff-questions-and-static-prompt-rail.md)
41. [Review Observation Handoff Agenda And Static Facilitation Guide](steps/41-review-observation-handoff-agenda-and-static-facilitation-guide.md)
42. [Review Observation Handoff Path And Static Anchor Map](steps/42-review-observation-handoff-path-and-static-anchor-map.md)
43. [Review Observation Handoff Dry Run And Static Cue Sheet](steps/43-review-observation-handoff-dry-run-and-static-cue-sheet.md)
44. [Review Observation Handoff Debrief And Static Follow-Up Map](steps/44-review-observation-handoff-debrief-and-static-follow-up-map.md)
45. [Review Observation Handoff Continuity Snapshot And Static Next-Pass Map](steps/45-review-observation-handoff-continuity-snapshot-and-static-next-pass-map.md)
46. [Review Observation Handoff Drift Guard And Static Regression Map](steps/46-review-observation-handoff-drift-guard-and-static-regression-map.md)
47. [Review Observation Handoff Calibration Board And Static Alignment Notes](steps/47-review-observation-handoff-calibration-board-and-static-alignment-notes.md)
48. [Review Observation Handoff Synthesis Map And Static Relay Notes](steps/48-review-observation-handoff-synthesis-map-and-static-relay-notes.md)
49. [Review Observation Handoff Relay Trail And Static Inspection Notes](steps/49-review-observation-handoff-relay-trail-and-static-inspection-notes.md)
50. [Review Observation Handoff Source Crosswalk And Static Anchor Notes](steps/50-review-observation-handoff-source-crosswalk-and-static-anchor-notes.md)
51. [Review Observation Handoff Source Walkthrough And Static Review Prompts](steps/51-review-observation-handoff-source-walkthrough-and-static-review-prompts.md)
52. [Review Observation Handoff Source Readout And Static Review Cues](steps/52-review-observation-handoff-source-readout-and-static-review-cues.md)
53. [Review Observation Handoff Source Readiness Board And Static Review Checks](steps/53-review-observation-handoff-source-readiness-board-and-static-review-checks.md)
54. [Review Observation Handoff Source Readiness Rehearsal And Static Reviewer Prompts](steps/54-review-observation-handoff-source-readiness-rehearsal-and-static-reviewer-prompts.md)
55. [Review Observation Handoff Source Readiness Question Board And Static Follow-Up Prompts](steps/55-review-observation-handoff-source-readiness-question-board-and-static-follow-up-prompts.md)
56. [Review Observation Handoff Source Readiness Response Matrix And Static Evidence Notes](steps/56-review-observation-handoff-source-readiness-response-matrix-and-static-evidence-notes.md)
57. [Review Observation Handoff Source Readiness Response Walkthrough And Static Reviewer Cues](steps/57-review-observation-handoff-source-readiness-response-walkthrough-and-static-reviewer-cues.md)
58. [Review Observation Handoff Source Readiness Response Trace Map And Static Source Alignment Notes](steps/58-review-observation-handoff-source-readiness-response-trace-map-and-static-source-alignment-notes.md)
59. [Review Observation Handoff Source Readiness Response Trace Coverage Board And Static Gap Notes](steps/59-review-observation-handoff-source-readiness-response-trace-coverage-board-and-static-gap-notes.md)
60. [Review Observation Handoff Source Readiness Response Trace Coverage Review Path And Static Handoff Prompts](steps/60-review-observation-handoff-source-readiness-response-trace-coverage-review-path-and-static-handoff-prompts.md)
61. [Review Observation Handoff Source Readiness Response Trace Coverage Readiness Brief And Static Reviewer Cues](steps/61-review-observation-handoff-source-readiness-response-trace-coverage-readiness-brief-and-static-reviewer-cues.md)
62. [Review Observation Handoff Source Readiness Response Trace Coverage Readiness Review Lane And Static Human-Check Prompts](steps/62-review-observation-handoff-source-readiness-response-trace-coverage-readiness-review-lane-and-static-human-check-prompts.md)
63. [Review Observation Handoff Source Readiness Response Trace Coverage Readiness Review Synthesis And Static Follow-Up Notes](steps/63-review-observation-handoff-source-readiness-response-trace-coverage-readiness-review-synthesis-and-static-follow-up-notes.md)
64. [Review Observation Handoff Source Readiness Response Trace Coverage Readiness Review Synthesis Follow-Up Triage And Static Check Prompts](steps/64-review-observation-handoff-source-readiness-response-trace-coverage-readiness-review-synthesis-follow-up-triage-and-static-check-prompts.md)
65. [Review Observation Handoff Follow-Up Readiness Brief And Static Reviewer Prompts](steps/65-review-observation-handoff-follow-up-readiness-brief-and-static-reviewer-prompts.md)
66. [Review Observation Handoff Follow-Up Readiness Review Board And Static Question Prompts](steps/66-review-observation-handoff-follow-up-readiness-review-board-and-static-question-prompts.md)
67. [Review Observation Handoff Follow-Up Readiness Rehearsal Path And Static Answer Prep Prompts](steps/67-review-observation-handoff-follow-up-readiness-rehearsal-path-and-static-answer-prep-prompts.md)
68. [Review Observation Handoff Follow-Up Readiness Answer Coverage And Static Reviewer Check Prompts](steps/68-review-observation-handoff-follow-up-readiness-answer-coverage-and-static-reviewer-check-prompts.md)
69. [Review Observation Handoff Follow-Up Readiness Answer Walkthrough And Static Review Notes](steps/69-review-observation-handoff-follow-up-readiness-answer-walkthrough-and-static-review-notes.md)
70. [Review Observation Handoff Follow-Up Readiness Answer Source Crosswalk And Static Follow-Up Prompts](steps/70-review-observation-handoff-follow-up-readiness-answer-source-crosswalk-and-static-follow-up-prompts.md)
71. [Review Observation Handoff Follow-Up Readiness Answer Follow-Up Review Lane And Static Decision Cues](steps/71-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-and-static-decision-cues.md)
72. [Review Observation Handoff Follow-Up Readiness Answer Follow-Up Review Lane Source Recap And Static Next-Pass Prompts](steps/72-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-and-static-next-pass-prompts.md)
73. [Review Observation Handoff Follow-Up Readiness Answer Follow-Up Review Lane Source Recap Review Path And Static Reviewer Checks](steps/73-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-and-static-reviewer-checks.md)
74. [Review Observation Handoff Follow-Up Readiness Answer Follow-Up Review Lane Source Recap Review Path Coverage Matrix And Static Readiness Cues](steps/74-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-and-static-readiness-cues.md)
75. [Review Observation Handoff Follow-Up Readiness Answer Follow-Up Review Lane Source Recap Review Path Coverage Review Path And Static Coverage Prompts](steps/75-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-review-path-and-static-coverage-prompts.md)
76. [Review Observation Handoff Follow-Up Readiness Answer Follow-Up Review Lane Source Recap Review Path Coverage Review Response Map And Static Follow-Up Prompts](steps/76-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-review-response-map-and-static-follow-up-prompts.md)
77. [Review Observation Handoff Follow-Up Readiness Answer Follow-Up Review Lane Source Recap Review Path Coverage Review Response Map Review Path And Static Response Prompts](steps/77-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-review-response-map-review-path-and-static-response-prompts.md)
78. [Review Observation Handoff Follow-Up Readiness Answer Follow-Up Review Lane Source Recap Review Path Coverage Review Response Map Review Path Response Prompt Readiness Board And Static Answer Checks](steps/78-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-review-response-map-review-path-response-prompt-readiness-board-and-static-answer-checks.md)
79. [Review Observation Handoff Follow-Up Readiness Answer Follow-Up Review Lane Source Recap Review Path Coverage Review Response Map Review Path Response Prompt Readiness Board Answer Review Path And Static Constraint Notes](steps/79-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-review-response-map-review-path-response-prompt-readiness-board-answer-review-path-and-static-constraint-notes.md)

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
