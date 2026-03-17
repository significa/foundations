'use client';

import { CalendarIcon, CaretUpDownIcon } from '@phosphor-icons/react';
import type { VariantProps } from 'cva';

import { Calendar } from '@/foundations/ui/calendar/calendar';
import {
  Dropdown,
  DropdownItems,
  DropdownTrigger,
  useDropdownContext,
} from '@/foundations/ui/dropdown/dropdown';
import { inputStyle } from '@/foundations/ui/input/input';
import { cn } from '@/lib/utils/classnames';

const DatePicker = ({
  children,
  ...props
}: React.ComponentProps<typeof Dropdown>) => {
  return <Dropdown {...props}>{children}</Dropdown>;
};

interface DatePickerTriggerProps
  extends React.ComponentProps<typeof DropdownTrigger> {
  className?: string;
  children: React.ReactNode;
  variant?: VariantProps<typeof inputStyle>['variant'];
  placeholder?: string;
}

const DatePickerTrigger = ({
  children,
  className,
  variant,
  placeholder,
  ...props
}: DatePickerTriggerProps) => {
  return (
    <DropdownTrigger asChild {...props}>
      <button
        type="button"
        className={cn(
          inputStyle({ variant }),
          'flex items-center gap-1.5 enabled:cursor-pointer',
          'relative w-full pr-10 pl-4',
          className
        )}
      >
        <CalendarIcon className="shrink-0 text-foreground-secondary" />
        {children ?? (
          <span className="text-foreground-secondary">{placeholder}</span>
        )}
        <CaretUpDownIcon
          weight="bold"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-base text-foreground/80"
        />
      </button>
    </DropdownTrigger>
  );
};

interface DatePickerContentCommonProps
  extends Omit<
    React.ComponentPropsWithRef<typeof Calendar>,
    'mode' | 'value' | 'onDateChange'
  > {
  className?: string;
  children?: React.ReactNode;
}

interface DatePickerContentSingleProps extends DatePickerContentCommonProps {
  mode?: 'single';
  value: Date | null;
  onDateChange: (date: Date) => void;
}

interface DatePickerContentRangeProps extends DatePickerContentCommonProps {
  mode: 'range';
  value: [Date, Date] | null;
  onDateChange: (dates: [Date, Date]) => void;
}

type DatePickerContentProps =
  | DatePickerContentSingleProps
  | DatePickerContentRangeProps;

const DatePickerPanel = ({
  className,
  children,
  mode,
  value,
  onDateChange,
  ...props
}: DatePickerContentProps) => {
  const { setOpen } = useDropdownContext();

  return (
    <DropdownItems className={cn(className)}>
      <Calendar
        {...props}
        mode={mode}
        // biome-ignore lint/suspicious/noExplicitAny: expected
        value={value as any}
        onDateChange={(date: Date | [Date, Date]) => {
          setOpen(false);
          // biome-ignore lint/suspicious/noExplicitAny: expected
          onDateChange(date as any);
        }}
      />
      {children}
    </DropdownItems>
  );
};

export { DatePicker, DatePickerPanel, DatePickerTrigger };
