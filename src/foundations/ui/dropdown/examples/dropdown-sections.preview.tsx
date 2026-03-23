import { Button } from '@/foundations/ui/button/button';
import { Dropdown } from '@/foundations/ui/dropdown/dropdown';

export default function DropdownSectionsPreview() {
  return (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="outline">Open Menu</Button>
      </Dropdown.Trigger>
      <Dropdown.Items>
        <Dropdown.Section>
          <Dropdown.Heading>Actions</Dropdown.Heading>
          <Dropdown.Item>Edit</Dropdown.Item>
          <Dropdown.Item>Duplicate</Dropdown.Item>
        </Dropdown.Section>
        <Dropdown.Section>
          <Dropdown.Heading>Danger Zone</Dropdown.Heading>
          <Dropdown.Item>Archive</Dropdown.Item>
          <Dropdown.Item disabled>Delete</Dropdown.Item>
        </Dropdown.Section>
      </Dropdown.Items>
    </Dropdown>
  );
}
