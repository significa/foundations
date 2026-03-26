import { Select } from '@/foundations/ui/select/select';

export default function SelectSizes() {
  return (
    <div className="w-90 space-y-4">
      <Select size="xs">
        <option value="1">Extra-small</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </Select>

      <Select size="sm">
        <option value="1">Small</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </Select>

      <Select size="md">
        <option value="1">Medium</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </Select>

      <Select size="lg">
        <option value="1">Large</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </Select>
    </div>
  );
}
