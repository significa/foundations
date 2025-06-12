import { Button } from "../../button/button";

import { Tooltip, TooltipGroup } from "../tooltip";

export default function TooltipPlacementPreview() {
  return (
    <div className="flex w-full flex-col gap-2 overflow-auto p-2">
      <TooltipGroup>
        <Tooltip content="Top" placement="top">
          <Button variant="outline" size="sm">
            Top
          </Button>
        </Tooltip>
        <Tooltip content="Right" placement="right">
          <Button variant="outline" size="sm">
            Right
          </Button>
        </Tooltip>
        <Tooltip content="Bottom" placement="bottom">
          <Button variant="outline" size="sm">
            Bottom
          </Button>
        </Tooltip>
        <Tooltip content="Left" placement="left">
          <Button variant="outline" size="sm">
            Left
          </Button>
        </Tooltip>
        <Tooltip content="Top Start" placement="top-start">
          <Button variant="outline" size="sm">
            Top Start
          </Button>
        </Tooltip>
        <Tooltip content="Top End" placement="top-end">
          <Button variant="outline" size="sm">
            Top End
          </Button>
        </Tooltip>
        <Tooltip content="Right Start" placement="right-start">
          <Button variant="outline" size="sm">
            Right Start
          </Button>
        </Tooltip>
        <Tooltip content="Right End" placement="right-end">
          <Button variant="outline" size="sm">
            Right End
          </Button>
        </Tooltip>
        <Tooltip content="Bottom Start" placement="bottom-start">
          <Button variant="outline" size="sm">
            Bottom Start
          </Button>
        </Tooltip>
        <Tooltip content="Bottom End" placement="bottom-end">
          <Button variant="outline" size="sm">
            Bottom End
          </Button>
        </Tooltip>
        <Tooltip content="Left Start" placement="left-start">
          <Button variant="outline" size="sm">
            Left Start
          </Button>
        </Tooltip>
        <Tooltip content="Left End" placement="left-end">
          <Button variant="outline" size="sm">
            Left End
          </Button>
        </Tooltip>
      </TooltipGroup>
    </div>
  );
}
