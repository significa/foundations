"use client";

import { useEffect, useId } from "react";

import { cn } from "@/lib/utils";
import { useField } from "@/foundations/ui/field/field";

const Label = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithRef<"label">) => {
  const generatedId = useId();
  const id = props.id ?? generatedId;

  const fieldCtx = useField();

  useEffect(() => {
    if (!fieldCtx) return;

    const unregister = fieldCtx.registerElement("label", id);

    return unregister;
  }, [fieldCtx, id]);

  return (
    <label
      className={cn("text-foreground text-base font-medium", className)}
      htmlFor={fieldCtx?.id}
      id={id}
      {...props}
    >
      {children}
    </label>
  );
};

export { Label };
