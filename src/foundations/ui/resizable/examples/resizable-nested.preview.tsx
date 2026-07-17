import { Resizable } from "@/foundations/ui/resizable/resizable";

export const meta = { layout: "centered" } as const;

export default function ResizableNestedPreview() {
  return (
    <Resizable className="h-96 w-full max-w-2xl rounded-xl border border-border">
      <Resizable.Panel className="grid place-items-center p-4">
        <span className="text-foreground-secondary text-sm">Sidebar</span>
      </Resizable.Panel>
      <Resizable.Panel>
        <Resizable orientation="vertical" className="h-full">
          <Resizable.Panel className="grid place-items-center p-4">
            <span className="text-foreground-secondary text-sm">Main</span>
          </Resizable.Panel>
          <Resizable.Panel className="grid place-items-center p-4">
            <span className="text-foreground-secondary text-sm">Console</span>
          </Resizable.Panel>
        </Resizable>
      </Resizable.Panel>
    </Resizable>
  );
}
