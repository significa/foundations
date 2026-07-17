import { Resizable } from "@/foundations/ui/resizable/resizable";

export const meta = { layout: "centered" } as const;

export default function ResizableVerticalPreview() {
  return (
    <Resizable
      orientation="vertical"
      className="h-96 w-full max-w-md rounded-xl border border-border"
    >
      <Resizable.Panel className="grid place-items-center p-4">
        <span className="text-foreground-secondary text-sm">Top</span>
      </Resizable.Panel>
      <Resizable.Panel className="grid place-items-center p-4">
        <span className="text-foreground-secondary text-sm">Bottom</span>
      </Resizable.Panel>
    </Resizable>
  );
}
