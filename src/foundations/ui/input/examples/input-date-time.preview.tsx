import { CalendarIcon, ClockIcon } from '@phosphor-icons/react/dist/ssr';
import { Input } from '@/foundations/ui/input/input';

export default function InputDateTime() {
  return (
    <div className="w-90 space-y-4">
      <div className="flex gap-2">
        <Input type="date" defaultValue="2026-05-29" />
        <Input type="time" defaultValue="10:30" />
      </div>
      <Input type="datetime-local" defaultValue="2026-05-29T10:30" />
      <Input.Group>
        <Input.Addon>
          <CalendarIcon />
        </Input.Addon>
        <Input type="date" defaultValue="2026-05-29" />
      </Input.Group>
      <Input.Group>
        <Input.Addon>
          <ClockIcon />
        </Input.Addon>
        <Input type="time" defaultValue="10:30" step="1" />
      </Input.Group>
    </div>
  );
}
