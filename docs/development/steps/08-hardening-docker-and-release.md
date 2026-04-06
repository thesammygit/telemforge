# Stage 08: Hardening, Docker, And Release

## Goal

Make the system easy to run, verify, and hand off.

## Decisions To Make

### Verification Scope

Option A: rely on unit tests only

- faster
- insufficient for an interactive system

Option B: combine unit, API, UI build, and end-to-end smoke checks

- stronger confidence
- more setup

Recommended: `Option B`.

### Container Strategy

Option A: dockerize at the end

- avoids early container friction
- okay if local dev is already stable

Option B: dockerize too early

- creates infra work before core logic is trusted

Recommended: dockerize late, after the slices are already working locally.

## Work Items

- finalize Compose setup
- ensure local-first commands are documented
- add end-to-end smoke verification
- tighten docs so a new contributor can follow the path

## Human Test Gate

A reviewer should be able to:

- follow the docs and run the system
- understand which checks are mandatory
- confirm the compose stack and local stack behave the same at a high level

## Test Preference

Favor:

- end-to-end smoke checks
- startup health verification
- Docker config validation

## AI Teaching Agenda

- explain what changed between local and containerized runtime
- explain how to debug startup and integration failures

## Exit Criteria

- the system can be run and reviewed by another human
- docs match the actual workflow
- the project is ready for the next milestone
