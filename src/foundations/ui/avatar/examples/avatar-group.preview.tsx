import { Avatar } from '@/foundations/ui/avatar/avatar';

export default function AvatarGroupPreview() {
  return (
    <Avatar.Group>
      <Avatar>
        <Avatar.Image src="https://github.com/pdrbrnd.png" />
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
      <Avatar size="2xl">
        <Avatar.Image src="https://github.com/pdrbrnd.png" />
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
      <Avatar size="md">
        <Avatar.Image src="https://github.com/pdrbrnd.png" />
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
    </Avatar.Group>
  );
}
