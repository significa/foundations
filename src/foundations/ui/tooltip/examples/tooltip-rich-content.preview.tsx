import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/foundations/ui/avatar/avatar";
import { Tooltip } from "@/foundations/ui/tooltip/tooltip";

export default function TooltipRichContentPreview() {
  return (
    <Tooltip
      content={
        <div className="flex items-center gap-1.5">
          <Avatar
            variant="square"
            size="sm"
            className="-ml-1.5 backdrop-blur-none"
          >
            <AvatarImage src="https://github.com/pdrbrnd.png" />
            <AvatarFallback>Pedro Brandão</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span>Pedro Brandão</span>
            <span className="text-foreground-secondary">Significa</span>
          </div>
        </div>
      }
    >
      <span>Hover to see rich content</span>
    </Tooltip>
  );
}
