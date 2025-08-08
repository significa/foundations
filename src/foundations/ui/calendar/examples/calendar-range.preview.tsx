"use client";

import { useState } from "react";

import { Calendar } from "@/foundations/ui/calendar/calendar";

export default function CalendarRangePreview() {
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    new Date(),
  ]);

  return (
    <Calendar mode="range" value={dateRange} onDateChange={setDateRange} />
  );
}
