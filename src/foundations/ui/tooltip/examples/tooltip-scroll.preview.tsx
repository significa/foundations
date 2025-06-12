import { Tooltip } from "../tooltip";

export default function TooltipScrollPreview() {
  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="flex h-[200vh] items-center justify-center">
        <Tooltip content="Tooltip content" open>
          Scroll to see the tooltip reposition itself
        </Tooltip>
      </div>
    </div>
  );
}
