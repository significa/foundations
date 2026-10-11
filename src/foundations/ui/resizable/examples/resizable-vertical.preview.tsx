import { Resizable } from "@/foundations/ui/resizable/resizable";

export const meta = { layout: "fullscreen", mode: "iframe" } as const;

export default function ResizableVerticalPreview() {
  return (
    <Resizable orientation="vertical" className="h-screen w-screen">
      <Resizable.Panel className="grid place-items-center p-4">
        <span className="text-foreground-secondary text-sm">Editor</span>
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel className="grid place-items-center p-4">
        <span className="text-foreground-secondary text-sm">Terminal</span>
      </Resizable.Panel>
    </Resizable>
  );
}
