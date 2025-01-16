"use client";

import { Calendar as CalendarIcon, CaretUpDown } from "@phosphor-icons/react";
import { VariantProps } from "cva";

import { cn } from "@/lib/utils";
import {
  Calendar,
  type CalendarProps,
} from "@/foundations/ui/calendar/calendar";
import {
  Dropdown,
  DropdownItems,
  DropdownTrigger,
  useDropdownContext,
} from "@/foundations/ui/dropdown/dropdown";
import { inputStyle } from "@/foundations/ui/input/input";

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
  variant?: VariantProps<typeof inputStyle>["variant"];
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
          "flex items-center gap-1.5 enabled:cursor-pointer",
          "relative w-full pr-10 pl-4",
          className
        )}
      >
        <CalendarIcon className="text-foreground-secondary shrink-0" />
        {children ?? (
          <span className="text-foreground-secondary">{placeholder}</span>
        )}
        <CaretUpDown
          weight="bold"
          className="text-foreground/80 absolute top-1/2 right-3 -translate-y-1/2 text-base"
        />
      </button>
    </DropdownTrigger>
  );
};

interface DatePickerContentCommonProps
  extends Omit<CalendarProps, "mode" | "value" | "onDateChange"> {
  className?: string;
  children?: React.ReactNode;
}

interface DatePickerContentSingleProps extends DatePickerContentCommonProps {
  mode?: "single";
  value: Date | null;
  onDateChange: (date: Date) => void;
}

interface DatePickerContentRangeProps extends DatePickerContentCommonProps {
  mode: "range";
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value={value as any}
        onDateChange={(date: Date | [Date, Date]) => {
          setOpen(false);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onDateChange(date as any);
        }}
      />
      {children}
    </DropdownItems>
  );
};

export { DatePicker, DatePickerTrigger, DatePickerPanel };
