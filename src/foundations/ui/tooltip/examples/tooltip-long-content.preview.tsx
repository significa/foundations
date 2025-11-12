import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/foundations/ui/tooltip/tooltip";

export default function TooltipLongContentPreview() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <span>Hover me to see long content</span>
      </TooltipTrigger>
      <TooltipContent>
        This is a very long tooltip content that demonstrates how tooltips
        handle lengthy text. The tooltip will automatically wrap the text to
        ensure it remains readable while maintaining a reasonable width.
      </TooltipContent>
    </Tooltip>
  );
}
