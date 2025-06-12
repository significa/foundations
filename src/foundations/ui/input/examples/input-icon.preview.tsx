import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { Input, InputGroup, InputPrefix } from "../input";

export default function InputIcon() {
  return (
    <div className="w-90">
      <InputGroup>
        <InputPrefix>
          <MagnifyingGlass />
        </InputPrefix>
        <Input placeholder="Search something" />
      </InputGroup>
    </div>
  );
}
