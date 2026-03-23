import { ClipboardIcon, ScissorsIcon } from '@phosphor-icons/react/dist/ssr';

import { Button } from '@/foundations/ui/button/button';
import { Tooltip } from '@/foundations/ui/tooltip/tooltip';

export default function TooltipGroupPreview() {
  return (
    <div className="flex items-center gap-2">
      <Tooltip.Group>
        <Tooltip>
          <Tooltip.Trigger asChild>
            <Button variant="outline" size="sm" square>
              <ClipboardIcon />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Copy</Tooltip.Content>
        </Tooltip>
        <Tooltip>
          <Tooltip.Trigger asChild>
            <Button variant="outline" size="sm" square>
              <ScissorsIcon />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Cut</Tooltip.Content>
        </Tooltip>
      </Tooltip.Group>
    </div>
  );
}
