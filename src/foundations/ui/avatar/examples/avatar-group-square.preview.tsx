import { Avatar } from "#/foundations/ui/avatar/avatar.tsx";

export default function AvatarGroupSquarePreview() {
  return (
    <Avatar.Group>
      <Avatar variant="square" label="Pedro Brandão">
        <Avatar.Image src="https://github.com/pdrbrnd.png" />
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
      <Avatar variant="square" label="Pedro Brandão">
        <Avatar.Image src="https://github.com/pdrbrnd.png" />
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
      <Avatar variant="square" label="Pedro Brandão">
        <Avatar.Image src="https://github.com/pdrbrnd.png" />
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
    </Avatar.Group>
  );
}
