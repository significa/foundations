"use client";

import {
  createContext,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import { Slot } from "@/foundations/components/slot/slot";
import { composeRefs } from "@/foundations/utils/compose-refs/compose-refs";
import { cn, cva } from "@/lib/utils";

interface SliderContextValue {
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  step: number;
  orientation: "horizontal" | "vertical";
  disabled: boolean;
  onValueChange?: (value: number) => void;
  progressFactor: number;
}

const SliderContext = createContext<SliderContextValue | null>(null);

const useSliderContext = () => {
  const context = use(SliderContext);
  if (!context) {
    throw new Error("Slider components must be used within a Slider");
  }
  return context;
};

const sliderStyle = cva({
  base: [
    "[--track-thickness:--spacing(2)]",
    "[--thumb-size:--spacing(4)]",
    "inline-flex relative outline-none focus:outline-none",
  ],
  variants: {
    orientation: {
      horizontal: "items-center w-56 h-(--track-thickness)",
      vertical: "justify-center w-(--track-thickness) h-56",
    },
    disabled: {
      true: "opacity-60 pointer-events-none",
      false: "",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    disabled: false,
  },
});

interface SliderProps
  extends Omit<
    React.ComponentPropsWithRef<"div">,
    "onChange" | "defaultValue"
  > {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  asChild?: boolean;
}

const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  value: valueProp,
  defaultValue = min,
  onValueChange,
  orientation = "horizontal",
  disabled = false,
  className,
  asChild,
  children,
  ref,
  ...props
}: SliderProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = valueProp ?? internalValue;

  const setValue = useCallback(
    (newValue: number) => {
      if (valueProp === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [valueProp, onValueChange]
  );

  const progressFactor = useMemo(() => value / max, [value, max]);

  const contextValue = useMemo(
    () => ({
      value,
      setValue,
      min,
      max,
      step,
      orientation,
      disabled,
      onValueChange,
      progressFactor,
    }),
    [
      value,
      setValue,
      min,
      max,
      step,
      orientation,
      disabled,
      onValueChange,
      progressFactor,
    ]
  );

  const Comp = asChild ? Slot : "div";

  return (
    <SliderContext value={contextValue}>
      <Comp
        ref={ref}
        className={cn(sliderStyle({ orientation, disabled }), className)}
        style={{
          "--progress-track-factor": `${progressFactor}`,
        }}
        tabIndex={-1}
        {...props}
      >
        {children}
      </Comp>
    </SliderContext>
  );
};

const sliderTrackStyle = cva({
  base: [
    "absolute bg-foreground-secondary/40 rounded-full pointer-events-none",
  ],
  variants: {
    orientation: {
      horizontal:
        "left-[calc(var(--thumb-size)/2)] w-[calc(100%-var(--thumb-size))] h-(--track-thickness)",
      vertical:
        "bottom-[calc(var(--thumb-size)/2)] w-(--track-thickness) h-[calc(100%-var(--thumb-size))]",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

interface SliderTrackProps extends React.ComponentPropsWithRef<"div"> {
  asChild?: boolean;
}

const SliderTrack = ({
  className,
  asChild,
  ref,
  ...props
}: SliderTrackProps) => {
  const { orientation } = useSliderContext();
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      ref={ref}
      className={cn(sliderTrackStyle({ orientation }), className)}
      tabIndex={-1}
      {...props}
    />
  );
};

const sliderRangeStyle = cva({
  base: ["absolute bg-accent/90 rounded-full z-5 pointer-events-none"],
  variants: {
    orientation: {
      horizontal: "left-0 h-(--track-thickness)",
      vertical: "bottom-0 w-(--track-thickness)",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

interface SliderRangeProps extends React.ComponentPropsWithRef<"div"> {
  asChild?: boolean;
}

const SliderRange = ({
  className,
  asChild,
  ref,
  style,
  ...props
}: SliderRangeProps) => {
  const { orientation } = useSliderContext();
  const Comp = asChild ? Slot : "div";

  const rangeStyle = {
    [orientation === "horizontal" ? "width" : "height"]:
      `calc(var(--progress-track-factor) * 100%)`,
    ...style,
  };

  return (
    <Comp
      ref={ref}
      className={cn(sliderRangeStyle({ orientation }), className)}
      style={rangeStyle}
      tabIndex={-1}
      {...props}
    />
  );
};

const sliderThumbStyle = cva({
  base: [
    "absolute z-10 cursor-pointer appearance-none rounded-full outline-none",

    // Reset default styles
    "[&::-webkit-slider-thumb]:appearance-none",
    "[&::-moz-range-thumb]:border-none",

    // Thumb styles
    "[&::-webkit-slider-thumb]:transition",
    "[&::-webkit-slider-thumb]:h-(--thumb-size) [&::-webkit-slider-thumb]:w-(--thumb-size) [&::-webkit-slider-thumb]:bg-foreground",
    "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:z-10",
    "[&::-moz-range-thumb]:transition",
    "[&::-moz-range-thumb]:h-(--thumb-size) [&::-moz-range-thumb]:w-(--thumb-size) [&::-moz-range-thumb]:bg-foreground",
    "[&::-moz-range-thumb]:rounded-full",

    // Hover states
    "[&::-webkit-slider-thumb:hover]:scale-130",
    "[&::-moz-range-thumb:hover]:scale-130",

    // Active states
    "[&:active::-webkit-slider-thumb]:ring-4",
    "[&:active::-webkit-slider-thumb]:ring-foreground/40",
    "[&:active::-moz-range-thumb]:ring-4",
    "[&:active::-moz-range-thumb]:ring-foreground/40",

    // Focus states - apply to pseudo-elements only
    "[&:focus-visible::-webkit-slider-thumb]:ring-4",
    "[&:focus-visible::-webkit-slider-thumb]:ring-ring",
    "[&:focus-visible::-moz-range-thumb]:ring-4",
    "[&:focus-visible::-moz-range-thumb]:ring-ring",
  ],
  variants: {
    orientation: {
      horizontal: [
        "w-full h-(--track-thickness)",
        "[&::-webkit-slider-thumb]:-mt-[calc(var(--thumb-size)-var(--track-thickness))/2]",
        "[&::-moz-range-thumb]:-mt-[calc(var(--thumb-size)-var(--track-thickness))/2]",
        "[&::-webkit-slider-runnable-track]:h-(--track-thickness)",
        "[&::-moz-range-track]:h-(--track-thickness)",
      ],
      vertical: [
        "w-(--track-thickness) h-full [writing-mode:vertical-lr] [direction:rtl]",
        "[&::-webkit-slider-thumb]:-ml-[calc(var(--thumb-size)-var(--track-thickness))/2]",
        "[&::-moz-range-thumb]:-ml-[calc(var(--thumb-size)-var(--track-thickness))/2]",
        "[&::-webkit-slider-runnable-track]:w-(--track-thickness)",
        "[&::-moz-range-track]:w-(--track-thickness)",
      ],
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

type SliderThumbProps = Omit<
  React.ComponentPropsWithRef<"input">,
  "value" | "type"
>;

const SliderThumb = ({
  className,
  onChange,
  ref,
  ...props
}: SliderThumbProps) => {
  const { value, setValue, min, max, step, orientation, disabled } =
    useSliderContext();

  const internalRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      setValue(newValue);

      // Update CSS variable for range visualization
      const sliderElement = e.target.closest(
        '[style*="--progress-track-factor"]'
      ) as HTMLElement;
      if (sliderElement) {
        sliderElement.style.setProperty(
          "--progress-track-factor",
          `${newValue / max}`
        );
      }

      onChange?.(e);
    },
    [setValue, max, onChange]
  );

  return (
    <input
      ref={composeRefs(ref, internalRef)}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      onChange={handleChange}
      className={cn(sliderThumbStyle({ orientation }), className)}
      {...props}
    />
  );
};

export { Slider, SliderRange, SliderThumb, SliderTrack };
