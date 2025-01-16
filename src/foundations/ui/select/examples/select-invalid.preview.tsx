import { Select } from "../select";

export default function SelectInvalidPreview() {
  return (
    <div className="w-90">
      <Select invalid>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </Select>
    </div>
  );
}
