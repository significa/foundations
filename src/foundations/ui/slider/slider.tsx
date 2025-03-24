"use client";

import { cva } from "@/lib/utils";

interface SliderProps extends Omit<React.ComponentPropsWithRef<"input">, 'onChange'> {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange?: (value: number) => void;
  orientation?: 'horizontal' | 'vertical';
}

const containerStyle = cva({
  base: [
    // CSS variables
    '[--track-thickness:--spacing(2)]',
    '[--thumb-size:--spacing(4)]',

    'relative flex',
  ],
  variants: {
    variant: { 
      horizontal: "items-center w-full h-[var(--track-thickness)]",
      vertical:
        "justify-center w-[var(--track-thickness)] h-full",
    },
  },
  defaultVariants: {
    variant: "horizontal",
  },
});

const inputStyle = cva({
  base: [
    'absolute cursor-pointer appearance-none rounded-full',

    // thumb
    // webkit (chrome, safari)
    '[&::-webkit-slider-thumb]:appearance-none',
    '[&::-webkit-slider-thumb]:h-[var(--thumb-size)] [&::-webkit-slider-thumb]:w-[var(--thumb-size)] [&::-webkit-slider-thumb]:bg-gray-100',
    '[&::-webkit-slider-thumb]:-mt-[calc((var(--thumb-size)-var(--track-thickness))/2)] [&::-webkit-slider-thumb]:rounded-full z-[1000]',
    // firefox
    '[&::-moz-range-thumb]:border-none',
    '[&::-moz-range-thumb]:h-[var(--thumb-size)] [&::-moz-range-thumb]:w-[var(--thumb-size)] [&::-moz-range-thumb]:bg-gray-100',
    '[&::-moz-range-thumb]:rounded-full',
    // ie + edge
    '[&::-ms-thumb]:appearance-none',
    '[&::-ms-thumb]:h-[var(--thumb-size)] [&::-ms-thumb]:w-[var(--thumb-size)] [&::-ms-thumb]:bg-gray-100',
    '[&::-ms-thumb]:rounded-full',

    // thumb hover
    // webkit (chrome, safari)
    '[&::-webkit-slider-thumb:hover]:scale-130',
    // firefox
    '[&::-moz-range-thumb:hover]:scale-130',
    // ie + edge
    '[&::-ms-thumb:hover]:scale-130',

    // thumb active
    // webkit (chrome, safari)
    '[&:active::-webkit-slider-thumb]:ring-5',
    '[&:active::-webkit-slider-thumb]:ring-gray-400/50',
    // firefox
    '[&:active::-moz-range-thumb]:ring-5',
    '[&:active::-moz-range-thumb]:ring-red-400/50',
    // ie + edge
    '[&:active::-ms-thumb]:ring-5',
    '[&:active::-ms-thumb]:ring-gray-400/50',

    // thumb focus
    // webkit (chrome, safari)
    '[&:focus::-webkit-slider-thumb]:ring-5',
    '[&:focus::-webkit-slider-thumb]:ring-gray-400/50',
    // firefox
    '[&:focus::-moz-range-thumb]:ring-5',
    '[&:focus::-moz-range-thumb]:ring-gray-400/50',
    // ie + edge
    '[&:focus::-ms-thumb]:ring-5',
    '[&:focus::-ms-thumb]:ring-gray-400/50',
  ],
  variants: {
    variant: {
      horizontal: [
        'w-full h-[var(--track-thickness)]',

        // track
        // webkit (chrome, safari)
        '[&::-webkit-slider-runnable-track]:h-[var(--track-thickness)]',
        // firefox
        '[&::-moz-range-track]:h-[var(--track-thickness)]',
        // ie + edge
        '[&::-ms-track]:h-[var(--track-thickness)]',
      ],
      vertical: [
        "w-[var(--track-thickness)] h-full [writing-mode:vertical-lr] [direction:rtl]",

        // track
        // webkit (chrome, safari)
        '[&::-webkit-slider-runnable-track]:w-[var(--track-thickness)]',
        // firefox
        '[&::-moz-range-track]:w-[var(--track-thickness)]',
        // ie + edge
        '[&::-ms-track]:w-[var(--track-thickness)]',
      ],
    },
  },
  defaultVariants: {
    variant: "horizontal",
  },
});

const backgroundTrackStyle = cva({
  base: [
    'absolute bg-gray-800 rounded-full',
  ],
  variants: {
    variant: {
      horizontal: "left-[calc(var(--thumb-size)/2)] w-[calc(100%-var(--thumb-size))] h-[var(--track-thickness)]",
      vertical: "bottom-[calc(var(--thumb-size)/2)] w-[var(--track-thickness)] h-[calc(100%-var(--thumb-size))]",
    },
  },
  defaultVariants: {
    variant: "horizontal",
  },
});

const progressTrackStyle = cva({
  base: [
    'absolute bg-gray-200 rounded-full z-[500]',
  ],
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
  value,
  onChange,
  orientation = 'horizontal',
  ...props
}: SliderProps) => {
  const calcProgressTrackFactor = (value: number) => value / max;

  return (
    <div
      className={containerStyle({ variant: orientation })}
      style={{
        "--progress-track-factor": `${calcProgressTrackFactor(value)}`
      } as React.CSSProperties}
    >
      <div className={backgroundTrackStyle({ variant: orientation })} />
      <div 
        className={progressTrackStyle({ variant: orientation })}
        style={{
          width: orientation === 'horizontal' ? `calc(var(--progress-track-factor)*100% - var(--thumb-size) * var(--progress-track-factor))` : 'var(--track-thickness)',
          height: orientation === 'vertical' ? `calc(var(--progress-track-factor)*100% - var(--thumb-size) * var(--progress-track-factor))` : 'var(--track-thickness)',
        }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        defaultValue={value}
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          target.parentElement?.style.setProperty('--progress-track-factor', `${calcProgressTrackFactor(Number(target.value))}`);
          onChange?.(Number(target.value));
        }}
        className={inputStyle({ variant: orientation })}
        {...props}
      />
    </div>
  );
};

export { Slider };
