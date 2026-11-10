import { useState } from "react";

import { Calendar } from "#/foundations/ui/calendar/calendar.tsx";

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
