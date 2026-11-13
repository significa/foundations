import { CalendarIcon, CaretUpDownIcon } from "@phosphor-icons/react/dist/ssr";
import type { VariantProps } from "cva";

import { Calendar } from "#/foundations/ui/calendar/calendar.tsx";
import { inputStyle } from "#/foundations/ui/input/input.tsx";
import { Menu, useMenuPopoverContext } from "#/foundations/ui/menu/menu.tsx";
import { cn } from "#/lib/utils/classnames.ts";

const DatePicker = ({ children, ...props }: React.ComponentProps<typeof Menu>) => {
  return <Menu {...props}>{children}</Menu>;
};

interface DatePickerTriggerProps extends React.ComponentProps<typeof Menu.Trigger> {
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
    <Menu.Trigger asChild {...props}>
      <button
        type="button"
        className={cn(
          inputStyle({ variant }),
          "flex items-center gap-1.5 enabled:cursor-pointer",
          "relative w-full pr-10 pl-4",
          className,
        )}
      >
        <CalendarIcon className="shrink-0 text-foreground-secondary" />
        {children ?? <span className="text-foreground-secondary">{placeholder}</span>}
        <CaretUpDownIcon
          weight="bold"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-base text-foreground/80"
        />
      </button>
    </Menu.Trigger>
  );
};

// Element props (className, style, ref, …) go to the panel; these configure its Calendar.
interface DatePickerPanelCommonProps
  extends React.ComponentProps<typeof Menu.Items>,
    Pick<React.ComponentProps<typeof Calendar>, "getIsDisabled" | "startWeekOn" | "locale"> {}

interface DatePickerPanelSingleProps extends DatePickerPanelCommonProps {
  mode?: "single";
  value: Date | null;
  onDateChange: (date: Date) => void;
}

interface DatePickerPanelRangeProps extends DatePickerPanelCommonProps {
  mode: "range";
  value: [Date, Date] | null;
  onDateChange: (dates: [Date, Date]) => void;
}

type DatePickerPanelProps = DatePickerPanelSingleProps | DatePickerPanelRangeProps;

const DatePickerPanel = ({
  children,
  mode,
  value,
  onDateChange,
  getIsDisabled,
  startWeekOn,
  locale,
  ...props
}: DatePickerPanelProps) => {
  const { setOpen } = useMenuPopoverContext();

  return (
    <Menu.Items {...props}>
      <Calendar
        getIsDisabled={getIsDisabled}
        startWeekOn={startWeekOn}
        locale={locale}
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
    </Menu.Items>
  );
};

const CompoundDatePicker = Object.assign(DatePicker, {
  Trigger: DatePickerTrigger,
  Panel: DatePickerPanel,
});

export { CompoundDatePicker as DatePicker };
