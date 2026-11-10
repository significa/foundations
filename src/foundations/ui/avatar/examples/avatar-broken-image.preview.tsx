import { Avatar } from "#/foundations/ui/avatar/avatar.tsx";

export default function AvatarBrokenImagePreview() {
  return (
    <Avatar>
      <Avatar.Image src="broken-image-url" />
      <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
    </Avatar>
  );
}
