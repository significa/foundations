"use client";

import { Calendar as CalendarIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import {
  Calendar,
  type CalendarProps,
} from "@/foundations/ui/calendar/calendar";
import {
  Dropdown,
  DropdownItems,
  DropdownTrigger,
} from "@/foundations/ui/dropdown/dropdown";
import { SelectButton } from "@/foundations/ui/select/select";
import { usePopoverContext } from "@/foundations/ui/popover/popover";

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
  variant?: React.ComponentProps<typeof SelectButton>["variant"];
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
      <SelectButton variant={variant} className={className}>
        <CalendarIcon className="text-foreground-secondary shrink-0" />
        {children ?? (
          <span className="text-foreground-secondary">{placeholder}</span>
        )}
      </SelectButton>
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
  const { setOpen } = usePopoverContext();

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
