"use client";

import { useEffect, useRef } from "react";

import { composeRefs } from "@/foundations/utils/compose-refs/compose-refs";
import { cva } from "@/lib/utils/classnames";

interface CheckboxProps extends Omit<React.ComponentPropsWithRef<"input">, "type"> {
  indeterminate?: boolean;
}

const checkboxStyle = cva({
  base: [
    "border-border bg-background enabled:not-checked:hover:border-mix-border/8 ring-ring relative flex size-5 shrink-0 appearance-none items-center justify-center rounded-sm border shadow-xs transition outline-none focus-visible:ring-4 enabled:cursor-pointer",
    // checked
    "checked:enabled:border-accent checked:enabled:bg-accent checked:enabled:hover:border-mix-accent/8 checked:enabled:hover:mix-with-accent-foreground",
    // indeterminate
    "indeterminate:enabled:border-accent indeterminate:enabled:bg-accent indeterminate:enabled:hover:border-mix-accent/8 indeterminate:enabled:hover:mix-with-accent-foreground",
    // checked checkmark
    "before:text-accent-foreground before:absolute checked:before:text-xs checked:before:font-bold checked:before:content-['✓']",
    // indeterminate dash
    "indeterminate:before:bg-accent-foreground indeterminate:before:h-0.5 indeterminate:before:w-1.5",
    // disabled
    "disabled:border-foreground/5 disabled:bg-foreground/10 disabled:checked:before:text-foreground/50 disabled:indeterminate:before:bg-foreground/50 disabled:cursor-not-allowed",
  ],
});

const Checkbox = ({ ref, indeterminate, className, ...props }: CheckboxProps) => {
  const internalRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);

  return <input type="checkbox" ref={composeRefs(ref, internalRef)} className={checkboxStyle({ className })} {...props} />;
};

export { Checkbox };
