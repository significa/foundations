import { SidebarIcon } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { Resizable } from "@/foundations/ui/resizable/resizable";

export const meta = { layout: "centered" } as const;

export default function ResizableCollapsiblePreview() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Resizable className="h-72 w-200 max-w-2xl rounded-xl border border-border">
      <Resizable.Panel
        snap={(size) => (size < 100 ? 48 : size)}
        onResize={(size) => setCollapsed(size < 100)}
      >
        <div className="grid h-full place-items-center p-4">
          <span className="text-foreground-secondary text-sm">
            {collapsed ? <SidebarIcon /> : "Sidebar"}
          </span>
        </div>
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel>
        <div className="grid h-full grow place-items-center p-4">
          <span className="text-foreground-secondary text-sm">Editor</span>
        </div>
      </Resizable.Panel>
    </Resizable>
  );
}
