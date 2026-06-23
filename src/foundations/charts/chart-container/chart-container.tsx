import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/classnames';

/**
 * Maps each data series key to a human label and a color. The color is exposed
 * as a `--color-<key>` CSS custom property on the container, so chart shapes can
 * reference it with `fill="var(--color-desktop)"` instead of hard-coding values.
 */
export type ChartConfig = Record<
  string,
  {
    label: string;
    color?: string;
  }
>;

type ChartDimensions = {
  width: number;
  height: number;
};

/* -------------------------------------------------------------------------- */
/*  Scales — tiny, dependency-free replacements for the bits of d3 we need.   */
/* -------------------------------------------------------------------------- */

/** Maps a continuous domain onto a pixel range. */
const scaleLinear = (domain: [number, number], range: [number, number]) => {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  return (value: number) =>
    d1 === d0 ? r0 : r0 + ((value - d0) / (d1 - d0)) * (r1 - r0);
};

/** Evenly spaced categorical points, first and last sitting on the edges. */
const scalePoint = (domain: string[], range: [number, number]) => {
  const [r0, r1] = range;
  const step = domain.length > 1 ? (r1 - r0) / (domain.length - 1) : 0;
  const index = new Map(domain.map((d, i) => [d, i] as const));
  const scale = (value: string) => r0 + (index.get(value) ?? 0) * step;
  return Object.assign(scale, { step: () => step });
};

/** Categorical bands with inner padding, like d3's scaleBand. */
const scaleBand = (
  domain: string[],
  range: [number, number],
  padding = 0.2
) => {
  const [r0, r1] = range;
  const step = (r1 - r0) / Math.max(1, domain.length);
  const bandwidth = step * (1 - padding);
  const index = new Map(domain.map((d, i) => [d, i] as const));
  const scale = (value: string) =>
    r0 + (index.get(value) ?? 0) * step + (step - bandwidth) / 2;
  return Object.assign(scale, {
    bandwidth: () => bandwidth,
    step: () => step,
  });
};

/** "Nice", human-friendly tick values covering [min, max]. */
const niceTicks = (min: number, max: number, count = 4): number[] => {
  const span = max - min || 1;
  const rawStep = span / count;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;
  const niceStep =
    (normalized < 1.5 ? 1 : normalized < 3 ? 2 : normalized < 7 ? 5 : 10) *
    magnitude;
  const start = Math.floor(min / niceStep) * niceStep;
  const end = Math.ceil(max / niceStep) * niceStep;
  const ticks: number[] = [];
  for (let v = start; v <= end + niceStep / 2; v += niceStep) {
    ticks.push(Number(v.toFixed(10)));
  }
  return ticks;
};

/* -------------------------------------------------------------------------- */
/*  Path builders — turn [x, y] points into SVG path strings.                 */
/* -------------------------------------------------------------------------- */

type Point = [number, number];

const buildLinePath = (points: Point[]): string =>
  points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');

/** Smooth line via a Catmull-Rom spline converted to cubic béziers. */
const buildSmoothPath = (points: Point[]): string => {
  if (points.length < 3) return buildLinePath(points);
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
  }
  return d;
};

const buildAreaPath = (
  points: Point[],
  baselineY: number,
  smooth = true
): string => {
  if (points.length === 0) return '';
  const top = smooth ? buildSmoothPath(points) : buildLinePath(points);
  const first = points[0];
  const last = points[points.length - 1];
  return `${top} L${last[0]},${baselineY} L${first[0]},${baselineY} Z`;
};

/* -------------------------------------------------------------------------- */
/*  Responsive sizing — a ~15-line ResizeObserver, no @visx/responsive.       */
/* -------------------------------------------------------------------------- */

const useChartSize = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<ChartDimensions>({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) setSize({ width: rect.width, height: rect.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
};

/* -------------------------------------------------------------------------- */
/*  Components                                                                 */
/* -------------------------------------------------------------------------- */

interface ChartContainerProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  config: ChartConfig;
  /** Render prop receiving the measured pixel dimensions for the SVG chart. */
  children: (dimensions: ChartDimensions) => React.ReactNode;
}

const ChartContainer = ({
  config,
  className,
  children,
  style,
  ...props
}: ChartContainerProps) => {
  const [ref, { width, height }] = useChartSize();

  const colorVars: Record<string, string> = {};
  for (const [key, value] of Object.entries(config)) {
    if (value.color) colorVars[`--color-${key}`] = value.color;
  }

  return (
    <div
      ref={ref}
      data-chart
      className={cn(
        'aspect-video w-full text-2xs text-foreground-secondary',
        className
      )}
      style={{ ...colorVars, ...style }}
      {...props}
    >
      {width > 0 && height > 0 ? children({ width, height }) : null}
    </div>
  );
};

interface ChartLegendProps extends React.ComponentPropsWithRef<'div'> {
  config: ChartConfig;
}

const ChartLegend = ({ config, className, ...props }: ChartLegendProps) => {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-4 pt-3 text-foreground-secondary text-xs',
        className
      )}
      {...props}
    >
      {Object.entries(config).map(([key, item]) => (
        <div key={key} className="flex items-center gap-1.5">
          <span
            className="size-2.5 shrink-0 rounded-xs"
            style={{ backgroundColor: `var(--color-${key})` }}
          />
          {item.label}
        </div>
      ))}
    </div>
  );
};

type ChartTooltipItem = {
  key: string;
  value: React.ReactNode;
};

interface ChartTooltipContentProps extends React.ComponentPropsWithRef<'div'> {
  config: ChartConfig;
  label?: React.ReactNode;
  items: ChartTooltipItem[];
}

const ChartTooltipContent = ({
  config,
  label,
  items,
  className,
  ...props
}: ChartTooltipContentProps) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs shadow-md',
        className
      )}
      {...props}
    >
      {label != null && (
        <div className="mb-1 font-medium text-foreground">{label}</div>
      )}
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-3 text-foreground-secondary"
          >
            <span className="flex items-center gap-1.5">
              <span
                className="size-2 shrink-0 rounded-xs"
                style={{ backgroundColor: `var(--color-${item.key})` }}
              />
              {config[item.key]?.label ?? item.key}
            </span>
            <span className="font-medium text-foreground tabular-nums">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export {
  buildAreaPath,
  buildLinePath,
  buildSmoothPath,
  ChartContainer,
  ChartLegend,
  ChartTooltipContent,
  niceTicks,
  scaleBand,
  scaleLinear,
  scalePoint,
};
