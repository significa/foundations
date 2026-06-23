import { useState } from 'react';
import {
  buildAreaPath,
  buildSmoothPath,
  type ChartConfig,
  ChartContainer,
  ChartTooltipContent,
  niceTicks,
  scaleLinear,
  scalePoint,
} from '@/foundations/charts/chart-container/chart-container';

type Datum = Record<string, number | string>;

interface AreaChartProps {
  data: Datum[];
  config: ChartConfig;
  /** Key in each datum used for the (categorical) x axis. */
  xKey: string;
  className?: string;
}

const MARGIN = { top: 8, right: 8, bottom: 24, left: 32 };

const AreaChart = ({ data, config, xKey, className }: AreaChartProps) => {
  const seriesKeys = Object.keys(config);
  const [active, setActive] = useState<number | null>(null);

  return (
    <ChartContainer config={config} className={className}>
      {({ width, height }) => {
        const innerWidth = width - MARGIN.left - MARGIN.right;
        const innerHeight = height - MARGIN.top - MARGIN.bottom;

        const categories = data.map((d) => String(d[xKey]));
        const xScale = scalePoint(categories, [0, innerWidth]);

        const maxY = Math.max(
          0,
          ...data.flatMap((d) => seriesKeys.map((key) => Number(d[key])))
        );
        const ticks = niceTicks(0, maxY);
        const yMax = ticks[ticks.length - 1] || 1;
        const yScale = scaleLinear([0, yMax], [innerHeight, 0]);

        const label = `Area chart of ${seriesKeys
          .map((key) => config[key]?.label ?? key)
          .join(', ')}`;

        const activeX = active != null ? xScale(String(data[active][xKey])) : 0;

        return (
          <div className="relative" style={{ width, height }}>
            <svg width={width} height={height} role="img" aria-label={label}>
              <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
                {ticks.map((tick) => (
                  <line
                    key={tick}
                    x1={0}
                    x2={innerWidth}
                    y1={yScale(tick)}
                    y2={yScale(tick)}
                    className="stroke-border"
                    strokeOpacity={0.6}
                  />
                ))}

                {seriesKeys.map((key) => {
                  const points = data.map(
                    (d, i) =>
                      [xScale(categories[i]), yScale(Number(d[key]))] as [
                        number,
                        number,
                      ]
                  );
                  return (
                    <g key={key}>
                      <path
                        d={buildAreaPath(points, innerHeight)}
                        fill={`var(--color-${key})`}
                        fillOpacity={0.12}
                      />
                      <path
                        d={buildSmoothPath(points)}
                        fill="none"
                        stroke={`var(--color-${key})`}
                        strokeWidth={2}
                      />
                    </g>
                  );
                })}

                {active != null && (
                  <g>
                    <line
                      x1={activeX}
                      x2={activeX}
                      y1={0}
                      y2={innerHeight}
                      className="stroke-border"
                      strokeWidth={1}
                    />
                    {seriesKeys.map((key) => (
                      <circle
                        key={key}
                        cx={activeX}
                        cy={yScale(Number(data[active][key]))}
                        r={3.5}
                        fill="var(--color-background)"
                        stroke={`var(--color-${key})`}
                        strokeWidth={2}
                      />
                    ))}
                  </g>
                )}

                {categories.map((category) => (
                  <text
                    key={category}
                    x={xScale(category)}
                    y={innerHeight + 16}
                    textAnchor="middle"
                    className="fill-foreground-secondary"
                    fontSize={10}
                  >
                    {category}
                  </text>
                ))}

                {/* Invisible hover columns drive the tooltip. */}
                {categories.map((category, i) => {
                  const step = xScale.step();
                  return (
                    // biome-ignore lint/a11y/noStaticElementInteractions: hover-only affordance; data is exposed via the tooltip and should be duplicated in an accessible table
                    <rect
                      key={category}
                      x={xScale(category) - step / 2}
                      y={0}
                      width={step}
                      height={innerHeight}
                      fill="transparent"
                      onMouseEnter={() => setActive(i)}
                      onMouseLeave={() => setActive(null)}
                    />
                  );
                })}
              </g>
            </svg>

            {active != null && (
              <div
                className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
                style={{
                  left: MARGIN.left + activeX,
                  top: MARGIN.top,
                }}
              >
                <ChartTooltipContent
                  config={config}
                  label={String(data[active][xKey])}
                  items={seriesKeys.map((key) => ({
                    key,
                    value: data[active][key],
                  }))}
                />
              </div>
            )}
          </div>
        );
      }}
    </ChartContainer>
  );
};

export { AreaChart };
