# TelemForge Agent Rules

This repository is public.

## Mandatory public-repo safety gate

Every agent, Codex automation, repo-hygiene worker, and human-driven automation that stages, commits, pushes, opens a PR, publishes a release, or writes a handoff must treat secret/private-data hygiene as a hard blocker.

Before any commit, push, PR, release, or automation handoff:

1. Run `python3 scripts/public_repo_guard.py --scan-history` from the repo root.
2. Inspect `git status --porcelain=v1 --branch`, `git diff`, and `git diff --cached` so only intended files are staged.
3. Do not commit credentials, API keys, tokens, cookies, private keys, local absolute paths, contact details, messaging metadata, transcripts, screenshots, logs, local databases, agent prompts, agent runtime state, generated machine state, or private run artifacts.
4. Keep local automation/control-plane files outside git. The `docs/automation/` tree is intentionally ignored.
5. Use relative repository paths in docs and examples.
6. If the guard or manual review flags anything, remove the private material first, rerun the guard, and only then commit or push. Do not weaken the guard to pass a dirty repo.
7. After pushing, confirm the GitHub `Public Repo Guard` workflow succeeds. A failed GitHub guard means the push is not acceptable until fixed.

No automation may bypass this gate because a task is “only docs,” “only state,” “urgent,” or “already reviewed.”
