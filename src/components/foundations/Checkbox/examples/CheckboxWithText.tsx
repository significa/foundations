import { Checkbox } from 'components/foundations/Checkbox';

export function CheckboxWithText() {
  return (
    <div className="flex items-center">
      <Checkbox id="c-1" />
      <label htmlFor="c-1" className="text-sm font-medium pl-2">
        Accept terms and conditions
      </label>
    </div>
  );
}
