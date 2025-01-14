"use client";

import { cn } from "@/lib/utils";

interface DividerProps extends React.ComponentPropsWithRef<"div"> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

const Divider = ({
  className,
  orientation = "horizontal",
  decorative,
  ...props
}: DividerProps) => {
  // https://github.com/radix-ui/primitives/blob/main/packages/react/separator/src/Separator.tsx
  // `aria-orientation` defaults to `horizontal` so we only need it if `orientation` is vertical
  const ariaOrientation = orientation === "vertical" ? orientation : undefined;
  const semanticProps = decorative
    ? { role: "none" }
    : { "aria-orientation": ariaOrientation, role: "separator" };

  return (
    <div
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...semanticProps}
      {...props}
    />
  );
};

export { Divider };
