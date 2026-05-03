# TelemForge Local Runbook

This is the canonical Stage 08 local path for reviewers.

## Mandatory Verification Before Handoff

Run these from the repository root:

```text
python3 scripts/smoke_stage08.py
python3 scripts/benchmark_stage09_realtime.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-report.json
python3 -m unittest discover -s tests/backend
python3 -m unittest discover -s tests/contracts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
```

The smoke command creates a temporary/local SQLite database, exercises the current backend workflow, and prints a JSON summary. It does not start a long-lived server and does not require Docker.
The Stage 09 benchmark command creates the current local realtime baseline report with telemetry sample rate, p95 alert latency, p95 replay query latency, dropped-event count, and the explicit Rust data-plane boundary.

## Backend Local Server

Install backend dependencies, then start FastAPI:

```text
python3 -m pip install -r backend/requirements.txt
python3 -m uvicorn backend.app.main:app --reload
```

Check health:

```text
curl -s http://127.0.0.1:8000/health
```

Run the same workflow without starting a server:

```text
python3 scripts/smoke_stage08.py
```

Use `--database PATH` only when you want the smoke output stored at a specific fresh SQLite path.

## Stage 09 Realtime Baseline

Run the bounded realtime benchmark without starting a server:

```text
python3 scripts/benchmark_stage09_realtime.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-report.json
```

This uses the current Python/FastAPI control-plane path as the measured
baseline. Rust remains the tracked data-plane direction for telemetry ingest,
stream fanout, replay indexing, and alert/anomaly hot paths once benchmark
evidence justifies a narrow migration.

## Frontend Local Server

Install frontend dependencies, then start Vite:

```text
cd frontend
npm install
npm run dev
```

Open the printed Vite localhost URL. The current console is fixture-backed and mirrors the Stage 07 replay/anomaly state.

Frontend logic can be checked without installing Vite dependencies:

```text
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
```

From inside `frontend/`, the same check is available as:

```text
npm run test
```

## Docker Compose Local Review

The Compose files are for local review only.

Validate configuration before any build or run:

```text
docker compose config
```

If Docker is available and local resource guard conditions are safe, start the local stack:

```text
docker compose up --build
```

Then inspect:

```text
curl -s http://127.0.0.1:8000/health
```

Stop the stack with `Ctrl-C`. Do not push images or publish releases from this workflow.
