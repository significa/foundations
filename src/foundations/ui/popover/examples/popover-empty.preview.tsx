import { Button } from '@/foundations/ui/button/button';
import { Popover } from '@/foundations/ui/popover/popover';

export default function PopoverEmptyPreview() {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="outline">Empty State</Button>
      </Popover.Trigger>
      <Popover.Content className="p-0">
        <Popover.SearchInput placeholder="Search items..." />
        <Popover.Empty>No items found</Popover.Empty>
      </Popover.Content>
    </Popover>
  );
}
