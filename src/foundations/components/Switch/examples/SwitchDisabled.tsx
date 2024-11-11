import { Switch } from '@/foundations/components/Switch';

export function SwitchDisabled() {
  return (
    <div className="flex items-center">
      <Switch id="s-02" defaultChecked={true} disabled className="peer" />
      <label
        htmlFor="s-02"
        className="text-md text-foreground font-medium ml-3 peer-data-[disabled]:opacity-60"
      >
        Allow in-app notifications
      </label>
    </div>
  );
}
