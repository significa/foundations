import { ClipboardIcon, ScissorsIcon } from '@phosphor-icons/react/dist/ssr';
import { IconButton } from '@/foundations/ui/button/button';
import { Tooltip } from '@/foundations/ui/tooltip/tooltip';

export default function TooltipGroupPreview() {
  return (
    <div className="flex items-center gap-2">
      <Tooltip.Group>
        <Tooltip>
          <Tooltip.Trigger asChild>
            <IconButton variant="outline" size="sm" aria-label="Copy">
              <ClipboardIcon />
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Content>Copy</Tooltip.Content>
        </Tooltip>
        <Tooltip>
          <Tooltip.Trigger asChild>
            <IconButton variant="outline" size="sm" aria-label="Cut">
              <ScissorsIcon />
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Content>Cut</Tooltip.Content>
        </Tooltip>
      </Tooltip.Group>
    </div>
  );
}
