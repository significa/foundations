import { BarChart } from '@/foundations/charts/bar-chart/bar-chart';
import type { ChartConfig } from '@/foundations/charts/chart-container/chart-container';

export const meta = {
  layout: 'padded',
  mode: 'iframe',
} as const;

const data = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 173, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 264, mobile: 140 },
];

const config = {
  desktop: { label: 'Desktop', color: 'var(--color-chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--color-chart-2)' },
} satisfies ChartConfig;

export default function BarChartPreview() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <BarChart data={data} config={config} xKey="month" />
    </div>
  );
}
