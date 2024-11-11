import { RadioGroup, RadioGroupItem } from '@/foundations/components/RadioGroup';

export function RadioGroupDisabled() {
  return (
    <RadioGroup defaultValue="d-rg1" className="text-sm text-foreground">
      <div className="flex gap-2 items-center">
        <RadioGroupItem id="d-rg1" value="d-rg1" className="peer" />
        <label htmlFor="d-rg1" className="peer-data-[disabled]:opacity-60">
          Boiled
        </label>
      </div>
      <div className="flex gap-2 items-center">
        <RadioGroupItem id="d-rg2" value="d-rg2" className="peer" disabled />
        <label htmlFor="d-rg2" className="peer-data-[disabled]:opacity-60">
          Fried
        </label>
      </div>
      <div className="flex gap-2 items-center">
        <RadioGroupItem id="d-rg3" value="d-rg3" className="peer" />
        <label htmlFor="d-rg3" className="peer-data-[disabled]:opacity-60">
          Scrambled
        </label>
      </div>
    </RadioGroup>
  );
}
