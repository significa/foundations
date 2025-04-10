import { Input, InputGroup, InputPrefix, InputSuffix } from "../input";

export default function InputTextAddons() {
  return (
    <div className="w-90">
      <InputGroup>
        <InputPrefix>https://</InputPrefix>
        <Input placeholder="subdomain" />
        <InputSuffix>.significa.co</InputSuffix>
      </InputGroup>
    </div>
  );
}
