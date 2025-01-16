import { Select } from "../select";

export default function SelectPreview() {
  return (
    <div className="w-90">
      <Select>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </Select>
    </div>
  );
}
