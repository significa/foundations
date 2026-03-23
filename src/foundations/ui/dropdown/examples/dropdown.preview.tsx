import { Button } from '@/foundations/ui/button/button';
import { Dropdown } from '@/foundations/ui/dropdown/dropdown';

export default function DropdownPreview() {
  return (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="outline">Open Menu</Button>
      </Dropdown.Trigger>
      <Dropdown.Items>
        <Dropdown.Item>Edit</Dropdown.Item>
        <Dropdown.Item>Duplicate</Dropdown.Item>
        <Dropdown.Item>Archive</Dropdown.Item>
        <Dropdown.Item disabled>Delete</Dropdown.Item>
      </Dropdown.Items>
    </Dropdown>
  );
}
