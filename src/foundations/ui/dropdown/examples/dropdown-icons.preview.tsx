import {
  ArchiveIcon,
  CopyIcon,
  PencilSimpleIcon,
  TrashIcon,
} from '@phosphor-icons/react/dist/ssr';

import { Button } from '@/foundations/ui/button/button';
import { Dropdown } from '@/foundations/ui/dropdown/dropdown';

export default function DropdownIconsPreview() {
  return (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="outline">Menu with Icons</Button>
      </Dropdown.Trigger>
      <Dropdown.Items>
        <Dropdown.Item>
          <PencilSimpleIcon />
          Edit
        </Dropdown.Item>
        <Dropdown.Item>
          <CopyIcon />
          Duplicate
        </Dropdown.Item>
        <Dropdown.Item>
          <ArchiveIcon />
          Archive
        </Dropdown.Item>
        <Dropdown.Item disabled>
          <TrashIcon />
          Delete
        </Dropdown.Item>
      </Dropdown.Items>
    </Dropdown>
  );
}
