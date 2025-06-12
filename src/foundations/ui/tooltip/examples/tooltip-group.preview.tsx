import { Clipboard, Scissors } from "@phosphor-icons/react/dist/ssr";
import { Button } from "../../button/button";
import { TooltipGroup, Tooltip } from "../tooltip";

export default function TooltipGroupPreview() {
  return (
    <div className="flex items-center gap-2">
      <TooltipGroup>
        <Tooltip content="Copy">
          <Button variant="outline" size="sm" square>
            <Clipboard />
          </Button>
        </Tooltip>
        <Tooltip content="Cut">
          <Button variant="outline" size="sm" square>
            <Scissors />
          </Button>
        </Tooltip>
      </TooltipGroup>
    </div>
  );
}
