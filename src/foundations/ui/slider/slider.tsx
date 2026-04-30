import {
  createContext,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Slot } from '@/foundations/components/slot/slot';
import { composeRefs } from '@/foundations/utils/compose-refs/compose-refs';
import { cn, cva } from '@/lib/utils/classnames';

interface SliderContextValue {
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  step: number;
  orientation: 'horizontal' | 'vertical';
  disabled: boolean;
  onValueChange?: (value: number) => void;
  progressFactor: number;
}

const SliderContext = createContext<SliderContextValue | null>(null);

const useSliderContext = () => {
  const context = use(SliderContext);
  if (!context) {
    throw new Error('Slider components must be used within a Slider');
  }
  return context;
};

const sliderStyle = cva({
  base: [
    '[--track-thickness:--spacing(2)]',
    '[--thumb-size:--spacing(4)]',
    'relative inline-flex outline-none focus:outline-none',
  ],
  variants: {
    orientation: {
      horizontal: 'h-(--track-thickness) w-56 items-center',
      vertical: 'h-56 w-(--track-thickness) justify-center',
    },
    disabled: {
      true: 'pointer-events-none opacity-60',
      false: '',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    disabled: false,
  },
});

interface SliderProps
  extends Omit<
    React.ComponentPropsWithRef<'div'>,
    'onChange' | 'defaultValue'
  > {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  orientation?: 'horizontal' | 'vertical';
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
  orientation = 'horizontal',
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

  const progressFactor = useMemo(
    () => (max === min ? 0 : (value - min) / (max - min)),
    [value, min, max]
  );

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

  const Comp = asChild ? Slot : 'div';

  return (
    <SliderContext value={contextValue}>
      <Comp
        ref={ref}
        className={cn(sliderStyle({ orientation, disabled }), className)}
        style={{
          '--progress-track-factor': `${progressFactor}`,
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
    'pointer-events-none absolute rounded-full bg-foreground-secondary/40',
  ],
  variants: {
    orientation: {
      // Inset the track ends by a quarter of the thumb size so the thumb visually
      // extends slightly past the track at min/max, hiding the sliver of track
      // that would otherwise peek out around the thumb's circular edge.
      horizontal:
        'right-[calc(var(--thumb-size)/4)] left-[calc(var(--thumb-size)/4)] h-(--track-thickness)',
      vertical:
        'top-[calc(var(--thumb-size)/4)] bottom-[calc(var(--thumb-size)/4)] w-(--track-thickness)',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

interface SliderTrackProps extends React.ComponentPropsWithRef<'div'> {
  asChild?: boolean;
}

const SliderTrack = ({
  className,
  asChild,
  ref,
  ...props
}: SliderTrackProps) => {
  const { orientation } = useSliderContext();
  const Comp = asChild ? Slot : 'div';

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
  base: ['pointer-events-none absolute z-5 rounded-full bg-accent/90'],
  variants: {
    orientation: {
      horizontal: 'left-0 h-(--track-thickness)',
      vertical: 'bottom-0 w-(--track-thickness)',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

interface SliderRangeProps extends React.ComponentPropsWithRef<'div'> {
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
  const Comp = asChild ? Slot : 'div';

  const rangeStyle = {
    [orientation === 'horizontal' ? 'width' : 'height']:
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
    'absolute z-10 cursor-pointer appearance-none rounded-full outline-none',

    // Reset default styles
    '[&::-webkit-slider-thumb]:appearance-none',

    // Thumb styles
    '[&::-webkit-slider-thumb]:transition',
    '[&::-webkit-slider-thumb]:h-(--thumb-size) [&::-webkit-slider-thumb]:w-(--thumb-size)',
    '[&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-border [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-xs',
    '[&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:rounded-full',
    '[&::-moz-range-thumb]:transition',
    '[&::-moz-range-thumb]:h-(--thumb-size) [&::-moz-range-thumb]:w-(--thumb-size)',
    '[&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-border [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:shadow-xs',
    '[&::-moz-range-thumb]:rounded-full',

    // Hover states
    '[&::-webkit-slider-thumb:hover]:scale-130',
    '[&::-moz-range-thumb:hover]:scale-130',

    // Active states
    '[&:active::-webkit-slider-thumb]:scale-130',
    '[&:active::-moz-range-thumb]:scale-130',

    // Focus states - apply to pseudo-elements only
    '[&:focus-visible::-webkit-slider-thumb]:ring-(length:--ring-width)',
    '[&:focus-visible::-webkit-slider-thumb]:ring-ring',
    '[&:focus-visible::-moz-range-thumb]:ring-(length:--ring-width)',
    '[&:focus-visible::-moz-range-thumb]:ring-ring',
  ],
  variants: {
    orientation: {
      horizontal: [
        'h-(--track-thickness) w-full',
        '[&::-webkit-slider-thumb]:-mt-[calc(var(--thumb-size)-var(--track-thickness))/2]',
        '[&::-moz-range-thumb]:-mt-[calc(var(--thumb-size)-var(--track-thickness))/2]',
        '[&::-webkit-slider-runnable-track]:h-(--track-thickness)',
        '[&::-moz-range-track]:h-(--track-thickness)',
      ],
      vertical: [
        'h-full w-(--track-thickness) [direction:rtl] [writing-mode:vertical-lr]',
        '[&::-webkit-slider-thumb]:-ml-[calc(var(--thumb-size)-var(--track-thickness))/2]',
        '[&::-moz-range-thumb]:-ml-[calc(var(--thumb-size)-var(--track-thickness))/2]',
        '[&::-webkit-slider-runnable-track]:w-(--track-thickness)',
        '[&::-moz-range-track]:w-(--track-thickness)',
      ],
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

type SliderThumbProps = Omit<
  React.ComponentPropsWithRef<'input'>,
  'value' | 'type'
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
          '--progress-track-factor',
          `${max === min ? 0 : (newValue - min) / (max - min)}`
        );
      }

      onChange?.(e);
    },
    [setValue, min, max, onChange]
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

const CompoundSlider = Object.assign(Slider, {
  Track: SliderTrack,
  Range: SliderRange,
  Thumb: SliderThumb,
});

export { CompoundSlider as Slider };
