# Telemetry Fixtures

Stage 02 defines JSON examples here for telemetry channels, telemetry points, alert records, fault injection requests, and replay payloads.

## Files

- `channels.json`: starter channel catalog with subsystem ownership, units, cadence, nominal ranges, warning ranges, and critical ranges.
- `nominal_snapshot.json`: healthy static snapshot with one telemetry point per channel and no alerts.
- `degraded_snapshot.json`: static degraded snapshot with the same channel coverage plus active warning and critical alerts.
- `fault_request.json`: example fault injection request shape. It is data only; no fault execution behavior exists yet.
- `replay_payload.json`: compact replay payload shape using a few degraded points and alerts. It is data only; no replay engine exists yet.

## Human Inspection

A reviewer can inspect these files directly:

```text
python -m json.tool fixtures/telemetry/channels.json
python -m json.tool fixtures/telemetry/nominal_snapshot.json
python -m json.tool fixtures/telemetry/degraded_snapshot.json
```

The nominal and degraded snapshots intentionally share the same channel IDs. The degraded snapshot should be visibly different:

- `eps.battery_voltage` drops below nominal power margin.
- `thermal.avionics_temp` rises from nominal to critical.
- `comms.downlink_snr_db` falls into critical downlink margin.
- `comms.packet_error_rate_pct` rises above nominal.
- active alert records explain the degraded thermal, comms, and power conditions.

## Deferred

These fixtures do not implement telemetry simulation, FastAPI endpoints, storage, websocket streaming, frontend UI, replay execution, or anomaly behavior. Later stages should consume these contracts rather than replacing them with hidden data shapes.
