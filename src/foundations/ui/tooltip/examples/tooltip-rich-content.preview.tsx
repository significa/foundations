import { Avatar } from '@/foundations/ui/avatar/avatar';
import { Tooltip } from '@/foundations/ui/tooltip/tooltip';

export default function TooltipRichContentPreview() {
  return (
    <Tooltip>
      <Tooltip.Trigger>
        <span>Hover to see rich content</span>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <div className="flex items-center gap-1.5">
          <Avatar
            variant="square"
            size="sm"
            className="-ml-1.5 backdrop-blur-none"
          >
            <Avatar.Image src="https://github.com/pdrbrnd.png" />
            <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col">
            <span>Pedro Brandão</span>
            <span className="text-foreground-secondary">Significa</span>
          </div>
        </div>
      </Tooltip.Content>
    </Tooltip>
  );
}
