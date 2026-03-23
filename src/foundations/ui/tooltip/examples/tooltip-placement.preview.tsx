import { Button } from '@/foundations/ui/button/button';
import { Tooltip } from '@/foundations/ui/tooltip/tooltip';

export default function TooltipPlacementPreview() {
  return (
    <div className="flex w-full flex-col gap-2 overflow-auto p-2">
      <Tooltip.Group>
        <Tooltip placement="top">
          <Tooltip.Trigger asChild>
            <Button variant="outline" size="sm">
              Top
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Top</Tooltip.Content>
        </Tooltip>
        <Tooltip placement="right">
          <Tooltip.Trigger asChild>
            <Button variant="outline" size="sm">
              Right
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Right</Tooltip.Content>
        </Tooltip>
        <Tooltip placement="bottom">
          <Tooltip.Trigger asChild>
            <Button variant="outline" size="sm">
              Bottom
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Bottom</Tooltip.Content>
        </Tooltip>
        <Tooltip placement="left">
          <Tooltip.Trigger asChild>
            <Button variant="outline" size="sm">
              Left
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Left</Tooltip.Content>
        </Tooltip>
        <Tooltip placement="top-start">
          <Tooltip.Trigger asChild>
            <Button variant="outline" size="sm">
              Top Start
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Top Start</Tooltip.Content>
        </Tooltip>
        <Tooltip placement="top-end">
          <Tooltip.Trigger asChild>
            <Button variant="outline" size="sm">
              Top End
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Top End</Tooltip.Content>
        </Tooltip>
        <Tooltip placement="right-start">
          <Tooltip.Trigger asChild>
            <Button variant="outline" size="sm">
              Right Start
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Right Start</Tooltip.Content>
        </Tooltip>
        <Tooltip placement="right-end">
          <Tooltip.Trigger asChild>
            <Button variant="outline" size="sm">
              Right End
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Right End</Tooltip.Content>
        </Tooltip>
        <Tooltip placement="bottom-start">
          <Tooltip.Trigger asChild>
            <Button variant="outline" size="sm">
              Bottom Start
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Bottom Start</Tooltip.Content>
        </Tooltip>
        <Tooltip placement="bottom-end">
          <Tooltip.Trigger asChild>
            <Button variant="outline" size="sm">
              Bottom End
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Bottom End</Tooltip.Content>
        </Tooltip>
        <Tooltip placement="left-start">
          <Tooltip.Trigger asChild>
            <Button variant="outline" size="sm">
              Left Start
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Left Start</Tooltip.Content>
        </Tooltip>
        <Tooltip placement="left-end">
          <Tooltip.Trigger asChild>
            <Button variant="outline" size="sm">
              Left End
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Left End</Tooltip.Content>
        </Tooltip>
      </Tooltip.Group>
    </div>
  );
}
