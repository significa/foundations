import { forwardRef } from 'react';
import { cn } from '@/lib/tailwind';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  resizable?: boolean;
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function (
  { label, resizable, error, className, ...props },
  forwardedRef
) {
  const Component = label ? 'label' : 'div';

  return (
    <Component
      className={cn(
        'w-full flex flex-col gap-1 text-foreground text-sm',
        error && 'text-error',
        className
      )}
    >
      {label && <span className="text-foreground font-medium">{label}</span>}
      <textarea
        className={cn(
          'w-full p-3 font-medium leading-none placeholder:text-foreground/50 transition-colors outline-none',
          'bg-transparent border border-foreground/50 rounded-xl hover:bg-foreground/[0.02] hover:border-foreground/60',
          'focus:ring focus:ring-offset-[1px] focus:ring-accent/50 focus:ring-offset-accent',
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-foreground/5',
          error &&
            'placeholder:text-error/50 border-error/50 bg-error/[0.025] hover:bg-error/5 hover:border-error/60 focus:ring-error/50 focus:ring-offset-error',
          resizable === false && 'resize-none'
        )}
        ref={forwardedRef}
        {...props}
      />
    </Component>
  );
});
