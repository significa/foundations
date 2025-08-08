"use client";

import { useState } from "react";
import { format } from "date-fns";

import {
  DatePicker,
  DatePickerTrigger,
  DatePickerPanel,
} from "@/foundations/ui/date-picker/date-picker";
import {
  DropdownDivider,
  DropdownItem,
} from "@/foundations/ui/dropdown/dropdown";

export default function DatePickerShortcutsPreview() {
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);

  return (
    <DatePicker placement="bottom-start">
      <DatePickerTrigger className="w-80" placeholder="Select date range">
        {dateRange
          ? format(dateRange[0], "MM/dd/yyyy") +
            " - " +
            format(dateRange[1], "MM/dd/yyyy")
          : undefined}
      </DatePickerTrigger>
      <DatePickerPanel
        className="w-80"
        mode="range"
        value={dateRange}
        onDateChange={(dates: [Date, Date]) => {
          setDateRange(dates);
        }}
      >
        <DropdownDivider />
        <DropdownItem
          onSelect={() => {
            setDateRange([new Date(), new Date()]);
          }}
        >
          Today
        </DropdownItem>
        <DropdownItem
          onSelect={() => {
            setDateRange([
              new Date(new Date().setDate(new Date().getDate() - 1)),
              new Date(new Date().setDate(new Date().getDate() - 1)),
            ]);
          }}
        >
          Yesterday
        </DropdownItem>
        <DropdownItem
          onSelect={() => {
            setDateRange([
              new Date(new Date().setDate(new Date().getDate() - 7)),
              new Date(),
            ]);
          }}
        >
          Last 7 days
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem
          className="text-red-500"
          onSelect={() => {
            setDateRange(null);
          }}
        >
          Clear
        </DropdownItem>
      </DatePickerPanel>
    </DatePicker>
  );
}
