import { Avatar } from "#/foundations/ui/avatar/avatar.tsx";

export default function AvatarPreview() {
  return (
    <Avatar label="Pedro Brandão">
      <Avatar.Image src="https://github.com/pdrbrnd.png" />
      <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
    </Avatar>
  );
}
