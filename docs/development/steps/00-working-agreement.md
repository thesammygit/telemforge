# Stage 00: Working Agreement

## Goal

Agree on how TelemForge will be built before writing substantial code.

## Why This Stage Exists

Without a working agreement, AI-assisted development tends to overbuild, skip review, and hide design decisions inside implementation.

## Decisions To Make

### Option A: One-shot feature delivery

- fastest apparent progress
- weakest human review loop
- highest risk of logic drift

### Option B: strict stage gates

- slower at first
- best for learning and review
- best for catching design mistakes early

### Option C: hybrid

- allows small bundled steps
- still requires explicit stage exits

Recommended: `Option B` unless the team has already stabilized the architecture elsewhere.

## Work Items

- adopt the docs in `docs/development/`
- agree that each stage ends with a human review
- agree that AI must explain changes and tradeoffs
- agree to record meaningful design decisions
- agree that no implementation scaffolding should remain unless the stage explicitly calls for it

## Human Test Gate

The team should be able to answer:

- what stage are we in
- what is allowed in this stage
- what will prove the stage is done
- what decisions still need review

## AI Teaching Agenda

The AI should explain:

- why staged development reduces risk
- why visible artifacts beat hidden complexity early
- how the review loop works

## Exit Criteria

- the team accepts the staged workflow
- the repository contains planning docs only, unless the team explicitly approved a first implementation stage
- the next stage is selected deliberately
