import { Button } from '@/foundations/ui/button/button';
import { Dropdown } from '@/foundations/ui/dropdown/dropdown';

export default function DropdownSearchPreview() {
  return (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="outline">Search Items</Button>
      </Dropdown.Trigger>
      <Dropdown.Items>
        <Dropdown.SearchInput placeholder="Search items..." />
        <Dropdown.Item>Apple</Dropdown.Item>
        <Dropdown.Item>Banana</Dropdown.Item>
        <Dropdown.Item>Orange</Dropdown.Item>
        <Dropdown.Item>Pineapple</Dropdown.Item>
        <Dropdown.Item>Strawberry</Dropdown.Item>
      </Dropdown.Items>
    </Dropdown>
  );
}
