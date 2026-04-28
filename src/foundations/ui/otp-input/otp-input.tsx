import type { VariantProps } from 'cva';
import {
  Children,
  createContext,
  isValidElement,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  InstanceCounterProvider,
  useInstanceCounter,
} from '@/foundations/components/instance-counter/instance-counter';
import { inputStyle } from '@/foundations/ui/input/input';
import { composeRefs } from '@/foundations/utils/compose-refs/compose-refs';
import { cn, compose, cva } from '@/lib/utils/classnames';

// Splits a string into a fixed-length array of single characters, padding with empty strings.
const splitIntoSlots = (value: string, length: number): string[] =>
  Array.from({ length }, (_, i) => value[i] ?? '');

interface OTPInputContextValue {
  values: string[];
  size: NonNullable<VariantProps<typeof inputStyle>['size']>;
  inputMode: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  placeholder?: string;
  masked?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  rootId?: string;
  setCellRef: (index: number, el: HTMLInputElement | null) => void;
  focusCell: (index: number) => void;
  onCellChange: (index: number, value: string) => void;
  onCellKeyDown: (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => void;
  onCellFocus: (index: number) => void;
  onCellPaste: (
    index: number,
    e: React.ClipboardEvent<HTMLInputElement>
  ) => void;
}

const OTPInputContext = createContext<OTPInputContextValue | null>(null);

const useOTPInputContext = () => {
  const ctx = use(OTPInputContext);
  if (!ctx)
    throw new Error(
      'OTPInputContext must be used within an OTPInput component'
    );
  return ctx;
};

interface OTPInputProps
  extends Omit<React.ComponentPropsWithRef<'div'>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onFill?: (value: string) => void;
  size?: VariantProps<typeof inputStyle>['size'];
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  placeholder?: string;
  masked?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}

const OTPInput = ({
  ref,
  id,
  value: valueProp,
  defaultValue = '',
  onChange,
  onFill,
  size = 'md',
  inputMode = 'numeric',
  placeholder,
  masked,
  disabled,
  invalid,
  children,
  className,
  ...props
}: OTPInputProps) => {
  const cellRefs = useRef<(HTMLInputElement | null)[]>([]);

  const cellCount = useMemo(
    () =>
      Children.toArray(children).filter(
        (child) => isValidElement(child) && child.type === OTPInputCell
      ).length,
    [children]
  );

  const [internalValues, setInternalValues] = useState<string[]>(() =>
    splitIntoSlots(defaultValue, cellCount)
  );

  const values =
    valueProp !== undefined
      ? splitIntoSlots(valueProp, cellCount)
      : internalValues;

  // Ref kept in sync with the latest committed values so that focus handlers
  // — which fire synchronously before React re-renders — always see fresh data.
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const updateValues = useCallback(
    (nextValues: string[], bulk = false) => {
      valuesRef.current = nextValues;
      const joined = nextValues.join('');
      if (valueProp === undefined) setInternalValues(nextValues);
      onChange?.(joined);
      // Only fire onFill for bulk fills (paste / password manager),
      // not for character-by-character typing.
      if (bulk && nextValues.every((v) => v !== '')) onFill?.(joined);
    },
    [valueProp, onChange, onFill]
  );

  const setCellRef = useCallback(
    (index: number, el: HTMLInputElement | null) => {
      cellRefs.current[index] = el;
    },
    []
  );

  const focusCell = useCallback(
    (index: number) => {
      // Never skip past the first empty slot — fill cells in order.
      const firstEmpty = valuesRef.current.indexOf('');
      const lastAllowed = firstEmpty === -1 ? cellCount - 1 : firstEmpty;
      const target = Math.max(0, Math.min(index, lastAllowed));
      cellRefs.current[target]?.focus();
    },
    [cellCount]
  );

  const sanitize = useCallback(
    (s: string) => (inputMode === 'numeric' ? s.replace(/\D/g, '') : s),
    [inputMode]
  );

  const onCellChange = useCallback(
    (index: number, typed: string) => {
      // Password managers bypass maxLength and set the full OTP string on one cell.
      // Detect that and distribute characters across cells just like a paste.
      if (typed.length > 1) {
        const clean = sanitize(typed);
        const nextValues = [...valuesRef.current];
        let lastFilled = index;
        for (let i = 0; i < clean.length && index + i < cellCount; i++) {
          nextValues[index + i] = clean[i];
          lastFilled = index + i;
        }
        updateValues(nextValues, true);
        focusCell(lastFilled + 1);
        return;
      }
      // maxLength={2} lets the browser accept the new character alongside the old one.
      // We always want just the most recently typed character.
      const char = sanitize(typed).slice(-1);
      const nextValues = [...valuesRef.current];
      nextValues[index] = char;
      updateValues(nextValues);
      if (char) focusCell(index + 1);
    },
    [updateValues, focusCell, cellCount, sanitize]
  );

  const onCellKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        focusCell(index - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        focusCell(index + 1);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        const clearIndex = valuesRef.current[index] ? index : index - 1;
        if (clearIndex >= 0) {
          // Remove the character and shift everything after it one step left,
          // keeping the array left-packed so there are never gaps between filled cells.
          const nextValues = [...valuesRef.current];
          nextValues.splice(clearIndex, 1);
          nextValues.push('');
          updateValues(nextValues);
        }
        focusCell(index - 1);
      } else if (e.key === 'Delete') {
        e.preventDefault();
        const nextValues = [...valuesRef.current];
        nextValues[index] = '';
        updateValues(nextValues);
      }
    },
    [updateValues, focusCell]
  );

  const onCellFocus = useCallback(
    (index: number) => {
      // Redirect clicks that land beyond the first empty slot.
      const firstEmpty = valuesRef.current.indexOf('');
      const lastAllowed = firstEmpty === -1 ? cellCount - 1 : firstEmpty;
      if (index > lastAllowed) {
        cellRefs.current[lastAllowed]?.focus();
        return;
      }
      cellRefs.current[index]?.select();
    },
    [cellCount]
  );

  const onCellPaste = useCallback(
    (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const text = sanitize(e.clipboardData.getData('text').replace(/\s/g, ''));
      const nextValues = [...valuesRef.current];
      let lastFilled = index;
      for (let i = 0; i < text.length && index + i < cellCount; i++) {
        nextValues[index + i] = text[i];
        lastFilled = index + i;
      }
      updateValues(nextValues, true);
      focusCell(lastFilled + 1);
    },
    [updateValues, focusCell, cellCount, sanitize]
  );

  const ctx = useMemo(
    () => ({
      values,
      size: size ?? 'md',
      inputMode,
      placeholder,
      masked,
      disabled,
      invalid,
      rootId: id,
      setCellRef,
      focusCell,
      onCellChange,
      onCellKeyDown,
      onCellFocus,
      onCellPaste,
    }),
    [
      values,
      size,
      inputMode,
      placeholder,
      masked,
      disabled,
      invalid,
      id,
      setCellRef,
      focusCell,
      onCellChange,
      onCellKeyDown,
      onCellFocus,
      onCellPaste,
    ]
  );

  return (
    <OTPInputContext value={ctx}>
      <div
        ref={ref}
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
        className={cn('flex items-center gap-2', className)}
        {...props}
      >
        <InstanceCounterProvider>{children}</InstanceCounterProvider>
      </div>
    </OTPInputContext>
  );
};

const otpCellStyle = compose(
  inputStyle,
  cva({
    base: 'shrink-0 px-0 text-center',
    variants: {
      size: { xs: 'w-6', sm: 'w-8', md: 'w-10', lg: 'w-12' },
    },
  })
);

interface OTPInputCellProps {
  ref?: React.Ref<HTMLInputElement>;
  className?: string;
}

const OTPInputCell = ({ ref, className }: OTPInputCellProps) => {
  const index = useInstanceCounter();
  const {
    values,
    size,
    inputMode,
    placeholder,
    masked,
    disabled,
    invalid,
    rootId,
    setCellRef,
    onCellChange,
    onCellKeyDown,
    onCellFocus,
    onCellPaste,
  } = useOTPInputContext();

  const internalRef = useCallback(
    (el: HTMLInputElement | null) => setCellRef(index, el),
    [setCellRef, index]
  );

  return (
    <input
      ref={composeRefs(ref, internalRef)}
      id={index === 0 ? rootId : undefined}
      type={masked ? 'password' : 'text'}
      inputMode={inputMode}
      autoComplete="one-time-code"
      placeholder={placeholder}
      // maxLength={2} instead of 1: allows the browser to hold the previous
      // character alongside the newly typed one so onCellChange can read both
      // and extract just the latest via slice(-1).
      maxLength={2}
      value={values[index] ?? ''}
      disabled={disabled}
      data-invalid={invalid || undefined}
      aria-label={`Digit ${index + 1}`}
      className={cn(otpCellStyle({ size }), className)}
      onChange={(e) => onCellChange(index, e.target.value)}
      onKeyDown={(e) => onCellKeyDown(index, e)}
      onFocus={() => onCellFocus(index)}
      onPaste={(e) => onCellPaste(index, e)}
    />
  );
};

interface OTPInputHiddenProps {
  name: string;
}

const OTPInputHidden = ({ name }: OTPInputHiddenProps) => {
  const { values } = useOTPInputContext();
  return <input type="hidden" name={name} value={values.join('')} />;
};

const OTPInputSeparator = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  return (
    <div
      aria-hidden="true"
      className={cn('text-foreground-secondary', className)}
      {...props}
    >
      {children ?? '—'}
    </div>
  );
};

const CompoundOTPInput = Object.assign(OTPInput, {
  Cell: OTPInputCell,
  Separator: OTPInputSeparator,
  Hidden: OTPInputHidden,
});

export type { OTPInputProps };
export { CompoundOTPInput as OTPInput };
