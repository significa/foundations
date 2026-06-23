import {
  CopyIcon,
  PencilSimpleIcon,
  ScissorsIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { Menu } from "@/foundations/ui/menu/menu";

export const meta = { layout: "centered" } as const;

export default function MenuContextPreview() {
  const [pos, setPos] = useState<[number, number] | null>(null);

  return (
    <>
      {/** biome-ignore lint/a11y/noStaticElementInteractions: demo */}
      <div
        className="flex h-48 w-72 items-center justify-center rounded-xl border border-border border-dashed text-foreground-secondary text-sm"
        onContextMenu={(e) => {
          e.preventDefault();
          setPos([e.clientX, e.clientY]);
        }}
      >
        Right-click anywhere here
      </div>
      <Menu open={!!pos} onOpenChange={(open) => !open && setPos(null)} origin={pos ?? "trigger"}>
        <Menu.Trigger className="hidden" />
        <Menu.Items>
          <Menu.Item>
            <ScissorsIcon />
            Cut
          </Menu.Item>
          <Menu.Item>
            <CopyIcon />
            Copy
          </Menu.Item>
          <Menu.Item>
            <PencilSimpleIcon />
            Rename
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item variant="destructive">
            <TrashIcon />
            Delete
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </>
  );
}
