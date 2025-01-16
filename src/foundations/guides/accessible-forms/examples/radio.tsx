"use client";

import { cn, cva } from "@/lib/utils";

import { useField } from "../field";

const radioStyle = cva({
  base: [
    "appearance-none relative size-5 shrink-0 outline-none rounded-full border border-border bg-background shadow-xs enabled:cursor-pointer flex items-center justify-center enabled:not-checked:hover:border-border-hard focus-visible:ring-4 ring-ring transition",
    // checked
    "checked:enabled:border-foreground checked:enabled:bg-foreground",
    // checked circle
    "checked:before:absolute checked:before:w-1.5 checked:before:h-1.5 checked:before:bg-background checked:before:rounded-full",
    // disabled
    "disabled:cursor-not-allowed disabled:border-foreground/5 disabled:bg-foreground/10 disabled:checked:before:bg-foreground/50",
  ],
});

const Radio = ({
  className,
  id,
  ...props
}: Omit<React.ComponentPropsWithRef<"input">, "type">) => {
  const fieldCtx = useField();

  return (
    <input
      type="radio"
      id={id ?? fieldCtx?.id}
      aria-describedby={fieldCtx?.["aria-describedby"]}
      className={radioStyle({ className })}
      {...props}
    />
  );
};

interface RadioGroupProps extends React.ComponentPropsWithRef<"div"> {
  required?: boolean;
}

const RadioGroup = ({
  children,
  className,
  required,
  ...props
}: RadioGroupProps) => {
  const fieldCtx = useField();

  return (
    <div
      role="radiogroup"
      aria-describedby={fieldCtx?.["aria-describedby"]}
      aria-errormessage={fieldCtx?.["aria-errormessage"]}
      aria-labelledby={fieldCtx?.["aria-labelledby"]}
      aria-required={required}
      className={cn("group", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export { Radio, RadioGroup };
