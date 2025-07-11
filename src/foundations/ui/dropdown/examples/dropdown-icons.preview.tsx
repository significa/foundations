import { Button } from "@/foundations/ui/button/button";
import {
  Dropdown,
  DropdownItem,
  DropdownItems,
  DropdownTrigger,
} from "@/foundations/ui/dropdown/dropdown";
import {
  CopyIcon,
  PencilSimpleIcon,
  ArchiveIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr";

export default function DropdownIconsPreview() {
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="outline">Menu with Icons</Button>
      </DropdownTrigger>
      <DropdownItems>
        <DropdownItem>
          <PencilSimpleIcon />
          Edit
        </DropdownItem>
        <DropdownItem>
          <CopyIcon />
          Duplicate
        </DropdownItem>
        <DropdownItem>
          <ArchiveIcon />
          Archive
        </DropdownItem>
        <DropdownItem disabled>
          <TrashIcon />
          Delete
        </DropdownItem>
      </DropdownItems>
    </Dropdown>
  );
}
