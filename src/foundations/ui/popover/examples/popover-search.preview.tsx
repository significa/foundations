import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "#/foundations/ui/button/button.tsx";
import { Input } from "#/foundations/ui/input/input.tsx";
import { Popover } from "#/foundations/ui/popover/popover.tsx";

export default function PopoverSearchPreview() {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="outline">Search</Button>
      </Popover.Trigger>
      <Popover.Content className="p-0">
        <Input.Group variant="flush">
          <Input.Addon>
            <MagnifyingGlassIcon weight="bold" />
          </Input.Addon>
          <Input placeholder="Search items..." aria-label="Search items" />
        </Input.Group>
        <div className="p-1">Items would go here</div>
      </Popover.Content>
    </Popover>
  );
}
