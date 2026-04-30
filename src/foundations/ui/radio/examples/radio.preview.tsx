import { Radio } from '@/foundations/ui/radio/radio';

const labelClass = 'font-medium text-base text-foreground';

export default function RadioPreview() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Radio id="option1" name="options" />
          <label className={labelClass} htmlFor="option1">
            Option 1
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Radio id="option2" name="options" />
          <label className={labelClass} htmlFor="option2">
            Option 2
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Radio id="option3" name="options" />
          <label className={labelClass} htmlFor="option3">
            Option 3
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Radio id="disabled" disabled />
          <label className={labelClass} htmlFor="disabled">
            Disabled
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Radio id="checked-disabled" disabled defaultChecked />
          <label className={labelClass} htmlFor="checked-disabled">
            Checked & Disabled
          </label>
        </div>
      </div>
    </div>
  );
}
