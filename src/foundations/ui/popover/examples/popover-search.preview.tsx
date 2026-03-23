import { Button } from '@/foundations/ui/button/button';
import { Popover } from '@/foundations/ui/popover/popover';

export default function PopoverSearchPreview() {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="outline">Search</Button>
      </Popover.Trigger>
      <Popover.Content className="p-0">
        <Popover.SearchInput placeholder="Search items..." />
        <div className="p-1">Items would go here</div>
      </Popover.Content>
    </Popover>
  );
}
