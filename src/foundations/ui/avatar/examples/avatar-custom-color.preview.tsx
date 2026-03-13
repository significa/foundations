import { Avatar, AvatarFallback } from "@/foundations/ui/avatar/avatar";

export default function AvatarCustomColorPreview() {
  return (
    <Avatar className="bg-emerald-500/20">
      <AvatarFallback>Pedro Brandão</AvatarFallback>
    </Avatar>
  );
}
