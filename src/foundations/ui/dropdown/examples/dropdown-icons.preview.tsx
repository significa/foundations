import { Button } from "@/foundations/ui/button/button";
import {
  Dropdown,
  DropdownItem,
  DropdownItems,
  DropdownTrigger,
} from "@/foundations/ui/dropdown/dropdown";
import {
  Copy,
  PencilSimple,
  Archive,
  Trash,
} from "@phosphor-icons/react/dist/ssr";

export default function DropdownIconsPreview() {
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="outline">Menu with Icons</Button>
      </DropdownTrigger>
      <DropdownItems>
        <DropdownItem>
          <PencilSimple />
          Edit
        </DropdownItem>
        <DropdownItem>
          <Copy />
          Duplicate
        </DropdownItem>
        <DropdownItem>
          <Archive />
          Archive
        </DropdownItem>
        <DropdownItem disabled>
          <Trash />
          Delete
        </DropdownItem>
      </DropdownItems>
    </Dropdown>
  );
}
