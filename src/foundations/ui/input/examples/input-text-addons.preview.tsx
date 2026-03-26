import { Input } from '@/foundations/ui/input/input';

export default function InputTextAddons() {
  return (
    <div className="w-90">
      <Input.Group>
        <Input.Addon>https://</Input.Addon>
        <Input placeholder="subdomain" />
        <Input.Addon>.significa.co</Input.Addon>
      </Input.Group>
    </div>
  );
}
