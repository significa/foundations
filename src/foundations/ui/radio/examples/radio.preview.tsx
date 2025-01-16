import { Radio } from "../radio";
import { Label } from "../../label/label";

export default function RadioPreview() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Radio id="option1" name="options" />
          <Label htmlFor="option1">Option 1</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio id="option2" name="options" />
          <Label htmlFor="option2">Option 2</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio id="option3" name="options" />
          <Label htmlFor="option3">Option 3</Label>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Radio id="disabled" disabled />
          <Label htmlFor="disabled">Disabled</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio id="checked-disabled" disabled defaultChecked />
          <Label htmlFor="checked-disabled">Checked & Disabled</Label>
        </div>
      </div>
    </div>
  );
}
