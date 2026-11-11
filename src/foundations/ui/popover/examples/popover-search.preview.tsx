import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "#/foundations/ui/button/button.tsx";
import { Popover } from "#/foundations/ui/popover/popover.tsx";

export default function PopoverSearchPreview() {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="outline">Search</Button>
      </Popover.Trigger>
      <Popover.Content className="p-0">
        <Popover.Search>
          <MagnifyingGlassIcon weight="bold" />
          <Popover.SearchInput placeholder="Search items..." aria-label="Search items" />
        </Popover.Search>
        <div className="p-1">Items would go here</div>
      </Popover.Content>
    </Popover>
  );
}
