import { SidebarIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Resizable } from "@/foundations/ui/resizable/resizable";

export const meta = { layout: "centered" } as const;

export default function ResizableCollapsiblePreview() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Resizable className="h-72 w-200 max-w-2xl rounded-xl border border-border">
      <Resizable.Panel
        onResize={(size, setSize) => {
          if (size < 100) {
            setSize(48);
            setCollapsed(true);
          } else {
            setCollapsed(false);
          }
        }}
      >
        <div className="grid h-full place-items-center p-4">
          <span className="text-foreground-secondary text-sm">
            {collapsed ? <SidebarIcon /> : "Sidebar"}
          </span>
        </div>
      </Resizable.Panel>
      <Resizable.Panel>
        <div className="grid h-full grow place-items-center p-4">
          <span className="text-foreground-secondary text-sm">Editor</span>
        </div>
      </Resizable.Panel>
    </Resizable>
  );
}
