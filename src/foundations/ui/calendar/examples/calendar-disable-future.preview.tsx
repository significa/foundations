"use client";

import { useState } from "react";

import { Calendar } from "../calendar";

export default function CalendarDisableFuturePreview() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <Calendar
      value={selectedDate}
      onDateChange={setSelectedDate}
      getIsDisabled={(date: Date) => date > new Date()}
    />
  );
}
