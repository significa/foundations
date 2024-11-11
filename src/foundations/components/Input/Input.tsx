import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/tailwind';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  label?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function (
  { label, icon, error, className, ...props },
  forwardedRef
) {
  const Component = label ? 'label' : 'div';

  return (
    <Component
      className={cn(
        'relative flex flex-col gap-1 text-foreground text-sm',
        error && 'text-error',
        className
      )}
    >
      {label && <span className="text-foreground font-medium">{label}</span>}
      <input
        className={cn(
          'h-10 pb-[1px] px-3 font-medium leading-none placeholder:text-foreground/50 transition-colors',
          'bg-transparent border border-foreground/50 rounded-xl hover:bg-foreground/[0.02] hover:border-foreground/60',
          'focus:ring-accent/50 focus:ring-offset-accent',
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-foreground/5',
          'file:border-0 file:bg-transparent file:text-foreground file:font-semibold file:leading-9',
          error &&
            'placeholder:text-error/50 border-error/50 bg-error/[0.025] hover:bg-error/5 hover:border-error/60 focus:ring-error/50 focus:ring-offset-error',
          icon && 'pl-8'
        )}
        ref={forwardedRef}
        {...props}
      />
      {icon && (
        <div className="absolute left-3 bottom-0 h-10 flex items-center [&>svg]:size-[1em]">
          {icon}
        </div>
      )}
    </Component>
  );
});
