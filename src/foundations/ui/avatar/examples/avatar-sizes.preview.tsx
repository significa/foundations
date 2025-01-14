import { Avatar, AvatarFallback } from "../avatar";

export default function AvatarSizesPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Avatar size="2xs">
        <AvatarFallback>Pedro Brandão</AvatarFallback>
      </Avatar>
      <Avatar size="xs">
        <AvatarFallback>Pedro Brandão</AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarFallback>Pedro Brandão</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarFallback>Pedro Brandão</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>Pedro Brandão</AvatarFallback>
      </Avatar>
      <Avatar size="xl">
        <AvatarFallback>Pedro Brandão</AvatarFallback>
      </Avatar>
      <Avatar size="2xl">
        <AvatarFallback>Pedro Brandão</AvatarFallback>
      </Avatar>
      <Avatar size="3xl">
        <AvatarFallback>Pedro Brandão</AvatarFallback>
      </Avatar>
    </div>
  );
}
