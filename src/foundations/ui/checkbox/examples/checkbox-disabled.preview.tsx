import { Checkbox } from "@/foundations/ui/checkbox/checkbox";

export default function CheckboxDisabledPreview() {
  return (
    <div className="flex flex-col space-y-4">
      <Checkbox disabled />
      <Checkbox checked disabled />
    </div>
  );
}
