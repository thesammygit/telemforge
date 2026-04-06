# TelemForge API Outline

This is a target API outline for future stages. No API implementation is currently checked in.

## Baseline Routes

- `GET /health`
- `GET /meta`

## Planned Routes

- `GET /missions`
- `GET /missions/{mission_id}`
- `GET /telemetry`
- `GET /alerts`
- `POST /faults/inject`
- `GET /replay/{mission_id}`
- `GET /anomaly`

## Data Contracts To Flesh Out

- mission session summary
- telemetry channel definition
- alert record
- fault injection request
- replay session payload
- anomaly score summary
