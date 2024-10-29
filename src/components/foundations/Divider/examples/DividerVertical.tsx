import { Divider } from '../Divider';

export function DividerVertical() {
  return (
    <div className="flex items-center gap-2 h-[30px]">
      <div>Content Left</div>
      <Divider orientation="vertical" />
      <div>Content Right</div>
    </div>
  );
}
