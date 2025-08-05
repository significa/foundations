"use client";

import { cva } from "@/lib/utils";

interface SliderProps
  extends Omit<React.ComponentPropsWithRef<"input">, "onChange"> {
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number;
  onChange?: (value: number) => void;
  orientation?: "horizontal" | "vertical";
}

const containerStyle = cva({
  base: [
    // CSS variables
    "[--track-thickness:--spacing(2)]",
    "[--thumb-size:--spacing(4)]",

    "inline-flex relative",
  ],
  variants: {
    variant: {
      horizontal: "items-center w-56 h-(--track-thickness)",
      vertical: "justify-center w-(--track-thickness) h-56",
    },
    disabled: {
      true: "opacity-60 pointer-events-none",
      false: "",
    },
  },
  defaultVariants: {
    variant: "horizontal",
    disabled: false,
  },
});

const inputStyle = cva({
  base: [
    "absolute cursor-pointer appearance-none rounded-full outline-none",

    // thumb
    // webkit
    "[&::-webkit-slider-thumb]:appearance-none",
    "[&::-webkit-slider-thumb]:transition-transform",
    "[&::-webkit-slider-thumb]:h-(--thumb-size) [&::-webkit-slider-thumb]:w-(--thumb-size) [&::-webkit-slider-thumb]:bg-foreground",
    "[&::-webkit-slider-thumb]:rounded-full z-10",
    // firefox
    "[&::-moz-range-thumb]:border-none",
    "[&::-moz-range-thumb]:transition-transform",
    "[&::-moz-range-thumb]:h-(--thumb-size) [&::-moz-range-thumb]:w-(--thumb-size) [&::-moz-range-thumb]:bg-foreground",
    "[&::-moz-range-thumb]:rounded-full",

    // thumb hover
    // webkit
    "[&::-webkit-slider-thumb:hover]:scale-130",
    // firefox
    "[&::-moz-range-thumb:hover]:scale-130",

    // thumb active
    // webkit
    "[&:active::-webkit-slider-thumb]:ring-5",
    "[&:active::-webkit-slider-thumb]:ring-foreground/40",
    // firefox
    "[&:active::-moz-range-thumb]:ring-5",
    "[&:active::-moz-range-thumb]:ring-foreground/40",

    // thumb focus
    // webkit (chrome, safari)
    "[&:focus::-webkit-slider-thumb]:ring-5",
    "[&:focus::-webkit-slider-thumb]:ring-foreground/40",
    // firefox
    "[&:focus::-moz-range-thumb]:ring-5",
    "[&:focus::-moz-range-thumb]:ring-foreground/40",
  ],
  variants: {
    variant: {
      horizontal: [
        "w-full h-(--track-thickness)",

        // thumb
        // webkit
        "[&::-webkit-slider-thumb]:-mt-[calc(var(--thumb-size)-var(--track-thickness))/2]",
        // firefox
        "[&::-moz-range-thumb]:-mt-[calc(var(--thumb-size)-var(--track-thickness))/2]",

        // track
        // webkit
        "[&::-webkit-slider-runnable-track]:h-(--track-thickness)",
        // firefox
        "[&::-moz-range-track]:h-(--track-thickness)",
      ],
      vertical: [
        "w-(--track-thickness) h-full [writing-mode:vertical-lr] [direction:rtl]",

        // thumb
        // webkit
        "[&::-webkit-slider-thumb]:-ml-[calc(var(--thumb-size)-var(--track-thickness))/2]",
        // firefox
        "[&::-moz-range-thumb]:-ml-[calc(var(--thumb-size)-var(--track-thickness))/2]",

        // track
        // webkit
        "[&::-webkit-slider-runnable-track]:w-(--track-thickness)",
        // firefox
        "[&::-moz-range-track]:w-(--track-thickness)",
      ],
    },
  },
  defaultVariants: {
    variant: "horizontal",
  },
});

const backgroundTrackStyle = cva({
  base: ["absolute bg-foreground-secondary/40 rounded-full"],
  variants: {
    variant: {
      horizontal:
        "left-[calc(var(--thumb-size)/2)] w-[calc(100%-var(--thumb-size))] h-(--track-thickness)",
      vertical:
        "bottom-[calc(var(--thumb-size)/2)] w-(--track-thickness) h-[calc(100%-var(--thumb-size))]",
    },
  },
  defaultVariants: {
    variant: "horizontal",
  },
});

const progressTrackStyle = cva({
  base: ["absolute bg-foreground/90 rounded-full z-5"],
  variants: {
    variant: {
      horizontal: "left-[calc(var(--thumb-size)/2)]",
      vertical: "bottom-[calc(var(--thumb-size)/2)]",
    },
  },
  defaultVariants: {
    variant: "horizontal",
  },
});

const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue,
  onChange,
  orientation = "horizontal",
  disabled = false,
  className,
  ...props
}: SliderProps) => {
  const calcProgressTrackFactor = (value: number) => value / max;

  return (
    <div
      className={containerStyle({ variant: orientation, disabled, className })}
      style={{
        "--progress-track-factor": `${calcProgressTrackFactor(defaultValue)}`,
      }}
    >
      <div className={backgroundTrackStyle({ variant: orientation })} />
      <div
        className={progressTrackStyle({ variant: orientation })}
        style={{
          [orientation === "horizontal" ? "width" : "height"]:
            `calc(var(--progress-track-factor)*100% - var(--thumb-size) * var(--progress-track-factor))`,
          [orientation === "horizontal" ? "height" : "width"]:
            `var(--track-thickness)`,
        }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        defaultValue={defaultValue}
        onChange={(e) => {
          const target = e.target;
          target.parentElement?.style.setProperty(
            "--progress-track-factor",
            `${calcProgressTrackFactor(Number(target.value))}`
          );
          onChange?.(Number(target.value));
        }}
        className={inputStyle({ variant: orientation })}
        disabled={disabled}
        {...props}
      />
    </div>
  );
};

export { Slider };
