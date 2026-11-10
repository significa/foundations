import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "#/foundations/ui/button/button.tsx";
import { Input } from "#/foundations/ui/input/input.tsx";
import { Popover } from "#/foundations/ui/popover/popover.tsx";

export default function PopoverEmptyPreview() {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="outline">Empty State</Button>
      </Popover.Trigger>
      <Popover.Content className="p-0">
        <Input.Group size="sm" className="m-2 w-auto">
          <Input.Addon>
            <MagnifyingGlassIcon />
          </Input.Addon>
          <Input placeholder="Search items..." aria-label="Search items" />
        </Input.Group>
        <Popover.Empty>No items found</Popover.Empty>
      </Popover.Content>
    </Popover>
  );
}
