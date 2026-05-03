import type { TrendView } from "./types.ts";

interface TrendSparklineProps {
  trend: TrendView;
}

export function TrendSparkline({ trend }: TrendSparklineProps) {
  return (
    <svg
      className="trend-sparkline"
      role="img"
      viewBox="0 0 220 68"
      aria-label={`${trend.name} ${trend.direction} trend`}
      preserveAspectRatio="none"
    >
      <path className="sparkline-grid" d="M 0 1 H 220 M 0 34 H 220 M 0 67 H 220" />
      <path className={`trend-path status-${trend.status}`} d={trend.svgPath} />
    </svg>
  );
}
