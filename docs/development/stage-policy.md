# TelemForge Stage Policy

TelemForge should keep developing indefinitely, but it must not let any stage
become a forever bucket.

This policy is binding for Planner, Executor, Governor, and human review. When
it conflicts with stale embedded automation prompt text, use this policy plus
`docs/automation/control.md`, `docs/automation/state/human_overrides.json`, and
`docs/automation/state/stage_state.json` as the higher-priority source.

## Continuous Development Rule

- Always keep a next useful project stage available while the project remains
  active.
- A stage is a bounded product/research milestone, not an open-ended label.
- Once a stage's exit criteria are satisfied, mark it `review_ready` or
  `completed`, write the stage-closeout evidence, and move the next work into a
  new numbered stage.
- Main-branch fast-forward/review can remain a separate human integration gate;
  it must not freeze automation-branch development when the next stage is safe.

## When To Split A New Stage

Create a new stage instead of extending the current one when any of these are
true:

1. the proposed work crosses a new product domain or user workflow;
2. the current stage would need more than a couple coherent Executor sessions;
3. the stage has accumulated proof/validator/artifact maintenance instead of
   source-bearing product progress;
4. exit criteria are already satisfied and the next work is an improvement,
   integration, UX, persistence, deployment, or runtime-hardening follow-up;
5. the work changes the risk profile: credentials, cloud, deploy/release,
   production auth, data migration, long-running service ownership, or broad
   runtime replacement.

## Stage Size Target

A healthy stage should have:

- one clear operator/user-facing capability or one clear technical risk;
- 3-7 work items;
- a human test gate;
- explicit non-goals;
- objective exit criteria;
- a short closeout artifact that says what was proven and what remains deferred.

If a stage needs a long list of validators, digest indexes, compatibility gates,
or repeated proof-only runs, split the underlying goal and queue the smallest
source-bearing next slice.

## Stage States

Use these values in automation state:

- `planned`: documented but not active.
- `active`: current source-bearing work belongs here.
- `review_ready`: exit criteria are met; next work should be a closeout/review or
  next-stage task, not more feature accretion.
- `completed`: closeout accepted for automation-branch development.
- `blocked`: a real operational/safety blocker prevents safe work.
- `superseded`: replaced by a clearer later stage.

## Planner Rules

Planner must:

1. read this file, `docs/automation/control.md`, inbox directives, human
   overrides, and `stage_state.json` before selecting work;
2. if the current stage is `review_ready` or `completed`, queue a stage-exit or
   next-stage task instead of adding probes to the closed stage;
3. keep current tasks source-bearing when product code is safe;
4. write `queue/current_task.md` with allowed files, non-goals, verification,
   and a human test gate;
5. create or update a numbered `docs/development/steps/NN-*.md` file when a new
   stage starts;
6. keep Stage 09 closed unless a targeted regression is found.

## Executor Rules

Executor must:

1. follow `queue/current_task.md` over stale prompt text;
2. do one bounded coherent slice;
3. avoid proof-only closeouts unless the current task is explicitly a review or
   gate task;
4. commit and push only verified allowed-scope changes to `origin/automation`;
5. leave `docs/automation/` ignored and sync it through the bridge;
6. mark `human_needed` for credentials, paid services, production deploy/release,
   destructive cleanup, broad rewrites, or heavy local work outside the resource
   guard.

## Current Transition

Stage 95 is review-ready/completed for automation-branch development. It proved
a deterministic local constraint-response evidence-gap follow-up coverage-review
response-readiness review-path revision coverage review path and static revision
follow-up prompt surface over the Stage 94 revision coverage board.

New work should begin in Stage 96 unless a focused Stage 95 regression is found.
