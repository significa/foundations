import { Divider } from "#/foundations/ui/divider/divider.tsx";

export default function DividerVerticalPreview() {
  return (
    <nav className="flex items-center gap-2">
      <p>Home</p>
      <Divider orientation="vertical" />
      <p>About</p>
    </nav>
  );
}
