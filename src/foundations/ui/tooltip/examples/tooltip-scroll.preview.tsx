import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/foundations/ui/tooltip/tooltip";

export default function TooltipScrollPreview() {
  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="flex h-[200vh] items-center justify-center">
        <Tooltip open>
          <TooltipTrigger>
            Scroll to see the tooltip reposition itself
          </TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
