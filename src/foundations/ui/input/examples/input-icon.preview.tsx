import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { Input, InputGroup, InputPrefix } from "@/foundations/ui/input/input";

export default function InputIcon() {
  return (
    <div className="w-90">
      <InputGroup>
        <InputPrefix>
          <MagnifyingGlassIcon />
        </InputPrefix>
        <Input placeholder="Search something" />
      </InputGroup>
    </div>
  );
}
