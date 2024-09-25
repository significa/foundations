import { forwardRef } from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from 'lib/tailwind';

export const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(function ({ className, ...props }, forwardedRef) {
  return (
    <SwitchPrimitive.Root
      ref={forwardedRef}
      className={cn(
        'h-5 w-9 inline-flex shrink-0 items-center rounded-full border-2 border-transparent cursor-pointer transition',
        'data-[state=unchecked]:bg-primary/30 data-[state=checked]:bg-primary',
        'focus-visible:ring focus-visible:ring-accent/50 focus-visible:ring-offset-accent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block h-4 w-4 rounded-full bg-background transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0" />
    </SwitchPrimitive.Root>
  );
});
