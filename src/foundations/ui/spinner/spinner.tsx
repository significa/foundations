"use client";

import type { VariantProps } from "cva";

import { cva } from "@/lib/utils";

const spinnerStyle = cva({
  base: [
    "relative",
    "animate-spin",
    "before:absolute before:left-0 before:top-0 before:block before:size-full before:rounded-full before:border-current before:opacity-40",
    "after:left-0 after:top-0 after:block after:size-full after:rounded-full after:border-transparent after:border-r-current after:border-t-current",
  ],
  variants: {
    size: {
      xs: "size-2 before:border after:border",
      sm: "size-3 before:border after:border",
      md: "size-4 before:border-2 after:border-2",
      lg: "size-5 before:border-2 after:border-2",
    },
  },
});

export interface SpinnerProps
  extends React.ComponentPropsWithRef<"div">,
    VariantProps<typeof spinnerStyle> {}

const Spinner = ({ className, size = "md", ...props }: SpinnerProps) => {
  return (
    <div
      aria-label="loading"
      role="progressbar"
      className={spinnerStyle({ size, className })}
      {...props}
    />
  );
};

export { Spinner };
