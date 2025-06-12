import { Divider } from "../divider";

export default function DividerVerticalPreview() {
  return (
    <nav className="flex items-center gap-2">
      <p>Home</p>
      <Divider orientation="vertical" />
      <p>About</p>
    </nav>
  );
}
