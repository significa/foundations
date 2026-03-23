import { Avatar } from '@/foundations/ui/avatar/avatar';

export default function AvatarSizesPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Avatar size="2xs">
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
      <Avatar size="xs">
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
      <Avatar size="sm">
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
      <Avatar size="md">
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
      <Avatar size="lg">
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
      <Avatar size="xl">
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
      <Avatar size="2xl">
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
      <Avatar size="3xl">
        <Avatar.Fallback>Pedro Brandão</Avatar.Fallback>
      </Avatar>
    </div>
  );
}
