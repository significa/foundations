import { Avatar, AvatarFallback } from "@/foundations/ui/avatar/avatar";

export default function AvatarFallbackPreview() {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Full name */}
      <Avatar>
        <AvatarFallback>Pedro Brandão</AvatarFallback>
      </Avatar>
      {/* One word */}
      <Avatar>
        <AvatarFallback>Significa</AvatarFallback>
      </Avatar>
      {/* Initials */}
      <Avatar>
        <AvatarFallback>PB</AvatarFallback>
      </Avatar>
      {/* No fallback */}
      <Avatar>
        <AvatarFallback />
      </Avatar>
    </div>
  );
}
