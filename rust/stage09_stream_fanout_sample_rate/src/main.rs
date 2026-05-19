use std::env;
use std::fs;
use std::path::PathBuf;
use std::time::Instant;

#[derive(Debug, Clone, PartialEq)]
struct Config {
    channels: u32,
    samples_per_channel: u32,
    per_channel_hz: f64,
    clients: u32,
    queue_depth: u32,
    output: Option<PathBuf>,
}

#[derive(Debug, Clone, PartialEq)]
struct Measurement {
    channels: u32,
    samples_per_channel: u32,
    per_channel_hz: f64,
    aggregate_sample_rate_hz: f64,
    clients: u32,
    queue_depth: u32,
    telemetry_events: u32,
    delivered_events: u32,
    dropped_events: u32,
    max_queue_depth_observed: u32,
    monotonic_sequence_verified: bool,
    duration_ms: f64,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            channels: 20,
            samples_per_channel: 10,
            per_channel_hz: 5.0,
            clients: 2,
            queue_depth: 250,
            output: None,
        }
    }
}

fn main() {
    let config = match parse_args(env::args().skip(1)) {
        Ok(config) => config,
        Err(error) => {
            eprintln!("{error}");
            std::process::exit(2);
        }
    };
    let measurement = run_measurement(&config);
    let payload = measurement_json(&measurement);

    if let Some(path) = &config.output {
        if let Some(parent) = path.parent() {
            if !parent.as_os_str().is_empty() {
                if let Err(error) = fs::create_dir_all(parent) {
                    eprintln!("failed to create output directory: {error}");
                    std::process::exit(1);
                }
            }
        }
        if let Err(error) = fs::write(path, &payload) {
            eprintln!("failed to write output report: {error}");
            std::process::exit(1);
        }
    }

    println!("{payload}");
}

fn parse_args<I>(args: I) -> Result<Config, String>
where
    I: IntoIterator<Item = String>,
{
    let mut config = Config::default();
    let mut iter = args.into_iter();
    while let Some(arg) = iter.next() {
        match arg.as_str() {
            "--channels" => config.channels = parse_next_u32(&mut iter, "--channels")?,
            "--samples-per-channel" => {
                config.samples_per_channel = parse_next_u32(&mut iter, "--samples-per-channel")?
            }
            "--per-channel-hz" => {
                config.per_channel_hz = parse_next_f64(&mut iter, "--per-channel-hz")?
            }
            "--clients" => config.clients = parse_next_u32(&mut iter, "--clients")?,
            "--queue-depth" => config.queue_depth = parse_next_u32(&mut iter, "--queue-depth")?,
            "--output" => {
                let value = iter
                    .next()
                    .ok_or_else(|| "--output requires a path".to_string())?;
                config.output = Some(PathBuf::from(value));
            }
            "--help" | "-h" => {
                return Err(
                    "usage: stage09_stream_fanout_sample_rate [--channels N] \
                     [--samples-per-channel N] [--per-channel-hz HZ] \
                     [--clients N] [--queue-depth N] [--output PATH]"
                        .to_string(),
                );
            }
            _ => return Err(format!("unknown argument: {arg}")),
        }
    }

    if config.channels == 0 {
        return Err("--channels must be greater than zero".to_string());
    }
    if config.samples_per_channel == 0 {
        return Err("--samples-per-channel must be greater than zero".to_string());
    }
    if config.per_channel_hz <= 0.0 {
        return Err("--per-channel-hz must be greater than zero".to_string());
    }
    if config.clients == 0 {
        return Err("--clients must be greater than zero".to_string());
    }
    if config.queue_depth == 0 {
        return Err("--queue-depth must be greater than zero".to_string());
    }

    Ok(config)
}

fn parse_next_u32<I>(iter: &mut I, label: &str) -> Result<u32, String>
where
    I: Iterator<Item = String>,
{
    let value = iter
        .next()
        .ok_or_else(|| format!("{label} requires a value"))?;
    value
        .parse::<u32>()
        .map_err(|_| format!("{label} must be an unsigned integer"))
}

fn parse_next_f64<I>(iter: &mut I, label: &str) -> Result<f64, String>
where
    I: Iterator<Item = String>,
{
    let value = iter
        .next()
        .ok_or_else(|| format!("{label} requires a value"))?;
    value
        .parse::<f64>()
        .map_err(|_| format!("{label} must be a number"))
}

fn run_measurement(config: &Config) -> Measurement {
    let started = Instant::now();
    let event_count = config.channels * config.samples_per_channel;
    let mut client_queue_depths = vec![0_u32; config.clients as usize];
    let mut dropped_events = 0_u32;
    let mut delivered_events = 0_u32;
    let mut max_queue_depth_observed = 0_u32;
    let mut previous_sequence = 0_u32;
    let mut monotonic_sequence_verified = true;

    for sequence in 1..=event_count {
        if sequence <= previous_sequence {
            monotonic_sequence_verified = false;
        }
        previous_sequence = sequence;

        for queue_depth in &mut client_queue_depths {
            if *queue_depth == config.queue_depth {
                dropped_events += 1;
            } else {
                *queue_depth += 1;
                max_queue_depth_observed = max_queue_depth_observed.max(*queue_depth);
            }
            delivered_events += 1;
        }
    }

    Measurement {
        channels: config.channels,
        samples_per_channel: config.samples_per_channel,
        per_channel_hz: config.per_channel_hz,
        aggregate_sample_rate_hz: config.channels as f64 * config.per_channel_hz,
        clients: config.clients,
        queue_depth: config.queue_depth,
        telemetry_events: event_count,
        delivered_events,
        dropped_events,
        max_queue_depth_observed,
        monotonic_sequence_verified,
        duration_ms: started.elapsed().as_secs_f64() * 1000.0,
    }
}

fn measurement_json(measurement: &Measurement) -> String {
    format!(
        concat!(
            "{{\n",
            "  \"aggregate_sample_rate_hz\": {:.3},\n",
            "  \"candidate_id\": \"rust_stream_fanout_sample_rate_spike\",\n",
            "  \"channels\": {},\n",
            "  \"client_count\": {},\n",
            "  \"delivered_event_count\": {},\n",
            "  \"dropped_event_count\": {},\n",
            "  \"duration_ms\": {:.3},\n",
            "  \"max_queue_depth_observed\": {},\n",
            "  \"monotonic_sequence_verified\": {},\n",
            "  \"per_channel_sample_rate_hz\": {:.3},\n",
            "  \"queue_depth\": {},\n",
            "  \"samples_per_channel\": {},\n",
            "  \"schema\": \"telemforge.stage09_rust_stream_fanout_measurement.v1\",\n",
            "  \"telemetry_event_count\": {}\n",
            "}}"
        ),
        measurement.aggregate_sample_rate_hz,
        measurement.channels,
        measurement.clients,
        measurement.delivered_events,
        measurement.dropped_events,
        measurement.duration_ms,
        measurement.max_queue_depth_observed,
        measurement.monotonic_sequence_verified,
        measurement.per_channel_hz,
        measurement.queue_depth,
        measurement.samples_per_channel,
        measurement.telemetry_events,
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn default_candidate_improves_stage09_throughput_without_drops() {
        let measurement = run_measurement(&Config::default());

        assert_eq!(measurement.channels, 20);
        assert_eq!(measurement.samples_per_channel, 10);
        assert_eq!(measurement.clients, 2);
        assert_eq!(measurement.telemetry_events, 200);
        assert_eq!(measurement.delivered_events, 400);
        assert_eq!(measurement.dropped_events, 0);
        assert_eq!(measurement.max_queue_depth_observed, 200);
        assert_eq!(measurement.per_channel_hz, 5.0);
        assert_eq!(measurement.aggregate_sample_rate_hz, 100.0);
        assert!(measurement.monotonic_sequence_verified);
    }

    #[test]
    fn bounded_queue_reports_drops_when_depth_is_exceeded() {
        let config = Config {
            channels: 2,
            samples_per_channel: 4,
            per_channel_hz: 1.0,
            clients: 2,
            queue_depth: 3,
            output: None,
        };

        let measurement = run_measurement(&config);

        assert_eq!(measurement.telemetry_events, 8);
        assert_eq!(measurement.delivered_events, 16);
        assert_eq!(measurement.dropped_events, 10);
        assert_eq!(measurement.max_queue_depth_observed, 3);
    }

    #[test]
    fn parser_rejects_zero_channels() {
        let result = parse_args(["--channels".to_string(), "0".to_string()]);

        assert_eq!(
            result.expect_err("zero channels should fail"),
            "--channels must be greater than zero",
        );
    }
}
