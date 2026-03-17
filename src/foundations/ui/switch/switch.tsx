'use client';

import { cn } from '@/lib/utils/classnames';

const Switch = ({
  className,
  ...props
}: Omit<React.ComponentPropsWithRef<'input'>, 'type'>) => {
  return (
    <input
      type="checkbox"
      className={cn(
        'appearance-none',
        'relative h-6 w-11 cursor-pointer rounded-xl bg-foreground/20 transition',
        // circle
        'before:absolute before:top-0.5 before:left-0.5 before:size-5 before:rounded-xl before:bg-background before:transition-transform before:duration-200 before:ease-out-expo',
        // disabled
        'disabled:before:opacity-30',
        // checked
        'checked:bg-foreground checked:before:translate-x-full',
        // focus
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring',
        // stretch animation
        'before:origin-left active:before:scale-x-110 active:before:rounded-[calc(var(--spacing)*2.25)] active:checked:before:origin-right',
        className
      )}
      {...props}
    />
  );
};

export { Switch };
