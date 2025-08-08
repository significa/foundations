"use client";

import { useState } from "react";

import { Calendar } from "@/foundations/ui/calendar/calendar";

export default function CalendarLocalePreview() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <Calendar value={selectedDate} onDateChange={setSelectedDate} locale="pt" />
  );
}
