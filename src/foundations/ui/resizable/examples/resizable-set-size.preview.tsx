import { useRef } from "react";
import { Resizable, type ResizablePanelHandle } from "@/foundations/ui/resizable/resizable";

export const meta = { layout: "centered" } as const;

export default function ResizableSetSizePreview() {
  const sidebar = useRef<ResizablePanelHandle>(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => sidebar.current?.resize(120)}
          className="rounded-md border border-border px-2 py-1 text-foreground-secondary text-sm hover:border-foreground/24"
        >
          Narrow
        </button>
        <button
          type="button"
          onClick={() => sidebar.current?.resize(400)}
          className="rounded-md border border-border px-2 py-1 text-foreground-secondary text-sm hover:border-foreground/24"
        >
          Wide
        </button>
      </div>
      <Resizable className="h-72 w-200 max-w-2xl rounded-xl border border-border">
        <Resizable.Panel ref={sidebar} className="grid place-items-center p-4">
          <span className="text-foreground-secondary text-sm">Sidebar</span>
        </Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel className="grid place-items-center p-4">
          <span className="text-foreground-secondary text-sm">Editor</span>
        </Resizable.Panel>
      </Resizable>
    </div>
  );
}
