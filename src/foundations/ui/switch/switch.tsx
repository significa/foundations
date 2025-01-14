"use client";

import { cn } from "@/lib/utils";
import { useField } from "@/foundations/ui/field/field";

const Switch = ({
  className,
  id,
  ...props
}: Omit<React.ComponentPropsWithRef<"input">, "type">) => {
  const fieldCtx = useField();

  return (
    <input
      type="checkbox"
      id={id ?? fieldCtx?.id}
      aria-errormessage={fieldCtx?.["aria-errormessage"]}
      aria-describedby={fieldCtx?.["aria-describedby"]}
      aria-labelledby={fieldCtx?.["aria-labelledby"]}
      className={cn(
        "appearance-none",
        "bg-foreground/20 relative h-6 w-11 cursor-pointer rounded-xl transition",
        // circle
        "before:ease-out-expo before:bg-background before:absolute before:top-0.5 before:left-0.5 before:size-5 before:rounded-xl before:transition-transform before:duration-200",
        // disabled
        "disabled:before:opacity-30",
        // checked
        "checked:bg-foreground checked:before:translate-x-full",
        // focus
        "focus-visible:ring-ring focus-visible:ring-4 focus-visible:outline-none",
        // stretch animation
        "before:origin-left active:before:scale-x-110 active:before:rounded-[calc(var(--spacing)*2.25)] active:checked:before:origin-right",
        className
      )}
      {...props}
    />
  );
};

export { Switch };
