import { TrashIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/foundations/ui/button/button";
import { Menu } from "@/foundations/ui/menu/menu";

export default function MenuDestructivePreview() {
  return (
    <Menu>
      <Menu.Trigger asChild>
        <Button variant="outline">Open Menu</Button>
      </Menu.Trigger>
      <Menu.Items>
        <Menu.Item>Edit</Menu.Item>
        <Menu.Item>Duplicate</Menu.Item>
        <Menu.Divider />
        <Menu.Item variant="destructive">
          <TrashIcon />
          Delete
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
