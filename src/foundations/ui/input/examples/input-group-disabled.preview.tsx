import { LockIcon } from "@phosphor-icons/react/dist/ssr";

import { Input } from "@/foundations/ui/input/input";

export default function InputGroupDisabled() {
  return (
    <div className="w-90">
      <Input.Group>
        <Input.Addon>
          <LockIcon />
        </Input.Addon>
        <Input placeholder="Locked" disabled />
        <Input.Addon>.com</Input.Addon>
      </Input.Group>
    </div>
  );
}
