import { forwardRef } from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from '@/lib/tailwind';

export const RadioGroup = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(function ({ className, children, ...props }, forwardedRef) {
  return (
    <RadioGroupPrimitive.Root
      ref={forwardedRef}
      className={cn('flex flex-col gap-2', className)}
      {...props}
    >
      {children}
    </RadioGroupPrimitive.Root>
  );
});

export const RadioGroupItem = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, forwardedRef) => {
  return (
    <RadioGroupPrimitive.Item
      ref={forwardedRef}
      className={cn(
        'relative size-5 border rounded-full transition',
        'bg-transparent border-primary data-[state=checked]:border-primary data-[state=unchecked]:hover:bg-primary/5',
        'focus:ring focus:ring-accent focus-visible:ring focus-visible:!ring-accent/50 focus-visible:!ring-offset-accent',
        'disabled:pointer-events-none disabled:opacity-60',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className="absolute inset-0 rounded-full bg-primary opacity-0 data-[state=checked]:opacity-100"
        forceMount
      >
        <svg
          className="absolute pointer-events-none text-background"
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
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
