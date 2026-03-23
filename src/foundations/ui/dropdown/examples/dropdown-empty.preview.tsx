import { Button } from '@/foundations/ui/button/button';
import { Dropdown } from '@/foundations/ui/dropdown/dropdown';

export default function DropdownEmptyPreview() {
  return (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="outline">Empty Menu</Button>
      </Dropdown.Trigger>
      <Dropdown.Items>
        <Dropdown.SearchInput placeholder="Search items..." />
        <Dropdown.Empty>No items found</Dropdown.Empty>
      </Dropdown.Items>
    </Dropdown>
  );
}
