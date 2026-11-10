import type { VariantProps } from "cva";

import { cva } from "#/lib/utils/classnames.ts";

// Opacity only, nothing moves: safe under reduced motion as is
const keyframes = `
@keyframes spinner-dot {
  0%, 80%, 100% { opacity: 0.25; }
  40% { opacity: 1; }
}`;

const spinnerStyle = cva({
  base: "inline-flex shrink-0 items-center justify-center align-middle",
  variants: {
    size: {
      xs: "size-2 gap-0.5",
      sm: "size-3 gap-0.5",
      md: "size-4 gap-0.75",
      lg: "size-5 gap-1",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const dotStyle = cva({
  base: "animate-[spinner-dot_1.4s_ease-in-out_infinite_both] rounded-full bg-current",
  variants: {
    size: {
      xs: "size-px",
      sm: "size-0.5",
      md: "size-0.75",
      lg: "size-1",
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
      <style href="spinner-dot" precedence="default">
        {keyframes}
      </style>
      {label && <span className="sr-only">{label}</span>}
      <span className={dotStyle({ size })} />
      <span className={dotStyle({ size })} style={{ animationDelay: "160ms" }} />
      <span className={dotStyle({ size })} style={{ animationDelay: "320ms" }} />
    </span>
  );
};

export type { SpinnerProps };
export { Spinner };
