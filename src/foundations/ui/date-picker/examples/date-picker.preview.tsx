"use client";

import { useState } from "react";
import { format } from "date-fns";

import { DatePicker, DatePickerPanel, DatePickerTrigger } from "../date-picker";

export default function DatePickerPreview() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <DatePicker placement="bottom-start">
      <DatePickerTrigger className="w-60" placeholder="Select date">
        {selectedDate ? format(selectedDate, "MM/dd/yyyy") : undefined}
      </DatePickerTrigger>
      <DatePickerPanel
        className="w-72"
        value={selectedDate}
        onDateChange={(date: Date) => {
          setSelectedDate(date);
        }}
      />
    </DatePicker>
  );
}
