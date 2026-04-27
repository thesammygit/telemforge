# TelemForge Automation Control

Updated: `2026-04-27T16:00:30Z`

This file is the human/Hermes control plane for TelemForge automations. All Codex automations must read this file, `docs/automation/inbox/`, and `docs/automation/state/human_overrides.json` before planning, executing, or writing project files.

## Current Mode

- mode: `normal`
- autonomy: `full_automation_until_human_only_blocker`
- canonical source repo: `/Users/sam./Projects/telemforge`
- canonical automation workspace: `/Users/sam./Projects/telemforge-automation`
- automation branch: `codex/telemforge-automation-workspace`

## Portfolio Goal

Build TelemForge into a polished open-source spacecraft telemetry and mission-operations sandbox that a new user can run locally, understand quickly, demo live telemetry/fault/replay behavior, and trust as a credible portfolio artifact.

## Sam Directives

- Sam accepted the long-term portfolio-grade mission-ops/telemetry product goal.
- Sam chose full automation: do not pause for manual stage approval unless a blocker can only be fixed by human intervention.
- Sam approved creating the automation worktree, aliases, control-plane files, Codex automations, local commits, and automatic pushes to origin from the automation branch.
- Sam approved implementation code after stage readiness; Executor may build stage-by-stage without asking again.
- Sam accepted the recommended stack: Python + FastAPI, React + Vite, SQLite for local/tests, PostgreSQL later for compose/runtime.

## Stage Policy

Automations must still honor the repo's staged development philosophy, but stage transitions are automated:

1. complete the current stage's work items;
2. run automated verification and human-testable artifact checks where possible;
3. record decisions/tradeoffs in docs and state;
4. write a run note explaining what changed and how a human can inspect it;
5. Planner may advance to the next stage automatically when exit criteria are satisfied.

Do not jump to full integration in one task. Build one coherent stage slice at a time.

## Classification Semantics

- `operational_blocker`: repo/workspace/test/tooling failure, impossible instruction, missing required credential, corrupted artifact, external service failure, or unsafe action boundary.
- `completed`: stage/task completed and verified.
- `completed_with_findings`: task completed but found caveats or follow-up work.
- `completed_no_candidate`: option/design path rejected with evidence; not a project blocker.
- `human_needed`: only when the next required action needs Sam: credentials, paid APIs, destructive cleanup, force-push, deploy/release/publish, legal/licensing decision, or ambiguity that automation cannot safely resolve.

## Allowed Automatically

- Create/update docs, ADRs, planning artifacts, source code, tests, fixtures, and local dev scaffolding inside the automation branch.
- Install/use open-source dependencies through normal package managers when needed.
- Run tests/builds/lints/smokes.
- Make local commits after verification.
- Push the automation branch to origin.
- Create narrow `.gitignore` updates for generated local artifacts.

## Not Allowed Without Sam

- Force-push or rewrite history.
- Merge to main.
- Publish releases/packages/images or deploy external services.
- Use paid APIs or create cloud resources with cost.
- Commit secrets or edit credentials.
- Delete historical/source data beyond safe generated cleanup.
- Broad destructive cleanup such as `git reset --hard` or unscoped `git clean`.

## Current Strategic Priority

Bootstrap the automation control plane, then complete Stage 01 stack/workspace decisions and move into Stage 02 telemetry contracts/fixtures.
