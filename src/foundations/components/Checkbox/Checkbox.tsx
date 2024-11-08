import { forwardRef } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from '@/lib/tailwind';

export const Checkbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(function Checkbox({ className, ...props }, forwardedRef) {
  return (
    <CheckboxPrimitive.Root
      ref={forwardedRef}
      className={cn(
        'relative w-5 h-5 shrink-0 appearance-none rounded-md border transition duration-200 ease-out cursor-pointer',
        'bg-transparent border-primary ring-accent focus:ring enabled:hover:bg-primary/5',
        'data-[state=checked]:bg-primary data-[state=checked]:border-primary enabled:data-[state=checked]:hover:bg-primary/90',
        'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary enabled:data-[state=indeterminate]:hover:bg-primary/90',
        'focus-visible:ring-accent/50 focus-visible:ring-offset-accent',
        'disabled:pointer-events-none disabled:opacity-40',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="group absolute inset-0" forceMount>
        <svg
          className="absolute pointer-events-none opacity-0 text-background group-data-[state=checked]:opacity-100"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m11 6-3.6 4L5 7.778"
          />
        </svg>
        <svg
          className="absolute pointer-events-none opacity-0 group-data-[state=indeterminate]:opacity-100 text-background"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m5 8 L11 8"
          />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
