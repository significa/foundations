import {
  CalendarIcon,
  ListIcon,
  SquaresFourIcon,
} from '@phosphor-icons/react/dist/ssr';

import { SegmentedControl } from '@/foundations/ui/segmented-control/segmented-control';

export default function SegmentedControlPreview() {
  return (
    <SegmentedControl>
      <SegmentedControl.Item>
        <ListIcon />
        <span>List</span>
      </SegmentedControl.Item>
      <SegmentedControl.Item>
        <SquaresFourIcon />
        <span>Board</span>
      </SegmentedControl.Item>
      <SegmentedControl.Item>
        <CalendarIcon />
        <span>Calendar</span>
      </SegmentedControl.Item>
    </SegmentedControl>
  );
}
