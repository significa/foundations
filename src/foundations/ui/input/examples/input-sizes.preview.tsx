import { Input } from '@/foundations/ui/input/input';

export default function InputSizes() {
  return (
    <div className="w-90 space-y-4">
      <Input.Group>
        <Input size="xs" placeholder="Search something" />
        <Input.Addon>Extra-small</Input.Addon>
      </Input.Group>
      <Input.Group>
        <Input size="sm" placeholder="Search something" />
        <Input.Addon>Small</Input.Addon>
      </Input.Group>
      <Input.Group>
        <Input size="md" placeholder="Search something" />
        <Input.Addon>Medium</Input.Addon>
      </Input.Group>
      <Input.Group>
        <Input size="lg" placeholder="Search something" />
        <Input.Addon>Large</Input.Addon>
      </Input.Group>
    </div>
  );
}
