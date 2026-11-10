import { Button } from "#/foundations/ui/button/button.tsx";
import { Menu } from "#/foundations/ui/menu/menu.tsx";

export default function MenuPreview() {
  return (
    <Menu>
      <Menu.Trigger asChild>
        <Button variant="outline">Open Menu</Button>
      </Menu.Trigger>
      <Menu.Items>
        <Menu.Item>Edit</Menu.Item>
        <Menu.Item>Duplicate</Menu.Item>
        <Menu.Item>Archive</Menu.Item>
        <Menu.Item disabled>Delete</Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
