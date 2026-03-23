import { UserIcon } from '@phosphor-icons/react/dist/ssr';

import { Select } from '@/foundations/ui/select/select';

export default function SelectPrefixPreview() {
  return (
    <div className="w-90">
      <Select.Group>
        <Select.Prefix>
          <UserIcon />
        </Select.Prefix>
        <Select>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </Select>
      </Select.Group>
    </div>
  );
}
