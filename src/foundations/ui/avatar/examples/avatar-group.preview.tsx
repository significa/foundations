import { Avatar } from '@/foundations/ui/avatar/avatar';

export default function AvatarGroupPreview() {
  return (
    <Avatar.Group>
      <Avatar variant="square" size="md" className="z-2">
        <Avatar.Image src="https://github.com/pdrbrnd.png" />
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
      <Avatar size="2xl" variant="square" className="z-1">
        <Avatar.Image src="https://github.com/pdrbrnd.png" />
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
      <Avatar size="md" variant="square">
        <Avatar.Image src="https://github.com/pdrbrnd.png" />
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
    </Avatar.Group>
  );
}
