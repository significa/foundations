import type { VariantProps } from 'class-variance-authority';
import { cnva } from 'lib/tailwind';
import { forwardRef } from 'react';

const spinnerStyle = cnva(
  `
  relative
  
  animate-spin
  
  before:absolute
  before:left-0
  before:top-0
  before:block
  before:size-full
  before:rounded-full
  before:border-current
  before:opacity-40

  after:left-0
  after:top-0
  after:block
  after:size-full
  after:rounded-full
  after:border-transparent
  after:border-r-current
  after:border-t-current
  after:animate-[spin_2s_ease-in-out_infinite]
  `,
  {
    variants: {
      size: {
        sm: `
          size-3
          before:border-[1.5px]
          after:border-[1.5px]
        `,
        md: `
          size-4
          before:border-2
          after:border-2
        `,
        lg: `
          size-8
          before:border-[4px]
          after:border-[4px]
        `
      }
    }
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerStyle> {}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => (
    <div
      aria-label="loading"
      role="progressbar"
      className={spinnerStyle({ size, className })}
      ref={ref}
      {...props}
    />
  )
);

Spinner.displayName = 'Spinner';
