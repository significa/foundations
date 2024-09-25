import { Switch } from 'components/foundations/Switch';

export function SwitchWithLabel() {
  return (
    <div className="flex items-center">
      <Switch id="s-01" defaultChecked={true} />
      <label htmlFor="s-01" className="text-md text-primary font-medium ml-3">
        Allow push notifications
      </label>
    </div>
  );
}
