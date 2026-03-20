'use client';

import type { VariantProps } from 'cva';

import { Slot, Slottable } from '@/foundations/components/slot/slot';
import { Spinner } from '@/foundations/ui/spinner/spinner';
import { cn, cva } from '@/lib/utils/classnames';

const buttonStyle = cva({
  base: 'relative inline-flex h-(--button-height) shrink-0 items-center justify-center gap-1.5 whitespace-nowrap font-medium text-(--button-text-color) shadow-xs ring-ring transition [--button-text-color:var(--color-foreground)] focus-visible:outline-none focus-visible:ring-4 active:scale-98 enabled:cursor-pointer disabled:opacity-40',
  variants: {
    variant: {
      primary: 'bg-accent [--button-text-color:var(--color-accent-foreground)]',
      outline: 'border border-border bg-background focus-visible:border-accent',
      ghost:
        'border-none bg-transparent shadow-none ring-0 hover:bg-foreground/5',
      destructive:
        'bg-red-600 ring-red-600/50 [--button-text-color:var(--color-white)] hover:bg-red-700',
    },
    size: {
      xs: 'rounded-lg px-2 text-sm [--button-height:--spacing(6)]',
      sm: 'rounded-lg px-3 text-sm [--button-height:--spacing(8)]',
      md: 'rounded-xl px-4 text-base [--button-height:--spacing(10)]',
      lg: 'rounded-2xl px-5 text-base [--button-height:--spacing(12)]',
    },
    square: {
      true: 'w-(--button-height) px-0',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export interface ButtonProps
  extends React.ComponentPropsWithRef<'button'>,
    VariantProps<typeof buttonStyle> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = ({
  children,
  className,
  variant,
  asChild = false,
  isLoading,
  size = 'md',
  square,
  type = 'button',
  ref,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(
        buttonStyle({
          className,
          variant,
          size,
          square,
        }),
        isLoading && 'text-transparent transition-none'
      )}
      ref={ref}
      type={type}
      {...props}
    >
      <Slottable asChild={asChild} child={children}>
        {(child) => (
          <>
            {child}
            {isLoading && (
              <span
                data-button-spinner
                className={cn(
                  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                  'text-(--button-text-color)'
                )}
              >
                <Spinner size={size} />
              </span>
            )}
          </>
        )}
      </Slottable>
    </Comp>
  );
};

export { Button, buttonStyle };
