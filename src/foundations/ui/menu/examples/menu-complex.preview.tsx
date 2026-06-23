import {
  ArchiveIcon,
  ArrowUpRightIcon,
  CalendarIcon,
  CopyIcon,
  FlagIcon,
  LinkIcon,
  PencilSimpleIcon,
  PushPinIcon,
  TagIcon,
  TrashIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/foundations/ui/button/button";
import { Menu } from "@/foundations/ui/menu/menu";

export default function MenuComplexPreview() {
  return (
    <Menu>
      <Menu.Trigger asChild>
        <Button variant="outline">Issue actions</Button>
      </Menu.Trigger>
      <Menu.Items className="w-64">
        <Menu.Item>
          <PencilSimpleIcon />
          Rename
        </Menu.Item>
        <Menu.Item>
          <CopyIcon />
          Duplicate
        </Menu.Item>

        <Menu.Divider />

        <Menu>
          <Menu.ItemTrigger>
            <UserIcon />
            Assign to
          </Menu.ItemTrigger>
          <Menu.Items>
            <Menu.Item>Pedro</Menu.Item>
            <Menu.Item>Mariana</Menu.Item>
            <Menu.Item>Tomás</Menu.Item>
            <Menu.Item>Inês</Menu.Item>
          </Menu.Items>
        </Menu>

        <Menu>
          <Menu.ItemTrigger>
            <FlagIcon />
            Priority
          </Menu.ItemTrigger>
          <Menu.Items>
            <Menu.Item>No priority</Menu.Item>
            <Menu.Item>Urgent</Menu.Item>
            <Menu.Item>High</Menu.Item>
            <Menu.Item>Medium</Menu.Item>
            <Menu.Item>Low</Menu.Item>
          </Menu.Items>
        </Menu>

        <Menu>
          <Menu.ItemTrigger>
            <TagIcon />
            Labels
          </Menu.ItemTrigger>
          <Menu.Items>
            <Menu.Item>Bug</Menu.Item>
            <Menu.Item>Feature</Menu.Item>
            <Menu.Item>Improvement</Menu.Item>
            <Menu.Item>Refactor</Menu.Item>
          </Menu.Items>
        </Menu>

        <Menu>
          <Menu.ItemTrigger>
            <CalendarIcon />
            Due date
          </Menu.ItemTrigger>
          <Menu.Items>
            <Menu.Item>Today</Menu.Item>
            <Menu.Item>Tomorrow</Menu.Item>
            <Menu.Item>Next week</Menu.Item>
            <Menu.Divider />
            <Menu.Item>Custom…</Menu.Item>
          </Menu.Items>
        </Menu>

        <Menu.Divider />

        <Menu>
          <Menu.ItemTrigger>
            <ArrowUpRightIcon />
            Move
          </Menu.ItemTrigger>
          <Menu.Items>
            <Menu.Item>Backlog</Menu.Item>
            <Menu.Item>Todo</Menu.Item>
            <Menu.Item>In progress</Menu.Item>
            <Menu.Item>Done</Menu.Item>
            <Menu.Item>Cancelled</Menu.Item>
          </Menu.Items>
        </Menu>

        <Menu.Item>
          <PushPinIcon />
          Pin
        </Menu.Item>
        <Menu.Item>
          <LinkIcon />
          Copy link
        </Menu.Item>
        <Menu.Item>
          <ArchiveIcon />
          Archive
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item variant="destructive">
          <TrashIcon />
          Delete
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
