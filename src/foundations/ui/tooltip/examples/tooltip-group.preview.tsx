import { ClipboardIcon, ScissorsIcon } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/foundations/ui/button/button";
import {
  Tooltip,
  TooltipContent,
  TooltipGroup,
  TooltipTrigger,
} from "@/foundations/ui/tooltip/tooltip";

export default function TooltipGroupPreview() {
  return (
    <div className="flex items-center gap-2">
      <TooltipGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" square>
              <ClipboardIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" square>
              <ScissorsIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Cut</TooltipContent>
        </Tooltip>
      </TooltipGroup>
    </div>
  );
}
