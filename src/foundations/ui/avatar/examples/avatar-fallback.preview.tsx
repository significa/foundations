import { Avatar } from '@/foundations/ui/avatar/avatar';

export default function AvatarFallbackPreview() {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Full name */}
      <Avatar>
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
      {/* One word */}
      <Avatar>
        <Avatar.Fallback>Significa</Avatar.Fallback>
      </Avatar>
      {/* Initials */}
      <Avatar>
        <Avatar.Fallback>PB</Avatar.Fallback>
      </Avatar>
      {/* No fallback */}
      <Avatar>
        <Avatar.Fallback />
      </Avatar>
    </div>
  );
}
