# Review Loop

Use this loop at the end of every stage.

## Before Implementation

- State the exact stage goal.
- List the decisions that must be made now.
- List 2-3 viable options.
- Pick a recommendation and explain why.

## During Implementation

- Keep the scope inside the current stage.
- Prefer visible artifacts first.
- Add unit or integration tests only for behavior introduced in this stage.
- Keep a short log of what was added and what was deferred.

## Human Review Checklist

- Does the output make sense to a human reading it cold?
- Can I explain the logic without relying on the implementation details?
- Are the naming choices clear?
- Is the behavior visible in a script, API response, or UI state?
- Do the tests match the intended behavior?
- Did we choose a reasonable library or did we overcomplicate it?

## AI Teaching Checklist

The AI should explain:

- the current architecture slice
- the control flow for the stage
- why the chosen option was recommended
- what tradeoffs were rejected
- what signals would justify changing the design later

## Exit Gate

Do not move to the next stage until:

- the human test gate passed
- the human reviewed the outputs
- the design choice was recorded
- the AI explained the implementation and tradeoffs
