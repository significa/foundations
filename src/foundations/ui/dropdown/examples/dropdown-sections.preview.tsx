import { Button } from "@/foundations/ui/button/button";
import {
  Dropdown,
  DropdownHeading,
  DropdownItem,
  DropdownItems,
  DropdownSection,
  DropdownTrigger,
} from "@/foundations/ui/dropdown/dropdown";

export default function DropdownSectionsPreview() {
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="outline">Open Menu</Button>
      </DropdownTrigger>
      <DropdownItems>
        <DropdownSection>
          <DropdownHeading>Actions</DropdownHeading>
          <DropdownItem>Edit</DropdownItem>
          <DropdownItem>Duplicate</DropdownItem>
        </DropdownSection>
        <DropdownSection>
          <DropdownHeading>Danger Zone</DropdownHeading>
          <DropdownItem>Archive</DropdownItem>
          <DropdownItem disabled>Delete</DropdownItem>
        </DropdownSection>
      </DropdownItems>
    </Dropdown>
  );
}
