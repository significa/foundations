import { Button } from "@/foundations/ui/button/button";
import { Menu } from "@/foundations/ui/menu/menu";

export default function MenuNestedPreview() {
  return (
    <Menu>
      <Menu.Trigger asChild>
        <Button variant="outline">Open Menu</Button>
      </Menu.Trigger>
      <Menu.Items>
        <Menu.Item>New file</Menu.Item>
        <Menu.Item>Open recent</Menu.Item>
        <Menu>
          <Menu.ItemTrigger>Share</Menu.ItemTrigger>
          <Menu.Items>
            <Menu.Item>Copy link</Menu.Item>
            <Menu.Item>Email</Menu.Item>
            <Menu.Item>Slack</Menu.Item>
          </Menu.Items>
        </Menu>
        <Menu.Divider />
        <Menu.Item variant="destructive">Delete</Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
