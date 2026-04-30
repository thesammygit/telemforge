# TelemForge Architecture

This document describes the target architecture. It does not imply that the modules below already exist in the repository.

## Product Direction

TelemForge is structured as an operator-facing mission-operations sandbox. The core workflow is:

1. simulate subsystem state
2. stream telemetry and events
3. monitor alerts and anomaly indicators
4. inject faults
5. replay notable mission periods

## Planned Backend Modules

- `app/api/`
  HTTP routes and request/response contracts
- `app/core/`
  configuration, settings, shared dependencies
- `app/domain/`
  simulation, telemetry, alerting, replay, and anomaly logic

## Planned Frontend Areas

- mission overview
- telemetry explorer
- subsystem detail
- fault injection controls
- replay and anomaly views

## Persistence Targets

- missions
- telemetry points
- alerts
- injected faults
- anomaly outputs

## Current State

- there is no checked-in backend implementation yet
- there is no checked-in frontend implementation yet
- architecture decisions should be confirmed stage by stage before code is introduced
