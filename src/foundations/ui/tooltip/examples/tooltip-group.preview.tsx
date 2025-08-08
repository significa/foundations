import { ClipboardIcon, ScissorsIcon } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/foundations/ui/button/button";
import { Tooltip, TooltipGroup } from "@/foundations/ui/tooltip/tooltip";

export default function TooltipGroupPreview() {
  return (
    <div className="flex items-center gap-2">
      <TooltipGroup>
        <Tooltip content="Copy">
          <Button variant="outline" size="sm" square>
            <ClipboardIcon />
          </Button>
        </Tooltip>
        <Tooltip content="Cut">
          <Button variant="outline" size="sm" square>
            <ScissorsIcon />
          </Button>
        </Tooltip>
      </TooltipGroup>
    </div>
  );
}
