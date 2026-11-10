import type { VariantProps } from "cva";

import { cva } from "#/lib/utils/classnames.ts";

// The frames sit in a column behind a one-row window and step with translateY + steps(), so the
// animation runs in CSS and keeps going while the main thread is busy (a setInterval would freeze).
const keyframes = `
@keyframes spinner-frames {
  to { transform: translateY(-100%); }
}`;

const BRAILLE = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const FRAME_MS = 80;

const spinnerStyle = cva({
  base: "inline-flex shrink-0 items-center justify-center align-middle font-mono leading-none",
  variants: {
    size: {
      xs: "size-2.5 text-2xs",
      sm: "size-3 text-xs",
      md: "size-4 text-base",
      lg: "size-5 text-xl",
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
  /** Glyphs to step through, one per frame. */
  frames?: readonly string[];
}

const Spinner = ({ className, size, label, frames = BRAILLE, ...props }: SpinnerProps) => {
  const a11yProps = label ? { role: "status" } : { "aria-hidden": true as const };

  return (
    <span className={spinnerStyle({ size, className })} {...a11yProps} {...props}>
      <style href="spinner-frames" precedence="default">
        {keyframes}
      </style>
      {label && <span className="sr-only">{label}</span>}
      {/* Reduced motion: hold the first frame and pulse instead. The glyphs are never read out */}
      <span aria-hidden className="block h-[1em] overflow-hidden motion-reduce:animate-pulse">
        <span
          className="flex animate-[spinner-frames_1s_infinite] flex-col motion-reduce:animate-none"
          style={{
            animationDuration: `${frames.length * FRAME_MS}ms`,
            animationTimingFunction: `steps(${frames.length})`,
          }}
        >
          {frames.map((frame, index) => (
            <span key={index} className="flex h-[1em] items-center justify-center overflow-hidden">
              {frame}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
};

export type { SpinnerProps };
export { Spinner };
