import { Checkbox } from '@/foundations/ui/checkbox/checkbox';

const labelClass = 'font-medium text-base text-foreground';

export default function CheckboxAllStatesPreview() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="unchecked" />
        <label className={labelClass} htmlFor="unchecked">
          Unchecked
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="checked" checked onChange={() => {}} />
        <label className={labelClass} htmlFor="checked">
          Checked
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="indeterminate" indeterminate />
        <label className={labelClass} htmlFor="indeterminate">
          Indeterminate
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="disabled" disabled />
        <label className={labelClass} htmlFor="disabled">
          Disabled
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-checked" checked disabled />
        <label className={labelClass} htmlFor="disabled-checked">
          Checked Disabled
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-indeterminate" indeterminate disabled />
        <label className={labelClass} htmlFor="disabled-indeterminate">
          Indeterminate Disabled
        </label>
      </div>
    </div>
  );
}
