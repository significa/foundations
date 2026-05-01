import { cn, cva } from '@/lib/utils/classnames';

type ProgressSize = 'xs' | 'sm' | 'md' | 'lg';
type ProgressVariant = 'linear' | 'circular';

const linearTrackStyle = cva({
  base: [
    'relative w-full overflow-hidden rounded-full',
    'bg-foreground/10 text-accent',
  ],
  variants: {
    size: {
      xs: 'h-0.5',
      sm: 'h-1',
      md: 'h-1.5',
      lg: 'h-2',
    } satisfies Record<ProgressSize, string>,
  },
});

const linearFillStyle =
  'h-full rounded-full bg-current transition-[width] duration-150 ease-out';

const circularSizes = {
  xs: { px: 12, stroke: 1.5 },
  sm: { px: 16, stroke: 2 },
  md: { px: 20, stroke: 2 },
  lg: { px: 24, stroke: 2.5 },
} satisfies Record<ProgressSize, { px: number; stroke: number }>;

interface ProgressProps
  extends Omit<React.ComponentPropsWithRef<'div'>, 'children'> {
  /** Current value. Clamped to `[0, max]`. */
  value: number;
  /** Maximum value. Defaults to 100. */
  max?: number;
  size?: ProgressSize;
  variant?: ProgressVariant;
}

const Progress = ({
  value,
  max = 100,
  size = 'md',
  variant = 'linear',
  className,
  ...props
}: ProgressProps) => {
  const clamped = Math.max(0, Math.min(max, value));
  const percent = (clamped / max) * 100;

  const a11yProps = {
    role: 'progressbar' as const,
    'aria-valuemin': 0,
    'aria-valuemax': max,
    'aria-valuenow': clamped,
  };

  if (variant === 'circular') {
    const { px, stroke } = circularSizes[size];
    const r = (px - stroke) / 2;
    const c = 2 * Math.PI * r;
    const offset = c * (1 - percent / 100);

    return (
      <div
        className={cn('inline-flex text-accent', className)}
        {...a11yProps}
        {...props}
      >
        <svg
          width={px}
          height={px}
          viewBox={`0 0 ${px} ${px}`}
          aria-hidden="true"
        >
          <circle
            cx={px / 2}
            cy={px / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            className="stroke-foreground/10"
          />
          <circle
            cx={px / 2}
            cy={px / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${px / 2} ${px / 2})`}
            className="stroke-current transition-[stroke-dashoffset] duration-150 ease-out"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={linearTrackStyle({ size, className })}
      {...a11yProps}
      {...props}
    >
      <div
        className={linearFillStyle}
        style={{ width: `${percent}%` }}
        aria-hidden="true"
      />
    </div>
  );
};

export type { ProgressProps };
export { Progress };
