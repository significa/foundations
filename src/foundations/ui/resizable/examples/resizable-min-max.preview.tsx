import { Resizable } from "@/foundations/ui/resizable/resizable";

export const meta = { layout: "centered" } as const;

export default function ResizableMinMaxPreview() {
  return (
    <Resizable className="h-72 w-200 max-w-2xl rounded-xl border border-border">
      <Resizable.Panel className="grid min-w-32 max-w-64 place-items-center p-4">
        <span className="text-foreground-secondary text-sm">Sidebar</span>
      </Resizable.Panel>
      <Resizable.Panel className="grid place-items-center p-4">
        <span className="text-foreground-secondary text-sm">Content</span>
      </Resizable.Panel>
    </Resizable>
  );
}
