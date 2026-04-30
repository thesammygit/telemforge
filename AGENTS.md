# TelemForge Agent Rules

This repository is public.

Before any commit, push, PR, release, or automation handoff:

1. Run `python3 scripts/public_repo_guard.py --scan-history` from the repo root.
2. Do not commit credentials, API keys, tokens, cookies, private keys, local absolute paths, contact details, messaging metadata, transcripts, screenshots, logs, local databases, agent prompts, agent runtime state, or generated machine state.
3. Keep local automation/control-plane files outside git. The `docs/automation/` tree is intentionally ignored.
4. Use relative repository paths in docs and examples.
5. If the guard flags anything, remove it before pushing. Do not weaken the guard to pass a dirty repo.
