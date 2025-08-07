"use client";

import { useEffect, useId } from "react";

import { cn } from "@/lib/utils";
import { useField } from "./field";

const FieldDescription = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithRef<"p">) => {
  const generatedId = useId();
  const id = props.id ?? generatedId;

  const fieldCtx = useField();

  useEffect(() => {
    if (!fieldCtx) return;

    const unregister = fieldCtx.registerElement("description", id);

    return unregister;
  }, [fieldCtx, id]);

  return (
    <p
      className={cn(
        "text-foreground-secondary text-base font-medium",
        className
      )}
      id={id}
      {...props}
    >
      {children}
    </p>
  );
};

export { FieldDescription };
