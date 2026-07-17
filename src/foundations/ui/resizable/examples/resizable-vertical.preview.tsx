import { Resizable } from "@/foundations/ui/resizable/resizable";

export const meta = { layout: "fullscreen", mode: "iframe" } as const;

export default function ResizableVerticalPreview() {
  return (
    <Resizable orientation="vertical" className="h-screen w-screen">
      <Resizable.Panel className="grid place-items-center p-4">
        <span className="text-foreground-secondary text-sm">Top</span>
      </Resizable.Panel>
      <Resizable.Panel className="grid place-items-center p-4">
        <span className="text-foreground-secondary text-sm">Bottom</span>
      </Resizable.Panel>
    </Resizable>
  );
}
