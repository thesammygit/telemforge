# TelemForge

TelemForge is an open-source synthetic telemetry and mission-operations sandbox project.

This repository is intentionally starting from scratch. At this point it is a planning and design workspace, not an implementation workspace.

## Current Contents

- architecture, API, and roadmap documentation
- a staged human-in-the-loop development path under `docs/development/`
- no checked-in backend or frontend implementation yet

## Repository Layout

```text
docs/
```

## Intended Scope

The project is intended to grow into:

- synthetic subsystem simulation
- live telemetry transport
- alerting and fault injection
- replay workflow support
- anomaly scoring overlays

Implementation should be added only stage by stage after the relevant design choices are reviewed.

## Human-Centric Development Path

If you do not want to build TelemForge in one shot, start with:

- [Development Path](/Users/sam./Desktop/spaceProjects/telemforge/docs/development/README.md)
- [Working Principles](/Users/sam./Desktop/spaceProjects/telemforge/docs/development/principles.md)
- [Review Loop](/Users/sam./Desktop/spaceProjects/telemforge/docs/development/review-loop.md)

That track is designed for:

- stepwise implementation
- explicit design decisions at each stage
- human-testable milestones
- visible data and behavior before deep abstraction
- AI-assisted teaching and option analysis at each checkpoint

## Notes

- Keep the product positioning focused on operator tooling and simulation.
- Do not add implementation scaffolding before the stage explicitly calls for it.
- Keep anomaly methods explainable in the early implementation phases.
