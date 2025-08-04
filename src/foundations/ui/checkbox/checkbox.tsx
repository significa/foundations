"use client";

import { useEffect, useRef } from "react";

import { cva } from "@/lib/utils";
import { composeRefs } from "@/foundations/utils/compose-refs/compose-refs";

interface CheckboxProps
  extends Omit<React.ComponentPropsWithRef<"input">, "type"> {
  indeterminate?: boolean;
}

const checkboxStyle = cva({
  base: [
    "appearance-none relative size-5 shrink-0 outline-none rounded-sm border border-border bg-background shadow-xs enabled:cursor-pointer enabled:not-checked:hover:border-mix-border/8 flex items-center justify-center focus-visible:ring-4 ring-ring transition",
    // checked
    "checked:enabled:border-accent checked:enabled:bg-accent checked:enabled:hover:border-mix-accent/8 checked:enabled:hover:mix-with-accent-foreground",
    // indeterminate
    "indeterminate:enabled:border-accent indeterminate:enabled:bg-accent indeterminate:enabled:hover:border-mix-accent/8 indeterminate:enabled:hover:mix-with-accent-foreground",
    // checked checkmark
    "before:absolute checked:before:content-['✓'] before:text-accent-foreground checked:before:text-xs checked:before:font-bold",
    // indeterminate dash
    "indeterminate:before:w-1.5 indeterminate:before:h-0.5 indeterminate:before:bg-accent-foreground",
    // disabled
    "disabled:cursor-not-allowed disabled:border-foreground/5 disabled:bg-foreground/10 disabled:checked:before:text-foreground/50 disabled:indeterminate:before:bg-foreground/50",
  ],
});

const Checkbox = ({
  ref,
  indeterminate,
  className,
  ...props
}: CheckboxProps) => {
  const internalRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      type="checkbox"
      ref={composeRefs(ref, internalRef)}
      className={checkboxStyle({ className })}
      {...props}
    />
  );
};

export { Checkbox };
