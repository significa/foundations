import { Avatar } from '@/foundations/ui/avatar/avatar';

export default function AvatarPreview() {
  return (
    <Avatar>
      <Avatar.Image src="https://github.com/pdrbrnd.png" />
      <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
    </Avatar>
  );
}
