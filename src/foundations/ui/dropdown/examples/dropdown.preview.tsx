import { Button } from "@/foundations/ui/button/button";
import {
  Dropdown,
  DropdownItem,
  DropdownItems,
  DropdownTrigger,
} from "@/foundations/ui/dropdown/dropdown";

export default function DropdownPreview() {
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="outline">Open Menu</Button>
      </DropdownTrigger>
      <DropdownItems>
        <DropdownItem>Edit</DropdownItem>
        <DropdownItem>Duplicate</DropdownItem>
        <DropdownItem>Archive</DropdownItem>
        <DropdownItem disabled>Delete</DropdownItem>
      </DropdownItems>
    </Dropdown>
  );
}
