import { Button } from "@/foundations/ui/button/button";
import {
  Dropdown,
  DropdownItem,
  DropdownItems,
  DropdownTrigger,
} from "@/foundations/ui/dropdown/dropdown";

export default function DropdownCustomItemsPreview() {
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="outline">Custom Items</Button>
      </DropdownTrigger>
      <DropdownItems>
        <DropdownItem className="flex flex-col items-start gap-1 text-left">
          <div className="font-medium">Custom Item 1</div>
          <div className="text-muted-foreground text-sm">
            This is a description for the first item
          </div>
        </DropdownItem>
        <DropdownItem className="flex flex-col items-start gap-1 text-left">
          <div className="font-medium">Custom Item 2</div>
          <div className="text-muted-foreground text-sm">
            This is a description for the second item
          </div>
        </DropdownItem>
        <DropdownItem className="flex items-center justify-between">
          <span>Custom Item 3</span>
          <span className="text-muted-foreground text-sm">⌘K</span>
        </DropdownItem>
      </DropdownItems>
    </Dropdown>
  );
}
