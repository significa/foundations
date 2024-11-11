import { Checkbox } from '@/foundations/components/Checkbox';

export function CheckboxDisabled() {
  return (
    <div className="flex items-center">
      <Checkbox id="c-2" className="peer" disabled />
      <label
        htmlFor="c-2"
        className="text-sm font-medium pl-2 peer-data-[disabled]:cursor-not-allowed peer-data-[disabled]:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  );
}
