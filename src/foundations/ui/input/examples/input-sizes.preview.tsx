import { Input } from '@/foundations/ui/input/input';

export default function InputSizes() {
  return (
    <div className="w-90 space-y-4">
      <Input.Group size="xs">
        <Input placeholder="Search something" />
        <Input.Addon>Extra-small</Input.Addon>
      </Input.Group>
      <Input.Group size="sm">
        <Input placeholder="Search something" />
        <Input.Addon>Small</Input.Addon>
      </Input.Group>
      <Input.Group size="md">
        <Input placeholder="Search something" />
        <Input.Addon>Medium</Input.Addon>
      </Input.Group>
      <Input.Group size="lg">
        <Input placeholder="Search something" />
        <Input.Addon>Large</Input.Addon>
      </Input.Group>
    </div>
  );
}
