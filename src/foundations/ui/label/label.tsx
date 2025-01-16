"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

const Label = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithRef<"label">) => {
  const generatedId = useId();
  const id = props.id ?? generatedId;

  return (
    <label
      className={cn("text-foreground text-base font-medium", className)}
      id={id}
      {...props}
    >
      {children}
    </label>
  );
};

export { Label };
