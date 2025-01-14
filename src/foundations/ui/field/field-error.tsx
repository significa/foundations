"use client";

import { useEffect, useId } from "react";

import { cn } from "@/lib/utils";
import { useField } from "@/foundations/ui/field/field";

const FieldError = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithRef<"p">) => {
  const generatedId = useId();
  const id = props.id ?? generatedId;

  const fieldCtx = useField();

  useEffect(() => {
    if (!fieldCtx || !children) return;

    const unregister = fieldCtx.registerElement("error", id);

    return unregister;
  }, [fieldCtx, id, children]);

  if (!children) return null;

  return (
    <p
      className={cn("text-base font-medium text-red-500", className)}
      id={id}
      role="alert"
      {...props}
    >
      {children}
    </p>
  );
};

export { FieldError };
