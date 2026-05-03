# TelemForge Release Readiness

Stage 08 prepares the repository for review, not for publication.

## Ready For Local Review

- Backend health, session, simulation, fault, telemetry, alert, event, replay, and anomaly paths have a bounded smoke command.
- Backend tests and contract tests can run with standard `unittest`.
- Frontend view-model logic has a tiny Node test that does not require the Vite dependency set.
- Local Docker/Compose files exist for configuration validation and optional local review.
- Reviewer-facing run commands are documented in [Local Runbook](local-runbook.md).

## Mandatory Before Handoff

```text
python3 scripts/smoke_stage08.py
python3 -m unittest discover -s tests/backend
python3 -m unittest discover -s tests/contracts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
git diff --check
```

## Optional When Available And Safe

```text
docker compose config
npm --prefix frontend run test
npm --prefix frontend run build
docker compose up --build
```

Skip optional commands when dependencies are not installed, Docker is unavailable, network access is restricted, or local memory pressure makes the run unsafe.

`npm --prefix frontend run build` requires the frontend dependency set. Do not install dependencies or build containers during a constrained local review unless the local resource guard is healthy.

## Not A Release Yet

Do not perform these actions from Stage 08:

- publish packages or container images;
- deploy services;
- create cloud resources;
- merge to the default branch;
- force-push or rewrite history;
- edit credentials, secrets, or production configuration.

## Deferred Before A Public Release

- Frontend dependency lockfile generation.
- Full Vite build verification from a fresh install.
- Container build/run verification on a machine with Docker available and safe resources.
- PostgreSQL runtime profile if the project chooses to move beyond SQLite for compose/runtime.
- Release notes and version tagging.

## Post-Stage 08 Local Review: 2026-04-30

The bounded local review confirmed the mandatory reviewer path:

```text
python3 scripts/smoke_stage08.py
python3 -m unittest discover -s tests/backend
python3 -m unittest discover -s tests/contracts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
```

Additional safe checks passed:

```text
npm --prefix frontend run test
docker compose config
```

`frontend/node_modules` was not present, so Vite build verification and container build/run verification remain deferred. No deploy, release, publish, package/image push, cloud resource creation, paid API use, credential/secret/prod-config edit, merge, force-push, or destructive cleanup was performed.

Concrete next-milestone deferred work:

- Generate and commit a frontend lockfile from a safe dependency install.
- Run `npm --prefix frontend run build` after the dependency set is present.
- Run Docker image build and compose runtime smoke on a machine with safe memory pressure.
- Decide whether the local Compose runtime should add a PostgreSQL profile before public release.
- Add websocket streaming and realtime latency/throughput benchmarks before treating the runtime as time-sensitive.
- Plan a Rust data-plane spike for telemetry ingest, replay indexing, stream fanout, and alert/anomaly hot paths after benchmark targets are explicit.
- Prepare release notes and version tagging only after the above checks pass.
