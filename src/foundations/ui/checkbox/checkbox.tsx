import { useEffect, useMemo, useRef } from "react";

import { composeRefs } from "#/foundations/utils/compose-refs/compose-refs.ts";
import { cva } from "#/lib/utils/classnames.ts";

interface CheckboxProps extends Omit<React.ComponentPropsWithRef<"input">, "type"> {
  indeterminate?: boolean;
}

const checkboxStyle = cva({
  base: [
    "relative flex size-5 shrink-0 appearance-none items-center justify-center rounded-sm border border-border bg-background shadow-xs ring-ring transition outline-none focus-visible:ring-(length:--ring-width) enabled:cursor-pointer enabled:not-checked:hover:border-mix-border/8",
    // checked
    "checked:enabled:border-accent checked:enabled:bg-accent checked:enabled:hover:border-mix-accent/8 checked:enabled:hover:mix-with-accent-foreground",
    // indeterminate
    "indeterminate:enabled:border-accent indeterminate:enabled:bg-accent indeterminate:enabled:hover:border-mix-accent/8 indeterminate:enabled:hover:mix-with-accent-foreground",
    // checked checkmark
    "before:absolute before:text-accent-foreground checked:before:text-xs checked:before:font-bold checked:before:content-['✓']",
    // indeterminate dash
    "indeterminate:before:h-0.5 indeterminate:before:w-1.5 indeterminate:before:bg-accent-foreground",
    // disabled
    "disabled:cursor-not-allowed disabled:border-foreground/5 disabled:bg-foreground/10 disabled:checked:before:text-foreground/50 disabled:indeterminate:before:bg-foreground/50",
  ],
});

const Checkbox = ({ ref, indeterminate, className, ...props }: CheckboxProps) => {
  const internalRef = useRef<HTMLInputElement>(null);
  const composedRef = useMemo(() => composeRefs(ref, internalRef), [ref]);

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);

  return (
    <input type="checkbox" ref={composedRef} className={checkboxStyle({ className })} {...props} />
  );
};

export { Checkbox };
