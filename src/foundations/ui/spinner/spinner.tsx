import type { VariantProps } from "cva";

import { cva } from "#/lib/utils/classnames.ts";

const spinnerStyle = cva({
  base: [
    "inline-block shrink-0 rounded-full align-middle",
    "border-current/40 border-t-current border-r-current",
    // Reduced motion: a slow pulse instead of rotation, so the spinner still reads as busy
    "animate-spin motion-reduce:animate-pulse",
  ],
  variants: {
    size: {
      xs: "size-2 border",
      sm: "size-3 border",
      md: "size-4 border-2",
      lg: "size-5 border-2",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface SpinnerProps
  extends Omit<React.ComponentPropsWithRef<"span">, "children">,
    VariantProps<typeof spinnerStyle> {
  /**
   * Visually hidden text that names the spinner as a status. Assistive tech may not announce it
   * when it first appears. Omit when the context already says it's busy (e.g. a loading Button).
   */
  label?: string;
}

const Spinner = ({ className, size, label, ...props }: SpinnerProps) => {
  const a11yProps = label ? { role: "status" } : { "aria-hidden": true as const };

  return (
    <span className={spinnerStyle({ size, className })} {...a11yProps} {...props}>
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
};

export type { SpinnerProps };
export { Spinner };
