import { ArchiveIcon, CopyIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/foundations/ui/button/button";
import { Menu } from "@/foundations/ui/menu/menu";

export default function MenuIconsPreview() {
  return (
    <Menu>
      <Menu.Trigger asChild>
        <Button variant="outline">Menu with Icons</Button>
      </Menu.Trigger>
      <Menu.Items>
        <Menu.Item>
          <PencilSimpleIcon />
          Edit
        </Menu.Item>
        <Menu.Item>
          <CopyIcon />
          Duplicate
        </Menu.Item>
        <Menu.Item>
          <ArchiveIcon />
          Archive
        </Menu.Item>
        <Menu.Item variant="destructive">
          <TrashIcon />
          Delete
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
