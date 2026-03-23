'use client';

import { format } from 'date-fns';
import { useState } from 'react';

import { DatePicker } from '@/foundations/ui/date-picker/date-picker';
import { Input } from '@/foundations/ui/input/input';

export default function DatePickerDateTimePreview() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div className="flex items-center gap-2">
      <DatePicker placement="bottom-start">
        <DatePicker.Trigger className="w-60" placeholder="Select date">
          {format(selectedDate, 'PPP')}
        </DatePicker.Trigger>
        <DatePicker.Panel
          className="w-72"
          value={selectedDate || new Date()}
          onDateChange={(date: Date) => {
            setSelectedDate(date);
          }}
        />
      </DatePicker>
      <Input className="w-40" type="time" />
    </div>
  );
}
