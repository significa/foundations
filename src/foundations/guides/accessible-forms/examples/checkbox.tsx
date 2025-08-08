"use client";

import { useEffect, useRef } from "react";

import { composeRefs } from "@/foundations/utils/compose-refs/compose-refs";
import { cva } from "@/lib/utils";

import { useField } from "../field";

interface CheckboxProps
  extends Omit<React.ComponentPropsWithRef<"input">, "type"> {
  indeterminate?: boolean;
}

const checkboxStyle = cva({
  base: [
    "appearance-none relative size-5 shrink-0 outline-none rounded-sm border border-border bg-background shadow-xs enabled:cursor-pointer enabled:not-checked:hover:border-border-hard flex items-center justify-center focus-visible:ring-4 ring-ring transition",
    // checked
    "checked:enabled:border-foreground checked:enabled:bg-foreground",
    // indeterminate
    "indeterminate:enabled:border-foreground indeterminate:enabled:bg-foreground",
    // checked checkmark
    "before:absolute checked:before:content-['✓'] before:text-background checked:before:text-xs checked:before:font-bold",
    // indeterminate dash
    "indeterminate:before:w-1.5 indeterminate:before:h-0.5 indeterminate:before:bg-background",
    // disabled
    "disabled:cursor-not-allowed disabled:border-foreground/5 disabled:bg-foreground/10 disabled:checked:before:text-foreground/50 disabled:indeterminate:before:bg-foreground/50",
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
      aria-errormessage={fieldCtx?.["aria-errormessage"]}
      aria-describedby={fieldCtx?.["aria-describedby"]}
      aria-labelledby={fieldCtx?.["aria-labelledby"]}
      className={checkboxStyle({ className })}
      {...props}
    />
  );
};

export { Checkbox };
