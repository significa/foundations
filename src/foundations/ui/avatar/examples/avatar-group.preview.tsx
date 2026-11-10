import { Avatar } from "#/foundations/ui/avatar/avatar.tsx";

export default function AvatarGroupPreview() {
  return (
    <Avatar.Group>
      <Avatar label="Pedro Brandão">
        <Avatar.Image src="https://github.com/pdrbrnd.png" />
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
      <Avatar label="Pedro Brandão">
        <Avatar.Image src="https://github.com/pdrbrnd.png" />
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
      <Avatar label="Pedro Brandão">
        <Avatar.Image src="https://github.com/pdrbrnd.png" />
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
    </Avatar.Group>
  );
}
