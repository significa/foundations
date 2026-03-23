import { Avatar } from '@/foundations/ui/avatar/avatar';

export default function AvatarCustomColorPreview() {
  return (
    <Avatar className="bg-emerald-500/20">
      <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
    </Avatar>
  );
}
