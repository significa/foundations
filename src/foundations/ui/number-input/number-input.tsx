import { MinusIcon, PlusIcon } from '@phosphor-icons/react/dist/ssr';
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Slot } from '@/foundations/components/slot/slot';
import { Input } from '@/foundations/ui/input/input';
import { cn } from '@/lib/utils/classnames';

interface NumberInputContextValue {
  value: number;
  /** Commit a new value through clamp + step rounding. Returns the committed value. */
  setValue: (next: number) => number;
  increment: (multiplier?: number) => number;
  decrement: (multiplier?: number) => number;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  format: (n: number) => string;
  parse: (s: string) => number;
}

const NumberInputContext = createContext<NumberInputContextValue | null>(null);

const useNumberInputContext = () => {
  const ctx = use(NumberInputContext);
  if (!ctx) {
    throw new Error(
      'NumberInput components must be used within a <NumberInput />'
    );
  }
  return ctx;
};

const stepPrecision = (step: number): number => {
  const s = String(step);
  const i = s.indexOf('.');
  return i === -1 ? 0 : s.length - i - 1;
};

const round = (n: number, precision: number): number => {
  const f = 10 ** precision;
  return Math.round(n * f) / f;
};

const clamp = (n: number, min: number, max: number): number =>
  Math.min(Math.max(n, min), max);

// Default parser: empty string is invalid (triggers revert), otherwise pass to
// Number — which accepts integers, decimals, scientific notation, and signs.
// Locale-aware parsing is up to the consumer via the `parse` prop.
const defaultParse = (s: string): number => {
  const trimmed = s.trim();
  if (trimmed === '') return Number.NaN;
  return Number(trimmed);
};

interface NumberInputProps
  extends Omit<React.ComponentPropsWithRef<'div'>, 'onChange' | 'children'> {
  /** Controlled value. */
  value?: number;
  /** Default value (uncontrolled). Defaults to `min` if finite, otherwise 0. */
  defaultValue?: number;
  /** Called when the value commits (blur / Enter / stepper / keyboard). */
  onValueChange?: (value: number) => void;
  /** Lower bound (inclusive). Defaults to `-Infinity`. */
  min?: number;
  /** Upper bound (inclusive). Defaults to `+Infinity`. */
  max?: number;
  /** Increment step. Defaults to 1. */
  step?: number;
  disabled?: boolean;
  /** Format the committed value for display. Defaults to `String`. */
  format?: (n: number) => string;
  /**
   * Parse the user's typed value. Return `NaN` to reject (the field reverts to
   * the last committed value on blur). Defaults to a `Number`-based parser
   * that treats empty input as invalid.
   */
  parse?: (s: string) => number;
  /**
   * Defaults to `<NumberInput.Decrement /> <NumberInput.Field /> <NumberInput.Increment />`.
   * Pass children to customize the layout (e.g. swap orders, drop a stepper, wrap with Field.Control).
   */
  children?: React.ReactNode;
}

const NumberInput = ({
  value: propsValue,
  defaultValue,
  onValueChange,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  disabled = false,
  format = String,
  parse = defaultParse,
  className,
  children,
  ...rest
}: NumberInputProps) => {
  const isControlled = propsValue !== undefined;
  const [internalValue, setInternalValue] = useState<number>(
    () => defaultValue ?? (Number.isFinite(min) ? min : 0)
  );
  const value = isControlled ? propsValue : internalValue;

  const precision = stepPrecision(step);

  const setValue = useCallback(
    (next: number): number => {
      const committed = round(clamp(next, min, max), precision);
      if (!isControlled) setInternalValue(committed);
      onValueChange?.(committed);
      return committed;
    },
    [isControlled, min, max, precision, onValueChange]
  );

  const increment = useCallback(
    (multiplier = 1) => setValue(value + step * multiplier),
    [value, step, setValue]
  );

  const decrement = useCallback(
    (multiplier = 1) => setValue(value - step * multiplier),
    [value, step, setValue]
  );

  const ctx = useMemo<NumberInputContextValue>(
    () => ({
      value,
      setValue,
      increment,
      decrement,
      min,
      max,
      step,
      disabled,
      format,
      parse,
    }),
    [
      value,
      setValue,
      increment,
      decrement,
      min,
      max,
      step,
      disabled,
      format,
      parse,
    ]
  );

  return (
    <NumberInputContext value={ctx}>
      <Input.Group className={className} {...rest}>
        {children ?? (
          <>
            <NumberInputDecrement />
            <NumberInputField />
            <NumberInputIncrement />
          </>
        )}
      </Input.Group>
    </NumberInputContext>
  );
};

interface NumberInputFieldProps
  extends Omit<
    React.ComponentPropsWithRef<typeof Input>,
    'value' | 'defaultValue' | 'onChange' | 'type' | 'disabled'
  > {}

const NumberInputField = ({
  ref,
  className,
  onBlur,
  onKeyDown,
  ...props
}: NumberInputFieldProps) => {
  const { value, setValue, min, max, step, disabled, format, parse } =
    useNumberInputContext();

  const [draft, setDraft] = useState<string>(() => format(value));

  // Mirror the committed value into the displayed draft. This catches stepper
  // clicks, programmatic value changes, and any browser-specific focus quirks
  // (Safari/Firefox don't focus buttons on click, so a focus gate would miss
  // the stepper-while-field-focused case).
  useEffect(() => {
    setDraft(format(value));
  }, [value, format]);

  const stepBy = (multiplier: number) => {
    const parsed = parse(draft);
    const base = Number.isFinite(parsed) ? parsed : value;
    const committed = setValue(base + step * multiplier);
    setDraft(format(committed));
  };

  const jumpTo = (target: number) => {
    const committed = setValue(target);
    setDraft(format(committed));
  };

  const commit = () => {
    const parsed = parse(draft);
    if (Number.isFinite(parsed)) {
      const committed = setValue(parsed);
      setDraft(format(committed));
    } else {
      setDraft(format(value));
    }
  };

  return (
    <Input
      ref={ref}
      type="text"
      inputMode="decimal"
      role="spinbutton"
      aria-valuenow={value}
      aria-valuetext={format(value)}
      aria-valuemin={Number.isFinite(min) ? min : undefined}
      aria-valuemax={Number.isFinite(max) ? max : undefined}
      value={draft}
      disabled={disabled}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={(e) => {
        commit();
        onBlur?.(e);
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;

        if (e.key === 'Enter') {
          commit();
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          stepBy(e.shiftKey ? 10 : 1);
          return;
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          stepBy(e.shiftKey ? -10 : -1);
          return;
        }
        if (e.key === 'PageUp') {
          e.preventDefault();
          stepBy(10);
          return;
        }
        if (e.key === 'PageDown') {
          e.preventDefault();
          stepBy(-10);
          return;
        }
        if (e.key === 'Home' && Number.isFinite(min)) {
          e.preventDefault();
          jumpTo(min);
          return;
        }
        if (e.key === 'End' && Number.isFinite(max)) {
          e.preventDefault();
          jumpTo(max);
        }
      }}
      className={cn('text-center tabular-nums', className)}
      {...props}
    />
  );
};

const stepperStyle =
  'inline-flex h-full aspect-square shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground-secondary outline-none ring-ring transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:ring-(length:--ring-width) disabled:pointer-events-none disabled:opacity-40';

interface NumberInputStepperProps
  extends React.ComponentPropsWithRef<'button'> {
  asChild?: boolean;
}

const NumberInputDecrement = ({
  ref,
  asChild,
  className,
  onClick,
  disabled: propDisabled,
  'aria-label': ariaLabel = 'Decrement',
  children,
  ...props
}: NumberInputStepperProps) => {
  const { decrement, value, min, disabled } = useNumberInputContext();
  const isAtMin = Number.isFinite(min) && value <= min;
  const isDisabled = propDisabled || disabled || isAtMin;
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : 'button'}
      aria-label={ariaLabel}
      disabled={isDisabled}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        decrement();
      }}
      className={cn(!asChild && stepperStyle, className)}
      {...props}
    >
      {children ?? <MinusIcon className="size-4" />}
    </Comp>
  );
};

const NumberInputIncrement = ({
  ref,
  asChild,
  className,
  onClick,
  disabled: propDisabled,
  'aria-label': ariaLabel = 'Increment',
  children,
  ...props
}: NumberInputStepperProps) => {
  const { increment, value, max, disabled } = useNumberInputContext();
  const isAtMax = Number.isFinite(max) && value >= max;
  const isDisabled = propDisabled || disabled || isAtMax;
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : 'button'}
      aria-label={ariaLabel}
      disabled={isDisabled}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        increment();
      }}
      className={cn(!asChild && stepperStyle, className)}
      {...props}
    >
      {children ?? <PlusIcon className="size-4" />}
    </Comp>
  );
};

const CompoundNumberInput = Object.assign(NumberInput, {
  Field: NumberInputField,
  Decrement: NumberInputDecrement,
  Increment: NumberInputIncrement,
});

export type { NumberInputProps };
export { CompoundNumberInput as NumberInput, useNumberInputContext };
