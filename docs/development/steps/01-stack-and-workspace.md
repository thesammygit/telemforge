# Stage 01: Stack And Workspace Decisions

## Goal

Pick the initial implementation stack and repo conventions before building behavior.

## Decisions To Make

### Backend Language

Option A: Python

- very strong for simulation, data inspection, and anomaly prototyping
- easy to teach and debug
- good fit with FastAPI

Option B: TypeScript/Node

- single-language full stack
- good for web-heavy teams
- weaker default ecosystem for quick simulation and scientific tooling

Recommended: `Python` for this project.

### Backend Framework

Option A: FastAPI

- fast iteration
- strong typing and docs
- easy websocket support

Option B: Flask

- simpler mental model
- more assembly required

Option C: Django

- heavier than needed for V1

Recommended: `FastAPI`.

### Frontend Stack

Option A: React + Vite

- fast local iteration
- large ecosystem
- easy to layer UI complexity gradually

Option B: Next.js

- useful for SSR-heavy apps
- unnecessary weight for a local-first mission console

Recommended: `React + Vite`.

### Charting Direction

Option A: start with SVG and simple custom charts

- best for learning and inspection
- minimal dependency overhead

Option B: adopt a charting library immediately

- faster to get polished charts
- more abstraction earlier

Recommended: start simple, then introduce a charting library only if hand-rolled charts become the bottleneck.

## Work Items

- record chosen stack
- define folder conventions
- define code ownership boundaries
- define doc and ADR expectations

## Human Test Gate

A human should be able to explain:

- why Python was or was not chosen
- why FastAPI was or was not chosen
- why React + Vite was or was not chosen
- what would cause a future re-evaluation

## AI Teaching Agenda

- explain the tradeoffs of Python vs TypeScript for simulation-heavy work
- explain why lightweight tools help early-stage feedback loops

## Exit Criteria

- stack decisions are recorded
- repo conventions are understood
- the team is ready to define data contracts
