import { Input } from '@/foundations/ui/input/input';

export default function InputTextAddons() {
  return (
    <div className="w-90">
      <Input.Group>
        <Input.Prefix>https://</Input.Prefix>
        <Input placeholder="subdomain" />
        <Input.Suffix>.significa.co</Input.Suffix>
      </Input.Group>
    </div>
  );
}
