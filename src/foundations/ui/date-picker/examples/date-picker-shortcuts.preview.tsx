import { format } from 'date-fns';
import { useState } from 'react';

import { DatePicker } from '@/foundations/ui/date-picker/date-picker';
import { Menu } from '@/foundations/ui/menu/menu';

export default function DatePickerShortcutsPreview() {
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);

  return (
    <DatePicker placement="bottom-start">
      <DatePicker.Trigger className="w-80" placeholder="Select date range">
        {dateRange
          ? `${format(dateRange[0], 'MM/dd/yyyy')} - ${format(dateRange[1], 'MM/dd/yyyy')}`
          : undefined}
      </DatePicker.Trigger>
      <DatePicker.Panel
        className="w-80"
        mode="range"
        value={dateRange}
        onDateChange={(dates: [Date, Date]) => {
          setDateRange(dates);
        }}
      >
        <Menu.Divider />
        <Menu.Item
          onSelect={() => {
            setDateRange([new Date(), new Date()]);
          }}
        >
          Today
        </Menu.Item>
        <Menu.Item
          onSelect={() => {
            setDateRange([
              new Date(new Date().setDate(new Date().getDate() - 1)),
              new Date(new Date().setDate(new Date().getDate() - 1)),
            ]);
          }}
        >
          Yesterday
        </Menu.Item>
        <Menu.Item
          onSelect={() => {
            setDateRange([
              new Date(new Date().setDate(new Date().getDate() - 7)),
              new Date(),
            ]);
          }}
        >
          Last 7 days
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          variant="destructive"
          onSelect={() => {
            setDateRange(null);
          }}
        >
          Clear
        </Menu.Item>
      </DatePicker.Panel>
    </DatePicker>
  );
}
