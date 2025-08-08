"use client";

import { Label } from "@/foundations/ui/label/label";
import { Checkbox } from "@/foundations/ui/checkbox/checkbox";

export default function CheckboxAllStatesPreview() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="unchecked" />
        <Label htmlFor="unchecked">Unchecked</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="checked" checked onChange={() => {}} />
        <Label htmlFor="checked">Checked</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="indeterminate" indeterminate />
        <Label htmlFor="indeterminate">Indeterminate</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="disabled" disabled />
        <Label htmlFor="disabled">Disabled</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-checked" checked disabled />
        <Label htmlFor="disabled-checked">Checked Disabled</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-indeterminate" indeterminate disabled />
        <Label htmlFor="disabled-indeterminate">Indeterminate Disabled</Label>
      </div>
    </div>
  );
}
