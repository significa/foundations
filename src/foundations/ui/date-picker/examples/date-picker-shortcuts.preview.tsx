"use client";

import { useState } from "react";
import { format } from "date-fns";

import { DatePicker, DatePickerTrigger, DatePickerPanel } from "../date-picker";
import { MenuDivider, MenuItem } from "../../menu/menu";

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
        <MenuDivider />
        <MenuItem
          onSelect={() => {
            setDateRange([new Date(), new Date()]);
          }}
        >
          Today
        </MenuItem>
        <MenuItem
          onSelect={() => {
            setDateRange([
              new Date(new Date().setDate(new Date().getDate() - 1)),
              new Date(new Date().setDate(new Date().getDate() - 1)),
            ]);
          }}
        >
          Yesterday
        </MenuItem>
        <MenuItem
          onSelect={() => {
            setDateRange([
              new Date(new Date().setDate(new Date().getDate() - 7)),
              new Date(),
            ]);
          }}
        >
          Last 7 days
        </MenuItem>
        <MenuDivider />
        <MenuItem
          className="text-red-500"
          onSelect={() => {
            setDateRange(null);
          }}
        >
          Clear
        </MenuItem>
      </DatePickerPanel>
    </DatePicker>
  );
}
