# Human-Centric Development Principles

## 1. Make The Data Visible Early

Before building a full backend or frontend, make the data visible in simple forms:

- JSON fixtures
- CSV tables
- CLI summaries
- quick plots
- tiny static UI mock states

If the team cannot look at the data and say “this makes sense,” the system is not ready for deeper integration.

## 2. Separate Decisions From Coding

Every meaningful implementation step should start with a small design checkpoint:

- what problem are we solving now
- what are the realistic options
- what are the tradeoffs
- what are we intentionally not solving yet

If a stage has not approved code creation yet, the repository should remain implementation-free for that area.

## 3. Prefer Human Test Gates Over Hidden Confidence

Every stage should include a test a human can perform directly:

- run a script and inspect the output
- open a page and confirm the state
- trigger a fault and watch a visible change
- compare expected and actual telemetry behavior

## 4. Teach While Building

The AI should explain:

- what changed
- what modules exist
- how the control flow works
- why a library or pattern was chosen
- what other options were reasonable

## 5. Build The Simplest Truthful Slice First

Do not begin with the most complete system. Begin with the smallest slice that is:

- coherent
- demonstrable
- testable
- extensible

## 6. Lock Interfaces Before Adding Complexity

Before adding live streaming, replay, or anomaly scoring, stabilize:

- telemetry channel shape
- subsystem state shape
- event shape
- alert shape
- replay payload shape

## 7. Favor Explanation-Friendly Technology

When choosing languages, libraries, and frameworks, bias toward tools that are:

- readable by humans
- well-documented
- easy to debug
- easy to inspect locally
- unlikely to hide critical behavior

## 8. Defer Abstraction Until Repetition Is Real

Do not generalize early for hypothetical future needs. Wait until repetition is visible in the code or data model.

## 9. Treat Docs As Part Of The Build

Docs should be updated as decisions are made, not retroactively.

## 10. Make “Why” Easy To Recover

Every stage should leave behind enough documentation that someone new can answer:

- why this step exists
- why this option was chosen
- how it was tested
- what the next step is
