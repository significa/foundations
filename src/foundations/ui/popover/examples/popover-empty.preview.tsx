import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "#/foundations/ui/button/button.tsx";
import { Popover } from "#/foundations/ui/popover/popover.tsx";

export default function PopoverEmptyPreview() {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="outline">Empty State</Button>
      </Popover.Trigger>
      <Popover.Content className="p-0">
        <Popover.Search>
          <MagnifyingGlassIcon weight="bold" />
          <Popover.SearchInput placeholder="Search items..." aria-label="Search items" />
        </Popover.Search>
        <Popover.Empty>No items found</Popover.Empty>
      </Popover.Content>
    </Popover>
  );
}
