import { Input } from "../input";

export default function InputInvalid() {
  return (
    <div className="w-90">
      <Input placeholder="Type something..." defaultValue="Pedro" invalid />
    </div>
  );
}
