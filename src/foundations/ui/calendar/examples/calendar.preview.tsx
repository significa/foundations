"use client";

import { useState } from "react";

import { Calendar } from "../calendar";

export default function CalendarPreview() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return <Calendar value={selectedDate} onDateChange={setSelectedDate} />;
}
