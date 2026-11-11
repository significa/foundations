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
        <Input.Group className="rounded-none border-x-0 border-t-0 shadow-none hover:border-border [:focus-visible,:has(:focus-visible)]:border-border [:focus-visible,:has(:focus-visible)]:ring-0">
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
