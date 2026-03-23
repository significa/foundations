import { Button } from '@/foundations/ui/button/button';
import { Dropdown } from '@/foundations/ui/dropdown/dropdown';

export default function DropdownCustomItemsPreview() {
  return (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="outline">Custom Items</Button>
      </Dropdown.Trigger>
      <Dropdown.Items>
        <Dropdown.Item className="flex flex-col items-start gap-1 text-left">
          <div className="font-medium">Custom Item 1</div>
          <div className="text-foreground-secondary text-sm">
            This is a description for the first item
          </div>
        </Dropdown.Item>
        <Dropdown.Item className="flex flex-col items-start gap-1 text-left">
          <div className="font-medium">Custom Item 2</div>
          <div className="text-foreground-secondary text-sm">
            This is a description for the second item
          </div>
        </Dropdown.Item>
        <Dropdown.Item className="flex items-center justify-between">
          <span>Custom Item 3</span>
          <span className="text-foreground-secondary text-sm">⌘K</span>
        </Dropdown.Item>
      </Dropdown.Items>
    </Dropdown>
  );
}
