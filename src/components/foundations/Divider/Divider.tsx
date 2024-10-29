import { forwardRef, HTMLAttributes } from 'react';
import { cn } from 'lib/tailwind';

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = 'horizontal', decorative, ...props }, ref) => {
    /**
     * Either `vertical` or `horizontal`. Defaults to `horizontal`.
     */
    const ariaOrientation = orientation === 'vertical' ? orientation : undefined;
    const semanticProps = decorative
      ? { role: 'none' }
      : { 'aria-orientation': ariaOrientation, role: 'separator' };

    console.log(className);

    return (
      <div
        ref={ref}
        className={cn(
          'shrink-0',
          'bg-black',
          orientation === 'horizontal' ? 'h-[0.5px] w-full' : 'h-full w-[0.5px]',
          className
        )}
        {...semanticProps}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';
