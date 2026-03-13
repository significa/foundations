import { Badge } from "@/foundations/ui/badge/badge";

export default function BadgeSizesPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="xs">Extra small</Badge>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
    </div>
  );
}
