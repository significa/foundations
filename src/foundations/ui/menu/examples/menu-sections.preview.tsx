import { Button } from "@/foundations/ui/button/button";
import { Menu } from "@/foundations/ui/menu/menu";

export default function MenuSectionsPreview() {
  return (
    <Menu>
      <Menu.Trigger asChild>
        <Button variant="outline">Open Menu</Button>
      </Menu.Trigger>
      <Menu.Items>
        <Menu.Section>
          <Menu.Heading>Actions</Menu.Heading>
          <Menu.Item>Edit</Menu.Item>
          <Menu.Item>Duplicate</Menu.Item>
        </Menu.Section>
        <Menu.Section>
          <Menu.Heading>Danger Zone</Menu.Heading>
          <Menu.Item>Archive</Menu.Item>
          <Menu.Item variant="destructive">Delete</Menu.Item>
        </Menu.Section>
      </Menu.Items>
    </Menu>
  );
}
