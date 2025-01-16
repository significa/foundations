import { Button } from "@/foundations/ui/button/button";
import {
  Dropdown,
  DropdownEmpty,
  DropdownItems,
  DropdownSearchInput,
  DropdownTrigger,
} from "@/foundations/ui/dropdown/dropdown";

export default function DropdownEmptyPreview() {
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="outline">Empty Menu</Button>
      </DropdownTrigger>
      <DropdownItems>
        <DropdownSearchInput placeholder="Search items..." />
        <DropdownEmpty>No items found.</DropdownEmpty>
      </DropdownItems>
    </Dropdown>
  );
}
