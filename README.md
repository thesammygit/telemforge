# TelemForge

TelemForge is an open-source synthetic telemetry and mission-operations project template. This repository provides starter backend/frontend structure, neutral engineering documentation, and Docker scaffolding for the initial project workspace.

## Template Contents

- FastAPI backend skeleton for simulation, telemetry, alerts, replay, and anomaly workflows
- React + Vite frontend shell for a mission-control-style console
- Docker Compose template for API, web, and PostgreSQL services
- architecture, API, and roadmap documentation

## Repository Layout

```text
apps/
  api/
    app/
      api/
      core/
      domain/
  web/
docs/
docker-compose.yml
```

## Intended Scope

The repository is set up for:

- synthetic subsystem simulation
- live telemetry transport
- alerting and fault injection
- replay workflow support
- anomaly scoring overlays

The current code is intentionally skeletal so dedicated implementation agents can build each subsystem out independently.

## Notes

- Keep the product positioning focused on operator tooling and simulation.
- Treat the current code as scaffolding, not a finished mission-ops platform.
- Keep anomaly methods explainable in the early implementation phases.
