"use client";

import { cn } from "@/lib/utils";

const Skeleton = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) => {
  return (
    <div
      className={cn("bg-foreground/10 animate-pulse rounded-md", className)}
      {...props}
    />
  );
};

export { Skeleton };
