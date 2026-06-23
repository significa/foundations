import { Kbd } from "@/foundations/ui/kbd/kbd";

export default function KbdSizesPreview() {
  return (
    <div className="flex items-center gap-4">
      <Kbd size="sm">⌘</Kbd>
      <Kbd size="md">⌘</Kbd>
      <Kbd size="lg">⌘</Kbd>
    </div>
  );
}
