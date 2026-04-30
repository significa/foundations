import { Avatar } from '@/foundations/ui/avatar/avatar';

export default function AvatarGroupSquarePreview() {
  return (
    <Avatar.Group>
      <Avatar variant="square">
        <Avatar.Image src="https://github.com/pdrbrnd.png" />
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
      <Avatar variant="square" size="2xl">
        <Avatar.Image src="https://github.com/pdrbrnd.png" />
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
      <Avatar variant="square" size="md">
        <Avatar.Image src="https://github.com/pdrbrnd.png" />
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
    </Avatar.Group>
  );
}
