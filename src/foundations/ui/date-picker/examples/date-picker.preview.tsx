import { format } from 'date-fns';
import { useState } from 'react';

import { DatePicker } from '@/foundations/ui/date-picker/date-picker';

export default function DatePickerPreview() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <DatePicker placement="bottom-start">
      <DatePicker.Trigger className="w-60" placeholder="Select date">
        {selectedDate ? format(selectedDate, 'PPP') : undefined}
      </DatePicker.Trigger>
      <DatePicker.Panel
        className="w-72"
        value={selectedDate}
        onDateChange={(date: Date) => {
          setSelectedDate(date);
        }}
      />
    </DatePicker>
  );
}
