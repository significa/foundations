import { Resizable } from "@/foundations/ui/resizable/resizable";

export const meta = { layout: "fullscreen", mode: "iframe" } as const;

export default function ResizableNestedPreview() {
  return (
    <Resizable className="h-screen w-screen">
      <Resizable.Panel className="grid place-items-center p-4">
        <span className="text-foreground-secondary text-sm">Sidebar</span>
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel>
        <Resizable orientation="vertical" className="h-full">
          <Resizable.Panel className="grid place-items-center p-4">
            <span className="text-foreground-secondary text-sm">Main</span>
          </Resizable.Panel>
          <Resizable.Handle />
          <Resizable.Panel className="grid place-items-center p-4">
            <span className="text-foreground-secondary text-sm">Console</span>
          </Resizable.Panel>
        </Resizable>
      </Resizable.Panel>
    </Resizable>
  );
}
