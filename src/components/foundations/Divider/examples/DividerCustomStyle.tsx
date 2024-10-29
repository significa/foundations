import { Divider } from '../Divider';

export function DividerCustomStyle() {
  return (
    <div className="max-w-md flex flex-col gap-2">
      <div>Content above</div>
      <Divider className="bg-accent" />
      <div>Content below</div>
    </div>
  );
}
