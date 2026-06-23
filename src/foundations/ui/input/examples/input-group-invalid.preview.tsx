import { WarningIcon } from "@phosphor-icons/react/dist/ssr";

import { Input } from "@/foundations/ui/input/input";

export default function InputGroupInvalid() {
  return (
    <div className="w-90">
      <Input.Group>
        <Input.Addon>
          <WarningIcon />
        </Input.Addon>
        <Input placeholder="Type something..." defaultValue="not-an-email" invalid />
      </Input.Group>
    </div>
  );
}
