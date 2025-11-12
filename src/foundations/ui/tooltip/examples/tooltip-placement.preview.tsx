import { Button } from "@/foundations/ui/button/button";
import {
  Tooltip,
  TooltipContent,
  TooltipGroup,
  TooltipTrigger,
} from "@/foundations/ui/tooltip/tooltip";

export default function TooltipPlacementPreview() {
  return (
    <div className="flex w-full flex-col gap-2 overflow-auto p-2">
      <TooltipGroup>
        <Tooltip placement="top">
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Top
            </Button>
          </TooltipTrigger>
          <TooltipContent>Top</TooltipContent>
        </Tooltip>
        <Tooltip placement="right">
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Right
            </Button>
          </TooltipTrigger>
          <TooltipContent>Right</TooltipContent>
        </Tooltip>
        <Tooltip placement="bottom">
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Bottom
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bottom</TooltipContent>
        </Tooltip>
        <Tooltip placement="left">
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Left
            </Button>
          </TooltipTrigger>
          <TooltipContent>Left</TooltipContent>
        </Tooltip>
        <Tooltip placement="top-start">
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Top Start
            </Button>
          </TooltipTrigger>
          <TooltipContent>Top Start</TooltipContent>
        </Tooltip>
        <Tooltip placement="top-end">
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Top End
            </Button>
          </TooltipTrigger>
          <TooltipContent>Top End</TooltipContent>
        </Tooltip>
        <Tooltip placement="right-start">
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Right Start
            </Button>
          </TooltipTrigger>
          <TooltipContent>Right Start</TooltipContent>
        </Tooltip>
        <Tooltip placement="right-end">
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Right End
            </Button>
          </TooltipTrigger>
          <TooltipContent>Right End</TooltipContent>
        </Tooltip>
        <Tooltip placement="bottom-start">
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Bottom Start
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bottom Start</TooltipContent>
        </Tooltip>
        <Tooltip placement="bottom-end">
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Bottom End
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bottom End</TooltipContent>
        </Tooltip>
        <Tooltip placement="left-start">
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Left Start
            </Button>
          </TooltipTrigger>
          <TooltipContent>Left Start</TooltipContent>
        </Tooltip>
        <Tooltip placement="left-end">
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Left End
            </Button>
          </TooltipTrigger>
          <TooltipContent>Left End</TooltipContent>
        </Tooltip>
      </TooltipGroup>
    </div>
  );
}
