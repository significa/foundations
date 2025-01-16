import { User } from "@phosphor-icons/react/dist/ssr";
import { Select, SelectGroup, SelectPrefix } from "../select";

export default function SelectPrefixPreview() {
  return (
    <div className="w-90">
      <SelectGroup>
        <SelectPrefix>
          <User />
        </SelectPrefix>
        <Select>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </Select>
      </SelectGroup>
    </div>
  );
}
