import { Button } from "@/foundations/ui/button/button";
import {
  Dropdown,
  DropdownItem,
  DropdownItems,
  DropdownSearchInput,
  DropdownTrigger,
} from "@/foundations/ui/dropdown/dropdown";

export default function DropdownSearchPreview() {
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="outline">Search Items</Button>
      </DropdownTrigger>
      <DropdownItems>
        <DropdownSearchInput placeholder="Search items..." />
        <DropdownItem>Apple</DropdownItem>
        <DropdownItem>Banana</DropdownItem>
        <DropdownItem>Orange</DropdownItem>
        <DropdownItem>Pineapple</DropdownItem>
        <DropdownItem>Strawberry</DropdownItem>
      </DropdownItems>
    </Dropdown>
  );
}
