import { useState } from 'react';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltipContent,
  niceTicks,
  scaleBand,
  scaleLinear,
} from '@/foundations/charts/chart-container/chart-container';

type Datum = Record<string, number | string>;

interface BarChartProps {
  data: Datum[];
  config: ChartConfig;
  /** Key in each datum used for the (categorical) x axis. */
  xKey: string;
  className?: string;
}

const MARGIN = { top: 8, right: 8, bottom: 24, left: 32 };

const BarChart = ({ data, config, xKey, className }: BarChartProps) => {
  const seriesKeys = Object.keys(config);
  const [active, setActive] = useState<number | null>(null);

  return (
    <ChartContainer config={config} className={className}>
      {({ width, height }) => {
        const innerWidth = width - MARGIN.left - MARGIN.right;
        const innerHeight = height - MARGIN.top - MARGIN.bottom;

        const categories = data.map((d) => String(d[xKey]));
        const groupScale = scaleBand(categories, [0, innerWidth], 0.2);
        const seriesScale = scaleBand(
          seriesKeys,
          [0, groupScale.bandwidth()],
          0.1
        );

        const maxY = Math.max(
          0,
          ...data.flatMap((d) => seriesKeys.map((key) => Number(d[key])))
        );
        const ticks = niceTicks(0, maxY);
        const yMax = ticks[ticks.length - 1] || 1;
        const yScale = scaleLinear([0, yMax], [innerHeight, 0]);

        const label = `Bar chart of ${seriesKeys
          .map((key) => config[key]?.label ?? key)
          .join(', ')}`;

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

                {data.map((d, i) => {
                  const groupX = groupScale(categories[i]);
                  return (
                    // biome-ignore lint/a11y/noStaticElementInteractions: hover-only affordance; data is exposed via the tooltip and should be duplicated in an accessible table
                    <g
                      key={categories[i]}
                      transform={`translate(${groupX},0)`}
                      onMouseEnter={() => setActive(i)}
                      onMouseLeave={() => setActive(null)}
                    >
                      {seriesKeys.map((key) => {
                        const value = Number(d[key]);
                        const y = yScale(value);
                        return (
                          <rect
                            key={key}
                            x={seriesScale(key)}
                            y={y}
                            width={seriesScale.bandwidth()}
                            height={Math.max(0, innerHeight - y)}
                            rx={2}
                            fill={`var(--color-${key})`}
                            fillOpacity={
                              active == null || active === i ? 1 : 0.4
                            }
                          />
                        );
                      })}
                    </g>
                  );
                })}

                {categories.map((category) => (
                  <text
                    key={category}
                    x={groupScale(category) + groupScale.bandwidth() / 2}
                    y={innerHeight + 16}
                    textAnchor="middle"
                    className="fill-foreground-secondary"
                    fontSize={10}
                  >
                    {category}
                  </text>
                ))}
              </g>
            </svg>

            {active != null && (
              <div
                className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
                style={{
                  left:
                    MARGIN.left +
                    groupScale(categories[active]) +
                    groupScale.bandwidth() / 2,
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

export { BarChart };
