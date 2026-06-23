import type { VariantProps } from "cva";
import { useEffect, useState } from "react";

import { cva } from "@/lib/utils/classnames";

type SpinnerSize = "xs" | "sm" | "md" | "lg";
type SpinnerVariant = "ring" | "dots" | "bars" | "frames";

interface BaseSpinnerProps extends React.ComponentPropsWithRef<"div"> {
  size?: SpinnerSize;
}

const ringStyle = cva({
  base: [
    "relative animate-spin",
    "before:absolute before:top-0 before:left-0 before:block before:size-full before:rounded-full before:border-current before:opacity-40",
    "after:top-0 after:left-0 after:block after:size-full after:rounded-full after:border-transparent after:border-t-current after:border-r-current",
  ],
  variants: {
    size: {
      xs: "size-2 before:border after:border",
      sm: "size-3 before:border after:border",
      md: "size-4 before:border-2 after:border-2",
      lg: "size-5 before:border-2 after:border-2",
    } satisfies Record<SpinnerSize, string>,
  },
});

const SpinnerRing = ({ ref, className, size = "md", ...props }: BaseSpinnerProps) => {
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label="loading"
      className={ringStyle({ size, className })}
      {...props}
    />
  );
};

const dotsContainerStyle = cva({
  base: "inline-flex items-center",
  variants: {
    size: {
      xs: "gap-0.5",
      sm: "gap-0.5",
      md: "gap-1",
      lg: "gap-1",
    } satisfies Record<SpinnerSize, string>,
  },
});

const dotStyle = cva({
  base: "animate-spinner-dot rounded-full bg-current",
  variants: {
    size: {
      xs: "size-px",
      sm: "size-0.5",
      md: "size-0.75",
      lg: "size-1",
    } satisfies Record<SpinnerSize, string>,
  },
});

const SpinnerDots = ({ ref, className, size = "md", ...props }: BaseSpinnerProps) => {
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label="loading"
      className={dotsContainerStyle({ size, className })}
      {...props}
    >
      <span className={dotStyle({ size })} />
      <span className={dotStyle({ size })} style={{ animationDelay: "160ms" }} />
      <span className={dotStyle({ size })} style={{ animationDelay: "320ms" }} />
    </div>
  );
};

const barsContainerStyle = cva({
  base: "inline-flex items-center",
  variants: {
    size: {
      xs: "h-2 gap-0.5",
      sm: "h-3 gap-0.5",
      md: "h-4 gap-1",
      lg: "h-5 gap-1",
    } satisfies Record<SpinnerSize, string>,
  },
});

const barStyle = cva({
  base: "h-full origin-center animate-spinner-bar bg-current",
  variants: {
    size: {
      xs: "w-px",
      sm: "w-0.25",
      md: "w-0.5",
      lg: "w-0.75",
    } satisfies Record<SpinnerSize, string>,
  },
});

const SpinnerBars = ({ ref, className, size = "md", ...props }: BaseSpinnerProps) => {
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label="loading"
      className={barsContainerStyle({ size, className })}
      {...props}
    >
      <span className={barStyle({ size })} />
      <span className={barStyle({ size })} style={{ animationDelay: "120ms" }} />
      <span className={barStyle({ size })} style={{ animationDelay: "240ms" }} />
    </div>
  );
};

export const SPINNER_FRAMES = {
  braille: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  bounce: ["⠁", "⠂", "⠄", "⠂"],
  moon: ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"],
  sparkle: ["✶", "✸", "✹", "✺", "✹", "✷"],
  dots: ["●", "◉", "◎", "○", "◌", "◦", "∘", "·"],
  shades: ["█", "▓", "▒", "░", " ", "░", "▒", "▓"],
  pipe: ["|", "/", "-", "\\"],
} as const satisfies Record<string, readonly string[]>;

const framesStyle = cva({
  base: "inline-flex items-center justify-center font-mono tabular-nums leading-none",
  variants: {
    size: {
      xs: "size-2.5 text-2xs",
      sm: "size-3 text-xs",
      md: "size-4 text-base",
      lg: "size-5 text-xl",
    } satisfies Record<SpinnerSize, string>,
  },
});

interface SpinnerFramesProps extends BaseSpinnerProps {
  /** Frames to cycle through. Defaults to `SPINNER_FRAMES.braille`. */
  frames?: readonly string[];
  /** Milliseconds between frames. */
  interval?: number;
}

const SpinnerFrames = ({
  ref,
  className,
  size = "md",
  frames = SPINNER_FRAMES.braille,
  interval = 80,
  ...props
}: SpinnerFramesProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % frames.length);
    }, interval);

    return () => window.clearInterval(id);
  }, [frames.length, interval]);

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label="loading"
      className={framesStyle({ size, className })}
      {...props}
    >
      <span aria-hidden="true">{frames[index]}</span>
    </div>
  );
};

export interface SpinnerProps extends BaseSpinnerProps, VariantProps<typeof ringStyle> {
  variant?: SpinnerVariant;
  /** Frames to cycle through when `variant="frames"`. */
  frames?: readonly string[];
  /** Milliseconds between frames when `variant="frames"`. */
  interval?: number;
}

const Spinner = ({ variant = "ring", frames, interval, ...props }: SpinnerProps) => {
  if (variant === "dots") return <SpinnerDots {...props} />;
  if (variant === "bars") return <SpinnerBars {...props} />;
  if (variant === "frames") return <SpinnerFrames frames={frames} interval={interval} {...props} />;
  return <SpinnerRing {...props} />;
};

export { Spinner };
