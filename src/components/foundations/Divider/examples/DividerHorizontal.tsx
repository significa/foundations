import { Divider } from '../Divider';

export function DividerHorizontal() {
  return (
    <div className="max-w-md">
      <div>Area 1</div>
      <Divider />
      <div>Area 2</div>
      <Divider decorative />
      <div>Area 3</div>
    </div>
  );
}
