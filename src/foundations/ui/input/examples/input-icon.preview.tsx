import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr';

import { Input } from '@/foundations/ui/input/input';

export default function InputIcon() {
  return (
    <div className="w-90">
      <Input.Group>
        <Input.Prefix>
          <MagnifyingGlassIcon />
        </Input.Prefix>
        <Input placeholder="Search something" />
      </Input.Group>
    </div>
  );
}
