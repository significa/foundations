"use client";

import { useMemo, useState } from "react";
import { add, format, isSameDay, isSameMonth } from "date-fns";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { Button } from "@/foundations/ui/button/button";

/**
 * Generate a matrix of dates for a given month
 * Dates from previous and next month are included and marked as negative numbers.
 *
 * @param year The year
 * @param month The month (1-12)
 * @param options Configuration options
 * @returns Matrix of dates. Each row is a week, each column is a day.
 */
const generateMonth = (
  year: number,
  month: number,
  options: {
    onlyCurrentMonthRows?: boolean;
    startWeekOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  } = {}
): readonly (readonly number[])[] => {
  const date = new Date(year, month - 1);
  const startWeekOn = options.startWeekOn ?? 1; // Default to Monday (1)
  const firstWeekDay = (date.getDay() - startWeekOn + 7) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

  const generateDay = (index: number): number => {
    const currentDay = index - firstWeekDay + 1;
    if (currentDay <= 0) {
      return -(daysInPrevMonth + currentDay);
    } else if (currentDay > daysInMonth) {
      return -(currentDay - daysInMonth);
    }
    return currentDay;
  };

  const generateWeek = (weekIndex: number): readonly number[] =>
    Array.from({ length: 7 }, (_, i) => generateDay(weekIndex * 7 + i));

  const matrix = Array.from({ length: 6 }, (_, i) => generateWeek(i));

  return options.onlyCurrentMonthRows
    ? matrix.filter((week) => week.some((day) => day > 0))
    : matrix;
};

interface CalendarCommonProps extends React.ComponentPropsWithRef<"div"> {
  getIsDisabled?: (date: Date) => boolean;
  startWeekOn?: 0 | 2 | 1 | 3 | 4 | 5 | 6;
  locale?: Intl.LocalesArgument;
}

interface CalendarSingleProps extends CalendarCommonProps {
  value: Date | null;
  onDateChange: (date: Date) => void;
  mode?: "single";
}

interface CalendarRangeProps extends CalendarCommonProps {
  value: [Date, Date] | null;
  onDateChange: (dates: [Date, Date]) => void;
  mode: "range";
}

type CalendarProps = CalendarSingleProps | CalendarRangeProps;

type CalendarView = "days" | "months" | "years";

const sortDates = (dates: [Date, Date]): [Date, Date] => {
  return [...dates].sort((a, b) => a.getTime() - b.getTime()) as [Date, Date];
};

const Calendar = ({
  mode,
  onDateChange,
  value,
  getIsDisabled = () => false,
  startWeekOn = 0,
  locale = "en",
  className,
  ...props
}: CalendarProps) => {
  const [view, setView] = useState<CalendarView>("days");
  const [viewDate, setViewDate] = useState<Date>(
    mode === "range" ? value?.[0] || new Date() : value || new Date()
  );

  // used to track a date range while it's being selected
  const [transientRange, setTransientRange] = useState<[Date, Date] | null>(
    null
  );

  const [startDate, endDate] = useMemo(() => {
    if (transientRange) {
      return sortDates(transientRange);
    }

    if (!value) {
      return [null, null];
    }

    if (mode === "range") {
      return sortDates(value);
    }

    return sortDates([value, value]);
  }, [mode, value, transientRange]);

  const month = useMemo(() => {
    const matrix = generateMonth(
      viewDate.getFullYear(),
      viewDate.getMonth() + 1,
      {
        startWeekOn,
      }
    );

    return matrix.map((row, i) =>
      row.map((day) => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const date = new Date(year, month, 1);

        if (i === 0 && day < 0) {
          date.setMonth(date.getMonth() - 1);
        } else if (day < 0) {
          date.setMonth(date.getMonth() + 1);
        }

        date.setDate(Math.abs(day));

        return date;
      })
    );
  }, [viewDate, startWeekOn]);

  const handleDaySelect = (date: Date) => {
    // not a range selection
    if (mode !== "range") {
      return onDateChange(date);
    }

    // start a range selection
    if (!transientRange) {
      return setTransientRange([date, date]);
    }

    // end selection
    setTransientRange(null);
    return onDateChange(sortDates([transientRange[0], date]));
  };

  const handleDayHover = (date: Date) => {
    if (mode !== "range" || !transientRange) return;

    setTransientRange([transientRange[0], date]);
  };

  return (
    <div className={cn("bg-background", className)} {...props}>
      {view === "years" && (
        <CalendarHeader
          onPrevious={() => setViewDate((prev) => add(prev, { years: -12 }))}
          onNext={() => setViewDate((prev) => add(prev, { years: 12 }))}
        >
          <HeaderTextButton
            className="flex items-center gap-1"
            onClick={() => setView("days")}
          >
            <span>{viewDate.getFullYear() - 5}</span>
            <span>{"–"}</span>
            <span>{viewDate.getFullYear() + 6}</span>
          </HeaderTextButton>
        </CalendarHeader>
      )}
      {view === "months" && (
        <CalendarHeader
          onPrevious={() => setViewDate((prev) => add(prev, { years: -1 }))}
          onNext={() => setViewDate((prev) => add(prev, { years: 1 }))}
        >
          <HeaderTextButton onClick={() => setView("years")}>
            {viewDate.getFullYear()}
          </HeaderTextButton>
        </CalendarHeader>
      )}
      {view === "days" && (
        <CalendarHeader
          onPrevious={() => setViewDate((prev) => add(prev, { months: -1 }))}
          onNext={() => setViewDate((prev) => add(prev, { months: 1 }))}
        >
          <div className="flex items-center gap-1 text-sm">
            <HeaderTextButton onClick={() => setView("months")}>
              {viewDate.toLocaleDateString(locale, { month: "long" })}
            </HeaderTextButton>
            <HeaderTextButton onClick={() => setView("years")}>
              {viewDate.getFullYear()}
            </HeaderTextButton>
          </div>
        </CalendarHeader>
      )}

      <div className="relative">
        {(view === "years" || view === "months") && (
          <div className="bg-background absolute inset-0 z-10 p-1">
            {view === "years" && (
              <div className="grid size-full grid-cols-3 grid-rows-4 p-0.5">
                {Array.from({ length: 12 }, (_, i) => {
                  const year = viewDate.getFullYear() - 5 + i;
                  const date = new Date(year, viewDate.getMonth(), 1);
                  return (
                    <YearMonthButton
                      key={i}
                      className="h-full"
                      onClick={() => {
                        setViewDate(date);
                        setView("months");
                      }}
                    >
                      {year}
                    </YearMonthButton>
                  );
                })}
              </div>
            )}
            {view === "months" && (
              <div className="grid size-full grid-cols-3 grid-rows-4 p-0.5">
                {Array.from({ length: 12 }, (_, i) => {
                  const date = new Date(viewDate.getFullYear(), i, 1);
                  return (
                    <YearMonthButton
                      key={i}
                      className="h-full"
                      onClick={() => {
                        setViewDate(date);
                        setView("days");
                      }}
                    >
                      {date.toLocaleDateString(locale, { month: "short" })}
                    </YearMonthButton>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-7">
          {Array.from({ length: 7 }, (_, i) => {
            const weekday = new Date(2024, 0, (i + startWeekOn) % 7);
            return (
              <div
                key={i}
                className="text-foreground-secondary flex h-9 w-full min-w-9 items-center justify-center text-sm"
              >
                {weekday.toLocaleDateString(locale, { weekday: "narrow" })}
              </div>
            );
          })}
        </div>
        {month.map((row, i) => (
          <div className="grid grid-cols-7" key={i}>
            {row.map((day, ii) => {
              const hasValue = !!startDate && !!endDate;
              const isStartDate = hasValue && isSameDay(day, startDate);
              const isEndDate = hasValue && isSameDay(day, endDate);
              const isSelected = isStartDate || isEndDate;

              const isInRange =
                hasValue &&
                day > startDate &&
                day < endDate &&
                !isSameDay(day, startDate) &&
                !isSameDay(day, endDate);

              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={ii}
                  aria-label={format(day, "yyyy-MM-dd")}
                  data-other-month={!isSameMonth(day, viewDate) || undefined}
                  data-start-date={isStartDate || undefined}
                  data-end-date={isEndDate || undefined}
                  data-selected={isSelected || undefined}
                  data-in-range={isInRange || undefined}
                  data-today={isToday || undefined}
                  disabled={getIsDisabled(day)}
                  className={cn(
                    "group text-foreground relative isolate flex h-9 w-full min-w-9 cursor-pointer items-center justify-center outline-none disabled:pointer-events-none disabled:opacity-30"
                  )}
                  onClick={() => handleDaySelect(day)}
                  onMouseEnter={() => handleDayHover(day)}
                >
                  {/* Date */}
                  {/* Styles are in an element inside because there's a small margin around the squares but the hover needs to account for the entire square to avoid flashing of hovered items */}
                  <div
                    className={cn(
                      // base
                      "ring-ring text-foreground/80 z-10 flex size-8 items-center justify-center rounded-lg border border-transparent text-sm font-medium tabular-nums transition-shadow",
                      // hover
                      "group-hover:bg-background-secondary group-hover:text-foreground",
                      // selected
                      "group-data-[selected]:bg-foreground group-data-[selected]:text-background group-hover:group-data-[selected]:text-background",
                      // other month
                      "group-data-[other-month]:text-foreground-secondary",
                      // focus
                      "group-focus-visible:ring-4"
                    )}
                  >
                    {day.getDate()}
                  </div>
                  {/* Today marker */}
                  {isToday && (
                    <div
                      aria-hidden
                      className={cn(
                        "bg-foreground absolute bottom-1.5 left-1/2 z-20 h-0.5 w-1.5 -translate-x-1/2 rounded-md",
                        isSelected && "bg-background"
                      )}
                    />
                  )}
                  {/* Date range background */}
                  <div
                    aria-hidden
                    className={cn(
                      "bg-background-secondary invisible absolute inset-x-0 inset-y-0.5 z-0",
                      "group-data-[in-range]:visible",
                      "group-data-[start-date]:visible group-data-[start-date]:left-1/2",
                      "group-data-[end-date]:visible group-data-[end-date]:right-1/2"
                    )}
                  />
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

interface CalendarHeaderProps {
  onPrevious: () => void;
  onNext: () => void;
  children: React.ReactNode;
}

const CalendarHeader = ({
  onPrevious,
  onNext,
  children,
}: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-1.5 text-sm font-medium">
      <Button variant="outline" square onClick={onPrevious}>
        <CaretLeft />
      </Button>
      {children}
      <Button variant="outline" square onClick={onNext}>
        <CaretRight />
      </Button>
    </div>
  );
};

const HeaderTextButton = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "ring-ring text-foreground/80 hover:text-foreground focus-visible:text-foreground cursor-pointer rounded-sm font-medium transition outline-none focus-visible:ring-4",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const YearMonthButton = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "ring-ring text-foreground/80 hover:bg-background-secondary hover:text-foreground focus-visible:text-foreground h-8 w-full cursor-pointer rounded-lg text-sm font-medium transition outline-none focus-visible:ring-4",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export { Calendar, type CalendarProps };
