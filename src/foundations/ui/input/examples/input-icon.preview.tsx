import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr';
import { Input } from '@/foundations/ui/input/input';

export default function InputIcon() {
  return (
    <div className="w-90 space-y-4">
      <Input.Group>
        <Input.Addon>
          <MagnifyingGlassIcon />
        </Input.Addon>
        <Input placeholder="Search something" />
      </Input.Group>
      <Input.Group>
        <Input.Addon>
          <MagnifyingGlassIcon />
        </Input.Addon>
        <Input variant="minimal" placeholder="Search something" />
      </Input.Group>
    </div>
  );
}
