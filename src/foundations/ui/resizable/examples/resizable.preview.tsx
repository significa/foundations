import { Resizable } from "@/foundations/ui/resizable/resizable";

export const meta = { layout: "centered" } as const;

export default function ResizablePreview() {
  return (
    <Resizable className="h-72 w-200 max-w-2xl rounded-xl border border-border">
      <Resizable.Panel className="grid w-full place-items-center p-4">
        <span className="text-foreground-secondary text-sm">Sidebar</span>
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel className="grid w-24 min-w-24 place-items-center p-4">
        <span className="text-foreground-secondary text-sm">Editor</span>
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel className="grid place-items-center p-4">
        <span className="text-foreground-secondary text-sm">Preview</span>
      </Resizable.Panel>
    </Resizable>
  );
}
