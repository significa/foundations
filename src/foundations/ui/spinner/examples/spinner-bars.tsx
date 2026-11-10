import type { VariantProps } from "cva";

import { cva } from "#/lib/utils/classnames.ts";

// Reduced motion: the bars hold their height and fade instead of growing
const keyframes = `
@keyframes spinner-bar {
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1); }
}
@keyframes spinner-bar-fade {
  0%, 40%, 100% { opacity: 0.25; }
  20% { opacity: 1; }
}`;

const spinnerStyle = cva({
  base: "inline-flex shrink-0 items-center justify-center align-middle",
  variants: {
    size: {
      xs: "size-2 gap-0.5",
      sm: "size-3 gap-0.5",
      md: "size-4 gap-1",
      lg: "size-5 gap-1",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const barStyle = cva({
  base: [
    "h-full origin-center bg-current",
    "animate-[spinner-bar_1.2s_ease-in-out_infinite_both]",
    "motion-reduce:animate-[spinner-bar-fade_1.2s_ease-in-out_infinite_both]",
  ],
  variants: {
    size: {
      xs: "w-px",
      sm: "w-px",
      md: "w-0.5",
      lg: "w-0.75",
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
      <style href="spinner-bar" precedence="default">
        {keyframes}
      </style>
      {label && <span className="sr-only">{label}</span>}
      <span className={barStyle({ size })} />
      <span className={barStyle({ size })} style={{ animationDelay: "120ms" }} />
      <span className={barStyle({ size })} style={{ animationDelay: "240ms" }} />
    </span>
  );
};

export type { SpinnerProps };
export { Spinner };
