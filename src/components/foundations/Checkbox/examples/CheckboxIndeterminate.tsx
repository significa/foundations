import { Checkbox } from 'components/foundations/Checkbox';

export function CheckboxIndeterminate() {
  return (
    <div className="flex items-center">
      <Checkbox id="c-3" indeterminate disabled className="peer" />
      <label
        htmlFor="c-3"
        className="text-sm font-medium pl-2 leading-none peer-data-[disabled]:cursor-not-allowed peer-data-[disabled]:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  );
}
