import { Tooltip } from "@/foundations/ui/tooltip/tooltip";

export default function TooltipLongContentPreview() {
  return (
    <Tooltip content="This is a very long tooltip content that demonstrates how tooltips handle lengthy text. The tooltip will automatically wrap the text to ensure it remains readable while maintaining a reasonable width.">
      <span>Hover me to see long content</span>
    </Tooltip>
  );
}
