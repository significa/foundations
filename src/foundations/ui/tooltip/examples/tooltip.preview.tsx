import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/foundations/ui/tooltip/tooltip";

export default function TooltipPreview() {
  return (
    <Tooltip>
      <TooltipTrigger>Nothing to see here</TooltipTrigger>
      <TooltipContent>Or is there?</TooltipContent>
    </Tooltip>
  );
}
