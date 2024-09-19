import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import type { Ref, InputHTMLAttributes } from 'react';
import { cn } from 'lib/tailwind';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  className?: string;
  indeterminate?: boolean;
};

export const Checkbox = forwardRef(function Checkbox(
  { className, disabled, indeterminate, ...props }: CheckboxProps,
  forwardedRef: Ref<HTMLInputElement>
) {
  const ref: Ref<HTMLInputElement> = useRef();

  useEffect(() => {
    ref.current.indeterminate = indeterminate;
  }, [ref, indeterminate]);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLInputElement);

  return (
    <div
      className={cn(
        'inline-flex items-start relative h-fit',
        disabled ? 'cursor-not-allowed' : 'cursor-auto',
        className
      )}
      data-disabled={disabled ? '' : undefined}
    >
      <input
        type="checkbox"
        ref={ref}
        disabled={disabled}
        {...props}
        className={cn(
          'peer w-5 h-5 shrink-0 appearance-none rounded-md border transition duration-200 ease-out cursor-pointer',
          'bg-transparent border-primary ring-accent focus:ring enabled:hover:bg-primary/5',
          'checked:bg-primary checked:border-primary enabled:checked:hover:bg-primary/90',
          'indeterminate:bg-primary indeterminate:border-primary enabled:indeterminate:hover:bg-primary/90',
          'focus-visible:ring-accent/60 focus-visible:ring-offset-accent',
          'disabled:pointer-events-none disabled:opacity-40'
        )}
      />
      <svg
        className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-background"
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
        className="absolute pointer-events-none opacity-0 peer-indeterminate:opacity-100 text-background"
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
    </div>
  );
});
