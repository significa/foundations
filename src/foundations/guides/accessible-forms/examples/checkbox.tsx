'use client';

import { useEffect, useRef } from 'react';

import { composeRefs } from '@/foundations/utils/compose-refs/compose-refs';
import { cva } from '@/lib/utils/classnames';

import { useField } from '../field';

interface CheckboxProps
  extends Omit<React.ComponentPropsWithRef<'input'>, 'type'> {
  indeterminate?: boolean;
}

const checkboxStyle = cva({
  base: [
    'relative flex size-5 shrink-0 appearance-none items-center justify-center rounded-sm border border-border bg-background shadow-xs outline-none ring-ring transition focus-visible:ring-4 enabled:cursor-pointer enabled:not-checked:hover:border-border-hard',
    // checked
    'checked:enabled:border-foreground checked:enabled:bg-foreground',
    // indeterminate
    'indeterminate:enabled:border-foreground indeterminate:enabled:bg-foreground',
    // checked checkmark
    "before:absolute before:text-background checked:before:font-bold checked:before:text-xs checked:before:content-['✓']",
    // indeterminate dash
    'indeterminate:before:h-0.5 indeterminate:before:w-1.5 indeterminate:before:bg-background',
    // disabled
    'disabled:cursor-not-allowed disabled:border-foreground/5 disabled:bg-foreground/10 disabled:indeterminate:before:bg-foreground/50 disabled:checked:before:text-foreground/50',
  ],
});

const Checkbox = ({
  ref,
  indeterminate,
  className,
  id,
  ...props
}: CheckboxProps) => {
  const internalRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);

  const fieldCtx = useField();

  return (
    <input
      type="checkbox"
      ref={composeRefs(ref, internalRef)}
      id={id ?? fieldCtx?.id}
      aria-errormessage={fieldCtx?.['aria-errormessage']}
      aria-describedby={fieldCtx?.['aria-describedby']}
      aria-labelledby={fieldCtx?.['aria-labelledby']}
      className={checkboxStyle({ className })}
      {...props}
    />
  );
};

export { Checkbox };
